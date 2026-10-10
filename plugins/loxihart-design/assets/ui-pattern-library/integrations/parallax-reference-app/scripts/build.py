from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


def main() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    subprocess.run(
        ["tsc", "--project", str(ROOT / "tsconfig.json")],
        cwd=ROOT,
        check=True,
    )

    shutil.copy2(ROOT / "src" / "index.html", DIST / "index.html")
    shutil.copytree(ROOT / "styles", DIST / "styles")
    print(f"Built reference application at {DIST}")


if __name__ == "__main__":
    main()
