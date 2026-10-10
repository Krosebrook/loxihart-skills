#!/usr/bin/env python3
"""Initialize CrewAI multi-agent workflow."""

import argparse
from pathlib import Path

CREW_TEMPLATE = '''from crewai import Agent, Task, Crew
import os

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# Define agents
agent1 = Agent(
    role="Researcher",
    goal="Find information",
    backstory="Expert researcher",
    llm="claude-sonnet-4-20250514"
)

agent2 = Agent(
    role="Writer",
    goal="Write content",
    backstory="Professional writer",
    llm="gpt-4o"
)

# Define tasks
task1 = Task(
    description="Research {topic}",
    agent=agent1,
    expected_output="Research report"
)

task2 = Task(
    description="Write about {topic}",
    agent=agent2,
    context=[task1],
    expected_output="Article"
)

# Create crew
crew = Crew(
    agents=[agent1, agent2],
    tasks=[task1, task2],
    verbose=True
)

if __name__ == "__main__":
    result = crew.kickoff(inputs={"topic": "AI automation"})
    print(result)
'''

def init_crew(name: str, path: str):
    crew_dir = Path(path) / name
    crew_dir.mkdir(parents=True, exist_ok=True)
    
    (crew_dir / "crew.py").write_text(CREW_TEMPLATE)
    (crew_dir / "requirements.txt").write_text("crewai>=0.1.0\n")
    (crew_dir / ".env.example").write_text("OPENAI_API_KEY=sk-...\nANTHROPIC_API_KEY=sk-ant-...\n")
    
    print(f"✅ CrewAI workflow '{name}' initialized at {crew_dir}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("name", help="Crew name")
    parser.add_argument("--path", default=".", help="Output directory")
    args = parser.parse_args()
    init_crew(args.name, args.path)

if __name__ == "__main__":
    main()
