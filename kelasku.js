// kelasku —— 老师登录管理班级/学生名单，生成给其他教学工具用的 play_code
// 架构讨论见 Claude memory：kongsi-idea-teaching-tools-shared-db-architecture

const STATES = [
  "柔佛", "吉打", "吉兰丹", "马六甲", "森美兰", "彭亨", "槟城",
  "霹雳", "玻璃市", "沙巴", "砂拉越", "雪兰莪", "登嘉楼", "吉隆坡", "纳闽", "布城",
];

let currentSession = null;
let myClasses = []; // [{id, class_name, play_code, school_id, schools:{full_name}}]
let pickedSchool = null; // {id, full_name, school_code}
let parsedStudents = []; // [{seatNo, nameZh, nameEn}]
let editingClassId = null;
let editingStudents = [];
let pendingDuplicateClassId = null; // 建班时侦测到学校+班级已存在，先记下来等老师按「加入」

// ---------- Excel 栏位侦测（跟 3g-assessment 的 lib/result-parser.ts 同一套做法：
// 别人的表头写法千百种，用别名字典 + 找分数最高的那一行当表头，不假设固定格式）

const HEADER_ALIASES = {
  seatNo: ["座号", "学号", "编号", "NO", "NO.", "BIL", "BIL."],
  nameZh: ["中文姓名", "华文姓名", "中文名", "华文名", "姓名"],
  nameEn: ["英文姓名", "马来文姓名", "英文名", "马来文名", "NAME", "NAMA", "NAMAPENUH", "FULLNAME"],
};

function normalizeHeaderCell(value) {
  return String(value || "").normalize("NFKC").toLocaleUpperCase().replace(/[\s._()（）/\\\-:：]+/g, "");
}

function mapHeaderCell(value) {
  const normalized = normalizeHeaderCell(value);
  if (!normalized) return null;
  for (const field of Object.keys(HEADER_ALIASES)) {
    if (HEADER_ALIASES[field].some((alias) => normalized === normalizeHeaderCell(alias))) return field;
  }
  return null;
}

// 表头不一定在第一行（有些档案上面还有标题/说明行），扫前 15 行找匹配栏位最多的那一行当表头
function chooseHeaderRow(table) {
  let best = { rowIndex: -1, columns: {}, score: -1 };
  for (let r = 0; r < Math.min(table.length, 15); r++) {
    const columns = {};
    (table[r] || []).forEach((cell, c) => {
      const field = mapHeaderCell(cell);
      if (field && columns[field] === undefined) columns[field] = c;
    });
    const hasName = columns.nameZh !== undefined || columns.nameEn !== undefined;
    const score = Object.keys(columns).length * 10 + (hasName ? 8 : 0);
    if (score > best.score) best = { rowIndex: r, columns, score };
  }
  return best;
}

function parseExcelWorkbookToStudents(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const table = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const header = chooseHeaderRow(table);
  if (header.rowIndex < 0 || (header.columns.nameZh === undefined && header.columns.nameEn === undefined)) {
    throw new Error("找不到看得懂的表头，档案至少要有一栏中文姓名或英文姓名");
  }
  const students = [];
  for (let r = header.rowIndex + 1; r < table.length; r++) {
    const row = table[r] || [];
    const nameZh = header.columns.nameZh !== undefined ? String(row[header.columns.nameZh] || "").trim() : "";
    const nameEn = header.columns.nameEn !== undefined ? String(row[header.columns.nameEn] || "").trim() : "";
    if (!nameZh && !nameEn) continue;
    const seatRaw = header.columns.seatNo !== undefined ? String(row[header.columns.seatNo] || "").trim() : "";
    const seatNo = seatRaw && /^\d+$/.test(seatRaw) ? Number(seatRaw) : null;
    students.push({ seatNo, nameZh: nameZh || null, nameEn: nameEn || null });
  }
  return students;
}

// ---------- 小工具 ----------

function showToast(msg) {
  const stack = document.getElementById("toastStack");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  el.style.cssText = "background:#1F3A34;color:#fff;padding:10px 16px;border-radius:10px;margin-top:8px;font-size:0.88rem;box-shadow:0 4px 12px rgba(0,0,0,0.15);";
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function el(id) { return document.getElementById(id); }

function parsePastedNames(raw) {
  const lines = raw.split(/\r?\n/);
  const names = [];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    const cells = line.split("\t").map((c) => c.trim()).filter(Boolean);
    let candidate = cells.length > 1
      ? cells.reduce((a, b) => (b.length > a.length ? b : a))
      : cells[0];
    if (!candidate) continue;
    candidate = candidate.replace(/^\s*(\d+[.、)]|[-•])\s*/, "").trim();
    if (candidate) names.push(candidate);
  }
  return names;
}

// ---------- 视图切换 ----------

function showState(id) {
  ["stateLoggedOut", "stateClassList", "stateAddClass", "stateEditClass"].forEach((s) => {
    el(s).hidden = s !== id;
  });
}

function render() {
  if (!currentSession) {
    showState("stateLoggedOut");
    return;
  }
  showState("stateClassList");
  renderClassList();
}

// ---------- 班级列表 ----------

async function loadMyClasses() {
  const { data, error } = await supabaseClient
    .from("class_teachers")
    .select("classes(id, class_name, play_code, school_id, schools(full_name))")
    .eq("teacher_id", currentSession.user.id)
    .order("joined_at", { ascending: true });
  if (error) {
    showToast("读取班级列表失败：" + error.message);
    myClasses = [];
    return;
  }
  myClasses = (data || []).map((row) => row.classes).filter(Boolean);
}

function renderClassList() {
  const wrap = el("classCards");
  el("noClassesYet").hidden = myClasses.length > 0;
  wrap.innerHTML = "";
  myClasses.forEach((c) => {
    const card = document.createElement("div");
    card.className = "kk-class-card";
    card.innerHTML = `
      <div>
        <span class="kk-class-card__name">${c.class_name}</span>
        <span class="kk-class-card__meta">${c.schools ? c.schools.full_name : ""}</span>
      </div>
      <span class="kk-class-card__code">${c.play_code}</span>
    `;
    card.addEventListener("click", () => openEditClass(c.id));
    wrap.appendChild(card);
  });
}

// ---------- 新增班级 ----------

function resetAddClassForm() {
  pickedSchool = null;
  parsedStudents = [];
  pendingDuplicateClassId = null;
  el("schoolSearchInput").value = "";
  el("schoolSuggestions").hidden = true;
  el("schoolPicked").hidden = true;
  el("newSchoolForm").hidden = true;
  el("classNameInput").value = "";
  el("classNameHint").textContent = "";
  el("studentPasteArea").value = "";
  el("excelUploadInput").value = "";
  el("namePreviewSection").hidden = true;
  el("addClassError").hidden = true;
  el("existingClassPrompt").hidden = true;
  el("createClassBtn").hidden = false;
  el("createClassBtn").disabled = true;
  if (!el("newSchoolState").dataset.filled) {
    STATES.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      el("newSchoolState").appendChild(opt);
    });
    el("newSchoolState").dataset.filled = "1";
  }
}

let schoolSearchTimer = null;
el("schoolSearchInput").addEventListener("input", () => {
  clearTimeout(schoolSearchTimer);
  const q = el("schoolSearchInput").value.trim();
  pickedSchool = null;
  el("schoolPicked").hidden = true;
  updateCreateBtnState();
  if (!q) { el("schoolSuggestions").hidden = true; return; }
  schoolSearchTimer = setTimeout(async () => {
    const { data, error } = await supabaseClient
      .from("schools")
      .select("id, full_name, state, district, school_code")
      .ilike("full_name", `%${q}%`)
      .limit(20);
    if (error) return;
    renderSchoolSuggestions(data || []);
  }, 250);
});

function renderSchoolSuggestions(list) {
  const box = el("schoolSuggestions");
  box.innerHTML = "";
  if (list.length === 0) { box.hidden = true; return; }
  list.forEach((s) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = `${s.full_name}<span class="kk-suggestion-meta">${s.state}${s.district ? " · " + s.district : ""} · ${s.school_code}</span>`;
    btn.addEventListener("click", () => {
      pickedSchool = s;
      el("schoolSearchInput").value = s.full_name;
      box.hidden = true;
      el("schoolPicked").hidden = false;
      el("schoolPicked").textContent = `已选：${s.full_name}（代码 ${s.school_code}）`;
      updateCreateBtnState();
    });
    box.appendChild(btn);
  });
  box.hidden = false;
}

el("schoolNotFoundBtn").addEventListener("click", () => {
  el("newSchoolForm").hidden = !el("newSchoolForm").hidden;
});

el("addNewSchoolBtn").addEventListener("click", async () => {
  const name = el("newSchoolName").value.trim();
  const state = el("newSchoolState").value;
  if (!name || !state) { showToast("请填学校全名和州属"); return; }
  const { data, error } = await supabaseClient
    .from("schools")
    .insert({ full_name: name, state })
    .select("id, full_name, state, district, school_code")
    .single();
  if (error) { showToast("加入学校失败：" + error.message); return; }
  pickedSchool = data;
  el("schoolSearchInput").value = data.full_name;
  el("schoolPicked").hidden = false;
  el("schoolPicked").textContent = `已选：${data.full_name}（代码 ${data.school_code}）`;
  el("newSchoolForm").hidden = true;
  el("newSchoolName").value = "";
  updateCreateBtnState();
});

el("classNameInput").addEventListener("input", () => {
  const v = el("classNameInput").value;
  const ok = /^[A-Za-z0-9]+$/.test(v);
  el("classNameHint").textContent = v && !ok ? "只能英文字母和数字，不能有空格或符号" : "";
  updateCreateBtnState();
});

el("parsePasteBtn").addEventListener("click", () => {
  parsedStudents = parsePastedNames(el("studentPasteArea").value).map((name) => ({ seatNo: null, nameZh: name, nameEn: null }));
  renderNamePreview();
  updateCreateBtnState();
});

el("excelUploadInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    parsedStudents = parseExcelWorkbookToStudents(wb);
    renderNamePreview();
    updateCreateBtnState();
    showToast(`从 Excel 抓到 ${parsedStudents.length} 位学生`);
  } catch (err) {
    showToast("Excel 读取失败：" + err.message);
  }
});

function renderNamePreview() {
  const section = el("namePreviewSection");
  const list = el("namePreviewList");
  list.innerHTML = "";
  if (parsedStudents.length === 0) { section.hidden = true; return; }
  section.hidden = false;
  el("namePreviewCount").textContent = `侦测到 ${parsedStudents.length} 位学生，检查一下对不对：`;
  parsedStudents.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "kk-preview-row";
    row.innerHTML = `
      <input type="text" placeholder="座号" value="${s.seatNo ?? ""}" data-field="seatNo">
      <input type="text" placeholder="中文名" value="${s.nameZh ?? ""}" data-field="nameZh">
      <input type="text" placeholder="英文名" value="${s.nameEn ?? ""}" data-field="nameEn">
      <button type="button" aria-label="删除">✕</button>
    `;
    row.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.dataset.field;
        s[field] = field === "seatNo" ? (input.value ? Number(input.value) : null) : (input.value || null);
      });
    });
    row.querySelector("button").addEventListener("click", () => {
      parsedStudents.splice(i, 1);
      renderNamePreview();
      updateCreateBtnState();
    });
    list.appendChild(row);
  });
}

function updateCreateBtnState() {
  const classNameOk = /^[A-Za-z0-9]+$/.test(el("classNameInput").value);
  el("createClassBtn").disabled = !(pickedSchool && classNameOk && parsedStudents.length > 0);
}

el("addClassBtn").addEventListener("click", () => {
  resetAddClassForm();
  showState("stateAddClass");
});
el("backFromAddClass").addEventListener("click", () => { showState("stateClassList"); });

el("createClassBtn").addEventListener("click", async () => {
  el("addClassError").hidden = true;
  el("existingClassPrompt").hidden = true;
  const className = el("classNameInput").value.trim();
  const { data: cls, error: classErr } = await supabaseClient
    .from("classes")
    .insert({ school_id: pickedSchool.id, class_name: className, created_by: currentSession.user.id })
    .select("id, class_name, play_code")
    .single();
  if (classErr) {
    if (classErr.message.includes("duplicate")) {
      // 这间学校已经有人建过这个班了——找出是哪一个，让老师选择加入而不是卡在错误讯息
      const { data: existing } = await supabaseClient
        .from("classes")
        .select("id, play_code")
        .eq("school_id", pickedSchool.id)
        .ilike("class_name", className)
        .maybeSingle();
      if (existing) {
        pendingDuplicateClassId = existing.id;
        el("existingClassPromptText").textContent = `${pickedSchool.full_name} 的 ${className} 班已经有老师建过了（代码 ${existing.play_code}），要加入一起管理这个班吗？`;
        el("existingClassPrompt").hidden = false;
        el("createClassBtn").hidden = true;
        return;
      }
    }
    el("addClassError").hidden = false;
    el("addClassError").textContent = "建立班级失败：" + classErr.message;
    return;
  }
  const rows = parsedStudents.map((s) => ({ class_id: cls.id, name_zh: s.nameZh, name_en: s.nameEn, seat_no: s.seatNo }));
  const { error: studentsErr } = await supabaseClient.from("students").insert(rows);
  if (studentsErr) {
    showToast("班级建好了，但学生名单写入失败：" + studentsErr.message);
  } else {
    showToast(`班级 ${cls.play_code} 建立完成`);
  }
  await loadMyClasses();
  showState("stateClassList");
  render();
});

el("joinExistingClassBtn").addEventListener("click", async () => {
  if (!pendingDuplicateClassId) return;
  const { error } = await supabaseClient
    .from("class_teachers")
    .insert({ class_id: pendingDuplicateClassId, teacher_id: currentSession.user.id });
  if (error && !error.message.includes("duplicate")) {
    showToast("加入失败：" + error.message);
    return;
  }
  showToast("已加入这个班");
  await loadMyClasses();
  showState("stateClassList");
  render();
  openEditClass(pendingDuplicateClassId);
});

// ---------- 编辑班级 ----------

async function openEditClass(classId) {
  editingClassId = classId;
  const cls = myClasses.find((c) => c.id === classId);
  el("editClassTitle").textContent = `${cls.class_name} · ${cls.schools ? cls.schools.full_name : ""}`;
  el("editClassCode").textContent = cls.play_code;
  el("snapshotList").hidden = true;
  el("snapshotList").innerHTML = "";
  await loadEditingStudents();
  await loadClassTeachersHint();
  showState("stateEditClass");
}

async function loadClassTeachersHint() {
  const { count } = await supabaseClient
    .from("class_teachers")
    .select("teacher_id", { count: "exact", head: true })
    .eq("class_id", editingClassId);
  const n = count || 1;
  el("classTeachersHint").textContent = n > 1 ? `目前有 ${n} 位老师共同管理这个班` : "目前只有你在管理这个班，其他老师搜到同一个学校+班级就能加入";
}

async function snapshotBeforeChange() {
  await supabaseClient.rpc("snapshot_class_students", { p_class_id: editingClassId });
}

async function loadEditingStudents() {
  const { data, error } = await supabaseClient
    .from("students")
    .select("id, name_zh, name_en, seat_no")
    .eq("class_id", editingClassId)
    .order("seat_no", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (error) { showToast("读取学生名单失败：" + error.message); return; }
  editingStudents = data || [];
  renderEditingStudents();
}

function renderEditingStudents() {
  el("editStudentCount").textContent = editingStudents.length + " 人";
  const list = el("editStudentList");
  list.innerHTML = "";
  editingStudents.forEach((s) => {
    const row = document.createElement("div");
    row.className = "kk-preview-row";
    row.innerHTML = `
      <input type="text" placeholder="座号" value="${s.seat_no ?? ""}" data-field="seat_no">
      <input type="text" placeholder="中文名" value="${s.name_zh ?? ""}" data-field="name_zh">
      <input type="text" placeholder="英文名" value="${s.name_en ?? ""}" data-field="name_en">
      <button type="button" aria-label="删除">✕</button>
    `;
    row.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", async () => {
        const field = input.dataset.field;
        const value = field === "seat_no" ? (input.value ? Number(input.value) : null) : (input.value || null);
        await snapshotBeforeChange();
        const { error } = await supabaseClient.from("students").update({ [field]: value }).eq("id", s.id);
        if (error) { showToast("更新失败：" + error.message); return; }
        s[field] = value;
      });
    });
    row.querySelector("button").addEventListener("click", async () => {
      await snapshotBeforeChange();
      const { error } = await supabaseClient.from("students").delete().eq("id", s.id);
      if (error) { showToast("删除失败：" + error.message); return; }
      await loadEditingStudents();
    });
    list.appendChild(row);
  });
}

el("backFromEditClass").addEventListener("click", async () => {
  await loadMyClasses();
  showState("stateClassList");
  render();
});

el("addMoreStudentsBtn").addEventListener("click", async () => {
  const names = parsePastedNames(el("addMoreStudentsArea").value);
  if (names.length === 0) return;
  await snapshotBeforeChange();
  const rows = names.map((name) => ({ class_id: editingClassId, name_zh: name }));
  const { error } = await supabaseClient.from("students").insert(rows);
  if (error) { showToast("加入失败：" + error.message); return; }
  el("addMoreStudentsArea").value = "";
  showToast(`加入了 ${names.length} 位学生`);
  await loadEditingStudents();
});

el("editExcelUploadInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const incoming = parseExcelWorkbookToStudents(wb);
    await snapshotBeforeChange();
    let updated = 0, inserted = 0;
    for (const s of incoming) {
      const match = s.nameZh && editingStudents.find((x) => x.name_zh === s.nameZh);
      if (match) {
        const patch = {};
        if (s.nameEn) patch.name_en = s.nameEn;
        if (s.seatNo !== null) patch.seat_no = s.seatNo;
        if (Object.keys(patch).length > 0) {
          await supabaseClient.from("students").update(patch).eq("id", match.id);
          updated++;
        }
      } else {
        await supabaseClient.from("students").insert({ class_id: editingClassId, name_zh: s.nameZh, name_en: s.nameEn, seat_no: s.seatNo });
        inserted++;
      }
    }
    showToast(`更新了 ${updated} 位、新增了 ${inserted} 位学生`);
    await loadEditingStudents();
  } catch (err) {
    showToast("Excel 读取失败：" + err.message);
  }
  el("editExcelUploadInput").value = "";
});

// ---------- 还原名单 ----------

el("loadSnapshotsBtn").addEventListener("click", async () => {
  const box = el("snapshotList");
  if (!box.hidden) { box.hidden = true; return; }
  const { data, error } = await supabaseClient
    .from("class_snapshots")
    .select("id, students_json, created_at")
    .eq("class_id", editingClassId)
    .order("created_at", { ascending: false });
  if (error) { showToast("读取历史版本失败：" + error.message); return; }
  box.innerHTML = "";
  if (!data || data.length === 0) {
    box.innerHTML = `<p class="kk-field-hint">还没有历史版本（第一次改动之后才会开始存档）</p>`;
  } else {
    data.forEach((snap) => {
      const row = document.createElement("div");
      row.className = "kk-snapshot-row";
      const time = new Date(snap.created_at).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
      const count = Array.isArray(snap.students_json) ? snap.students_json.length : 0;
      row.innerHTML = `<span>${time}（${count} 人）</span>`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "kk-btn kk-btn--small";
      btn.textContent = "还原到这里";
      btn.addEventListener("click", async () => {
        if (!confirm(`确定要把名单还原成 ${time} 的样子吗？现在的名单会先自动存一份档，不会真的丢掉。`)) return;
        const { error: restoreErr } = await supabaseClient.rpc("restore_class_snapshot", { p_snapshot_id: snap.id });
        if (restoreErr) { showToast("还原失败：" + restoreErr.message); return; }
        showToast("已还原");
        box.hidden = true;
        await loadEditingStudents();
      });
      row.appendChild(btn);
      box.appendChild(row);
    });
  }
  box.hidden = false;
});

el("copyEditCodeBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(el("editClassCode").textContent);
  showToast("代码已复制");
});

el("deleteClassBtn").addEventListener("click", async () => {
  if (!confirm("确定要删除这个班级？学生名单也会一起删除，无法恢复。")) return;
  const { error } = await supabaseClient.from("classes").delete().eq("id", editingClassId);
  if (error) { showToast("删除失败：" + error.message); return; }
  showToast("班级已删除");
  await loadMyClasses();
  showState("stateClassList");
  render();
});

// ---------- 登录 ----------

async function handleLogin() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
  if (error) showToast("登录失败：" + error.message);
}

el("authLoginBtn").addEventListener("click", handleLogin);
el("loginPromptBtn").addEventListener("click", handleLogin);
el("authLogoutBtn").addEventListener("click", async () => { await supabaseClient.auth.signOut(); });

function updateAuthUi() {
  el("authLoginBtn").hidden = !!currentSession;
  el("authSignedIn").hidden = !currentSession;
  if (currentSession) el("authEmail").textContent = currentSession.user.email || "已登录";
}

supabaseClient.auth.onAuthStateChange(async (_event, session) => {
  currentSession = session;
  updateAuthUi();
  if (currentSession) {
    // 首页统计条「位老师注册」靠这张表算全站真实人数，跟点子许愿池共用同一份登记逻辑
    await supabaseClient.from("profiles").upsert({ id: currentSession.user.id }, { onConflict: "id", ignoreDuplicates: true });
    await loadMyClasses();
  } else {
    myClasses = [];
  }
  render();
});
