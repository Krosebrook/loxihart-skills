# Voice guardrails

Checklist applied to every template in this skill. Run before returning any draft.

## The 7 anti-slop gates

### Gate 1 — No hype adjectives
Cut: game-changer, revolutionary, cutting-edge, seamless, robust, leverage, unlock, power of, world-class, best-in-class, next-gen, transformative, ultimate, definitive.

If the claim needs one of these adjectives to land, the claim isn't strong enough. Replace the adjective with evidence or cut the claim.

### Gate 2 — No AI tells
Cut: "in today's fast-paced world," "in conclusion," "it's important to note," "let's dive in," "here's the thing," "not only X but also Y," "the key takeaway is," triple-parallel structures ("it empowers, enables, and elevates"), the em-dash sandwich ("AI — a technology that is transforming everything — is here to stay").

### Gate 3 — Sentence case in headings
Never Title Case. Never ALL CAPS for emphasis. Bold and weight do the work.

### Gate 4 — Evidence before adjective
"Fast" without a number is an opinion. "320ms p50 latency" is a claim.

### Gate 5 — One claim per line in short-form
Stacked claims dilute each other. "FlashFusion is fast, easy, and affordable" is three weak claims. Pick the strongest.

### Gate 6 — Concrete over abstract
"Increases engagement" → "customers spend 4 minutes on the page instead of 90 seconds."
"Improves workflow" → "cuts the intake form from 12 fields to 4."

### Gate 7 — No rhetorical questions as section headers
"Why does this matter?" as a subhead is an AI tell and a filler move. Name the answer directly.

## Voice lane overrides

Each lane has a dominant voice that overrides defaults where they conflict:

### FlashFusion
- Direct. Peer-to-peer.
- Creator-tech vocabulary welcome ("stack," "ship," "build," "workflow").
- Opinions defended, not asserted.
- No corporate-speak. No "our team is excited to announce."

### chaosclub
- Reading Room at Midnight.
- Low, unrushed.
- Concrete image before abstract argument.
- No self-help cadence. No life-lesson landing.
- One particular before any universal.
- The liner note is the only place to speak directly, and under 150 words.

### The Prompt
- Tier-dependent.
  - Loxihart: candid, acronym-dense, action-oriented, CLAIMS/GAPS footer mandatory.
  - Client-facing: plain English, no jargon, concrete actions we're taking.
  - Public: first-person, one idea per edition, commitment at the end.
- Never bounce a client-facing or public tier without Loxihart gate.

### Loxihart
- Imperative mood in procedures.
- Verbs first in ticket updates.
- Evidence over adjectives, always.
- Blameless in incident writeups. Name systems and decisions, not people.
- Kyle reaches out only to [PERSON] for escalations, never about AI.

## The read-aloud rule

Every spoken-word template (video/audio library) gets read aloud before shipping. Every threaded-social post gets scrolled through on phone before shipping (desktop preview lies about line breaks). Every FF customization email gets read with a pretend customer voice answering each line.

If anything makes you flinch, cut it.

## CLAIMS / GAPS footer — when to include

Include on:
- Case study threads (#6 in threaded-social)
- Counter-intuitive take threads (#2)
- Myth-busting threads (#10)
- Prediction threads (#13)
- Build-in-public threads with metrics (#20)
- Public post-mortems (#19)
- The Prompt Loxihart tier
- Any video/audio script that cites data

Skip on:
- Pure narrative (chaosclub voice notes)
- Procedural (FF intake forms, confirmation emails, etc)
- Short-form video where the footer would break flow

Footer format:
```
CLAIMS: {{specific-testable-claim}} — source: {{}}
GAPS: {{what I didn't test / what I don't know}}
COUNTEREXAMPLES: {{cases where this take wouldn't hold}}
[SOURCED] {{citations}}
[GENERATED] {{opinion / extrapolation}}
```

## The agreement-streak flag

If Kyle has agreed with your last 2 suggestions on a consequential decision (scope, pricing, voice, approach), flag ⚠ on the 3rd.

Pattern:
> ⚠ Agreement streak: 3 consecutive agreements on {{topic}}. If there's a counterexample I should be surfacing, this is the moment.

Then state the strongest counterargument you can construct, even if you don't believe it.

## Security hard rule

Never expose secrets, API keys, tokens, or credentials in any template. Environment variables, server-side access, and secret-management systems only. This applies to every template in this skill — especially templates that touch Stripe, R2, Firebase, or any third-party API.

If a template's fillable slot risks encouraging a customer-facing doc to contain a secret, re-write the slot.
