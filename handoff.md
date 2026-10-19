# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

**2026-10-19：「分享给学生」改成直接复制工具网址**（my-agent 主会话）：以前一般工具复制的是 Hub 的 `?tool=<slug>`，学生会先进 Hub；10-08 起工具直接打开也计次，所以改成一律给工具网址（复习卷本来就是）。只改 `app.js` 的 `shareToolLink`（`6fedb26`），已 `vercel --prod` 并 curl 线上 `app.js` 确认新代码在；没在浏览器实点。决定写进 `agents.md` 第 19 条。回滚：`git revert 6fedb26` 后重新 `vercel --prod --yes`。
- 工作区里 `agents.md` 第 40 条、`handoff.md` 用量结果、`花费记录.md` 10-19 那行、`_retro/2026-10-19-Vercel…` 是**清 Vercel 旧部署那个会话收工后没提交的改动**，本次没一起提交，原样留着待那边或老师决定。

**2026-10-19：「位老师注册」少算一大半，已修**（Hub 会话 my-agent-79）：首页显示 110，实际登录过的老师 261。真因是登记用 `upsert`（`ON CONFLICT`），RLS 下要 SELECT 权限，`profiles` 不开 SELECT，所以从 08-07 起每次都失败（只有两次手动补登进了表）。`app.js`、`kelasku.js` 改普通 `insert`；DB 补了 151 笔（只加资料，不改结构；回滚清单在当次会话 scratchpad）。决定见 `agents.md` 第 28 条。老师 10-19 点过预览后 `vercel promote` 切正式（线上 `app.js`／`kelasku.js` 已是 insert），再补登切换前后的空档；复验：auth.users 264＝profiles 264，修正后有新老师由网站自己写入（不是补登）。

**2026-10-19：清 Vercel 旧部署（只动 Vercel，没改代码）**（my-agent 主会话）：老师问 Hobby 用量还够用多久（Deployment Storage 7.26/10GB、CDN Requests 65 万/100 万）。查出配额是整个团队共用，Hub 占大头；删了 133 个旧部署（Hub 83＋六个较大工具专案 50），线上 Hub 与工具逐个 curl 皆 200。决定见 `agents.md` 第 40 条。
- **未验证**：Usage 页的 Deployment Storage 有没有降（MCP 与 CLI 都读不到团队用量，要老师刷新 Vercel Usage 页看；统计可能延迟几小时）。
- **没做**：`.vercelignore` 排除 `assets/thumbs` 原图（见第 40 条）；CDN Requests 超过 80 万要考虑 Pro。

**2026-10-17（晚）：许愿池批量收尾**（my-agent 主会话）：钱币小掌柜封面重画（`d6868ad`，RM50 蓝绿、纸钞横放）＋ dressing 缩略图重建（`56f4813`，讯息误写「误覆盖」，实为同档重建）；Hub `vercel deploy --prod` 后 promote，现行部署 `kongsi-idea-cl8lrlx9h`（回滚：`vercel promote kongsi-idea-mttbcvz05 --scope kongsi-idea --yes`）。许愿单：14 shipped／#11 declined／#7 #13 #18 已寄说明信等回信／#8 待老师决定是否 declined。细节见 `../teaching-tools/handoff.md`。

**2026-10-17（下午）：欢迎卡问「老师／学生」、新老师指南 `guide.html`、管理手册 `docs/管理手册.md`、Hub 带设备码 `kd`**（`e8e15e4`、`2cd3f32` 已推）。
- 本来要先部署预览版给老师点、再切正式网址，结果别的 session 上架 `tahun5-mt-wang`／`tahun2-bc-xingsi` 时从 main 部署 prod，把这些改动一起推上线了。正式网址 curl 复验：`guide.html` 200，`app.js` 有 `registerHubDevice`。**老师还没在线上看过欢迎卡**。
- 管理手册另有私人 Artifact 版：https://claude.ai/artifact/Dbom31RP9TQbyC6Zwdg25t
- 手册查出的矛盾条目，10-19 老师说「你决定」，已统一（决定 3／19／20／28、资料夹结构、许愿池规格状态、本档目前状态与下一步）。

**2026-10-17：Hub 整理上线**（`a87c3c6`、`55d07f0` 已推，已 `vercel --prod`，线上 curl 复验；规格 `docs/hub-reorg-2026-10.md`，决定见 `agents.md` 第 4、7、15、22、23、25、33–38 条）。
- 工具登记搬到 `data/tools.js`；主题由 `dskp-index.js` 带出（补 7 份记录，`reviewed:false`，核对表 `~/Documents/my-agent/.ops/out/hub-topic-table.md`）；每个工具加 `modes`。
- 首页：一套条件（年级／科目／主题药丸＋折叠的按课标查找），卡片四颗标签，「新」7 天最多 8 个；三组复习卷合成一张卡（每份各自开始使用／分享＝直接工具网址／老师后台）。
- 通用老师后台 `teacher.html?tool=slug`，取代 6 个 `*-admin`（旧网址 307 转址带 `code`，旧档在 `~/Documents/待删除/kongsi-idea-旧后台-2026-10-17/`）。
- 统计：自动化浏览器与 `?nocount=1` 设备不计；起算日期收在「数字怎么算？」。
- **未验证**：老师在正式网址用 Google 登录 `teacher.html` 看真实成绩（新旧数字只用假资料逐字比对过）。
- **之后**：复习卷真正合并成一个工具（`tahun1-bc-fuxi?set=…`）另排期，届时处理 `*-oktober*` 改名与转址（规格第 7、7b 节）。
- `vercel alias set` 会报找不到（CLI 默认团队不对），`vercel --prod` 本身已把正式网域指到新版，线上已确认。

**2026-10-14（晚）：两张英文工具封面「Tahun」→「Year」**（`1b04d26`、`b59e78f` 已推 origin/main；决定见 `agents.md` 第 33 条）。
- `tahun6-bi-questiontags`、`tahun2-bi-dressing` 的封面副标题改为 Year 6／Year 2（cx 重生，PNG＋WebP＋app.js label）。
- 推送前 `.git/refs` 里有 iCloud 重复档 `main 2`（heads／remotes 各一）卡住 fetch，已搬到 `~/Documents/待删除/kongsi-git-refs/`。
- **未验证**：Hub 线上封面（等自动部署）。其他英文科工具若封面也写 Tahun，需同样处理——还没全面扫。

**2026-10-12：上架 `tahun5-mt-data` 数据侦探局 v1.0（许愿池第 11 份）；许愿池表单三改**（Hub 已部署、线上复验；提交 `509efa8` 起，共 4 笔）。
- 工具：投影辨认中位数／众数／平均数／极差；补了 `dskp-index` Tahun 5 数学 8.0／8.2；署名「一位五年级老师」。详见 `../teaching-tools/tahun5-mt-data/handoff.md`。
- 表单：新增「错例」栏、「署名」栏、确认句改白话＋勾选同意署名；规格见 `docs/idea-wish-pool-spec.md` 3.3 末段；决定见 `agents.md` 第 30–32 条。
- 许愿单（老师邮箱 g-28408770@…）已改「已上线」、关联 `tahun5-mt-data`。**等老师回信**再修订工具。
- 流程写成规则：`../teaching-tools/agents.md`「从许愿池做工具的标准流程」。

**2026-10-09～10：老师注册与许愿池后台**（代码 `46fed72`、`a6b80a3` 已推；决定见 `agents.md` 第 28、29 条）。
- 首页「位老师注册」：补登记 108 笔，`get_teacher_count()` 现为 **110**；登录流程改成先登记再做别的（之前漏登记的主因）。
- 新增 `admin.html`／`admin.js`（许愿池审核后台，只有管理员能用）：许愿单按状态分页签、可改状态／备注／关联工具；「注册名单」页签列出全部老师。管理员目前只有 yquan77。
- 数据库已执行：`migration-2026-07-24-wish-pipeline-columns.sql`（线上缺 `review_note`、`linked_tool_slug` 两栏，后台需要）和 `migration-2026-10-09-wish-admin.sql`。
- 删除 yquan77 在 07-23 的 5 笔测试许愿（不可恢复）。许愿池现在 10 笔真实的，全是 10-08 之后。
- 线上手动部署过一次（`vercel --prod --yes`，含 admin 与登记修复）；之后的线上版本以各自收工记录为准。
- 本机新增 `~/Documents/my-agent/.ops/kongsi-stats.py`：每次跑一次，把到访／工具使用／老师数追加到 `.ops/out/kongsi-daily-stats.csv`，两次相减就是每日增长。**还没设定每天自动跑**。基线 10-09 22:47：到访 2599、工具使用 3152、老师 110。

**2026-10-10（晚）：一年级「动物模仿秀」网址由 `tahun1-pj-haiwan` 改为 `tahun1-pj-pergerakan`，Hub v1.1.1**（老师定：slug 是分类用的，体育打卡系列各年级统一 `tahunN-pj-pergerakan`；学生看到的名称另取、要吸引人，所以名称没变）。旧网址已 301 跳转；GitHub 仓库已改名；Vercel 新建了 `tahun1-pj-pergerakan` 项目，旧项目只留跳转页。

**2026-10-10：上架 `tahun1-pj-haiwan` 动物模仿秀（一年级体育居家打卡），线上 v1.0.3**。
- 新增 `pjpk` 科目第一个工具，以及 `data/dskp-index.js` 的 PJPK Tahun 1 条目（依资料库截取档，未逐字核对）。
- 缩图：封面由 cx 生成（含工具名＋「一年级 · 体育」），另 4 张是老师的横式实机截图。5 张 png／webp 10-10 线上复验全部 200，旧的 `v1-3-list.png` 已不再引用，下方的「404」那条已解决。
- 提交：`e640cff`、`f72cf1c`、`bb5065a`、`7fbe8bd`、`dd4d671`。

**2026-10-10：非中文科目工具改用该语言＋马来文 DSKP 依资料库**（已上线，线上已 curl 复验）。
- 英文（BI）、马来文（BM）工具的主标题、`desc`、练习摘要、课堂方式、准备条件全部改成该语言；中文名放副标题。涉及 `tahun2-bi-punctuation`、`tahun4-bi-writing`、`tahun1-bm-huruf`、`tahun1-bm-kvkv`。
- 详情页的 DSKP 课标对 bm／bi 显示马来文／英文原文（`renderStandards`）。
- 马来文一年级 DSKP 改依资料库 KSSR2015 原版截取档，`reviewed: false`，页面不写「未经审核」字样。决定见 `agents.md` 第 26、27 条。
- 提交：`c2ceafa`、`d6cba97`、`f022963`、`78a24ba`、`fb48c07`、`c5cfd36`。

**2026-10-09：许愿池表单改版**（`8ad6e51`）：错例两格、设备单选，规格见 `docs/idea-wish-pool-spec.md` 3.3。首批 10 份里 4 份要回访。
**2026-10-08：全部工具直接打开也计次数**（`data/track-use.js`，决定见 `agents.md` 第 25 条）。
**2026-09-30～10-04：首页大整理**（决定见 `agents.md` 第 21–24 条）。

## 🚦 目前状态

- 以最上方「目前做到哪」最新一条为准；下面几行是 10-10 的旧状态，留作纪录。
- （10-10）Hub 正式网址：https://kongsi-idea.vercel.app，线上已是 `fb48c07` 的内容。
- 本次部署用 `vercel --prod --yes`，线上 curl 确认新文字在。**没有另外跑 `vercel alias set`**，因为 curl 结果已确认域名指向新内容。
- 工作区未提交的东西不是本次做的：`assets/thumbs-web/tahun1-mt-ruang/` 是 untracked。
- 别的 session 的提交也被一起推上去了：`f72cf1c`、`bb5065a`（tahun1-pj-haiwan）、`dd4d671`。
- `tahun1-pj-haiwan` 的「第 3 张说明图 404」（`assets/thumbs/tahun1-pj-haiwan/v1-3-list.png`）：当时是工作区删除的文件被一起部署。后来 `f72cf1c`、`bb5065a` 有改 haiwan 缩图，**还没线上复验**。→ 10-10 已复验，5 张都是 200。

## ➡️ 下一步

1. **Sentence Train（BI 二年级）DSKP**：`standards` 仍是空的。要从官方 PDF 核对 4.3.1（延伸 4.2.1）原文，再写进 `data/dskp-index.js`。
2. **马来文说明文字请马来文老师看一遍**：`huruf`、`kvkv` 的 desc、练习摘要、准备条件是我写的。
3. **数学、科学、AM 工具**：说明仍是中文。SJK(C) 课标本身是中文，要不要改，先问老师。
4. ~~haiwan 缩图 404~~：10-10 已复验，5 张都是 200。
5. 确认「王菱敏」是不是「王凌敏」（学号 26311），老师核对后补 1I 最后一笔。
6. 全校名单 `Kelas 2026` 缺 4F／5F／5I／5L 班代号，要不要补建。
7. Story Quest 投稿审核仍只能在 Supabase Dashboard 手改状态。等真实投稿量再评估。
8. ~~「详情打开次数」转化率~~：10-19 定，维持不做（`agents.md` 决定 20），老师提出才做。
9. 其余 12 个工具的 DSKP 校准还没做。

## ⚠️ 注意事项

- **`git push` 成功 ≠ 上线**。Hub 没有可靠的 GitHub 自动部署。收尾固定三步：`vercel --prod --yes` → 确认 Domains 列表 → `curl` 线上档案。
- `vercel --prod --yes` 的自动别名可能指错到 `eduneo-hub.vercel.app`，要手动核对 `kongsi-idea.vercel.app`。
- **页面文字规则**（`agents.md` 第 26 条）：非中文科目工具，所有页面内容都要用该语言。改完要逐字段检查，不能只改 `desc`。
- **资料库 DSKP 截取档**：头部写「仅为截取，没有审核」的，页面不加该字样，用 `reviewed: false` 标记。
- Story Quest 投稿的 anon insert **不能**带 `.select()`／`Prefer: return=representation`（`42501`）。
- Vercel 两个团队：`kongsi-idea`（教学工具＋hub）与 `mr007's projects`。新工具要确认在 `kongsi-idea`。
- 详情弹窗第一屏属于学生（`agents.md` 第 7、19 条）。
- Google OAuth 用 PKCE；登录状态依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回 `getSession()`。
- Supabase Client Secret、数据库密码只留在已忽略的 `supabase/.secrets.local.md`，不可提交。
- 跑 migration 用 `.secrets.local.md` 的密码＋ Python `psycopg2` 直连，不要把档案内容印出来。
- 许愿池状态流转栏位的 migration（`supabase/migration-2026-07-24-wish-pipeline-columns.sql`）已于 10-09 在线上执行（之前这里写「还没执行」是过时的）。
- 深夜（23:00–09:00）`git push` 不挡；部署限授权名单内专案；DB migration 深夜仍挡。

## 🕐 最后更新

- 时间：2026-10-19
- 更新者：Claude Opus 5.5 @ 这台 Mac（分享链接改工具网址；同日稍早另一会话清 Vercel 旧部署）
- Git push：✅ 已推 `6fedb26`（代码）＋ `379f6ce`（收工文件）。

---

## 历史摘要

- 2026-10-04：首页 提速＋天地格＋subgrid 卡片＋手机横式卡＋单一搜索框＋上下同步条件＋灰色无工具科目＋Telegram 联络（`8086a1f`）。
- 2026-09-22：详情弹窗「分享给学生」合成一个次要按钮（`43776e0`／`d74e91e`）。
- 2026-09-21：班级代码共用机制上线（`5564e3f`）。
- 2026-09-17：磁力创造实验室 v2；首页「次到访」去重（`1e6a650`）；guard 深夜限制放开 vercel／push。
- 2026-09-15：全校名单批量导入 kelasku（67 班／2581 人）；Story Quest v0.3.0 上线；`tahun4-bc-bishun` 登记。
- 2026-09-14：飞学竞场班级排行榜（v0.4）。
- 2026-09-11：网页浏览数改真实计数；域名消失问题修复。
- 2026-08-26 及更早：详情弹窗第一屏改给学生；08-14 DSKP 试点；08-06～08-12 kelasku 上线。完整细节见 Obsidian `專案工作流程.md`。
