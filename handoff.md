# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

**2026-09-25：工具详情弹窗「分享给学生」功能上线（两次迭代）**：第一版做了 QR 码分享（`43776e0`），第二版依老师反馈把「复制分享链接」「显示QR码」两个等重按钮合并成一个次要小图标按钮 `#detailShareBtn`（`d74e91e`）——点一下同时复制链接＋就地生成QR码（`qrcode-generator` CDN，离线生成不外传网址），再点一次收起；换工具时状态自动重置。设计原因见 `agents.md` 关键决定 19。两次都用独立起的 headless Chromium（非共享 Playwright MCP，当时被另一 session 锁住）跑过 Playwright 验证（生成/切换/换工具重置、剪贴板内容、console 无相关报错），均已 `git push` + `vercel --prod --yes` + `vercel alias set --scope kongsi-idea` 三步生产部署，curl 复验线上文件含新代码。讨论中确认「详情打开次数」转化率指标暂不做（见 `agents.md` 关键决定 20），老师说好再动手。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app（含合并版分享按钮，已 curl 复验）
- 磁力创造实验室：https://tahun1-dst-magnet.vercel.app（v2 已上线）
- Story Quest：https://tahun4-bi-writing.vercel.app（独立 repo，同 `kongsi-idea` team）
- `tahun4-bc-bishun` v2.1 视觉改版**仍待部署**（本地已 commit，接手先看该工具自己的 handoff）
- 排行榜表未建之前，`tahun1to6-drone` 排行榜面板能显示但读写静默失败（不影响游戏本身）

## ➡️ 下一步

1. `tahun4-bc-bishun` v2.1 待部署——接手先看该工具自己的 handoff
2. 确认「王菱敏」是不是「王凌敏」（LOVELLE HENG LYNN MIN，学号 26311）——老师核对后一句话即可补 1I 最后一笔 name_en/seat_no
3. 全校名单 `Kelas 2026` 分页缺 4F/5F/5I/5L 这几个班代号——如果是真实固定班需回头单独补建
4. Story Quest 投稿审核目前只能在 Supabase Dashboard 手改 `pending`→`approved`/`rejected`；等真实投稿量再评估要不要做审核页面
5. 「详情打开次数」转化率指标：老师已认同价值但还没拍板动手，等他一句话
6. 其余 12 个工具的 DSKP 校准还没做（承接 08-14 试点）

## ⚠️ 注意事项

- **`git push` 成功 ≠ 上线**：这个专案（以及独立工具如 `tahun1to6-drone`、`tahun4-bi-writing`）都没有可靠的 GitHub 自动部署。固定收尾三步：`vercel --prod --yes` → 确认域名还在专案 Domains 列表 → `curl` 线上档案确认新内容在。详见 `agents.md`「部署提醒」。
- **`vercel --prod --yes` 的自动别名常指错到 `eduneo-hub.vercel.app`**，不是 `kongsi-idea.vercel.app`——每次部署都要手动 `vercel alias set <新部署url> kongsi-idea.vercel.app --scope kongsi-idea` 复核，不能假设自动别名会指对域名。
- **Story Quest 投稿的 anon insert 千万不能带 `.select()`／`Prefer: return=representation`**：RLS 只给 anon INSERT policy、没给 SELECT policy，带 RETURNING 会在写入阶段被拒（`42501`）。frontend 一律 `Prefer: return=minimal`（supabase-js 就是 `.insert()` 不接 `.select()`），已在 `teaching-tools/tahun4-bi-writing/src/lib/submission.ts` 这样处理。任何「匿名只能新增、不能读」的投稿表都会踩到同一个坑。
- **Vercel 专案分布两个团队**：`kongsi-idea`（教学工具 + hub 本体）与 `mr007's projects`（老师口中「yquan77」，放 hks-hub/EduNeo/kk2-selamat/bliayad 等）。新建 `tahunN-科目-单元` 工具确认部署到 `kongsi-idea` 团队。
- **详情弹窗第一屏属于学生**：见 `agents.md` 关键决定 7、19。
- `.mcp.json` 已加进 `.gitignore`；`data/supabase-client.js` 的 anon key 设计上公开。
- Google OAuth 用 PKCE；登录状态依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回 `getSession()`
- Supabase Client Secret、数据库密码只留在已忽略的 `supabase/.secrets.local.md`，不可提交
- 跑 migration 优先用 `.secrets.local.md` 的密码＋Python `psycopg2` 直连 `db.gntnkhkkgonaehapcerr.supabase.co:5432`，比手贴 Dashboard SQL Editor 快也更可重复
- 许愿池状态流转栏位 `supabase/migration-2026-07-24-wish-pipeline-columns.sql` 写好了但仍未在 Supabase 执行，长期没跑
- 深夜（23:00-09:00）`git push` 不挡；`vercel --prod`／alias 深夜限授权名单内专案或亲口提到部署；DB migration 深夜依旧挡。规则本体在 `~/Documents/my-agent/.ops/guard-policy.json` 与 `AGENTS.md` 第 7 条

## 🕐 最后更新

- 时间：2026-09-25
- 更新者：Claude Sonnet 5 @ 这台 Mac
- Git push：✅ 已推（`43776e0`／`d74e91e`）；Hub 正式网址已部署生产并 curl 复验

---

## 历史摘要

- 2026-09-21：班级代码共用机制上线（`5564e3f`），错误代码留在同一输入流程重试、成功后可「换班级」，换班保留其他网址参数并清掉旧班状态；本地 Playwright 验证过错误→重试→成功、375px 手机弹窗不溢出。
- 2026-09-17：磁力创造实验室 v2 全链路发布（改名「磁力创造实验室」、四工作区新设计、Hub 缩图换新、DSKP 补齐）；首页统计条「网页浏览量」改名「次到访」加 30 分钟 session 去重（`1e6a650`）；guard 深夜限制放开 `vercel`/`git push` 盘查（DB migration 仍挡）。
- 2026-09-15：全校名单批量导入 kelasku（67 班/2581 人）；Story Quest（`tahun4-bi-writing`）v0.3.0 上线上架，接上 Supabase 投稿审核；`tahun4-bc-bishun` 登记 published，v2.1 视觉改版待部署。
- 2026-09-14：飞学竞场加班级排行榜（v0.4）；排行榜 Supabase 表当时尚待建立。
- 2026-09-11：网页浏览数改真实计数、修复 `kongsi-idea.vercel.app` 域名从专案消失的问题、13 个教学工具 Vercel 团队归属整理。
- 2026-08-26 及更早：学生找不到「开始使用」按钮修复（详情弹窗第一屏改给学生）、08-14 DSKP 试点审查、08-06～08-12 kelasku 从零上线。完整细节见 Obsidian `專案工作流程.md`。
