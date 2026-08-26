# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

本次（2026-08-26）修好了**学生在课堂上找不到「开始使用」**的问题。

**起因是真实课堂观察，不是设计上的洁癖**：卢老师这天让 1I 班学生实际使用点子铺，发现学生点开工具详情后一直点缩略图、以为那就是游戏——因为「开始使用」被排在说明／DSKP／版本／更新记录之后，要往下滚很久才看得到。这是这次改动的唯一依据。

诊断出来的根因是**这个弹窗一份给两种人看**：DSKP 标准框、版本号、更新记录、作者署名全是给老师的，内容顺序也是老师的阅读顺序；但课堂上真正打开它的是学生。不是「按钮不够显眼」，是信息架构指错了受众。

两笔 commit：

- **`8a0be5c`** 按钮上提到工具名正下方，改成整行宽 + `▶` 图示；老师要读的资料全部移到虚线分隔线以下；缩略图加 🔍 角标（讲清楚点下去是放大看不是开始玩）。顺手修了真凶：3 张缩略图的版面里，跨两行的主图被写死 `aspect-ratio: 8/9`（竖版比例套横格子），把画廊拉到约 440px、比 4 张图的版面还高 100px，正好把按钮挤出第一屏。
- **`abd3f75`** 补小屏断点。**真正的破口是手机／平板横放**（844×390，学生玩游戏最常见的握法）：88vh 只剩 343px，光画廊就占 337px，17 个工具全部失败、按钮掉在第一屏下 188px。`@media (max-height: 560px)` 把画廊压成单行缩略条；`@media (max-width: 480px)` 收窄外距内距，360px 宽的机器上内容宽度 276→338px。

验证方式是**逐个工具量按钮底边有没有掉出 modal 底边**（17 个工具 × 4 个视口全过），不是肉眼看。完整数据与决策取舍见 Obsidian。

上次（2026-08-14）用游戏化教学理论库试点审查 5 个已上架工具，修正钱币乐园的 DSKP 登记、记录产线的结构性缺口，详见 `docs/published-tools-coverage.md`。
更早（2026-08-06～08-12）从零做出 kelasku 并接上 2 个工具，关键决定与踩坑在 `agents.md`「kelasku」一节。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app
- **本次已完整上线并验证**：`vercel --prod` → `vercel alias set` → `curl` 线上 `style.css`／`index.html` 确认新内容真的在（`max-height:560px`、`max-width:480px`、`detail__rule`、放大镜角标皆抓得到，按钮排序在说明之前）
- 部署 URL：`kongsi-idea-2cksurttn-kongsi-idea.vercel.app`
- 工作目录干净；`.mcp.json` 本次改为不追踪（见下方注意事项）

## ➡️ 下一步

1. **其余 12 个工具的 DSKP 校准还没做**（承接 08-14 的试点），可交 codex 批量跑
2. 想让钱币乐园真正覆盖 4.2/4.3/4.6，得另外加「找零／加减法／储蓄」题型，不是改登记能解决
3. 总结／复习型工具需要单独立项设计新形状（跨单元题库、开放式产出），不能延用「一个工具对一个 DSKP 代码」的产线去凑

## ⚠️ 注意事项

- **`git push` 成功 ≠ 上线**。这个专案没有 GitHub 自动部署，2026-08-26 已经是第二次栽在这里（第一次 2026-08-06）。固定收尾三步：`vercel --prod --yes` → `vercel alias set <新部署url> kongsi-idea.vercel.app` → **`curl` 线上档案确认新内容在**。没跑完第三步不要说「已上线」。详见 `agents.md`「部署提醒」。
- **本地验证 CSS 改动会踩浏览器快取**：改完 `style.css` 后即使重新导航，浏览器仍可能用旧的那份，量出来会像是「改了没效果」，差点误判成断点写错。要换掉 `<link>` 的 href（加 `?bust=`）强制重拉再量。
- **详情弹窗的第一屏属于学生**：以后往里面加任何东西，先问「这一屏给谁看」，老师要读的资料放分隔线以下。见 `agents.md` 关键决定 7。
- `.mcp.json` 已加进 `.gitignore`（本次）。里面目前只有公开的 `project_ref`（跟 `data/supabase-client.js` 里的 `SUPABASE_URL` 同一个，本来就公开），**没有金钥**；不追踪的理由是 Supabase MCP 设定档很常在之后被补上 `sbp_` 开头的 access token，档案一旦被追踪那次就会静静跟着 commit 出去。
- Google OAuth 使用 PKCE；登录状态继续依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回抢跑的 `getSession()`
- Supabase Client Secret、数据库密码只留在已忽略的 `supabase/.secrets.local.md`，不可提交
- 许愿池状态流转栏位 `supabase/migration-2026-07-24-wish-pipeline-columns.sql` 写好了但仍未在 Supabase 执行，继承自更早的交接，本次没有再碰

## 🕐 最后更新

- 时间：2026-08-26
- 更新者：Claude Opus 5 @ MacBook Air M3
- Git push：✅ 已推（`abd3f75`）
- 线上部署：✅ 已上线并验证
