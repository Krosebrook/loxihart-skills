<required_reading>
Read before starting:
- references/naming-conventions.md (for convention checks)
</required_reading>

<objective>
Fast structural health scan targeting the most common issues. Produces a pass/fail checklist in under 2 minutes of analysis. No reorganization proposals — just a diagnostic.
</objective>

<process>

## Step 1: Quick Discovery

```bash
# Tree snapshot (shallow)
find . -maxdepth 3 -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/vendor/*' | head -200

# Project type detection
ls package.json pyproject.toml Cargo.toml go.mod Makefile 2>/dev/null

# .gitignore check
cat .gitignore 2>/dev/null | wc -l
```

## Step 2: Run 10-Point Health Check

Score each item PASS / WARN / FAIL:

| # | Check | How to Verify |
|---|-------|---------------|
| 1 | **README exists at root** | `test -f README.md` |
| 2 | **.gitignore exists and covers basics** | Check for node_modules, .env, dist/build, OS files (.DS_Store, Thumbs.db) |
| 3 | **No secrets in tracked files** | Two checks: (a) `git ls-files | grep -iE '\.(env|pem|key|secret|credentials)$'` for tracked secret files; (b) `grep -rn "AKIA\|sk-\|ghp_\|glpat-\|xoxb-\|AIzaSy" --include="*.ts" --include="*.py" --include="*.go" -l 2>/dev/null | grep -v node_modules | head -10\` for hardcoded credentials. Either hit = FAIL |
| 4 | **Consistent file naming** | Sample 20 files — are they all kebab-case, snake_case, or PascalCase? Mixed = WARN |
| 5 | **No deeply nested files** | `find . -mindepth 6 -not -path '*/node_modules/*' \| head -10` — any hits = WARN |
| 6 | **Tests exist** | Look for `__tests__/`, `tests/`, `test/`, `spec/`, `*_test.*`, `*.spec.*`, `*.test.*` |
| 7 | **Config isolated** | Are config files (.eslintrc, tsconfig, Dockerfile, etc.) at root or in a config/ dir, not scattered? |
| 8 | **No build artifacts tracked** | `git ls-files \| grep -E '(dist/\|build/\|\.next/\|__pycache__/)' \| head -5` |
| 9 | **Reasonable top-level count** | Count items in root dir — more than 15 non-config files = WARN, more than 25 = FAIL |
| 10 | **Lock file present** | package-lock.json, yarn.lock, pnpm-lock.yaml, Pipfile.lock, Cargo.lock, go.sum — whichever applies |

## Step 3: Output

Present as a compact scorecard:

```
PROJECT HEALTH CHECK: [project-name]
Type: [detected type]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ README exists
 ✅ .gitignore covers basics
 🔴 Secrets found in tracked files (2 .env files tracked)
 ⚠️  Mixed naming (kebab-case in src/, snake_case in scripts/)
 ✅ No excessive nesting
 ⚠️  No tests found
 ✅ Config files at root
 ✅ No build artifacts tracked
 ✅ Clean root directory (12 items)
 ✅ Lock file present
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score: 7/10 PASS | 2 WARN | 1 FAIL
```

If any FAIL items found, briefly explain the fix (1-2 sentences each).
If user wants deeper analysis, recommend the full audit (workflow 1).
</process>

<success_criteria>
- All 10 checks executed with evidence
- Security issues (check 3) always flagged prominently even if everything else passes
- Output is scannable in under 30 seconds
- No file modifications proposed or executed
</success_criteria>
