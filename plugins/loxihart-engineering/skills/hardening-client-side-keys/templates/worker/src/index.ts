// ff-llm-proxy — Cloudflare Worker.
// Server-side LLM proxy so browser tools never hold provider API keys.
// Fail-closed: refuses to run unless an auth mode is configured.

import {
  ProviderId,
  isProvider,
  validateChatBody,
  corsHeaders,
  isAllowedOrigin,
  parseBearer,
  safeEqual,
  parseOrigins,
} from "./lib";

export interface Env {
  RL: KVNamespace;
  ALLOWED_ORIGINS?: string;
  MAX_TOKENS_CAP?: string;
  MAX_BODY_BYTES?: string;
  RATE_PER_MIN?: string;
  DAILY_CAP?: string;
  FF_PROXY_TOKEN?: string;
  TURNSTILE_SECRET?: string;
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
}

type Target = { url: string; headers: Record<string, string> } | { error: string };

const PROVIDER_TARGET: Record<ProviderId, (env: Env, body: Record<string, unknown>) => Target> = {
  anthropic: (env) => {
    if (!env.ANTHROPIC_API_KEY) return { error: "anthropic not configured" };
    return {
      url: "https://api.anthropic.com/v1/messages",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
    };
  },
  openai: (env) => {
    if (!env.OPENAI_API_KEY) return { error: "openai not configured" };
    return {
      url: "https://api.openai.com/v1/chat/completions",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.OPENAI_API_KEY}` },
    };
  },
  google: (env, body) => {
    if (!env.GOOGLE_API_KEY) return { error: "google not configured" };
    const model = String(body.model ?? "");
    return {
      url:
        `https://generativelanguage.googleapis.com/v1beta/models/` +
        `${encodeURIComponent(model)}:generateContent?key=${env.GOOGLE_API_KEY}`,
      headers: { "content-type": "application/json" },
    };
  },
};

function json(data: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...extra },
  });
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    if (!r.ok) return false;
    const d = (await r.json()) as { success?: boolean };
    return d.success === true;
  } catch {
    // Network failure verifying the challenge = deny (fail closed).
    return false;
  }
}

// KV-backed guardrails. Increments are read-then-write (not strictly atomic);
// acceptable for a cost/abuse guardrail. Upgrade to a Durable Object if you need
// exact accounting. See README "Known limits".
async function underLimits(
  env: Env,
  ip: string,
  ratePerMin: number,
  dailyCap: number,
  ctx: ExecutionContext
): Promise<{ ok: boolean; reason?: string }> {
  const now = new Date();
  const minuteBucket = `rl:${ip}:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}-${now.getUTCMinutes()}`;
  const dayBucket = `spend:${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;

  const [minRaw, dayRaw] = await Promise.all([env.RL.get(minuteBucket), env.RL.get(dayBucket)]);
  const minCount = minRaw ? parseInt(minRaw, 10) : 0;
  const dayCount = dayRaw ? parseInt(dayRaw, 10) : 0;

  if (minCount >= ratePerMin) return { ok: false, reason: "per-minute rate limit" };
  if (dayCount >= dailyCap) return { ok: false, reason: "daily cap reached" };

  ctx.waitUntil(env.RL.put(minuteBucket, String(minCount + 1), { expirationTtl: 120 }));
  ctx.waitUntil(env.RL.put(dayBucket, String(dayCount + 1), { expirationTtl: 172800 }));
  return { ok: true };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowed = parseOrigins(env.ALLOWED_ORIGINS);
    const cors = corsHeaders(origin, allowed);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return json({ ok: true, service: "ff-llm-proxy" }, 200, cors);
    }

    if (request.method !== "POST") {
      return json({ error: "method not allowed" }, 405, cors);
    }

    const match = /^\/v1\/([a-z]+)\/?$/.exec(url.pathname);
    if (!match) return json({ error: "not found" }, 404, cors);
    const provider = match[1];
    if (!isProvider(provider)) return json({ error: "unknown provider" }, 404, cors);

    // Origin lock: browser POSTs must originate from an allowlisted host.
    if (!isAllowedOrigin(origin, allowed)) {
      return json({ error: "origin not allowed" }, 403, cors);
    }

    const maxTokensCap = parseInt(env.MAX_TOKENS_CAP || "4096", 10);
    const maxBodyBytes = parseInt(env.MAX_BODY_BYTES || "2000000", 10);
    const ratePerMin = parseInt(env.RATE_PER_MIN || "20", 10);
    const dailyCap = parseInt(env.DAILY_CAP || "1000", 10);

    const raw = await request.text();
    if (raw.length > maxBodyBytes) return json({ error: "payload too large" }, 413, cors);

    let body: Record<string, unknown>;
    try {
      const parsed = JSON.parse(raw);
      if (parsed == null || typeof parsed !== "object") throw new Error("not an object");
      body = parsed as Record<string, unknown>;
    } catch {
      return json({ error: "invalid JSON body" }, 400, cors);
    }

    // --- Auth: fail closed. Configure exactly one mode. ---
    const ip = request.headers.get("CF-Connecting-IP");
    const turnstileToken =
      request.headers.get("CF-Turnstile-Token") ??
      (typeof body._turnstile === "string" ? (body._turnstile as string) : null);

    if (env.TURNSTILE_SECRET) {
      if (!turnstileToken) return json({ error: "turnstile token required" }, 401, cors);
      const ok = await verifyTurnstile(env.TURNSTILE_SECRET, turnstileToken, ip);
      if (!ok) return json({ error: "turnstile verification failed" }, 401, cors);
    } else if (env.FF_PROXY_TOKEN) {
      const tok = parseBearer(request.headers.get("Authorization"));
      if (!tok || !safeEqual(tok, env.FF_PROXY_TOKEN)) {
        return json({ error: "unauthorized" }, 401, cors);
      }
    } else {
      // Neither auth mode configured -> never run open.
      return json({ error: "proxy auth not configured" }, 503, cors);
    }

    // Strip proxy-only fields before forwarding to the provider.
    delete body._turnstile;

    const valid = validateChatBody(provider, body, maxTokensCap);
    if (!valid.ok) return json({ error: valid.error }, 400, cors);

    if (ip) {
      const limit = await underLimits(env, ip, ratePerMin, dailyCap, ctx);
      if (!limit.ok) return json({ error: limit.reason }, 429, cors);
    }

    const target = PROVIDER_TARGET[provider](env, body);
    if ("error" in target) return json({ error: target.error }, 503, cors);

    // Google carries the model in the URL path; drop it from the forwarded body.
    const forwardBody =
      provider === "google"
        ? (() => {
            const clone = { ...body };
            delete clone.model;
            return clone;
          })()
        : body;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const upstream = await fetch(target.url, {
        method: "POST",
        headers: target.headers,
        body: JSON.stringify(forwardBody),
        signal: controller.signal,
      });
      const text = await upstream.text();
      // Structured, non-sensitive log: never the key, never user content.
      console.log(JSON.stringify({ evt: "proxy", provider, model: body.model, status: upstream.status }));
      return new Response(text, {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") || "application/json",
          ...cors,
        },
      });
    } catch (err) {
      const aborted = err instanceof Error && err.name === "AbortError";
      console.log(JSON.stringify({ evt: "proxy_error", provider, aborted }));
      return json({ error: aborted ? "upstream timeout" : "upstream request failed" }, 502, cors);
    } finally {
      clearTimeout(timeout);
    }
  },
};
