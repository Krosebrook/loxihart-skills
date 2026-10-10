# Article Schema

The five required sections and validation rules. Loaded when the task is about
what goes in an article or how the validator gates quality. An article missing
any section routes to the KB GAP queue and never publishes.

## Required sections (all five)

1. **Problem** — what the user reported, in one or two sentences. Plain language.
2. **Symptoms** — observable signs that match this problem, so a reader can confirm they're in the right article.
3. **Root Cause** — why it happened. If genuinely unknown, state "Root cause not established" rather than fabricating.
4. **Resolution Steps** — numbered, reproducible, the actual fix. Each step an action.
5. **Prevention and Notes** — how to avoid recurrence, related articles, caveats.

## Article skeleton

```markdown
# {Concise problem title}

## Problem
{1–2 sentences}

## Symptoms
- {observable sign}
- {observable sign}

## Root Cause
{explanation, or "Root cause not established"}

## Resolution Steps
1. {action}
2. {action}

## Prevention and Notes
{prevention + related-article links}

---
Status: Draft   |   Source ticket: {id}   |   Generated: {timestamp}
```

## Validation rules

The validator FAILS an article (→ KB GAP queue) when:

- Any of the five sections is missing or empty.
- Resolution Steps has fewer than 2 actionable steps.
- PII redaction markers indicate unstripped sensitive content.
- The article is a near-duplicate of an existing fresh article.

`[FILL: client quality thresholds — minimum word count per section, required screenshot/attachment policy, reading-level target]`

## Publishing rule

Every validated article is POSTed with **status: draft**. A human reviewer
clears the Draft queue before anything goes live. There is no auto-publish path.
