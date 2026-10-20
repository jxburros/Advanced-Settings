# Advanced Settings

A playable, menu-driven incremental game set on a slightly suspicious company workstation. Based on [the concept sheet](Advanced-Settings-Game-Concept.md).

## Play

Requires Python 3 (or any static web server). No build or dependencies are needed.

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000**. `npm start` runs the same server. Keep these files together: `index.html`, `style.css`, `app.js`, `game.js` and `assets/`. Do not open the HTML as a `file://` URL; the browser needs HTTP to load JavaScript modules.

You are a new developer at **Stillwater Systems**, a company that sells calm. The game is a desktop operating system, Stillwater OS: drag, resize, minimize and zoom windows, switch tabs, read notifications, and open programs from the dock.

| Program | What it does |
| --- | --- |
| Workbench | One tab per project: choose a feature, write, test, debug, ship. |
| Toolshed | Spend budget on languages, tools, hardware and AI help. |
| Library | Read the documentation for knowledge while other jobs run. |
| Conductor | The release pipeline and the AI assistant's assignment. |
| Mail | Promotions from People & Serenity; recovered mail from the previous user. |
| Activity Monitor | Processes (pause and resume), diagnostic channels, security incidents, the event log. |
| The Daily Current | The company newsletter's increasingly alarming duck coverage, and what actually happened. |
| Notes | Sticky notes left by the previous user, found as you go deeper. |
| Files | Discoveries, bookmarked automatically. |
| System Settings | Wallpaper, transparency, accent, reduced motion, and settings that go much deeper than they look. |

- Five projects, three feature choices, nine upgrades, five career ranks.
- Shared processor capacity, pause/resume, safe/fast development, a release scheduler, simulated local AI.
- Four stories: the previous employee, an over-helpful plugin, promotions, and an ordinary duck. Three story moments interrupt the calm.
- An eight-level settings explorer with decoy folders, two conditional discoveries, and permanent bookmarks.
- Automatic local saves, JSON backup/import, and up to two hours of offline job progress.
- Responsive desktop and phone layouts, keyboard-operable controls, and reduced-motion support.

Everything runs locally with no accounts, paid APIs or real AI calls. Optional Google Fonts fall back to system fonts. The watercolor wallpapers in `assets/wallpapers` were painted with [Vixl](https://github.com/jxburros/Vixl); `tools/make-wallpapers.py` regenerates them. Icons are inline SVG.

## Validation

Node.js 20+:

```sh
npm test
```

The engine tests cover release gating, resource sharing, progression requirements, automation, secrets, every story ending, and save restoration. Optional real-browser smoke tests (with the server running):

```sh
python -m pip install playwright
python -m playwright install chromium   # or set CHROMIUM=/path/to/chrome
python tests/browser.py
```

## Implementation decisions

The concept deliberately leaves platforms, timing, economy, characters, and endings open. This implementation uses dependency-free browser modules, short tasks (8–22 seconds before modifiers), permanent knowledge requirements, and spendable budget. Mara Chen and Stillwater Systems are original names supplied for the playable story. All paths remain available regardless of career direction; the promotion choice is narrative, not a separate skill tree. There is a completion message after all four stories, followed by unlimited free play. There is no prestige reset or backend.

Game rules live in `game.js`; the desktop, windows, story moments and browser storage live in `app.js`. Window layout and appearance preferences are stored separately from the game save, so a save file never depends on screen size. See [desktop preview](docs/desktop.png) and [mobile preview](docs/mobile.png).
