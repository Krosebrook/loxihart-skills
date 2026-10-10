<required_reading>
Read before starting:
- references/structure-patterns.md (for target structure proposals)
- references/naming-conventions.md (for convention scoring)
- references/risk-catalog.md (for risk flags on proposals)
- templates/audit-report.md (output format)
</required_reading>

<objective>
Perform a comprehensive structural analysis of a project repository, score its organizational health, identify issues, and produce a reviewable reorganization plan with risk-flagged steps.
</objective>

<process>

## Phase 1: Discovery (DO NOT skip)

Run these commands to build a mental model of the project before making any judgments:

```bash
# 1. Get the full directory tree (respect .gitignore, skip node_modules/vendor)
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/vendor/*' -not -path '*/__pycache__/*' -not -path '*/dist/*' -not -path '*/build/*' -not -path '*/.next/*' | head -500

# 2. Detect project type signals
ls -la package.json turbo.json nx.json pnpm-workspace.yaml lerna.json pyproject.toml setup.py setup.cfg Cargo.toml go.mod Makefile Dockerfile docker-compose.yml terraform.tf *.tf 2>/dev/null

# 3. Check for workspace configs
cat package.json 2>/dev/null | grep -A5 '"workspaces"'
cat pnpm-workspace.yaml 2>/dev/null
cat turbo.json 2>/dev/null | head -20

# 4. Security hygiene scan
git ls-files | grep -iE '\.(env|pem|key|secret|credentials|token)' 2>/dev/null
grep -r "AKIA\|sk-\|ghp_\|glpat-\|xoxb-\|xoxp-" --include="*.{js,ts,py,go,rs,yaml,yml,json,toml}" -l 2>/dev/null | head -20
cat .gitignore 2>/dev/null

# 5. Detect import alias configs
cat tsconfig.json 2>/dev/null | grep -A10 '"paths"'
cat webpack.config.* 2>/dev/null | grep -A5 'alias'
cat vite.config.* 2>/dev/null | grep -A5 'alias'

# 6. Check CI/CD paths (these break on restructure)
ls -la .github/workflows/ .gitlab-ci.yml .circleci/ Jenkinsfile bitbucket-pipelines.yml 2>/dev/null
cat .github/workflows/*.yml 2>/dev/null | grep -E 'working-directory|path:|paths:' | head -20

# 7. Docker context awareness
cat Dockerfile 2>/dev/null | grep -E '^COPY|^ADD|^WORKDIR'
cat docker-compose.yml 2>/dev/null | grep -E 'volumes:|build:' -A2

# 8. Count files by type
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -20

# 9. Find orphan candidates (files not imported/referenced anywhere)
# For JS/TS projects:
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v '.test.' | grep -v '.spec.' | head -50

# 10. README coverage
find . -name "README.md" -not -path '*/node_modules/*' | head -20
```

**From discovery, classify the project** using the taxonomy in SKILL.md essential_principles.
If mixed workspace, identify each sub-project and classify individually.

## Phase 2: Scoring

Score each quality signal 0-3:

| Signal | 0 (Critical) | 1 (Poor) | 2 (Acceptable) | 3 (Excellent) |
|--------|--------------|----------|-----------------|---------------|
| Convention consistency | No pattern, random naming | Some patterns, many violations | Mostly consistent, minor drift | Uniform conventions throughout |
| Discoverability | Flat dump, no grouping | Some grouping, unclear hierarchy | Logical grouping, minor gaps | Intuitive, self-documenting |
| Separation of concerns | Config/code/docs mixed | Partial separation | Clear separation, some bleed | Clean boundaries everywhere |
| Build/deploy hygiene | Build artifacts tracked, no .gitignore | Incomplete .gitignore | Good .gitignore, minor gaps | Complete isolation, clean builds |
| Documentation | No README | Root README only | README + some dir docs | README at every key directory |
| Dead weight | >20% orphaned/stale files | 10-20% dead weight | <10% dead weight | Clean, no orphans |
| Security posture | Secrets in tracked files | .env tracked, no secrets | .env in .gitignore, minor gaps | Full secret hygiene, no leaks |

**Overall health**: Sum / 21, mapped to grade:
- 18-21: A (Excellent — minor tweaks only)
- 14-17: B (Good — targeted improvements)
- 10-13: C (Fair — restructuring recommended)
- 6-9: D (Poor — significant reorganization needed)
- 0-5: F (Critical — fundamental restructuring required)

## Phase 3: Issue Identification

Categorize every issue found:

**Severity levels:**
- 🔴 **Critical**: Security risk, build breakage, data loss risk
- 🟡 **Warning**: Convention violation, discoverability issue, missing docs
- 🟢 **Suggestion**: Nice-to-have improvement, minor optimization

**Issue categories:**
- SECURITY: Exposed secrets, .gitignore gaps, tracked credentials
- STRUCTURE: Misplaced files, inconsistent nesting, flat dumps
- NAMING: Convention violations, inconsistent casing, unclear names
- DEAD-WEIGHT: Orphaned files, unused dependencies, stale configs
- DOCS: Missing READMEs, outdated docs, no architecture docs
- BUILD: Tracked artifacts, missing build isolation, broken ignore rules
- CI-RISK: Hardcoded paths in CI that would break on restructure

## Phase 4: Target Structure Proposal

Read references/structure-patterns.md for the detected project type.

Propose a target structure that:
1. Preserves what's already working (don't move for the sake of it)
2. Fixes critical and warning issues
3. Follows framework-specific conventions
4. Minimizes blast radius (fewest moves for maximum impact)

Present as a side-by-side diff:
```
CURRENT                          PROPOSED
├── src/                         ├── src/
│   ├── helpers/        →        │   ├── lib/          (rename: convention)
│   ├── pages/          ✓        │   ├── pages/        (keep)
│   ├── utils.js        →        │   ├── lib/utils.ts  (move + rename)
│   └── api.js          →        │   ├── api/          (extract to dir)
```

## Phase 5: Output

Copy and fill templates/audit-report.md with all findings.

Present the report to the user with:
1. Health score and grade (lead with this)
2. Critical issues (if any — these need immediate attention)
3. Proposed changes as a numbered checklist
4. Risk flags on each proposed change (read references/risk-catalog.md)
5. Recommended execution order (dependencies between changes)

**Ask for approval before any execution. Never auto-execute.**
</process>

<success_criteria>
- Project classified correctly
- All 7 quality signals scored with evidence
- Every issue categorized with severity
- Target structure respects framework conventions
- No proposal would break CI, Docker, or import aliases without explicit risk flag
- Security issues surfaced prominently
- Output follows audit-report.md template
- User can review and approve/reject each proposed change independently
</success_criteria>
