# 课堂点子铺交接档

> 开工先读本档；查询全部教学工具状态时，直接读 `../teaching-tools/PROGRESS.md`。

## ⏯️ 目前做到哪

Hub 已接入新的跨目录工具状态系统：

- `../teaching-tools/PROGRESS.md` 是全部工具状态的权威入口。
- `docs/tools-status.md` 是同步生成的 Hub 镜像。
- `../teaching-tools/tools-status.json` 记录满意度、已知问题与下一步。
- 在 `../teaching-tools/` 运行 `npm run status:sync`，会同步工具总览、README 与本目录镜像。

原有 Supabase 后端、Google 登录、许愿池真实提交、喜欢数和使用次数聚合代码仍保留；本次没有修改这些运行时代码。

## 🚦 目前状态

- Hub 正式网址：https://kongsi-idea.vercel.app
- 本机工具目录：17
- 已上架到 Hub：16
- 开发中未上架：1（`tahun1-bc-chongzu`）
- 明确需优化：1（`tahun1-bc-liangci`）
- `published-tools-coverage.md` 已登记 16/16 个已上架工具

⚠️ 先前交接记录显示 Supabase／Google 登录改动只在本机验证、尚未部署正式站；本次没有执行生产部署，因此正式站是否已含这批功能仍须部署前重新确认。

## ➡️ 下一步

1. 修正 DSKP 搜索保留查询词后把正确工具过滤掉的问题。
2. 修正 `tahun1-bc-liangci` 的 DSKP 引用与 changelog 顺序。
3. 部署前重新确认 Supabase Redirect URLs、Google OAuth Production/Test users，并实测正式站登录与许愿提交。

## ⚠️ 注意事项

- `docs/tools-status.md` 是生成档，不要直接手改；来源是 `../teaching-tools/tools-status.json`、Hub `TOOLS` 与 `DSKP_INDEX`。
- 状态同步不会自动公开半成品；发布仍须完成测试、DSKP 核对、截图、工具部署和 Hub 登记。
- Google OAuth 使用 PKCE；登录状态继续依赖 `onAuthStateChange` 的 `INITIAL_SESSION`，不要改回抢跑的 `getSession()`。
- Supabase Client Secret、数据库密码等只留在已忽略的 `supabase/.secrets.local.md`，不可提交。

## 🕐 最后更新

- 时间：2026-07-24
- 更新者：Codex @ mr007s-Macbook-Air.local
- Git push：✅ 已推（功能提交 `e88fb8d`）
