# Infographic Reverse-Engineering — Corrected Version

**Source:** "Core Architectural Fix (FlashFusion-Compliant)" infographic, supplied 2026-05-16.
**Status:** Original shipped with OCR rendering noise, garbled Section 7, and an apparent internal contradiction. This document reconstructs the intended framework cleanly, with each claim grounded in Anthropic's published Skills best practices.

---

## What This Document Is

A clean, auditable version of the infographic's framework. Lives in `sot/` because the FRAMEWORK itself is canonical guidance — separate from any single skill's implementation of it. Other future FlashFusion skills should reference this document.

---

## Section 1 — Layer-to-Tool Mapping (Corrected)

The original infographic's right column was unclear (OCR + ambiguous "ideal" framing). Reconstructed against Anthropic's documented patterns:

| Layer | Current Tool | Tool's Role | Anthropic-Aligned Use |
|---|---|---|---|
| **Authority** | FF-PLAT-CORE-SOT (`sot/FF-PLAT-CORE-SOT.md`) | Canonical logic, schemas, contracts | Tier 2 reference document; queried selectively |
| **Hard Constraints** | CLAUDE.md (global + project) | Injected on every turn | Rules and forbidden actions only; ≤200 lines |
| **Execution** | Skills (`skills/*/SKILL.md`) | Workflow + decision logic | Loaded on activation; body <500 lines; references on demand |
| **Adaptation** | Claude Memory | Cross-session continuity | User preferences, project state, feedback — NOT canonical logic |

**Key insight:** the right column isn't "swap your tools" — it's "use each tool for its strength." CLAUDE.md handles invariant rules, Skills handle conditional workflows, SOT handles canonical data, Memory handles user-specific adaptation.

---

## Section 4 — Tier Architecture (Corrected & Expanded)

The 4-tier model is sound. Restated with explicit cost and Anthropic-grounded rationale:

### Tier 0 — Runtime Critical
- **What:** CLAUDE.md (≤ 1,500 tokens; Anthropic recommends ≤ 200 lines)
- **Cost:** Loaded EVERY turn, EVERY session. A 5,000-token CLAUDE.md costs 5K tokens before you've typed a word
- **Contents:** Architecture rules, forbidden actions, API patterns, lane identity
- **NOT contents:** Explanations, examples, philosophy, tutorials

### Tier 1 — Task Context
- **What:** The current prompt + skill body activated by trigger phrases
- **Cost:** Loaded on demand (skill metadata ~500 tokens always; body only on activation)
- **Contents:** Decision tree, current-feature scope, gotchas summary
- **NOT contents:** Other features' workflows, unrelated skills' bodies

### Tier 2 — Authority
- **What:** `sot/FF-PLAT-CORE-SOT.md` and similar canonical documents
- **Cost:** Loaded selectively — read specific sections (`§1`, `§6`) rather than the whole file
- **Contents:** Brand tokens, schemas, panel definitions, CDN whitelists, hard rules
- **Access pattern:** RAG-style — query by section anchor, never inject fully
- **Anti-pattern:** Injecting the entire SOT into CLAUDE.md or a skill body

### Tier 3 — Cold Storage
- **What:** Notion / Supabase / Vector DB / archived references
- **Cost:** Loaded only when explicitly requested
- **Contents:** Historical decisions, expanded design rationale, deprecated patterns kept for audit
- **Access pattern:** Search → retrieve specific chunk

---

## Sections 6 & 7 — Implementation Strategy (Deduped, Contradiction Resolved)

The original Section 6 and Section 7 appeared to be two takes on the same rules with Section 7 partially garbled by OCR. The literal text of Section 7 ("✓ Inject entire FF-PLAT-CORE-SOT") **contradicts** Section 4's Tier 2 rule ("NOT injected fully, Queried selectively"). Logical reconstruction:

### CLAUDE.md (Hard Constraint Layer) — Final Rules

**MAX SIZE:** 1,000–1,500 tokens (Anthropic: under 200 lines)

**INCLUDE ONLY:**
- Architecture rules ("Maintainability > Correctness > Security ...")
- Forbidden actions ("Never deploy on Friday afternoon")
- API patterns ("All endpoints return JSON")
- Lane identity ("PERSONAL: FlashFusion, ChaosClubCo, [PERSON] Apps")

**DO NOT INCLUDE:**
- ✗ Explanations of why a rule exists (move to skill or SOT)
- ✗ Long examples (move to skill references)
- ✗ Philosophy or tone guidance (move to skill descriptions)
- ✗ The entire FF-PLAT-CORE-SOT (corrupts the Tier 2 retrieval pattern)

**STRATEGY:**
- ✓ Store authority CHUNKS in SOT (`sot/FF-PLAT-CORE-SOT.md` sections `§1` through `§10`)
- ✓ Use RAG-style retrieval inside your own system — point skills at specific section anchors
- ✓ Treat CLAUDE.md as a permanent context tax; pay only for what must run every turn

### The Resolved Contradiction

| Source | Says about FF-PLAT-CORE-SOT |
|---|---|
| Section 4, Tier 2 | "NOT injected fully, Queried selectively (RAG-style)" |
| Section 7 (literal OCR) | "✓ Inject entire FF-PLAT-CORE-SOT" |
| **Resolved** | **DO NOT inject. Query selectively.** Section 7's literal text is an OCR/rendering corruption; Section 4 is correct. |

---

## Anthropic Grounding for Each Rule

| Rule | Source |
|---|---|
| CLAUDE.md ≤ 200 lines | Anthropic Skills best practices + Claude Code docs |
| Skill body ≤ 500 lines | Anthropic Skills authoring docs ([official](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)) |
| Progressive disclosure (3 layers: metadata always / body on activation / references on demand) | Anthropic Skills design pattern |
| Reference files load on demand | Anthropic Skills authoring docs |
| "Too much context = blends signals" | Documented rationale for progressive disclosure |
| Bloated CLAUDE.md is ignored | Anthropic public guidance |

---

## How This FlashFusion Artifacts Plugin Implements the Framework

| Framework requirement | Plugin implementation |
|---|---|
| Tier 0 CLAUDE.md ≤ 200 lines | Plugin does not modify CLAUDE.md |
| Tier 1 Skill body ≤ 500 lines | `SKILL.md` v1.1.0 is ~200 lines (navigation layer) |
| Tier 2 SOT queried selectively | `sot/FF-PLAT-CORE-SOT.md` with 10 indexed sections (`§1`–`§10`) |
| References load on demand | `references/phases.md`, `references/patch-playbook.md`, `references/gotchas.md` — each <500 lines |
| LOXIHART quarantine enforced | SOT §8 + skill self-verification checklist + grep step before registration |
| RAG-style retrieval | SKILL.md instructs agent to `Read` SOT by section anchor, not the whole file |

---

## What Was Wrong With the Original Infographic

1. **OCR noise:** "Perssittent," "Mutiple," "Ascess to relevantise," "Inteoad," "executiont," "explanseit 'ons'" — clearly auto-generated/OCR'd image; substance survived, typos accumulated
2. **Section 7 garbled:** literal text reverses Section 4's clear rule. Treat as OCR error
3. **"Ideal" column unexplained:** Section 1's right column didn't make clear whether it was current state, ideal state, or anti-pattern. Reconstructed above as "Anthropic-aligned use"
4. **FF-PLAT-CORE-SOT undefined:** Referenced as a tier but never specified. This SOT document now defines it
5. **Tone × formatting symbol:** Section 4's "Tone× formatting" — unclear if it means "tone AND formatting" or "tone TIMES formatting." Read as "tone + formatting conflicts produce inconsistent execution patterns"

---

## CLAIMS / GAPS

- [SOURCED] Anthropic's 500-line rule for SKILL.md body: [Skill authoring best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [SOURCED] CLAUDE.md ≤ 200 lines guidance: confirmed across multiple ecosystem sources
- [SOURCED] Progressive disclosure 3-layer model: documented Anthropic pattern
- [GENERATED] FF-PLAT-CORE-SOT structure (10 sections, anchor-based retrieval): reverse-engineered from infographic + Anthropic patterns; no prior canonical version existed
- [GENERATED] Resolution of Section 7 contradiction: logical inference that the literal OCR text is corrupted; Section 4 is the intended rule
- [GENERATED] Section 1 right-column interpretation: best fit to documented Anthropic patterns
- !CONTRADICTION (resolved): Section 4 Tier 2 vs Section 7 — resolved by trusting Section 4

## Unknowns

- Whether the original infographic was AI-generated or human-designed (substance suggests human, errors suggest AI-rendered)
- Whether your CLAUDE.md is currently under the 200-line threshold (not measured in this audit)
- Whether `Claude Memory` in your stack means the in-app persistent memory or another system
