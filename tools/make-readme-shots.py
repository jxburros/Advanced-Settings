"""Capture the in-game screenshots used in README.md (docs/img/*.png).

    python3 -m http.server 8000 &
    python3 tools/make-readme-shots.py       # set CHROMIUM=/path/to/chrome if needed
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

OUT = Path(__file__).resolve().parents[1] / "docs" / "img"
OUT.mkdir(exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=os.environ.get("CHROMIUM") or None)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    context.route("https://api.github.com/**", lambda route: route.fulfill(status=404, json={}))
    context.route("https://raw.githubusercontent.com/**", lambda route: route.fulfill(json=[]))
    page = context.new_page()
    page.clock.install()
    page.goto("http://127.0.0.1:8000")
    page.get_by_role("button", name="Read later").click()
    dock = page.locator("#dock")

    def go(url):
        address = page.locator("#address")
        address.fill(url)
        address.press("Enter")

    # Workbench, mid-feature.
    page.get_by_role("button", name="Start development").click()
    page.clock.run_for(7000)
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "workbench.png"))
    page.get_by_role("button", name="Close Workbench").click()

    # Toolshed.
    dock.get_by_role("button", name="Toolshed").click()
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "toolshed.png"))
    page.get_by_role("button", name="Close Toolshed").click()

    # The filter.
    dock.get_by_role("button", name="Wayfinder").click()
    go("tidepool.games")
    expect(page.locator("#win-browser").get_by_text("This page is not part of a calm workday.")).to_be_visible()
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "wayfinder.png"))
    page.get_by_role("button", name="Close Wayfinder").click()

    # Settings, with one switch that starts on.
    dock.get_by_role("button", name="System Settings").click()
    settings = page.locator("#win-settings")
    settings.get_by_role("button", name="Notifications").click()
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "settings.png"))
    browser.close()
