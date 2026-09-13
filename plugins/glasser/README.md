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

`assets/logo.svg` is 1:1 with an opaque plate, a byte-identical copy of
`docs/assets/brand/generated/logo-plate.svg` in the Glasser monorepo, where a
generator produces it from the master mark. The bare mark is 2336x2165 with a
transparent ground and a black head — on a dark plugin list the head vanishes
and only the goggles float, which is why the plated copy is the one that ships.
`check-manifests.mjs` asserts square and opaque so it cannot regress; when the
mark changes, bring the new file over.
