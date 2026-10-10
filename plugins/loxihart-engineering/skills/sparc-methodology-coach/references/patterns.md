# Patterns Reference — SPARC Methodology Coach

## Full Pseudocode Example: authenticate_user

```
FUNCTION authenticate_user(email, password):
  INPUT: email (string, validated format), password (string, 8+ chars)
  OUTPUT: session_token (string) OR error (object: code + message)

  Find user by email in database
  IF user not found:
    RETURN error(401, "Invalid credentials")  // Generic — don't leak email existence

  IF user.account_locked_until > now():
    RETURN error(429, "Account locked. Try again after [timestamp]")

  Compare password against stored hash using bcrypt
  IF no match:
    Increment failed_attempt_count
    IF failed_attempt_count >= 5:
      Set account_locked_until = now() + 15 minutes
      RETURN error(429, "Account locked due to failed attempts")
    RETURN error(401, "Invalid credentials")

  Reset failed_attempt_count to 0
  Generate JWT: { user_id, email, issued_at, expires_in: 24h }
  Store session record: (user_id, token_hash, ip_address, created_at)
  RETURN session_token
```

This pseudocode surfaced 3 things "just write the code" misses: lockout check order, counter reset on success, session record storage.

---

## Acceptance Criteria Patterns

### Given/When/Then (preferred)
```
Given a user with 5 consecutive failed logins,
When they attempt login again (correct or incorrect),
Then they receive HTTP 429 with a lockout expiry timestamp.
```

### Table format (complex features)
| # | Criterion | Priority | Test? |
|---|---|---|---|
| 1 | Login returns JWT on valid credentials | P0 | Unit |
| 2 | Login returns 401 on wrong password | P0 | Unit |
| 3 | Account locks after 5 failures | P0 | Integration |
| 4 | Lock releases after 15 minutes | P1 | Unit (fake timer) |

---

## Architecture Decisions Log

```markdown
### Decision: Supabase Auth vs. Custom JWT

Chose: Supabase Auth
Considered: Custom JWT (full control), Clerk ($X/month at scale)
Why: RLS policies reference auth.uid() directly — no cross-vendor context switching
Tradeoff accepted: Less flexibility for non-standard JWT claims later
Mitigation: Supabase supports custom claims via JWT templates if needed
```

---

## SPARC + staff-engineer-v4 Integration

```
staff-engineer-v4 Step 4 (Implement)
  → SPARC Phase S: informed by Clarify output (Step 1) + WSJF (Step 2)
  → SPARC Phase A: validates the File & Module Plan (Step 4)
  → SPARC Phase R: tests cover the security checklist items (Step 5)
  → SPARC Phase C + Audit: feeds back into Self-Critique (quality gate)
```

The 6-persona audit at Phase C uses the same model as staff-engineer-v4 Step 8.5. They converge at the ship gate.

---

## Anti-Patterns

| Anti-Pattern | What It Looks Like | Correct Approach |
|---|---|---|
| Spec paralysis | 3-page spec for a 20-line function | Match spec depth to complexity |
| Pseudocode that's just code | Import statements and semicolons in "pseudocode" | Structured English only |
| Architecture astronautics | 12 microservices for a 2-file feature | Match design to actual, not aspirational complexity |
| Tests that test the mock | Test verifies mock returns what you told it to return | Tests verify behavior, not infrastructure |
| Completion as afterthought | "It works on my machine" → skip checklist | Run the checklist and audit every time |
| Audit as checkbox | Running the loop but not acting on P0 findings | P0s block the ship, full stop |
