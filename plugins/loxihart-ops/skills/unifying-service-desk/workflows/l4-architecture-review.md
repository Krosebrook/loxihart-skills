# Workflow: L4 Architecture Review

<purpose>
L4 is not a support tier — it is a design tier. L4 engages when the current system architecture cannot prevent a class of failures, when a recurring pattern requires structural change, or when a post-incident review reveals systemic risk. L4 produces design recommendations, architectural decisions, and implementation plans — not ticket resolutions.

The mindset at L4: you are an architect examining why the system allows this class of failure to exist. The deliverable is a design change that eliminates the failure mode, not a fix for one instance.
</purpose>

<required_reading>
**Read before starting:**
1. All RCA reports for the related incidents
2. `references/root-cause-patterns.md` — the pattern(s) driving this review
3. The full escalation chain from L3
</required_reading>

<process>

## Step 1: Pattern Analysis

Collect all incidents related to the pattern being reviewed:
- How many times has this occurred?
- What is the average time to detect and resolve?
- What is the cumulative business impact?
- What is the L1/L2/L3 cost of repeatedly handling this?

This quantifies the problem. Architecture changes require justification — "it keeps happening" is not sufficient. "This pattern has generated 12 incidents in 6 months, averaging 3 hours of L2 time each, with $X in lost productivity" is.

## Step 2: Root Cause Class Identification

Move past individual root causes to identify the root cause CLASS:

Individual root cause: "The Windows Audio service deadlocked because exclusive mode was enabled."
Root cause class: "Users can configure device settings that conflict with organizational requirements, and there is no mechanism to enforce correct settings."

Individual root cause: "The VPN certificate expired."
Root cause class: "Certificate lifecycle management is manual, with no automated renewal or expiration alerting."

Individual root cause: "A phishing email bypassed the filter."
Root cause class: "Email security relies on a single layer of filtering with no user-level behavioral analysis."

The class tells you what architectural change is needed.

## Step 3: Solution Design

Propose architectural changes that eliminate the failure class. For each proposal:

**What changes:**
- Technical components affected
- Configuration or infrastructure modifications
- New systems or tools required

**What it costs:**
- Implementation effort (hours/days/weeks)
- Licensing or infrastructure costs
- Ongoing operational overhead

**What it prevents:**
- Which failure patterns are eliminated
- Reduction in ticket volume (estimated)
- Reduction in L2/L3 escalation (estimated)

**What it risks:**
- Implementation risk (what could go wrong during the change)
- Operational risk (new failure modes introduced)
- Rollback plan if the change causes problems

**Alternatives considered:**
- Why simpler approaches are insufficient
- Tradeoffs between cost and completeness

## Step 4: Stakeholder Recommendation

Package the analysis and proposal for decision-makers:

1. **Problem statement:** The pattern, its frequency, its impact (quantified)
2. **Recommended solution:** The preferred architectural change with justification
3. **Alternatives:** Other options considered and why they were not recommended
4. **Cost/benefit:** Implementation cost vs. ongoing savings
5. **Timeline:** Proposed implementation schedule
6. **Decision needed:** What approval is required to proceed

## Step 5: Implementation Oversight

If the recommendation is approved:
1. Create an implementation plan with phases, milestones, and rollback points
2. Coordinate with L3 for execution
3. Define success metrics (reduction in related incidents, reduction in mean time to resolve)
4. Monitor for 30-90 days post-implementation
5. Close the architecture review when success metrics are met

If the recommendation is not approved:
1. Document the decision and the reason
2. Document the accepted risk (the pattern will continue)
3. Ensure L1-L3 have optimized procedures for handling the pattern efficiently
4. Re-evaluate if incident frequency or impact increases

</process>

<common_l4_recommendations>

## Common Architectural Patterns L4 Recommends

**Automated enforcement:** Replace manual settings with Group Policy, MDM policies, or configuration management that enforces correct state.

**Certificate lifecycle automation:** ACME, auto-enrollment, or managed certificate services that renew before expiration.

**Monitoring and alerting:** Proactive detection of conditions before they cause incidents (disk space, certificate expiry, license utilization, DHCP scope utilization).

**Self-healing systems:** Scripts or automation that detect and correct known failure states without human intervention (auto-restart services, auto-clear temp files, auto-rotate logs).

**Standardization:** Reducing hardware/software variation to reduce the surface area for unique failures. Fewer models, fewer configurations, fewer special cases.

**Redundancy:** Eliminating single points of failure for critical services (dual DNS servers, VPN failover, print server clustering).

</common_l4_recommendations>

<success_criteria>
L4 workflow is complete when:
- [ ] All related incidents collected and quantified
- [ ] Root cause class identified (not just individual root causes)
- [ ] Architectural solution designed with cost/benefit analysis
- [ ] Alternatives considered and documented
- [ ] Stakeholder recommendation prepared
- [ ] Decision received (approved or deferred with documented rationale)
- [ ] If approved: implementation plan created and execution monitored
- [ ] Success metrics defined and tracked for 30-90 days
- [ ] Root cause patterns reference updated with resolution
</success_criteria>
