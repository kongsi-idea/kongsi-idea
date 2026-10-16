// 二年级10月数学练习 · 老师后台设定（取代 latihan2-admin）
// 题库来自工具线上的 bank.js（window.Latihan2Bank）；成绩表 tahun2_mt_latihan_okt_answers，权限全由数据库 RLS 把关。
TEACHER_CONFIGS["tahun2-mt-latihan-oktober"] = {
  title: "二年级10月数学练习",
  table: "tahun2_mt_latihan_okt_answers",
  bankUrl: "https://tahun2-mt-latihan-oktober.vercel.app/bank.js",
  bankGlobal: "Latihan2Bank",
  rmPrefix: true,                         // 金额显示成「RM 12」（一年级练习本沿用「12 RM」）
  csvPrefix: "latihan2-okt",
  ignoreKey: "latihan2-admin-ignore",                     // localStorage 键前缀（沿用旧后台，已忽略的名字不会丢）
  features: { source: true, retry: true, writing: false, merge: true, ignore: true, paper: true, items: true },
  tabs: ["overview", "items", "students", "paper"],
  notCategory: ["other", "blank", "__none"],
  sectionLabel: ["", ""],
  overview: { cards: ["participants", "done", "avg", "avgFinal", "retry"], blocks: ["sections", "hardTags"] },
};
