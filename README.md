# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Contact Form Backend

The contact form submits to `POST /api/contact`, handled by the Cloudflare Worker entrypoint at `src/worker.ts`. It validates input, applies honeypot + IP rate limiting, and delivers an email through the Resend API to `sm4603097@gmail.com`.

### Architecture

This project deploys as a Cloudflare Worker with Static Assets: `npm run build` produces `dist/`, which is served by the Worker's `ASSETS` binding, and the same Worker handles `POST /api/contact`.

```
Browser (same origin)
  → POST /api/contact
  → Cloudflare Worker (src/worker.ts)
  → honeypot + rate limiting + validation
  → Resend API (server-side secret RESEND_API_KEY)
  → sm4603097@gmail.com
```

The Worker runs first for every request (`assets.run_worker_first = true`). Requests to `/api/contact` are handled; all other routes are forwarded to `env.ASSETS.fetch(request)`, so the static site is served exactly as before. The production project name `my-personal-portfolio` is unchanged, so the existing production URL keeps working.

### Required Cloudflare setup

1. Deploy the Worker script so the project is no longer "static assets only" (that state blocks adding variables/bindings). Run `npm run deploy` (builds and runs `wrangler deploy`).
2. Create a KV namespace: `npx wrangler kv namespace create CONTACT_RATE_LIMIT_KV`, then paste the returned `id` into the `[[kv_namespaces]]` block in `wrangler.toml` (currently `REPLACE_WITH_NAMESPACE_ID`). This powers rate limiting (max 5 submissions per IP per hour). KV never holds user content, only a hashed per-IP counter.
3. Set the Resend secret: `npx wrangler secret put RESEND_API_KEY` (or dashboard → Worker → Settings → Variables and Secrets). It stays server-side; it is never exposed to frontend JavaScript.
4. Optional: add a `RESEND_FROM` variable (dashboard → Variables, or a `[vars]` block). The default `onboarding@resend.dev` works only for sandbox/demo sending to the account owner's inbox. For real production delivery from `sm4603097@gmail.com` you must verify a domain in Resend and set `RESEND_FROM` to an address on that verified domain.

### Local development

1. `npm install` (includes `wrangler` as a devDependency).
2. Copy `.dev.vars.example` to `.dev.vars` and add a real `RESEND_API_KEY`. `.dev.vars` is gitignored.
3. Build once: `npm run build`.
4. Run the Worker locally with static assets: `npx wrangler dev --port 8787`.
5. In a second terminal run `npm run dev`; Vite proxies `/api` to `http://localhost:8787`.

The mail recipient (`sm4603097@gmail.com`) is fixed in `src/worker.ts`; the visitor email is only ever used as the Resend `reply_to` field.

No real secret values live in the repository.
