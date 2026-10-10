#!/usr/bin/env python3
"""Claude Skill Packager — March 2026 Spec (15-check suite)

Usage:
    python package_skill.py /path/to/skill-directory
    python package_skill.py /path/to/skill-directory --output /path/to/output
    python package_skill.py /path/to/skill-directory --no-validation
"""

import argparse, re, sys, zipfile
from pathlib import Path
from typing import Dict, List, Tuple

try:
    import yaml
except ImportError:
    yaml = None

EXCLUSIONS = {'.DS_Store','Thumbs.db','.gitignore','__pycache__','.git',
              '.env','node_modules','.vscode','.mcpb-cache','.idea'}
EXCLUSION_EXTS = {'.pyc','.pyo','.swp','.swo'}
VALID_SUBDIRS   = {'references','examples','resources','scripts',
                   'templates','workflows','assets'}
SECRET_PATS = [
    re.compile(r'sk-ant-[a-zA-Z0-9]{20,}'),
    re.compile(r'(api[_-]?key|secret|password|token)\s*[=:]\s*["\'][^"\']{8,}["\']', re.I),
    re.compile(r'sk-[a-zA-Z0-9]{32,}'),
    re.compile(r'ghp_[a-zA-Z0-9]{36}'),
]
_PATH_REF_PAT = re.compile(
    r'(?:references|templates|workflows|scripts|examples|resources|assets)/'
    r'[^\s`|()\[\]>\n]+\.(?:md|py|sh|yaml|json|txt|html)', re.I)
_TEACHING = re.compile(
    r'\blinks\s+to\b|\bfor\s+example\b|\be\.g\.\b|\bsuch\s+as\b', re.I)


class SkillPackager:
    def __init__(self, skill_path, output_dir=None, skip_validation=False):
        self.skill_path = Path(skill_path).resolve()
        self.skill_name = self.skill_path.name
        self.output_dir = Path(output_dir) if output_dir else Path.cwd() / "output"
        self.skip_validation = skip_validation
        self.checks: List[Tuple[str, str, str]] = []

    def _rec(self, name, level, msg):
        self.checks.append((name, level, msg))

    def _has_fail(self):
        return any(l == "FAIL" for _, l, _ in self.checks)

    def _read(self):
        return (self.skill_path / "SKILL.md").read_text(encoding="utf-8")

    def _exclude(self, fp: Path) -> bool:
        for part in fp.relative_to(self.skill_path).parts:
            if part in EXCLUSIONS:
                return True
        return fp.suffix in EXCLUSION_EXTS

    def extract_frontmatter(self) -> Dict:
        content = self._read()
        m = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
        if not m:
            self._rec("frontmatter", "FAIL", "No YAML frontmatter")
            return {}
        if yaml is None:
            return {"name": self.skill_name}
        try:
            return yaml.safe_load(m.group(1)) or {}
        except Exception as e:
            self._rec("frontmatter", "FAIL", f"Invalid YAML: {e}")
            return {}

    # ── 15 checks ────────────────────────────────────────────────────────────

    def check_01(self):
        ok = (self.skill_path / "SKILL.md").exists()
        self._rec("skill_exists", "PASS" if ok else "FAIL",
                  "SKILL.md found" if ok else "SKILL.md not found")

    def check_02(self):
        n = len(self._read().splitlines())
        self._rec("line_count", "PASS" if n <= 500 else "FAIL",
                  f"{n} lines" + (" — exceeds 500" if n > 500 else ""))

    def check_03(self):
        seg = self.skill_name.split("-")[0]
        ok = seg.endswith("ing")
        self._rec("gerund_name", "PASS" if ok else "WARN",
                  f'"{seg}" is gerund' if ok else f'"{seg}" not gerund form')

    def check_04(self):
        ok = bool(re.match(r'^[a-z][a-z0-9]*(-[a-z0-9]+)*$', self.skill_name)) \
             and len(self.skill_name) <= 64
        self._rec("name_format", "PASS" if ok else "WARN",
                  "Valid" if ok else f'"{self.skill_name}" — lowercase-hyphens, max 64 chars')

    def check_05(self):
        bad = [w for w in ("anthropic", "claude") if w in self.skill_name.lower()]
        self._rec("reserved_words", "FAIL" if bad else "PASS",
                  f"Contains: {bad}" if bad else "No reserved words")

    def check_06(self, meta: Dict):
        desc = meta.get("description", "")
        if not desc:
            self._rec("description", "WARN", "No description field")
        elif len(desc) > 1024:
            self._rec("description", "FAIL", f"{len(desc)} chars — max 1024")
        else:
            self._rec("description", "PASS", f"{len(desc)} chars")

    def check_07(self):
        n = len(self._read().splitlines())
        if n <= 100:
            self._rec("progressive_disclosure", "PASS", "Under 100 lines")
            return
        has = any(
            (self.skill_path / sd).is_dir() and any((self.skill_path / sd).iterdir())
            for sd in VALID_SUBDIRS if (self.skill_path / sd).exists()
        )
        self._rec("progressive_disclosure", "PASS" if has else "FAIL",
                  "Subdirectory found" if has else f"{n} lines but no populated subdirectory")

    def check_08(self):
        rd = self.skill_path / "references"
        if not rd.exists():
            self._rec("nested_refs", "PASS", "No references/ dir")
            return
        chains = []
        for rf in rd.glob("*.md"):
            rc = rf.read_text(errors="replace")
            for ot in rd.glob("*.md"):
                if ot != rf and (f"]({ot.name})" in rc or f"references/{ot.name}" in rc):
                    chains.append(f"{rf.name}→{ot.name}")
        self._rec("nested_refs", "FAIL" if chains else "PASS",
                  f"Chains: {chains}" if chains else "No nested chains")

    def check_09(self, meta: Dict):
        pj = self.skill_path.parent / "plugin.json"
        if not pj.exists():
            self._rec("version_sync", "PASS", "Standalone skill")
            return
        import json
        try:
            pv = str(json.loads(pj.read_text()).get("version", ""))
            sv = str(meta.get("version", ""))
            self._rec("version_sync", "PASS" if sv == pv else "WARN",
                      f"Match: {sv}" if sv == pv else f"SKILL.md:{sv} vs plugin.json:{pv}")
        except Exception:
            self._rec("version_sync", "WARN", "Could not parse plugin.json")

    def check_10(self):
        found = any(self.skill_path.rglob(".DS_Store"))
        self._rec("ds_store", "WARN" if found else "PASS",
                  ".DS_Store present (excluded from zip)" if found else "None found")

    def check_11(self):
        found = (self.skill_path / ".mcpb-cache").exists()
        self._rec("mcpb_cache", "WARN" if found else "PASS",
                  ".mcpb-cache present (excluded)" if found else "None found")

    def check_12(self):
        hits = []
        for f in self.skill_path.rglob("*"):
            if f.is_file() and not self._exclude(f):
                try:
                    t = f.read_text(errors="replace")
                    if any(p.search(t) for p in SECRET_PATS):
                        hits.append(f.name)
                except Exception:
                    pass
        self._rec("secrets", "FAIL" if hits else "PASS",
                  f"Possible secrets in: {hits}" if hits else "No secrets detected")

    def check_13(self):
        self._rec("single_root", "PASS", "Enforced at zip creation")

    def check_14(self):
        mb = sum(f.stat().st_size for f in self.skill_path.rglob("*")
                 if f.is_file()) / (1024 * 1024)
        self._rec("package_size", "WARN" if mb > 10 else "PASS",
                  f"{mb:.2f}MB" + (" — exceeds 10MB" if mb > 10 else ""))

    def check_15(self):
        """Path reference validation — all SKILL.md subdir refs must exist."""
        content = self._read()
        scannable = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
        refs = set()
        for line in scannable.splitlines():
            for m in _PATH_REF_PAT.finditer(line):
                c = m.group(0).rstrip(".,;)")
                if "*" in c or "{" in c:
                    continue
                if re.match(r'^[A-Z]$', Path(c).stem):
                    continue
                if _TEACHING.search(line):
                    continue
                refs.add(c)
        flat, missing = [], []
        for ref in sorted(refs):
            if not (self.skill_path / ref).exists():
                fname = Path(ref).name
                if (self.skill_path / fname).exists():
                    flat.append(ref)
                else:
                    missing.append(ref)
        if flat:
            self._rec("path_refs", "FAIL",
                      "FLAT_EXISTS: " + "; ".join(f"{r}→{Path(r).name}(flat)" for r in flat))
        elif missing:
            self._rec("path_refs", "FAIL", "MISSING: " + ", ".join(missing))
        else:
            self._rec("path_refs", "PASS",
                      f"{len(refs)} ref(s) verified" if refs else "No subdirectory refs")

    # ── zip ──────────────────────────────────────────────────────────────────

    def create_zip(self) -> Path:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        zp = self.output_dir / f"{self.skill_name}.zip"
        with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in sorted(self.skill_path.rglob("*")):
                if f.is_file() and not self._exclude(f):
                    zf.write(f, f"{self.skill_name}/{f.relative_to(self.skill_path)}")
        return zp

    def verify_zip(self, zp: Path) -> Tuple[bool, str]:
        with zipfile.ZipFile(zp) as zf:
            names = zf.namelist()
            roots = {n.split("/")[0] for n in names if "/" in n}
            if len(roots) != 1:
                return False, f"Expected 1 root folder, got {len(roots)}"
            if list(roots)[0] != self.skill_name:
                return False, f"Root '{list(roots)[0]}' != skill name '{self.skill_name}'"
            if f"{self.skill_name}/SKILL.md" not in names:
                return False, "SKILL.md missing from zip"
        return True, "Package structure valid"

    # ── report ───────────────────────────────────────────────────────────────

    def print_report(self, zp: Path, meta: Dict):
        icons = {"PASS": "✓", "WARN": "⚠", "FAIL": "✗"}
        print(f"\n{'='*62}")
        print(f"  PACKAGING REPORT: {self.skill_name}  v{meta.get('version', 'unset')}")
        print(f"  {'='*58}")
        for i, (name, level, msg) in enumerate(self.checks, 1):
            print(f"  [{i:02d}] {level:<4} {icons[level]}  {name}: {msg}")
        fails  = sum(1 for _, l, _ in self.checks if l == "FAIL")
        warns  = sum(1 for _, l, _ in self.checks if l == "WARN")
        passes = 15 - fails - warns
        print(f"\n  Result: {fails} FAIL  {warns} WARN  {passes} PASS")
        if not self._has_fail():
            print(f"\n  Output:  {zp}")
            print(f"  Install: unzip {zp.name} -d ~/.claude/skills/")
        print(f"{'='*62}\n")

    # ── entry ────────────────────────────────────────────────────────────────

    def package(self) -> bool:
        print(f"\n📦 {self.skill_name}")
        if not (self.skill_path / "SKILL.md").exists():
            print(f"❌ SKILL.md not found in {self.skill_path}")
            return False

        meta = self.extract_frontmatter()

        if not self.skip_validation:
            self.check_01(); self.check_02(); self.check_03()
            self.check_04(); self.check_05(); self.check_06(meta)
            self.check_07(); self.check_08(); self.check_09(meta)
            self.check_10(); self.check_11(); self.check_12()
            self.check_13(); self.check_14(); self.check_15()

            if self._has_fail():
                self.print_report(Path(f"{self.skill_name}.zip"), meta)
                print("❌ Fix FAIL items before packaging.\n")
                return False

        zp = self.create_zip()
        ok, msg = self.verify_zip(zp)
        if not ok:
            print(f"❌ {msg}")
            return False

        self.print_report(zp, meta)
        return True


def main():
    p = argparse.ArgumentParser(description="Package Claude skills — 15-check suite")
    p.add_argument("skill_path")
    p.add_argument("--output", "-o", default=None)
    p.add_argument("--no-validation", action="store_true")
    args = p.parse_args()
    packager = SkillPackager(args.skill_path, args.output, args.no_validation)
    sys.exit(0 if packager.package() else 1)


if __name__ == "__main__":
    main()
