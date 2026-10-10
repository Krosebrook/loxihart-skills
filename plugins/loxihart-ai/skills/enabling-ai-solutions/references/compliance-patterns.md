# Compliance Patterns for AI Systems

Read this in Step 5 of the golden path when any of the following apply: client operates in a regulated industry, the system processes personal data from EU residents, the client has mentioned a compliance framework, or the system handles payment data.

**Quick map:**
- EU customer data → GDPR
- Healthcare / PHI → HIPAA
- B2B SaaS needing vendor trust → [COMPLIANCE FRAMEWORK]
- Payments / card data → PCI-DSS

---

## GDPR (General Data Protection Regulation)

**Scope:** Personal data of EU residents. Applies even if your company is not EU-based.

```yaml
data_minimization:
  - Collect only what's necessary for the stated purpose
  - Conversation history: opt-in only, with documented retention policy
  - Analytics: anonymize IP addresses, use aggregate metrics

right_to_access:
  endpoint: GET /api/user/{id}/data-export
  format: JSON (all user data: profile, conversations, logs)
  sla: Within 30 days of request

right_to_erasure:
  endpoint: DELETE /api/user/{id}
  cascade: user → conversations → vector embeddings → audit logs
  verification: Email confirmation + 7-day grace period
  backup_purge: Automated, within 90 days

data_portability:
  endpoint: POST /api/user/{id}/export
  formats: JSON, CSV
  includes: Conversation transcripts, uploaded docs, preferences

consent_management:
  cookie_banner: Required for non-essential cookies, opt-out mechanism
  account_creation: Explicit checkbox (not pre-checked)
  consent_log: Timestamped record of all consents

breach_notification:
  regulator_deadline: 72 hours
  monitoring: Sentry alerts for unauthorized access patterns
  template: Pre-approved legal language ready before launch

llm_specific:
  - If using hosted LLM APIs (Anthropic, OpenAI): confirm DPA signed with provider
  - Avoid sending identifiable EU user data to models without DPA
  - Azure OpenAI has EU data residency options for GDPR-strict deployments
```

**Implementation checklist:**
- [ ] Privacy policy published (plain language)
- [ ] Cookie consent banner with opt-out
- [ ] Data export API endpoint
- [ ] Data deletion API with cascading deletes
- [ ] DPA signed with cloud provider and LLM provider
- [ ] Breach notification procedure documented

---

## HIPAA (Health Insurance Portability and Accountability Act)

**Scope:** Protected Health Information (PHI) — US healthcare entities and business associates.

```yaml
encryption:
  at_rest:
    - Database: AES-256 (AWS RDS encryption, Supabase encryption-at-rest)
    - File storage: S3 with SSE-KMS, separate KMS key per environment
    - Backups: Encrypted snapshots
  in_transit:
    - API: TLS 1.3 only (reject 1.2 and below)
    - Internal services: mTLS between microservices
    - Database: SSL/TLS enforced

access_controls:
  authentication:
    - MFA required for all admin and clinical staff access
    - Session timeout: 15 minutes inactivity
    - Password: 12+ chars, 90-day rotation
  authorization:
    - RBAC with minimum necessary principle
    - Break-glass access: logged, flagged for review
    - RLS policies for patient data isolation

audit_logging:
  events: All PHI read/write/delete, failed auth, permission changes, data exports
  retention: 6 years (HIPAA minimum)
  storage: Immutable (WORM)
  review: Quarterly audit

baa_required_with:
  - Cloud provider (AWS, Azure, GCP — all offer BAA)
  - LLM provider: Anthropic (BAA available), OpenAI (BAA available), Azure OpenAI
  - Analytics: PostHog (verify), Sentry (verify)
  - Email service providers

de_identification_before_llm:
  method: Remove or redact 18 HIPAA identifiers before sending to any LLM API
  tools:
    - AWS Comprehend Medical (managed NER)
    - Microsoft Presidio (open-source PII detection)
    - spaCy NER (custom models)
  pattern_examples:
    - SSN: \d{3}-\d{2}-\d{4}
    - Phone: (\d{3})[\s.-]\d{3}[\s.-]\d{4}
    - Email: standard email regex
  review: High-risk documents reviewed by compliance officer
```

**Implementation checklist:**
- [ ] AES-256 encryption at rest across all data stores
- [ ] TLS 1.3 in transit, mTLS for internal services
- [ ] Audit logging with 6-year retention on immutable storage
- [ ] MFA enforced for all admin access
- [ ] BAA signed with cloud provider and LLM provider
- [ ] PHI de-identification pipeline before any LLM call
- [ ] Annual HIPAA training documented

---

## [COMPLIANCE FRAMEWORK]

**Scope:** Trust service criteria for SaaS vendors. Required for B2B enterprise sales in most verticals.

```yaml
security:
  controls:
    - MFA for all production access
    - Firewall / security groups (allowlist only)
    - Code review required before production deploy
    - Dependency scanning in CI/CD
  evidence:
    - Access logs: CloudTrail or equivalent, 1-year minimum
    - Firewall rules: documented and version-controlled
    - PR history + deployment logs

availability:
  sla: 99.9% uptime (43 minutes max downtime/month)
  monitoring: UptimeRobot or Datadog synthetic checks
  incident_response: Documented runbook, escalation path, comms templates
  dr_plan: Disaster recovery tested quarterly

processing_integrity:
  validation: Input validation on all API endpoints
  error_handling: Graceful degradation, no silent data corruption
  testing: Automated tests in CI, target >80% coverage
  evidence: CI/CD reports, Sentry resolved-error history

confidentiality:
  data_classification: Public / Internal / Confidential / Restricted
  encryption: At rest and in transit
  access_matrix: Role → data asset mapping documented
  evidence: Data flow diagram with encryption points marked

privacy:
  notice: Privacy policy version-controlled, dated
  choice: Opt-in for marketing/analytics
  access: Users can view, edit, delete their data
  evidence: Consent logs, data request processing records
```

**Implementation checklist:**
- [ ] Access logs retained (1 year minimum)
- [ ] Uptime monitoring with alerting
- [ ] Incident response plan documented
- [ ] Automated test coverage >80%
- [ ] Data classification policy published
- [ ] Encryption audit trail (KMS key rotation logs)
- [ ] Annual [COMPLIANCE FRAMEWORK] audit scheduled with accredited auditor

---

## PCI-DSS (Payment Card Industry Data Security Standard)

**Scope:** Any system that stores, processes, or transmits cardholder data. Default: don't touch card data — use Stripe/Braintree and stay out of scope.

```yaml
default_recommendation:
  use_tokenization: true
  provider: Stripe or Braintree (PCI Level 1 certified)
  principle: Your system stores tokens only; never sees PANs
  scope_reduction: Keeps your CDE (Cardholder Data Environment) minimal

if_in_scope:
  network:
    - Port allowlist: 443 (HTTPS), 22 (SSH key-only only)
    - CDE isolated from corporate network with DMZ
    - IDS/IPS on CDE boundary

  data_protection:
    - Tokenization over encryption where possible
    - AES-256 for any stored card data
    - TLS 1.2+ minimum (1.3 preferred)

  access:
    - Unique IDs: no shared accounts for CDE access
    - MFA + VPN + IP allowlist for admin CDE access
    - Physical access: badge-controlled

  monitoring:
    - File integrity monitoring: AIDE or Wazuh
    - All CDE logs forwarded to SIEM
    - Quarterly ASV scans

annual_requirements:
  - PCI SAQ (Self-Assessment Questionnaire) completed
  - Penetration test of CDE
  - Quarterly network scans by ASV
```

---

## Risk Assessment Matrix

| Framework | Trigger | Implementation Cost | Complexity | Penalty |
|-----------|---------|---------------------|------------|---------|
| GDPR | EU user data | Low–Medium | Medium | €20M or 4% revenue |
| HIPAA | US healthcare PHI | High | High | $100–$1.9M per violation |
| [COMPLIANCE FRAMEWORK] | B2B enterprise sales | High | High | Lost deals / contracts |
| PCI-DSS | Card data in scope | Very High | Very High | $5K–$100K/month + card ban |

**Sequencing recommendation:** [COMPLIANCE FRAMEWORK] first (general security posture), then GDPR (EU sales), then HIPAA (healthcare vertical), then PCI-DSS only if card data is unavoidable.

---

*Frameworks current as of January 2026. Regulations themselves are stable; implementation details evolve — verify with legal counsel for client-facing compliance commitments.*
