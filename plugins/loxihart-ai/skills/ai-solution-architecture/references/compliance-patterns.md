# Compliance Patterns for AI Systems

## Overview

Security and compliance requirements for enterprise AI deployments across common regulatory frameworks.

## GDPR (General Data Protection Regulation)

**Scope:** EU citizens' personal data

**Key Requirements:**

```yaml
data_minimization:
  requirement: Only collect data necessary for stated purpose
  implementation:
    - User profile: email, name only (no unnecessary fields)
    - Conversation history: opt-in only, with clear retention policy
    - Analytics: anonymize IP addresses, aggregate metrics

right_to_access:
  requirement: Users can request all data held about them
  implementation:
    - API endpoint: GET /api/user/{id}/data-export
    - Returns: JSON with all user data (profile, conversations, logs)
    - Response time: Within 30 days

right_to_erasure:
  requirement: Users can request data deletion
  implementation:
    - API endpoint: DELETE /api/user/{id}
    - Cascading deletes: user → conversations → embeddings → logs
    - Verification: Email confirmation + 7-day grace period
    - Backup purge: Automated script removes from backups within 90 days

data_portability:
  requirement: Users can export data in machine-readable format
  implementation:
    - Export formats: JSON, CSV
    - Includes: Conversation transcripts, uploaded documents, preferences
    - API: POST /api/user/{id}/export → returns download link

consent_management:
  requirement: Explicit consent for data processing
  implementation:
    - Cookie banner: Required, opt-out for non-essential
    - Terms acceptance: Checkbox (not pre-checked) before account creation
    - Consent log: Timestamped record of all consents given

data_breach_notification:
  requirement: Report breaches within 72 hours
  implementation:
    - Monitoring: Sentry alerts for unauthorized access patterns
    - Escalation: Security team notified via PagerDuty
    - Notification template: Pre-approved legal language
    - Regulator contact: DPA (Data Protection Authority) contact info ready
```

## HIPAA (Health Insurance Portability and Accountability Act)

**Scope:** Protected Health Information (PHI) for US healthcare entities

**Key Requirements:**

```yaml
encryption:
  at_rest:
    - Database: AES-256 encryption (AWS RDS encryption enabled)
    - File storage: S3 with server-side encryption (SSE-KMS)
    - Backups: Encrypted snapshots, separate KMS key
  
  in_transit:
    - API: TLS 1.3 only (reject TLS 1.2 and below)
    - Internal services: mTLS (mutual TLS) between microservices
    - Database connections: SSL/TLS enforced

access_controls:
  authentication:
    - MFA required for all administrative access
    - Password policy: 12+ chars, rotation every 90 days
    - Session timeout: 15 minutes inactivity
  
  authorization:
    - Role-based: Doctor, Nurse, Admin, Billing
    - Minimum necessary: Users see only PHI needed for their role
    - Break-glass: Emergency access logged, flagged for review

audit_logging:
  events_logged:
    - All PHI access (read, write, delete)
    - Failed authentication attempts
    - Permission changes
    - Data exports
  
  log_retention:
    - Duration: 6 years (HIPAA requirement)
    - Storage: Immutable (WORM: Write Once Read Many)
    - Review: Quarterly audit of access patterns

business_associate_agreements:
  requirement: Contracts with third-party vendors handling PHI
  vendors_requiring_baa:
    - Cloud provider: AWS, Azure, GCP
    - LLM provider: OpenAI, Anthropic (if PHI in prompts)
    - Analytics: PostHog, Sentry
    - Email: SendGrid, Mailgun
  
  contract_terms:
    - Data use limitation: Only for stated purpose
    - Safeguards: Vendor must implement physical, technical, administrative controls
    - Breach notification: Vendor must notify within 60 days
    - Data return/destruction: At contract end, return or destroy PHI

de_identification:
  safe_harbor_method:
    - Remove 18 identifiers:
      - Names
      - Geographic subdivisions smaller than state
      - Dates (except year)
      - Phone/fax numbers
      - Email addresses
      - Social Security numbers
      - Medical record numbers
      - Account numbers
      - License/certificate numbers
      - URLs
      - IP addresses
      - Biometric identifiers
      - Photos
      - Other unique identifiers
  
  implementation:
    - Preprocessing: Redact PII before sending to LLM
    - Regex patterns: SSN (\d{3}-\d{2}-\d{4}), Phone ((\\d{3})\\d{3}-\\d{4})
    - NER models: spaCy or Presidio for entity recognition
    - Manual review: High-risk documents reviewed by compliance officer
```

## [COMPLIANCE FRAMEWORK] (Service Organization Control)

**Scope:** Trust Service Criteria (security, availability, confidentiality)

**Key Requirements:**

```yaml
security:
  criteria:
    - Access controls: Multi-factor authentication for production
    - Network security: Firewalls, intrusion detection
    - Change management: Code review, testing before deploy
  
  evidence:
    - Access logs: CloudTrail (AWS), Audit Logs (GCP)
    - Firewall rules: Security groups documented
    - Change tickets: GitHub PR history, Jira tickets

availability:
  criteria:
    - Uptime SLA: 99.9% (max 43 minutes downtime/month)
    - Monitoring: Real-time alerts for service degradation
    - Incident response: Documented procedures, escalation paths
  
  evidence:
    - Uptime reports: Monthly from UptimeRobot or Pingdom
    - Incident logs: Post-mortems for all outages
    - DR plan: Disaster recovery tested quarterly

processing_integrity:
  criteria:
    - Data accuracy: Validation rules for all inputs
    - Error handling: Graceful degradation, no data corruption
    - Quality assurance: Automated testing (>80% coverage)
  
  evidence:
    - Test reports: CI/CD pipeline results (Jest, Pytest)
    - Error logs: Sentry reports, resolved tickets
    - Code coverage: SonarQube reports

confidentiality:
  criteria:
    - Data classification: Public, Internal, Confidential, Restricted
    - Encryption: At-rest and in-transit
    - Access controls: Need-to-know basis
  
  evidence:
    - Data flow diagram: Shows encryption points
    - Access matrix: Role → data mapping
    - Encryption audit: KMS key rotation logs

privacy:
  criteria:
    - Notice: Privacy policy published, version controlled
    - Choice: Opt-in for marketing, analytics
    - Access: Users can view/edit/delete their data
  
  evidence:
    - Privacy policy: Dated, reviewed by legal
    - Consent logs: Timestamped user agreements
    - Data request logs: Export/deletion requests processed
```

## PCI-DSS (Payment Card Industry Data Security Standard)

**Scope:** Systems storing, processing, or transmitting cardholder data

**Key Requirements:**

```yaml
network_security:
  - Firewall: Only ports 443 (HTTPS), 22 (SSH with key-only)
  - DMZ: Cardholder Data Environment (CDE) isolated from corporate network
  - IDS/IPS: Intrusion detection on CDE boundary

cardholder_data_protection:
  tokenization:
    - Store tokens, not PANs (Primary Account Numbers)
    - Provider: Stripe, Braintree (PCI Level 1 certified)
    - Loxihart system never sees full card number
  
  encryption:
    - TLS 1.2+ for transmission
    - AES-256 for any stored card data (rare, prefer tokenization)

access_control:
  - Unique IDs: No shared accounts for CDE access
  - Physical access: Badge-controlled server rooms (if on-prem)
  - Admin access: VPN + MFA + IP whitelist

monitoring:
  - File integrity monitoring: AIDE or Tripwire on CDE servers
  - Log aggregation: All CDE logs forwarded to SIEM
  - Quarterly scans: ASV (Approved Scanning Vendor) scans for vulnerabilities
```

## Implementation Checklist

**Per Compliance Framework**

```yaml
gdpr_checklist:
  - [ ] Privacy policy published (clearly written, non-legal language)
  - [ ] Cookie consent banner (opt-out for non-essential)
  - [ ] Data export API (JSON format, <30 day response)
  - [ ] Data deletion API (cascading, backup purge within 90 days)
  - [ ] Data Processing Agreement (DPA) with cloud provider
  - [ ] Breach notification procedure documented
  - [ ] DPO (Data Protection Officer) appointed if >250 employees

hipaa_checklist:
  - [ ] Encryption at rest (AES-256, KMS-managed keys)
  - [ ] Encryption in transit (TLS 1.3)
  - [ ] Audit logging enabled (6-year retention)
  - [ ] MFA for admin access
  - [ ] BAA signed with all vendors handling PHI
  - [ ] De-identification procedures documented
  - [ ] Annual HIPAA training for staff

soc2_checklist:
  - [ ] Access logs retained (CloudTrail, 1-year minimum)
  - [ ] Uptime monitoring (target: 99.9%)
  - [ ] Incident response plan (tested quarterly)
  - [ ] Automated testing (>80% code coverage)
  - [ ] Encryption audit trail (KMS key rotation)
  - [ ] Data classification policy published
  - [ ] Annual [COMPLIANCE FRAMEWORK] audit scheduled

pci_dss_checklist:
  - [ ] Tokenization implemented (no raw PANs stored)
  - [ ] Firewall rules restrictive (whitelist only)
  - [ ] Quarterly ASV scans passed
  - [ ] MFA for CDE access
  - [ ] File integrity monitoring (AIDE/Tripwire)
  - [ ] PCI self-assessment questionnaire (SAQ) completed annually
```

## Risk Assessment Matrix

| Compliance | Penalty for Violation | Audit Frequency | Implementation Cost | Complexity |
|------------|----------------------|-----------------|---------------------|------------|
| GDPR | €20M or 4% revenue | Reactive (complaints) | Medium ($10-50K) | Medium |
| HIPAA | $100-1.5M per violation | Reactive | High ($50-200K) | High |
| [COMPLIANCE FRAMEWORK] | Loss of trust/customers | Annual (self-initiated) | High ($100-300K) | High |
| PCI-DSS | $5-100K/month + card ban | Quarterly (mandatory) | Very High ($200K+) | Very High |

**Recommendation:** For AI systems handling sensitive data, start with [COMPLIANCE FRAMEWORK] (demonstrates general security), then add GDPR (EU customers), HIPAA (healthcare), or PCI-DSS (payments) as needed.

---

**Last Updated:** 2025-01-22  
**Version:** 1.0  
**Maintained by:** Loxihart Inc. Compliance Team
