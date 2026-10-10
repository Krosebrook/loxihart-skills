<required_reading>
Read before starting:
- references/structure-patterns.md (monorepo section specifically)
- references/risk-catalog.md (monorepo migration risks)
</required_reading>

<objective>
Evaluate whether a project should adopt monorepo structure, assess current workspace health if already a monorepo, or plan consolidation of multiple repos into one. Produces a recommendation with tradeoff analysis.
</objective>

<process>

## Step 1: Determine Starting Point

Ask (or detect from context):
- **A) Single repo → Should this become a monorepo?** (split assessment)
- **B) Multiple repos → Should these consolidate?** (merge assessment)
- **C) Already a monorepo → Is it healthy?** (health assessment)

## Step 2A: Split Assessment (Single → Monorepo?)

**Signals that suggest monorepo:**
- Shared code duplicated across parts of the app (utils, types, configs)
- Multiple deployment targets from one codebase (web + API + worker)
- Team wants independent versioning of packages
- Shared CI/CD pipeline logic

**Signals against monorepo:**
- Single deployment target, single team
- Under 10K lines of code
- No shared code between logical units
- Team unfamiliar with monorepo tooling

**Evaluate:**
```bash
# Look for natural package boundaries
find . -name "package.json" -not -path '*/node_modules/*' | head -20
find . -name "pyproject.toml" -o -name "setup.py" | grep -v node_modules | head -20

# Check for shared code patterns
grep -r "from.*shared\|from.*common\|from.*lib\|@shared\|@common" --include="*.ts" --include="*.js" --include="*.py" -l 2>/dev/null | head -10

# Deployment target detection
ls Dockerfile* docker-compose* serverless.yml vercel.json netlify.toml 2>/dev/null
cat package.json 2>/dev/null | grep -E '"start"|"build"|"deploy"' | head -10

# Size check
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" | wc -l
```

**Decision matrix:**

| Factor | Weight | Favors Mono | Favors Poly |
|--------|--------|-------------|-------------|
| Shared code exists | High | >3 shared modules | No shared code |
| Multiple deploy targets | High | 2+ targets | Single target |
| Team size | Medium | >5 devs, multiple teams | 1-3 devs |
| Codebase size | Medium | >20K LOC | <10K LOC |
| CI complexity | Medium | Shared pipelines | Independent pipelines |
| Tooling maturity | Low | Team knows turborepo/nx | First monorepo |

## Step 2B: Merge Assessment (Multiple → One Monorepo)

Gather info about each repo:
- Language/runtime
- Deploy target
- Shared dependencies
- CI/CD setup
- Team ownership

**Compatibility check:**
- Same language ecosystem? (mixing JS + Python monorepo is hard)
- Shared auth/config/types?
- Coordinated releases needed?
- Shared CI infrastructure?

**Tool recommendation:**

| Ecosystem | Recommended Tool | When |
|-----------|-----------------|------|
| JS/TS only | Turborepo | Fast builds, simple config |
| JS/TS complex | Nx | Advanced dep graph, generators |
| Mixed (JS+Python+Go) | pnpm workspaces + custom scripts | Flexibility over convention |
| Python only | uv workspaces or Pants | Python-native tooling |
| Go only | Go workspace (go.work) | Native Go support |

## Step 2C: Health Assessment (Existing Monorepo)

```bash
# Workspace config
cat turbo.json nx.json pnpm-workspace.yaml lerna.json 2>/dev/null

# Package inventory
find packages/ apps/ libs/ -maxdepth 1 -type d 2>/dev/null
find . -name "package.json" -not -path '*/node_modules/*' -exec grep -l '"name"' {} \; 2>/dev/null

# Cross-package dependencies
for pkg in packages/*/package.json; do
  echo "=== $pkg ==="
  grep -E '"@' "$pkg" 2>/dev/null | head -5
done

# Build pipeline check
cat turbo.json 2>/dev/null | python3 -m json.tool 2>/dev/null || cat turbo.json 2>/dev/null

# Check for circular deps (common monorepo issue)
# Look for packages that import each other
```

**Monorepo health signals:**
- Clear package boundaries (each package has own package.json/pyproject.toml)
- Build pipeline configured (turbo/nx tasks defined)
- No circular dependencies between packages
- Shared config extracted (eslint, tsconfig, prettier as workspace-level)
- Each package independently testable
- README in each package explaining its purpose
- Consistent versioning strategy (independent or lockstep)

## Step 3: Recommendation

Present as A/B/C options:

**Option A: [Recommended]** — [action] because [evidence]
- Effort: [low/medium/high]
- Risk: [low/medium/high]
- Prerequisite: [if any]

**Option B:** — [alternative] because [tradeoff]
- Effort: ...
- Risk: ...

**Option C: Do nothing** — [what stays the same, what degrades over time]

Include migration path for the recommended option (high-level steps, not detailed — that's workflow 5's job).
</process>

<success_criteria>
- Starting point correctly identified (split/merge/health)
- Decision factors evaluated with evidence from the actual codebase
- Tool recommendation matches ecosystem
- A/B/C options with honest tradeoffs
- No assumption that monorepo is always better — sometimes poly-repo is the right call
- Migration path outlined if recommending change
</success_criteria>
