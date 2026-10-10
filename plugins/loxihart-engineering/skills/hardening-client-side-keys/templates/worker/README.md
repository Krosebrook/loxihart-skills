# ff-llm-proxy

A fail-closed Cloudflare Worker that proxies LLM calls (Anthropic, OpenAI, Google) so **browser tools never hold provider API keys**. Built to harden `flashfusion_3d.html` and `prompt-engineering-guide-v4.html`, which previously called provider APIs directly from the browser.

## Why this exists

Two failure modes it removes:
1. **Broken client-side calls** — the prompt guide called `api.anthropic.com` from the browser with no key (401).
2. **Keys in the browser** — the 3D tool held Anthropic/OpenAI/Google keys in page memory and used Anthropic's `dangerous-direct-browser-access` header.

The proxy holds keys as Worker secrets. The browser calls the Worker; the Worker adds auth and forwards.

## Security model (why it isn't just an open proxy)

An open proxy holding your keys is *worse* than BYOK — it's an uncapped wallet. This Worker is **fail-closed** and layered:

| Control | Behavior |
|---|---|
| **Auth (required)** | Configure **exactly one**: Turnstile (browser) or a bearer token (server-to-server). Configure neither → every request 503s. |
| **Origin lock** | POSTs must come from an `ALLOWED_ORIGINS` host, else 403. |
| **Model allowlist** | Only known model IDs forward (`src/lib.ts` → `ALLOWED_MODELS`), else 400. The retired `claude-sonnet-4-20250514` is intentionally absent. |
| **max_tokens cap** | Requests over `MAX_TOKENS_CAP` → 400. |
| **Body size cap** | Over `MAX_BODY_BYTES` → 413. |
| **Rate limit** | Per-IP `RATE_PER_MIN` → 429. |
| **Daily spend cap** | Global `DAILY_CAP` requests/day → 429. |
| **Timeout** | Upstream calls abort at 30s → 502. |

**Do not ship `FF_PROXY_TOKEN` in client HTML** — a static token on a public page is extractable. For public browser tools use **Turnstile** (the browser proves "a human on my origin" without a reusable secret). Use the bearer token only for server-to-server callers. For a private toolset, put Cloudflare Access in front of the Worker instead.

## Setup

```bash
npm install
cp .dev.vars.example .dev.vars   # fill in for local dev only; never commit

# Create the KV namespace for rate-limit / spend counters, paste id into wrangler.toml:
npx wrangler kv:namespace create RL

# Set production secrets (never in wrangler.toml or git):
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put OPENAI_API_KEY        # optional
npx wrangler secret put GOOGLE_API_KEY        # optional
npx wrangler secret put TURNSTILE_SECRET      # browser mode (recommended)
# OR, for server-to-server only:
npx wrangler secret put FF_PROXY_TOKEN

# Edit wrangler.toml [vars]: ALLOWED_ORIGINS, caps.
npm test           # unit tests
npm run typecheck  # strict TS, includes the Worker
npm run deploy
```

## API

`POST /v1/anthropic` · `POST /v1/openai` · `POST /v1/google`
Body = the provider-native request body, plus (browser/Turnstile mode) a `_turnstile` field with the widget token. Google's model goes in `body.model`; the Worker moves it to the URL path. `GET /health` → `{ ok: true }`.

Wire a tool by setting `PROXY_BASE` to your deployed Worker URL and calling `${PROXY_BASE}/v1/<provider>` instead of the provider host, with no provider key.

## Known limits (honest)

- **KV counters are read-then-write**, not strictly atomic — a burst can slightly overshoot a cap. It's a cost guardrail, not billing. Use a Durable Object for exact accounting.
- **No streaming** — responses are buffered then returned. Add SSE passthrough if a tool needs token streaming.
- **Hyper3D/Rodin is not proxied** — it stays BYOK in the 3D tool by design (it's the paid core; proxying would put every user's generation on the operator's bill).
- Model allowlist is a manual list — update `ALLOWED_MODELS` when Anthropic ships/retires models.

## Acceptance checklist

- [x] No secret in source or bundle; keys are Worker secrets
- [x] `.dev.vars.example` documents every var, placeholders only
- [x] Fail-closed auth (Turnstile or bearer); 503 if unconfigured
- [x] Origin lock + model allowlist + token/body caps + rate + daily cap
- [x] Every catch handled; upstream timeout; no key/user-content logging
- [x] ≥3 unit tests (`npm test`), strict typecheck clean
- [ ] `wrangler deploy` — operator runs with real secrets
