// DSKP 结构化索引（阶段 A，见 docs/dskp-learning-objective-search.md 第 1.2 节 schema）
// 浏览器直接读取的权威来源：单元树、搜索建议、URL 校验、工具资料验证都从这里来，
// 不在浏览器解析 docs/dskp/*.md 的散文摘要。
//
// ⚠️ 目前收了「Tahun 2 数学 · 4.0 钱币」「Tahun 1 数学 · 1.0 100以内整数（1.8 近似值）」两笔，
// 其余科目/年级都还没有结构化索引——按 docs/dskp-learning-objective-search.md 阶段A的原则
// 「先从真的做出来、真的核对过的工具开始」，不为了凑数据而编造其他单元。
//
// ✅ title_bm 已核对官方 DSKP 原文用词（查证日期 2026-07-21，详细比对过程见
// docs/dskp-bm-glossary-mt-sains.md）。核对时发现一个重要前提：Matematik/Sains 的
// SJK(C) 版官方 PDF 全文本身是中文（无马来文单元/目标标题），所以本档 title_bm 的
// 马来文措辞实际来源是「SK（国小）版」DSKP PDF——SK 版与 SJK(C) 版共用同一套单元代码
// 结构（如 4.0/4.1/4.2），可以放心按代码对应抄录马来文原文用词。
// Tahun 2 单元 4.0（Wang/Wang kertas dan duit syiling/Tambah wang/Tolak wang/
// Simpanan dan pelaburan）核对结果：与原本的工作翻译逐字吻合，未做任何改字。
// Tahun 1 单元 1.8 的 title_bm/terms 之前已用 WebSearch 查证「Membundarkan nombor」
// 「puluh terdekat」，本次用完整 SK 版 PDF 再次确认一致。
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
      {
        code: "1.0",
        title_zh: "数与运算——1000以内的整数",
        title_bm: "Nombor Bulat hingga 1000",
        objectives: [
          {
            // 官方原文 Menentukan nilai tempat bagi sebarang nombor，用 WebSearch 查证
            code: "1.4",
            title_zh: "数位：讲述数位与数值、依数位数值分析数目",
            title_bm: "Menentukan nilai tempat bagi sebarang nombor",
            terms: ["数位", "数值", "nilai tempat", "nilai digit"],
          },
          {
            // 官方原文 Pola nombor，用 WebSearch 查证
            code: "1.7",
            title_zh: "有规律的数列：确认规律、完成简易规律数列",
            title_bm: "Pola nombor",
            terms: ["数列", "规律", "pola nombor", "turutan nombor"],
          },
        ],
      },
      {
        code: "2.0",
        title_zh: "数与运算——基本运算",
        title_bm: "Operasi Asas",
        objectives: [
          {
            // 官方原文 Darab dalam lingkungan 1000 / fakta asas pendaraban，用 WebSearch 查证
            code: "2.3",
            title_zh: "乘法：基本乘法（一位数×一位数）、一位数×10",
            title_bm: "Darab dalam lingkungan 1000",
            terms: ["乘法", "乘法表", "口诀", "darab", "pendaraban", "sifir"],
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
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 4,
    subjek: "mt",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3-1/154-dskp-kssr-semakan-2017-matematik-tahun-4-sjkc/file",
    sourceLabel: "DSKP Matematik Tahun 4 SJK(C)",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "1.0",
        title_zh: "数与运算——整数与运算",
        title_bm: "Nombor Bulat dan Operasi Asas",
        objectives: [
          {
            // 官方原文 1.1.1 讲述数目 + 1.1.2 确定数值（数位/数值/比较/排序/数列）
            // 两条学习标准合并成一笔，因为「数学知识大比拼」的读数/数位/数值/比大小/数列
            // 五种题型正好对应这两条学习标准，没有拆分成更细的必要（用 WebSearch 查证官方原文用词）
            code: "1.1",
            title_zh: "数值：讲述100000以内数目、确定数位与数值、比较排序、完成数列",
            title_bm: "Nilai Nombor",
            terms: ["数值", "数位", "读数", "比大小", "数列", "nilai nombor", "menyatakan nombor", "menentukan nilai nombor"],
          },
        ],
      },
    ],
  },
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 1,
    subjek: "bc",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-1/28-03-dskp-kssr-tahun-1-bahasa-cina-sjkc-08122016/file",
    sourceLabel: "DSKP Bahasa Cina Tahun 1 SJK(C)",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "2.0",
        title_zh: "阅读技能",
        // ⚠️ 这个 title_bm 是工作翻译，没有核对过官方 PDF 原文马来文措辞（试过下载官方PDF核对，
        // 连结重导向失败，没有强行用其他来源凑数）——跟 Tahun2数学/Tahun1数学/Tahun4数学
        // 那几笔「已用WebSearch/PDF查证」的记录不是同一个可信度级别，如果之后要正式对外展示
        // 这个马来文标题，要回头找到能打开的官方PDF或可靠转载源核对
        title_bm: "Kemahiran Membaca",
        objectives: [
          {
            code: "2.1",
            title_zh: "阅读与理解教材：认识教材中汉字，掌握词语，理解句子段落篇章内容",
            title_bm: "Membaca dan memahami bahan pengajaran",
            terms: ["识字", "写字", "词语", "认读", "aksara", "mengecam aksara"],
          },
        ],
      },
      {
        code: "5.0",
        title_zh: "语文基础知识",
        // ⚠️ 同上，工作翻译未核对官方原文
        title_bm: "Pengetahuan Asas Bahasa",
        objectives: [
          {
            code: "5.1",
            title_zh: "掌握汉字基本知识：认识笔画/部首/偏旁和结构，掌握笔顺规则",
            title_bm: "Menguasai pengetahuan asas aksara",
            terms: ["部首", "偏旁", "笔画", "笔顺", "radikal"],
          },
        ],
      },
      {
        code: "3.0",
        title_zh: "书写技能",
        // ⚠️ 同上，工作翻译未核对官方原文
        title_bm: "Kemahiran Menulis",
        objectives: [
          {
            code: "3.2",
            title_zh: "培养书面表达能力：练习写话，初步尝试书面表达，不拘形式写自己想说的话",
            title_bm: "Memupuk kemahiran penulisan berformat bebas",
            terms: ["写话", "造句", "语序", "penulisan"],
          },
        ],
      },
    ],
  },
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 1,
    subjek: "bm",
    sourceUrl: "https://jpnpp.moe.gov.my/muat-turun/sektor/sektor-pembelajaran/bahasa/bahasa-melayu/sjk-1/256-dskp-bahasa-melayu-sjk-tahun-1/file",
    sourceLabel: "DSKP Bahasa Melayu SJK Tahun 1",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "2.0",
        title_zh: "阅读技能",
        title_bm: "Kemahiran Membaca",
        objectives: [
          {
            // 官方原文 2.1.1「以正确发音语调朗读音节/词语/句子」，用 WebSearch 查证
            code: "2.1",
            title_zh: "基础阅读与理解：以正确发音语调朗读音节/词语/句子",
            title_bm: "Asas membaca dan memahami",
            terms: ["音节", "拼音", "KVKV", "suku kata", "perkataan", "membaca"],
          },
        ],
      },
    ],
  },
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 3,
    subjek: "bc",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3/105-003-dskp-kssr-semakan-2017-bahasa-cina-tahun-3/file",
    sourceLabel: "DSKP Bahasa Cina Tahun 3 SJK(C)",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "2.0",
        title_zh: "阅读技能",
        // ⚠️ 工作翻译，未核对官方原文（沿用 Tahun1 同单元已知的标准写法，KSSR各年级同一单元代码
        // 通常沿用相同的马来文名称，但没有逐一核对 Tahun3 官方 PDF）
        title_bm: "Kemahiran Membaca",
        objectives: [
          {
            code: "2.1",
            title_zh: "阅读与理解教材：借助字典认识汉字，掌握词语，理解句段篇内容；阅读教材培养语感，体验情感，领会教育意义",
            title_bm: "Membaca dan memahami bahan pengajaran",
            terms: ["课文理解", "阅读", "语感", "membaca"],
          },
        ],
      },
    ],
  },
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 1,
    // ⚠️ 科目代码用 "dst"（跟 app.js SUBJECTS 现有分类一致：Tahun1-3 归为「科学与科技世界」），
    // 但这次查证官方 PDF 时发现文件本身标题是《Sains SJK(C) Tahun 1》，不是「Dunia Sains dan
    // Teknologi」——docs/subjek-tahun.md 自己也标注过这个不确定性（未找到官方文件明确写
    // "Tahun1-3统称DST"这个说法）。这次沿用现有平台分类不引发混乱，但这个 dst/sains 该怎么分
    // 界，之后有空应该回头核对 BPK 官网 Tahun2/3 页面的 DSKP 文件名称再确认一次。
    subjek: "dst",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-1/32-08-dskp-kssr-tahun-1-sains-06122016/file",
    sourceLabel: "DSKP Sains Tahun 1 SJK(C)",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "7.1",
        title_zh: "磁铁",
        title_bm: "Magnet",
        objectives: [
          {
            code: "7.1.1",
            title_zh: "举例磁铁在生活中的用途",
            title_bm: "Memberi contoh kegunaan magnet dalam kehidupan",
            terms: ["磁铁用途", "kegunaan magnet"],
          },
          {
            code: "7.1.2",
            title_zh: "确认磁铁形状：条形/棒形/马蹄形/U形/钮扣形/环形",
            title_bm: "Mengenal pasti bentuk magnet",
            terms: ["磁铁形状", "bentuk magnet"],
          },
          {
            code: "7.1.3",
            title_zh: "概括磁铁对各种物体的作用（通过活动验证哪些物体会被磁铁吸引）",
            title_bm: "Mengitlak tindakan magnet ke atas pelbagai objek",
            terms: ["磁铁吸引", "tarikan magnet"],
          },
          {
            code: "7.1.4",
            title_zh: "通过探究得出磁极相吸相斥的结论",
            title_bm: "Membuat kesimpulan tentang daya tarikan dan tolakan antara kutub magnet",
            terms: ["磁极", "相吸相斥", "kutub magnet", "tolakan"],
          },
        ],
      },
    ],
  },
];
