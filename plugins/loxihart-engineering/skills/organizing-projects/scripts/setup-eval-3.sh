#!/bin/bash
set -euo pipefail

# Eval 3: Multi-Repo Consolidation Candidate
# Three separate repos with duplicated shared types

BASE="${1:-.}/multi-repo"
rm -rf "$BASE"
mkdir -p "$BASE"

# === Repo 1: React Frontend ===
mkdir -p "$BASE/frontend/src/components" "$BASE/frontend/src/types" "$BASE/frontend/src/api"
cd "$BASE/frontend"
git init -q

cat > package.json << 'EOF'
{
  "name": "frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  }
}
EOF

# Duplicated types (same in all 3 repos)
cat > src/types/user.ts << 'EOF'
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  pagination?: { page: number; total: number; };
}
EOF

cat > src/api/client.ts << 'EOF'
import { User, ApiResponse } from '../types/user';
export async function getUsers(): Promise<ApiResponse<User[]>> {
  const res = await fetch('/api/users');
  return res.json();
}
EOF

cat > src/components/UserList.tsx << 'EOF'
import { User } from '../types/user';
export function UserList({ users }: { users: User[] }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
EOF

cat > README.md << 'EOF'
# Frontend
React frontend for the app.
EOF

git add -A && git commit -q -m "initial"

# === Repo 2: Node API ===
mkdir -p "$BASE/api/src/routes" "$BASE/api/src/types" "$BASE/api/src/services"
cd "$BASE/api"
git init -q

cat > package.json << 'EOF'
{
  "name": "api",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.3.0"
  }
}
EOF

# SAME types duplicated
cat > src/types/user.ts << 'EOF'
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  pagination?: { page: number; total: number; };
}
EOF

cat > src/routes/users.ts << 'EOF'
import { User, ApiResponse } from '../types/user';
export function getUsers(): ApiResponse<User[]> {
  return { data: [] };
}
EOF

cat > src/services/user-service.ts << 'EOF'
import { User, CreateUserInput } from '../types/user';
export function createUser(input: CreateUserInput): User {
  return { ...input, id: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}
EOF

cat > README.md << 'EOF'
# API
Express API backend.
EOF

git add -A && git commit -q -m "initial"

# === Repo 3: Shared Types (attempted but incomplete) ===
mkdir -p "$BASE/shared-types/src"
cd "$BASE/shared-types"
git init -q

cat > package.json << 'EOF'
{
  "name": "@company/shared-types",
  "version": "0.0.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
EOF

# Types here are OUTDATED compared to the copies in frontend/api
cat > src/index.ts << 'EOF'
export interface User {
  id: string;
  name: string;
  email: string;
}
EOF

cat > README.md << 'EOF'
# Shared Types
Shared TypeScript types. NOTE: This package is out of date.
The frontend and API repos have their own copies.
EOF

git add -A && git commit -q -m "initial"

echo "✅ Eval 3 repos created at $BASE/{frontend,api,shared-types}"
