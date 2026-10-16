// 一年级数学复习本 · 老师后台设定（取代 mt1fuxi-admin；老师 10-16 定 40/20/40，按上一份一年级练习校准）
// 题库来自工具线上的 bank.js（window.Mt1FuxiBank）；成绩表 tahun1_mt_fuxi_okt_answers，权限全由数据库 RLS 把关。
TEACHER_CONFIGS["tahun1-mt-fuxi-oktober"] = {
  title: "一年级数学复习本",
  table: "tahun1_mt_fuxi_okt_answers",
  bankUrl: "https://tahun1-mt-fuxi-oktober.vercel.app/bank.js",
  bankGlobal: "Mt1FuxiBank",
  rmPrefix: true,                         // 金额显示成「RM 12」（一年级练习本沿用「12 RM」）
  csvPrefix: "mt1fuxi-okt",
  ignoreKey: "mt1fuxi-admin-ignore",
  features: { source: true, retry: true, writing: false, merge: true, ignore: true, paper: true, items: true },
  tabs: ["overview", "items", "students", "paper"],
  notCategory: ["other", "blank", "__none"],
  sectionLabel: ["", ""],
  overview: { cards: ["participants", "done", "avg", "avgFinal", "retry"], blocks: ["levels", "units", "hardTags"] },
  units: true,                            // 按 bank.sections[].unit 汇总单元答对率
  // 难度级别与目标答对率区间
  levels: [                               // 基础没有上限（≥ 90% 都算达标），上限取 100%
    { key: "E", name: "基础", lo: 0.90, hi: 1.00 },
    { key: "M", name: "过渡", lo: 0.75, hi: 0.85 },
    { key: "H", name: "拔高", lo: 0.50, hi: 0.65 },
  ],
  // 三档按题数加权的平均 ≈ 76%：整体平均 > 84% 偏易、< 68% 偏难，之间刚好
  verdict: { mode: "fixed", lo: 0.68, hi: 0.84, note: "目标约 76%，68–84% 算刚好" },
  paper: { cellRange: (e) => [0, e.max ?? e.parts ?? 10] },   // 「涂了几格」下拉：从 0 到 max（没有就 parts）
};
