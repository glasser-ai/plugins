# Glasser Competitor Research

独立的 ChatGPT 插件：按名称或域名调研竞品的定位、融资、团队、招聘、流量、SEO、Google 广告、社媒和历史，每个竞品一份档案，多个竞品另出对比。

MCP:`https://api.glasser.ai/mcp?toolset=competitor`。复用 Glasser OAuth,不依赖本地 CLI 或通用 Glasser 插件。

Skill 源自 `glasser-ai/skills/skills/competitor-research/SKILL.md` 0.1.0;保留输入、三步流程、核心与按需维度、档案与对比的报告格式和不可信输入规则。只改工具迫使改动的部分：开头(本插件的连接代替 CLI 安装)、维度表(工具名代替目录搜索词)、执行前报价确认与结尾的费用记录。流量来源拆分没有工具，按原 Skill 规则记为缺失;广告只覆盖 Google。

先部署 API 的 competitor 工具组(含 `company_intelligence` 的 `jobs`、`ads` 两个 action),再连接测试账号，逐条执行 manifest 中 5 个正向与 3 个反向用例。新工具组尚未部署时不能提审，也不能把静态校验当作端到端验收。

打包与静态检查：在本目录运行 `node scripts/pack.mjs`。ZIP 写在父目录，不把脚本和本说明打进包。

上线演示需覆盖:OAuth 连接、执行前费用确认、单个竞品的核心维度档案、两个竞品的对比和实际费用记录。录制本插件自己的视频，并把真实可访问的 demo_recording_url 加入 manifest 的 review 字段;不要复用其他插件的录像。

发布前另外检查：无充值链接、无 CLI 安装、无通用执行工具、所有价格来自当前契约;招聘行数不能说成岗位总数，广告不能说成全平台;同一维度对每个竞品用同一 Provider。
