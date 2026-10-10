# Phase 01 — Foundation

## Scope
Baseline code quality, project structure, test coverage, and CI/CD pipeline. Must be ≥ 4 before any other phase matters.

---

## Checklist

### Code Quality
- [ ] TypeScript strict mode enabled (`strict: true`, `noUncheckedIndexedAccess: true`)
- [ ] ESLint + Prettier configured and enforced in CI
- [ ] No `any` types — use `unknown` + Zod for untrusted input
- [ ] All functions have explicit return types
- [ ] No console.log in production code — use structured logger

### Project Structure
- [ ] Feature-based folder layout (`/features/<name>/{api,components,hooks,types}`)
- [ ] Shared utilities in `/lib` — no circular imports
- [ ] Environment variables typed via Zod schema at startup (fail fast)
- [ ] `.env.example` maintained and in sync with `.env`

### Testing Baseline
- [ ] Unit test coverage ≥ 80% on business logic
- [ ] Integration tests for all API routes
- [ ] Test database isolated from production
- [ ] Tests run in < 2 min in CI

### Dependency Management
- [ ] `package-lock.json` or `pnpm-lock.yaml` committed
- [ ] Dependabot or Renovate configured
- [ ] No packages with known CVEs (run `npm audit` in CI)
- [ ] Peer dependency warnings resolved

### CI/CD Pipeline
- [ ] Lint → Type-check → Test → Build runs on every PR
- [ ] Main branch protected (no direct push)
- [ ] Required status checks before merge
- [ ] Build artifacts versioned and stored

---

## Common Gaps
- Missing `noUncheckedIndexedAccess` causes silent array index bugs
- `.env` drift — production has keys dev doesn't know about
- Tests pass locally but fail in CI due to environment assumptions
- Dependabot PRs ignored → CVE accumulation

---

## References
- TypeScript strict mode: https://www.typescriptlang.org/tsconfig#strict
- ESLint recommended: https://eslint.org/docs/user-guide/configuring
