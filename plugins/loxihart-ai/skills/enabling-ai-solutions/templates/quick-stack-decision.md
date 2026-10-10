# Template: Quick Stack Decision

Use for: fast technology answers, A vs. B comparisons, "what should I use for X" questions.
Time to complete: 2–5 minutes.
See `examples/quick-stack-selection.md` for a completed output using this template.

---

## Quick Stack Decision: [Use Case in 3–6 words]

**Recommendation:** [Primary stack or choice in one sentence. Be direct — name the thing.]

**Why:** [2–3 sentences. State the key constraint(s) that drove the decision, then explain why the recommendation satisfies them. Don't hedge unless there's a genuine toss-up.]

**Stack:**
- **LLM:** [model + tier rationale]
- **Backend:** [framework + why this one]
- **Data:** [DB / vector store + why]
- **Hosting:** [platform + why]
- **Auth:** [solution, or "none needed"]
- **Observability:** [minimum viable: PostHog + Sentry unless justified otherwise]

**Tradeoffs:**
- ✅ [Primary win — what this choice optimizes for]
- ✅ [Secondary win if applicable]
- ⚠️ [What this trades off — be honest]
- ⚠️ [Second tradeoff if real]

**If [constraint X changes], switch to:** [alternative + one-line reason]

**Estimated monthly cost:** $[range] at [assumed scale]

---

## Authoring Notes (remove before delivering)

- Keep the recommendation in the first sentence. Don't bury it.
- If it's genuinely a toss-up, say so and give a tie-breaker criterion ("if you're already on Supabase, use pgvector; otherwise Pinecone").
- Tradeoffs section must include at least one ⚠️. If you can't find one, you're not looking hard enough.
- "Estimated monthly cost" is mandatory even if it's a range. Makes the decision real.
- Do not expand this into a spec doc. If the question needs a spec doc, use `templates/spec-doc.md`.
