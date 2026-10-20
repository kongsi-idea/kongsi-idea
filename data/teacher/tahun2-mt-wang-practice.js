// 零用钱跑腿日 · 老师后台设定（2026-10-21；源自 teaching-tools/tahun2-mt-wang-practice/teacher-config.draft.js，bank 3.0：路线、看清单拿东西、乱买、结局）
// 题库来自工具线上的 bank.js（window.Mt2WangBank）；成绩表 tahun2_mt_wang_practice_answers，权限全由数据库 RLS 把关。
// 33 道计分题（三天）＋ 3 笔理财记录（dN-money，graded:false，用 features.writing 把它们当「不计分」，显示在「写作题」分页）。
// 学生端送出的 answer：number {v,t[,w]}、left {v,before,cost,t[,w]}、change {v,paid,cost,t[,w]}、multi {n,left,before,t[,w]}、make {notes,t[,w]}（v1.2 起；之前的没有 before／cost）；
//   答案本身（v／n、left／notes／paid）＝第一次作答的答案，is_correct、error_tag 就是用它判的；t＝试了几次才对。
TEACHER_CONFIGS["tahun2-mt-wang-practice"] = {
  title: "零用钱跑腿日",
  table: "tahun2_mt_wang_practice_answers",
  bankUrl: "https://tahun2-mt-wang-practice.vercel.app/bank.js",
  bankGlobal: "Mt2WangBank",
  csvPrefix: "mt2wang",
  ignoreKey: "mt2wang-admin-ignore",
  features: { source: false, retry: true, writing: true, merge: true, ignore: true, paper: false, items: true },
  tabs: ["overview", "items", "students", "writing"],
  notCategory: ["other", "blank", "__none"],
  sectionLabel: ["第 ", " 天"],
  overview: { cards: ["participants", "done", "avg", "avgFinal", "retry"], blocks: ["levels", "units", "hardTags"] },
  units: true,
  levels: [
    { key: "E", name: "基础", lo: 0.90, hi: 1.00 },
    { key: "M", name: "过渡", lo: 0.75, hi: 0.85 },
    { key: "H", name: "拔高", lo: 0.50, hi: 0.65 },
  ],
  verdict: { mode: "fixed", lo: 0.68, hi: 0.84, note: "目标约 77%，68–84% 算刚好" },
  hooks: {
    // ans 可能是：标准答案（数字、字串「付的钱 − RM28」、{n,left}）、学生答案对象（带 t、w）、理财记录
    fmtAnswer(item, ans) {
      const B = window.Mt2WangBank, fm = (v) => B.fmtMoney(v, { sen: true }).replace(/\.00$/, "");
      const rm = (v) => { const r = B.fmtMoney(v); return /^RM/.test(r) ? r : fm(v); };
      if (ans === undefined || ans === null || ans === "") return "（空）";
      if (typeof ans === "string") return ans;
      if (item.kind === "money") {
        const bought = (ans.bought || []).map((b) => B.goods[b.g] + " " + rm(b.p)).join("、");
        const carry = ans.carryIn ? `接着前一天：扑满 ${rm(ans.carryIn.piggy)}、钱包 ${rm((ans.carryIn.purse || []).reduce((a, b) => a + b, 0))}；` : "";
        const bg = ans.boughtGoal && ans.boughtGoal.length ? `买了：${ans.boughtGoal.map((g) => B.goods[g]).join("、")}；` : "";
        const ex = ans.extras && ans.extras.length ? `多买：${ans.extras.map((e) => B.goods[e.g] + (e.n > 1 ? "×" + e.n : "") + " " + rm(e.p * e.n)).join("、")}${ans.fruitShort ? `（水果少 ${ans.fruitShort} 个）` : ""}；` : "";
        const rt = ans.route && ans.route.length ? `路线：${ans.route.map((k) => ({ grocery: "杂货店", bakery: "面包店", stationery: "文具店", toy: "玩具店", fruit: "水果摊" }[k])).join("→")}${ans.planTries ? `（排了 ${ans.planTries} 次）` : ""}；` : "";
        const fb = ans.finaleBought && ans.finaleBought.length ? `结局买了：${ans.finaleBought.map((g) => B.goods[g]).join("、")}；` : "";
        return `${rt}${carry}${bg}${fb}${ex}先存 ${rm(ans.saveFirst || 0)}；${bought ? "买了" + bought : "没买东西"}；共存 ${rm(ans.saved || 0)}；扑满 ${rm(ans.piggy || 0)}，${ans.reached ? "达成目标" : "没达成目标"}`;
      }
      const a = ans;
      if (item.kind === "goal") return typeof a === "object" ? `${rm(a.v)}（扑满 ${rm(a.piggy)}，目标 ${rm(a.price)}）` : rm(a);
      if (item.kind === "left") return typeof a === "object" ? (a.before !== undefined ? `${rm(a.v)}（本来 ${rm(a.before)}，用掉 ${rm(a.cost)}）` : rm(a.v)) : rm(a);   // v1.1 以前送的只有 {v,t}
      if (item.kind === "change") {
        const v = typeof a === "object" ? a.v : a, paid = ans.paid;
        return paid !== undefined ? `${rm(v)}（付了 ${rm(paid)}，应付 ${rm(ans.cost !== undefined ? ans.cost : item.cost)}）` : rm(v);
      }
      if (item.kind === "multi") return a.before !== undefined ? `${a.n} 个，剩 ${rm(a.left)}（钱包 ${rm(a.before)}）` : `${a.n} 个，剩 ${rm(a.left)}`;
      if (item.kind === "make") {
        const notes = Array.isArray(a) ? a : a.notes;
        return typeof a === "number" ? rm(a) : "拿了 " + (notes || []).map((n) => rm(n).replace(/^RM0\./, "") ).join("、");
      }
      if (typeof a === "number") return rm(a);
      return a && a.v !== undefined ? rm(a.v) : JSON.stringify(a);
    },
    // 同样的错答归成一类（change 要连 paid 一起看）
    ansKey(a) {
      if (a === undefined || a === null) return "";
      if (typeof a !== "object") return String(a);
      const x = Object.assign({}, a); delete x.t;                      // t（试了几次）不算在答案里
      return JSON.stringify(Object.keys(x).sort().map((k) => [k, x[k]]));
    },
  },
};
