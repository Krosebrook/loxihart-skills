/**
 * FlashFusion Agent Stack v1.9.9 — Core Type Definitions (STUB)
 *
 * Status: STUB — Phase 4 build pipeline generates the complete version
 * Schema version: v1.9.9
 *
 * This stub provides the structural skeleton.
 * Phase 4 (D12) fills all field types, adds missing interfaces,
 * reconciles GraphState with Phase 2 output, and validates against
 * Phase 1 SQL schema.
 *
 * Fields marked [PHASE_4_FILLS_THIS] must be typed in Phase 4.
 * Do NOT use `any` in the final version without an inline comment.
 */

// ============================================================
// BASE TYPES
// ============================================================

export type UUID = string; // format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export type ISO8601 = string; // format: 2026-03-17T18:10:00Z
export type CostUSD = number; // positive decimal, max 6 decimal places

export type PlanTier = 'free' | 'pro' | 'team' | 'enterprise';

export type RunStatus =
  | 'pending'
  | 'running'
  | 'complete'
  | 'failed'
  | 'cancelled'
  | 'checkpointed'; // awaiting resume

export type AgentType =
  | 'router'
  | 'planner'
  | 'tool_executor'
  | 'memory'
  | 'validator'
  | 'publisher'
  | 'recovery';

export type RunRoute =
  | 'generate'
  | 'research'
  | 'publish'
  | 'chat'
  | 'admin';

export type MemoryRetentionClass =
  | 'ephemeral'
  | 'session'
  | 'long_term'
  | 'policy'; // immutable

export type ToolCategory =
  | 'internal'
  | 'mcp'
  | 'external'
  | 'file_gen'
  | 'billing';

// ============================================================
// ENTITIES (aligned with Phase 1 SQL schema)
// ============================================================

export interface Tenant {
  id: UUID;
  name: string;
  slug: string;
  planTier: PlanTier;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface User {
  id: UUID;
  tenantId: UUID;
  email: string;
  displayName: string | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface Membership {
  id: UUID;
  tenantId: UUID;
  userId: UUID;
  role: string; // [PHASE_4_FILLS_THIS: enum type from Phase 1]
  createdAt: ISO8601;
}

export interface Plan {
  id: UUID;
  name: string;
  tier: PlanTier;
  perRunCostCapUsd: CostUSD | null;
  perDayCostCapUsd: CostUSD | null;
  perMonthCostCapUsd: CostUSD | null;
  maxConcurrentRuns: number | null;
  features: Record<string, boolean | number>; // [PHASE_4_FILLS_THIS: typed feature flags]
  createdAt: ISO8601;
}

export interface FeatureFlag {
  id: UUID;
  tenantId: UUID | null; // null = global flag
  flagName: string;
  enabled: boolean;
  createdAt: ISO8601;
}

// ============================================================
// AGENT EXECUTION
// ============================================================

export interface AgentRun {
  id: UUID;
  tenantId: UUID;
  userId: UUID;
  route: RunRoute;
  status: RunStatus;
  framework: 'langgraph' | 'crewai' | 'autogen'; // primary framework
  graphVersion: string;
  promptVersions: Record<string, string> | null; // { nodeId: hash }
  modelRoute: string | null;
  inputSummary: string | null; // redacted
  tokenBudget: number | null;
  tokensUsed: number;
  costUsd: CostUSD;
  startedAt: ISO8601;
  completedAt: ISO8601 | null;
  errorCode: string | null;
  errorMessage: string | null; // redacted
  createdAt: ISO8601;
}

export interface AgentNode {
  id: UUID;
  runId: UUID;
  tenantId: UUID;
  nodeId: string;
  agentType: AgentType;
  status: 'success' | 'failed' | 'skipped' | 'retried';
  startedAt: ISO8601;
  completedAt: ISO8601 | null;
  durationMs: number | null;
  inputHash: string | null;  // SHA-256
  outputHash: string | null; // SHA-256
  costUsd: CostUSD | null;
  tokensBudget: number | null;
  tokensUsed: number | null;
  retryCount: number;
  checkpointSaved: boolean;
  promptVersionHash: string | null;
  errorCode: string | null;
  createdAt: ISO8601;
}

export interface ToolInvocation {
  id: UUID;
  runId: UUID;
  tenantId: UUID;
  userId: UUID;
  toolName: string;
  toolCategory: ToolCategory;
  idempotencyKey: string;
  status: 'success' | 'failed' | 'duplicate_skipped';
  inputHash: string | null;
  outputHash: string | null;
  durationMs: number | null;
  retryCount: number;
  errorCode: string | null;
  createdAt: ISO8601;
}

export interface ToolAuditRecord {
  // Full audit record — includes fields not in the DB row
  invocationId: UUID;
  runId: UUID;
  tenantId: UUID;
  userId: UUID;
  toolName: string;
  toolCategory: ToolCategory;
  idempotencyKey: string;
  status: 'success' | 'failed' | 'duplicate_skipped';
  durationMs: number;
  retryCount: number;
  redactedInput: Record<string, unknown>; // sensitive fields removed
  redactedOutput: Record<string, unknown>; // sensitive fields removed
  timestamp: ISO8601;
}

// ============================================================
// MEMORY + ARTIFACTS
// ============================================================

export interface MemoryItem {
  id: UUID;
  tenantId: UUID;
  workspaceId: UUID | null;
  userId: UUID | null;
  memoryType: string; // [PHASE_4_FILLS_THIS: typed enum from Phase 2]
  retentionClass: MemoryRetentionClass;
  content: string; // safe, redacted content only
  embeddingStatus: 'pending' | 'complete' | 'failed';
  expiresAt: ISO8601 | null;
  createdAt: ISO8601;
}

export interface Artifact {
  id: UUID;
  runId: UUID;
  tenantId: UUID;
  userId: UUID;
  artifactType: string; // [PHASE_4_FILLS_THIS: enum from Phase 2]
  status: 'draft' | 'published' | 'failed';
  storagePath: string | null;
  metadata: Record<string, unknown>; // [PHASE_4_FILLS_THIS: typed per artifact type]
  publishJobId: UUID | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface PublishJob {
  id: UUID;
  artifactId: UUID;
  tenantId: UUID;
  userId: UUID;
  platform: string; // [PHASE_4_FILLS_THIS: 'etsy' | 'shopify' | 'printify' | ...]
  status: 'pending' | 'running' | 'success' | 'failed';
  idempotencyKey: string;
  externalId: string | null; // ID assigned by external platform on success
  error: string | null;
  createdAt: ISO8601;
  completedAt: ISO8601 | null;
}

// ============================================================
// BILLING + OBSERVABILITY
// ============================================================

export interface UsageLedgerEntry {
  id: UUID;
  runId: UUID;
  tenantId: UUID;
  userId: UUID;
  planTier: PlanTier;
  route: RunRoute;
  modelUsed: string | null;
  inputTokens: number;
  outputTokens: number;
  toolCallCount: number;
  costUsd: CostUSD;
  blocked: boolean;
  blockedReason: string | null;
  warningFired: boolean;
  createdAt: ISO8601;
}

export interface AuditLog {
  id: UUID;
  tenantId: UUID;
  userId: UUID | null;
  runId: UUID | null;
  eventType: string; // [PHASE_4_FILLS_THIS: typed enum from Phase 3]
  actor: string;
  targetType: string | null;
  targetId: UUID | null;
  metadata: Record<string, unknown>; // redacted
  createdAt: ISO8601;
}

export interface NodeExecutionTrace {
  runId: UUID;
  tenantId: UUID;
  userId: UUID;
  nodeId: string;
  nodeName: string;
  agentType: AgentType;
  status: 'success' | 'failed' | 'skipped';
  startedAt: ISO8601;
  completedAt: ISO8601 | null;
  durationMs: number | null;
  inputHash: string | null;
  outputHash: string | null;
  costUsd: CostUSD | null;
  tokensBudget: number | null;
  tokensUsed: number | null;
  retryCount: number;
  checkpointSaved: boolean;
  toolsCalled: string[];
  modelUsed: string | null;
  promptVersionHash: string | null;
  graphVersion: string;
  error: string | null; // redacted
}

// ============================================================
// GRAPH STATE (reconcile with Phase 2 D5 output)
// ============================================================

export interface GraphState {
  // [PHASE_4_FILLS_THIS: reconcile with Phase 2 GRAPH_SPEC.md GraphState]
  // Stub fields — Phase 2 may add or rename these:
  runId: UUID;
  tenantId: UUID;
  userId: UUID;
  route: RunRoute;
  planVersion: string;
  graphVersion: string;
  promptVersions: Record<string, string>;
  tokenBudget: number;
  tokensUsed: number;
  costUsd: CostUSD;
  currentNode: string;
  hopCount: number;
  retryCount: number;
  checkpoints: Record<string, unknown>; // [PHASE_4_FILLS_THIS: typed per checkpoint]
  memoryWrites: UUID[];
  toolInvocations: UUID[];
  artifacts: UUID[];
  status: RunStatus;
  error: string | null;
}

// ============================================================
// EVENTS (reconcile with Phase 4 D11 API contracts)
// ============================================================

interface BaseEvent {
  eventId: UUID;
  eventType: string;
  runId: UUID;
  tenantId: UUID;
  userId: UUID;
  graphVersion: string;
  timestamp: ISO8601;
}

export interface RunStartedEvent extends BaseEvent {
  eventType: 'run.started';
  route: RunRoute;
  planTier: PlanTier;
  tokenBudget: number | null;
}

export interface NodeCompletedEvent extends BaseEvent {
  eventType: 'node.completed';
  nodeId: string;
  agentType: AgentType;
  status: 'success' | 'failed' | 'skipped';
  durationMs: number;
  costUsd: CostUSD;
}

export interface ToolInvokedEvent extends BaseEvent {
  eventType: 'tool.invoked';
  toolName: string;
  toolCategory: ToolCategory;
  idempotencyKey: string;
  status: 'success' | 'failed' | 'duplicate_skipped';
}

export interface UsageMeteredEvent extends BaseEvent {
  eventType: 'usage.metered';
  planTier: PlanTier;
  inputTokens: number;
  outputTokens: number;
  costUsd: CostUSD;
  blocked: boolean;
}

export interface RunFailedEvent extends BaseEvent {
  eventType: 'run.failed';
  errorCode: string;
  failingNode: string;
  checkpointAvailable: boolean;
}

export interface CheckpointSavedEvent extends BaseEvent {
  eventType: 'checkpoint.saved';
  nodeId: string;
  checkpointId: UUID;
  resumable: boolean;
}

export interface ArtifactCreatedEvent extends BaseEvent {
  eventType: 'artifact.created';
  artifactId: UUID;
  artifactType: string;
  status: 'draft' | 'published';
}

export interface BudgetWarningEvent extends BaseEvent {
  eventType: 'budget.warning';
  thresholdPct: number; // e.g., 80 = 80% of cap reached
  costUsdSoFar: CostUSD;
  capUsd: CostUSD;
}

export type FlashFusionEvent =
  | RunStartedEvent
  | NodeCompletedEvent
  | ToolInvokedEvent
  | UsageMeteredEvent
  | RunFailedEvent
  | CheckpointSavedEvent
  | ArtifactCreatedEvent
  | BudgetWarningEvent;
