<required_reading>
Read before starting:
- references/structure-patterns.md (for target structure)
- references/risk-catalog.md (required — every step needs risk assessment)
- templates/migration-checklist.md (output format)
</required_reading>

<objective>
Plan a structural migration from current state to target state with ordered, dependency-aware, risk-flagged steps. Every step is independently executable and rollback-safe. Output follows the migration-checklist.md template.
</objective>

<process>

## Step 1: Establish Current and Target State

If coming from a full audit (workflow 1), the current/target states are already defined. Otherwise:

**Map current state:**
```bash
# Full tree snapshot
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/vendor/*' -not -path '*/__pycache__/*' -maxdepth 5 | sort

# Dependency graph (what imports what)
# JS/TS:
grep -rn "from ['\"]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules | head -100
# Python:
grep -rn "^from \|^import " --include="*.py" | grep -v __pycache__ | head -100

# External reference points (things that reference internal paths)
cat .github/workflows/*.yml 2>/dev/null
cat Dockerfile* 2>/dev/null
cat docker-compose*.yml 2>/dev/null
cat tsconfig.json 2>/dev/null | grep -A20 '"paths"'
cat package.json 2>/dev/null | grep -E '"main"|"module"|"exports"|"bin"|"files"'
```

**Define target state** using references/structure-patterns.md for the detected project type.
Present the target to the user for approval before planning migration steps.

## Step 2: Diff Analysis

For every file/directory that moves, renames, or gets created/deleted:

| Item | Action | From | To | Blockers |
|------|--------|------|----|----------|
| src/helpers/ | rename | src/helpers/ | src/lib/ | 23 import statements |
| api.js | move + split | src/api.js | src/api/index.ts + src/api/client.ts | CI references, 8 imports |
| .env.example | create | (new) | .env.example | none |

## Step 3: Dependency Ordering

Build a dependency graph of migration steps:

```
Step 1: Create new directories (zero risk, no dependencies)
  ↓
Step 2: Move/rename leaf files (files nothing else imports)
  ↓
Step 3: Move/rename internal files (update imports after each)
  ↓
Step 4: Move/rename hub files (most-imported files — highest risk)
  ↓
Step 5: Update external references (CI, Docker, aliases, package.json)
  ↓
Step 6: Clean up (remove empty dirs, update docs, verify build)
```

Each step must be independently committable — if step 3 breaks, steps 1-2 are still valid.

## Step 4: Risk Assessment Per Step

For every migration step, evaluate against references/risk-catalog.md:

| Risk Category | Check | Impact |
|---------------|-------|--------|
| Import breakage | How many files import this? | Build failure |
| CI path reference | Is this path in any workflow file? | Pipeline failure |
| Docker COPY/ADD | Is this path in Dockerfile? | Build/deploy failure |
| Alias mapping | Is this in tsconfig paths/webpack alias? | Build failure |
| Package.json refs | Is this in main/module/exports/bin? | Package resolution failure |
| Symlink target | Is anything symlinked to this? | Silent breakage |
| Environment config | Does any .env reference this path? | Runtime failure |
| Documentation | Are docs/READMEs referencing this path? | Stale docs |
| External consumers | Is this a published package path? | Breaking change for consumers |

**Risk levels per step:**
- 🟢 **Safe**: No external references, leaf file, <3 importers
- 🟡 **Caution**: 3-10 importers, or CI/Docker reference exists
- 🔴 **Critical**: 10+ importers, published API path, or multiple external refs

## Step 5: Generate Migration Script (Optional)

If the user wants automated execution, generate a bash script that:
1. Creates a git branch (`restructure/[date]`)
2. Executes moves in dependency order
3. Runs find-and-replace for import path updates
4. Commits after each logical group of changes
5. Runs the test suite (if exists) after each commit
6. Reports any remaining broken imports

```bash
#!/bin/bash
set -euo pipefail

# Safety: ensure clean working tree
if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: Working tree not clean. Commit or stash changes first."
  exit 1
fi

BRANCH="restructure/$(date +%Y%m%d)"
git checkout -b "$BRANCH"

# Phase 1: Create directories
mkdir -p src/lib src/api src/config
git add -A && git commit -m "chore: create new directory structure"

# Phase 2: Move leaf files (example)
# git mv src/helpers/format.ts src/lib/format.ts
#
# Cross-platform import path update (Linux/macOS compatible):
#   Linux:  find . -name "*.ts" -not -path '*/node_modules/*' -exec sed -i 's|from.*helpers/format|from ../lib/format|g' {} +
#   macOS:  find . -name "*.ts" -not -path '*/node_modules/*' -exec sed -i '' 's|from.*helpers/format|from ../lib/format|g' {} +
#   Universal (use this): npx replace-in-files-cli --string='helpers/format' --replacement='lib/format' '**/*.ts'
#
# git add -A && git commit -m "refactor: move format utils to lib/"

# ... repeat for each step
```

**Always present the script for review. Never auto-execute.**

## Step 6: Output

Copy and fill templates/migration-checklist.md with:
1. Executive summary (what's changing, why, estimated effort)
2. Pre-migration checklist (backup, branch, clean working tree)
3. Ordered migration steps with risk flags
4. Post-migration verification steps
5. Rollback plan (it's just `git checkout main` if each step is committed)

Present to user for final review.
</process>

<success_criteria>
- Current and target states explicitly mapped
- Every moved file has its importers identified
- Steps ordered by dependency (leaf → hub)
- Each step independently committable
- Risk level assigned per step with specific evidence
- CI, Docker, alias, and package.json references checked
- Migration script (if generated) includes safety guards
- Rollback path documented
- Nothing executes without user approval
</success_criteria>
