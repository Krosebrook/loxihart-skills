#!/usr/bin/env python3
"""Repo hygiene checks: SKILL.md frontmatter, relative links, hashed denylist.

The denylist is stored as sha256 hashes of lowercase tokens (single words or
word bigrams) so the list itself never discloses what it blocks.
Usage: check_repo.py [frontmatter|links|denylist|all] [--history]
"""
import hashlib, os, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HASHES = ROOT / ".github" / "denylist.sha256"
SKIP_DIRS = {".git", "node_modules"}
TEXT_EXT = {".md", ".json", ".ps1", ".py", ".ts", ".tsx", ".js", ".yaml", ".yml", ".txt", ".html", ".css", ".sql", ".sh", ".toml"}


def files():
    out = subprocess.check_output(["git", "-C", str(ROOT), "ls-files", "-z"]).decode()
    return [ROOT / f for f in out.split("\0") if f]


def frontmatter():
    errs, names = [], {}
    for p in files():
        if p.name != "SKILL.md":
            continue
        t = p.read_text(encoding="utf-8")
        m = re.match(r"^---\n(.*?)\n---\n", t, re.S)
        if not m:
            errs.append(f"{p}: no frontmatter"); continue
        fm = m.group(1)
        n = re.search(r"^name:\s*(.+)$", fm, re.M)
        d = re.search(r"^description:\s*(.*(?:\n[ \t]+.*)*)", fm, re.M)
        if not n or not d:
            errs.append(f"{p}: missing name/description"); continue
        name = n.group(1).strip().strip("'\"")
        desc = " ".join(x.strip() for x in d.group(1).splitlines()).strip().strip("'\"")
        if desc in (">", "|", ">-", "|-"):
            desc = ""
        if name != p.parent.name:
            errs.append(f"{p}: name '{name}' != dir")
        if not desc or len(desc) > 1024:
            errs.append(f"{p}: description length {len(desc)}")
        if name in names and "vendor/" not in str(p):
            errs.append(f"{p}: duplicate name {name}")
        names[name] = p
    return errs


LINK = re.compile(r"\[[^\]]*\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")


def links():
    errs = []
    for p in files():
        if p.suffix != ".md" or "vendor/" in str(p.relative_to(ROOT)):
            continue  # vendor/ is unmodified third-party content
        t = re.sub(r"```.*?```", "", p.read_text(encoding="utf-8"), flags=re.S)
        t = re.sub(r"`[^`\n]*`", "", t)
        for target in LINK.findall(t):
            if re.match(r"^[a-z]+:|^#|^mailto:", target, re.I):
                continue
            if re.fullmatch(r"[A-Z_]+|\{.*\}|\[.*\]|<.*>", target):
                continue  # template placeholder such as (URL)
            path = target.split("#")[0]
            if not path:
                continue
            if not (p.parent / path).exists():
                errs.append(f"{p.relative_to(ROOT)}: broken link -> {target}")
    return errs


def tokens(text):
    words = re.findall(r"[a-z0-9]+(?:\.[a-z0-9]+)*", text.lower())
    for i, w in enumerate(words):
        yield w
        for part in w.split("."):
            yield part
        if i + 1 < len(words):
            yield f"{w} {words[i+1]}"
    # dotted prefixes such as subnet starts (e.g. "a.b.")
    for m in re.finditer(r"\b(\d{1,3}\.\d{1,3})\.", text):
        yield m.group(1) + "."


def load_hashes():
    return {l.split()[0] for l in HASHES.read_text().splitlines() if l.strip() and not l.startswith("#")}


def scan(text, bad):
    hits = set()
    for tok in tokens(text):
        if hashlib.sha256(tok.encode()).hexdigest() in bad:
            hits.add(hashlib.sha256(tok.encode()).hexdigest()[:12])
    # substring scan for embedded tokens (e.g. inside file names)
    return hits


def denylist(history=False):
    bad, errs = load_hashes(), []
    if history:
        log = subprocess.run(["git", "-C", str(ROOT), "log", "-p", "--all", "--format=%H %an %ae%n%B"],
                             capture_output=True, text=True, errors="replace").stdout
        h = scan(log, bad)
        if h:
            errs.append(f"history: denylisted token hashes {sorted(h)}")
        return errs
    for p in files():
        rel = str(p.relative_to(ROOT))
        h = scan(rel.replace("/", " ").replace("_", " ").replace("-", " "), bad)
        if p.suffix in TEXT_EXT or p.name.startswith("."):
            try:
                h |= scan(p.read_text(encoding="utf-8", errors="replace").replace("_", " "), bad)
            except IsADirectoryError:
                pass
        if h:
            errs.append(f"{rel}: denylisted token hashes {sorted(h)}")
    return errs


def main():
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    hist = "--history" in sys.argv
    errs = []
    if what in ("frontmatter", "all"): errs += frontmatter()
    if what in ("links", "all"): errs += links()
    if what in ("denylist", "all"): errs += denylist(hist)
    for e in errs: print(e)
    print(f"{what}: {len(errs)} problem(s)")
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
