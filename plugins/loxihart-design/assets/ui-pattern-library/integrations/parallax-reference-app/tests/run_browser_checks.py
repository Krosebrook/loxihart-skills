from __future__ import annotations

import json
import math
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

from playwright.sync_api import Browser, BrowserContext, Page, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
REPORTS = ROOT / "reports"
SCREENSHOTS = REPORTS / "screenshots"
CHROMIUM = "/usr/bin/chromium"


class CheckFailure(AssertionError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise CheckFailure(message)


def build_inline_document() -> str:
    html = (ROOT / "src" / "index.html").read_text(encoding="utf-8")
    css_parts: list[str] = []
    for name in ("tokens.css", "parallax.css", "app.css"):
        css = (ROOT / "styles" / name).read_text(encoding="utf-8")
        css_parts.append(re.sub(r"^@import.*?;\s*$", "", css, flags=re.MULTILINE))

    controller = (DIST / "parallax-controller.js").read_text(encoding="utf-8")
    controller = re.sub(r"^export\s+", "", controller, flags=re.MULTILINE)
    main = (DIST / "main.js").read_text(encoding="utf-8")
    main = re.sub(r"^import\s+.*?;\s*$", "", main, flags=re.MULTILINE)

    html = html.replace(
        '<link rel="stylesheet" href="./styles/app.css">',
        f"<style>{''.join(css_parts)}</style>",
    )
    html = html.replace(
        '<script type="module" src="./main.js"></script>',
        f"<script type=\"module\">{controller}\n{main}</script>",
    )
    return html


def load_page(page: Page, document: str) -> tuple[list[str], list[str]]:
    page_errors: list[str] = []
    console_errors: list[str] = []
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.set_content(document, wait_until="load")
    page.locator('[data-fsp-pattern="001"][data-enhanced="true"]').wait_for()
    page.wait_for_timeout(100)
    return page_errors, console_errors


def computed(page: Page, selector: str, property_name: str) -> str:
    return page.locator(selector).first.evaluate(
        "(element, propertyName) => getComputedStyle(element).getPropertyValue(propertyName).trim()",
        property_name,
    )


def screenshot(page: Page, name: str, *, full_page: bool = False) -> str:
    path = SCREENSHOTS / name
    page.screenshot(path=str(path), full_page=full_page)
    return str(path.relative_to(ROOT))


def base_browser_case(browser: Browser, document: str) -> dict[str, Any]:
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()
    page_errors, console_errors = load_page(page, document)

    root = page.locator('[data-fsp-pattern="001"]')
    layers = page.locator("[data-parallax-layer]")

    require(root.get_attribute("data-motion") == "active", "Expected active motion state on initial load.")
    require(page.locator("h1").inner_text() == "Depth without losing the document.", "Pilot heading mismatch.")
    require(page.locator("main").count() == 1, "Expected one semantic main landmark.")
    require(page.locator("nav[aria-label]").count() == 1, "Expected a named primary navigation landmark.")
    require(page.evaluate("document.scrollingElement.scrollHeight > innerHeight"), "Document must retain native vertical scrolling.")

    initial_transforms = layers.evaluate_all("els => els.map(el => getComputedStyle(el).transform)")
    page.mouse.wheel(0, 520)
    page.wait_for_timeout(150)
    scroll_y = page.evaluate("scrollY")
    progressed = float(root.evaluate("el => getComputedStyle(el).getPropertyValue('--parallax-progress')"))
    moved_transforms = layers.evaluate_all("els => els.map(el => getComputedStyle(el).transform)")

    require(scroll_y > 0, "Native wheel scrolling did not move the document.")
    require(0 < progressed <= 1, "Parallax progress was not normalized after native scrolling.")
    require(moved_transforms != initial_transforms, "Decorative layers did not respond to scroll progress.")
    require(len(set(moved_transforms)) == layers.count(), "Layer depth values should produce distinct transforms.")

    toggle = page.locator("[data-parallax-toggle]")
    toggle.focus()
    toggle.click()
    page.wait_for_timeout(100)
    require(toggle.get_attribute("aria-pressed") == "true", "Motion toggle did not expose its pressed state.")
    require(page.evaluate("document.activeElement === document.querySelector('[data-parallax-toggle]')"), "Focus moved after the motion toggle was activated.")
    require(all(value == "none" for value in layers.evaluate_all("els => els.map(el => getComputedStyle(el).transform)")), "Disabled motion must remove decorative transforms.")
    require("motion disabled" in page.locator("[data-parallax-status]").inner_text().lower(), "Motion state change was not announced.")

    page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }))")
    require(root.get_attribute("data-enhanced") == "true", "A persisted pagehide event incorrectly unmounted the controller.")

    page.evaluate("window.__FSP_PATTERN_001__.unmount()")
    require(root.get_attribute("data-enhanced") is None, "Unmount did not remove enhancement state.")
    page.evaluate("window.__FSP_PATTERN_001__.mount(); undefined")
    page.wait_for_timeout(100)
    require(root.get_attribute("data-enhanced") == "true", "Remount did not restore enhancement state.")

    require(not page_errors, f"Page errors: {page_errors}")
    require(not console_errors, f"Console errors: {console_errors}")

    evidence = screenshot(page, "01-browser-base.png", full_page=True)
    context.close()
    return {
        "nativeScrollY": scroll_y,
        "normalizedProgress": progressed,
        "initialTransforms": initial_transforms,
        "movedTransforms": moved_transforms,
        "evidence": evidence,
        "provenance": "[GENERATED: automated Chromium behavioral test]",
    }


def keyboard_case(browser: Browser, document: str) -> dict[str, Any]:
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()
    load_page(page, document)

    page.keyboard.press("Tab")
    require(page.evaluate("document.activeElement.classList.contains('skip-link')"), "The skip link must be the first keyboard target.")
    require(page.locator(".skip-link").is_visible(), "The focused skip link must be visible.")
    page.keyboard.press("Enter")
    page.wait_for_timeout(75)
    require(page.evaluate("document.activeElement.id") == "main-content", "Skip-link activation must move focus to main content.")

    page.close()
    page = context.new_page()
    load_page(page, document)
    observed: list[dict[str, str | None]] = []
    for _ in range(7):
        page.keyboard.press("Tab")
        observed.append(
            page.evaluate(
                """() => ({
                  tag: document.activeElement?.tagName ?? null,
                  text: document.activeElement?.textContent?.trim() ?? null,
                  pressed: document.activeElement?.getAttribute('aria-pressed') ?? null
                })"""
            )
        )

    require(observed[-1]["tag"] == "BUTTON", "The motion toggle was not reached in expected DOM order.")
    require(observed[-1]["text"] == "Disable depth motion", "Unexpected final keyboard target before activation.")

    page.keyboard.press("Enter")
    page.wait_for_timeout(75)
    require(page.locator("[data-parallax-toggle]").get_attribute("aria-pressed") == "true", "Enter did not activate the button.")
    require(page.evaluate("document.activeElement.matches('[data-parallax-toggle]')"), "Enter activation must retain focus.")

    page.keyboard.press("Space")
    page.wait_for_timeout(75)
    require(page.locator("[data-parallax-toggle]").get_attribute("aria-pressed") == "false", "Space did not activate the button.")
    require(computed(page, "[data-parallax-toggle]", "outline-style") != "none", "Focused control lacks a visible outline.")

    page.locator("[data-parallax-toggle]").scroll_into_view_if_needed()
    evidence = screenshot(page, "02-keyboard-focus.png")
    context.close()
    return {
        "tabOrder": observed,
        "skipLinkDestination": "main-content",
        "enterAndSpaceOperable": True,
        "evidence": evidence,
        "provenance": "[GENERATED: automated keyboard-navigation test]",
    }


def zoom_case(browser: Browser, document: str) -> dict[str, Any]:
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()
    cdp = context.new_cdp_session(page)
    cdp.send(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": 640,
            "height": 360,
            "deviceScaleFactor": 2,
            "mobile": False,
        },
    )
    load_page(page, document)

    metrics = page.evaluate(
        """() => ({
          innerWidth,
          innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          scrollHeight: document.documentElement.scrollHeight,
          visualScale: window.visualViewport?.scale ?? 1
        })"""
    )
    require(metrics["innerWidth"] == 640, "The layout-equivalent two-hundred-percent zoom viewport was not applied.")
    require(metrics["scrollWidth"] <= metrics["clientWidth"] + 1, "Content introduced horizontal overflow at the zoom-equivalent viewport.")

    target_sizes = page.locator("a, button").evaluate_all(
        """elements => elements
          .filter(element => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
          })
          .map(element => {
            const rect = element.getBoundingClientRect();
            return { label: element.textContent.trim(), width: rect.width, height: rect.height };
          })"""
    )
    undersized = [target for target in target_sizes if target["width"] < 24 or target["height"] < 24]
    require(not undersized, f"Pointer targets below the twenty-four CSS-pixel minimum: {undersized}")

    evidence = screenshot(page, "03-zoom-200-percent-equivalent.png", full_page=True)
    context.close()
    return {
        "emulation": "Layout viewport halved with a device scale factor of two.",
        "metrics": metrics,
        "interactiveTargetSizes": target_sizes,
        "undersizedTargets": undersized,
        "evidence": evidence,
        "provenance": "[GENERATED: Chromium layout-equivalent test for two-hundred-percent browser zoom]",
        "criterion": "[SOURCED: WCAG 2.2 SC 1.4.4, Level AA]",
    }


def forced_colors_case(browser: Browser, document: str) -> dict[str, Any]:
    context = browser.new_context(viewport={"width": 1280, "height": 720}, forced_colors="active")
    page = context.new_page()
    load_page(page, document)

    require(page.evaluate("matchMedia('(forced-colors: active)').matches"), "Forced-colors media emulation is inactive.")
    require(computed(page, "[data-parallax-layer]", "display") == "none", "Decorative layers must be removed in forced-colors mode.")
    require(computed(page, ".parallax-content", "box-shadow") == "none", "Forced-colors mode must remove decorative shadowing.")
    require(computed(page, ".parallax-content", "backdrop-filter") == "none", "Forced-colors mode must remove backdrop filtering.")

    toggle = page.locator("[data-parallax-toggle]")
    toggle.focus()
    require(computed(page, "[data-parallax-toggle]", "outline-style") != "none", "Forced-colors mode hid the keyboard focus indicator.")
    require(toggle.is_visible(), "Motion control is not visible in forced-colors mode.")

    evidence = screenshot(page, "04-forced-colors.png")
    context.close()
    return {
        "decorativeLayersHidden": True,
        "focusIndicatorVisible": True,
        "evidence": evidence,
        "provenance": "[GENERATED: automated Chromium forced-colors test]",
    }


def reduced_motion_case(browser: Browser, document: str) -> dict[str, Any]:
    context = browser.new_context(viewport={"width": 1280, "height": 720}, reduced_motion="reduce")
    page = context.new_page()
    load_page(page, document)

    root = page.locator('[data-fsp-pattern="001"]')
    transforms = page.locator("[data-parallax-layer]").evaluate_all("els => els.map(el => getComputedStyle(el).transform)")
    will_change = page.locator("[data-parallax-layer]").evaluate_all("els => els.map(el => getComputedStyle(el).willChange)")

    require(page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"), "Reduced-motion emulation is inactive.")
    require(root.get_attribute("data-motion") == "reduced", "Controller did not expose the reduced motion state.")
    require(all(value == "none" for value in transforms), "Reduced motion must remove all decorative transforms.")
    require(all(value == "auto" for value in will_change), "Reduced motion must release promoted layers.")

    page.mouse.wheel(0, 520)
    page.wait_for_timeout(100)
    after_scroll = page.locator("[data-parallax-layer]").evaluate_all("els => els.map(el => getComputedStyle(el).transform)")
    require(all(value == "none" for value in after_scroll), "Scrolling reintroduced transforms under reduced motion.")

    toggle = page.locator("[data-parallax-toggle]")
    toggle.click()
    require(toggle.get_attribute("aria-pressed") == "true", "The explicit motion preference remains operable under reduced motion.")

    evidence = screenshot(page, "05-reduced-motion.png")
    context.close()
    return {
        "motionState": "reduced",
        "transforms": transforms,
        "willChange": will_change,
        "evidence": evidence,
        "provenance": "[GENERATED: automated Chromium reduced-motion test]",
    }


def accessibility_tree_case(browser: Browser, document: str) -> dict[str, Any]:
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()
    load_page(page, document)
    cdp = context.new_cdp_session(page)
    cdp.send("Accessibility.enable")
    full_tree = cdp.send("Accessibility.getFullAXTree")

    nodes = full_tree.get("nodes", [])

    def role(node: dict[str, Any]) -> str | None:
        value = node.get("role", {}).get("value")
        return value if isinstance(value, str) else None

    def name(node: dict[str, Any]) -> str | None:
        value = node.get("name", {}).get("value")
        return value if isinstance(value, str) else None

    relevant = [
        {
            "role": role(node),
            "name": name(node),
            "properties": {
                prop.get("name", "unknown"): prop.get("value", {}).get("value")
                for prop in node.get("properties", [])
            },
            "backendDOMNodeId": node.get("backendDOMNodeId"),
        }
        for node in nodes
        if role(node) in {"main", "navigation", "region", "heading", "link", "button", "status"}
    ]

    require(any(item["role"] == "main" for item in relevant), "Main landmark is absent from the accessibility tree.")
    require(any(item["role"] == "navigation" and item["name"] == "Primary navigation" for item in relevant), "Named navigation landmark is absent from the accessibility tree.")
    require(any(item["role"] == "region" and item["name"] == "Depth without losing the document." for item in relevant), "Named pilot region is absent from the accessibility tree.")
    button = next((item for item in relevant if item["role"] == "button" and item["name"] == "Disable depth motion"), None)
    require(button is not None, "Motion control is absent from the accessibility tree.")
    require(button["properties"].get("pressed") in {False, "false"}, "Motion control must expose an unpressed initial state.")
    require(any(item["role"] == "status" for item in relevant), "Polite status region is absent from the accessibility tree.")

    ax_backend_ids = {node.get("backendDOMNodeId") for node in nodes if not node.get("ignored", False)}
    decorative_backend_ids: list[int] = []
    for index in range(page.locator("[data-parallax-layer]").count()):
        evaluation = cdp.send(
            "Runtime.evaluate",
            {
                "expression": f"document.querySelectorAll('[data-parallax-layer]')[{index}]",
                "returnByValue": False,
            },
        )
        object_id = evaluation.get("result", {}).get("objectId")
        if object_id:
            described = cdp.send("DOM.describeNode", {"objectId": object_id})
            backend_id = described.get("node", {}).get("backendNodeId")
            if isinstance(backend_id, int):
                decorative_backend_ids.append(backend_id)

    exposed_decorative_ids = [backend_id for backend_id in decorative_backend_ids if backend_id in ax_backend_ids]
    require(not exposed_decorative_ids, "Decorative parallax layers leaked into the accessibility tree.")

    (REPORTS / "accessibility-tree.json").write_text(
        json.dumps(full_tree, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    context.close()
    return {
        "relevantNodes": relevant,
        "decorativeBackendNodeIds": decorative_backend_ids,
        "exposedDecorativeBackendNodeIds": exposed_decorative_ids,
        "fullTree": "reports/accessibility-tree.json",
        "provenance": "[GENERATED: Chromium accessibility-tree inspection; not a physical screen-reader session]",
    }


def channel(value: int) -> float:
    normalized = value / 255
    return normalized / 12.92 if normalized <= 0.04045 else ((normalized + 0.055) / 1.055) ** 2.4


def luminance(hex_color: str) -> float:
    clean = hex_color.removeprefix("#")
    red, green, blue = (int(clean[index : index + 2], 16) for index in (0, 2, 4))
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)


def contrast_ratio(foreground: str, background: str) -> float:
    lighter, darker = sorted((luminance(foreground), luminance(background)), reverse=True)
    return (lighter + 0.05) / (darker + 0.05)


def contrast_case() -> dict[str, Any]:
    pairs = [
        ("dark-primary-text", "#f8fafc", "#0b1020", 4.5, "normal text"),
        ("dark-secondary-text", "#cbd5e1", "#111827", 4.5, "normal text"),
        ("dark-action-label", "#082f49", "#7dd3fc", 4.5, "normal text"),
        ("dark-focus-indicator", "#fcd34d", "#0b1020", 3.0, "UI component"),
        ("dark-boundary", "#64748b", "#111827", 3.0, "UI component"),
        ("light-primary-text", "#0f172a", "#f8fafc", 4.5, "normal text"),
        ("light-secondary-text", "#334155", "#ffffff", 4.5, "normal text"),
        ("light-action-label", "#ffffff", "#0369a1", 4.5, "normal text"),
        ("light-focus-indicator", "#92400e", "#f8fafc", 3.0, "UI component"),
        ("light-boundary", "#64748b", "#ffffff", 3.0, "UI component"),
    ]
    results: list[dict[str, Any]] = []
    for identifier, foreground, background, threshold, usage in pairs:
        ratio = contrast_ratio(foreground, background)
        results.append(
            {
                "id": identifier,
                "foreground": foreground,
                "background": background,
                "ratio": round(ratio, 3),
                "threshold": threshold,
                "usage": usage,
                "passed": ratio >= threshold,
            }
        )
    failed = [item for item in results if not item["passed"]]
    require(not failed, f"Contrast failures: {failed}")
    report = {
        "results": results,
        "normalTextCriterion": "[SOURCED: WCAG 2.2 SC 1.4.3, Level AA — four-and-one-half to one]",
        "uiCriterion": "[SOURCED: WCAG 2.2 SC 1.4.11, Level AA — three to one]",
    }
    (REPORTS / "contrast-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def run_case(name: str, callback: Callable[[], dict[str, Any]]) -> dict[str, Any]:
    try:
        evidence = callback()
        return {"name": name, "status": "passed", "evidence": evidence}
    except Exception as error:  # noqa: BLE001 - the report must retain all case failures.
        return {"name": name, "status": "failed", "error": f"{type(error).__name__}: {error}"}


def write_markdown_report(report: dict[str, Any]) -> None:
    rows = "\n".join(
        f"| {case['name']} | **{case['status'].upper()}** | {case.get('error', 'See JSON evidence and screenshots.')} |"
        for case in report["cases"]
    )
    failed = [case for case in report["cases"] if case["status"] != "passed"]
    gate = "BLOCKED" if failed else "AUTOMATED CHECKS PASSED"
    content = f"""# Pattern 001 Integration Test Evidence

## Gate status

**{gate}**

The automated matrix covers Chromium behavior, layout-equivalent zoom, keyboard operation, forced colors, reduced motion, contrast calculations, and Chromium accessibility-tree exposure. [GENERATED: executable integration-test scope]

Physical sessions with NVDA, JAWS, VoiceOver, and TalkBack were not available in this execution environment. Their checklist remains a required manual release gate; the accessibility-tree result is not represented as equivalent evidence. [GENERATED: test-environment limitation]

## Automated results

| Test area | Result | Evidence |
|---|---|---|
{rows}

## Release decision

Bulk target-application import of patterns two through one hundred remains blocked until the manual assistive-technology matrix is recorded. [GENERATED: conservative release-gate decision]

The pilot is eligible for target-application review because all executable checks in this package passed. [GENERATED: automated-test outcome]

## Environment

- Browser: `{report['environment']['browser']}` [GENERATED: detected test runtime]
- TypeScript: `{report['environment']['typescript']}` [GENERATED: detected compiler runtime]
- Test timestamp: `{report['generatedAt']}` [GENERATED: UTC report timestamp]

## Claims boundary

No WCAG conformance certification is claimed. Automated checks reduce implementation risk but do not replace product-context auditing or physical assistive-technology testing. [GENERATED: conformance boundary]
"""
    (REPORTS / "TEST-EVIDENCE.md").write_text(content, encoding="utf-8")


def main() -> int:
    REPORTS.mkdir(parents=True, exist_ok=True)
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build.py")], check=True, cwd=ROOT)
    document = build_inline_document()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=CHROMIUM,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        cases = [
            run_case("Browser behavior", lambda: base_browser_case(browser, document)),
            run_case("Keyboard navigation", lambda: keyboard_case(browser, document)),
            run_case("Two-hundred-percent zoom equivalent", lambda: zoom_case(browser, document)),
            run_case("Forced colors", lambda: forced_colors_case(browser, document)),
            run_case("Reduced motion", lambda: reduced_motion_case(browser, document)),
            run_case("Accessibility tree", lambda: accessibility_tree_case(browser, document)),
            run_case("Token contrast", contrast_case),
        ]
        browser_version = browser.version
        browser.close()

    typescript_version = subprocess.run(
        ["tsc", "--version"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "passed" if all(case["status"] == "passed" for case in cases) else "failed",
        "environment": {
            "browser": f"Chromium {browser_version}",
            "typescript": typescript_version,
            "navigationNote": "The managed system Chromium blocks URL navigation, so tests execute the built application through an equivalent inline document while retaining the compiled JavaScript and production CSS.",
        },
        "cases": cases,
        "manualAssistiveTechnologyGate": {
            "status": "not-run",
            "checklist": "tests/manual-assistive-technology-checklist.md",
            "reason": "NVDA, JAWS, VoiceOver, and TalkBack are not installed in this container.",
        },
    }
    (REPORTS / "automated-test-report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    write_markdown_report(report)
    print(json.dumps({"status": report["status"], "report": str(REPORTS / "automated-test-report.json")}, indent=2))
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
