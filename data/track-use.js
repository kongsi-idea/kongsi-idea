// 点子铺工具「直接被打开」的使用次数统计。
// 各工具页只要加一行：
//   <script src="https://kongsi-idea.vercel.app/data/track-use.js" data-slug="工具slug" defer></script>
// 规则：
// - 只在工具自己的正式网址（slug.vercel.app，或 data-host 指定的旧网址）计数，preview／本机不算，免得写进假 slug。
// - 从 hub 点「开始使用」进来的网址带 ?kh=1：hub 已经算过，这里跳过，并把 kh 从网址拿掉，
//   老师之后从地址栏复制转发就不会漏算。
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

    var u = new URL(location.href);
    if (u.searchParams.get("kh") === "1") {
      u.searchParams.delete("kh");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
      return;
    }

    var KEY = "kongsi-idea-use-ts:" + slug;
    var now = Date.now();
    try {
      if (now - Number(localStorage.getItem(KEY) || 0) < 30 * 60 * 1000) return;
      localStorage.setItem(KEY, String(now));
    } catch (e) { /* 读写不了 storage 就当每次都新来，宁可多算不漏算 */ }

    // anon key 设计上就是公开的（见 data/supabase-client.js），权限由 RLS／RPC 限制
    var URL_ = "https://gntnkhkkgonaehapcerr.supabase.co";
    var ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudG5raGtrZ29uYWVoYXBjZXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDc2NTgsImV4cCI6MjEwMDM4MzY1OH0.9_08R--1vQxN6CIRmrbvkVN2O-bSDJgGq6XKgOp5mis";
    fetch(URL_ + "/rest/v1/rpc/increment_tool_uses", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json", apikey: ANON, Authorization: "Bearer " + ANON },
      body: JSON.stringify({ p_slug: slug })
    }).catch(function () {});
  } catch (e) { /* 静默 */ }
})();
