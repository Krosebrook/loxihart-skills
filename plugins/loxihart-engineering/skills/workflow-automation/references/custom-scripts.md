# Custom Scripts Reference

## When to Use Custom Scripts
- Need full control over logic and error handling
- Complex data transformations
- API rate limit management
- Multi-step transactional workflows
- Budget: Free (self-hosted)

---

## Python Template

```python
import os
import requests
import logging
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Credentials from environment
SLACK_WEBHOOK = os.getenv('SLACK_WEBHOOK_URL')
AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE = os.getenv('AIRTABLE_BASE_ID')

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def fetch_airtable_records(table_name, filter_formula=None):
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE}/{table_name}"
    headers = {"Authorization": f"Bearer {AIRTABLE_API_KEY}"}
    params = {"filterByFormula": filter_formula} if filter_formula else {}
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()['records']

def send_slack_message(channel, message):
    payload = {"channel": channel, "text": message, "username": "Automation Bot"}
    response = requests.post(SLACK_WEBHOOK, json=payload)
    response.raise_for_status()

def main():
    logger.info("Starting workflow")
    try:
        leads = fetch_airtable_records(
            "Leads",
            "AND({Status}='Qualified', {Created} > DATEADD(NOW(), -1, 'days'))"
        )
        logger.info(f"Fetched {len(leads)} leads")

        for lead in leads:
            name = lead['fields'].get('Name', 'Unknown')
            email = lead['fields'].get('Email', '')
            amount = lead['fields'].get('Amount', 0)
            send_slack_message('#sales', f"New lead: {name} ({email}) - ${amount:,.2f}")
            logger.info(f"Processed: {name}")

        logger.info(f"Completed: {len(leads)} leads processed")
    except Exception as e:
        logger.error(f"Workflow failed: {e}", exc_info=True)
        send_slack_message('#ops-alerts', f"Automation failed: {e}")
        raise

if __name__ == "__main__":
    main()
```

---

## Node.js Template

```javascript
const axios = require('axios');
require('dotenv').config();

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;

async function fetchRecords(table, filter) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}`;
  const headers = { Authorization: `Bearer ${AIRTABLE_API_KEY}` };
  const params = filter ? { filterByFormula: filter } : {};
  const { data } = await axios.get(url, { headers, params });
  return data.records;
}

async function slackMessage(channel, text) {
  await axios.post(SLACK_WEBHOOK, { channel, text, username: 'Automation Bot' });
}

async function main() {
  try {
    const leads = await fetchRecords('Leads',
      "AND({Status}='Qualified', {Created} > DATEADD(NOW(), -1, 'days'))");
    console.log(`Fetched ${leads.length} leads`);

    for (const lead of leads) {
      const { Name, Email, Amount } = lead.fields;
      await slackMessage('#sales', `New lead: ${Name} (${Email}) - $${Amount?.toLocaleString()}`);
    }
    console.log(`Completed: ${leads.length} leads processed`);
  } catch (error) {
    console.error('Workflow failed:', error.message);
    await slackMessage('#ops-alerts', `Automation failed: ${error.message}`);
    throw error;
  }
}

main();
```

---

## Scheduling

### Cron (Linux)
```bash
# Run every hour
0 * * * * /usr/bin/python3 /path/to/automation.py >> /var/log/automation.log 2>&1

# Run daily at 9am
0 9 * * * /usr/bin/python3 /path/to/report.py

# Run every 5 minutes
*/5 * * * * /usr/bin/node /path/to/sync.js
```

### GitHub Actions (Free Cloud Scheduler)
```yaml
name: Daily Automation
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9am UTC
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r requirements.txt
      - run: python automation.py
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
```

### Other Options
- **Vercel/Netlify Functions** — serverless, triggered by HTTP or cron
- **AWS Lambda + EventBridge** — serverless, pay-per-execution
- **Railway/Render** — managed cron workers
