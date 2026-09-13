const DESTINATION = 'sm4603097@gmail.com';
const SUBJECT = 'Portfolio Contact Message';
const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'onboarding@resend.dev';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 3600;
const RATE_LIMIT_MAX_GLOBAL = 15;
const RATE_LIMIT_GLOBAL_WINDOW_SECONDS = 86400;

const MAX_BODY_CHARS = 32768;
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;
const OPTION_MAX = 120;

const PHONE_MAX = 40;
const PHONE_ALLOWED = /^[\p{Nd}+()\-\s]+$/u;

const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/;

const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_TOKEN_MAX = 2048;
const TURNSTILE_TIMEOUT_MS = 5000;

const RESEND_TIMEOUT_MS = 10000;

const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy':
    "default-src 'self'; script-src 'self' 'sha256-1HuH/LZ5qKNAKe3/MC+PBcBkgmHqbZVwTUYGM+ZIG7k=' https://challenges.cloudflare.com; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
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
  RESEND_TIMEOUT_MS?: number;
  RESEND_FROM?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_RATE_LIMIT_KV?: KvStore;
  CONTACT_BURST_LIMITER?: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
  ASSETS: AssetsBinding;
}

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

interface ValidPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  projectType: string;
  timeline: string;
}

// Structured, PII-safe server-side logging. Every value is an explicit safe
// primitive; message bodies, names, emails, phones, tokens, secrets, cookies,
// and client IPs are never passed here. Lines are single-line JSON so Workers
// Observability / wrangler tail render one event per entry.
type LogLevel = 'log' | 'warn' | 'error';
type LogField = string | number | boolean;

function logEvent(
  event: string,
  fields: Record<string, LogField>,
  level: LogLevel = 'log',
): void {
  const line = JSON.stringify({ event, ts: new Date().toISOString(), ...fields });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

// Coarse client-IP presence only. The full IP is never logged; it is used
// solely to derive bounded rate-limit keys and to report whether reactive
// bucketing had real per-visitor granularity (absent IPs collapse callers).
interface RequestContext {
  reqId: string;
  route: 'api-contact' | 'static';
  method: string;
  startedAt: number;
  hasClientIp: boolean;
}

function contextFor(request: Request, reqId: string): RequestContext {
  const url = new URL(request.url);
  const route = url.pathname === '/api/contact' ? 'api-contact' : 'static';
  const cfIp = request.headers.get('cf-connecting-ip');
  return {
    reqId,
    route,
    method: request.method,
    startedAt: Date.now(),
    hasClientIp: cfIp !== null && cfIp.trim() !== '',
  };
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

// Reads request.body with a hard cap on transmitted bytes so an oversized body
// is never fully buffered before rejection. Chunks are collected only up to
// the cap and decoded once, so UTF-8 sequences split across chunk boundaries
// cannot be corrupted.
async function readBoundedBody(
  request: Request,
  maxBytes: number,
): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return '';

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) return null;
      chunks.push(value);
    }
  } catch {
    return null;
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

async function hashInput(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function readTrimmed(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null;
}

// Optional, permissively validated phone number used only as a contact
// preference. Omitted or empty values normalize to an empty string; anything
// that is not trimmed digits with + - ( ) and spaces is treated as invalid so
// header-injection style or payload-smuggling input cannot reach the email.
function normalizePhone(value: unknown): string | null {
  if (value === undefined) return '';
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed === '') return '';
  if (trimmed.length > PHONE_MAX) return null;
  if (!PHONE_ALLOWED.test(trimmed)) return null;
  if (!/\p{Nd}/u.test(trimmed)) return null;
  return trimmed;
}

// Server-side Turnstile verification. Fails closed on any error so an
// unconfirmed token can never reach the email path. Provider details, error
// codes, and secret state are never exposed to the caller; only a coarse
// failure category is available for server-side diagnostics, never the token
// or the provider's raw error list.
type TurnstileOutcome =
  | { success: true }
  | { success: false; category: 'provider_network' | 'provider_http' | 'provider_unparseable' | 'rejected' };

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp?: string,
): Promise<TurnstileOutcome> {
  const bodyPayload = remoteIp
    ? { secret, response: token, remoteip: remoteIp }
    : { secret, response: token };

  let response: Response;
  try {
    response = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(bodyPayload),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });
  } catch {
    return { success: false, category: 'provider_network' };
  }

  if (!response.ok) return { success: false, category: 'provider_http' };

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { success: false, category: 'provider_unparseable' };
  }

  if (typeof payload !== 'object' || payload === null) {
    return { success: false, category: 'provider_unparseable' };
  }

  const result = payload as TurnstileVerifyResponse;
  return result.success === true
    ? { success: true }
    : { success: false, category: 'rejected' };
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

  const phone = normalizePhone(body.phone);
  if (phone === null) return { ok: false, reason: 'invalid_fields' };

  const message = readTrimmed(body.message);
  if (!message || message.length > MESSAGE_MAX) return { ok: false, reason: 'invalid_fields' };

  const projectType = readTrimmed(body.projectType);
  if (!projectType || projectType.length > OPTION_MAX) {
    return { ok: false, reason: 'invalid_fields' };
  }

  const timeline = readTrimmed(body.timeline);
  if (!timeline || timeline.length > OPTION_MAX) return { ok: false, reason: 'invalid_fields' };

  return { ok: true, data: { name, email, phone, message, projectType, timeline } };
}

async function handleContact(
  request: Request,
  env: Env,
  ctx: RequestContext,
): Promise<Response> {
  const { reqId, method, startedAt } = ctx;
  const duration = (): number => Date.now() - startedAt;

  const burstId = clientIdentifier(request);
  const burstLimiter = env.CONTACT_BURST_LIMITER;
  if (burstLimiter) {
    const { success } = await burstLimiter.limit({ key: burstId });
    if (!success) {
      logEvent(
        'contact.rate_limited',
        {
          reqId,
          route: 'api-contact',
          method,
          status: 429,
          durationMs: duration(),
          category: 'burst',
          hasClientIp: ctx.hasClientIp,
        },
        'warn',
      );
      return json({ ok: false, error: 'rate_limited' }, 429);
    }
  }

  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > MAX_BODY_CHARS) {
    logEvent('contact.invalid_request', {
      reqId,
      route: 'api-contact',
      method,
      status: 400,
      durationMs: duration(),
      category: 'content_length',
    });
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!isJsonContentType(contentType)) {
    logEvent('contact.invalid_request', {
      reqId,
      route: 'api-contact',
      method,
      status: 400,
      durationMs: duration(),
      category: 'content_type',
    });
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const raw = await readBoundedBody(request, MAX_BODY_CHARS);
  if (raw === null) {
    logEvent('contact.invalid_request', {
      reqId,
      route: 'api-contact',
      method,
      status: 400,
      durationMs: duration(),
      category: 'body_invalid',
    });
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    logEvent('contact.invalid_request', {
      reqId,
      route: 'api-contact',
      method,
      status: 400,
      durationMs: duration(),
      category: 'payload_invalid',
    });
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    logEvent('contact.invalid_request', {
      reqId,
      route: 'api-contact',
      method,
      status: 400,
      durationMs: duration(),
      category: 'payload_invalid',
    });
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }
  const body = parsed as Record<string, unknown>;

  // Any non-empty honeypot value is a bot signal, regardless of JSON type. A
  // bot sending `"honeypot": 1` must not slip through to the email path.
  const honeypot = body.honeypot;
  if (honeypot !== undefined && honeypot !== null && `${honeypot}`.trim() !== '') {
    logEvent('contact.honeypot', {
      reqId,
      route: 'api-contact',
      method,
      status: 200,
      durationMs: duration(),
      hasClientIp: ctx.hasClientIp,
    });
    return json({ ok: true }, 200);
  }

  // Cheap schema validation runs before Turnstile so obviously malformed
  // payloads fail without spending a Siteverify round-trip.
  const result = validate(body);
  if (!result.ok) {
    logEvent('contact.validation_rejected', {
      reqId,
      route: 'api-contact',
      method,
      status: 400,
      durationMs: duration(),
      category: 'invalid_fields',
    });
    return json({ ok: false, error: result.reason }, 400);
  }

  // Turnstile is verified server-side only; a missing, malformed, expired, or
  // rejected token fails closed with the same generic error as other invalid
  // input. Only the visitor IP header injected by Cloudflare's edge is sent as
  // remoteip, and only when present.
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const remoteIp =
    cfConnectingIp && cfConnectingIp.trim() !== '' ? cfConnectingIp.trim() : undefined;

  const turnstileToken = readTrimmed(body.turnstileToken);
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;

  const preflightCategory: string | null =
    turnstileSecret === undefined
      ? 'missing_secret'
      : turnstileToken === null
        ? 'missing_token'
        : turnstileToken.length === 0
          ? 'empty_token'
          : turnstileToken.length > TURNSTILE_TOKEN_MAX
            ? 'token_too_long'
            : null;

  if (preflightCategory !== null) {
    logEvent(
      'contact.turnstile_failed',
      {
        reqId,
        route: 'api-contact',
        method,
        status: 400,
        durationMs: duration(),
        category: preflightCategory,
        hasClientIp: ctx.hasClientIp,
      },
      'warn',
    );
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const outcome = await verifyTurnstile(turnstileToken as string, turnstileSecret as string, remoteIp);
  if (!outcome.success) {
    logEvent(
      'contact.turnstile_failed',
      {
        reqId,
        route: 'api-contact',
        method,
        status: 400,
        durationMs: duration(),
        category: outcome.category,
        hasClientIp: ctx.hasClientIp,
      },
      'warn',
    );
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const store = env.CONTACT_RATE_LIMIT_KV;

  if (store) {
    try {
      const rateKey = `contact:${await hashInput(burstId)}`;
      const perIpCount = Number((await store.get(rateKey)) ?? '0') || 0;
      if (perIpCount >= RATE_LIMIT_MAX) {
        logEvent(
          'contact.rate_limited',
          {
            reqId,
            route: 'api-contact',
            method,
            status: 429,
            durationMs: duration(),
            category: 'kv_window',
            hasClientIp: ctx.hasClientIp,
          },
          'warn',
        );
        return json({ ok: false, error: 'rate_limited' }, 429);
      }

      const globalKey = `contact:global:${new Date().toISOString().slice(0, 10)}`;
      const globalCount = Number((await store.get(globalKey)) ?? '0') || 0;
      if (globalCount >= RATE_LIMIT_MAX_GLOBAL) {
        logEvent(
          'contact.rate_limited',
          {
            reqId,
            route: 'api-contact',
            method,
            status: 429,
            durationMs: duration(),
            category: 'kv_global_window',
            hasClientIp: ctx.hasClientIp,
          },
          'warn',
        );
        return json({ ok: false, error: 'rate_limited' }, 429);
      }

      await store.put(rateKey, String(perIpCount + 1), {
        expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
      });
      await store.put(globalKey, String(globalCount + 1), {
        expirationTtl: RATE_LIMIT_GLOBAL_WINDOW_SECONDS,
      });
    } catch {
      logEvent(
        'contact.rate_limiter_unavailable',
        {
          reqId,
          route: 'api-contact',
          method,
          status: 0,
          durationMs: duration(),
          category: 'kv_error',
          hasClientIp: ctx.hasClientIp,
        },
        'warn',
      );
    }
  } else {
    logEvent(
      'contact.rate_limiter_unavailable',
      {
        reqId,
        route: 'api-contact',
        method,
        status: 0,
        durationMs: duration(),
        category: 'missing_binding',
      },
      'warn',
    );
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    logEvent(
      'contact.resend_failed',
      {
        reqId,
        route: 'api-contact',
        method,
        status: 502,
        durationMs: duration(),
        category: 'missing_secret',
      },
      'error',
    );
    return json({ ok: false, error: 'email_failed' }, 502);
  }

  const from = env.RESEND_FROM ?? DEFAULT_FROM;
  const { name, email, phone, message, projectType, timeline } = result.data;
  const phoneDisplay = phone !== '' ? phone : 'Not provided';

  const text =
    `Portfolio Contact Message\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phoneDisplay}\n` +
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
      signal: AbortSignal.timeout(env.RESEND_TIMEOUT_MS ?? RESEND_TIMEOUT_MS),
    });

    if (!response.ok) {
      logEvent(
        'contact.resend_failed',
        {
          reqId,
          route: 'api-contact',
          method,
          status: 502,
          durationMs: duration(),
          category: 'http_error',
          providerStatus: response.status,
        },
        'error',
      );
      return json({ ok: false, error: 'email_failed' }, 502);
    }
  } catch (error) {
    const name = error instanceof Error ? error.name : 'UnknownError';
    logEvent(
      'contact.resend_failed',
      {
        reqId,
        route: 'api-contact',
        method,
        status: 502,
        durationMs: duration(),
        category: name === 'TimeoutError' ? 'timeout' : 'network_error',
        errorName: name,
      },
      'error',
    );
    return json({ ok: false, error: 'email_failed' }, 502);
  }

  logEvent('contact.accepted', {
    reqId,
    route: 'api-contact',
    method,
    status: 200,
    durationMs: duration(),
  });
  return json({ ok: true }, 200);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const reqId = crypto.randomUUID();
    const ctx = contextFor(request, reqId);

    try {
      if (ctx.route === 'api-contact') {
        if (ctx.method !== 'POST') {
          logEvent('api.method_not_allowed', {
            reqId,
            route: 'api-contact',
            method: ctx.method,
            status: 405,
            durationMs: Date.now() - ctx.startedAt,
          });
          return applySecurityHeaders(json({ ok: false, error: 'method_not_allowed' }, 405));
        }
        return applySecurityHeaders(await handleContact(request, env, ctx));
      }

      const assetResponse = await env.ASSETS.fetch(request);
      const response = applySecurityHeaders(assetResponse);
      if (response.status >= 500) {
        logEvent(
          'http.response_5xx',
          {
            reqId,
            route: 'static',
            method: ctx.method,
            status: response.status,
            durationMs: Date.now() - ctx.startedAt,
            category: 'assets',
          },
          'error',
        );
      }
      return response;
    } catch (error) {
      // Unexpected exception boundary: never leak internals to the client, and
      // record a structured server-side error with only coarse metadata.
      const errorName = error instanceof Error ? error.name : 'UnknownError';
      const errorMessage = error instanceof Error ? error.message : '';
      logEvent(
        'worker.uncaught',
        {
          reqId,
          route: ctx.route,
          method: ctx.method,
          status: 500,
          durationMs: Date.now() - ctx.startedAt,
          category: 'uncaught',
          errorName,
          errorMessage: errorMessage.slice(0, 200) || 'no_message',
        },
        'error',
      );
      return applySecurityHeaders(json({ ok: false, error: 'internal' }, 500));
    }
  },
};