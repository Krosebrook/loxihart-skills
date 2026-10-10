# Template: Architecture Diagram

Use for: personal project decisions, platform builds, architecture review conversations.
Renders inline in Claude.ai using the Mermaid visualizer.
See `examples/research-agent-personal.md` for a completed output using this template.

---

## Instructions

1. Replace bracketed labels with actual component names.
2. Remove lanes that don't apply (e.g., no vector DB for pure generation workloads).
3. Keep the routing layer unless traffic is <1K req/day — then collapse to a single LLM node.
4. Follow the diagram with a component rationale section (see format below).

---

## Standard Diagram (with routing)

```mermaid
graph TB
    User[End Users] -->|HTTPS| CDN[Cloudflare / Vercel Edge]
    CDN --> API[API Layer<br/>[Framework: FastAPI / Hono]]

    API --> Auth[Auth<br/>[Clerk / Supabase Auth]]

    subgraph LLM Routing
        Router[Complexity Classifier<br/>[Haiku 4.5 / GPT-5.4 nano]]
        Router -->|simple| Budget[[Budget LLM]<br/>[Haiku 4.5 / Gemini Flash]]
        Router -->|medium| Mid[[Mid LLM]<br/>[Sonnet 4.6 / GPT-5.4]]
        Router -->|complex| Frontier[[Frontier LLM]<br/>[Opus 4.6]]
    end

    API --> Router

    API --> VectorDB[(Vector DB<br/>[pgvector / Pinecone])]
    API --> DB[(Postgres<br/>[Supabase / RDS])]
    API --> Cache[(Redis<br/>[Upstash])]

    DB --> Backup[S3 / R2 Backups]

    API --> PostHog[PostHog<br/>Analytics + FinOps]
    API --> Sentry[Sentry<br/>Errors]
```

---

## Simplified Diagram (no routing, <1K req/day)

```mermaid
graph TB
    User[End Users] -->|HTTPS| CDN[Cloudflare / Vercel Edge]
    CDN --> API[API Layer<br/>[Framework]]

    API --> Auth[Auth<br/>[Solution]]
    API --> LLM[[LLM]<br/>[Sonnet 4.6]]
    API --> DB[(Postgres<br/>[Supabase])]

    API --> PostHog[PostHog]
    API --> Sentry[Sentry]
```

---

## Agent / Tool Use Diagram

```mermaid
graph TB
    User[End Users] -->|HTTPS| API[API Layer]

    API --> Orchestrator[Agent Orchestrator<br/>[LangChain / Custom]]

    subgraph Tools
        WebSearch[Web Search<br/>Tavily / Exa]
        DBTool[Database Tool<br/>Supabase]
        FileTool[File Tool<br/>R2 / S3]
        ExtAPI[External API<br/>[Name]]
    end

    Orchestrator -->|tool calls| WebSearch
    Orchestrator -->|tool calls| DBTool
    Orchestrator -->|tool calls| FileTool
    Orchestrator -->|tool calls| ExtAPI

    Orchestrator --> LLM[[Sonnet 4.6 / Opus 4.6]]
    Orchestrator --> Memory[(Memory<br/>Supabase / Redis)]

    API --> PostHog[PostHog]
    API --> Sentry[Sentry]
```

---

## Component Rationale Section (follows diagram)

After the diagram, always include a brief rationale table:

```markdown
### Component Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| LLM | [model] | [1 sentence: why this tier, why this provider] |
| Backend | [framework] | [why] |
| Database | [solution] | [why] |
| Vector DB | [solution or N/A] | [why] |
| Hosting | [platform] | [why] |
| Auth | [solution] | [why] |
| Observability | [stack] | [why] |

### Key Design Decisions
- [Decision 1: what was chosen and what alternative was rejected, with brief rationale]
- [Decision 2]
- [Decision 3]
```

---

## Authoring Notes (remove before delivering)

- Mermaid renders in Claude.ai when pasted as a code block. Test it.
- Pick ONE diagram variant. Don't deliver all three.
- The component rationale is not optional — the diagram without it is decoration.
- If a component is absent from the diagram (e.g., no vector DB), explain why in Key Design Decisions.
