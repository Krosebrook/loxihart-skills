#!/usr/bin/env python3
"""
workflow-tester.py — Test automation workflows with sample data

Usage:
  python scripts/workflow-tester.py my_workflow.py
  python scripts/workflow-tester.py my_workflow.py --sample-data test.json
  python scripts/workflow-tester.py my_workflow.py --dry-run

Options:
  --sample-data FILE   Load test data from JSON file
  --dry-run            Print actions without executing API calls
  --timeout SECONDS    Max execution time (default: 60)
  --verbose            Show detailed execution log

Expects the workflow module to expose a main() function.
Captures stdout/stderr, measures execution time, and reports pass/fail.
"""

import sys
import os
import json
import time
import importlib.util
import traceback
from io import StringIO
from pathlib import Path


def load_module(filepath):
    """Dynamically load a Python module from file path."""
    spec = importlib.util.spec_from_file_location("workflow", filepath)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_sample_data(filepath):
    """Load test data from JSON file."""
    with open(filepath) as f:
        return json.load(f)


def run_test(workflow_path, sample_data=None, dry_run=False, timeout=60, verbose=False):
    """Execute workflow and capture results."""
    print(f"Testing: {workflow_path}")
    print(f"Dry run: {dry_run}")
    print(f"Timeout: {timeout}s")
    if sample_data:
        print(f"Sample data: {len(sample_data)} items")
    print("-" * 50)

    # Set dry run flag in environment
    if dry_run:
        os.environ['WORKFLOW_DRY_RUN'] = 'true'

    # Inject sample data if provided
    if sample_data:
        os.environ['WORKFLOW_TEST_DATA'] = json.dumps(sample_data)

    # Capture output
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    captured_out = StringIO()
    captured_err = StringIO()

    start_time = time.time()
    success = False
    error_msg = None

    try:
        if verbose:
            # Don't capture in verbose mode
            module = load_module(workflow_path)
            if hasattr(module, 'main'):
                module.main()
            elif hasattr(module, 'process_new_leads'):
                module.process_new_leads()
            else:
                print("WARNING: No main() or recognized entry function found")
                print("Available functions:", [f for f in dir(module) if not f.startswith('_')])
        else:
            sys.stdout = captured_out
            sys.stderr = captured_err
            module = load_module(workflow_path)
            if hasattr(module, 'main'):
                module.main()
            elif hasattr(module, 'process_new_leads'):
                module.process_new_leads()
        success = True

    except Exception as e:
        error_msg = str(e)
        if verbose:
            traceback.print_exc()
        else:
            captured_err.write(traceback.format_exc())

    finally:
        elapsed = time.time() - start_time
        sys.stdout = old_stdout
        sys.stderr = old_stderr

        # Clean up env
        os.environ.pop('WORKFLOW_DRY_RUN', None)
        os.environ.pop('WORKFLOW_TEST_DATA', None)

    # Report
    print("\n" + "=" * 50)
    print("TEST RESULTS")
    print("=" * 50)
    print(f"Status:   {'PASS' if success else 'FAIL'}")
    print(f"Duration: {elapsed:.2f}s")

    if not verbose and captured_out.getvalue():
        print(f"\nStdout:\n{captured_out.getvalue()}")

    if not verbose and captured_err.getvalue():
        print(f"\nStderr:\n{captured_err.getvalue()}")

    if error_msg:
        print(f"\nError: {error_msg}")

    if elapsed > timeout:
        print(f"\nWARNING: Execution exceeded {timeout}s timeout")

    return success


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    workflow_path = sys.argv[1]
    if not Path(workflow_path).exists():
        print(f"File not found: {workflow_path}")
        sys.exit(1)

    sample_data = None
    dry_run = '--dry-run' in sys.argv
    verbose = '--verbose' in sys.argv
    timeout = 60

    if '--sample-data' in sys.argv:
        idx = sys.argv.index('--sample-data')
        sample_data = load_sample_data(sys.argv[idx + 1])

    if '--timeout' in sys.argv:
        idx = sys.argv.index('--timeout')
        timeout = int(sys.argv[idx + 1])

    success = run_test(workflow_path, sample_data, dry_run, timeout, verbose)
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
