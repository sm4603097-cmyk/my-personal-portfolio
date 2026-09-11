import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

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
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests";

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

function createEnv({ withKv = true, withKey = true } = {}) {
  return {
    RESEND_API_KEY: withKey ? 'test_re_mocked_key' : undefined,
    RESEND_FROM: 'sender@example.com',
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
let originalFetch;
let resendHandler = async () =>
  new Response(JSON.stringify({ id: 'mocked' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

before(() => {
  originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    if (String(input).includes('api.resend.com')) {
      resendCalls += 1;
      return resendHandler();
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