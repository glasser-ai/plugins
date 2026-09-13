# Glasser plugin

Search, inspect and run paid third-party API endpoints through one Key.
Install instructions, authentication and the list of network endpoints are in
the [repository README](../../README.md).

| Component | File | Read by |
|---|---|---|
| Skill | `skills/glasser/SKILL.md` | every agent |
| MCP server | `mcp.json` | Cursor, Agent Plugins clients |
| MCP server, identical copy | `.mcp.json` | Claude Code, Grok Build |
| Rule | `rules/glasser-spending.mdc` | Cursor |
| Logo | `assets/logo.svg` | marketplaces, and the plugin list inside the client |

Both MCP files point at `https://api.glasser.ai/mcp` and carry no
credentials: the server speaks OAuth, so the client signs the user in on
first use. `scripts/check-manifests.mjs` fails if the two files differ at
all, or if a header or variable creeps back in.

`assets/logo.svg` is 1:1 and transparent, a byte-identical copy of
`docs/assets/brand/generated/logo-panel.svg` in the Glasser monorepo, where a
generator produces it from the master mark. Clients draw their own container —
a dark rounded card — so the icon leaves the ground to them; a baked plate puts
a white card on top of theirs. It ships the reversed colour pair for the same
reason: the primary pair has a black head, which on a dark card vanishes and
leaves the goggles floating. `check-manifests.mjs` asserts square and a
non-black head so neither can regress; when the mark changes, bring the new
file over.
