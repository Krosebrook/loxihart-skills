# Phase 11 — AI Systems & Human-in-the-Loop

## Scope
LLM integration patterns, prompt injection defense, output validation, HITL gates, agent safety, and AI cost governance.

---

## Checklist

### LLM Integration Patterns
- [ ] Model version pinned — not `gpt-4` (alias) but `gpt-4o-2024-08-06` (specific version)
- [ ] Fallback model configured for primary model outage (e.g., Claude → GPT-4o)
- [ ] Token budget enforced per request — max_tokens set, not open-ended
- [ ] Context window usage monitored — alert before hitting limit
- [ ] Prompt templates version-controlled (not string-interpolated in code)
- [ ] System prompt stored separately from user prompt (never merge untrusted user input into system)
- [ ] Response streaming implemented for UX on long completions (> 2s expected)

### Prompt Injection Defense
- [ ] User input never interpolated directly into system prompt
- [ ] Instruction hierarchy enforced: system > developer > user (OpenAI model spec)
- [ ] Input sanitization: strip control characters, null bytes, unusual Unicode
- [ ] Output used as tool input (e.g., SQL, shell command) validated before execution
- [ ] Agent actions require confirmation for destructive operations (delete, send, publish)
- [ ] Indirect prompt injection surface assessed: email bodies, web pages, uploaded docs

### Output Validation
- [ ] LLM output validated against expected schema (Zod, Pydantic, or JSON schema)
- [ ] Structured output mode used where available (`response_format: { type: "json_object" }`)
- [ ] Hallucination risk assessed for each use case — factual claims checked vs. retrieval
- [ ] Confidence thresholds: low-confidence responses routed to human review
- [ ] PII scrubbed from LLM output before logging or displaying
- [ ] LLM output sanitized before rendering in HTML (XSS via LLM output is real)

### Human-in-the-Loop Gates
- [ ] HITL decision matrix documented: which actions require human approval?
- [ ] Approval UI built for high-stakes agentic actions (send email, make payment, delete record)
- [ ] Timeout behavior defined: what happens if human doesn't respond in N minutes?
- [ ] Audit log of all AI-generated actions with human approval/rejection recorded
- [ ] Override mechanism exists: human can cancel or modify AI action before execution
- [ ] Escalation path: if AI confidence < threshold, escalate to human instead of acting

### Agent Safety
- [ ] Tool surface minimal — agents only have tools they need for current task
- [ ] Blast radius limited — agent cannot access resources outside its scope
- [ ] Rate limiting on agent tool calls (prevent runaway loops)
- [ ] Max iteration count enforced on agentic loops (no infinite loops)
- [ ] Agent actions logged with full context (input, output, tool calls, timestamps)
- [ ] Kill switch: ability to halt agent mid-execution
- [ ] Sandbox environment for agent development — not running against production data

### RAG / Retrieval Patterns
- [ ] Retrieval results attributed to source (document + chunk + page number)
- [ ] Source documents access-controlled (users only retrieve docs they can view)
- [ ] Retrieval relevance threshold set — low-relevance chunks not included in context
- [ ] Context window budget managed — most-relevant chunks prioritized
- [ ] Embedding model version pinned (re-embed on model change)
- [ ] Chunking strategy appropriate for document type (semantic vs. fixed-size)

### AI Cost Governance
- [ ] Cost per request tracked (input tokens × rate + output tokens × rate)
- [ ] Per-user/tenant cost metered and logged
- [ ] Budget guardrails: request rejected if user exceeds daily/monthly token budget
- [ ] Model routing by task complexity (Haiku for classification, Sonnet for generation, Opus for complex reasoning)
- [ ] Prompt caching enabled for repeated system prompts (Anthropic prompt caching)
- [ ] Batch API used for non-real-time workloads (50% cost reduction)

---

## HITL Decision Matrix Template

| Action | Risk Level | HITL Required | Timeout Behavior |
|--------|------------|---------------|------------------|
| Read / retrieve | Low | No | N/A |
| Draft content | Low | Review recommended | Auto-send after 24h |
| Send external message | High | Yes — explicit approve | Cancel (never auto-send) |
| Modify database record | Medium | Depends on record type | Queue for review |
| Delete record | Critical | Yes — explicit approve | Never auto-execute |
| Make payment / API call with side effect | Critical | Yes — explicit approve | Cancel |

---

## Common Gaps
- System prompt and user message merged into single string → injection trivial
- Agent has write access to all tables → blast radius of any compromise is total
- No max_tokens set → runaway generation exhausts budget
- LLM output rendered as HTML without sanitization → stored XSS via LLM
- Retrieval not access-controlled → user A retrieves user B's documents
- Model version not pinned → behavior changes silently on provider update
- No audit log of agent actions → impossible to debug or audit what happened
