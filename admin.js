// 许愿池审核后台：只有 public.admins 里的账号能用；权限由数据库的 is_admin() 把关，前端只负责显示。
const STATUSES = [
  ["new", "新提交"], ["triaged", "已看过"], ["researching", "研究中"], ["planned", "已排期"],
  ["building", "制作中"], ["shipped", "已上架"], ["declined", "不做"],
];
const SUBJ = { bm: "马来文", bc: "华文", bi: "英文", mt: "数学" };
const HELP = { "practice-game": "练习小游戏", "classroom-interactive": "课堂互动", "presentation-aid": "教学演示", "group-activity": "分组活动", printable: "可打印材料", utility: "抽选／计时", unsure: "不确定" };
const MODE = { "whole-class": "只有老师投影", "pair-group": "学生几人共用设备", independent: "学生每人一台", "teacher-prep": "老师课前准备", "no-device": "没有设备" };
const appEl = document.getElementById("app");
let wishes = [];
let filter = "all";
let teachers = null;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const stLabel = (v) => (STATUSES.find((s) => s[0] === v) || [v, v])[1];

function showMsg(html) { appEl.innerHTML = `<p class="ad__msg">${html}</p>`; }

async function login() {
  const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
  if (error) showMsg("登录失败：" + esc(error.message));
}

async function load() {
  const { data, error } = await supabaseClient.rpc("admin_list_wishes");
  if (error) return showMsg("读取失败：" + esc(error.message));
  wishes = data || [];
  render();
}

function render() {
  const counts = {};
  wishes.forEach((w) => { counts[w.status] = (counts[w.status] || 0) + 1; });
  if (filter === "teachers") return renderTeachers();
  const tabs = [["all", `全部 ${wishes.length}`], ...STATUSES.map(([v, l]) => [v, `${l} ${counts[v] || 0}`]), ["teachers", "注册名单"]]
    .map(([v, l]) => `<button class="${filter === v ? "on" : ""}" data-f="${v}">${l}</button>`).join("");
  const list = wishes.filter((w) => filter === "all" || w.status === filter);
  appEl.innerHTML = `<div class="ad__bar">${tabs}</div>` + (list.map(card).join("") || '<p class="ad__msg">这个分类下没有许愿单</p>');
  appEl.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.f; render(); }));
  appEl.querySelectorAll("[data-save]").forEach((b) => b.addEventListener("click", () => save(b.dataset.save, b)));
}

async function renderTeachers() {
  if (teachers === null) {
    showMsg("载入名单…");
    const { data, error } = await supabaseClient.rpc("admin_list_teachers");
    if (error) return showMsg("读取失败：" + esc(error.message));
    teachers = data || [];
  }
  const fmt = (t) => (t ? new Date(t).toLocaleDateString("zh-CN") : "-");
  const rows = teachers.map((t) => `<tr><td>${esc(t.full_name) || "-"}</td><td>${esc(t.email)}</td><td>${fmt(t.created_at)}</td><td>${fmt(t.last_sign_in_at)}</td><td>${t.wish_count}</td></tr>`).join("");
  const tabs = [["all", "返回许愿单"], ["teachers", `注册名单 ${teachers.length}`]]
    .map(([v, l]) => `<button class="${filter === v ? "on" : ""}" data-f="${v}">${l}</button>`).join("");
  appEl.innerHTML = `<div class="ad__bar">${tabs}</div><div class="ad__card" style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:.9rem"><thead><tr style="text-align:left"><th>姓名</th><th>邮箱</th><th>注册</th><th>最近登录</th><th>许愿数</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  appEl.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.f; render(); }));
}

function card(w) {
  const d = new Date(w.created_at).toLocaleString("zh-CN", { hour12: false });
  const row = (k, v) => (v && String(v).length ? `<div class="ad__row"><b>${k}：</b>${esc(Array.isArray(v) ? v.join("、") : v)}</div>` : "");
  const school = [w.school_name, w.school_district, w.school_state].filter(Boolean).join(" · ");
  return `<section class="ad__card" id="w-${w.id}">
    <div class="ad__meta"><span>${d}</span><span>Tahun ${w.tahun ?? "?"} · ${esc(SUBJ[w.subjek] || w.subjek || "?")}</span><span>${esc(school) || "未填学校"}</span><span>${esc(w.teacher_email)}</span><span>状态：${stLabel(w.status)}</span></div>
    <div class="ad__goal">${esc(w.learning_goal)}</div>
    ${row("单元目标", w.unit_objective)}${row("课堂时机", w.lesson_moment)}${row("卡在哪", w.problem_description)}
    ${row("困难类型", w.difficulty_tags)}${row("试过什么", w.tried_already)}${row("限制", w.constraints)}
    ${row("想要", HELP[w.desired_help] || w.desired_help)}${row("设备／使用", (w.usage_modes || []).map((m) => MODE[m] || m))}${row("必须／避免", w.must_have_or_avoid)}${row("班级情况", w.classroom_context)}
    <div class="ad__edit">
      <select data-status>${STATUSES.map(([v, l]) => `<option value="${v}"${v === w.status ? " selected" : ""}>${l}</option>`).join("")}</select>
      <textarea data-note placeholder="审核备注（不公开）">${esc(w.review_note)}</textarea>
      <input data-slug placeholder="关联工具 slug（已排期／制作中／已上架时填）" value="${esc(w.linked_tool_slug)}">
      <button data-save="${w.id}">保存</button>
    </div></section>`;
}

async function save(id, btn) {
  const box = document.getElementById("w-" + id);
  const status = box.querySelector("[data-status]").value;
  const note = box.querySelector("[data-note]").value.trim();
  const slug = box.querySelector("[data-slug]").value.trim();
  btn.disabled = true; btn.textContent = "保存中…";
  const { error } = await supabaseClient.rpc("admin_update_wish", { p_id: id, p_status: status, p_note: note, p_slug: slug });
  if (error) { btn.disabled = false; btn.textContent = "保存失败：" + error.message; return; }
  const w = wishes.find((x) => x.id === id);
  Object.assign(w, { status, review_note: note || null, linked_tool_slug: slug || null });
  btn.disabled = false; btn.textContent = "已保存 ✓";
  box.querySelector(".ad__meta span:last-child").textContent = "状态：" + stLabel(status);
}

async function init() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    appEl.innerHTML = '<p class="ad__msg">请先登录管理员账号</p><p class="ad__msg"><button id="login">用 Google 登录</button></p>';
    document.getElementById("login").addEventListener("click", login);
    return;
  }
  const { data: ok } = await supabaseClient.rpc("is_admin");
  if (!ok) return showMsg("这个账号没有后台权限：" + esc(session.user.email || ""));
  load();
}
supabaseClient.auth.onAuthStateChange((ev) => { if (ev === "INITIAL_SESSION") init(); });
