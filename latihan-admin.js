// 一年级10月数学练习 · 老师后台（只读 tahun1_mt_latihan_okt_answers，权限全由数据库 RLS 把关；前端只负责显示）
// 题库来自学生工具的 bank.js（window.LatihanBank，合约见 teaching-tools/tahun1-mt-latihan-oktober/PLAN.md）。
// 文件分两段：① 纯计算（Core，可在 node 里直接测）② 页面（只在有 document 时执行）。

const BANK_URL = "https://tahun1-mt-latihan-oktober.vercel.app/bank.js";
const TABLE = "tahun1_mt_latihan_okt_answers";

// ============================================================
// ① 纯计算
// ============================================================
const Core = (() => {
  const keyOf = (name, itemId) => name + "\u0000" + itemId;
  const ts = (r) => Date.parse(r.created_at) || 0;

  function rosterName(s) { return s.name_zh || s.name_en || s.name || ""; }

  // 每个（学生，题）只取「第一次作答」＝ attempt_no=1 里 created_at 最早的一笔；source 可筛 all/online/paper
  function firstAttempts(rows, source, ignored) {
    const map = new Map();
    for (const r of rows) {
      if (r.attempt_no !== 1) continue;
      if (source !== "all" && r.source !== source) continue;
      if (ignored && ignored.has(r.student_name)) continue;
      const k = keyOf(r.student_name, r.item_id);
      const old = map.get(k);
      if (!old || ts(r) < ts(old) || (ts(r) === ts(old) && String(r.id) < String(old.id))) map.set(k, r);
    }
    return map;
  }

  function analyze(rows, bank, opts) {
    const source = (opts && opts.source) || "all";
    const ignored = (opts && opts.ignored) || new Set();
    const rosterNames = (opts && opts.rosterNames) || [];
    const itemIds = new Set(bank.items.map((i) => i.id));
    const firsts = firstAttempts(rows.filter((r) => itemIds.has(r.item_id)), source, ignored);

    // 参与人数不受来源筛选影响（永远显示在线几人／纸本几人）
    const onlineSet = new Set(), paperSet = new Set();
    for (const r of rows) {
      if (r.attempt_no !== 1 || ignored.has(r.student_name) || !itemIds.has(r.item_id)) continue;
      (r.source === "paper" ? paperSet : onlineSet).add(r.student_name);
    }
    const allSet = new Set([...onlineSet, ...paperSet]);

    const perItem = {};
    for (const it of bank.items) perItem[it.id] = { n: 0, correct: 0, rate: null, tags: {} };
    const students = new Map();
    const tagTotals = {};
    const tagItems = {};
    // 学生是否来自名单：任一笔 in_roster=true 或名字在名单里（合并后会被改成 true）
    const inRosterFlag = new Map();
    for (const r of rows) if (r.in_roster) inRosterFlag.set(r.student_name, true);

    for (const r of firsts.values()) {
      const pi = perItem[r.item_id];
      pi.n++;
      if (r.is_correct) pi.correct++;
      else {
        const t = r.error_tag || "__none";
        pi.tags[t] = (pi.tags[t] || 0) + 1;
        tagTotals[t] = (tagTotals[t] || 0) + 1;
        (tagItems[t] = tagItems[t] || {})[r.item_id] = (tagItems[t][r.item_id] || 0) + 1;
      }
      let s = students.get(r.student_name);
      if (!s) {
        s = { name: r.student_name, answered: 0, correct: 0, wrong: [], tags: {}, sources: new Set(), byItem: {} };
        students.set(r.student_name, s);
      }
      s.answered++;
      s.sources.add(r.source);
      s.byItem[r.item_id] = r;
      if (r.is_correct) s.correct++;
      else {
        s.wrong.push(r.item_id);
        const t = r.error_tag || "__none";
        s.tags[t] = (s.tags[t] || 0) + 1;
      }
    }
    for (const it of bank.items) { const p = perItem[it.id]; p.rate = p.n ? p.correct / p.n : null; }

    const list = [...students.values()].map((s) => {
      let topTag = null, topCount = 0;
      for (const [t, c] of Object.entries(s.tags)) if (t !== "__none" && c > topCount) { topTag = t; topCount = c; }
      s.topTag = topTag; s.topTagCount = topCount;
      s.inRoster = inRosterFlag.has(s.name);
      // 「需要帮助」旗标：错了 40% 以上，或同一类错误 3 题以上
      s.flagged = s.answered > 0 && (s.wrong.length >= Math.ceil(s.answered * 0.4) || topCount >= 3);
      return s;
    });

    const hardest = bank.items
      .filter((it) => perItem[it.id].n > 0)
      .map((it) => ({ item: it, ...perItem[it.id] }))
      .sort((a, b) => a.rate - b.rate || b.n - a.n)
      .slice(0, 5);

    const topTags = Object.entries(tagTotals)
      .map(([tag, count]) => ({
        tag, count,
        items: Object.entries(tagItems[tag]).sort((a, b) => b[1] - a[1]).map(([id, c]) => ({ id, count: c })),
      }))
      .sort((a, b) => b.count - a.count || (a.tag < b.tag ? -1 : 1))
      .slice(0, 5);

    const avgCorrect = list.length ? list.reduce((a, s) => a + s.correct, 0) / list.length : null;
    return {
      perItem, students: list, hardest, topTags, avgCorrect,
      participants: { total: allSet.size, online: onlineSet.size, paper: paperSet.size },
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

  function fieldKey(f, i) { return typeof f === "string" ? f : (f.key || f.id || f.name || String(i)); }
  function fieldLabel(f, i) { return typeof f === "string" ? f : (f.label || f.title || fieldKey(f, i)); }

  function fmtAnswer(item, ans) {
    if (ans === undefined || ans === null || ans === "") return "（空）";
    const e = item.entry || {};
    if (e.kind === "multi" && ans && typeof ans === "object") {
      const fields = e.fields || Object.keys(ans);
      return fields.map((f, i) => `${fieldLabel(f, i)} ${ans[fieldKey(f, i)] ?? "–"}`).join("、");
    }
    if (e.kind === "cells") return `${ans} 格`;
    if (e.kind === "number") return e.unit ? `${ans} ${e.unit}` : String(ans);
    return typeof ans === "object" ? JSON.stringify(ans) : String(ans);
  }

  // CSV（学生 × 题，对错＋答案）。字串开头是 = + - @ 的加单引号，避免 Excel 当公式（学生手输的名字不可信）。
  function csvCell(v) {
    let s = v === null || v === undefined ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function buildCsv(analysis, bank, rosterNames) {
    const head = ["学生", "来源", "对题数", "已答题数"];
    for (const it of bank.items) head.push(`${it.id} 答案`, `${it.id} 对错`);
    const lines = [head];
    const std = ["标准答案", "", "", ""];
    for (const it of bank.items) std.push(fmtAnswer(it, it.correct), "");
    lines.push(std);
    for (const s of sortStudents(analysis.students, "seat", rosterNames)) {
      const row = [s.name, [...s.sources].map((x) => (x === "paper" ? "纸本" : "在线")).join("+"), s.correct, s.answered];
      for (const it of bank.items) {
        const r = s.byItem[it.id];
        row.push(r ? fmtAnswer(it, r.answer) : "", r ? (r.is_correct ? "对" : "错") : "");
      }
      lines.push(row);
    }
    return "﻿" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n") + "\r\n";
  }

  return { rosterName, firstAttempts, analyze, sortStudents, fmtAnswer, buildCsv, fieldKey, fieldLabel };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Core;
if (typeof window !== "undefined") window.LatihanAdminCore = Core;

// ============================================================
// ② 页面
// ============================================================
if (typeof document !== "undefined" && typeof supabaseClient !== "undefined") (function () {
  const appEl = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const S = {
    user: null, classes: [], cls: null, rows: [], bank: null,
    source: "all", tab: "overview", sort: "help", open: null,
    paperStudent: null, paperDraft: {}, paperErrors: {}, ignored: new Set(), showIgnored: false, busy: false,
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
    S.user = null; S.classes = []; S.cls = null; S.rows = []; S.paperDraft = {};
    appEl.innerHTML = '<p class="la__msg">请先登录老师账号</p><p class="la__msg"><button id="login" class="primary">用 Google 登录</button></p>';
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
      return showMsg('这个账号（' + esc(session.user.email || "") + '）还没有管理任何班级。<br>请先到 <a href="kelasku.html">我的班级</a> 加入或建立班级。');
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
    if (window.LatihanBank) return Promise.resolve(window.LatihanBank);
    return new Promise((resolve, reject) => {
      const sc = document.createElement("script");
      sc.src = BANK_URL;
      sc.onload = () => (window.LatihanBank ? resolve(window.LatihanBank) : reject(new Error("bank.js 载入了但没有 LatihanBank")));
      sc.onerror = () => reject(new Error("载入不到题库 bank.js"));
      document.head.appendChild(sc);
    });
  }

  async function fetchRows(code) {
    const all = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabaseClient.from(TABLE)
        .select("id, student_name, in_roster, source, attempt_no, item_id, answer, is_correct, error_tag, created_at")
        .eq("play_code", code)
        .order("created_at", { ascending: true }).order("id", { ascending: true })
        .range(from, from + 999);
      if (error) throw error;
      all.push(...data);
      if (data.length < 1000) break;
    }
    return all;
  }

  function ignoreKey() { return "latihan-admin-ignore:" + S.cls.play_code; }
  function loadIgnored() {
    try { S.ignored = new Set(JSON.parse(localStorage.getItem(ignoreKey()) || "[]")); } catch (e) { S.ignored = new Set(); }
  }
  function saveIgnored() { try { localStorage.setItem(ignoreKey(), JSON.stringify([...S.ignored])); } catch (e) {} }

  async function selectClass(id) {
    S.cls = S.classes.find((c) => c.id === id);
    S.open = null; S.paperStudent = null; S.paperDraft = {}; S.paperErrors = {};
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
    } catch (e) {
      if (seq !== loadSeq) return;
      appEl.innerHTML = `<p class="la__msg">读取失败：${esc(e.message || e)}</p><p class="la__msg"><button id="retry" class="primary">重试</button></p>`;
      document.getElementById("retry").addEventListener("click", reload);
      return;
    }
    render();
  }

  const rosterNames = () => S.cls.students.slice().sort((a, b) => (a.seat_no ?? 1e6) - (b.seat_no ?? 1e6)).map(Core.rosterName).filter(Boolean);
  const analysis = () => Core.analyze(S.rows, S.bank, { source: S.source, ignored: S.ignored, rosterNames: rosterNames() });
  const tagText = (t) => (!t || t === "__none" ? "未分类的错误" : (S.bank.tags && S.bank.tags[t]) || t);
  const pct = (r) => (r === null ? "–" : Math.round(r * 100) + "%");

  // ---------- 外框 ----------
  function render() {
    const A = analysis();
    const classOpts = S.classes.map((c) => `<option value="${esc(c.id)}"${c.id === S.cls.id ? " selected" : ""}>${esc(c.class_name)}（${esc(c.play_code)}）</option>`).join("");
    const seg = (id, label) => `<button data-src="${id}" class="${S.source === id ? "on" : ""}">${label}</button>`;
    const tab = (id, label) => `<button data-tab="${id}" class="${S.tab === id ? "on" : ""}">${label}</button>`;
    appEl.innerHTML = `
      ${S.notMine ? `<p class="la__card muted">网址里的班级代码不是你管理的班，已改显示你的班。</p>` : ""}
      <div class="la__bar">
        <label>班级 <select id="clsSel">${classOpts}</select></label>
        <span class="la__seg" role="group" aria-label="来源">${seg("all", "全部")}${seg("online", "在线")}${seg("paper", "纸本")}</span>
        <span class="grow"></span>
        <button id="refresh">重新载入</button>
        <button id="csv">下载 CSV</button>
        <span class="muted">${esc(S.user.email || "")}</span>
        <button id="logout">退出登录</button>
      </div>
      <div class="la__tabs" role="tablist">${tab("overview", "总览")}${tab("students", "学生")}${tab("paper", "纸本回填")}</div>
      <div id="pane"></div>`;
    document.getElementById("clsSel").addEventListener("change", (e) => selectClass(e.target.value));
    appEl.querySelectorAll("[data-src]").forEach((b) => b.addEventListener("click", () => { S.source = b.dataset.src; render(); }));
    appEl.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { S.tab = b.dataset.tab; render(); }));
    document.getElementById("refresh").addEventListener("click", reload);
    document.getElementById("csv").addEventListener("click", () => downloadCsv(A));
    document.getElementById("logout").addEventListener("click", () => supabaseClient.auth.signOut());
    const pane = document.getElementById("pane");
    if (S.tab === "overview") renderOverview(pane, A);
    else if (S.tab === "students") renderStudents(pane, A);
    else renderPaper(pane);
  }

  function downloadCsv(A) {
    const csv = Core.buildCsv(A, S.bank, rosterNames());
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `latihan-okt-${S.cls.play_code}-${S.source}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // ---------- 分页一：总览 ----------
  function renderOverview(pane, A) {
    const N = S.bank.items.length;
    const p = A.participants;
    const itemLab = (id) => { const it = S.bank.items.find((x) => x.id === id); return it ? `${it.id} ${it.label}` : id; };
    const hard = A.hardest.length
      ? `<ol class="rank">${A.hardest.map((h) => `<li><b>${esc(h.item.id)}</b> ${esc(h.item.label)} <span class="pill warn">答对 ${pct(h.rate)}（${h.correct}/${h.n}）</span></li>`).join("")}</ol>`
      : '<p class="muted">还没有数据。</p>';
    const tags = A.topTags.length
      ? `<ol class="rank">${A.topTags.map((t) => `<li>${esc(tagText(t.tag))} <span class="pill">${t.count} 次</span><div class="muted">${t.items.slice(0, 4).map((i) => esc(i.id) + "×" + i.count).join("　")}</div></li>`).join("")}</ol>`
      : '<p class="muted">还没有错误记录。</p>';
    let bars = "";
    let lastSec = null;
    const hardIds = new Set(A.hardest.map((h) => h.item.id));
    for (const it of S.bank.items) {
      if (it.section !== lastSec) {
        const sec = (S.bank.sections || []).find((s) => s.no === it.section);
        bars += `<div class="la__sechead" style="grid-column:1/-1">第 ${it.section} 大题${sec ? " · " + esc(sec.title) : ""}</div>`;
        lastSec = it.section;
      }
      const pi = A.perItem[it.id];
      const w = pi.rate === null ? 0 : Math.round(pi.rate * 100);
      const cls = pi.rate === null ? "" : pi.rate < 0.5 ? "low" : pi.rate < 0.75 ? "mid" : "";
      bars += `<div class="lab" title="${esc(it.label)}">${esc(it.id)} ${esc(it.label)}${hardIds.has(it.id) ? '<span class="pill warn">最难</span>' : ""}</div>
        <div class="la__track" role="img" aria-label="答对率 ${pct(pi.rate)}"><div class="la__fill ${cls}" style="width:${w}%"></div></div>
        <div class="num">${pct(pi.rate)} <span class="muted">${pi.correct}/${pi.n}</span></div>`;
    }
    const srcLabel = { all: "在线＋纸本", online: "仅在线", paper: "仅纸本" }[S.source];
    pane.innerHTML = `
      <div class="la__stats">
        <div class="la__stat"><span>参与人数</span><b id="stTotal">${p.total}</b><span>在线 ${p.online} 人　纸本 ${p.paper} 人</span></div>
        <div class="la__stat"><span>全班平均分</span><b id="stAvg">${A.avgCorrect === null ? "–" : A.avgCorrect.toFixed(1)}</b><span>平均对几题（共 ${N} 题；只算已作答的题）</span></div>
        <div class="la__stat"><span>统计范围</span><b style="font-size:1.1rem">${srcLabel}</b><span>只用第一次作答（attempt 1），同人同题取最早一笔</span></div>
      </div>
      <div class="la__two">
        <section class="la__card hard"><h2>最难的 5 题</h2>${hard}</section>
        <section class="la__card"><h2>最常见的错误类型 Top 5</h2>${tags}</section>
      </div>
      <section class="la__card"><h2>每题第一次答对率</h2><div class="la__bars" id="bars">${bars}</div></section>`;
  }

  // ---------- 分页二：学生 ----------
  function renderStudents(pane, A) {
    const names = rosterNames();
    const sorted = Core.sortStudents(A.students, S.sort, names);
    const have = new Set(A.students.map((s) => s.name));
    const missing = names.filter((n) => !have.has(n));
    const sortBtn = (id, l) => `<button data-sort="${id}" class="${S.sort === id ? "on" : ""}">${l}</button>`;
    const N = S.bank.items.length;
    const rows = sorted.map((s, i) => {
      const manual = !s.inRoster;
      const open = S.open === s.name;
      return `<tr class="stu" data-i="${i}" tabindex="0" aria-expanded="${open}">
        <td>${esc(s.name)}${manual ? '<span class="pill info">手动输入</span>' : ""}${s.flagged ? '<span class="pill warn">需要帮助</span>' : ""}</td>
        <td>${[...s.sources].map((x) => (x === "paper" ? "纸本" : "在线")).join("＋")}</td>
        <td>${s.correct} / ${s.answered}${s.answered < N ? `<span class="muted">（共 ${N}）</span>` : ""}</td>
        <td>${s.wrong.length ? esc(s.wrong.join("、")) : '<span class="muted">全对</span>'}</td>
        <td>${s.topTag ? esc(tagText(s.topTag)) + ` <span class="muted">×${s.topTagCount}</span>` : '<span class="muted">–</span>'}</td></tr>
        ${open ? `<tr class="detail"><td colspan="5">${studentDetail(s, names)}</td></tr>` : ""}`;
    }).join("");
    const ignoredList = [...S.ignored];
    pane.innerHTML = `
      <div class="la__bar"><span class="muted">排序</span><span class="la__seg">${sortBtn("help", "需要帮助")}${sortBtn("seat", "名单顺序")}${sortBtn("name", "姓名")}</span>
        <span class="muted">「需要帮助」＝错题多、或同一类错误出现 3 次以上的排前面</span></div>
      <section class="la__card la__scroll"><table id="stuTable"><thead><tr><th>学生</th><th>来源</th><th>对 / 已答</th><th>答错的题</th><th>主要错误类型</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5" class="muted">这个范围内还没有学生的作答。</td></tr>'}</tbody></table></section>
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
    if (mg) {
      mg.addEventListener("click", () => mergeStudent(mg.dataset.merge, pane.querySelector("#mergeTo").value, mg));
      pane.querySelector("[data-ignore]").addEventListener("click", (e) => {
        S.ignored.add(e.currentTarget.dataset.ignore); saveIgnored(); S.open = null; render(); toast("已忽略，不再计入统计（只存在这台电脑）");
      });
    }
  }

  function studentDetail(s, names) {
    const redo = S.rows.filter((r) => r.student_name === s.name && r.attempt_no > 1).length;
    const lines = S.bank.items.map((it) => {
      const r = s.byItem[it.id];
      if (!r) return `<tr><td>${esc(it.id)}</td><td>${esc(it.label)}</td><td class="muted">（没有作答）</td><td>${esc(Core.fmtAnswer(it, it.correct))}</td><td></td></tr>`;
      return `<tr><td>${esc(it.id)}</td><td>${esc(it.label)}</td><td class="${r.is_correct ? "good" : "bad"}">${esc(Core.fmtAnswer(it, r.answer))}</td><td>${esc(Core.fmtAnswer(it, it.correct))}</td><td>${r.is_correct ? "对" : "错" + (r.error_tag ? "：" + esc(tagText(r.error_tag)) : "")}</td></tr>`;
    }).join("");
    let manual = "";
    if (!s.inRoster) {
      manual = `<div class="la__bar"><span>这是手动输入的名字。合并到名单里的：</span>
        <select id="mergeTo">${names.map((n) => `<option>${esc(n)}</option>`).join("")}</select>
        <button class="primary" data-merge="${esc(s.name)}">合并</button>
        <button class="danger" data-ignore="${esc(s.name)}">忽略这个名字</button></div>`;
    }
    return `${manual}<table><thead><tr><th>题号</th><th>题目</th><th>他的答案</th><th>标准答案</th><th>结果</th></tr></thead><tbody>${lines}</tbody></table>
      ${redo ? `<p class="muted">另有 ${redo} 笔在线重做记录（attempt 2 以上，不计入分析）。</p>` : ""}`;
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

  // ---------- 分页三：纸本回填 ----------
  function paperRowsOf(name) {
    const m = {};
    for (const r of S.rows) if (r.source === "paper" && r.attempt_no === 1 && r.student_name === name) m[r.item_id] = r.answer;
    return m;
  }

  function controlHtml(item, val, fid) {
    const e = item.entry || {};
    const sel = (opts, v, id, label) => `<select id="${id}" data-fid="${id}" aria-label="${esc(label)}"><option value=""></option>${opts.map((o) => `<option value="${esc(o)}"${String(v) === String(o) ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    if (e.kind === "choice") return sel(e.options || [], val, fid, item.label);
    if (e.kind === "cells") {
      const lo = e.min ?? 0, hi = e.max ?? 10;
      const opts = []; for (let i = lo; i <= hi; i++) opts.push(i);
      return sel(opts, val, fid, item.label) + ' <span class="muted">格</span>';
    }
    if (e.kind === "multi") {
      return `<div class="fields">${(e.fields || []).map((f, i) => {
        const k = Core.fieldKey(f, i); const v = val && typeof val === "object" ? val[k] : "";
        return `<label>${esc(Core.fieldLabel(f, i))}<input type="text" inputmode="decimal" id="${fid}.${esc(k)}" data-fid="${fid}.${esc(k)}" value="${esc(v ?? "")}" autocomplete="off"></label>`;
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
        if (!el || el.value.trim() === "") continue;
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
        const sec = (S.bank.sections || []).find((s) => s.no === it.section);
        qs += `<div class="la__sechead">第 ${it.section} 大题${sec ? " · " + esc(sec.title) : ""}</div>`;
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
      document.querySelectorAll("#paperForm [data-fid]").forEach((el) => { el.value = ""; });
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
    // 规格：先删这位学生该班之前的 paper 行，再 insert（重复回填＝覆盖）。
    const del = await supabaseClient.from(TABLE).delete().eq("play_code", S.cls.play_code).eq("student_name", S.paperStudent).eq("source", "paper");
    if (del.error) return failPaper("清除旧纸本答案失败：" + del.error.message);
    if (rows.length) {
      const ins = await supabaseClient.from(TABLE).insert(rows);   // 不带 .select()
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
})();
