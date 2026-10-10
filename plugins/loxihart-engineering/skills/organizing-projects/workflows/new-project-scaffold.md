<required_reading>
Read before starting:
- references/structure-patterns.md (select the section matching the detected project type)
- references/naming-conventions.md (apply framework-specific naming from the start)
</required_reading>

<objective>
Generate a complete, best-practice starter directory structure for a new (greenfield) project. Output is an opinionated scaffold — not a generic template — tailored to the user's tech stack, team size, and deployment target. Includes starter files, key config placements, and a brief rationale for every structural decision.
</objective>

<process>

## Step 1: Identify Project Type and Context

Ask (or infer from context):

1. **Framework/runtime**: Next.js, React SPA, Node.js API, Python/FastAPI/Django, Go, Rust, monorepo, IaC, etc.
2. **Deployment target**: Vercel, Railway, Docker/k8s, Lambda, bare VPS, etc.
3. **Team size**: Solo, small team (2-5), or larger (5+)? — affects monorepo vs single-repo decision
4. **Auth required?** — Yes adds `lib/auth.ts`, middleware scaffolding
5. **Database?** — Yes adds ORM config placement (Prisma, Drizzle, SQLAlchemy, GORM, etc.)
6. **Testing expectations?** — Minimal (smoke tests) vs comprehensive (unit + integration + e2e)

If the user gives enough context in their initial message (e.g., "scaffold a FastAPI + PostgreSQL service with Docker"), infer all 6 points and proceed without asking.

## Step 2: Classify and Select Pattern

Map to a project type from references/structure-patterns.md:

| User says | Pattern to use |
|-----------|---------------|
| Next.js, NextJS | Next.js Application |
| React, Vite, CRA, SPA | React SPA |
| Express, Fastify, Hono, Node API | Node.js API/Service |
| FastAPI, Flask, Django | Python Application |
| Go, Golang | Go Application |
| Rust, Cargo | Rust Application |
| Multiple apps/packages, turborepo, nx | Monorepo (JS/TS) |
| Terraform, Pulumi, CDK, Ansible | Infrastructure as Code |
| npm package, SDK, library | Library/SDK |
| Jupyter, ML, pandas, PyTorch | Data/ML Project |
| Docusaurus, MkDocs, VitePress | Documentation Site |

Read the relevant section in references/structure-patterns.md before proposing the scaffold.

## Step 3: Generate the Scaffold

Present as a complete, commented directory tree:

```
project-root/
├── src/
│   ├── app/                    # [reason this dir exists]
│   ├── components/             # [reason]
│   └── lib/                    # [reason]
├── tests/                      # [reason]
├── .env.example                # [what vars go here]
├── .gitignore                  # [what it covers]
├── README.md                   # [what it should contain]
└── [framework config files]    # [which ones and why]
```

**Adaptation rules (apply these on top of the base pattern):**

| Context | Addition |
|---------|----------|
| Auth required | `src/lib/auth.ts` or `src/middleware/auth.py` |
| Prisma | `prisma/schema.prisma`, add to `.gitignore`: `prisma/migrations/*.sql` (no — keep tracked) |
| Drizzle | `src/db/schema.ts`, `src/db/migrations/` |
| SQLAlchemy | `src/models/`, `alembic/` |
| Docker deployment | `Dockerfile`, `.dockerignore`, `docker-compose.yml` |
| Vercel deployment | `vercel.json` (only if non-default config needed) |
| GitHub Actions CI | `.github/workflows/ci.yml` |
| Multiple environments | `.env.example`, `.env.local` (gitignored), `.env.production` |
| Monorepo signal (2+ apps sharing code) | See references/structure-patterns.md monorepo section |

## Step 4: Starter Files

For each key file in the scaffold, provide a starter template (not just the filename):

**Always generate starters for:**
- `README.md` — Project name, one-line description, setup steps, scripts reference
- `.gitignore` — Full gitignore for the stack (not just `node_modules`)
- `.env.example` — All required env vars with placeholder values and inline comments
- Root config file (package.json scripts, pyproject.toml, go.mod, Cargo.toml) — pre-filled scripts/metadata

**Generate starters if applicable:**
- `Dockerfile` — Multi-stage build if Node/Python/Go
- `.github/workflows/ci.yml` — Lint + test + build on PR
- `src/lib/db.ts` or equivalent — Database client setup skeleton

## Step 5: Naming Decisions

Explicitly state the naming convention for each layer:

```
Naming decisions for this scaffold:
- Directories:     kebab-case  (user-settings/, not userSettings/)
- React components: PascalCase  (UserCard.tsx, not user-card.tsx)
- Utilities:       camelCase   (formatDate.ts)
- Test files:      [source].test.ts co-located in __tests__/ dirs
- Env vars:        SCREAMING_SNAKE_CASE
```

Reference the relevant ecosystem section from references/naming-conventions.md.

## Step 6: What NOT to Create

Always tell the user what to intentionally omit at this stage:

- ❌ Don't create `src/utils/` catch-all — add utilities to `src/lib/` by domain as needed
- ❌ Don't pre-create empty `src/components/` subdirs — let them emerge organically
- ❌ Don't add CI until you have something to test
- ❌ Don't configure linting/formatting until you've chosen a style guide
- ❌ Don't add Docker until you know your deploy target

**Adjust this list based on what the user actually asked for.**

## Step 7: Bootstrap Commands

Provide the exact commands to initialize the scaffold:

```bash
# Example for Next.js:
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app

# Then move/create the non-default structure:
mkdir -p src/lib src/hooks src/types
touch src/lib/.gitkeep src/hooks/.gitkeep src/types/.gitkeep
cp .env.example .env.local
```

Keep commands runnable end-to-end. If using a CLI that generates a partial scaffold, show which generated dirs to rename or remove.

## Step 8: Output Summary

Present as:
1. **Annotated directory tree** (full scaffold with inline comments)
2. **Starter file contents** (README, .gitignore, .env.example, root config)
3. **Naming convention decisions** (explicit table)
4. **What not to create yet** (short list)
5. **Bootstrap commands** (copy-pasteable)
6. **First 3 things to do** after scaffold is set up

</process>

<success_criteria>
- Project type correctly identified from user context
- Scaffold matches framework conventions from structure-patterns.md
- Naming conventions explicitly stated per ecosystem
- All deployment-specific adaptations applied (Docker, Vercel, etc.)
- Starter file contents provided — not just filenames
- Bootstrap commands are runnable end-to-end
- "What not to create" list prevents premature over-engineering
- No placeholder TODO items in generated files
</success_criteria>
