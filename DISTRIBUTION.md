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
| ClawHub (OpenClaw) | the `publish` workflow: `scripts/pack-clawhub.mjs` packs a copy whose login command and MCP URL carry `utm_source=clawhub`, and that `.tgz` is what ClawHub receives | live |
| MCP Registry (`server.json`) | DNS TXT record on the `glasser.ai` apex | not started |

## Release checklist

1. Edit files under `plugins/glasser/`.
2. `node scripts/bump-version.mjs <version>` — writes the version into every
   manifest and the skill frontmatter. Clients pin installs to `version`; a
   change without a bump reaches nobody.
3. `node scripts/validate-template.mjs && node scripts/check-manifests.mjs`
4. Commit and push.
5. ClawHub: run the `publish` workflow from the Actions tab once the bump is on
   `main`. ClawHub versions are immutable, so a republish without a bump is
   refused. Pull requests that touch `plugins/glasser/` already run the same
   workflow with `dry_run: true`.
6. xAI catalog, once listed: open a PR bumping the pinned `sha`.

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

## Icons

Paths in this section are relative to `plugins/glasser/`. These notes live
here rather than in the plugin's own README on purpose: that README ships
inside the plugin, and Anthropic's plugin directory holds a version for manual
review when bundled text names an image or font file
(`UNREAD_ASSET_REFERENCED`). Only the manifests that must point at an asset
name one; `check-manifests.mjs` fails if a README, skill or rule does.

`assets/logo.svg` is 1:1 and transparent, a byte-identical copy of
`docs/assets/brand/generated/logo-panel.svg` in the Glasser monorepo, where a
generator produces it from the master mark. Clients draw their own container —
a dark rounded card — so the icon leaves the ground to them; a baked plate puts
a white card on top of theirs. It ships the reversed colour pair for the same
reason: the primary pair has a black head, which on a dark card vanishes and
leaves the goggles floating. `check-manifests.mjs` asserts square and a
non-black head so neither can regress; when the mark changes, bring the new
file over.

`assets/icon.png` is that same mark at 1024x1024, rasterised from `logo.svg`.
ClawHub ignores icon URLs and paths in the manifest and draws only a PNG bundled
in the package; without one the catalogue falls back to a category glyph. Keep
it under 512 KiB and regenerate it whenever `logo.svg` changes.

### ChatGPT / Codex 图标

`.codex-plugin/plugin.json` 提供 OpenAI 展示配置，引用现有的
`assets/icon.png`，用于插件 Logo 和输入框图标。根目录的 `plugin.json`
保留 Agent Plugins 格式；不要另加 `extensions.com.openai`，否则会覆盖
这份兼容配置。

Skill 单独通过 `skills/glasser/agents/openai.yaml` 声明图标。
`skills/glasser/assets/icon.png` 是插件 PNG 的逐字节副本，保证单独分发
Skill 时图标仍在包内。更新 Logo 时同步这两份 PNG；一致性检查会拦截遗漏。

修改源仓库不会替换客户端已经安装的缓存。发布新版本后，需要更新插件，
再打开新聊天检查图标与工具。图标校验通过不代表 MCP 已完成 OAuth 授权。

## The OpenClaw manifest

`plugins/glasser/openclaw.plugin.json` carries the id, the display name and
the one category ClawHub allows a plugin to declare; `clawhub package publish`
refuses a bundle without it. It holds no version — the version travels on the
publish command, so `check-manifests.mjs` has nothing extra to keep in step. It
declares no entrypoint: an `openclaw.extensions` field would make OpenClaw take
the native plugin path, and this package has no code to load. OpenClaw reads
the bundle instead, mapping `skills/` to a skill root and `mcp.json` into
`mcpServers`.

## Validators

- `scripts/validate-template.mjs` — vendored from
  [cursor/plugin-template](https://github.com/cursor/plugin-template),
  unmodified. What Cursor's submission checklist asks for.
- `scripts/check-manifests.mjs` — ours: one version everywhere, the MCP pair
  rule, manifest pointers, and the `curl | sh` guard.
