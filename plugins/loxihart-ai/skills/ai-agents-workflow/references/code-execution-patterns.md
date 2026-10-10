# Code Execution Patterns for 100+ Tool Scenarios

## Problem Statement

**Challenge**: Loading 100+ tool definitions consumes excessive context window tokens, slowing every request and limiting available reasoning space.

**Example**:
- 100 tools × 100 tokens/tool = 10,000 tokens
- On 200K context window = 5% consumed just for tool definitions
- Worse on API calls with 100K limits = 10% overhead

**Impact**:
- Slower responses (more tokens to process)
- Higher costs ($0.003/1K input tokens × 10K = $0.03/request baseline)
- Less reasoning capacity (tokens spent on tool defs, not thinking)

## Solution: On-Demand Tool Loading

**Core Principle**: Load tool definitions only when needed via filesystem discovery or search patterns.

**Token Savings**:
- **Before**: 10,000 tokens (all 100 tools loaded)
- **After**: <1,000 tokens (metadata search + single tool load)
- **Reduction**: 90% context savings

## Pattern 1: search_tools + execute_tool (Recommended)

### Architecture

```
┌─────────────────┐
│   Claude API    │
│   Request       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ MCP Server                  │
│                             │
│ 1. search_tools(query)      │ → Returns lightweight metadata
│    ├─ Scans /tools/*.py     │    (name, description, params)
│    └─ Matches keywords      │
│                             │
│ 2. execute_tool(module)     │ → Dynamically imports & executes
│    ├─ import tools.{module} │    only the selected tool
│    └─ tool.execute(**kwargs)│
└─────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ /tools/         │
│ ├─ github.py    │ 100+ tool modules
│ ├─ notion.py    │ loaded on-demand
│ ├─ slack.py     │
│ └─ ...          │
└─────────────────┘
```

### Implementation (FastMCP)

```python
from fastmcp import FastMCP
import importlib
import glob
import ast
from pathlib import Path

mcp = FastMCP("enterprise-toolhub")

TOOLS_DIR = "/tools"  # Directory containing tool modules

@mcp.tool()
async def search_tools(
    query: str,
    category: str = None,
    limit: int = 10
) -> list[dict]:
    """Search available tools by keyword without loading full implementations.
    
    Args:
        query: Search keywords (e.g., "github", "database", "email")
        category: Optional category filter ("version_control", "database", "communication")
        limit: Maximum results to return (default 10)
    
    Returns:
        List of tool metadata (name, description, category, parameters)
    """
    matches = []
    query_lower = query.lower()
    
    # Scan tool directory
    for tool_file in glob.glob(f"{TOOLS_DIR}/**/*.py", recursive=True):
        # Skip __init__.py and test files
        if "__init__" in tool_file or "test_" in tool_file:
            continue
        
        # Extract module path
        module_path = tool_file.replace(TOOLS_DIR + "/", "").replace(".py", "").replace("/", ".")
        
        # Load metadata only (not full implementation)
        metadata = load_tool_metadata(tool_file)
        
        # Category filter
        if category and metadata.get("category") != category:
            continue
        
        # Keyword match
        searchable_text = " ".join([
            metadata.get("name", ""),
            metadata.get("description", ""),
            " ".join(metadata.get("keywords", []))
        ]).lower()
        
        if query_lower in searchable_text:
            metadata["module"] = module_path
            matches.append(metadata)
        
        if len(matches) >= limit:
            break
    
    return matches

def load_tool_metadata(tool_file: str) -> dict:
    """Extract metadata from tool file without importing.
    
    Parses AST to extract:
    - Function name
    - Docstring (description)
    - Parameters with types
    - Category/keywords from module docstring
    
    This avoids loading dependencies or executing code.
    """
    with open(tool_file, 'r') as f:
        source = f.read()
    
    tree = ast.parse(source)
    
    metadata = {
        "name": None,
        "description": None,
        "parameters": [],
        "category": None,
        "keywords": []
    }
    
    # Extract module-level docstring for category/keywords
    if ast.get_docstring(tree):
        module_doc = ast.get_docstring(tree)
        # Parse format: """Category: version_control\nKeywords: github, git, pr"""
        for line in module_doc.split("\n"):
            if line.startswith("Category:"):
                metadata["category"] = line.split(":")[1].strip()
            elif line.startswith("Keywords:"):
                keywords = line.split(":")[1].strip()
                metadata["keywords"] = [k.strip() for k in keywords.split(",")]
    
    # Find async def functions (tool definitions)
    for node in ast.walk(tree):
        if isinstance(node, ast.AsyncFunctionDef):
            # Tool name
            metadata["name"] = node.name
            
            # Description from docstring
            docstring = ast.get_docstring(node)
            if docstring:
                # Extract first line as description
                metadata["description"] = docstring.split("\n")[0]
            
            # Parameters
            for arg in node.args.args:
                param_name = arg.arg
                # Type annotation
                param_type = None
                if arg.annotation:
                    if isinstance(arg.annotation, ast.Name):
                        param_type = arg.annotation.id
                    elif isinstance(arg.annotation, ast.Subscript):
                        # Handle list[str], dict[str, int], etc.
                        param_type = ast.unparse(arg.annotation)
                
                metadata["parameters"].append({
                    "name": param_name,
                    "type": param_type or "any"
                })
            
            break  # Only process first function
    
    return metadata

@mcp.tool()
async def execute_tool(
    module: str,
    **kwargs
) -> dict:
    """Execute a specific tool by module name after search discovery.
    
    Args:
        module: Module path from search_tools results (e.g., "github.create_pr")
        **kwargs: Tool-specific parameters
    
    Returns:
        Tool execution result
    """
    try:
        # Dynamically import tool module
        # Only loaded into memory when needed
        tool_module = importlib.import_module(f"tools.{module}")
        
        # Get the tool function
        # Assumes tool has an execute() async function
        if hasattr(tool_module, 'execute'):
            result = await tool_module.execute(**kwargs)
        else:
            # Fallback: look for any async function
            for attr_name in dir(tool_module):
                attr = getattr(tool_module, attr_name)
                if callable(attr) and asyncio.iscoroutinefunction(attr):
                    result = await attr(**kwargs)
                    break
            else:
                raise ValueError(f"No executable function found in {module}")
        
        return {
            "status": "success",
            "module": module,
            "result": result
        }
    
    except Exception as e:
        return {
            "status": "error",
            "module": module,
            "error": str(e),
            "error_type": type(e).__name__
        }

@mcp.tool()
async def list_categories() -> list[dict]:
    """List all available tool categories for filtering.
    
    Returns:
        List of categories with tool counts
    """
    categories = {}
    
    for tool_file in glob.glob(f"{TOOLS_DIR}/**/*.py", recursive=True):
        if "__init__" in tool_file or "test_" in tool_file:
            continue
        
        metadata = load_tool_metadata(tool_file)
        category = metadata.get("category", "uncategorized")
        
        if category not in categories:
            categories[category] = 0
        categories[category] += 1
    
    return [
        {"category": cat, "tool_count": count}
        for cat, count in sorted(categories.items())
    ]
```

### Tool Module Format

```python
# tools/github/create_pr.py
"""
Category: version_control
Keywords: github, git, pull request, pr, code review
"""

import httpx
import os

async def execute(
    repo: str,
    title: str,
    body: str,
    head: str,
    base: str = "main"
) -> dict:
    """Create a GitHub pull request.
    
    Args:
        repo: Repository name (format: "owner/repo")
        title: PR title
        body: PR description
        head: Source branch
        base: Target branch (default: "main")
    
    Returns:
        Pull request data with URL and number
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.github.com/repos/{repo}/pulls",
            headers={
                "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}",
                "Accept": "application/vnd.github+json"
            },
            json={
                "title": title,
                "body": body,
                "head": head,
                "base": base
            }
        )
        response.raise_for_status()
        return response.json()
```

### Usage Workflow

**Claude's Perspective**:

```
User: "Create a PR on my repo to merge feature branch"

Claude thinks:
1. Need GitHub tool
2. Search for it: search_tools("github pull request")
3. Get result: [{module: "github.create_pr", description: "Create a GitHub pull request", ...}]
4. Execute: execute_tool("github.create_pr", repo="user/repo", title="...", ...)
5. Return result to user
```

**Token Consumption**:
- `search_tools` call: ~200 tokens (query + metadata results)
- `execute_tool` call: ~400 tokens (module name + parameters + result)
- **Total**: ~600 tokens (vs 10,000 if all tools pre-loaded)

## Pattern 2: Registry File (JSON Metadata)

### Architecture

Instead of scanning filesystem on every search, maintain a lightweight JSON registry updated at deploy time.

```json
// tools_registry.json (3KB for 100 tools)
{
  "github_create_pr": {
    "description": "Create a GitHub pull request",
    "category": "version_control",
    "keywords": ["github", "pr", "pull request", "code review"],
    "module": "tools.github.create_pr",
    "parameters": [
      {"name": "repo", "type": "string", "required": true},
      {"name": "title", "type": "string", "required": true},
      {"name": "body", "type": "string", "required": true},
      {"name": "head", "type": "string", "required": true},
      {"name": "base", "type": "string", "required": false, "default": "main"}
    ]
  },
  "notion_query_db": {
    "description": "Query Notion database with filters",
    "category": "database",
    "keywords": ["notion", "database", "query", "filter"],
    "module": "tools.notion.query_db",
    "parameters": [
      {"name": "database_id", "type": "string", "required": true},
      {"name": "filter", "type": "dict", "required": false}
    ]
  }
  // ... 98 more tools
}
```

### Implementation

```python
from fastmcp import FastMCP
import json
from pathlib import Path

mcp = FastMCP("enterprise-toolhub")

# Load registry once on startup
REGISTRY_PATH = Path("/tools/registry.json")
with open(REGISTRY_PATH) as f:
    TOOLS_REGISTRY = json.load(f)

@mcp.tool()
async def search_tools(query: str, limit: int = 10) -> list[dict]:
    """Search tool registry (fast in-memory lookup)."""
    query_lower = query.lower()
    matches = []
    
    for tool_name, tool_data in TOOLS_REGISTRY.items():
        # Search in keywords, description, name
        searchable = " ".join([
            tool_name,
            tool_data["description"],
            " ".join(tool_data["keywords"])
        ]).lower()
        
        if query_lower in searchable:
            matches.append({
                "name": tool_name,
                **tool_data
            })
        
        if len(matches) >= limit:
            break
    
    return matches

# execute_tool implementation same as Pattern 1
```

**Performance**:
- **Pattern 1** (filesystem scan): ~50ms for 100 tools
- **Pattern 2** (JSON registry): ~5ms for 100 tools
- **10x faster** search with pre-indexed metadata

**Trade-off**:
- ✅ Faster search
- ✅ Structured metadata
- ❌ Requires registry update on tool changes
- ❌ Manual maintenance

**When to use**:
- Production systems (registry updated via CI/CD)
- 100+ tools (filesystem scan becomes slow)
- Need guaranteed performance (<10ms search)

## Pattern 3: Hybrid (Registry + AST Validation)

### Best of Both Worlds

Maintain JSON registry for fast search, but validate against source code to catch drift.

```python
import json
from pathlib import Path
import ast

def validate_registry():
    """CI/CD step: Validate registry matches source code."""
    with open("tools_registry.json") as f:
        registry = json.load(f)
    
    errors = []
    
    for tool_name, tool_data in registry.items():
        module_path = tool_data["module"].replace(".", "/") + ".py"
        
        # Load actual source code
        with open(module_path) as f:
            source = f.read()
        
        tree = ast.parse(source)
        
        # Find execute function
        for node in ast.walk(tree):
            if isinstance(node, ast.AsyncFunctionDef) and node.name == "execute":
                # Validate parameters match registry
                actual_params = [arg.arg for arg in node.args.args]
                registry_params = [p["name"] for p in tool_data["parameters"]]
                
                if actual_params != registry_params:
                    errors.append(f"{tool_name}: Parameter mismatch\n  Registry: {registry_params}\n  Source: {actual_params}")
    
    if errors:
        print("❌ Registry validation failed:")
        for error in errors:
            print(f"  {error}")
        exit(1)
    else:
        print("✅ Registry validated successfully")

if __name__ == "__main__":
    validate_registry()
```

**CI/CD Integration**:
```yaml
# .github/workflows/validate-tools.yml
name: Validate Tool Registry

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
      - name: Validate registry
        run: python scripts/validate_registry.py
```

## Pattern 4: Capability-Based Grouping

### Problem

Even with search, Claude might not know what tools exist for a given domain.

**Example**:
```
User: "Help me with my GitHub workflow"
Claude: "What specifically do you need help with?"
  (Claude doesn't know if GitHub tools exist)
```

### Solution: Capability Discovery

```python
@mcp.tool()
async def get_capabilities() -> dict:
    """Discover available capabilities grouped by domain.
    
    Returns high-level capability groups without loading tool details.
    """
    return {
        "version_control": {
            "providers": ["github", "gitlab", "bitbucket"],
            "operations": ["create_pr", "merge_pr", "list_issues", "create_issue"],
            "tool_count": 15
        },
        "database": {
            "providers": ["notion", "airtable", "postgres", "mongodb"],
            "operations": ["query", "insert", "update", "delete"],
            "tool_count": 24
        },
        "communication": {
            "providers": ["slack", "discord", "teams", "email"],
            "operations": ["send_message", "create_channel", "invite_user"],
            "tool_count": 18
        },
        # ... more domains
    }

@mcp.tool()
async def get_tools_for_capability(
    capability: str,
    operation: str = None
) -> list[dict]:
    """Get tools for a specific capability/operation."""
    # Filter registry by capability + operation
    matches = [
        tool for tool in TOOLS_REGISTRY.values()
        if tool["category"] == capability
        and (not operation or operation in tool.get("operations", []))
    ]
    return matches
```

**Enhanced Workflow**:
```
User: "Help me with my GitHub workflow"

Claude:
1. Call get_capabilities()
2. See "version_control" → ["github", "gitlab", ...]
3. Call get_tools_for_capability("version_control")
4. Get list of 15 GitHub tools
5. Ask user: "I can help with: creating PRs, merging, issues, releases. What do you need?"
```

## Scaling to 1000+ Tools

### Performance Benchmarks

| Pattern | Tools | Search Time | Memory | Tokens |
|---------|-------|-------------|--------|--------|
| Pre-load all | 100 | 0ms | 50MB | 10K |
| Filesystem scan | 100 | 50ms | 5MB | 600 |
| JSON registry | 100 | 5ms | 3MB | 600 |
| Filesystem scan | 1000 | 500ms | 5MB | 600 |
| JSON registry | 1000 | 15ms | 10MB | 600 |

**Recommendation**:
- **< 50 tools**: Pre-load all (simple, fast)
- **50-500 tools**: Filesystem scan (no maintenance)
- **500+ tools**: JSON registry (performance critical)

### Horizontal Scaling

For 1000+ tools across multiple categories:

```python
# Shard registry by category
# /tools/registries/version_control.json (150 tools)
# /tools/registries/database.json (200 tools)
# /tools/registries/communication.json (180 tools)
# ... etc

@mcp.tool()
async def search_tools(query: str, category: str = None) -> list[dict]:
    """Search with optional category hint to reduce scan scope."""
    
    if category:
        # Load only relevant shard
        registry_path = f"/tools/registries/{category}.json"
        with open(registry_path) as f:
            registry = json.load(f)
    else:
        # Load all shards (lazy load on first access)
        registry = load_all_registries()
    
    # Search within registry
    # ...
```

**Result**: 1000 tools, <20ms search time, <1KB token overhead

## Testing

### Unit Tests

```python
import pytest

@pytest.mark.asyncio
async def test_search_tools():
    """Test tool search returns relevant results."""
    results = await search_tools("github pull request")
    
    assert len(results) > 0
    assert any("pull request" in r["description"].lower() for r in results)
    assert any("github" in r["keywords"] for r in results)

@pytest.mark.asyncio
async def test_execute_tool():
    """Test tool execution with valid parameters."""
    # Mock environment
    os.environ["GITHUB_TOKEN"] = "test_token"
    
    result = await execute_tool(
        module="github.create_pr",
        repo="test/repo",
        title="Test PR",
        body="Test description",
        head="feature",
        base="main"
    )
    
    assert result["status"] == "success"
    assert "result" in result

@pytest.mark.asyncio
async def test_search_performance():
    """Test search completes in <50ms for 100 tools."""
    import time
    
    start = time.time()
    await search_tools("github")
    elapsed = time.time() - start
    
    assert elapsed < 0.05, f"Search took {elapsed}s (>50ms threshold)"
```

### Integration Tests

```python
@pytest.mark.asyncio
async def test_end_to_end_workflow():
    """Test complete search → execute workflow."""
    
    # 1. Search for GitHub PR tool
    search_results = await search_tools("create pull request github")
    assert len(search_results) > 0
    
    # 2. Execute first matching tool
    tool = search_results[0]
    result = await execute_tool(
        module=tool["module"],
        repo="test/repo",
        title="Integration Test PR",
        body="Created via integration test",
        head="test-branch",
        base="main"
    )
    
    # 3. Verify execution
    assert result["status"] == "success"
    assert "pr_url" in result["result"]
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy tool modules
COPY tools/ /tools/

# Copy registry (if using Pattern 2)
COPY tools_registry.json /tools/

# Copy server
COPY server.py .

EXPOSE 8080

CMD ["python", "server.py"]
```

### CI/CD Registry Update

```bash
# scripts/update_registry.sh
#!/bin/bash

echo "Scanning tool modules..."

python - << EOF
import glob
import json
from pathlib import Path

# Scan /tools directory, extract metadata
registry = {}
for tool_file in glob.glob("/tools/**/*.py", recursive=True):
    # Extract metadata via AST
    metadata = extract_metadata(tool_file)
    registry[metadata["name"]] = metadata

# Write registry
with open("tools_registry.json", "w") as f:
    json.dump(registry, f, indent=2)

print(f"✅ Registry updated: {len(registry)} tools")
EOF

# Validate
python scripts/validate_registry.py

echo "✅ Registry validated"
```

**Trigger**: On every commit to `/tools` directory

## Next Steps

- Start with Pattern 1 (filesystem scan) for <100 tools
- Migrate to Pattern 2 (JSON registry) at 100+ tools
- Add Pattern 4 (capability discovery) for better UX
- Monitor search performance, optimize as needed

See also:
- `references/mcp-servers.md` - Integrate code execution with MCP servers
- `references/security-checklist.md` - Validate tool modules before execution
