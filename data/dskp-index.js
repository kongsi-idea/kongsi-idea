// DSKP 结构化索引（阶段 A，见 docs/dskp-learning-objective-search.md 第 1.2 节 schema）
// 浏览器直接读取的权威来源：单元树、搜索建议、URL 校验、工具资料验证都从这里来，
// 不在浏览器解析 docs/dskp/*.md 的散文摘要。
//
// ⚠️ 目前收了「Tahun 2 数学 · 4.0 钱币」「Tahun 1 数学 · 1.0 100以内整数（1.8 近似值）」两笔，
// 其余科目/年级都还没有结构化索引——按 docs/dskp-learning-objective-search.md 阶段A的原则
// 「先从真的做出来、真的核对过的工具开始」，不为了凑数据而编造其他单元。
//
// ⚠️ title_bm 是根据 docs/dskp/{tahun}/matematik.md（中文摘要）回译的工作翻译，
// 不是逐字核对官方 PDF 原文的马来文——如果之后要在正式发布前用来对外展示马来文标题，
// 需要回头核对 https://bpk.moe.gov.my 的官方 DSKP 原文用词。
// 例外：Tahun 1 单元 1.8 的 title_bm/terms 已用 WebSearch 查证官方原文用词
// 「Membundarkan nombor」「puluh terdekat」，不是回译猜测（查证日期 2026-07-21）。
const DSKP_INDEX = [
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 2,
    subjek: "mt",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-2/90-43-dskp-kssr-semakan-2017-matematik-tahun-2-sjkc/file",
    sourceLabel: "DSKP Matematik Tahun 2 SJK(C)",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "4.0",
        title_zh: "钱币",
        title_bm: "Wang",
        objectives: [
          {
            code: "4.1",
            title_zh: "纸币和硬币",
            title_bm: "Wang kertas dan duit syiling",
            terms: ["纸币", "硬币", "确认币值", "认识币值", "nilai wang", "wang kertas", "duit syiling"],
          },
          {
            code: "4.2",
            title_zh: "钱币加法",
            title_bm: "Tambah wang",
            terms: ["钱币加法", "加钱", "tambah wang", "operasi tambah wang"],
          },
          {
            code: "4.3",
            title_zh: "钱币减法",
            title_bm: "Tolak wang",
            terms: ["钱币减法", "找零钱", "找钱", "tolak wang", "baki wang", "wang baki"],
          },
          {
            code: "4.6",
            title_zh: "储蓄与投资",
            title_bm: "Simpanan dan pelaburan",
            terms: ["储蓄", "理财教育", "simpanan", "pelaburan"],
          },
        ],
      },
    ],
  },
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 1,
    subjek: "mt",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-1/52-41-dskp-kssr-semakan-2017-matematik-tahun-1-sjkc/file",
    sourceLabel: "DSKP Matematik Tahun 1 SJK(C)",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "1.0",
        title_zh: "数与运算——100以内的整数",
        title_bm: "Nombor dan Operasi — Nombor Bulat hingga 100",
        objectives: [
          {
            code: "1.8",
            title_zh: "近似值：找出整数的十位近似值",
            title_bm: "Membundarkan nombor bulat kepada puluh terdekat",
            terms: ["近似值", "十位近似值", "取整", "membundarkan nombor", "pembundaran", "puluh terdekat", "bundar"],
          },
        ],
      },
    ],
  },
];
