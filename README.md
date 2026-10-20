# Advanced Settings

A playable, menu-driven incremental game set on a slightly suspicious company workstation. Based on [the concept sheet](Advanced-Settings-Game-Concept.md).

## Play

Requires Python 3 (or any static web server). No build or dependencies are needed.

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000**. `npm start` runs the same server. Keep these files together: `index.html`, `style.css`, `app.js`, `game.js` and `assets/`. Do not open the HTML as a `file://` URL; the browser needs HTTP to load JavaScript modules.

You are a new developer at **Stillwater Systems**, a company that sells calm. The game is a desktop operating system, Stillwater OS: drag, resize, minimize and zoom windows, switch tabs, read notifications, and open programs from the dock. It is meant to be a **difficult puzzle game**: most of what matters is hidden, and the hints are small.

| Program | What it does |
| --- | --- |
| Workbench | One tab per project: choose a feature, write, test, debug, ship. Each project behaves differently. |
| Toolshed | Spend budget on languages, tools, hardware and AI help. |
| Library | Read the documentation for knowledge while other jobs run. |
| Conductor | The release pipeline and the AI assistant's assignment. |
| Mail | Promotions, warnings from People & Serenity, and recovered mail from the previous user. |
| Activity Monitor | Processes, diagnostic channels, security incidents, the event log. |
| The Daily Current | Duck headlines, and a corrections desk that only accepts the true explanation. |
| Wayfinder | A web browser behind a company filter that blocks nearly everything. A few sites can be reached anyway. |
| Notes | Sticky notes left by the previous user, found as you go deeper. |
| Files | Discoveries and downloads. |
| System Settings | Appearance and settings that go much deeper than they look. |

- **Work:** five projects, three features, nine upgrades, five ranks. Career tracks change how you work. Lunchboard earns while it runs, Archive Index reveals records, and Quiet Monitor shows what is watching you.
- **Puzzles:** a deep settings maze, conditional discoveries, duck corrections that need evidence from elsewhere, a credential you have to work out, and three mini games (a sudoku, a breaker panel and a packet trace).
- **Messing around:** shopping, blogging and gaming on a work computer, each behind its own way past the filter. Personal use lowers your Calm Index.
- **Losing:** there are two ways to lose, and both come with warnings. Only a player who ignores those warnings will lose this way.
- **Secret Tracker:** after your first win or loss, a tracker of every secret and ending you've found appears in the dock. It persists across new workstations.
- **Returning:** closing the game and coming back has a small effect each time, and it adds up.
- Automatic local saves (older saves are migrated), JSON backup/import, up to two hours of offline job progress (offline time can never lose you the game), phone layout, keyboard controls and reduced motion.

Everything runs locally with no accounts, paid APIs or real AI calls; the web is simulated. Optional Google Fonts fall back to system fonts. The watercolor wallpapers in `assets/wallpapers` were painted with [Vixl](https://github.com/jxburros/Vixl); `tools/make-wallpapers.py` regenerates them. Icons are inline SVG.

Full solutions are in [docs/SECRETS.md](docs/SECRETS.md). **It contains spoilers.**

## Validation

Node.js 20+:

```sh
npm test
```

The engine tests cover release gating, resource sharing, career tracks, the filter and its workarounds, every mini game (including sudoku uniqueness and breaker solvability), both losses, the cross-play archive, returns, every story ending, and save restoration and migration. Optional real-browser smoke tests (with the server running):

```sh
python -m pip install playwright
python -m playwright install chromium   # or set CHROMIUM=/path/to/chrome
python tests/browser.py
```

## Implementation decisions

The concept deliberately leaves platforms, timing, economy, characters, and endings open. This implementation uses dependency-free browser modules, short tasks (8–22 seconds before modifiers), permanent knowledge requirements, and spendable budget. Mara Chen and Stillwater Systems are original names supplied for the playable story. All paths remain available regardless of career direction; the promotion choice is narrative, not a separate skill tree. There is a completion message after all four stories, followed by unlimited free play. Losing ends the workstation; a new one starts from scratch, but the Secret Tracker remembers. There is no backend.

Game rules live in `game.js`; the desktop, windows, story moments and browser storage live in `app.js`. Window layout and appearance preferences are stored separately from the game save, so a save file never depends on screen size. The Secret Tracker has its own storage key, so starting a new workstation never clears it. A return counts once per browser session, so reloading the page does not count. See [desktop preview](docs/desktop.png) and [mobile preview](docs/mobile.png).
