<process>

## Phase A: Architecture (20% of effort)

Decide how pieces fit together before building any of them. This phase prevents the most expensive rework: discovering at integration time that two components assumed different interfaces.

### Produce an architecture block covering:

**Components** — for each:
- Name and single-sentence responsibility
- Public interface (what other components call)
- Dependencies (what this component needs)

**Data flow** — trace the primary path:
- Where does data enter the system?
- What transformations happen at each step?
- Where does data leave?
- Where is data persisted?

**Integration points** — where do components connect?
- API contracts (request/response shapes)
- Event interfaces (what triggers what)
- Shared state (tables, caches, queues)

**Security considerations** — for this specific feature:
- Authentication: who can access this?
- Authorization: what are they allowed to do?
- Input validation: what could go wrong with untrusted input?
- Data protection: what's sensitive, how is it stored?

**Decisions log** — for each non-obvious choice:
```
Decision: [what you chose]
Considered: [alternatives]
Why: [reason this over alternatives]
Tradeoff accepted: [what you're giving up]
```

### Architecture anti-patterns to avoid:
- **Architecture astronautics** — 12 microservices for a 2-file feature
- **Missing failure modes** — happy path architecture with no error path design
- **Interface assumptions** — building a component assuming the interface of another component you haven't built yet

</process>
