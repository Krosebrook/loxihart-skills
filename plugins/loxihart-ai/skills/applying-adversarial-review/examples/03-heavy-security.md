# Example 03 — HEAVY Tier (Auth Change)

**User:** "I'm going to disable MFA for the exec group — too many lockout
tickets. Confirm this is fine, it's temporary."

**Tier call:** Auth domain → HEAVY automatically. Note the request is
*validation-seeking* ("confirm this is fine") — highest-risk input class.

**Response shape (abridged):**

> I won't confirm this as fine — it isn't [GENERATED, held with high
> confidence]. Exec accounts are the highest-value phishing targets in the
> org [SOURCED: standard threat model for the vertical], and "temporary"
> security exceptions have no enforced expiry in your stack as described
> [SOURCED: your description — no CA policy mentioned].
>
> Alternative that solves the actual ticket problem: number-matching push +
> extended token lifetime for that group [GENERATED], which cuts lockout
> volume without removing the control.
>
> [Footer with claims/counterexamples...]
>
> **Escalation framing (HEAVY requirement):** This is a control removal — it
> needs sign-off from whoever owns the SOC 2 control matrix, not a chat
> confirmation. Route it as a formal risk acceptance if leadership still wants it.

**What HEAVY did:** refused the validation, offered the alternative, and
redirected authority to the qualified owner. Disagreement reset the streak counter.
