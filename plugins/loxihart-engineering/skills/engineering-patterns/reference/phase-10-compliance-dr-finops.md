# Phase 10 — Compliance, Disaster Recovery & FinOps

## Scope
Regulatory compliance posture, backup/restore validation, RTO/RPO targets, and cloud cost governance.

---

## Checklist

### Compliance Posture
- [ ] Data classification documented: public / internal / confidential / restricted
- [ ] PII inventory completed — know what PII you collect and where it lives
- [ ] Data retention policy defined and enforced (auto-delete after N days)
- [ ] Right to erasure workflow implemented (GDPR/CCPA: delete user data on request)
- [ ] Data processing agreements (DPAs) signed with all third-party processors
- [ ] Terms of Service and Privacy Policy reviewed by legal (not just AI-generated)
- [ ] Cookie consent banner compliant with GDPR (no pre-ticked boxes, granular consent)
- [ ] SOC 2 Type II / ISO 27001 gap assessment done if enterprise customers are a target

### Disaster Recovery
- [ ] RTO (Recovery Time Objective) defined — how long can you be down?
- [ ] RPO (Recovery Point Objective) defined — how much data loss is acceptable?
- [ ] Backup schedule matches RPO (hourly backups → ≤1hr RPO)
- [ ] Backups encrypted at rest and stored in separate region/account
- [ ] Backup restore tested on schedule (at least quarterly)
- [ ] Runbook for each failure scenario: DB failure, region outage, code corruption
- [ ] Chaos engineering or game day exercises conducted
- [ ] On-call rotation documented with escalation path

### Backup Validation
- [ ] Automated restore test runs weekly (or monthly minimum)
- [ ] Restored database validated: row counts match, spot-check queries pass
- [ ] Restore time measured and within RTO
- [ ] Point-in-time recovery (PITR) available if RPO < 1 hour
- [ ] Object storage versioning enabled (S3/R2) — accidental deletes recoverable

### Multi-Region / High Availability
- [ ] Single points of failure identified and documented
- [ ] Critical services deployed across ≥ 2 availability zones
- [ ] Database failover tested (promote replica → new primary)
- [ ] DNS failover tested (traffic cuts over within TTL window)
- [ ] CDN failover configured (origin fallback)

### FinOps — Cost Governance
- [ ] Cloud cost baseline established (monthly spend by service)
- [ ] Budget alerts configured — alert at 80% and 100% of monthly budget
- [ ] Cost anomaly detection enabled (AWS Cost Anomaly Detection, GCP Budget Alerts)
- [ ] Reserved instances or savings plans for predictable baseline workloads
- [ ] Unused resources identified and cleaned up (idle EC2/Cloud Run, orphaned volumes, old snapshots)
- [ ] Data transfer costs analyzed — cross-region data movement is expensive
- [ ] LLM API costs metered per tenant/user (not absorbed into flat overhead)

### FinOps — Efficiency
- [ ] Right-sized instances — not 2x overprovisioned "just in case"
- [ ] Spot/preemptible instances for batch/fault-tolerant workloads
- [ ] Auto-scaling scales down aggressively during off-peak hours
- [ ] Database query cost analyzed — expensive queries hit read replicas
- [ ] S3/R2 storage class lifecycle rules set (move old objects to cheaper tiers)
- [ ] Log volume monitored — verbose DEBUG logs not shipped to expensive log store in production

---

## RTO/RPO Target Matrix

| Tier | RTO | RPO | Strategy |
|------|-----|-----|----------|
| P0 (revenue-critical) | < 15 min | < 1 min | Active-active multi-region, sync replication |
| P1 (core features) | < 1 hour | < 5 min | Active-passive + PITR |
| P2 (supporting services) | < 4 hours | < 1 hour | Single region + hourly backup |
| P3 (internal tools) | < 24 hours | < 24 hours | Daily backup |

---

## Common Gaps
- Backups exist but restore has never been tested → backup is worthless
- RTO defined on paper but never validated with a real runbook
- Cost alerts set but no one owns cost optimization — spend drifts 3x over baseline
- LLM API costs unmetered → usage spike from one bad actor costs thousands
- PITR not enabled → a bad migration means restoring from yesterday's backup
- Data deletion requests not automated → compliance risk when users invoke GDPR right to erasure
