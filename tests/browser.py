"""Optional browser smoke test: pip install playwright; playwright install chromium.
Run with the game served on http://127.0.0.1:8000.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1100})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.clock.install()
    page.goto('http://127.0.0.1:8000')
    page.get_by_role('heading', name='A little more capable.').wait_for()
    page.screenshot(path=str(Path(__file__).resolve().parents[1] / 'docs/desktop.png'), full_page=True)
    page.get_by_role('button', name='Start development').click()
    page.clock.run_for(15000)
    page.get_by_role('button', name='Run tests').click()
    page.clock.run_for(9000)
    page.get_by_role('button', name='Debug feature').click()
    page.clock.run_for(9000)
    page.get_by_role('button', name='Ship v1.0').click()
    assert page.locator('#stats').inner_text().find('$85') >= 0
    page.get_by_role('button', name='Start research').click()
    page.get_by_role('button', name='Ⅱ Pause').click()
    page.get_by_role('link', name='⚙ Settings', exact=True).click()
    page.get_by_role('switch', name='Enable duck-related notifications', exact=True).click()
    assert page.get_by_text('Additional duck notification settings').is_visible()
    for _ in range(8):
        page.get_by_role('button', name='Open →', exact=True).click()
    page.get_by_role('switch', name='Legacy workspace compatibility').click()
    page.get_by_role('button', name='Import Workspace →').click()
    assert page.get_by_role('heading', name='A workspace disguised as a theme.').is_visible()
    assert page.get_by_role('link', name='↳ Workspace Zero').is_visible()
    page.reload()
    assert page.get_by_role('heading', name='A workspace disguised as a theme.').is_visible()
    page.get_by_role('link', name='◫ Overview', exact=True).click()
    page.set_viewport_size({'width':390,'height':844})
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
    page.screenshot(path=str(Path(__file__).resolve().parents[1] / 'docs/mobile.png'), full_page=True)
    for name in ['⌘ Projects', '⌥ Skills & tools', '⇄ Automation', '✉ Company inbox', '⌁ Diagnostics', '⚙ Settings']:
        page.get_by_role('link', name=name, exact=True).click()
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), name
    assert not errors, errors
    browser.close()
    print('PASS: release cycle, pause, hidden workspace, bookmark, persistence, mobile navigation; no JS errors.')
