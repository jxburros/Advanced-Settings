/* Zips dlc/packs/<id>/ into dist/dlc-<id>-<version>.zip and records it in dlc/catalog.json.
     node tools/pack-dlc.mjs <id> [--no-catalog]
   Prints the catalog entry as JSON on the last line. */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const AdmZip = require("adm-zip");
const D = require("../desktop/dlc.cjs");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, flag] = process.argv.slice(2);
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
if (!D.ID.test(id ?? "")) fail("Usage: node tools/pack-dlc.mjs <id> [--no-catalog]");
const dir = path.join(root, "dlc", "packs", id);
const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
if (!D.validManifest(manifest, id)) fail(`dlc/packs/${id}/manifest.json is not valid. See dlc/README.md.`);
const named = [...(manifest.wallpapers ?? []), ...(manifest.music ?? [])].map((x) => x.file).concat(manifest.module ?? []);
for (const f of named) if (!fs.existsSync(path.join(dir, f))) fail(`The manifest names ${f}, which isn't in the pack.`);
const zip = new AdmZip();
const walk = (rel) => {
  for (const d of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    const name = rel ? `${rel}/${d.name}` : d.name;
    if (d.name.startsWith(".")) continue;
    if (d.isDirectory()) walk(name);
    else zip.addFile(name, fs.readFileSync(path.join(dir, name)));
  }
};
walk("");
const buf = zip.toBuffer();
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
const file = `dlc-${id}-${manifest.version}.zip`;
fs.writeFileSync(path.join(root, "dist", file), buf);
const entry = {
  id,
  name: manifest.name,
  version: manifest.version,
  ...(manifest.minGame ? { minGame: manifest.minGame } : {}),
  description: manifest.description ?? "",
  size: buf.length,
  sha256: D.sha256(buf),
  url: `${D.DOWNLOADS}dlc-${id}-v${manifest.version}/${file}`,
};
if (!D.validEntry(entry)) fail("The catalog entry came out invalid; check the manifest's name and description lengths.");
if (flag !== "--no-catalog") {
  const catPath = path.join(root, "dlc", "catalog.json");
  const catalog = JSON.parse(fs.readFileSync(catPath, "utf8")).filter((e) => e.id !== id);
  catalog.push(entry);
  catalog.sort((a, b) => a.id.localeCompare(b.id));
  fs.writeFileSync(catPath, JSON.stringify(catalog, null, 2) + "\n");
}
console.log(`dist/${file} · ${buf.length} bytes`);
console.log(JSON.stringify(entry));
