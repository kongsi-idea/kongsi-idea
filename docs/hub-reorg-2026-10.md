# Hub 整理规格（2026-10-17 定案）

> 来源：卢老师与 Claude（Opus）2026-10-15～17 的讨论，以下都是老师已拍板的决定。执行分阶段派 Sonnet 子代理，主对话验收。
> 原则：**已上线工具的 slug、网址不改**（网址、使用次数、喜欢数、转发出去的链接都绑 slug）。例外只有本文件第 7 节列出的项目。

## 0. 阶段与档案归属（避免并行时互相覆盖）

| 阶段 | 内容 | 唯一可写的档案 |
|---|---|---|
| P1 | 工具登记搬出 app.js | `data/tools.js`（新）、`app.js`（只删 TOOLS 段）、`index.html`（加 script）、其他引用 TOOLS 的页面、`teaching-tools/scripts/sync-tools-status.mjs`、`check-live.mjs` |
| P2 | DSKP 主题＋上课方式资料 | `data/dskp-index.js`、`data/tools.js`、`sync-tools-status.mjs`（加分组节） |
| P3 | 首页与详情页 UI | `app.js`、`style.css`、`index.html` |
| P4 | 通用老师后台 | `teacher.html`、`teacher.js`、`teacher.css`、`data/teacher/*`、`vercel.json`、6 个旧后台档 |
| P5 | 新工具改名 | 见第 7 节，等老师确认名字 |
| P6 | 规则写入 agents.md、newtool skill、`npm run new` 模板 | 各 agents.md、`teaching-tools/scripts/new-tool.mjs`、`~/.claude/skills/newtool/SKILL.md` |
| P7 | 部署 | Hub 先部署 preview 给老师点，再 prod＋alias＋curl 验证 |

P1 先做完；P2／P3／P4 可并行（档案不重叠）；P3 读 P2 的字段时按第 2 节的约定写，字段还没有就容错显示。

## 1. slug 命名（只管新工具）

- 标准三层：`tahun{N}-{科目}-{单元关键词}`。
- **单元关键词取 DSKP 用词**，语言跟该科 DSKP：华文用拼音，数学／科学／马来文等用马来文 DSKP 词，英文用英文。
- **同单元已经有工具，新工具才加第四层「玩法词」**，只能从这张表选：

| 玩法词 | 意思 |
|---|---|
| `practice` | 学生自己练习、闯关 |
| `quiz` | 全班抢答、测验 |
| `duel` | 两人／两组对战 |
| `explore` | 老师带着演示、探索 |
| `build` | 拼组、造句、动手做 |
| `lab` | 实验模拟 |
| `write` | 书写 |

- 同单元同玩法又来一个：第四层改用更细的 DSKP 子项词或课本范围（如 `12to22`），**不用数字后缀（`-2`、`1`）**。
- **slug 与展示名都不放月份、学期等会过期的词**。
- 跨年级写范围 `tahun4to6-…`；跨科目写 `all`（`tahun1-all-…`）。
- 科目缩写对照：slug `mz` ＝ Hub 科目码 `muzik`；`pj`、`pk` ＝ `pjpk`（`pk` 待拆）；其余同码。

## 2. 主题（来自 DSKP）与上课方式

### 2.1 主题写在 DSKP 索引里，工具自动带出
- `data/dskp-index.js` 的节点加 `topic: { zh, bm }`：
  - 数学、科学、AM 等内容科：标在**单元**（unit）层，如「4.0 钱币」→ `{zh:"钱币", bm:"Wang"}`。
  - 语文（bc、bm、bi）：单元是技能（听说／阅读／书写／语法），太粗，标在**内容标准**（objective）层，如语法下的「量词」。bi 的 `bm` 栏放英文原文。
- **同一内容跨年级必须用完全相同的 `zh` 词**，Hub 靠它把不同年级连起来。
- 工具不手填主题，由 `standards` 第一条解析出来（objective.topic ＞ unit.topic）。只有综合复习、跨科等跨很多单元的工具才在工具上写 `topicOverride: { zh, bm }`。
- 9 个 `standards: []` 的工具：先从 `~/Documents/资料库/DSKP资料/` 补索引（中文取 SJKC、马来文取 SK；只收工具实际覆盖的单元；`reviewed:false`；`sourceUrl` 用 `docs/dskp/` 里已有的官方网址，不编）。资料库确实没有的才用 `topicOverride`，并在回报里列出。
- 显示语言：bm／bi 工具显示 `topic.bm`，其他显示 `topic.zh`；搜索两个都比对。
- 解析函数约定（P3 实作，P2 照这个形状填资料）：`toolTopic(tool)` → `{zh, bm} | null`。

### 2.2 上课方式 `modes`（固定选项）
- 工具加 `modes: [...]`，值只能是：`全班投影`、`上台对战`、`各自练习`、`回家练习`；1–3 个，**第一个是卡片上显示的主要方式**。
- 依现有 `teachingMode` 文字判断；原 `teachingMode` 保留不删（详情页照旧用）。

## 3. 首页（Mock A，老师已看过）

- 顶部白色面板：保留「今天要教什么？」打字效果（现有 `typewriterInto` 不变），副标改成「选年级、科目，或直接搜索」。
- 面板内由上而下：搜索框 → 年级药丸（1–6 年级，大字；手机宽 ≤560px 缩成一排「1 2 3 4 5 6」）→ 科目药丸（带工具数；该年级课纲有但还没工具的灰色不可按；课纲没有的不列——沿用 `SUBJECT_TAHUN`）→ 选了年级＋科目才出现的**主题药丸**（橙色，带数量）→ 收起的「按课标精确查找（单元／学习目标）」，展开是现有的单元／学习目标选择。
- **拿掉**：原面板的年级／科目下拉、下方「浏览全部工具」的第二套年级／科目按钮、「常用入口」。只剩一套条件，`finderState` 仍是唯一来源，条件仍只存网址、不存 localStorage（决定 23 其余不变）。
- 卡片区：
  - 没选年级：不分段，「新」工具排前面，其余按喜欢数。
  - 只选年级：按科目分段（小标题「华文 10 个」），段内新的优先、再按喜欢数。
  - 选了年级＋科目：不分段，同主题的卡片排在一起；点主题药丸再缩小。
- 卡片 tags 一格放四颗：主题（橙底白字）、主要上课方式（浅蓝）、类型 `type`（描边）、`N年级·科目`。手机横式卡片隐藏「类型」。**卡片子元素维持固定 6 个＋subgrid**（决定 22），署名那行保留（手机照旧隐藏）。
- 「新」标记：`changelog` 里最早一条的日期在 14 天内。
- 跨年级工具（有 `coverage` 的，如 `tahun1to6-drone`）选任何涵盖年级都要出现——要实测确认。
- 首页不加「改版了」提示。

## 4. 详情弹窗

- 分隔线以下（决定 7：第一屏只给学生「开始使用」）新增：
  - 「同主题的其他工具」：主题 `zh` 相同的其他已上架工具，同年级优先、再按年级升序；小缩略图（`webThumb`）＋名称＋N年级；点了切到那个工具的详情。没有就整块隐藏。
  - 「老师后台」链接：工具在后台登记表里才显示，旁边一句「需要先在『我的班级』建班，让学生用班级码作答」。
  - 类型 `type` 也显示在这一区。
- 搜索 `matchesQuery` 加入主题 zh/bm 与 `modes`。

## 5. 通用老师后台

- 一个页面：`kongsi-idea.vercel.app/teacher.html?tool={slug}&code={班级码}`。登录、选班、成绩表、CSV、「不在名单」学生的对应，全部共用。
- 每个工具一份设定 `data/teacher/{slug}.js`（成绩表名、栏位、题库网址、特殊显示），登记表 `data/teacher/index.js` 列出有后台的 slug（Hub 详情页靠它显示链接）。
- 题库一律从工具线上网址读，不在 Hub 另存。
- 现有 6 个旧后台全部改用它：`fuxi-admin`、`fuxi2-admin`、`latihan-admin`、`latihan2-admin`、`mtfuxi-admin`、`mt1fuxi-admin`。旧网址用 `vercel.json` 转址到 `teacher.html?tool=…`，**原本的 `?code=` 等参数要带过去**；preview 上验证转址后，旧档才搬 `~/Documents/待删除/`。
- 动工前先逐个盘点 6 个旧后台的功能差异，新后台要全部覆盖，回报对照表。
- `admin.html`（许愿池后台）不动。
- 新工具要后台＝加一份设定，不再复制整页。
- 登录在 Hub 网域，老师登录一次全部通用；不改 Supabase 设定。

## 6. 缩略图（只管新工具，旧的不补）

1. 第 1 张（卡片封面）必须看得到「教的内容」——题目、字、图形实际出现在画面上；或用设计过的封面图并带主题词。**不能**用设定、选名字、登录、规则说明这类画面。
2. 固定 4 张，顺序：封面 → 核心玩法进行中 → 答对／答错的反馈 → 老师端（排行榜、`?preview` 预览页或后台）。
3. 按 4:3 截（如 1200×900）；工具只适合宽画面时，重要内容放在中间 4:3 范围。
4. 展示名必须带内容词（「时刻大对决」的「时刻」）；同一年级里同一个套路词（对决、侦探、探险……）不重复用。

## 7. 新工具改名（P5，等老师确认名字）

10-15 之后上线、不合规的：
- `tahun1-bc-fuxi-oktober-2`（一年级华文复习本（二），课本下册第 12–22 单元）
- `tahun1-mt-fuxi-oktober`（一年级数学复习本）——待老师决定是否一起改

改名要做：GitHub 仓库改名、Vercel 加新网域并把旧网域转址到新网域、`track-use.js` 的 `data-slug`、Hub 登记、缩略图路径、`tool_stats` 的使用／喜欢数据迁到新 slug（只改资料，不改结构）、后台设定、许愿池 `linked_tool_slug`（若有）、`tools-status.json`、coverage 表。**成绩表名不改**（改表名是结构变更）。旧网址必须继续能用。

## 7b. 复习卷在 Hub 合成一张卡（2026-10-17 老师定；P5 改名因此暂停）

- 同年级同科目的复习卷工具在 Hub 合成一张卡，工具本身不改、各自网址不变：
  - `tahun1-bc-fuxi`：`tahun1-bc-fuxi-oktober`、`tahun1-bc-fuxi-oktober-2`
  - `tahun1-mt-fuxi`：`tahun1-mt-latihan-oktober`、`tahun1-mt-fuxi-oktober`
  - `tahun2-mt-fuxi`：`tahun2-mt-latihan-oktober`、`tahun2-mt-fuxi-oktober`
  - `tahun2-bc-zonghe`（华文勇者大冒险）是游戏，不并入。
- 资料：成员工具加 `collection: "<id>"` 与 `setLabel`（短的范围说明，如「下册第 12–22 单元」）；`data/tools.js` 另加 `const TOOL_COLLECTIONS = { "<id>": { title_zh, title_bm, desc } }`。
- 卡片：一张卡代表整组，标题「一年级华文复习卷」，副标写「N 份复习卷」；封面用最新一份的封面；使用次数与喜欢数显示各成员加总（卡片上只读）。年级／科目／主题的计数把整组算 1 个；搜索命中任一成员就显示整组卡。
- 详情弹窗：列出每一份卷（`setLabel`、名称、版本），每份各有「开始使用」、「分享给学生」（链接＋QR，沿用现有分享做法）、「老师后台」（有登记才显示）。`?tool=<成员slug>` 打开整组详情并标出该份。
- 以后真的合并成一个工具（`tahun1-bc-fuxi?set=…`）另排期，届时再处理改名与旧网址转址。

## 7c. P3 修订（2026-10-17 老师定）

- 「新」：`changelog` 最早日期在 7 天内，且全站最多只标最新的 8 个（按最早日期排序）。
- 「按课标精确查找」里原有的单元对照卡（可练习什么／准备条件／DSKP 核对状态）放回 `<details>` 内。
- 科目顺序：华文在最前，其后数学、马来文、英文，其余照原顺序。

## 8. 版本记录

- 工具的 `version`／`changelog` 不因这次整理而升版（学生端没变）。
- 这次改版记在：Hub git commit、`kongsi-idea/agents.md` 关键决定、`handoff.md`。
