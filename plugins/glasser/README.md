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
| Logo, rasterised | `assets/icon.png` | ClawHub's plugin catalogue |
| Manifest | `openclaw.plugin.json` | ClawHub, OpenClaw |

Both MCP files point at `https://api.glasser.ai/mcp` and carry no
credentials: the server speaks OAuth, so the client signs the user in on
first use. `scripts/check-manifests.mjs` fails if the two files differ at
all, or if a header or variable creeps back in.

`openclaw.plugin.json` carries the id, the display name and the one category
ClawHub allows a plugin to declare; `clawhub package publish` refuses a bundle
without it. It holds no version — the version travels on the publish command, so
`check-manifests.mjs` has nothing extra to keep in step. It declares no
entrypoint: an `openclaw.extensions` field would make OpenClaw take the native
plugin path, and this package has no code to load. OpenClaw reads the bundle
instead, mapping `skills/` to a skill root and `mcp.json` into `mcpServers`.

`assets/icon.png` is that same mark at 1024x1024, rasterised from `logo.svg`.
ClawHub ignores icon URLs and paths in the manifest and draws only a PNG bundled
in the package; without one the catalogue falls back to a category glyph. Keep
it under 512 KiB and regenerate it whenever `logo.svg` changes.

`assets/logo.svg` is 1:1 and transparent, a byte-identical copy of
`docs/assets/brand/generated/logo-panel.svg` in the Glasser monorepo, where a
generator produces it from the master mark. Clients draw their own container —
a dark rounded card — so the icon leaves the ground to them; a baked plate puts
a white card on top of theirs. It ships the reversed colour pair for the same
reason: the primary pair has a black head, which on a dark card vanishes and
leaves the goggles floating. `check-manifests.mjs` asserts square and a
non-black head so neither can regress; when the mark changes, bring the new
file over.

## ChatGPT / Codex 图标

`.codex-plugin/plugin.json` 提供 OpenAI 展示配置，引用现有的
`assets/icon.png`，用于插件 Logo 和输入框图标。根目录的 `plugin.json`
保留 Agent Plugins 格式；不要另加 `extensions.com.openai`，否则会覆盖
这份兼容配置。

Skill 单独通过 `skills/glasser/agents/openai.yaml` 声明图标。
`skills/glasser/assets/icon.png` 是插件 PNG 的逐字节副本，保证单独分发
Skill 时图标仍在包内。更新 Logo 时同步这两份 PNG；一致性检查会拦截遗漏。

修改源仓库不会替换客户端已经安装的缓存。发布新版本后，需要更新插件，
再打开新聊天检查图标与工具。图标校验通过不代表 MCP 已完成 OAuth 授权。
