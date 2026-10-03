# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

**2026-09-30～10-04：首页大整理，全部已上线**（正式站 = `8086a1f`，`b07ac42` 为纯文档）。老师看手机／桌面截图逐轮反馈，做了：
- **提速**：缩略图改 WebP 小图（首页 8.56MB→0.87MB，`scripts/build-thumbs.py`），`vercel.json` 缓存 `/assets/*`，喜欢数本机缓存。
- **版面**：全站 `.container` 天地格；工具卡 subgrid 行对齐（6 行）；≤560px 手机改横式清单卡（整页 14,500→5,500px）；手机页首三行；卡片拿掉开发代号、🏆 换 SVG。
- **搜索与筛选**：只留一个搜索框；`finderState` 为唯一来源，上下年级／科目／单元／关键词双向同步，卡片上方显示条件＋清除；没有工具的科目灰色按不到（只列该年级课纲有的科目）；拿掉所有「整理中」；条件只存网址、不存 localStorage（干净网址＝全部工具）。
- **关于区块**：文案精简，联络改 Telegram 私讯按钮（`t.me/yquanloo`）。
- 验证：本机 320–1920px 多尺寸；10-03 Sonnet verify 在正式站桌面＋手机 10 条全过。决策与理由见 `agents.md` 关键决定 21–24。
- **另一个 session 也在改这个专案**（上架 Huruf、光的小探险、新增科目 `am`），开工先 `git fetch` 看 `HEAD..@{u}`。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app（= `8086a1f`，含上下同步条件、横式手机卡片，已 curl 复验）
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

- 时间：2026-10-04
- 更新者：Claude Sonnet 5.5 @ 这台 Mac
- Git push：✅ 已推（`8086a1f` 代码；本次收工文档 commit 见 git log）；正式站已 curl 复验

---

## 历史摘要

- 2026-09-30～10-04：首页提速＋天地格＋subgrid 卡片＋手机横式卡＋单一搜索框＋上下同步条件＋灰色无工具科目＋Telegram 联络（见上方「目前做到哪」）。
- 2026-09-25：详情弹窗「分享给学生」（QR＋复制链接合成一个次要按钮，`43776e0`／`d74e91e`），见 `agents.md` 关键决定 19。
- 2026-09-21：班级代码共用机制上线（`5564e3f`），错误代码留在同一输入流程重试、成功后可「换班级」，换班保留其他网址参数并清掉旧班状态；本地 Playwright 验证过错误→重试→成功、375px 手机弹窗不溢出。
- 2026-09-17：磁力创造实验室 v2 全链路发布（改名「磁力创造实验室」、四工作区新设计、Hub 缩图换新、DSKP 补齐）；首页统计条「网页浏览量」改名「次到访」加 30 分钟 session 去重（`1e6a650`）；guard 深夜限制放开 `vercel`/`git push` 盘查（DB migration 仍挡）。
- 2026-09-15：全校名单批量导入 kelasku（67 班/2581 人）；Story Quest（`tahun4-bi-writing`）v0.3.0 上线上架，接上 Supabase 投稿审核；`tahun4-bc-bishun` 登记 published，v2.1 视觉改版待部署。
- 2026-09-14：飞学竞场加班级排行榜（v0.4）；排行榜 Supabase 表当时尚待建立。
- 2026-09-11：网页浏览数改真实计数、修复 `kongsi-idea.vercel.app` 域名从专案消失的问题、13 个教学工具 Vercel 团队归属整理。
- 2026-08-26 及更早：学生找不到「开始使用」按钮修复（详情弹窗第一屏改给学生）、08-14 DSKP 试点审查、08-06～08-12 kelasku 从零上线。完整细节见 Obsidian `專案工作流程.md`。
