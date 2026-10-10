# Risk Catalog Reference

Things that break when you restructure a project. Check every item in this catalog before proposing any file move, rename, or directory change. Each risk includes detection commands and mitigation strategies.

## Table of Contents
1. [Import Path Breakage](#imports)
2. [CI/CD Pipeline References](#ci)
3. [Docker Build Context](#docker)
4. [TypeScript/Webpack Aliases](#aliases)
5. [Package.json References](#package-json)
6. [Symlinks and Hardlinks](#symlinks)
7. [Environment and Config Paths](#env)
8. [Git Submodules and LFS](#git)
9. [Database Migrations](#migrations)
10. [External Consumer Contracts](#consumers)
11. [IDE and Editor Config](#ide)
12. [Build Output References](#build)

---

<a id="imports"></a>
## 1. Import Path Breakage

**Risk level**: 🔴 Critical (most common cause of post-restructure failures)

**What breaks**: Every file that imports the moved/renamed file gets a broken import.

**Detection:**
```bash
# Find all importers of a specific file (JS/TS)
grep -rn "from.*['\"].*target-file" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v node_modules

# Find all importers (Python)
grep -rn "from.*target_module\|import.*target_module" --include="*.py" | grep -v __pycache__

# Find all importers (Go)
grep -rn '".*package/path"' --include="*.go"

# Count total import references to understand blast radius
grep -rlc "from.*['\"].*target" --include="*.ts" --include="*.tsx" | wc -l
```

**Mitigation:**
- Use IDE refactoring tools (built-in rename/move) when possible
- For bulk updates: `find . -name "*.ts" -exec sed -i 's|old/path|new/path|g' {} +`
- After move: run `tsc --noEmit` (TS) or `python -c "import package"` (Python) to verify
- Create re-export barrel file at old location during transition:
  ```ts
  // old-location/index.ts (temporary)
  export * from '../new-location';
  ```

---

<a id="ci"></a>
## 2. CI/CD Pipeline References

**Risk level**: 🔴 Critical (failures only visible after push)

**What breaks**: Workflow files reference specific paths for triggers, working directories, artifact paths.

**Detection:**
```bash
# GitHub Actions path references
grep -rn "working-directory\|path:\|paths:\|paths-ignore:" .github/workflows/ 2>/dev/null

# GitLab CI
grep -n "artifacts\|cache\|only\|changes:" .gitlab-ci.yml 2>/dev/null

# CircleCI
grep -rn "working_directory\|path:" .circleci/ 2>/dev/null

# Generic: find all YAML refs to internal paths
grep -rn "src/\|dist/\|build/\|packages/\|apps/" .github/ .gitlab-ci.yml .circleci/ 2>/dev/null
```

**Mitigation:**
- Update all CI path references BEFORE merging restructure
- Test with a dry-run CI trigger on branch
- Use path variables/env vars instead of hardcoded paths in CI for future resilience

---

<a id="docker"></a>
## 3. Docker Build Context

**Risk level**: 🔴 Critical (breaks deployments)

**What breaks**: COPY/ADD instructions, WORKDIR paths, volume mounts, build args referencing paths.

**Detection:**
```bash
# Dockerfile COPY/ADD paths
grep -En "^COPY|^ADD|^WORKDIR" Dockerfile* 2>/dev/null

# Docker Compose volume mounts and build contexts
grep -En "volumes:|build:|context:|dockerfile:" docker-compose*.yml compose*.yml 2>/dev/null

# .dockerignore (paths here must match new structure)
cat .dockerignore 2>/dev/null
```

**Mitigation:**
- Update every COPY/ADD path
- Update docker-compose volume mounts
- Rebuild and test container locally: `docker build --no-cache .`
- Update .dockerignore if directory names changed

---

<a id="aliases"></a>
## 4. TypeScript/Webpack/Vite Aliases

**Risk level**: 🟡 Warning (build breaks, but error messages are clear)

**What breaks**: Path aliases like `@/components` or `~/lib` resolve to physical paths that may have moved.

**Detection:**
```bash
# tsconfig.json paths
cat tsconfig.json 2>/dev/null | grep -A20 '"paths"'
cat tsconfig.*.json 2>/dev/null | grep -A20 '"paths"'

# Webpack aliases
cat webpack.config.* 2>/dev/null | grep -A10 'alias'

# Vite aliases
cat vite.config.* 2>/dev/null | grep -A10 'alias'

# Jest module mapper
cat jest.config.* package.json 2>/dev/null | grep -A10 'moduleNameMapper'

# Usage in codebase
grep -rn "@/\|~/\|@components\|@lib\|@utils" --include="*.ts" --include="*.tsx" | head -20
```

**Mitigation:**
- Update tsconfig.json paths mapping
- Update webpack/vite alias config
- Update Jest moduleNameMapper
- After update: `tsc --noEmit` to verify resolution

---

<a id="package-json"></a>
## 5. Package.json References

**Risk level**: 🟡 Warning (breaks package resolution and publishing)

**What breaks**: `main`, `module`, `types`, `exports`, `bin`, `files` fields reference specific paths.

**Detection:**
```bash
# Path-containing fields in package.json
cat package.json 2>/dev/null | grep -E '"main"|"module"|"types"|"typings"|"exports"|"bin"|"files"|"directories"'

# Workspace references in monorepo
cat package.json 2>/dev/null | grep -A5 '"workspaces"'
cat pnpm-workspace.yaml 2>/dev/null

# Script path references
cat package.json 2>/dev/null | grep -A50 '"scripts"' | grep -E 'src/|dist/|build/|packages/'
```

**Mitigation:**
- Update main/module/types/exports to new paths
- Update workspace globs if directories renamed
- Run `npm pack --dry-run` to verify files field
- Test published package locally before publishing

---

<a id="symlinks"></a>
## 6. Symlinks and Hardlinks

**Risk level**: 🟡 Warning (silent breakage — hardest to detect)

**What breaks**: Symlinks point to absolute or relative paths that may no longer exist.

**Detection:**
```bash
# Find all symlinks in the project
find . -type l -not -path '*/node_modules/*' -not -path '*/.git/*' -exec ls -la {} \;

# Check for broken symlinks
find . -type l -not -path '*/node_modules/*' ! -exec test -e {} \; -print
```

**Mitigation:**
- Recreate symlinks pointing to new paths
- If using relative symlinks, recalculate relative path from new location
- Test symlink resolution after restructure

---

<a id="env"></a>
## 7. Environment and Config Paths

**Risk level**: 🟡 Warning (runtime failures, not build failures)

**What breaks**: .env files, config files, and startup scripts referencing internal paths.

**Detection:**
```bash
# Path references in env files
grep -n "/" .env* 2>/dev/null | grep -v "http\|https\|://"

# Config files with path references
grep -rn "path\|dir\|directory\|folder\|root" --include="*.json" --include="*.yaml" --include="*.yml" --include="*.toml" | grep -v node_modules | grep -v ".git/" | head -30

# Startup scripts
grep -n "cd \|pushd\|source\|\." scripts/* 2>/dev/null
```

**Mitigation:**
- Search all config files for path references
- Update .env.example with new paths
- Test app startup with `--dry-run` or equivalent

---

<a id="git"></a>
## 8. Git Submodules and LFS

**Risk level**: 🟡 Warning

**What breaks**: Submodule paths, LFS tracking patterns.

**Detection:**
```bash
# Submodules
cat .gitmodules 2>/dev/null

# LFS tracked patterns
cat .gitattributes 2>/dev/null | grep "filter=lfs"

# LFS tracked files
git lfs ls-files 2>/dev/null | head -20
```

**Mitigation:**
- Update .gitmodules paths
- Update .gitattributes LFS patterns if directory names changed
- `git submodule sync` after path changes

---

<a id="migrations"></a>
## 9. Database Migrations

**Risk level**: 🟢 Low (usually self-contained)

**What breaks**: Migration discovery paths, migration runner config.

**Detection:**
```bash
# Common migration locations
ls -la migrations/ db/migrations/ src/db/migrations/ prisma/migrations/ alembic/versions/ 2>/dev/null

# Migration config references
grep -rn "migrations\|migrationsDir\|migration_directory" --include="*.json" --include="*.yaml" --include="*.toml" --include="*.py" | grep -v node_modules | head -10

# ORM config files
ls prisma/schema.prisma knexfile.* alembic.ini 2>/dev/null
```

**Mitigation:**
- Update migration directory path in ORM config
- Do NOT rename migration files (breaks migration history)
- Test with `migrate status` or equivalent

---

<a id="consumers"></a>
## 10. External Consumer Contracts

**Risk level**: 🔴 Critical (if library/SDK)

**What breaks**: Published import paths that external consumers depend on.

**Detection:**
```bash
# Package.json exports (public API surface)
cat package.json 2>/dev/null | python3 -c "import sys,json; e=json.load(sys.stdin).get('exports',{}); print(json.dumps(e,indent=2))" 2>/dev/null

# Published type definitions
cat package.json 2>/dev/null | grep '"types"\|"typings"'

# Published entry points
cat package.json 2>/dev/null | grep '"main"\|"module"\|"browser"'
```

**Mitigation:**
- This is a BREAKING CHANGE if you modify public API paths
- Requires major version bump (semver)
- Consider re-export shims at old paths for backward compatibility
- Announce deprecation before removal

---

<a id="ide"></a>
## 11. IDE and Editor Config

**Risk level**: 🟢 Low (developer convenience, not build-critical)

**What breaks**: VS Code workspace settings, launch configs, recommended extensions paths.

**Detection:**
```bash
# VS Code settings
cat .vscode/settings.json .vscode/launch.json .vscode/tasks.json 2>/dev/null | grep -n "/"

# JetBrains
find .idea/ -name "*.xml" -exec grep -l "path\|url\|directory" {} \; 2>/dev/null
```

**Mitigation:**
- Update .vscode/settings.json path references
- Update launch.json program/cwd paths
- Low priority — fix after main restructure

---

<a id="build"></a>
## 12. Build Output References

**Risk level**: 🟢 Low (regenerated on build)

**What breaks**: References to dist/, build/, .next/, out/ in deploy configs.

**Detection:**
```bash
# Deploy configs referencing build output
grep -rn "dist/\|build/\|out/\|\.next/" vercel.json netlify.toml firebase.json 2>/dev/null
grep -rn "dist/\|build/\|out/" .github/workflows/ 2>/dev/null
```

**Mitigation:**
- Update deploy config output directory references
- Clean build and verify: `rm -rf dist/ && npm run build`

---

<a id="deploy-platform"></a>
## 13. Deploy Platform Config (Vercel / Netlify / Railway)

**Risk level**: 🟡 Warning (deployment breaks silently if paths don't match)

**What breaks**: Platform-specific config files reference output directories, functions directories, and build roots.

**Detection:**
```bash
# Vercel
cat vercel.json 2>/dev/null | grep -E '"outputDirectory"|"buildCommand"|"rootDirectory"|"functions"'

# Netlify
cat netlify.toml 2>/dev/null | grep -E 'publish|base|functions|command'

# Railway
cat railway.toml 2>/dev/null | grep -E 'startCommand|buildCommand'

# Generic: find all deploy configs
ls vercel.json netlify.toml railway.toml .railway/ fly.toml render.yaml 2>/dev/null
```

**Common path references to update:**
| Platform | Field | Default | Breaks When |
|----------|-------|---------|-------------|
| Vercel | `outputDirectory` | `.next` or `dist` | Build output dir renamed |
| Vercel | `rootDirectory` | repo root | Monorepo app dir changed |
| Netlify | `publish` in `[build]` | `dist` | Output dir changed |
| Netlify | `base` | repo root | Monorepo app dir changed |
| Netlify | `functions` | `netlify/functions` | Functions dir moved |

**Mitigation:**
- Update vercel.json/netlify.toml alongside any output or root directory change
- Redeploy from the platform dashboard to verify the new paths work
- For monorepo migrations on Vercel: update `rootDirectory` per-project in the Vercel dashboard, not just vercel.json

---

<a id="orm-schema"></a>
## 14. ORM and Schema Paths

**Risk level**: 🟡 Warning (schema location is config-driven)

**What breaks**: ORMs resolve schema files and migration directories from config — moving them silently breaks migrations.

**Detection:**
```bash
# Prisma
cat prisma/schema.prisma 2>/dev/null | grep 'provider\|output'
cat package.json 2>/dev/null | grep -E '"prisma"'  # custom schemaPath

# Drizzle
cat drizzle.config.ts drizzle.config.js 2>/dev/null | grep -E 'schema|out|migrations'

# SQLAlchemy / Alembic
cat alembic.ini 2>/dev/null | grep 'script_location'

# TypeORM
cat ormconfig.* 2>/dev/null | grep -E 'entities|migrations|subscribers'
grep -rn "DataSource\|createConnection" --include="*.ts" | grep -E '"entities|migrations"' | head -5

# Knex
cat knexfile.* 2>/dev/null | grep -E 'migrations|seeds'
```

**Common ORM path defaults:**
| ORM | Config File | Path Fields |
|-----|-------------|-------------|
| Prisma | `prisma/schema.prisma` | `output` (generated client), migrations auto-discovered |
| Drizzle | `drizzle.config.ts` | `schema`, `out` (migrations dir) |
| Alembic | `alembic.ini` | `script_location` |
| TypeORM | `ormconfig.json` or DataSource | `entities`, `migrations` |
| Knex | `knexfile.js` | `migrations.directory`, `seeds.directory` |

**Critical**: Do NOT move or rename `prisma/migrations/` — Prisma uses migration file names and checksums for history. Moving the directory requires updating `schema.prisma` provider config and re-running `prisma migrate resolve`.

**Mitigation:**
- Update the ORM config file alongside any schema/migration dir move
- Run `prisma generate` / `drizzle-kit generate` to verify after update
- Never rename individual migration files (breaks migration history in all ORMs)

---

## Risk Assessment Checklist

Before proposing ANY file move, check:

- [ ] How many files import this? (`grep -rlc`)
- [ ] Is this path in any CI workflow? (`.github/workflows/`)
- [ ] Is this path in Dockerfile COPY/ADD?
- [ ] Is this path in docker-compose volumes?
- [ ] Is this an aliased path? (tsconfig paths, webpack alias)
- [ ] Is this in package.json main/module/exports/bin?
- [ ] Are there symlinks pointing here?
- [ ] Is this in any .env or config file?
- [ ] Is this a git submodule path?
- [ ] Is this a published API path? (library consumers)
- [ ] Is this referenced in vercel.json, netlify.toml, or another deploy platform config?
- [ ] Is this an ORM schema or migrations directory? (Prisma, Drizzle, Alembic)
