# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

本次（2026-08-06 ～ 2026-08-12）从零做出 **kelasku**（老师登录管理班级/学生名单的系统），并接上第一批教学工具：

- kelasku 上线：学校搜索、建班、Excel/贴文字导入名单、多老师共编（即时加入不卡审批）、改动前自动快照可一键还原
- `schools` 表预建全国 1310 间华小，`school_code` 优先用真实官方 Kod Sekolah（目前 1028/1310 已核实，`code_official=true`）
- `class-code-client.js`（各工具接 kelasku 用的共用 snippet）已接上 2 个工具：`tahun1-bc-liangci`（roster + 专属排行榜 `tahun1_bc_liangci_scores`）、`tahun2-mt-shulie-duel`（只接 roster）
- 首页统计条「位老师注册」换成全站真实数字（`profiles` 表 + `get_teacher_count()`）
- 有排行榜的工具，首页卡片会带 🏆 图示直接开新分页跳排行榜（`?board=1` 深链）

详细设计取舍（分数榜隐私评估、多老师权限模型的几轮讨论、Kod Sekolah 抓取方法）在 Claude memory `kongsi-idea-teaching-tools-shared-db-architecture`，这里只记结论；技术细节结论已写进 `agents.md` 的「kelasku」一节。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app
- kelasku 正式网址：https://kongsi-idea.vercel.app/kelasku.html
- ⚠️ **这个 Vercel project（含所有 teaching-tools 子专案）不是 GitHub 自动部署**：git push 之后必须手动跑 `vercel --prod`，而且部署完成后正式域名不会自动指过去，还要 `vercel alias set <新部署url> <正式域名>` 才会真的上线。本次每次改动都是照这个流程手动部署的，下次改动记得别漏这两步
- 本机工具目录：17；已接上 kelasku 的：2（liangci、shulie-duel）
- Kod Sekolah 核实进度：1028/1310（约78%），剩余清单在 `supabase/kod-sekolah-unmatched-2026-08-12.json`

## ✅ 本次完成的关键决定（详见 agents.md「kelasku」一节，此处只列索引）

1. 班级代码格式：`{学校Kod Sekolah}-{班级缩写}`，支持逗号合并多班、同校可省略学校码
2. 多老师共编：`class_teachers` 成员制，加入即时生效；防破坏靠自动快照+一键还原，不是靠卡准入
3. 学生资料：`name_zh`/`name_en`/`seat_no` 三栏，支持 Excel 上传自动侦测栏位
4. 工具专属表命名规则：**必须用完整 slug 当前缀**（`tahun1_bc_liangci_scores`，不是 `liangci_scores`）——已踩过一次坑改名过
5. `ClassCode.loadOrPrompt()`：网址没带 `?code=` 时弹框让学生直接打代码，打过会记住

## 🕳️ 本次踩过的坑（下次遇到类似情况直接查这里）

1. **"功能明明写了但线上测不到"，先查 git 有没有真的推上去、Vercel 有没有重新部署+改别名，不要先怀疑 Auth/RLS 设置**——一开始误判登录跳转问题是 Supabase Auth 的 Redirect URLs 没设好，实际是 `kelasku.html` 根本没 commit/push
2. **`class_teachers` 自己的 RLS policy 里查自己这张表会触发 infinite recursion**——用 `is_class_teacher()` 这个 SECURITY DEFINER 函数打破递归，不要在同一张表的 policy 里直接写自我引用的 `exists(select ...)`
3. **Wikitext 表格解析**：`|- bgcolor="#ECECEC"` 这种带属性的行分隔符标记的是维基条目自己排除的已关闭/已迁移历史记录，整行跳过是对的，不是要抢救的资料；但 Kod 栏位带「曾用旧代码」注记的现役学校，要用「抓开头符合格式的片段」而不是「整格必须完全相等」才抓得到
4. **建 Supabase 专属表时表名不能只取工具关键词，要用完整 slug**——`liangci_scores` 已经改名 `tahun1_bc_liangci_scores`，保留了 42 笔真实数据没丢

## 🕓 待人工执行（继承自上次交接，尚未处理）

- **许愿池状态流转栏位**：`supabase/migration-2026-07-24-wish-pipeline-columns.sql` 写好了但没执行，本次没有再碰这块，仍待处理
- **⚠️ 顺带发现（不属于本专案）**：EduNeo（class_system-1）那个 Supabase 项目有 22 张表完全没开 RLS，建议另外找时间处理

## ⚠️ 注意事项

- Google OAuth 使用 PKCE；登录状态继续依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回抢跑的 `getSession()`
- Supabase Client Secret、数据库密码等只留在已忽略的 `supabase/.secrets.local.md`，不可提交
- `data/dskp-index.js`、`supabase/schema.sql` 目前有本机未提交的小改动（改动量很小，来自更早之前的 session），本次没有动它们也没有一并提交，下次开工先看一下这两处 diff 是不是还要处理

## 🕐 最后更新

- 时间：2026-08-12
- 更新者：Claude Code @ (本机)
- Git push：✅ 已推（待回填最后一次 commit hash）
