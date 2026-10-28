# Glasser for the OpenAI plugin directory

`openai/glasser/` is the package submitted to the OpenAI plugin directory (ChatGPT and Codex). It is separate from `plugins/glasser/`, which serves Claude Code, Cursor, Codex CLI and OpenClaw: that skill teaches the `glasser` CLI, which a ChatGPT conversation cannot run, and its listing text does not meet the directory's commerce rules.

The package has one skill and no MCP configuration: the directory rejects MCP configuration inside the ZIP. The MCP server is added in the portal with **With MCP**:

```
https://api.glasser.ai/mcp?toolset=directory
```

`toolset=directory` serves `search`, `inspect`, `run` and `runs_get` with text that has no links, no add-funds wording and no provider names (ADR-0031 §9 in the Glasser API repository).

## Build the ZIP

Run from this directory:

```bash
(cd glasser && zip -r -X ../glasser-openai.zip .codex-plugin skills assets)
```

Upload `glasser-openai.zip` in the plugin portal and keep the listing text in `glasser/.codex-plugin/plugin.json` as the single source.


## Glasser Prospect Lists

`glasser-prospect-lists/` 是独立的 Prospect Lists 包，连接 `?toolset=prospect`。
公司筛选、联系人、独立邮箱核验与按需手机号查询使用该插件自己的专用工具；不依赖
通用 Glasser 插件或 CLI。包中包含 5 个正向、3 个反向审核用例。

静态检查与打包：`node glasser-prospect-lists/scripts/pack.mjs`。
先部署 Glasser API 中的 prospect 工具组，再执行审核用例、录制真实演示并补入
`demo_recording_url`，最后提交。部署与真实调用验证完成前，不把 ZIP 标作可提审版本。
