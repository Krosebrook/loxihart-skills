# Agent Frameworks Guide

## LangChain Patterns

### Basic Agent
```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain_anthropic import ChatAnthropic
from langchain.tools import Tool

llm = ChatAnthropic(model="claude-sonnet-4-20250514")

tools = [
    Tool(name="Search", func=search_web, description="Search the web"),
    Tool(name="Calculator", func=calculate, description="Do math")
]

agent = create_react_agent(llm, tools, prompt_template)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "What is 25 * 4 + 100?"})
```

### RAG Pattern
```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA

vectorstore = Chroma.from_documents(documents, OpenAIEmbeddings())
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatAnthropic(model="claude-sonnet-4-20250514"),
    retriever=vectorstore.as_retriever()
)

answer = qa_chain.invoke("What are the company benefits?")
```

## CrewAI Multi-Agent

### Content Pipeline
```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Researcher",
    goal="Find accurate information",
    backstory="Expert researcher",
    llm="claude-sonnet-4-20250514"
)

writer = Agent(
    role="Writer",
    goal="Write engaging content",
    backstory="Professional writer",
    llm="gpt-4o"
)

research_task = Task(
    description="Research {topic}",
    agent=researcher,
    expected_output="Research report"
)

writing_task = Task(
    description="Write article about {topic}",
    agent=writer,
    context=[research_task],
    expected_output="Article draft"
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True
)

result = crew.kickoff(inputs={"topic": "AI automation"})
```

## AutoGen Pattern

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(
    name="assistant",
    llm_config={"model": "claude-sonnet-4-20250514"}
)

user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "coding"}
)

user_proxy.initiate_chat(
    assistant,
    message="Build a web scraper for news articles"
)
```
