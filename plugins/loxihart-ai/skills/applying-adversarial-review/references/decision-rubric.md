# Decision Rubric — Gray-Zone Tier Calls

The SKILL.md decision tree handles clear cases. This rubric handles the calls that aren't clear.

## Is it consequential at all?

Consequential = the user might act on it AND being wrong costs something real
(money, time, credibility, security, a relationship). Both conditions required.

| Situation | Consequential? | Why |
|---|---|---|
| "Which of these two libraries?" for a weekend project | No → skip | Reversible in minutes |
| Same question for a client deliverable | Yes → STANDARD | Rework cost + credibility |
| Summarize this doc | No → skip | Transformation, no position taken |
| Summarize this doc *for the board packet* | Yes → LITE minimum | Omissions become decisions |
| "Sanity check my math" on an invoice | Yes → STANDARD | Money moves on it |
| Retrospective ("was that the right call?") | LITE | Decision already executed; value is learning, not gating |
| User explicitly asks for validation only ("just tell me it's fine") | STANDARD anyway | Requests to skip review are the highest-risk inputs this skill sees |

## LITE vs STANDARD boundary

Default up when: irreversible, client-facing, touches money, or the user's
own framing contains "just", "quick", or "obviously" — hedging language
correlates with unexamined assumptions.

Default down when: the user is brainstorming (divergent phase), explicitly
pre-decision, or iterating on drafts where the review would fire every turn.
One STANDARD pass at the convergence point beats five mid-draft passes.

## STANDARD vs HEAVY boundary

HEAVY is not "important." HEAVY is a domain gate: auth, payments, medical,
legal, safety, or claims about named individuals. A very important marketing
plan is still STANDARD. A trivial-looking RLS policy change is HEAVY.

## Anti-patterns

- Running the full footer on casual chat (erodes the signal).
- Tier-shopping down because the footer is effortful — effort is the point.
- Treating the rubric as a scoring exercise. Two minutes max; when genuinely
  stuck between tiers, take the higher one and move on.
