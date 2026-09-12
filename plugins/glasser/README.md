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
| Logo | `assets/logo.svg` | marketplaces |

Both MCP files point at `https://api.glasser.ai/mcp` and carry no
credentials: the server speaks OAuth, so the client signs the user in on
first use. `scripts/check-manifests.mjs` fails if the two files differ at
all, or if a header or variable creeps back in.
