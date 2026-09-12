import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const { default: worker } = await import('../src/worker.ts');

const ORIGIN = 'https://portfolio.example.com';
const TEST_IP = '203.0.113.55';

const SECURITY_HEADER_NAMES = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
];

const EXPECTED_CSP =
  "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";

function createKvStore() {
  return {
    map: new Map(),
    async get(key) {
      return this.map.get(key) ?? null;
    },
    async put(key, value) {
      this.map.set(key, value);
    },
  };
}

function createEnv({ withKv = true, withKey = true, withTurnstileKey = true } = {}) {
  return {
    RESEND_API_KEY: withKey ? 'test_re_mocked_key' : undefined,
    RESEND_FROM: 'sender@example.com',
    TURNSTILE_SECRET_KEY: withTurnstileKey ? 'test_turnstile_secret_key' : undefined,
    CONTACT_RATE_LIMIT_KV: withKv ? createKvStore() : undefined,
    ASSETS: {
      async fetch() {
        return new Response('<html><body>mock static page</body></html>', {
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8' },
        });
      },
    },
  };
}

function validPost(ip = TEST_IP, overrides = {}) {
  const body = {
    name: 'Test User',
    email: 'user@example.com',
    message: 'Hello there',
    projectType: 'Web',
    timeline: '1 month',
    honeypot: '',
    turnstileToken: 'test_turnstile_token',
    ...overrides,
  };
  return new Request(`${ORIGIN}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': ip,
    },
    body: JSON.stringify(body),
  });
}

let resendCalls = 0;
let turnstileCalls = 0;
let originalFetch;
let resendHandler = async () =>
  new Response(JSON.stringify({ id: 'mocked' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
let turnstileVerifyHandler = async () =>
  new Response(
    JSON.stringify({
      success: true,
      challenge_ts: '2026-09-12T09:00:00.000Z',
      hostname: 'portfolio.example.com',
      'error-codes': [],
    }),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    },
  );

function resetTurnstileVerifyHandler() {
  turnstileVerifyHandler = async () =>
    new Response(
      JSON.stringify({
        success: true,
        challenge_ts: '2026-09-12T09:00:00.000Z',
        hostname: 'portfolio.example.com',
        'error-codes': [],
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
}

before(() => {
  originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    if (String(input).includes('api.resend.com')) {
      resendCalls += 1;
      return resendHandler(input, init);
    }
    if (String(input).includes('challenges.cloudflare.com')) {
      turnstileCalls += 1;
      return turnstileVerifyHandler(input, init);
    }
    return originalFetch(input, init);
  };
});

after(() => {
  globalThis.fetch = originalFetch;
});

function assertSecurityHeaders(response) {
  for (const header of SECURITY_HEADER_NAMES) {
    assert.ok(response.headers.get(header), `missing security header: ${header}`);
  }
  assert.equal(response.headers.get('content-security-policy'), EXPECTED_CSP);
}

function assertNoStore(response) {
  assert.equal(response.headers.get('cache-control'), 'no-store');
}

test('GET / (static page) receives all security headers', async () => {
  const env = createEnv();
  const response = await worker.fetch(new Request(`${ORIGIN}/`), env);

  assert.equal(response.status, 200);
  assertSecurityHeaders(response);
  assert.equal(await response.text(), '<html><body>mock static page</body></html>');
});

test('CSP allows the Cloudflare Turnstile iframe (frame-src)', async () => {
  const env = createEnv();
  const response = await worker.fetch(new Request(`${ORIGIN}/`), env);

  const csp = response.headers.get('content-security-policy');
  assert.ok(csp, 'CSP header must be present');
  assert.ok(
    csp.includes("frame-src https://challenges.cloudflare.com"),
    'CSP must include frame-src for the Turnstile widget iframe',
  );
  assert.ok(csp.includes("frame-ancestors 'none'"), 'frame-ancestors must remain restricted');
});

test('CSP does not use connect-src for challenges.cloudflare.com (pre-clearance only)', async () => {
  const env = createEnv();
  const response = await worker.fetch(new Request(`${ORIGIN}/`), env);

  const csp = response.headers.get('content-security-policy');
  assert.ok(csp.includes("connect-src 'self'"), 'connect-src must stay restricted to self');
  assert.ok(
    !csp.includes('connect-src.*challenges.cloudflare.com'),
    'connect-src must not include challenges.cloudflare.com when pre-clearance is not used',
  );
});

test('static response preserves its own headers while adding security headers', async () => {
  const env = createEnv();
  const response = await worker.fetch(new Request(`${ORIGIN}/index.html`), env);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assertSecurityHeaders(response);
});

test('GET /api/contact returns 405 with headers and no-store', async () => {
  const env = createEnv();
  const response = await worker.fetch(new Request(`${ORIGIN}/api/contact`), env);

  assert.equal(response.status, 405);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'method_not_allowed' });
});

test('POST /api/contact with wrong Content-Type returns 400 generic error', async () => {
  const env = createEnv();
  const response = await worker.fetch(
    new Request(`${ORIGIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'not json',
    }),
    env,
  );

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
});

test('content-type lookalikes are rejected (media type must match exactly)', async () => {
  const env = createEnv();

  for (const type of ['application/jsonp', 'application/json5', 'text/json']) {
    const response = await worker.fetch(
      new Request(`${ORIGIN}/api/contact`, {
        method: 'POST',
        headers: { 'content-type': type },
        body: JSON.stringify({
          name: 'Test', email: 'user@example.com', message: 'Hi', projectType: 'Web', timeline: '1 month',
        }),
      }),
      env,
    );

    assert.equal(response.status, 400, `content-type '${type}' must be rejected`);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  }
});

test('content-type with valid parameters is accepted', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(
    new Request(`${ORIGIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        name: 'Test', email: 'user@example.com', message: 'Hi', projectType: 'Web', timeline: '1 month',
        turnstileToken: 'test_turnstile_token',
      }),
    }),
    env,
  );

  assert.equal(response.status, 200);
  assert.equal(turnstileCalls, 1);
  assert.equal(resendCalls, 1);
});

test('oversized request is rejected before the body is read', async () => {
  const env = createEnv();

  // If the handler ever called request.text() on this stream, the read would
  // reject and worker.fetch would throw instead of resolving to a 400.
  const erroredBody = new ReadableStream({
    start(controller) {
      controller.error(new Error('body was read despite oversized content-length'));
    },
  });

  const request = new Request(`${ORIGIN}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': '999999',
    },
    body: erroredBody,
    duplex: 'half',
  });

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
});

test('oversized body without content-length (chunked) is rejected mid-stream', async () => {
  const env = createEnv();

  let sent = 0;
  const body = new ReadableStream({
    start(controller) {
      const chunk = new TextEncoder().encode('x'.repeat(1024));
      const timer = setInterval(() => {
        if (sent >= 40) {
          clearInterval(timer);
          controller.close();
          return;
        }
        sent += 1;
        controller.enqueue(chunk);
      }, 1);
    },
  });

  const request = new Request(`${ORIGIN}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    duplex: 'half',
  });

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
});

test('oversized streaming body is rejected without fully reading the body', async () => {
  const env = createEnv();
  const BODY_TOTAL = 64 * 1024;
  let bytesProduced = 0;

  // pull() only produces on demand, so the number of bytes handed to the
  // handler proves how much of the body was actually consumed.
  const source = new ReadableStream({
    async pull(controller) {
      const chunk = new Uint8Array(4096);
      bytesProduced += chunk.byteLength;
      controller.enqueue(chunk);
      if (bytesProduced >= BODY_TOTAL) controller.close();
    },
  });

  const request = new Request(`${ORIGIN}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: source,
    duplex: 'half',
  });

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  // The handler must stop as soon as the 32KiB cap is crossed, long before
  // the full 64KiB body is produced.
  assert.ok(
    bytesProduced < BODY_TOTAL,
    `expected to stop reading early, but produced ${bytesProduced} bytes`,
  );
});

test('malformed JSON returns generic 400', async () => {
  const env = createEnv();
  const response = await worker.fetch(
    new Request(`${ORIGIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"name": "Test", "message": "unterminated',
    }),
    env,
  );

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
});

test('empty body returns generic 400', async () => {
  const env = createEnv();
  const response = await worker.fetch(
    new Request(`${ORIGIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '',
    }),
    env,
  );

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
});

test('Unicode and multibyte content is accepted within the cap', async () => {
  const env = createEnv();
  resendCalls = 0;

  const response = await worker.fetch(
    validPost(TEST_IP, {
      name: 'مستخدم تجريبي',
      message: 'مرحباً! This contains emoji too 😀🎉🚀',
    }),
    env,
  );

  assert.equal(response.status, 200);
  assert.ok(await response.json());
  assert.equal(resendCalls, 1);
});

test('multibyte emoji message near the byte boundary is accepted', async () => {
  const env = createEnv();
  resendCalls = 0;

  // 2500 4-byte emoji fill the 5000-code-unit message limit (~10KiB of UTF-8),
  // well under the 32KiB byte cap yet the maximum multibyte message allowed.
  const response = await worker.fetch(
    validPost(TEST_IP, { message: '😀'.repeat(2500) }),
    env,
  );

  assert.equal(response.status, 200);
  assert.equal(resendCalls, 1);
});

test('multibyte body over the byte cap is rejected as generic 400', async () => {
  const env = createEnv();
  const encoder = new TextEncoder();
  const oversized = JSON.stringify({ name: '😀'.repeat(10000) });
  assert.ok(encoder.encode(oversized).byteLength > 32768);

  // Streamed without content-length so only the streaming byte cap applies.
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(oversized));
      controller.close();
    },
  });

  const response = await worker.fetch(
    new Request(`${ORIGIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      duplex: 'half',
    }),
    env,
  );

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
});

test('spoofed x-forwarded-for cannot select a rate-limit bucket', async () => {
  const env = createEnv();

  const spoofedPost = (ip) =>
    new Request(`${ORIGIN}/api/contact`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'user@example.com',
        message: 'Hello there',
        projectType: 'Web',
        timeline: '1 month',
        honeypot: '',
        turnstileToken: 'test_turnstile_token',
      }),
    });

  // Without a cf-connecting-ip, all callers share the 'unknown' bucket, so a
  // spoofer cycling through x-forwarded-for values cannot evade the limit.
  for (let i = 0; i < 5; i += 1) {
    const response = await worker.fetch(spoofedPost(`1.2.${i}.1`), env);
    assert.equal(response.status, 200);
  }

  const sixth = await worker.fetch(spoofedPost('9.9.9.9'), env);
  assert.equal(sixth.status, 429);
  assertSecurityHeaders(sixth);
  assertNoStore(sixth);
  assert.deepEqual(await sixth.json(), { ok: false, error: 'rate_limited' });
});

test('valid contact request flows through to Resend and returns 200', async () => {
  const env = createEnv();
  resendCalls = 0;

  const response = await worker.fetch(validPost(), env);

  assert.equal(response.status, 200);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(resendCalls, 1);
});

test('honeypot responses return 200 without calling Resend', async () => {
  const env = createEnv();
  resendCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { honeypot: 'bot-value' }), env);

  assert.equal(response.status, 200);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(resendCalls, 0);
});

test('honeypot catches non-string bot values without calling Resend', async () => {
  const env = createEnv();
  resendCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { honeypot: 1 }), env);

  assert.equal(response.status, 200);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(resendCalls, 0);
});

test('honeypot only fires when a non-empty value is present', async () => {
  const env = createEnv();
  resendCalls = 0;

  const empty = await worker.fetch(validPost(TEST_IP, { honeypot: '' }), env);
  assert.equal(empty.status, 200);
  assert.equal(resendCalls, 1);
});

test('invalid email returns 400 generic error', async () => {
  const env = createEnv();
  const response = await worker.fetch(validPost(TEST_IP, { email: 'not-an-email' }), env);

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
});

test('rate limiter blocks after 5 submissions per IP', async () => {
  const env = createEnv();

  for (let i = 0; i < 5; i += 1) {
    const response = await worker.fetch(validPost(TEST_IP), env);
    assert.equal(response.status, 200);
  }

  const sixth = await worker.fetch(validPost(TEST_IP), env);
  assert.equal(sixth.status, 429);
  assertSecurityHeaders(sixth);
  assertNoStore(sixth);
  assert.deepEqual(await sixth.json(), { ok: false, error: 'rate_limited' });
});

test('missing RESEND_API_KEY returns generic 502 without leaking details', async () => {
  const env = createEnv({ withKey: false });
  resendCalls = 0;

  const response = await worker.fetch(validPost(), env);

  assert.equal(response.status, 502);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'email_failed' });
  assert.equal(resendCalls, 0);
});

test('Resend error responses are mapped to generic 502', async () => {
  const env = createEnv();
  resendCalls = 0;
  resendHandler = async () => new Response('rejected', { status: 500 });

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 502);
    assertSecurityHeaders(response);
    assertNoStore(response);
    assert.deepEqual(await response.json(), { ok: false, error: 'email_failed' });
  } finally {
    resendHandler = async () =>
      new Response(JSON.stringify({ id: 'mocked' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
  }
});

test('missing Turnstile token returns generic 400 and never reaches Resend', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { turnstileToken: undefined }), env);

  assert.equal(response.status, 400);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('empty Turnstile token returns generic 400', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { turnstileToken: '' }), env);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('whitespace-only Turnstile token returns generic 400', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { turnstileToken: '   ' }), env);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('non-string Turnstile token returns generic 400', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { turnstileToken: 12345 }), env);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('oversized Turnstile token is rejected locally without Siteverify', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(
    validPost(TEST_IP, { turnstileToken: 't'.repeat(4096) }),
    env,
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('invalid Turnstile token is rejected with a generic error and no email', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () =>
    new Response(
      JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 400);
    assertSecurityHeaders(response);
    assertNoStore(response);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
    assert.equal(turnstileCalls, 1);
    assert.equal(resendCalls, 0);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('expired or replayed Turnstile token is rejected and cannot reach Resend', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () =>
    new Response(
      JSON.stringify({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
    assert.equal(turnstileCalls, 1);
    assert.equal(resendCalls, 0);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('successful mocked Siteverify lets the valid flow continue to Resend', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(validPost(), env);

  assert.equal(response.status, 200);
  assertSecurityHeaders(response);
  assertNoStore(response);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(turnstileCalls, 1);
  assert.equal(resendCalls, 1);
});

test('Siteverify is passed the visitor IP when cf-connecting-ip is present', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  let seenRemoteIp = null;
  turnstileVerifyHandler = async (input, init) => {
    seenRemoteIp = JSON.parse(init.body).remoteip;
    return new Response(
      JSON.stringify({ success: true, 'error-codes': [] }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  };

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 200);
    assert.equal(seenRemoteIp, TEST_IP);
    assert.equal(turnstileCalls, 1);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('Siteverify omits remoteip when no cf-connecting-ip is present', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  let seenRemoteIp = 'sentinel';
  turnstileVerifyHandler = async (input, init) => {
    seenRemoteIp = JSON.parse(init.body).remoteip;
    return new Response(
      JSON.stringify({ success: true, 'error-codes': [] }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  };

  try {
    const request = new Request(`${ORIGIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'user@example.com',
        message: 'Hello there',
        projectType: 'Web',
        timeline: '1 month',
        honeypot: '',
        turnstileToken: 'test_turnstile_token',
      }),
    });
    const response = await worker.fetch(request, env);

    assert.equal(response.status, 200);
    assert.equal(seenRemoteIp, undefined);
    assert.equal(turnstileCalls, 1);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('Siteverify HTTP failure fails closed and never calls Resend', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () => new Response('upstream error', { status: 500 });

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
    assert.equal(turnstileCalls, 1);
    assert.equal(resendCalls, 0);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('Siteverify network failure fails closed and never calls Resend', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () => {
    throw new Error('simulated network failure');
  };

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
    assert.equal(turnstileCalls, 1);
    assert.equal(resendCalls, 0);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('Siteverify malformed JSON response fails closed', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () =>
    new Response('not-json{', { status: 200, headers: { 'content-type': 'application/json' } });

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
    assert.equal(turnstileCalls, 1);
    assert.equal(resendCalls, 0);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('Siteverify unexpected payload shape fails closed', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () =>
    new Response(
      JSON.stringify({ status: 'ok', result: true }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
    assert.equal(turnstileCalls, 1);
    assert.equal(resendCalls, 0);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('Siteverify non-JSON content (array) fails closed', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () =>
    new Response(
      JSON.stringify(['not', 'an', 'object']),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );

  try {
    const response = await worker.fetch(validPost(), env);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
    assert.equal(turnstileCalls, 1);
    assert.equal(resendCalls, 0);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('missing TURNSTILE_SECRET_KEY fails closed for otherwise valid requests', async () => {
  const env = createEnv({ withTurnstileKey: false });
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(validPost(), env);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('failed verification never echoes the token back to the client', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  const distinctiveToken = 'distinctive_invalid_token_value';
  turnstileVerifyHandler = async () =>
    new Response(
      JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );

  try {
    const response = await worker.fetch(validPost(TEST_IP, { turnstileToken: distinctiveToken }), env);

    assert.equal(response.status, 400);
    const payload = await response.text();
    assert.ok(!payload.includes(distinctiveToken), 'token must not be reflected in the response');
    assert.ok(!payload.includes('turnstile'));
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('honeypot short-circuits before Turnstile is called', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { honeypot: 'bot-value' }), env);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('an invalid Turnstile token cannot consume the KV submission budget', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  turnstileVerifyHandler = async () =>
    new Response(
      JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );

  try {
    // Six rejected verifications must not burn the p/hour KV budget.
    for (let i = 0; i < 6; i += 1) {
      const response = await worker.fetch(validPost(TEST_IP), env);
      assert.equal(response.status, 400);
    }

    // A subsequent valid submission (mocked success) must still succeed.
    resetTurnstileVerifyHandler();
    const ok = await worker.fetch(validPost(TEST_IP), env);
    assert.equal(ok.status, 200);
    assert.equal(resendCalls, 1);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('distribution bundle contains the public sitekey but no worker secret reference', async (t) => {
  const distDir = new URL('../dist/assets/', import.meta.url);
  let files;
  try {
    files = fs.readdirSync(distDir).filter((file) => file.endsWith('.js'));
  } catch {
    // dist is gitignored; when absent the secret leak check is skipped.
    t.skip('dist not built');
    return;
  }

  assert.ok(files.length > 0, 'expected built bundle files');

  const bundle = files
    .map((file) => fs.readFileSync(new URL(file, distDir), 'utf8'))
    .join('\n');

  // The PUBLIC sitekey is expected in the client bundle.
  assert.ok(bundle.includes('0x4AAAAAAExS4vnlmaeqF8pQ'), 'public sitekey must ship in bundle');

  // The secret is read via env.TURNSTILE_SECRET_KEY at runtime, so the literal
  // variable name must never appear in shipped client code.
  assert.ok(!bundle.includes('TURNSTILE_SECRET_KEY'), 'server secret name must not ship to client');
});