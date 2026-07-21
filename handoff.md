# 交接档（handoff.md）

> 任何 Agent、任何电脑接手前**必读**；收工时**必更新**。
> 本档记录「现在是什么状态」，不是逐条流水账——详细的修改历史看 `git log`，git 从 2026-07-21 起就是这个专案的真实变更记录。

## 🚦 目前状态（2026-07-21）
**已正式上线**：https://kongsi-idea.vercel.app （Vercel Team `kongsi-idea`）
**代码仓库**：https://github.com/kongsi-idea/eduneo-hub （private，git 已初始化，历史完整）
**13 个真实工具**已全部上架，示例/mock 作品已经清空，`app.js` 的 `TOOLS` 里现在都是真货。

品牌名：**课堂点子铺**（Kedai Idea）。核心文案：「老师有点子，课堂有办法。」

## 📦 已上架的 13 个工具
逐一对应关系、覆盖矩阵看 `docs/published-tools-coverage.md`（新增工具/`status`改`published`时记得回来更新这份文件）。简要列表：
- `tahun1-mt-bundar` 近似值特快车、`tahun2-mt-wang` 钱币乐园、`tahun4-mt-nombor` 数学知识大比拼
- `tahun2-mt-shuzhi` 苹果果园数学、`tahun2-mt-baigetu` 百格图乘法表动画
- `tahun2-mt-shulie-explore`/`-boss`/`-duel` 有规律的数列三件套（同一DSKP单元的学习/练习/对战三种场景）
- `tahun1-bc-shizi` 识字大对决、`tahun1-bc-bushou` 部首大对垒、`tahun1-bc-zaoju` 神奇句子小火车、`tahun3-bc-kewen` 语文课文大PK
- `tahun1-bm-kvkv` KVKV音节打地鼠

所有工具仓库都在 GitHub org `kongsi-idea` 底下，仓库名＝slug；大部分部署在 `mr007's projects`（个人Vercel账号）底下，**还没有统一搬去 `kongsi-idea` Vercel team**（只有 `eduneo-hub` 自己搬了）——以后要不要统一搬需要另外讨论，涉及重新部署+域名，目前没有默认去动。

## ⚠️ 安全提醒（未完成，需要用户本人操作）
处理 `yquan77/teaching-tools` 仓库时发现 `y1-bc-火车造句.html` 第325行硬编码了一个**真实有效的 Gemini API key**，已经在做成 `tahun1-bc-zaoju` 时完全移除、改用浏览器内建语音。**但这个 key 本来就在公开仓库里暴露过**，即使这次没有沿用，**用户应该自己去 Google Cloud / AI Studio 控制台把这个 key 撤销或重新生成**，以防已经被盗刷或滥用。这件事这次没有做，需要用户手动处理。

## 🧭 首页功能现状
1. **主入口「今天要教什么？」**（`.finder`）：年级→科目→（有索引才有）单元/学习目标树，结果卡显示对应学习目标/可练习什么/课堂方式/准备条件/DSKP核对状态。搜索支持代码/中文/马来文关键词，最多5条建议；URL 状态同步（`?tahun=&subjek=&unit=&objective=&q=`），复制网址能还原筛选。
   - `data/dskp-index.js` 的 `DSKP_INDEX` 目前有 **6 笔结构化记录**（数学 Tahun1 近似值、Tahun2 钱币、Tahun4 数值……），其余工具的 DSKP 对照还没转成结构化索引，「按学习目标找工具」目前只对这几笔生效，其他工具要靠下方「浏览全部工具」找
   - 常用入口只有「钱币」真的可点，其他几个诚实显示「索引整理中」
2. **辅助路径「浏览全部工具」**：年级+科目双筛选facet + 自由搜索，两者取交集（之前有个「搜索词会跳过筛选」的bug已修复并用Playwright验证过）
3. **点子许愿池**（原「许愿」按钮）：三步结构化表单（这堂课／学生卡在哪里／你希望怎样帮上忙），本机草稿暂存，**送出按钮固定禁用**（没有后端+登录系统，不会假装送出成功；这是刻意决定——即使规格文件没提，用户明确要求许愿仍需要登录才能真的送出）
4. **底部统计条**：网页浏览次数／工具使用次数／个作品已上架（=13）／老师注册数——**都是本机 localStorage 累计，不是全站真实数据**，注册数如实显示0（账号系统未上线）。「间华小已收录在名录里」这个统计**已经拿掉**，因为那是参考名录大小、不是真实使用数据，容易误导人（名录本身还留着给选校用）
5. **新访客欢迎侧边卡**：第一次造访这台浏览器才会滑出，附「去点子许愿池看看」按钮
6. **工具详情页**：缩略图画廊（1/2/4张自适应版位）+点击放大灯箱、创作人具名署名、对应课程标准（只有真的核对过DSKP的才显示）、`version`+`changelog`版本记录（倒序显示）、喜欢数（任何人可点，不用登录）、使用次数
7. **控件视觉规格已统一**：所有输入框/下拉选单共用同一套 `--field-*` token，select 用 `appearance:none`+自画箭头去除浏览器系统外观差异，跟搜索框像素级对齐（Playwright 实测过）；统计条改用 grid 固定断点，不会再有数字排版对不齐的情况

## 🔑 长期规则（写在 `agents.md`「关键决定」，别忘记）
- 工具打磨时把原作者写死的设定（人数/名单/难度等）主动改成开局前可调整，不用每次问
- 老师反馈调整后：升 `version` 号 + 在 `changelog` 追加一笔，不覆盖旧记录
- `creator` 字段要放真实贡献者姓名，不能偷懒都挂卢老师
- 许愿池提交需要登录（即使规格文件语焉不详，这条以用户重申的为准）
- 不要给没真的核对过 DSKP 的工具编造 `standards`/`DSKP_INDEX` 记录
- 新建 Vercel Team 底下的专案要检查并关掉默认的 SSO 保护，不然老师打开工具会看到登录墙
- **`vercel deploy --prod` 不会自动把正式网址 `kongsi-idea.vercel.app` 指向新部署**：这个别名是当初用 `vercel alias set` 手动加的，只有 Vercel 项目预设的 `eduneo-hub.vercel.app` 会跟着每次 production 部署自动更新。每次 `vercel deploy --prod` 之后，如果要让 `kongsi-idea.vercel.app` 也看到最新内容，要再跑一次 `vercel alias set <这次部署的url> kongsi-idea.vercel.app`（部署完的输出会给这个url）。这次是先注意到 `kongsi-idea.vercel.app` 还在跑旧内容（`curl` 出来 `age` header 显示是几小时前的缓存），才发现要补这一步。

## 📚 参考资料（按需查询，不要整批读进对话）
- `docs/dskp/{tahun}/{subjek}.md`——DSKP散文摘要，覆盖数学/科学/马来文/英文全年级+华文5个年级；历史/道德/体育/美术/音乐/RBT等还没做
- `docs/dskp-bm-glossary-mt-sains.md` / `docs/dskp-bm-glossary-others.md`——马来文官方术语核对记录，扩充`DSKP_INDEX`前先查这两份，别重新上网找。**重要发现**：数学/科学的SJK(C)版官方PDF正文其实是全中文，马来文标题要查**SK国小版**（已确认单元代码结构两版共用，可以对应）
- `docs/subjek-tahun.md`——13个科目的马来文代码表
- `docs/published-tools-coverage.md`——年级×科目覆盖矩阵，看平台还缺什么类型的工具
- `data/sjkc-schools.json`（+`.js`）——约1310间华小参考名录，不要求绝对精确，UI留手动输入兜底

## ➡️ 下一步（优先级由上到下）
1. **扩充 `DSKP_INDEX`**：目前6笔记录只覆盖部分数学单元，`docs/dskp/`里其他科目的散文摘要要陆续人工转成结构化记录，才能让「按学习目标找工具」覆盖更多工具
2. **`yquan77/teaching-tools` 已经处理完**，但用户手上如果还有别的素材来源，可以延续同一套流程（挑选→打磨→测试→上架GitHub org→Vercel部署→截图→写进`app.js`+`DSKP_INDEX`）
3. **安全提醒里那个 Gemini API key 需要用户去后台撤销**（见上方专门段落）
4. 长期：账号系统/登录/Supabase后端、点子许愿池真的能送出、老师声望星星、DSKP索引验证脚本
5. 13个工具目前分散在个人Vercel账号和`kongsi-idea` team，要不要统一搬迁待讨论

## 🕐 最后更新
- 时间：2026-07-21
- Git：已初始化，远端 `github.com/kongsi-idea/eduneo-hub`，本地有未提交的改动（这轮的CSS/统计条/欢迎卡片相关修改），收工前记得 commit
