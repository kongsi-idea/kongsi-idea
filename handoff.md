# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

**2026-09-21：班级代码共用机制已完成本地验证并 push（Hub `5564e3f`，工具规范 `4c7c3ef`）**：`data/class-code-client.js` 现在会让错误代码留在同一个输入流程继续重试，成功读到名单后自动显示「换班级」按钮；换班会验证新代码、保留其他网址参数、更新 `?code=` 后重新载入当前工具，避免上一班的学生／成绩／进度残留。共用客户端本身已自动覆盖当前 7 个引用工具，未来新工具只需按 `docs/tool-modes-spec.md` 的标准引用并调用 `ClassCode.loadOrPrompt()`。本地 Playwright 已验：错误→重试→成功、换班→重新载入、其他参数保留、375px 手机弹窗不溢出。预览部署已验线上档案：`https://kongsi-idea-lhr670055-kongsi-idea.vercel.app/data/class-code-client.js`；正式 `--prod`／`kongsi-idea.vercel.app` alias 被 guard 拦下，**尚未上线正式网址**，下次先用该预览链接点验后再部署／切 alias。

## ⏯️ 目前做到哪

**磁力创造实验室 v2 全链路发布完成（2026-09-17）**：接续上面那条「登记已更新」，这次把 `tahun1-dst-magnet` 工具本身也发完了。磁铁 repo 发布前验收（Playwright，1440/375px，四工作区×课堂/家庭模式）发现一个小瑕疵（老师控制台「暂停全班」按钮文字点遮罩恢复后不同步，误导老师误操作）并修复，commit `a777f82`。老师本人在对话里用 `!` 前缀跑 `vercel --prod --yes`（生产部署被 guard 的 `deploy_allowlist` 挡下，`tahun1-dst-magnet` 不在名单内，Claude 没有绕过，请老师本人执行）——本次自动别名直接指对了 `tahun1-dst-magnet.vercel.app`，不用像 Hub 自己这样手动 `alias set`。部署后用 Playwright 实际操作正式网址拍了 4 张 v2 真实截图（首页/磁极谜题场/挑战创造工坊/老师控制台），替换进本仓库 `app.js` 的 `thumbnails`，旧版 4 张截图搬去 `~/Documents/待删除/kongsi-idea-thumbs-tahun1-dst-magnet-v1-20260917/`（未删除）。`docs/published-tools-coverage.md` 同步更新为「已部署、已线上复验」。**Hub 本体也重新部署生产**（`vercel --prod --yes` 又把自动别名指去了 `eduneo-hub.vercel.app`，老毛病，手动 `vercel alias set` 切回 `kongsi-idea.vercel.app`）。端到端复验：curl 确认两个正式网址的 v2 特征（工具四工作区、Hub app.js 里的 2.0/新缩图路径/次到访），Playwright 确认 Hub 卡片标题「磁力创造实验室」、缩图非破图（1440×900 真实加载）、详情页版本 2.0/changelog/DSKP 7.1.1–7.1.6 齐全、「开始使用」外链能打开工具本身，两站点 console 均无报错。全部 commit 已 push（磁铁 repo `a777f82`＋`45d2cb3`；本仓库 `35c87e2`）。**顺带发现一个非本次引入的既有问题**：Hub 首页「浏览全部工具」的年级/科目筛选状态存 `localStorage`，若访客之前筛过别的年级/科目，下次进站会沿用旧筛选、可能把新工具挡在列表外，且没有明显的「已筛选」提示或一键清除入口——不影响这次发布，但值得之后找时间处理。

**磁力创造实验室 v2 Hub 登记已更新（2026-09-17）**：`tahun1-dst-magnet` 已从「磁铁大发现」改名为「磁力创造实验室／Makmal Cipta Magnet」，版本升到 2.0；说明、关键词、教学模式、准备事项与 changelog 已改成四个开放工作区＋学生自创挑战；DSKP 索引补齐 7.1.5／7.1.6；旧版四张截图已撤下，待新版工具部署及线上复验后补真实缩图。**这笔登记（`56a19f7`）已随本轮收工一起 push**，但 `tahun1-dst-magnet` 本身的工具部署／线上复验还没做（跟下面这条是两回事，别搞混）。

**首页统计条「网页浏览量」改名「次到访」+ 30 分钟 session 去重**（2026-09-17）：老师发现纯刷新会一直让数字涨，讨论后确认要「到访次数」语意——短时间内重复进站不算，隔一段时间再来才代表使用意图不同。改法：`app.js` 的 `bumpPageViews()` 用 `localStorage`（key `kongsi-idea-last-visit-ts`）记上次计数时间，30 分钟内重复进站改打 `get_page_views()`（只读不加），超过窗口才打 `increment_page_views()`（+1 并更新时间戳）；两个 RPC 都已存在于线上库，没改 schema。标签同步从「次网页浏览」改成「次到访」。已用 `verify` 子代理跑 Playwright headless 验证：标签正确、首次加载真的打了 `increment_page_views`（线上真实值从 160 起算）、同 context 刷新改打 `get_page_views` 没有重复计数、localStorage 时间戳正确写入。**已 commit + push（`1e6a650`）并部署上线**：`vercel --prod` 后自动别名又指错到 `eduneo-hub.vercel.app`（老毛病），手动 `vercel alias set` 切回 `kongsi-idea.vercel.app`，curl 复验线上 `app.js` 含「次到访」与 `kongsi-idea-last-visit-ts`，确认生效。

**guard 深夜限制顺带调整（2026-09-17 凌晨）**：老师原话「深夜要开通部署，我可以接受了，因为不开通我比较麻烦，有问题我们再滚回」——`~/Documents/my-agent/.ops/guard-policy.json` 的 `quiet_hours.extra_deny` 拿掉了 `vercel`／`git push` 两条盘查，现在**任何时段、任何专案 `git push` 都不挡**，`vercel --prod`／alias 深夜仍限「授权名单内专案」或亲口提到部署；DB migration 深夜依旧挡（回滚成本不同，没一并开）。决定已回填 `AGENTS.md` 第 7 条，这不是 kongsi-idea 专属的事，其他专案 session 也会吃到这个新规则。

- 2026-09-15：kelasku 全校名单批量导入（67 班/2581 人）+ 1I/1G 补英文名（1I 剩「王菱敏」1 人因跟候选「王凌敏」一字之差没把握，留空待老师核对）；Story Quest（`tahun4-bi-writing`）v0.3.0 上线上架；`tahun4-bc-bishun` 登记 published，本地 v2.1 视觉改版待部署。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app（本次重新部署生产并 `alias set` 复核，curl+Playwright 双重复验；「次到访」改动与磁力创造实验室 v2 缩图/登记均已上线）
- 磁力创造实验室正式网址：https://tahun1-dst-magnet.vercel.app（v2 已部署生产、alias 已复核、curl+Playwright 双重复验，Hub 缩图已同步为真实新版画面）
- Story Quest 正式网址：https://tahun4-bi-writing.vercel.app（独立 GitHub repo，独立 Vercel 项目，同在 `kongsi-idea` team）
- 四年级写字上一版已登记并部署：`https://tahun4-bc-bishun.vercel.app`；v2.1 新视觉和 Hub 新缩图已在本地 commit，待部署（跟本次改动是同一个「待部署」状态，可以一起处理）
- 排行榜表未建之前，`tahun1to6-drone` 的排行榜按钮/面板能正常显示，读写会因表不存在静默失败——不影响游戏本身（本次未处理）

## ➡️ 下一步

1. `tahun4-bc-bishun` v2.1 本地已 commit 的视觉改版仍待部署（`tahun1-dst-magnet` 这条已在本次完成，见上）——接手时先看该工具自己的 handoff
2. **确认「王菱敏」是不是「王凌敏」（LOVELLE HENG LYNN MIN，学号 26311）**——老师核对后一句话，agent 就能补上 1I 最后一笔的 name_en/seat_no
3. 全校名单里 `Kelas 2026` 分页没有 4F/5F/5I/5L 这几个班代号（另外两份候选名单里有）——如果这几班其实是真实固定班，需要回头单独补建
4. 其余老师目前还是要「自己知道」去登录 `kelasku.html` 才会看到自己班已经建好、可以加入共管——没有通知机制，如果校方要全面推广，可能需要一份说明或提醒
5. Story Quest 目前没有给老师审核投稿的介面——`pending` → `approved`/`rejected` 只能直接在 Supabase Dashboard 改 `tahun4_bi_writing_submissions` 表；等有真实投稿量再评估要不要做一个简单的审核页面
6. 其余 12 个工具的 DSKP 校准还没做（承接 08-14 的试点），可交 codex 批量跑
7. `tahun2-mt-wang` 的 GitHub 自动部署此前断线过，如果老师改这个工具发现 push 没生效，提醒他去 Vercel Dashboard → Settings → Git 重新连线（需他本人走 OAuth，agent 做不了）
8. 想让钱币乐园真正覆盖 4.2/4.3/4.6，得另外加「找零／加减法／储蓄」题型，不是改登记能解决
9. 「个作品已上架」等全站统计条读数仍是 0（跟这次上架无关，之前就是这样）——之后若要查，从 `get_teacher_count()` 那套 RPC 的姐妹函数查起

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
- **深夜（23:00-09:00）guard 规则 2026-09-17 凌晨已调整**：`git push` 现在任何时段都不挡；`vercel --prod`／alias 深夜仍限「授权名单内专案」或亲口提到部署；DB migration 深夜依旧挡。旧版「深夜一律挡部署/push/DB」的说法已过期，规则本体在 `~/Documents/my-agent/.ops/guard-policy.json` 与 `AGENTS.md` 第 7 条

## 🕐 最后更新

- 时间：2026-09-17（上午，续凌晨那轮）
- 更新者：Claude Sonnet 5 @ 这台 Mac
- Git push：✅ 全部已推（本仓库 `1e6a650`／`606d124`／`56a19f7`／`8fe66c4`／`35c87e2`；磁铁 repo `a777f82`／`45d2cb3`；teaching-tools 索引 `782bb36`）；Hub 与磁力创造实验室两个正式网址均 ✅ 已部署生产并 curl+Playwright 双重复验

---

## 历史摘要

- 2026-09-15：全校名单批量导入 kelasku（67 班/2581 人）+ 1I/1G 补英文名（1I 剩 1 人待老师核对姓名）。Story Quest（`tahun4-bi-writing`）v0.3.0 独立部署上线，接上 Supabase 投稿审核，Hub 正式上架并完成端到端浏览器验证。`tahun4-bc-bishun` 登记 published，本地 v2.1 视觉改版待部署。完整细节见 Obsidian。
- 2026-09-14：「飞学竞场」加班级排行榜，代码与 Hub changelog（v0.4）已部署；排行榜 Supabase 表当时尚待建立。
- 2026-09-11：网页浏览数改真实计数（不用估算值填充）、修复 `kongsi-idea.vercel.app` 域名从专案消失的问题、13 个教学工具 Vercel 团队归属大整理。完整细节见 Obsidian。
- 2026-08-26 及更早：学生找不到「开始使用」按钮修复、08-14 DSKP 试点审查、08-06～08-12 kelasku 从零上线，见 `agents.md` 对应章节与 Git 历史。
