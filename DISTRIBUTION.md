# Distribution

Where this plugin is published, how each channel picks up a change, and the
checks that keep the package consistent.

## Channels

| Channel | How it reads this repo | Status |
|---|---|---|
| Cursor Marketplace (also surfaces in Grok Bot) | repo URL submitted at cursor.com/marketplace/publish, reviewed by Cursor | not submitted |
| xAI plugin-marketplace (Grok Build) | PR adding one catalog entry pinned to a commit `sha` | not submitted |
| Claude Code, self-hosted marketplace | `/plugin marketplace add glasser-ai/plugins` | live on push |
| `npx plugins add glasser-ai/plugins` | root `plugin.json` | live on push |
| MCP Registry (`server.json`) | DNS TXT record on the `glasser.ai` apex | not started |

## Release checklist

1. Edit files under `plugins/glasser/`.
2. `node scripts/bump-version.mjs <version>` — writes the version into every
   manifest and the skill frontmatter. Clients pin installs to `version`; a
   change without a bump reaches nobody.
3. `node scripts/validate-template.mjs && node scripts/check-manifests.mjs`
4. Commit and push.
5. xAI catalog, once listed: open a PR bumping the pinned `sha`.

## Version ownership

| Artifact | Source of truth | Bumps when |
|---|---|---|
| Plugin (skill, rule, MCP config) | `plugins/glasser/plugin.json` | anything under `plugins/glasser/` changes |
| `@glasser-ai/cli` | its own npm release | CLI code changes |
| MCP server | `apps/api` in the main repository | tool contract changes |

Deliberately not in lockstep: a CLI patch must not force a plugin republish
and a Cursor re-review.

## The skill and glasser.ai/SKILL.md

`plugins/glasser/skills/glasser/SKILL.md` started as a copy of
`apps/web/public/SKILL.md` in the main repository (served at
https://glasser.ai/SKILL.md) and is now its own text. The two serve
different setups:

| | glasser.ai/SKILL.md | this plugin |
|---|---|---|
| How it arrives | the agent fetches it at setup | pinned inside the installed plugin |
| What is guaranteed present | nothing — it installs the CLI | the MCP tools |
| Default transport | CLI | MCP tools; CLI for large results, scripting, CI |
| Install command | `curl … \| sh` | none; optional `npm install -g` |
| Version | follows the CLI | follows the plugin |

Everything else — the workflow, the commands table, run statuses,
troubleshooting, the rules for agents — should say the same thing in both.
When the main repository changes one of those sections, port the change here
by hand and bump the version. `check-manifests.mjs` still refuses `curl | sh`
and `install.sh`, so a wholesale re-copy cannot slip through.

## Why there are two identical MCP files

`mcp.json` and `.mcp.json` are byte-identical. Different clients read
different file names — Cursor and Agent Plugins clients read `mcp.json`,
Claude Code and Grok Build read `.mcp.json` — and a symlink would break
Windows checkouts. `check-manifests.mjs` fails if they diverge.

Both are a URL and nothing else. The server speaks OAuth: on the first call
the client discovers the authorization server from the 401 challenge,
registers itself, and opens the browser for sign-in and Workspace choice.
No variable, no header, no Key to paste. The checker refuses a `headers`
block or a `${VARIABLE}` placeholder.

## Validators

- `scripts/validate-template.mjs` — vendored from
  [cursor/plugin-template](https://github.com/cursor/plugin-template),
  unmodified. What Cursor's submission checklist asks for.
- `scripts/check-manifests.mjs` — ours: one version everywhere, the MCP pair
  rule, manifest pointers, and the `curl | sh` guard.
