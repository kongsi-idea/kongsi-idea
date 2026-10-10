# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

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

- Hub 正式网址：https://kongsi-idea.vercel.app，线上已是 `fb48c07` 的内容。
- 本次部署用 `vercel --prod --yes`，线上 curl 确认新文字在。**没有另外跑 `vercel alias set`**，因为 curl 结果已确认域名指向新内容。
- 工作区未提交的东西不是本次做的：`assets/thumbs-web/tahun1-mt-ruang/` 是 untracked。
- 别的 session 的提交也被一起推上去了：`f72cf1c`、`bb5065a`（tahun1-pj-haiwan）、`dd4d671`。
- `tahun1-pj-haiwan` 的「第 3 张说明图 404」（`assets/thumbs/tahun1-pj-haiwan/v1-3-list.png`）：当时是工作区删除的文件被一起部署。后来 `f72cf1c`、`bb5065a` 有改 haiwan 缩图，**还没线上复验**。→ 10-10 已复验，5 张都是 200。

## ➡️ 下一步

1. **Sentence Train（BI 二年级）DSKP**：`standards` 仍是空的。要从官方 PDF 核对 4.3.1（延伸 4.2.1）原文，再写进 `data/dskp-index.js`。
2. **马来文说明文字请马来文老师看一遍**：`huruf`、`kvkv` 的 desc、练习摘要、准备条件是我写的。
3. **数学、科学、AM 工具**：说明仍是中文。SJK(C) 课标本身是中文，要不要改，先问老师。
4. **haiwan 缩图 404**：线上复验 `tahun1-pj-haiwan` 的 `v1-3-list.png`。
5. 确认「王菱敏」是不是「王凌敏」（学号 26311），老师核对后补 1I 最后一笔。
6. 全校名单 `Kelas 2026` 缺 4F／5F／5I／5L 班代号，要不要补建。
7. Story Quest 投稿审核仍只能在 Supabase Dashboard 手改状态。等真实投稿量再评估。
8. 「详情打开次数」转化率：老师认同价值，还没拍板。
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
- 许愿池状态流转栏位的 migration（`supabase/migration-2026-07-24-wish-pipeline-columns.sql`）写好了但还没在 Supabase 执行。
- 深夜（23:00–09:00）`git push` 不挡；部署限授权名单内专案；DB migration 深夜仍挡。

## 🕐 最后更新

- 时间：2026-10-10
- 更新者：Claude Haiku 5.5 @ 这台 Mac
- Git push：✅ 已推 `e8839dc`（收工文件：agents.md 第 26、27 条、handoff）；本次代码 `fb48c07` 也已推。

---

## 历史摘要

- 2026-10-04：首页 提速＋天地格＋subgrid 卡片＋手机横式卡＋单一搜索框＋上下同步条件＋灰色无工具科目＋Telegram 联络（`8086a1f`）。
- 2026-09-25：详情弹窗「分享给学生」合成一个次要按钮（`43776e0`／`d74e91e`）。
- 2026-09-21：班级代码共用机制上线（`5564e3f`）。
- 2026-09-17：磁力创造实验室 v2；首页「次到访」去重（`1e6a650`）；guard 深夜限制放开 vercel／push。
- 2026-09-15：全校名单批量导入 kelasku（67 班／2581 人）；Story Quest v0.3.0 上线；`tahun4-bc-bishun` 登记。
- 2026-09-14：飞学竞场班级排行榜（v0.4）。
- 2026-09-11：网页浏览数改真实计数；域名消失问题修复。
- 2026-08-26 及更早：详情弹窗第一屏改给学生；08-14 DSKP 试点；08-06～08-12 kelasku 上线。完整细节见 Obsidian `專案工作流程.md`。
