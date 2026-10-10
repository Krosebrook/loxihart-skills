# MCP Server Development Guide

Complete guide for building Model Context Protocol (MCP) servers that extend Claude's capabilities.

## Table of Contents

1. [When to Use MCP](#when-to-use-mcp)
2. [MCP Architecture](#mcp-architecture)
3. [Server Types](#server-types)
4. [Implementation Patterns](#implementation-patterns)
5. [Security Requirements](#security-requirements)
6. [Testing & Validation](#testing--validation)
7. [Deployment](#deployment)

## When to Use MCP

**Choose MCP when:**
- Building tools for Claude desktop/web app
- Need persistent connection between Claude and external systems
- Want reusable tool packages others can install
- Require stateful interactions (e.g., database connections)

**Don't use MCP when:**
- Building one-off scripts (use bash/Python directly)
- Need no-code solution (use Zapier/Make)
- Building multi-agent system (use LangChain/CrewAI)

## MCP Architecture

```
Claude App
    ↓ (MCP Protocol)
MCP Server (Your Code)
    ↓ (API/DB calls)
External Services (GitHub, Notion, etc.)
```

**Key components:**
- **Tools**: Functions Claude can call
- **Resources**: Data Claude can read
- **Prompts**: Templates Claude can use

## Server Types

### Type 1: Data Access Server
**Purpose**: Query databases, file systems, APIs  
**Example**: Notion MCP, Google Drive MCP  
**Tools**: `search`, `fetch`, `list`  
**Resources**: Database schemas, file metadata

### Type 2: Action Server
**Purpose**: Modify external state  
**Example**: GitHub MCP, Slack MCP  
**Tools**: `create`, `update`, `delete`  
**Resources**: None (stateless actions)

### Type 3: Hybrid Server
**Purpose**: Both read and write  
**Example**: HubSpot MCP, Sentry MCP  
**Tools**: `search` + `create` + `update`  
**Resources**: Schemas, configurations

## Implementation Patterns

### Pattern 1: Python FastMCP Server

**File structure:**
```
my-mcp-server/
├── server.py          # Main MCP server
├── .env.example       # Environment template
├── requirements.txt   # Dependencies
└── README.md         # Setup instructions
```

**server.py template:**
```python
#!/usr/bin/env python3
import os
from typing import Any
from fastmcp import FastMCP

# Initialize server
mcp = FastMCP("My Tool Server")

@mcp.tool()
def search_items(query: str, limit: int = 10) -> list[dict[str, Any]]:
    """Search for items matching the query.
    
    Args:
        query: Search terms
        limit: Maximum results (default: 10)
    
    Returns:
        List of matching items with metadata
    """
    # Input validation
    if not query or not query.strip():
        raise ValueError("Query cannot be empty")
    if limit < 1 or limit > 100:
        raise ValueError("Limit must be between 1 and 100")
    
    # Get API key from environment
    api_key = os.getenv("API_KEY")
    if not api_key:
        raise EnvironmentError("API_KEY not set")
    
    # TODO: Implement search logic
    results = []
    
    return results

@mcp.resource("config://schema")
def get_schema() -> str:
    """Return the data schema for reference."""
    return """
    # Data Schema
    
    ## Item
    - id: string (unique identifier)
    - title: string (display name)
    - created_at: ISO datetime
    - metadata: dict (custom fields)
    """

if __name__ == "__main__":
    mcp.run()
```

**requirements.txt:**
```
fastmcp>=0.1.0
python-dotenv>=1.0.0
requests>=2.31.0
```

**.env.example:**
```bash
# API Configuration
API_KEY=your_api_key_here
API_BASE_URL=https://api.example.com

# Server Configuration
PORT=3000
LOG_LEVEL=INFO
```

### Pattern 2: TypeScript MCP Server

**File structure:**
```
my-mcp-server/
├── src/
│   └── index.ts       # Main server
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

**src/index.ts template:**
```typescript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import * as dotenv from "dotenv";

dotenv.config();

// Validate environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable required");
}

// Define tools
const TOOLS: Tool[] = [
  {
    name: "search_items",
    description: "Search for items matching the query",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search terms",
        },
        limit: {
          type: "number",
          description: "Maximum results (default: 10)",
          minimum: 1,
          maximum: 100,
        },
      },
      required: ["query"],
    },
  },
];

// Create server
const server = new Server(
  {
    name: "my-tool-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "search_items") {
    const { query, limit = 10 } = args as { query: string; limit?: number };

    // Input validation
    if (!query || query.trim() === "") {
      throw new Error("Query cannot be empty");
    }
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    // TODO: Implement search logic
    const results: any[] = [];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

## Security Requirements

### Input Validation

**ALWAYS validate:**
```python
# String inputs
if not query or not isinstance(query, str):
    raise ValueError("Invalid query parameter")

# Numeric bounds
if limit < 1 or limit > 100:
    raise ValueError("Limit out of range")

# Enum values
VALID_STATUSES = {"open", "closed", "pending"}
if status not in VALID_STATUSES:
    raise ValueError(f"Status must be one of {VALID_STATUSES}")

# SQL injection prevention
import re
if re.search(r"[;'\"]", table_name):
    raise ValueError("Invalid table name")
```

### Secrets Management

**NEVER hardcode:**
```python
# ❌ BAD
API_KEY = "sk-abc123..."

# ✅ GOOD
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise EnvironmentError("API_KEY not set")
```

### Rate Limiting

**Implement rate limits:**
```python
from time import time, sleep
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_calls: int, window_secs: int):
        self.max_calls = max_calls
        self.window = window_secs
        self.calls = defaultdict(list)
    
    def check(self, key: str) -> bool:
        now = time()
        # Remove old calls
        self.calls[key] = [t for t in self.calls[key] if now - t < self.window]
        
        if len(self.calls[key]) >= self.max_calls:
            return False
        
        self.calls[key].append(now)
        return True

# Usage
limiter = RateLimiter(max_calls=100, window_secs=3600)  # 100/hour

@mcp.tool()
def expensive_operation(param: str):
    if not limiter.check("expensive_operation"):
        raise Exception("Rate limit exceeded. Try again in 1 hour.")
    # ... operation
```

### Error Handling

**Follow cause→fix→retry pattern:**
```python
try:
    response = api_call()
except requests.HTTPError as e:
    if e.response.status_code == 401:
        raise Exception(
            "❌ Error: Authentication failed\n"
            "📋 Cause: Invalid or expired API_KEY\n"
            "🔧 Fix: Update API_KEY in .env file\n"
            "🔄 Retry: Restart the MCP server"
        )
    elif e.response.status_code == 429:
        raise Exception(
            "❌ Error: Rate limit exceeded\n"
            "📋 Cause: Too many requests\n"
            "🔧 Fix: Wait 60 seconds\n"
            "🔄 Retry: Try again after cooldown"
        )
    else:
        raise
```

## Testing & Validation

### Unit Tests

**test_server.py:**
```python
import pytest
from server import search_items

def test_search_valid():
    results = search_items("test query", limit=5)
    assert isinstance(results, list)
    assert len(results) <= 5

def test_search_empty_query():
    with pytest.raises(ValueError, match="cannot be empty"):
        search_items("", limit=10)

def test_search_invalid_limit():
    with pytest.raises(ValueError, match="between 1 and 100"):
        search_items("test", limit=1000)
```

### Integration Testing

Use the test script:
```bash
python scripts/test_integration.py /tmp/my-mcp-server
```

## Deployment

### Local Installation

1. **User installs**:
   ```bash
   cd my-mcp-server
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with API keys
   ```

2. **Add to Claude config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "my-tool-server": {
         "command": "python",
         "args": ["/path/to/my-mcp-server/server.py"]
       }
     }
   }
   ```

3. **Restart Claude**

### Distribution

**Package as ZIP:**
```bash
python scripts/package_skill.py /tmp/my-mcp-server
```

**Share** `my-mcp-server.zip` with installation README.

## Common Patterns

### Pattern: Pagination

```python
@mcp.tool()
def list_items(cursor: str | None = None, limit: int = 50) -> dict:
    """List items with pagination support."""
    results = fetch_page(cursor, limit)
    
    return {
        "items": results["items"],
        "next_cursor": results.get("next_cursor"),
        "has_more": results.get("has_more", False)
    }
```

### Pattern: Streaming Results

```python
@mcp.tool()
def stream_logs(start_time: str) -> str:
    """Stream logs from start_time."""
    logs = []
    for log in fetch_logs_since(start_time):
        logs.append(f"[{log['timestamp']}] {log['message']}")
    
    return "\n".join(logs)
```

### Pattern: Resource URIs

```python
@mcp.resource("data://{id}")
def get_item(uri: str) -> str:
    """Fetch item by URI like data://123."""
    item_id = uri.split("://")[1]
    item = fetch_item(item_id)
    return f"# {item['title']}\n\n{item['body']}"
```

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `ModuleNotFoundError` | Missing dependencies | Run `pip install -r requirements.txt` |
| `EnvironmentError: API_KEY not set` | Missing .env file | Copy `.env.example` to `.env` and fill |
| Server not appearing in Claude | Config path wrong | Check `claude_desktop_config.json` path |
| Tools fail silently | Exception not raised | Add explicit error messages |

## Next Steps

- See the tool-integrations guide for API-specific examples
- See the security-checklist guide for comprehensive security review
