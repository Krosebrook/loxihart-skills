# Phase 07 — Scalability

## Scope
Horizontal scaling, load balancing, queue-based workloads, database scaling, and sharding. Design for 10x current load before you need it.

---

## Checklist

### Stateless Services
- [ ] Application servers are stateless (no local session state)
- [ ] Session stored in Redis/DB, not in-process memory
- [ ] File uploads go directly to object storage (S3/R2), not local disk
- [ ] No singleton state that breaks under multiple instances

### Load Balancing
- [ ] Load balancer distributes traffic evenly (least connections or round-robin)
- [ ] Sticky sessions NOT used (or documented reason why they are)
- [ ] Health checks configured on load balancer (remove unhealthy instances)
- [ ] Connection draining on scale-in (don't kill in-flight requests)

### Queue-Based Workloads
- [ ] Long-running tasks offloaded to async queue (not synchronous HTTP)
- [ ] Queue consumer is horizontally scalable (more consumers = more throughput)
- [ ] Dead letter queue (DLQ) configured — failed jobs don't disappear
- [ ] Job schema versioned (consumers handle old job versions)
- [ ] Queue backpressure monitored — alert when lag grows

### Database Scaling
- [ ] Read replicas used for read-heavy paths
- [ ] Connection pooler in front of database (PgBouncer, Prisma Accelerate)
- [ ] Max connections per service configured (not sharing DB connection limit)
- [ ] Slow queries identified before they kill the replica lag

### Auto-Scaling
- [ ] Horizontal pod/instance autoscaling configured (CPU or queue lag trigger)
- [ ] Min/max instance counts set
- [ ] Scale-out is faster than scale-in (avoid oscillation)
- [ ] Autoscaling tested — simulate load spike, verify response

### Sharding / Partitioning (if applicable)
- [ ] Partition key chosen based on access patterns (not just primary key)
- [ ] Hot partition problem analyzed and avoided
- [ ] Cross-partition queries minimized
- [ ] Partition pruning verified in query plans

---

## Common Gaps
- Sessions stored in-memory → users get logged out on rolling deploy
- File uploads written to local disk → breaks on multi-instance deploy
- No DLQ → failed jobs silently disappear
- Auto-scaling never tested → first production traffic spike reveals misconfiguration
- Connection pool too small → DB connection exhaustion under load
