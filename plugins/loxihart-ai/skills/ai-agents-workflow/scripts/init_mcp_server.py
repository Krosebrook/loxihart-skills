#!/usr/bin/env python3
"""
Initialize a new MCP server project with best practices.

Usage:
    python init_mcp_server.py <server-name> [--path /output/dir]
"""

import argparse
import os
from pathlib import Path

MCP_SERVER_TEMPLATE = '''#!/usr/bin/env python3
import os
from typing import Any
from fastmcp import FastMCP

# Initialize MCP server
mcp = FastMCP("{name}")

@mcp.tool()
def example_tool(param: str) -> dict[str, Any]:
    """Example tool - replace with your implementation.
    
    Args:
        param: Input parameter
    
    Returns:
        Result dictionary
    """
    # Input validation
    if not param or not param.strip():
        raise ValueError("Parameter cannot be empty")
    
    # Get API key from environment
    api_key = os.getenv("API_KEY")
    if not api_key:
        raise EnvironmentError(
            "❌ Error: API_KEY not set\\n"
            "📋 Cause: Missing environment variable\\n"
            "🔧 Fix: Copy .env.example to .env and add your API key\\n"
            "🔄 Retry: Restart after setting API_KEY"
        )
    
    # TODO: Implement your logic here
    result = {{"status": "success", "param": param}}
    
    return result

@mcp.resource("config://schema")
def get_schema() -> str:
    """Return the data schema documentation."""
    return """
    # {name} Schema
    
    TODO: Document your data schema here
    """

if __name__ == "__main__":
    mcp.run()
'''

REQUIREMENTS_TXT = '''fastmcp>=0.1.0
python-dotenv>=1.0.0
requests>=2.31.0
'''

ENV_EXAMPLE = '''# API Configuration
API_KEY=your_api_key_here
API_BASE_URL=https://api.example.com

# Server Configuration
PORT=3000
LOG_LEVEL=INFO
'''

README_MD = '''# {name}

MCP server for {description}.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Add to Claude config (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{{
  "mcpServers": {{
    "{name}": {{
      "command": "python",
      "args": ["{path}/server.py"]
    }}
  }}
}}
```

4. Restart Claude

## Tools

- `example_tool` - TODO: Describe your tool

## Resources

- `config://schema` - Data schema documentation
'''

def init_mcp_server(name: str, output_path: str):
    """Initialize a new MCP server project."""
    server_dir = Path(output_path) / name
    server_dir.mkdir(parents=True, exist_ok=True)
    
    # Create server.py
    (server_dir / "server.py").write_text(MCP_SERVER_TEMPLATE.format(name=name))
    
    # Create requirements.txt
    (server_dir / "requirements.txt").write_text(REQUIREMENTS_TXT)
    
    # Create .env.example
    (server_dir / ".env.example").write_text(ENV_EXAMPLE)
    
    # Create README.md
    readme = README_MD.format(
        name=name,
        description="TODO: Add description",
        path=str(server_dir.absolute())
    )
    (server_dir / "README.md").write_text(readme)
    
    # Create .gitignore
    (server_dir / ".gitignore").write_text(".env\\n__pycache__/\\n*.pyc\\n")
    
    print(f"✅ MCP server '{name}' initialized at {server_dir}")
    print(f"\\nNext steps:")
    print(f"1. cd {server_dir}")
    print(f"2. Edit server.py to implement your tools")
    print(f"3. pip install -r requirements.txt")
    print(f"4. cp .env.example .env && edit .env")
    print(f"5. Add to Claude config and restart")

def main():
    parser = argparse.ArgumentParser(description="Initialize MCP server project")
    parser.add_argument("name", help="Server name")
    parser.add_argument("--path", default=".", help="Output directory")
    
    args = parser.parse_args()
    init_mcp_server(args.name, args.path)

if __name__ == "__main__":
    main()
