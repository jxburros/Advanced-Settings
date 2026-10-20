"""Optional browser smoke test: pip install playwright; playwright install chromium.
Run with the game served on http://127.0.0.1:8000. Set CHROMIUM=/path/to/chrome to use an existing browser.
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

DOCS = Path(__file__).resolve().parents[1] / "docs"


def no_overflow(page, label):
    assert not page.evaluate("document.documentElement.scrollWidth > innerWidth"), label
    assert page.evaluate(
        "[...document.querySelectorAll('.window.focused')].every(w => w.getBoundingClientRect().right <= innerWidth + 1)"
    ), label


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=os.environ.get("CHROMIUM") or None)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.clock.install()
    page.goto("http://127.0.0.1:8000")
    expect(page.get_by_role("heading", name="Welcome to Stillwater.")).to_be_visible()
    page.get_by_role("button", name="Read later").click()
    dock = page.locator("#dock")

    page.get_by_role("button", name="Start development").click()
    page.clock.run_for(15000)
    page.get_by_role("button", name="Run tests").click()
    page.clock.run_for(9000)
    page.get_by_role("button", name="Debug feature").click()
    page.clock.run_for(9000)
    page.get_by_role("button", name="Ship v1.0").click()
    expect(page.locator("#stats")).to_contain_text("$85")
    expect(page.locator(".toast").first).to_contain_text("Pocket Notes v1.0 shipped")

    dock.get_by_role("button", name="Library").click()
    page.get_by_role("button", name="Read the documentation").click()
    dock.get_by_role("button", name="Activity Monitor").click()
    page.get_by_role("button", name="Pause Reading the documentation").click()
    page.wait_for_timeout(500)
    page.screenshot(path=str(DOCS / "desktop.png"))

    dock.get_by_role("button", name="System Settings").click()
    settings = page.locator("#win-settings")
    settings.get_by_role("button", name="Notifications").click()
    settings.get_by_role("switch", name="Enable duck-related notifications", exact=True).click()
    expect(page.get_by_text("Additional duck notification settings")).to_be_visible()

    settings.get_by_role("button", name="Advanced").click()
    for name in ["Editor", "Plugins", "Installed", "Theme Engine", "Compatibility"]:
        settings.get_by_role("button", name=name, exact=True).click()
    settings.get_by_role("button", name="Compatibility Compatibility", exact=True).click()
    expect(page.locator(".toast").first).to_contain_text("Compatibility is compatible.")
    for name in ["Legacy Themes", "Import", "Supported Formats"]:
        settings.get_by_role("button", name=name, exact=True).click()
    settings.get_by_role("switch", name="Legacy workspace compatibility").click()
    settings.get_by_role("button", name="Import Workspace").click()
    expect(page.get_by_role("heading", name="This is not a theme.")).to_be_visible()
    page.get_by_role("button", name="Continue").click()
    expect(page.get_by_role("heading", name="A workspace disguised as a theme.")).to_be_visible()
    expect(page.locator("#icons").get_by_role("button", name="Workspace Zero")).to_be_visible()

    page.reload()
    expect(page.get_by_role("heading", name="A workspace disguised as a theme.")).to_be_visible()

    page.set_viewport_size({"width": 390, "height": 844})
    no_overflow(page, "files")
    for name in ["Workbench", "Toolshed", "Library", "Conductor", "Mail", "Activity Monitor",
                 "The Daily Current", "Notes", "Files", "System Settings"]:
        dock.get_by_role("button", name=name, exact=True).click()
        expect(page.locator(f".window.focused[aria-label='{name}']")).to_be_visible()
        no_overflow(page, name)
    dock.get_by_role("button", name="Workbench", exact=True).click()
    page.wait_for_timeout(500)
    page.screenshot(path=str(DOCS / "mobile.png"))
    assert not errors, errors
    browser.close()
    print("PASS: release cycle, notifications, pause, deep settings with decoys, Workspace Zero story moment, "
          "bookmark, persistence, every app on mobile; no JS errors.")
