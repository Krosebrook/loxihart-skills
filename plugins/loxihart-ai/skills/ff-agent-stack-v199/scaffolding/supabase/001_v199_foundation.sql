-- Migration: 001_v199_foundation
-- Version: v1.9.9
-- Description: Core schema stub for FlashFusion Agent Stack v1.9.9
-- Status: STUB — Phase 1 build pipeline generates the complete version
-- Run: supabase db push
--
-- This stub defines table shapes only.
-- Phase 1 produces: final column types, constraints, indexes, and RLS policies.
-- Do NOT use this stub in production without running Phase 1 first.
--
-- Placeholder values are marked: -- [PHASE_1_FILLS_THIS]

-- ============================================================
-- EXTENSIONS
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";  -- pgvector for semantic memory

-- ============================================================
-- TENANTS
-- ============================================================

create table if not exists tenants (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  plan_tier     text not null default 'free', -- [PHASE_1_FILLS_THIS: enum type]
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table tenants enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

-- ============================================================
-- USERS
-- ============================================================

create table if not exists users (
  id            uuid primary key references auth.users(id) on delete cascade,
  tenant_id     uuid not null references tenants(id) on delete cascade,
  email         text not null,
  display_name  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table users enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists users_tenant_id_idx on users(tenant_id);

-- ============================================================
-- MEMBERSHIPS
-- ============================================================

create table if not exists memberships (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  user_id       uuid not null references users(id) on delete cascade,
  role          text not null default 'member', -- [PHASE_1_FILLS_THIS: enum]
  created_at    timestamptz not null default now(),
  unique(tenant_id, user_id)
);

alter table memberships enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists memberships_tenant_id_idx on memberships(tenant_id);
create index if not exists memberships_user_id_idx on memberships(user_id);

-- ============================================================
-- PLANS
-- ============================================================

create table if not exists plans (
  id                    uuid primary key default uuid_generate_v4(),
  name                  text not null unique,
  tier                  text not null unique, -- free, pro, team, enterprise
  per_run_cost_cap_usd  numeric(10,4),        -- [PHASE_1_FILLS_THIS]
  per_day_cost_cap_usd  numeric(10,4),        -- [PHASE_1_FILLS_THIS]
  per_month_cost_cap_usd numeric(10,4),       -- [PHASE_1_FILLS_THIS]
  max_concurrent_runs   int,                  -- [PHASE_1_FILLS_THIS]
  features              jsonb not null default '{}', -- [PHASE_1_FILLS_THIS]
  created_at            timestamptz not null default now()
);

-- Plans are global config — no RLS needed (read-only reference table)

-- ============================================================
-- FEATURE FLAGS
-- ============================================================

create table if not exists feature_flags (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid references tenants(id) on delete cascade,
  flag_name     text not null,
  enabled       boolean not null default false,
  created_at    timestamptz not null default now(),
  unique(tenant_id, flag_name)
);

alter table feature_flags enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists feature_flags_tenant_id_idx on feature_flags(tenant_id);

-- ============================================================
-- AGENT RUNS
-- ============================================================

create table if not exists agent_runs (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null references tenants(id) on delete restrict,
  user_id         uuid not null references users(id) on delete restrict,
  route           text not null,     -- e.g., 'generate', 'research', 'publish', 'chat'
  status          text not null default 'pending', -- [PHASE_1_FILLS_THIS: enum]
  framework       text not null default 'langgraph',
  graph_version   text not null,     -- e.g., '1.9.9'
  prompt_versions jsonb,             -- { nodeId: promptVersionHash }
  model_route     text,              -- which model was selected
  input_summary   text,              -- redacted summary only
  token_budget    int,               -- per-run budget in tokens
  tokens_used     int default 0,
  cost_usd        numeric(10,6) default 0,
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  error_code      text,
  error_message   text,              -- redacted
  created_at      timestamptz not null default now()
);

alter table agent_runs enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists agent_runs_tenant_id_idx on agent_runs(tenant_id);
create index if not exists agent_runs_user_id_idx on agent_runs(user_id);
create index if not exists agent_runs_status_idx on agent_runs(status);
create index if not exists agent_runs_started_at_idx on agent_runs(started_at desc);

-- ============================================================
-- AGENT NODES (trace records)
-- ============================================================

create table if not exists agent_nodes (
  id                  uuid primary key default uuid_generate_v4(),
  run_id              uuid not null references agent_runs(id) on delete cascade,
  tenant_id           uuid not null references tenants(id) on delete restrict,
  node_id             text not null,    -- LangGraph node name
  agent_type          text not null,    -- router, planner, tool_executor, etc.
  status              text not null,    -- success, failed, skipped, retried
  started_at          timestamptz not null,
  completed_at        timestamptz,
  duration_ms         int,
  input_hash          text,             -- SHA-256 of redacted input
  output_hash         text,             -- SHA-256 of redacted output
  cost_usd            numeric(10,6),
  tokens_budget       int,
  tokens_used         int,
  retry_count         int default 0,
  checkpoint_saved    boolean default false,
  prompt_version_hash text,
  error_code          text,
  created_at          timestamptz not null default now()
);

alter table agent_nodes enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists agent_nodes_run_id_idx on agent_nodes(run_id);
create index if not exists agent_nodes_tenant_id_idx on agent_nodes(tenant_id);

-- ============================================================
-- TOOL INVOCATIONS
-- ============================================================

create table if not exists tool_invocations (
  id                uuid primary key default uuid_generate_v4(),
  run_id            uuid not null references agent_runs(id) on delete cascade,
  tenant_id         uuid not null references tenants(id) on delete restrict,
  user_id           uuid not null references users(id) on delete restrict,
  tool_name         text not null,
  tool_category     text not null,     -- internal, mcp, external, file_gen, billing
  idempotency_key   text not null unique,
  status            text not null,     -- success, failed, duplicate_skipped
  input_hash        text,              -- SHA-256 of redacted input
  output_hash       text,              -- SHA-256 of redacted output
  duration_ms       int,
  retry_count       int default 0,
  error_code        text,
  created_at        timestamptz not null default now()
);

alter table tool_invocations enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists tool_invocations_run_id_idx on tool_invocations(run_id);
create index if not exists tool_invocations_tenant_id_idx on tool_invocations(tenant_id);
create unique index if not exists tool_invocations_idempotency_idx on tool_invocations(idempotency_key);

-- ============================================================
-- ARTIFACTS
-- ============================================================

create table if not exists artifacts (
  id              uuid primary key default uuid_generate_v4(),
  run_id          uuid not null references agent_runs(id) on delete restrict,
  tenant_id       uuid not null references tenants(id) on delete restrict,
  user_id         uuid not null references users(id) on delete restrict,
  artifact_type   text not null,       -- [PHASE_1_FILLS_THIS: enum]
  status          text not null default 'draft', -- draft, published, failed
  storage_path    text,                -- Supabase Storage path
  metadata        jsonb,               -- artifact-specific metadata
  publish_job_id  uuid,                -- references publish_jobs if published
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table artifacts enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists artifacts_run_id_idx on artifacts(run_id);
create index if not exists artifacts_tenant_id_idx on artifacts(tenant_id);

-- ============================================================
-- MEMORY ITEMS
-- ============================================================

create table if not exists memory_items (
  id                uuid primary key default uuid_generate_v4(),
  tenant_id         uuid not null references tenants(id) on delete cascade,
  workspace_id      uuid,              -- [PHASE_1_FILLS_THIS: workspace reference]
  user_id           uuid references users(id) on delete set null,
  memory_type       text not null,     -- brand_preference, session_summary, long_term
  retention_class   text not null,     -- ephemeral, session, long_term, policy
  content           text not null,     -- redacted safe content only
  embedding         vector(1536),      -- pgvector embedding
  embedding_status  text default 'pending', -- pending, complete, failed
  expires_at        timestamptz,       -- null = no expiry (policy class)
  created_at        timestamptz not null default now()
);

alter table memory_items enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies]

create index if not exists memory_items_tenant_id_idx on memory_items(tenant_id);
create index if not exists memory_items_retention_class_idx on memory_items(retention_class);
-- [PHASE_1_FILLS_THIS: vector similarity search index (ivfflat or hnsw)]

-- ============================================================
-- USAGE LEDGERS
-- ============================================================

create table if not exists usage_ledgers (
  id              uuid primary key default uuid_generate_v4(),
  run_id          uuid not null references agent_runs(id) on delete restrict,
  tenant_id       uuid not null references tenants(id) on delete restrict,
  user_id         uuid not null references users(id) on delete restrict,
  plan_tier       text not null,
  route           text not null,
  model_used      text,
  input_tokens    int not null default 0,
  output_tokens   int not null default 0,
  tool_call_count int not null default 0,
  cost_usd        numeric(10,6) not null default 0,
  blocked         boolean not null default false,
  blocked_reason  text,
  warning_fired   boolean not null default false,
  created_at      timestamptz not null default now()
  -- NOTE: No UPDATE or DELETE policies — append-only for tamper resistance
);

alter table usage_ledgers enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies — read-only for users, append for service_role]

create index if not exists usage_ledgers_tenant_id_idx on usage_ledgers(tenant_id);
create index if not exists usage_ledgers_run_id_idx on usage_ledgers(run_id);
create index if not exists usage_ledgers_created_at_idx on usage_ledgers(created_at desc);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

create table if not exists audit_logs (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null references tenants(id) on delete restrict,
  user_id         uuid references users(id) on delete set null,
  run_id          uuid references agent_runs(id) on delete set null,
  event_type      text not null,       -- [PHASE_1_FILLS_THIS: enum]
  actor           text not null,       -- user_id, service, agent_name
  target_type     text,                -- artifact, run, publish_job, etc.
  target_id       uuid,
  metadata        jsonb,               -- redacted event details
  created_at      timestamptz not null default now()
  -- NOTE: Append-only. No UPDATE or DELETE.
);

alter table audit_logs enable row level security;
-- [PHASE_1_FILLS_THIS: RLS policies — operator-read-only, service_role append]

create index if not exists audit_logs_tenant_id_idx on audit_logs(tenant_id);
create index if not exists audit_logs_event_type_idx on audit_logs(event_type);
create index if not exists audit_logs_created_at_idx on audit_logs(created_at desc);

-- ============================================================
-- DEVELOPMENT SEED (safe placeholder values only)
-- ============================================================

-- [PHASE_1_FILLS_THIS: 3 example tenant records with safe placeholder values]
-- Example structure (DO NOT USE real emails or UUIDs from production):
--
-- insert into tenants (id, name, slug, plan_tier) values
--   ('00000000-0000-0000-0000-000000000001', 'Acme Corp (Dev)', 'acme-dev', 'pro'),
--   ('00000000-0000-0000-0000-000000000002', 'Beta LLC (Dev)', 'beta-dev', 'free'),
--   ('00000000-0000-0000-0000-000000000003', 'Gamma Inc (Dev)', 'gamma-dev', 'team');
