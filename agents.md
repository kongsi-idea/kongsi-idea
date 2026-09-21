# 课堂点子铺（专案蓝图）

> 跨 Agent 通用蓝图（AGENTS.md 开放标准）。每个 session 先读本档＋`handoff.md`。

## 专案简介
全马华小老师共享教学工具的平台。老师提想法，开发者打磨成真正好用的工具后才发布——宁可数量少，也要每个都真对课堂有帮助。
- 对外品牌：**课堂点子铺**（Kedai Idea）。GitHub组织/Vercel Team/本机资料夹一律技术代号 `kongsi-idea`。
- 核心文案：**老师有点子，课堂有办法。**

## 与教学工具源码的关系
- `kongsi-idea/` 只存平台代码、工具登记资料、缩略图、课程索引，**不存放工具源码**。
- 工具源码在同级 [`../teaching-tools/`](../teaching-tools/)，每个 slug 独立 Git+Vercel。开发/部署工具先读 `../teaching-tools/agents.md`；上架/DSKP对照/平台展示回本资料夹。
- 登记桥梁（新增/移动工具须同步）：`app.js` 的 `TOOLS`、`data/dskp-index.js`、`docs/published-tools-coverage.md`、`teaching-tools/README.md`。
- 全部工具进度看 `../teaching-tools/PROGRESS.md`；本目录 `docs/tools-status.md` 是同脚本生成镜像，不要手改。

## 关键决定（不要无充分理由推翻）
1. 独立专案，与`二年级数学`、EduNeo（class_system-1）解耦
2. 登录分层：浏览/使用免登录；反馈/许愿/投稿需登录
3. hub 只做平台，工具各自独立部署；hub 用 iframe/新分页链接，反馈/星星/统计是 hub 自己的 UI
4. 命名：`tahun{年级}-{科目缩写}-{单元}`，马来文简称（如 `tahun2-mt-wang`）
5. 登记资料中马双语可搜索
6. 分类靠「年级」+「科目」双筛选交集
7. 卡片先看缩略图，点「开始使用」新分页全屏打开。**详情弹窗第一屏给学生**：「开始使用」要第一眼看到；作者/DSKP/版本号等给老师看的资料排分隔线以下。小屏断点见 `style.css` `@media (max-height: 560px)`
8. 两套星星分开：①工具「喜欢数」免登录一票，卡片按此排序；②老师「声望星星」需登录，待账号系统
9. 使用次数阶段一用 localStorage，全体统计待后端
10. 全局统计条公开；无真实数据来源如实显示 0，不编造
11. DSKP对照字段只有查证过的工具能加
12. 点子许愿池须结构化表单（规格 `docs/idea-wish-pool-spec.md`），需登录，不收集学生个资
13. 每工具需 `version`+`changelog`（数组追加不覆盖）
14. `creator` 须真实作者姓名，不能全挂卢老师
15. 「网页浏览量」2026-09-11起用真实计数（`page_view_counter`+RPC，见 `supabase/migration-2026-09-11-page-views.sql`），历史无法补回，**不可用估算值填**，数字落差宁可暂藏统计卡不编数字。2026-09-17改名「次到访」并加30分钟session去重（`localStorage` key `kongsi-idea-last-visit-ts`）——单纯刷新会灌水，不反映真实到访意图；窗口内改打 `get_page_views()` 只读不加，超过窗口才打 `increment_page_views()`。这也是客户端估计值（清cache/换设备会重算），不是真独立访客数，但比纯page view更接近
16. `kongsi-idea.vercel.app` 域名可能从专案（`prj_Oyf637d4j8ODuilHIY7eZ2OoZswQ`）Domains列表消失（边缘缓存顶旧内容仍200）——线上无反应先查 Domains 列表，`POST /v10/projects/{id}/domains` 加回
17. **只开放anon INSERT不开放SELECT的表，insert 绝不能带 `.select()`／`Prefer: return=representation`**（RETURNING读回要过SELECT检查，会撞 `42501`）。一律 `Prefer: return=minimal`
18. 不需要 `supabase` CLI/`psql`：`supabase/.secrets.local.md` 存DB密码，Python `psycopg2` 直连 `db.{project_ref}.supabase.co:5432` 跑 migration，比手贴 Dashboard 快；Dashboard 降级为备案

## 视觉设计
布告栏意象；不用 emoji，图钉/星星用 CSS/SVG；科目用缩写字母徽章（MT/BM/BI/BC/SA）；配色（跟 EduNeo 区分）：暖纸白 `#FBF6EC`、黑板绿 `#1F3A34`、橙黄 `#E8873E`、天空蓝 `#4FA8D8`（马来文）、珊瑚红 `#D65B4A`（中文/星星）、暖金 `#F0B429`；卡片±1-2°随机倾斜

## 资料夹结构（要点）
`index.html/style.css/app.js` 首页；`kelasku.html/.js/.css` 班级名单页；`docs/dskp/{tahun}/{subjek}.md` DSKP摘要；`data/dskp-index.js` 结构化索引权威来源；`data/supabase-client.js`／`class-code-client.js` 前端SDK；`supabase/schema.sql`（wishes/tool_stats/tool_like_votes+RPC）、`supabase/.secrets.local.md`（DB密码，已gitignore，**凭证存于此**）。同级 `../teaching-tools/{slug}/` 各工具源码。工具登记未拆 `meta.json`，直接写 `app.js` 的 `TOOLS` 常量数组。

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
**非 GitHub 自动部署**，`git push` 成功≠上线。固定三步：① `vercel --prod --yes` ② `vercel alias set <url> kongsi-idea.vercel.app` ③ `curl` 线上档案确认新内容真的在。没跑③不要说「已上线」。

## 本阶段延后
声望星星、许愿池审核后台（待账号体系）；未建索引的科目/年级（不能凑数据编）；缩略图自动生成（目前手动 Playwright 截图）。

## 工作约定
开工读 `handoff.md`，收工必更新；Obsidian 详细纪录 `創作庫/開發專案/kongsi-idea/專案工作流程.md`（决策原因/踩坑写那里，不与handoff重复）；`docs/dskp/` 按需查询不预读；改共用档案前先读最新；新增/修改工具后跑 `../teaching-tools/` 的 `npm run status:sync`；简体中文。

> 完整历史：docs/agents-archive-2026-09-16.md
