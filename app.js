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
  { code: "pk", title_zh: "健康教育", title_bm: "Pendidikan Kesihatan", badge: "PK" }, // 与 pjpk 共用同一份 DSKP／课本，但属于不同科目（老师 2026-10-15 定）
];
const SUBJECT_BY_CODE = Object.fromEntries(SUBJECTS.map((s) => [s.code, s]));


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

// ---------- 主题（来自 DSKP，规格 docs/hub-reorg-2026-10.md 第 2.1 节） ----------
// 工具不手填主题：先看 topicOverride（综合复习、跨科等跨很多单元的工具才写），
// 再看 standards 第一条对应的学习目标 topic（语文），最后看该单元的 topic（数学、科学等）。
// 资料还没填的工具一律回 null，卡片不显示主题颗，也不报错。
function toolTopic(tool) {
  const o = tool.topicOverride;
  if (o && (o.zh || o.bm)) return o;
  const first = tool.standards && tool.standards[0];
  if (!first) return null;
  const resolved = resolveToolStandards({ ...tool, standards: [first] })[0];
  if (!resolved) return null;
  const objective = resolved.objectives.find((x) => x.topic && (x.topic.zh || x.topic.bm));
  if (objective) return objective.topic;
  const unitTopic = resolved.unit.topic;
  return unitTopic && (unitTopic.zh || unitTopic.bm) ? unitTopic : null;
}
// 马来文、英文工具显示 topic.bm（英文工具的 bm 栏放英文原文），其他显示 topic.zh
function topicText(topic, subjek) {
  if (!topic) return "";
  return subjek === "bm" || subjek === "bi" ? (topic.bm || topic.zh || "") : (topic.zh || topic.bm || "");
}
function topicLabel(tool) {
  return topicText(toolTopic(tool), tool.subjek);
}
// 同一内容跨年级靠 zh 相同连起来，所以分组、筛选、条件存网址都用这个键
function topicKey(tool) {
  const t = toolTopic(tool);
  return t ? (t.zh || t.bm) : null;
}

// ---------- 复习卷合集（规格第 7b 节） ----------
// 工具带 collection: "<id>" 的已上架成员，在首页、筛选、搜索里合成一张卡（entry）。
// entry 是借用封面成员的字段拼出来的假「工具」：slug＝合集 id，members＝成员，其余字段（年级、科目、主题、上课方式）
// 取封面成员，所以卡片、排序、筛选、主题都能沿用单个工具的函数；喜欢数和使用次数则由成员加总。
function latestChangeTime(tool) {
  const times = (tool.changelog || []).map((c) => Date.parse(c.date)).filter((n) => !isNaN(n));
  return times.length ? Math.max(...times) : 0;
}
function mergeStandards(members) {
  const merged = [];
  members.forEach((m) => (m.standards || []).forEach((s) => {
    const hit = merged.find((x) => x.curriculum === s.curriculum && x.unitCode === s.unitCode);
    if (!hit) merged.push({ ...s, objectiveCodes: [...s.objectiveCodes] });
    else s.objectiveCodes.forEach((c) => { if (!hit.objectiveCodes.includes(c)) hit.objectiveCodes.push(c); });
  }));
  return merged;
}
function buildCollectionEntry(id, members) {
  const meta = TOOL_COLLECTIONS[id];
  const cover = members.reduce((best, m) => (latestChangeTime(m) >= latestChangeTime(best) ? m : best)); // changelog 最新的当封面，同天取排后面的
  return {
    ...cover,
    slug: id, collection: id, isCollection: true, members,
    title_zh: meta.title_zh, title_bm: meta.title_bm, desc: meta.desc,
    url: null, hasLeaderboard: false,
    standards: mergeStandards(members),
    changelog: members.flatMap((m) => (m.changelog || []).map((c) => ({ ...c, setLabel: m.setLabel })))
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
  };
}
// 首页与筛选的最小单位：普通工具照旧，同一合集的成员合成 1 个 entry（出现在第一个成员的位置）
let entriesCache = null;
function allEntries() {
  if (entriesCache) return entriesCache;
  const published = TOOLS.filter((t) => t.status === "published" && !!t.url);
  const seen = new Set();
  entriesCache = [];
  published.forEach((t) => {
    if (!t.collection || typeof TOOL_COLLECTIONS === "undefined" || !TOOL_COLLECTIONS[t.collection]) { entriesCache.push(t); return; }
    if (seen.has(t.collection)) return;
    seen.add(t.collection);
    entriesCache.push(buildCollectionEntry(t.collection, published.filter((m) => m.collection === t.collection)));
  });
  return entriesCache;
}
// ?tool= 可以是工具 slug，也可以是合集 id
function findToolOrEntry(slug) {
  return TOOLS.find((t) => t.slug === slug) || allEntries().find((e) => e.isCollection && e.slug === slug) || null;
}

// 「新」（规格 7c）：changelog 里最早一条（＝首次上架）在 7 天内，全站最多只标最新的 8 个。
// 合集以最新上架的那份成员算。
const NEW_TOOL_DAYS = 7;
const NEW_TOOL_MAX = 8;
function firstReleaseTime(tool) {
  if (tool.members) return Math.max(...tool.members.map(firstReleaseTime));
  const times = (tool.changelog || []).map((c) => Date.parse(c.date)).filter((n) => !isNaN(n));
  return times.length ? Math.min(...times) : NaN;
}
let newSlugs = null;
function isNewTool(tool) {
  if (!newSlugs) {
    const today = Math.floor(Date.now() / 86400000);
    newSlugs = new Set(allEntries()
      .map((e, i) => ({ slug: e.slug, t: firstReleaseTime(e), i }))
      .filter((x) => isFinite(x.t) && today - Math.floor(x.t / 86400000) <= NEW_TOOL_DAYS)
      .sort((a, b) => (b.t - a.t) || (b.i - a.i))
      .slice(0, NEW_TOOL_MAX)
      .map((x) => x.slug));
  }
  return newSlugs.has(tool.slug);
}

// 跨年级工具（有 coverage）写范围「1–6年级」，其他写「N年级」
function gradeLabel(tool) {
  if (tool.coverage && tool.coverage.length) {
    const years = tool.coverage.map((r) => r.tahun);
    const lo = Math.min(...years), hi = Math.max(...years);
    return lo === hi ? `${lo}年级` : `${lo}–${hi}年级`;
  }
  return `${tool.tahun}年级`;
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
  if (tool.members) return tool.members.reduce((sum, m) => sum + getLikes(m), 0);
  return (toolStatsCache[tool.slug] && toolStatsCache[tool.slug].likesCount) || 0;
}
function getToolUses(tool) {
  return tool.members ? tool.members.reduce((sum, m) => sum + getUses(m.slug), 0) : getUses(tool.slug);
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
  if (isUncountedVisitor()) return; // 自动化浏览器／卢老师自己的设备不计（链接本来就带 kh=1，工具端也不会计）
  const { data, error } = await supabaseClient.rpc("increment_tool_uses", { p_slug: slug });
  if (error) { console.error("记录使用次数失败", error); return; }
  toolStatsCache[slug] = { ...(toolStatsCache[slug] || { likesCount: 0, liked: false }), usesCount: data };
  renderStats();
}

const boardEl = document.getElementById("board");
const boardEmptyEl = document.getElementById("boardEmpty");
const gradeFacetEl = document.getElementById("gradeFacet");
const subjekFacetEl = document.getElementById("subjekFacet");
const topicRowEl = document.getElementById("topicRow");
const topicFacetEl = document.getElementById("topicFacet");

// 条件只存在网址里（刷新、返回键、传网址都保留）；不记在浏览器里——
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

// ---------- 整页只有一套条件（2026-10-02 老师反馈：上面选 1 年级马来文，下面还显示全部，会混淆） ----------
// finderState 是唯一来源：搜索框、年级／科目／主题药丸、课标精确查找都只改它，下面的卡片读它。
// 2026-10-17 改版（docs/hub-reorg-2026-10.md 第 3 节）：面板里只剩这一套药丸，不再有下拉和第二套按钮。
function clearAllConditions() {
  finderState = { tahun: null, subjek: null, topic: null, unit: null, objective: null, q: "" };
  finderQueryEl.value = "";
  renderFinder();
}

// 科目药丸：有工具（或有学习目标索引）的排前面可以按；还没有工具的排后面、灰色按不到——
// 不删掉，让老师看得出「这科还能开发」（2026-10-01 老师定）。
// 灰色只放「这个年级课纲里本来就有」的科目；课纲没有的（如 4 年级的科学与科技世界）不列，
// 不然会被误读成「可以开发」。年级分段依 docs/subjek-tahun.md（KSSR Semakan 2017，2026-07-21 查证）。
const SUBJECT_TAHUN = { am: [1], dst: [1, 2, 3], sains: [4, 5, 6], sejarah: [4, 5, 6], rbt: [4, 5, 6] };
function subjectOfferedIn(code, tahun) {
  return !tahun || tahun === "all" || !SUBJECT_TAHUN[code] || SUBJECT_TAHUN[code].includes(Number(tahun));
}
// 药丸与分段小标题的科目顺序：华文、数学、马来文、英文在前（规格 7c），其余照 SUBJECTS 原顺序
const SUBJECT_FIRST = ["bc", "mt", "bm", "bi"];
const SUBJECTS_IN_DISPLAY_ORDER = [...SUBJECT_FIRST.map((c) => SUBJECT_BY_CODE[c]), ...SUBJECTS.filter((s) => !SUBJECT_FIRST.includes(s.code))];
function subjectHasContent(code, tahun) {
  if (finderToolsFor(tahun, code).length) return true;
  return typeof DSKP_INDEX !== "undefined" && DSKP_INDEX.some((r) => r.subjek === code && (!tahun || r.tahun === tahun));
}

function makePill(label, { active, off, count, big, title, suffix, onClick }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "pill" + (big ? " pill--big" : "") + (active ? " active" : "");
  btn.textContent = label;
  if (suffix) {
    // 手机上年级药丸缩成一排「1 2 3 4 5 6」，「年级」两字用 CSS 藏起来，读屏仍读得到
    const s = document.createElement("span");
    s.className = "pill__suffix";
    s.textContent = suffix;
    btn.appendChild(s);
  }
  if (count != null) {
    const n = document.createElement("span");
    n.className = "pill__n";
    n.textContent = count;
    btn.appendChild(n);
  }
  if (title) btn.title = title;
  if (off) btn.disabled = true;
  else {
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.addEventListener("click", onClick);
  }
  return btn;
}

// 选了年级＋科目才出现的主题药丸：数量只算这个年级×科目（及已选单元）里的工具，同 zh 的主题合成一颗
function topicPoolEntries() {
  if (!finderState.tahun || !finderState.subjek) return [];
  const entries = new Map();
  finderToolsFor(finderState.tahun, finderState.subjek).filter(toolMatchesUnit).forEach((tool) => {
    const topic = toolTopic(tool);
    if (!topic) return;
    const key = topic.zh || topic.bm;
    if (!entries.has(key)) entries.set(key, { key, label: topicText(topic, finderState.subjek), n: 0 });
    entries.get(key).n += 1;
  });
  return [...entries.values()].sort((a, b) => b.n - a.n);
}

function renderFacets() {
  gradeFacetEl.replaceChildren(...TAHUN.map((g) => makePill(String(g), {
    big: true,
    suffix: "年级",
    active: finderState.tahun === g,
    onClick: () => pickGrade(g),
  })));

  const withContent = SUBJECTS_IN_DISPLAY_ORDER.filter((s) => subjectHasContent(s.code, finderState.tahun));
  const empty = SUBJECTS_IN_DISPLAY_ORDER.filter((s) => !withContent.includes(s) && subjectOfferedIn(s.code, finderState.tahun));
  subjekFacetEl.replaceChildren(
    ...withContent.map((s) => makePill(s.title_zh, {
      active: finderState.subjek === s.code,
      count: finderToolsFor(finderState.tahun, s.code).length,
      onClick: () => pickSubject(s.code),
    })),
    ...empty.map((s) => makePill(s.title_zh, { off: true, title: "这个科目还没有工具" }))
  );

  const topics = topicPoolEntries();
  topicRowEl.hidden = !topics.length;
  topicFacetEl.replaceChildren(...topics.map((t) => makePill(t.label, {
    active: finderState.topic === t.key,
    count: t.n,
    onClick: () => pickTopic(t.key),
  })));
}

function pickGrade(g) {
  finderState.tahun = finderState.tahun === g ? null : g;
  if (finderState.subjek && !subjectHasContent(finderState.subjek, finderState.tahun)) finderState.subjek = null;
  finderState.topic = null; finderState.unit = null; finderState.objective = null; // 单元索引按年级×科目分，换了就失效
  renderFinder();
}
function pickSubject(code) {
  finderState.subjek = finderState.subjek === code ? null : code;
  finderState.topic = null; finderState.unit = null; finderState.objective = null;
  renderFinder();
}
function pickTopic(key) {
  finderState.topic = finderState.topic === key ? null : key;
  renderFinder();
}

function tagChips(tool) {
  const topic = topicLabel(tool);
  const mode = tool.modes && tool.modes[0];
  const scope = `${gradeLabel(tool)}·${tool.coverage ? "综合学科" : SUBJECT_BY_CODE[tool.subjek].title_zh}`;
  return [
    topic ? `<span class="tag tag--topic">${topic}</span>` : "",
    mode ? `<span class="tag tag--mode">${mode}</span>` : "",
    tool.type ? `<span class="tag tag--type">${tool.type}</span>` : "",
    `<span class="tag">${scope}</span>`,
  ].join("");
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
  const uses = getToolUses(tool);
  const liked = !tool.isCollection && hasLiked(tool.slug);
  const cover = tool.thumbnails && tool.thumbnails[0];
  // 合集卡：副标放「N 份复习卷」；喜欢数是各份加总，只读（不能点）；不放排行榜奖杯
  const subtitle = tool.isCollection ? `${tool.members.length} 份复习卷` : tool.title_bm;
  const likeHtml = tool.isCollection
    ? `<span class="card__like card__like--static" title="各份复习卷的喜欢数加总">${starIcon()}<span class="card__like-count">${getLikes(tool)}</span> 人喜欢</span>`
    : `<button class="card__like${liked ? " liked" : ""}" data-like-slug="${tool.slug}" title="不用登录，谁都能点">${starIcon()}<span class="card__like-count">${getLikes(tool)}</span> 人喜欢</button>`;
  return `
    <div class="card" data-slug="${tool.slug}">
      <div class="card__thumb">${cover
        ? (cover.img ? thumbImgHtml(cover, index < 4) : `<span>${cover.label}</span>`)
        : `<span>${subjectBadge(tool.subjek)}</span>`}${isNewTool(tool)
        ? '<strong class="card__new">新</strong>'
        : ""}${tool.hasLeaderboard
        ? `<a class="card__board" href="${tool.url}?board=1" target="_blank" rel="noopener" title="查看排行榜" aria-label="查看排行榜" onclick="event.stopPropagation()">${trophyIcon()}</a>`
        : ""}</div>
      <h3 class="card__title-zh">${tool.title_zh}</h3>
      <p class="card__title-bm">${subtitle}</p>
      ${creatorHtml(tool) || '<div class="creator"></div>'}
      <div class="card__tags">${tagChips(tool)}</div>
      <div class="card__stats">
        ${likeHtml}
        <span class="card__uses">用过 ${uses} 次</span>
      </div>
    </div>`;
}

function matchesQuery(tool, query) {
  // 合集：任一成员命中，或合集名称命中，就显示整组
  if (tool.members) {
    return tool.members.some((m) => matchesQuery(m, query)) || `${tool.title_zh} ${tool.title_bm} ${tool.slug}`.toLowerCase().includes(query);
  }
  const topic = toolTopic(tool);
  const haystack = [
    tool.title_zh, tool.title_bm, (tool.keywords || []).join(" "), tool.slug, tool.type,
    topic ? `${topic.zh || ""} ${topic.bm || ""}` : "", (tool.modes || []).join(" "),
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
function toolMatchesTopic(tool) {
  return !finderState.topic || topicKey(tool) === finderState.topic;
}
function boardTools() {
  const query = boardQuery();
  // 年级 AND 科目 AND 主题 AND 单元／学习目标 AND（没有查询词 OR 查询词匹配）
  // （年级科目与查询词要同时成立，见 docs/dskp-learning-objective-search.md 第7.1节／验收条件第2条）
  return allEntries().filter((tool) =>
    matchesToolCoverage(tool, finderState.tahun, finderState.subjek) && toolMatchesTopic(tool) &&
    toolMatchesUnit(tool) && (!query || matchesQuery(tool, query))
  );
}

// 卡片上方一行「目前条件」：让老师知道下面为什么只剩这几张，也能一键清掉
function renderBoardSummary(count) {
  const el = document.getElementById("boardSummary");
  if (!el) return;
  const parts = [];
  if (finderState.tahun) parts.push(`${finderState.tahun}年级`);
  if (finderState.subjek) parts.push(SUBJECT_BY_CODE[finderState.subjek].title_zh);
  const topic = finderState.topic && topicPoolEntries().find((t) => t.key === finderState.topic);
  if (topic) parts.push(topic.label);
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

// 卡片排序与分段（规格第 3 节）：「新」排前面，其余按喜欢数；
// 没选年级＝不分段；只选年级＝按科目分段（跨年级工具归「综合学科」）；年级＋科目＝不分段，同主题排一起。
function sortNewThenLikes(list) {
  return list.slice().sort((a, b) => (Number(isNewTool(b)) - Number(isNewTool(a))) || (getLikes(b) - getLikes(a)));
}
function boardSections(list) {
  const sorted = sortNewThenLikes(list);
  if (!finderState.tahun) return [{ items: sorted }];
  if (finderState.subjek) {
    const order = [];
    sorted.forEach((t) => { const k = topicKey(t); if (k && !order.includes(k)) order.push(k); });
    const rank = (t) => { const k = topicKey(t); return k ? order.indexOf(k) : order.length; };
    return [{ items: sorted.slice().sort((a, b) => rank(a) - rank(b)) }];
  }
  const groups = new Map();
  sorted.forEach((t) => {
    const key = t.coverage ? "_multi" : t.subjek;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  });
  return [...SUBJECTS_IN_DISPLAY_ORDER.map((s) => [s.code, s.title_zh]), ["_multi", "综合学科"]]
    .filter(([key]) => groups.has(key))
    .map(([key, heading]) => ({ heading, items: groups.get(key) }));
}
function renderBoard() {
  const list = boardTools();
  renderBoardSummary(list.length);

  let cardIndex = 0;
  boardEl.innerHTML = boardSections(list).map((section) =>
    (section.heading ? `<h3 class="board__section">${section.heading}<span class="board__section-count">${section.items.length} 个</span></h3>` : "") +
    section.items.map((tool) => cardHtml(tool, cardIndex++)).join("")
  ).join("");
  boardEmptyEl.hidden = list.length > 0;
  boardEl.hidden = list.length === 0;

  boardEl.querySelectorAll(".card[data-slug]").forEach((el) => {
    el.addEventListener("click", () => {
      const tool = findToolOrEntry(el.dataset.slug);
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

// 合集：各份卷练什么（给老师读，放在说明之下）
function renderSetNotes(tool) {
  const el = document.getElementById("detailSetNotes");
  el.hidden = !tool.isCollection;
  el.innerHTML = !tool.isCollection ? "" : tool.members.map((m) =>
    `<p><strong>${m.setLabel}</strong>${m.practiceSummary || ""}</p>`).join("");
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
      ${rows.map((c) => `<li><span class="detail__changelog-version">v${c.version}</span> · ${c.date} · ${c.setLabel ? `【${c.setLabel}】` : ""}${c.note}</li>`).join("")}
    </ul>
  `;
}

// 分隔线以下给老师的资料：类型、同主题的其他工具、老师后台入口（规格第 4 节）
const RELATED_TOOLS_MAX = 8;
function relatedTools(tool) {
  const key = topicKey(tool);
  if (!key) return [];
  return allEntries()
    .filter((t) => t.slug !== tool.slug && topicKey(t) === key)
    .sort((a, b) => (Number(b.tahun === tool.tahun) - Number(a.tahun === tool.tahun)) || (a.tahun - b.tahun))
    .slice(0, RELATED_TOOLS_MAX);
}
function renderDetailMore(tool) {
  const typeEl = document.getElementById("detailType");
  typeEl.hidden = !tool.type;
  typeEl.textContent = tool.type ? `类型：${tool.type}` : "";

  const relatedEl = document.getElementById("detailRelated");
  const related = relatedTools(tool);
  relatedEl.hidden = !related.length;
  relatedEl.innerHTML = !related.length ? "" : `
    <p class="detail__more-title">同主题的其他工具 <span class="detail__more-topic">${topicLabel(tool)}</span></p>
    <div class="detail__related-list">${related.map((t) => {
      const cover = t.thumbnails && t.thumbnails[0];
      return `<button type="button" class="related-tool" data-slug="${t.slug}">
        <span class="related-tool__thumb">${cover && cover.img ? thumbImgHtml(cover, false) : ""}</span>
        <span class="related-tool__text"><span class="related-tool__name">${t.title_zh}</span><span class="related-tool__meta">${gradeLabel(t)}</span></span>
      </button>`;
    }).join("")}</div>`;
  relatedEl.querySelectorAll(".related-tool").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = findToolOrEntry(btn.dataset.slug);
      if (next) openDetail(next);
    });
  });

  // 老师后台：只有登记在 data/teacher/index.js 的工具才有（该档还没建好或载入失败时 TEACHER_TOOLS 不存在，当没有）
  // 合集的「老师后台」按钮在每份卷各自那一行，这里只留一句说明
  const teacherEl = document.getElementById("detailTeacher");
  const hasTeacher = (t) => typeof TEACHER_TOOLS !== "undefined" && Array.isArray(TEACHER_TOOLS) && TEACHER_TOOLS.includes(t.slug);
  const showTeacher = tool.isCollection ? tool.members.some(hasTeacher) : hasTeacher(tool);
  teacherEl.hidden = !showTeacher;
  teacherEl.innerHTML = !showTeacher ? ""
    : tool.isCollection
      ? `<span class="detail__teacher-note">各份复习卷的「老师后台」在上面各自那一行。需要先在『我的班级』建班，让学生用班级码作答</span>`
      : `<a class="detail__teacher-link" href="teacher.html?tool=${encodeURIComponent(tool.slug)}" target="_blank" rel="noopener">老师后台</a><span class="detail__teacher-note">需要先在『我的班级』建班，让学生用班级码作答</span>`;
}

// 合集详情：每份卷一行（范围、名称、版本、开始使用、分享给学生、老师后台）。
// 分享链接是 Hub 的 ?tool=<成员 slug>，打开后是整组详情并标出那一份，同一般工具的分享做法。
const SHARE_ICON = '<svg class="detail__share-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M12 3l-4 4M12 3l4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function renderDetailSets(entry, highlightSlug) {
  const el = document.getElementById("detailSets");
  const hasTeacher = (t) => typeof TEACHER_TOOLS !== "undefined" && Array.isArray(TEACHER_TOOLS) && TEACHER_TOOLS.includes(t.slug);
  el.hidden = false;
  el.innerHTML = `
    <p class="detail__sets-hint">共 ${entry.members.length} 份，选一份开始，或把那一份的链接发给学生</p>
    <ul class="detail__sets-list">${entry.members.map((m) => `
      <li class="set${m.slug === highlightSlug ? " set--hl" : ""}" data-slug="${m.slug}">
        <div class="set__info">
          <span class="set__label">${m.setLabel || "复习卷"}${m.slug === highlightSlug ? '<span class="set__here">链接指向这份</span>' : ""}</span>
          <span class="set__name">${m.title_zh}<span class="detail__version">${m.version ? `v${m.version}` : ""}</span></span>
        </div>
        <a class="detail__open set__open" href="${m.url}?kh=1" target="_blank" rel="noopener">开始使用</a>
        <div class="set__sub">
          <button type="button" class="detail__share set__share">${SHARE_ICON}<span class="set__share-label">分享给学生</span></button>
          ${hasTeacher(m) ? `<a class="set__teacher" href="teacher.html?tool=${encodeURIComponent(m.slug)}" target="_blank" rel="noopener">老师后台</a>` : ""}
        </div>
        <input class="set__url" type="text" readonly hidden aria-label="${m.setLabel || m.title_zh} 分享链接">
        <div class="detail__share-qr set__qr" hidden></div>
      </li>`).join("")}</ul>`;
  el.querySelectorAll(".set").forEach((row) => {
    const m = entry.members.find((x) => x.slug === row.dataset.slug);
    row.querySelector(".set__open").addEventListener("click", () => { bumpUses(m.slug); });
    row.querySelector(".set__share").addEventListener("click", () => shareToolLink(m.slug, {
      box: row.querySelector(".set__qr"), field: row.querySelector(".set__url"), label: row.querySelector(".set__share-label"),
    }));
  });
}

// 合集详情的画廊：每份卷的封面各一格（1、2、4 份各有版位；3 份时取前 2 份）
function setGalleryShots(entry) {
  const shots = entry.members.map((m) => {
    const c = (m.thumbnails && m.thumbnails[0]) || { label: "缩略图待补" };
    return { ...c, label: `${m.setLabel}：${c.label || m.title_zh}` };
  });
  return shots.length === 3 ? shots.slice(0, 2) : shots;
}

let currentDetailSlug = null; // 「分享给学生」分享的是哪个工具（合集详情里各份卷自己有分享按钮，用不到）

function openDetail(tool, highlightSlug) {
  // 点的是合集成员（?tool=成员 slug、搜索建议等）：打开整组详情并标出那一份
  if (tool.collection && !tool.isCollection) {
    const entry = allEntries().find((e) => e.isCollection && e.slug === tool.collection);
    if (entry) { openDetail(entry, tool.slug); return; }
  }
  const isSet = !!tool.isCollection;
  currentDetailSlug = isSet ? null : tool.slug;
  const detailUrl = new URL(window.location.href);
  detailUrl.searchParams.set("tool", isSet && highlightSlug ? highlightSlug : tool.slug);
  window.history.replaceState(null,"",detailUrl);
  renderGallery(isSet ? setGalleryShots(tool) : tool.thumbnails);
  document.getElementById("detailCreator").innerHTML = creatorHtml(tool);
  document.getElementById("detailTitleZh").textContent = tool.title_zh;
  document.getElementById("detailTitleBm").textContent = tool.title_bm;
  document.getElementById("detailDesc").textContent = tool.desc;
  renderSetNotes(tool);
  renderStandards(tool);
  document.getElementById("detailSlug").textContent = tool.slug;
  document.getElementById("detailUses").textContent = `用过 ${getToolUses(tool)} 次`;
  document.getElementById("detailVersion").textContent = isSet ? `${tool.members.length} 份` : (tool.version ? `v${tool.version}` : "");
  renderChangelog(tool);
  renderDetailMore(tool);

  const actionsEl = document.querySelector(".detail__actions");
  const setsEl = document.getElementById("detailSets");
  actionsEl.hidden = isSet;
  setsEl.hidden = !isSet;
  if (isSet) {
    setsEl.innerHTML = "";
    renderDetailSets(tool, highlightSlug);
  } else {
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
  }

  document.getElementById("detailModal").classList.add("open");
  const frame = document.querySelector(".modal__frame--detail");
  frame.scrollTop = 0; // 从「同主题」切过来时回到第一屏
  const hl = setsEl.querySelector(".set--hl");
  if (hl) hl.scrollIntoView({ block: "nearest" });
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
// 首页查找面板：搜索框 → 年级 → 科目 → 主题；单元／学习目标收在「按课标精确查找」里
// （docs/hub-reorg-2026-10.md 第 3 节；学习目标检索原规格 docs/dskp-learning-objective-search.md）
// ============================================================
const finderQueryEl = document.getElementById("finderQuery");
const finderSuggestionsEl = document.getElementById("finderSuggestions");
const finderAdvEl = document.getElementById("finderAdv");
const finderStatusEl = document.getElementById("finderStatus");
const finderPathEl = document.getElementById("finderPath");
const finderUnitsEl = document.getElementById("finderUnits");
const finderResultsEl = document.getElementById("finderResults");

let finderState = { tahun: null, subjek: null, topic: null, unit: null, objective: null, q: "" };

function finderToolsFor(tahun, subjek) {
  return allEntries().filter((t) => matchesToolCoverage(t, tahun, subjek));
}

// 「按课标精确查找」里的提示：还没选好年级科目、或这个年级科目还没建学习目标索引时，如实说明
function renderFinderStatus() {
  const { tahun, subjek } = finderState;
  let msg = "";
  if (!tahun || !subjek) msg = "先在上面选好年级和科目，这里会列出该科目的单元与学习目标。";
  else if (!findDskpRecord(tahun, subjek)) {
    const n = finderToolsFor(tahun, subjek).length;
    msg = `${tahun}年级${SUBJECT_BY_CODE[subjek].title_zh}目前有 ${n} 个工具，还没按学习目标细分（工具已列在下方）。`;
  }
  finderStatusEl.hidden = !msg;
  finderStatusEl.textContent = msg;
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

// 单元对照卡（可练习什么／准备条件／DSKP 核对状态）：选定单元／学习目标后，在「按课标精确查找」里列出符合的工具。
// 合集（复习卷）一组一张，各份的内容按「范围：说明」分行列出。
function finderResultCardHtml(tool) {
  const parts = tool.members || [tool];
  const resolved = resolveToolStandards(tool);
  const objectives = finderState.objective
    ? resolved.flatMap((r) => r.objectives.filter((o) => o.code === finderState.objective))
    : resolved.flatMap((r) => r.objectives);
  const objLabel = objectives.map((o) => `${o.code} ${o.title_zh}`).join("、");
  const unitPart = resolved.map((r) => `${r.unit.code} ${r.unit.title_zh}`).join("；");
  const verifiedAt = resolved[0] ? resolved[0].record.verifiedAt : "";
  // 截取档没有审核（record.reviewed === false），不能写成「已核对」
  const unreviewed = resolved[0] && resolved[0].record.reviewed === false;
  const perPart = (field) => tool.members
    ? parts.map((m) => `<span class="finder-card__part"><strong>${m.setLabel}</strong> ${m[field] || "—"}</span>`).join("")
    : (tool[field] || "—");
  const modes = [...new Set(parts.flatMap((m) => m.teachingMode || []))].join("、") || "—";
  return `
    <div class="finder-card" data-slug="${tool.slug}">
      <h4>${tool.title_zh} <span class="finder-card__bm">${tool.isCollection ? `${parts.length} 份复习卷` : tool.title_bm}</span></h4>
      <dl class="finder-card__meta">
        <div><dt>对应学习目标</dt><dd>Tahun ${tool.tahun} ${SUBJECT_BY_CODE[tool.subjek].title_zh} · ${unitPart}${objLabel ? " · " + objLabel : ""}</dd></div>
        <div><dt>可练习什么</dt><dd>${perPart("practiceSummary")}</dd></div>
        <div><dt>课堂方式</dt><dd>${modes}</dd></div>
        <div><dt>准备条件</dt><dd>${perPart("prep")}</dd></div>
        <div><dt>DSKP 核对状态</dt><dd>${unreviewed ? `已对照 · ${verifiedAt}` : `已核对 · ${verifiedAt}`}</dd></div>
      </dl>
    </div>`;
}

// 选定了单元／学习目标：有工具就列对照卡，没有就如实说没有并给许愿入口（卡片区同时显示这些工具）
function renderFinderNote() {
  if (!finderState.unit) { finderResultsEl.innerHTML = ""; return; }
  const matches = boardTools();
  if (!matches.length) {
    finderResultsEl.innerHTML = `
      <p class="finder__empty">这个学习目标目前还没有工具。</p>
      <button type="button" class="finder__wish-cta" id="finderWishCta">找不到合适工具？告诉我们这堂课卡在哪里</button>`;
    document.getElementById("finderWishCta").addEventListener("click", openWishFromFinder);
    return;
  }
  finderResultsEl.innerHTML = `<p class="finder__count">找到 ${matches.length} 个工具</p>` + matches.map(finderResultCardHtml).join("");
  finderResultsEl.querySelectorAll(".finder-card").forEach((card) => {
    card.addEventListener("click", () => {
      const tool = findToolOrEntry(card.dataset.slug);
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
  allEntries().forEach((tool) => {
    const parts = tool.members || [tool];
    const hay = [tool.title_zh, tool.title_bm, ...parts.flatMap((m) => [m.title_zh, m.title_bm, ...(m.keywords || [])])].join(" ").toLowerCase();
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
        finderState.tahun = s.record.tahun; finderState.subjek = s.record.subjek; finderState.topic = null;
        finderState.unit = s.unit.code; finderState.objective = null;
      } else if (s.type === "objective") {
        finderState.tahun = s.record.tahun; finderState.subjek = s.record.subjek; finderState.topic = null;
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
  if (finderState.topic) params.set("topic", finderState.topic);
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
  const topicRaw = params.get("topic");
  const unitRaw = params.get("unit");
  const objectiveRaw = params.get("objective");
  const q = params.get("q") || "";

  const validTahun = TAHUN.includes(tahunRaw) ? tahunRaw : null;
  const validSubjek = SUBJECT_BY_CODE[subjekRaw] && subjectHasContent(subjekRaw, validTahun) ? subjekRaw : null;
  const record = validTahun && validSubjek ? findDskpRecord(validTahun, validSubjek) : null;
  let validUnit = null, validObjective = null;
  if (record && unitRaw) {
    const u = getUnit(record, unitRaw);
    if (u) {
      validUnit = u.code;
      if (objectiveRaw && getObjective(u, objectiveRaw)) validObjective = objectiveRaw;
    }
  }
  // 主题合不合法要等年级、科目、单元都定了才查，交给 renderFinder 的 normalizeFinderTopic
  finderState = { tahun: validTahun, subjek: validSubjek, topic: topicRaw || null, unit: validUnit, objective: validObjective, q };
  finderQueryEl.value = q;
}

// 年级、科目、单元换了以后，主题药丸的范围跟着变：不在范围内的主题条件自动放掉（也挡住网址里的旧／乱主题）
function normalizeFinderTopic() {
  if (finderState.topic && !topicPoolEntries().some((t) => t.key === finderState.topic)) finderState.topic = null;
}

function renderFinder() {
  normalizeFinderTopic();
  if (finderState.unit) finderAdvEl.open = true; // 从网址或搜索建议带着单元进来时，把「按课标精确查找」展开给老师看
  renderFinderStatus();
  renderFinderPath();
  renderFinderUnits();
  renderFinderNote();
  updateFinderUrl();
  renderFacets();
  renderBoard();
}

finderQueryEl.addEventListener("input", () => {
  finderState.q = finderQueryEl.value.trim();
  renderFinderSuggestions();
  updateFinderUrl();
  renderBoard();
});
document.addEventListener("click", (e) => {
  if (!finderSuggestionsEl.contains(e.target) && e.target !== finderQueryEl) finderSuggestionsEl.hidden = true;
});
// 下拉建议会盖住下面的卡片：Enter＝收起建议、直接看下方卡片；Esc＝只收起建议
finderQueryEl.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { finderSuggestionsEl.hidden = true; return; }
  if (e.key !== "Enter") return;
  e.preventDefault();
  finderSuggestionsEl.hidden = true;
  finderQueryEl.blur(); // 手机上顺便收起键盘
  if (finderState.q && boardTools().length) scrollToBoard();
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

// 第 2 步的示例随科目换：数学示例带数字，老师才会照着写出「题目＋学生的错误答案」
const WISH_PLACEHOLDERS = {
  mt: { task: "例：求一组数据的中位数", problem: "例：学生把出现次数最多的数，当成了中位数", example: "例：求 3、8、3、9、5 的中位数 → 学生答 3（应该是 5）" },
  _default: { task: "例：听写水果单元的 10 个英文词", problem: "例：会念 banana，却写成 bnana、benana；10 题只对 2 题", example: "例：听写 banana → 学生写 bnana" },
};
function updateWishPlaceholders() {
  const ph = WISH_PLACEHOLDERS[wishSubjekEl.value] || WISH_PLACEHOLDERS._default;
  document.getElementById("wishTask").placeholder = ph.task;
  document.getElementById("wishProblem").placeholder = ph.problem;
  document.getElementById("wishExample").placeholder = ph.example;
}
wishSubjekEl.addEventListener("change", updateWishPlaceholders);

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
  if (step === 2) updateWishPlaceholders();
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
    problemExample: document.getElementById("wishExample").value,
    problemCause: document.getElementById("wishCause").value,
    triedAlready: document.getElementById("wishTried").value,
    desiredHelp: wishSelections.desiredHelp.value,
    device: wishSelections.device.value,
    classroomContext: document.getElementById("wishContext").value,
    credit: document.getElementById("wishCredit").value,
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
  document.getElementById("wishExample").value = saved.problemExample || "";
  document.getElementById("wishCause").value = saved.problemCause || "";
  document.getElementById("wishTried").value = saved.triedAlready || "";
  document.getElementById("wishContext").value = saved.classroomContext || "";
  document.getElementById("wishCredit").value = saved.credit || "";
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
  const example = document.getElementById("wishExample").value.trim();
  return [
    `题目／活动：${document.getElementById("wishTask").value.trim()}`,
    `学生表现：${document.getElementById("wishProblem").value.trim()}`,
    example && `错例：${example}`,
    cause && `老师判断原因：${cause}`,
  ].filter(Boolean).join("\n");
}

// 署名偏好不另开栏位（不改表结构）：附在「补充」后面的一行，后台照行显示；没填就不加，开发时默认写「一位×年级老师」
function composeWishContext() {
  const ctx = document.getElementById("wishContext").value.trim();
  const credit = document.getElementById("wishCredit").value.trim();
  const out = [ctx, credit && `署名：${credit}`].filter(Boolean).join("\n");
  return out || null;
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
    classroom_context: composeWishContext(),
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
    problemExample: document.getElementById("wishExample").value,
    problemCause: document.getElementById("wishCause").value,
    triedAlready: document.getElementById("wishTried").value,
    desiredHelp: wishSelections.desiredHelp.value,
    device: wishSelections.device.value,
    classroomContext: document.getElementById("wishContext").value,
    credit: document.getElementById("wishCredit").value,
    savedAt: Date.now(),
  };
  // 按规格 3.2：不暂存学校资料和隐私确认
}
function hasDraftContent() {
  const d = collectWishDraft();
  return !!(d.learningGoal || d.problemTask || d.problemDescription || d.problemExample || d.problemCause || d.tahun || d.subjek || d.unitObjective || d.triedAlready || d.desiredHelp || d.device || d.classroomContext || d.credit);
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
  updateWishPlaceholders();
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
// 2026-10-17：自动化浏览器（Playwright 验收）与卢老师自己的设备（开过一次 ?nocount=1）不计入到访／使用，数字只反映别人真的打开
// 与工具端 data/track-use.js 用同一个 key，Hub 和工具规则一致；?nocount=0 取消。只从网址删掉 nocount，筛选条件保留
const NO_COUNT_KEY = "kongsi-idea-no-count";
function isUncountedVisitor() {
  if (navigator.webdriver) return true;
  try {
    const u = new URL(location.href);
    const q = u.searchParams.get("nocount");
    if (q === "1") localStorage.setItem(NO_COUNT_KEY, "1");
    if (q === "0") localStorage.removeItem(NO_COUNT_KEY);
    if (q !== null) { u.searchParams.delete("nocount"); history.replaceState(null, "", u.pathname + u.search + u.hash); }
    return localStorage.getItem(NO_COUNT_KEY) === "1";
  } catch (e) { return false; }
}
async function bumpPageViews() {
  const lastVisit = Number(localStorage.getItem(LAST_VISIT_KEY) || 0);
  const now = Date.now();
  // 不计的访客一律只读数字，不 +1，也不写 LAST_VISIT_KEY
  const isNewVisit = !isUncountedVisitor() && (!lastVisit || (now - lastVisit) > VISIT_SESSION_WINDOW_MS);
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
  const toolCount = allEntries().length; // 合集（复习卷）算 1 个
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
renderStats();
resetWishForm();
loadFinderFromUrl();
renderFinder();
maybeShowWelcome();
loadToolStats();
initAuth();
const requestedToolSlug = new URLSearchParams(window.location.search).get("tool");
if (requestedToolSlug) {
  const requestedTool = findToolOrEntry(requestedToolSlug);
  if (requestedTool) openDetail(requestedTool);
  else showToast("找不到这个工具，请从目录重新选择。","error");
}
// 分享给学生：一次点击做两件事——复制链接＋就地生成QR码（离线的 qrcode-generator
// 库，不外传网址给第三方 API）。老师课堂上两个通常都要（投影QR＋链接留着备用），
// 不用先选「要哪一种分享方式」。再点一次收起QR（不重复复制，避免每次点都跳提示）。
// 一般工具只有一个分享按钮；合集详情里每份卷各自一个，QR 各自生成。
async function shareToolLink(slug, { box, field, label }) {
  if (!slug) return;
  if (!box.hidden) { box.hidden=true; label.textContent="分享给学生"; return; }

  // 复习卷的每一份直接给工具网址：老师发哪一份，学生打开就是那一份，不用再从合集里点一次
  const member=TOOLS.find((t)=>t.slug===slug && t.collection && t.url);
  const url=member ? new URL(member.url) : new URL(window.location.pathname,window.location.origin);
  if (!member) url.searchParams.set("tool",slug);
  try { await navigator.clipboard.writeText(url.href); showToast(member ? "已复制这份复习卷的链接" : "已复制课堂点子铺的工具链接"); }
  catch { field.hidden=false; field.value=url.href; field.focus(); field.select(); showToast("请复制已选中的链接"); }

  if (!box.innerHTML) {
    const qr=qrcode(0,"M");
    qr.addData(url.href);
    qr.make();
    box.innerHTML=qr.createSvgTag(6,0);
  }
  box.hidden=false;
  label.textContent="收起分享";
}
document.getElementById("detailShareBtn").addEventListener("click",()=> shareToolLink(currentDetailSlug,{
  box: document.getElementById("detailShareQrBox"),
  field: document.getElementById("detailShareUrl"),
  label: document.getElementById("detailShareLabel"),
}));
