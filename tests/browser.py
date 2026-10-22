"""Optional browser smoke test: pip install playwright; playwright install chromium.
Run with the game served on http://127.0.0.1:8000. Set CHROMIUM=/path/to/chrome to use an existing browser.
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

DOCS = Path(__file__).resolve().parents[1] / "docs"
SOLUTION = "417396825852417369396852471173968542968524137524173986739685214241739658685241793"


def no_overflow(page, label):
    assert not page.evaluate("document.documentElement.scrollWidth > innerWidth"), label
    assert page.evaluate(
        "[...document.querySelectorAll('.window.focused')].every(w => w.getBoundingClientRect().right <= innerWidth + 1)"
    ), label


def go(page, url):
    address = page.locator("#address")
    address.fill(url)
    address.press("Enter")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=os.environ.get("CHROMIUM") or None)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    # No real network: GitHub answers with a pretend newer release and an empty DLC catalog.
    release = {"tag_name": "v9.9.9", "html_url": "https://github.com/jxburros/Advanced-Settings/releases/tag/v9.9.9",
               "body": "## 9.9.9\n- **Ducks.** More of them.", "assets": [{"name": "Advanced-Settings-Setup-9.9.9.exe",
               "browser_download_url": "https://github.com/jxburros/Advanced-Settings/releases/download/v9.9.9/Advanced-Settings-Setup-9.9.9.exe"}]}
    context.route("https://api.github.com/**", lambda route: route.fulfill(json=release))
    context.route("https://raw.githubusercontent.com/**", lambda route: route.fulfill(json=[]))
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.clock.install()
    page.goto("http://127.0.0.1:8000")
    # The title screen comes first. With no save, there is nothing to continue.
    expect(page.get_by_role("heading", name="Advanced Settings")).to_be_visible()
    expect(page.get_by_role("button", name="Continue Game")).to_be_disabled()
    page.get_by_role("button", name="Secrets").click()
    page.get_by_role("tab", name="Achievements", exact=False).click()
    expect(page.locator("#title").get_by_text("Find your first secret.")).to_be_visible()
    page.keyboard.press("Escape")
    page.get_by_role("button", name="New Game").click()
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

    # A work friend and your parents get in touch.
    page.clock.run_for(32000)
    dock.get_by_role("button", name="Ripple").click()
    chat = page.locator("#win-ripple")
    expect(chat.get_by_text("bella, QA, two desks over", exact=False)).to_be_visible()
    chat.get_by_role("button", name="I noticed that too.").click()
    expect(chat.get_by_text("FINALLY. a person with eyes.")).to_be_visible()
    dock.get_by_role("button", name="Mail").click()
    mail = page.locator("#win-mail")
    mail.get_by_role("tab", name="Personal").click()
    mail.get_by_role("button", name="What pilot program?").click()
    expect(mail.get_by_text("intranet.stillwater/pilots", exact=False)).to_be_visible()
    page.wait_for_timeout(300)
    page.screenshot(path=str(DOCS / "ripple.png"))

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

    # Developer options hide behind the build number.
    dock.get_by_role("button", name="System Settings").click()
    settings.get_by_role("button", name="About").click()
    for _ in range(7):
        settings.get_by_role("button", name="Build 9.4.17 (Tide)").click()
    expect(settings.get_by_role("heading", name="Developer")).to_be_visible()
    settings.locator("#installs").select_option("identified")

    # The web: blocked, translated, and the classroom route to a game store.
    dock.get_by_role("button", name="Wayfinder").click()
    web = page.locator("#win-browser")
    go(page, "tidepool.games")
    expect(web.get_by_text("This page is not part of a calm workday.")).to_be_visible()
    go(page, "learn.tidepool.games")
    web.get_by_role("button", name="Download Tidepool Classroom").click()
    dock.get_by_role("button", name="Files").click()
    page.locator("#win-files").get_by_role("tab", name="Downloads").click()
    page.get_by_role("button", name="Open installer").click()
    tide = page.locator("#win-tidepool")
    expect(tide).to_be_visible()
    tide.get_by_role("button", name="Get").click()
    tide.get_by_role("button", name="Play").click()
    for i, (given, digit) in enumerate(zip(page.evaluate("import('./game.js').then(g => g.SUDOKU.givens)"), SOLUTION)):
        if given == "0":
            page.locator(f"#su-{i}").fill(digit)
    expect(page.locator("#win-sudoku").get_by_text("Solved.")).to_be_visible()
    dock.get_by_role("button", name="Tidepool").click()
    tide.get_by_role("tab", name="Community").click()
    expect(tide.get_by_text("quillpost.blog/marachen")).to_be_visible()

    # Mara's blog, through Translate.
    dock.get_by_role("button", name="Wayfinder").click()
    go(page, "quillpost.blog/marachen")
    expect(web.get_by_text("Blogs & social")).to_be_visible()
    go(page, "translate.stillwater")
    page.locator("#translate-url").fill("quillpost.blog/marachen")
    page.locator("#translate-url").press("Enter")
    page.locator("#blogpw").fill(SOLUTION[:9])
    page.locator("#blogpw").press("Enter")
    expect(web.get_by_text("Things I left on WS-0417")).to_be_visible()
    go(page, "intranet.stillwater/pilots")
    expect(web.get_by_text("Hold the dial down for ten seconds", exact=False)).to_be_visible()
    go(page, "ws-0417.local")
    expect(web.get_by_role("heading", name="Where the duck will be.")).to_be_visible()

    # The duck desk rejects a wrong correction and closes for a minute.
    dock.get_by_role("button", name="The Daily Current").click()
    news = page.locator("#win-news")
    news.get_by_text("It is nesting under the lobby ficus.").click()
    news.get_by_role("button", name="File correction").click()
    expect(news.get_by_role("button", name="The desk is not taking questions right now")).to_be_visible()

    # A real desktop: menus, the calendar, search, sound, music and the lock screen.
    bar = page.locator(".menubar")
    for i in range(5):
        bar.get_by_role("button", name="Edit").click()
        page.locator("#pop").get_by_role("menuitem", name="Undo").click()
    page.locator("#clock").click()
    page.locator("#pop .cal button.event").first.click()
    expect(page.locator("#pop .event-card")).to_contain_text("Panel B maintenance")
    page.keyboard.press("Escape")
    page.keyboard.press("Control+k")
    page.locator("#launcher-q").fill("duck")
    expect(page.locator("#launcher").get_by_text("Board member", exact=False)).to_be_visible()
    page.keyboard.press("Escape")
    page.mouse.click(1250, 540, button="right")
    expect(page.locator("#pop").get_by_role("menuitem", name="Get Info")).to_be_visible()
    page.keyboard.press("Escape")
    page.locator("#volume").click()
    page.locator("#pop").get_by_role("switch", name="Interface sounds").click()
    page.keyboard.press("Escape")
    dock.get_by_role("button", name="System Settings").click()
    settings.get_by_role("button", name="Sound").click()
    settings.locator("#alert").select_option("quack")
    dock.get_by_role("button", name="Murmur").click()
    page.locator("#win-music").get_by_role("button", name="Play", exact=True).click()
    expect(page.locator("#nowplaying")).to_contain_text("Please Continue to Hold")
    page.locator("#win-music").get_by_role("button", name="Pause").click()
    page.keyboard.press("Control+Shift+L")
    page.get_by_role("button", name="Other user: mchen").click()
    page.locator("#mchen-pw").fill(SOLUTION[:9])
    page.locator("#mchen-pw").press("Enter")
    expect(page.get_by_text("for-whoever.txt")).to_be_visible()
    page.get_by_role("button", name="Sign out").click()
    page.get_by_role("button", name="Unlock").click()
    found = page.evaluate("JSON.parse(localStorage.getItem('stillwater-workstation')).secrets")
    for sid in ["undo", "calendar", "search", "quiet", "quack", "mchen"]:
        assert sid in found, sid

    # Software Update found the pretend release when the game started.
    page.locator(".menubar").get_by_role("button", name="Stillwater menu").click()
    page.locator("#pop").get_by_role("menuitem", name="Software Update… · 1 update").click()
    updates = page.locator("#win-updates")
    expect(updates.get_by_text("Advanced Settings 9.9.9 is available")).to_be_visible()
    expect(updates.get_by_role("link", name="Download the Windows installer")).to_have_attribute("href", release["assets"][0]["browser_download_url"])
    updates.get_by_role("tab", name="DLC").click()
    expect(updates.get_by_text("No downloadable content yet", exact=False)).to_be_visible()
    updates.get_by_role("button", name="Close Software Update").click()

    # The Help Desk answers vaguely at first, and better answers take a while.
    page.locator(".menubar").get_by_role("button", name="Help").click()
    page.locator("#pop").get_by_role("menuitem", name="Help Desk").click()
    help_desk = page.locator("#win-help")
    help_desk.get_by_role("button", name="Open a ticket about The duck story").click()
    expect(help_desk.get_by_text("One of them is never empty", exact=False)).to_be_visible()
    expect(help_desk.get_by_role("button", name="Next answer in about 3 min")).to_be_disabled()
    help_desk.get_by_role("button", name="Close Help Desk").click()

    # Leaving and returning slowly changes the desk.
    for _ in range(4):
        page.close()
        page = context.new_page()
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.clock.install()
        page.goto("http://127.0.0.1:8000")
        page.get_by_role("button", name="Continue Game").click()
    dock = page.locator("#dock")
    web = page.locator("#win-browser")
    expect(page.locator("#icons").get_by_role("button", name="Welcome (2).pdf")).to_be_visible()
    expect(page.get_by_role("heading", name="Gentle Sudoku · leaderboard")).to_be_attached()

    # Personal use catches up with you: first a plan, then a loss that unlocks the Secret Tracker,
    # which survives a new desk.
    def concern(warned):
        page.evaluate(
            "w => { const s = JSON.parse(localStorage.getItem('stillwater-workstation')); s.suspicion = 99; s.warned = w; s.training = 0;"
            " localStorage.setItem('stillwater-workstation', JSON.stringify(s)); Storage.prototype.setItem = () => {}; }",
            warned,
        )
        page.reload()
        page.get_by_role("button", name="Continue Game").click()
        dock.get_by_role("button", name="Wayfinder").click()
        go(page, "somewhere.shop")

    concern(2)
    expect(web.get_by_role("heading", name="Mandatory Calm Security Training")).to_be_visible()
    dock.get_by_role("button", name="Mail").click()
    page.locator("#win-mail").get_by_role("tab", name="Inbox").click()
    expect(page.locator("#win-mail").get_by_text("Your Calm Improvement Plan")).to_be_visible()
    page.wait_for_timeout(1500)
    concern(3)
    expect(page.get_by_role("heading", name="Your role has been released.")).to_be_visible()
    page.get_by_role("button", name="Open Secret Tracker").click()
    tracker = page.locator("#win-tracker")
    expect(tracker.get_by_text("First release")).to_be_visible()
    expect(tracker.get_by_text("needed for probation").first).to_be_visible()
    tracker.get_by_role("tab", name="Secrets", exact=False).click()
    expect(tracker.get_by_text("Gentle solver")).to_be_visible()
    tracker.get_by_role("tab", name="Endings", exact=False).click()
    expect(tracker.get_by_text("Released to the community")).to_be_visible()
    page.locator("#widgets").get_by_role("button", name="Start again").click()
    expect(page.get_by_role("heading", name="Welcome to Stillwater.")).to_be_visible()
    expect(dock.get_by_role("button", name="Secret Tracker")).to_be_visible()

    # Secrets that are just for fun, on the new desk.
    for _ in range(10):
        page.keyboard.press("Escape")
    expect(page.locator(".toast", has_text="There is no escape")).to_be_visible()
    page.keyboard.press("Control+k")
    page.locator("#launcher-q").fill("sudo make me a sandwich")
    expect(page.locator("#launcher").get_by_text("You are not in the sudoers file.")).to_be_visible()
    page.keyboard.press("Escape")
    for _ in range(20):
        page.locator("#clock").click()
    for _ in range(5):
        page.keyboard.press("Control+Shift+L")
        page.get_by_role("button", name="Unlock").click()
    page.locator("#wifi").click()
    for net in ["Stillwater-Guest", "Greg’s Hotspot (heater)", "Definitely Not People & Serenity"]:
        page.locator("#pop").get_by_role("menuitem", name=net).click()
        page.locator("#wifi").click()
    page.keyboard.press("Escape")
    for _ in range(4):
        page.locator("#icons").get_by_role("button", name="Welcome.pdf").dblclick()
    dock.get_by_role("button", name="System Settings").click()
    settings = page.locator("#win-settings")
    settings.get_by_role("button", name="Appearance").click()
    for i in range(10):
        settings.get_by_role("button", name=["pink accent", "lilac accent"][i % 2]).click()
    for wall in settings.locator("button.wall").all():
        wall.click()
    dock.get_by_role("button", name="Murmur").click()
    murmur = page.locator("#win-music")
    murmur.get_by_role("button", name="Shuffle").click()
    murmur.get_by_role("button", name="Repeat").click()
    murmur.get_by_label("Music volume").fill("0")
    murmur.get_by_role("button", name="Play", exact=True).click()
    for b in dock.locator(".dock-item").all():
        b.click()
    grip = page.locator(".window.focused .grip")
    box = grip.bounding_box()
    page.mouse.move(box["x"] + 4, box["y"] + 4)
    page.mouse.down()
    page.mouse.move(box["x"] - 900, box["y"] - 900, steps=4)
    page.mouse.up()
    page.clock.run_for(3000)
    page.wait_for_timeout(300)
    found = page.evaluate("JSON.parse(localStorage.getItem('stillwater-workstation')).secrets")
    for sid in ["escape", "sudo", "clockwatcher", "paranoid", "wardriving", "welcomeagain", "indecisive", "scenery",
                "forever", "silentdisco", "fullhouse", "tiny"]:
        assert sid in found, (sid, found)
    murmur_toggle = page.locator("#win-music").get_by_role("button", name="Pause", exact=True)
    if murmur_toggle.count():
        murmur_toggle.click()

    page.set_viewport_size({"width": 390, "height": 844})
    for name in ["Workbench", "Toolshed", "Library", "Conductor", "Mail", "Activity Monitor",
                 "The Daily Current", "Wayfinder", "Notes", "Files", "Secret Tracker", "System Settings", "Murmur"]:
        dock.get_by_role("button", name=name, exact=True).click()
        expect(page.locator(f".window.focused[aria-label='{name}']")).to_be_visible()
        no_overflow(page, name)
    dock.get_by_role("button", name="Workbench", exact=True).click()
    page.clock.run_for(7000)
    page.wait_for_timeout(500)
    page.screenshot(path=str(DOCS / "mobile.png"))
    assert not errors, errors
    browser.close()
    print("PASS: release cycle, deep settings, Workspace Zero, developer options, filter and Translate, "
          "game store install, sudoku, Mara's blog, IM and family mail, pilots page, duck dashboard, duck desk lockout, returns, "
          "Software Update and DLC, menus, calendar, search, sound settings, Murmur, lock screen, Help Desk, the improvement plan, story moments, firing, Secret Tracker across workstations, fun secrets, every app on mobile; no JS errors.")
