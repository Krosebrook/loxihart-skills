#!/usr/bin/env python3
"""Initialize LangChain agent project."""

import argparse
from pathlib import Path

AGENT_TEMPLATE = '''from langchain.agents import AgentExecutor, create_react_agent
from langchain_anthropic import ChatAnthropic
from langchain.tools import Tool
import os

llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

def example_tool(input: str) -> str:
    """Example tool - replace with your implementation."""
    return f"Processed: {input}"

tools = [
    Tool(
        name="ExampleTool",
        func=example_tool,
        description="Example tool description"
    )
]

# TODO: Define your prompt template
prompt_template = "..."

agent = create_react_agent(llm, tools, prompt_template)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

if __name__ == "__main__":
    result = executor.invoke({"input": "Test query"})
    print(result)
'''

def init_agent(name: str, path: str):
    agent_dir = Path(path) / name
    agent_dir.mkdir(parents=True, exist_ok=True)
    
    (agent_dir / "agent.py").write_text(AGENT_TEMPLATE)
    (agent_dir / "requirements.txt").write_text("langchain>=0.1.0\nlangchain-anthropic>=0.1.0\n")
    (agent_dir / ".env.example").write_text("ANTHROPIC_API_KEY=sk-ant-...\n")
    
    print(f"✅ LangChain agent '{name}' initialized at {agent_dir}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("name", help="Agent name")
    parser.add_argument("--path", default=".", help="Output directory")
    args = parser.parse_args()
    init_agent(args.name, args.path)

if __name__ == "__main__":
    main()
