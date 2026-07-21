# 交接档（handoff.md）

> 任何 Agent、任何电脑接手前**必读**；收工时**必更新**。

## 🆕 2026-07-21 更新（Claude）
1. **工具上架管道正式跑通，第一件真实作品上架**：`tahun1-mt-bundar`「近似值特快车」——一年级数学十位近似值骰子棋盘游戏。流程：用户贴 React 组件代码 → 分析+抓bug+确认设计方向 → 补齐 Vite+React+Tailwind 骨架 → 本地 Playwright 测试 → git init + `gh repo create` 推到 **`kongsi-idea`**（新开的 GitHub Organization，专门放这些工具仓库）→ `vercel deploy --prod` → Playwright 截 4 张真实画面存 `assets/thumbs/tahun1-mt-bundar/` → 写进 `app.js` TOOLS + `data/dskp-index.js`（新增 Tahun1 数学 1.0/1.8 单元，Malay 官方用词「Membundarkan nombor」「puluh terdekat」用 WebSearch 查证过，不是回译猜的）。
2. **`eduneo-hub` 本身也 `git init` 了**（之前一直没做），第一个 commit 已包含到这次上架为止的所有内容。
3. **通用工具打磨原则已确立**（详见 `my-agent` 侧 memory `eduneo-hub-tool-flexibility-principle`）：凡是原作者写死给自己班用的设定（人数/名单/难度等），打磨时都要主动改成开局前可调整，不用每次跟用户确认要不要做这件事。这次做法：把写死的 7 组队伍改成 2-8 组可调、队名可编辑的开局设定画面。
4. **GitHub Organization `kongsi-idea` 已建好**，yquan77 是 owner，Free 版够用（仓库数/协作者数都不限）。之后每个新工具都建在这个 org 底下，仓库名 = slug，Vercel 项目名也用同一个 slug（产地址 `{slug}.vercel.app`），方便对应。
5. **本机 Playwright 走原生 python (`webapp-testing` skill) 没有卡住**——用 `scripts/with_server.py` 或手动起 `vite preview`/`http.server` + 原生 `playwright.sync_api` 脚本，跟之前记忆里提到的「Playwright MCP 容易卡住」是不同路径，这次全程顺畅，以后同类任务可以优先试这条路。
6. **待办**：目前没有 Tahun1+数学 的示例作品可以对应删掉（10个mock没有完全匹配的），所以这次是新增而非替换；示例作品清理这件事还是要看之后哪个真工具跟哪个mock年级科目重叠再动手，不要为了凑数硬删不相关的mock。
7. **钱币乐园正式搬进 `kongsi-idea`**：原本仓库是个人账号下的 `yquan77/grade2-math`（Vercel 项目名 `grade2-math-tools`），跟新定的 slug 命名对不上。用 `gh api repos/.../transfer` 转移到 `kongsi-idea` 组织，再 `gh api ... -X PATCH -f name=` 改名成 `tahun2-mt-wang`，Vercel 项目也用 `vercel project rename` 改成同名，并用 `vercel alias set` 加了 `tahun2-mt-wang.vercel.app` 这个新网址——**旧网址 `grade2-math-tools.vercel.app` 仍保留能用**，没有断线。`app.js` 里的 `url` 字段已更新成新网址；仓库本身是 private，这次没有改动可见性。本地 `二年级数学/` 资料夹的 git remote 也同步指向新仓库位置了。这个项目是纯手动 `vercel deploy` 部署（没有接 GitHub 自动部署 webhook），所以搬仓库这件事不影响之后怎么发布新版本，流程不变。
8. **第二件真实工具上架**：`tahun4-mt-nombor`「数学知识大比拼」——四年级数学 100000 以内数值双人对战抽签游戏，来源是用户 `yquan77/teaching-tools` 这个仓库里囤的 v1 小工具（原本用 CDN React + 浏览器内 Babel 即时转译，这次收进 Vite 打包成正式专案，不再依赖 unpkg）。对应 DSKP Tahun4 数学 1.0 单元「Nombor Bulat dan Operasi Asas」的 1.1「Nilai Nombor」，5种题型（读数/数位/数值/比大小/数列）全部对应到这一条标准的两条学习标准（1.1.1/1.1.2），官方马来文用词用 WebSearch 查证过。顺手修了3个bug：①学生人数没有下限校验，填0或1会让抽签的去重循环死掉卡住整个分页；②数值题型在个位数字时错误选项会算出小数（如0.7），改成合理整数距离；③数列题型的错误选项在间隔=10时会跟题目里已经显示的项撞号，改成按间隔比例算距离。**用户手上还有一整个 `yquan77/teaching-tools` 仓库囤着很多 v1 小工具**（华文部首PK、数位值教学、有规律的数列等），之后可以逐个用同样流程搬进来。
9. **统一了控件视觉规格**：用户反馈「按学习目标找工具」区块的年级/科目下拉选单跟搜索框宽度高度对不齐、有的还被裁切出画面。根因是这轮陆续加功能时，每个控件（`.search input`/`.finder__row select`/`.finder__search input`/`.wish__field`系/`.school-picker`系）各自手写了一套 padding/圆角/字号，值都不一样；另外 `.finder__row` 原本用 `flex:1` 排两个 select，浏览器原生 `<select>` 宽度会被最长的那个 `<option>` 撑开（比如「体育与健康教育（索引整理中）」），跟旁边短选项的年级选单对不齐、甚至把整排撑出画面外。修法：① 在 `:root` 新增 `--field-*` 系列token，用一条共用规则把上面列的所有控件的 `padding/border-radius/border/font-size` 统一起来（圆角矩形＝可填字段，药丸形＝可点按钮/标签，靠形状分工不是靠颜色）；② `.finder__row` 从 `flex` 改成 `grid-template-columns: 1fr 1fr`，两个 select 永远各占一半、靠裁切显示过长文字而不是撑开容器；③ 索引整理中提示文字从「（索引整理中）」缩到「（整理中）」减少长度差异。改完用 Playwright 实测过最长选项「体育与健康教育（整理中）」也不会撑出画面。
10. **select 高度跟输入框还是对不齐，根因更深一层**：用户后续反馈年级/科目下拉还是比搜索框矮一截——即使 padding/字号完全统一，浏览器原生 `<select>` 仍带一层系统外观（macOS/Windows 各自的下拉框皮肤），渲染出来的实际高度不受 CSS padding 完全控制。修法：`.finder__row select`/`.wish__field select`/`.school-picker__row select` 都加 `appearance: none` 关掉系统外观，改用 CSS `background-image` 画一个 SVG 箭头（`stroke: var(--ink)`），保留原生 `<select>`（键盘操作/无障碍都还在），只是外观完全交给 CSS。用 Playwright `getBoundingClientRect()` 实测过：年级选单/科目选单/两个搜索框，四个的高度现在完全一致（47.13px），不是肉眼看着差不多，是像素级对齐。
11. **新增「已上架工具总览」`docs/published-tools-coverage.md`**：用户想要一眼看出平台缺什么类型的工具，这份文件维护一张年级×科目覆盖矩阵+清单表，每次新工具 `status` 改 `published` 都要回来更新，别忘记。
12. **第三件真实工具上架，且是用户明确授权"自动挑、不用问"之后自主完成的**：`tahun1-bc-shizi`「识字大对决」——一年级华文识字，覆盖全年22个单元+5个识字复习单元的官方教材词汇（自动标注拼音），闪卡认读+两班PK对战两种模式。素材来自 `yquan77/teaching-tools` 仓库的 `Y1-BC-识字.html`（挑选依据：该仓库里有好几组疑似同主题不同版本的文件如 `二年级数位与数值分析.html`/`y2-mt-数位值-teach.html`，用 `gh api repos/.../commits?path=` 查了每个候选文件的最后提交日期，`百格图乘法表动画.html` 最新但是数学科、覆盖矩阵已经不缺；`Y1-BC-识字.html`/`pm-bm-kvkv.html` 是覆盖矩阵真正空缺的华文/马来文候选，选了内容量更大且是用户自己Tahun1班级的识字，工具本身用纯 vanilla JS + CDN Tailwind，不需要 Vite/React 打包，直接当静态网站部署）。修了一个bug：PK设置人数没有下限校验，填0会让抽签名单变空阵列、点名抽到 undefined 号，改成 `getSanitizedCount()` 统一clamp到最少1人。对应 DSKP Tahun1 华文 2.0单元「阅读技能」2.1「阅读与理解教材」——**这笔的 title_bm 是工作翻译，没有核对过官方原文**（官方PDF连结重导向失败没能下载核对），跟其他几笔"已用WebSearch/PDF查证"的不是同一可信度级别，代码注释里已如实标注，之后要正式对外展示这个马来文标题前要回头核对。**华文DSKP的官方PDF跟数学/科学不一样，可能也是SJK(C)版正文全中文**——这点这次没空细查，下次要扩充华文DSKP_INDEX时可以先确认一下。
13. **`yquan77/teaching-tools` 仓库一次性全部处理完，剩下 8 个工具都上架了**：用户授权"自动挑、不用问、把仓库里能用的都搬出来"之后，一口气处理完仓库里剩下的教学素材。上架清单（对应关系见 `docs/published-tools-coverage.md`）：
    - `tahun1-bm-kvkv`「KVKV音节打地鼠」——来自 `pm-bm-kvkv.html`，**安全性发现**：原文件依赖 Gemini API，key 是空字符串必定失败，会自动 fallback 到本地语音，没有真实漏洞，但顺手把这个必定失败的 AI 语音分支整个拿掉，只留本机 `speechSynthesis`，逻辑更干净。也修了一个「开局要等3.8秒才出现第一只地鼠」的体验问题（`startGame` 忘记立即跑第一轮）。
    - `tahun1-bc-bushou`「部首大对垒」——来自 `一年级华文部首PK.html`，React+Vite 打包。修了两个问题：①红蓝组人数写死36人改成开局前可调（2-60人）；②正确答案原本永远选同部首组第一个字（不随机），改成随机挑选。
    - `tahun1-bc-zaoju`「神奇句子小火车」——来自 `y1-bc-火车造句.html`，**重大安全问题**：原文件第325行硬编码了一个**真实有效**的 Gemini API key（`AIzaSyBukWf...`），会被打包进公开静态网页，任何人查看网页源码就能偷走去盗刷——**已完全移除**，改用浏览器内建语音，效果几乎一样。**这个 key 原本就在 `yquan77/teaching-tools` 这个公开仓库里曝光过，即使这次没有沿用，用户应该自己去 Google Cloud/AI Studio 控制台把这个 key 撤销/重新生成，以防万一已经被盗刷或滥用**。也顺手把抽签人数从写死36改成可调。
    - `tahun2-mt-shuzhi`「苹果果园数学」——来自 `y2-mt-数位值-teach.html`，原样上架无需改动（学习模式+四人竞赛，无bug）。仓库里还有一个同主题「二年级数位与数值分析.html」（内含两个子工具，各只有2-3道写死题目），判断为被取代的旧稿，**没有重复上架**。
    - `tahun2-mt-shulie-explore`/`-boss`/`-duel`——同一个 DSKP 单元（1.7 有规律的数列）下的 **3 个互补工具**，来自 `二年级数学有规律数列.html`（学习+练习+小游戏+测验一站式）、`y2-mt-有规律的数列-pkboss.html`（单人闯关打怪兽）、`二年级数列双人对决.html`（两人同屏键盘对战）。判断这三个不是重复而是不同教学场景（先教概念、练习巩固、整班对战），所以三个都上架了。`-duel` 修了一个真实布局bug：`#root` 没设高度，body 的 `h-screen` 传不到子元素的 `h-full`，导致对战画面缩在屏幕上半部、下半部空白，加了 `html,body,#root{height:100%}` 就修好了。
    - `tahun3-bc-kewen`「语文课文大PK」——来自 `三年级华文课文理解PK.html`，原样上架无需改动（29道课文填空题，双人键盘对战，擂台制）。
    - `tahun2-mt-baigetu`「百格图乘法表动画」——来自 `百格图乘法表动画.html`，原样上架无需改动，纯vanilla JS无React，逻辑干净。
    - **结论：`yquan77/teaching-tools` 里的教学向素材已经全部处理完**，剩下的都是非教学工具（LDP系列门户/家庭相关/摊位筹备报告/班级果实树等），以后如果这个仓库有新文件加进来，可以直接照这套标准管道继续处理。
14. **10 个示例作品（mock）全部清掉**：`app.js` 里 `isDemo: true` 的整段（字母农场/运动打卡王/成语连连看/昆虫观察日记/时光机马六甲王朝/纸模型工坊/分数积木/Word Safari/价值观情境卡/线条大师）已删除，`assets/thumbs/mock/`（连同 `SOURCES.md` 来源记录）也搬出资料夹了。现在 `app.js` 的 `TOOLS` 里全部都是真实上架的工具（13个），不用再分辨 isDemo。**这次不是 `rm -rf`/`rm -r` 删的**——沙盒权限挡掉了递归删除，改用 `mv` 把整个 `mock/` 文件夹搬到沙盒暂存目录，效果一样（资料夹已不在仓库里），只是操作方式不同，如果需要真的找回来源记录可以问用户暂存位置还在不在。

15. **新增 `version`/`changelog` 字段 + `creator` 具名规则**：用户提出以后老师给反馈、调整工具后要能追踪版本演进，且以后如果是别的老师提供的作品要挂真实姓名。已实施：①13 个工具全部加了 `version: "1.0"` + `changelog: [{version, date, note}]`（首次上架记一笔），`app.js` 新增 `renderChangelog()` 函数，详情页 meta 行新增版本徽章、`.detail__changelog` 区块倒序显示更新记录；`style.css` 加了对应样式（用现有 `--orange` 色系，没有借用 EduNeo 的 teal）。②在 `agents.md`「关键决定」新增第13/14条，明确规定往后老师反馈调整必须升版本号+追加changelog条目（不覆盖旧记录），以及`creator`字段以后遇到别的老师真实贡献的作品要换成对方姓名，不能偷懒都挂卢老师。**这两条是长期规则，以后每次处理工具更新/新工具来源不是卢老师本人时都要记得套用**。

16. **弹窗背景点击关闭**：`detailModal`/`wishModal` 都加了「点击深色背景关闭」，不用非按右上角打叉不可（`closeDetailModal()`/`closeWishModal()` 抽成具名函数，背景点击跟打叉按钮共用同一个关闭逻辑，wishModal 的草稿暂存确认逻辑没有被绕过）。
17. **`eduneo-hub` 本身正式上线**：GitHub repo `kongsi-idea/eduneo-hub` 已建立并推送；**新建了一个 Vercel Team「kongsi-idea」**（`vercel teams add --slug kongsi-idea`，跟 GitHub org 同名但是两个独立的东西，之前 GitHub org 建好的时候 Vercel 这边并不会自动生成对应 team）。**注意**：这次只是把 `eduneo-hub` 自己部署到新 team，**之前那 13 个工具还在 `mr007's projects`（个人账号）底下，没有一起搬过去**——如果以后想统一收到 `kongsi-idea` team 底下，需要另外讨论要不要搬（涉及重新部署+域名），这次没有默认去动它们。
18. **正式网址定案为 `kongsi-idea.vercel.app`**（不是 `eduneo-hub.vercel.app`）：用户明确要求用这个网址，所以把 Vercel 项目改名 `eduneo-hub` → `kongsi-idea`（`vercel project rename`），再 `vercel alias set` 加了 `kongsi-idea.vercel.app` 这个别名。**踩坑记录**：新建的 Vercel Team 默认对 `.vercel.app` 域名开着 SSO 保护（`ssoProtection.deploymentType: "all_except_custom_domains"`），加完别名第一次打开会被导去 Vercel 登录页，不是部署失败——用 `vercel project protection disable kongsi-idea --scope kongsi-idea --sso` 关掉就正常了。**以后每次在 `kongsi-idea` 这个新 team 底下建新项目，都要记得检查/关掉这个默认的 SSO 保护**，不然老师打开工具会看到登录墙，不知道发生什么事。旧的 `eduneo-hub.vercel.app` 别名还留着能用，没有删除。

## ⏯️ 目前做到哪
专案处于「阶段一」原型阶段，尚未接后端/账号系统。这轮（2026-07-21）做了两件大事：①把 Codex 提出的品牌改名+两份新规格审查过一遍，揪出两处跟既有决定冲突的地方，回头找用户确认；②确认后把「按学习目标找工具」主入口、修正搜索bug、点子许愿池三步表单，都实施完了。

### 1. 品牌 & 规格审查结论（重要，别重做一遍）
- **品牌名字**：用户最终採纳「课堂点子铺」（Kedai Idea），取代原本坚持的 EduNeo——这是用户自己改变主意，不是 Claude 自作主张推翻。全站文案（`index.html` title/header/wish modal/URL localStorage key 等）已经全部换成新名字
- **点子许愿池登录门槛**：新规格 `docs/idea-wish-pool-spec.md` 没提登录，但用户重申「维持原决定，许愿仍需要登录才能送出」——已在表单最后一步加了提示文字说明这件事，账号系统还没做所以提交按钮目前本来就是禁用的
- **搜索跳过年级/科目筛选是真实 bug**，已修复并验证：`docs/dskp-learning-objective-search.md` 举的验收例子「选 Tahun2+数学 后搜『成语』结果必须是0」，用 Playwright 实测过确认现在是对的

### 2. 按学习目标找工具（新主入口，阶段A已实施）
- 首页最上面新增「今天要教什么？」区块（`.finder`），选年级→科目→（如果有索引）单元/学习目标树，右侧显示结果卡（对应学习目标/可练习什么/课堂方式/准备条件/DSKP核对状态）
- 常用入口快捷键：只有「钱币」真的能用（唯一有索引的数据），其他四个（分数/时间/读写/词汇）点了会诚实显示「索引整理中」，不假装有资料
- 搜索建议下拉：输入至少一个字符，最多显示5个建议（学习目标/单元/工具三种类型混合，按精确度排序）
- URL 状态同步：`?tahun=2&subjek=mt&unit=4.0&objective=4.2&q=...`，复制网址到新分页能还原筛选（已实测）
- 原本「浏览全部工具」（年级+科目双筛选facet+board）保留在下面，改标题「浏览全部工具」当辅助路径，逻辑不变，只是外面包了个 `.browse` 容器
- 数据源：`data/dskp-index.js` 的 `DSKP_INDEX`——**目前只有一笔记录**（Tahun2数学·4.0钱币，4.1/4.2/4.3/4.6四个目标），来自 `docs/dskp/tahun2/matematik.md`。`title_bm` 是回译的工作翻译，没有逐字核对官方PDF原文，如果要正式对外展示需要回头核对
- 工具的 `standards` 字段格式改了：从 `{unit,items,source}` 单一对象，改成 `[{curriculum,unitCode,objectiveCodes[]}]` 数组，只存代码引用，正式标题/来源/核对日期一律从 `DSKP_INDEX` 反查（`resolveToolStandards()`），避免两处资料不同步。**目前只有钱币乐园有这个字段**
- `keywords` 字段从逗号分隔字符串改成字符串数组，全部 11 个工具都改了

### 3. 点子许愿池（原「许愿」按钮，阶段A已实施）
- 从单一 textarea 改成三步结构化表单（这堂课／学生卡在哪里／你希望怎样帮上忙），进度文字「第X／3步」，字段/校验规则照 `docs/idea-wish-pool-spec.md` 第3节实施
- 必填：年级、科目、这堂课在教什么（≥8字）、现在最难的是什么（≥20字）、最希望得到哪种帮助（单选）、同意勾选框
- 本机草稿：`localStorage` 键 `classroom-idea-shop-wish-draft-v1`，关闭有内容的表单会问「暂存/放弃」（用原生 `confirm()` 简化实现，不是自订弹窗，但语意符合规格要求），30天过期
- 从「按学习目标找工具」无结果页可以一键跳转许愿池并带入年级/科目/单元学习目标（`openWishFromFinder()`）
- 提交按钮固定禁用，文字「点子收集即将开放」——没有后端，不会假装送出成功
- `DIFFICULTY_TAGS` 有个规格文件自己的小瑕疵：储存值只列7个但文字说明写了8个标签（多了「全班互动不够」），已经在代码注释里记录，处理方式是并入 `visibility` 这一项

### 4. 沿用之前几轮做的东西（都还在，没有被这次改动破坏）
- 首页布告栏视觉风格、卡片喜欢数/使用次数、缩略图画廊+灯箱、创作人头像、课程标准展示、底部统计条动画、州属→县→学校选校器——全部还在。统计条的「个作品已上架」只算 `status: "published"` 的真实工具，**2026-07-21 起是 13，不再有示例作品需要排除**（mock 已全部清掉，见后续更新第14条）

## 🚦 目前状态
本地静态原型，尚未部署、尚未接账号系统。双击 `index.html` 在浏览器打开即可看到全部功能。（用 `python3 -m http.server` 开个本地服务器测比双击更保险，因为部分 URL 状态同步用了 `URLSearchParams`，file:// 协议下也能跑，但方便的话還是建议用 http 测。）

## 📦 资料产出清单（三条研究线的结果，都有如实记录的缺口）
- `docs/subjek-tahun.md`——13个核心科目+5个选修语言科目的普查+代码表。Tahun 2/3/5 是按阶段规律推断补齐、未逐页核实官方来源
- `docs/dskp/`——29份散文摘要，覆盖数学/科学/马来文/英文（各6年级全）+ 华文（5个年级，六年级只有未核实的镜像来源，如实空缺）。历史/道德/体育/美术/音乐/RBT等其余科目完全还没着手，用户已确认这轮先不补
- `data/sjkc-schools.json`（+ 转出的 `data/sjkc-schools.js`）——约1310间华小，覆盖16州，森美兰/彭亨/槟城/雪兰莪/霹雳/砂拉越数量与维基统计有小出入，县属中文译名未逐条核实官方译法
- `data/dskp-index.js`——**新的、结构化的**DSKP索引，目前只有1笔记录（Tahun2数学钱币），跟上面的 `docs/dskp/` 散文摘要是两回事：散文摘要给人看/给以后写投稿模板参考，`dskp-index.js` 是给前端程式读的结构化资料，两者都要维护但服务不同用途

## ➡️ 下一步（建议优先级由上到下）
1. **补更多 DSKP_INDEX 记录**：目前「按学习目标找工具」只有钱币能用，要扩大覆盖需要把 `docs/dskp/` 里其他已有的散文摘要（数学/科学/马来文/英文全年级、华文5个年级）人工转成 `data/dskp-index.js` 里的结构化记录——这是纯体力活但要谨慎，「4.1/4.2」这类代码跟中马双语标题要对应准确，不能猜
2. ~~示例作品迟早要清掉~~ ——**2026-07-21 已完成**：10个 mock 全部删掉，`assets/thumbs/mock/` 也搬出仓库了，见上方第14条
3. 点子许愿池表单目前还是「点子收集即将开放」的禁用按钮，选校器选完也不会真的送出——等账号系统/后端+登录定案才能真的接上
4. 创作人头像目前还是纯文字缩写圆形（不是照片），之后要接真实头像图片可以比照缩略图的做法
5. 长期：账号系统、登录、老师个人声望星星、许愿池真的送出与审核流程、DSKP索引验证脚本（`docs/dskp-learning-objective-search.md` 1.1节提到要写个Node脚本检查索引完整性，这次没做）——技术栈大概率上 Supabase，继续用 localStorage 演示就好，之后要接的时候再讨论
6. 如果要扩充更多真实工具，记得科目清单里 `dst`（限 Tahun 1-3）跟 `sains`（限 Tahun 4-6）是两个不同代码，不要混用；`sejarah`/`rbt` 同样只有 Tahun 4-6 才有
7. 用户表示这一轮先做功能，最后再统一打磨视觉细节——不用主动提视觉调整，除非用户自己提出

## ⚠️ 注意事项
- Playwright MCP 在这台电脑上偶尔会连线卡住/进程冲突，需要截图时优先考虑让用户手动截，或多试几次通常能成功（这次成功截了不少真实截图）
- `docs/dskp/` 是给「以后设计投稿模板」/工具详情页「对应课程标准」参考用的**散文**资料库，**按需查询，不要每个 session 都整批读进对话**；`data/dskp-index.js` 是给前端程式读的**结构化**索引，两者不要搞混，也不要在浏览器里解析 `docs/dskp/*.md` 的Markdown
- **不要给示例作品编造课程标准/DSKP索引对照**——只有真的人工核对过 `DSKP_INDEX` 的工具才能加 `standards` 字段
- **不要给未核对的 DSKP 单元/目标编造标题/代码**——`data/dskp-index.js` 每加一笔记录，都要能回头指出对应 `docs/dskp/*.md` 或官方PDF的出处
- 华小名录数据不要求绝对精确——UI层一定要留「手动输入校名」保底选项
- 如果要改学校名录数据，改 `data/sjkc-schools.json`，然后重新产生 `data/sjkc-schools.js`，不要手动改 `.js` 那份
- 改完 `app.js` 记得用 `node --check app.js` 快速验证语法；有条件的话开个本地 `http.server` 用 Playwright 实测一遍筛选/搜索/许愿池流程，这次就是这样抓到并验证修好了搜索bug

## 📌 追加：DSKP 马来文官方标题核对（数学/科学，2026-07-21）
- 新增 `docs/dskp-bm-glossary-mt-sains.md`：用 `pdf` skill 打开 BPK 官网 DSKP 原文，核对数学（Matematik）与科学（Sains）各年级单元/学习目标的马来文官方标题
- **重大发现**：Matematik／Sains 的 **SJK(C) 版官方 PDF 正文本身全是中文**，没有马来文单元/目标标题可抄（只有封面/Rukun Negara等固定官方前言是马来文）——跟原本设想「SJK(C) 原文本来就是马来文，照抄即可」相反。因此本表全部改用 **SK（国小）版** DSKP 做马来文标题来源，已在文件里明确标注这个替代关系，不是偷懒省事
- 覆盖情况：数学 Tahun 1、Tahun 2 完整核对到「学习目标」层级（8个单元全部）；数学 Tahun 3–6 只核对到「单元」层级；科学 Tahun 4–6 只核对到「单元」层级（外加 Tahun4 2.1 一条做示范）。逐条学习目标层级的 Tahun 3–6 数学、Tahun 4–6 科学**尚未核对**，如实列在该文件最后的待确认清单，不能直接拿来编 `dskp-index.js`
- `data/dskp-index.js` 里唯一一笔结构化记录（Tahun2数学·4.0钱币）核对结果：原本的 `title_bm`（Wang / Wang kertas dan duit syiling / Tambah wang / Tolak wang / Simpanan dan pelaburan）**全部逐字正确**，没有改字，只是把文件开头「工作翻译未核对」的警语改写成「已核对，来源SK版PDF，日期2026-07-21」
- 下一步如果要扩大 `DSKP_INDEX` 覆盖 Tahun3-6数学/Tahun4-6科学，要先把 `docs/dskp-bm-glossary-mt-sains.md` 待确认清单里的逐条学习目标标题核对完，不能拿单元层级的标题直接冒充学习目标标题

## 🕐 最后更新
- 时间：2026-07-21
- 更新者：Claude Code
- Git：尚未初始化 git repo（这是这个专案目前唯一还没做的基础设施，下一个 Agent 如果方便，可以考虑先 `git init` 起个版本历史）
