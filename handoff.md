# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

本次（2026-09-11）从「首页浏览数为什么一直是 8」这个问题出发，查到三层问题并都处理了：

1. **「次网页浏览」换成全站真实数据**：旧版 `localStorage` 本地计数从没回传过，历史数据确认无法补回，**用户一度要求「帮我判断放一个合理数值」，已拒绝**（估算值当真实数据展示，跟编数字性质一样，违反本档「关键决定」第 10 条）；改成照抄 `get_teacher_count()` 模式的 `page_view_counter` 单行计数器 + 两个 RPC（`supabase/migration-2026-09-11-page-views.sql`），从 0 诚实重新计数，footnote 加了说明文字。commit `fa9bc45`。**「0 浏览 vs 226 工具使用」这种落差期用户已知情，决定先不处理（「先不动」），没有隐藏统计卡**——如果之后又被问起，解法是暂时藏卡等真实数据长上来，不是补数字。
2. **查到 `kongsi-idea.vercel.app` 曾经完全从专案的 Domains 列表消失**（不是常见的「没 alias 到新部署」，是域名压根不在这个专案名下，边缘缓存顶着旧内容让它看起来像活的）。用 API 直接把域名加回 `kongsi-idea` 专案（`prj_Oyf637d4j8ODuilHIY7eZ2OoZswQ`）解决，`verified:true`。见 `agents.md` 关键决定 16。
3. **Vercel 专案归属大整理**（跟老师逐项确认过范围，不是自己扩大范围做的）：13 个 `tahunN-科目-单元` 教学工具专案原本分裂在 `kongsi-idea` 团队（乱码域名分身）和 `mr007's projects` 团队（干净域名正版）两边，已把正版全部转移进 `kongsi-idea` 团队、删掉分身，域名不变（逐一 curl 验证过标题）。`3g-assessment` 反向操作：老师说它不该在 `kongsi-idea` 团队，已转移回 `mr007's projects`（老师口中的「yquan77」）。**Git 自动部署会跟着团队转移断线**（`tahun2-mt-wang` 断了，需要老师自己去 Dashboard 重连；`3g-assessment` 刚好没断，因为目标团队已经有同一个 GitHub 凭证）。**团队转移后域名会先变 `DEPLOYMENT_NOT_FOUND`，要手动 `POST /v2/deployments/{id}/aliases` 重新指一次才会活**，这条也写进 `agents.md`。

上次（2026-08-26）修好学生找不到「开始使用」按钮的问题，两笔 commit `8a0be5c`/`abd3f75`，完整数据见 Obsidian。
更早（08-14 DSKP 试点审查、08-06～08-12 kelasku 从零上线）见 `agents.md` 对应章节，不重复。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app（域名已修复，本次验证过 `app.js` 里的新 footnote 文字线上确实是新的）
- 部署 URL：`kongsi-idea-abouc4qp9-kongsi-idea.vercel.app`
- 工作目录干净，`fa9bc45` 已推
- `page_view_counter` 目前是真实的小数字（会随真实访问自然成长，没有人为设定初始值）

## ➡️ 下一步

1. **看「网页浏览」数字自然长了几天之后，回头看还要不要处理跟「工具使用」的落差感**——老师这次选择先不处理，之后有需要再藏卡
2. 老师提到 `tahun2-mt-wang` 的 GitHub 自动部署断线了，如果他之后改这个工具发现 push 没生效，提醒他去 Vercel Dashboard → Settings → Git 重新连线（这步需要他本人在浏览器走 OAuth，agent 做不了）
3. **其余 12 个工具的 DSKP 校准还没做**（承接 08-14 的试点），可交 codex 批量跑
4. 想让钱币乐园真正覆盖 4.2/4.3/4.6，得另外加「找零／加减法／储蓄」题型，不是改登记能解决

## ⚠️ 注意事项

- **`kongsi-idea.vercel.app` 域名本身也可能再消失**（本次才发现这个失败模式，原因未知）。以后遇到「部署三步都跑了，线上还是旧的」，先查域名还在不在专案 Domains 列表，不要只重复部署。
- **Vercel 专案分布在两个团队**：`kongsi-idea`（教学工具 + hub 本体）与 `mr007's projects`（老师口中「yquan77」，放 hks-hub/EduNeo/kk2-selamat/bliayad 等主力产品，以及非 tahun 命名的班务小工具）。新建 `tahunN-科目-单元` 工具时确认部署到 `kongsi-idea` 团队，不要又散到 `mr007's projects` 去。
- **`git push` 成功 ≠ 上线**。这个专案没有 GitHub 自动部署。固定收尾三步：`vercel --prod --yes` → 确认域名还在专案 Domains 列表（新增的检查点）→ `curl` 线上档案确认新内容在。详见 `agents.md`「部署提醒」。
- **详情弹窗的第一屏属于学生**：见 `agents.md` 关键决定 7。
- `.mcp.json` 已加进 `.gitignore`。`data/supabase-client.js` 里的 anon key 是设计上公开的。
- Google OAuth 使用 PKCE；登录状态依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回 `getSession()`
- Supabase Client Secret、数据库密码只留在已忽略的 `supabase/.secrets.local.md`，不可提交
- 许愿池状态流转栏位 `supabase/migration-2026-07-24-wish-pipeline-columns.sql` 写好了但仍未在 Supabase 执行，继承自更早的交接，本次没有再碰

## 🕐 最后更新

- 时间：2026-09-11
- 更新者：Claude Sonnet 5 @ MacBook Air M3
- Git push：✅ 已推（`fa9bc45`）
- 线上部署：✅ 已上线并验证（`kongsi-idea.vercel.app` 本体；Vercel 团队整理属于云端专案设定变更，不产生 git commit）
