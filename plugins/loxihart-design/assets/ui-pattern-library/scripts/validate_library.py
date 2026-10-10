from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERNS = ROOT / "patterns"
REPORT = ROOT / "validation" / "validation-report.json"
REQUIRED_ARTIFACTS = (
    "A-production-code.md",
    "B-design-system-specification.md",
    "C-agile-user-stories.feature",
)
MASTER_PROMPTS = (
    "category-1-master-prompt.md",
    "category-2-master-prompt.md",
    "category-3-master-prompt.md",
)
BATCH_FILES = ("00-pilot-pattern-001.md", *(f"{index:02d}-batch.md" for index in range(1, 11)))


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def load_manifest_json(errors: list[str]) -> list[dict[str, object]]:
    path = ROOT / "manifest.json"
    if not path.exists():
        errors.append("Missing manifest.json")
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        errors.append(f"Invalid manifest.json: {error}")
        return []
    if not isinstance(data, list):
        errors.append("manifest.json must contain a top-level list")
        return []
    return [entry for entry in data if isinstance(entry, dict)]


def load_manifest_csv(errors: list[str]) -> list[dict[str, str]]:
    path = ROOT / "manifest.csv"
    if not path.exists():
        errors.append("Missing manifest.csv")
        return []
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def validate() -> dict[str, object]:
    errors: list[str] = []

    for name in MASTER_PROMPTS:
        path = ROOT / "master-prompts" / name
        if not path.exists():
            errors.append(f"Missing master prompt: {relative(path)}")
            continue
        text = path.read_text(encoding="utf-8")
        for round_number in range(1, 5):
            if f"Round {round_number}" not in text:
                errors.append(f"Missing discovery Round {round_number}: {relative(path)}")
        for phrase in (
            "React with Tailwind",
            "Vue",
            "Web Components",
            "vanilla HTML/CSS/JavaScript",
            "No runtime dependency",
            "twenty-four by twenty-four CSS pixels",
            "four-and-one-half-to-one contrast ratio",
            "three-to-one ratio",
            "[SOURCED:",
            "[GENERATED:",
        ):
            if phrase.casefold() not in text.casefold():
                errors.append(f"Missing master-prompt requirement '{phrase}': {relative(path)}")

    pattern_dirs = sorted(path for path in PATTERNS.iterdir() if path.is_dir()) if PATTERNS.exists() else []
    expected_numbers = list(range(1, 101))
    actual_numbers: list[int] = []

    for directory in pattern_dirs:
        match = re.match(r"^(\d{3})-", directory.name)
        if not match:
            errors.append(f"Pattern directory lacks a three-digit identifier: {relative(directory)}")
            continue
        actual_numbers.append(int(match.group(1)))

        primary_files = sorted(path.name for path in directory.iterdir() if path.is_file())
        unexpected_primary_shape = [name for name in primary_files if name not in REQUIRED_ARTIFACTS]
        if unexpected_primary_shape:
            errors.append(f"Unexpected file(s) in pattern directory {relative(directory)}: {unexpected_primary_shape}")

        for name in REQUIRED_ARTIFACTS:
            path = directory / name
            if not path.exists():
                errors.append(f"Missing {relative(path)}")
                continue
            text = path.read_text(encoding="utf-8")
            if len(text.split()) < 180:
                errors.append(f"Artifact appears too short: {relative(path)}")
            if re.search(r"\b(TODO|TBD|stub)\b|\[PLACEHOLDER\]", text, re.IGNORECASE):
                errors.append(f"Stub marker found: {relative(path)}")
            if any(token in text for token in ("44×44", "44 by 44", "44px")):
                errors.append(f"Incorrect AA target-size language: {relative(path)}")
            if "target" in text.casefold() and "twenty-four" in text.casefold() and "SOURCED:" not in text:
                errors.append(f"Missing source tag near target-size material: {relative(path)}")
            if "WCAG 2.2 Level AA" in text and "does not claim conformance" not in text.casefold() and "does not certify conformance" not in text.casefold():
                errors.append(f"Potential unqualified conformance claim: {relative(path)}")

            if name.startswith("A-"):
                for phrase in (
                    "React with Tailwind",
                    "Vue",
                    "Web Components",
                    "Vanilla",
                    "No runtime dependency",
                    "```ts",
                    "```html",
                    "```css",
                    "Dependency-free smoke checks",
                ):
                    if phrase.casefold() not in text.casefold():
                        errors.append(f"Missing production-code contract '{phrase}': {relative(path)}")
            elif name.startswith("B-"):
                for edge in ("| 01 |", "| 20 |", "| 21 |", "| 40 |", "| 41 |", "| 60 |"):
                    if edge not in text:
                        errors.append(f"Missing edge-case boundary {edge}: {relative(path)}")
                if "| state | visual cue | aria state | keyboard action |" not in text.casefold():
                    errors.append(f"Missing required state matrix header: {relative(path)}")
            elif name.startswith("C-"):
                if text.count("Scenario:") < 10:
                    errors.append(f"Insufficient Gherkin scenarios: {relative(path)}")
                for keyword in ("Given ", "When ", "Then "):
                    if keyword not in text:
                        errors.append(f"Missing Gherkin keyword '{keyword.strip()}': {relative(path)}")

    if len(pattern_dirs) != 100:
        errors.append(f"Expected 100 pattern directories; found {len(pattern_dirs)}")
    if actual_numbers != expected_numbers:
        errors.append(f"Pattern identifiers are not contiguous 001–100: {actual_numbers}")

    pilot_path = ROOT / "pilot" / "PILOT-VALIDATION.md"
    if not pilot_path.exists():
        errors.append("Missing pilot/PILOT-VALIDATION.md")
    elif "Pass for catalog continuation" not in pilot_path.read_text(encoding="utf-8"):
        errors.append("Pilot validation does not record a continuation verdict")

    for name in BATCH_FILES:
        path = ROOT / "batches" / name
        if not path.exists():
            errors.append(f"Missing batch index: {relative(path)}")
    pilot_batch = ROOT / "batches" / "00-pilot-pattern-001.md"
    if pilot_batch.exists() and "pattern 001 alone" not in pilot_batch.read_text(encoding="utf-8").casefold():
        errors.append("Pilot batch index does not identify pattern 001 as a standalone pilot")

    manifest_json = load_manifest_json(errors)
    manifest_csv = load_manifest_csv(errors)
    if len(manifest_json) != 100:
        errors.append(f"manifest.json must contain 100 entries; found {len(manifest_json)}")
    if len(manifest_csv) != 100:
        errors.append(f"manifest.csv must contain 100 entries; found {len(manifest_csv)}")

    for expected_number, entry in enumerate(manifest_json, start=1):
        if entry.get("pattern_number") != expected_number:
            errors.append(f"manifest.json entry {expected_number} has mismatched pattern_number")
        for key in ("production_code", "design_spec", "user_stories"):
            value = entry.get(key)
            if not isinstance(value, str) or not (ROOT / value).exists():
                errors.append(f"manifest.json entry {expected_number} has invalid {key}: {value!r}")

    report: dict[str, object] = {
        "status": "pass" if not errors else "fail",
        "master_prompts_expected": 3,
        "master_prompts_found": sum((ROOT / "master-prompts" / name).exists() for name in MASTER_PROMPTS),
        "pattern_directories_expected": 100,
        "pattern_directories_found": len(pattern_dirs),
        "primary_artifacts_expected": 300,
        "primary_artifacts_found": sum(
            (directory / name).exists() for directory in pattern_dirs for name in REQUIRED_ARTIFACTS
        ),
        "pilot_validation_found": pilot_path.exists(),
        "batch_indexes_expected": len(BATCH_FILES),
        "batch_indexes_found": sum((ROOT / "batches" / name).exists() for name in BATCH_FILES),
        "manifest_json_entries": len(manifest_json),
        "manifest_csv_entries": len(manifest_csv),
        "errors": errors,
    }
    REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return report


if __name__ == "__main__":
    result = validate()
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if result["status"] == "pass" else 1)
