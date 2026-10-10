#!/bin/bash
set -euo pipefail

# Eval 5: Dangerous Restructure
# Monorepo with Docker, CI, aliases, symlinks — max risk surface

DIR="${1:-.}/dangerous-monorepo"
rm -rf "$DIR"
mkdir -p "$DIR"
cd "$DIR"

git init -q

cat > .gitignore << 'EOF'
node_modules/
dist/
.next/
.env
*.log
EOF

# Turborepo config
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": { "dependsOn": ["build"] },
    "lint": {}
  }
}
EOF

cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

cat > package.json << 'EOF'
{
  "name": "dangerous-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "dev": "turbo run dev"
  }
}
EOF

# tsconfig with path aliases
cat > tsconfig.base.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "paths": {
      "@repo/ui/*": ["./packages/ui/src/*"],
      "@repo/utils/*": ["./packages/utils/src/*"],
      "@repo/types": ["./packages/types/src/index.ts"]
    }
  }
}
EOF

# === App: Web (Next.js) ===
mkdir -p apps/web/src/app apps/web/src/components

cat > apps/web/package.json << 'EOF'
{
  "name": "@repo/web",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*",
    "@repo/types": "workspace:*"
  }
}
EOF

cat > apps/web/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@repo/ui/*": ["../../packages/ui/src/*"],
      "@repo/utils/*": ["../../packages/utils/src/*"]
    }
  }
}
EOF

cat > apps/web/next.config.js << 'EOF'
const path = require('path');
module.exports = {
  transpilePackages: ['@repo/ui', '@repo/utils'],
  webpack: (config) => {
    config.resolve.alias['@repo/ui'] = path.resolve(__dirname, '../../packages/ui/src');
    return config;
  }
};
EOF

cat > apps/web/Dockerfile << 'EOF'
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY packages/types/package.json ./packages/types/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build --filter=@repo/web

FROM base AS runner
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/.next/standalone/server.js"]
EOF

cat > apps/web/src/app/page.tsx << 'EOF'
import { Button } from '@repo/ui/Button';
import { formatDate } from '@repo/utils/date';
export default function Home() {
  return <div><Button>Click</Button><p>{formatDate(new Date())}</p></div>;
}
EOF

cat > apps/web/src/components/Header.tsx << 'EOF'
import { Button } from '@repo/ui/Button';
export function Header() { return <header><Button>Menu</Button></header>; }
EOF

# === App: API (Express) ===
mkdir -p apps/api/src/routes apps/api/src/middleware

cat > apps/api/package.json << 'EOF'
{
  "name": "@repo/api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "dependencies": {
    "express": "^4.18.0",
    "@repo/utils": "workspace:*",
    "@repo/types": "workspace:*"
  }
}
EOF

cat > apps/api/Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/utils/package.json ./packages/utils/
COPY packages/types/package.json ./packages/types/
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build --filter=@repo/api
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
EOF

cat > apps/api/src/index.ts << 'EOF'
import express from 'express';
import { usersRouter } from './routes/users';
const app = express();
app.use('/api/users', usersRouter);
app.listen(4000);
EOF

cat > apps/api/src/routes/users.ts << 'EOF'
import { Router } from 'express';
import { formatDate } from '@repo/utils/date';
export const usersRouter = Router();
usersRouter.get('/', (req, res) => { res.json([]); });
EOF

# === Packages: UI ===
mkdir -p packages/ui/src

cat > packages/ui/package.json << 'EOF'
{
  "name": "@repo/ui",
  "version": "1.0.0",
  "main": "src/index.ts",
  "exports": {
    "./Button": "./src/Button.tsx",
    "./Card": "./src/Card.tsx"
  }
}
EOF

cat > packages/ui/src/Button.tsx << 'EOF'
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn">{children}</button>;
}
EOF

cat > packages/ui/src/Card.tsx << 'EOF'
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
EOF

cat > packages/ui/src/index.ts << 'EOF'
export { Button } from './Button';
export { Card } from './Card';
EOF

# === Packages: Utils ===
mkdir -p packages/utils/src

cat > packages/utils/package.json << 'EOF'
{
  "name": "@repo/utils",
  "version": "1.0.0",
  "main": "src/index.ts",
  "exports": {
    "./date": "./src/date.ts",
    "./format": "./src/format.ts"
  }
}
EOF

cat > packages/utils/src/date.ts << 'EOF'
export function formatDate(d: Date): string { return d.toISOString(); }
EOF

cat > packages/utils/src/format.ts << 'EOF'
export function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
EOF

cat > packages/utils/src/index.ts << 'EOF'
export { formatDate } from './date';
export { capitalize } from './format';
EOF

# === Packages: Types ===
mkdir -p packages/types/src

cat > packages/types/package.json << 'EOF'
{
  "name": "@repo/types",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
EOF

cat > packages/types/src/index.ts << 'EOF'
export interface User { id: string; name: string; email: string; }
export interface ApiResponse<T> { data: T; error?: string; }
EOF

# === CI: GitHub Actions with path filters ===
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI
on:
  push:
    branches: [main]
    paths:
      - 'apps/**'
      - 'packages/**'
      - 'package.json'
      - 'turbo.json'
  pull_request:
    paths:
      - 'apps/**'
      - 'packages/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: pnpm run test

  deploy-web:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker
        working-directory: .
        run: docker build -f apps/web/Dockerfile -t web .

  deploy-api:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker
        working-directory: .
        run: docker build -f apps/api/Dockerfile -t api .
EOF

# === Symlink (common in monorepos for shared config) ===
ln -s ../../tsconfig.base.json apps/web/tsconfig.base.json 2>/dev/null || true
ln -s ../../tsconfig.base.json apps/api/tsconfig.base.json 2>/dev/null || true

# Docker Compose
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./apps/web/public:/app/apps/web/public
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "4000:4000"
EOF

cat > README.md << 'EOF'
# Dangerous Monorepo

A turborepo monorepo with web frontend, API backend, and shared packages.

## Apps
- `apps/web` — Next.js frontend
- `apps/api` — Express API

## Packages
- `packages/ui` — Shared React components
- `packages/utils` — Shared utilities
- `packages/types` — Shared TypeScript types
EOF

git add -A
git commit -q -m "initial commit"

echo "✅ Eval 5 repo created at $DIR"
