# 交接档（handoff.md）

> 任何 Agent、任何电脑接手前**必读**；收工时**必更新**。
> 本档记录「现在是什么状态」，不是逐条流水账——详细的修改历史看 `git log`，git 从 2026-07-21 起就是这个专案的真实变更记录。

## 🚦 目前状态（2026-07-21）
**已正式上线**：https://kongsi-idea.vercel.app （Vercel Team `kongsi-idea`）
**代码仓库**：https://github.com/kongsi-idea/kongsi-idea （public，git 已初始化，历史完整；原名 `eduneo-hub`，已改名统一用 `kongsi-idea`）
**14 个真实工具**已全部上架，示例/mock 作品已经清空，`app.js` 的 `TOOLS` 里现在都是真货。

**本机源码位置**：Hub 与工具已整理为同级资料夹；平台在 `kongsi-idea/`（原名 `eduneo-hub/`，已改名），14 个独立工具在 `../teaching-tools/{slug}/`。工具总规范／清单见 `../teaching-tools/agents.md` 与 `README.md`；钱币乐园原本的「二年级数学／互动学习软件」已规范为 `../teaching-tools/tahun2-mt-wang/app/`。

品牌名：**课堂点子铺**（Kedai Idea）。核心文案：「老师有点子，课堂有办法。」

## 📦 已上架的 14 个工具
逐一对应关系、覆盖矩阵看 `docs/published-tools-coverage.md`（新增工具/`status`改`published`时记得回来更新这份文件）。简要列表：
- `tahun1-mt-bundar` 近似值特快车、`tahun2-mt-wang` 钱币乐园、`tahun4-mt-nombor` 数学知识大比拼
- `tahun2-mt-shuzhi` 苹果果园数学、`tahun2-mt-baigetu` 百格图乘法表动画
- `tahun2-mt-shulie-explore`/`-boss`/`-duel` 有规律的数列三件套（同一DSKP单元的学习/练习/对战三种场景）
- `tahun1-bc-shizi` 识字大对决、`tahun1-bc-bushou` 部首大对垒、`tahun1-bc-zaoju` 神奇句子小火车、`tahun3-bc-kewen` 语文课文大PK
- `tahun1-bm-kvkv` KVKV音节打地鼠
- **`tahun1-dst-magnet` 磁铁大发现**——本平台第一个不靠老师投稿、直接照 DSKP 内容标准自主设计的工具（科学 7.1 磁铁）。拖磁铁靠近11件物品，磁性物品飞向磁铁、非磁性掉落，另有磁极相吸相斥实验+磁铁形状图鉴。**这个工具部署在新的 `kongsi-idea` Vercel team 底下**（不是 `mr007's projects`），网址 `tahun1-dst-magnet.vercel.app`——以后新工具建议都跟着放这个team，逐步跟旧的13个（还在个人账号）拉开距离，是否回头统一搬迁未定

所有工具仓库都在 GitHub org `kongsi-idea` 底下，仓库名＝slug；原本13个大部分部署在 `mr007's projects`（个人Vercel账号）底下，**还没有统一搬去 `kongsi-idea` Vercel team**——以后要不要统一搬需要另外讨论，涉及重新部署+域名，目前没有默认去动。新工具（如上面的磁铁）已经开始改放新team了。

## ⚠️ 安全提醒（未完成，需要用户本人操作）
处理 `yquan77/teaching-tools` 仓库时发现 `y1-bc-火车造句.html` 第325行硬编码了一个**真实有效的 Gemini API key**，已经在做成 `tahun1-bc-zaoju` 时完全移除、改用浏览器内建语音。**但这个 key 本来就在公开仓库里暴露过**，即使这次没有沿用，**用户应该自己去 Google Cloud / AI Studio 控制台把这个 key 撤销或重新生成**，以防已经被盗刷或滥用。这件事这次没有做，需要用户手动处理。

## 🧭 首页功能现状
1. **主入口「今天要教什么？」**（`.finder`）：年级→科目→（有索引才有）单元/学习目标树，结果卡显示对应学习目标/可练习什么/课堂方式/准备条件/DSKP核对状态。搜索支持代码/中文/马来文关键词，最多5条建议；URL 状态同步（`?tahun=&subjek=&unit=&objective=&q=`），复制网址能还原筛选。
   - `data/dskp-index.js` 的 `DSKP_INDEX` 目前有 **7 笔结构化记录**（数学 Tahun1/2/4、华文 Tahun1/3、马来文 Tahun1、科学 Tahun1 磁铁），其余工具的 DSKP 对照还没转成结构化索引，「按学习目标找工具」目前只对这几笔生效，其他工具要靠下方「浏览全部工具」找
   - 常用入口只有「钱币」真的可点，其他几个诚实显示「索引整理中」
2. **辅助路径「浏览全部工具」**：年级+科目双筛选facet + 自由搜索，两者取交集（之前有个「搜索词会跳过筛选」的bug已修复并用Playwright验证过）
3. **点子许愿池**（原「许愿」按钮）：三步结构化表单（这堂课／学生卡在哪里／你希望怎样帮上忙），本机草稿暂存，**送出按钮固定禁用**（没有后端+登录系统，不会假装送出成功；这是刻意决定——即使规格文件没提，用户明确要求许愿仍需要登录才能真的送出）
4. **底部统计条**：网页浏览次数／工具使用次数／个作品已上架（=14，随 `status:"published"` 工具数自动算，不用手动改）／老师注册数——**都是本机 localStorage 累计，不是全站真实数据**，注册数如实显示0（账号系统未上线）。「间华小已收录在名录里」这个统计**已经拿掉**，因为那是参考名录大小、不是真实使用数据，容易误导人（名录本身还留着给选校用）
5. **新访客欢迎侧边卡**：第一次造访这台浏览器才会滑出，附「去点子许愿池看看」按钮
6. **工具详情页**：缩略图画廊（1/2/4张自适应版位）+点击放大灯箱、创作人具名署名、对应课程标准（只有真的核对过DSKP的才显示）、`version`+`changelog`版本记录（倒序显示）、喜欢数（任何人可点，不用登录）、使用次数
7. **控件视觉规格已统一**：所有输入框/下拉选单共用同一套 `--field-*` token，select 用 `appearance:none`+自画箭头去除浏览器系统外观差异，跟搜索框像素级对齐（Playwright 实测过）；统计条改用 grid 固定断点，不会再有数字排版对不齐的情况
8. **首页标题打字机效果**：「今天要教什么？」用 `typewriterInto()` 逐字打出，「今天」两字先出现、停顿2秒、再继续打完剩下的字；`aria-label` 让屏幕阅读器直接读到完整文字（动画只是视觉效果），尊重 `prefers-reduced-motion` 直接显示完整文字不跑动画
9. **「浏览全部工具」筛选记住上次选择**：年级/科目 facet 存进 `localStorage`（键 `kongsi-idea-board-filter`），刷新页面不会跳回「全部」——之前只有上面的「按学习目标找工具」finder 有 URL 同步持久化，这个辅助路径本来完全没有持久化，这次补上
10. **技术代号统一改成 `kongsi-idea`**：GitHub 仓库（原 `eduneo-hub`）、本机资料夹（原 `eduneo-hub/`）、所有 localStorage 键名前缀（原 `eduneo-hub-*`）都改成 `kongsi-idea`，跟 Vercel 项目名/网址完全对齐，不再有旧技术代号残留。**副作用**：改 localStorage 键名会让现有访客本机累计的喜欢数/使用次数/是否看过欢迎卡等数据归零重来——这轮几乎没有真实访客，用户已确认这个代价可以接受。

## 🌱 新增能力：不靠老师投稿，直接照 DSKP 自主开发
用户确认这条路径可行——不必等老师给点子，也可以自己翻 `docs/dskp/` 挑一个还空白的年级/科目，设计构思后开发上架（`tahun1-dst-magnet` 磁铁大发现是第一个案例）。**前提**：核心玩法设计仍要经用户本人的教学判断把关，不是纯粹照 DSKP 条文清单照做——先讲清楚要做成什么效果、confirm 方向，再动手，避免做出"技术上对得上标准但课堂不缺"的东西。`docs/published-tools-coverage.md` 的覆盖矩阵就是找空白年级/科目的起点。

## 🔬 待确认：科学科的 `dst`/`sains` 分界
`docs/subjek-tahun.md` 把 Tahun1-3 科学科归类为 `dst`（Dunia Sains dan Teknologi），Tahun4-6 才叫 `sains`——但这次查证 Tahun1 官方 DSKP PDF，文件标题其实是《**Sains** SJK(C) Tahun 1》，不是「Dunia Sains dan Teknologi」。`subjek-tahun.md` 自己也承认这个不确定性未查实。目前 `tahun1-dst-magnet` 还是沿用现有平台分类（`dst`）避免打乱现有筛选逻辑，但这个分界之后有空应该回头核对 BPK 官网 Tahun2/3 页面的 DSKP 文件实际标题，确认「dst」这个名称在最新课纲文件里到底还用不用。

## 🔑 长期规则（写在 `agents.md`「关键决定」，别忘记）
- 工具打磨时把原作者写死的设定（人数/名单/难度等）主动改成开局前可调整，不用每次问
- 老师反馈调整后：升 `version` 号 + 在 `changelog` 追加一笔，不覆盖旧记录
- `creator` 字段要放真实贡献者姓名，不能偷懒都挂卢老师
- 许愿池提交需要登录（即使规格文件语焉不详，这条以用户重申的为准）
- 不要给没真的核对过 DSKP 的工具编造 `standards`/`DSKP_INDEX` 记录
- 新建 Vercel Team 底下的专案要检查并关掉默认的 SSO 保护，不然老师打开工具会看到登录墙
- **`vercel deploy --prod` 不会自动把正式网址 `kongsi-idea.vercel.app` 指向新部署**：这个别名是手动用 `vercel alias set` 加的。每次 `vercel deploy --prod` 之后，如果要让 `kongsi-idea.vercel.app` 看到最新内容，要再跑一次 `vercel alias set <这次部署的url> kongsi-idea.vercel.app`（部署完的输出会给这个url）。
- **`eduneo-hub.vercel.app` 这个附带网址删不掉，会自动重新长回来**：手动 `vercel alias rm` 删过，但下一次 `vercel deploy --prod` 又会自动把它重新指向最新部署——这是 Vercel 项目建立时绑定的默认域名字根，即使项目显示名称已经改成 `kongsi-idea`，这个自动网址的字根还是没变，除非把整个 Vercel 项目删掉重建才能真正消灭。**用户已确认这个残留网址保留不管**（没有任何地方链接到它，主用网址 `kongsi-idea.vercel.app` 才是真正对外展示的），不用再花力气去处理，也不用为了这个重建整个项目。

## 📚 参考资料（按需查询，不要整批读进对话）
- `docs/dskp/{tahun}/{subjek}.md`——DSKP散文摘要，覆盖数学/科学/马来文/英文全年级+华文5个年级；历史/道德/体育/美术/音乐/RBT等还没做
- `docs/dskp-bm-glossary-mt-sains.md` / `docs/dskp-bm-glossary-others.md`——马来文官方术语核对记录，扩充`DSKP_INDEX`前先查这两份，别重新上网找。**重要发现**：数学/科学的SJK(C)版官方PDF正文其实是全中文，马来文标题要查**SK国小版**（已确认单元代码结构两版共用，可以对应）
- `docs/subjek-tahun.md`——13个科目的马来文代码表
- `docs/published-tools-coverage.md`——年级×科目覆盖矩阵，看平台还缺什么类型的工具
- `data/sjkc-schools.json`（+`.js`）——约1310间华小参考名录，不要求绝对精确，UI留手动输入兜底

## ➡️ 下一步（优先级由上到下）
1. **扩充 `DSKP_INDEX`**：目前7笔记录只覆盖部分数学/华文/马来文/科学单元，`docs/dskp/`里其他科目的散文摘要要陆续人工转成结构化记录，才能让「按学习目标找工具」覆盖更多工具
2. **`yquan77/teaching-tools` 已经处理完**，但用户手上如果还有别的素材来源，可以延续同一套流程（挑选→打磨→测试→上架GitHub org→Vercel部署→截图→写进`app.js`+`DSKP_INDEX`）
3. **安全提醒里那个 Gemini API key 需要用户去后台撤销**（见上方专门段落）
4. 长期：账号系统/登录/Supabase后端、点子许愿池真的能送出、老师声望星星、DSKP索引验证脚本
5. 14个工具目前分散在个人Vercel账号（13个旧的）和`kongsi-idea` team（1个新的，磁铁大发现），要不要统一搬迁待讨论

## 🕐 最后更新
- 时间：2026-07-21
- Git：已初始化，远端 `github.com/kongsi-idea/kongsi-idea`（public，原名 `eduneo-hub` 已改名），这轮改动已 commit 并 push
