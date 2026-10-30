# Glasser plugin

Search, inspect and run paid third-party API endpoints through one Key.
Install instructions, authentication and the list of network endpoints are in
the [repository README](https://github.com/glasser-ai/plugins#readme).

| Component | File | Read by |
|---|---|---|
| Skill | `skills/glasser/SKILL.md` | every agent |
| MCP server | `mcp.json` | Cursor, Agent Plugins clients |
| MCP server, identical copy | `.mcp.json` | Claude Code, Grok Build |
| Rule | `rules/glasser-spending.mdc` | Cursor |
| Manifest | `openclaw.plugin.json` | ClawHub, OpenClaw |

Both MCP files point at `https://api.glasser.ai/mcp` and carry no
credentials: the server speaks OAuth, so the client signs the user in on
first use. The plugin ships no executable code.

The service behind it is governed by Glasser's
[terms of service](https://glasser.ai/terms-of-service) and
[privacy policy](https://glasser.ai/privacy-policy).

## Documentation and support

- Documentation: https://glasser.ai/docs
- MCP setup: https://glasser.ai/docs/mcp-server
- Support: support@glasser.ai
- Privacy policy: https://glasser.ai/privacy-policy
- Service terms: https://glasser.ai/terms-of-service

## Accounts and paid services

The Glasser service requires a Glasser account and Workspace. Data calls are
pay-as-you-go and use the Workspace balance. Inspect the selected endpoint
for its current price and outcome-specific charges before running it.
The MIT license applies to this distribution package; the service has
separate terms.
