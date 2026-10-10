# Brand Config — Abstrekkt (LOCKED TOKENS)

Locked tokens are IMMUTABLE — the pipeline consumes them, never regenerates
them. Anything not listed here is generated at compile time and may vary;
anything listed here may not.

## Locked identity tokens

| Token | Value | Status |
|---|---|---|
| `font.display` | **Fraunces** | LOCKED |
| `font.body` | **Crimson Pro** | LOCKED |
| `font.code` | **JetBrains Mono** | LOCKED |
| `color.brass` (primary accent) | **#c8a86a** | LOCKED |
| Theme default | **Dark-first** ("Reading Room" — warm dark surfaces, brass accents, literary texture) | LOCKED |

Cross-check against `designing-abstrekkt-systems` before compiling — that
skill is the canonical brand authority; on any conflict, it wins and this
file gets updated in the same change.

## Generated-at-compile (NOT locked — OKLCH with hex fallbacks)

Surface ramp (dark-first, warm bias), text hierarchy on dark, brass
interaction states (hover/active/focus derived from #c8a86a), semantic
status colors tuned for the dark ground, type scale off the locked families,
spacing/radius/shadow primitives.

## Usage rules

- Brass is an *accent*: interactive elements, moments of emphasis — never
  large fills or body text.
- Fraunces for display/headings only; body text is always Crimson Pro;
  anything monospaced is JetBrains Mono — no fourth family, ever.
- Sub-brands (FlashFusion surfaces under Abstrekkt) namespace their tokens;
  they never mutate the parent's locked set.
- Accessibility floor at compile gate: text-on-surface pairs ≥ 4.5:1 (AA);
  brass-on-dark for *text* must be verified per pair, not assumed.
