// class-code-client.js —— 各教学工具用来读取 kelasku 班级名单的共用小工具
// 使用方式：工具页面依序引入 supabase-client.js（先，负责连线）→ 这份档案，
// 再用 ClassCode.loadOrPrompt() 拿名单。不用各工具重新写 Supabase 查询与班级切换逻辑。
//
// 网址参数一律用 ?code=，可以放一个或多个（逗号分隔），例如：
//   ?code=JH0042-1I                  单一班级
//   ?code=JH0042-1I,JH0042-2A        多班合并（完整代码）
//   ?code=JH0042-1I,2A               同校简写：没有 "-" 的那段自动沿用前一段的学校代码
//
// 标准流程（新工具也必须沿用）：
//   const roster = await ClassCode.loadOrPrompt();
//
// loadOrPrompt() 会处理：网址代码 → 已记住的代码 → 可重复尝试的输入框。
// 读到班级后会自动显示「换班级」按钮；换班成功会保留其他网址参数、更新 code，
// 再重新载入当前工具，避免上一班的学生、成绩或进度残留。若工具只需要名单，
// 不要自己再做一套班级代码输入／记忆／换班 UI。

const ClassCode = (() => {
  const REMEMBER_KEY = "kelasku_class_code";
  const SWITCHER_ID = "kelasku-class-switcher";
  let activePrompt = null;

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

  function rawUrlCode() {
    try {
      return (new URLSearchParams(window.location.search).get("code") || "").trim();
    } catch (e) {
      return "";
    }
  }

  function codesFromUrl() {
    return expand(rawUrlCode());
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
    if (roster.length > 0) {
      rememberCode(rawParam || rawUrlCode());
      mountSwitcher();
    }
    return roster;
  }

  function rememberCode(raw) {
    if (!raw) return;
    try { localStorage.setItem(REMEMBER_KEY, raw.trim()); } catch (e) {}
  }

  function rememberedCode() {
    try { return localStorage.getItem(REMEMBER_KEY) || ""; }
    catch (e) { return ""; }
  }

  function clearRememberedCode() {
    try { localStorage.removeItem(REMEMBER_KEY); } catch (e) {}
  }

  function replaceUrlCode(raw) {
    try {
      const url = new URL(window.location.href);
      if (raw) url.searchParams.set("code", raw.trim());
      else url.searchParams.delete("code");
      window.history.replaceState(null, "", url.href);
    } catch (e) {}
  }

  function ensureStyles() {
    if (document.getElementById("kelasku-class-code-styles")) return;
    const style = document.createElement("style");
    style.id = "kelasku-class-code-styles";
    style.textContent = `
      .kcc-switcher {
        position: fixed; top: max(12px, env(safe-area-inset-top)); right: max(12px, env(safe-area-inset-right));
        z-index: 2147483000; display: inline-flex; align-items: center; gap: 7px;
        min-height: 38px; padding: 8px 13px; border: 1px solid rgba(31,58,52,.24);
        border-radius: 999px; background: rgba(251,246,236,.96); color: #1F3A34;
        box-shadow: 0 4px 16px rgba(31,58,52,.16); cursor: pointer;
        font: 700 14px/1.2 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
        transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
      }
      .kcc-switcher::before {
        content: ""; width: 8px; height: 8px; border-radius: 50%; background: #E8873E;
        box-shadow: 0 0 0 3px rgba(232,135,62,.16);
      }
      .kcc-switcher:hover { transform: translateY(-1px); background: #fff; box-shadow: 0 6px 20px rgba(31,58,52,.2); }
      .kcc-switcher:focus-visible { outline: 3px solid rgba(79,168,216,.55); outline-offset: 3px; }
      .kcc-overlay {
        position: fixed; inset: 0; z-index: 2147483001; display: flex; align-items: center; justify-content: center;
        padding: 18px; box-sizing: border-box; background: rgba(20,36,33,.62);
        font-family: -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
      }
      .kcc-dialog {
        width: min(100%, 370px); box-sizing: border-box; padding: 26px 23px 22px;
        border: 1px solid rgba(31,58,52,.15); border-radius: 20px; background: #FBF6EC;
        box-shadow: 0 18px 52px rgba(0,0,0,.3); color: #1F3A34;
      }
      .kcc-kicker { margin-bottom: 7px; color: #E8873E; font-size: 12px; font-weight: 800; letter-spacing: .08em; }
      .kcc-title { margin: 0; font-size: 22px; line-height: 1.3; letter-spacing: -.02em; }
      .kcc-hint { margin: 8px 0 18px; color: #5A6963; font-size: 14px; line-height: 1.6; }
      .kcc-label { display: block; color: #31554C; font-size: 13px; font-weight: 800; }
      .kcc-input {
        display: block; width: 100%; box-sizing: border-box; margin-top: 7px; padding: 12px 13px;
        border: 2px solid #C8D3CD; border-radius: 11px; background: #fff; color: #1F3A34;
        font: 700 17px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing: .03em; text-align: center;
      }
      .kcc-input:focus { border-color: #4FA8D8; outline: 3px solid rgba(79,168,216,.2); }
      .kcc-error { min-height: 21px; margin: 8px 0 0; color: #B4483C; font-size: 13px; line-height: 1.5; }
      .kcc-actions { display: flex; gap: 9px; margin-top: 14px; }
      .kcc-actions button {
        flex: 1; min-height: 43px; border: 0; border-radius: 11px; cursor: pointer;
        font: 800 14px/1.2 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
      }
      .kcc-cancel { background: #E6EAE5; color: #486057; }
      .kcc-submit { background: #1F3A34; color: #fff; }
      .kcc-actions button:focus-visible { outline: 3px solid rgba(79,168,216,.55); outline-offset: 2px; }
      @media (max-width: 520px) {
        .kcc-switcher { top: max(9px, env(safe-area-inset-top)); right: max(9px, env(safe-area-inset-right)); min-height: 35px; padding: 7px 11px; font-size: 13px; }
        .kcc-dialog { padding: 23px 18px 18px; border-radius: 17px; }
      }
      @media (prefers-reduced-motion: reduce) { .kcc-switcher { transition: none; } }
    `;
    document.head.appendChild(style);
  }

  // 让所有引用共用客户端的工具自动拥有同一个入口，不要求各工具重复画按钮。
  function mountSwitcher() {
    if (!document.body || document.getElementById(SWITCHER_ID)) return;
    ensureStyles();
    const button = document.createElement("button");
    button.id = SWITCHER_ID;
    button.type = "button";
    button.className = "kcc-switcher";
    button.textContent = "换班级";
    button.setAttribute("aria-label", "换班级");
    button.title = "输入另一个班级代码";
    button.addEventListener("click", switchClass);
    document.body.appendChild(button);
  }

  function scheduleSwitcher() {
    if (rawUrlCode() || rememberedCode()) {
      if (document.body) mountSwitcher();
      else document.addEventListener("DOMContentLoaded", mountSwitcher, { once: true });
    }
  }

  function promptForCode(options = {}) {
    if (activePrompt) return activePrompt;
    const {
      initial = "",
      message = "",
      title = "输入班级代码",
      skipLabel = "暂不选班",
    } = options;

    activePrompt = new Promise((resolve) => {
      ensureStyles();
      const overlay = document.createElement("div");
      overlay.className = "kcc-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "kcc-dialog-title");
      overlay.innerHTML = `
        <section class="kcc-dialog">
          <div class="kcc-kicker">课堂点子铺 · KELASKU</div>
          <h2 class="kcc-title" id="kcc-dialog-title"></h2>
          <p class="kcc-hint">输入老师给的班级代码，例如 JBC1037-1A。输入正确后会显示这班同学的名单。</p>
          <label class="kcc-label">班级代码
            <input class="kcc-input" type="text" placeholder="JBC1037-1A" maxlength="120" autocomplete="off" autocapitalize="characters" spellcheck="false">
          </label>
          <p class="kcc-error" aria-live="polite"></p>
          <div class="kcc-actions">
            <button type="button" class="kcc-cancel" data-act="cancel"></button>
            <button type="button" class="kcc-submit" data-act="submit">载入班级</button>
          </div>
        </section>
      `;
      document.body.appendChild(overlay);
      const titleEl = overlay.querySelector(".kcc-title");
      const input = overlay.querySelector(".kcc-input");
      const errorEl = overlay.querySelector(".kcc-error");
      const cancelButton = overlay.querySelector('[data-act="cancel"]');
      const submitButton = overlay.querySelector('[data-act="submit"]');
      titleEl.textContent = title;
      input.value = initial;
      errorEl.textContent = message;
      cancelButton.textContent = skipLabel;

      const finish = (value) => {
        document.removeEventListener("keydown", onKeyDown);
        overlay.remove();
        activePrompt = null;
        resolve(value);
      };
      const submit = () => finish(input.value.trim());
      const onKeyDown = (event) => {
        if (event.key === "Escape") finish(null);
        if (event.key === "Enter") submit();
      };
      cancelButton.addEventListener("click", () => finish(null));
      submitButton.addEventListener("click", submit);
      input.addEventListener("input", () => { errorEl.textContent = ""; });
      document.addEventListener("keydown", onKeyDown);
      input.focus();
      input.select();
    });
    return activePrompt;
  }

  async function loadWithFallback(options = {}) {
    let initial = options.initial || "";
    let message = options.message || "";
    while (true) {
      const typed = await promptForCode({
        initial,
        message,
        title: options.title || "输入班级代码",
        skipLabel: options.skipLabel || "暂不选班",
      });
      if (!typed) return { roster: [], raw: "" };

      let roster = [];
      try { roster = await load(typed); } catch (error) { console.error("ClassCode.load failed:", error); }
      if (roster.length > 0) return { roster, raw: typed };

      initial = typed;
      message = `找不到「${typed}」这个班级，请检查代码后再试。`;
    }
  }

  // 完整流程：网址代码有效就直接使用；失败则留在输入框，可持续重试。
  // 没有网址代码时，先试这台设备记住的代码；跳过后才退回工具自己的手动输入。
  async function loadOrPrompt() {
    const urlRaw = rawUrlCode();
    if (urlRaw) {
      let roster = [];
      try { roster = await load(urlRaw); } catch (error) { console.error("ClassCode.load failed:", error); }
      if (roster.length > 0) {
        rememberCode(urlRaw);
        mountSwitcher();
        return roster;
      }
    } else {
      const remembered = rememberedCode();
      if (remembered) {
        let roster = [];
        try { roster = await load(remembered); } catch (error) { console.error("ClassCode.load failed:", error); }
        if (roster.length > 0) {
          mountSwitcher();
          return roster;
        }
      }
    }

    const result = await loadWithFallback({
      initial: urlRaw || rememberedCode(),
      message: urlRaw ? `找不到「${urlRaw}」这个班级，请检查代码后再试。` : "",
    });
    if (result.roster.length === 0) {
      clearRememberedCode();
      return [];
    }
    rememberCode(result.raw);
    replaceUrlCode(result.raw);
    mountSwitcher();
    return result.roster;
  }

  async function switchClass() {
    const result = await loadWithFallback({
      initial: rawUrlCode() || rememberedCode(),
      title: "换班级",
      skipLabel: "先不换",
    });
    if (result.roster.length === 0) return;

    rememberCode(result.raw);
    replaceUrlCode(result.raw);
    // 各工具的学生、题目、成绩与 React/原生状态不同；重新载入是统一且安全的清理边界。
    window.location.reload();
  }

  scheduleSwitcher();

  return {
    expand,
    codesFromUrl,
    load,
    loadOrPrompt,
    promptForCode,
    mountSwitcher,
    switchClass,
    getRememberedCode: rememberedCode,
  };
})();
