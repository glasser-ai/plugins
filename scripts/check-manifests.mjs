#!/usr/bin/env node
// Consistency checks that validate-template.mjs does not cover: one version
// everywhere, the mcp.json / .mcp.json pair rule, manifest pointers, and a
// guard against a pipe-to-shell install sneaking back into the skill.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const plugin = path.join(root, "plugins", "glasser");
const errors = [];
const fail = (message) => errors.push(message);
const rel = (p) => path.relative(root, p);
const readJson = (p) => {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (error) {
    fail(`${rel(p)}: ${error.message}`);
    return null;
  }
};

const cursorMp = readJson(path.join(root, ".cursor-plugin/marketplace.json"));
const claudeMp = readJson(path.join(root, ".claude-plugin/marketplace.json"));
const cursorPl = readJson(path.join(plugin, ".cursor-plugin/plugin.json"));
const claudePl = readJson(path.join(plugin, ".claude-plugin/plugin.json"));
const agentPl = readJson(path.join(plugin, "plugin.json"));
const skillPath = path.join(plugin, "skills/glasser/SKILL.md");
const skill = readFileSync(skillPath, "utf8");
const frontmatter = skill.split("\n---\n")[0];
// Agent Skills has no top-level version field; ours lives under metadata.
const frontmatterVersion = frontmatter.match(/^metadata:\n(?:[ \t]+.*\n)*?[ \t]+version:\s*"?([^"\s]+)"?/m)?.[1];
if (/^version:/m.test(frontmatter)) fail("SKILL.md: version must live under metadata, not at the top level");

// 1. One version everywhere. Clients pin installs to it.
const versions = {
  ".cursor-plugin/marketplace.json metadata.version": cursorMp?.metadata?.version,
  ".cursor-plugin/marketplace.json plugins[0].version": cursorMp?.plugins?.[0]?.version,
  ".claude-plugin/marketplace.json metadata.version": claudeMp?.metadata?.version,
  ".claude-plugin/marketplace.json plugins[0].version": claudeMp?.plugins?.[0]?.version,
  "plugins/glasser/.cursor-plugin/plugin.json": cursorPl?.version,
  "plugins/glasser/.claude-plugin/plugin.json": claudePl?.version,
  "plugins/glasser/plugin.json": agentPl?.version,
  "plugins/glasser/skills/glasser/SKILL.md metadata.version": frontmatterVersion,
};
const distinct = new Set(Object.values(versions));
if (distinct.size !== 1 || distinct.has(undefined)) {
  const lines = Object.entries(versions).map(([k, v]) => `    ${v ?? "(missing)"}  ${k}`);
  fail(`versions disagree:\n${lines.join("\n")}`);
}

// 2. Every manifest and catalog entry names the same plugin.
const names = [
  ["cursor marketplace entry", cursorMp?.plugins?.[0]?.name],
  ["claude marketplace entry", claudeMp?.plugins?.[0]?.name],
  [".cursor-plugin/plugin.json", cursorPl?.name],
  [".claude-plugin/plugin.json", claudePl?.name],
  ["plugin.json", agentPl?.name],
];
for (const [label, name] of names) {
  if (name !== "glasser") fail(`${label}: name is ${JSON.stringify(name)}, expected "glasser"`);
}

// 3. The MCP pair: byte-identical, valid JSON, and nothing but a URL. The
//    server speaks OAuth — the client signs the user in on first use — so a
//    headers block or a ${VARIABLE} placeholder here is a regression to the
//    paste-a-Key setup, and a Cursor `variables` declaration would prompt
//    the user for a value nothing reads.
const mcpRaw = readFileSync(path.join(plugin, "mcp.json"), "utf8");
const dotRaw = readFileSync(path.join(plugin, ".mcp.json"), "utf8");
if (mcpRaw !== dotRaw) fail("mcp.json and .mcp.json must be byte-identical");
let mcp = null;
try {
  mcp = JSON.parse(mcpRaw);
} catch (error) {
  fail(`mcp.json is not valid JSON: ${error.message}`);
}
const server = mcp?.mcpServers?.glasser;
if (!server) fail("mcp.json must declare mcpServers.glasser");
if (server && server.url !== "https://api.glasser.ai/mcp") fail(`mcp.json url must be https://api.glasser.ai/mcp, got ${JSON.stringify(server?.url)}`);
if (server && "headers" in server) fail("mcp.json must not carry headers — the server signs the user in with OAuth");
if (/\$\{/.test(mcpRaw)) fail("mcp.json must not reference a ${VARIABLE} — there is no Key to fill in");
if (cursorPl?.variables) fail(".cursor-plugin/plugin.json must not declare variables — nothing reads them");

// 4. Each manifest points at the MCP file its client reads.
if (claudePl?.mcpServers !== "./.mcp.json") {
  fail(`.claude-plugin/plugin.json mcpServers must be "./.mcp.json", got ${JSON.stringify(claudePl?.mcpServers)}`);
}
if (cursorPl?.mcpServers !== "./mcp.json") {
  fail(`.cursor-plugin/plugin.json mcpServers must be "./mcp.json", got ${JSON.stringify(cursorPl?.mcpServers)}`);
}
for (const [label, mp] of [["cursor", cursorMp], ["claude", claudeMp]]) {
  const source = mp?.plugins?.[0]?.source;
  if (typeof source !== "string" || !existsSync(path.join(root, source))) {
    fail(`${label} marketplace source does not resolve: ${JSON.stringify(source)}`);
  }
}

// 5. The skill must never carry a pipe-to-shell install; xAI rejects it.
if (/curl[^\n]*\|\s*(ba|z)?sh\b/.test(skill) || /install\.sh/.test(skill)) {
  fail("SKILL.md contains a curl | sh install — use npm install -g instead");
}

if (errors.length > 0) {
  console.error("check-manifests failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`check-manifests passed (version ${[...distinct][0]}).`);
