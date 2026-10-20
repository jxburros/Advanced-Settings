/* Prints the CHANGELOG.md section for a version (default: package.json's).
     node tools/release-notes.mjs [1.2.0] */
import fs from "node:fs";
const version = process.argv[2] ?? JSON.parse(fs.readFileSync("package.json", "utf8")).version;
const lines = fs.readFileSync("CHANGELOG.md", "utf8").split(/\r?\n/);
const start = lines.findIndex((l) => l.trim() === `## ${version}`);
if (start < 0) {
  console.error(`CHANGELOG.md has no "## ${version}" section.`);
  process.exit(1);
}
const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
console.log(lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim());
