# Build ROI Model Workflow

## Purpose
Step-by-step process for building a defensible ROI calculator for AI implementations.

---

## Step 1: Document Current State Costs

**Identify the process being automated or augmented. For each step, capture:**

| Metric | How to Measure | Example |
|--------|---------------|---------|
| Labor hours/month | Headcount × hours × % time on this task | 5 FTEs × 160h × 40% = 320h/month |
| Fully loaded cost/hour | Salary + benefits + overhead ÷ annual hours | $85K + 30% overhead ÷ 2080 = $53/hour |
| Error rate | Errors per 1000 transactions | 45 per 1000 (4.5%) |
| Cost per error | Rework hours × loaded rate + downstream impact | 2h × $53 + $200 downstream = $306 |
| Cycle time | End-to-end processing time per unit | 45 minutes per claim |
| Volume | Units processed per month | 2,000 claims/month |
| Tool costs | Current software licensing for this workflow | $2,500/month |

**Total current state monthly cost = labor + errors + tools + opportunity cost**

---

## Step 2: Model Future State (With AI)

**For the same process with AI implementation:**

| Metric | Estimate | Basis |
|--------|----------|-------|
| Labor hours reduced | % of task AI handles end-to-end | 60-80% for document processing |
| Remaining human hours | Review, exceptions, oversight | 20-40% of current labor |
| New error rate | AI accuracy × human review accuracy | Typically 1-2% for well-tuned systems |
| New cycle time | AI processing + human review | 5-10 minutes for document processing |
| AI tool costs | API calls + infrastructure + licensing | Use sizing from infrastructure reference |
| New volume capacity | Same team handles more | 2-5x without additional headcount |

**Total future state monthly cost = reduced labor + AI costs + remaining tools**

---

## Step 3: Calculate Implementation Costs

| Cost Category | One-Time | Recurring Monthly |
|--------------|----------|-------------------|
| Integration development | $20K-100K | — |
| Model fine-tuning (if needed) | $5K-50K | — |
| Infrastructure setup | $2K-10K | — |
| Training and change management | $5K-20K | — |
| AI API costs | — | $500-5000 |
| Infrastructure hosting | — | $200-2000 |
| Maintenance and monitoring | — | $500-2000 |
| Vendor licensing | — | $0-5000 |

**Total implementation = one-time costs + (monthly recurring × project lifetime)**

---

## Step 4: Calculate Payback and ROI

**Monthly net savings:**
```
Monthly savings = Current state cost - Future state cost
```

**Payback period:**
```
Payback months = Total one-time costs / Monthly net savings
```

**3-Year ROI:**
```
Total 3-year savings = Monthly savings × 36
Total 3-year costs = One-time costs + (Monthly recurring × 36)
3-Year ROI = (Total savings - Total costs) / Total costs × 100
```

**NPV (Net Present Value) at 10% discount rate:**
```
Year 1 NPV = (Annual savings - Annual costs) / 1.10
Year 2 NPV = (Annual savings - Annual costs) / 1.21
Year 3 NPV = (Annual savings - Annual costs) / 1.33
Total NPV = Year 1 + Year 2 + Year 3 - Initial investment
```

---

## Step 5: Sensitivity Analysis

**Run the model at 3 scenarios:**

| Scenario | Assumptions | How to Model |
|----------|-------------|-------------|
| Conservative | 50% of expected savings, 120% of expected costs | Floor case — still profitable? |
| Expected | Best estimate based on benchmarks and client data | Primary presentation number |
| Optimistic | Full savings realized, costs on budget | Upside potential |

**Key variables to stress-test:**
- AI accuracy rate (what if 70% instead of 90%?)
- Adoption speed (what if 6 months instead of 3?)
- Volume growth (what if flat instead of 2x?)
- API cost changes (what if pricing increases 30%?)

---

## Step 6: Add Non-Financial Benefits

Not everything reduces to dollars. Include qualitative benefits:

- Employee satisfaction (less repetitive work)
- Scalability (handle growth without proportional headcount)
- Speed (faster turnaround improves customer satisfaction)
- Quality consistency (AI doesn't have bad days)
- Data insights (AI processing generates analytics data)
- Competitive advantage (faster to market, better service)

---

## Step 7: Package for Presentation

Use `assets/roi-model-template.md` as the output format. Ensure:

- Executive summary leads with payback period and 3-year ROI
- Assumptions section is prominent and honest
- Sensitivity table shows the range, not just best case
- Implementation timeline aligns with architecture phases
- Next steps are clear (what decision is being asked for)
