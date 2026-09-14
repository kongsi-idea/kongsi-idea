# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

「飞学竞场」（`tahun1to6-drone`）已发布上架并加了班级排行榜（接 kelasku 身份、穿环竞速/答题竞速分开两张榜）。代码与 Hub changelog（v0.4）都已部署上线；唯一没做完的是排行榜的 Supabase 数据表还没建——迁移文件 `supabase/migration-2026-09-14-tahun1to6-drone-scores.sql` 已写好并 commit，**等 Yong Quan 手动贴到 Supabase Dashboard（项目 `gntnkhkkgonaehapcerr`）的 SQL Editor 执行一次**。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app（本次已验证线上 `app.js` 确实是 v0.4）
- 工作目录干净，两个仓库（`kongsi-idea`、`tahun1to6-drone`）都已 commit + push + `vercel --prod` 部署
- 排行榜表未建之前，`tahun1to6-drone` 的排行榜按钮/面板能正常显示，读写会因表不存在静默失败——不影响游戏本身

## ➡️ 下一步

1. **等 Yong Quan 跑排行榜 migration**（见上），跑完后用真实班级代码走一遍完整提交/查榜流程再确认
2. 其余 12 个工具的 DSKP 校准还没做（承接 08-14 的试点），可交 codex 批量跑
3. `tahun2-mt-wang` 的 GitHub 自动部署此前断线过，如果老师改这个工具发现 push 没生效，提醒他去 Vercel Dashboard → Settings → Git 重新连线（需他本人走 OAuth，agent 做不了）
4. 想让钱币乐园真正覆盖 4.2/4.3/4.6，得另外加「找零／加减法／储蓄」题型，不是改登记能解决
5. 网页浏览数字（page_view_counter）目前仍偏低，老师已知情决定先不处理；数字自然长了几天后可回头看要不要藏卡

## ⚠️ 注意事项

- **`git push` 成功 ≠ 上线**：这个专案（以及独立工具如 `tahun1to6-drone`）都没有可靠的 GitHub 自动部署。固定收尾三步：`vercel --prod --yes` → 确认域名还在专案 Domains 列表 → `curl` 线上档案确认新内容在。详见 `agents.md`「部署提醒」。
- **`kongsi-idea.vercel.app` 域名本身曾经从专案 Domains 列表消失过**（原因未知）。遇到「部署三步都跑了，线上还是旧的」先查域名还在不在，不要只重复部署。
- **Vercel 专案分布在两个团队**：`kongsi-idea`（教学工具 + hub 本体）与 `mr007's projects`（老师口中「yquan77」，放 hks-hub/EduNeo/kk2-selamat/bliayad 等主力产品）。新建 `tahunN-科目-单元` 工具确认部署到 `kongsi-idea` 团队。
- **详情弹窗第一屏属于学生**：见 `agents.md` 关键决定 7。
- `.mcp.json` 已加进 `.gitignore`；`data/supabase-client.js` 的 anon key 设计上公开。
- Google OAuth 用 PKCE；登录状态依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回 `getSession()`
- Supabase Client Secret、数据库密码只留在已忽略的 `supabase/.secrets.local.md`，不可提交
- 这台机器没有 `supabase` CLI 也没有 `psql`，所有 migration 都只能手动贴 Dashboard 执行（已用 `which` 确认，不是偷懒跳过）
- 许愿池状态流转栏位 `supabase/migration-2026-07-24-wish-pipeline-columns.sql` 写好了但仍未在 Supabase 执行，继承自更早的交接，长期没跑

## 🕐 最后更新

- 时间：2026-09-14
- 更新者：Claude Sonnet 5 @ 这台 Mac
- Git push：✅ 已推（`kongsi-idea` 与 `tahun1to6-drone` 两个仓库都已推且已生产部署）

---

## 历史摘要

- 2026-09-11：网页浏览数改真实计数（不用估算值填充）、修复 `kongsi-idea.vercel.app` 域名从专案消失的问题、13 个教学工具 Vercel 团队归属大整理。完整细节见 Obsidian。
- 2026-08-26 及更早：学生找不到「开始使用」按钮修复、08-14 DSKP 试点审查、08-06～08-12 kelasku 从零上线，见 `agents.md` 对应章节与 Git 历史。
