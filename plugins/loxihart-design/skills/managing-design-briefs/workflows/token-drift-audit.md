# Token Drift Audit

Run this against any generated output — code, briefs, or specs —
to catch stale tokens, deprecated values, and profile contamination.

Two methods: manual scan (below) or automated (`scripts/token-drift-check.py`).

---

## When to Run

- After receiving output from v0, Stitch, AI Studio, or any generator
- When reviewing a brief that references an older version
- Before delivering any artifact that builds on a FlashFusion v2 project
- When a component "looks off" but the problem isn't obvious

---

## Deprecated Token Watchlist

### FlashFusion v2 → v3 (May 2026)

Any of these in output = stale tokens. Flag immediately.

| Deprecated (v2) | Replacement (v3) | Type |
|---|---|---|
| `Instrument Sans` | `Geist` | Font |
| `JetBrains Mono` | `Geist Mono` | Font |
| `Poppins` (as heading) | `Instrument Serif` | Font |
| `#0F0618` | `#0B0B14` | Surface |
| `#1A0B2E` | `#13131F` | Surface |
| `#F472B6` | `#EC4899` | Magenta accent |
| `90deg` (gradient direction) | `135deg` | Gradient |
| `bg-black` on cards | Semi-transparent + `blur(12px)` | Card style |
| Nav glass on scroll only | Always-visible floating pill | Nav |
| `--surface-raised: #1A0B2E` | `--surface-raised: #13131F` | CSS variable |

### Cross-Profile Contamination

**Loxihart tokens appearing in FlashFusion output (or vice versa):**

| Value | Belongs to | Wrong in |
|---|---|---|
| `#0a0a0f` | Loxihart | FlashFusion |
| `Space Grotesk` | Loxihart | FlashFusion |
| `IBM Plex Mono` | Loxihart | FlashFusion |
| `hsl(262, 83%, 68%)` (Loxihart violet variant) | Loxihart | FlashFusion |
| `backdrop-filter: blur(...)` on cards | FlashFusion | Loxihart |
| `rgba(..., 0.6)` card backgrounds | FlashFusion | Loxihart |
| `#8B5CF6` / `#A855F7` at FlashFusion saturation | FlashFusion | Loxihart |

---

## Manual Scan Protocol

1. Search the output text/code for every string in the deprecated column above
2. For each match: note the location, flag with severity
3. Replace with the correct v3 value

**Severity:**
- FONT or SURFACE mismatch → HIGH (visually wrong, will render incorrectly)
- GRADIENT direction → MEDIUM (subtle, may look acceptable but is off-brand)
- Cross-profile contamination → HIGH (breaks the profile)

---

## Patch Protocol

After finding drift:

1. List all matches and their locations
2. Apply replacements from the table above
3. Re-scan once after patching to confirm clean
4. If output came from a generator: update the generator prompt before re-running to prevent re-introduction

---

## Drift Audit Output Block

```
Token drift audit complete.
Output scanned: [description of what was audited]
Profile: [Loxihart | FlashFusion]

Deprecated tokens found: [N]
[List each: token — location — severity — replacement applied]

Cross-profile contamination: [none | list]

Status: [CLEAN | PATCHED — N tokens replaced | REQUIRES MANUAL REVIEW]
```
