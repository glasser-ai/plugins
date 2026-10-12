#!/usr/bin/env node
// Pack plugins/glasser for ClawHub with ClawHub as the install source.
//
// The same folder ships to every marketplace, so the repo copy cannot name one
// of them. This writes a copy where the login command and the MCP URL carry
// utm_source=clawhub, then runs `npm pack` on the copy. The publish workflow
// hands the .tgz to ClawHub; the files in the repo stay as they are.
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "dist");
const SOURCE = "clawhub";
const MEDIUM = "plugin";

const root = process.cwd();
const work = path.join(mkdtempSync(path.join(tmpdir(), "glasser-clawhub-")), "glasser");
cpSync(path.join(root, "plugins/glasser"), work, { recursive: true });

const rewrite = (file, apply) => {
  const p = path.join(work, file);
  const before = readFileSync(p, "utf8");
  const after = apply(before);
  if (after === before) {
    console.error(`${file}: nothing to rewrite`);
    process.exit(1);
  }
  writeFileSync(p, after);
  console.log(`${file} -> ${SOURCE}`);
};

rewrite("skills/glasser/SKILL.md", (text) =>
  text.replaceAll(
    /GLASSER_UTM_SOURCE=[a-z0-9._-]+ GLASSER_UTM_MEDIUM=[a-z0-9._-]+ glasser login/g,
    `GLASSER_UTM_SOURCE=${SOURCE} GLASSER_UTM_MEDIUM=${MEDIUM} glasser login`
  )
);
for (const file of ["mcp.json", ".mcp.json"]) {
  rewrite(file, (text) => {
    const data = JSON.parse(text);
    const url = new URL(data.mcpServers.glasser.url);
    url.searchParams.set("utm_source", SOURCE);
    url.searchParams.set("utm_medium", MEDIUM);
    data.mcpServers.glasser.url = url.toString();
    return `${JSON.stringify(data, null, 2)}\n`;
  });
}

mkdirSync(outDir, { recursive: true });
execFileSync("npm", ["pack", "--pack-destination", outDir], { cwd: work, stdio: "inherit" });
