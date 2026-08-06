// kelasku —— 老师登录管理班级/学生名单，生成给其他教学工具用的 play_code
// 架构讨论见 Claude memory：kongsi-idea-teaching-tools-shared-db-architecture

const STATES = [
  "柔佛", "吉打", "吉兰丹", "马六甲", "森美兰", "彭亨", "槟城",
  "霹雳", "玻璃市", "沙巴", "砂拉越", "雪兰莪", "登嘉楼", "吉隆坡", "纳闽", "布城",
];

let currentSession = null;
let myClasses = []; // [{id, class_name, play_code, school_id, schools:{full_name}}]
let pickedSchool = null; // {id, full_name, school_code}
let parsedNames = [];
let editingClassId = null;
let editingStudents = [];

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
    .from("classes")
    .select("id, class_name, play_code, school_id, schools(full_name)")
    .eq("owner_id", currentSession.user.id)
    .order("created_at", { ascending: true });
  if (error) {
    showToast("读取班级列表失败：" + error.message);
    myClasses = [];
    return;
  }
  myClasses = data || [];
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
  parsedNames = [];
  el("schoolSearchInput").value = "";
  el("schoolSuggestions").hidden = true;
  el("schoolPicked").hidden = true;
  el("newSchoolForm").hidden = true;
  el("classNameInput").value = "";
  el("classNameHint").textContent = "";
  el("studentPasteArea").value = "";
  el("namePreviewSection").hidden = true;
  el("addClassError").hidden = true;
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
  parsedNames = parsePastedNames(el("studentPasteArea").value);
  renderNamePreview();
  updateCreateBtnState();
});

function renderNamePreview() {
  const section = el("namePreviewSection");
  const list = el("namePreviewList");
  list.innerHTML = "";
  if (parsedNames.length === 0) { section.hidden = true; return; }
  section.hidden = false;
  el("namePreviewCount").textContent = `侦测到 ${parsedNames.length} 个名字，检查一下对不对：`;
  parsedNames.forEach((name, i) => {
    const chip = document.createElement("span");
    chip.className = "kk-preview-chip";
    chip.innerHTML = `${name} <button type="button" aria-label="删除">✕</button>`;
    chip.querySelector("button").addEventListener("click", () => {
      parsedNames.splice(i, 1);
      renderNamePreview();
      updateCreateBtnState();
    });
    list.appendChild(chip);
  });
}

function updateCreateBtnState() {
  const classNameOk = /^[A-Za-z0-9]+$/.test(el("classNameInput").value);
  el("createClassBtn").disabled = !(pickedSchool && classNameOk && parsedNames.length > 0);
}

el("addClassBtn").addEventListener("click", () => {
  resetAddClassForm();
  showState("stateAddClass");
});
el("backFromAddClass").addEventListener("click", () => { showState("stateClassList"); });

el("createClassBtn").addEventListener("click", async () => {
  el("addClassError").hidden = true;
  const className = el("classNameInput").value.trim();
  const { data: cls, error: classErr } = await supabaseClient
    .from("classes")
    .insert({ school_id: pickedSchool.id, class_name: className, owner_id: currentSession.user.id })
    .select("id, class_name, play_code")
    .single();
  if (classErr) {
    el("addClassError").hidden = false;
    el("addClassError").textContent = classErr.message.includes("duplicate")
      ? "这间学校已经有同样的班级缩写了"
      : "建立班级失败：" + classErr.message;
    return;
  }
  const rows = parsedNames.map((name) => ({ class_id: cls.id, name }));
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

// ---------- 编辑班级 ----------

async function openEditClass(classId) {
  editingClassId = classId;
  const cls = myClasses.find((c) => c.id === classId);
  el("editClassTitle").textContent = `${cls.class_name} · ${cls.schools ? cls.schools.full_name : ""}`;
  el("editClassCode").textContent = cls.play_code;
  await loadEditingStudents();
  showState("stateEditClass");
}

async function loadEditingStudents() {
  const { data, error } = await supabaseClient
    .from("students")
    .select("id, name")
    .eq("class_id", editingClassId)
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
    const chip = document.createElement("span");
    chip.className = "kk-preview-chip";
    chip.innerHTML = `${s.name} <button type="button" aria-label="删除">✕</button>`;
    chip.querySelector("button").addEventListener("click", async () => {
      const { error } = await supabaseClient.from("students").delete().eq("id", s.id);
      if (error) { showToast("删除失败：" + error.message); return; }
      await loadEditingStudents();
    });
    list.appendChild(chip);
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
  const rows = names.map((name) => ({ class_id: editingClassId, name }));
  const { error } = await supabaseClient.from("students").insert(rows);
  if (error) { showToast("加入失败：" + error.message); return; }
  el("addMoreStudentsArea").value = "";
  showToast(`加入了 ${names.length} 位学生`);
  await loadEditingStudents();
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
    await loadMyClasses();
  } else {
    myClasses = [];
  }
  render();
});
