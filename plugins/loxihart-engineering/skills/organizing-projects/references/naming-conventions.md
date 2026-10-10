# Naming Conventions Reference

Rules for file and directory naming across ecosystems. When auditing, detect the dominant convention first, then cross-reference against this reference to determine if violations are genuine issues or acceptable deviations.

## Convention Types

| Convention | Example | Primary Ecosystems |
|------------|---------|-------------------|
| kebab-case | `my-component.ts` | Next.js routes, CSS files, npm packages, URLs |
| snake_case | `my_module.py` | Python, Rust, Ruby, SQL, C |
| PascalCase | `MyComponent.tsx` | React components, C# classes, Go exported types |
| camelCase | `myHelper.ts` | JS/TS non-component files, Java methods, Go unexported |
| SCREAMING_SNAKE | `MAX_RETRIES` | Constants (all languages), env vars |
| lowercase | `handlers` | Go packages, Docker images, k8s resources |

## Framework-Specific Rules

### JavaScript / TypeScript

| File Type | Convention | Example | Notes |
|-----------|-----------|---------|-------|
| React component | PascalCase | `UserCard.tsx` | Matches the default export name |
| React hook | camelCase with `use` prefix | `useAuth.ts` | React convention for hooks |
| Utility/helper | camelCase or kebab-case | `formatDate.ts` | Either acceptable, be consistent |
| Constants file | camelCase or kebab-case | `constants.ts` | SCREAMING_SNAKE for values inside |
| Test file | matches source + suffix | `UserCard.test.tsx` | `.test.` or `.spec.` |
| Style file | matches component | `UserCard.module.css` | Co-located with component |
| Type definition | PascalCase or camelCase | `types.ts` or `UserTypes.ts` | PascalCase for type-only files |
| Config file | kebab-case or standard name | `eslint.config.js` | Use ecosystem standard names |
| Directory | kebab-case | `user-settings/` | Lowercase, hyphen-separated |

### Next.js Specifics

| File Type | Convention | Example | Why |
|-----------|-----------|---------|-----|
| Route segment | kebab-case | `user-profile/page.tsx` | Maps to URL slug |
| Route group | (parenthesized) | `(auth)/login/page.tsx` | Doesn't affect URL |
| Dynamic route | [bracketed] | `[userId]/page.tsx` | Next.js convention |
| Catch-all | [...slug] | `[...slug]/page.tsx` | Next.js convention |
| Layout | `layout.tsx` | `app/layout.tsx` | Fixed name |
| Loading | `loading.tsx` | `app/loading.tsx` | Fixed name |
| Error | `error.tsx` | `app/error.tsx` | Fixed name |
| API route | `route.ts` | `app/api/users/route.ts` | Fixed name |

### Python

| File Type | Convention | Example | Authority |
|-----------|-----------|---------|-----------|
| Module | snake_case | `user_service.py` | PEP 8 |
| Package (dir) | snake_case | `data_processing/` | PEP 8 |
| Class | PascalCase (inside file) | `class UserService:` | PEP 8 |
| Test file | `test_` prefix | `test_user_service.py` | pytest convention |
| Config | snake_case | `settings.py` | Django/FastAPI convention |
| Migration | timestamp prefix | `0001_initial.py` | Django convention |
| Script | snake_case | `run_pipeline.py` | PEP 8 |
| Constant | SCREAMING_SNAKE (inside file) | `MAX_CONNECTIONS = 10` | PEP 8 |

**Python violations that matter:**
- camelCase file names (always wrong in Python)
- Hyphens in package names (import system can't handle them)
- PascalCase directories (confusing, non-standard)

### Go

| File Type | Convention | Example | Authority |
|-----------|-----------|---------|-----------|
| Source file | snake_case or lowercase | `user_handler.go` | Go convention |
| Test file | `_test.go` suffix | `user_handler_test.go` | Go convention |
| Package (dir) | lowercase, single word preferred | `handlers/` | Effective Go |
| Interface | PascalCase (inside file) | `type UserStore interface{}` | Go convention |
| Generated code | `.gen.go` or `_gen.go` suffix | `models_gen.go` | Common pattern |

**Go violations that matter:**
- Hyphens in package names (won't compile)
- PascalCase directories (non-idiomatic)
- Underscores in package names (discouraged)

### Rust

| File Type | Convention | Example | Authority |
|-----------|-----------|---------|-----------|
| Source file | snake_case | `user_service.rs` | Rust convention |
| Module (dir) | snake_case | `data_layer/` | Rust convention |
| Module entry | `mod.rs` | `data_layer/mod.rs` | Rust convention |
| Test | inline `#[cfg(test)]` | same file | Rust convention |
| Integration test | snake_case | `tests/api_test.rs` | Rust convention |
| Binary | kebab-case | `my-tool` (in Cargo.toml) | Cargo convention |

### Docker / Kubernetes / Infrastructure

| File Type | Convention | Example |
|-----------|-----------|---------|
| Dockerfile | `Dockerfile` or `Dockerfile.{variant}` | `Dockerfile.production` |
| Docker Compose | `docker-compose.yml` or `compose.yml` | `compose.yml` (newer standard) |
| K8s manifests | kebab-case | `api-deployment.yaml` |
| Terraform | snake_case | `main.tf`, `variables.tf` |
| Helm chart | kebab-case | `my-service/` |
| Environment | `.env.{environment}` | `.env.production` |

## Directory Naming Rules

**Universal rules (all ecosystems):**
- Directories are always lowercase
- Never use spaces in directory names
- Prefer short, descriptive names (1-2 words)
- Nesting depth should not exceed 5 levels from root

**Separators by ecosystem:**
| Ecosystem | Directory Separator | Example |
|-----------|-------------------|---------|
| JS/TS | kebab-case | `user-settings/` |
| Python | snake_case | `user_settings/` |
| Go | lowercase (no separator) | `usersettings/` or single word |
| Rust | snake_case | `user_settings/` |
| General/infra | kebab-case | `ci-scripts/` |

## Common Convention Smells

These patterns usually indicate naming debt:

1. **Mixed conventions in same directory**: `UserCard.tsx` + `helper_utils.tsx` + `api-client.tsx`
2. **Convention doesn't match ecosystem**: `myModule.py` (camelCase Python)
3. **Plural/singular inconsistency**: `components/` but `hook/` but `utils/`
4. **Abbreviation inconsistency**: `auth/` and `authentication/` coexisting
5. **Number prefixes for ordering**: `01_setup/`, `02_config/` (use config files for ordering)
6. **Case-sensitive collisions**: `utils.ts` and `Utils.ts` (breaks on case-insensitive filesystems)
7. **Spaces or special characters**: `my component.tsx` or `my@helper.ts`

---

## Barrel Files (index.ts / index.js)

Barrel files re-export from multiple modules to create a single import surface. They're common in JS/TS projects and have specific conventions and anti-patterns.

### When Barrel Files Help

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts          ← barrel: export { Button } from './Button'
├── Card/
│   ├── Card.tsx
│   └── index.ts
└── index.ts              ← top-level barrel: export * from './Button'; export * from './Card'
```

✅ **Good use**: Component-level barrel for co-located files (hides internals, stable import path)
✅ **Good use**: Library/SDK entry points — `src/index.ts` as the public API surface

### Barrel Anti-Patterns

❌ **Deep barrel chains**: A barrel that re-exports from another barrel that re-exports from another. Breaks tree-shaking in some bundlers and creates circular dependency risk.

❌ **Everything-barrel**: `src/index.ts` that re-exports from every subdirectory. Causes bundlers to include unused code and slows TypeScript type resolution.

❌ **Barrels in Next.js `app/` directory**: Each file in `app/` has a specific Next.js role (`page.tsx`, `layout.tsx`, `route.ts`). Barrel files here confuse the router and cause unintended page exports.

❌ **Barrels causing circular imports**: If `components/index.ts` exports from `forms/` and `forms/` imports from `components/`, you've created a circular dep. Usually only detectable at runtime.

### Framework-Specific Guidance

| Framework | Barrel Strategy |
|-----------|----------------|
| Next.js App Router | ❌ No barrels in `app/`. ✅ OK in `components/`, `lib/`, `hooks/` |
| React SPA (Vite) | ✅ Component-level barrels OK. ⚠️ Top-level barrel can hurt HMR speed |
| Node.js API | ✅ Module-level barrels OK. Keep `src/index.ts` as the single entry point |
| Library/SDK | ✅ Required — `src/index.ts` IS the public API. Be explicit, don't re-export everything |
| Python | N/A — `__init__.py` serves the same role. Keep it explicit, not wildcard imports |

### Detection

```bash
# Find all barrel files
find . -name "index.ts" -o -name "index.js" | grep -v node_modules | head -20

# Find deep barrel chains (index.ts that imports from another index.ts)
grep -rn "from.*index" --include="index.ts" | grep -v node_modules | head -20

# Find wildcard barrel exports (potential tree-shaking killers)
grep -rn "^export \*" --include="index.ts" | grep -v node_modules | head -20
```
