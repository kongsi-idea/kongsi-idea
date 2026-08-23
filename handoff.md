# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

本次（2026-08-14）用《游戏化教学应用手册》理论库（Obsidian `知识库/教学/游戏化教学理论/`）审查了 5 个已上架工具作为试点，发现两类问题：

- **`tahun2-mt-wang`（钱币乐园）DSKP 登记跟实际代码对不上**：`published-tools-coverage.md` 原登记覆盖 4.1/4.2/4.3/4.6，但 `app.js` 只有「确认币值」「钱币组合」「抽签」三个模式，全档搜不到加减法/储蓄字样——已修正只登记实际覆盖的 4.1，并在优化备注栏加了说明
- **产线结构性缺口**：现有「扫 DSKP 空白 → 一个工具对应一个 DSKP 代码」的产线，天生只会产出教授/练习型工具，不管累积多少个都不会自然长出总结/复习型工具（复习要跨 DSKP 代码，索引是单点对应；前置不绑 DSKP，扫描空白不会触发它）。已写进 `published-tools-coverage.md`「教学环节分布的结构性缺口」一节

详细的审查方法、逐工具比对表见 Obsidian `知识库/教学/游戏化教学理论/index.md`「用在 kongsi-idea / teaching-tools 上的校准记录」一节。

上次（2026-08-06～08-12）从零做出 kelasku（老师登录管理班级/学生名单系统）并接上 2 个工具（liangci、shulie-duel），详见 git log `28f59a0`/`68e4d43`，关键决定与踩坑仍在 `agents.md`「kelasku」一节，此处不重复。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app（本次改动只动了 `docs/` 底下的文档，未涉及部署，不需要重新 `vercel --prod`）
- 本次修改：`docs/published-tools-coverage.md`，待 commit + push

## ➡️ 下一步

1. 想真正让钱币乐园覆盖 4.2/4.3/4.6，需要另外加「找零/加减法/储蓄」题型，不是登记问题能解决的
2. 想要总结/复习型工具，需要**单独立项**设计一种新形状（跨单元题库、开放式产出/reflection 类），不能延用现有「一个工具对一个 DSKP 代码」的产线去凑
3. 这次只试点了 5 个工具，其余 12 个已上架工具还没照这套理论逐一核对 DSKP 动词跟机制是否对齐，有空可以继续抽查

## ⚠️ 注意事项

- Google OAuth 使用 PKCE；登录状态继续依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回抢跑的 `getSession()`
- Supabase Client Secret、数据库密码等只留在已忽略的 `supabase/.secrets.local.md`，不可提交
- 许愿池状态流转栏位 `supabase/migration-2026-07-24-wish-pipeline-columns.sql` 写好了但仍未在 Supabase 执行，继承自更早的交接，本次没有再碰
- 工作目录里目前还有几个跟本次工作无关的未提交改动（`docs/tools-status.md`、`.mcp.json`、`docs/tool-modes-spec.md`、两个 supabase migration 文件）——本次没有碰这些，也没有一并提交，留给相关的那次工作自己收尾

## 🕐 最后更新

- 时间：2026-08-14
- 更新者：Claude @ MacBook Air M3
- Git push：待推
