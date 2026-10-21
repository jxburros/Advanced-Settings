# Changelog

Each release's section becomes its GitHub release notes, which Software Update shows in the game. Keep the newest version first, under a `## <version>` heading.

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
