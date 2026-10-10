# Rewiring a browser tool to the proxy

Exact before/after for repointing a single-file HTML tool's `fetch` calls at the Worker and stripping every client-side key. Patterns are provider-native — the Worker forwards the same body, only injecting auth server-side.

## 0. Add the proxy base + Turnstile helper

Near the top of the tool's main `<script>`:

```js
const PROXY_BASE = "https://ff-llm-proxy.REPLACE.workers.dev"; // your deployed Worker
function getTurnstileToken() {
  try { return (window.turnstile && window.turnstile.getResponse()) || ""; }
  catch (e) { return ""; }
}
```

In `<head>`: `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
In `<body>` (outside any re-rendered container): `<div id="cf-ts" class="cf-turnstile" data-sitekey="REPLACE_SITEKEY" data-size="flexible" style="position:fixed;bottom:12px;left:12px;z-index:60"></div>`

## 1. Anthropic

```js
// BEFORE — key in the browser, "dangerous" browser header
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': state.keys.anthropic,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
    'anthropic-beta': 'prompt-caching-2024-07-31',
  },
  body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 300, messages }),
});

// AFTER — no key, proxied, Turnstile token in body
const res = await fetch(`${PROXY_BASE}/v1/anthropic`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 300, messages, _turnstile: getTurnstileToken() }),
});
```

The Worker re-adds `x-api-key`, `anthropic-version`, and the caching beta header server-side. `cache_control` in the body still works (caching is *better* server-side). Any `max_tokens: 0` "prewarm" must become `max_tokens: 1` — Anthropic rejects 0.

## 2. OpenAI

```js
// BEFORE
fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.keys.openai}` },
  body: JSON.stringify({ model: 'gpt-4o', max_tokens: 300, messages }),
});
// AFTER
fetch(`${PROXY_BASE}/v1/openai`, {
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gpt-4o', max_tokens: 300, messages, _turnstile: getTurnstileToken() }),
});
```

## 3. Google (Gemini)

Google carries the model in the URL path and the key in a query param. The proxy needs the model in `body.model` and injects the key itself:

```js
// BEFORE — key in the URL
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.keys.google}`;
fetch(url, { method:'POST', headers:{'Content-Type':'application/json'},
  body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 300 } }) });
// AFTER — add model to the body; proxy moves it to the path and adds the key
fetch(`${PROXY_BASE}/v1/google`, { method:'POST', headers:{'Content-Type':'application/json'},
  body: JSON.stringify({ model: 'gemini-1.5-flash', contents, generationConfig: { maxOutputTokens: 300 }, _turnstile: getTurnstileToken() }) });
```

## 4. Make availability depend on the proxy, not browser keys

Any "is this provider usable?" check that keyed off `state.keys[p].length > 10` now breaks (keys are gone). Repoint it at `PROXY_BASE`:

```js
// BEFORE
function getAvailableProvider() {
  return ORDER.find(p => (state.keys[p] ?? '').trim().length > 10) || null;
}
// AFTER
function getAvailableProvider() {
  return PROXY_BASE ? (state.aiProvider || ORDER[0]) : null;   // proxy holds the keys
}
```

Same idea for any failover chain: it's non-empty whenever `PROXY_BASE` is set. Guards that told the user to "add your API key first" become "proxy not configured (set PROXY_BASE)".

## 5. Remove the dead key inputs

The provider key inputs in the settings/modal are now unused. Replace the panel with a note so the UX matches reality:

> 🔒 LLM keys live in the Worker, never in your browser. (Keep only a *paid-core* BYOK input if you left generation BYOK.)

Removing elements is safe if the JS that referenced them used optional chaining (`getElementById('key-x')?...`); if it didn't, guard it. Leaving unused password inputs on the page is confusing but not a security hole — the security win is that no `fetch` sends a provider key anymore.

## 6. Prove it

```bash
grep -nE "api\.anthropic\.com|api\.openai\.com|generativelanguage\.googleapis\.com|state\.keys\.(openai|anthropic|google)|dangerous-direct-browser-access|<retired-model-id>" tool.html
# MUST return zero hits.
# Then extract inline <script> blocks and `node --check` each for syntax.
```

## Applying edits to an existing file (Kyle's str_replace rule)

Edit the real file with targeted `str_replace` — do **not** rebuild a 1,000+ line HTML file to change a handful of call sites. If the source is a read-only Project doc, `project_read` → make each targeted string change → `project_write` the full updated content back (there is no in-place patch for Project docs, but the *change* is still a set of minimal replacements, not a rewrite). Hold the Project overwrite / deploy for the operator's explicit proceed.
