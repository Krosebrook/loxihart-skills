from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERNS = ROOT / "patterns"
REPORT = ROOT / "validation" / "typescript-report.json"
TS_BLOCK = re.compile(r"```ts\s*\n(.*?)\n```", re.DOTALL)


def compiler_version(tsc: str) -> str:
    result = subprocess.run([tsc, "--version"], check=True, capture_output=True, text=True)
    return result.stdout.strip().removeprefix("Version ")


def main() -> int:
    tsc = shutil.which("tsc")
    if not tsc:
        report = {
            "status": "fail",
            "typescript_artifacts_checked": 0,
            "compiler": None,
            "errors": ["TypeScript compiler executable 'tsc' was not found on PATH."],
        }
        REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(report, indent=2))
        return 1

    sources = sorted(PATTERNS.glob("*/A-production-code.md"))
    extraction_errors: list[str] = []
    flags = [
        "--noEmit",
        "--strict",
        "--target", "ES2022",
        "--module", "ES2022",
        "--lib", "ES2022,DOM,DOM.Iterable",
        "--pretty", "false",
    ]

    with tempfile.TemporaryDirectory(prefix="fsp-ts-") as temporary_directory:
        temp_root = Path(temporary_directory)
        generated_files: list[Path] = []

        for source in sources:
            text = source.read_text(encoding="utf-8")
            blocks = TS_BLOCK.findall(text)
            if not blocks:
                extraction_errors.append(f"No TypeScript block found in {source.relative_to(ROOT)}")
                continue

            output = temp_root / f"{source.parent.name}.ts"
            provenance = f"// Extracted from {source.relative_to(ROOT).as_posix()}\n"
            output.write_text(provenance + "\n\n".join(blocks) + "\n", encoding="utf-8")
            generated_files.append(output)

        compiler_errors: list[str] = []
        if generated_files:
            command = [tsc, *flags, *(str(path) for path in generated_files)]
            result = subprocess.run(command, capture_output=True, text=True)
            if result.returncode != 0:
                compiler_errors.extend(line for line in (result.stdout + result.stderr).splitlines() if line.strip())

    errors = [*extraction_errors, *compiler_errors]
    report = {
        "status": "pass" if not errors and len(sources) == 100 else "fail",
        "typescript_artifacts_expected": 100,
        "typescript_artifacts_checked": len(sources) - len(extraction_errors),
        "compiler": f"TypeScript {compiler_version(tsc)}",
        "flags": [
            "--noEmit",
            "--strict",
            "--target ES2022",
            "--module ES2022",
            "--lib ES2022,DOM,DOM.Iterable",
            "--pretty false",
        ],
        "errors": errors,
        "note": "Every TypeScript block from each production-code artifact is concatenated in source order and compiled as one standalone ES module.",
    }
    REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0 if report["status"] == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main())
