# Exercise Reference: Domain Knowledge & Facilitation Notes

Full descriptions, analogies, technical definitions, and facilitation guidance for all three exercises.

---

## Section 1: Reverse Menu Mapping

**The analogy:** Walking into a restaurant where you can't order the food — instead, you describe the feeling and health outcome you want, and the chef backs into the ingredients. You focus on the human end state; the kitchen handles preparation.

**Concrete example:** A customer service department wants to reduce first-response times from 4 hours to 15 minutes while maintaining a 90% satisfaction score. Instead of starting with "we need a chatbot," they map the exact metric and data points needed at the 15-minute mark, then select an LLM triage pipeline to fulfill that specific operational metric.

**Technical definition:** Outcome-First Requirements Engineering — a methodology that defines system specifications by isolating desired operational metrics, business constraints, and KPIs prior to selecting the technical architecture, models, or data pipelines.

**The artifact:** Outcome Ledger with three columns — Target Metric Change, Human Friction Point, AI Enabler — populated in that order.

**Key facilitation notes:**
- Teams often want to start with the technology. The facilitator's job is to keep redirecting to the metric.
- A good column 1 entry has a number in it. No number = not done.
- A good column 2 entry describes a human action that a clock could time. "The legal team" is not an action.
- Column 3 is the reward for completing 1 and 2. Don't let anyone skip to it.

**When to use this exercise first:**
- Mixed audience with technical and non-technical stakeholders
- Team has budget to spend but no agreement on what to build
- Leadership wants AI but engineers don't know where to start
- Pre-procurement — team hasn't bought a tool yet

---

## Section 2: AI Friction Audit

**The analogy:** Your operational workflow is old plumbing. Water is slowing somewhere because of rust, narrow pipes, or leaks. Before you buy an expensive new pump (AI), walk the line, find the exact joints where pressure drops, and measure the loss.

**Concrete example:** An account management team reviews their weekly schedule and realizes that drafting personalized renewal emails takes 6 hours per account manager every Friday. The friction isn't the strategic relationship building — it's the data aggregation from three different dashboards required to write the summary.

**Technical definition:** Value Stream Mapping (VSM) for Automation — an analytical process that documents, quantifies, and analyzes the flow of information and materials within a business process to identify non-value-added activities, bottlenecks, and prime candidates for cognitive automation.

**The artifact:** Friction Heatmap — Red Light clusters ranked by annualized time cost × automation feasibility.

**The Green/Red rule:**
- 🟢 Green: High human value, creativity, judgment, relationship-dependent context
- 🔴 Red: Cognitive boilerplate, data shifting, manual synthesis, copy/paste, templated writing
- The test for edge cases: "Would a skilled human doing this produce a meaningfully better outcome than a well-prompted AI?"

**Key facilitation notes:**
- Participants instinctively compress steps. Push them to expand. "I do the reporting" is not a step.
- Some participants will Green-Light everything because they don't want to admit their work is automatable. That's ego, not analysis. Push back gently: "This step — would a model do it worse than you?"
- The annualized time cost calculation is the most persuasive number in the room. Do the math out loud.
- Friction Audits work best when done with the person who actually does the work, not their manager.

**When to use this exercise first:**
- Operations-heavy audience who already suspects AI could help but can't articulate where
- Team wants to build a business case for AI investment
- ROI is required before any initiative can proceed

---

## Section 3: Guardrail & Trade-Off Matrix

**The analogy:** A detective doesn't just look for clues — they balance the speed of closing a case against the risk of compromising evidence in court. Move too fast without a warrant and the case falls apart. Every acceleration has an equal and opposite risk that must be managed.

**Concrete example:** A legal team wants to use an autonomous agent to review vendor contracts instantly. Speed is achieved, but the trade-off is the risk of hallucinatory compliance gaps. They implement a deterministic validation layer (regex/keyword parsing) alongside the probabilistic LLM to balance speed with absolute data integrity.

**Technical definition:** Deterministic vs. Probabilistic Risk Alignment — the strategic balancing act between the efficiency gains of generative, non-deterministic AI models and the strict accuracy requirements of business guardrails, managed via alignment protocols, hybrid architectures, or HITL overrides.

**The artifact:** HITL Architecture Safeguards — risk-mitigated roadmap with classification of each system (probabilistic vs deterministic), HITL checkpoints, and named owners.

**Risk classifications:**
1. **Probabilistic only** — AI decides with no human gate. High speed, high risk. Requires explicit escalation approval.
2. **Probabilistic + deterministic** — AI output validated by a rule-based check before action. Good for structured data.
3. **HITL on exception** — AI handles standard cases; human reviews edge cases triggered by confidence threshold or anomaly detection.
4. **HITL on all outputs** — AI drafts; human approves every output. Slowest but safest.

**Key facilitation notes:**
- "Human review" as a HITL checkpoint is not acceptable. A trigger condition ("confidence score below 0.85") and a named person are both required.
- The blast radius question ("what breaks if this gets it wrong?") is the most useful question in the room. Quantify it.
- Legal and security participants tend to classify everything as "HITL on all outputs." Push back: "What would need to be true for you to trust 'HITL on exception'?"
- The deterministic mitigation layer is often the unlock — it lets probabilistic AI operate in domains with strict requirements.

**When to use this exercise first:**
- Initiative is already proposed and funded; governance is the blocker
- Security or legal is in the room and has veto power
- Previous AI deployments in the org went badly (builds trust through rigor)

---

## Exercise Comparison

| Exercise | Primary Focus | Ideal Audience | Output |
|---|---|---|---|
| Reverse Menu Mapping | Strategic alignment, KPI definition | Cross-functional leaders, PMs | AI Project Backlog |
| AI Friction Audit | Process optimization, bottleneck discovery | Operations, Business Analysts | Friction Heatmap |
| Guardrail & Trade-Off Matrix | Risk mitigation, governance | Security, Legal, Platform Eng | HITL Safeguards |

**Recommendation for mixed audiences:** Start with Reverse Menu Mapping. It forces a shared language rooted in business reality rather than technical hype — engineers don't build elegant solutions for problems that don't matter, and business leaders don't demand capabilities that technology can't deliver.

**If the focus is operational efficiency:** Start with the Friction Audit. It grounds the conversation in tangible day-to-day pain points that participants can immediately identify and quantify.
