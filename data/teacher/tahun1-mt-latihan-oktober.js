// 一年级10月数学练习 · 老师后台设定（取代 latihan-admin；第一份后台，没有重试后成绩、没有题目分析分页）
// 题库来自工具线上的 bank.js（window.LatihanBank）；成绩表 tahun1_mt_latihan_okt_answers，权限全由数据库 RLS 把关。
TEACHER_CONFIGS["tahun1-mt-latihan-oktober"] = {
  title: "一年级10月数学练习",
  table: "tahun1_mt_latihan_okt_answers",
  bankUrl: "https://tahun1-mt-latihan-oktober.vercel.app/bank.js",
  bankGlobal: "LatihanBank",
  csvPrefix: "latihan-okt",
  ignoreKey: "latihan-admin-ignore",                     // localStorage 键前缀（沿用旧后台，已忽略的名字不会丢）
  features: { source: true, retry: false, writing: false, merge: true, ignore: true, paper: true, items: false },
  tabs: ["overview", "students", "paper"],
  notCategory: ["__none"],
  sectionLabel: ["第 ", " 大题"],
  overview: { cards: ["participants", "avg", "scope"], blocks: ["hardTags", "itemBars"] },
};
