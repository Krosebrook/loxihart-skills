# Zapier Guide

## When to Use Zapier
- Non-technical users need to build workflows
- 6,000+ app integrations (largest ecosystem)
- Simple trigger → action flows
- Budget: $20–$100/month based on task volume

---

## Terminology

- **Zap:** An automated workflow
- **Trigger:** The event that starts a Zap (e.g., new email arrives)
- **Action:** What happens in response (e.g., create Slack message)
- **Task:** One action execution (this is the billing unit)
- **Filter:** Conditional gate — only continue if criteria met
- **Path:** Branching logic (if/else)
- **Formatter:** Data transformation step (text, numbers, dates)

---

## Example: Gmail → Notion → Slack

```
Trigger: Gmail - New Email Matching Search
  Search: from:client@company.com subject:"Invoice"

Action 1: Formatter - Text (Extract Number)
  Input: {{Trigger - Subject}}
  Pattern: \$([0-9,]+\.[0-9]{2})

Action 2: Notion - Create Database Item
  Database: Invoices
  Properties:
    Client: {{Trigger - From Name}}
    Amount: {{Formatter - Output}}
    Date: {{Trigger - Date}}
    Link: {{Trigger - Link to Email}}

Action 3: Slack - Send Channel Message
  Channel: #finance
  Message: New invoice from {{Trigger - From Name}}: ${{Formatter - Output}}
```

---

## Best Practices

- **Filters save money** — add early in the Zap to prevent unnecessary downstream tasks
- **Formatter is powerful** — use it for text extraction, date formatting, number parsing, and lookups
- **Paths for branching** — if/else logic without separate Zaps
- **Delay steps** — insert delays to respect API rate limits on downstream services
- **Error notifications** — configure Zapier's built-in error alerts to email or Slack
- **Test each step** — use Zapier's test button on every action before publishing
- **Sub-Zaps** — break complex flows into modular sub-Zaps for reusability

## Limitations

- Maximum 100 steps per Zap (use sub-Zaps for longer chains)
- 15-minute polling interval on free/Starter plans (2-minute on Professional+)
- Cloud only — no self-hosting option
- Limited code support (Code by Zapier exists but is basic)
- Task-based billing can get expensive at volume
