# Structure Patterns Reference

Best-practice directory structures for each project type. Use the detected project classification from SKILL.md to select the appropriate pattern. Adapt to actual project needs — these are starting points, not dogma.

## Table of Contents
1. [Next.js Application](#nextjs)
2. [React SPA (Vite/CRA)](#react-spa)
3. [Node.js API/Service](#nodejs-api)
4. [Python Application](#python)
5. [Go Application](#go)
6. [Rust Application](#rust)
7. [Monorepo (JS/TS)](#monorepo-js)
8. [Monorepo (Polyglot)](#monorepo-polyglot)
9. [Infrastructure as Code](#iac)
10. [Library/SDK](#library-sdk)
11. [Data/ML Project](#data-ml)
12. [Documentation Site](#docs-site)

---

<a id="nextjs"></a>
## 1. Next.js Application (App Router)

```
project-root/
├── src/
│   ├── app/                    # App Router (routes, layouts, pages)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/             # Route groups
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── api/                # API routes
│   │   │   └── [resource]/route.ts
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Primitives (Button, Input, Card)
│   │   ├── forms/              # Form-specific components
│   │   └── layouts/            # Layout components (Sidebar, Nav)
│   ├── lib/                    # Shared utilities, helpers, clients
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth utilities
│   │   ├── db.ts               # Database client
│   │   └── utils.ts            # General utilities
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   ├── styles/                 # Global styles, theme
│   └── config/                 # App configuration constants
├── public/                     # Static assets
├── tests/                      # Test files (mirrors src/)
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

**Key conventions:**
- Files in `app/` are kebab-case (Next.js requirement for routes)
- Components are PascalCase files
- Utilities/lib are kebab-case or camelCase
- Route groups use `(groupName)` prefix
- Server components by default, `'use client'` only where needed

---

<a id="react-spa"></a>
## 2. React SPA (Vite/CRA)

```
project-root/
├── src/
│   ├── assets/                 # Images, fonts, static files
│   ├── components/
│   │   ├── ui/                 # Primitives
│   │   ├── forms/
│   │   └── layouts/
│   ├── features/               # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   └── dashboard/
│   │       ├── components/
│   │       └── hooks/
│   ├── hooks/                  # Shared hooks
│   ├── lib/                    # Utilities, helpers
│   ├── pages/                  # Route-level components (or routes/)
│   ├── stores/                 # State management (zustand/redux)
│   ├── types/                  # Shared types
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tests/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

**Key conventions:**
- Feature-based organization scales better than type-based for large apps
- Components PascalCase, everything else kebab-case or camelCase
- Co-locate feature-specific hooks/types with the feature

---

<a id="nodejs-api"></a>
## 3. Node.js API/Service

```
project-root/
├── src/
│   ├── routes/                 # Route definitions (Express/Fastify)
│   │   ├── auth.ts
│   │   └── users.ts
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── models/                 # Data models / ORM entities
│   ├── middleware/              # Express/Fastify middleware
│   ├── lib/                    # Shared utilities
│   │   ├── db.ts
│   │   ├── cache.ts
│   │   ├── logger.ts
│   │   └── errors.ts
│   ├── types/                  # TypeScript types
│   ├── config/                 # Environment-based config
│   │   ├── index.ts
│   │   └── database.ts
│   ├── jobs/                   # Background jobs / workers
│   └── index.ts                # App entry point
├── tests/
│   ├── unit/
│   └── integration/
├── scripts/                    # Dev/deploy scripts
├── migrations/                 # Database migrations
├── .env.example
├── Dockerfile
├── tsconfig.json
├── package.json
└── README.md
```

**Key conventions:**
- Layered architecture: routes → controllers → services → models
- All files kebab-case or camelCase (no PascalCase for non-class files)
- Migrations in dedicated directory with timestamps
- Config centralized, environment-aware

---

<a id="python"></a>
## 4. Python Application

```
project-root/
├── src/
│   └── package_name/           # Main package (snake_case)
│       ├── __init__.py
│       ├── main.py             # Entry point
│       ├── api/                # API routes (FastAPI/Flask)
│       │   ├── __init__.py
│       │   ├── routes.py
│       │   └── dependencies.py
│       ├── core/               # Core business logic
│       │   ├── __init__.py
│       │   ├── config.py
│       │   └── security.py
│       ├── models/             # Pydantic/SQLAlchemy models
│       │   ├── __init__.py
│       │   └── user.py
│       ├── services/           # Business logic services
│       ├── db/                 # Database layer
│       │   ├── __init__.py
│       │   ├── session.py
│       │   └── migrations/
│       └── utils/              # Shared utilities
├── tests/
│   ├── conftest.py
│   ├── unit/
│   └── integration/
├── scripts/                    # Dev/deploy scripts
├── pyproject.toml              # Project config (PEP 621)
├── .env.example
├── Dockerfile
└── README.md
```

**Key conventions:**
- ALL files and directories snake_case (PEP 8)
- Package in src/ layout (recommended by PyPA)
- pyproject.toml over setup.py (modern standard)
- Tests mirror source structure

---

<a id="go"></a>
## 5. Go Application

```
project-root/
├── cmd/                        # Entry points
│   └── server/
│       └── main.go
├── internal/                   # Private application code
│   ├── api/                    # HTTP handlers
│   │   ├── handler.go
│   │   ├── middleware.go
│   │   └── router.go
│   ├── domain/                 # Business logic + models
│   │   ├── user.go
│   │   └── user_service.go
│   ├── repository/             # Data access
│   │   ├── postgres/
│   │   └── redis/
│   └── config/                 # Configuration
├── pkg/                        # Public libraries (if any)
├── migrations/                 # SQL migrations
├── scripts/                    # Build/deploy scripts
├── api/                        # API specs (OpenAPI, proto)
├── deployments/                # Docker, k8s manifests
├── go.mod
├── go.sum
├── Makefile
├── Dockerfile
└── README.md
```

**Key conventions:**
- Directories lowercase, no underscores or hyphens (Go convention)
- `internal/` enforced by Go compiler — code here is unexportable
- `cmd/` for binaries, one main.go per binary
- Tests co-located with source (`*_test.go` files)
- No `src/` directory (Go convention)

---

<a id="rust"></a>
## 6. Rust Application

```
project-root/
├── src/
│   ├── main.rs                 # Binary entry point
│   ├── lib.rs                  # Library root (if dual crate)
│   ├── api/                    # HTTP handlers
│   │   ├── mod.rs
│   │   └── routes.rs
│   ├── domain/                 # Business logic
│   │   ├── mod.rs
│   │   └── models.rs
│   ├── db/                     # Database layer
│   │   ├── mod.rs
│   │   └── migrations/
│   ├── config/
│   │   └── mod.rs
│   └── utils/
│       └── mod.rs
├── tests/                      # Integration tests
│   └── api_tests.rs
├── benches/                    # Benchmarks
├── migrations/                 # SQL migrations
├── Cargo.toml
├── Cargo.lock
├── Dockerfile
└── README.md
```

**Key conventions:**
- Files and directories snake_case (Rust convention)
- Modules declared via mod.rs or filename.rs
- Unit tests in same file (`#[cfg(test)]` mod)
- Integration tests in `tests/` directory
- Cargo.toml is the single source of truth

---

<a id="monorepo-js"></a>
## 7. Monorepo (JS/TS — Turborepo/Nx)

```
project-root/
├── apps/                       # Deployable applications
│   ├── web/                    # Next.js/React frontend
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── api/                    # Backend service
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── worker/                 # Background jobs
│       ├── src/
│       └── package.json
├── packages/                   # Shared libraries
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── config/                 # Shared configs (eslint, tsconfig)
│   │   ├── eslint-config/
│   │   └── tsconfig/
│   ├── types/                  # Shared TypeScript types
│   └── utils/                  # Shared utilities
├── tools/                      # Build tools, scripts, generators
├── turbo.json                  # Turborepo pipeline config
├── pnpm-workspace.yaml         # Workspace definition
├── package.json                # Root package.json
├── tsconfig.base.json          # Base TypeScript config
└── README.md
```

**Key conventions:**
- `apps/` for deployables, `packages/` for shared libraries
- Each package has own package.json, tsconfig.json
- Root package.json for workspace-level scripts only
- Shared configs as packages (not copied into each app)
- Use workspace protocol for internal deps (`"@repo/ui": "workspace:*"`)

---

<a id="monorepo-polyglot"></a>
## 8. Monorepo (Polyglot)

```
project-root/
├── services/                   # Backend services (any language)
│   ├── auth-service/           # Go service
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── go.mod
│   │   └── Dockerfile
│   ├── api-gateway/            # Node.js service
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── ml-pipeline/            # Python service
│       ├── src/
│       ├── pyproject.toml
│       └── Dockerfile
├── clients/                    # Frontend applications
│   ├── web/
│   └── mobile/
├── libs/                       # Shared code (language-specific)
│   ├── proto/                  # Protobuf definitions
│   └── shared-types/           # Generated types
├── infra/                      # Infrastructure
│   ├── terraform/
│   ├── k8s/
│   └── docker-compose.yml
├── scripts/                    # Cross-service scripts
├── Makefile                    # Unified build commands
└── README.md
```

**Key conventions:**
- Each service is self-contained with own build system
- Shared contracts via protobuf/OpenAPI (not code sharing across languages)
- Makefile or Taskfile as unified command interface
- Each service has own Dockerfile
- Infrastructure in dedicated directory

---

<a id="iac"></a>
## 9. Infrastructure as Code

```
project-root/
├── environments/               # Per-environment configs
│   ├── dev/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   └── production/
├── modules/                    # Reusable Terraform modules
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── compute/
│   └── database/
├── scripts/                    # Helper scripts (init, plan, apply)
├── policies/                   # OPA/Sentinel policies
├── docs/                       # Architecture diagrams, runbooks
├── .github/
│   └── workflows/
│       ├── plan.yml
│       └── apply.yml
├── Makefile
└── README.md
```

**Key conventions:**
- Environments isolated (separate state per environment)
- Modules are reusable, versioned
- Variables and outputs in dedicated files per module
- No hardcoded values — everything parameterized
- State backend configured per environment

---

<a id="library-sdk"></a>
## 10. Library/SDK

```
project-root/
├── src/                        # Source code
│   ├── index.ts                # Public API entry point
│   ├── client.ts
│   └── types.ts
├── tests/
│   ├── unit/
│   └── integration/
├── examples/                   # Usage examples
│   ├── basic/
│   └── advanced/
├── docs/                       # API documentation
├── benchmarks/                 # Performance benchmarks
├── dist/                       # Build output (gitignored)
├── package.json                # exports, main, module, types fields
├── tsconfig.json
├── tsconfig.build.json         # Build-specific config
├── CHANGELOG.md
├── LICENSE
└── README.md
```

**Key conventions:**
- Clear public API surface (single entry point)
- Examples directory for users
- CHANGELOG maintained
- dist/ in .gitignore, built on publish
- Package.json exports field properly configured

---

<a id="data-ml"></a>
## 11. Data/ML Project

```
project-root/
├── data/                       # Data directory (gitignored for large files)
│   ├── raw/                    # Original, immutable data
│   ├── processed/              # Cleaned/transformed data
│   └── external/               # Third-party data
├── notebooks/                  # Jupyter notebooks (numbered for order)
│   ├── 01_exploration.ipynb
│   ├── 02_feature_engineering.ipynb
│   └── 03_modeling.ipynb
├── src/
│   └── package_name/
│       ├── data/               # Data loading/processing
│       ├── features/           # Feature engineering
│       ├── models/             # Model definitions
│       ├── training/           # Training pipelines
│       └── evaluation/         # Evaluation metrics
├── models/                     # Saved models (gitignored)
├── configs/                    # Experiment configs (YAML)
├── tests/
├── scripts/                    # Training/eval scripts
├── pyproject.toml
├── .dvc/                       # DVC config (if using)
├── dvc.yaml
└── README.md
```

**Key conventions:**
- Raw data immutable — never modify in place
- Notebooks numbered for execution order
- Production code in src/, not in notebooks
- Large files tracked with DVC/Git LFS, not Git
- Configs separate from code (reproducibility)

---

<a id="docs-site"></a>
## 12. Documentation Site

```
project-root/
├── docs/                       # Documentation source
│   ├── getting-started/
│   │   ├── installation.md
│   │   └── quickstart.md
│   ├── guides/
│   ├── api/
│   └── reference/
├── static/                     # Static assets (images, diagrams)
│   └── img/
├── src/                        # Custom components/theme (if any)
├── docusaurus.config.js        # Or mkdocs.yml, .vitepress/config.ts
├── sidebars.js                 # Navigation structure
├── package.json
└── README.md
```

**Key conventions:**
- Content in docs/, not root
- Images co-located with docs or in static/
- Navigation defined in config, not by folder structure alone
- All docs files kebab-case
