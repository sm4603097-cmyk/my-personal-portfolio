# My Personal Portfolio

A bilingual (Arabic / English) portfolio site for **Alhassan Mohamed** — a full-stack product engineer. The site presents his work through a narrative, evidence-driven structure: hero, proof-of-work, a flagship case study (the Quran Learning Platform), a project portfolio, an engineering skills matrix, education & credentials, a security architecture simulation, a methodology breakdown, post-delivery guarantees, and a project scoper contact section.

The site ships as a **Cloudflare Worker with static assets** (see [Architecture](#architecture)); the same Worker powers the `POST /api/contact` endpoint backed by Cloudflare Turnstile + server-side rate limiting, delivering inquiries via the Resend API.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript (strict mode, `noUnusedLocals`/`noUnusedParameters`) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (class-based dark mode, fully custom design tokens) |
| Motion | Framer Motion (section reveals, scroll-triggered stagger, animated counters) |
| Icons | lucide-react |
| Fonts | Self-hosted woff2 (Outfit, JetBrains Mono, Space Grotesk, Cairo, Tajawal) with `font-display: swap` |
| Backend | Cloudflare Workers (`src/worker.ts`) |
| Anti-abuse | Cloudflare Turnstile + honeypot + KV-based per-IP and global rate limiting |
| Email | Resend API (server-side secret only) |
| Tests | Node's built-in test runner (`node --test`) + oxlint |

## Key features

- **Dual language, RTL-ready** — full Arabic/English content with bidi-safe metric rendering (`splitMetricSegments`) and a one-click language toggle.
- **Proof-driven narrative** — animated counters, verified credentials, and a flagship case-study section built around shipped artifacts rather than marketing claims.
- **Lazy streaming sections** — every below-the-fold section is code-split AND gated behind an IntersectionObserver, so the initial HTML/JS payload stays small.
- **Fast first load** — inlined critical CSS, preconnect-free self-hosted fonts, reduced-motion support, and cached immutable assets.
- **A11y & resilience** — 44px touch targets, focus-trap dialogs, skip-nav, ARIA labeling, bilingual alt text, and `prefers-reduced-motion` honored throughout.
- **Hardened contact channel** — WhatsApp deep links with a personalized prefilled message, tel:, mailto:, Telegram, and social links.
- **Zero-trust contact form** — honeypot trap, byte caps, schema validation, per-IP rate limits, Turnstile verification, and generic error messages that never leak internals.

## Architecture

```
Browser (same origin)
  → static assets served by the Worker via env.ASSETS
  → POST /api/contact
  → Cloudflare Worker (src/worker.ts)
  → honeypot + input validation + rate limiting
  → Turnstile verification (fails closed)
  → Resend API (server-side secret RESEND_API_KEY)
  → sm4603097@gmail.com
```

The Worker runs first for every request (`assets.run_worker_first = true`). Requests to `/api/contact` are handled; all other routes are forwarded to `env.ASSETS.fetch(request)`, so the static site is served as before. Production is served at `https://my-personal-portfolio.salama-8377.workers.dev`.

## Local development

1. `npm install` (includes `wrangler` as a devDependency).
2. Copy `.dev.vars.example` to `.dev.vars` and add a real `RESEND_API_KEY`. `.dev.vars` is gitignored.
3. Build once: `npm run build`.
4. Run the Worker locally with static assets: `npx wrangler dev --port 8787`.
5. In a second terminal run `npm run dev`; Vite proxies `/api` to `http://localhost:8787`.

The mail recipient (`sm4603097@gmail.com`) is fixed in `src/worker.ts`; the visitor email is only ever used as the Resend `reply_to` field.

### Required Cloudflare setup (production)

1. Deploy the Worker script so the project is no longer "static assets only" (that state blocks adding variables/bindings). Run `npm run deploy` (builds and runs `wrangler deploy`).
2. Create a KV namespace: `npx wrangler kv namespace create CONTACT_RATE_LIMIT_KV`, then paste the returned `id` into the `[[kv_namespaces]]` block in `wrangler.toml` (currently `REPLACE_WITH_NAMESPACE_ID`). This powers rate limiting (max 5 submissions per IP per hour). KV never holds user content, only a hashed per-IP counter.
3. Set the Resend secret: `npx wrangler secret put RESEND_API_KEY` (or dashboard → Worker → Settings → Variables and Secrets). It stays server-side; it is never exposed to frontend JavaScript.
4. Set the Turnstile secret: `npx wrangler secret put TURNSTILE_SECRET_KEY`. The public site key lives in `src/data/siteConfig.ts`.
5. Optional: add a `RESEND_FROM` variable (dashboard → Variables, or a `[vars]` block). The default `onboarding@resend.dev` works only for sandbox/demo sending to the account owner's inbox. For real production delivery from `sm4603097@gmail.com` you must verify a domain in Resend and set `RESEND_FROM` to an address on that verified domain.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (proxies `/api` to the local Worker) |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run lint` | oxlint |
| `npm test` | Node test runner (`test/`) |
| `npm run preview` | Preview the built `dist/` |
| `npm run deploy` | Build + `wrangler deploy` |

No real secret values live in the repository.