// class-code-client.js —— 各教学工具用来读取 kelasku 班级名单的共用小工具
// 使用方式：工具页面依序引入 supabase-client.js（先，负责连线）→ 这份档案，
// 再用 ClassCode.load() 拿名单，不用自己重新写 Supabase 查询逻辑。
//
// 网址参数一律用 ?code=，可以放一个或多个（逗号分隔），例如：
//   ?code=JH0042-1I                  单一班级
//   ?code=JH0042-1I,JH0042-2A        多班合并（完整代码）
//   ?code=JH0042-1I,2A               同校简写：没有 "-" 的那段自动沿用前一段的学校代码
//
// 没有 code 参数、或代码查无资料时，load() 回传空阵列，工具应该照旧走「手动输入名字」模式。

const ClassCode = (() => {
  function expand(rawParam) {
    if (!rawParam) return [];
    const tokens = rawParam.split(",").map((t) => t.trim()).filter(Boolean);
    const codes = [];
    let lastSchoolCode = null;
    for (const token of tokens) {
      const upper = token.toUpperCase();
      if (upper.includes("-")) {
        const [schoolCode] = upper.split("-");
        lastSchoolCode = schoolCode;
        codes.push(upper);
      } else if (lastSchoolCode) {
        codes.push(`${lastSchoolCode}-${upper}`);
      }
      // 没有 "-" 又没有前一段学校代码可沿用的孤立 token，直接忽略（格式不合法）
    }
    return codes;
  }

  function codesFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return expand(params.get("code"));
  }

  // 回传合并后的学生名单：
  //   [{ name, nameZh, nameEn, seatNo, className, schoolName, playCode }, ...]
  // name 是给旧工具用的显示名 fallback（优先中文名，没有就用英文名）；
  // 新工具想分语言显示，直接用 nameZh / nameEn。
  // 多个班级会依 codes 出现顺序合并，同代码/同名字不去重（同班不该重复输入，交给老师自己管理）。
  // 每班内部按座号排序（没座号的排最后）。
  async function load(rawParam) {
    const codes = rawParam !== undefined ? expand(rawParam) : codesFromUrl();
    if (codes.length === 0) return [];

    const { data: classes, error } = await supabaseClient
      .from("classes")
      .select("id, class_name, play_code, schools(full_name), students(name, name_zh, name_en, seat_no)")
      .in("play_code", codes);

    if (error || !classes) {
      console.error("ClassCode.load failed:", error);
      return [];
    }

    const roster = [];
    for (const cls of classes) {
      const students = (cls.students || []).slice().sort((a, b) => {
        if (a.seat_no == null && b.seat_no == null) return 0;
        if (a.seat_no == null) return 1;
        if (b.seat_no == null) return -1;
        return a.seat_no - b.seat_no;
      });
      for (const student of students) {
        const nameZh = student.name_zh || null;
        const nameEn = student.name_en || null;
        roster.push({
          name: nameZh || nameEn || student.name,
          nameZh,
          nameEn,
          seatNo: student.seat_no,
          className: cls.class_name,
          schoolName: cls.schools ? cls.schools.full_name : "",
          playCode: cls.play_code,
        });
      }
    }
    return roster;
  }

  // ---------- 输入代码（不用背网址）----------
  // 网址带 ?code= 常常被打错（尤其"?code="这段），改成弹一个输入框让学生/老师
  // 直接打代码，打过一次会记在这台设备的浏览器里，下次开同一个网址不用再打

  const REMEMBER_KEY = "kelasku_class_code";

  function rememberCode(raw) {
    if (raw) localStorage.setItem(REMEMBER_KEY, raw);
  }

  function promptForCode() {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;background:rgba(11,30,45,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:'PingFang SC','Microsoft YaHei',sans-serif;padding:16px;box-sizing:border-box;";
      overlay.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:26px 22px;max-width:320px;width:100%;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,0.35);">
          <div style="font-weight:900;font-size:1.1rem;margin-bottom:6px;color:#1F3A34;">输入班级代码</div>
          <div style="font-size:0.85rem;color:#667;margin-bottom:16px;">老师给的那组代码，例如 JBC1037-1I</div>
          <input type="text" placeholder="班级代码" style="width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:2px solid #ddd;font-size:1.05rem;text-align:center;margin-bottom:12px;">
          <div style="display:flex;gap:8px;">
            <button type="button" data-act="skip" style="flex:1;padding:11px;border-radius:10px;border:none;background:#eee;color:#556;font-weight:700;cursor:pointer;font-size:0.9rem;">跳过</button>
            <button type="button" data-act="go" style="flex:1;padding:11px;border-radius:10px;border:none;background:#0EA5B7;color:#fff;font-weight:700;cursor:pointer;font-size:0.9rem;">开始</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      const input = overlay.querySelector("input");
      input.focus();
      const finish = (value) => { overlay.remove(); resolve(value); };
      overlay.querySelector('[data-act="go"]').addEventListener("click", () => {
        const v = input.value.trim();
        finish(v || null);
      });
      overlay.querySelector('[data-act="skip"]').addEventListener("click", () => finish(null));
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") overlay.querySelector('[data-act="go"]').click(); });
    });
  }

  // 拿名单的完整流程：网址有代码就直接用；没有的话，先试试这台设备之前记住的代码；
  // 都没有，弹框让学生/老师自己打（打了会记住，跳过就照旧走手动输入名字的模式）
  async function loadOrPrompt() {
    const urlCodes = codesFromUrl();
    if (urlCodes.length > 0) {
      rememberCode(new URLSearchParams(window.location.search).get("code"));
      return load();
    }

    const remembered = localStorage.getItem(REMEMBER_KEY);
    if (remembered) {
      const roster = await load(remembered);
      if (roster.length > 0) return roster;
    }

    const typed = await promptForCode();
    if (!typed) return [];
    const roster = await load(typed);
    if (roster.length > 0) rememberCode(typed);
    return roster;
  }

  return { expand, codesFromUrl, load, loadOrPrompt, promptForCode };
})();
