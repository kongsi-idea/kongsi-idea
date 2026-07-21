// 正式科目代码表，来自科目普查任务的产出 docs/subjek-tahun.md（查证日期 2026-07-21）
// dst 限 Tahun 1-3（科学与科技世界，尚未拆分），sains/sejarah/rbt 限 Tahun 4-6，其余科目 Tahun 1-6 皆有
const TAHUN = [1, 2, 3, 4, 5, 6];

const SUBJECTS = [
  { code: "bm", title_zh: "马来文", title_bm: "Bahasa Melayu", badge: "BM" },
  { code: "bi", title_zh: "英文", title_bm: "Bahasa Inggeris", badge: "BI" },
  { code: "bc", title_zh: "华文", title_bm: "Bahasa Cina", badge: "BC" },
  { code: "mt", title_zh: "数学", title_bm: "Matematik", badge: "MT" },
  { code: "dst", title_zh: "科学与科技世界", title_bm: "Dunia Sains dan Teknologi", badge: "DST" },
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
// isDemo: true 的 10 个是示例作品，不是真产品，不参与上面这两处，但仍会出现在「浏览全部工具」
// board 里做视觉展示——这是跟规格文件的刻意差异，因为示例作品是这个原型阶段才有的东西，
// 规格文件写的时候没设想到，细节记在 handoff.md。
const TOOLS = [
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

  // 以下 10 个是「示例作品」，纯粹用来把版面填满做展示，不是真的做出来的工具——
  // 没有 status/url（点「开始使用」会显示「示例作品」提示，不会真的打开任何网址），也没有附课程标准
  // （避免假装查证过 DSKP）。缩略图是从 Wikimedia Commons 找的授权明确真实照片，左下角有
  // 「示例图 · MOCK」浮水印，来源记在 assets/thumbs/mock/SOURCES.md。
  // 之后有真的工具上架，直接删掉对应的示例条目换上真实资料，同时补上真实的 status/standards。
  { slug: "tahun1-bm-abjad", tahun: 1, subjek: "bm", isDemo: true, title_zh: "字母农场", title_bm: "Ladang Abjad",
    desc: "（示例作品）认读26个字母、拼读简单音节的农场主题游戏，适合一年级国语启蒙。",
    keywords: ["字母", "拼音", "一年级", "abjad"], type: "游戏", stars: 12, url: null,
    creator: { name: "陈老师", initial: "陈" },
    thumbnails: [{ img: "assets/thumbs/mock/tahun1-bm-abjad/0.png", label: "字母农场封面" }] },

  { slug: "tahun2-pjpk-jaman", tahun: 2, subjek: "pjpk", isDemo: true, title_zh: "运动打卡王", title_bm: "Raja Cop Sukan",
    desc: "（示例作品）课堂晨操/体育课打卡计时器，累积连续出席天数换徽章。",
    keywords: ["体育", "打卡", "二年级"], type: "工具", stars: 5, url: null,
    creator: { name: "林老师", initial: "林" },
    thumbnails: [
      { img: "assets/thumbs/mock/tahun2-pjpk-jaman/0.png", label: "打卡介面" },
      { img: "assets/thumbs/mock/tahun2-pjpk-jaman/1.png", label: "徽章墙" },
    ] },

  { slug: "tahun3-bc-chengyu", tahun: 3, subjek: "bc", isDemo: true, title_zh: "成语连连看", title_bm: "Padanan Simpulan Bahasa",
    desc: "（示例作品）成语与释义配对小游戏，三年级华文词汇教学用。",
    keywords: ["成语", "华文", "三年级", "词汇"], type: "游戏", stars: 34, url: null,
    creator: { name: "黄老师", initial: "黄" },
    thumbnails: [
      { img: "assets/thumbs/mock/tahun3-bc-chengyu/0.png", label: "配对画面" },
      { img: "assets/thumbs/mock/tahun3-bc-chengyu/1.png", label: "过关动画" },
    ] },

  { slug: "tahun3-sains-serangga", tahun: 3, subjek: "sains", isDemo: true, title_zh: "昆虫观察日记", title_bm: "Diari Pemerhatian Serangga",
    desc: "（示例作品）记录昆虫生命周期的观察日志模板，配合科学课实作活动。",
    keywords: ["昆虫", "科学", "三年级", "观察"], type: "工具", stars: 2, url: null,
    creator: { name: "卢老师", initial: "卢" },
    thumbnails: [{ img: "assets/thumbs/mock/tahun3-sains-serangga/0.png", label: "观察日志模板" }] },

  { slug: "tahun4-sejarah-melaka", tahun: 4, subjek: "sejarah", isDemo: true, title_zh: "时光机：马六甲王朝", title_bm: "Mesin Masa Kesultanan Melaka",
    desc: "（示例作品）马六甲王朝重大事件时间轴互动教具，四年级历史科启蒙单元用。",
    keywords: ["历史", "马六甲", "四年级", "时间轴"], type: "工具", stars: 19, url: null,
    creator: { name: "郑老师", initial: "郑" },
    thumbnails: [
      { img: "assets/thumbs/mock/tahun4-sejarah-melaka/0.png", label: "时间轴总览" },
      { img: "assets/thumbs/mock/tahun4-sejarah-melaka/1.png", label: "事件卡" },
      { img: "assets/thumbs/mock/tahun4-sejarah-melaka/2.png", label: "人物介绍" },
      { img: "assets/thumbs/mock/tahun4-sejarah-melaka/3.png", label: "小测验" },
    ] },

  { slug: "tahun4-rbt-kraf", tahun: 4, subjek: "rbt", isDemo: true, title_zh: "纸模型工坊", title_bm: "Bengkel Model Kertas",
    desc: "（示例作品）设计与工艺科纸类立体模型制作步骤图解，附材料清单。",
    keywords: ["手工", "设计与工艺", "四年级"], type: "工具", stars: 7, url: null,
    creator: { name: "林老师", initial: "林" },
    thumbnails: [
      { img: "assets/thumbs/mock/tahun4-rbt-kraf/0.png", label: "步骤图解" },
      { img: "assets/thumbs/mock/tahun4-rbt-kraf/1.png", label: "成品展示" },
    ] },

  { slug: "tahun5-mt-pecahan", tahun: 5, subjek: "mt", isDemo: true, title_zh: "分数积木", title_bm: "Blok Pecahan",
    desc: "（示例作品）用拖拽积木理解分数大小与加减法的互动教具，五年级数学用。",
    keywords: ["分数", "数学", "五年级", "积木"], type: "游戏", stars: 41, url: null,
    creator: { name: "卢老师", initial: "卢" },
    thumbnails: [
      { img: "assets/thumbs/mock/tahun5-mt-pecahan/0.png", label: "积木拼接" },
      { img: "assets/thumbs/mock/tahun5-mt-pecahan/1.png", label: "比较大小" },
      { img: "assets/thumbs/mock/tahun5-mt-pecahan/2.png", label: "分数加法" },
      { img: "assets/thumbs/mock/tahun5-mt-pecahan/3.png", label: "闯关模式" },
    ] },

  { slug: "tahun5-bi-safari", tahun: 5, subjek: "bi", isDemo: true, title_zh: "Word Safari", title_bm: "Word Safari",
    desc: "（示例作品）野生动物主题的英文单词认读与拼写游戏，五年级英文科词汇教学。",
    keywords: ["英文", "单词", "五年级", "vocabulary"], type: "游戏", stars: 3, url: null,
    creator: { name: "Tan Cikgu", initial: "T" },
    thumbnails: [{ img: "assets/thumbs/mock/tahun5-bi-safari/0.png", label: "Safari 场景" }] },

  { slug: "tahun6-moral-nilai", tahun: 6, subjek: "moral", isDemo: true, title_zh: "价值观情境卡", title_bm: "Kad Situasi Nilai Murni",
    desc: "（示例作品）道德教育情境讨论卡牌组，附引导提问，适合分组讨论课。",
    keywords: ["道德教育", "价值观", "六年级", "讨论"], type: "工具", stars: 9, url: null,
    creator: { name: "黄老师", initial: "黄" },
    thumbnails: [
      { img: "assets/thumbs/mock/tahun6-moral-nilai/0.png", label: "情境卡正面" },
      { img: "assets/thumbs/mock/tahun6-moral-nilai/1.png", label: "引导提问卡" },
    ] },

  { slug: "tahun6-seni-garisan", tahun: 6, subjek: "seni", isDemo: true, title_zh: "线条大师", title_bm: "Master Garisan",
    desc: "（示例作品）临摹与自由创作并行的线条绘画练习工具，六年级视觉艺术科用。",
    keywords: ["视觉艺术", "绘画", "六年级", "线条"], type: "游戏", stars: 15, url: null,
    creator: { name: "郑老师", initial: "郑" },
    thumbnails: [{ img: "assets/thumbs/mock/tahun6-seni-garisan/0.png", label: "临摹练习" }] },
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

const USES_KEY_PREFIX = "eduneo-hub-uses-";
function getUses(slug) {
  return Number(localStorage.getItem(USES_KEY_PREFIX + slug) || 0);
}
function bumpUses(slug) {
  localStorage.setItem(USES_KEY_PREFIX + slug, String(getUses(slug) + 1));
}

// 「喜欢」是任何人都能点的工具热度指标，不用登录（跟老师个人靠反馈/许愿累积的声望星星是两回事，
// 后者要等账号系统上线才有意义，这里先不做）。一台浏览器只算一票，用 localStorage 记有没有点过。
const LIKED_KEY_PREFIX = "eduneo-hub-liked-";
const LIKE_DELTA_KEY_PREFIX = "eduneo-hub-like-delta-";
function hasLiked(slug) {
  return localStorage.getItem(LIKED_KEY_PREFIX + slug) === "1";
}
function getLikes(tool) {
  const delta = Number(localStorage.getItem(LIKE_DELTA_KEY_PREFIX + tool.slug) || 0);
  return tool.stars + delta;
}
function toggleLike(tool) {
  const liked = hasLiked(tool.slug);
  const delta = Number(localStorage.getItem(LIKE_DELTA_KEY_PREFIX + tool.slug) || 0);
  localStorage.setItem(LIKE_DELTA_KEY_PREFIX + tool.slug, String(delta + (liked ? -1 : 1)));
  localStorage.setItem(LIKED_KEY_PREFIX + tool.slug, liked ? "0" : "1");
}

const boardEl = document.getElementById("board");
const boardEmptyEl = document.getElementById("boardEmpty");
const searchInput = document.getElementById("searchInput");
const gradeFacetEl = document.getElementById("gradeFacet");
const subjekFacetEl = document.getElementById("subjekFacet");

let gradeFilter = "all";
let subjekFilter = "all";

function subjectBadge(code) {
  return (SUBJECT_BY_CODE[code] && SUBJECT_BY_CODE[code].badge) || code.slice(0, 2).toUpperCase();
}
function starIcon() {
  return '<svg class="star-icon" viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z"/></svg>';
}

function jumpToBrowse(tahun, subjek) {
  gradeFilter = tahun || "all";
  subjekFilter = subjek || "all";
  renderFacets();
  renderBoard();
  document.querySelector(".browse").scrollIntoView({ behavior: "smooth" });
}

function renderFacet(container, options, activeValue, onPick) {
  container.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (opt.value === activeValue ? " active" : "");
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      onPick(opt.value);
      renderFacets();
      renderBoard();
    });
    container.appendChild(btn);
  });
}

function renderFacets() {
  renderFacet(
    gradeFacetEl,
    [{ value: "all", label: "全部" }, ...TAHUN.map((t) => ({ value: t, label: `${t}年级` }))],
    gradeFilter,
    (v) => (gradeFilter = v)
  );
  renderFacet(
    subjekFacetEl,
    [{ value: "all", label: "全部" }, ...SUBJECTS.map((s) => ({ value: s.code, label: s.title_zh }))],
    subjekFilter,
    (v) => (subjekFilter = v)
  );
}

function tagChips(tool) {
  const chips = [tool.type, `${tool.tahun}年级`, SUBJECT_BY_CODE[tool.subjek].title_zh];
  return chips.map((c) => `<span class="tag">${c}</span>`).join("");
}

function creatorHtml(tool) {
  const c = tool.creator;
  if (!c) return "";
  return `<div class="creator"><span class="creator__avatar">${c.initial}</span><span class="creator__name">${c.name}</span></div>`;
}

function cardHtml(tool) {
  const uses = getUses(tool.slug);
  const liked = hasLiked(tool.slug);
  const cover = tool.thumbnails && tool.thumbnails[0];
  return `
    <div class="card" data-slug="${tool.slug}">
      <div class="card__thumb">${cover
        ? (cover.img ? `<img src="${cover.img}" alt="${cover.label || ""}">` : `<span>${cover.label}</span>`)
        : `<span>${subjectBadge(tool.subjek)}</span>`}</div>
      <h3 class="card__title-zh">${tool.title_zh}</h3>
      <p class="card__title-bm">${tool.title_bm}</p>
      ${creatorHtml(tool)}
      <div class="card__tags">${tagChips(tool)}</div>
      <span class="card__slug">${tool.slug}</span>
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

function renderBoard() {
  const query = searchInput.value.trim().toLowerCase();
  // 年级 AND 科目 AND（没有查询词 OR 查询词匹配）—— 之前这里有 bug：一输入查询词就整个无视年级/科目筛选，
  // 已修正（见 docs/dskp-learning-objective-search.md 第7.1节／验收条件第2条）
  let list = TOOLS.filter((tool) => {
    const gradeOk = gradeFilter === "all" || tool.tahun === gradeFilter;
    const subjekOk = subjekFilter === "all" || tool.subjek === subjekFilter;
    const queryOk = !query || matchesQuery(tool, query);
    return gradeOk && subjekOk && queryOk;
  });

  // 喜欢数最多的排前面，是老师最先看到的
  list = list.slice().sort((a, b) => getLikes(b) - getLikes(a));

  boardEl.innerHTML = list.map(cardHtml).join("");
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
      if (tool) { toggleLike(tool); renderBoard(); renderStats(); }
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
    `<div class="detail__shot" data-index="${i}">${s.img ? `<img src="${s.img}" alt="${s.label || ""}">` : `<span>${s.label || "缩略图待补"}</span>`}</div>`
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
  el.innerHTML = resolved.map((r) => `
    <div class="standards-block">
      <p class="detail__standards-title">对应课程标准 · DSKP（核对日期 ${r.record.verifiedAt}）</p>
      <p class="detail__standards-unit">${r.unit.code} ${r.unit.title_zh}（${r.unit.title_bm}）</p>
      <ul class="detail__standards-list">${r.objectives.map((o) => `<li>${o.code} ${o.title_zh}</li>`).join("")}</ul>
      <p class="detail__standards-source">来源：<a href="${r.record.sourceUrl}" target="_blank" rel="noopener">${r.record.sourceLabel}</a></p>
    </div>
  `).join("");
}

function openDetail(tool) {
  renderGallery(tool.thumbnails);
  document.getElementById("detailCreator").innerHTML = creatorHtml(tool);
  document.getElementById("detailTitleZh").textContent = tool.title_zh;
  document.getElementById("detailTitleBm").textContent = tool.title_bm;
  document.getElementById("detailDesc").textContent = tool.desc;
  renderStandards(tool);
  document.getElementById("detailSlug").textContent = tool.slug;
  document.getElementById("detailUses").textContent = `用过 ${getUses(tool.slug)} 次`;

  const link = document.getElementById("detailOpenLink");
  if (tool.url) {
    link.href = tool.url;
    link.classList.remove("detail__open--disabled");
    link.textContent = "开始使用（另开全屏页面）";
    link.onclick = () => {
      bumpUses(tool.slug);
      // 目前用 localStorage 记在这台电脑本地，之后接账号系统才会变成全体老师共用的真实次数
    };
  } else {
    link.removeAttribute("href");
    link.classList.add("detail__open--disabled");
    link.textContent = "示例作品（还没有真的网址）";
    link.onclick = (e) => e.preventDefault();
  }

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

document.getElementById("closeDetail").addEventListener("click", () => {
  document.getElementById("detailModal").classList.remove("open");
  renderBoard(); // 关闭详情后刷新卡片上的使用次数
  renderStats();
});

searchInput.addEventListener("input", renderBoard);

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

// 「常用入口」快捷方式；目前只有钱币真的有索引，其他几个诚实标成「整理中」，不假装都有资料
const FINDER_SHORTCUTS = [
  { label: "钱币", tahun: 2, subjek: "mt", unit: "4.0" },
  { label: "分数" },
  { label: "时间" },
  { label: "读写" },
  { label: "词汇" },
];

finderTahunEl.innerHTML = '<option value="">选年级 Tahun</option>' +
  TAHUN.map((t) => `<option value="${t}">Tahun ${t}（${t}年级）</option>`).join("");

function fillFinderSubjekOptions() {
  finderSubjekEl.dataset.tahun = String(finderState.tahun);
  finderSubjekEl.disabled = false;
  finderSubjekEl.innerHTML = '<option value="">选科目 Subjek</option>' +
    SUBJECTS.map((s) => {
      const indexed = findDskpRecord(finderState.tahun, s.code);
      return `<option value="${s.code}">${s.title_zh}${indexed ? "" : "（整理中）"}</option>`;
    }).join("");
}

function renderFinderShortcuts() {
  finderShortcutsEl.innerHTML = FINDER_SHORTCUTS.map((s, i) => `<button type="button" class="chip" data-idx="${i}">${s.label}</button>`).join("");
  finderShortcutsEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = FINDER_SHORTCUTS[Number(btn.dataset.idx)];
      if (s.tahun && findDskpRecord(s.tahun, s.subjek)) {
        finderState = { tahun: s.tahun, subjek: s.subjek, unit: s.unit || null, objective: null, q: "" };
        finderQueryEl.value = "";
        renderFinder();
      } else {
        finderStatusEl.hidden = false;
        finderStatusEl.innerHTML = `「${s.label}」的学习目标索引还在整理中，可以到下面「浏览全部工具」找找看。`;
      }
    });
  });
}

function renderFinderStatus() {
  if (!finderState.tahun || !finderState.subjek) { finderStatusEl.hidden = true; return; }
  const record = findDskpRecord(finderState.tahun, finderState.subjek);
  if (record) { finderStatusEl.hidden = true; return; }
  finderStatusEl.hidden = false;
  finderStatusEl.innerHTML = `这个科目（${SUBJECT_BY_CODE[finderState.subjek].title_zh}）的学习目标索引仍在整理中。<button type="button" class="finder__browse-link" id="finderBrowseLink">先浏览这个科目的全部工具</button>`;
  const linkBtn = document.getElementById("finderBrowseLink");
  if (linkBtn) linkBtn.addEventListener("click", () => jumpToBrowse(finderState.tahun, finderState.subjek));
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
  if (finderState.tahun && tool.tahun !== finderState.tahun) return false;
  if (finderState.subjek && tool.subjek !== finderState.subjek) return false;
  if (finderState.unit) {
    const coversUnit = (tool.standards || []).some((s) => s.unitCode === finderState.unit);
    if (!coversUnit) return false;
    if (finderState.objective) {
      const coversObjective = (tool.standards || []).some((s) => s.unitCode === finderState.unit && s.objectiveCodes.includes(finderState.objective));
      if (!coversObjective) return false;
    }
  }
  if (finderState.q) {
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
  return `
    <div class="finder-card" data-slug="${tool.slug}">
      <h4>${tool.title_zh} <span class="finder-card__bm">${tool.title_bm}</span></h4>
      <dl class="finder-card__meta">
        <div><dt>对应学习目标</dt><dd>Tahun ${tool.tahun} ${SUBJECT_BY_CODE[tool.subjek].title_zh} · ${unitPart}${objLabel ? " · " + objLabel : ""}</dd></div>
        <div><dt>可练习什么</dt><dd>${tool.practiceSummary || "—"}</dd></div>
        <div><dt>课堂方式</dt><dd>${(tool.teachingMode || []).join("、") || "—"}</dd></div>
        <div><dt>准备条件</dt><dd>${tool.prep || "—"}</dd></div>
        <div><dt>DSKP 核对状态</dt><dd>已核对 · ${verifiedAt}</dd></div>
      </dl>
    </div>`;
}

function renderFinderResults() {
  if (!finderState.tahun || !finderState.subjek) { finderResultsEl.innerHTML = ""; return; }
  const record = findDskpRecord(finderState.tahun, finderState.subjek);
  if (!record) { finderResultsEl.innerHTML = ""; return; }
  if (!finderState.unit && !finderState.q) {
    finderResultsEl.innerHTML = '<p class="finder__hint">在上面选一个单元或学习目标，看看有哪些工具适合。</p>';
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
  const validSubjek = validTahun && SUBJECT_BY_CODE[subjekRaw] ? subjekRaw : null;
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

  if (finderState.tahun) {
    if (finderSubjekEl.dataset.tahun !== String(finderState.tahun)) fillFinderSubjekOptions();
    finderSubjekEl.value = finderState.subjek || "";
  } else {
    finderSubjekEl.disabled = true;
    finderSubjekEl.innerHTML = '<option value="">先选年级</option>';
  }

  renderFinderStatus();
  renderFinderPath();
  renderFinderUnits();
  renderFinderResults();
  updateFinderUrl();
}

finderTahunEl.addEventListener("change", () => {
  finderState.tahun = finderTahunEl.value ? Number(finderTahunEl.value) : null;
  finderState.subjek = null; finderState.unit = null; finderState.objective = null;
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
});
document.addEventListener("click", (e) => {
  if (!finderSuggestionsEl.contains(e.target) && e.target !== finderQueryEl) finderSuggestionsEl.hidden = true;
});

// ============================================================
// 点子许愿池：三步结构化需求单 —— docs/idea-wish-pool-spec.md
// ============================================================
const DIFFICULTY_TAGS = [
  // 规格文件 docs/idea-wish-pool-spec.md 3.1 的储存值只有 7 个，但文字说明列了 8 个标签
  // （多了「全班互动不够」），两处对不上——已并入 visibility 这一项，没有单独开一个不在储存值清单里的 id
  { id: "concept", label: "听不懂概念" },
  { id: "steps", label: "容易混淆步骤" },
  { id: "engagement", label: "缺少练习动机" },
  { id: "mixed-ability", label: "程度差异大" },
  { id: "visibility", label: "全班互动不够／难以快速看见谁会谁不会" },
  { id: "prep-time", label: "准备材料太花时间" },
  { id: "other", label: "其他" },
];
const CONSTRAINTS = [
  { id: "teacher-projector", label: "只有教师投影" },
  { id: "no-student-devices", label: "学生没有个人设备" },
  { id: "unstable-network", label: "网络不稳定" },
  { id: "no-printing", label: "不能打印" },
  { id: "short-lesson", label: "课时很短" },
  { id: "large-class", label: "班级人数多" },
  { id: "other", label: "其他" },
];
const DESIRED_HELP = [
  { id: "classroom-interactive", label: "课堂互动工具" },
  { id: "practice-game", label: "练习或小游戏" },
  { id: "presentation-aid", label: "投影讲解辅助" },
  { id: "group-activity", label: "分组活动" },
  { id: "printable", label: "可打印材料" },
  { id: "utility", label: "随机抽选或计时工具" },
  { id: "unsure", label: "还不确定" },
];
const USAGE_MODES = [
  { id: "whole-class", label: "全班投影" },
  { id: "pair-group", label: "两人或小组" },
  { id: "independent", label: "学生自己练习" },
  { id: "teacher-prep", label: "老师课前准备" },
  { id: "no-device", label: "没有设备也能用" },
];

const wishSelections = {
  difficultyTags: new Set(),
  constraints: new Set(),
  usageModes: new Set(),
  desiredHelp: { value: null },
};

function renderMultiChips(container, options, selectedSet) {
  container.innerHTML = options.map((o) => `<button type="button" class="wish-chip${selectedSet.has(o.id) ? " active" : ""}" data-id="${o.id}">${o.label}</button>`).join("");
  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (selectedSet.has(id)) selectedSet.delete(id); else selectedSet.add(id);
      btn.classList.toggle("active");
    });
  });
}
function renderRadioOptions(container, options, stateRef) {
  container.innerHTML = options.map((o) => `<button type="button" class="wish-chip wish-chip--radio${stateRef.value === o.id ? " active" : ""}" data-id="${o.id}">${o.label}</button>`).join("");
  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      stateRef.value = btn.dataset.id;
      container.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
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
    const val = document.getElementById("wishProblem").value.trim();
    const errEl = document.getElementById("wishProblemError");
    const lenOk = val.length >= 20;
    errEl.hidden = lenOk;
    errEl.textContent = "再多说一点，至少 20 个字，帮我们理解学生卡在哪里。";
    return lenOk;
  }
  if (step === 3) {
    return !!wishSelections.desiredHelp.value && document.getElementById("wishConsent").checked;
  }
  return true;
}

document.getElementById("wishLearningGoal").addEventListener("blur", () => validateWishStep(1));
document.getElementById("wishProblem").addEventListener("blur", () => validateWishStep(2));

wishNextBtn.addEventListener("click", () => {
  if (!validateWishStep(wishCurrentStep)) return;
  showWishStep(wishCurrentStep + 1);
});
wishBackBtn.addEventListener("click", () => showWishStep(wishCurrentStep - 1));
document.getElementById("wishForm").addEventListener("submit", (e) => {
  e.preventDefault(); // 阶段A没有后端，提交按钮本来就 disabled，这里只是保险不让表单真的提交跳转
});

const WISH_DRAFT_KEY = "classroom-idea-shop-wish-draft-v1";

function collectWishDraft() {
  return {
    tahun: wishTahunEl.value || null,
    subjek: wishSubjekEl.value || null,
    unitObjective: document.getElementById("wishUnitObjective").value,
    learningGoal: document.getElementById("wishLearningGoal").value,
    lessonMoment: document.getElementById("wishLessonMoment").value,
    problemDescription: document.getElementById("wishProblem").value,
    difficultyTags: [...wishSelections.difficultyTags],
    triedAlready: document.getElementById("wishTried").value,
    constraints: [...wishSelections.constraints],
    savedAt: Date.now(),
  };
  // 按规格 3.2：不暂存学校资料和隐私确认
}
function hasDraftContent() {
  const d = collectWishDraft();
  return !!(d.learningGoal || d.problemDescription || d.tahun || d.subjek || d.unitObjective || d.triedAlready || d.difficultyTags.length || d.constraints.length);
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
  document.getElementById("wishProblem").value = draft.problemDescription || "";
  document.getElementById("wishTried").value = draft.triedAlready || "";
  (draft.difficultyTags || []).forEach((id) => wishSelections.difficultyTags.add(id));
  (draft.constraints || []).forEach((id) => wishSelections.constraints.add(id));
  renderMultiChips(document.getElementById("wishDifficultyTags"), DIFFICULTY_TAGS, wishSelections.difficultyTags);
  renderMultiChips(document.getElementById("wishConstraints"), CONSTRAINTS, wishSelections.constraints);
}

function resetWishForm() {
  wishSelections.difficultyTags.clear();
  wishSelections.constraints.clear();
  wishSelections.usageModes.clear();
  wishSelections.desiredHelp.value = null;
  document.getElementById("wishForm").reset();
  wishSubjekEl.innerHTML = '<option value="">先选年级</option>';
  wishSubjekEl.disabled = true;
  renderMultiChips(document.getElementById("wishDifficultyTags"), DIFFICULTY_TAGS, wishSelections.difficultyTags);
  renderMultiChips(document.getElementById("wishConstraints"), CONSTRAINTS, wishSelections.constraints);
  renderMultiChips(document.getElementById("wishUsageModes"), USAGE_MODES, wishSelections.usageModes);
  renderRadioOptions(document.getElementById("wishDesiredHelp"), DESIRED_HELP, wishSelections.desiredHelp);
  document.getElementById("wishLearningGoalError").hidden = true;
  document.getElementById("wishProblemError").hidden = true;
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
document.getElementById("closeWish").addEventListener("click", () => {
  // 有内容未提交时要问，不能静默储存或静默丢弃（规格 3.2 / 第5节）
  if (hasDraftContent()) {
    const keep = confirm("要把目前写的内容暂存到这台设备吗？（取消＝放弃这次内容）");
    if (keep) saveDraft(); else clearDraft();
  }
  document.getElementById("wishModal").classList.remove("open");
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
function countDirectorySchools() {
  if (typeof SJKC_SCHOOLS === "undefined") return 0;
  let total = 0;
  Object.values(SJKC_SCHOOLS).forEach((districts) => {
    Object.values(districts).forEach((schools) => { total += schools.length; });
  });
  return total;
}

function renderStats() {
  const statsBarEl = document.getElementById("statsBar");
  if (!statsBarEl) return;
  const totalUses = TOOLS.reduce((sum, t) => sum + getUses(t.slug), 0);
  // 「已上架」只算真的发布的工具，示例作品不计入——不然会假装平台有 11 个作品
  const toolCount = TOOLS.filter((t) => t.status === "published").length;
  const schoolCount = countDirectorySchools();
  statsBarEl.innerHTML = `
    <span class="stat"><span class="stat__num" data-target="${totalUses}">0</span><span class="stat__label">次总使用（本机累计）</span></span>
    <span class="stat"><span class="stat__num" data-target="${toolCount}">0</span><span class="stat__label">个作品已上架</span></span>
    <span class="stat"><span class="stat__num" data-target="${schoolCount}">0</span><span class="stat__label">间华小已收录在名录里</span></span>
    <span class="stat stat--pending"><span class="stat__num" data-target="0">0</span><span class="stat__label">位老师注册（账号系统尚未上线，先如实显示 0）</span></span>
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

// ---------- 初始化 ----------
renderFacets();
renderBoard();
renderStats();
renderFinderShortcuts();
resetWishForm();
loadFinderFromUrl();
renderFinder();
