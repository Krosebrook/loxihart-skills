# Build Workflow

## Purpose
Step-by-step process for creating a new automation workflow, regardless of platform (n8n, Zapier, Make, or custom scripts).

---

## Step 1: Define the Automation

Before choosing a platform or writing code, answer these questions:

**Trigger:** What event starts this workflow?
- New email arrives
- Form submitted
- Webhook received
- Scheduled (daily/hourly/weekly)
- Record created in database
- File uploaded

**Actions:** What should happen in response?
- Transform/parse data
- Create/update records in a database or CRM
- Send notifications (Slack, email, SMS)
- Generate a document or report
- Call an external API
- Update a dashboard or spreadsheet

**Error handling:** What happens when something fails?
- Retry with backoff
- Notify on Slack/email
- Log to dead letter queue
- Rollback partial changes

**Document this as a workflow spec before building:**
```
Workflow: [Name]
Trigger: [Event]
Steps:
  1. [Action] → [Output]
  2. [Action] → [Output]
  3. [Action] → [Output]
Error handling: [Strategy]
Schedule: [Frequency] or [Event-driven]
```

---

## Step 2: Choose Platform

Read the platform comparison in SKILL.md. Quick decision:

- Need self-hosted/privacy? → n8n (`references/n8n-guide.md`)
- Non-technical users? → Zapier (`references/zapier-guide.md`)
- Complex branching? → Make (`references/make-guide.md`)
- Full code control? → Custom script (`references/custom-scripts.md`)

---

## Step 3: Build

### If n8n:
1. Start with `assets/n8n-starter.json` — import as a new workflow
2. Replace the trigger node with your actual trigger
3. Add processing nodes (Code, HTTP Request, app integrations)
4. Add error handling (Error Trigger node)
5. Test with manual execution
6. Activate

### If Zapier:
1. Create new Zap → select trigger app and event
2. Add Formatter steps for data transformation
3. Add Filter steps to prevent unnecessary actions
4. Add action steps (one per downstream system)
5. Test each step individually
6. Publish

### If Make:
1. Create new Scenario → add trigger module
2. Add Router if branching logic is needed
3. Add Iterator if processing arrays
4. Add error handlers on critical modules
5. Run once with test data
6. Activate with scheduling

### If Custom Script:
1. Start from `assets/automation-template.py`
2. Replace placeholder functions with actual API calls
3. Add retry logic (`tenacity` library)
4. Add logging and error notifications
5. Test locally with sample data: `python scripts/workflow-tester.py workflow.py`
6. Deploy to cron, GitHub Actions, or serverless

---

## Step 4: Add Error Handling

Read `references/operations.md` for complete patterns. At minimum:

- [ ] Retry with exponential backoff (3 attempts)
- [ ] Error notification to Slack or email
- [ ] Rollback for database writes
- [ ] Dead letter queue for failed items
- [ ] Logging at info and error levels

---

## Step 5: Test

```bash
# For custom scripts — run the workflow tester
python scripts/workflow-tester.py my_workflow.py --sample-data test_data.json

# Or test manually
python my_workflow.py
```

**Test matrix:**
- [ ] Happy path with valid data
- [ ] Invalid/missing data (empty fields, wrong types)
- [ ] API rate limit hit (simulate with delay)
- [ ] Network failure (disconnect and verify retry)
- [ ] Partial failure (first action succeeds, second fails — verify rollback)

---

## Step 6: Deploy and Monitor

**Secrets:** Move all credentials to environment variables. Read `references/operations.md` for secret management.

**Scheduling:**
- n8n: Built-in cron trigger
- Zapier: Built-in schedule trigger
- Make: Built-in scheduling on scenario
- Custom: cron, GitHub Actions, or serverless (see `references/custom-scripts.md`)

**Monitoring:** After deployment, verify:
- [ ] First execution succeeds
- [ ] Error notifications fire on simulated failure
- [ ] Logs capture execution time and success/failure
- [ ] Cost is within budget (check task/operation counts)
