import { describe, it, expect } from "vitest";
import {
  isAllowedModel,
  isAllowedOrigin,
  parseBearer,
  safeEqual,
  validateChatBody,
  corsHeaders,
  parseOrigins,
  isProvider,
} from "../src/lib";

describe("model allowlist", () => {
  it("accepts a current allowed model", () => {
    expect(isAllowedModel("anthropic", "claude-sonnet-4-6")).toBe(true);
  });
  it("rejects the retired model and non-strings", () => {
    expect(isAllowedModel("anthropic", "claude-sonnet-4-20250514")).toBe(false);
    expect(isAllowedModel("anthropic", 123 as unknown)).toBe(false);
    expect(isAllowedModel("openai", "gpt-5-ultra")).toBe(false);
  });
});

describe("origin allowlist", () => {
  const allowed = ["https://tools.flashfusion.co"];
  it("reflects only allowlisted origins", () => {
    expect(isAllowedOrigin("https://tools.flashfusion.co", allowed)).toBe(true);
    expect(isAllowedOrigin("https://evil.example", allowed)).toBe(false);
    expect(isAllowedOrigin(null, allowed)).toBe(false);
  });
  it("cors omits ACAO for a disallowed origin", () => {
    expect(corsHeaders("https://evil.example", allowed)["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(corsHeaders("https://tools.flashfusion.co", allowed)["Access-Control-Allow-Origin"]).toBe(
      "https://tools.flashfusion.co"
    );
  });
});

describe("bearer parse + constant-time compare", () => {
  it("parses a bearer token", () => {
    expect(parseBearer("Bearer abc123")).toBe("abc123");
    expect(parseBearer(null)).toBe(null);
    expect(parseBearer("Basic xyz")).toBe(null);
  });
  it("safeEqual is correct and length-safe", () => {
    expect(safeEqual("secret", "secret")).toBe(true);
    expect(safeEqual("secret", "secreu")).toBe(false);
    expect(safeEqual("a", "ab")).toBe(false);
  });
});

describe("body validation", () => {
  it("rejects a disallowed model", () => {
    expect(validateChatBody("anthropic", { model: "gpt-4o", messages: [] }, 4096).ok).toBe(false);
  });
  it("rejects over-cap max_tokens", () => {
    expect(
      validateChatBody("anthropic", { model: "claude-sonnet-4-6", max_tokens: 999999, messages: [] }, 4096).ok
    ).toBe(false);
  });
  it("accepts a valid anthropic body", () => {
    expect(
      validateChatBody(
        "anthropic",
        { model: "claude-sonnet-4-6", max_tokens: 300, messages: [{ role: "user", content: "hi" }] },
        4096
      ).ok
    ).toBe(true);
  });
  it("requires contents[] for google and enforces its token cap", () => {
    expect(validateChatBody("google", { model: "gemini-1.5-flash" }, 4096).ok).toBe(false);
    expect(validateChatBody("google", { model: "gemini-1.5-flash", contents: [] }, 4096).ok).toBe(true);
    expect(
      validateChatBody(
        "google",
        { model: "gemini-1.5-flash", contents: [], generationConfig: { maxOutputTokens: 99999 } },
        4096
      ).ok
    ).toBe(false);
  });
});

describe("misc helpers", () => {
  it("parseOrigins splits + trims + drops empties", () => {
    expect(parseOrigins("a, b ,c")).toEqual(["a", "b", "c"]);
    expect(parseOrigins(undefined)).toEqual([]);
    expect(parseOrigins("")).toEqual([]);
  });
  it("isProvider guards the union", () => {
    expect(isProvider("anthropic")).toBe(true);
    expect(isProvider("google")).toBe(true);
    expect(isProvider("bogus")).toBe(false);
  });
});
