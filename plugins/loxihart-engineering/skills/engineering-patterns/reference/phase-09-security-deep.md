# Phase 09 — Security Deep Dive

## Scope
Authentication hardening, authorization models, secrets management, supply chain security, and penetration testing readiness.

---

## Checklist

### Authentication Hardening
- [ ] Passwords hashed with bcrypt/argon2 (cost factor ≥ 12 for bcrypt, ≥ 3 for argon2id)
- [ ] MFA enforced for admin accounts, optional for standard users
- [ ] Session tokens: cryptographically random, ≥ 128 bits entropy
- [ ] Session invalidated server-side on logout (not just client cookie deletion)
- [ ] Brute-force protection: rate limit + exponential backoff + lockout after N failures
- [ ] Password reset tokens: single-use, expire in ≤ 1 hour, invalidated after use
- [ ] OAuth/OIDC: state parameter validated, nonce validated, token endpoint uses POST
- [ ] JWT: `alg` header validated (reject `none`), `aud` and `iss` claims validated

### Authorization Models
- [ ] Authorization enforced server-side — never trust client claims
- [ ] Row-Level Security (RLS) enabled in Supabase / Postgres for multi-tenant data
- [ ] RBAC roles documented and minimal (principle of least privilege)
- [ ] Horizontal privilege escalation checked: user A cannot access user B's resources
- [ ] Vertical privilege escalation checked: user cannot access admin-only endpoints
- [ ] IDOR (Insecure Direct Object Reference) prevented: resource ownership verified before access
- [ ] JWT scope/role claims re-validated on each request (not cached in session)

### Secrets Management
- [ ] No secrets in source code, `.env` committed, or Docker images
- [ ] Secrets loaded from environment variables or secret manager (Vault, AWS SM, Bitwarden)
- [ ] Secret rotation procedure documented and tested
- [ ] Service accounts have minimum required permissions (not admin)
- [ ] API keys scoped to minimum permissions (read-only where possible)
- [ ] Secrets audit: run `git secrets` or `truffleHog` on repo history

### Input Handling & Injection
- [ ] SQL: parameterized queries everywhere — no string interpolation
- [ ] NoSQL injection: operator injection prevented (`$where`, `$regex` untrusted input blocked)
- [ ] Command injection: no `exec(userInput)`, `shell=True` with user data
- [ ] SSRF protection: outbound requests only to allowlisted domains
- [ ] Path traversal: no `../../` in file path construction from user input
- [ ] XML/YAML: external entity expansion disabled (XXE prevention)
- [ ] Regex: untrusted regex patterns rejected (ReDoS prevention)

### Transport & Cryptography
- [ ] TLS 1.2+ enforced, TLS 1.0/1.1 disabled
- [ ] HSTS header set with `max-age ≥ 31536000; includeSubDomains`
- [ ] Certificate pinning considered for mobile/native clients
- [ ] Symmetric encryption: AES-256-GCM (not ECB, not CBC without HMAC)
- [ ] Asymmetric encryption: RSA-2048+ or EC P-256+
- [ ] Keys stored separately from encrypted data
- [ ] No MD5 or SHA-1 for security-sensitive operations

### Supply Chain Security
- [ ] `npm audit` / `pip audit` / `cargo audit` run in CI with blocking on HIGH/CRITICAL
- [ ] Dependency lockfile committed (`package-lock.json`, `yarn.lock`, `Cargo.lock`)
- [ ] Dependabot or Renovate configured for automated dependency PRs
- [ ] Docker base images pinned by digest, not just tag
- [ ] Third-party scripts loaded with `integrity` (SRI) attribute
- [ ] SBOM (Software Bill of Materials) generated for audit trail

### Security Headers
- [ ] `Content-Security-Policy` configured (no `unsafe-inline` in production)
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` restricts camera, microphone, geolocation to minimum needed
- [ ] CORS `Access-Control-Allow-Origin` is not `*` for authenticated endpoints

---

## Patterns

### RLS Policy (Supabase)
```sql
-- Users can only read their own records
CREATE POLICY "users_own_data" ON user_data
  FOR ALL USING (auth.uid() = user_id);

-- Service role bypasses RLS (use only in server-side code)
-- Never expose service_role key to frontend
```

### JWT Validation (TypeScript)
```typescript
import { jwtVerify } from 'jose';

const { payload } = await jwtVerify(token, publicKey, {
  algorithms: ['RS256'],           // reject 'none' and HS256 with unknown key
  audience: 'https://api.myapp.com',
  issuer: 'https://auth.myapp.com',
  clockTolerance: 30,              // ±30s clock skew
});
// payload.sub is verified — safe to use as user ID
```

---

## Common Gaps
- `Authorization: Bearer <token>` checked but `aud`/`iss` not validated → token from another service accepted
- RLS disabled on one table → all rows exposed via PostgREST
- Password reset token not invalidated after first use → re-usable reset link
- CORS `*` on authenticated endpoint → cross-origin JS can make authenticated requests
- Dependency `npm audit` only run locally, not in CI → HIGH CVE ships to production
