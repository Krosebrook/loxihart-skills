# Tool Integration Patterns

Quick integration guides for popular automation tools.

## GitHub Integration

### Webhook Handler (Vercel)
```typescript
// api/github-webhook.ts
export default async function handler(req, res) {
  const { action, pull_request } = req.body;
  
  if (action === 'opened') {
    const diff = await fetch(`${pull_request.diff_url}`).then(r => r.text());
    // Send to Claude for review
    const review = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      messages: [{ role: 'user', content: `Review this PR:\n\n${diff}` }]
    });
    
    // Post comment
    await fetch(pull_request.comments_url, {
      method: 'POST',
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
      body: JSON.stringify({ body: review.content[0].text })
    });
  }
  res.status(200).json({ ok: true });
}
```

## Notion Integration

### Query Database
```python
import requests

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = "your_database_id"

def query_notion(filter_conditions: dict):
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2022-06-28"
    }
    response = requests.post(url, json={"filter": filter_conditions}, headers=headers)
    return response.json()["results"]
```

## Zapier/Make Patterns

### Trigger Claude from Zapier
Use Webhooks by Zapier:
1. Trigger: New row in Google Sheets
2. Action: POST to your API endpoint
3. Your endpoint calls Claude
4. Return response to Zapier
5. Zapier writes to Notion

### Make.com Scenario
```json
{
  "flow": [
    {"module": "GoogleSheets:watchRows"},
    {"module": "HTTP:makeRequest", "url": "https://api.anthropic.com/v1/messages"},
    {"module": "Notion:createPage"}
  ]
}
```

## Playwright + MCP

### Web Scraping MCP Tool
```python
from playwright.sync_api import sync_playwright

@mcp.tool()
def scrape_page(url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        content = page.content()
        browser.close()
        return content
```

## HubSpot Integration

```python
import requests

def create_hubspot_contact(email: str, properties: dict):
    url = "https://api.hubapi.com/crm/v3/objects/contacts"
    headers = {"Authorization": f"Bearer {os.getenv('HUBSPOT_TOKEN')}"}
    data = {"properties": {"email": email, **properties}}
    return requests.post(url, json=data, headers=headers).json()
```

## Sentry Integration

### Automated Issue Triage
```python
import sentry_sdk

@mcp.tool()
def analyze_sentry_issue(issue_id: str) -> str:
    # Fetch issue from Sentry
    issue = sentry_sdk.Hub.current.client.get_issue(issue_id)
    
    # Send stacktrace to Claude
    analysis = claude_analyze(issue["stacktrace"])
    
    # Update Sentry issue with analysis
    sentry_sdk.Hub.current.client.update_issue(
        issue_id,
        {"notes": analysis}
    )
    return analysis
```

## Cloudinary Integration

```python
import cloudinary.uploader

def optimize_and_upload(local_path: str) -> str:
    result = cloudinary.uploader.upload(
        local_path,
        transformation=[
            {"quality": "auto", "fetch_format": "auto"}
        ]
    )
    return result["secure_url"]
```

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables
vercel env add ANTHROPIC_API_KEY
```

## Cloudflare Workers

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    
    const { prompt } = await request.json();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });
    
    return new Response(JSON.stringify(message), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```
