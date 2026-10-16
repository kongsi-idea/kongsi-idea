# 课堂点子铺（专案蓝图）

> 跨 Agent 通用蓝图（AGENTS.md 开放标准）。每个 session 先读本档＋`handoff.md`。

## 专案简介
全马华小老师共享教学工具的平台。老师提想法，开发者打磨成真正好用的工具后才发布——宁可数量少，也要每个都真对课堂有帮助。
- 对外品牌：**课堂点子铺**（Kedai Idea）。GitHub组织/Vercel Team/本机资料夹一律技术代号 `kongsi-idea`。
- 核心文案：**老师有点子，课堂有办法。**

## 与教学工具源码的关系
- `kongsi-idea/` 只存平台代码、工具登记资料、缩略图、课程索引，**不存放工具源码**。
- 工具源码在同级 [`../teaching-tools/`](../teaching-tools/)，每个 slug 独立 Git+Vercel。开发/部署工具先读 `../teaching-tools/agents.md`；上架/DSKP对照/平台展示回本资料夹。
- 登记桥梁（新增/移动工具须同步）：`data/tools.js` 的 `TOOLS`（2026-10-17 老师定：登记从 `app.js` 搬出，`app.js` 不再放工具资料）、`data/dskp-index.js`、`docs/published-tools-coverage.md`、`teaching-tools/README.md`。
- 全部工具进度看 `../teaching-tools/PROGRESS.md`；本目录 `docs/tools-status.md` 是同脚本生成镜像，不要手改。

## 关键决定（不要无充分理由推翻）
1. 独立专案，与`二年级数学`、EduNeo（class_system-1）解耦
2. 登录分层：浏览/使用免登录；反馈/许愿/投稿需登录
3. hub 只做平台，工具各自独立部署；hub 用 iframe/新分页链接，反馈/星星/统计是 hub 自己的 UI
4. 命名：`tahun{年级}-{科目缩写}-{单元关键词}`，同单元已有工具才加第四层玩法词（如 `tahun2-mt-wang`）。完整规则（玩法词表、范围写法、不放月份、不用数字后缀）见 `../teaching-tools/agents.md`「新工具资料夹命名」；**只管新工具，已上线的 slug 不改**（2026-10-17 老师定）
5. 登记资料中马双语可搜索
6. 分类靠「年级」+「科目」双筛选交集
7. 卡片先看缩略图，点「开始使用」新分页全屏打开。**详情弹窗第一屏给学生**：「开始使用」要第一眼看到；作者/DSKP/版本号等给老师看的资料排分隔线以下。小屏断点见 `style.css` `@media (max-height: 560px)`。2026-10-17 老师定：分隔线以下另有「同主题的其他工具」（主题 `zh` 相同的已上架工具，同年级优先）、「老师后台」链接（工具在 `data/teacher/index.js` 的 `TEACHER_TOOLS` 里才显示，旁注「需要先在『我的班级』建班，让学生用班级码作答」）、类型 `type`
8. 两套星星分开：①工具「喜欢数」免登录一票，卡片按此排序；②老师「声望星星」需登录，待账号系统
9. 使用次数已改用 Supabase 全站计数（`tool_stats`＋`increment_tool_uses`，规则见决定 25）；阶段一的 localStorage 本地计数已停用（2026-10-17 更正过时说法）
10. 全局统计条公开；无真实数据来源如实显示 0，不编造
11. DSKP对照字段只有查证过的工具能加
12. 点子许愿池须结构化表单（规格 `docs/idea-wish-pool-spec.md`），需登录，不收集学生个资
13. 每工具需 `version`+`changelog`（数组追加不覆盖）
14. `creator` 须真实作者姓名，不能全挂卢老师
15. 「网页浏览量」2026-09-11起用真实计数（`page_view_counter`+RPC，见 `supabase/migration-2026-09-11-page-views.sql`），历史无法补回，**不可用估算值填**，数字落差宁可暂藏统计卡不编数字。2026-09-17改名「次到访」并加30分钟session去重（`localStorage` key `kongsi-idea-last-visit-ts`）——单纯刷新会灌水，不反映真实到访意图；窗口内改打 `get_page_views()` 只读不加，超过窗口才打 `increment_page_views()`。这也是客户端估计值（清cache/换设备会重算），不是真独立访客数，但比纯page view更接近。自动化浏览器（`navigator.webdriver`）与开过一次 `?nocount=1` 的设备不计（2026-10-17，key `kongsi-idea-no-count`，`?nocount=0` 取消）；首页统计条下写明起算日期
16. `kongsi-idea.vercel.app` 域名可能从专案（`prj_Oyf637d4j8ODuilHIY7eZ2OoZswQ`）Domains列表消失（边缘缓存顶旧内容仍200）——线上无反应先查 Domains 列表，`POST /v10/projects/{id}/domains` 加回
17. **只开放anon INSERT不开放SELECT的表，insert 绝不能带 `.select()`／`Prefer: return=representation`**（RETURNING读回要过SELECT检查，会撞 `42501`）。一律 `Prefer: return=minimal`
18. 不需要 `supabase` CLI/`psql`：`supabase/.secrets.local.md` 存DB密码，Python `psycopg2` 直连 `db.{project_ref}.supabase.co:5432` 跑 migration，比手贴 Dashboard 快；Dashboard 降级为备案。密码那行是全角冒号 `Database password：`，解析用 `[:：]`，**不要把档案内容印出来**
19. 详情弹窗「分享给学生」是**一个按钮同时做两件事**（复制链接＋就地生成QR码，`qrcode-generator` CDN 离线库，不外传网址给第三方 API），2026-09-25 老师反馈原本「复制分享链接」+「显示QR码」两个等重按钮排版鸡肋、跟「开始使用」抢视觉重量后改的——不要拆回两个按钮，也不要加"先选分享方式"的中间步骤，老师课堂场景两个通常都要。按钮样式故意做得比 `.detail__open` 轻（`.detail__share`，无边框、小字），维持关键决定7「第一屏只留一个焦点给学生」。
20. **详情打开次数（浏览→使用转化率）尚未做**，2026-09-25 讨论过：工程量小（现有 `tool_stats` 表加一栏＋RPC，複用 `increment_tool_uses` 那套模式），但老师自己一人经营、单工具日打开量小，数字只能当方向参考不能精算——之后要做才做，不是遗漏也不用主动补

21. **缩略图两套**（2026-09-30）：`assets/thumbs/` 原图只给灯箱放大；卡片与详情弹窗读 `assets/thumbs-web/` 的 WebP（最长边 960px，`scripts/build-thumbs.py` 生成，原图 23MB→1.9MB）。**新增或换缩略图后必须跑一次该脚本**再部署；忘了跑不会破图（`onerror` 退回原图），但首页又会变慢。`vercel.json` 给 `/assets/*` 一天缓存。起因：首页一开就下载 8.3MB 原图 PNG，学校网路要等十几秒
22. **版面天地格**（2026-09-30，10-01 修订）：全站区块用 `.container`（`--page-max: 1200px`、`--gutter`、`--space-section`）对齐同一条左右边界，不要再在单一区块写 `clamp(...)` 左右边距。工具卡片用 `grid-template-rows: subgrid` 跨 6 行（缩略图／中文名／马来文名／作者／标签／统计），同排卡片行线对齐——**卡片子元素数量必须固定 6 个**（没作者也要留空 `.creator`），增删栏位要同步改 `grid-row: span 6`。开发代号只在详情弹窗显示。栏数靠 `minmax(min(100%, 250px), 1fr)`：桌面 4、平板 2；**≤560px 手机改横式清单卡**（缩略图左、文字右、隐藏作者），整页从 14,000px 缩到 5,500px。2026-10-17 老师定：标签那一格放四颗 tags——主题（橙底白字）、主要上课方式 `modes[0]`（浅蓝）、类型 `type`（描边）、`N年级·科目`；手机横式卡片隐藏「类型」；子元素仍固定 6 个、署名那行保留（手机照旧隐藏）。⚠️ 卡片不能加 `container-type`，Chrome 会让 subgrid 的缩略图行高塌掉
23. **首页只有一套条件、单一来源**（2026-10-01／10-02，**2026-10-17 老师定改成新面板**，规格 `docs/hub-reorg-2026-10.md` 第 3 节）：顶部白色面板由上而下是搜索框 → 年级药丸（1–6，手机 ≤560px 缩成一排）→ 科目药丸（带工具数）→ 选了年级＋科目才出现的主题药丸（橙色，带数量）→ 收起的「按课标精确查找（单元／学习目标）」。**原本的年级／科目下拉、下方「浏览全部工具」的第二套年级／科目按钮、「常用入口」已拿掉**，只剩一套条件，`finderState` 仍是唯一来源；卡片同时吃年级、科目、主题、单元／学习目标、关键词，卡片上方「显示 N 个工具＋条件标签＋清除条件」说明为什么只剩这些。条件只存在网址（刷新／返回键保留），**不存 localStorage**——干净网址一律从全部工具开始，避免隔天回来被旧条件悄悄筛掉（10-04 老师确认）。**不要再让上下各有一套筛选状态，也不要再加第二个搜索框**——老师 10-02 截图反馈上面选 1 年级马来文、下面仍显示全部会混淆，分不清用哪个。科目药丸：有工具（或有学习目标索引）的科目可按；**该年级课纲有、但还没有工具的科目灰色按不到——不删掉，让老师看得出还能开发**（2026-10-01 老师定）；课纲没有的科目（依 `docs/subjek-tahun.md`，`SUBJECT_TAHUN`）不列；科目顺序华文最前，其后数学、马来文、英文。**不再出现「整理中」**；有工具没索引的显示「N年级X科目前有 N 个工具，还没按学习目标细分」＋直达按钮。卡片排序：没选年级不分段、「新」排前再按喜欢数；只选年级按科目分段；选了年级＋科目不分段、同主题排在一起。「新」＝`changelog` 最早日期 7 天内，且全站最多标最新 8 个。跨年级工具（有 `coverage`）选任何涵盖年级都要出现。
24. **联络入口用 Telegram**（2026-10-01 老师选定）：「为什么会有这个地方」的按钮连 `https://t.me/yquanloo`，不公开 email
25. **使用次数两条来源，不会重复计**（2026-10-08）：① Hub 详情页「开始使用」→ `bumpUses()`，链接带 `?kh=1`；② 工具被直接打开（老师转发网址）→ 工具入口的 `data/track-use.js`（`data-slug` 必须等于 `slug.vercel.app` 前缀，只在正式网址计数）。脚本看到 `kh=1` 就跳过并用 `replaceState` 清掉，老师从地址栏复制转发才不会漏算；同浏览器同工具 30 分钟去重（key `kongsi-idea-use-ts:{slug}`）。两边都调同一个 RPC `increment_tool_uses`，没有 schema 变更。**历史补不回来，从 2026-10-08 起算**；仍是客户端估计值，课室多台电脑同时开会各算一次。新工具必须带这一行（`teaching-tools/agents.md` 有规则，`npm run check` 会验）。**不要改 `data/track-use.js` 的路径或 `kh` 参数名**，所有已上线工具都依赖它。自动化浏览器与 `?nocount=1` 设备不计（2026-10-17，Hub 的 `bumpUses` 与 `track-use.js` 同一个 key）。kd 参数＝Hub 设备 id，`track-use.js` 依赖它，不要改名（10-17）。
26. **非中文科目的工具，所有页面内容用该科目的语言**（2026-10-10 老师定，10-10 再次强调「下次要注意」）。适用：英文（BI）、马来文（BM）工具。国文（BC）工具本来就是华文，照旧。范围包括：
   - 主标题 `title_zh`（大字）用该科目语言，中文名放 `title_bm`（小字）。例：`Sentence Train`／「句子小火车」、`Huruf A–Z: Mari Menulis`／「Huruf A–Z 写字母」。
   - `desc`、`practiceSummary`、`teachingMode`、`prep` 全部用该语言撰写，不用中文转述。
   - 详情页的 DSKP 课标内容：`renderStandards` 对 bm／bi 工具显示马来文／英文原文（`title_bm`），中文译名不当主标题。
   - `changelog`（开发纪录，给老师看的）、`keywords`（搜索用）不在此限。
   - 改完要逐个工具检查这四个字段，不能只改 `desc` 就宣称完成。
   - 课标原文从 `资料库/DSKP资料/` 取，引用时不要在页面上加「（截取，未经审核）」这类字样；资料是否审核用记录的 `reviewed: false` 标记，只影响「核对状态」文字（显示「已对照」而非「已核对」）。
   - 数学、科学、AM 工具：SJK(C) 的课标本身是中文，目前仍用中文，要改先问老师。
27. **马来文 DSKP 依资料库，不依网上版本**（2026-10-10 老师定）：马来文一年级课标以 `资料库/DSKP资料/KSSR2015/Bahasa-Melayu/SJK/TAHUN1.md`（KSSR 原版，Terbitan 2015）为准。资料库没有 Semakan 2017 的马来文，所以 `curriculum` 写「KSSR 2015（原版）」。该截取档没有审核，记录上标 `reviewed: false`，页面只显示「已对照」，不写「已核对」，也不在页面上加「未经审核」字样。Sentence Train（BI 二年级）的 DSKP 仍空着，等从官方 PDF 核对 4.3.1 后再补。
28. **「位老师注册」= `profiles` 表的笔数**（2026-10-09，老师确认）。每位老师登录时写一笔（`ensureProfileRow`，放在 `handleAuthChange` 最前面，不可排在会出错的许愿恢复之后——2026-10-09 发现 107 位因此漏登记，已补回）。访客不能读 `profiles`（刻意不开放，避免枚举），只能经 `get_teacher_count()` 拿总数。数字跟「次到访」一样**每次载入页面读一次，不做定时刷新**，老师 10-10 确认够用。注册人数不会自己跳，要等下一次有人开首页。
29. **许愿池后台 `admin.html` 的权限放在数据库**（2026-10-09）：管理员名单在 `public.admins`（不开任何 policy），`is_admin()` 判断，`admin_list_wishes()`／`admin_update_wish()`／`admin_list_teachers()` 三个 RPC 只对管理员回资料，非管理员回空。前端只负责显示。**不要为了方便开放 `wishes` 或 `profiles` 的 select 给 anon／authenticated**。加管理员用 SQL `insert into public.admins`，目前只有 yquan77。页面 `noindex`，网址不对外发。

30. **许愿池来的工具，署名与许愿单收尾**（2026-10-12）：许愿单没署名时 `creator` 写「一位×年级老师」（`initial: "师"`），**不写「卢老师」、不写学校**（许愿默认不公开老师与学校）；「卢老师」只给卢老师自己主动做的工具。表单第 3 步有选填「想怎么署名」，**存在 `wishes.classroom_context` 末尾一行 `署名：…`**（不加栏位、不改 schema），**勾选确认句＝同意该署名写在工具上**。工具上线／修订后要回许愿池把该单改 `shipped`＋`linked_tool_slug`＋备注（agent 用 psycopg2 直连，只改这三栏）。完整流程在 `../teaching-tools/agents.md`「从许愿池做工具的标准流程」。
31. **许愿池「错例」栏**（2026-10-12）：第 2 步新增选填「能给一道学生真的做错的题吗」，存成 `problem_description` 的 `错例：…` 一行；placeholder 随科目换（数学带数字）。起因：第 11 份仍只写概括没写具体错题。判断标准：之后的许愿里这栏有填的比例、填的是不是「题目＋错误答案」。
32. **`dskp-index` 收录 Tahun 5 数学只含 8.0／8.2**（2026-10-12）：依资料库截取档（中文 SJKC＋马来文 SK），`reviewed:false`，页面显示「已对照」不显示「已核对」；只收工具实际覆盖的目标，不是整个单元。
33. **英文科工具的缩图封面写「Year N · English」，不写「Tahun N」**（2026-10-14，老师纠正 questiontags 与 dressing 两张封面）：其他科目维持 Tahun。生封面的提示词要明写「必须是 Year N，不是 Tahun N」并逐字核对。封面是 PNG 里的文字，只能重生图（`cx-draw`），不能只改 `data/tools.js` 里的 label；改完跑 `scripts/build-thumbs.py`。
34. **Hub 整理的总规格在 `docs/hub-reorg-2026-10.md`**（2026-10-17 老师定案）：slug 命名、主题与上课方式、首页新面板、详情弹窗、通用老师后台、缩略图、复习卷合卡、版本记录都以它为准；上面各条与它冲突时以它为准。**已上线工具的 slug、网址不改**（网址、使用次数、喜欢数、转发出去的链接都绑 slug）。
35. **主题与上课方式**（2026-10-17 老师定）：①主题写在 `data/dskp-index.js` 的节点上（`topic: { zh, bm }`），数学、科学、AM 等内容科标在单元层，语文（bc、bm、bi）标在内容标准（objective）层；**同一内容跨年级必须用完全相同的 `zh` 词**，Hub 靠它把不同年级连起来，所以加新主题词前先查现有的。②工具不手填主题，由 `standards` 第一条解析（objective.topic ＞ unit.topic）；**新工具上架必须有能解析出主题的 `standards`**，只有综合复习、跨科等跨很多单元的才在工具上写 `topicOverride: { zh, bm }`。③每个工具必须填 `modes`，值只能是 `全班投影`／`上台对战`／`各自练习`／`回家练习`，1–3 个，第一个是卡片上显示的主要方式；`teachingMode` 原文保留（详情页照旧用）。④显示语言：bm／bi 工具显示 `topic.bm`，其他显示 `topic.zh`；搜索两个都比对，`matchesQuery` 也比对 `modes`。
36. **老师后台是一个通用页面，不再一工具一页**（2026-10-17 老师定）：`kongsi-idea.vercel.app/teacher.html?tool={slug}&code={班级码}`，登录、选班、成绩表、CSV、「不在名单」学生的对应全部共用。新工具要后台＝加一份 `data/teacher/{slug}.js` 设定（成绩表名、栏位、题库网址、特殊显示）＋在 `data/teacher/index.js` 的 `TEACHER_TOOLS` 加 slug；**不再复制整页 `*-admin.html`**。题库一律从工具线上网址读，不在 Hub 另存。现有 6 个旧后台（`fuxi-admin`、`fuxi2-admin`、`latihan-admin`、`latihan2-admin`、`mtfuxi-admin`、`mt1fuxi-admin`）一律改用它，旧网址由 `vercel.json` 转址并带过 `?code=` 等参数。`admin.html`（许愿池后台，见决定 29）不动。登录在 Hub 网域，不改 Supabase 设定。
37. **复习卷在 Hub 合成一张卡**（2026-10-17 老师定）：同年级同科目的复习卷工具合成一张卡，工具本身不改、各自网址不变。做法：成员工具加 `collection: "<id>"` 与 `setLabel`（短的范围说明，如「下册第 12–22 单元」），并在 `data/tools.js` 的 `TOOL_COLLECTIONS` 登记 `{ title_zh, title_bm, desc }`。**新做复习卷必须加这两项，不要同年级同科目再各开一张卡。**卡片代表整组（标题如「一年级华文复习卷」、副标「N 份复习卷」），使用次数与喜欢数显示各成员加总；年级／科目／主题计数把整组算 1 个；详情弹窗每份卷各有「开始使用」、「分享给学生」、「老师后台」，`?tool=<成员slug>` 打开整组并标出该份。游戏类（如 `tahun2-bc-zonghe`）不并入。因此规格 P5「新工具改名」暂停。
38. **版本记录规则**（2026-10-17 老师定）：Hub 整理（首页、详情页、后台改版、登记搬位置）学生端没变，**工具的 `version`／`changelog` 不因此升版**；这类改版记在 Hub 的 git commit、本档关键决定、`handoff.md`。工具真的改了学生看得到的东西才升版（见 `../teaching-tools/agents.md`「已上架工具每次上线新版本」）。
39. **欢迎卡分老师／学生、页首使用指南**（2026-10-17 老师定）：首页第一次进站的欢迎卡改成问「老师／学生」——老师看「3 步就会用」＋「看完整指南」（`guide.html`）＋次要的「去许愿池」；学生只看一句话＋「好」。**网址带 `tool` 参数（学生点老师发的链接）不显示，也不写 `WELCOMED_KEY`**，之后无参数进站仍可出现；选了身份或关闭才写 `WELCOMED_KEY`。页首「我的班级」「点子许愿池」旁有低调文字链接「使用指南」→ `guide.html`（手机在两个按钮下方居中一行）。`guide.html` 是给第一次来的老师的一页指南，截图放 `assets/guide/`（对正式网址截、WebP），**指南里每句话都对照过代码**（kelasku、`class-code-client.js`、`teacher.js`、`tool-modes-spec.md`），Hub 流程改了要同步改这页。

## 视觉设计
布告栏意象；不用 emoji，图钉/星星/奖杯用 CSS/SVG；科目用缩写字母徽章（MT/BM/BI/BC/SA）；配色（跟 EduNeo 区分）：暖纸白 `#FBF6EC`、黑板绿 `#1F3A34`、橙黄 `#E8873E`、天空蓝 `#4FA8D8`（马来文）、珊瑚红 `#D65B4A`（中文/星星）、暖金 `#F0B429`；卡片±1-2°随机倾斜

## 资料夹结构（要点）
`index.html/style.css/app.js` 首页；`kelasku.html/.js/.css` 班级名单页；`docs/dskp/{tahun}/{subjek}.md` DSKP摘要；`data/dskp-index.js` 结构化索引权威来源；`data/supabase-client.js`／`class-code-client.js` 前端SDK；`supabase/schema.sql`（wishes/tool_stats/tool_like_votes+RPC）、`supabase/.secrets.local.md`（DB密码，已gitignore，**凭证存于此**）。同级 `../teaching-tools/{slug}/` 各工具源码。工具登记在 `data/tools.js`（`TOOLS` 常量数组＋`TOOL_COLLECTIONS`），不再写在 `app.js`；老师后台设定在 `data/teacher/{slug}.js`，登记表 `data/teacher/index.js`。

## 账号系统与 Supabase
独立 project，ref `gntnkhkkgonaehapcerr`，与 EduNeo 完全分开（公开平台 vs 私人学生资料）。老师登录用 Google OAuth。踩坑细节见 Claude memory `kongsi-idea-supabase-integration`。

## kelasku：班级/学生名单系统
- 目的：各工具靠 `?code=` 读取班级名单，不用各自建后台
- 多老师共编：`class_teachers` 成员制，加入即时生效；`class_snapshots`+`snapshot_class_students()`/`restore_class_snapshot()` RPC 做改动前自动存档防破坏
- 学生资料 `name_zh`/`name_en`/`seat_no`；支持 Excel 上传（`HEADER_ALIASES` 别名字典+扫前15行找表头）
- **RLS 一律用 `is_class_teacher(class_id)` SECURITY DEFINER 函数**，不要在 `class_teachers` 自己policy里直接 `exists(select...)`——会 infinite recursion
- 代码格式 `{学校代码}-{班级缩写}`（如 `JBC1037-1I`）；`?code=` 支持逗号合并多班
- 权限：`schools`/`classes`/`students` 读取对所有人开放，改/删只认该班 `class_teachers` 成员
- **工具专属表命名须用完整 slug 前缀**（如 `tahun1_bc_liangci_scores`），不能只取关键词，否则会撞表名
- 没有「合班连结生成器」——刻意拆掉；`saved_links` 表已废弃仍留数据库
- 设计取舍见 Claude memory `kongsi-idea-teaching-tools-shared-db-architecture`
- 已接 `class-code-client.js` 的工具统一继承「输错可重试」与「换班级」入口；新工具接入时必须沿用共用客户端，不得另写一套班级代码弹窗或 localStorage 机制
- 班级码标准流程：依序引入 `supabase-client.js`、`class-code-client.js`，再调用 `await ClassCode.loadOrPrompt()`；成功后共用客户端会显示「换班级」，换班会保留其他网址参数、更新 `?code=` 并重新载入工具，清掉上一班的学生／成绩／进度状态
- `loadOrPrompt()` 遇到网址代码、记忆代码或学生刚输入的错误代码，都必须把学生留在同一个输入流程继续重试；只有学生选择「暂不选班」才回退工具自己的手动输入。详细约定见 `docs/tool-modes-spec.md` 的「班级代码接入标准」
- `students` 表**没有 IC 号码栏位**（非漏做）；批量导入重名无法安全比对时留空待确认，不猜

## 部署（收工前必做，缺一不可）
**非 GitHub 自动部署**，`git push` 成功≠上线。固定三步：① `vercel --prod --yes` ② 确认 `kongsi-idea.vercel.app` 指到新部署（`vercel --prod` 通常会自动指过去；要手动切就用 `vercel alias set <url> kongsi-idea.vercel.app --scope kongsi-idea`，不带 `--scope` 会报找不到，2026-10-17）③ `curl` 线上档案确认新内容真的在。没跑③不要说「已上线」。

## 本阶段延后
声望星星（待账号体系）；未建索引的科目/年级（不能凑数据编）；缩略图自动生成（目前手动 Playwright 截图）。

## 工作约定
开工读 `handoff.md`，收工必更新；Obsidian 详细纪录 `創作庫/開發專案/kongsi-idea/專案工作流程.md`（决策原因/踩坑写那里，不与handoff重复）；`docs/dskp/` 按需查询不预读；改共用档案前先读最新；新增/修改工具后跑 `../teaching-tools/` 的 `npm run status:sync`；简体中文。

> 完整历史：docs/agents-archive-2026-09-16.md
