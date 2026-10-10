# Auth-mode decision — public vs private vs server-to-server

The single decision that determines whether the hardened design is real or theater. Pick before writing the Worker config.

## The question that drives everything

**Who loads the page / calls the proxy, and can you identify them?**

| Caller | Correct gate | Why | What NOT to do |
|---|---|---|---|
| **Public browser tool** — anyone on the internet can open it | **Cloudflare Turnstile** (challenge token per call) + origin lock + caps | The browser proves "a human on my origin" without carrying a reusable secret. The token is single-use and verified server-side. | Do not ship a bearer token — it is extractable from the page and becomes a free key for anyone. |
| **Private tool** — you, or a known set of people | **Cloudflare Access** (Zero Trust) in front of the Worker | Real identity (Google/GitHub/OTP login) → session cookie, not a static secret. Strongest option when you can enumerate users. | Do not rely on "nobody knows the URL" — obscurity is not a gate. |
| **Server-to-server** — another backend calls it, no browser | **Bearer token** (`FF_PROXY_TOKEN`), constant-time compared | The secret lives only on servers you control; never rendered to a client. | Never put this token in client HTML/JS, even "temporarily". |

## The who-pays flag (say it out loud every time)

Moving a BYOK tool to a proxy silently changes **who pays for usage**:

- BYOK: the *user's* key, the *user's* bill, the *user's* choice of spend.
- Proxy: *your* key, *your* bill. An open or weakly-gated proxy is an **uncapped wallet** — a stranger can run up your provider bill.

So a proxy is only an improvement over BYOK when it is **gated + capped**. If you cannot gate it (truly anonymous public), you must lean hard on: Turnstile, a small `max_tokens` cap, a per-IP rate limit, a **global daily spend cap**, and a tight model allowlist. Those together bound worst-case spend.

## Keep the paid core BYOK

Not every key should move server-side. Split by cost and purpose:

- **LLM text calls** (prompt enhance, analysis, vision) — cheap-ish, uniform JSON in/out → **proxy them**. This is the real client-side-key surface.
- **Paid generation core** (image, 3D mesh, video, audio) — expensive per call and often the *point* of the tool → **leave BYOK** unless you explicitly want to fund every user's generations. Proxying it puts each ~$0.30+ generation on your bill and invites abuse.

State this as a scoped decision the operator can override, not a silent choice. Example: "LLM calls move behind the proxy; Rodin/Hyper3D stays BYOK because proxying it bills every user's 3D generation to you."

## Turnstile wiring (public mode)

1. Create a Turnstile widget in the Cloudflare dashboard → get a **sitekey** (public, goes in the HTML) and a **secret** (goes in `wrangler secret put TURNSTILE_SECRET`).
2. Add `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>` to `<head>`.
3. Render one widget: `<div class="cf-turnstile" data-sitekey="YOUR_SITEKEY"></div>`. Put it *outside* any container your app re-renders via `innerHTML`, or it gets wiped.
4. Read the token per call: `window.turnstile.getResponse()` and send it as `_turnstile` in the request body.
5. The Worker verifies via `https://challenges.cloudflare.com/turnstile/v0/siteverify`; verification failure or a network error → deny (fail closed).

## Cloudflare Access wiring (private mode)

Put the Worker behind an Access application (Zero Trust → Access → Applications), scoped to the Worker's route. Define a policy (allowed emails / IdP group). Access injects a signed JWT; the Worker can additionally verify the `Cf-Access-Jwt-Assertion` header against your team's public keys for defense in depth. No secret ships to the browser.

## Failure posture

Fail **closed** at every ambiguity: no auth mode configured → 503; Turnstile unreachable → deny; origin not allowlisted → 403; model not on the list → 400; over a cap → 429. A proxy that "fails open" under load is the same open wallet you were trying to avoid.
