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
  "default-src 'self'; script-src 'self' 'sha256-1HuH/LZ5qKNAKe3/MC+PBcBkgmHqbZVwTUYGM+ZIG7k=' https://challenges.cloudflare.com; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";

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
    if (String(input).startsWith('https://api.resend.com/')) {
      resendCalls += 1;
      return resendHandler(input, init);
    }
    if (String(input).startsWith('https://challenges.cloudflare.com/')) {
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

test('phone omitted is accepted (optional field)', async () => {
  const env = createEnv();
  resendCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP), env);

  assert.equal(response.status, 200);
  assert.equal(resendCalls, 1);
});

test('empty phone string is accepted', async () => {
  const env = createEnv();
  resendCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { phone: '' }), env);

  assert.equal(response.status, 200);
  assert.equal(resendCalls, 1);
});

test('whitespace-only phone is treated as not provided', async () => {
  const env = createEnv();
  resendCalls = 0;

  const response = await worker.fetch(validPost(TEST_IP, { phone: '   ' }), env);

  assert.equal(response.status, 200);
  assert.equal(resendCalls, 1);
});

test('realistic phone formats are accepted', async () => {
  const env = createEnv();
  resendCalls = 0;

  const phones = [
    '01070471954',
    '+201070471954',
    '+20 107 047 1954',
    '010 7047 1954',
    '(010) 704-7195',
    '+1 (415) 555-0100',
  ];
  for (let i = 0; i < phones.length; i += 1) {
    // Distinct per-test IPs so the 5/hour KV limit is not tripped while
    // exercising all formats.
    const response = await worker.fetch(validPost(`203.0.113.${100 + i}`, { phone: phones[i] }), env);
    assert.equal(response.status, 200, `phone '${phones[i]}' must be accepted`);
  }

  assert.equal(resendCalls, phones.length);
});

test('phone over maximum length is rejected', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const tooLong = '+'.padEnd(41, '1');
  const response = await worker.fetch(validPost(TEST_IP, { phone: tooLong }), env);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  assert.equal(turnstileCalls, 0, 'schema validation must reject before Siteverify');
  assert.equal(resendCalls, 0);
});

test('non-string phone values are rejected', async () => {
  const env = createEnv();
  resendCalls = 0;

  for (const phone of [12345, true, ['010']]) {
    const response = await worker.fetch(validPost(TEST_IP, { phone }), env);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  }
  assert.equal(resendCalls, 0);
});

test('phone with HTML, URL, or control content is rejected', async () => {
  const env = createEnv();
  resendCalls = 0;

  const hostile = [
    '<script>alert(1)</script>',
    'http://evil.example/010',
    'tel:01070471954',
    '010\0number',
    'name="v"',
    'abc',
    '++(())--',
  ];
  for (const phone of hostile) {
    const response = await worker.fetch(validPost(TEST_IP, { phone }), env);
    assert.equal(response.status, 400, `phone '${phone}' must be rejected`);
    assert.deepEqual(await response.json(), { ok: false, error: 'invalid_fields' });
  }
  assert.equal(resendCalls, 0);
});

test('phone is trimmed before storage in the email body', async () => {
  const env = createEnv();
  resendCalls = 0;
  let capturedBody = null;
  resendHandler = async (input, init) => {
    capturedBody = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: 'mocked' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  try {
    const response = await worker.fetch(validPost(TEST_IP, { phone: '  +20 107 047 1954  ' }), env);

    assert.equal(response.status, 200);
    assert.ok(capturedBody.text.includes('Phone: +20 107 047 1954'));
    assert.ok(!capturedBody.text.includes('Phone:   +20 107 047 1954  '));
  } finally {
    resendHandler = async () =>
      new Response(JSON.stringify({ id: 'mocked' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
  }
});

test('phone is included in the email body but not in headers', async () => {
  const env = createEnv();
  resendCalls = 0;
  let capturedBody = null;
  let capturedInit = null;
  resendHandler = async (input, init) => {
    capturedInit = init;
    capturedBody = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: 'mocked' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  try {
    const response = await worker.fetch(validPost(TEST_IP, { phone: '+20 107 047 1954' }), env);

    assert.equal(response.status, 200);
    assert.ok(capturedBody.text.includes('Name: Test User'));
    assert.ok(capturedBody.text.includes('Email: user@example.com'));
    assert.ok(capturedBody.text.includes('Phone: +20 107 047 1954'));
    assert.ok(capturedBody.text.includes('Project Type: Web'));
    assert.ok(capturedBody.text.includes('Timeline: 1 month'));
    assert.ok(capturedBody.text.includes('Message: Hello there'));

    const headerBlob = JSON.stringify(capturedInit.headers);
    assert.ok(
      !headerBlob.includes('+20 107 047 1954'),
      'phone must never appear in request headers',
    );
    assert.ok(!capturedBody.subject.includes('+20'), 'phone must not appear in the subject');
    assert.ok(!capturedBody.reply_to.includes('+20'), 'phone must not appear in reply_to');
    assert.ok(!capturedBody.to.includes('+20'), 'phone must not appear in the recipient');
  } finally {
    resendHandler = async () =>
      new Response(JSON.stringify({ id: 'mocked' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
  }
});

test('omitted phone renders Not provided in the email body', async () => {
  const env = createEnv();
  resendCalls = 0;
  let capturedBody = null;
  resendHandler = async (input, init) => {
    capturedBody = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: 'mocked' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  try {
    const response = await worker.fetch(validPost(TEST_IP), env);

    assert.equal(response.status, 200);
    assert.ok(capturedBody.text.includes('Phone: Not provided'));
  } finally {
    resendHandler = async () =>
      new Response(JSON.stringify({ id: 'mocked' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
  }
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

async function captureLogs(run, env) {
  const captured = [];
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  console.log = (...args) => captured.push(['log', ...args]);
  console.warn = (...args) => captured.push(['warn', ...args]);
  console.error = (...args) => captured.push(['error', ...args]);
  try {
    const response = await run(env);
    return { response, captured };
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

function parsedEvents(captured) {
  const events = [];
  for (const args of captured) {
    for (const arg of args.slice(1)) {
      if (typeof arg === 'string' && arg.startsWith('{') && arg.endsWith('}')) {
        try {
          events.push(JSON.parse(arg));
        } catch {
          // Ignore non-JSON console output if any.
        }
      }
    }
  }
  return events;
}

function logsToText(captured) {
  return captured.map((args) => args.join(' ')).join('\n');
}

const TEST_PII_STRINGS = [
  'Test User',
  'user@example.com',
  '+20 107 047 1954',
  'Hello there',
  'test_turnstile_token',
  TEST_IP,
];

function assertNoPiiLogged(captured) {
  const text = logsToText(captured);
  for (const needle of TEST_PII_STRINGS) {
    assert.ok(!text.includes(needle), `log line leaked sensitive value: ${needle}`);
  }
}

test('uncaught asset exception returns a generic 500, keeps security headers, and logs a structured event', async () => {
  const env = createEnv();
  env.ASSETS.fetch = async () => {
    throw new Error('boom-observability-test');
  };

  const { response, captured } = await captureLogs(
    (e) => worker.fetch(new Request(`${ORIGIN}/`), e),
    env,
  );

  assert.equal(response.status, 500);
  const body = await response.text();
  assert.equal(body, JSON.stringify({ ok: false, error: 'internal' }));
  assert.ok(!body.includes('boom-observability-test'), 'exception internals must not reach the client');
  assertSecurityHeaders(response);

  const uncaught = parsedEvents(captured).filter((e) => e.event === 'worker.uncaught');
  assert.equal(uncaught.length, 1);
  assert.equal(uncaught[0].status, 500);
  assert.equal(uncaught[0].route, 'static');
  assert.equal(uncaught[0].errorName, 'Error');
  assert.equal(uncaught[0].errorMessage, 'boom-observability-test');
  assertNoPiiLogged(captured);
});

test('static 5xx responses are logged; healthy static requests produce no worker log events', async () => {
  const failingEnv = createEnv();
  failingEnv.ASSETS.fetch = async () =>
    new Response('origin down', { status: 503, headers: { 'content-type': 'text/plain' } });

  const failure = await captureLogs(
    (e) => worker.fetch(new Request(`${ORIGIN}/broken`), e),
    failingEnv,
  );
  assert.equal(failure.response.status, 503);
  assertSecurityHeaders(failure.response);
  const fivexx = parsedEvents(failure.captured).filter((e) => e.event === 'http.response_5xx');
  assert.equal(fivexx.length, 1);
  assert.equal(fivexx[0].status, 503);
  assert.equal(fivexx[0].category, 'assets');
  assert.ok(!logsToText(failure.captured).includes('origin down'), '5xx body must not be logged');

  const healthy = await captureLogs(
    (e) => worker.fetch(new Request(`${ORIGIN}/`), e),
    createEnv(),
  );
  assert.equal(healthy.response.status, 200);
  assert.equal(parsedEvents(healthy.captured).length, 0, 'healthy static traffic must stay silent');
});

test('non-POST /api/contact is a generic 405 with a logged method event and security headers', async () => {
  const { response, captured } = await captureLogs(
    (e) => worker.fetch(new Request(`${ORIGIN}/api/contact`), e),
    createEnv(),
  );

  assert.equal(response.status, 405);
  assert.deepEqual(await response.json(), { ok: false, error: 'method_not_allowed' });
  assertSecurityHeaders(response);

  const events = parsedEvents(captured);
  assert.equal(events.filter((e) => e.event === 'api.method_not_allowed').length, 1);
  assert.ok(events.some((e) => e.status === 405 && e.route === 'api-contact'));
});

test('invalid contact payloads emit safe event metadata and never log PII', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const emptyRequest = new Request(`${ORIGIN}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': TEST_IP,
    },
    body: '{}',
  });
  const empty = await captureLogs((e) => worker.fetch(emptyRequest, e), env);
  assert.equal(empty.response.status, 400);
  assert.deepEqual(await empty.response.json(), { ok: false, error: 'invalid_fields' });
  assert.ok(
    parsedEvents(empty.captured).some(
      (e) => e.event === 'contact.validation_rejected' && e.status === 400,
    ),
  );
  assertNoPiiLogged(empty.captured);

  const badEmail = await captureLogs(
    (e) => worker.fetch(validPost(TEST_IP, { email: 'not-an-email' }), e),
    env,
  );
  assert.equal(badEmail.response.status, 400);
  assert.ok(
    parsedEvents(badEmail.captured).some(
      (e) => e.event === 'contact.validation_rejected' && e.status === 400,
    ),
  );
  assertNoPiiLogged(badEmail.captured);

  const honeypot = await captureLogs(
    (e) => worker.fetch(validPost(TEST_IP, { honeypot: 'bot-value' }), e),
    env,
  );
  assert.equal(honeypot.response.status, 200);
  assert.ok(parsedEvents(honeypot.captured).some((e) => e.event === 'contact.honeypot'));
  assertNoPiiLogged(honeypot.captured);

  assert.equal(turnstileCalls, 0);
  assert.equal(resendCalls, 0);
});

test('turnstile verification failure logs a safe category and never the token', async () => {
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
    const { response, captured } = await captureLogs(
      (e) => worker.fetch(validPost(TEST_IP, { turnstileToken: distinctiveToken }), e),
      env,
    );

    assert.equal(response.status, 400);
    const events = parsedEvents(captured);
    const failed = events.filter((e) => e.event === 'contact.turnstile_failed');
    assert.equal(failed.length, 1);
    const keys = Object.keys(failed[0]);
    assert.ok(keys.includes('category'), 'failure category must be present');
    assert.ok(!keys.includes('token'), 'token field must never be logged');
    assert.ok(!logsToText(captured).includes(distinctiveToken), 'token value must never appear in logs');
    assert.equal(resendCalls, 0);
    assertNoPiiLogged(captured);
  } finally {
    resetTurnstileVerifyHandler();
  }
});

test('resend failures log safe metadata and never email content', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;
  resendHandler = async () =>
    new Response(JSON.stringify({ message: 'rate limit exceeded' }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    });

  try {
    const { response, captured } = await captureLogs(
      (e) => worker.fetch(validPost(), e),
      env,
    );

    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false, error: 'email_failed' });
    const events = parsedEvents(captured);
    const failed = events.filter((e) => e.event === 'contact.resend_failed');
    assert.equal(failed.length, 1);
    assert.equal(failed[0].category, 'http_error');
    assert.equal(failed[0].providerStatus, 429);
    assert.ok(!logsToText(captured).includes('rate limit exceeded'), 'provider body must not be logged');
    assert.ok(!logsToText(captured).includes('test_re_mocked_key'), 'API key must never be logged');
    assertNoPiiLogged(captured);
  } finally {
    resendHandler = async () =>
      new Response(JSON.stringify({ id: 'mocked' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
  }
});

test('a hung Resend call aborts on timeout, returns 502, and logs a timeout event', async () => {
  const env = createEnv();
  env.RESEND_TIMEOUT_MS = 50;
  resendCalls = 0;
  turnstileCalls = 0;

  let providedSignal = null;
  // Simulate a provider that never answers. AbortSignal.timeout()'s internal
  // timer is unref'd, so it would not keep the node --test event loop alive on
  // its own; the ref'd guard below both keeps the loop alive and fails the
  // simulation if the expected abort never arrives.
  resendHandler = (input, init) =>
    new Promise((resolve, reject) => {
      providedSignal = init?.signal ?? null;
      const guard = setTimeout(() => {
        reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
      }, 50);
      init?.signal?.addEventListener('abort', () => {
        clearTimeout(guard);
        const reason = init.signal.reason;
        reject(reason instanceof Error ? reason : new Error(String(reason)));
      });
    });

  try {
    const { response, captured } = await captureLogs(
      (e) => worker.fetch(validPost(), e),
      env,
    );

    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false, error: 'email_failed' });
    const events = parsedEvents(captured);
    const failed = events.filter((e) => e.event === 'contact.resend_failed');
    assert.equal(failed.length, 1);
    assert.equal(failed[0].category, 'timeout');
    assert.equal(failed[0].errorName, 'TimeoutError');
    assert.ok(providedSignal, 'Resend call must pass a timeout signal');
    assert.ok(providedSignal.aborted, 'timeout signal must have been aborted');
    assert.ok(!logsToText(captured).includes('test_re_mocked_key'), 'API key must never be logged');
    assertNoPiiLogged(captured);
  } finally {
    resendHandler = async () =>
      new Response(JSON.stringify({ id: 'mocked' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
  }
});

test('missing RESEND_API_KEY logs an error event without secrets', async () => {
  const env = createEnv({ withKey: false });
  resendCalls = 0;
  turnstileCalls = 0;

  const { response, captured } = await captureLogs((e) => worker.fetch(validPost(), e), env);

  assert.equal(response.status, 502);
  const events = parsedEvents(captured);
  const failed = events.filter((e) => e.event === 'contact.resend_failed');
  assert.equal(failed.length, 1);
  assert.equal(failed[0].category, 'missing_secret');
  assert.ok(!logsToText(captured).includes('test_re_mocked_key'), 'key name/value must not be logged');
  assertNoPiiLogged(captured);
});

test('successful contact submission logs only the accepted event and no PII', async () => {
  const env = createEnv();
  resendCalls = 0;
  turnstileCalls = 0;

  const { response, captured } = await captureLogs(
    (e) => worker.fetch(validPost(TEST_IP, { phone: '+20 107 047 1954' }), e),
    env,
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  const events = parsedEvents(captured);
  assert.equal(events.filter((e) => e.event === 'contact.accepted').length, 1);
  assert.equal(events.filter((e) => e.event === 'contact.accepted')[0].status, 200);

  assert.equal(resendCalls, 1);
  assertNoPiiLogged(captured);
  assert.ok(!logsToText(captured).includes('phone'), 'phone field name must not be logged');
});

test('burst limiter rejection emits a safe rate-limit event', async () => {
  const env = createEnv();
  env.CONTACT_BURST_LIMITER = { limit: async () => ({ success: false }) };
  resendCalls = 0;
  turnstileCalls = 0;

  const { response, captured } = await captureLogs(
    (e) => worker.fetch(validPost(), e),
    env,
  );

  assert.equal(response.status, 429);
  assert.deepEqual(await response.json(), { ok: false, error: 'rate_limited' });
  const events = parsedEvents(captured);
  assert.equal(
    events.filter((e) => e.event === 'contact.rate_limited' && e.category === 'burst').length,
    1,
  );
  assert.ok(events.some((e) => e.status === 429));
  assertNoPiiLogged(captured);
});