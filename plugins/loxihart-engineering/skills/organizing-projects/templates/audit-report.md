# Project Audit Report: [PROJECT NAME]

**Date**: [YYYY-MM-DD]
**Project Type**: [Detected type from taxonomy]
**Overall Grade**: [A-F] ([score]/21)

---

## Health Scorecard

| Signal | Score | Evidence |
|--------|-------|----------|
| Convention consistency | [0-3] | [Brief evidence] |
| Discoverability | [0-3] | [Brief evidence] |
| Separation of concerns | [0-3] | [Brief evidence] |
| Build/deploy hygiene | [0-3] | [Brief evidence] |
| Documentation | [0-3] | [Brief evidence] |
| Dead weight | [0-3] | [Brief evidence] |
| Security posture | [0-3] | [Brief evidence] |
| **Total** | **[X]/21** | **Grade: [A-F]** |

---

## What's Working Well

[List things that should NOT be changed. This section is important — it prevents unnecessary restructuring.]

1. [Positive finding with evidence]
2. [Positive finding with evidence]

---

## Issues Found

### 🔴 Critical

| # | Issue | Category | Details | Fix |
|---|-------|----------|---------|-----|
| C1 | [Issue] | [SECURITY/STRUCTURE/etc.] | [Evidence] | [Proposed fix] |

### 🟡 Warning

| # | Issue | Category | Details | Fix |
|---|-------|----------|---------|-----|
| W1 | [Issue] | [Category] | [Evidence] | [Proposed fix] |

### 🟢 Suggestion

| # | Issue | Category | Details | Fix |
|---|-------|----------|---------|-----|
| S1 | [Issue] | [Category] | [Evidence] | [Proposed fix] |

---

## Proposed Structure

```
CURRENT                          PROPOSED
[side-by-side tree diff]
```

---

## Reorganization Checklist

Execute in this order (dependencies between steps noted):

| # | Action | Risk | Depends On | Notes |
|---|--------|------|------------|-------|
| 1 | [Action] | 🟢/🟡/🔴 | — | [Risk details] |
| 2 | [Action] | 🟢/🟡/🔴 | Step 1 | [Risk details] |

---

## Estimated Effort

| Phase | Time Estimate | Complexity |
|-------|--------------|------------|
| Critical fixes | [X hours] | [Low/Med/High] |
| Restructuring | [X hours] | [Low/Med/High] |
| Verification | [X hours] | [Low/Med/High] |
| **Total** | **[X hours]** | |

---

## Next Steps

- [ ] Review and approve/reject each proposed change
- [ ] Execute critical fixes first (security, build hygiene)
- [ ] Run migration planning workflow for complex restructuring
- [ ] Set up convention enforcement tooling to prevent future drift
