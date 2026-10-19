# Advanced Settings

A playable, menu-driven incremental game set on a slightly suspicious company workstation. Based on [the concept sheet](Advanced-Settings-Game-Concept.md).

## Play

Requires Python 3 (or any static web server). No build or dependencies are needed.

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000**. `npm start` runs the same server. Keep these files together: `index.html`, `style.css`, `app.js`, and `game.js`. Do not open the HTML as a `file://` URL; the browser needs HTTP to load JavaScript modules.

Choose a feature in Pocket Notes, start development, test, debug, and release. Research earns knowledge while other jobs run. Spend release income on tools and languages. Every three releases earns a promotion review in the company inbox.

- Five projects, three feature choices, nine upgrades, and five career ranks.
- Shared CPU capacity, pause/resume, safe/fast development, a release scheduler, and simulated local AI assignments.
- Four complete story arcs: the previous employee, a hacker, promotions, and an ordinary duck.
- Eight nested settings levels, two conditional discoveries, and permanent discovery bookmarks.
- Automatic local saves, JSON backup/import, and up to two hours of offline job progress. Offline work only finishes jobs already selected; it does not invent new features.
- Responsive desktop/mobile layouts, keyboard-operable controls, and reduced-motion support.

The game runs locally with no accounts, paid APIs, or real AI calls. Optional Google Fonts have system-font fallbacks. Graphics are CSS and text, so Vixl was not needed.

## Validation

Node.js 20+:

```sh
npm test
```

The engine tests cover release gating, resource sharing, progression requirements, automation, secrets, every story ending, and save restoration. Optional real-browser smoke tests (with the server running):

```sh
python -m pip install playwright
python -m playwright install chromium
python tests/browser.py
```

## Implementation decisions

The concept deliberately leaves platforms, timing, economy, characters, and endings open. This implementation uses dependency-free browser modules, short tasks (8–22 seconds before modifiers), permanent knowledge requirements, and spendable budget. Mara Chen and Meridian are original names supplied for the playable story. All paths remain available regardless of career direction; the promotion choice is narrative, not a separate skill tree. There is a completion message after all four stories, followed by unlimited free play. There is no prestige reset or backend.

Game rules live in `game.js`; presentation and browser storage in `app.js`. See [desktop preview](docs/desktop.png) and [mobile preview](docs/mobile.png).
