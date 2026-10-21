# Advanced Settings

A playable, menu-driven incremental game set on a slightly suspicious company workstation. Based on [the concept sheet](Advanced-Settings-Game-Concept.md).

## Play

**Windows:** download `Advanced-Settings-Setup-<version>.exe` from the [latest release](https://github.com/jxburros/Advanced-Settings/releases/latest) and run it. The Windows edition updates itself and installs DLC from Software Update (logo menu, or System Settings › About). The installer isn't code-signed yet, so Windows may ask you to confirm ("More info › Run anyway").

**In a browser:** requires Python 3 (or any static web server). No build or dependencies are needed.

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000**. `npm start` runs the same server. Keep these files together: `index.html`, `style.css`, `app.js`, `game.js`, `tasks.js`, `stories.js`, `sound.js` and `assets/`. Do not open the HTML as a `file://` URL; the browser needs HTTP to load JavaScript modules.

You are a new developer at **Stillwater Systems**, a company that sells calm. The game is a desktop operating system, Stillwater OS: drag, resize, minimize and zoom windows; open menus from the menu bar; right-click the desktop; select icons with a click or a selection box and open them with a double-click; drag files to the Trash; search with Ctrl+K; check the calendar, Wi-Fi and sound from the menu bar; lock the screen; and let the screensaver take over when you step away. It is meant to be a **difficult puzzle game**: most of what matters is hidden, and the hints are small.

| Program | What it does |
| --- | --- |
| Workbench | One tab per project: choose a feature, write, test, debug, perform the release task, ship. Each project behaves differently. |
| Toolshed | Spend budget on languages, tools, hardware and AI help. |
| Library | Read the documentation for knowledge while other jobs run. |
| Conductor | The release pipeline and the AI assistant's assignment. |
| Mail | Promotions, warnings, office incidents, recovered mail from the previous user, and a Personal tab where your parents have somehow found your work address. |
| Activity Monitor | Processes, diagnostic channels, security incidents, the event log. |
| The Daily Current | Duck headlines, and a corrections desk that only accepts the true explanation. |
| Wayfinder | A web browser behind a company filter that blocks nearly everything. A few sites can be reached anyway. |
| Ripple | Instant messages from coworkers. Answer with choices, or type when you need to remember something. |
| Notes | Sticky notes left by the previous user, found as you go deeper. |
| Files | Discoveries and downloads. |
| System Settings | Appearance, sound and settings that go much deeper than they look. |
| Murmur | A music player. It plays your tracks from `assets/music` (see the README there) and some built-in hold music. |
| Help Desk | Help › Help Desk: escalating hints for whatever you're stuck on. |
| Software Update | Checks GitHub for newer editions (and installs them in the Windows edition), and lists downloadable content. |

- **Work:** five projects, three features, nine tools to install and four upgrades to buy again and again, five ranks (at 5, 15, 30 and 50 releases, and every promotion after the first also waits on a puzzle). Before most versions ship there is a release task, and each project has its own kinds: code review and bug triage (Pocket Notes), deploying between lunch rushes (Lunchboard), ordering a data migration (Archive Index), tuning a probe (Quiet Monitor) and decoding legacy notes (Workspace Zero). Tasks grow with each project and each version, and the scheduler won't do them for you; an AI assistant assigned to development will, slowly. Each version of a project takes longer to write and test than the last, so new projects pay off. Career tracks change how you work. Each project keeps its own users: they pay while they stay, make the next version pay more, drift away from projects that stop shipping, and each project can only find so many. Speed boosts add up rather than multiply. Lunchboard earns while it runs, Archive Index reveals records, and Quiet Monitor shows what is watching you.
- **Puzzles:** progress is never only a matter of shipping. Growth conversations go on hold until you deal with something only you can (an unsigned plugin, the credential behind it, what the previous user left offline), and the local model waits on a power panel. A deep settings maze, conditional discoveries, duck corrections that need evidence from elsewhere, a credential you have to work out, and three mini games (a sudoku, a breaker panel and a packet trace).
- **People:** Bella, a friend from QA, goes on a wellness retreat and comes back far too calm. Reggie from Platform always wants to hear about your plans outside work, for reasons he can't say. Your parents have been sent Stillwater's undisclosed consumer products. Greg and the previous user each have a later chapter. Several of these stories connect to each other and to the puzzles.
- **Technical debt, resources and rules:** ship with known bugs and pay it back later with a refactor; jobs compete for processor, memory, disk and network; and the release pipeline follows rules you set per project.
- **Handing over:** once you're a Principal Engineer you can hand the workstation to its next user and start again with a legacy bonus and a note to yourself.
- **Product reviews:** one question early on and one per promotion, from pricing to telemetry, with consequences that turn up later somewhere else.
- **Short incidents:** an all-staff reply-all storm, birthday cake that disappears quickly, an IT phishing test, and a manager who walks over while you're on a personal page. Settings › Appearance › Relaxed timing doubles every time limit.
- **Messing around:** shopping, blogging and gaming on a work computer, each behind its own way past the filter. Personal use lowers your Calm Index.
- **Losing:** there are two ways to lose, and both come with warnings. Only a player who ignores those warnings will lose this way. Browsing too much gets you a Calm Improvement Plan first; only a second offence ends the workstation.
- **Help Desk:** Help › Help Desk takes a ticket for any open problem. The first answer is vague; better answers unlock after a few minutes, and the last one is the solution.
- **Secret Tracker:** after your first win or loss, a tracker appears in the dock. It lists every story moment (64, of which those marked “needed for probation” are required and many are optional or rule each other out), every secret (68) and every ending. It persists across new workstations.
- **Sound:** interface sounds (clicks, chimes, windows, alerts, a startup chord) are synthesized in the browser and can be switched off in the menu bar or System Settings › Sound.
- **Returning:** closing the game and coming back (or leaving it in the background for 20 minutes) has a small effect each time, and it adds up.
- Automatic local saves (older saves are migrated), JSON backup/import, up to two hours of offline job progress (time away, including a background tab, can never lose you the game), phone layout, keyboard controls and reduced motion.

Everything runs locally with no accounts, paid APIs or real AI calls; the web is simulated. Optional Google Fonts fall back to system fonts. The watercolor wallpapers in `assets/wallpapers` were painted with [Vixl](https://github.com/jxburros/Vixl); `tools/make-wallpapers.py` regenerates them, and `tools/make-cover.py` paints Murmur's cover art. Sounds and hold music are synthesized with Web Audio; there are no audio files unless you add music. Icons are inline SVG.

Full solutions are in [docs/SECRETS.md](docs/SECRETS.md). **It contains spoilers.**

## Releases, updates and DLC

On github.com, **Actions › Release › Run workflow** with a version (or no version, for a test installer) builds and publishes a release without a terminal; [docs/RELEASING.md](docs/RELEASING.md#from-the-github-website-no-terminal) walks through it click by click. From a terminal, pushing a tag like `v1.2.0` does the same: tests, a self-updating Windows installer, a web-edition zip, and notes from [CHANGELOG.md](CHANGELOG.md). Pushing `dlc-<id>-v1.0.0` publishes a DLC pack from `dlc/packs/<id>` and adds it to the catalog. The details, including signing and local builds, are in [docs/RELEASING.md](docs/RELEASING.md); the pack format is in [dlc/README.md](dlc/README.md). The Windows edition is an Electron shell (`desktop/`) around the same files the web edition serves; the game itself still needs no build.

## Validation

Node.js 20+:

```sh
npm test
```

The engine tests cover release gating, every kind of release task (and that every generated task is solvable), story moments, resource sharing, career tracks, the filter and its workarounds, every mini game (including sudoku uniqueness and breaker solvability), both losses, the cross-play archive, returns, every story ending, and save restoration and migration. Optional real-browser smoke tests (with the server running):

```sh
python -m pip install playwright
python -m playwright install chromium   # or set CHROMIUM=/path/to/chrome
python tests/browser.py
```

## Implementation decisions

The concept deliberately leaves platforms, timing, economy, characters, and endings open. This implementation uses dependency-free browser modules, short tasks (8–22 seconds before modifiers, growing 60% per version written), permanent knowledge requirements, and spendable budget. Mara Chen and Stillwater Systems are original names supplied for the playable story. All paths remain available regardless of career direction; the promotion choice is narrative, not a separate skill tree. There is a completion message after all four stories, followed by unlimited free play. Losing ends the workstation (the browsing loss only after one Calm Improvement Plan); a new one starts from scratch, but the Secret Tracker remembers. There is no backend.

Game rules live in `game.js`, release tasks in `tasks.js`, conversation scripts and incidents in `stories.js`, sounds and the music player in `sound.js`, and the desktop, windows, story moments and browser storage in `app.js`. Window layout and appearance preferences are stored separately from the game save, so a save file never depends on screen size. The Secret Tracker has its own storage key, so starting a new workstation never clears it. A return counts once per browser session, so reloading the page does not count. See [desktop preview](docs/desktop.png) and [mobile preview](docs/mobile.png).

## Unified release procedure

`release.json` is the authoritative release manifest. Keep configured embedded versions synchronized and advance affected apps (patch by default) before merging changes into main. The first adoption establishes a baseline; later PRs must pass **Release version validation**.

Use **Actions → Release → Run workflow** from **main**, choose stable or preview, and leave **dry_run** enabled first. Only apps ahead of their published version in their own namespace are selected. Build/test/sign all required packages before publishing. Tag pushes and merges no longer publish migrated apps automatically. After inspecting the dry run, dispatch with dry_run disabled and satisfy configured approvals. Published versions are never overwritten; use a new version for a correction.

See [.release/README.md](.release/README.md) for this repository's inventory, credentials, compatibility, and validation limits. Shared implementation: [JX Holdings release infrastructure](https://github.com/JX-Holdings-LLC/release-infrastructure).
