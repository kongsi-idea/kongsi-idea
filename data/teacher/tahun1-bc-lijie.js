// 答案藏在哪里？· 老师后台设定（2026-10-22；照 tahun1-bc-fuxi-oktober-2 的设定改）
// 题库来自工具线上的 bank.js（window.LijieBank）；成绩表 tahun1_bc_lijie_answers，权限全由数据库 RLS 把关。
// 只收「考一考」10 题；attempt_no＝第几次考，分析以第 1 次为准。
TEACHER_CONFIGS["tahun1-bc-lijie"] = {
  title: "答案藏在哪里？· 考一考",
  table: "tahun1_bc_lijie_answers",
  bankUrl: "https://tahun1-bc-lijie.vercel.app/bank.js",
  bankGlobal: "LijieBank",
  csvPrefix: "lijie",
  answerWrap: true,                       // answer 栏存成 {v: 值}
  features: { source: false, retry: true, writing: false, merge: true, ignore: false, paper: false, items: false },
  tabs: ["overview", "students"],
  notCategory: ["__none"],
  sectionLabel: ["", ""],
  overview: { cards: ["participants", "avg", "avgFinal", "retry"], blocks: ["hardTags", "itemBars"], lure: true },
};
