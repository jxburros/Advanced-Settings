# Changelog

Each release's section becomes its GitHub release notes, which Software Update shows in the game. Keep the newest version first, under a `## <version>` heading.

## 1.4.3

- Rewrote the README as a Stillwater press release and user manual, with new brand art and screenshots. Documentation only, so the game itself is unchanged.

## 1.4.2

- **Release fix.** Publishing a new version no longer fails the first time with “No release found”: the release tool now waits for the draft it has just created to appear.

## 1.4.1

- Refreshed the desktop, mail and mobile previews, which still showed Juno from before the rename to Bella. Documentation only, so the game itself is unchanged.

## 1.4.0

- **Progress takes more than shipping.** Every promotion after the first now waits on something only you can do, and People & Serenity only hints at what: a plugin nobody installed, the account behind it, and what the previous user left offline. Mail and the goal widget say when a growth conversation is on hold, and the Help Desk takes tickets about it.
- **The local model needs power.** Facilities won't approve it until Panel B stays on.
- **Slower, steadier progress.** Promotions come at 5, 15, 30 and 50 releases, each version takes longer to write and test, and speed boosts add up instead of multiplying, so a full set of upgrades no longer outruns the work.
- **Every project has a market.** New users get harder to win as a project fills up, so user counts settle in the tens of thousands instead of climbing into the millions. Workbench shows each project's market.
- **Stories follow what you do.** Bella files her bug once you install the Test harness, Ashleigh's reviews come one per promotion, and the duck's headlines arrive as you rise.

## 1.3.0

- **Users matter.** Each project keeps its own users. They earn a little budget while they stay and make that project's next version pay more, so a new version is no longer a worse deal than the last. They drift away from projects that haven't shipped in a while, but only while you're at the desk.
- **Upgrades.** A new Toolshed tab of upgrades you can buy again and again: more memory, an autocomplete model, a faster test suite and release notes. Each level costs 15% more and spends knowledge as well as budget.
- **Product reviews.** Ashleigh from Product asks one question every few releases in Ripple: pricing, telemetry, support and the roadmap. The answers change how the game plays, and some of them come back later in other apps.
- **Your manager walks over** if you linger on a personal page. Minimize it or lock the screen in time. A new Relaxed timing setting (Settings › Appearance) doubles the time for this and for the cake.
- **Technical debt.** Ship with known bugs to get a release out now, or write without Safe development. Either leaves debt that slows that project down until you refactor.
- **Resources.** Jobs compete for processor, memory, disk and network, and run at the pace of whichever is scarcest. Activity Monitor shows the bottleneck. QuickFix eats processor, Panel B feeds the disk, and isolating the workstation starves the network.
- **Pipeline rules.** Conductor lets you decide what the release pipeline does with each project, how many known bugs it may ship, when it refactors, and whether it keeps reading.
- **Handing over.** Principal Engineers can hand WS-0417 to its next user from Mail and start a new desk with a legacy bonus and a note to themselves.
- 22 new secrets (20 of them just for fun), six new story moments, a new ending and three new notes from the previous user.
- Saves from earlier versions are upgraded automatically.

## 1.2.5

- Renamed Juno to Bella and Neil to Reggie.

## 1.2.4

- Added design notes for deepening the incremental layer. Documentation only, so the game itself is unchanged.

## 1.2.3

- **Release fix.** The release publisher now finds its own draft, so releases can complete. 1.2.1 and 1.2.2 were never published; their changes ship in this release.

## 1.2.2

- **Windows build fix.** The DLC packer now finds its files on Windows, so the Windows edition builds again. 1.2.1 was never published; its changes ship in this release.

## 1.2.1

- **Smoother desktop.** Windows animate when they close, minimize and zoom, and double-clicking a title bar zooms again.
- Switches, sliders, the dock and menus move smoothly instead of snapping.
- Re-renders no longer interrupt hover effects or drag a slider out from under you.
- **Tidier layout.** Desktop icons and project tabs line up, the welcome window no longer covers the widgets, windows stay on screen when the browser is resized, and settings switches stay beside their labels on phones.
- **Murmur** has proper playback icons and styled sliders.

## 1.2.0

- Maintenance release.

## 1.1.0

- **Windows edition.** An installer for Windows that updates itself from GitHub Releases.
- **Software Update and DLC.** A new Software Update program (logo menu or System Settings › About) checks for new editions and installs downloadable content packs.
- **Release tasks.** Most versions now need one last task before they ship, and each program has its own: code review, bug triage, deploy windows, data migrations, probe tuning and legacy decoding.
- **A real desktop.** Menus, right-click, icon selection, drag to Trash, search (Ctrl+K), a calendar, Wi-Fi and sound controls, a lock screen and a screensaver.
- **Sound and music.** Interface sounds you can turn off, and Murmur, a music player.
- **Help Desk.** Escalating hints for whatever you're stuck on.
- **Secret Tracker.** Now records all 58 story moments, as well as 46 secrets and the endings.
- **Balance.** Promotions at 3, 7, 12 and 18 releases; later versions take longer to write and test; tools cost more later on. The browsing loss gives you one Calm Improvement Plan first, and QuickFix only grows while a build is running.

## 1.0.0

- First playable release.

### Release infrastructure migration — 2026-10-20

- Adopt the unified release manifest, version-advance validation, manual main-only planning, complete artifact staging, and verified draft publisher. Preserve local packaging, existing updater trust, and distribution identities.
- Validation: shared engine tests, workflow lint, and prepared manifest/version checks. Native/hosted consumer release dry runs and publication remain unverified until the migration is merged and credentials/settings are checked.
