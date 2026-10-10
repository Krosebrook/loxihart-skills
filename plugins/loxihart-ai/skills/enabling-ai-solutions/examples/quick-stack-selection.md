# Example Output: Quick Stack Decision — pgvector vs. Pinecone

**Context:** Building a document Q&A feature. Already on Supabase. ~10,000 documents at launch, expected to grow to ~200,000 over 12 months. No specific latency SLA stated.

**Output type used:** Quick Stack Decision (`templates/quick-stack-decision.md`)

---

## Quick Stack Decision: Vector Database for Document Q&A

**Recommendation:** pgvector on your existing Supabase instance. Migrate to Pinecone Standard if you cross 2M vectors or need sub-100ms vector search at >50 QPS.

**Why:** You're already on Supabase, which means pgvector costs you nothing additional and your vectors live in the same database as your application data — eliminating a network hop and a cross-service auth boundary. At 200K documents with ~10 chunks each (2M vectors max), you're inside pgvector's reliable performance envelope. The migration trigger is clear enough that you won't be surprised by it.

**Stack:**
- **LLM:** Claude Sonnet 4.6 (for generation); text-embedding-3-small (OpenAI) or Supabase's built-in embedding API for ingestion
- **Vector DB:** pgvector via Supabase `vecs` extension — `CREATE EXTENSION vector;` on your existing Pro instance
- **Index type:** HNSW (not IVFFlat) — better recall, no retraining required as your corpus grows
- **Relational DB:** Supabase (existing — co-location is the point)
- **Embedding dim:** 1536 (text-embedding-3-small) or 384 (all-MiniLM-L6-v2 if cost-sensitive)

**Tradeoffs:**
- ✅ Zero added infrastructure cost — pgvector on Supabase Pro is included
- ✅ Single DB connection, single auth surface, RLS policies work across vectors and data
- ✅ No vendor lock-in to a vector-specific service; standard Postgres under the hood
- ⚠️ Performance degrades above ~5M vectors without sharding or migration to a dedicated service
- ⚠️ No built-in hybrid search UI or metadata filtering beyond standard SQL — you write the query logic
- ⚠️ HNSW index build time grows with corpus; plan for index rebuild windows as you scale

**If you cross 2M vectors or need <100ms at >50 QPS, switch to:** Pinecone Standard ($500/month) — managed, horizontally scaled, built-in hybrid search, no index maintenance. Migration is a one-time re-ingestion job, not a schema change.

**Estimated monthly cost:**
- pgvector: $0 added to existing Supabase Pro ($25/month)
- At 2M vectors, 1536-dim (float32): ~12GB storage — within Supabase Pro's 8GB RAM but watch memory pressure on heavy query loads
- Pinecone Standard (if migrating): $500/month

---

## Migration Checklist (save for later)

When to migrate from pgvector to Pinecone:
- [ ] Vector count crosses 2M
- [ ] p95 vector search latency exceeds 300ms
- [ ] QPS exceeds 50 concurrent vector queries
- [ ] Hybrid search (keyword + semantic) is too complex to maintain in raw SQL

Migration steps:
1. Export embeddings from pgvector: `SELECT id, embedding, metadata FROM documents`
2. Batch-upsert to Pinecone using their Python/TS client
3. Validate retrieval accuracy on your eval set before cutting over
4. Update connection string in application; no LLM or application logic changes needed
