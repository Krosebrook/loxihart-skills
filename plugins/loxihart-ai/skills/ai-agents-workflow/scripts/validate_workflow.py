#!/usr/bin/env python3
"""Validate security and best practices in workflow code."""

import argparse
import re
import sys
from pathlib import Path

CHECKS = [
    {
        "name": "No hardcoded secrets",
        "pattern": r'(api_key|token|password|secret)\s*=\s*["\'][^"\']+["\']',
        "error": "Found hardcoded secret. Use environment variables instead.",
    },
    {
        "name": "Environment variable usage",
        "pattern": r'os\.getenv|process\.env',
        "required": True,
        "error": "No environment variable usage found. Secrets should be in .env",
    },
    {
        "name": "SQL injection risk",
        "pattern": r'(execute|query)\s*\(\s*f["\']|\.format\(',
        "error": "Potential SQL injection. Use parameterized queries.",
    },
]

def validate_file(filepath: Path) -> list[str]:
    """Validate a single file."""
    errors = []
    content = filepath.read_text()
    
    for check in CHECKS:
        matches = re.findall(check["pattern"], content, re.IGNORECASE)
        
        if check.get("required") and not matches:
            errors.append(f"{filepath}: {check['error']}")
        elif not check.get("required") and matches:
            errors.append(f"{filepath}: {check['error']}")
    
    return errors

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("path", help="Path to validate")
    args = parser.parse_args()
    
    path = Path(args.path)
    errors = []
    
    if path.is_file():
        errors = validate_file(path)
    else:
        for file in path.rglob("*.py"):
            errors.extend(validate_file(file))
        for file in path.rglob("*.ts"):
            errors.extend(validate_file(file))
    
    if errors:
        print("❌ Validation failed:\n")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("✅ Validation passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
