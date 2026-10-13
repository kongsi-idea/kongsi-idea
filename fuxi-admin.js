// 一年级10月华文复习本 · 老师后台（只读 tahun1_bc_fuxi_okt_answers，权限全由数据库 RLS 把关；前端只负责显示）
// 题库来自学生工具的 bank.js（window.FuxiBank，合约见 teaching-tools/tahun1-bc-fuxi-oktober/PLAN.md）。
// 文件分两段：① 纯计算（Core，可在 node 里直接测）② 页面（只在有 document 时执行）。

const BANK_URL = "https://tahun1-bc-fuxi-oktober.vercel.app/bank.js";
const TABLE = "tahun1_bc_fuxi_okt_answers";

// ============================================================
// ① 纯计算
// ============================================================
const Core = (() => {
  const keyOf = (name, itemId) => name + "\u0000" + itemId;
  const ts = (r) => Date.parse(r.created_at) || 0;
  const ansOf = (r) => (r && r.answer && typeof r.answer === "object" ? r.answer.v : undefined);

  function rosterName(s) { return s.name_zh || s.name_en || s.name || ""; }

  // 一个答案变成可比较／显示的 key：多选＝排序后用「＋」连起来
  function ansKey(v) {
    if (Array.isArray(v)) return v.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join("＋");
    return v === undefined || v === null ? "" : String(v);
  }
  function fmtAnswer(v) {
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) return "（空）";
    return Array.isArray(v) ? v.join("、") : String(v);
  }

  // 每个（学生，题）只取「第一次作答」＝ attempt_no=1 里 created_at 最早的一笔
  function firstAttempts(rows) {
    const map = new Map();
    for (const r of rows) {
      if (r.attempt_no !== 1) continue;
      const k = keyOf(r.student_name, r.item_id);
      const old = map.get(k);
      if (!old || ts(r) < ts(old) || (ts(r) === ts(old) && String(r.id) < String(old.id))) map.set(k, r);
    }
    return map;
  }
  // 再试一次（attempt_no>=2）：每个（学生，题）取最新一笔
  function retryAttempts(rows) {
    const map = new Map();
    for (const r of rows) {
      if (r.attempt_no < 2) continue;
      const k = keyOf(r.student_name, r.item_id);
      const old = map.get(k);
      if (!old || ts(r) > ts(old) || (ts(r) === ts(old) && String(r.id) > String(old.id))) map.set(k, r);
    }
    return map;
  }

  function analyze(rows, bank, opts) {
    const itemById = new Map(bank.items.map((i) => [i.id, i]));
    const graded = bank.items.filter((i) => i.graded);
    const writing = bank.items.filter((i) => !i.graded);
    const valid = rows.filter((r) => itemById.has(r.item_id));
    const firsts = firstAttempts(valid);
    const retries = retryAttempts(valid);

    const inRosterFlag = new Set();
    for (const r of rows) if (r.in_roster) inRosterFlag.add(r.student_name);

    const perItem = {};
    for (const it of bank.items) perItem[it.id] = { n: 0, correct: 0, rate: null, wrongAns: {}, tags: {} };
    const students = new Map();
    const tagTotals = {}, tagItems = {};

    for (const r of firsts.values()) {
      const it = itemById.get(r.item_id);
      const pi = perItem[r.item_id];
      pi.n++;
      let s = students.get(r.student_name);
      if (!s) {
        s = { name: r.student_name, answered: 0, gradedAnswered: 0, correct: 0, wrong: [], tags: {}, writingDone: 0, byItem: {}, retryByItem: {} };
        students.set(r.student_name, s);
      }
      s.answered++;
      s.byItem[r.item_id] = r;
      if (!it.graded) { s.writingDone++; continue; }
      s.gradedAnswered++;
      if (r.is_correct === true) { pi.correct++; s.correct++; }
      else {
        const k = ansKey(ansOf(r));
        pi.wrongAns[k] = (pi.wrongAns[k] || 0) + 1;
        const t = r.error_tag || "__none";
        pi.tags[t] = (pi.tags[t] || 0) + 1;
        tagTotals[t] = (tagTotals[t] || 0) + 1;
        (tagItems[t] = tagItems[t] || {})[r.item_id] = (tagItems[t][r.item_id] || 0) + 1;
        s.wrong.push(r.item_id);
        s.tags[t] = (s.tags[t] || 0) + 1;
      }
    }
    for (const it of graded) { const p = perItem[it.id]; p.rate = p.n ? p.correct / p.n : null; }
    for (const [k, r] of retries) {
      const s = students.get(r.student_name);
      if (s) s.retryByItem[r.item_id] = r;
    }
    // 只有「有第一次作答的学生」才会出现在名单里；孤立的 attempt 2 不单独成人

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

    const list = [...students.values()].map((s) => {
      let topTag = null, topCount = 0;
      for (const [t, c] of Object.entries(s.tags)) if (t !== "__none" && c > topCount) { topTag = t; topCount = c; }
      s.topTag = topTag; s.topTagCount = topCount;
      s.inRoster = inRosterFlag.has(s.name);
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

    // 每题最常被选的错误答案（让老师看出被哪个干扰项吸引）
    const topWrong = {};
    for (const it of graded) {
      const e = Object.entries(perItem[it.id].wrongAns).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
      topWrong[it.id] = e.length ? { answer: e[0][0], count: e[0][1], all: e.map(([a, c]) => ({ answer: a, count: c })) } : null;
    }

    const n = list.length;
    const avgCorrect = n ? list.reduce((a, s) => a + s.correct, 0) / n : null;
    const finished = list.filter((s) => s.answered >= bank.items.length).length;
    const avgAnswered = n ? list.reduce((a, s) => a + s.answered, 0) / n : null;
    return {
      perItem, students: list, hardest, topTags, topWrong, avgCorrect,
      gradedTotal: graded.length, writingTotal: writing.length,
      participants: n, finished, avgAnswered,
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
  function writingFor(analysis, itemId, rosterNames) {
    const out = [];
    for (const s of sortStudents(analysis.students, "seat", rosterNames)) {
      const r = s.byItem[itemId];
      if (r) out.push({ name: s.name, text: ansOf(r), inRoster: s.inRoster });
    }
    return out;
  }

  // CSV（学生 × 题）。字串开头是 = + - @ 的加单引号，避免 Excel 当公式（学生手输的名字、作文不可信）。
  function csvCell(v) {
    let s = v === null || v === undefined ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function buildCsv(analysis, bank, rosterNames) {
    const head = ["学生", "名单内", "批改题对题数", "批改题已答", "写作题完成"];
    for (const it of bank.items) head.push(`${it.id} 答案`, `${it.id} 对错`);
    const lines = [head];
    const std = ["标准答案／范例", "", "", "", ""];
    for (const it of bank.items) std.push(it.graded ? fmtAnswer(it.correct) : (it.model || ""), "");
    lines.push(std);
    for (const s of sortStudents(analysis.students, "seat", rosterNames)) {
      const row = [s.name, s.inRoster ? "是" : "手动输入", s.correct, s.gradedAnswered, s.writingDone];
      for (const it of bank.items) {
        const r = s.byItem[it.id];
        row.push(r ? fmtAnswer(ansOf(r)) : "", r && it.graded ? (r.is_correct ? "对" : "错") : "");
      }
      lines.push(row);
    }
    return "﻿" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n") + "\r\n";
  }

  return { rosterName, ansOf, ansKey, fmtAnswer, firstAttempts, retryAttempts, analyze, sortStudents, writingFor, buildCsv };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Core;
if (typeof window !== "undefined") window.FuxiAdminCore = Core;

// ============================================================
// ② 页面
// ============================================================
if (typeof document !== "undefined" && typeof supabaseClient !== "undefined") (function () {
  const appEl = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const S = {
    user: null, classes: [], cls: null, rows: [], bank: null, notMine: false,
    tab: "overview", sort: "help", open: null, wItem: null,
  };
  let toastTimer = null;
  let loadSeq = 0;

  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3500);
  }
  function showMsg(html) { appEl.innerHTML = `<p class="la__msg">${html}</p>`; }

  // ---------- 登录 ----------
  async function login() {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
    if (error) showMsg("登录失败：" + esc(error.message));
  }
  function showLoggedOut() {
    S.user = null; S.classes = []; S.cls = null; S.rows = []; S.bank = null;
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
    const want = (new URLSearchParams(location.search).get("code") || "").trim().toUpperCase();
    const hit = S.classes.find((c) => c.play_code === want);
    S.notMine = !!want && !hit;
    await selectClass((hit || S.classes[0]).id);
  }

  supabaseClient.auth.onAuthStateChange((ev, session) => {
    if (ev === "INITIAL_SESSION" || ev === "SIGNED_IN" || ev === "SIGNED_OUT") setTimeout(() => handleSession(session), 0);
  });

  // ---------- 数据 ----------
  function loadBank() {
    if (window.FuxiBank) return Promise.resolve(window.FuxiBank);
    return new Promise((resolve, reject) => {
      const sc = document.createElement("script");
      sc.src = BANK_URL;
      sc.onload = () => (window.FuxiBank ? resolve(window.FuxiBank) : reject(new Error("bank.js 载入了但没有 FuxiBank")));
      sc.onerror = () => reject(new Error("载入不到题库 bank.js"));
      document.head.appendChild(sc);
    });
  }

  async function fetchRows(code) {
    const all = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabaseClient.from(TABLE)
        .select("id, student_name, in_roster, attempt_no, item_id, answer, is_correct, error_tag, created_at")
        .eq("play_code", code)
        .order("created_at", { ascending: true }).order("id", { ascending: true })
        .range(from, from + 999);
      if (error) throw error;
      all.push(...data);
      if (data.length < 1000) break;
    }
    return all;
  }

  async function selectClass(id) {
    S.cls = S.classes.find((c) => c.id === id);
    S.open = null;
    await reload();
  }

  async function reload() {
    const seq = ++loadSeq;
    showMsg("载入作答记录…");
    try {
      const [bank, rows] = await Promise.all([loadBank(), fetchRows(S.cls.play_code)]);
      if (seq !== loadSeq) return;
      S.bank = bank; S.rows = rows;
      if (!S.wItem || !bank.items.some((i) => i.id === S.wItem)) { const w = bank.items.find((i) => !i.graded); S.wItem = w ? w.id : null; }
    } catch (e) {
      if (seq !== loadSeq) return;
      appEl.innerHTML = `<p class="la__msg">读取失败：${esc(e.message || e)}</p><p class="la__msg"><button id="retry" class="primary">重试</button></p>`;
      document.getElementById("retry").addEventListener("click", reload);
      return;
    }
    render();
  }

  const rosterNames = () => S.cls.students.slice().sort((a, b) => (a.seat_no ?? 1e6) - (b.seat_no ?? 1e6)).map(Core.rosterName).filter(Boolean);
  const analysis = () => Core.analyze(S.rows, S.bank, { rosterNames: rosterNames() });
  const tagText = (t) => (!t || t === "__none" ? "未分类的错误" : (S.bank.tags && S.bank.tags[t]) || t);
  const pct = (r) => (r === null ? "–" : Math.round(r * 100) + "%");
  const itemOf = (id) => S.bank.items.find((x) => x.id === id);
  const secTitle = (key) => { const sec = (S.bank.sections || []).find((s) => s.key === key); return sec ? sec.title : ""; };

  // ---------- 外框 ----------
  function render() {
    const A = analysis();
    const classOpts = S.classes.map((c) => `<option value="${esc(c.id)}"${c.id === S.cls.id ? " selected" : ""}>${esc(c.class_name)}（${esc(c.play_code)}）</option>`).join("");
    const tab = (id, label) => `<button data-tab="${id}" class="${S.tab === id ? "on" : ""}" role="tab" aria-selected="${S.tab === id}">${label}</button>`;
    appEl.innerHTML = `
      ${S.notMine ? `<p class="la__card muted">网址里的班级代码不是你管理的班，已改显示你的班。</p>` : ""}
      <div class="la__bar">
        <label>班级 <select id="clsSel">${classOpts}</select></label>
        <span class="grow"></span>
        <button id="refresh">重新载入</button>
        <button id="csv">下载 CSV</button>
        <span class="muted">${esc(S.user.email || "")}</span>
        <button id="logout">退出登录</button>
      </div>
      <div class="la__tabs" role="tablist">${tab("overview", "总览")}${tab("students", "学生")}${tab("writing", "写作题")}</div>
      <div id="pane"></div>`;
    document.getElementById("clsSel").addEventListener("change", (e) => selectClass(e.target.value));
    appEl.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { S.tab = b.dataset.tab; render(); }));
    document.getElementById("refresh").addEventListener("click", reload);
    document.getElementById("csv").addEventListener("click", () => downloadCsv(A));
    document.getElementById("logout").addEventListener("click", () => supabaseClient.auth.signOut());
    const pane = document.getElementById("pane");
    if (S.tab === "overview") renderOverview(pane, A);
    else if (S.tab === "students") renderStudents(pane, A);
    else renderWriting(pane, A);
  }

  function downloadCsv(A) {
    const csv = Core.buildCsv(A, S.bank, rosterNames());
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fuxi-okt-${S.cls.play_code}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // ---------- 分页一：总览 ----------
  function renderOverview(pane, A) {
    const G = A.gradedTotal, N = S.bank.items.length;
    const hard = A.hardest.length
      ? `<ol class="rank">${A.hardest.map((h) => `<li><b>${esc(h.item.id)}</b> ${esc(h.item.label)} <span class="pill warn">答对 ${pct(h.rate)}（${h.correct}/${h.n}）</span></li>`).join("")}</ol>`
      : '<p class="muted">还没有数据。</p>';
    const tags = A.topTags.length
      ? `<ol class="rank">${A.topTags.map((t) => `<li>${esc(tagText(t.tag))} <span class="pill">${t.count} 次</span><div class="muted">${t.items.slice(0, 4).map((i) => esc(i.id) + "×" + i.count).join("　")}</div></li>`).join("")}</ol>`
      : '<p class="muted">还没有错误记录。</p>';
    const hardIds = new Set(A.hardest.map((h) => h.item.id));
    let bars = "", lastSec = null;
    for (const it of S.bank.items) {
      if (!it.graded) continue;
      if (it.section !== lastSec) {
        bars += `<div class="la__sechead" style="grid-column:1/-1">第 ${esc(it.section)} 组 · ${esc(secTitle(it.section))}</div>`;
        lastSec = it.section;
      }
      const pi = A.perItem[it.id];
      const w = pi.rate === null ? 0 : Math.round(pi.rate * 100);
      const cls = pi.rate === null ? "" : pi.rate < 0.5 ? "low" : pi.rate < 0.75 ? "mid" : "";
      const tw = A.topWrong[it.id];
      const lure = tw ? `<div class="muted lure">最多人选错：「${esc(tw.answer)}」×${tw.count}${tw.all.length > 1 ? `（另有 ${tw.all.length - 1} 种）` : ""}</div>` : "";
      bars += `<div class="lab" title="${esc(it.label)}"><div class="t">${esc(it.id)} ${esc(it.label)}${hardIds.has(it.id) ? '<span class="pill warn">最难</span>' : ""}</div>${lure}</div>
        <div class="la__track" role="img" aria-label="答对率 ${pct(pi.rate)}"><div class="la__fill ${cls}" style="width:${w}%"></div></div>
        <div class="num">${pct(pi.rate)} <span class="muted">${pi.correct}/${pi.n}</span></div>`;
    }
    const r = A.retry;
    const retryText = r.wrongPairs
      ? `第一次答错共 <strong>${r.wrongPairs}</strong> 题次，其中 <strong>${r.retriedPairs}</strong> 题次再试了一次，<strong>${r.improvedPairs}</strong> 题次改对（<strong>${r.improvedStudents}</strong> 位学生）`
      : "还没有答错的记录";
    pane.innerHTML = `
      <div class="la__stats">
        <div class="la__stat"><span>参与人数</span><b id="stTotal">${A.participants}</b><span>${A.finished} 人做完全部 ${N} 项；平均交了 ${A.avgAnswered === null ? "–" : A.avgAnswered.toFixed(1)} 项</span></div>
        <div class="la__stat"><span>全班平均分</span><b id="stAvg">${A.avgCorrect === null ? "–" : A.avgCorrect.toFixed(1)}</b><span>满分 ${G}（只算批改题，写作题 ${A.writingTotal} 项不算分）</span></div>
        <div class="la__stat"><span>再试一次后改对</span><b id="stRetry">${r.improvedPairs}</b><span id="stRetryTxt">${retryText}</span></div>
      </div>
      <p class="muted">只用第一次作答（attempt 1），同人同题取最早一笔。</p>
      <div class="la__two">
        <section class="la__card hard"><h2>最难的 5 题</h2>${hard}</section>
        <section class="la__card"><h2>最常见的错误类别 Top 5</h2>${tags}</section>
      </div>
      <section class="la__card"><h2>每题第一次答对率（${G} 个批改题）</h2><div class="la__bars" id="bars">${bars}</div></section>`;
  }

  // ---------- 分页二：学生 ----------
  function renderStudents(pane, A) {
    const names = rosterNames();
    const sorted = Core.sortStudents(A.students, S.sort, names);
    const have = new Set(A.students.map((s) => s.name));
    const missing = names.filter((n) => !have.has(n));
    const sortBtn = (id, l) => `<button data-sort="${id}" class="${S.sort === id ? "on" : ""}">${l}</button>`;
    const G = A.gradedTotal, W = A.writingTotal;
    const rows = sorted.map((s, i) => {
      const open = S.open === s.name;
      return `<tr class="stu" data-i="${i}" tabindex="0" aria-expanded="${open}">
        <td>${esc(s.name)}${!s.inRoster ? '<span class="pill info">手动输入</span>' : ""}${s.flagged ? '<span class="pill warn">需要帮助</span>' : ""}</td>
        <td>${s.correct} / ${G}${s.gradedAnswered < G ? `<span class="muted">（已答 ${s.gradedAnswered}）</span>` : ""}</td>
        <td>${s.wrong.length ? esc(s.wrong.join("、")) : '<span class="muted">全对</span>'}</td>
        <td>${s.topTag ? esc(tagText(s.topTag)) + ` <span class="muted">×${s.topTagCount}</span>` : '<span class="muted">–</span>'}</td>
        <td>${s.writingDone} / ${W}</td></tr>
        ${open ? `<tr class="detail"><td colspan="5">${studentDetail(s, names)}</td></tr>` : ""}`;
    }).join("");
    pane.innerHTML = `
      <div class="la__bar"><span class="muted">排序</span><span class="la__seg">${sortBtn("help", "需要帮助")}${sortBtn("seat", "名单顺序")}${sortBtn("name", "姓名")}</span>
        <span class="muted">「需要帮助」＝错题多、或同一类错误出现 3 次以上的排前面</span></div>
      <section class="la__card la__scroll"><table id="stuTable"><thead><tr><th>学生</th><th>对 / ${G}</th><th>答错的题</th><th>主要错误类别</th><th>写作题完成</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5" class="muted">还没有学生的作答。</td></tr>'}</tbody></table></section>
      ${missing.length ? `<p class="muted">名单里还没有数据的人（${missing.length}）：${missing.map(esc).join("、")}</p>` : ""}`;
    pane.querySelectorAll("[data-sort]").forEach((b) => b.addEventListener("click", () => { S.sort = b.dataset.sort; render(); }));
    pane.querySelectorAll("tr.stu").forEach((tr) => {
      const go = () => { const s = sorted[+tr.dataset.i]; S.open = S.open === s.name ? null : s.name; render(); };
      tr.addEventListener("click", go);
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    const mg = pane.querySelector("[data-merge]");
    if (mg) mg.addEventListener("click", () => mergeStudent(mg.dataset.merge, pane.querySelector("#mergeTo").value, mg));
  }

  function studentDetail(s, names) {
    const lines = S.bank.items.map((it) => {
      const r = s.byItem[it.id];
      if (!r) return `<tr><td>${esc(it.id)}</td><td>${esc(it.label)}</td><td class="muted">（没有作答）</td><td>${it.graded ? esc(Core.fmtAnswer(it.correct)) : '<span class="muted">写作题</span>'}</td><td></td></tr>`;
      const mine = esc(Core.fmtAnswer(Core.ansOf(r)));
      if (!it.graded) return `<tr><td>${esc(it.id)}</td><td>${esc(it.label)}</td><td>${mine}</td><td class="muted">${it.model ? "范例：" + esc(it.model) : "写作题"}</td><td class="muted">不批改</td></tr>`;
      const rr = s.retryByItem[it.id];
      const retry = rr ? `；再试：${esc(Core.fmtAnswer(Core.ansOf(rr)))}（${rr.is_correct ? "对" : "错"}）` : "";
      return `<tr><td>${esc(it.id)}</td><td>${esc(it.label)}</td><td class="${r.is_correct ? "good" : "bad"}">${mine}</td><td>${esc(Core.fmtAnswer(it.correct))}</td><td>${r.is_correct ? "对" : "错" + (r.error_tag ? "：" + esc(tagText(r.error_tag)) : "") + retry}</td></tr>`;
    }).join("");
    let manual = "";
    if (!s.inRoster) {
      manual = `<div class="la__bar"><span>这是手动输入的名字。合并到名单里的：</span>
        <select id="mergeTo">${names.map((n) => `<option>${esc(n)}</option>`).join("")}</select>
        <button class="primary" data-merge="${esc(s.name)}">合并</button></div>`;
    }
    return `${manual}<table><thead><tr><th>题号</th><th>题目</th><th>他的答案</th><th>标准答案</th><th>结果</th></tr></thead><tbody>${lines}</tbody></table>`;
  }

  async function mergeStudent(oldName, target, btn) {
    if (!target) return;
    if (!confirm(`把「${oldName}」的所有作答合并到「${target}」？\n（只改名字，不删资料；如果「${target}」本来就有作答，两边会并在一起，统计取最早的一笔。）`)) return;
    btn.disabled = true; btn.textContent = "合并中…";
    const { data, error } = await supabaseClient.from(TABLE)
      .update({ student_name: target, in_roster: true })
      .eq("play_code", S.cls.play_code).eq("student_name", oldName).eq("in_roster", false)
      .select("id");
    if (error) { btn.disabled = false; btn.textContent = "合并"; return toast("合并失败：" + error.message); }
    if (!data || !data.length) { btn.disabled = false; btn.textContent = "合并"; return toast("没有改到任何一行（可能没有权限，或已被合并）"); }
    toast(`已合并 ${data.length} 笔到「${target}」`);
    S.open = target;
    await reload();
  }

  // ---------- 分页三：写作题 ----------
  function renderWriting(pane, A) {
    const wItems = S.bank.items.filter((i) => !i.graded);
    if (!wItems.length) { pane.innerHTML = '<p class="la__msg">题库里没有写作题。</p>'; return; }
    const it = wItems.find((i) => i.id === S.wItem) || wItems[0];
    const list = Core.writingFor(A, it.id, rosterNames());
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
        <p class="muted">第 ${esc(it.section)} 组 · ${esc(secTitle(it.section))}。写作题不批改，学生只看到参考范例。</p>
        ${it.model ? `<p class="la__model"><b>参考范例：</b>${esc(it.model)}</p>` : ""}
        <div class="la__writes" id="writes">${list.length ? list.map((x) => `<div class="la__write"><div class="who">${esc(x.name)}${!x.inRoster ? '<span class="pill info">手动输入</span>' : ""}</div><div class="what">${esc(Core.fmtAnswer(x.text))}</div></div>`).join("") : '<p class="muted">还没有人写这一题。</p>'}</div>
        ${missing.length && list.length ? `<p class="muted">还没写这题的人（${missing.length}）：${missing.map(esc).join("、")}</p>` : ""}
      </section>`;
    pane.querySelectorAll("[data-w]").forEach((b) => b.addEventListener("click", () => { S.wItem = b.dataset.w; render(); }));
  }
})();
