# Good Examples — Create Meta-Prompts

## Strong SUMMARY.md One-Liner
"JWT with jose library via httpOnly cookies recommended — refresh rotation meets OWASP standard"
"4-phase implementation: types → JWT core → refresh → middleware tests, ~6hr estimate"

## Weak SUMMARY.md One-Liner (never produce these)
"Research completed successfully"
"Auth research done"

## Folder Naming
Good: `001-auth-research`, `002-stripe-plan`, `003-checkout-implement`
Bad: `research1`, `my-prompt`, `auth`

## Chain Reference in Prompt
Good: `@.prompts/001-auth-research/auth-research.md` (explicit path)
Bad: "see previous research" (no reference, can't be parsed)
