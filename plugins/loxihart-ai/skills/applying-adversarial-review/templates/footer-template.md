# Footer Template — CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

Copy this skeleton. Every STANDARD/HEAVY response ends with it.

```
―――

[SOURCED] One line: what in this response came from tools, documents, or prior turns.
[GENERATED] One line: what is inference, framing, or synthesis.

**CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS**

- *Claim:* <load-bearing assertion 1> [SOURCED|GENERATED]
  *Counterexample:* <specific named scenario where this claim breaks>
- *Claim:* <load-bearing assertion 2> [SOURCED|GENERATED]
  *Counterexample:* <specific named scenario where this claim breaks>

CONTRADICTIONS:
! <internal contradiction, conflict with prior context, or conflict with user's stated goal>
! <second contradiction, if found>
```

## Rules

- 2–4 claims. More means the response lacks a spine; fewer means it wasn't consequential.
- Counterexamples name a concrete scenario ("fails if the client runs SQL Server 2016", not "may not always apply").
- CONTRADICTIONS minimum one. If a genuine search finds none, write:
  `CONTRADICTIONS: None found — <reason the space was actually searched>.`
- No unlabeled assertions anywhere in the footer.
- HEAVY tier adds after the footer: one line redirecting to the qualified
  source (counsel, CPA, physician, security review) for the final call.
