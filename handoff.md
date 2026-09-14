# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

Story Quest（`tahun4-bi-writing`）v0.3.0 已正式上线并上架 Hub：独立 Vercel 项目部署成功、Supabase 投稿审核管线（private bucket + pending 状态）已在 project `gntnkhkkgonaehapcerr` 执行并真实验证过，`app.js` 已改 `published` 并填入正式网址，线上 Hub 搜索/筛选/详情页/「开始使用」全部走过一遍真实浏览器验证。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app（本次已验证线上 `app.js` 确实是 `tahun4-bi-writing` 的 `published` + 真实网址）
- Story Quest 正式网址：https://tahun4-bi-writing.vercel.app（独立 GitHub repo `kongsi-idea/tahun4-bi-writing`，独立 Vercel 项目，同在 `kongsi-idea` team）
- 排行榜表未建之前，`tahun1to6-drone` 的排行榜按钮/面板能正常显示，读写会因表不存在静默失败——不影响游戏本身（沿用上一轮记录，本次未处理）

## ➡️ 下一步

1. Story Quest 目前没有给老师审核投稿的介面——`pending` → `approved`/`rejected` 只能直接在 Supabase Dashboard 改 `tahun4_bi_writing_submissions` 表；等有真实投稿量再评估要不要做一个简单的审核页面
2. 其余 12 个工具的 DSKP 校准还没做（承接 08-14 的试点），可交 codex 批量跑
3. `tahun2-mt-wang` 的 GitHub 自动部署此前断线过，如果老师改这个工具发现 push 没生效，提醒他去 Vercel Dashboard → Settings → Git 重新连线（需他本人走 OAuth，agent 做不了）
4. 想让钱币乐园真正覆盖 4.2/4.3/4.6，得另外加「找零／加减法／储蓄」题型，不是改登记能解决
5. 网页浏览数字（page_view_counter）目前仍偏低，老师已知情决定先不处理；数字自然长了几天后可回头看要不要藏卡
6. 「个作品已上架」等全站统计条读数仍是 0（本次未查根因，跟这次上架无关，之前就是这样）——之后若要查，从 `get_teacher_count()` 那套 RPC 的姐妹函数查起

## ⚠️ 注意事项

- **`git push` 成功 ≠ 上线**：这个专案（以及独立工具如 `tahun1to6-drone`、`tahun4-bi-writing`）都没有可靠的 GitHub 自动部署。固定收尾三步：`vercel --prod --yes` → 确认域名还在专案 Domains 列表 → `curl` 线上档案确认新内容在。详见 `agents.md`「部署提醒」。
- **`kongsi-idea.vercel.app` 域名本身曾经从专案 Domains 列表消失过，本次又发生一次**：2026-09-15 本次 `vercel --prod --yes` 自动把别名指去了 `eduneo-hub.vercel.app`（不是 `kongsi-idea.vercel.app`），照三步流程手动 `vercel alias set <新部署url> kongsi-idea.vercel.app` 后才正常——这不是猜测的风险，是这次真的发生的。**以后每次部署都不能省略这一步，且不能假设自动别名会指对域名。**
- **Story Quest 投稿的 anon insert 千万不能带 `.select()`／`Prefer: return=representation`**：RLS 只给 anon INSERT policy、没给 SELECT policy，带 RETURNING 会在写入阶段本身就被 RLS 挡下（`42501`），即使 WITH CHECK 条件完全满足也一样——这是 Postgres 对 INSERT…RETURNING 的已知行为（RETURNING 需要能"读回"这行才算过关）。frontend 端要用 `Prefer: return=minimal`（supabase-js 就是 `.insert()` 不接 `.select()`），已在 `teaching-tools/tahun4-bi-writing/src/lib/submission.ts` 这样处理并真实测过。以后任何新工具要做「匿名只能新增、不能读」的投稿表，都会踩到同一个坑。
- **Vercel 专案分布在两个团队**：`kongsi-idea`（教学工具 + hub 本体）与 `mr007's projects`（老师口中「yquan77」，放 hks-hub/EduNeo/kk2-selamat/bliayad 等主力产品）。新建 `tahunN-科目-单元` 工具确认部署到 `kongsi-idea` 团队。
- **详情弹窗第一屏属于学生**：见 `agents.md` 关键决定 7。
- `.mcp.json` 已加进 `.gitignore`；`data/supabase-client.js` 的 anon key 设计上公开。
- Google OAuth 用 PKCE；登录状态依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回 `getSession()`
- Supabase Client Secret、数据库密码只留在已忽略的 `supabase/.secrets.local.md`，不可提交
- **这台机器现在其实有办法跑 migration，不用再手贴 Dashboard**：`npx supabase db push --db-url` 需要额外 login token 走不通，但直接用 `.secrets.local.md` 里的数据库密码，透过 `psycopg2`（Python 已内建，`pip` 有装）直连 `db.gntnkhkkgonaehapcerr.supabase.co:5432` 执行 SQL 完全可行——本次 `tahun4_bi_writing_submissions` migration 就是这样跑的，比手贴 Dashboard SQL Editor 快也更可重复。以后新 migration 优先用这个方式。
- 许愿池状态流转栏位 `supabase/migration-2026-07-24-wish-pipeline-columns.sql` 写好了但仍未在 Supabase 执行，继承自更早的交接，长期没跑

## 🕐 最后更新

- 时间：2026-09-15
- 更新者：Claude Sonnet 5 @ 这台 Mac
- Git push：✅ 已推（`kongsi-idea`、`tahun4-bi-writing`、`teaching-tools` 三个仓库都已推且 `kongsi-idea`／`tahun4-bi-writing` 已生产部署并验证）

---

## 历史摘要

- 2026-09-15：Story Quest（`tahun4-bi-writing`）v0.3.0 独立部署上线，接上 Supabase 投稿审核（private bucket + pending 状态），Hub 正式上架并完成端到端浏览器验证。完整细节见 Obsidian。
- 2026-09-14：「飞学竞场」加班级排行榜，代码与 Hub changelog（v0.4）已部署；排行榜 Supabase 表当时尚待建立。
- 2026-09-11：网页浏览数改真实计数（不用估算值填充）、修复 `kongsi-idea.vercel.app` 域名从专案消失的问题、13 个教学工具 Vercel 团队归属大整理。完整细节见 Obsidian。
- 2026-08-26 及更早：学生找不到「开始使用」按钮修复、08-14 DSKP 试点审查、08-06～08-12 kelasku 从零上线，见 `agents.md` 对应章节与 Git 历史。
