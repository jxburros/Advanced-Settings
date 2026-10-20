# Releasing

Advanced Settings ships three ways: the web edition (any static server), the Windows edition (an installer that updates itself), and DLC packs. All three are published from GitHub by pushing tags.

## A new version of the game

1. Pick the version, for example `1.2.0`, and set it in **both** `package.json` (`version`) and `version.js` (`VERSION`).
2. Add a `## 1.2.0` section at the top of `CHANGELOG.md`. It becomes the release notes, and Software Update shows it in the game.
3. Merge to `main`, then tag and push:

   ```sh
   git tag v1.2.0
   git push origin v1.2.0
   ```

The **Release** workflow (`.github/workflows/release.yml`) then:

- runs the tests and refuses to continue unless the tag, `package.json`, `version.js` and the changelog agree;
- builds the Windows installer on a Windows runner with electron-builder and publishes `Advanced-Settings-Setup-1.2.0.exe`, its blockmap and `latest.yml` to a GitHub release named for the tag;
- sets the release notes from the changelog, marks it as the latest release, and attaches `Advanced-Settings-web-1.2.0.zip`.

### How players get it

- **Windows edition:** Software Update (logo menu, or System Settings › About) checks GitHub once a day and on request. If there is a newer release it shows the notes and offers to download; once downloaded, **Restart and install** saves, installs and reopens the game. Saves live in the app's user data and survive updates. electron-updater reads `latest.yml` from the latest release, so never delete it from a release.
- **Web edition:** Software Update checks the same release and links to the installer and release page. Wherever the web edition is hosted, update the files there; players reload.

The installer is not code-signed, so Windows SmartScreen will warn on first run ("More info › Run anyway"). To sign, add a certificate to the repository secrets and set `CSC_LINK` and `CSC_KEY_PASSWORD` on the electron-builder step; nothing else changes.

## A DLC pack

See [dlc/README.md](../dlc/README.md) for the pack format. To publish `dlc/packs/<id>` at version `1.0.0`:

```sh
git tag dlc-<id>-v1.0.0
git push origin dlc-<id>-v1.0.0
```

The **DLC** workflow zips the pack, publishes it as a release under that tag, and commits the updated `dlc/catalog.json` (size and SHA-256 included) to the default branch. If branch protection blocks the workflow from pushing to `main`, allow `github-actions[bot]` to push, or run `npm run pack-dlc -- <id>` yourself and commit the catalog change.

The catalog is read from `main` at `https://raw.githubusercontent.com/jxburros/Advanced-Settings/main/dlc/catalog.json`. The desktop app only downloads packs from this repository's releases and refuses any download whose checksum doesn't match.

## Building locally

```sh
npm ci
npm run desktop          # run the Windows edition from source (updates are disabled)
npm run dist             # build the installer into dist/ (on Windows; Linux needs Wine for this step)
npm run pack-dlc -- example --no-catalog   # zip a pack into dist/ without touching the catalog
```

To try the whole DLC flow from source: build a pack, write `dist/catalog.json` with entries whose `url` points at `http://127.0.0.1:8000/dist/<zip>`, serve the repository with `npm start`, and run `STILLWATER_DLC_BASE=http://127.0.0.1:8000/dist/ npm run desktop`. That override is ignored in installed builds.

CI (`.github/workflows/ci.yml`) runs the tests on every pull request and push to `main`; they need no dependencies.
