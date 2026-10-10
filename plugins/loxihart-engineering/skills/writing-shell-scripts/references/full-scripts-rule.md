# Full Scripts Rule

## The Problem

Scripts delivered as partial, truncated, or "fill in the rest" outputs require
the user to cross-reference multiple LLMs to catch what was omitted. This is
the documented failure mode this skill exists to prevent.

## The Rule

**Every script output must be complete and executable as delivered.**

No exceptions. This means:

### What "Complete" Means

- All functions defined — no `# TODO: implement this`
- All variables declared — no `$PLACEHOLDER` or `<YOUR_VALUE_HERE>`
- All error paths handled — no `# handle error here`
- All imports/requires present
- Script runs from top to bottom without modification on a clean machine
  (given correct env vars and permissions)

### What Is NOT Acceptable

```powershell
# BAD — partial output
function Deploy-Agent {
  # TODO: add MSI install logic here
}
```

```bash
# BAD — placeholder
API_KEY="<YOUR_API_KEY>"
```

```powershell
# BAD — truncated
# ... (rest of script omitted for brevity)
```

### What IS Acceptable

Asking a clarifying question BEFORE writing if a critical input is unknown:
> "What's the service name the RMM agent registers under? I need this before
> I can write the idempotency check."

That is not an incomplete script. That is preventing an incorrect script.

### On "Rough Drafts"

If a user asks for a rough draft or quick version:

- Still run the full audit gate
- Still deliver a working script
- A "rough draft" means less polish in comments/README, not missing error handling
- Never deliver a script that will fail on first run

### Enforcement

This rule is enforced by the Audit Gate in Step 3 of SKILL.md.
Any placeholder, TODO, or truncated section is a gate failure.
Gate failures are fixed before output — they are not disclosed to the user
as known issues and shipped anyway.
