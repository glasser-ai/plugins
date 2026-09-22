#!/usr/bin/env node
// Write one version into every place that carries it. Clients pin installs to
// `version`, so a content change without a bump reaches nobody — and six
// files is too many to edit by hand consistently.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const next = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(next ?? "")) {
  console.error("usage: node scripts/bump-version.mjs <semver>");
  process.exit(2);
}

const root = process.cwd();
const targets = [
  [".cursor-plugin/marketplace.json", (d) => { d.metadata.version = next; d.plugins[0].version = next; }],
  [".claude-plugin/marketplace.json", (d) => { d.metadata.version = next; d.plugins[0].version = next; }],
  ["plugins/glasser/.cursor-plugin/plugin.json", (d) => { d.version = next; }],
  ["plugins/glasser/.claude-plugin/plugin.json", (d) => { d.version = next; }],
  ["plugins/glasser/plugin.json", (d) => { d.version = next; }],
  ["plugins/glasser/package.json", (d) => { d.version = next; }],
];
for (const [file, apply] of targets) {
  const p = path.join(root, file);
  const data = JSON.parse(readFileSync(p, "utf8"));
  apply(data);
  writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${file} -> ${next}`);
}

const skillFile = "plugins/glasser/skills/glasser/SKILL.md";
const skillPath = path.join(root, skillFile);
const skill = readFileSync(skillPath, "utf8");
const versionLine = /^(metadata:\n(?:[ \t]+.*\n)*?[ \t]+version:\s*"?)[^"\s]+/m;
if (!versionLine.test(skill)) {
  console.error(`${skillFile}: frontmatter has no metadata.version`);
  process.exit(1);
}
writeFileSync(skillPath, skill.replace(versionLine, `$1${next}`));
console.log(`${skillFile} -> ${next}`);
console.log("next: node scripts/validate-template.mjs && node scripts/check-manifests.mjs");
