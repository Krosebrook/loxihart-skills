// ff-llm-proxy — pure, side-effect-free helpers.
// Deliberately free of any Workers-runtime types so these run under plain Vitest.

export type ProviderId = "anthropic" | "openai" | "google";

// Allowlist of model IDs the proxy will forward. Anything else is rejected 400.
// Keeps a leaked origin/token from being used to call arbitrary expensive models,
// and is the single source of truth for the model-deprecation fix
// (claude-sonnet-4-20250514 is intentionally absent — it was retired 2026-06-15).
export const ALLOWED_MODELS: Record<ProviderId, readonly string[]> = {
  anthropic: [
    "claude-sonnet-4-6",
    "claude-sonnet-5",
    "claude-haiku-4-5-20251001",
    "claude-opus-4-8",
  ],
  openai: ["gpt-4o", "gpt-4o-mini"],
  google: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-flash"],
};

export function isProvider(x: string): x is ProviderId {
  return x === "anthropic" || x === "openai" || x === "google";
}

export function isAllowedModel(provider: ProviderId, model: unknown): boolean {
  return typeof model === "string" && ALLOWED_MODELS[provider].includes(model);
}

export function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
  if (!origin) return false;
  return allowed.includes(origin);
}

export function parseBearer(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const m = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return m ? m[1].trim() : null;
}

// Length-safe, constant-time-ish comparison to avoid a trivial timing oracle
// on the shared server-to-server token.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

// Provider-native body shape check + model allowlist + max_tokens cap.
export function validateChatBody(
  provider: ProviderId,
  body: unknown,
  maxTokensCap: number
): ValidationResult {
  if (body == null || typeof body !== "object") {
    return { ok: false, error: "body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;

  if (!isAllowedModel(provider, b.model)) {
    return { ok: false, error: `model not allowed for ${provider}` };
  }

  const maxTokens =
    provider === "google"
      ? (b.generationConfig as Record<string, unknown> | undefined)?.maxOutputTokens
      : b.max_tokens;
  if (maxTokens != null) {
    if (typeof maxTokens !== "number" || maxTokens < 0) {
      return { ok: false, error: "invalid max_tokens" };
    }
    if (maxTokens > maxTokensCap) {
      return { ok: false, error: `max_tokens exceeds cap ${maxTokensCap}` };
    }
  }

  if ((provider === "anthropic" || provider === "openai") && !Array.isArray(b.messages)) {
    return { ok: false, error: "messages[] required" };
  }
  if (provider === "google" && !Array.isArray(b.contents)) {
    return { ok: false, error: "contents[] required" };
  }
  return { ok: true };
}

export function corsHeaders(origin: string | null, allowed: string[]): Record<string, string> {
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, CF-Turnstile-Token",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (isAllowedOrigin(origin, allowed)) {
    h["Access-Control-Allow-Origin"] = origin as string;
  }
  return h;
}

export function parseOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
