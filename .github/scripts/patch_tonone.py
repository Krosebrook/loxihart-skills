#!/usr/bin/env python3
"""Apply Loxihart patches to the vendored tonone snapshot, or re-sync it.

Patches (see vendor/tonone/LOXIHART-PATCHES.md):
  1. Rewrite GitHub tree URL sources to './<path>' when that path exists.
  2. Drop marketplace entries whose source path is not in the snapshot.
  3. Sync each remaining entry's version to its plugin.json.
  4. Strip the unknown top-level "type" field from marketplace entries
     and nested plugin.json files (hook "type" values are left alone).
  5. Move a plugin-root CLAUDE.md to docs/CLAUDE.md. --strict treats the
     "CLAUDE.md at the plugin root is not loaded as project context"
     warning as an error.

Usage:
  python3 .github/scripts/patch_tonone.py apply
  python3 .github/scripts/patch_tonone.py --check
  python3 .github/scripts/patch_tonone.py sync [--ref TAG]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
UPSTREAM_REPO = "tonone-ai/tonone"
UPSTREAM_URL = f"https://github.com/{UPSTREAM_REPO}.git"
API = f"https://api.github.com/repos/{UPSTREAM_REPO}"
DEFAULT_VENDOR = ROOT / "vendor" / "tonone"
PRESERVE_NAMES = ("LOXIHART-PATCHES.md",)
COPY_IGNORE = {".git", ".github", ".trunk", "node_modules", ".DS_Store"}
GH_TREE = re.compile(r"^https://github\.com/[^/]+/[^/]+/tree/[^/]+/?(.*)$")
TOP_TYPE_LINE = re.compile(r'(?m)^  "type": .*?(,?)\n')
UA = "loxihart-skills-tonone-sync"


def dumps(obj, *, indent=2, ensure_ascii=False):
    """JSON with indent, compact primitive arrays, and a trailing newline."""

    def is_prim_list(x):
        return isinstance(x, list) and all(
            isinstance(i, (str, int, float, bool)) or i is None for i in x
        )

    def enc(o, level):
        sp = " " * (indent * level)
        inn = " " * (indent * (level + 1))
        if isinstance(o, dict):
            if not o:
                return "{}"
            parts = []
            for k, v in o.items():
                key = json.dumps(k, ensure_ascii=ensure_ascii)
                val = json.dumps(v, ensure_ascii=ensure_ascii) if is_prim_list(v) else enc(v, level + 1)
                parts.append(f"{inn}{key}: {val}")
            return "{\n" + ",\n".join(parts) + "\n" + sp + "}"
        if isinstance(o, list):
            if is_prim_list(o):
                return json.dumps(o, ensure_ascii=ensure_ascii)
            if not o:
                return "[]"
            parts = [inn + enc(v, level + 1) for v in o]
            return "[\n" + ",\n".join(parts) + "\n" + sp + "]"
        return json.dumps(o, ensure_ascii=ensure_ascii)

    return enc(obj, 0) + "\n"


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_text(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def source_rel(src):
    """Return a path relative to the vendor root, or None if unresolvable."""
    if not isinstance(src, str):
        return None
    src = src.strip()
    m = GH_TREE.match(src)
    if m:
        return m.group(1).rstrip("/")
    if src in (".", "./"):
        return ""
    if src.startswith("./"):
        return src[2:].rstrip("/")
    return None


def path_exists(vendor: Path, rel):
    if rel is None:
        return False
    if rel == "":
        return vendor.is_dir()
    return (vendor / rel).exists()


def local_source(rel):
    return "./" if rel == "" else f"./{rel}"


def plugin_version(vendor: Path, rel):
    path = (vendor if rel == "" else vendor / rel) / ".claude-plugin" / "plugin.json"
    if not path.is_file():
        return None
    try:
        ver = load_json(path).get("version")
    except (OSError, json.JSONDecodeError):
        return None
    return ver if isinstance(ver, str) and ver else None


def patch_marketplace(data: dict, vendor: Path):
    """Return (new_data, stats) without writing."""
    stats = {"rewritten": 0, "dropped": 0, "versioned": 0, "catalog_type": 0}
    plugins = data.get("plugins")
    if not isinstance(plugins, list):
        raise SystemExit(f"{vendor}: marketplace.json has no plugins list")
    kept = []
    for raw in plugins:
        if not isinstance(raw, dict):
            kept.append(raw)
            continue
        entry = dict(raw)
        rel = source_rel(entry.get("source"))
        if not path_exists(vendor, rel):
            stats["dropped"] += 1
            continue
        src = entry.get("source")
        if isinstance(src, str) and src.startswith("http"):
            new_src = local_source(rel)
            if src != new_src:
                entry["source"] = new_src
                stats["rewritten"] += 1
        ver = plugin_version(vendor, rel)
        if ver and entry.get("version") != ver:
            entry["version"] = ver
            stats["versioned"] += 1
        if "type" in entry:
            entry.pop("type")
            stats["catalog_type"] += 1
        kept.append(entry)
    out = dict(data)
    out["plugins"] = kept
    return out, stats


def strip_top_level_type_text(text: str):
    """Remove a 2-space-indented top-level type line. Hook types are deeper."""
    data = json.loads(text)
    if "type" not in data:
        return text, False
    expected = dict(data)
    expected.pop("type")
    m = TOP_TYPE_LINE.search(text)
    if m:
        if m.group(1) == ",":
            new = text[: m.start()] + text[m.end() :]
        else:
            new = re.sub(r",([ \t]*\n)$", r"\1", text[: m.start()]) + text[m.end() :]
        try:
            if json.loads(new) == expected:
                return new, True
        except json.JSONDecodeError:
            pass
    ensure_ascii = r"\u" in text
    return dumps(expected, ensure_ascii=ensure_ascii), True


def relocate_root_claude(vendor: Path):
    """Plan moving a plugin-root CLAUDE.md out of the way of --strict.

    Returns (src, dest) to move, (src, None) to delete src because dest
    already has the same bytes, or None if there is nothing to do.
    """
    src = vendor / "CLAUDE.md"
    if not src.is_file():
        return None
    docs = vendor / "docs"
    dest = docs / "CLAUDE.md"
    if dest.is_file():
        if dest.read_bytes() == src.read_bytes():
            return (src, None)
        dest = docs / "CLAUDE.upstream.md"
        n = 2
        while dest.is_file() and dest.read_bytes() != src.read_bytes():
            dest = docs / f"CLAUDE.upstream{n}.md"
            n += 1
        if dest.is_file():
            return (src, None)
    return (src, dest)


def apply(vendor: Path, check=False):
    if not vendor.is_dir():
        raise SystemExit(f"vendor directory not found: {vendor}")
    marketplace = vendor / ".claude-plugin" / "marketplace.json"
    if not marketplace.is_file():
        raise SystemExit(f"missing {marketplace}")

    original = load_json(marketplace)
    patched, stats = patch_marketplace(original, vendor)
    planned = []
    if patched != original:
        planned.append(marketplace)

    plugin_edits = []
    for path in sorted(vendor.rglob("plugin.json")):
        if any(part in COPY_IGNORE for part in path.parts):
            continue
        text = path.read_text(encoding="utf-8")
        try:
            new, changed = strip_top_level_type_text(text)
        except json.JSONDecodeError as e:
            raise SystemExit(f"{path}: {e}") from e
        if changed and new != text:
            plugin_edits.append((path, new))
            planned.append(path)
    stats["plugin_type"] = len(plugin_edits)

    claude_move = relocate_root_claude(vendor)
    stats["claude_md"] = 1 if claude_move else 0
    if claude_move:
        planned.append(claude_move[0])
        if claude_move[1] is not None:
            planned.append(claude_move[1])

    if check:
        if planned:
            print("would change:")
            for p in planned:
                print(f"  {p}")
            summarize(stats, check=True)
            return 1
        summarize(stats, check=True, clean=True)
        return 0

    if patched != original:
        write_text(marketplace, dumps(patched, ensure_ascii=False))
    for path, new in plugin_edits:
        write_text(path, new)
    if claude_move:
        src, dest = claude_move
        if dest is None:
            src.unlink()
        else:
            dest.parent.mkdir(parents=True, exist_ok=True)
            src.replace(dest)
    summarize(stats, written=len(planned))
    return 0


def summarize(stats, *, check=False, clean=False, written=None):
    if clean:
        print("tonone patches: already applied (no changes)")
        return
    verb = "would apply" if check else "applied"
    print(
        f"tonone patches: {verb} "
        f"{stats['rewritten']} source rewrite(s), "
        f"{stats['dropped']} dropped missing-path entries, "
        f"{stats['versioned']} version sync(s), "
        f"stripped type from {stats['catalog_type']} catalog entries "
        f"and {stats['plugin_type']} plugin.json files, "
        f"{stats['claude_md']} CLAUDE.md relocate(s)"
        + (f", {written} file(s) written" if written is not None else "")
    )


def github_headers():
    headers = {"User-Agent": UA, "Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def http_json(url: str):
    req = urllib.request.Request(url, headers=github_headers())
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.URLError as e:
        raise RuntimeError(f"GET {url}: {e}") from e


def latest_release_tag():
    try:
        data = http_json(f"{API}/releases/latest")
        tag = data.get("tag_name")
        if tag:
            return tag
    except RuntimeError as e:
        print(f"API latest release failed ({e}); trying gh", file=sys.stderr)
    r = subprocess.run(
        ["gh", "api", f"repos/{UPSTREAM_REPO}/releases/latest", "--jq", ".tag_name"],
        capture_output=True,
        text=True,
    )
    if r.returncode != 0 or not r.stdout.strip():
        raise SystemExit(f"could not resolve latest release: {r.stderr or r.stdout}")
    return r.stdout.strip()


def fetch_upstream(ref: str, dest: Path) -> str:
    dest.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init", str(dest)], check=True, capture_output=True)
    subprocess.run(
        ["git", "-C", str(dest), "remote", "add", "origin", UPSTREAM_URL],
        check=True,
        capture_output=True,
    )
    r = subprocess.run(
        ["git", "-C", str(dest), "fetch", "--depth", "1", "origin", ref],
        capture_output=True,
        text=True,
    )
    if r.returncode != 0:
        raise SystemExit(f"failed to fetch {UPSTREAM_REPO}@{ref}: {r.stderr.strip()}")
    subprocess.run(
        ["git", "-C", str(dest), "-c", "advice.detachedHead=false", "checkout", "--force", "FETCH_HEAD"],
        check=True,
        capture_output=True,
        text=True,
    )
    sha = subprocess.check_output(
        ["git", "-C", str(dest), "rev-parse", "HEAD"], text=True
    ).strip()
    return sha


def replace_vendor(fetched: Path, vendor: Path):
    preserved = {}
    if vendor.is_dir():
        for name in PRESERVE_NAMES:
            path = vendor / name
            if path.is_file():
                preserved[name] = path.read_bytes()
    staging = vendor.parent / f".{vendor.name}.staging"
    if staging.exists():
        shutil.rmtree(staging)

    def ignore(directory, names):
        return [n for n in names if n in COPY_IGNORE]

    shutil.copytree(fetched, staging, ignore=ignore, symlinks=True)
    # never vendor the upstream git dir even if ignore was bypassed
    gitdir = staging / ".git"
    if gitdir.exists():
        shutil.rmtree(gitdir)
    for name, blob in preserved.items():
        (staging / name).write_bytes(blob)
    backup = vendor.parent / f".{vendor.name}.bak"
    if backup.exists():
        shutil.rmtree(backup)
    if vendor.exists():
        vendor.rename(backup)
    try:
        staging.rename(vendor)
    except BaseException:
        if backup.exists() and not vendor.exists():
            backup.rename(vendor)
        raise
    if backup.exists():
        shutil.rmtree(backup)


def count_files(vendor: Path) -> int:
    n = 0
    for p in vendor.rglob("*"):
        if p.is_file() and ".git" not in p.parts:
            n += 1
    return n


def write_source_json(vendor: Path, ref: str, sha: str):
    payload = {
        "synced_from": {
            "repo": UPSTREAM_REPO,
            "path": ".",
            "ref": ref,
            "sha": sha,
        },
        "last_sync": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z",
        "license": "MIT",
        "files_synced": count_files(vendor),
    }
    write_text(vendor / ".source.json", json.dumps(payload, indent=2) + "\n")


def maybe_validate(vendor: Path) -> int:
    claude = shutil.which("claude")
    if not claude:
        print("claude CLI not found; skipping validate --strict")
        return 0
    print(f"running: claude plugin validate --strict {vendor}")
    r = subprocess.run([claude, "plugin", "validate", "--strict", str(vendor)])
    if r.returncode != 0:
        print("claude plugin validate --strict failed", file=sys.stderr)
    return r.returncode


def emit_github_output(**kwargs):
    path = os.environ.get("GITHUB_OUTPUT")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as f:
        for k, v in kwargs.items():
            f.write(f"{k}={v}\n")


def sync(vendor: Path, ref: str | None):
    ref = ref or latest_release_tag()
    print(f"syncing {UPSTREAM_REPO}@{ref} into {vendor}")
    with tempfile.TemporaryDirectory(prefix="tonone-sync-") as tmp:
        fetched = Path(tmp) / "src"
        sha = fetch_upstream(ref, fetched)
        print(f"fetched {sha}")
        vendor.parent.mkdir(parents=True, exist_ok=True)
        replace_vendor(fetched, vendor)
    write_source_json(vendor, ref, sha)
    # apply may still edit marketplace / plugin.json; recount after
    rc = apply(vendor, check=False)
    if rc != 0:
        return rc
    write_source_json(vendor, ref, sha)
    emit_github_output(ref=ref, sha=sha)
    print(f"synced {UPSTREAM_REPO}@{ref} ({sha[:12]}), {count_files(vendor)} files")
    return maybe_validate(vendor)


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument(
        "command",
        nargs="?",
        default="apply",
        choices=["apply", "sync", "check"],
        help="apply patches, check they are applied, or re-sync from upstream (default: apply)",
    )
    p.add_argument(
        "--check",
        action="store_true",
        help="do not write; exit 1 if apply would change anything",
    )
    p.add_argument("--ref", default=None, help="with sync: tag, branch, or SHA (default: latest release)")
    p.add_argument("--vendor", type=Path, default=None, help=f"vendor dir (default: {DEFAULT_VENDOR})")
    args = p.parse_args(argv)
    vendor = (args.vendor or DEFAULT_VENDOR).resolve()
    command = args.command
    if command == "check" or (command == "apply" and args.check):
        if args.ref:
            raise SystemExit("--ref is only valid with sync")
        return apply(vendor, check=True)
    if args.check and command == "sync":
        raise SystemExit("--check is only valid with apply")
    if command == "sync":
        return sync(vendor, args.ref)
    return apply(vendor, check=False)


if __name__ == "__main__":
    sys.exit(main())
