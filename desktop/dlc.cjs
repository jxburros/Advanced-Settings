/* DLC rules shared by the desktop app and the tests: what a catalog entry and a pack manifest
   may contain, and how a pack is unpacked safely. No Electron here, so it runs under plain Node. */
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const REPO = "jxburros/Advanced-Settings";
const CATALOG_URL = `https://raw.githubusercontent.com/${REPO}/main/dlc/catalog.json`;
const DOWNLOADS = `https://github.com/${REPO}/releases/download/`;
const MAX_PACK = 200 * 1024 * 1024;
const ID = /^[a-z0-9][a-z0-9-]{0,39}$/;
const SEMVER = /^\d{1,4}\.\d{1,4}\.\d{1,6}$/;
const FILE = /^[\w][\w ./()&'-]{0,120}$/;

function compare(a, b) {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0) ? 1 : -1;
  return 0;
}
const text = (v, max) => typeof v === "string" && v.length > 0 && v.length <= max;
const safeFile = (f) => typeof f === "string" && FILE.test(f) && !f.split("/").includes("..") && !f.includes("\\");

/* A catalog entry must point at a release asset of this repository (or, when testing an
   unpackaged build, at the local base given). */
function validEntry(e, base = DOWNLOADS) {
  return (
    !!e &&
    ID.test(e.id) &&
    text(e.name, 80) &&
    SEMVER.test(e.version) &&
    (e.minGame === undefined || SEMVER.test(e.minGame)) &&
    (e.description === undefined || (typeof e.description === "string" && e.description.length <= 500)) &&
    Number.isInteger(e.size) &&
    e.size > 0 &&
    e.size <= MAX_PACK &&
    /^[0-9a-f]{64}$/.test(e.sha256) &&
    typeof e.url === "string" &&
    e.url.startsWith(base) &&
    !e.url.includes("..")
  );
}
function validCatalog(list, base = DOWNLOADS) {
  return Array.isArray(list) ? list.filter((e) => validEntry(e, base)).slice(0, 200) : [];
}

/* A pack's manifest.json. Everything it names must be a plain relative file inside the pack. */
function validManifest(m, id = m?.id) {
  const list = (v, max, ok) => v === undefined || (Array.isArray(v) && v.length <= max && v.every(ok));
  return (
    !!m &&
    m.id === id &&
    ID.test(m.id) &&
    text(m.name, 80) &&
    SEMVER.test(m.version) &&
    (m.minGame === undefined || SEMVER.test(m.minGame)) &&
    (m.description === undefined || (typeof m.description === "string" && m.description.length <= 500)) &&
    list(m.wallpapers, 20, (w) => w && /^[a-z0-9-]{1,30}$/.test(w.id) && text(w.name, 40) && safeFile(w.file)) &&
    list(m.music, 100, (t) => t && text(t.title, 80) && (t.artist === undefined || (typeof t.artist === "string" && t.artist.length <= 80)) && safeFile(t.file)) &&
    list(m.notes, 50, (n) => n && text(n.text, 400) && (n.by === undefined || (typeof n.by === "string" && n.by.length <= 40))) &&
    list(m.headlines, 50, (h) => text(h, 200)) &&
    (m.module === undefined || (safeFile(m.module) && m.module.endsWith(".js")))
  );
}

/* Resolves `rel` inside `root`, or returns null if it would escape. */
function safeJoin(root, rel) {
  const base = path.resolve(root);
  const full = path.resolve(base, rel);
  return full === base || full.startsWith(base + path.sep) ? full : null;
}
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

/* Writes zip entries ({ name, data, dir }) into dest, refusing anything that escapes it.
   The pack's manifest.json must be at the top level. Returns the manifest. */
function extract(entries, dest, id) {
  let total = 0;
  const files = [];
  for (const e of entries) {
    if (e.dir) continue;
    const name = String(e.name).replace(/\\/g, "/");
    if (!safeFile(name)) throw Error(`Refusing a file with an unsafe name: ${name.slice(0, 80)}`);
    const target = safeJoin(dest, name);
    if (!target) throw Error(`Refusing a file outside the pack: ${name.slice(0, 80)}`);
    total += e.data.length;
    if (total > MAX_PACK * 2) throw Error("The pack is too large once unpacked.");
    files.push([target, e.data, name]);
  }
  const raw = files.find(([, , n]) => n === "manifest.json");
  if (!raw) throw Error("The pack has no manifest.json.");
  const manifest = JSON.parse(raw[1].toString("utf8"));
  if (!validManifest(manifest, id)) throw Error("The pack's manifest.json is not valid.");
  fs.rmSync(dest, { recursive: true, force: true });
  for (const [target, data] of files) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, data);
  }
  return manifest;
}

/* Installed packs: every folder in root with a valid manifest. */
function installed(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && ID.test(d.name))
    .map((d) => {
      try {
        const m = JSON.parse(fs.readFileSync(path.join(root, d.name, "manifest.json"), "utf8"));
        return validManifest(m, d.name) ? m : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

module.exports = { REPO, CATALOG_URL, DOWNLOADS, MAX_PACK, ID, compare, validEntry, validCatalog, validManifest, safeJoin, sha256, extract, installed };
