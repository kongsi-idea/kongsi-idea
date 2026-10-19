// 分数与时刻复习加强本 · 老师后台设定（2026-10-19；照 tahun1-mt-fuxi-oktober 的设定改）
// 题库来自工具线上的 bank.js（window.Mt1FuxiPmBank）；成绩表 tahun1_mt_fuxi_pecahan_masa_answers，权限全由数据库 RLS 把关。
// 20 题＝单元 3 分数（A）＋单元 5 时间与时刻（B），每个大题 基础 3／过渡 4／拔高 3。
TEACHER_CONFIGS["tahun1-mt-fuxi-pecahan-masa"] = {
  title: "分数与时刻复习加强本",
  table: "tahun1_mt_fuxi_pecahan_masa_answers",
  bankUrl: "https://tahun1-mt-fuxi-pecahan-masa.vercel.app/bank.js",
  bankGlobal: "Mt1FuxiPmBank",
  csvPrefix: "mt1fuxi-pm",
  ignoreKey: "mt1fuxi-pm-admin-ignore",
  features: { source: true, retry: true, writing: false, merge: true, ignore: true, paper: true, items: true },
  tabs: ["overview", "items", "students", "paper"],
  notCategory: ["other", "blank", "__none"],
  sectionLabel: ["", ""],
  overview: { cards: ["participants", "done", "avg", "avgFinal", "retry"], blocks: ["levels", "units", "hardTags"] },
  units: true,                            // 按 bank.sections[].unit 汇总单元答对率
  // 难度级别与目标答对率区间（同一年级数学复习本）
  levels: [
    { key: "E", name: "基础", lo: 0.90, hi: 1.00 },
    { key: "M", name: "过渡", lo: 0.75, hi: 0.85 },
    { key: "H", name: "拔高", lo: 0.50, hi: 0.65 },
  ],
  // 三档按题数加权（30%／40%／30%）的平均 ≈ 77%：整体平均 > 84% 偏易、< 68% 偏难，之间刚好
  verdict: { mode: "fixed", lo: 0.68, hi: 0.84, note: "目标约 77%，68–84% 算刚好" },
};
