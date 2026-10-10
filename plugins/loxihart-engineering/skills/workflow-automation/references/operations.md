# Operations Reference

## Table of Contents
- Error Handling and Retry Logic
- Monitoring and Alerting
- Security and Secrets Management

---

## Error Handling and Retry Logic

### Retry with Exponential Backoff (Python)
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def call_api():
    response = requests.get(API_URL)
    response.raise_for_status()
    return response.json()
```

### Retry (Node.js)
```javascript
async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Rollback on Partial Failure
```python
record_id = None
try:
    record_id = create_airtable_record(data)
    send_email(data['email'])
    update_crm(data)
except Exception as e:
    if record_id:
        delete_airtable_record(record_id)  # Rollback
    raise
```

### Dead Letter Queue
Log failed items for manual review instead of losing them:
```python
def process_with_dlq(items):
    for item in items:
        try:
            process_item(item)
        except Exception as e:
            log_to_failed_items(item, str(e))
            logger.warning(f"Item {item['id']} sent to DLQ: {e}")
```

---

## Monitoring and Alerting

### Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
```

### Metrics to Track

| Metric | Why | Alert Threshold |
|--------|-----|-----------------|
| Execution time | Identify bottlenecks | > 2x normal duration |
| Success/failure rate | Reliability | < 95% success |
| API rate limit usage | Avoid throttling | > 80% of limit |
| Cost per execution | Budget control | > 2x expected cost |

### Alerting Strategy
- **Immediate (Slack/email):** Any workflow failure
- **Batched (daily summary):** Success rates, execution counts, cost
- **Weekly report:** Trends, anomalies, optimization opportunities
- **PagerDuty:** Critical revenue-impacting workflows only

### Error Notification Template
```python
def notify_error(workflow_name, error, context=None):
    message = f"""
    :x: *Workflow Failed: {workflow_name}*
    *Error:* {str(error)}
    *Time:* {datetime.now().isoformat()}
    *Context:* {json.dumps(context) if context else 'None'}
    """
    send_slack_message('#ops-alerts', message)
```

---

## Security and Secrets Management

### Environment Variables (Minimum Standard)
```bash
# .env file (never committed to git)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
AIRTABLE_API_KEY=<AIRTABLE_API_KEY>
AIRTABLE_BASE_ID=<AIRTABLE_BASE_ID>
```

```python
# Python
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('AIRTABLE_API_KEY')
```

```javascript
// Node.js
require('dotenv').config();
const apiKey = process.env.AIRTABLE_API_KEY;
```

### Production Secret Managers
- **AWS Secrets Manager** — best for AWS-hosted workflows
- **HashiCorp Vault** — self-hosted, enterprise-grade
- **1Password CLI** — team-friendly, easy setup
- **GitHub/Vercel Secrets** — built-in for CI/CD and serverless

### API Key Hygiene
- Rotate keys every 90 days
- Use read-only keys where possible
- Scope OAuth permissions to minimum required
- Separate keys per environment (dev, staging, prod)
- Test new key before deactivating old one
- Audit key usage logs monthly

### .gitignore (Required)
```
.env
.env.local
.env.production
*.pem
*.key
credentials.json
secrets/
```
