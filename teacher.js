// 通用老师后台 · teacher.html?tool={slug}&code={班级码}
// 取代 6 份各自复制的后台（fuxi / fuxi2 / latihan / latihan2 / mtfuxi / mt1fuxi），合并时对照表见
// ~/Documents/my-agent/.ops/out/teacher-backend-parity.md。权限全由数据库 RLS 把关，前端只负责显示；不改数据库。
// 各工具差异放 data/teacher/{slug}.js（TEACHER_CONFIGS[slug]），这里只有共用的引擎：
//   ① Core：纯计算（可在 node 里直接测）  ② 页面：登录、选班、各分页。
// 口径：答对率、最难题、错误类别、题目分析只用 attempt 1（同人同题取最早一笔）；
//       「重试后」＝第一次对的题 ＋ 第一次错但再试（attempt≥2 取最新一笔）答对的题，只用于总览／学生表／CSV。

// ============================================================
// ① 纯计算
// ============================================================
const TeacherCore = (() => {
  const keyOf = (name, itemId) => name + "\u0000" + itemId;
  const ts = (r) => Date.parse(r.created_at) || 0;
  const escH = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const F = (cfg) => (cfg && cfg.features) || {};
  const MIN_JUDGE = 5;   // 样本少于 5 人不判断偏易／偏难

  function rosterName(s) { return s.name_zh || s.name_en || s.name || ""; }
  const secKey = (s) => (s.no !== undefined ? s.no : s.key !== undefined ? s.key : s.id);
  // 有些工具的 answer 栏存成 {v: 值}（华文复习本）；其余直接存值
  const ansVal = (cfg, r) => (cfg.answerWrap ? (r && r.answer && typeof r.answer === "object" ? r.answer.v : undefined) : (r ? r.answer : undefined));
  const isGraded = (cfg, it) => (F(cfg).writing ? !!it.graded : true);
  const notCat = (cfg) => new Set(cfg.notCategory || ["other", "blank", "__none"]);

  // 答案变成稳定的 key（用来把相同的错答归在一起）
  function ansKey(cfg, a) {
    if (cfg.hooks && cfg.hooks.ansKey) return cfg.hooks.ansKey(a);
    if (a && typeof a === "object") return JSON.stringify(Object.keys(a).sort().map((k) => [k, a[k]]));
    return a === undefined || a === null ? "" : String(a);
  }

  function fieldKey(f, i) { return typeof f === "string" ? f : (f.key || f.id || f.name || String(i)); }
  function fieldLabel(f, i) { return typeof f === "string" ? f : (f.label || f.title || fieldKey(f, i)); }

  // 纯文字（CSV、标签用）
  function fmtAnswer(cfg, item, ans) {
    if (cfg.hooks && cfg.hooks.fmtAnswer) return cfg.hooks.fmtAnswer(item, ans);
    if (ans === undefined || ans === null || ans === "") return "（空）";
    const e = item.entry || {};
    if (e.kind === "multi" && ans && typeof ans === "object") {
      const fields = e.fields || Object.keys(ans);
      return fields.map((f, i) => `${fieldLabel(f, i)} ${ans[fieldKey(f, i)] ?? "–"}`).join("、");
    }
    if (e.kind === "cells") return `${ans} 格`;
    if (e.kind === "number") return (e.unit === "RM" && cfg.rmPrefix) ? `RM ${ans}` : e.unit ? `${ans} ${e.unit}` : String(ans);
    return typeof ans === "object" ? JSON.stringify(ans) : String(ans);
  }
  // 网页显示（HTML 字串，已转义）：choice 的选项交给 bank 的 fmtOption（3/10 会变成上下叠的分数）
  function fmtAnswerHtml(cfg, item, ans, optFn) {
    const e = item.entry || {};
    if (e.kind === "choice" && ans !== undefined && ans !== null && ans !== "" && typeof optFn === "function") return optFn(String(ans));
    return escH(fmtAnswer(cfg, item, ans));
  }

  // 每个（学生，题）取「第一次作答」＝ attempt_no=1 里 created_at 最早的一笔；source 可筛 all/online/paper
  function firstAttempts(rows, source, ignored) {
    const map = new Map();
    for (const r of rows) {
      if (r.attempt_no !== 1) continue;
      if (source && source !== "all" && r.source !== source) continue;
      if (ignored && ignored.has(r.student_name)) continue;
      const k = keyOf(r.student_name, r.item_id);
      const old = map.get(k);
      if (!old || ts(r) < ts(old) || (ts(r) === ts(old) && String(r.id) < String(old.id))) map.set(k, r);
    }
    return map;
  }
  // 再试一次（attempt_no>=2）：每个（学生，题）取最新一笔
  function retryAttempts(rows, source, ignored) {
    const map = new Map();
    for (const r of rows) {
      if (r.attempt_no < 2) continue;
      if (source && source !== "all" && r.source !== source) continue;
      if (ignored && ignored.has(r.student_name)) continue;
      const k = keyOf(r.student_name, r.item_id);
      const old = map.get(k);
      if (!old || ts(r) > ts(old) || (ts(r) === ts(old) && String(r.id) > String(old.id))) map.set(k, r);
    }
    return map;
  }

  // 偏易／刚好／偏难：用各级别实际答对率，按题库里各级别题数加权。
  // weighted＝对照「各级别目标区间按题数加权」的区间；fixed＝对照设定里写死的 lo～hi。
  // 样本（参与人数）少于 5 人，或有级别还没有数据，不判断。
  function judgeDifficulty(cfg, levels, people) {
    const have = levels.filter((l) => l.items > 0);
    if (people < MIN_JUDGE) return { verdict: null, reason: `参与人数 ${people} 人，少于 ${MIN_JUDGE} 人，先不判断` };
    if (!have.length) return { verdict: null, reason: "题库没有标注级别" };
    if (have.some((l) => l.rate === null)) return { verdict: null, reason: "有级别还没有作答数据，先不判断" };
    const wsum = have.reduce((a, l) => a + l.items, 0);
    const w = (f) => have.reduce((a, l) => a + l.items * f(l), 0) / wsum;
    const actual = w((l) => l.rate);
    const v = cfg.verdict || { mode: "weighted" };
    const lo = v.mode === "fixed" ? v.lo : w((l) => l.lo);
    const hi = v.mode === "fixed" ? v.hi : w((l) => l.hi);
    return { verdict: actual > hi ? "easy" : actual < lo ? "hard" : "fit", actual, lo, hi, reason: "", note: v.note || "" };
  }

  function analyze(rows, bank, cfg, opts) {
    const f = F(cfg);
    const source = f.source ? ((opts && opts.source) || "all") : "all";
    const ignored = (f.ignore && opts && opts.ignored) || new Set();
    const NC = notCat(cfg);
    const itemById = new Map(bank.items.map((i) => [i.id, i]));
    const graded = bank.items.filter((i) => isGraded(cfg, i));
    const writing = bank.items.filter((i) => !isGraded(cfg, i));
    const valid = rows.filter((r) => itemById.has(r.item_id));
    const firsts = firstAttempts(valid, source, ignored);
    const retries = f.retry ? retryAttempts(valid, source, ignored) : new Map();
    const N = bank.items.length, G = graded.length;

    // 参与人数：有来源的工具不受来源筛选影响（永远显示在线几人／纸本几人）
    const onlineSet = new Set(), paperSet = new Set();
    if (f.source) {
      for (const r of valid) {
        if (r.attempt_no !== 1 || ignored.has(r.student_name)) continue;
        (r.source === "paper" ? paperSet : onlineSet).add(r.student_name);
      }
    }
    const allSet = new Set([...onlineSet, ...paperSet]);

    const inRosterFlag = new Set();
    for (const r of rows) if (r.in_roster) inRosterFlag.add(r.student_name);

    const perItem = {};
    for (const it of bank.items) perItem[it.id] = { n: 0, correct: 0, rate: null, tags: {}, wrong: {} };
    const students = new Map();
    const tagTotals = {}, tagItems = {};

    for (const r of firsts.values()) {
      const it = itemById.get(r.item_id);
      const pi = perItem[r.item_id];
      pi.n++;
      let s = students.get(r.student_name);
      if (!s) {
        s = { name: r.student_name, answered: 0, gradedAnswered: 0, correct: 0, wrong: [], tags: {}, sources: new Set(), writingDone: 0, byItem: {}, retryByItem: {} };
        students.set(r.student_name, s);
      }
      s.answered++;
      if (r.source) s.sources.add(r.source);
      s.byItem[r.item_id] = r;
      if (!isGraded(cfg, it)) { s.writingDone++; continue; }
      s.gradedAnswered++;
      if (r.is_correct === true) { pi.correct++; s.correct++; }
      else {
        const t = r.error_tag || "__none";
        pi.tags[t] = (pi.tags[t] || 0) + 1;
        tagTotals[t] = (tagTotals[t] || 0) + 1;
        (tagItems[t] = tagItems[t] || {})[r.item_id] = (tagItems[t][r.item_id] || 0) + 1;
        const k = ansKey(cfg, ansVal(cfg, r));
        const w = pi.wrong[k] || (pi.wrong[k] = { key: k, answer: ansVal(cfg, r), count: 0, names: [] });
        w.count++; w.names.push(r.student_name);
        s.wrong.push(r.item_id);
        s.tags[t] = (s.tags[t] || 0) + 1;
      }
    }
    for (const it of graded) { const p = perItem[it.id]; p.rate = p.n ? p.correct / p.n : null; }
    for (const r of retries.values()) {
      const s = students.get(r.student_name);   // 只有「有第一次作答的学生」才出现；孤立的 attempt 2 不单独成人
      if (s) s.retryByItem[r.item_id] = r;
    }

    // 各大题答对率（大题里所有 学生×批改题 的第一次作答合起来算）
    const sections = (bank.sections || []).map((sec) => {
      const key = secKey(sec);
      let n = 0, correct = 0, items = 0;
      for (const it of graded) {
        if (it.section !== key) continue;
        items++; n += perItem[it.id].n; correct += perItem[it.id].correct;
      }
      return { key, title: sec.title, items, n, correct, rate: n ? correct / n : null };
    });

    // 按单元：sections 的 unit；同一单元有多个大题就合并
    let units = [];
    if (cfg.units) {
      const unitMap = new Map();
      for (const sc of sections) {
        const secDef = (bank.sections || []).find((x) => secKey(x) === sc.key) || {};
        const u = secDef.unit !== undefined && secDef.unit !== null ? secDef.unit : sc.key;
        let g = unitMap.get(u);
        if (!g) { g = { unit: u, keys: [], titles: [], items: 0, n: 0, correct: 0 }; unitMap.set(u, g); }
        g.keys.push(sc.key); g.titles.push(sc.title); g.items += sc.items; g.n += sc.n; g.correct += sc.correct;
      }
      units = [...unitMap.values()].map((g) => ({ ...g, rate: g.n ? g.correct / g.n : null }));
    }

    // 按难度：把同级别所有 学生×题 的第一次作答合起来算
    const levels = (cfg.levels || []).map((lv) => {
      let n = 0, correct = 0, items = 0;
      for (const it of graded) {
        if (it.level !== lv.key) continue;
        items++; n += perItem[it.id].n; correct += perItem[it.id].correct;
      }
      return { ...lv, items, n, correct, rate: n ? correct / n : null };
    });

    // 再试一次的效果：第一次答错的（学生，题）里，有重试的几笔、重试后改对几笔
    let wrongPairs = 0, retriedPairs = 0, improvedPairs = 0;
    const improvedStudents = new Set();
    for (const s of students.values()) {
      for (const id of s.wrong) {
        wrongPairs++;
        const rr = s.retryByItem[id];
        if (rr) {
          retriedPairs++;
          if (rr.is_correct === true) { improvedPairs++; improvedStudents.add(s.name); }
        }
      }
    }

    const inRosterMark = inRosterFlag;
    const list = [...students.values()].map((s) => {
      s.retriedItems = s.wrong.filter((id) => s.retryByItem[id]).length;
      s.finalCorrect = s.correct + s.wrong.filter((id) => s.retryByItem[id] && s.retryByItem[id].is_correct === true).length;
      let topTag = null, topCount = 0;
      for (const [t, c] of Object.entries(s.tags)) if (!NC.has(t) && c > topCount) { topTag = t; topCount = c; }
      s.topTag = topTag; s.topTagCount = topCount;
      s.inRoster = inRosterMark.has(s.name);
      // 「需要帮助」旗标：批改题错了 40% 以上，或同一类错误 3 题以上
      s.flagged = s.gradedAnswered > 0 && (s.wrong.length >= Math.ceil(s.gradedAnswered * 0.4) || topCount >= 3);
      return s;
    });

    const hardest = graded
      .filter((it) => perItem[it.id].n > 0)
      .map((it) => ({ item: it, ...perItem[it.id] }))
      .sort((a, b) => a.rate - b.rate || b.n - a.n)
      .slice(0, 5);

    const topTags = Object.entries(tagTotals)
      .map(([tag, count]) => ({
        tag, count,
        items: Object.entries(tagItems[tag]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([id, c]) => ({ id, count: c })),
      }))
      .sort((a, b) => b.count - a.count || (a.tag < b.tag ? -1 : 1))
      .slice(0, 5);

    // 题目分析：批改题按答对率由低到高（没人作答的排最后）；每题的错答分布、错误 tag 分布
    const itemRank = graded.map((it, idx) => {
      const p = perItem[it.id];
      const tags = Object.entries(p.tags).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || (a.tag < b.tag ? -1 : 1));
      const wrong = Object.values(p.wrong).sort((a, b) => b.count - a.count || (a.key < b.key ? -1 : 1));
      return { item: it, idx, n: p.n, correct: p.correct, rate: p.rate, tags, wrong };
    }).sort((a, b) => {
      if ((a.rate === null) !== (b.rate === null)) return a.rate === null ? 1 : -1;
      return (a.rate ?? 0) - (b.rate ?? 0) || b.n - a.n || a.idx - b.idx;
    });

    // 每题最常被选的错误答案（让老师看出被哪个干扰项吸引）
    const topWrong = {};
    for (const it of graded) topWrong[it.id] = itemRank.find((x) => x.item.id === it.id).wrong[0] || null;

    const n = list.length;
    const participants = f.source ? { total: allSet.size, online: onlineSet.size, paper: paperSet.size } : { total: n, online: 0, paper: 0 };
    return {
      perItem, students: list, hardest, topTags, topWrong, sections, units, levels, itemRank,
      difficulty: cfg.levels ? judgeDifficulty(cfg, levels, n) : null,
      total: N, gradedTotal: G, writingTotal: writing.length,
      avgCorrect: n ? list.reduce((a, s) => a + s.correct, 0) / n : null,
      avgFinal: n ? list.reduce((a, s) => a + s.finalCorrect, 0) / n : null,
      avgAnswered: n ? list.reduce((a, s) => a + s.answered, 0) / n : null,
      retriedStudents: list.filter((s) => s.retriedItems > 0).length,
      finished: list.filter((s) => s.answered >= N).length,
      participants,
      retry: { wrongPairs, retriedPairs, improvedPairs, improvedStudents: improvedStudents.size },
    };
  }

  function sortStudents(list, mode, rosterNames) {
    const order = new Map(rosterNames.map((n, i) => [n, i]));
    const arr = list.slice();
    if (mode === "seat") arr.sort((a, b) => (order.has(a.name) ? order.get(a.name) : 1e6) - (order.has(b.name) ? order.get(b.name) : 1e6) || a.name.localeCompare(b.name, "zh"));
    else if (mode === "name") arr.sort((a, b) => a.name.localeCompare(b.name, "zh"));
    else arr.sort((a, b) => b.wrong.length - a.wrong.length || b.topTagCount - a.topTagCount || a.name.localeCompare(b.name, "zh"));
    return arr;
  }

  // 写作题：每位学生写了什么（名单顺序在前）
  function writingFor(cfg, analysis, itemId, rosterNames) {
    const out = [];
    for (const s of sortStudents(analysis.students, "seat", rosterNames)) {
      const r = s.byItem[itemId];
      if (r) out.push({ name: s.name, text: ansVal(cfg, r), inRoster: s.inRoster });
    }
    return out;
  }

  // CSV：字串开头是 = + - @ 的加单引号，避免 Excel 当公式（学生手输的名字、作文不可信）；
  // 「1/2」「5:25」这类 Excel 会自作主张当日期／时间的选项答案，也加单引号。
  function csvCell(v) {
    let s = v === null || v === undefined ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s) || /^\d+[\/:]\d+$/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function buildCsv(analysis, bank, cfg, rosterNames) {
    const f = F(cfg);
    const G = analysis.gradedTotal;
    const lvName = (k) => { const l = (cfg.levels || []).find((x) => x.key === k); return l ? l.name : ""; };
    const retryCol = !!f.retry && !f.writing;   // 每题多一栏「重试」
    const head = ["学生", f.source ? "来源" : "名单内"];
    if (f.retry) head.push(...(f.writing ? ["批改题对题数（第一次）", "批改题对题数（重试后）"] : [`第一次对题数（共${G}）`, `重试后对题数（共${G}）`])); else head.push("对题数");
    head.push(f.writing ? "批改题已答" : "已答题数");
    if (f.writing) head.push("写作题完成");
    const lead = head.length;
    for (const it of bank.items) { head.push(`${it.id} 答案`, `${it.id} 对错`); if (retryCol) head.push(`${it.id} 重试`); }
    const lines = [head];
    const blank = (c) => Array(c).fill("");
    const std = [f.writing ? "标准答案／范例" : "标准答案", ...blank(lead - 1)];
    for (const it of bank.items) { std.push(isGraded(cfg, it) ? fmtAnswer(cfg, it, it.correct) : (it.model || ""), ""); if (retryCol) std.push(""); }
    lines.push(std);
    if (cfg.levels) {
      const lvRow = ["难度", ...blank(lead - 1)];
      for (const it of bank.items) { lvRow.push(lvName(it.level), ""); if (retryCol) lvRow.push(""); }
      lines.push(lvRow);
    }
    for (const s of sortStudents(analysis.students, "seat", rosterNames)) {
      const row = [s.name, f.source ? [...s.sources].map((x) => (x === "paper" ? "纸本" : "在线")).join("+") : (s.inRoster ? "是" : "手动输入"), s.correct];
      if (f.retry) row.push(s.finalCorrect);
      row.push(f.writing ? s.gradedAnswered : s.answered);
      if (f.writing) row.push(s.writingDone);
      for (const it of bank.items) {
        const r = s.byItem[it.id], rr = s.retryByItem[it.id];
        row.push(r ? fmtAnswer(cfg, it, ansVal(cfg, r)) : "", r && isGraded(cfg, it) ? (r.is_correct ? "对" : "错") : "");
        if (retryCol) row.push(rr ? (rr.is_correct ? "对" : "错") : "");
      }
      lines.push(row);
    }
    return "﻿" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n") + "\r\n";
  }

  return { escH, rosterName, secKey, ansVal, ansKey, fieldKey, fieldLabel, fmtAnswer, fmtAnswerHtml, firstAttempts, retryAttempts, judgeDifficulty, analyze, sortStudents, writingFor, buildCsv, csvCell };
})();

if (typeof module !== "undefined" && module.exports) module.exports = TeacherCore;
if (typeof window !== "undefined") window.TeacherCore = TeacherCore;

// ============================================================
// ② 页面
// ============================================================
if (typeof document !== "undefined" && typeof supabaseClient !== "undefined" && typeof TEACHER_TOOLS !== "undefined") (function () {
  const Core = TeacherCore;
  const appEl = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const esc = Core.escH;
  const params = new URLSearchParams(location.search);
  const toolSlug = (params.get("tool") || "").trim();
  const wantCode = (params.get("code") || "").trim().toUpperCase();

  // 转址/登录回跳可能把同一个参数带两次（code=X&code=X）：整理成一份，免得网址越回越长
  (function tidyUrl() {
    try {
      const seen = new URLSearchParams();
      for (const [k, v] of params) if (!seen.has(k)) seen.append(k, v);
      const next = location.pathname + (seen.toString() ? "?" + seen.toString() : "") + location.hash;
      if (next !== location.pathname + location.search + location.hash) history.replaceState(null, "", next);
    } catch (e) {}
  })();

  function toolUrl(slug) {
    const p = new URLSearchParams();
    if (slug) p.set("tool", slug);
    const code = S.cls ? S.cls.play_code : wantCode;
    if (code) p.set("code", code);
    return "teacher.html" + (p.toString() ? "?" + p.toString() : "");
  }

  let cfg = null;
  const S = {
    user: null, classes: [], cls: null, rows: [], bank: null, notMine: false,
    source: "all", tab: "overview", sort: "help", open: null, openItem: null, itemSec: "all", itemLvl: "all", wItem: null,
    paperStudent: null, paperDraft: {}, paperErrors: {}, ignored: new Set(), busy: false,
  };
  let toastTimer = null;
  let loadSeq = 0;

  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3500);
  }
  function showMsg(html) { appEl.innerHTML = `<p class="la__msg">${html}</p>`; }
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const sc = document.createElement("script");
      sc.src = src; sc.onload = resolve; sc.onerror = () => reject(new Error("载入不到 " + src));
      document.head.appendChild(sc);
    });
  }
  const F = () => cfg.features || {};

  // ---------- 开场：认工具 ----------
  async function showPicker() {
    document.title = "老师后台 · 点子铺";
    document.getElementById("pageTitle").textContent = "老师后台";
    document.getElementById("pageSub").textContent = "选择要看的工具。登录一次，全部工具后台通用。本页不对外公开，请自己存书签。";
    showMsg("载入工具清单…");
    await Promise.all(TEACHER_TOOLS.map((s) => (TEACHER_CONFIGS[s] ? Promise.resolve() : loadScript(`data/teacher/${s}.js`).catch(() => {}))));
    const items = TEACHER_TOOLS.map((s) => {
      const c = TEACHER_CONFIGS[s];
      return `<li><a href="${esc(toolUrl(s))}"><b>${esc(c ? c.title : s)}</b><div class="slug">${esc(s)}</div></a></li>`;
    }).join("");
    const bad = toolSlug ? `<p class="la__card muted">找不到「${esc(toolSlug)}」这个工具的后台，请从下面选。</p>` : "";
    appEl.innerHTML = `${bad}<ul class="la__tools" id="toolList">${items || '<li class="muted">目前没有任何工具有后台。</li>'}</ul>`;
  }

  async function boot() {
    if (!toolSlug || !TEACHER_TOOLS.includes(toolSlug)) return showPicker();
    try {
      if (!TEACHER_CONFIGS[toolSlug]) await loadScript(`data/teacher/${toolSlug}.js`);
    } catch (e) { return showMsg("读取工具设定失败：" + esc(e.message)); }
    cfg = TEACHER_CONFIGS[toolSlug];
    if (!cfg) return showMsg("工具设定档没有登记 " + esc(toolSlug));
    S.tab = (cfg.tabs || ["overview"])[0];
    document.title = `${cfg.title}后台 · 点子铺`;
    document.getElementById("pageTitle").textContent = `${cfg.title} · 老师后台`;
    document.getElementById("pageSub").innerHTML = `只有该班老师登录后才看得到学生答案。本页不对外公开，请自己存书签。 <a class="la__back" href="${esc(toolUrl(""))}">← 其他工具的后台</a>`;
    supabaseClient.auth.onAuthStateChange((ev, session) => {
      if (ev === "INITIAL_SESSION" || ev === "SIGNED_IN" || ev === "SIGNED_OUT") setTimeout(() => handleSession(session), 0);
    });
  }

  // ---------- 登录 ----------
  async function login() {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
    if (error) showMsg("登录失败：" + esc(error.message));
  }
  function showLoggedOut() {
    S.user = null; S.classes = []; S.cls = null; S.rows = []; S.bank = null; S.paperDraft = {};
    appEl.innerHTML = '<p class="la__msg" id="needLogin">请先登录老师账号</p><p class="la__msg"><button id="login" class="primary">用 Google 登录</button></p>';
    document.getElementById("login").addEventListener("click", login);
  }

  async function handleSession(session) {
    if (!session) return showLoggedOut();
    if (S.user && S.user.id === session.user.id) return;   // 切回分页时 SIGNED_IN 会再触发，不重载
    S.user = session.user;
    showMsg("载入班级…");
    const { data, error } = await supabaseClient
      .from("class_teachers")
      .select("classes(id, class_name, play_code, schools(full_name), students(name, name_zh, name_en, seat_no))")
      .eq("teacher_id", session.user.id);
    if (error) return showMsg("读取班级失败：" + esc(error.message));
    S.classes = (data || []).map((r) => r.classes).filter(Boolean);
    if (!S.classes.length) {
      return showMsg('这个账号（' + esc(session.user.email || "") + '）还没有管理任何班级，所以看不到任何作答。<br>请先到 <a href="kelasku.html">我的班级</a> 加入或建立班级。');
    }
    const hit = S.classes.find((c) => c.play_code === wantCode);
    S.notMine = !!wantCode && !hit;
    await selectClass((hit || S.classes[0]).id);
  }

  // ---------- 数据 ----------
  function loadBank() {
    const g = () => window[cfg.bankGlobal];
    if (g()) return Promise.resolve(g());
    return new Promise((resolve, reject) => {
      const sc = document.createElement("script");
      sc.src = cfg.bankUrl;
      sc.onload = () => (g() ? resolve(g()) : reject(new Error(`bank.js 载入了但没有 ${cfg.bankGlobal}`)));
      sc.onerror = () => reject(new Error("载入不到题库 bank.js"));
      document.head.appendChild(sc);
    });
  }

  async function fetchRows(code) {
    const cols = "id, student_name, in_roster," + (F().source ? " source," : "") + " attempt_no, item_id, answer, is_correct, error_tag, created_at";
    const all = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabaseClient.from(cfg.table)
        .select(cols)
        .eq("play_code", code)
        .order("created_at", { ascending: true }).order("id", { ascending: true })
        .range(from, from + 999);
      if (error) throw error;
      all.push(...data);
      if (data.length < 1000) break;
    }
    return all;
  }

  const ignoreKey = () => (cfg.ignoreKey || cfg.csvPrefix + "-ignore") + ":" + S.cls.play_code;
  function loadIgnored() {
    try { S.ignored = new Set(JSON.parse(localStorage.getItem(ignoreKey()) || "[]")); } catch (e) { S.ignored = new Set(); }
  }
  function saveIgnored() { try { localStorage.setItem(ignoreKey(), JSON.stringify([...S.ignored])); } catch (e) {} }

  async function selectClass(id) {
    S.cls = S.classes.find((c) => c.id === id);
    S.open = null; S.openItem = null; S.itemLvl = "all"; S.paperStudent = null; S.paperDraft = {}; S.paperErrors = {};
    try {
      const p = new URLSearchParams(location.search); p.set("code", S.cls.play_code);
      history.replaceState(null, "", location.pathname + "?" + p.toString() + location.hash);
    } catch (e) {}
    loadIgnored();
    await reload();
  }

  async function reload() {
    const seq = ++loadSeq;
    showMsg("载入作答记录…");
    try {
      const [bank, rows] = await Promise.all([loadBank(), fetchRows(S.cls.play_code)]);
      if (seq !== loadSeq) return;
      S.bank = bank; S.rows = rows;
      if (!S.wItem || !bank.items.some((i) => i.id === S.wItem)) { const w = bank.items.find((i) => !isGraded(i)); S.wItem = w ? w.id : null; }
    } catch (e) {
      if (seq !== loadSeq) return;
      appEl.innerHTML = `<p class="la__msg">读取失败：${esc(e.message || e)}</p><p class="la__msg"><button id="retry" class="primary">重试</button></p>`;
      document.getElementById("retry").addEventListener("click", reload);
      return;
    }
    render();
  }

  const rosterNames = () => S.cls.students.slice().sort((a, b) => (a.seat_no ?? 1e6) - (b.seat_no ?? 1e6)).map(Core.rosterName).filter(Boolean);
  const analysis = () => Core.analyze(S.rows, S.bank, cfg, { source: S.source, ignored: S.ignored });
  const tagText = (t) => (!t || t === "__none" ? "未分类的错误" : (S.bank.tags && S.bank.tags[t]) || t);
  const pct = (r) => (r === null ? "–" : Math.round(r * 100) + "%");
  const barCls = (r) => (r === null ? "" : r < 0.5 ? "low" : r < 0.75 ? "mid" : "");
  const isGraded = (it) => (F().writing ? !!it.graded : true);
  // 选项显示：交给题库的 fmtOption（分数上下叠）；题库没提供就退回纯文字
  const optHtml = (s) => {
    if (typeof S.bank.fmtOption === "function") { try { return S.bank.fmtOption(String(s)); } catch (e) {} }
    return esc(s);
  };
  const ansHtml = (it, a) => Core.fmtAnswerHtml(cfg, it, a, optHtml);
  const lvName = (k) => { const l = (cfg.levels || []).find((x) => x.key === k); return l ? l.name : ""; };
  const lvBadge = (k) => { const n = lvName(k); return n ? `<span class="pill lv lv-${esc(k)}" title="级别：${esc(n)}">${esc(n)}</span>` : ""; };
  const secTitle = (key) => { const sec = (S.bank.sections || []).find((s) => Core.secKey(s) === key); return sec ? sec.title : ""; };
  const secName = (key) => { const [pre, post] = cfg.sectionLabel || ["", ""]; const t = secTitle(key); return `${esc(pre)}${esc(key)}${esc(post)}${t ? " · " + esc(t) : ""}`; };
  const srcText = (set) => [...set].map((x) => (x === "paper" ? "纸本" : "在线")).join("＋");

  // ---------- 外框 ----------
  const TAB_LABEL = { overview: "总览", items: "题目分析", students: "学生", writing: "写作题", paper: "纸本回填" };
  function render() {
    const A = analysis();
    const f = F();
    const classOpts = S.classes.map((c) => `<option value="${esc(c.id)}"${c.id === S.cls.id ? " selected" : ""}>${esc(c.class_name)}（${esc(c.play_code)}）</option>`).join("");
    const seg = (id, label) => `<button data-src="${id}" class="${S.source === id ? "on" : ""}">${label}</button>`;
    const tabs = cfg.tabs || ["overview"];
    if (!tabs.includes(S.tab)) S.tab = tabs[0];
    const tab = (id) => `<button data-tab="${id}" class="${S.tab === id ? "on" : ""}" role="tab" aria-selected="${S.tab === id}">${TAB_LABEL[id]}</button>`;
    appEl.innerHTML = `
      ${S.notMine ? `<p class="la__card muted">网址里的班级代码不是你管理的班，已改显示你的班。</p>` : ""}
      <div class="la__bar">
        <label>班级 <select id="clsSel">${classOpts}</select></label>
        ${f.source ? `<span class="la__seg" role="group" aria-label="来源">${seg("all", "全部")}${seg("online", "在线")}${seg("paper", "纸本")}</span>` : ""}
        <span class="grow"></span>
        <button id="refresh">重新载入</button>
        <button id="csv">下载 CSV</button>
        <span class="muted">${esc(S.user.email || "")}</span>
        <button id="logout">退出登录</button>
      </div>
      <div class="la__tabs" role="tablist">${tabs.map(tab).join("")}</div>
      <div id="pane"></div>`;
    document.getElementById("clsSel").addEventListener("change", (e) => selectClass(e.target.value));
    appEl.querySelectorAll("[data-src]").forEach((b) => b.addEventListener("click", () => { S.source = b.dataset.src; render(); }));
    appEl.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { S.tab = b.dataset.tab; render(); }));
    document.getElementById("refresh").addEventListener("click", reload);
    document.getElementById("csv").addEventListener("click", () => downloadCsv(A));
    document.getElementById("logout").addEventListener("click", () => supabaseClient.auth.signOut());
    const pane = document.getElementById("pane");
    if (S.tab === "overview") renderOverview(pane, A);
    else if (S.tab === "items") renderItems(pane, A);
    else if (S.tab === "students") renderStudents(pane, A);
    else if (S.tab === "writing") renderWriting(pane, A);
    else renderPaper(pane);
  }

  function downloadCsv(A) {
    const csv = Core.buildCsv(A, S.bank, cfg, rosterNames());
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${cfg.csvPrefix}-${S.cls.play_code}${F().source ? "-" + S.source : ""}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // ---------- 分页：总览 ----------
  function barRow(labHtml, title, rate, correct, n, ariaLabel, extra) {
    const w = rate === null ? 0 : Math.round(rate * 100);
    return `<div class="lab" title="${esc(title)}">${labHtml}</div>
      <div class="la__track" role="img" aria-label="${esc(ariaLabel)}"><div class="la__fill ${barCls(rate)}" style="width:${w}%"></div>${extra || ""}</div>
      <div class="num">${pct(rate)} <span class="muted">${correct}/${n}</span></div>`;
  }

  function renderOverview(pane, A) {
    const f = F();
    const ov = cfg.overview || {};
    const N = A.total, G = A.gradedTotal, p = A.participants;
    const avg = (v) => (v === null ? "–" : v.toFixed(1));
    const r = A.retry;
    const retryText = r.wrongPairs
      ? `第一次答错共 <strong>${r.wrongPairs}</strong> 题次，其中 <strong>${r.retriedPairs}</strong> 题次再试了一次，<strong>${r.improvedPairs}</strong> 题次改对（<strong>${r.improvedStudents}</strong> 位学生）`
      : "还没有答错的记录";
    const srcLabel = { all: "在线＋纸本", online: "仅在线", paper: "仅纸本" }[S.source];
    const card = {
      participants: () => `<div class="la__stat"><span>参与人数</span><b id="stTotal">${p.total}</b><span>${f.source ? `在线 ${p.online} 人　纸本 ${p.paper} 人` : `${A.finished} 人做完全部 ${N} 项；平均交了 ${avg(A.avgAnswered)} 项`}</span></div>`,
      done: () => `<div class="la__stat"><span>做完全部 ${N} 题的人数</span><b id="stDone">${A.finished}</b><span>统计范围：${srcLabel}</span></div>`,
      avg: () => `<div class="la__stat"><span>${f.retry ? "第一次平均分" : "全班平均分"}</span><b id="stAvg">${avg(A.avgCorrect)}</b><span>${f.writing ? `满分 ${G}（只算批改题，写作题 ${A.writingTotal} 项不算分）` : `平均对几题（共 ${N} 题；只算已作答的题）`}</span></div>`,
      avgFinal: () => `<div class="la__stat"><span>重试后平均分</span><b id="stAvgFinal">${avg(A.avgFinal)}</b><span>${A.retriedStudents} 位学生再试过；第一次对的＋再试改对的${f.writing ? `（第一次平均 ${avg(A.avgCorrect)}，满分 ${G}）` : ""}</span></div>`,
      retry: () => `<div class="la__stat"><span>再试一次后改对</span><b id="stRetry">${r.improvedPairs}</b><span id="stRetryTxt">${retryText}</span></div>`,
      scope: () => `<div class="la__stat"><span>统计范围</span><b style="font-size:1.1rem">${srcLabel}</b><span>只用第一次作答（attempt 1），同人同题取最早一笔</span></div>`,
    };
    const hardIds = new Set(A.hardest.map((h) => h.item.id));

    const blocks = {
      hardTags: () => {
        const hard = A.hardest.length
          ? `<ol class="rank">${A.hardest.map((h) => `<li><b>${esc(h.item.id)}</b> ${lvBadge(h.item.level)} ${esc(h.item.label)} <span class="pill warn">答对 ${pct(h.rate)}（${h.correct}/${h.n}）</span></li>`).join("")}</ol>`
          : '<p class="muted">还没有数据。</p>';
        const tags = A.topTags.length
          ? `<ol class="rank">${A.topTags.map((t) => `<li>${esc(tagText(t.tag))} <span class="pill">${t.count} 次</span><div class="muted">${t.items.slice(0, 4).map((i) => esc(i.id) + "×" + i.count).join("　")}</div></li>`).join("")}</ol>`
          : '<p class="muted">还没有错误记录。</p>';
        return `<div class="la__two">
          <section class="la__card hard"><h2>最难的 5 题</h2>${hard}</section>
          <section class="la__card"><h2>最常见的错误类型 Top 5</h2>${tags}</section></div>`;
      },
      itemBars: () => {
        let bars = "", lastSec = null;
        for (const it of S.bank.items) {
          if (!isGraded(it)) continue;
          if (it.section !== lastSec) {
            bars += `<div class="la__sechead" style="grid-column:1/-1">${secName(it.section)}</div>`;
            lastSec = it.section;
          }
          const pi = A.perItem[it.id];
          const w = pi.rate === null ? 0 : Math.round(pi.rate * 100);
          const tw = ov.lure ? A.topWrong[it.id] : null;
          const lure = tw ? `<div class="muted lure">最多人选错：「${esc(tw.key)}」×${tw.count}${A.itemRank.find((x) => x.item.id === it.id).wrong.length > 1 ? `（另有 ${A.itemRank.find((x) => x.item.id === it.id).wrong.length - 1} 种）` : ""}</div>` : "";
          bars += `<div class="lab" title="${esc(it.label)}"><div class="t">${esc(it.id)} ${esc(it.label)}${hardIds.has(it.id) ? '<span class="pill warn">最难</span>' : ""}</div>${lure}</div>
            <div class="la__track" role="img" aria-label="答对率 ${pct(pi.rate)}"><div class="la__fill ${barCls(pi.rate)}" style="width:${w}%"></div></div>
            <div class="num">${pct(pi.rate)} <span class="muted">${pi.correct}/${pi.n}</span></div>`;
        }
        return `<section class="la__card"><h2>每题第一次答对率（${G} 个批改题）</h2><div class="la__bars" id="bars">${bars}</div></section>`;
      },
      sections: () => {
        const secBars = A.sections.map((sc) => barRow(`<b>${esc(sc.key)}</b> ${esc(sc.title)} <span class="muted">（${sc.items} 题）</span>`, sc.title, sc.rate, sc.correct, sc.n, `${sc.key} 大题答对率 ${pct(sc.rate)}`)).join("");
        return `<section class="la__card"><h2>各大题第一次答对率</h2><div class="la__bars" id="secBars">${secBars || '<p class="muted">题库没有大题分组。</p>'}</div></section>`;
      },
      levels: () => {
        const lvBars = A.levels.map((l) => {
          const mark = `<span class="la__target" style="left:${Math.round(l.lo * 100)}%;width:${Math.round((l.hi - l.lo) * 100)}%" title="目标区间"></span>`;
          const tgt = l.hi >= 1 ? `≥ ${Math.round(l.lo * 100)}%` : `${Math.round(l.lo * 100)}–${Math.round(l.hi * 100)}%`;
          return barRow(`${lvBadge(l.key)} <span class="muted">（${l.items} 题；目标 ${tgt}）</span>`, `${l.name}题 目标 ${tgt}`, l.rate, l.correct, l.n, `${l.name}题答对率 ${pct(l.rate)}`, mark);
        }).join("");
        const D = A.difficulty;
        const vText = { easy: "偏易", fit: "刚好", hard: "偏难" };
        const range = cfg.verdict && cfg.verdict.mode === "fixed" && D.note ? `（${esc(D.note)}）` : `（按题数加权的目标区间 ${pct(D.lo)}–${pct(D.hi)}）`;
        const verdictHtml = D.verdict
          ? `<p class="la__verdict ${D.verdict}" id="verdict"><b>这份卷目前${vText[D.verdict]}</b>：整体平均答对率 ${pct(D.actual)}${range}。${D.verdict === "easy" ? "实际答对率高于目标，可以考虑加难题。" : D.verdict === "hard" ? "实际答对率低于目标，可能要补教或调整题目。" : "落在目标区间内。"}</p>`
          : `<p class="la__verdict" id="verdict"><b>暂不判断偏易／刚好／偏难</b>：${esc(D.reason)}。</p>`;
        return `<section class="la__card"><h2>按难度（第一次答对率）</h2>${verdictHtml}<div class="la__bars" id="levelBars">${lvBars}</div><p class="muted">灰色带＝目标区间。学生端看不到级别。</p></section>`;
      },
      units: () => {
        const unitBars = A.units.map((u) => barRow(`<b>单元 ${esc(u.unit)}</b> ${esc(u.titles.join("、"))} <span class="muted">（${esc(u.keys.join("、"))}，${u.items} 题）</span>`, `单元 ${u.unit} ${u.titles.join("、")}`, u.rate, u.correct, u.n, `单元 ${u.unit} 答对率 ${pct(u.rate)}`)).join("");
        return `<section class="la__card"><h2>按单元（大题，第一次答对率）</h2><div class="la__bars" id="unitBars">${unitBars || '<p class="muted">题库没有单元分组。</p>'}</div></section>`;
      },
    };
    const note = `答对率、最难题、错误类别只用第一次作答（attempt 1），同人同题取最早一笔${f.retry ? "；「重试后」成绩＝第一次对的＋再试改对的，只用于平均分和学生表。" : "。"}`;
    pane.innerHTML = `
      <div class="la__stats">${(ov.cards || ["participants", "avg"]).map((k) => card[k]()).join("")}</div>
      <p class="muted">${note}</p>
      ${(ov.blocks || ["hardTags", "itemBars"]).map((k) => blocks[k]()).join("")}`;
  }

  // ---------- 分页：题目分析 ----------
  function renderItems(pane, A) {
    const secKeys = (S.bank.sections || []).map((s) => Core.secKey(s));
    const chip = (id, label) => `<button data-isec="${esc(id)}" class="${String(S.itemSec) === String(id) ? "on" : ""}">${label}</button>`;
    const lchip = (id, label) => `<button data-ilvl="${esc(id)}" class="${S.itemLvl === id ? "on" : ""}">${label}</button>`;
    const list = A.itemRank.filter((x) => (S.itemSec === "all" || String(x.item.section) === String(S.itemSec)) && (S.itemLvl === "all" || x.item.level === S.itemLvl));
    const rows = list.map((x) => {
      const it = x.item;
      const open = S.openItem === it.id;
      const w = x.rate === null ? 0 : Math.round(x.rate * 100);
      let detail = "";
      if (open) {
        const tagLines = x.tags.length
          ? x.tags.map((t) => `<li>${esc(tagText(t.tag))} <span class="pill">${t.count}</span></li>`).join("")
          : '<li class="muted">没有错误记录</li>';
        const wrongLines = x.wrong.length
          ? x.wrong.map((wa) => `<li><span class="ans">${ansHtml(it, wa.answer)}</span> <span class="pill warn">${wa.count} 人</span><div class="muted who">${wa.names.map(esc).join("、")}</div></li>`).join("")
          : '<li class="muted">没有错答</li>';
        detail = `<tr class="detail"><td colspan="4"><div class="la__two">
          <div><h3>标准答案</h3><p class="ans">${ansHtml(it, it.correct)}</p><h3>错误类型（只数第一次）</h3><ul class="plain">${tagLines}</ul></div>
          <div><h3>错答分布与谁答错</h3><ul class="plain">${wrongLines}</ul></div></div></td></tr>`;
      }
      return `<tr class="itm" data-id="${esc(it.id)}" tabindex="0" aria-expanded="${open}">
          <td><b>${esc(it.id)}</b> ${lvBadge(it.level)} ${esc(it.label)}</td>
          <td><div class="la__track" role="img" aria-label="答对率 ${pct(x.rate)}"><div class="la__fill ${barCls(x.rate)}" style="width:${w}%"></div></div></td>
          <td class="num">${pct(x.rate)} <span class="muted">${x.correct}/${x.n}</span></td>
          <td>${x.tags.length ? esc(tagText(x.tags[0].tag)) + ` <span class="muted">×${x.tags[0].count}</span>` : '<span class="muted">–</span>'}</td></tr>${detail}`;
    }).join("");
    pane.innerHTML = `
      <div class="la__bar"><span class="muted">大题</span><span class="la__seg" role="group" aria-label="大题">${chip("all", "全部")}${secKeys.map((k) => chip(k, esc(k))).join("")}</span>
        ${cfg.levels ? `<span class="muted">级别</span><span class="la__seg" role="group" aria-label="级别">${lchip("all", "全部")}${cfg.levels.map((l) => lchip(l.key, esc(l.name))).join("")}</span>` : ""}
        <span class="muted">按第一次答对率由低到高；点一题看错答分布和谁答错</span></div>
      <section class="la__card la__scroll"><table id="itemTable"><thead><tr><th>题目</th><th class="w">答对率</th><th>答对 / 作答</th><th>最常见错误类型</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4" class="muted">没有题目。</td></tr>'}</tbody></table></section>`;
    pane.querySelectorAll("[data-ilvl]").forEach((b) => b.addEventListener("click", () => { S.itemLvl = b.dataset.ilvl; render(); }));
    pane.querySelectorAll("[data-isec]").forEach((b) => b.addEventListener("click", () => { S.itemSec = b.dataset.isec; render(); }));
    pane.querySelectorAll("tr.itm").forEach((tr) => {
      const go = () => { S.openItem = S.openItem === tr.dataset.id ? null : tr.dataset.id; render(); };
      tr.addEventListener("click", go);
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  // ---------- 分页：学生 ----------
  function renderStudents(pane, A) {
    const f = F();
    const names = rosterNames();
    const sorted = Core.sortStudents(A.students, S.sort, names);
    const have = new Set(A.students.map((s) => s.name));
    const missing = names.filter((n) => !have.has(n));
    const sortBtn = (id, l) => `<button data-sort="${id}" class="${S.sort === id ? "on" : ""}">${l}</button>`;
    const G = A.gradedTotal, W = A.writingTotal;
    const ncols = 4 + (f.source ? 1 : 0) + (f.retry ? 1 : 0) + (f.writing ? 1 : 0);
    const rows = sorted.map((s, i) => {
      const open = S.open === s.name;
      return `<tr class="stu" data-i="${i}" tabindex="0" aria-expanded="${open}">
        <td>${esc(s.name)}${!s.inRoster ? '<span class="pill info">手动输入</span>' : ""}${s.flagged ? '<span class="pill warn">需要帮助</span>' : ""}</td>
        ${f.source ? `<td>${srcText(s.sources)}</td>` : ""}
        <td>${s.correct} / ${f.retry ? G : s.gradedAnswered}${f.retry ? (s.gradedAnswered < G ? `<span class="muted">（已答 ${s.gradedAnswered}）</span>` : "") : (s.gradedAnswered < G ? `<span class="muted">（共 ${G}）</span>` : "")}</td>
        ${f.retry ? `<td>${s.retriedItems ? `<strong>${s.finalCorrect}</strong> / ${G}${s.finalCorrect > s.correct ? `<span class="pill info">+${s.finalCorrect - s.correct}</span>` : ""}` : '<span class="muted">没再试</span>'}</td>` : ""}
        <td>${s.wrong.length ? esc(s.wrong.join("、")) : '<span class="muted">全对</span>'}</td>
        <td>${s.topTag ? esc(tagText(s.topTag)) + ` <span class="muted">×${s.topTagCount}</span>` : '<span class="muted">–</span>'}</td>
        ${f.writing ? `<td>${s.writingDone} / ${W}</td>` : ""}</tr>
        ${open ? `<tr class="detail"><td colspan="${ncols}">${studentDetail(s, names)}</td></tr>` : ""}`;
    }).join("");
    const ignoredList = [...S.ignored];
    const th = ["<th>学生</th>", f.source ? "<th>来源</th>" : "", f.retry ? `<th>第一次 / ${G}</th><th>重试后 / ${G}</th>` : "<th>对 / 已答</th>", "<th>答错的题</th><th>主要错误类型</th>", f.writing ? "<th>写作题完成</th>" : ""].join("");
    pane.innerHTML = `
      <div class="la__bar"><span class="muted">排序</span><span class="la__seg">${sortBtn("help", "需要帮助")}${sortBtn("seat", "名单顺序")}${sortBtn("name", "姓名")}</span>
        <span class="muted">「需要帮助」＝错 40% 以上、或同一类错误出现 3 次以上的排前面</span></div>
      <section class="la__card la__scroll"><table id="stuTable"><thead><tr>${th}</tr></thead>
      <tbody>${rows || `<tr><td colspan="${ncols}" class="muted">这个范围内还没有学生的作答。</td></tr>`}</tbody></table></section>
      ${missing.length ? `<p class="muted">名单里还没有数据的人（${missing.length}）：${missing.map(esc).join("、")}</p>` : ""}
      ${ignoredList.length ? `<p class="muted">已忽略（不计入统计）：${ignoredList.map((n) => `${esc(n)} <button data-unignore="${esc(n)}">恢复</button>`).join("　")}</p>` : ""}`;
    pane.querySelectorAll("[data-sort]").forEach((b) => b.addEventListener("click", () => { S.sort = b.dataset.sort; render(); }));
    pane.querySelectorAll("tr.stu").forEach((tr) => {
      const go = () => { const s = sorted[+tr.dataset.i]; S.open = S.open === s.name ? null : s.name; render(); };
      tr.addEventListener("click", go);
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    pane.querySelectorAll("[data-unignore]").forEach((b) => b.addEventListener("click", () => { S.ignored.delete(b.dataset.unignore); saveIgnored(); render(); }));
    const mg = pane.querySelector("[data-merge]");
    if (mg) mg.addEventListener("click", () => mergeStudent(mg.dataset.merge, pane.querySelector("#mergeTo").value, mg));
    const ig = pane.querySelector("[data-ignore]");
    if (ig) ig.addEventListener("click", (e) => {
      S.ignored.add(e.currentTarget.dataset.ignore); saveIgnored(); S.open = null; render(); toast("已忽略，不再计入统计（只存在这台电脑）");
    });
  }

  function studentDetail(s, names) {
    const f = F();
    const lines = S.bank.items.map((it) => {
      const r = s.byItem[it.id];
      const graded = isGraded(it);
      const head = `<td>${esc(it.id)}${lvBadge(it.level)}</td><td>${esc(it.label)}</td>`;
      if (!r) return `<tr>${head}<td class="muted">（没有作答）</td><td>${graded ? ansHtml(it, it.correct) : '<span class="muted">写作题</span>'}</td><td></td></tr>`;
      const mine = ansHtml(it, Core.ansVal(cfg, r));
      if (!graded) return `<tr>${head}<td>${mine}</td><td class="muted">${it.model ? "范例：" + esc(it.model) : "写作题"}</td><td class="muted">不批改</td></tr>`;
      const rr = s.retryByItem[it.id];
      const retry = rr ? `；再试：${ansHtml(it, Core.ansVal(cfg, rr))}（${rr.is_correct ? "对" : "错"}）` : "";
      return `<tr>${head}<td class="${r.is_correct ? "good" : "bad"}">${mine}</td><td>${ansHtml(it, it.correct)}</td><td>${r.is_correct ? "对" : "错" + (r.error_tag ? "：" + esc(tagText(r.error_tag)) : "") + retry}</td></tr>`;
    }).join("");
    let manual = "";
    if (!s.inRoster && f.merge) {
      manual = `<div class="la__bar"><span>这是手动输入的名字。合并到名单里的：</span>
        <select id="mergeTo">${names.map((n) => `<option>${esc(n)}</option>`).join("")}</select>
        <button class="primary" data-merge="${esc(s.name)}">合并</button>
        ${f.ignore ? `<button class="danger" data-ignore="${esc(s.name)}">忽略这个名字</button>` : ""}</div>`;
    }
    const redo = !f.retry ? S.rows.filter((r) => r.student_name === s.name && r.attempt_no > 1).length : 0;
    return `${manual}<table><thead><tr><th>题号</th><th>题目</th><th>他的答案</th><th>标准答案</th><th>结果</th></tr></thead><tbody>${lines}</tbody></table>
      ${redo ? `<p class="muted">另有 ${redo} 笔在线重做记录（attempt 2 以上，不计入分析）。</p>` : ""}`;
  }

  async function mergeStudent(oldName, target, btn) {
    if (!target) return;
    if (!confirm(`把「${oldName}」的所有作答合并到「${target}」？\n（只改名字，不删资料；如果「${target}」本来就有作答，两边会并在一起，统计取最早的一笔。）`)) return;
    btn.disabled = true; btn.textContent = "合并中…";
    const { data, error } = await supabaseClient.from(cfg.table)
      .update({ student_name: target, in_roster: true })
      .eq("play_code", S.cls.play_code).eq("student_name", oldName).eq("in_roster", false)
      .select("id");
    if (error) { btn.disabled = false; btn.textContent = "合并"; return toast("合并失败：" + error.message); }
    if (!data || !data.length) { btn.disabled = false; btn.textContent = "合并"; return toast("没有改到任何一行（可能没有权限，或已被合并）"); }
    toast(`已合并 ${data.length} 笔到「${target}」`);
    S.open = target;
    await reload();
  }

  // ---------- 分页：写作题（华文复习本） ----------
  function renderWriting(pane, A) {
    const wItems = S.bank.items.filter((i) => !isGraded(i));
    if (!wItems.length) { pane.innerHTML = '<p class="la__msg">题库里没有写作题。</p>'; return; }
    const it = wItems.find((i) => i.id === S.wItem) || wItems[0];
    const list = Core.writingFor(cfg, A, it.id, rosterNames());
    const have = new Set(list.map((x) => x.name));
    const missing = rosterNames().filter((n) => !have.has(n));
    const chips = wItems.map((w) => {
      const c = A.students.filter((s) => s.byItem[w.id]).length;
      return `<button data-w="${esc(w.id)}" class="${w.id === it.id ? "on" : ""}">${esc(w.id)} <span class="muted">${c} 人</span></button>`;
    }).join("");
    pane.innerHTML = `
      <div class="la__bar"><span class="muted">选题</span><span class="la__seg" role="group" aria-label="写作题">${chips}</span></div>
      <section class="la__card">
        <h2>${esc(it.id)} · ${esc(it.label)}</h2>
        <p class="muted">${secName(it.section)}。写作题不批改，学生只看到参考范例。</p>
        ${it.model ? `<p class="la__model"><b>参考范例：</b>${esc(it.model)}</p>` : ""}
        <div class="la__writes" id="writes">${list.length ? list.map((x) => `<div class="la__write"><div class="who">${esc(x.name)}${!x.inRoster ? '<span class="pill info">手动输入</span>' : ""}</div><div class="what">${esc(Core.fmtAnswer(cfg, it, x.text))}</div></div>`).join("") : '<p class="muted">还没有人写这一题。</p>'}</div>
        ${missing.length && list.length ? `<p class="muted">还没写这题的人（${missing.length}）：${missing.map(esc).join("、")}</p>` : ""}
      </section>`;
    pane.querySelectorAll("[data-w]").forEach((b) => b.addEventListener("click", () => { S.wItem = b.dataset.w; render(); }));
  }

  // ---------- 分页：纸本回填 ----------
  function paperRowsOf(name) {
    const m = {};
    for (const r of S.rows) if (r.source === "paper" && r.attempt_no === 1 && r.student_name === name) m[r.item_id] = r.answer;
    return m;
  }

  const isFracOptions = (opts) => opts.some((o) => /^\d+\/\d+$/.test(String(o)));

  function cellRange(e) {
    if (cfg.paper && typeof cfg.paper.cellRange === "function") return cfg.paper.cellRange(e);
    return [e.min ?? 0, e.max ?? 10];
  }

  function controlHtml(item, val, fid) {
    const e = item.entry || {};
    const sel = (opts, v, id, label) => `<select id="${id}" data-fid="${id}" aria-label="${esc(label)}"><option value=""></option>${opts.map((o) => `<option value="${esc(o)}"${String(v) === String(o) ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    if (e.kind === "choice") {
      const opts = e.options || [];
      // 选项里有分数（3/10）：用单选钮，标签交给 fmtOption 画成上下叠的分数；其余用下拉
      if (isFracOptions(opts)) {
        return `<div class="radios" id="${fid}" data-radio="1" role="radiogroup" aria-label="${esc(item.label)}">${opts.map((o) => `<label class="rad"><input type="radio" name="${fid}" data-fid="${fid}" value="${esc(o)}"${String(val) === String(o) ? " checked" : ""}> ${optHtml(o)}</label>`).join("")}</div>`;
      }
      return sel(opts, val, fid, item.label);
    }
    if (e.kind === "cells") {
      const [lo, hi] = cellRange(e);
      const opts = []; for (let i = lo; i <= hi; i++) opts.push(i);
      return sel(opts, val, fid, item.label) + ' <span class="muted">格</span>';
    }
    if (e.kind === "multi") {
      return `<div class="fields">${(e.fields || []).map((f, i) => {
        const k = Core.fieldKey(f, i); const v = val && typeof val === "object" ? val[k] : "";
        const unit = typeof f === "object" && f.unit && f.unit !== Core.fieldLabel(f, i) ? ` <span class="u">${esc(f.unit)}</span>` : "";
        return `<label>${esc(Core.fieldLabel(f, i))}${unit}<input type="text" inputmode="decimal" id="${fid}.${esc(k)}" data-fid="${fid}.${esc(k)}" value="${esc(v ?? "")}" autocomplete="off"></label>`;
      }).join("")}</div>`;
    }
    return `<input type="text" inputmode="decimal" id="${fid}" data-fid="${fid}" value="${esc(val ?? "")}" autocomplete="off" aria-label="${esc(item.label)}">${e.unit ? ` <span class="muted">${esc(e.unit)}</span>` : ""}`;
  }

  // 读表单：返回 { answers: {id: value}, errors: {id: msg} }；全空的项目不写入
  function readPaperForm() {
    const answers = {}, errors = {};
    const num = (str) => { const t = String(str).trim(); if (t === "") return undefined; const n = Number(t.replace(",", ".")); return Number.isFinite(n) ? n : NaN; };
    for (const it of S.bank.items) {
      const e = it.entry || {};
      const g = (fid) => document.getElementById(fid);
      if (e.kind === "multi") {
        const out = {}; let filled = 0, bad = false;
        (e.fields || []).forEach((f, i) => {
          const k = Core.fieldKey(f, i); const el = g(`q.${it.id}.${k}`);
          const n = el ? num(el.value) : undefined;
          if (n === undefined) return;
          if (Number.isNaN(n)) bad = true; else { out[k] = n; filled++; }
        });
        const total = (e.fields || []).length;
        if (bad) errors[it.id] = "要填数字";
        else if (filled && filled < total) errors[it.id] = "几个格子要一起填完，或全部留空";
        else if (filled) answers[it.id] = out;
      } else {
        const el = g("q." + it.id);
        if (!el) continue;
        if (el.dataset.radio) {   // 分数选项的单选钮
          const c = el.querySelector("input:checked");
          if (c) answers[it.id] = c.value;
          continue;
        }
        if (el.value.trim() === "") continue;
        if (e.kind === "number") {
          const n = num(el.value);
          if (Number.isNaN(n)) errors[it.id] = "要填数字"; else answers[it.id] = n;
        } else if (e.kind === "cells") answers[it.id] = Number(el.value);
        else answers[it.id] = el.value;
      }
    }
    return { answers, errors };
  }

  function renderPaper(pane) {
    const names = rosterNames();
    if (!names.length) { pane.innerHTML = '<p class="la__msg">这个班的名单是空的，请先到「我的班级」加入学生。</p>'; return; }
    if (!S.paperStudent || !names.includes(S.paperStudent)) S.paperStudent = names[0];
    const doneSet = new Set(S.rows.filter((r) => r.source === "paper" && r.attempt_no === 1).map((r) => r.student_name));
    const saved = paperRowsOf(S.paperStudent);
    const vals = Object.keys(S.paperDraft).length && S.paperDraft.__for === S.paperStudent ? S.paperDraft : saved;
    let lastSec = null, qs = "";
    for (const it of S.bank.items) {
      if (it.section !== lastSec) {
        qs += `<div class="la__sechead">${secName(it.section)}</div>`;
        lastSec = it.section;
      }
      const err = S.paperErrors[it.id];
      qs += `<div class="la__qrow${err ? " err" : ""}"><div class="q"><b>${esc(it.id)}</b> ${esc(it.label)}</div><div>${controlHtml(it, vals[it.id], "q." + it.id)}</div>${err ? `<div class="errmsg">${esc(err)}</div>` : ""}</div>`;
    }
    pane.innerHTML = `
      <div class="la__paper">
        <div class="la__roster" id="roster">${names.map((n, i) => `<button data-i="${i}" class="${n === S.paperStudent ? "on" : ""}${doneSet.has(n) ? " done" : ""}">${esc(n)}</button>`).join("")}</div>
        <section class="la__card"><h2>回填：${esc(S.paperStudent)}</h2>
          <p class="muted">照学生纸上的答案填；没做的题留空（不会写入）。再次保存会覆盖这位学生之前的纸本答案。保存后自动跳到名单的下一位。</p>
          <form id="paperForm" autocomplete="off">${qs}
          <div class="la__bar"><button type="submit" class="primary" id="paperSave">保存并跳到下一位</button><button type="button" id="paperClear">清空这一页</button><span class="muted" id="paperMsg"></span></div></form>
        </section></div>`;
    pane.querySelectorAll("#roster button").forEach((b) => b.addEventListener("click", () => {
      S.paperStudent = names[+b.dataset.i]; S.paperDraft = {}; S.paperErrors = {}; render(); focusFirst();
    }));
    document.getElementById("paperForm").addEventListener("submit", (e) => { e.preventDefault(); savePaper(names); });
    document.getElementById("paperClear").addEventListener("click", () => {
      document.querySelectorAll("#paperForm [data-fid]").forEach((el) => { if (el.type === "radio") el.checked = false; else el.value = ""; });
    });
  }
  function focusFirst() { const el = document.querySelector("#paperForm [data-fid]"); if (el) el.focus(); }

  async function savePaper(names) {
    if (S.busy) return;
    const { answers, errors } = readPaperForm();
    const ids = Object.keys(answers);
    S.paperDraft = { __for: S.paperStudent, ...answers };   // 失败时表单内容不丢
    S.paperErrors = errors;
    document.querySelectorAll("#paperForm .la__qrow.err").forEach((r) => { r.classList.remove("err"); const m = r.querySelector(".errmsg"); if (m) m.remove(); });
    if (Object.keys(errors).length) {
      // 不重画表单，免得把填了一半的内容洗掉；只在原地标红
      for (const [id, msg] of Object.entries(errors)) {
        const row = document.getElementById("q." + id) ? document.getElementById("q." + id).closest(".la__qrow") : document.querySelector(`#paperForm [data-fid^="q.${id}."]`).closest(".la__qrow");
        row.classList.add("err"); row.insertAdjacentHTML("beforeend", `<div class="errmsg">${esc(msg)}</div>`);
      }
      toast("有 " + Object.keys(errors).length + " 题的格式不对，请看红框"); return;
    }
    S.paperErrors = {};
    const had = Object.keys(paperRowsOf(S.paperStudent)).length;
    if (!ids.length && had && !confirm("这一页全部留空，保存会清除这位学生已有的纸本答案。确定吗？")) return;
    if (!ids.length && !had) { toast("没有填任何题，没有写入"); return; }
    S.busy = true;
    const btn = document.getElementById("paperSave"); btn.disabled = true; btn.textContent = "保存中…";
    const rows = ids.map((id) => {
      const g = S.bank.grade(id, answers[id]);
      return { play_code: S.cls.play_code, student_name: S.paperStudent, in_roster: true, source: "paper", attempt_no: 1, item_id: id, answer: answers[id], is_correct: !!g.correct, error_tag: g.correct ? null : (g.tag || null) };
    });
    // 先删这位学生该班之前的 paper 行，再 insert（重复回填＝覆盖）。
    const del = await supabaseClient.from(cfg.table).delete().eq("play_code", S.cls.play_code).eq("student_name", S.paperStudent).eq("source", "paper");
    if (del.error) return failPaper("清除旧纸本答案失败：" + del.error.message);
    if (rows.length) {
      const ins = await supabaseClient.from(cfg.table).insert(rows);   // 不带 .select()（只开放 INSERT 的表，见 agents.md 决定 17）
      if (ins.error) return failPaper("写入失败（旧的纸本答案已清除，表单内容还在，按保存重试）：" + ins.error.message);
    }
    S.busy = false;
    const cur = S.paperStudent;
    const next = names[names.indexOf(cur) + 1];
    S.paperDraft = {}; S.paperErrors = {};
    if (next) S.paperStudent = next;
    try { S.rows = await fetchRows(S.cls.play_code); } catch (e) { toast("已保存，但重新读取失败：" + e.message); }
    render(); focusFirst();
    toast(`已保存「${cur}」${rows.length} 题` + (next ? `，下一位：${next}` : "，已是名单最后一位"));
  }
  function failPaper(msg) {
    S.busy = false;
    const btn = document.getElementById("paperSave"); if (btn) { btn.disabled = false; btn.textContent = "保存并跳到下一位"; }
    document.getElementById("paperMsg").textContent = msg;
    toast(msg);
  }

  boot();
})();
