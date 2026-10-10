#!/bin/bash
set -euo pipefail

# Eval 1: Messy Next.js App
# Creates a Next.js project with multiple organizational issues

DIR="${1:-.}/messy-nextjs-app"
rm -rf "$DIR"
mkdir -p "$DIR"
cd "$DIR"

git init -q

# Root files
cat > package.json << 'EOF'
{
  "name": "messy-nextjs-app",
  "version": "0.1.0",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
EOF

cat > README.md << 'EOF'
# My App
TODO: add description
EOF

# Missing .gitignore entries — intentionally incomplete
cat > .gitignore << 'EOF'
node_modules/
EOF

# TRACKED .env file (security issue)
cat > .env << 'EOF'
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/mydb
NEXT_PUBLIC_API_KEY=<OPENAI_API_KEY>
JWT_SECRET=<JWT_SECRET>
EOF

# tsconfig with aliases
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "es2017"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "node",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
EOF

cat > next.config.js << 'EOF'
module.exports = { reactStrictMode: true }
EOF

# Flat src/ dump with mixed naming
mkdir -p src

# PascalCase components (correct for React)
cat > src/UserCard.tsx << 'EOF'
import { format_date } from './helper_utils';
import { api_client } from './api-client';
export default function UserCard() { return <div>User</div>; }
EOF

cat > src/Dashboard.tsx << 'EOF'
import UserCard from './UserCard';
import { NavBar } from './navbar';
export default function Dashboard() { return <div><NavBar /><UserCard /></div>; }
EOF

# snake_case utility (wrong for JS/TS)
cat > src/helper_utils.tsx << 'EOF'
export function format_date(d: Date) { return d.toISOString(); }
export function calculate_total(items: any[]) { return items.length; }
EOF

# kebab-case file (inconsistent)
cat > src/api-client.tsx << 'EOF'
export const api_client = { fetch: () => {} };
EOF

# lowercase (also inconsistent)
cat > src/navbar.tsx << 'EOF'
export function NavBar() { return <nav>Nav</nav>; }
EOF

# Random files dumped at wrong levels
cat > src/types.ts << 'EOF'
export interface User { id: string; name: string; }
EOF

cat > src/constants.ts << 'EOF'
export const API_URL = 'https://api.example.com';
export const maxRetries = 3;
EOF

# App router pages (correct location but minimal)
mkdir -p src/app
cat > src/app/layout.tsx << 'EOF'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>;
}
EOF

cat > src/app/page.tsx << 'EOF'
import Dashboard from '../Dashboard';
export default function Home() { return <Dashboard />; }
EOF

# No tests directory
# No .env.example
# No subdirectories in components

# Build artifacts that shouldn't be tracked
mkdir -p .next/cache
echo "cached" > .next/cache/data.json

git add -A
git commit -q -m "initial commit"

echo "✅ Eval 1 repo created at $DIR"
