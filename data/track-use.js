// 点子铺工具「直接被打开」的使用次数统计。
// 各工具页只要加一行：
//   <script src="https://kongsi-idea.vercel.app/data/track-use.js" data-slug="工具slug" defer></script>
// 规则：
// - 只在工具自己的正式网址（slug.vercel.app，或 data-host 指定的旧网址）计数，preview／本机不算，免得写进假 slug。
// - 从 hub 点「开始使用」进来的网址带 ?kh=1&kd=：这里把两个参数从网址拿掉，
//   老师之后从地址栏复制转发才干净。2026-10-22 起 hub 不再自己计数，一律由这里算。
// - 页面在前台累计停留满 20 秒才算一次（2026-10-22）。
// - 同一台浏览器 30 分钟内同一个工具只算一次（刷新不灌水），和首页「次到访」同一套规则。
// - 失败一律静默，绝不影响学生玩。数字是客户端估计值，不是独立访客数。
// - 2026-10-17：自动化浏览器（Playwright 验收、爬虫，navigator.webdriver 为真）不计；
//   卢老师自己的设备在工具网址后加 ?nocount=1 打开一次就记住不计（?nocount=0 取消），只影响这台浏览器的这个工具。
(function () {
  try {
    if (navigator.webdriver) return;
    var NO_COUNT_KEY = "kongsi-idea-no-count";
    var q = new URL(location.href).searchParams.get("nocount");
    try {
      if (q === "1") localStorage.setItem(NO_COUNT_KEY, "1");
      if (q === "0") localStorage.removeItem(NO_COUNT_KEY);
      if (localStorage.getItem(NO_COUNT_KEY) === "1") return;
    } catch (e) { /* storage 不能用就照常计数 */ }

    var el = document.currentScript;
    var slug = el && el.getAttribute("data-slug");
    var legacy = el && el.getAttribute("data-host"); // 改名前的旧网址（如 grade2-math-tools.vercel.app），仍有人在用才加
    if (!slug || (location.hostname !== slug + ".vercel.app" && location.hostname !== legacy)) return;

    // anon key 设计上就是公开的（见 data/supabase-client.js），权限由 RLS／RPC 限制
    var URL_ = "https://gntnkhkkgonaehapcerr.supabase.co";
    var ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudG5raGtrZ29uYWVoYXBjZXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDc2NTgsImV4cCI6MjEwMDM4MzY1OH0.9_08R--1vQxN6CIRmrbvkVN2O-bSDJgGq6XKgOp5mis";
    function rpc(name, body) {
      return fetch(URL_ + "/rest/v1/rpc/" + name, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", apikey: ANON, Authorization: "Bearer " + ANON },
        body: JSON.stringify(body)
      });
    }

    // 2026-10-17：「几台设备用过」（supabase/migration-2026-10-17-device-seen.sql）。
    // 从 Hub 进来会带 ?kd=Hub 的设备 id，沿用它，同一台电脑在 Hub 和各工具才算同一台；
    // 每台设备每个工具只登记一次，成功才记住，失败下次再试
    var u = new URL(location.href);
    var DEVICE_KEY = "kongsi-idea-device-key";
    var REG_KEY = "kongsi-idea-device-reg:" + slug;
    try {
      var kd = u.searchParams.get("kd");
      if (kd && /^[0-9a-f-]{36}$/i.test(kd)) localStorage.setItem(DEVICE_KEY, kd);
      var device = localStorage.getItem(DEVICE_KEY);
      if (!device && window.crypto && crypto.randomUUID) { device = crypto.randomUUID(); localStorage.setItem(DEVICE_KEY, device); }
      if (device && localStorage.getItem(REG_KEY) !== device) {
        rpc("register_device", { p_key: device, p_scope: slug })
          .then(function (r) { if (r.ok) localStorage.setItem(REG_KEY, device); })
          .catch(function () {});
      }
    } catch (e) { /* storage 不能用就不登记设备 */ }

    if (u.searchParams.has("kh") || u.searchParams.has("kd")) {
      u.searchParams.delete("kh");
      u.searchParams.delete("kd");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }

    // 2026-10-22：页面在前台累计停留满 20 秒才算一次（老师定，数字延续不归零）。
    // 切到别的分页／缩小时不计时；从 Hub 进来也在这里算，Hub 的「开始使用」不再自己 +1
    var STAY_MS = 20 * 1000;
    var KEY = "kongsi-idea-use-ts:" + slug;
    var visibleMs = 0;
    var timer = setInterval(function () {
      if (document.visibilityState !== "visible") return;
      visibleMs += 1000;
      if (visibleMs < STAY_MS) return;
      clearInterval(timer);
      var now = Date.now();
      try {
        if (now - Number(localStorage.getItem(KEY) || 0) < 30 * 60 * 1000) return;
        localStorage.setItem(KEY, String(now));
      } catch (e) { /* 读写不了 storage 就当每次都新来，宁可多算不漏算 */ }
      rpc("increment_tool_uses", { p_slug: slug }).catch(function () {});
    }, 1000);
  } catch (e) { /* 静默 */ }
})();
