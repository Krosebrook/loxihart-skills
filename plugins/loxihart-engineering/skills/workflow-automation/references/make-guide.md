# Make (Integromat) Guide

## When to Use Make
- Need a visual workflow builder with advanced branching
- Complex multi-path logic (routers, iterators, aggregators)
- Data transformation at scale
- Budget: $9–$299/month based on operations

---

## Terminology

- **Scenario:** An automated workflow
- **Module:** An individual app action (trigger, action, or transform)
- **Router:** Branching logic — splits flow into multiple paths with conditions
- **Iterator:** Processes array items one at a time
- **Aggregator:** Combines multiple items into a single output
- **Operation:** One module execution (billing unit)

---

## Example: Airtable → Router → Slack / Google Sheets

```
Trigger: Airtable - Watch Records
  Base: Sales CRM
  Table: Leads
  Filter: Status = "Qualified"

Router:
  Route 1 (Condition: Amount > $10,000)
    → Slack - Send Message (#sales-vip)
      Message: "High-value lead: {{Name}} - ${{Amount}}"

  Route 2 (Condition: Amount <= $10,000)
    → Google Sheets - Add Row
      Spreadsheet: Leads Pipeline
      Row: {{Name}}, {{Email}}, {{Amount}}, {{Created}}
```

---

## Advanced Features

### Iterators (Process Arrays)
When an API returns an array of items, the Iterator processes each one individually:
```
Webhook (receives array) → Iterator → Process each item → Send notification per item
```

### Aggregators (Combine Items)
Opposite of Iterator — collects multiple items into a single output:
```
Google Sheets (get 50 rows) → Aggregator → Send one email containing all 50 rows
```

### Error Handlers
Attach error handlers to any module for graceful failure:
```
HTTP Request → [on error] → Slack notification + Rollback database write
```

Options: Ignore, Resume (with fallback value), Commit, Rollback, Break

---

## Best Practices

- **Routers for conditional logic** — cleaner than nested filters
- **Iterators + Aggregators** — pair them for batch processing patterns
- **Error handlers on every critical module** — not just the workflow level
- **Commit/Rollback** for database operations — prevent partial writes
- **Test with sample data** — Make's built-in "Run once" button processes one real trigger
- **Use data stores** — Make's built-in key-value store for cross-scenario state
- **Schedule strategically** — batch processing during off-peak hours saves operations
