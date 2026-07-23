# 交接档（handoff.md）

> 任何 Agent、任何电脑接手前**必读**；收工时**必更新**。
> 本档记录「现在是什么状态」，不是逐条流水账——详细的修改历史看 `git log`，git 从 2026-07-21 起就是这个专案的真实变更记录。

## 🚦 目前状态（2026-07-23）
**已正式上线**：https://kongsi-idea.vercel.app （Vercel Team `kongsi-idea`）——⚠️ **这次 Supabase/Google 登录的改动只在本机验证过，还没 `vercel deploy --prod`**，正式网址上还是旧版本（没有登录、没有真实数据库）。
**代码仓库**：https://github.com/kongsi-idea/kongsi-idea

**本机源码位置**：Hub 在 `kongsi-idea/`，14 个独立工具在 `../teaching-tools/{slug}/`，详见 `agents.md`。

## 📦 本次（2026-07-23）完成的事：Supabase 后端 + Google 登录

1. **独立 Supabase project**：project ref `gntnkhkkgonaehapcerr`，跟 EduNeo 那个完全分开。建表 SQL 在 `supabase/schema.sql`（`wishes` 许愿单表、`tool_stats`/`tool_like_votes` 全站真实聚合计数、两个 RPC 函数），已经在正式 project 上跑过。
2. **老师登录：Google OAuth**，不是 email。登录时机设计在许愿池第1步填完、点「下一步」的时候顺手带登录（按钮会变成「下一步 · 用 Google 登录」），授权完自动跳回来接续第2步，不会弄丢已填内容。已登录状态会存在浏览器，之后再开许愿池不用重新登录。
3. **首页右上角**新增登录状态：未登录显示「用 Google 登录」，已登录显示邮箱+「登出」。
4. **喜欢数/使用次数改成全站真实数据**（`tool_stats` 表），取代原本每台浏览器各自的 localStorage 计数。「喜欢」仍然不用登录，用存在本机的随机 voter key 判断这台浏览器投过票没有。
5. **许愿池真的能送出了**：登录后填完三步会真的 insert 进 `wishes` 表，不再是规格文件里说的「阶段A禁用状态」。
6. **提示条**：原本用浏览器原生 `alert()`，已经全部换成跟网站视觉一致的顶部浮出提示卡（`showToast()`，成功/失败两种颜色）。
7. 顺手修了一个全局 CSS 坑：`[hidden] { display: none !important; }`——之前有元素自己 class 定义了 `display:flex`，跟浏览器原生 `[hidden]` 同优先级时后写的样式表赢，导致该隐藏的元素没真的隐藏。

**怎么看许愿池收到的内容**：目前没做管理后台（RLS 只让老师看自己交的），直接去 **Supabase Dashboard → Table Editor → `wishes` 表**看，或 SQL Editor 跑 `select * from wishes order by created_at desc;`。

## ⚠️ 下次接手前必看：Google OAuth 设置踩坑记录
- **Supabase MCP 工具没有「新建/切换 project」的能力**，只能操作它当下绑定的那一个（这次一直绑在 EduNeo 那个，没跟着切）。要在新 project 跑 SQL，改用 Node.js + `pg` 套件直连 `db.<project-ref>.supabase.co:5432` 执行（跑完记得删掉含密码的临时脚本，密码本身记在 `supabase/.secrets.local.md`）。
- **Google 登录用的是 PKCE flow**，页面重新整理后 session 是异步建立好的——代码里已经改成完全依赖 `onAuthStateChange` 的 `INITIAL_SESSION` 事件确认状态，不要自己猜时机去调 `getSession()`（这个坑已经修掉，写在 `app.js` 的 `initAuth()` 里，别再改回去）。
- 如果之后看到 **「Unable to exchange external code」** 这个错误，几乎都是 Supabase Dashboard 里 Google 的 Client Secret 贴错/贴漏，去 Google Cloud Console 重新复制一次贴回去。
- Google OAuth 应用目前状态（Testing/Production）、Test users 名单等，要另外去 Google Cloud Console 确认——如果之后有别的老师登录失败，先查这个。

## 🧭 首页功能现状（跟上一版 handoff 相比，改动的部分已在上方标出，其余不变）
其余功能（按学习目标找工具、浏览全部工具、工具详情页、DSKP索引覆盖范围等）沿用之前状态，详见 `agents.md`「关键决定」与 `docs/` 底下各规格文件，这里不重复。

## ➡️ 下一步（优先级由上到下）
1. **`vercel deploy --prod` 部署这次的改动**，部署后别忘了 `vercel alias set` 把 `kongsi-idea.vercel.app` 指过去（见 `agents.md` 长期规则）；部署前记得去 Supabase Dashboard 的 Redirect URLs / Google Cloud 的 Authorized origins 确认正式网址那组设置还在（这次本机测试加的是 `localhost:8765`，正式网址那组之前就设置过，理论上不用动，但部署后务必实测一次登录）
2. 如果要让所有老师（不只是你自己）都能用 Google 登录，去 Google Cloud Console 把 OAuth 应用从「Testing」发布成「Production」（基础的 email/profile scope 通常不需要 Google 审核）
3. 扩充 `DSKP_INDEX`（沿用之前的优先级，见 `agents.md`）
4. 长期：许愿池审核后台、老师声望星星——都要等这套账号系统更成熟再讨论

## 🕐 最后更新
- 时间：2026-07-23
- 更新者：Claude Code
- Git：待推（见下方 commit 记录）
