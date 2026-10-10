<required_reading>
Read before starting:
- references/naming-conventions.md (required — the source of truth for all convention rules)
- references/risk-catalog.md (for rename risk assessment)
</required_reading>

<objective>
Audit file and directory naming across a project, detect the dominant convention, identify violations, and produce a rename plan that can be executed incrementally without breaking imports, CI, or Docker.
</objective>

<process>

## Step 1: Convention Detection

```bash
# Sample file names across the project
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/vendor/*' -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.rs" \) \
  | head -100 | xargs -I{} basename {} | sort

# Sample directory names
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -maxdepth 4 -type d | xargs -I{} basename {} | sort | uniq

# Detect framework to determine expected conventions
cat package.json 2>/dev/null | grep -E '"next"|"react"|"vue"|"angular"|"express"|"fastify"'
ls pyproject.toml setup.py Cargo.toml go.mod 2>/dev/null
```

**Auto-detect dominant convention:**

Count files matching each pattern:
- `kebab-case` (my-component.tsx) — count hyphens in filenames
- `snake_case` (my_component.py) — count underscores in filenames
- `PascalCase` (MyComponent.tsx) — count UpperCamelCase filenames
- `camelCase` (myComponent.ts) — count lowerCamelCase filenames

The convention with >60% of files wins as "dominant". If no clear winner, check references/naming-conventions.md for framework default.

## Step 2: Framework Convention Check

Cross-reference detected conventions against framework expectations from references/naming-conventions.md.

**Common mismatches to flag:**
- React components in kebab-case (should be PascalCase)
- Python modules in camelCase (should be snake_case)
- Go packages in kebab-case (should be lowercase, no separators)
- Next.js pages/routes in PascalCase (should be kebab-case)
- Test files not matching source file convention
- Config files not matching ecosystem norms

## Step 3: Violation Report

For each violation found:

```
VIOLATION: [filename]
  Current:    my_Component.tsx
  Expected:   MyComponent.tsx (PascalCase — React component)
  Convention: Framework default (React)
  Risk:       ⚠️ Import path change required
  References: [list of files that import this]
```

Group violations by:
1. **Zero-risk** — Files with no inbound imports (safe to rename)
2. **Low-risk** — Files with <5 importers (manageable rename)
3. **High-risk** — Files with 10+ importers or referenced in CI/Docker (needs migration plan)

## Step 4: Rename Plan

Present as a checklist ordered by risk (safest first):

```
CONVENTION ENFORCEMENT PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━
Target convention: [detected/recommended]
Total violations: [N]
Estimated effort: [low/medium/high]

PHASE 1: Zero-risk renames (no import changes)
  □ rename orphan-helpers.ts → OrphanHelpers.ts
  □ rename old_util.py → old_util.py (already correct)

PHASE 2: Low-risk renames (update <5 imports each)
  □ rename my_Component.tsx → MyComponent.tsx
    ↳ Update imports in: App.tsx, index.tsx, Layout.tsx

PHASE 3: High-risk renames (10+ references, needs careful execution)
  □ rename api-client.ts → ApiClient.ts
    ↳ Update imports in: [12 files]
    ↳ Update CI reference in: .github/workflows/test.yml
    ↳ ⚠️ Check Docker COPY paths
```

## Step 5: Tooling Recommendations

If the project doesn't have auto-enforcement, suggest:

| Tool | Ecosystem | What It Enforces |
|------|-----------|-----------------|
| eslint-plugin-filenames | JS/TS | File naming conventions |
| eslint-plugin-check-file | JS/TS | File and folder naming |
| ruff (select N) | Python | PEP 8 naming conventions |
| golangci-lint | Go | Go naming conventions |
| clippy | Rust | Rust naming conventions |

Suggest adding to pre-commit hooks or CI to prevent future drift.

**Wait for user approval before executing any renames.**
</process>

<success_criteria>
- Dominant convention correctly detected with counts
- Framework-specific expectations applied
- Every violation has risk level and reference list
- Rename plan ordered safest-first
- CI/Docker/import paths explicitly checked before any rename proposal
- Tooling recommendation matches the project's ecosystem
- No renames executed without approval
</success_criteria>
