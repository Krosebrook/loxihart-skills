#!/usr/bin/env python3
"""
automation-template.py — Starter template for custom automation workflows

Copy this file and replace the placeholder functions with your actual logic.

Usage:
  python automation.py
  python scripts/workflow-tester.py automation.py --dry-run

Environment variables required:
  SLACK_WEBHOOK_URL    — Slack incoming webhook for notifications
  API_KEY              — API key for your data source
  API_BASE_URL         — Base URL for your data source API

Optional:
  WORKFLOW_DRY_RUN     — Set to 'true' to skip API calls (for testing)
"""

import os
import json
import logging
import requests
from datetime import datetime, timedelta

# --- Configuration ---
SLACK_WEBHOOK = os.getenv('SLACK_WEBHOOK_URL')
API_KEY = os.getenv('API_KEY')
API_BASE_URL = os.getenv('API_BASE_URL', 'https://api.example.com')
DRY_RUN = os.getenv('WORKFLOW_DRY_RUN', 'false').lower() == 'true'

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automation.log'),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger('automation')


# --- Retry decorator (install: pip install tenacity) ---
try:
    from tenacity import retry, stop_after_attempt, wait_exponential

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    def api_request(method, url, **kwargs):
        """Make an API request with automatic retry on failure."""
        if DRY_RUN:
            logger.info(f"[DRY RUN] {method.upper()} {url}")
            return {"dry_run": True}
        response = requests.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()

except ImportError:
    def api_request(method, url, **kwargs):
        """Make an API request (no retry — install tenacity for retry support)."""
        if DRY_RUN:
            logger.info(f"[DRY RUN] {method.upper()} {url}")
            return {"dry_run": True}
        response = requests.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()


# --- Step 1: Fetch data ---
def fetch_data():
    """Replace with your actual data fetch logic."""
    logger.info("Fetching data...")
    headers = {"Authorization": f"Bearer {API_KEY}"}
    data = api_request("get", f"{API_BASE_URL}/records", headers=headers)
    logger.info(f"Fetched {len(data.get('records', []))} records")
    return data.get('records', [])


# --- Step 2: Transform data ---
def transform(records):
    """Replace with your actual transformation logic."""
    logger.info("Transforming data...")
    results = []
    for record in records:
        results.append({
            "id": record.get("id"),
            "name": record.get("fields", {}).get("Name", "Unknown"),
            "processed_at": datetime.now().isoformat(),
        })
    logger.info(f"Transformed {len(results)} records")
    return results


# --- Step 3: Send results ---
def send_results(results):
    """Replace with your actual output logic (database, API, email, etc.)."""
    logger.info(f"Sending {len(results)} results...")
    for result in results:
        logger.info(f"  Processed: {result['name']}")
    logger.info("Results sent")


# --- Step 4: Notify ---
def notify_slack(message):
    """Send notification to Slack channel."""
    if not SLACK_WEBHOOK:
        logger.warning("SLACK_WEBHOOK_URL not set — skipping notification")
        return
    if DRY_RUN:
        logger.info(f"[DRY RUN] Slack: {message}")
        return
    requests.post(SLACK_WEBHOOK, json={"text": message})


# --- Main workflow ---
def main():
    """Entry point — orchestrates the full workflow."""
    logger.info("Starting workflow")
    start_time = datetime.now()

    try:
        records = fetch_data()
        if not records:
            logger.info("No records to process")
            return

        results = transform(records)
        send_results(results)
        notify_slack(f"Workflow complete: {len(results)} records processed")

        elapsed = (datetime.now() - start_time).total_seconds()
        logger.info(f"Workflow completed in {elapsed:.1f}s")

    except Exception as e:
        logger.error(f"Workflow failed: {e}", exc_info=True)
        notify_slack(f"Workflow FAILED: {e}")
        raise


if __name__ == '__main__':
    main()
