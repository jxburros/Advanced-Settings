import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import D from "../desktop/dlc.cjs";
import * as U from "../updates.js";
const require = createRequire(import.meta.url);
const good = {
  id: "thursday",
  name: "Thursday Pack",
  version: "1.0.0",
  minGame: "1.1.0",
  description: "Heaters.",
  size: 1234,
  sha256: "a".repeat(64),
  url: `https://github.com/${D.REPO}/releases/download/dlc-thursday-v1.0.0/dlc-thursday-1.0.0.zip`,
};

test("version.js, package.json and the changelog agree", () => {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert.equal(U.VERSION, pkg.version);
  assert.equal(U.REPO, D.REPO);
  assert.match(fs.readFileSync("CHANGELOG.md", "utf8"), new RegExp(`^## ${pkg.version.replace(/\./g, "\\.")}$`, "m"));
  const notes = execFileSync(process.execPath, ["tools/release-notes.mjs", pkg.version]).toString();
  assert.ok(notes.length > 20 && !notes.includes("## "));
  // Every file the web edition needs is packaged into the desktop app.
  for (const f of ["index.html", "style.css", "app.js", "game.js", "tasks.js", "stories.js", "sound.js", "updates.js", "version.js"]) assert.ok(pkg.build.files.includes(f), f);
});
test("versions compare numerically", () => {
  for (const cmp of [D.compare, U.compare]) {
    assert.equal(cmp("1.10.0", "1.9.9"), 1);
    assert.equal(cmp("1.1.0", "1.1.0"), 0);
    assert.equal(cmp("0.9.12", "1.0.0"), -1);
  }
});
test("catalog entries must point at this repository's releases", () => {
  assert.ok(D.validEntry(good));
  assert.equal(D.validEntry({ ...good, url: "https://example.com/dlc.zip" }), false);
  assert.equal(D.validEntry({ ...good, url: `https://github.com/someone/else/releases/download/x/y.zip` }), false);
  assert.equal(D.validEntry({ ...good, url: good.url.replace("dlc-thursday-v1.0.0", "..") }), false);
  assert.equal(D.validEntry({ ...good, sha256: "nope" }), false);
  assert.equal(D.validEntry({ ...good, id: "Bad Id" }), false);
  assert.equal(D.validEntry({ ...good, size: D.MAX_PACK + 1 }), false);
  assert.deepEqual(D.validCatalog([good, { ...good, id: "../x" }, null]), [good]);
  assert.deepEqual(D.validCatalog("not a list"), []);
});
test("pack manifests only name files inside the pack", () => {
  const m = JSON.parse(fs.readFileSync("dlc/packs/example/manifest.json", "utf8"));
  assert.ok(D.validManifest(m, "example"));
  assert.equal(D.validManifest(m, "other"), false, "the id must match the folder");
  assert.equal(D.validManifest({ ...m, module: "../app.js" }), false);
  assert.equal(D.validManifest({ ...m, module: "pack.txt" }), false);
  assert.equal(D.validManifest({ ...m, wallpapers: [{ id: "a", name: "A", file: "..\\evil.jpg" }] }), false);
  assert.equal(D.validManifest({ ...m, music: [{ title: "x", file: "/etc/passwd" }] }), false);
  assert.ok(D.validManifest({ ...m, wallpapers: [{ id: "a", name: "A", file: "walls/a.jpg" }] }));
});
test("unpacking refuses to write outside the pack, and installed packs are listed", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dlc-"));
  const dest = D.safeJoin(root, "thursday");
  const manifest = Buffer.from(JSON.stringify({ id: "thursday", name: "Thursday", version: "1.0.0", notes: [{ text: "hi" }] }));
  assert.throws(() => D.extract([{ name: "manifest.json", data: manifest }, { name: "../escape.txt", data: Buffer.from("x") }], dest, "thursday"), /unsafe|outside/);
  assert.throws(() => D.extract([{ name: "readme.txt", data: Buffer.from("x") }], dest, "thursday"), /manifest/);
  assert.throws(() => D.extract([{ name: "manifest.json", data: manifest }], dest, "friday"), /not valid/);
  assert.equal(fs.existsSync(path.join(root, "escape.txt")), false);
  const m = D.extract([{ name: "pack/", dir: true }, { name: "manifest.json", data: manifest }, { name: "notes/a.txt", data: Buffer.from("x") }], dest, "thursday");
  assert.equal(m.name, "Thursday");
  assert.ok(fs.existsSync(path.join(dest, "notes", "a.txt")));
  fs.mkdirSync(path.join(root, "broken"));
  fs.writeFileSync(path.join(root, "broken", "manifest.json"), "{");
  assert.deepEqual(D.installed(root).map((x) => x.id), ["thursday"]);
  assert.equal(D.safeJoin(root, "../x"), null);
  fs.rmSync(root, { recursive: true, force: true });
});
test("the packer builds a valid catalog entry", { skip: (() => { try { require.resolve("adm-zip"); return false; } catch { return "adm-zip is not installed (npm ci)"; } })() }, () => {
  const out = execFileSync(process.execPath, ["tools/pack-dlc.mjs", "example", "--no-catalog"]).toString().trim().split("\n").at(-1);
  const entry = JSON.parse(out);
  assert.ok(D.validEntry(entry));
  const AdmZip = require("adm-zip");
  const buf = fs.readFileSync(`dist/dlc-example-${entry.version}.zip`);
  assert.equal(D.sha256(buf), entry.sha256);
  const names = new AdmZip(buf).getEntries().map((e) => e.entryName).sort();
  assert.deepEqual(names, ["manifest.json", "pack.js"]);
  assert.deepEqual(JSON.parse(fs.readFileSync("dlc/catalog.json", "utf8")), [], "--no-catalog leaves the catalog alone");
});
test("a release started from the website writes the version everywhere", () => {
  // Versions well above whatever the game is at, so this keeps working after real releases.
  const major = Number(JSON.parse(fs.readFileSync("package.json", "utf8")).version.split(".")[0]) + 100;
  const [next, after] = [`${major}.0.0`, `${major}.1.0`];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ver-"));
  for (const f of ["package.json", "package-lock.json", "version.js", "CHANGELOG.md"]) fs.copyFileSync(f, path.join(dir, f));
  const run = (...args) => execFileSync(process.execPath, [path.resolve("tools/set-version.mjs"), ...args], { cwd: dir, stdio: "pipe" }).toString();
  run(next, "More ducks; fewer heaters");
  const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");
  assert.equal(JSON.parse(read("package.json")).version, next);
  const lock = JSON.parse(read("package-lock.json"));
  assert.deepEqual([lock.version, lock.packages[""].version], [next, next]);
  assert.match(read("version.js"), new RegExp(`VERSION = "${next}"`));
  assert.ok(read("CHANGELOG.md").includes(`## ${next}\n\n- More ducks\n- fewer heaters\n\n## `), "the new section goes above the others");
  const before = read("CHANGELOG.md");
  run(next, "ignored");
  assert.equal(read("CHANGELOG.md"), before, "an existing section is kept as written");
  run(after);
  assert.ok(read("CHANGELOG.md").includes(`## ${after}\n\n- Maintenance release.`));
  assert.throws(() => run("one point two"));
  fs.rmSync(dir, { recursive: true, force: true });
});
