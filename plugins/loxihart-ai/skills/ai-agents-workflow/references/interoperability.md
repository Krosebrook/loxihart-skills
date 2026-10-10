# Interoperability & Cross-Framework Communication (2025-2026)

## Overview

As AI agent ecosystems mature, interoperability between frameworks (LangChain, CrewAI, AutoGen) and protocol standards (MCP, A2A) becomes critical for building complex multi-agent systems.

**Key Standards (2025-2026)**:
- **MCP (Model Context Protocol)**: LLM-to-tool integration
- **A2A (Agent2Agent)**: Cross-framework agent communication
- **OpenAPI/REST**: Universal API integration layer

## Agent2Agent (A2A) Protocol

### Purpose

Enable agents built with different frameworks to communicate and collaborate.

**Example Scenario**:
- LangChain agent (coordinator) orchestrates workflow
- CrewAI agents (specialists) execute domain tasks
- AutoGen agent (code executor) runs generated code

**Without A2A**: Manual integration, framework lock-in, duplicated logic  
**With A2A**: Seamless communication, best-tool-for-job approach

### Specification (Google/Microsoft Collaboration)

**Status**: Early adoption (pilot projects Q1 2026)

**Core Concepts**:
1. **Agent Registry**: Discover available agents across frameworks
2. **Message Protocol**: Standardized request/response format
3. **Capability Declaration**: Agents advertise what they can do
4. **State Management**: Shared context across agent boundaries

### Implementation Example

```python
from a2a_protocol import AgentCommunicator, AgentCapabilities
from langchain.agents import AgentExecutor
from crewai import Agent, Crew

# A2A Communicator (framework-agnostic)
communicator = AgentCommunicator()

# LangChain Coordinator Agent
langchain_agent = AgentExecutor(...)

# Register with A2A protocol
communicator.register(
    agent_id="langchain_coordinator",
    agent=langchain_agent,
    capabilities=AgentCapabilities(
        actions=["orchestrate", "route_tasks", "aggregate_results"],
        frameworks=["langchain"],
        supports_async=True
    )
)

# CrewAI Research Agent
research_agent = Agent(
    role="Research Specialist",
    goal="Conduct deep research",
    tools=[web_search_tool]
)

communicator.register(
    agent_id="crewai_researcher",
    agent=research_agent,
    capabilities=AgentCapabilities(
        actions=["research", "analyze_sources", "summarize"],
        frameworks=["crewai"],
        supports_async=True
    )
)

# Cross-Framework Communication
async def workflow():
    """LangChain coordinates CrewAI execution."""
    
    # LangChain agent decides task needs deep research
    task_plan = await langchain_agent.plan_workflow(
        goal="Research AI agent interoperability standards"
    )
    
    # LangChain sends task to CrewAI agent via A2A
    research_result = await communicator.send_message(
        from_agent="langchain_coordinator",
        to_agent="crewai_researcher",
        message={
            "action": "research",
            "params": {
                "topic": "AI agent interoperability",
                "depth": "comprehensive",
                "sources": ["academic", "industry"]
            }
        }
    )
    
    # CrewAI agent executes research task
    # Returns structured result via A2A protocol
    
    # LangChain agent processes result
    final_output = await langchain_agent.synthesize(
        research_data=research_result["data"]
    )
    
    return final_output

# Execute cross-framework workflow
result = asyncio.run(workflow())
```

### Message Format

```json
{
  "protocol": "A2A/1.0",
  "message_id": "msg_abc123",
  "from_agent": "langchain_coordinator",
  "to_agent": "crewai_researcher",
  "timestamp": "2026-03-14T18:00:00Z",
  "action": "research",
  "parameters": {
    "topic": "AI agent interoperability",
    "depth": "comprehensive"
  },
  "context": {
    "session_id": "sess_xyz789",
    "previous_messages": ["msg_abc122"]
  },
  "expected_response_format": {
    "type": "structured",
    "schema": {
      "findings": "array",
      "sources": "array",
      "confidence": "number"
    }
  }
}
```

**Response**:
```json
{
  "protocol": "A2A/1.0",
  "message_id": "msg_abc124",
  "in_reply_to": "msg_abc123",
  "from_agent": "crewai_researcher",
  "to_agent": "langchain_coordinator",
  "timestamp": "2026-03-14T18:05:32Z",
  "status": "success",
  "data": {
    "findings": [
      {
        "title": "MCP Protocol Adoption",
        "summary": "...",
        "source": "https://...",
        "confidence": 0.92
      }
    ],
    "sources": ["academic_db", "arxiv", "industry_blogs"],
    "execution_time_ms": 4523
  }
}
```

### Benefits

✅ **Best tool for each job**: Use LangChain for orchestration, CrewAI for team collaboration, AutoGen for code  
✅ **No framework lock-in**: Migrate components without full rewrite  
✅ **Gradual adoption**: Start with one framework, add others as needed  
✅ **Vendor neutrality**: Google/Microsoft co-governance ensures no single-vendor control

### Limitations (Early Stage)

❌ **Limited adoption**: Pilot phase (Q1 2026), not production-ready  
❌ **Performance overhead**: Cross-framework calls add latency (50-200ms)  
❌ **State sync complexity**: Shared context requires careful design  
❌ **Debugging challenges**: Errors span multiple frameworks

---

## MCP Coordination

### Pattern: Shared MCP Server Access

**Problem**: Multiple agents need to access the same external service (e.g., Notion, GitHub, Slack).

**Solution**: Single MCP server shared across agent frameworks.

```python
from fastmcp import FastMCP
from langchain.tools import Tool
from crewai_tools import BaseTool

# Single MCP Server
notion_mcp = FastMCP("notion-integration")

@notion_mcp.tool()
async def query_database(database_id: str, filter_query: dict) -> list[dict]:
    """Query Notion database."""
    # Implementation...
    pass

# Run MCP server
notion_mcp.run(host="localhost", port=8080)

# LangChain Integration
langchain_notion_tool = Tool(
    name="query_notion",
    func=lambda db_id, query: httpx.post(
        "http://localhost:8080/tools/query_database",
        json={"database_id": db_id, "filter_query": query}
    ).json(),
    description="Query Notion database via MCP"
)

langchain_agent = AgentExecutor(
    tools=[langchain_notion_tool],
    ...
)

# CrewAI Integration
class NotionMCPTool(BaseTool):
    name: str = "Query Notion Database"
    description: str = "Query Notion database via MCP"
    
    def _run(self, database_id: str, filter_query: dict) -> list[dict]:
        response = httpx.post(
            "http://localhost:8080/tools/query_database",
            json={"database_id": database_id, "filter_query": filter_query}
        )
        return response.json()

crewai_agent = Agent(
    role="Data Manager",
    tools=[NotionMCPTool()]
)
```

### Benefits

✅ **Single source of truth**: One Notion integration, not duplicated per framework  
✅ **Consistent auth**: Shared OAuth tokens, no per-framework setup  
✅ **Unified rate limiting**: MCP server enforces limits across all consumers  
✅ **Centralized logging**: All Notion calls go through one observability point

### Deployment

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Shared MCP servers
  notion-mcp:
    image: notion-mcp-server:latest
    ports:
      - "8080:8080"
    environment:
      - NOTION_TOKEN=${NOTION_TOKEN}
  
  github-mcp:
    image: github-mcp-server:latest
    ports:
      - "8081:8080"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
  
  # LangChain Agent Service
  langchain-agent:
    image: langchain-orchestrator:latest
    environment:
      - NOTION_MCP_URL=http://notion-mcp:8080
      - GITHUB_MCP_URL=http://github-mcp:8080
    depends_on:
      - notion-mcp
      - github-mcp
  
  # CrewAI Agent Service
  crewai-agents:
    image: crewai-specialists:latest
    environment:
      - NOTION_MCP_URL=http://notion-mcp:8080
      - GITHUB_MCP_URL=http://github-mcp:8080
    depends_on:
      - notion-mcp
      - github-mcp
```

**Result**: Multiple agent frameworks share MCP servers, avoiding duplication.

---

## OpenAPI/REST Integration Layer

### Universal API Pattern

**Use when**: Need to integrate agents that don't support A2A protocol (legacy systems, custom agents).

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Unified request format
class AgentRequest(BaseModel):
    action: str
    parameters: dict
    context: dict = {}

# Unified response format
class AgentResponse(BaseModel):
    status: str
    data: dict
    execution_time_ms: int

# LangChain Agent Endpoint
@app.post("/agents/langchain/execute")
async def execute_langchain_agent(request: AgentRequest) -> AgentResponse:
    """Execute LangChain agent via REST API."""
    start = time.time()
    
    result = await langchain_agent.arun(
        input=request.parameters,
        context=request.context
    )
    
    return AgentResponse(
        status="success",
        data=result,
        execution_time_ms=int((time.time() - start) * 1000)
    )

# CrewAI Agent Endpoint
@app.post("/agents/crewai/execute")
async def execute_crewai_agent(request: AgentRequest) -> AgentResponse:
    """Execute CrewAI agent via REST API."""
    start = time.time()
    
    crew = build_crew(action=request.action)
    result = crew.kickoff(inputs=request.parameters)
    
    return AgentResponse(
        status="success",
        data=result.dict(),
        execution_time_ms=int((time.time() - start) * 1000)
    )

# Agent Orchestration Endpoint
@app.post("/orchestrate")
async def orchestrate_workflow(request: AgentRequest) -> AgentResponse:
    """Orchestrate multi-framework workflow."""
    
    # Step 1: LangChain plans workflow
    plan = await execute_langchain_agent(
        AgentRequest(action="plan", parameters=request.parameters)
    )
    
    # Step 2: CrewAI executes research
    research = await execute_crewai_agent(
        AgentRequest(action="research", parameters=plan.data)
    )
    
    # Step 3: LangChain synthesizes
    final = await execute_langchain_agent(
        AgentRequest(action="synthesize", parameters=research.data)
    )
    
    return final
```

**Benefits**:
- ✅ Framework-agnostic (any HTTP client can call)
- ✅ Language-agnostic (Python, TypeScript, Go, etc.)
- ✅ Well-understood patterns (REST APIs everywhere)

---

## State Management

### Shared Context Pattern

**Challenge**: Agents need access to shared context (user session, conversation history, intermediate results).

**Solution**: Redis-backed shared state

```python
import redis
import json

# Shared state store
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

class SharedContext:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.key_prefix = f"session:{session_id}"
    
    def get(self, key: str) -> dict:
        """Get value from shared context."""
        data = redis_client.get(f"{self.key_prefix}:{key}")
        return json.loads(data) if data else None
    
    def set(self, key: str, value: dict, ttl: int = 3600):
        """Set value in shared context."""
        redis_client.setex(
            f"{self.key_prefix}:{key}",
            ttl,
            json.dumps(value)
        )
    
    def append(self, key: str, item: dict):
        """Append to array in shared context."""
        current = self.get(key) or []
        current.append(item)
        self.set(key, current)

# Usage in LangChain agent
def langchain_workflow(session_id: str, user_input: str):
    context = SharedContext(session_id)
    
    # Store user input
    context.append("messages", {
        "role": "user",
        "content": user_input,
        "timestamp": datetime.now().isoformat()
    })
    
    # Execute agent
    result = langchain_agent.run(
        input=user_input,
        context=context.get("messages")
    )
    
    # Store result
    context.append("messages", {
        "role": "assistant",
        "content": result,
        "timestamp": datetime.now().isoformat()
    })
    
    return result

# Usage in CrewAI agent (same session)
def crewai_workflow(session_id: str, task: str):
    context = SharedContext(session_id)
    
    # Access shared conversation history
    messages = context.get("messages")
    
    # Execute with context
    crew = build_crew()
    result = crew.kickoff(
        inputs={"task": task, "context": messages}
    )
    
    # Update shared context
    context.set("research_findings", result.dict())
    
    return result
```

---

## Monitoring & Observability

### Cross-Framework Tracing

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# Configure OpenTelemetry
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Export to observability backend (Grafana, Datadog, etc.)
otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(otlp_exporter)
)

# Trace cross-framework workflow
@tracer.start_as_current_span("orchestrate_workflow")
async def orchestrate_workflow(user_input: str):
    
    # Span 1: LangChain planning
    with tracer.start_as_current_span("langchain_planning"):
        plan = await langchain_agent.plan(user_input)
    
    # Span 2: CrewAI execution
    with tracer.start_as_current_span("crewai_execution"):
        result = await crewai_crew.kickoff(plan)
    
    # Span 3: LangChain synthesis
    with tracer.start_as_current_span("langchain_synthesis"):
        final = await langchain_agent.synthesize(result)
    
    return final
```

**Trace Output** (Grafana/Jaeger):
```
orchestrate_workflow (total: 12.4s)
├─ langchain_planning (2.1s)
│  └─ llm_call (1.8s)
├─ crewai_execution (8.2s)
│  ├─ research_agent (5.1s)
│  │  ├─ web_search (3.2s)
│  │  └─ llm_call (1.7s)
│  └─ writer_agent (3.1s)
└─ langchain_synthesis (2.1s)
   └─ llm_call (1.9s)
```

---

## Best Practices

✅ **Start simple**: Single framework until interoperability needed  
✅ **Use MCP for tools**: Avoid duplicating tool integrations  
✅ **REST for orchestration**: Universal integration layer  
✅ **Shared state store**: Redis for cross-framework context  
✅ **Distributed tracing**: OpenTelemetry for observability  
✅ **Monitor A2A adoption**: Migrate when production-ready (late 2026+)

## Next Steps

- **Pilot A2A**: Test cross-framework communication (non-production)
- **Implement MCP coordination**: Share tool integrations today
- **Add REST endpoints**: Enable language-agnostic integration
- **Deploy Redis**: Shared context for multi-framework workflows
- **Configure tracing**: OpenTelemetry for cross-framework observability

See also:
- `references/agent-frameworks.md` - Framework-specific patterns
- `references/mcp-servers.md` - MCP server implementation
- `references/deployment.md` - Multi-framework deployment
