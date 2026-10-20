/* Sets the game's version everywhere it is written down, so a release can be started from the
   GitHub website without editing files by hand.
     node tools/set-version.mjs <version> [release notes]
   Updates package.json, package-lock.json and version.js. If CHANGELOG.md has no section for
   the version, adds one with the given notes. Run from the repository root. */
import fs from "node:fs";
const [version, notes = ""] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) {
  console.error("Usage: node tools/set-version.mjs <major.minor.patch> [release notes]");
  process.exit(1);
}
const json = (file, edit) => {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  edit(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
};
json("package.json", (p) => (p.version = version));
if (fs.existsSync("package-lock.json"))
  json("package-lock.json", (l) => {
    l.version = version;
    if (l.packages?.[""]) l.packages[""].version = version;
  });
const js = fs.readFileSync("version.js", "utf8");
fs.writeFileSync("version.js", js.replace(/export const VERSION = "[^"]*";/, `export const VERSION = "${version}";`));
const log = fs.readFileSync("CHANGELOG.md", "utf8");
if (!new RegExp(`^## ${version.replace(/\./g, "\\.")}\\s*$`, "m").test(log)) {
  const lines = notes
    .split(/\s*[\n;]\s*/)
    .map((x) => x.trim().replace(/^[-*]\s*/, ""))
    .filter(Boolean);
  const section = `## ${version}\n\n${(lines.length ? lines : ["Maintenance release."]).map((x) => `- ${x}`).join("\n")}\n\n`;
  const at = log.search(/^## /m);
  fs.writeFileSync("CHANGELOG.md", at < 0 ? log.trimEnd() + "\n\n" + section : log.slice(0, at) + section + log.slice(at));
}
console.log(`Version set to ${version}.`);
