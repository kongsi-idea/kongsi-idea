// 一年级10月华文复习本 · 老师后台设定（取代 fuxi-admin）
// 题库来自工具线上的 bank.js（window.FuxiBank）；成绩表 tahun1_bc_fuxi_okt_answers，权限全由数据库 RLS 把关。
TEACHER_CONFIGS["tahun1-bc-fuxi-oktober"] = {
  title: "一年级10月华文复习本",
  table: "tahun1_bc_fuxi_okt_answers",
  bankUrl: "https://tahun1-bc-fuxi-oktober.vercel.app/bank.js",
  bankGlobal: "FuxiBank",
  csvPrefix: "fuxi-okt",
  answerWrap: true,                       // answer 栏存成 {v: 值}
  features: { source: false, retry: true, writing: true, merge: true, ignore: false, paper: false, items: false },
  tabs: ["overview", "students", "writing"],
  notCategory: ["__none"],                // 不算「同类错误」的 error_tag
  sectionLabel: ["第 ", " 组"],
  overview: { cards: ["participants", "avg", "avgFinal", "retry"], blocks: ["hardTags", "itemBars"], lure: true },
  hooks: {
    // 华文复习本的答案是一个值或多选数组：显示用「、」连起来，归类错答用「＋」
    fmtAnswer(item, v) {
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) return "（空）";
      return Array.isArray(v) ? v.join("、") : String(v);
    },
    ansKey(v) {
      if (Array.isArray(v)) return v.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join("＋");
      return v === undefined || v === null ? "" : String(v);
    },
  },
};
