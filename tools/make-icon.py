"""Render the app icon (build/icon.png, 512x512) from the same drop logo as the favicon.

    python3 tools/make-icon.py        (needs Playwright with Chromium)
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT = Path(__file__).resolve().parents[1] / "build" / "icon.png"
SVG = """<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='512' height='512'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6f97dc'/><stop offset='1' stop-color='#e48cb0'/></linearGradient>
<radialGradient id='s' cx='.3' cy='.2' r='.8'><stop offset='0' stop-color='#fff' stop-opacity='.35'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient></defs>
<rect x='1' y='1' width='30' height='30' rx='8' fill='url(#g)'/><rect x='1' y='1' width='30' height='30' rx='8' fill='url(#s)'/>
<path d='M16 6.5c3.2 4.2 6.3 7.8 6.3 11.4a6.3 6.3 0 0 1-12.6 0c0-3.6 3.1-7.2 6.3-11.4z' fill='none' stroke='white' stroke-width='2' stroke-linejoin='round'/>
<path d='M13.2 18.6a2.9 2.9 0 0 0 2.4 2.6' fill='none' stroke='white' stroke-width='1.4' stroke-linecap='round' opacity='.8'/></svg>"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROMIUM") or None)
    page = b.new_page(viewport={"width": 512, "height": 512})
    page.set_content(f"<html><body style='margin:0;background:transparent'>{SVG}</body></html>")
    page.locator("svg").screenshot(path=str(OUT), omit_background=True)
    b.close()
print(OUT)
