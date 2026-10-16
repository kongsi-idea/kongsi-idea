// 二年级数学复习本 · 老师后台设定（取代 mtfuxi-admin；老师 10-14 定难度目标）
// 题库来自工具线上的 bank.js（window.MtFuxiBank）；成绩表 tahun2_mt_fuxi_okt_answers，权限全由数据库 RLS 把关。
TEACHER_CONFIGS["tahun2-mt-fuxi-oktober"] = {
  title: "二年级数学复习本",
  table: "tahun2_mt_fuxi_okt_answers",
  bankUrl: "https://tahun2-mt-fuxi-oktober.vercel.app/bank.js",
  bankGlobal: "MtFuxiBank",
  rmPrefix: true,                         // 金额显示成「RM 12」（一年级练习本沿用「12 RM」）
  csvPrefix: "mtfuxi-okt",
  ignoreKey: "mtfuxi-admin-ignore",
  features: { source: true, retry: true, writing: false, merge: true, ignore: true, paper: true, items: true },
  tabs: ["overview", "items", "students", "paper"],
  notCategory: ["other", "blank", "__none"],
  sectionLabel: ["", ""],
  overview: { cards: ["participants", "done", "avg", "avgFinal", "retry"], blocks: ["levels", "units", "hardTags"] },
  units: true,                            // 按 bank.sections[].unit 汇总单元答对率
  // 难度级别与目标答对率区间
  levels: [
    { key: "E", name: "易", lo: 0.85, hi: 0.95 },
    { key: "M", name: "中", lo: 0.60, hi: 0.75 },
    { key: "H", name: "难", lo: 0.30, hi: 0.50 },
  ],
  verdict: { mode: "weighted" },          // 偏易／刚好／偏难：按各级别题数加权的目标区间来比
  // 纸本回填的「涂了几格」下拉范围用默认（bank 的 min～max，没写就 0～10）
};
