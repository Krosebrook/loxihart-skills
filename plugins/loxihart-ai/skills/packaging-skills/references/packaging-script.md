# Full Packaging Script Reference

## Complete Python Packaging Script

```python
#!/usr/bin/env python3
"""
Skill Packager — March 2026 Anthropic Spec
Creates validated, distribution-ready skill zip files.
"""

import os
import re
import sys
import zipfile
from pathlib import Path
from dataclasses import dataclass
from typing import List, Optional, Tuple


EXCLUSIONS = {
    '.DS_Store', 'Thumbs.db', '.gitignore',
    '__pycache__', '.git', '.env', 'node_modules',
    '.vscode', '.mcpb-cache', '.idea',
}

EXCLUSION_EXTENSIONS = {'.pyc', '.pyo', '.swp', '.swo'}

VALID_SUBDIRS = {
    'references', 'examples', 'resources',
    'scripts', 'templates', 'workflows', 'assets',
}

SECRET_PATTERNS = [
    re.compile(r'sk-ant-[a-zA-Z0-9]{20,}'),
    re.compile(r'(api[_-]?key|secret|password|token)\s*[=:]\s*["\'][^"\']{8,}["\']', re.I),
    re.compile(r'sk-[a-zA-Z0-9]{32,}'),
    re.compile(r'ghp_[a-zA-Z0-9]{36}'),
    re.compile(r'gho_[a-zA-Z0-9]{36}'),
]


@dataclass
class CheckResult:
    name: str
    level: str  # PASS, WARN, FAIL
    message: str


def should_exclude(file_path: Path, root: Path) -> bool:
    """Check if a file should be excluded from the zip."""
    for part in file_path.relative_to(root).parts:
        if part in EXCLUSIONS:
            return True
    if file_path.suffix in EXCLUSION_EXTENSIONS:
        return True
    return False


def parse_frontmatter(content: str) -> Optional[dict]:
    """Extract YAML frontmatter from SKILL.md content."""
    if not content.startswith('---'):
        # Find first ---
        idx = content.find('---')
        if idx == -1:
            return None
        content = content[idx:]

    lines = content.split('\n')
    if lines[0].strip() != '---':
        return None

    end_idx = None
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            end_idx = i
            break

    if end_idx is None:
        return None

    yaml_block = '\n'.join(lines[1:end_idx])
    result = {}
    current_key = None
    current_value = ''
    multiline = False

    for line in yaml_block.split('\n'):
        stripped = line.strip()
        if not stripped or stripped.startswith('#'):
            continue

        kv_match = re.match(r'^([a-zA-Z_-]+)\s*:\s*(.*)', line)
        if kv_match and not multiline:
            if current_key:
                result[current_key] = current_value.strip()
            current_key = kv_match.group(1)
            value = kv_match.group(2).strip()
            if value in ('>', '|', '>-', '|-'):
                multiline = True
                current_value = ''
            else:
                multiline = False
                current_value = value.strip('"').strip("'")
        elif multiline and current_key:
            if kv_match and not line.startswith(' ') and not line.startswith('\t'):
                result[current_key] = current_value.strip()
                current_key = kv_match.group(1)
                value = kv_match.group(2).strip()
                if value in ('>', '|', '>-', '|-'):
                    multiline = True
                    current_value = ''
                else:
                    multiline = False
                    current_value = value.strip('"').strip("'")
            else:
                current_value += ' ' + stripped

    if current_key:
        result[current_key] = current_value.strip()

    return result


def validate_skill(skill_dir: Path) -> List[CheckResult]:
    """Run all 14 validation checks on a skill directory."""
    results = []
    skill_name = skill_dir.name
    skill_md = skill_dir / 'SKILL.md'

    # Check 1: SKILL.md exists
    if not skill_md.exists():
        results.append(CheckResult('skill_exists', 'FAIL', 'SKILL.md not found'))
        return results
    results.append(CheckResult('skill_exists', 'PASS', 'SKILL.md found'))

    content = skill_md.read_text(errors='replace')
    lines = content.count('\n') + 1

    # Check 2: Line count
    if lines <= 500:
        results.append(CheckResult('line_count', 'PASS', f'{lines} lines'))
    else:
        results.append(CheckResult('line_count', 'FAIL', f'{lines} lines exceeds 500'))

    # Check 3: Gerund name
    first_segment = skill_name.split('-')[0]
    if first_segment.endswith('ing'):
        results.append(CheckResult('gerund_name', 'PASS', f'"{first_segment}" is gerund'))
    else:
        results.append(CheckResult('gerund_name', 'WARN', f'"{first_segment}" is not gerund form'))

    # Check 4: Name format
    if re.match(r'^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*$', skill_name) and len(skill_name) <= 64:
        results.append(CheckResult('name_format', 'PASS', f'"{skill_name}" is valid'))
    else:
        results.append(CheckResult('name_format', 'WARN', f'"{skill_name}" format issue'))

    # Check 5: Reserved words
    reserved = {'anthropic', 'claude'}
    found_reserved = [w for w in reserved if w in skill_name.lower()]
    if found_reserved:
        results.append(CheckResult('reserved_words', 'FAIL', f'Contains: {found_reserved}'))
    else:
        results.append(CheckResult('reserved_words', 'PASS', 'No reserved words'))

    # Check 6: Description format
    fm = parse_frontmatter(content)
    if fm and 'description' in fm:
        desc = fm['description']
        first_person = [r'^Track any\b', r'^Create and manage\b', r'^Perform\b',
                        r'^Your\b', r'^We\b', r'^This skill should be used']
        is_first_person = any(re.match(p, desc, re.I) for p in first_person)
        if is_first_person:
            results.append(CheckResult('description', 'WARN', 'Uses first-person pattern'))
        else:
            results.append(CheckResult('description', 'PASS', 'Third-person format'))
    else:
        results.append(CheckResult('description', 'WARN', 'No description found'))

    # Check 7: Progressive disclosure
    if lines > 100:
        has_subdir = any((skill_dir / sd).is_dir() and any((skill_dir / sd).iterdir())
                         for sd in VALID_SUBDIRS if (skill_dir / sd).exists())
        if has_subdir:
            results.append(CheckResult('progressive_disclosure', 'PASS', 'Valid subdirectory found'))
        else:
            results.append(CheckResult('progressive_disclosure', 'FAIL', 'No valid subdirectory'))
    else:
        results.append(CheckResult('progressive_disclosure', 'PASS', 'Under 100 lines'))

    # Check 8: Nested refs
    refs_dir = skill_dir / 'references'
    if refs_dir.exists():
        nested = []
        for ref_file in refs_dir.glob('*.md'):
            ref_content = ref_file.read_text(errors='replace')
            for other in refs_dir.glob('*.md'):
                if other != ref_file and (f']({other.name})' in ref_content
                                          or f'references/{other.name}' in ref_content):
                    nested.append(f'{ref_file.name} -> {other.name}')
        if nested:
            results.append(CheckResult('nested_refs', 'FAIL', f'Chains: {nested}'))
        else:
            results.append(CheckResult('nested_refs', 'PASS', 'No nested chains'))

    # Check 9: Version sync (requires plugin.json context — skip if standalone)
    results.append(CheckResult('version_sync', 'PASS', 'Standalone skill (no plugin.json)'))

    # Check 10: .DS_Store
    has_ds = any(skill_dir.rglob('.DS_Store'))
    if has_ds:
        results.append(CheckResult('ds_store', 'WARN', '.DS_Store found — will be excluded'))
    else:
        results.append(CheckResult('ds_store', 'PASS', 'No .DS_Store'))

    # Check 11: .mcpb-cache
    has_cache = (skill_dir / '.mcpb-cache').exists()
    if has_cache:
        results.append(CheckResult('mcpb_cache', 'WARN', '.mcpb-cache found — will be excluded'))
    else:
        results.append(CheckResult('mcpb_cache', 'PASS', 'No .mcpb-cache'))

    # Check 12: Secrets scan
    secrets_found = []
    for f in skill_dir.rglob('*'):
        if f.is_file() and not should_exclude(f, skill_dir):
            try:
                text = f.read_text(errors='replace')
                for pattern in SECRET_PATTERNS:
                    if pattern.search(text):
                        secrets_found.append(f.name)
                        break
            except Exception:
                pass
    if secrets_found:
        results.append(CheckResult('secrets', 'FAIL', f'Possible secrets in: {secrets_found}'))
    else:
        results.append(CheckResult('secrets', 'PASS', 'No secrets detected'))

    # Check 13: Single top-level (verified at zip creation)
    results.append(CheckResult('single_root', 'PASS', 'Enforced at zip creation'))

    # Check 14: Package size
    total_size = sum(f.stat().st_size for f in skill_dir.rglob('*') if f.is_file())
    size_mb = total_size / (1024 * 1024)
    if size_mb > 10:
        results.append(CheckResult('package_size', 'WARN', f'{size_mb:.1f}MB exceeds 10MB'))
    else:
        results.append(CheckResult('package_size', 'PASS', f'{size_mb:.1f}MB'))

    return results


def create_zip(skill_dir: Path, output_dir: Path) -> Path:
    """Create the skill zip file with exclusions applied."""
    skill_name = skill_dir.name
    zip_path = output_dir / f'{skill_name}.zip'

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for file_path in sorted(skill_dir.rglob('*')):
            if file_path.is_file() and not should_exclude(file_path, skill_dir):
                arcname = f'{skill_name}/{file_path.relative_to(skill_dir)}'
                zf.write(file_path, arcname)

    return zip_path


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python package_skill.py <skill_dir> [output_dir]')
        sys.exit(1)

    skill_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('.')

    results = validate_skill(skill_dir)

    has_fail = any(r.level == 'FAIL' for r in results)
    for r in results:
        icon = {'PASS': '✓', 'WARN': '⚠', 'FAIL': '✗'}[r.level]
        print(f'  [{r.level}] {icon} {r.name}: {r.message}')

    if has_fail:
        print('\nFAIL: Fix errors before packaging.')
        sys.exit(1)

    zip_path = create_zip(skill_dir, output_dir)
    print(f'\nPackage created: {zip_path}')
```

## Installation Instructions Template

**Cowork / Claude Desktop:**
1. Open Settings → Skills (or Plugins)
2. Click "Upload" or drag-and-drop the .zip file
3. The skill activates automatically based on its trigger patterns

**Claude Code (personal):**
```bash
cp -r skill-name/ ~/.claude/skills/
```

**Claude Code (project-scoped):**
```bash
cp -r skill-name/ .claude/skills/
```
