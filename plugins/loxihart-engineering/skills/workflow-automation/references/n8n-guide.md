# n8n Guide

## When to Use n8n
- Self-hosted solution needed (data privacy, compliance)
- Complex logic requiring code nodes (JavaScript/Python)
- 400+ native integrations
- Budget-conscious (free self-hosted, $20/month cloud)

---

## Setup (Docker)

```bash
# Quick start
docker run -d --name n8n -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n n8nio/n8n

# Production Docker Compose
version: '3'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
      - N8N_HOST=n8n.yourdomain.com
      - WEBHOOK_URL=https://n8n.yourdomain.com/
```

---

## Example: Slack → Parse → Airtable → Email

```json
{
  "nodes": [
    {
      "name": "Slack Trigger",
      "type": "n8n-nodes-base.slackTrigger",
      "parameters": {
        "channel": "#feedback",
        "simplifyOutput": true
      }
    },
    {
      "name": "Parse Message",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const message = $input.item.json.text;\nconst email = message.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+/)?.[0];\nconst feedback = message.replace(email, '').trim();\nreturn { email, feedback, timestamp: new Date().toISOString() };"
      }
    },
    {
      "name": "Add to Airtable",
      "type": "n8n-nodes-base.airtable",
      "parameters": {
        "operation": "create",
        "baseId": "<AIRTABLE_BASE_ID>",
        "table": "Feedback",
        "fields": {
          "Email": "={{$json.email}}",
          "Feedback": "={{$json.feedback}}",
          "Timestamp": "={{$json.timestamp}}"
        }
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.gmail",
      "parameters": {
        "operation": "send",
        "to": "team@company.com",
        "subject": "New Feedback Received",
        "message": "Feedback from {{$json.email}}:\n\n{{$json.feedback}}"
      }
    }
  ],
  "connections": {
    "Slack Trigger": { "main": [[{ "node": "Parse Message" }]] },
    "Parse Message": { "main": [[{ "node": "Add to Airtable" }, { "node": "Send Email" }]] }
  }
}
```

---

## Best Practices

- Use Code nodes for complex transformations (JavaScript or Python)
- Enable Error Trigger node for workflow-level error handling
- Set execution limits to avoid infinite loops
- Store credentials via n8n's built-in credential manager (not in code nodes)
- Test with sample data using the manual execution button before activating
- Monitor executions in the n8n execution log
- Use sub-workflows for reusable logic
- Pin test data on nodes during development
