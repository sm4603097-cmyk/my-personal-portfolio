const DESTINATION = 'sm4603097@gmail.com';
const SUBJECT = 'Portfolio Contact Message';
const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'onboarding@resend.dev';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 3600;

const MAX_BODY_CHARS = 32768;
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;
const OPTION_MAX = 120;

const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/;

const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy':
    "default-src 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
  'strict-transport-security': 'max-age=63072000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), battery=(), autoplay=(), fullscreen=(self), display-capture=()',
  'cross-origin-opener-policy': 'same-origin',
};

interface KvStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface AssetsBinding {
  fetch(input: Request, init?: RequestInit): Promise<Response>;
}

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  CONTACT_RATE_LIMIT_KV?: KvStore;
  ASSETS: AssetsBinding;
}

interface ValidPayload {
  name: string;
  email: string;
  message: string;
  projectType: string;
  timeline: string;
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function clientIdentifier(request: Request): string {
  // Only trust the IP header injected by Cloudflare's edge. Client-supplied
  // forwarding headers (e.g. x-forwarded-for) are never used because they can
  // be spoofed; absence of cf-connecting-ip collapses callers into a single
  // shared bucket rather than trusting untrusted input.
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim() !== '') return cfIp.trim();
  return 'unknown';
}

function isJsonContentType(value: string): boolean {
  return value.split(';')[0].trim().toLowerCase() === 'application/json';
}

async function hashInput(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function readTrimmed(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null;
}

function validate(body: Record<string, unknown>):
  | { ok: true; data: ValidPayload }
  | { ok: false; reason: string } {
  const name = readTrimmed(body.name);
  if (!name || name.length > NAME_MAX) return { ok: false, reason: 'invalid_fields' };

  const email = readTrimmed(body.email);
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return { ok: false, reason: 'invalid_fields' };
  }

  const message = readTrimmed(body.message);
  if (!message || message.length > MESSAGE_MAX) return { ok: false, reason: 'invalid_fields' };

  const projectType = readTrimmed(body.projectType);
  if (!projectType || projectType.length > OPTION_MAX) {
    return { ok: false, reason: 'invalid_fields' };
  }

  const timeline = readTrimmed(body.timeline);
  if (!timeline || timeline.length > OPTION_MAX) return { ok: false, reason: 'invalid_fields' };

  return { ok: true, data: { name, email, message, projectType, timeline } };
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > MAX_BODY_CHARS) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!isJsonContentType(contentType)) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }
  const body = parsed as Record<string, unknown>;

  // Any non-empty honeypot value is a bot signal, regardless of JSON type. A
  // bot sending `"honeypot": 1` must not slip through to the email path.
  const honeypot = body.honeypot;
  if (honeypot !== undefined && honeypot !== null && `${honeypot}`.trim() !== '') {
    return json({ ok: true }, 200);
  }

  const id = clientIdentifier(request);
  const store = env.CONTACT_RATE_LIMIT_KV;
  let rateKey: string | null = null;

  if (store) {
    rateKey = `contact:${await hashInput(id)}`;
    const count = Number((await store.get(rateKey)) ?? '0') || 0;
    if (count >= RATE_LIMIT_MAX) {
      return json({ ok: false, error: 'rate_limited' }, 429);
    }
  } else {
    console.warn('[contact] CONTACT_RATE_LIMIT_KV binding missing; rate limiting disabled');
  }

  const result = validate(body);
  if (!result.ok) {
    return json({ ok: false, error: result.reason }, 400);
  }

  if (store && rateKey) {
    const count = Number((await store.get(rateKey)) ?? '0') || 0;
    await store.put(rateKey, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not configured on the server');
    return json({ ok: false, error: 'email_failed' }, 502);
  }

  const from = env.RESEND_FROM ?? DEFAULT_FROM;
  const { name, email, message, projectType, timeline } = result.data;

  const text =
    `Portfolio Contact Message\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Project Type: ${projectType}\n` +
    `Timeline: ${timeline}\n` +
    `Message: ${message}\n` +
    `\nSent: ${new Date().toISOString()}`;

  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: DESTINATION,
        reply_to: email,
        subject: SUBJECT,
        text,
      }),
    });

    if (!response.ok) {
      console.error('[contact] Resend request failed', response.status);
      return json({ ok: false, error: 'email_failed' }, 502);
    }
  } catch (error) {
    console.error('[contact] Resend network failure', error);
    return json({ ok: false, error: 'email_failed' }, 502);
  }

  return json({ ok: true }, 200);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return applySecurityHeaders(json({ ok: false, error: 'method_not_allowed' }, 405));
      }
      return applySecurityHeaders(await handleContact(request, env));
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return applySecurityHeaders(assetResponse);
  },
};