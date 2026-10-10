# Advanced Design Brief Patterns

Load when: project spans 3+ screens, 2+ Claude calls, or a multi-agent pipeline.
Skip for: single-component or one-shot generation tasks.

---

## Dual-File Session-Commit Pattern

For multi-page or multi-session builds, separate project context from visual ground truth.

| File | Purpose | Load when |
|---|---|---|
| `claude.md` | Project context — objectives, user flows, functional requirements. No design data. | Every session |
| `design.md` | Visual SOT — tokens, typography, spacing, layout rules, anti-patterns, component contracts. | UI work only |

**Why the split:** Tokens in `claude.md` inflate cost on non-UI tasks and pollute agent focus.
`design.md` is loaded only when UI work is active.

**Recursive refinement directive** — include at the top of every `design.md`:
```
At the start of every session, read this file before generating any UI.
If you discover new design values, component rules, or tokens during the session,
append them to the appropriate section before closing the task.
```

**Trigger this pattern when:** project spans >3 screens OR >1 session OR involves multiple
Claude calls in a pipeline.

---

## OKLCH Color System

Hex tokens in the profile files are the locked SOT. OKLCH is an upgrade path for:
- Gradient generation where hex produces muddy midpoints
- Contrast ratio audits (OKLCH lightness is perceptually uniform)
- Authoring a new `design.md` source-of-truth for a multi-page system

**Do NOT replace locked hex tokens in profile files with OKLCH.**
OKLCH is for new work and gradient generation only.

### FlashFusion v3 OKLCH Reference (computed, not approximated)

```css
/* Accents */
#A855F7  →  oklch(62.7% 0.2325 303.9)   /* violet highlight */
#8B5CF6  →  oklch(60.6% 0.2189 292.7)   /* violet base */
#EC4899  →  oklch(65.6% 0.2118 354.3)   /* magenta */
#22D3EE  →  oklch(79.7% 0.1339 211.5)   /* cyan highlight */
#06B6D4  →  oklch(71.5% 0.1257 215.2)   /* cyan base */

/* Surfaces */
#0B0B14  →  oklch(15.5% 0.0191 283.9)   /* surface-1 */
#13131F  →  oklch(19.3% 0.0241 283.9)   /* surface-2 */

/* Text */
#FFFFFF  →  oklch(100%  0      0)        /* primary */
#C7C7D1  →  oklch(83.3% 0.0138 286.1)   /* secondary */
#8A8A96  →  oklch(63.7% 0.0178 285.9)   /* tertiary */
```

**Browser support:** Chrome 111+, Firefox 113+, Safari 15.4+.
Always include hex fallback for targets that may include older browsers:
```css
color: #A855F7;
color: oklch(62.7% 0.2325 303.9);
```

---

## Multi-Session Brief Versioning

When a brief evolves across sessions:

1. Increment the version in the brief header (`v1.0 → v1.1` for minor updates, `v2.0` for structural changes)
2. Add a changelog entry at the bottom of the brief:
   ```
   ## Changelog
   v1.1 — [date] — Updated nav model from sidebar to command palette. Reason: [...]
   ```
3. If token values change: update the `design.md` AND re-run the token drift check on any existing generated output

---

## Pipeline Usage (Stitch / n8n / Multi-Agent)

When passing a brief through a generation pipeline:

- Include the full generator prompt from `templates/generator-prompt-template.md` as the primary prompt
- Append the token block from the active profile file as system context (not user message)
- Flag the anti-pattern list as negative constraints in the system prompt
- Post-generation: always run `workflows/token-drift-audit.md` or `scripts/token-drift-check.py` on the output
