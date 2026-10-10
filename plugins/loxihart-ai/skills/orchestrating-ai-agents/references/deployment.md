# Deployment Guide

## Vercel

### Setup
```bash
npm i -g vercel
vercel login
vercel link
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

### Edge Functions
Place in `api/*.ts`:
```typescript
export const config = { runtime: 'edge' };
export default async function handler(req) {
  // Your code
}
```

## Cloudflare Workers

### Setup
```bash
npm i -g wrangler
wrangler login
wrangler init my-worker
wrangler secret put ANTHROPIC_API_KEY
wrangler publish
```

## Railway

```bash
npm i -g railway
railway login
railway link
railway up
```

## Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "server.py"]
```

Deploy:
```bash
docker build -t my-agent .
docker run -p 3000:3000 --env-file .env my-agent
```
