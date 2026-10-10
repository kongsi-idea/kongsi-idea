// 正式科目代码表，来自科目普查任务的产出 docs/subjek-tahun.md（查证日期 2026-07-21）
// dst 限 Tahun 1-3（科学与科技世界，尚未拆分），sains/sejarah/rbt 限 Tahun 4-6，其余科目 Tahun 1-6 皆有
const TAHUN = [1, 2, 3, 4, 5, 6];

const SUBJECTS = [
  { code: "bm", title_zh: "马来文", title_bm: "Bahasa Melayu", badge: "BM" },
  { code: "bi", title_zh: "英文", title_bm: "Bahasa Inggeris", badge: "BI" },
  { code: "bc", title_zh: "华文", title_bm: "Bahasa Cina", badge: "BC" },
  { code: "mt", title_zh: "数学", title_bm: "Matematik", badge: "MT" },
  { code: "dst", title_zh: "科学与科技世界", title_bm: "Dunia Sains dan Teknologi", badge: "DST" },
  { code: "am", title_zh: "Alam dan Manusia", title_bm: "Alam dan Manusia", badge: "AM" }, // KP2027 新课程（一年级起），官方中文译名未核对，暂用马来文原名
  { code: "sains", title_zh: "科学", title_bm: "Sains", badge: "SA" },
  { code: "sejarah", title_zh: "历史", title_bm: "Sejarah", badge: "SJ" },
  { code: "rbt", title_zh: "设计与工艺", title_bm: "Reka Bentuk dan Teknologi", badge: "RBT" },
  { code: "islam", title_zh: "伊斯兰教育", title_bm: "Pendidikan Islam", badge: "PI" },
  { code: "moral", title_zh: "道德教育", title_bm: "Pendidikan Moral", badge: "PM" },
  { code: "seni", title_zh: "视觉艺术教育", title_bm: "Pendidikan Seni Visual", badge: "SV" },
  { code: "muzik", title_zh: "音乐教育", title_bm: "Pendidikan Muzik", badge: "MZ" },
  { code: "pjpk", title_zh: "体育与健康教育", title_bm: "Pendidikan Jasmani dan Pendidikan Kesihatan", badge: "PJ" },
];
const SUBJECT_BY_CODE = Object.fromEntries(SUBJECTS.map((s) => [s.code, s]));

// 每个工具都直接带 tahun + subjek，同一个年级/科目底下以后会有很多个工具，
// 不再是「一个年级x科目只能对应一张卡」——分类靠下面的年级/科目筛选条来做交集，不是靠卡片数量固定
//
// status: "published" | "planned" | "archived" —— 只有 published 且有 url 的工具才计入
// 「按学习目标找工具」结果与「个作品已上架」统计（docs/dskp-learning-objective-search.md 第2.7条）。
// 2026-07-21：原本用来撑版面的 10 个示例作品（isDemo: true）已全部清掉，
// 现在 TOOLS 里全部都是真实上架的工具，不再需要区分 isDemo。
const TOOLS = [
  {
    slug: "tahun4-bi-writing",
    tahun: 4,
    subjek: "bi",
    status: "published",
    title_zh: "Story Quest · Sentence Workshop",
    title_bm: "故事任务：句子工坊",
    desc: "Year 4 guided English writing quest. Look at a picture to find the requirements, choose a story idea, match reasons with details, then combine five sentences into one paragraph. When finished, check the model text, then handwrite your own 40–50 word story and send a photo to the teacher for marking.",
    keywords: ["Story Quest", "Sentence Workshop", "guided writing", "writing", "paragraph", "story", "英文写作", "句子", "段落", "四年级", "Bahasa Inggeris"],
    url: "https://tahun4-bi-writing.vercel.app",
    type: "写作闯关",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "0.3.0",
    changelog: [
      { version: "0.3.0", date: "2026-09-15", note: "正式上架：独立 Vercel 部署 + 纸本作业拍照投稿（私有审核，老师批准前不公开）" },
      { version: "0.3.0", date: "2026-09-15", note: "完成本机验收；等待独立 Vercel 最终网址后上架" },
    ],
    thumbnails: [{ img: "assets/thumbs/tahun4-bi-writing/home.png", label: "Story Quest 首页" }],
    standards: [], // DSKP 搜索索引尚未收录 Tahun 4 BI，确认索引资料后再启用。
    practiceSummary: "Develop story ideas from pictures and prompts, match reasons with details, and assemble five sentences into a paragraph of about 40–50 English words",
    teachingMode: ["Individual practice", "Teacher guidance", "Pen-and-paper writing"],
    prep: "Ideally one device per student for the first seven levels; finish the last step by handwriting on paper. Uploaded photos of homework are private by default and count as complete only after the teacher approves them.",
  },
  {
    slug: "tahun2-bi-punctuation",
    tahun: 2,
    subjek: "bi",
    status: "published",
    title_zh: "Sentence Train",
    title_bm: "句子小火车",
    desc: "Year 2 English punctuation practice for a common mistake: putting a full stop after a question. Each word is a carriage, capital letters are the engine, and the end punctuation is the last carriage. Level 1 \"Asking or Telling?\": sentences appear in all lowercase with no punctuation; choose a question mark or a full stop. A wrong answer lights up the first carriage and swaps carriages to show he is → is he. Every sentence is read aloud, and rising intonation is a clue too. Level 2 \"Fix the train\": tap the first letter to capitalise it, tap the last carriage to choose a full stop or question mark, and fix the whole sentence. Names and I are capitalised too. Each question is paired with a statement that differs only in word order, mixed together, so guessing by reflex will not work. Bank of 24 pairs (48 sentences) covering Unit 6–9 themes (clothes, home, body, holidays, habitats) and capital-letter practice (names, days, countries, capital I inside a sentence). Choose \"whole-class projection\" or \"self-practice\"; at the end the wrong answers are listed and can be practised again.",
    keywords: ["标点", "问号", "句号", "大写", "问句", "陈述句", "punctuation", "question mark", "full stop", "capital letter", "二年级", "英文", "Bahasa Inggeris", "Year 2", "Superminds", "writing"],
    url: "https://tahun2-bi-punctuation.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "Teacher Irene Wong", initial: "W" },
    version: "1.1",
    changelog: [
      { version: "1.1", date: "2026-10-10", note: "按 Irene 老师反馈：句中大写词（人名 Mei Ling 两个词、星期、国家、句中的 I）整节车厢亮金色；车尾标点不再单独掉到下一行；题库 17→24 对（48 句），新增 I 在句中（My brother and I…／On Fridays I…）、星期（Sundays/Fridays…）、国家（Japan/Malaysia），每回合保证出现" },
      { version: "1.0", date: "2026-10-10", note: "首次上架：两关（Asking or Telling? ／ Fix the train）× 两种模式（全班投影／自己练），17 对句子预录英文朗读，错题可再练" },
    ],
    // 缩图：2026-10-10 用 Playwright 实际操作正式网址 https://tahun2-bi-punctuation.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-bi-punctuation/v1-1-home.png", label: "首页：大写 I 变火车头、句点接成车尾；可选全班投影或自己练" },
      { img: "assets/thumbs/tahun2-bi-punctuation/v1-2-ask-tell.png", label: "关 1：看句子选「问」或「说」，答对后车头大写、车尾接上标点" },
      { img: "assets/thumbs/tahun2-bi-punctuation/v1-1-swap.png", label: "关 1 答错：句首车厢亮起，车厢换位演示 Mei Ling is → Is Mei Ling；人名整节亮金色" },
      { img: "assets/thumbs/tahun2-bi-punctuation/v1-1-fix-I.png", label: "关 2：点字母变大写、点车尾选标点；句中的 I 也要大写，亮金色" },
    ],
    standards: [], // DSKP 搜索索引尚未收录 Tahun 2 BI；对照见 docs/dskp/tahun2/bahasa-inggeris.md：4.3.1（延伸 4.2.1）
    practiceSummary: "Decide whether a sentence is a question or a statement and use the correct question mark or full stop at the end; capitalise the first word of a sentence, names, days, countries and the word I (DSKP Year 2 BI 4.3.1, extended 4.2.1)",
    teachingMode: ["Classroom projection", "Individual practice"],
    prep: "Open and use; no login or class code needed. Turn the sound on (sentences are read aloud). The question bank is written to match the Unit 6–9 themes and is not copied line by line from the textbook; progress is not saved.",
  },

  {
    slug: "tahun1to6-drone", tahun: 1, subjek: "mt", status: "published",
    coverage: [
      { tahun: 1, subjects: ["mt", "dst", "bm", "bi", "bc"] },
      { tahun: 2, subjects: ["mt", "dst", "bm", "bi", "bc"] },
      { tahun: 3, subjects: ["mt", "dst", "bm", "bi", "bc"] },
      { tahun: 4, subjects: ["mt", "sains", "bm", "bi", "bc", "sejarah"] },
      { tahun: 5, subjects: ["mt", "sains", "bm", "bi", "bc", "sejarah"] },
      { tahun: 6, subjects: ["mt", "sains", "bm", "bi", "bc", "sejarah"] },
    ],
    title_zh: "飞学竞场", title_bm: "Arena Terbang Ilmu",
    desc: "一至六年级的无人机飞行答题游戏。先试飞，再选择年级与学科；思考后跟着选项箭头飞进答案环。当前为试用题库。",
    keywords: ["drone", "ilmu", "无人机", "飞行", "跨学科", "综合", "答题", "科学", "数学", "国文", "英文", "华文", "历史"],
    url: "https://tahun1to6-drone.vercel.app", type: "游戏", stars: 0, creator: { name: "卢老师", initial: "卢" },
    version: "0.4", changelog: [
      {version:"0.4",date:"2026-09-14",note:"新增班级排行榜（网址带班级代码才会启用，选完名字后主画面出现「班级排行榜」按钮，穿环竞速/答题竞速分开两张榜）"},
      {version:"0.3",date:"2026-09-14",note:"飞行试炼、跨学科选择与答案方向箭头；首次部署上线"},
    ],
    thumbnails: [{ img: "assets/thumbs/tahun1to6-drone/trial.png", label: "五段飞行试炼" }], standards: [],
    practiceSummary: "飞行操控与跨学科选择题", teachingMode: ["个人练习"], prep: "手机横屏或电脑；需要网络；题库为待审起始包，正式课堂使用前建议教师先核对内容；班级排行榜需要网址带 kelasku 班级代码才会出现",
  },
  {
    slug: "tahun2-mt-wang",
    tahun: 2,
    subjek: "mt",
    status: "published",
    title_zh: "钱币乐园",
    title_bm: "Taman Wang",
    desc: "确认币值、钱币组合拖拽、课堂抽签三合一的大荧幕互动工具，纸币/硬币大小都依真实马币比例换算。",
    keywords: ["钱币", "二年级", "数学", "拖拽", "抽签", "wang", "money", "找零钱"],
    url: "https://tahun2-mt-wang.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 缩略图数量决定详情页的排版：1张=整幅铺开，2张=左右对分，4张=2x2
    // 这 4 张是用 Playwright 实际操作 https://grade2-math-tools.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-mt-wang/confirm-value.png", label: "确认币值" },
      { img: "assets/thumbs/tahun2-mt-wang/combo.png", label: "钱币组合" },
      { img: "assets/thumbs/tahun2-mt-wang/duo.png", label: "双人对垒" },
      { img: "assets/thumbs/tahun2-mt-wang/lottery.png", label: "抽签" },
    ],
    // 对应课程标准：只存代码引用，正式标题/来源/核对日期一律从 data/dskp-index.js 的 DSKP_INDEX 读取
    // （见 docs/dskp-learning-objective-search.md 第1.2/6节），避免两处资料各自维护、慢慢不同步
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "4.0", objectiveCodes: ["4.1", "4.2", "4.3", "4.6"] },
    ],
    practiceSummary: "两个/三个币值相加、找零钱、用纸币硬币组成指定金额",
    teachingMode: ["投影互动", "全班或小组", "双人对垒"],
    prep: "打开即用，不需要打印，不需要学生设备",
  },

  {
    slug: "tahun1-mt-bundar",
    tahun: 1,
    subjek: "mt",
    status: "published",
    title_zh: "近似值特快车",
    title_bm: "Ekspres Pembundaran",
    desc: "0–100 号站的骰子棋盘游戏，走到非整十号站要答对十位近似值才能滑向正确的站，答错倒退一格；队伍数量与队名可在开局前自订，2–8 组都能玩。",
    keywords: ["近似值", "十位近似值", "一年级", "数学", "取整", "bundar", "pembundaran", "puluh terdekat", "棋盘游戏"],
    url: "https://tahun1-mt-bundar.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun1-mt-bundar.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-mt-bundar/1-setup.png", label: "开局设定：队伍数量与队名可调整" },
      { img: "assets/thumbs/tahun1-mt-bundar/2-board.png", label: "0-100 棋盘" },
      { img: "assets/thumbs/tahun1-mt-bundar/3-question.png", label: "十位近似值挑战" },
      { img: "assets/thumbs/tahun1-mt-bundar/4-after-answer.png", label: "答对后换下一队" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "1.0", objectiveCodes: ["1.8"] },
    ],
    practiceSummary: "整数取十位近似值（0-100范围内）、理解近似值可能比原数大也可能比原数小",
    teachingMode: ["投影互动", "分组比赛"],
    prep: "打开即用，不需要打印，不需要学生设备，开局前可现场调整组数与队名",
  },

  {
    slug: "tahun1-mt-pecahan",
    tahun: 1,
    subjek: "mt",
    status: "published",
    title_zh: "燕菜切切乐",
    title_bm: "Potong Agar-agar: Perdua dan Perempat",
    desc: "在娘惹糕点铺的大理石桌上，用鼠标或手指在燕菜上划一条线就能切开，切开会抖。「分给朋友」要把燕菜分给 2 或 4 位动物朋友，切歪了照样分下去——拿到小块的朋友会说「我的比较小…」，让孩子亲眼看到「不一样大就不是几分之一」。「燕菜铺开张」有 10 位客人：先切成一样大再拿几块给客人、看盘上虚线空位说出拿走了几分之几、判断亮起的那块是不是四分之一（含切不等分的陷阱题），成绩上班级排行榜。「自由切」给老师示范，可关掉「帮手刀」故意切歪。全程有预录的真人感朗读。",
    keywords: ["分数", "几分之几", "二分之一", "四分之一", "四分之二", "四分之三", "等分", "一年级", "数学", "pecahan", "perdua", "perempat", "pecahan wajar", "燕菜", "agar-agar", "切蛋糕", "排行榜"],
    url: "https://tahun1-mt-pecahan.vercel.app",
    type: "游戏",
    hasLeaderboard: true,
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-09-29", note: "首次上架：分给朋友 5 关、燕菜铺开张 10 位客人（接班级名单与排行榜）、自由切；预录人声朗读；手机竖屏／横屏版面" },
    ],
    // 这 5 张是用 Playwright 实际操作 https://tahun1-mt-pecahan.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-mt-pecahan/1-home.png", label: "娘惹糕点铺首页：点燕菜会抖" },
      { img: "assets/thumbs/tahun1-mt-pecahan/2-share-unfair.png", label: "切歪了照样分：拿到小块的朋友会不高兴" },
      { img: "assets/thumbs/tahun1-mt-pecahan/3-share-fair.png", label: "切成 4 块一样大，每人得到四分之一" },
      { img: "assets/thumbs/tahun1-mt-pecahan/4-shop-order.png", label: "燕菜铺：客人要四分之三，拿 3 块进打包盒" },
      { img: "assets/thumbs/tahun1-mt-pecahan/5-shop-isit.png", label: "陷阱题：4 块不一样大，所以不是四分之一" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.1", "3.2"] },
    ],
    practiceSummary: "用切燕菜建构二等份、四等份的真分数（1/2、1/4、2/4、3/4）；分辨「一样大才是几分之几」；解决分给朋友、客人点单的日常分数问题",
    teachingMode: ["投影互动", "教师带教/演示", "个人自学"],
    prep: "打开即用，不需要打印；电脑用鼠标划线、平板／一体机／手机用手指划线都可以。有声音朗读（建议开喇叭）。「燕菜铺开张」会请学生点自己的名字上班级排行榜（网址带 ?code= 班级代码，或当访客自己写名字）；老师示范用「自由切」，可关掉「帮手刀」故意切歪给全班看",
  },

  {
    slug: "tahun1-mt-ruang",
    tahun: 1,
    subjek: "mt",
    status: "published",
    title_zh: "空间小天地",
    title_bm: "Ruang: Bentuk Tiga Dimensi dan Dua Dimensi",
    desc: "一年级「空间」单元的 3D 教学工具，可拖拽自由旋转。立体图形：六种立体，按「面／边／顶点」一个个圈出来报数，另有生活物品配对立体。平面图形：数直线边、顶点、曲线。模式排列：只比形状，一行从左到右读，按「为什么」框出重复的一组，老师也能自己出题。创意图案：拼平面图案、搭立体模型，三级小挑战（数图形、补对称、照样拼）。延伸：五种立体的展开图（正方体 11 种），看它站着打开、合起；还有「能折成正方体吗？」与「盖印章」小乐趣。每个模块都有「老师讲解」（先猜后揭晓）和「自己练习」（点选作答）两种模式。",
    keywords: ["空间", "立体图形", "平面图形", "长方体", "正方体", "圆锥体", "正方棱锥体", "圆柱体", "球体", "正方形", "长方形", "三角形", "圆形", "面", "边", "顶点", "曲线", "模式排列", "规律", "创意图案", "展开图", "3D", "一年级", "数学", "ruang", "bentuk 3D", "bentuk 2D", "bucu", "sisi", "permukaan", "pola", "bentangan"],
    url: "https://tahun1-mt-ruang.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-10-08", note: "首次上架：立体图形、平面图形、模式排列、创意图案，延伸展开图（5 种立体）与盖印章；老师讲解／自己练习两种模式；电脑、投影、手机竖屏版面" },
    ],
    // 这 5 张是用 Playwright 实际操作 https://tahun1-mt-ruang.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-mt-ruang/v1-0-1-home.png", label: "首页：立体图形、平面图形、模式排列、创意图案、展开图、盖印章" },
      { img: "assets/thumbs/tahun1-mt-ruang/v1-0-2-vertex.png", label: "长方体：点「顶点」一个个圈出来报数，共 8 个" },
      { img: "assets/thumbs/tahun1-mt-ruang/v1-0-3-net.png", label: "展开图：正方体站着一层层打开" },
      { img: "assets/thumbs/tahun1-mt-ruang/v1-0-4-pattern.png", label: "模式排列：按「为什么」框出重复的一组" },
      { img: "assets/thumbs/tahun1-mt-ruang/v1-0-5-create.png", label: "创意图案：用圆柱体和圆锥体搭出火箭" },
    ],
    // standards 暂不填：7.0 空间的马来文 DSKP 官方用词还没核对官方 PDF，不编造课程对照（对应 DSKP 7.1／7.2／7.3，见 published-tools-coverage.md）
    standards: [],
    practiceSummary: "说出六种立体与四种平面图形的名称；数立体的面、边、顶点与平面图形的直线边、顶点、曲线；依形状规律排列；用平面图形创作图案、用立体组合新模型；解决空间相关的数数与配对问题",
    teachingMode: ["投影互动", "教师带教/演示", "个人自学"],
    prep: "打开即用，不需要打印。Google Meet 共享屏幕、课室投影／一体机、学生在家用手机或电脑都可以。老师上课用「老师讲解」（名称和数量先藏起来，问完再揭晓）；学生自学切到「自己练习」（点选作答，不计分）。电脑有键盘快捷键：空白键揭晓、←→ 换下一个、R 复位视角",
  },

  {
    slug: "tahun4-mt-nombor",
    tahun: 4,
    subjek: "mt",
    status: "published",
    title_zh: "数学知识大比拼",
    title_bm: "Pertandingan Ilmu Matematik",
    desc: "输入学生总人数后现场抽签，两位学生分屏对战：读数、数位、数值、比大小、数列五种题型随机出现，先答对指定题数获胜，赢家可留下继续守擂。",
    keywords: ["数值", "数位", "读数", "比大小", "数列", "四年级", "数学", "nombor", "nilai nombor", "PK", "对战"],
    url: "https://tahun4-mt-nombor.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun4-mt-nombor.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun4-mt-nombor/1-setup.png", label: "开局设定：学生人数与获胜题数" },
      { img: "assets/thumbs/tahun4-mt-nombor/2-ready.png", label: "抽签对战准备" },
      { img: "assets/thumbs/tahun4-mt-nombor/3-playing.png", label: "分屏答题" },
      { img: "assets/thumbs/tahun4-mt-nombor/4-winner.png", label: "获胜结算" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "1.0", objectiveCodes: ["1.1"] },
    ],
    practiceSummary: "100000以内数目的读法、数位与数值分析、比较大小、完成顺逆序数列",
    teachingMode: ["投影互动", "双人对战"],
    prep: "打开即用，不需要打印，不需要学生设备，开局前输入班上人数即可现场抽签",
  },

  {
    slug: "tahun1-bc-shizi",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "识字大对决",
    title_bm: "Pertarungan Mengecam Aksara",
    desc: "覆盖一年级华文全年22个单元+5个识字复习单元的教材词汇（自动标注拼音）。两种模式：闪卡认读给学生自学巩固，PK进化赛让两班对抗、随机抽签点名，后段自动进入「进化」加速加倍得分阶段。",
    keywords: ["识字", "写字", "拼音", "词语", "一年级", "华文", "PK", "对战", "闪卡"],
    url: "https://tahun1-bc-shizi.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun1-bc-shizi.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-shizi/1-landing.png", label: "首页：闪卡 / PK 两种模式" },
      { img: "assets/thumbs/tahun1-bc-shizi/2-flashcard.png", label: "闪卡认读（自动标注拼音）" },
      { img: "assets/thumbs/tahun1-bc-shizi/3-pk-battle.png", label: "PK 对战：抽签点名+倒计时" },
      { img: "assets/thumbs/tahun1-bc-shizi/4-pk-score.png", label: "答对得分" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "2.0", objectiveCodes: ["2.1"] },
    ],
    practiceSummary: "认读教材中的汉字词语、掌握词义、正确认读拼音",
    teachingMode: ["投影互动", "个人自学", "两班对战"],
    prep: "打开即用，不需要打印，不需要学生设备；PK模式开局前输入两班人数即可现场抽签点名",
  },

  {
    slug: "tahun1-bc-bishun",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "一年级写字",
    title_bm: "Menulis Aksara Tahun 1",
    desc: "一年级华文 282 个习写生字，按 22 个单元 + 5 个识字单元分类。每个字三步：看笔顺动画（演示完自动读出字音，也能按「听读音」重听）→ 沿淡线描 → 盖住凭记忆写，写对得一颗星，整个单元写完盖朱砂「优」印章；每单元另有随机抽字的小考。笔画数据离线打包，学校网络慢也能用。网址带班级代码时读班级名单让学生选自己的名字、记录个人进度并可跨电脑接续。",
    keywords: ["写字", "笔顺", "笔画", "习写生字", "田字格", "描红", "读音", "一年级", "华文", "识字", "个人练习", "电脑室"],
    url: "https://tahun1-bc-bishun.vercel.app",
    type: "练习",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.3",
    changelog: [
      { version: "1.3", date: "2026-09-11", note: "修多音字读音错误：田字格上方标注拼音，听读音/自动读音改读「字，词」而非孤字，逼出正确读音" },
      { version: "1.2", date: "2026-09-09", note: "修「输班级代码后要 refresh 才出名单」" },
      { version: "1.1", date: "2026-09-09", note: "字体换成全字库覆盖（生僻姓名不再缺字）；名称改为「一年级写字」；笔顺演示完自动读字音 + 「听读音」按钮" },
      { version: "1.0", date: "2026-09-09", note: "首次上架" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun1-bc-bishun.vercel.app 截的真实画面（选名字页用示范名单，非真实学生）
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-bishun/1-names.png", label: "选名字：接班级名单，学生点自己的名字" },
      { img: "assets/thumbs/tahun1-bc-bishun/2-units.png", label: "选单元：27 个单元，进度看得见" },
      { img: "assets/thumbs/tahun1-bc-bishun/3-watch.png", label: "看一看：笔顺动画一笔一笔演示" },
      { img: "assets/thumbs/tahun1-bc-bishun/4-done.png", label: "写一写：凭记忆写对，盖朱砂「优」印章" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.1"] },
      { curriculum: "KSSR Semakan 2017", unitCode: "5.0", objectiveCodes: ["5.1"] },
    ],
    practiceSummary: "在田字格上按正确笔画笔顺书写正楷，认识笔画与汉字结构",
    teachingMode: ["电脑室个人练习", "个人自学"],
    prep: "电脑室个人练习工具，一人一台或两人轮流，用滑鼠描字，不需打印。网址加班级代码（例如 ?code=JBC1037-1I）→ 读班级名单让学生选名字、记录个人进度、换电脑登入同名字可接回；不加代码则手动输入名字、进度只存本机。",
  },

  {
    slug: "tahun2-bc-bishun",
    tahun: 2,
    subjek: "bc",
    status: "published",
    title_zh: "二年级写字",
    title_bm: "Menulis Aksara Tahun 2",
    desc: "二年级华文 234 个习写生字，按 22 个单元 + 5 个识字单元分类。每个字三步：看笔顺动画（演示完自动读出字音，也能按「听读音」重听）→ 沿淡线描 → 盖住凭记忆写，写对得一颗星，整个单元写完盖金星「棒」印章；每单元另有随机抽字的小考。笔画数据离线打包，学校网络慢也能用。视觉走明快的「马力欧」风，跟一年级写字（水墨文房风）分开。网址带班级代码时读班级名单让学生选自己的名字、记录个人进度并可跨电脑接续。",
    keywords: ["写字", "笔顺", "笔画", "习写生字", "田字格", "描红", "读音", "二年级", "华文", "识字", "个人练习", "电脑室"],
    url: "https://tahun2-bc-bishun.vercel.app",
    type: "练习",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.1",
    changelog: [
      { version: "1.1", date: "2026-09-11", note: "修多音字读音错误：田字格上方标注拼音，听读音/自动读音改读「字，词」而非孤字，逼出正确读音" },
      { version: "1.0", date: "2026-09-10", note: "首次上架" },
    ],
    // 这 4 张是用 Playwright 实际操作 http://localhost 上的 tahun2-bc-bishun 截的真实画面（选名字页用示范名单，非真实学生；写一写那张是脚本真实描完整个字触发盖章）
    thumbnails: [
      { img: "assets/thumbs/tahun2-bc-bishun/1-names.png", label: "选名字：接班级名单，学生点自己的名字" },
      { img: "assets/thumbs/tahun2-bc-bishun/2-units.png", label: "选单元：27 个单元，进度看得见" },
      { img: "assets/thumbs/tahun2-bc-bishun/3-watch.png", label: "看一看：笔顺动画一笔一笔演示" },
      { img: "assets/thumbs/tahun2-bc-bishun/4-done.png", label: "写一写：凭记忆写对，盖金星「棒」印章" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.1"] },
      { curriculum: "KSSR Semakan 2017", unitCode: "5.0", objectiveCodes: ["5.1"] },
    ],
    practiceSummary: "在田字格上按正确笔画笔顺书写正楷，练习二年级更复杂的字形与部件结构",
    teachingMode: ["电脑室个人练习", "个人自学"],
    prep: "电脑室个人练习工具，一人一台或两人轮流，用滑鼠描字，不需打印。网址加班级代码（例如 ?code=JBC1037-2I，需老师先在 kelasku 建二年级班级）→ 读班级名单让学生选名字、记录个人进度、换电脑登入同名字可接回；不加代码则手动输入名字、进度只存本机。",
  },

  {
    slug: "tahun2-bc-zonghe",
    tahun: 2,
    subjek: "bc",
    status: "published",
    title_zh: "华文勇者大冒险",
    title_bm: "Pengembaraan Ilmu Bahasa Cina Tahun 2",
    desc: "二年级华文跨单元综合闯关：沿着知识岛完成22个站点，从字音、词语、句子到阅读理解，按基础、进阶、勇者三档挑战，收集积分与宝石。",
    keywords: ["二年级", "华文", "综合复习", "跨单元", "字音", "词语", "句子", "阅读理解", "知识岛", "闯关", "Bahasa Cina", "Tahun 2"],
    url: "https://tahun2-bc-zonghe.vercel.app",
    type: "综合复习游戏",
    stars: 0,
    creator: { name: "李老师", initial: "李" },
    version: "0.1.0",
    changelog: [
      { version: "0.1.0", date: "2026-09-22", note: "首次上架预览：220题、22个知识点、公开排行榜与班级代码机制" },
    ],
    thumbnails: [
      { img: "assets/thumbs/tahun2-bc-zonghe/1-home.png", label: "首页：二年级华文复习游戏" },
      { img: "assets/thumbs/tahun2-bc-zonghe/2-difficulty.png", label: "知识岛路线：三档难度选择" },
      { img: "assets/thumbs/tahun2-bc-zonghe/3-question.png", label: "四选一题目：即时反馈与继续前进" },
      { img: "assets/thumbs/tahun2-bc-zonghe/4-board.png", label: "公开排行榜：班级与全部成绩" },
    ],
    standards: [],
    practiceSummary: "以四选一自动判分复习二年级华文22个跨单元知识点；题库共220题，覆盖字音、词语、句子、阅读理解等，暂不代表听说读写全部课程。",
    teachingMode: ["电脑室小组闯关", "个人自学", "公开排行榜"],
    prep: "2–3人一组完成22站；可直接手填组员姓名，也可在网址加入班级代码读取 Kelasku 名单并进入本班榜。完成主线后正式成绩才会写入公开排行榜；无限挑战只作练习，不计入正式榜。",
  },

  {
    slug: "tahun3-bc-bishun",
    tahun: 3,
    subjek: "bc",
    status: "published",
    title_zh: "三年级写字",
    title_bm: "Menulis Aksara Tahun 3",
    desc: "三年级华文 165 个习写生字，按 20 个单元分类。每个字三步：看笔顺动画（演示完自动读出字音，也能按「听读音」重听）→ 沿淡线描 → 盖住凭记忆写，写对得一颗星，整个单元写完盖金星「棒」印章；每单元另有随机抽字的小考。笔画数据离线打包，学校网络慢也能用。视觉走「We are Twinkle Twinkle」暖调梦幻绘本风（蜂蜜金晨光 + 垂吊金星 + 华丽金画框），跟一年级（水墨文房）、二年级（马力欧）分开。网址带班级代码时读班级名单让学生选自己的名字、记录个人进度并可跨电脑接续。",
    keywords: ["写字", "笔顺", "笔画", "习写生字", "田字格", "描红", "读音", "三年级", "华文", "个人练习", "电脑室"],
    url: "https://tahun3-bc-bishun.vercel.app",
    type: "练习",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.3",
    changelog: [
      { version: "1.3", date: "2026-09-11", note: "修多音字读音错误：田字格上方标注拼音，听读音/自动读音改读「字，词」而非孤字，逼出正确读音" },
      { version: "1.2", date: "2026-09-10", note: "加原创星星娃娃角色：写对时从格子角落蹦出来举星欢呼（不挡字），首页/练习页有坐云看书、云后探头的静态布景" },
      { version: "1.1", date: "2026-09-10", note: "金星「棒」章移到田字格角外，写好的字完整露出；背景加厚（更多垂吊星星 + 云 + 星点）" },
      { version: "1.0", date: "2026-09-10", note: "首次上架" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun3-bc-bishun.vercel.app 截的真实画面（选名字页用示范名单，非真实学生；写一写那张是脚本真实描完整个字触发盖章 + 星星娃娃弹入）
    thumbnails: [
      { img: "assets/thumbs/tahun3-bc-bishun/1-names.png", label: "选名字：接班级名单，学生点自己的名字" },
      { img: "assets/thumbs/tahun3-bc-bishun/2-units.png", label: "选单元：20 个单元，进度看得见" },
      { img: "assets/thumbs/tahun3-bc-bishun/3-watch.png", label: "看一看：笔顺动画一笔一笔演示" },
      { img: "assets/thumbs/tahun3-bc-bishun/4-done.png", label: "写一写：写对了星星娃娃举星欢呼，盖金星「棒」印章" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.1"] },
      { curriculum: "KSSR Semakan 2017", unitCode: "5.0", objectiveCodes: ["5.1"] },
    ],
    practiceSummary: "在田字格上按正确笔画笔顺书写正楷，练习三年级更复杂的字形与结构",
    teachingMode: ["电脑室个人练习", "个人自学"],
    prep: "电脑室个人练习工具，一人一台或两人轮流，用滑鼠描字，不需打印。网址加班级代码（例如 ?code=JBC1037-3I，需老师先在 kelasku 建三年级班级）→ 读班级名单让学生选名字、记录个人进度、换电脑登入同名字可接回；不加代码则手动输入名字、进度只存本机。",
  },

  {
    slug: "tahun4-bc-bishun",
    tahun: 4,
    subjek: "bc",
    status: "published",
    title_zh: "四年级写字",
    title_bm: "Menulis Aksara Tahun 4",
    desc: "四年级华文课本 20 课、109 个习写生字的个人练习工具。学生在蓝天草地与毛绒写字伙伴陪伴下，从课本字表选择课次，观察笔顺、描红，再凭记忆临写；每个字有拼音、定音词朗读、笔画提示与完成印记。工具使用课本第 193–194 页习写生字表，笔画资料离线打包，适合电脑室个人练习。",
    keywords: ["写字", "笔顺", "笔画", "习写生字", "田字格", "描红", "拼音", "四年级", "华文", "个人练习", "电脑室", "结构"],
    url: "https://tahun4-bc-bishun.vercel.app",
    type: "练习",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "2.1",
    changelog: [
      { version: "2.1", date: "2026-09-15", note: "视觉改为蓝天草地的毛绒写字会，统一中文／马来文名称为「四年级写字／Menulis Aksara Tahun 4」，并补上对应场景缩图" },
      { version: "2.0", date: "2026-09-15", note: "重做为「课本档案室／写字实验台」：课次索引、字表索引与练习路线重新编排" },
      { version: "1.0", date: "2026-09-15", note: "首次完成四年级习写生字练习工具" },
    ],
    thumbnails: [
      { img: "assets/thumbs/tahun4-bc-bishun/writing-picnic.png", label: "四年级写字：蓝天草地写字会与毛绒伙伴" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.1"] },
      { curriculum: "KSSR Semakan 2017", unitCode: "5.0", objectiveCodes: ["5.1"] },
    ],
    practiceSummary: "根据四年级华文课本习写生字表，在田字格上按正确笔画笔顺书写正楷，并通过观察结构、描红和临写逐步写稳。",
    teachingMode: ["电脑室个人练习", "个人自学"],
    prep: "电脑室个人练习工具，一人一台或两人轮流，用滑鼠描字，不需打印。网址加班级代码（例如 ?code=JBC1037-4I，需老师先在 kelasku 建四年级班级）→ 读班级名单让学生选名字、记录个人进度、换电脑登入同名字可接回；不加代码则手动输入名字、进度只存本机。",
  },

  {
    slug: "tahun1-bm-huruf",
    tahun: 1,
    subjek: "bm",
    status: "published",
    title_zh: "Huruf A–Z: Mari Menulis",
    title_bm: "Huruf A–Z 写字母",
    desc: "Ajar murid Tahun 1 menulis huruf besar dan kecil bahasa Melayu A–Z di atas garis empat sama jarak. Setiap huruf ditanda dengan nombor urutan lorekan 1, 2, 3 dan anak panah yang memanjang mengikut arah lorekan. \"Tonton\" menulis setiap lorekan satu demi satu untuk seluruh kelas; \"Langkah demi langkah\" guru menekan sekali untuk setiap lorekan dan boleh diundur untuk diulang; \"Saya tulis\" murid menggunakan tetikus atau jari untuk mula dari titik yang berkelip, dan dakwat hanya muncul apabila lorekan betul. Apabila huruf siap, \"Bagus! Pandai!\" dan reben muncul (reben di belakang huruf, tidak menutup huruf). Halaman utama ialah 26 kad huruf yang digantung pada tali; vokal a e i o u dibezakan dengan kad merah jambu, dan huruf yang telah ditulis murid akan ditampal bintang. Semua arahan di halaman dalam bahasa Melayu.",
    keywords: ["字母", "huruf", "huruf besar", "huruf kecil", "huruf vokal", "huruf konsonan", "menulis", "tulisan mekanis", "四线", "笔顺", "描红", "写字", "马来文", "一年级", "abjad"],
    url: "https://tahun1-bm-huruf.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "Cikgu Lim Shih Eyong", initial: "L" },
    version: "1.3",
    changelog: [
      { version: "1.3", date: "2026-10-01", note: "小写 k 两条斜线放平变长；R 第 3 画从竖线与第 2 条线交界开始、终点对齐半圆右边；小写 e 横线画细、字身收窄，空洞更大；负责老师改为 Cikgu Lim Shih Eyong" },
      { version: "1.2", date: "2026-10-01", note: "照国文老师第二次核对：A 横线在第 2 条线上；k 两条斜线 45 度、一样长；R 的腿从第 2 条线 45 度到底线；Z/z 分成 3 画" },
      { version: "1.1", date: "2026-10-01", note: "照国文老师核对修改笔顺：e 2 画、J 先竖弯钩后横、K/k 3 画交在竖线上、M 4 画尖头到底、V/v 2 画与 W/w 4 画（往上那画从底往上）、大写 U 没有尾巴" },
      { version: "1.0", date: "2026-10-01", note: "首次上架：A–Z 26 组大小写笔顺（自动写／逐步／学生描写）、等距四线、字母挂卡主页、马来文介面" },
    ],
    // 这 5 张是用 Playwright 实际操作 https://tahun1-bm-huruf.vercel.app 截的真实画面（第 4、5 张是真的用滑鼠描 Q q），不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bm-huruf/v1-3-1-home.png", label: "主页：26 张字母挂卡，粉色是元音" },
      { img: "assets/thumbs/tahun1-bm-huruf/v1-3-2-tonton.png", label: "Tonton：一笔一笔自动写，带笔顺号码和箭头" },
      { img: "assets/thumbs/tahun1-bm-huruf/v1-3-3-langkah.png", label: "Langkah demi langkah：老师按一下出一笔（M 第 2 画）" },
      { img: "assets/thumbs/tahun1-bm-huruf/v1-3-4-saya-tulis.png", label: "Saya tulis：学生从圆点开始描" },
      { img: "assets/thumbs/tahun1-bm-huruf/v1-3-5-bagus.png", label: "写完：Bagus! Pandai! 与彩带" },
    ],
    standards: [
      { curriculum: "KSSR 2015（原版）", unitCode: "3.0", objectiveCodes: ["3.1"] },
    ],
    practiceSummary: "Menulis huruf besar dan kecil bahasa Melayu secara mekanis, dengan urutan dan arah lorekan yang betul di atas garis empat (SP 3.1.1 (i) huruf)",
    teachingMode: ["Interaksi unjuran", "Guru bimbing / tunjuk cara", "Belajar kendiri"],
    prep: "Buka terus, tidak perlu cetak. Semasa unjuran, guru guna \"Tonton\" atau \"Langkah demi langkah\" untuk menunjuk cara; tekan ← → pada papan kekunci untuk tukar huruf. Murid menulis dengan tetikus di komputer, atau dengan jari di tablet / papan putih interaktif. Tambah #A (gantikan dengan mana-mana huruf) di hujung alamat untuk terus ke huruf itu. Bintang yang ditulis murid hanya disimpan di komputer tersebut.",
  },

  {
    slug: "tahun1-bm-kvkv",
    tahun: 1,
    subjek: "bm",
    status: "published",
    title_zh: "Kebun Pintar KVKV",
    title_bm: "KVKV音节打地鼠",
    desc: "Dua pasukan memukul tikus serentak. Selepas mendengar perkataan yang dibacakan, cari tikus yang memegang kad suku kata yang sepadan. Perkataan bahasa Melayu berstruktur KV+KV (konsonan + vokal, diulang dua kali), dibaca dengan suara terbina dalam pelayar; tidak memerlukan sebarang perkhidmatan luar atau API rangkaian.",
    keywords: ["KVKV", "音节", "拼音", "马来文", "一年级", "bahasa melayu", "suku kata", "打地鼠"],
    url: "https://tahun1-bm-kvkv.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 2 张是用 Playwright 实际操作 https://tahun1-bm-kvkv.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bm-kvkv/1-cover.png", label: "开局：18个KVKV词汇总览" },
      { img: "assets/thumbs/tahun1-bm-kvkv/2-playing.png", label: "两队同时打地鼠" },
    ],
    standards: [
      { curriculum: "KSSR 2015（原版）", unitCode: "2.0", objectiveCodes: ["2.1"] },
    ],
    practiceSummary: "Membaca dengan sebutan dan intonasi yang betul suku kata dan perkataan bahasa Melayu berstruktur KV+KV",
    teachingMode: ["Interaksi unjuran", "Pertandingan dua pasukan"],
    prep: "Buka terus, tidak perlu cetak, tiada peranti murid diperlukan, tiada kunci API rangkaian diperlukan.",
  },

  {
    slug: "tahun1-bc-bushou",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "部首大对垒",
    title_bm: "Pertarungan Radikal Aksara",
    desc: "红蓝两组抽签点名，抢答找出跟给定汉字同部首的字。8组常见部首（扌木讠亻氵口辶⺮）共66个汉字，答错会被冷冻3秒。开局前可自订两组人数。",
    keywords: ["部首", "识字", "偏旁", "一年级", "华文", "PK", "对战"],
    url: "https://tahun1-bc-bushou.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 3 张是用 Playwright 实际操作 https://tahun1-bc-bushou.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-bushou/1-setup.png", label: "开局设定：两组人数可调" },
      { img: "assets/thumbs/tahun1-bc-bushou/2-selection.png", label: "抽签点名" },
      { img: "assets/thumbs/tahun1-bc-bushou/3-playing.png", label: "抢答找同部首字" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "5.0", objectiveCodes: ["5.1"] },
    ],
    practiceSummary: "认识部首/偏旁，辨识同部首汉字",
    teachingMode: ["投影互动", "两组对战"],
    prep: "打开即用，不需要打印，不需要学生设备，开局前可调整两组人数",
  },

  {
    slug: "tahun1-bc-zaoju",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "神奇句子小火车",
    title_bm: "Kereta Api Ayat Ajaib",
    desc: "拖拽或点选「时间/谁什么/地点/动作」四类词语卡组装成完整句子，实时判断语序是否通顺并给出提示；拼好后一键朗读（浏览器内建语音），还能现场抽签点名上台。",
    keywords: ["造句", "写话", "语序", "一年级", "华文", "拖拽", "词语"],
    url: "https://tahun1-bc-zaoju.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 3 张是用 Playwright 实际操作 https://tahun1-bc-zaoju.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-zaoju/1-empty.png", label: "四类词语卡" },
      { img: "assets/thumbs/tahun1-bc-zaoju/2-filled.png", label: "组装成句+语序反馈" },
      { img: "assets/thumbs/tahun1-bc-zaoju/3-draw.png", label: "抽签点名上台" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.2"] },
    ],
    practiceSummary: "练习写话，按时间/人物/地点/动作正确语序组装句子",
    teachingMode: ["投影互动", "全班参与"],
    prep: "打开即用，不需要打印，不需要学生设备，开局前可调整抽签人数",
  },

  {
    slug: "tahun1-bc-kantu",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "看图小侦探",
    title_bm: "Detektif Cilik: Lihat Gambar, Bina Ayat",
    desc: "侦探笔记本主题的看图写话练习：看一张生活场景图，把「线索卡」拖进「＿时间＿，＿人物＿在＿地点＿＿做什么＿。」四个格子，按放大镜检查。干扰卡都是图里看得出不对的（大白天放「晚上」、只有一个人放「同学们」），错的格子会摇动并标出「时间不对」「地点不对」，语音提示该看图里哪里；四格全对就盖「破案！」章、朗读整句、给星星。第一关卡片按四要素分颜色，第二关全部同色、放错要素格也算错。24 个场景，时间看不出确切答案的题接受多个正确答案（例如傍晚／下午／放学后）。全部词语与句子用自然人声预录朗读，点一下卡片就读。",
    keywords: ["看图写话", "看图造句", "写话", "造句", "时间", "人物", "地点", "做什么", "四要素", "一年级", "华文", "拖拽", "kantu"],
    url: "https://tahun1-bc-kantu.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-10-08", note: "首次上架：24 个场景、两关（颜色线索／真正的侦探）、随机 6 题与自己选题两种用法、预录朗读" },
    ],
    // 这 3 张是 2026-10-08 用 Playwright 实际操作正式网址 https://tahun1-bc-kantu.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-kantu/1-home.png", label: "主页：四要素与两关选择" },
      { img: "assets/thumbs/tahun1-bc-kantu/2-feedback.png", label: "检查后：时间、做什么两格标红，人物、地点打勾" },
      { img: "assets/thumbs/tahun1-bc-kantu/3-solved.png", label: "破案！盖章、星星、彩色整句朗读" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.2"] },
    ],
    practiceSummary: "看图写话：从图中找线索，用时间、人物、地点、做什么组成完整句子",
    teachingMode: ["投影互动", "全班参与", "学生自学"],
    prep: "打开即用。一体机全班做：用「自己选题」逐题讲；电脑室一人一台：用「开始破案」随机 6 题，建议戴耳机（会朗读）。触控屏、鼠标都能拖",
  },

  {
    slug: "tahun2-mt-shuzhi",
    tahun: 2,
    subjek: "mt",
    status: "published",
    title_zh: "苹果果园数学",
    title_bm: "Matematik Kebun Epal",
    desc: "1-999的数字用箱子（百）、篮子（十）、苹果（个）视觉化分组展示，点数字有语音气泡解说数位与数值。单人挑战随机出题（数位/数值混合），另有四人竞赛二选一抢答模式，答错淘汰、答对排名。",
    keywords: ["数位", "数值", "二年级", "数学", "nilai tempat", "nilai digit"],
    url: "https://tahun2-mt-shuzhi.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 3 张是用 Playwright 实际操作 https://tahun2-mt-shuzhi.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-mt-shuzhi/1-learn.png", label: "学习模式：果园视觉化分组" },
      { img: "assets/thumbs/tahun2-mt-shuzhi/2-explain.png", label: "点数字看语音解说" },
      { img: "assets/thumbs/tahun2-mt-shuzhi/3-competition.png", label: "四人竞赛二选一抢答" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "1.0", objectiveCodes: ["1.4"] },
    ],
    practiceSummary: "讲述1000以内数目的数位与数值、依数位数值分析数目",
    teachingMode: ["投影互动", "单人挑战", "四人竞赛"],
    prep: "打开即用，不需要打印，不需要学生设备",
  },

  {
    slug: "tahun2-mt-shulie-explore",
    tahun: 2,
    subjek: "mt",
    status: "published",
    title_zh: "数序列小探险",
    title_bm: "Pengembaraan Pola Nombor",
    desc: "四个环节一站式：学习乐园（认识数列概念）→ 练习工坊（填一填）→ 数列小火车（趣味挑战）→ 终极挑战（测验），适合老师带全班从头教到尾建立概念。",
    keywords: ["数列", "规律", "二年级", "数学", "pola nombor"],
    url: "https://tahun2-mt-shulie-explore.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 2 张是用 Playwright 实际操作 https://tahun2-mt-shulie-explore.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-mt-shulie-explore/1-menu.png", label: "四个环节总览" },
      { img: "assets/thumbs/tahun2-mt-shulie-explore/2-learn.png", label: "学习乐园：认识数列概念" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "1.0", objectiveCodes: ["1.7"] },
    ],
    practiceSummary: "认识数列规律、确认规律、完成简易规律数列",
    teachingMode: ["投影互动", "全班带教", "个人练习"],
    prep: "打开即用，不需要打印，不需要学生设备",
  },

  {
    slug: "tahun2-mt-shulie-boss",
    tahun: 2,
    subjek: "mt",
    status: "published",
    title_zh: "数字数列大对决",
    title_bm: "Pertarungan Pola Nombor",
    desc: "单人挑战「数学怪兽」，三个难度关卡（1和10／2和5／混合），找出数列缺项攻击对方，答错或超时会被反打，倒计时条增加临场压力感，适合个人或轮流上台挑战。",
    keywords: ["数列", "规律", "二年级", "数学", "闯关", "RPG"],
    url: "https://tahun2-mt-shulie-boss.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 2 张是用 Playwright 实际操作 https://tahun2-mt-shulie-boss.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-mt-shulie-boss/1-menu.png", label: "三个难度关卡" },
      { img: "assets/thumbs/tahun2-mt-shulie-boss/2-battle.png", label: "对战数学怪兽" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "1.0", objectiveCodes: ["1.7"] },
    ],
    practiceSummary: "确认数列规律、找出数列缺项",
    teachingMode: ["投影互动", "单人挑战"],
    prep: "打开即用，不需要打印，不需要学生设备",
  },

  {
    slug: "tahun2-mt-shulie-duel",
    tahun: 2,
    subjek: "mt",
    status: "published",
    title_zh: "双人数字对决",
    title_bm: "Duel Pola Nombor Dua Pemain",
    desc: "两位学生共用一台电脑同屏对战，玩家1用A/S/D键、玩家2用方向键抢答数列缺项，答对攻击对方血条、答错冻结2秒，先清空对方血条获胜。",
    keywords: ["数列", "规律", "二年级", "数学", "双人", "对战"],
    url: "https://tahun2-mt-shulie-duel.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 2 张是用 Playwright 实际操作 https://tahun2-mt-shulie-duel.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-mt-shulie-duel/1-menu.png", label: "三个难度关卡+按键说明" },
      { img: "assets/thumbs/tahun2-mt-shulie-duel/2-battle.png", label: "同屏双人对战" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "1.0", objectiveCodes: ["1.7"] },
    ],
    practiceSummary: "确认数列规律、找出数列缺项",
    teachingMode: ["投影互动", "两人对战"],
    prep: "打开即用，不需要打印，两位学生共用一台电脑/键盘",
  },

  {
    slug: "tahun3-bc-kewen",
    tahun: 3,
    subjek: "bc",
    status: "published",
    title_zh: "语文课文大PK",
    title_bm: "Pertarungan Pemahaman Teks",
    desc: "两位学生同屏对战，键盘A/S/D vs J/K/L（或方向键）抢答课文填空题，29道题涵盖多篇课文（李光前故事/象棋/古诗/蚊子等），擂台制赢家留下接受新挑战。",
    keywords: ["课文理解", "阅读", "三年级", "华文", "填空", "PK", "对战"],
    url: "https://tahun3-bc-kewen.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 3 张是用 Playwright 实际操作 https://tahun3-bc-kewen.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun3-bc-kewen/1-menu.png", label: "游戏规则说明" },
      { img: "assets/thumbs/tahun3-bc-kewen/2-ready.png", label: "抽签对战准备" },
      { img: "assets/thumbs/tahun3-bc-kewen/3-playing.png", label: "同屏抢答填空" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "2.0", objectiveCodes: ["2.1"] },
    ],
    practiceSummary: "阅读教材培养语感、体验情感、领会教育意义",
    teachingMode: ["投影互动", "两人对战"],
    prep: "打开即用，不需要打印，两位学生共用一台电脑/键盘",
  },

  {
    slug: "tahun2-mt-baigetu",
    tahun: 2,
    subjek: "mt",
    status: "published",
    title_zh: "百格图乘法表动画",
    title_bm: "Animasi Sifir dalam Carta Seratus",
    desc: "1-100百格图逐格点亮某个乘数（2-10）的所有倍数，配合右侧同步高亮的乘法等式清单，可调速播放/暂停/直接展示，帮助建立乘法周期性斜线规律的数感。",
    keywords: ["乘法", "乘法表", "口诀", "二年级", "数学", "sifir", "pendaraban"],
    url: "https://tahun2-mt-baigetu.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 3 张是用 Playwright 实际操作 https://tahun2-mt-baigetu.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-mt-baigetu/1-init.png", label: "选择乘数" },
      { img: "assets/thumbs/tahun2-mt-baigetu/2-complete.png", label: "直接展示全部倍数" },
      { img: "assets/thumbs/tahun2-mt-baigetu/3-animating.png", label: "逐格动画+等式同步高亮" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "2.0", objectiveCodes: ["2.3"] },
    ],
    practiceSummary: "基本乘法（一位数×一位数）、认识乘法的周期性规律",
    teachingMode: ["投影互动", "教师带教"],
    prep: "打开即用，不需要打印，不需要学生设备",
  },

  {
    slug: "tahun1-am-cahaya",
    tahun: 1,
    subjek: "am",
    status: "published",
    title_zh: "光的小探险",
    title_bm: "Pengembaraan Cahaya",
    desc: "2027 年新课程（KP2027）一年级 Alam dan Manusia 5.1 Kraf Cahaya（DSKP 5.1.1–5.1.4）的 3D 互动工具。第一幕：停电夜的娃娃屋剖面，学生先用手电筒做三件事（收玩具走到门口、照着楼梯往上走、看书上的图），来电后再做一次，比较明和暗的差别，体会「光让我们看得见」，并让眼睛休息一下（电子设备的光）。第二幕：在房间里找 9 样亮亮的东西，一样一样猜哪些会自己发光，再关灯做全黑测验；月亮的秘密用动画解说月亮自己不发光；最后天亮，总结光源。",
    keywords: ["光", "光源", "手电筒", "太阳", "月亮", "明暗", "停电", "眼睛", "cahaya", "sumber cahaya", "Alam dan Manusia", "KP2027", "Kraf Cahaya", "一年级", "3D"],
    url: "https://tahun1-am-cahaya.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.1",
    changelog: [
      { version: "1.1", date: "2026-10-02", note: "黑暗中只有真光源会发亮：白色物件改哑光、手电筒亮度固定；全屋视角光圈加大" },
      { version: "1.0", date: "2026-10-02", note: "首次上线：停电夜 3D 娃娃屋，两幕" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun1-am-cahaya.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-am-cahaya/v1-0-home.png", label: "开场：亮灯的房子，「这是你的家」" },
      { img: "assets/thumbs/tahun1-am-cahaya/v1-0-torch.png", label: "第一幕：停电后，用手电筒照亮黑暗的客厅" },
      { img: "assets/thumbs/tahun1-am-cahaya/v1-1-act2.png", label: "第二幕：停电后找亮亮的东西" },
      { img: "assets/thumbs/tahun1-am-cahaya/v1-0-moon.png", label: "月亮的秘密：动画解说月亮不会自己发光" },
    ],
    standards: [], // KP2027 官方马来文用词未核对，暂不进 data/dskp-index.js（DSKP 5.1.1–5.1.4 写在 desc）
    practiceSummary: "辨认光源，体会没有光就看不见，比较明暗中做事的差别，分辨会自己发光和不会自己发光的东西，并知道电子设备的光对眼睛的影响（DSKP 5.1.1–5.1.4）",
    teachingMode: ["课堂投影", "个人练习", "教师引导"],
    prep: "需要较新的电脑或平板（3D 画面）。建议课室投影全班一起玩，也可学生一人一机。不需要摄像头或麦克风；有音效，可关。每一幕约 15 分钟，共两幕。",
  },

  {
    slug: "tahun1-dst-magnet",
    tahun: 1,
    subjek: "dst",
    status: "published",
    title_zh: "磁力创造实验室",
    title_bm: "Makmal Cipta Magnet",
    desc: "面向一年级的开放式磁力创造工具。学生可在磁力探索桌比较铁、钢、铝、铜、木与塑料等材料，在磁极谜题场观察相吸相斥，在公平实验室只改变距离并记录回形针数量，最后摆放磁铁、钢珠、障碍与终点，创造并亲自验证一项能给别人试玩的磁力挑战。课堂投影与家庭探索双模式；老师可暂停、隐藏结果、显示磁力线、记录预测票数、生成讨论问题及打印实验单。",
    keywords: ["磁铁", "磁力", "磁极", "公平实验", "创造挑战", "一年级", "科学", "magnet", "tarikan", "tolakan", "eksperimen adil"],
    url: "https://tahun1-dst-magnet.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "2.0",
    changelog: [
      { version: "2.0", date: "2026-09-17", note: "重建为磁力创造实验室：四个开放工作区、课堂／家庭双模式、老师控制台，以及可试玩验证与导出的学生自创挑战" },
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun1-dst-magnet.vercel.app v2 正式版截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-dst-magnet/1-home-v2.png", label: "首页：选择课堂投影或家庭探索" },
      { img: "assets/thumbs/tahun1-dst-magnet/2-poles-v2.png", label: "磁极谜题场：旋转磁铁破解相吸相斥任务" },
      { img: "assets/thumbs/tahun1-dst-magnet/3-create-v2.png", label: "挑战创造工坊：摆放磁铁与障碍，试玩验证自创关卡" },
      { img: "assets/thumbs/tahun1-dst-magnet/4-teacher-v2.png", label: "老师控制台：预测投票与课堂控制" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "7.1", objectiveCodes: ["7.1.1", "7.1.2", "7.1.3", "7.1.4", "7.1.5", "7.1.6"] },
    ],
    practiceSummary: "比较不同材料、探究磁极相吸相斥、进行距离与磁力的公平实验、解释观察并创造磁铁挑战",
    teachingMode: ["课堂投影", "家庭探索", "学生创造"],
    prep: "家庭打开即用；课堂建议配合真实磁铁示范，数字模拟不替代实体实验",
  },

  {
    slug: "tahun1-pj-pergerakan",
    tahun: 1,
    subjek: "pjpk",
    status: "published",
    title_zh: "动物模仿秀",
    title_bm: "Gaya Haiwan",
    desc: "烟霾停课、不能到户外运动时，一年级学生在家用手机前置镜头做体育动作。先看动作教学（插画＋三个步骤＋朗读），再做站位检查：先调手机角度、站进屏幕上的人像，确认空间够做全部动作，并放拖鞋做记号。之后挑雨林动物来模仿：青蛙蹲、长颈鹿伸高、红鹤单脚站、小狗三脚站、海星大字形、鳄鱼撑地、小猫伸懒腰。手机辨认身体骨架，动作做对并撑住几秒就自动拍照，照片盖上名字、日期和动作名（华文＋马来文）。做完拼成一张「雨林探险」打卡卡，可分享到 Google Classroom、WhatsApp，或存进手机交给老师。影像只在手机本机处理，不会上传。",
    keywords: ["体育", "一年级", "居家", "烟霾", "停课", "动作", "平衡", "伸展", "动物模仿", "拍照", "打卡", "Google Classroom", "pendidikan jasmani", "PJ", "imbangan", "regangan", "pergerakan haiwan", "kecergasan"],
    url: "https://tahun1-pj-pergerakan.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.1.1",
    changelog: [
      { version: "1.1.1", date: "2026-10-10", note: "网址改为 tahun1-pj-pergerakan（体育打卡系列统一分类用名，旧网址会自动跳转）；学生看到的名称仍是「动物模仿秀」，功能没有改动" },
      { version: "1.0.3", date: "2026-10-10", note: "修正 iPhone 进动作后镜头画面缩小；拍照改以人的位置裁切，青蛙、小狗、鳄鱼等地上的动作不再被裁掉或被名牌条盖住" },
      { version: "1.0.2", date: "2026-10-10", note: "手机拍照画面改版：镜头画面占满屏幕、上下控制列变薄叠在画面上、提示改单行小字，人形框更大" },
      { version: "1.0.1", date: "2026-10-10", note: "修正 iPhone 直拿时摄像头画面变成扁横条、人形框对不上：改开直式画面" },
      { version: "1.0", date: "2026-10-10", note: "首次上架" },
    ],
    // v1.0：封面由 cx 生图（雨林七动物＋工具名），其余 4 张是老师 2026-10-10 在电脑上操作正式网址的实际截图（横式，配合 4:3 卡片）
    thumbnails: [
      { img: "assets/thumbs/tahun1-pj-pergerakan/v1-0-cover.png", label: "封面：雨林里七只动物各做一个动作，小朋友跟着摆海星" },
      { img: "assets/thumbs/tahun1-pj-pergerakan/v1-1-2-home.png", label: "首页：输入名字和班级，开始前先看四个安全提示" },
      { img: "assets/thumbs/tahun1-pj-pergerakan/v1-2-tutorial.png", label: "动作教学：红鹤单脚站的插画、三个步骤与要撑的秒数，会自动朗读" },
      { img: "assets/thumbs/tahun1-pj-pergerakan/v1-3-position.png", label: "站位检查：先调手机角度让人像踩在地板上，再站进人像里" },
      { img: "assets/thumbs/tahun1-pj-pergerakan/v1-4-list.png", label: "挑一只动物来模仿：七张标本卡，做完的会盖章、可重拍" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "1.0", objectiveCodes: ["1.1", "1.6", "1.7"] },
      { curriculum: "KSSR Semakan 2017", unitCode: "3.0", objectiveCodes: ["3.3", "3.4"] },
    ],
    practiceSummary: "模仿动物在低、高水平的动作，单脚与多支撑点平衡，大字形身体形状，俯卧撑预备姿势撑住，伸展拉筋",
    teachingMode: ["学生自学", "个人练习"],
    prep: "学生用手机（或有摄像头的电脑），以 Chrome 或 Safari 打开；在 Telegram／WhatsApp 里点开会提示改用浏览器。手机要立在桌上，人退后约 2–3 米，身边要有空地，建议有大人陪同。首次载入约 17MB（含动作辨认模型），建议用 Wi-Fi。旧手机辨认太慢时会自动改用 10 秒倒数拍。照片只存在学生手机，老师从 Classroom／WhatsApp 收打卡卡",
  },

  {
    slug: "tahun3-dst-density",
    tahun: 3,
    subjek: "dst",
    status: "published",
    title_zh: "浮沉实验室：密度大发现",
    title_bm: "Makmal Terapung-Tenggelam: Ketumpatan",
    desc: "3D 写实的厨房实验台，真实浮力物理（东西会翻转、溅水花、冒气泡，水位会上升）。五个实验对应 DSKP 7.1：① 猜一猜：先猜浮或沉再放进水缸，结果自动分成浮／沉两组，再推断原因（7.1.1）；② 重的会沉吗：电子秤称重，大木块比铁钉重却会浮、剥了皮的橙子反而沉，并和「一样大小的水」比一比（7.1.2）；③ 救救鸡蛋：一匙一匙加盐或糖、汤匙搅拌，看鸡蛋慢慢浮起，自动记录（7.1.3）；④ 液体分层：油、炼奶倒进水里，再做五层彩虹杯，放软木塞、小番茄、葡萄看停在哪一层（DSKP 活动建议）；⑤ 我的发现：用实验时自动拍下的照片，拼句子做发现卡展示（7.1.4）。",
    keywords: ["密度", "浮沉", "三年级", "科学", "density", "ketumpatan", "terapung", "tenggelam", "加盐", "加糖", "鸡蛋", "液体分层", "彩虹杯", "天平", "3D"],
    url: "https://tahun3-dst-density.vercel.app",
    type: "工具",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "3.0",
    changelog: [
      { version: "3.0", date: "2026-10-02", note: "整个重做成 3D 厨房实验台：真实浮力物理、水花与气泡；水缸为主角，物品架点一下就放进水里，拖到秤上自动称重；依 DSKP 原件补上加糖、油与炼奶、彩色液体分层、剥皮橙子；新增「我的发现」卡（7.1.4）" },
      { version: "2.0", date: "2026-09-17", note: "全面重做为专业科学模拟：四个实验站对应 7.1.1–7.1.4＋学习报告；自学／老师投影双模式；SVG 烧杯水槽与半物理浮力（浸水比例＝密度比）；电子天平破除「重的会沉」误解；12 张写实物体素材取代图标；移除「轻/重」误导用语，数值密度默认隐藏" },
      { version: "1.0", date: "2026-07-21", note: "首次上架" },
    ],
    // v3.0 缩图：2026-10-02 用 Playwright 实际操作正式网址 https://tahun3-dst-density.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun3-dst-density/v3-1-predict.png", label: "① 猜一猜：物品悬在水缸上方，先猜会浮还是会沉，再放进去" },
      { img: "assets/thumbs/tahun3-dst-density/v3-2-scale.png", label: "② 重的会沉吗：大木块放在电子秤上，大字卡显示重量；铁钉已沉到缸底" },
      { img: "assets/thumbs/tahun3-dst-density/v3-3-egg.png", label: "③ 救救鸡蛋：加了 4 匙盐，鸡蛋浮上水面，左边自动记录每一匙的结果" },
      { img: "assets/thumbs/tahun3-dst-density/v3-4-rainbow.png", label: "④ 液体分层：五层彩虹杯，软木塞浮在最上面、小番茄停在油和水中间" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "7.1", objectiveCodes: ["7.1.1", "7.1.2", "7.1.3", "7.1.4"] },
    ],
    practiceSummary: "推断物体与材料的浮沉、联系浮沉与密度、确认增加水密度的方法（盐、糖）、观察液体分层，并用照片与句子解释发现",
    teachingMode: ["投影互动", "教师带教/演示", "学生自学"],
    prep: "打开即用，不需要真的水缸；建议用电脑或触控一体机横屏（3D 画面，旧电脑会自动降画质）。进度只存在该浏览器。数字模拟不替代真实的加盐救鸡蛋实验，可先模拟再动手做",
  },

  {
    slug: "tahun2-dst-tower",
    tahun: 2,
    subjek: "dst",
    status: "published",
    title_zh: "科学叠叠塔",
    title_bm: "Menara Sains",
    desc: "二年级科学「光和暗」「混合物」的看图答题叠塔游戏。每题配一张图（光源、物体、屏幕，或盐水、沙子和筛网），答对才会落下一块积木，学生左右移动或单点快速落块，把塔叠得越高越好；两块并排先搭地基，塔越高越会摇晃，没接稳就倒塌。连续答对三题可选技能：稳固、双倍、自选积木形状。答对也会看到一句「为什么」，答错会指出正确答案和原因。叠到 100 cm、200 cm 会有庆祝提示。输入班级代码后从名单点自己的名字，成绩进入本班排行榜（每人每个题库只留最高塔）；也可以不登录用访客模式试玩。光和暗 19 题＋变式，混合物 52 题，全部配图。",
    keywords: ["光和暗", "影子", "透光", "混合物", "溶解", "分离", "二年级", "科学", "叠叠塔", "看图答题", "排行榜", "cahaya", "bayang", "campuran", "larut"],
    url: "https://tahun2-dst-tower.vercel.app",
    type: "游戏",
    hasLeaderboard: true,
    stars: 0,
    creator: { name: "曾慧恩老师", initial: "曾" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-10-09", note: "首次上架：接入班级代码名单与班级排行榜（访客可试玩）；答对也显示「为什么」，叠到 100 cm 有庆祝提示，塔越高天空越暗，答题卡不再挡住塔" },
    ],
    // 缩图：2026-10-09 用 Playwright 实际打开正式网址 https://tahun2-dst-tower.vercel.app 截的真实画面（访客模式），不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun2-dst-tower/v2-0-start.png", label: "开始页：登录（保存成绩、挑战班级排行榜）或访客模式（无需登录直接体验）" },
      { img: "assets/thumbs/tahun2-dst-tower/v2-1-map.png", label: "科学冒险地图：两座岛——阳光城堡「光和暗」、像素矿场「混合物」" },
      { img: "assets/thumbs/tahun2-dst-tower/v2-2-question.png", label: "看图答题：题目配一张光源、透明玻璃和屏幕的图，答对才有积木，旁边是自己的塔" },
      { img: "assets/thumbs/tahun2-dst-tower/v2-3-tower.png", label: "叠塔：答对后积木落下，塔叠到 100 cm 时出现「突破 100 cm」庆祝提示" },
    ],
    // standards 暂不填：题库内的学习标准代码（光和暗 6.1.1–6.1.6、混合物 8.1.1–8.1.4）沿用原作者，未核对官方 PDF（本机无 Tahun 2 科学原件）；Hub 摘要只到内容标准 6.1／8.1
    practiceSummary: "光和暗：确认光源、比较光暗、判断影子的方向、大小与清晰度；混合物：辨认可溶解与不可溶解的材料、选择分离混合物的方法、加快溶解的做法",
    teachingMode: ["学生自学", "投影互动", "课堂竞赛"],
    prep: "打开即用，需要网络。登录要班级代码（老师给，如 JBC1037-1A；网址后面加 ?code=班级代码 可直接带入，设备会记住），成绩进入该班排行榜；不想登录就选访客模式（不上榜）。建议一人一台平板或电脑，触控拖动或鼠标左右移动积木，单点快速落块；一体机投影也可全班轮流玩。题库里的学习标准代码来自原作者，尚未核对官方文件",
  },

  {
    slug: "tahun1-mt-masa",
    tahun: 1,
    subjek: "mt",
    status: "published",
    title_zh: "时刻大对决",
    title_bm: "Pertarungan Masa",
    desc: "一年级「时间与时刻」拨钟工具，分课堂对垒和自由作答两种模式。题目只考整时、半、一刻、三刻（可自选），例如「把钟拨成 4 时半」。学生拖动分针和时针拨钟，时针也要跟着走到位才算对，答错会直接指出「分针对了，时针还没走到」。课堂对垒：左右各一个大钟，两位学生同屏抢拨，每答完一题就从班级名单重新抽一对新同学上场，不重复、全班轮完一遍才重来。自由作答：一个人练习，记录答对几题和用时。时针宽容度有宽松、标准、严格三档，可按学生程度调整；有音效（可静音）和排行榜，对垒与自由作答分开计分。",
    keywords: ["时刻", "时间", "拨钟", "钟面", "整时", "半", "一刻", "三刻", "一年级", "数学", "masa", "jam", "waktu", "对决", "抢答", "排行榜"],
    url: "https://tahun1-mt-masa.vercel.app",
    type: "游戏",
    hasLeaderboard: true,
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-10-08", note: "首次上架" },
    ],
    // 缩图：2026-10-08 用 Playwright 实际打开正式网址 https://tahun1-mt-masa.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-mt-masa/v1-0-hero.png", label: "开场：木框实体风格的大钟，下方写着「两个人比赛，看谁先把指针拨对！」和「开始」按钮" },
      { img: "assets/thumbs/tahun1-mt-masa/v1-1-setup.png", label: "设定页：选课堂对垒或自由作答，输入蓝队红队名字，选要考哪几种时刻（整时、半、一刻、三刻）" },
      { img: "assets/thumbs/tahun1-mt-masa/v1-2-solo.png", label: "自由作答：题目卡写着「把钟拨成 6 时」，下方是木框大钟，上方显示第几题和用时" },
      { img: "assets/thumbs/tahun1-mt-masa/v1-3-duel.png", label: "课堂对垒：蓝队红队计分条，题目卡「把钟拨成 2 时」，下方并排两个大钟，两位学生同屏抢拨" },
    ],
    // standards 暂不填：马来文 DSKP 官方用词未核对官方 PDF，不编造课程对照
    practiceSummary: "确认时针与分针的位置，读出并拨出整时、半、一刻、三刻",
    teachingMode: ["投影互动", "课堂对垒", "学生自学"],
    prep: "打开即用。课堂对垒建议用一体机或投影横屏，两位学生同屏拨钟；接班级名单后每题自动换一对新同学上场，没有名单可直接打名字。自由作答一人一台即可。时针宽容度预设「宽松」，要练习「半点时针要走到两个数字中间」请调到标准或严格",
  },

  {
    slug: "tahun1-bc-liangci",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "量词大冒险",
    title_bm: "Pengembaraan Penjodoh Bilangan",
    desc: "开场先像素风主题页，点开始才进选班级（第三个选项「不选名字」可给其他学校直接借用）。看完 17 个常用量词的例子（如「一个苹果」「一只小鸟」，一年级适用的大字体+多色卡片），每个量词点 3 个例子确认读过，才能进入 Phaser 像素闯关游戏答题。一轮固定 10 题，正确率达标可以选择再玩一次或换人；答错太多则强制回去重新点完全部例子才能再挑战，不能直接跳过学习。改编自作者自己开发的 Mario 像素闯关引擎，换上量词题库。",
    keywords: ["量词", "一年级", "华文", "liangci", "penjodoh bilangan", "像素游戏", "答题闯关", "自主学习", "mario"],
    url: "https://tahun1-bc-liangci.vercel.app",
    type: "游戏",
    hasLeaderboard: true,
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.2",
    changelog: [
      { version: "1.0", date: "2026-07-22", note: "首次上架" },
      { version: "1.1", date: "2026-07-22", note: "加开场主题页与访客模式；Slides 字体放大、卡片加大加多色；修复垫脚箱卡关与终点旗杆区没有地面的问题" },
      { version: "1.2", date: "2026-08-05", note: "对照课本修正量词内容错误（群配老虎、枝配柳枝、串配露珠三处不对/别扭的例词与例句），并把偏书面的量词描述文字改成小朋友看得懂的口语说法" },
    ],
    // 这 4 张是用 Playwright 实际操作 https://tahun1-bc-liangci.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-liangci/1-title.png", label: "像素风开场页" },
      { img: "assets/thumbs/tahun1-bc-liangci/2-slide.png", label: "量词学习卡片（点例子确认）" },
      { img: "assets/thumbs/tahun1-bc-liangci/3-game.png", label: "Phaser 像素闯关" },
      { img: "assets/thumbs/tahun1-bc-liangci/4-quiz.png", label: "答题：四色选项+上下键选择" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "5.0", objectiveCodes: ["5.3.1"] },
    ],
    practiceSummary: "认识17个常用量词的正确用法、根据名词判断合适的量词、辨析理解词义",
    teachingMode: ["个人自学", "投影互动"],
    prep: "打开即用，不需要打印；键盘操作游戏（方向键+空格），一台电脑轮流玩或每人一台皆可",
  },

  {
    slug: "tahun1-bc-liangci1",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "量词南瓜丰收季",
    title_bm: "Musim Menuai Labu: Penjodoh Bilangan",
    desc: "把「双、朵、只、颗、片、群」六个量词送到南瓜上，收割南瓜。关卡一是短语：一屏 6 粒南瓜，每粒南瓜上有图和「一（？）鲜花」，把量词卡拖过去（或点一下卡再点南瓜）；「群」的图一律画出好几个聚在一起，「只」「颗」是单个，让学生靠数一数、看形状来判断。关卡二是句子：读句子、把量词送进空格。题目每次乱序，答案没有规律可猜；答错先给观察提示（只教怎么看，不说答案），再答错才给完整提示，第三次起正确的量词卡会发光。第一次就答错的题，会在这一遍结束后再回炉一轮；最后显示星星和每个量词的答对率，提醒哪个量词最该多练。每个字可打开拼音，题目和提示都有预录人声朗读。",
    keywords: ["量词", "一年级", "华文", "南瓜", "双", "朵", "只", "颗", "片", "群", "penjodoh bilangan", "拖放", "拼音", "看图选词", "句子"],
    url: "https://tahun1-bc-liangci1.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "陈晓琪老师", initial: "陈" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-10-09", note: "首次上架：改编自陈晓琪老师的「南瓜量词丰收季」，重新核对题库（群的图画出多个、句子补「一」、换掉画不对的珍珠／葡萄／大雁／海鸥）、乱序出题、三阶段提示、错题回炉、量词答对率、拼音开关、预录朗读" },
    ],
    // 缩图：2026-10-09 用 Playwright 实际打开正式网址 https://tahun1-bc-liangci1.vercel.app 截的真实画面，不是 mock
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-liangci1/v1-0-home.png", label: "首页：量词南瓜丰收季，关卡一、关卡二和量词宝典三个按钮" },
      { img: "assets/thumbs/tahun1-bc-liangci1/v1-1-level1.png", label: "关卡一：6 粒南瓜，每粒有图和「一（？）XX」，下方是双朵只颗片群六张量词卡" },
      { img: "assets/thumbs/tahun1-bc-liangci1/v1-2-pinyin.png", label: "打开「拼」按钮：量词卡和题目的字上方都标出拼音" },
      { img: "assets/thumbs/tahun1-bc-liangci1/v1-3-level2.png", label: "关卡二：一幅图加一个句子，把量词送进空格" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "5.0", objectiveCodes: ["5.3.1"] },
    ],
    practiceSummary: "认识双、朵、只、颗、片、群六个量词，根据图中事物的数量与形状选出合适的量词，并在句子里运用",
    teachingMode: ["个人自学", "投影互动", "课堂练习"],
    prep: "打开即用，不需要打印；拖放或点选都可，触控一体机、平板、手机皆可（建议横屏）。想看拼音点顶栏「拼」。一人一台自学，或投影后请学生上台拖一拖。与「量词大冒险」是不同玩法：这个只练六个最常用的量词，适合刚学量词时",
  },

  {
    slug: "tahun1-bc-juxing",
    tahun: 1,
    subjek: "bc",
    status: "published",
    title_zh: "句型跳跳队",
    title_bm: "Skuad Lompat Jenis Ayat",
    desc: "全平台第一个摄像头体感游戏：点开先进教学导入，点卡片整页切换陈述句/疑问句/祈使句/感叹句的解释、课本例句与「读读比比」易混句型对照。分组上场（建议4-8人）后开镜头，输入组名，题目念完先有「回到中间站好」的缓冲，接着左右两侧出现句型选项，5秒倒数配合逼哔声与紧张背景音乐，全组一致跳到正确一侧才得分，答对区块亮青色。一轮固定10题，结算后可换组再战，排行榜用浏览器本机存档。摄像头画面全程只在学生电脑本机做姿态推理，不上传任何影像。",
    keywords: ["句型", "句子功能", "陈述句", "疑问句", "祈使句", "感叹句", "一年级", "华文", "juxing", "jenis ayat", "摄像头", "体感游戏", "分组游戏", "AR"],
    url: "https://tahun1-bc-juxing.vercel.app",
    type: "游戏",
    stars: 0,
    creator: { name: "卢老师", initial: "卢" },
    version: "1.0",
    changelog: [
      { version: "1.0", date: "2026-07-31", note: "首次上架" },
    ],
    // 这 2 张是用 Playwright 实际操作 https://tahun1-bc-juxing.vercel.app 截的真实画面（教学导入部分）；
    // 分组/答题画面需要真实摄像头，headless 浏览器没有镜头无法截到，先留空
    thumbnails: [
      { img: "assets/thumbs/tahun1-bc-juxing/1-intro-overview.png", label: "教学导入总览：四种句型卡片" },
      { img: "assets/thumbs/tahun1-bc-juxing/2-intro-detail.png", label: "点开单一句型：课本例句+读读比比对照" },
    ],
    standards: [
      { curriculum: "KSSR Semakan 2017", unitCode: "5.4", objectiveCodes: ["5.4.1"] },
    ],
    practiceSummary: "辨别陈述句、疑问句、祈使句、感叹句的功能与语气，连结对应标点符号与朗读语气",
    teachingMode: ["摄像头体感互动", "分组比赛"],
    prep: "需要摄像头（画面只在本机处理，不上传）；建议 4-8 人一组上场，需要一定活动空间；光线要充足；用 Chrome/Edge 等现代浏览器打开",
  },
];

// ---------- DSKP 索引查询辅助（读 data/dskp-index.js 的 DSKP_INDEX） ----------
function findDskpRecord(tahun, subjek) {
  if (typeof DSKP_INDEX === "undefined") return null;
  return DSKP_INDEX.find((r) => r.tahun === tahun && r.subjek === subjek) || null;
}
function getUnit(record, unitCode) {
  return record && record.units.find((u) => u.code === unitCode);
}
function getObjective(unit, objectiveCode) {
  return unit && unit.objectives.find((o) => o.code === objectiveCode);
}
// 把工具的 standards（只存代码引用）反查回 DSKP_INDEX，取得完整标题/来源/核对日期
function resolveToolStandards(tool) {
  if (!tool.standards || typeof DSKP_INDEX === "undefined") return [];
  return tool.standards.map((s) => {
    const record = DSKP_INDEX.find((r) => r.curriculum === s.curriculum && r.tahun === tool.tahun && r.subjek === tool.subjek);
    const unit = record && getUnit(record, s.unitCode);
    if (!record || !unit) return null;
    const objectives = s.objectiveCodes.map((c) => getObjective(unit, c)).filter(Boolean);
    return { record, unit, objectives };
  }).filter(Boolean);
}

// 工具喜欢数／使用次数：全站真实聚合，存在 Supabase 的 tool_stats（见 supabase/schema.sql），
// 不再是每台浏览器各自累计的 localStorage 数字。「喜欢」仍然不用登录，用一个存在本机的
// 随机 voter key 判断这台浏览器有没有投过票、防止重复计数。
const VOTER_KEY_STORAGE = "kongsi-idea-voter-key";
function getVoterKey() {
  let key = localStorage.getItem(VOTER_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY_STORAGE, key);
  }
  return key;
}

const toolStatsCache = {}; // slug -> { likesCount, usesCount, liked }

// 上次从服务器拿到的真实数字先记在本机：再次打开时卡片直接按上次的喜欢数排好，
// 不会先按预设顺序排、等 Supabase 回来再整批跳位置（老师以为页面还在载入）。服务器一回来就覆盖。
const TOOL_STATS_CACHE_KEY = "kongsi-idea-tool-stats-cache";
try { Object.assign(toolStatsCache, JSON.parse(localStorage.getItem(TOOL_STATS_CACHE_KEY) || "{}")); } catch (e) { /* 读不到就当第一次来 */ }

function getUses(slug) {
  return (toolStatsCache[slug] && toolStatsCache[slug].usesCount) || 0;
}
function hasLiked(slug) {
  return !!(toolStatsCache[slug] && toolStatsCache[slug].liked);
}
function getLikes(tool) {
  return (toolStatsCache[tool.slug] && toolStatsCache[tool.slug].likesCount) || 0;
}

async function loadToolStats() {
  const voterKey = getVoterKey();
  const [{ data: stats, error: statsErr }, { data: votes, error: votesErr }] = await Promise.all([
    supabaseClient.from("tool_stats").select("tool_slug, likes_count, uses_count"),
    supabaseClient.from("tool_like_votes").select("tool_slug").eq("voter_key", voterKey),
  ]);
  if (statsErr) { console.error("载入工具统计失败", statsErr); return; }
  if (votesErr) console.error("载入喜欢记录失败", votesErr);
  const likedSlugs = new Set((votes || []).map((v) => v.tool_slug));
  TOOLS.forEach((t) => {
    const row = (stats || []).find((s) => s.tool_slug === t.slug);
    toolStatsCache[t.slug] = {
      likesCount: row ? row.likes_count : 0,
      usesCount: row ? row.uses_count : 0,
      liked: likedSlugs.has(t.slug),
    };
  });
  try { localStorage.setItem(TOOL_STATS_CACHE_KEY, JSON.stringify(toolStatsCache)); } catch (e) { /* 存不了不影响画面 */ }
  renderBoard();
  renderStats();
}

async function toggleLike(tool) {
  const voterKey = getVoterKey();
  const before = toolStatsCache[tool.slug] || { likesCount: 0, usesCount: 0, liked: false };
  // 先在本机乐观更新一次画面，等服务器回应再用真正的数字校正，点起来才不会觉得卡
  toolStatsCache[tool.slug] = { ...before, liked: !before.liked, likesCount: before.likesCount + (before.liked ? -1 : 1) };
  renderBoard();
  renderStats();

  const { data, error } = await supabaseClient.rpc("toggle_tool_like", { p_slug: tool.slug, p_voter_key: voterKey });
  if (error) {
    console.error("喜欢失败", error);
    toolStatsCache[tool.slug] = before; // 送不出去就还原
    renderBoard();
    renderStats();
    return;
  }
  const row = Array.isArray(data) ? data[0] : data;
  toolStatsCache[tool.slug] = { ...toolStatsCache[tool.slug], likesCount: row.likes_count, liked: row.liked };
  renderBoard();
  renderStats();
}

async function bumpUses(slug) {
  const { data, error } = await supabaseClient.rpc("increment_tool_uses", { p_slug: slug });
  if (error) { console.error("记录使用次数失败", error); return; }
  toolStatsCache[slug] = { ...(toolStatsCache[slug] || { likesCount: 0, liked: false }), usesCount: data };
  renderStats();
}

const boardEl = document.getElementById("board");
const boardEmptyEl = document.getElementById("boardEmpty");
const gradeFacetEl = document.getElementById("gradeFacet");
const subjekFacetEl = document.getElementById("subjekFacet");

let gradeFilter = "all";
let subjekFilter = "all";

// 年级／科目条件只存在网址里（刷新、返回键、传网址都保留）；不再记在浏览器里——
// 老师隔天直接打开网站，一律从「全部工具」开始，不会被上次的条件悄悄筛掉（2026-10-04 老师确认）。
try { localStorage.removeItem("kongsi-idea-board-filter"); } catch (e) { /* 清旧记忆，失败不影响 */ }

function subjectBadge(code) {
  return (SUBJECT_BY_CODE[code] && SUBJECT_BY_CODE[code].badge) || code.slice(0, 2).toUpperCase();
}
function trophyIcon() {
  return '<svg class="trophy-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3V3Zm0 4H6v1a2 2 0 0 0 1 1.7V7Zm10 0v2.7A2 2 0 0 0 18 8V7h-1ZM7 20h10v1H7v-1Z"/></svg>';
}
function starIcon() {
  return '<svg class="star-icon" viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z"/></svg>';
}

function scrollToBoard() {
  document.querySelector(".browse").scrollIntoView({ behavior: "smooth" });
}

// ---------- 上下共用同一套条件（2026-10-02 老师反馈：上面选 1 年级马来文，下面还显示全部，会混淆） ----------
// finderState（「今天要教什么？」）是唯一来源；下方年级／科目按钮只是它的镜像。
// 在任何一边改，另一边跟着变；下方卡片同时吃年级、科目、单元／学习目标、关键词。
function syncFacetsFromFinder() {
  gradeFilter = finderState.tahun || "all";
  subjekFilter = finderState.subjek || "all";
}
function applyFacetsToFinder() {
  const tahun = gradeFilter === "all" ? null : Number(gradeFilter);
  const subjek = subjekFilter === "all" ? null : subjekFilter;
  if (tahun !== finderState.tahun || subjek !== finderState.subjek) {
    finderState.unit = null; finderState.objective = null; // 单元索引按年级×科目分，换了就失效
  }
  finderState.tahun = tahun;
  finderState.subjek = subjek;
}
function clearAllConditions() {
  finderState = { tahun: null, subjek: null, unit: null, objective: null, q: "" };
  finderQueryEl.value = "";
  renderFinder();
}

function renderFacet(container, options, activeValue, onPick) {
  container.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (opt.value === activeValue ? " active" : "");
    btn.textContent = opt.label;
    if (opt.disabled) {
      btn.disabled = true;
      btn.title = "这个科目还没有工具";
      container.appendChild(btn);
      return;
    }
    btn.addEventListener("click", () => {
      onPick(opt.value);
      renderFacets(); // 先让科目跟着年级校正，再写回 finderState
      applyFacetsToFinder();
      renderFinder();
    });
    container.appendChild(btn);
  });
}

// 科目筛选：有工具的排前面可以按；还没有工具的排后面、灰色按不到——不删掉，让老师看得出「这科还能开发」
// （2026-10-01 老师定）。科目跟着已选年级走；之前存的科目在新年级没有工具就回到「全部」。
// 年级目前每级都有工具，没工具的年级直接不列。
// 灰色只放「这个年级课纲里本来就有」的科目；课纲没有的（如 4 年级的科学与科技世界）不列，
// 不然会被误读成「可以开发」。年级分段依 docs/subjek-tahun.md（KSSR Semakan 2017，2026-07-21 查证）。
const SUBJECT_TAHUN = { am: [1], dst: [1, 2, 3], sains: [4, 5, 6], sejarah: [4, 5, 6], rbt: [4, 5, 6] };
function subjectOfferedIn(code, tahun) {
  return !tahun || tahun === "all" || !SUBJECT_TAHUN[code] || SUBJECT_TAHUN[code].includes(Number(tahun));
}
function withEmptySubjectsLast(available, tahun) {
  const codes = new Set(available.map((s) => s.code));
  const empty = SUBJECTS.filter((s) => !codes.has(s.code) && subjectOfferedIn(s.code, tahun));
  return [...available.map((s) => ({ ...s, empty: false })), ...empty.map((s) => ({ ...s, empty: true }))];
}
function publishedTools() {
  return TOOLS.filter((t) => t.status === "published" && !!t.url);
}
function renderFacets() {
  const tools = publishedTools();
  const grades = TAHUN.filter((t) => tools.some((tool) => matchesToolCoverage(tool, t, "all")));
  if (gradeFilter !== "all" && !grades.includes(Number(gradeFilter))) gradeFilter = "all";
  const subjects = SUBJECTS.filter((s) => tools.some((tool) => matchesToolCoverage(tool, gradeFilter, s.code)));
  if (subjekFilter !== "all" && !subjects.some((s) => s.code === subjekFilter)) subjekFilter = "all";
  renderFacet(
    gradeFacetEl,
    [{ value: "all", label: "全部" }, ...grades.map((t) => ({ value: t, label: `${t}年级` }))],
    gradeFilter,
    (v) => (gradeFilter = v)
  );
  renderFacet(
    subjekFacetEl,
    [{ value: "all", label: "全部" }, ...withEmptySubjectsLast(subjects, gradeFilter).map((s) => ({ value: s.code, label: s.title_zh, disabled: s.empty }))],
    subjekFilter,
    (v) => (subjekFilter = v)
  );
}

function tagChips(tool) {
  const chips = tool.coverage ? [tool.type, "1–6年级", "综合学科"] : [tool.type, `${tool.tahun}年级`, SUBJECT_BY_CODE[tool.subjek].title_zh];
  return chips.map((c) => `<span class="tag">${c}</span>`).join("");
}

function creatorHtml(tool) {
  const c = tool.creator;
  if (!c) return "";
  return `<div class="creator"><span class="creator__avatar">${c.initial}</span><span class="creator__name">${c.name}</span></div>`;
}

// 卡片与详情弹窗用 scripts/build-thumbs.py 产生的轻量 WebP（最长边 960px），
// 原图 PNG 动辄 0.5–2MB，只留给灯箱放大看。WebP 还没产生（新工具忘了跑脚本）就自动退回原图，不会破图。
function webThumb(img) {
  return img.replace(/^assets\/thumbs\//, "assets/thumbs-web/").replace(/\.(png|jpe?g|webp)$/i, ".webp");
}
function thumbImgHtml(shot, eager) {
  const fallback = `this.onerror=null;this.src='${shot.img}'`;
  return `<img src="${webThumb(shot.img)}" alt="${shot.label || ""}" loading="${eager ? "eager" : "lazy"}" decoding="async" onerror="${fallback}">`;
}

function cardHtml(tool, index) {
  const uses = getUses(tool.slug);
  const liked = hasLiked(tool.slug);
  const cover = tool.thumbnails && tool.thumbnails[0];
  return `
    <div class="card" data-slug="${tool.slug}">
      <div class="card__thumb">${cover
        ? (cover.img ? thumbImgHtml(cover, index < 4) : `<span>${cover.label}</span>`)
        : `<span>${subjectBadge(tool.subjek)}</span>`}${tool.hasLeaderboard
        ? `<a class="card__board" href="${tool.url}?board=1" target="_blank" rel="noopener" title="查看排行榜" aria-label="查看排行榜" onclick="event.stopPropagation()">${trophyIcon()}</a>`
        : ""}</div>
      <h3 class="card__title-zh">${tool.title_zh}</h3>
      <p class="card__title-bm">${tool.title_bm}</p>
      ${creatorHtml(tool) || '<div class="creator"></div>'}
      <div class="card__tags">${tagChips(tool)}</div>
      <div class="card__stats">
        <button class="card__like${liked ? " liked" : ""}" data-like-slug="${tool.slug}" title="不用登录，谁都能点">${starIcon()}<span class="card__like-count">${getLikes(tool)}</span> 人喜欢</button>
        <span class="card__uses">用过 ${uses} 次</span>
      </div>
    </div>`;
}

function matchesQuery(tool, query) {
  const haystack = [
    tool.title_zh, tool.title_bm, (tool.keywords || []).join(" "), tool.slug, tool.type,
    SUBJECT_BY_CODE[tool.subjek].title_zh, SUBJECT_BY_CODE[tool.subjek].title_bm,
    `tahun${tool.tahun}`, `${tool.tahun}年级`,
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function matchesToolCoverage(tool, tahun, subjek) {
  const rows = tool.coverage || [{tahun:tool.tahun,subjects:[tool.subjek]}];
  return rows.some(row => (!tahun || tahun === "all" || row.tahun === Number(tahun)) && (!subjek || subjek === "all" || row.subjects.includes(subjek)));
}
// 全页只有一个搜索框（「今天要教什么？」那个）：2026-10-01 前上下各有一个，老师分不清该用哪个。
// 它的文字同时筛这里的卡片；但已经选定单元/学习目标时，输入框里是 DSKP 文字不是工具名，不拿来筛卡片。
function boardQuery() {
  return finderState.unit ? "" : (finderState.q || "").toLowerCase();
}
function toolMatchesUnit(tool) {
  if (!finderState.unit) return true;
  return (tool.standards || []).some((s) => s.unitCode === finderState.unit &&
    (!finderState.objective || s.objectiveCodes.includes(finderState.objective)));
}
function boardTools() {
  const query = boardQuery();
  // 年级 AND 科目 AND 单元／学习目标 AND（没有查询词 OR 查询词匹配）
  // （年级科目与查询词要同时成立，见 docs/dskp-learning-objective-search.md 第7.1节／验收条件第2条）
  return publishedTools().filter((tool) =>
    matchesToolCoverage(tool, gradeFilter, subjekFilter) && toolMatchesUnit(tool) && (!query || matchesQuery(tool, query))
  );
}

// 卡片上方一行「目前条件」：让老师知道下面为什么只剩这几张，也能一键清掉
function renderBoardSummary(count) {
  const el = document.getElementById("boardSummary");
  if (!el) return;
  const parts = [];
  if (finderState.tahun) parts.push(`${finderState.tahun}年级`);
  if (finderState.subjek) parts.push(SUBJECT_BY_CODE[finderState.subjek].title_zh);
  const record = finderState.tahun && finderState.subjek && findDskpRecord(finderState.tahun, finderState.subjek);
  const unit = record && finderState.unit && getUnit(record, finderState.unit);
  if (unit) {
    const obj = finderState.objective && getObjective(unit, finderState.objective);
    parts.push(obj ? `${obj.code} ${obj.title_zh}` : `${unit.code} ${unit.title_zh}`);
  }
  if (boardQuery()) parts.push(`「${finderState.q}」`);
  if (!parts.length) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  el.innerHTML = `<span class="board__summary-count">显示 ${count} 个工具</span>` +
    parts.map((p) => `<span class="board__summary-tag">${p}</span>`).join("") +
    `<button type="button" class="finder__browse-link" id="boardClearAll">清除条件</button>`;
  document.getElementById("boardClearAll").addEventListener("click", clearAllConditions);
}
function renderBoard() {
  let list = boardTools();
  renderBoardSummary(list.length);

  // 喜欢数最多的排前面，是老师最先看到的
  list = list.slice().sort((a, b) => getLikes(b) - getLikes(a));

  boardEl.innerHTML = list.map((tool, i) => cardHtml(tool, i)).join("");
  boardEmptyEl.hidden = list.length > 0;
  boardEl.hidden = list.length === 0;

  boardEl.querySelectorAll(".card[data-slug]").forEach((el) => {
    el.addEventListener("click", () => {
      const tool = TOOLS.find((t) => t.slug === el.dataset.slug);
      if (tool) openDetail(tool);
    });
  });

  boardEl.querySelectorAll(".card__like[data-like-slug]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 不要连带打开详情弹窗
      const tool = TOOLS.find((t) => t.slug === btn.dataset.likeSlug);
      if (tool) toggleLike(tool);
    });
  });
}

// 支持 1 / 2 / 4 张缩略图三种版位：1 张整幅铺开，2 张左右对分，4 张 2x2 分割
// 点缩略图会打开放大灯箱，所以这里也记住当前这组图，供灯箱左右切换用
let lightboxShots = [];
let lightboxIndex = 0;

function renderGallery(thumbnails) {
  const el = document.getElementById("detailGallery");
  const shots = (thumbnails && thumbnails.length ? thumbnails : [{ label: "缩略图待补" }]).slice(0, 4);
  lightboxShots = shots;
  el.className = "detail__gallery detail__gallery--" + shots.length;
  el.innerHTML = shots.map((s, i) =>
    `<div class="detail__shot" data-index="${i}">${s.img ? thumbImgHtml(s, true) : `<span>${s.label || "缩略图待补"}</span>`}</div>`
  ).join("");
  el.querySelectorAll(".detail__shot").forEach((shotEl) => {
    shotEl.addEventListener("click", () => openLightbox(Number(shotEl.dataset.index)));
  });
}

function renderStandards(tool) {
  const el = document.getElementById("detailStandards");
  const resolved = resolveToolStandards(tool);
  if (!resolved.length) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  // 马来文／英文工具的课标内容用原文显示，中文译名不当主标题
  const inLanguage = tool.subjek === "bm" || tool.subjek === "bi";
  el.innerHTML = resolved.map((r) => `
    <div class="standards-block">
      <p class="detail__standards-title">对应课程标准 · DSKP（核对日期 ${r.record.verifiedAt}）</p>
      <p class="detail__standards-unit">${inLanguage ? `${r.unit.code} ${r.unit.title_bm}` : `${r.unit.code} ${r.unit.title_zh}（${r.unit.title_bm}）`}</p>
      <ul class="detail__standards-list">${r.objectives.map((o) => `<li>${o.code} ${inLanguage ? o.title_bm : o.title_zh}</li>`).join("")}</ul>
      <p class="detail__standards-source">来源：${r.record.sourceUrl ? `<a href="${r.record.sourceUrl}" target="_blank" rel="noopener">${r.record.sourceLabel}</a>` : r.record.sourceLabel}</p>
    </div>
  `).join("");
}

// 版本记录：老师反馈后每次调整都要在这里加一笔（新版本号+日期+简短说明），
// 不是覆盖旧版本资料，让老师能看到这个工具是怎么一步步改进的
function renderChangelog(tool) {
  const el = document.getElementById("detailChangelog");
  if (!tool.changelog || !tool.changelog.length) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  const rows = [...tool.changelog].reverse(); // 最新版本排最前面
  el.innerHTML = `
    <p class="detail__changelog-title">更新记录</p>
    <ul class="detail__changelog-list">
      ${rows.map((c) => `<li><span class="detail__changelog-version">v${c.version}</span> · ${c.date} · ${c.note}</li>`).join("")}
    </ul>
  `;
}

function openDetail(tool) {
  const detailUrl = new URL(window.location.href);
  detailUrl.searchParams.set("tool",tool.slug);
  window.history.replaceState(null,"",detailUrl);
  renderGallery(tool.thumbnails);
  document.getElementById("detailCreator").innerHTML = creatorHtml(tool);
  document.getElementById("detailTitleZh").textContent = tool.title_zh;
  document.getElementById("detailTitleBm").textContent = tool.title_bm;
  document.getElementById("detailDesc").textContent = tool.desc;
  renderStandards(tool);
  document.getElementById("detailSlug").textContent = tool.slug;
  document.getElementById("detailUses").textContent = `用过 ${getUses(tool.slug)} 次`;
  document.getElementById("detailVersion").textContent = tool.version ? `v${tool.version}` : "";
  renderChangelog(tool);

  const link = document.getElementById("detailOpenLink");
  if (tool.url) {
    link.href = `${tool.url}?kh=1`; // hub 已算过使用次数；工具端 data/track-use.js 看到 kh=1 会跳过并清掉它
    link.classList.remove("detail__open--disabled");
    link.textContent = "开始使用";
    link.onclick = () => { bumpUses(tool.slug); };
  } else {
    link.removeAttribute("href");
    link.classList.add("detail__open--disabled");
    link.textContent = "准备上线中";
    link.onclick = (e) => e.preventDefault();
  }

  document.getElementById("detailShareUrl").hidden = true;
  const qrBox = document.getElementById("detailShareQrBox");
  qrBox.hidden = true;
  qrBox.innerHTML = "";
  document.getElementById("detailShareLabel").textContent = "分享给学生";

  document.getElementById("detailModal").classList.add("open");
}

// ---------- 缩略图灯箱：点开放大，左右箭头/滑动切换 ----------
const lightboxEl = document.getElementById("lightbox");
const lightboxStageEl = document.getElementById("lightboxStage");

function paintLightbox() {
  const shot = lightboxShots[lightboxIndex];
  lightboxStageEl.innerHTML = shot.img
    ? `<img src="${shot.img}" alt="${shot.label || ""}">`
    : `<span>${shot.label || "缩略图待补"}</span>`;
}

function openLightbox(index) {
  lightboxIndex = index;
  paintLightbox();
  lightboxEl.classList.add("open");
}
function closeLightbox() { lightboxEl.classList.remove("open"); }
function lightboxStep(delta) {
  lightboxIndex = (lightboxIndex + delta + lightboxShots.length) % lightboxShots.length;
  paintLightbox();
}

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => lightboxStep(-1));
document.getElementById("lightboxNext").addEventListener("click", () => lightboxStep(1));
lightboxEl.addEventListener("click", (e) => { if (e.target === lightboxEl) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lightboxEl.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lightboxStep(-1);
  if (e.key === "ArrowRight") lightboxStep(1);
});

// 触屏左右滑动切换
let touchStartX = null;
lightboxStageEl.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; });
lightboxStageEl.addEventListener("touchend", (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) lightboxStep(dx > 0 ? -1 : 1);
  touchStartX = null;
});

function closeDetailModal() {
  const url = new URL(window.location.href); url.searchParams.delete("tool");
  window.history.replaceState(null,"",url);
  document.getElementById("detailModal").classList.remove("open");
  renderBoard(); // 关闭详情后刷新卡片上的使用次数
  renderStats();
}
document.getElementById("closeDetail").addEventListener("click", closeDetailModal);
// 点击框架外面的深色背景也要能关闭，不是非按打叉不可
document.getElementById("detailModal").addEventListener("click", (e) => {
  if (e.target.id === "detailModal") closeDetailModal();
});


// ============================================================
// 按学习目标找工具（主入口，阶段A） —— docs/dskp-learning-objective-search.md
// ============================================================
const finderTahunEl = document.getElementById("finderTahun");
const finderSubjekEl = document.getElementById("finderSubjek");
const finderQueryEl = document.getElementById("finderQuery");
const finderSuggestionsEl = document.getElementById("finderSuggestions");
const finderShortcutsEl = document.getElementById("finderShortcuts");
const finderStatusEl = document.getElementById("finderStatus");
const finderPathEl = document.getElementById("finderPath");
const finderUnitsEl = document.getElementById("finderUnits");
const finderResultsEl = document.getElementById("finderResults");

let finderState = { tahun: null, subjek: null, unit: null, objective: null, q: "" };

// 「常用入口」快捷方式；钱币有学习目标索引，其他几个当关键词搜索（见 renderFinderShortcuts）
const FINDER_SHORTCUTS = [
  { label: "钱币", tahun: 2, subjek: "mt", unit: "4.0" },
  { label: "分数" },
  { label: "时间" },
  { label: "读写" },
  { label: "词汇" },
];

finderTahunEl.innerHTML = '<option value="">选年级 Tahun</option>' +
  TAHUN.map((t) => `<option value="${t}">Tahun ${t}（${t}年级）</option>`).join("");

// 科目下拉：这个年级有东西的科目（有学习目标索引，或至少有一个已发布工具）排前面；
// 没有工具的排后面、灰色不能选——保留让老师知道还能开发。2026-10-01 前 12 科挂「整理中」又能选，选了走进死路。
function finderSubjectsFor(tahun) {
  return SUBJECTS.filter((s) => findDskpRecord(tahun, s.code) || finderToolsFor(tahun, s.code).length);
}
function finderToolsFor(tahun, subjek) {
  return publishedTools().filter((t) => matchesToolCoverage(t, tahun, subjek));
}
function fillFinderSubjekOptions() {
  finderSubjekEl.dataset.tahun = String(finderState.tahun || "");
  finderSubjekEl.disabled = false;
  finderSubjekEl.innerHTML = '<option value="">选科目 Subjek</option>' +
    withEmptySubjectsLast(finderSubjectsFor(finderState.tahun), finderState.tahun).map((s) =>
      s.empty ? `<option value="${s.code}" disabled>${s.title_zh}</option>` : `<option value="${s.code}">${s.title_zh}</option>`
    ).join("");
}

// 常用入口：有学习目标索引的直接跳到那个单元；没有索引的当关键词搜索（同时筛下方卡片）。
// 搜不到任何工具的入口不显示——不放点了只会看到「整理中」的按钮。
function shortcutHasTools(s) {
  if (s.tahun && findDskpRecord(s.tahun, s.subjek)) return true;
  const q = s.label.toLowerCase();
  return publishedTools().some((t) => matchesQuery(t, q));
}
function renderFinderShortcuts() {
  const shortcuts = FINDER_SHORTCUTS.filter(shortcutHasTools);
  finderShortcutsEl.parentElement.hidden = !shortcuts.length;
  finderShortcutsEl.innerHTML = shortcuts.map((s, i) => `<button type="button" class="chip" data-idx="${i}">${s.label}</button>`).join("");
  finderShortcutsEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = shortcuts[Number(btn.dataset.idx)];
      if (s.tahun && findDskpRecord(s.tahun, s.subjek)) {
        finderState = { tahun: s.tahun, subjek: s.subjek, unit: s.unit || null, objective: null, q: "" };
        finderQueryEl.value = "";
      } else {
        // 关键词入口看全部年级科目，不然会被残留条件挡成「没有相符」
        finderState = { tahun: null, subjek: null, unit: null, objective: null, q: s.label };
        finderQueryEl.value = s.label;
      }
      renderFinder();
    });
  });
}

function renderFinderStatus() {
  if (!finderState.tahun || !finderState.subjek) { finderStatusEl.hidden = true; return; }
  const record = findDskpRecord(finderState.tahun, finderState.subjek);
  if (record) { finderStatusEl.hidden = true; return; }
  // 有工具但还没建学习目标索引：如实说「还没按学习目标细分」，同时给出能用的工具，不让老师停在死路
  const n = finderToolsFor(finderState.tahun, finderState.subjek).length;
  finderStatusEl.hidden = false;
  finderStatusEl.innerHTML = `${finderState.tahun}年级${SUBJECT_BY_CODE[finderState.subjek].title_zh}目前有 ${n} 个工具，还没按学习目标细分。<button type="button" class="finder__browse-link" id="finderBrowseLink">看这 ${n} 个工具</button>`;
  const linkBtn = document.getElementById("finderBrowseLink");
  if (linkBtn) linkBtn.addEventListener("click", scrollToBoard);
}

function renderFinderPath() {
  if (!finderState.tahun) { finderPathEl.hidden = true; return; }
  const parts = [`Tahun ${finderState.tahun}`];
  if (finderState.subjek) parts.push(SUBJECT_BY_CODE[finderState.subjek].title_zh);
  const record = finderState.subjek && findDskpRecord(finderState.tahun, finderState.subjek);
  if (record && finderState.unit) {
    const unit = getUnit(record, finderState.unit);
    if (unit) {
      parts.push(`${unit.code} ${unit.title_zh}`);
      if (finderState.objective) {
        const obj = getObjective(unit, finderState.objective);
        if (obj) parts.push(`${obj.code} ${obj.title_zh}`);
      }
    }
  }
  finderPathEl.hidden = false;
  finderPathEl.textContent = "当前路径：" + parts.join(" › ");
}

function renderFinderUnits() {
  const record = finderState.subjek && findDskpRecord(finderState.tahun, finderState.subjek);
  if (!record) { finderUnitsEl.hidden = true; finderUnitsEl.innerHTML = ""; return; }
  finderUnitsEl.hidden = false;
  finderUnitsEl.innerHTML = record.units.map((u) => `
    <div class="finder-unit">
      <button type="button" class="finder-unit__head${finderState.unit === u.code ? " active" : ""}" data-unit="${u.code}">${u.code} ${u.title_zh}</button>
      <div class="finder-unit__objectives">
        ${u.objectives.map((o) => `<button type="button" class="finder-objective${finderState.objective === o.code ? " active" : ""}" data-unit="${u.code}" data-objective="${o.code}">${o.code} ${o.title_zh}</button>`).join("")}
      </div>
    </div>`).join("");
  finderUnitsEl.querySelectorAll(".finder-unit__head").forEach((btn) => {
    btn.addEventListener("click", () => {
      finderState.unit = btn.dataset.unit;
      finderState.objective = null;
      renderFinder();
    });
  });
  finderUnitsEl.querySelectorAll(".finder-objective").forEach((btn) => {
    btn.addEventListener("click", () => {
      finderState.unit = btn.dataset.unit;
      finderState.objective = btn.dataset.objective;
      renderFinder();
    });
  });
}

function toolMatchesFinder(tool) {
  if (tool.status !== "published") return false; // 示例作品不出现在「按学习目标找工具」结果里
  if (!matchesToolCoverage(tool, finderState.tahun, finderState.subjek)) return false;
  let unitOrObjectiveSelected = false;
  if (finderState.unit) {
    const coversUnit = (tool.standards || []).some((s) => s.unitCode === finderState.unit);
    if (!coversUnit) return false;
    if (finderState.objective) {
      const coversObjective = (tool.standards || []).some((s) => s.unitCode === finderState.unit && s.objectiveCodes.includes(finderState.objective));
      if (!coversObjective) return false;
    }
    unitOrObjectiveSelected = true;
  }
  // 已经选定单元/学习目标时，查询词只是保留在输入框给使用者看（规格要求），不再拿它去比对工具
  // 标题/关键词——它本来就是 DSKP 单元/目标的文字，不是工具名，用它过滤会把刚匹配到的工具筛掉。
  if (finderState.q && !unitOrObjectiveSelected) {
    const q = finderState.q.toLowerCase();
    const hay = [tool.title_zh, tool.title_bm, ...(tool.keywords || [])].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function finderResultCardHtml(tool) {
  const resolved = resolveToolStandards(tool);
  const objectives = finderState.objective
    ? resolved.flatMap((r) => r.objectives.filter((o) => o.code === finderState.objective))
    : resolved.flatMap((r) => r.objectives);
  const objLabel = objectives.map((o) => `${o.code} ${o.title_zh}`).join("、");
  const unitPart = resolved.map((r) => `${r.unit.code} ${r.unit.title_zh}`).join("；");
  const verifiedAt = resolved[0] ? resolved[0].record.verifiedAt : "";
  // 截取档没有审核（record.reviewed === false），不能写成「已核对」
  const unreviewed = resolved[0] && resolved[0].record.reviewed === false;
  return `
    <div class="finder-card" data-slug="${tool.slug}">
      <h4>${tool.title_zh} <span class="finder-card__bm">${tool.title_bm}</span></h4>
      <dl class="finder-card__meta">
        <div><dt>对应学习目标</dt><dd>Tahun ${tool.tahun} ${SUBJECT_BY_CODE[tool.subjek].title_zh} · ${unitPart}${objLabel ? " · " + objLabel : ""}</dd></div>
        <div><dt>可练习什么</dt><dd>${tool.practiceSummary || "—"}</dd></div>
        <div><dt>课堂方式</dt><dd>${(tool.teachingMode || []).join("、") || "—"}</dd></div>
        <div><dt>准备条件</dt><dd>${tool.prep || "—"}</dd></div>
        <div><dt>DSKP 核对状态</dt><dd>${unreviewed ? `已对照 · ${verifiedAt}` : `已核对 · ${verifiedAt}`}</dd></div>
      </dl>
    </div>`;
}

// 还没选年级＋科目、只打了关键词时：告诉老师下方卡片已经按关键词筛好，给一个跳过去的按钮
function renderFinderQueryJump() {
  const n = boardTools().length;
  const q = boardQuery();
  const hiddenByFacets = n ? 0 : publishedTools().filter((t) => matchesQuery(t, q)).length;
  if (n) {
    finderResultsEl.innerHTML = `<p class="finder__count">找到 ${n} 个名称相符的工具 <button type="button" class="finder__browse-link" id="finderJumpBoard">跳到工具</button></p>`;
  } else if (hiddenByFacets) {
    // 工具其实有，只是被目前选的年级／科目挡住——明说，并给一键清除
    finderResultsEl.innerHTML = `<p class="finder__count">有 ${hiddenByFacets} 个工具相符，但不在目前选的年级／科目里。<button type="button" class="finder__browse-link" id="finderClearFacets">不限年级科目再找</button></p>`;
  } else {
    finderResultsEl.innerHTML = `<p class="finder__empty">没有名称相符的工具，换个关键词，或从下拉建议选学习目标。</p>`;
  }
  const btn = document.getElementById("finderJumpBoard");
  if (btn) btn.addEventListener("click", scrollToBoard);
  const clear = document.getElementById("finderClearFacets");
  if (clear) clear.addEventListener("click", () => { finderState.tahun = null; finderState.subjek = null; renderFinder(); });
}

function renderFinderResults() {
  if (!finderState.tahun || !finderState.subjek) {
    if (finderState.q) renderFinderQueryJump(); else finderResultsEl.innerHTML = "";
    return;
  }
  const record = findDskpRecord(finderState.tahun, finderState.subjek);
  if (!record) { finderResultsEl.innerHTML = ""; return; }
  if (!finderState.unit && !finderState.q) {
    finderResultsEl.innerHTML = '<p class="finder__hint">在上面选一个单元或学习目标缩小范围；下方已经列出这个年级科目的全部工具。</p>';
    return;
  }
  const matches = TOOLS.filter(toolMatchesFinder);
  if (!matches.length) {
    finderResultsEl.innerHTML = `
      <p class="finder__empty">这个学习目标目前还没有工具。</p>
      <button type="button" class="finder__wish-cta" id="finderWishCta">找不到合适工具？告诉我们这堂课卡在哪里</button>`;
    const cta = document.getElementById("finderWishCta");
    if (cta) cta.addEventListener("click", openWishFromFinder);
    return;
  }
  finderResultsEl.innerHTML = `<p class="finder__count">找到 ${matches.length} 个工具</p>` + matches.map(finderResultCardHtml).join("");
  finderResultsEl.querySelectorAll(".finder-card").forEach((card) => {
    card.addEventListener("click", () => {
      const tool = TOOLS.find((t) => t.slug === card.dataset.slug);
      if (tool) openDetail(tool);
    });
  });
}

function renderFinderSuggestions() {
  const q = finderState.q.toLowerCase();
  if (!q) { finderSuggestionsEl.hidden = true; finderSuggestionsEl.innerHTML = ""; return; }

  const suggestions = [];
  (typeof DSKP_INDEX !== "undefined" ? DSKP_INDEX : []).forEach((record) => {
    if (finderState.tahun && record.tahun !== finderState.tahun) return;
    if (finderState.subjek && record.subjek !== finderState.subjek) return;
    record.units.forEach((u) => {
      const uHay = `${u.code} ${u.title_zh} ${u.title_bm}`.toLowerCase();
      if (uHay.includes(q)) suggestions.push({ type: "unit", label: `${u.code} ${u.title_zh}`, record, unit: u });
      u.objectives.forEach((o) => {
        const oHay = [o.code, o.title_zh, o.title_bm, ...(o.terms || [])].join(" ").toLowerCase();
        if (oHay.includes(q)) suggestions.push({ type: "objective", label: `${o.code} ${o.title_zh}`, record, unit: u, objective: o });
      });
    });
  });
  TOOLS.filter((t) => t.status === "published").forEach((tool) => {
    const hay = [tool.title_zh, tool.title_bm, ...(tool.keywords || [])].join(" ").toLowerCase();
    if (hay.includes(q)) suggestions.push({ type: "tool", label: tool.title_zh, tool });
  });

  const order = { objective: 0, unit: 1, tool: 2 };
  suggestions.sort((a, b) => order[a.type] - order[b.type]);
  // 相同项目只显示一次
  const seen = new Set();
  const deduped = suggestions.filter((s) => {
    const key = s.type + ":" + s.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const top = deduped.slice(0, 5);

  if (!top.length) { finderSuggestionsEl.hidden = true; finderSuggestionsEl.innerHTML = ""; return; }
  const typeLabel = { unit: "单元", objective: "学习目标", tool: "工具" };
  finderSuggestionsEl.hidden = false;
  finderSuggestionsEl.innerHTML = top.map((s, i) =>
    `<button type="button" class="finder__suggestion" data-idx="${i}" role="option"><span class="finder__suggestion-type">${typeLabel[s.type]}</span>${s.label}</button>`
  ).join("");
  finderSuggestionsEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = top[Number(btn.dataset.idx)];
      if (s.type === "unit") {
        finderState.tahun = s.record.tahun; finderState.subjek = s.record.subjek;
        finderState.unit = s.unit.code; finderState.objective = null;
      } else if (s.type === "objective") {
        finderState.tahun = s.record.tahun; finderState.subjek = s.record.subjek;
        finderState.unit = s.unit.code; finderState.objective = s.objective.code;
      } else if (s.type === "tool") {
        finderSuggestionsEl.hidden = true;
        openDetail(s.tool);
        return;
      }
      finderSuggestionsEl.hidden = true;
      renderFinder();
    });
  });
}

function updateFinderUrl() {
  const params = new URLSearchParams();
  const activeTool = new URLSearchParams(window.location.search).get("tool");
  if (activeTool) params.set("tool",activeTool);
  if (finderState.tahun) params.set("tahun", finderState.tahun);
  if (finderState.subjek) params.set("subjek", finderState.subjek);
  if (finderState.unit) params.set("unit", finderState.unit);
  if (finderState.objective) params.set("objective", finderState.objective);
  if (finderState.q) params.set("q", finderState.q);
  const qs = params.toString();
  window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
}

function loadFinderFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tahunRaw = Number(params.get("tahun"));
  const subjekRaw = params.get("subjek");
  const unitRaw = params.get("unit");
  const objectiveRaw = params.get("objective");
  const q = params.get("q") || "";

  const validTahun = TAHUN.includes(tahunRaw) ? tahunRaw : null;
  const validSubjek = finderSubjectsFor(validTahun).some((s) => s.code === subjekRaw) ? subjekRaw : null;
  const record = validTahun && validSubjek ? findDskpRecord(validTahun, validSubjek) : null;
  let validUnit = null, validObjective = null;
  if (record && unitRaw) {
    const u = getUnit(record, unitRaw);
    if (u) {
      validUnit = u.code;
      if (objectiveRaw && getObjective(u, objectiveRaw)) validObjective = objectiveRaw;
    }
  }
  finderState = { tahun: validTahun, subjek: validSubjek, unit: validUnit, objective: validObjective, q };
  finderQueryEl.value = q;
}

function renderFinder() {
  finderTahunEl.value = finderState.tahun || "";

  // 科目下拉不再要求先选年级——下方科目按钮本来就能单选科目，两边要能表达同一种状态
  if (finderSubjekEl.dataset.tahun !== String(finderState.tahun || "")) fillFinderSubjekOptions();
  finderSubjekEl.value = finderState.subjek || "";

  renderFinderStatus();
  renderFinderPath();
  renderFinderUnits();
  renderFinderResults();
  updateFinderUrl();
  syncFacetsFromFinder();
  renderFacets();
  renderBoard();
}

finderTahunEl.addEventListener("change", () => {
  finderState.tahun = finderTahunEl.value ? Number(finderTahunEl.value) : null;
  if (finderState.subjek && !finderSubjectsFor(finderState.tahun).some((s) => s.code === finderState.subjek)) finderState.subjek = null;
  finderState.unit = null; finderState.objective = null;
  renderFinder();
});
finderSubjekEl.addEventListener("change", () => {
  finderState.subjek = finderSubjekEl.value || null;
  finderState.unit = null; finderState.objective = null;
  renderFinder();
});
finderQueryEl.addEventListener("input", () => {
  finderState.q = finderQueryEl.value.trim();
  renderFinderSuggestions();
  renderFinderResults();
  updateFinderUrl();
  renderBoard();
});
document.addEventListener("click", (e) => {
  if (!finderSuggestionsEl.contains(e.target) && e.target !== finderQueryEl) finderSuggestionsEl.hidden = true;
});
// 下拉建议会盖住下面的「跳到工具」：Enter＝收起建议、直接看下方卡片（还没选年级科目时）；Esc＝只收起建议
finderQueryEl.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { finderSuggestionsEl.hidden = true; return; }
  if (e.key !== "Enter") return;
  e.preventDefault();
  finderSuggestionsEl.hidden = true;
  finderQueryEl.blur(); // 手机上顺便收起键盘
  if (finderState.q && !(finderState.tahun && finderState.subjek) && boardTools().length) {
    scrollToBoard();
  }
});

// ============================================================
// 点子许愿池：三步结构化需求单 —— docs/idea-wish-pool-spec.md
// ============================================================
const DESIRED_HELP = [
  { id: "classroom-interactive", label: "课堂互动工具" },
  { id: "practice-game", label: "练习或小游戏" },
  { id: "presentation-aid", label: "投影讲解辅助" },
  { id: "group-activity", label: "分组活动" },
  { id: "printable", label: "可打印材料" },
  { id: "utility", label: "随机抽选或计时工具" },
  { id: "unsure", label: "还不确定" },
];
// 10-09 首批 10 份许愿：困难／限制标签和文字常互相矛盾，「希望怎样使用」和「限制」也互相打架，
// 所以改成单选的设备题；储存值沿用 USAGE_MODES 的 id，写进 usage_modes（单一元素）
const DEVICE_OPTIONS = [
  { id: "whole-class", label: "只有老师电脑＋投影" },
  { id: "pair-group", label: "学生几人共用一台平板／电脑" },
  { id: "independent", label: "学生每人一台平板／电脑" },
  { id: "no-device", label: "完全没有设备（要打印或用实物）" },
];

const wishSelections = {
  device: { value: null },
  desiredHelp: { value: null },
};

function renderRadioOptions(container, options, stateRef) {
  container.innerHTML = options.map((o) => `<button type="button" class="wish-chip wish-chip--radio${stateRef.value === o.id ? " active" : ""}" data-id="${o.id}">${o.label}</button>`).join("");
  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      stateRef.value = btn.dataset.id;
      container.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      wishSubmitBtn.disabled = !validateWishStep(3); // 选完帮助类型／设备要立刻重新判断送出按钮能不能按
    });
  });
}

const wishTahunEl = document.getElementById("wishTahun");
const wishSubjekEl = document.getElementById("wishSubjek");
wishTahunEl.innerHTML = '<option value="">选年级</option>' + TAHUN.map((t) => `<option value="${t}">Tahun ${t}（${t}年级）</option>`).join("");
function fillWishSubjekOptions() {
  wishSubjekEl.disabled = false;
  wishSubjekEl.innerHTML = '<option value="">选科目</option>' + SUBJECTS.map((s) => `<option value="${s.code}">${s.title_zh}</option>`).join("");
}
wishTahunEl.addEventListener("change", () => {
  if (wishTahunEl.value) fillWishSubjekOptions();
  else { wishSubjekEl.innerHTML = '<option value="">先选年级</option>'; wishSubjekEl.disabled = true; }
});

let wishCurrentStep = 1;
const wishStepEls = { 1: document.getElementById("wishStep1"), 2: document.getElementById("wishStep2"), 3: document.getElementById("wishStep3") };
const wishProgressEl = document.getElementById("wishProgress");
const wishBackBtn = document.getElementById("wishBack");
const wishNextBtn = document.getElementById("wishNext");
const wishSubmitBtn = document.getElementById("wishSubmit");
const WISH_STEP_LABELS = { 1: "这堂课", 2: "学生卡在哪里", 3: "你希望怎样帮上忙" };

function showWishStep(step) {
  wishCurrentStep = step;
  [1, 2, 3].forEach((s) => { wishStepEls[s].hidden = s !== step; });
  wishProgressEl.textContent = `第 ${step}／3 步：${WISH_STEP_LABELS[step]}`;
  wishBackBtn.hidden = step === 1;
  wishNextBtn.hidden = step === 3;
  wishSubmitBtn.hidden = step !== 3;
  updateWishNextButton();
  if (step === 3) wishSubmitBtn.disabled = !validateWishStep(3);
}

function validateWishStep(step) {
  if (step === 1) {
    const val = document.getElementById("wishLearningGoal").value.trim();
    const errEl = document.getElementById("wishLearningGoalError");
    const lenOk = val.length >= 8;
    errEl.hidden = lenOk;
    errEl.textContent = "至少需要 8 个字，说说学生这堂课要学会什么。";
    return !!wishTahunEl.value && !!wishSubjekEl.value && lenOk;
  }
  if (step === 2) {
    const task = document.getElementById("wishTask").value.trim();
    const taskErrEl = document.getElementById("wishTaskError");
    const taskOk = task.length >= 4;
    taskErrEl.hidden = taskOk;
    taskErrEl.textContent = "写出是哪一题或哪个活动，例如「听写 10 个水果词」。";
    const val = document.getElementById("wishProblem").value.trim();
    const errEl = document.getElementById("wishProblemError");
    const lenOk = val.length >= 10;
    errEl.hidden = lenOk;
    errEl.textContent = "再具体一点，至少 10 个字：学生写了什么、说了什么？";
    return taskOk && lenOk;
  }
  if (step === 3) {
    return !!wishSelections.desiredHelp.value && !!wishSelections.device.value && document.getElementById("wishConsent").checked;
  }
  return true;
}

document.getElementById("wishLearningGoal").addEventListener("blur", () => validateWishStep(1));
document.getElementById("wishTask").addEventListener("blur", () => validateWishStep(2));
document.getElementById("wishProblem").addEventListener("blur", () => validateWishStep(2));

wishNextBtn.addEventListener("click", async () => {
  if (!validateWishStep(wishCurrentStep)) return;
  if (wishCurrentStep === 1 && !currentSession) {
    await startGoogleLogin(2); // 第1步一填完就顺手带去登录，回来自动接着第2步，不用另外等到最后才登录
    return;
  }
  showWishStep(wishCurrentStep + 1);
});
wishBackBtn.addEventListener("click", () => showWishStep(wishCurrentStep - 1));

// ---------- 老师登录（Supabase Auth + Google 登录）----------
// 设计原则：登录尽量提早、顺路发生，不要求老师先登录才能开始填表。
// 第1步一填完，「下一步」按钮本身就是登录入口——没登录会先跳去 Google，
// 授权完跳回来后自动恢复到第2步继续填，不会让已经填好的内容不见。
let currentSession = null;

const wishLoginStatusEl = document.getElementById("wishLoginStatus");
document.getElementById("wishConsent").addEventListener("change", () => {
  wishSubmitBtn.disabled = !validateWishStep(3);
});

const authLoginBtn = document.getElementById("authLoginBtn");
const authSignedInEl = document.getElementById("authSignedIn");
const authEmailEl = document.getElementById("authEmail");
const authLogoutBtn = document.getElementById("authLogoutBtn");

function updateAuthStatusUI() {
  authLoginBtn.hidden = !!currentSession;
  authSignedInEl.hidden = !currentSession;
  if (currentSession) authEmailEl.textContent = currentSession.user.email || "已登录";
}

function updateWishNextButton() {
  if (wishCurrentStep === 1 && !currentSession) {
    wishNextBtn.innerHTML = `<svg class="auth-status__g" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.91c1.7-1.57 2.69-3.88 2.69-6.64z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.27c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.65 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l2.99 2.33C4.66 5.16 6.65 3.58 9 3.58z"/></svg>下一步 · 用 Google 登录`;
  } else {
    wishNextBtn.textContent = "下一步";
  }
}

async function startGoogleLogin(resumeStep) {
  saveWishResumeState(resumeStep);
  wishNextBtn.disabled = true;
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
  if (error) {
    clearWishResumeState();
    wishNextBtn.disabled = false;
    console.error("Google 登录失败", error);
    showToast("Google 登录暂时无法使用，请稍后再试。", "error");
  }
  // 成功的话浏览器会直接跳转到 Google，不会执行到这里之后
}

authLoginBtn.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
  if (error) { console.error("Google 登录失败", error); showToast("Google 登录暂时无法使用，请稍后再试。", "error"); }
});
authLogoutBtn.addEventListener("click", async () => { await supabaseClient.auth.signOut(); });

// ---------- 第1步登录跳转的「回来后继续填」：存/取暂存的表单进度 ----------
const WISH_RESUME_KEY = "kongsi-idea-wish-resume-v1";
const WISH_RESUME_TTL = 60 * 60 * 1000; // 只需要撑过「跳到 Google 授权再跳回来」这段时间，1小时足够

function collectWishResumeState(step) {
  return {
    step,
    tahun: wishTahunEl.value || null,
    subjek: wishSubjekEl.value || null,
    unitObjective: document.getElementById("wishUnitObjective").value,
    learningGoal: document.getElementById("wishLearningGoal").value,
    lessonMoment: document.getElementById("wishLessonMoment").value,
    problemTask: document.getElementById("wishTask").value,
    problemDescription: document.getElementById("wishProblem").value,
    problemCause: document.getElementById("wishCause").value,
    triedAlready: document.getElementById("wishTried").value,
    desiredHelp: wishSelections.desiredHelp.value,
    device: wishSelections.device.value,
    classroomContext: document.getElementById("wishContext").value,
  };
}
function saveWishResumeState(step) {
  localStorage.setItem(WISH_RESUME_KEY, JSON.stringify({ state: collectWishResumeState(step), savedAt: Date.now() }));
}
function loadWishResumeState() {
  try {
    const raw = localStorage.getItem(WISH_RESUME_KEY);
    if (!raw) return null;
    const { state, savedAt } = JSON.parse(raw);
    if (Date.now() - (savedAt || 0) > WISH_RESUME_TTL) { clearWishResumeState(); return null; }
    return state;
  } catch (e) { return null; }
}
function clearWishResumeState() { localStorage.removeItem(WISH_RESUME_KEY); }

// 恢复暂存／登录跳转回来时共用；10-09 前存的旧草稿没有 problemTask／device，留空让老师补
function applyWishTextFields(saved) {
  document.getElementById("wishTask").value = saved.problemTask || "";
  document.getElementById("wishProblem").value = saved.problemDescription || "";
  document.getElementById("wishCause").value = saved.problemCause || "";
  document.getElementById("wishTried").value = saved.triedAlready || "";
  document.getElementById("wishContext").value = saved.classroomContext || "";
  wishSelections.desiredHelp.value = saved.desiredHelp || null;
  wishSelections.device.value = saved.device || null;
  renderWishRadios();
}
function renderWishRadios() {
  renderRadioOptions(document.getElementById("wishDesiredHelp"), DESIRED_HELP, wishSelections.desiredHelp);
  renderRadioOptions(document.getElementById("wishDevice"), DEVICE_OPTIONS, wishSelections.device);
}

function applyWishResumeState(state) {
  if (state.tahun) { wishTahunEl.value = state.tahun; fillWishSubjekOptions(); }
  if (state.subjek) wishSubjekEl.value = state.subjek;
  document.getElementById("wishUnitObjective").value = state.unitObjective || "";
  document.getElementById("wishLearningGoal").value = state.learningGoal || "";
  document.getElementById("wishLessonMoment").value = state.lessonMoment || "";
  applyWishTextFields(state);
}

async function tryResumeWishFlow() {
  if (!currentSession) return;
  const state = loadWishResumeState();
  if (!state) return;
  clearWishResumeState();
  resetWishForm();
  applyWishResumeState(state);
  document.getElementById("wishModal").classList.add("open");
  showWishStep(state.step);
}

// ---------- 第3步送出前万一还没登录的保险（正常情况下第1步就已经登录过）----------
const WISH_PENDING_SUBMIT_KEY = "kongsi-idea-wish-pending-submit-v1";
const PENDING_SUBMIT_TTL = 60 * 60 * 1000;

function savePendingSubmit(payload) {
  localStorage.setItem(WISH_PENDING_SUBMIT_KEY, JSON.stringify({ payload, savedAt: Date.now() }));
}
function loadPendingSubmit() {
  try {
    const raw = localStorage.getItem(WISH_PENDING_SUBMIT_KEY);
    if (!raw) return null;
    const { payload, savedAt } = JSON.parse(raw);
    if (Date.now() - (savedAt || 0) > PENDING_SUBMIT_TTL) { clearPendingSubmit(); return null; }
    return payload;
  } catch (e) { return null; }
}
function clearPendingSubmit() { localStorage.removeItem(WISH_PENDING_SUBMIT_KEY); }

async function tryAutoSubmitPending() {
  if (!currentSession) return;
  const pending = loadPendingSubmit();
  if (!pending) return;
  const error = await submitWishPayload(pending);
  if (error) {
    console.error("自动送出失败", error);
    showToast("欢迎回来！但刚才自动送出时出了点问题，麻烦重新打开点子许愿池再送一次。", "error");
    return;
  }
  clearPendingSubmit();
  showToast("欢迎回来！你之前填的点子已经自动帮你送出了，谢谢分享。");
}

async function handleAuthChange() {
  updateAuthStatusUI();
  updateWishNextButton();
  if (wishCurrentStep === 3) wishSubmitBtn.disabled = !validateWishStep(3);
  // 先登记再做别的：许愿恢复／自动送出一旦出错，排在后面的登记就不会跑。
  // 2026-10-09 发现 107 位老师漏登记，这是最可能的原因之一（已补登）
  try { await ensureProfileRow(); } catch (e) { console.error("登记老师失败", e); }
  try { await tryResumeWishFlow(); } catch (e) { console.error("恢复许愿流程失败", e); }
  try { await tryAutoSubmitPending(); } catch (e) { console.error("自动送出失败", e); }
  await refreshTeacherCount();
}

function initAuth() {
  // 不用自己猜「什么时候该查一次 getSession()」，Google 登录用的 PKCE 流程回来时
  // 网址里的 ?code=... 要靠 SDK 异步换成真正的登录状态，这段时机很容易抢跑。
  // onAuthStateChange 保证的 INITIAL_SESSION 事件才是「SDK 真的处理完了」的信号，
  // 每次新增监听都会收到一次，不管是刚登录完回来、还是单纯重新整理页面都适用。
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentSession = session;
    await handleAuthChange();
  });
}

// 从州属/县/学校三个 select + 手动输入栏读出学校资料，对应 docs/idea-wish-pool-spec.md 第6.1节
function collectWishSchool() {
  if (!stateSelect) return { state: null, district: null, name: null, source: null };
  const state = stateSelect.value || null;
  const district = districtSelect.value || null;
  if (schoolSelect.value === "__manual__") {
    const manual = schoolManual.value.trim();
    return { state, district, name: manual || null, source: manual ? "manual" : null };
  }
  if (schoolSelect.value) return { state, district, name: schoolSelect.value, source: "directory" };
  return { state, district, name: null, source: null };
}

// 错例拆成两三格填，存回原本的 problem_description 一栏（不改表结构），后台照行显示
function composeWishProblem() {
  const cause = document.getElementById("wishCause").value.trim();
  return [
    `题目／活动：${document.getElementById("wishTask").value.trim()}`,
    `学生表现：${document.getElementById("wishProblem").value.trim()}`,
    cause && `老师判断原因：${cause}`,
  ].filter(Boolean).join("\n");
}

function collectWishPayload() {
  const school = collectWishSchool();
  return {
    tahun: wishTahunEl.value ? Number(wishTahunEl.value) : null,
    subjek: wishSubjekEl.value || null,
    unit_objective: document.getElementById("wishUnitObjective").value || null,
    learning_goal: document.getElementById("wishLearningGoal").value.trim(),
    lesson_moment: document.getElementById("wishLessonMoment").value || null,
    problem_description: composeWishProblem(),
    difficulty_tags: [],
    tried_already: document.getElementById("wishTried").value || null,
    constraints: [],
    desired_help: wishSelections.desiredHelp.value,
    usage_modes: wishSelections.device.value ? [wishSelections.device.value] : [],
    must_have_or_avoid: null,
    classroom_context: document.getElementById("wishContext").value || null,
    school_state: school.state,
    school_district: school.district,
    school_name: school.name,
    school_source: school.source,
  };
}

async function submitWishPayload(payload) {
  const { error } = await supabaseClient.from("wishes").insert({ ...payload, teacher_id: currentSession.user.id });
  return error;
}

document.getElementById("wishForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateWishStep(3)) return; // 按钮本来就该是 disabled，这里保险再挡一次

  const payload = collectWishPayload();

  if (!currentSession) {
    // 正常流程第1步就已登录，这里是万一（例如登录状态过期）的保险
    wishSubmitBtn.disabled = true;
    wishSubmitBtn.textContent = "正在跳转 Google 登录……";
    savePendingSubmit(payload);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
    if (error) {
      clearPendingSubmit();
      wishSubmitBtn.disabled = false;
      wishSubmitBtn.textContent = "送出点子";
      wishLoginStatusEl.textContent = "Google 登录暂时无法使用，请稍后再试。";
    }
    return;
  }

  wishSubmitBtn.disabled = true;
  wishSubmitBtn.textContent = "正在送出……";
  wishLoginStatusEl.textContent = "";

  const error = await submitWishPayload(payload);
  if (error) {
    console.error("许愿单送出失败", error);
    wishSubmitBtn.disabled = false;
    wishSubmitBtn.textContent = "送出点子";
    showToast("送出失败，请检查网络后再试一次。", "error");
    return;
  }

  clearDraft();
  document.getElementById("wishModal").classList.remove("open");
  showToast("点子已经放进铺里。我们会先和相似需求放在一起看看，再评估最能帮到课堂的做法。");
  resetWishForm();
});

const WISH_DRAFT_KEY = "classroom-idea-shop-wish-draft-v1";

function collectWishDraft() {
  return {
    tahun: wishTahunEl.value || null,
    subjek: wishSubjekEl.value || null,
    unitObjective: document.getElementById("wishUnitObjective").value,
    learningGoal: document.getElementById("wishLearningGoal").value,
    lessonMoment: document.getElementById("wishLessonMoment").value,
    problemTask: document.getElementById("wishTask").value,
    problemDescription: document.getElementById("wishProblem").value,
    problemCause: document.getElementById("wishCause").value,
    triedAlready: document.getElementById("wishTried").value,
    desiredHelp: wishSelections.desiredHelp.value,
    device: wishSelections.device.value,
    classroomContext: document.getElementById("wishContext").value,
    savedAt: Date.now(),
  };
  // 按规格 3.2：不暂存学校资料和隐私确认
}
function hasDraftContent() {
  const d = collectWishDraft();
  return !!(d.learningGoal || d.problemTask || d.problemDescription || d.problemCause || d.tahun || d.subjek || d.unitObjective || d.triedAlready || d.desiredHelp || d.device || d.classroomContext);
}
function saveDraft() { localStorage.setItem(WISH_DRAFT_KEY, JSON.stringify(collectWishDraft())); }
function clearDraft() { localStorage.removeItem(WISH_DRAFT_KEY); }
function loadDraft() {
  try {
    const raw = localStorage.getItem(WISH_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - (draft.savedAt || 0) > THIRTY_DAYS) { clearDraft(); return null; }
    return draft;
  } catch (e) { return null; }
}
function applyDraft(draft) {
  if (draft.tahun) { wishTahunEl.value = draft.tahun; fillWishSubjekOptions(); }
  if (draft.subjek) wishSubjekEl.value = draft.subjek;
  document.getElementById("wishUnitObjective").value = draft.unitObjective || "";
  document.getElementById("wishLearningGoal").value = draft.learningGoal || "";
  document.getElementById("wishLessonMoment").value = draft.lessonMoment || "";
  applyWishTextFields(draft);
}

function resetWishForm() {
  wishSelections.desiredHelp.value = null;
  wishSelections.device.value = null;
  document.getElementById("wishForm").reset();
  wishSubjekEl.innerHTML = '<option value="">先选年级</option>';
  wishSubjekEl.disabled = true;
  renderWishRadios();
  document.getElementById("wishLearningGoalError").hidden = true;
  document.getElementById("wishTaskError").hidden = true;
  document.getElementById("wishProblemError").hidden = true;
  wishSubmitBtn.textContent = "送出点子";
  wishLoginStatusEl.textContent = "";
  showWishStep(1);
}

function openWishFromFinder() {
  resetWishForm();
  if (finderState.tahun) { wishTahunEl.value = finderState.tahun; fillWishSubjekOptions(); }
  if (finderState.subjek) wishSubjekEl.value = finderState.subjek;
  const record = finderState.subjek && findDskpRecord(finderState.tahun, finderState.subjek);
  if (record && finderState.unit) {
    const unit = getUnit(record, finderState.unit);
    let text = unit ? `${unit.code} ${unit.title_zh}` : "";
    if (unit && finderState.objective) {
      const obj = getObjective(unit, finderState.objective);
      if (obj) text = `${obj.code} ${obj.title_zh}`;
    }
    document.getElementById("wishUnitObjective").value = text;
  }
  document.getElementById("wishModal").classList.add("open");
}

let pendingDraft = null;
document.getElementById("openWish").addEventListener("click", () => {
  const draft = loadDraft();
  if (draft) {
    pendingDraft = draft;
    document.getElementById("wishDraftHint").textContent = "你上次填了一些内容还没送出，要接着写吗？";
    document.getElementById("wishDraftModal").classList.add("open");
  } else {
    resetWishForm();
    document.getElementById("wishModal").classList.add("open");
  }
});
document.getElementById("wishDraftRestore").addEventListener("click", () => {
  document.getElementById("wishDraftModal").classList.remove("open");
  resetWishForm();
  if (pendingDraft) applyDraft(pendingDraft);
  document.getElementById("wishModal").classList.add("open");
});
document.getElementById("wishDraftDiscard").addEventListener("click", () => {
  clearDraft();
  document.getElementById("wishDraftModal").classList.remove("open");
  resetWishForm();
  document.getElementById("wishModal").classList.add("open");
});
function closeWishModal() {
  // 有内容未提交时要问，不能静默储存或静默丢弃（规格 3.2 / 第5节）
  if (hasDraftContent()) {
    const keep = confirm("要把目前写的内容暂存到这台设备吗？（取消＝放弃这次内容）");
    if (keep) saveDraft(); else clearDraft();
  }
  document.getElementById("wishModal").classList.remove("open");
}
document.getElementById("closeWish").addEventListener("click", closeWishModal);
// 点击框架外面的深色背景也要能关闭，不是非按打叉不可（草稿确认逻辑一样会跑）
document.getElementById("wishModal").addEventListener("click", (e) => {
  if (e.target.id === "wishModal") closeWishModal();
});

// ---------- 选校：州属 → 县 → 学校，找不到可以手动输入兜底 ----------
const NO_DISTRICT_KEY = "_no_district";
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const schoolSelect = document.getElementById("schoolSelect");
const schoolManual = document.getElementById("schoolManual");

function fillSelect(select, items, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>` +
    items.map((v) => `<option value="${v}">${v}</option>`).join("");
}

if (typeof SJKC_SCHOOLS !== "undefined" && stateSelect) {
  fillSelect(stateSelect, Object.keys(SJKC_SCHOOLS), "选州属");

  stateSelect.addEventListener("change", () => {
    const state = stateSelect.value;
    districtSelect.innerHTML = '<option value="">选县</option>';
    schoolSelect.innerHTML = '<option value="">选学校</option>';
    schoolSelect.disabled = true;
    schoolManual.hidden = true;

    if (!state) { districtSelect.disabled = true; return; }
    const districts = Object.keys(SJKC_SCHOOLS[state]).filter((d) => d !== NO_DISTRICT_KEY);
    fillSelect(districtSelect, districts, "选县");
    if (SJKC_SCHOOLS[state][NO_DISTRICT_KEY] && SJKC_SCHOOLS[state][NO_DISTRICT_KEY].length) {
      districtSelect.innerHTML += `<option value="${NO_DISTRICT_KEY}">其他（未分县）</option>`;
    }
    districtSelect.disabled = false;
  });

  districtSelect.addEventListener("change", () => {
    const state = stateSelect.value;
    const district = districtSelect.value;
    schoolManual.hidden = true;
    if (!district) { schoolSelect.disabled = true; schoolSelect.innerHTML = '<option value="">选学校</option>'; return; }
    const schools = SJKC_SCHOOLS[state][district] || [];
    fillSelect(schoolSelect, schools, "选学校");
    schoolSelect.innerHTML += `<option value="__manual__">都不是，我自己打校名</option>`;
    schoolSelect.disabled = false;
  });

  schoolSelect.addEventListener("change", () => {
    schoolManual.hidden = schoolSelect.value !== "__manual__";
    if (!schoolManual.hidden) schoolManual.focus();
  });
}

// ---------- 全局统计条：诚实展示目前真的有的数字，还没有的功能就写清楚「尚未上线」，不用假数字充场面 ----------
// 注意：`data/sjkc-schools.js` 是我们自己查到的全国华小参考名录，大小（约1310间）不代表
// 「有多少学校真的在用这个平台」——那是完全不同的两件事，不能把名录大小当成使用数据展示，
// 所以这里刻意不算这个数字，等以后账号系统上线、老师真的提交/注册了，才用那个真实数字。

// 之前这里是 localStorage 本地计数（VISITS_KEY），每台设备各自计数、从没回传服务器，
// 历史浏览数据从一开始就没被记录下来，2026-09-11 换成真实的全站计数（migration-2026-09-11-page-views.sql），
// 旧数据补不回来，诚实地从 0 重新开始
// 2026-09-17：纯页面浏览次数会被刷新灌水，换成「到访次数」——30 分钟内重复进站视为同一次到访不再 +1，
// 隔了一段时间才回来代表使用意图不同，才算新的一次；窗口内只读现有数字（get_page_views），不调用 increment
const LAST_VISIT_KEY = "kongsi-idea-last-visit-ts";
const VISIT_SESSION_WINDOW_MS = 30 * 60 * 1000;
let pageViews = null;
async function bumpPageViews() {
  const lastVisit = Number(localStorage.getItem(LAST_VISIT_KEY) || 0);
  const now = Date.now();
  const isNewVisit = !lastVisit || (now - lastVisit) > VISIT_SESSION_WINDOW_MS;
  const { data, error } = await supabaseClient.rpc(isNewVisit ? "increment_page_views" : "get_page_views");
  if (!error && typeof data === "number") {
    pageViews = data;
    renderStats();
    if (isNewVisit) localStorage.setItem(LAST_VISIT_KEY, String(now));
  }
}

// 账号系统（点子许愿池 + kelasku）上线后，「位老师注册」换成全站真实数字：
// 每个老师登录后在 profiles 表写一笔自己的 id（RLS 只准写自己那笔），
// 首页只透过 get_teacher_count() 这个 SECURITY DEFINER 函数拿总数，不读任何一笔个人资料
let teacherCount = null;
async function refreshTeacherCount() {
  const { data, error } = await supabaseClient.rpc("get_teacher_count");
  if (!error && typeof data === "number") {
    teacherCount = data;
    renderStats();
  }
}

async function ensureProfileRow() {
  if (!currentSession) return;
  await supabaseClient.from("profiles").upsert({ id: currentSession.user.id }, { onConflict: "id", ignoreDuplicates: true });
}

function renderStats() {
  const statsBarEl = document.getElementById("statsBar");
  if (!statsBarEl) return;
  const totalUses = TOOLS.reduce((sum, t) => sum + getUses(t.slug), 0);
  // 「已上架」只算真的发布的工具，示例作品不计入——不然会假装平台有更多作品
  const toolCount = TOOLS.filter((t) => t.status === "published").length;
  const teacherStatHtml = teacherCount === null
    ? `<span class="stat stat--pending"><span class="stat__num" data-target="0">0</span><span class="stat__label">位老师注册</span><span class="stat__badge">即将上线</span></span>`
    : `<span class="stat"><span class="stat__num" data-target="${teacherCount}">0</span><span class="stat__label">位老师注册</span></span>`;
  const visitsStatHtml = pageViews === null
    ? `<span class="stat stat--pending"><span class="stat__num" data-target="0">0</span><span class="stat__label">次到访</span><span class="stat__badge">即将上线</span></span>`
    : `<span class="stat"><span class="stat__num" data-target="${pageViews}">0</span><span class="stat__label">次到访</span></span>`;
  statsBarEl.innerHTML = `
    ${visitsStatHtml}
    <span class="stat"><span class="stat__num" data-target="${totalUses}">0</span><span class="stat__label">次工具使用</span></span>
    <span class="stat"><span class="stat__num" data-target="${toolCount}">0</span><span class="stat__label">个作品已上架</span></span>
    ${teacherStatHtml}
  `;
  observeStats(statsBarEl);
}

// 数字动画只在第一次滑进视窗时跑一次，用 IntersectionObserver 判断，不用一直监听 scroll 事件
let statsAnimated = false;
function observeStats(statsBarEl) {
  if (statsAnimated) {
    statsBarEl.classList.add("in-view");
    statsBarEl.querySelectorAll(".stat__num").forEach((el) => { el.textContent = el.dataset.target; });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || statsAnimated) return;
      statsAnimated = true;
      statsBarEl.classList.add("in-view");
      statsBarEl.querySelectorAll(".stat__num").forEach(animateCount);
      io.disconnect();
    });
  }, { threshold: 0.4 });
  io.observe(statsBarEl);
}

function animateCount(el) {
  const target = Number(el.dataset.target || 0);
  if (target === 0) return;
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---------- 新访客欢迎侧边卡：只在这台浏览器第一次造访时出现，不是每次刷新都跳 ----------
const WELCOMED_KEY = "kongsi-idea-welcomed";
function closeWelcomeToast() {
  const el = document.getElementById("welcomeToast");
  if (!el) return;
  el.classList.remove("show");
  setTimeout(() => { el.hidden = true; }, 400);
}
function maybeShowWelcome() {
  const el = document.getElementById("welcomeToast");
  if (!el || localStorage.getItem(WELCOMED_KEY)) return;
  localStorage.setItem(WELCOMED_KEY, "1");
  setTimeout(() => {
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("show"));
  }, 900);
}
document.getElementById("welcomeToastClose").addEventListener("click", closeWelcomeToast);
document.getElementById("welcomeToastCta").addEventListener("click", () => {
  closeWelcomeToast();
  document.getElementById("openWish").click();
});

// ---------- 首页标题打字机效果：一个字一个字打出来，中间可以停顿分段，尊重「减少动态效果」系统设置 ----------
function typewriterInto(el, text, opts) {
  if (!el) return;
  opts = opts || {};
  const speed = opts.speed || 140;
  const pauseAfterChar = opts.pauseAfterChar || 0; // 打到第几个字之后要停顿
  const pauseMs = opts.pauseMs || 0;
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) { el.textContent = text; return; }
  el.textContent = "";
  let i = 0;
  (function tick() {
    if (i > text.length) return;
    el.textContent = text.slice(0, i);
    const isPausePoint = pauseAfterChar && i === pauseAfterChar;
    i++;
    setTimeout(tick, isPausePoint ? pauseMs : speed);
  })();
}

// ---------- 提示条：取代浏览器原生 alert()，跟网站视觉统一 ----------
const TOAST_DURATION = 4500;
function showToast(message, type = "success") {
  const stack = document.getElementById("toastStack");
  if (!stack) { console.log(message); return; }
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " toast--error" : "");
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-10px)";
    setTimeout(() => el.remove(), 200);
  }, TOAST_DURATION);
}

// ---------- 初始化 ----------
bumpPageViews();
// 「今天」两个字先出来，停顿 2 秒，再继续把后面的字打完，整体也放慢一点
typewriterInto(document.getElementById("finderTitleText"), "今天要教什么？", { speed: 140, pauseAfterChar: 2, pauseMs: 2000 });
renderFacets();
renderBoard();
renderStats();
renderFinderShortcuts();
resetWishForm();
loadFinderFromUrl();
renderFinder();
maybeShowWelcome();
loadToolStats();
initAuth();
const requestedToolSlug = new URLSearchParams(window.location.search).get("tool");
if (requestedToolSlug) {
  const requestedTool = TOOLS.find(tool=>tool.slug === requestedToolSlug);
  if (requestedTool) openDetail(requestedTool);
  else showToast("找不到这个工具，请从目录重新选择。","error");
}
// 分享给学生：一次点击做两件事——复制链接＋就地生成QR码（离线的 qrcode-generator
// 库，不外传网址给第三方 API）。老师课堂上两个通常都要（投影QR＋链接留着备用），
// 不用先选「要哪一种分享方式」。再点一次收起QR（不重复复制，避免每次点都跳提示）。
document.getElementById("detailShareBtn").addEventListener("click",async()=> {
  const slug=new URLSearchParams(window.location.search).get("tool");
  if (!slug) return;
  const label=document.getElementById("detailShareLabel");
  const box=document.getElementById("detailShareQrBox");
  if (!box.hidden) { box.hidden=true; label.textContent="分享给学生"; return; }

  const url=new URL(window.location.pathname,window.location.origin);
  url.searchParams.set("tool",slug);
  try { await navigator.clipboard.writeText(url.href); showToast("已复制课堂点子铺的工具链接"); }
  catch { const field=document.getElementById("detailShareUrl"); field.hidden=false; field.value=url.href; field.focus(); field.select(); showToast("请复制已选中的链接"); }

  if (!box.innerHTML) {
    const qr=qrcode(0,"M");
    qr.addData(url.href);
    qr.make();
    box.innerHTML=qr.createSvgTag(6,0);
  }
  box.hidden=false;
  label.textContent="收起分享";
});
