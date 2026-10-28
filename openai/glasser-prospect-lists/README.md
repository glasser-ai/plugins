# Glasser Prospect Lists

独立的 ChatGPT 插件：按 ICP、给定名单或目录页面找公司和联系人，独立验证邮箱，按需查手机号。

MCP：`https://api.glasser.ai/mcp?toolset=prospect`。复用 Glasser OAuth，不依赖本地 CLI 或通用 Glasser 插件。

Skill 源自 `glasser-ai/skills/skills/prospect-list/SKILL.md` 0.1.0；保留输入、七阶段流程、公司表、联系人表、tier 和费用记录，替换安装依赖与能力查找表。

先部署 API 的 prospect 工具组，再连接测试账号，逐条执行 manifest 中 5 个正向与 3 个反向用例。新工具组尚未部署时不能提审，也不能把静态校验当作端到端验收。

打包与静态检查：在本目录运行 `node scripts/pack.mjs`。ZIP 写在父目录，不把脚本和本说明打进包。

上线演示需覆盖：OAuth 连接、执行前费用确认、小样本公司筛选、联系人与独立邮箱核验、两张输出表和实际费用记录。录制新插件自己的视频并将真实可访问的 demo_recording_url 加入 manifest 的 review 字段；不要复用 SEO 的录像。

发布前另外检查：无充值链接、无 CLI 安装、无未扫描工具、所有价格来自当前契约；无效/unknown/catch-all 核验不能标成已验证可投递。对两家公司重放同一个幂等键，确认不会再次扣费。
