# DLC packs

A DLC pack is a folder in `dlc/packs/<id>/` with a `manifest.json` and the files it names. The Windows edition installs packs from the catalog in `dlc/catalog.json`; the web edition lists the catalog and can preview a local pack with `?dlc=<id>` in the address (for example `http://localhost:8000/?dlc=example`).

## manifest.json

```json
{
  "id": "thursday",
  "name": "Thursday Pack",
  "version": "1.0.0",
  "minGame": "1.1.0",
  "description": "One line for the DLC list.",
  "wallpapers": [{ "id": "furnace", "name": "Furnace", "file": "wallpapers/furnace.jpg" }],
  "music": [{ "title": "Panel B", "artist": "Greg", "file": "music/panel-b.mp3" }],
  "notes": [{ "text": "A sticky note added to Notes.", "by": "— G." }],
  "headlines": ["A line for The Daily Current’s “Also in the news”."],
  "module": "pack.js"
}
```

- `id`: lowercase letters, numbers and hyphens, up to 40 characters. It must match the folder name.
- `version` and `minGame`: `major.minor.patch`. A pack that needs a newer game says so in the DLC list and won't install until the game is updated.
- Every `file` is relative to the pack folder, with no `..`.
- Everything except `id`, `name` and `version` is optional.
- `module` (optional) is an ES module whose default export receives `{ addApp, notify, esc, version }`. `addApp(id, { title, glyph, tone, size, render })` adds a program to the dock; `render()` returns HTML, so escape anything dynamic with `esc`. See `packs/example/pack.js`.

Installed packs take effect the next time the game starts. Secrets, story moments and saves belong to the base game, so removing a pack never breaks a save.

## Publishing a pack

1. Add or update `dlc/packs/<id>/`, bumping `version` for an update. Preview it with `?dlc=<id>`.
2. Commit, then push a tag named `dlc-<id>-v<version>`, for example `dlc-thursday-v1.0.0`.
3. The **DLC** workflow zips the pack, publishes it as a GitHub release with that tag, records its size and SHA-256 in `dlc/catalog.json`, and commits the catalog to the default branch. Installed games see it the next time they open the DLC tab.

To build a pack locally without publishing: `npm run pack-dlc -- <id> --no-catalog` writes `dist/dlc-<id>-<version>.zip` and prints its catalog entry.

The desktop app only downloads URLs under this repository's releases, and refuses a download whose SHA-256 doesn't match the catalog. Treat a pack's `module` like code in the game itself: it runs with the same access as the page.
