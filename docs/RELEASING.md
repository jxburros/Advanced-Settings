# Releasing

Advanced Settings ships three ways: the web edition (any static server), the Windows edition (an installer that updates itself), and DLC packs. All three are published from GitHub, either with the **Run workflow** buttons on the website or by pushing tags.

## From the GitHub website (no terminal)

Everything below can be done in a browser on github.com. The **Run workflow** buttons only appear once these workflow files are on `main`, so merge the pull request that adds them first.

### Try a test installer

1. Open the repository's **Actions** tab and choose **Release** in the list on the left.
2. Click **Run workflow**, leave **Version** empty, and click the green **Run workflow** button.
3. When the run finishes (about ten minutes; refresh the page), open it and scroll to **Artifacts**. Download **Advanced-Settings-Setup-…-test**, unzip it, and run the installer.

Nothing is published, and players don't see it.

### Release a new version

1. Optional: write the release notes. Open `CHANGELOG.md`, click the pencil icon, add a section at the top like the ones already there (`## 1.2.0` and a few `- ` lines), and **Commit changes** to `main`. If you skip this, the notes you type in step 3 are used.
2. **Actions** › **Release** › **Run workflow**. Keep **Use workflow from** on `main`.
3. Type the new version in **Version** (three numbers, higher than the current one, for example `1.2.0`). Fill in **Release notes** if you skipped step 1, separating points with semicolons. Click **Run workflow**.

The workflow writes the version into the files, commits that to `main`, tags it, runs the tests, builds the installer, and publishes the release. It appears under **Releases** on the repository's front page when it's done, and everyone with the Windows edition is offered the update. If something is wrong (a version that isn't higher, or tests failing), the run stops with a red ✗ and a message saying why; nothing is published.

The very first release can use the version already in the files (`1.1.0`).

### Add music before a release

Open `assets/music`, click **Add file › Upload files**, drag in the audio files and commit. Then edit `assets/music/tracks.json` with the pencil icon to list them (the README in that folder shows the format). The next release includes them.

### Publish a DLC pack

1. Open `dlc/packs`, click **Add file › Upload files**, and drag in your pack's folder (it must contain `manifest.json`; see [dlc/README.md](../dlc/README.md)). Commit to `main`.
2. **Actions** › **DLC** › **Run workflow**. Type the folder name (for example `thursday`) and click **Run workflow**.

The version comes from the pack's `manifest.json`. To publish an update, edit the manifest, raise `version`, and run the workflow again.

### If a run fails because it can't push to `main`

Branch protection is stopping the workflow from committing. In **Settings › Rules** (or **Settings › Branches**), allow GitHub Actions to bypass the rule for `main`, then re-run the failed run from its page.

## A new version of the game (with a terminal)

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
