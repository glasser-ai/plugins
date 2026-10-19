# Glasser for the OpenAI plugin directory

`openai/glasser/` is the package submitted to the OpenAI plugin directory (ChatGPT and Codex). It is separate from `plugins/glasser/`, which serves Claude Code, Cursor, Codex CLI and OpenClaw: that skill teaches the `glasser` CLI, which a ChatGPT conversation cannot run, and its listing text does not meet the directory's commerce rules.

The package has one skill and one remote MCP server in `.mcp.json`:

```
https://api.glasser.ai/mcp?toolset=directory
```

`toolset=directory` serves `search`, `inspect`, `run` and `runs_get` with text that has no links, no add-funds wording and no provider names (ADR-0031 §9 in the Glasser API repository).

## Build the ZIP

Run from this directory:

```bash
(cd glasser && zip -r -X ../glasser-openai.zip .codex-plugin .mcp.json skills assets)
```

Upload `glasser-openai.zip` in the plugin portal and keep the listing text in `glasser/.codex-plugin/plugin.json` as the single source.
