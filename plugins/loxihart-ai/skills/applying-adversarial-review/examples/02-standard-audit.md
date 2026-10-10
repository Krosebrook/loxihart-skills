# Example 02 — STANDARD Tier (Plan Audit)

**User:** "Audit my plan: migrate the client's file share to SharePoint over
one weekend, cutover Monday."

**Tier call:** Client-facing, hard deadline, moderate blast radius → STANDARD.
All three layers.

**Response shape (abridged):**

> The scope is achievable for <500GB [GENERATED — typical migration throughput],
> but the plan has no rollback line item [SOURCED: your plan text — absent].
>
> ―――
> [SOURCED] Plan contents, client constraints you stated.
> [GENERATED] Throughput assumption, risk weighting.
>
> **CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS**
> - *Claim:* Weekend window is sufficient [GENERATED]
>   *Counterexample:* Fails if the share exceeds ~1TB or throttling kicks in —
>   Monday cutover with a half-migrated share is worse than delaying a week.
> - *Claim:* Permissions mapping is the highest-risk step [GENERATED]
>   *Counterexample:* If the client uses flat permissions, risk shifts to
>   link rot in embedded documents instead.
>
> CONTRADICTIONS:
> ! Plan says "zero user disruption" but also schedules cutover during
>   Monday business hours — those can't both hold.

**What STANDARD did:** found the internal contradiction in the user's own plan.
That line is the whole value of the tier.
