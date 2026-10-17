// DSKP 结构化索引（阶段 A，见 docs/dskp-learning-objective-search.md 第 1.2 节 schema）
// 浏览器直接读取的权威来源：单元树、搜索建议、URL 校验、工具资料验证都从这里来，
// 不在浏览器解析 docs/dskp/*.md 的散文摘要。
//
// 【主题 topic】2026-10-17 起，节点可带 topic: { zh, bm }（Hub 整理 P2，见 docs/hub-reorg-2026-10.md 第 2 节）：
//   数学／科学／AM／音乐／体育等内容科标在 unit 层（个别 unit 内含多个不同主题的工具时，另在 objective 层细分，objective.topic 优先）；
//   语文（bc／bm／bi）标在 objective 层（bi 的 bm 栏放英文原文）。同一内容跨年级必须用同一个 zh 词（Hub 靠它把不同年级连起来）。
//   只给工具实际用到的节点标。工具的主题 = topicOverride ‖ 第一条 standards 对应的 objective.topic ‖ unit.topic ‖ null。
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
        topic: { zh: "钱币", bm: "Wang" },
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
        topic: { zh: "整数", bm: "Nombor Bulat" },
        objectives: [
          {
            // 官方原文 Menentukan nilai tempat bagi sebarang nombor，用 WebSearch 查证
            code: "1.4",
            title_zh: "数位：讲述数位与数值、依数位数值分析数目",
            title_bm: "Menentukan nilai tempat bagi sebarang nombor",
            topic: { zh: "数值", bm: "Nilai Nombor" }, // 与 Tahun 4 的 1.1 同一个词
            terms: ["数位", "数值", "nilai tempat", "nilai digit"],
          },
          {
            // 官方原文 Pola nombor，用 WebSearch 查证
            code: "1.7",
            title_zh: "有规律的数列：确认规律、完成简易规律数列",
            title_bm: "Pola nombor",
            topic: { zh: "数列", bm: "Pola Nombor" },
            terms: ["数列", "规律", "pola nombor", "turutan nombor"],
          },
        ],
      },
      {
        code: "2.0",
        title_zh: "数与运算——基本运算",
        title_bm: "Operasi Asas",
        topic: { zh: "基本运算", bm: "Operasi Asas" },
        objectives: [
          {
            // 官方原文 Darab dalam lingkungan 1000 / fakta asas pendaraban，用 WebSearch 查证
            code: "2.3",
            title_zh: "乘法：基本乘法（一位数×一位数）、一位数×10",
            title_bm: "Darab dalam lingkungan 1000",
            topic: { zh: "乘法", bm: "Darab" },
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
        topic: { zh: "整数", bm: "Nombor Bulat" },
        objectives: [
          {
            code: "1.8",
            title_zh: "近似值：找出整数的十位近似值",
            title_bm: "Membundarkan nombor bulat kepada puluh terdekat",
            topic: { zh: "近似值", bm: "Membundarkan Nombor" },
            terms: ["近似值", "十位近似值", "取整", "membundarkan nombor", "pembundaran", "puluh terdekat", "bundar"],
          },
        ],
      },
      {
        // 马来文用词照 docs/dskp-bm-glossary-mt-sains.md（已核对官方 DSKP）
        code: "3.0",
        title_zh: "数与运算——分数",
        title_bm: "Pecahan",
        topic: { zh: "分数", bm: "Pecahan" },
        objectives: [
          {
            code: "3.1",
            title_zh: "二等份和四等份的真分数概念（1/2、1/4、2/4、3/4）",
            title_bm: "Konsep perdua dan perempat pecahan wajar",
            terms: ["分数", "几分之几", "二分之一", "四分之一", "四分之三", "等分", "一半", "pecahan", "perdua", "perempat", "pecahan wajar", "separuh", "suku"],
          },
          {
            code: "3.2",
            title_zh: "解决问题：分数相关日常应用题",
            title_bm: "Penyelesaian masalah",
            terms: ["分数应用题", "分东西", "penyelesaian masalah pecahan"],
          },
        ],
      },
      {
        // 2026-10-17 补（时刻大对决 tahun1-mt-masa）：依资料库 KSSR2017/Matematik/SJKC/TAHUN1.md「5.0 时间与时刻」与 SK/TAHUN1.md「5.0 MASA DAN WAKTU」
        // （截取档「没有审核」，马来文照 SK 版原文）。只收 5.2 钟面（5.2.1–5.2.3），5.1 天和月份、5.3 解决问题未覆盖。
        code: "5.0",
        title_zh: "测量与几何——时间与时刻",
        title_bm: "Masa dan Waktu",
        topic: { zh: "时间与时刻", bm: "Masa dan Waktu" },
        objectives: [
          {
            code: "5.2",
            title_zh: "钟面：确认时针和分针；确认并讲述分针所指的「半」「一刻」「三刻」；使用模拟钟讲出及写出「时」「一刻」「半小时」「三刻」",
            title_bm: "Muka jam: 5.2.1 Mengenal pasti jarum jam pada muka jam; 5.2.2 Mengenal pasti dan menyatakan 'setengah', 'satu perempat' dan 'tiga perempat' berdasarkan muka jam; 5.2.3 Menyebut dan menulis waktu dalam jam, setengah dan satu perempat jam sahaja dengan menggunakan jam analog",
            terms: ["钟面", "时针", "分针", "整时", "半", "一刻", "三刻", "拨钟", "muka jam", "jarum jam", "setengah", "satu perempat", "tiga perempat", "jam analog"],
          },
        ],
      },
      {
        // 2026-10-17 补（空间小天地 tahun1-mt-ruang）：依资料库 KSSR2017/Matematik/SJKC/TAHUN1.md「7.0 空间」与 SK/TAHUN1.md「7.0 RUANG」
        // （截取档「没有审核」，马来文照 SK 版原文）。收 7.1 立体图形、7.2 平面图形；7.3 解决问题未单列。
        code: "7.0",
        title_zh: "测量与几何——空间",
        title_bm: "Ruang",
        topic: { zh: "空间", bm: "Ruang" },
        objectives: [
          {
            code: "7.1",
            title_zh: "立体图形：说出长方体、正方体、圆锥体、正方棱锥体、圆柱体和球体的名称；解说面、边和顶点；根据规律排列物体；综合各种立体制作新模型",
            title_bm: "Bentuk tiga dimensi: 7.1.1 Menamakan bentuk kuboid, kubus, kon, piramid tapak segiempat sama, silinder dan sfera; 7.1.2 Memperihalkan permukaan, sisi dan bucu bagi bentuk tiga dimensi; 7.1.3 Menyusun objek mengikut pola; 7.1.4 Menghasilkan bentuk baru dari gabungan bentuk tiga dimensi",
            terms: ["立体图形", "长方体", "正方体", "圆锥体", "正方棱锥体", "圆柱体", "球体", "面", "边", "顶点", "kuboid", "kubus", "kon", "piramid", "silinder", "sfera", "permukaan", "sisi", "bucu", "bentuk tiga dimensi"],
          },
          {
            code: "7.2",
            title_zh: "平面图形：说出正方形、长方形、三角形和圆的名称；解说直线、边、角和曲线；根据规律排列；以平面图形创作图案",
            title_bm: "Bentuk dua dimensi: 7.2.1 Menamakan bentuk segiempat sama, segiempat tepat, segitiga dan bulatan; 7.2.2 Memperihalkan garis lurus, sisi, bucu dan lengkung bagi bentuk dua dimensi; 7.2.3 Menyusun bentuk dua dimensi mengikut pola; 7.2.4 Menghasilkan corak berasaskan bentuk dua dimensi",
            terms: ["平面图形", "正方形", "长方形", "三角形", "圆", "直线", "曲线", "图案", "segiempat sama", "segiempat tepat", "segitiga", "bulatan", "garis lurus", "lengkung", "bentuk dua dimensi"],
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
        topic: { zh: "整数", bm: "Nombor Bulat" },
        objectives: [
          {
            // 官方原文 1.1.1 讲述数目 + 1.1.2 确定数值（数位/数值/比较/排序/数列）
            // 两条学习标准合并成一笔，因为「数学知识大比拼」的读数/数位/数值/比大小/数列
            // 五种题型正好对应这两条学习标准，没有拆分成更细的必要（用 WebSearch 查证官方原文用词）
            code: "1.1",
            title_zh: "数值：讲述100000以内数目、确定数位与数值、比较排序、完成数列",
            title_bm: "Nilai Nombor",
            topic: { zh: "数值", bm: "Nilai Nombor" }, // 与 Tahun 2 的 1.4 同一个词
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
            topic: { zh: "识字", bm: "Mengecam Aksara" },
            terms: ["识字", "写字", "词语", "认读", "阅读理解", "词语运用", "选词填空", "aksara", "mengecam aksara"],
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
            topic: { zh: "部首", bm: "Radikal" },
            terms: ["部首", "偏旁", "笔画", "笔顺", "radikal"],
          },
          {
            // 官方原文见 docs/dskp/tahun1/bahasa-cina.md：「5.3 认识各类词语｜5.3.1 认识量词和
            // 近似字、多音字，辨析理解词义」。5.3 是内容标准，5.3.1 才是真正的学习标准，code 必须
            // 用 5.3.1，不能用内容标准代替，否则工具的 standards.objectiveCodes 对不上这里。
            // title_bm 是工作翻译（"penjodoh bilangan" 是马来文语言学通用术语，量词/类别词的标准
            // 译法），未核对官方 PDF 逐字马来文措辞
            code: "5.3.1",
            title_zh: "认识量词和近似字、多音字，辨析理解词义",
            title_bm: "Mengenal pelbagai jenis perkataan (penjodoh bilangan, kata hampir sama, kata pelbagai bunyi)",
            topic: { zh: "量词", bm: "Penjodoh Bilangan" }, // 同一条里的「近似字」工具（tahun1-bc-xingsi）用 topicOverride
            terms: ["量词", "认识量词", "近似字", "形近字", "多音字", "读音", "penjodoh bilangan"],
          },
          {
            // 2026-10-17 补：官方原文见 docs/dskp/tahun1/bahasa-cina.md「5.4 认识不同类型的句子｜5.4.1 认识陈述、疑问、祈使、感叹等句子功能」。
            // 原先 tahun1-bc-juxing 的 standards 写成 unitCode "5.4"（对不到记录），已改为 unitCode "5.0" + 本条 5.4.1。
            // title_bm 是工作翻译，未核对官方 PDF 逐字马来文措辞
            code: "5.4.1",
            title_zh: "认识陈述、疑问、祈使、感叹等句子功能",
            title_bm: "Mengenal fungsi ayat penyata, tanya, perintah dan seruan",
            topic: { zh: "句型", bm: "Jenis Ayat" },
            terms: ["句型", "句子功能", "陈述句", "疑问句", "祈使句", "感叹句", "ayat penyata", "ayat tanya", "ayat perintah", "ayat seruan"],
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
            // 2026-10-17 补：官方原文见 docs/dskp/tahun1/bahasa-cina.md「3.1 应用铅笔写字｜3.1.1 在田字格上书写基本笔画和正楷，执笔运笔正确，坐姿端正，笔画笔顺正确」。
            // title_bm 是工作翻译，未核对官方 PDF 逐字马来文措辞
            code: "3.1",
            title_zh: "应用铅笔写字：在田字格上书写基本笔画和正楷，执笔运笔正确，坐姿端正，笔画笔顺正确",
            title_bm: "Menulis aksara dengan pensel (strok asas dan tulisan kai dalam kotak tian zi)",
            topic: { zh: "写字", bm: "Menulis Aksara" },
            terms: ["写字", "笔顺", "笔画", "田字格", "描红", "习写", "menulis aksara", "strok"],
          },
          {
            code: "3.2",
            title_zh: "培养书面表达能力：练习写话，初步尝试书面表达，不拘形式写自己想说的话",
            title_bm: "Memupuk kemahiran penulisan berformat bebas",
            topic: { zh: "写话", bm: "Tulis Ayat" },
            terms: ["写话", "看图写话", "造句", "仿写", "语序", "penulisan"],
          },
        ],
      },
    ],
  },
  {
    // 2026-10-10 改依资料库 KSSR2015 原版截取档（~/Documents/资料库/DSKP资料/KSSR2015/Bahasa-Melayu/SJK/TAHUN1.md）。
    // 原先写的 Semakan 2017 与该档不符（资料库无 2017 版马来文）。截取档头部注明「没有审核」，故 reviewed: false（页面不显示，仅供程序区分状态）。
    curriculum: "KSSR 2015（原版）",
    tahun: 1,
    subjek: "bm",
    sourceUrl: "",
    sourceLabel: "DSKP KSSR 2015 原版 Bahasa Melayu SJK Tahun 1",
    reviewed: false,
    verifiedAt: "2026-10-10",
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
            title_bm: "Asas membaca dan memahami: Murid boleh membaca dengan sebutan yang betul dan intonasi yang sesuai (i) suku kata (ii) perkataan (iii) ayat",
            topic: { zh: "音节", bm: "Suku Kata" },
            terms: ["音节", "拼音", "KVKV", "suku kata", "perkataan", "membaca"],
          },
        ],
      },
      {
        // 2026-10-01 用本机官方 PDF（DSKP Bahasa Melayu SJK Tahun 1，第 32 页）逐字核对
        code: "3.0",
        title_zh: "书写技能",
        title_bm: "Kemahiran Menulis",
        objectives: [
          {
            code: "3.1",
            title_zh: "基础书写：机械式书写字母／音节／词语／短语／句子",
            title_bm: "Asas menulis: Murid boleh menulis secara mekanis (i) huruf (ii) suku kata (iii) perkataan (iv) frasa (v) ayat",
            topic: { zh: "书写字母", bm: "Menulis Huruf" },
            terms: ["字母", "写字", "笔顺", "四线", "huruf", "menulis", "menulis secara mekanis", "tulisan"],
          },
        ],
      },
      {
        // 2026-10-14 依资料库截取档 TAHUN1.md 的 5.1 / 5.1.4 (iii)（该档「仅为截取，没有审核」，未对官方 PDF 逐字核对；马来文用词待查证）
        code: "5.0",
        title_zh: "语法",
        title_bm: "Aspek Tatabahasa",
        objectives: [
          {
            code: "5.1",
            title_zh: "理解并依语境运用词类：认识并运用词语，包括方位词（kata arah）",
            title_bm: "Memahami fungsi dan menggunakan golongan kata mengikut konteks (5.1.4 (iii) kata arah)",
            topic: { zh: "方位词", bm: "Kata Arah" },
            terms: ["方位词", "上下前后", "kata arah", "kata tugas", "atas", "bawah", "hadapan", "belakang", "tatabahasa"],
          },
        ],
      },
    ],
  },
  {
    // 2026-10-13 逐字核对本机官方 PDF「DSKP KSSR Semakan 2017 Bahasa Melayu SJK Tahun 2 v2」第 38 页（Aspek Tatabahasa 5.1.4 (iii) kata arah）
    curriculum: "KSSR Semakan 2017",
    tahun: 2,
    subjek: "bm",
    sourceUrl: "https://jpnpp.moe.gov.my/muat-turun/sektor/sektor-pembelajaran/bahasa/bahasa-melayu/sjk-1/257-dskp-bahasa-melayu-sjk-tahun-2/file",
    sourceLabel: "DSKP KSSR Semakan 2017 Bahasa Melayu SJK Tahun 2",
    verifiedAt: "2026-10-13",
    units: [
      {
        code: "5.0",
        title_zh: "语法",
        title_bm: "Aspek Tatabahasa",
        objectives: [
          {
            code: "5.1",
            title_zh: "理解并依语境运用词类：认识并运用词语，包括方位词（kata arah）",
            title_bm: "Memahami fungsi dan menggunakan golongan kata mengikut konteks (5.1.4 (iii) kata arah)",
            topic: { zh: "方位词", bm: "Kata Arah" },
            terms: ["方位词", "上下前后", "kata arah", "kata tugas", "atas", "bawah", "hadapan", "belakang", "luar", "dalam", "tepi", "tatabahasa"],
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
            topic: { zh: "课文阅读", bm: "Bacaan Teks" },
            terms: ["课文理解", "阅读", "语感", "membaca"],
          },
        ],
      },
      {
        // 2026-10-17 补（三年级写字 tahun3-bc-bishun）：官方摘要见 docs/dskp/tahun3/bahasa-cina.md「3.0 书写技能｜3.1 应用铅笔写字」。
        // title_bm 沿用 Tahun 1 同单元工作翻译，未逐一核对 Tahun 3 官方 PDF
        code: "3.0",
        title_zh: "书写技能",
        title_bm: "Kemahiran Menulis",
        objectives: [
          {
            code: "3.1",
            title_zh: "应用铅笔写字：在田字格上书写正楷，感受汉字形体美",
            title_bm: "Menulis aksara dengan pensel",
            topic: { zh: "写字", bm: "Menulis Aksara" },
            terms: ["写字", "笔顺", "笔画", "田字格", "描红", "习写", "menulis aksara"],
          },
        ],
      },
      {
        // 同上：docs/dskp/tahun3/bahasa-cina.md「5.0 语文基础知识｜5.1 掌握汉字基本知识」
        code: "5.0",
        title_zh: "语文基础知识",
        title_bm: "Pengetahuan Asas Bahasa",
        objectives: [
          {
            code: "5.1",
            title_zh: "掌握汉字基本知识：汉字演变基本知识（笔画、结构、笔顺）",
            title_bm: "Menguasai pengetahuan asas aksara",
            terms: ["汉字基本知识", "笔画", "结构", "笔顺", "aksara"],
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
        topic: { zh: "磁铁", bm: "Magnet" },
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
          {
            code: "7.1.5",
            title_zh: "通过探究确定磁铁对物体的磁力强弱",
            title_bm: "Menentukan kekuatan magnet ke atas objek dengan menjalankan penyiasatan",
            terms: ["磁力强弱", "公平实验", "距离", "回形针", "kekuatan magnet"],
          },
          {
            code: "7.1.6",
            title_zh: "通过绘图、TMK、书写或口述解释磁铁观察结果",
            title_bm: "Menjelaskan pemerhatian tentang magnet melalui lakaran, TMK, penulisan atau lisan",
            terms: ["解释观察", "磁铁游戏", "沟通", "menjelaskan pemerhatian"],
          },
        ],
      },
    ],
  },
  {
    curriculum: "KSSR Semakan 2017",
    tahun: 3,
    subjek: "dst",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3/134-dskp-kssr-semakan-2017-sains-tahun-3-sjkc-v2/file",
    sourceLabel: "DSKP Sains Tahun 3 SJK(C)",
    verifiedAt: "2026-07-21",
    units: [
      {
        code: "7.1",
        title_zh: "密度比水大或比水小的物体或材料",
        // 内容标准原文已核实：官方马来文 Standard Kandungan 就是这句 "Objek atau bahan yang lebih
        // tumpat atau kurang tumpat daripada air"（透过网络查证到的官方引述，非本人推断）
        title_bm: "Objek atau bahan yang lebih tumpat atau kurang tumpat daripada air",
        topic: { zh: "密度", bm: "Ketumpatan" },
        objectives: [
          {
            // ⚠️ 以下 4 条学习标准的马来文是依中文摘要工作翻译，未逐字核对官方 PDF 原文页码措辞
            code: "7.1.1",
            title_zh: "推断物体或材料在水中的浮沉",
            title_bm: "Membuat inferens tentang keterapungan objek atau bahan di dalam air",
            terms: ["浮沉", "推断", "terapung", "tenggelam"],
          },
          {
            code: "7.1.2",
            title_zh: "联系物体或材料的浮沉与密度的关系",
            title_bm: "Mengaitkan keterapungan objek atau bahan dengan ketumpatan",
            terms: ["密度", "浮沉关系", "ketumpatan"],
          },
          {
            code: "7.1.3",
            title_zh: "确认增加水密度的方法（如加盐）",
            title_bm: "Mengenal pasti cara meningkatkan ketumpatan air",
            terms: ["加盐", "增加密度", "meningkatkan ketumpatan"],
          },
          {
            code: "7.1.4",
            title_zh: "应用密度知识解决课业或生活中的问题",
            title_bm: "Mengaplikasikan pengetahuan tentang ketumpatan untuk menyelesaikan masalah",
            terms: ["应用密度", "menyelesaikan masalah"],
          },
        ],
      },
    ],
  },
  {
    // 依本机 DSKP 截取档：资料库/DSKP资料/KSSR2017/Pendidikan-Jasmani-Kesihatan/通用/TAHUN1.md 第 10.0 PERTOLONGAN CEMAS
    // （PDF 自动提取，未逐字人工核对）。PK 与 PJ 共用同一份 DSKP，但属不同科目（老师 2026-10-15 定）。马来文照该档原文。
    curriculum: "KSSR Semakan 2017",
    tahun: 1,
    subjek: "pk",
    reviewed: false,
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-1",
    sourceLabel: "DSKP Pendidikan Jasmani dan Pendidikan Kesihatan Tahun 1",
    verifiedAt: "2026-10-15",
    units: [
      {
        code: "10.0",
        title_zh: "急救",
        title_bm: "Pertolongan Cemas",
        topic: { zh: "急救", bm: "Pertolongan Cemas" },
        objectives: [
          { code: "10.1", title_zh: "急救基本知识与依情境明智行动：认识紧急事件、明白该怎么做、实践求助", title_bm: "Pengetahuan asas pertolongan cemas dan kepentingan bertindak dengan bijak mengikut situasi", terms: ["紧急事件", "求助", "急救", "999", "situasi kecemasan", "meminta bantuan", "pertolongan cemas"] },
        ],
      },
    ],
  },
  {
    // 依本机 DSKP 截取档：资料库/DSKP资料/KSSR2017/Pendidikan-Jasmani-Kesihatan/通用/TAHUN1.md
    // （PDF 自动提取，老师 2026-10-10 确认收录，未逐字人工核对）。马来文照该档原文。
    curriculum: "KSSR Semakan 2017",
    tahun: 1,
    subjek: "pjpk",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-1",
    sourceLabel: "DSKP Pendidikan Jasmani dan Pendidikan Kesihatan Tahun 1",
    verifiedAt: "2026-10-10",
    units: [
      {
        code: "1.0",
        title_zh: "体育：动作技能",
        title_bm: "Kemahiran Pergerakan",
        topic: { zh: "动作技能", bm: "Kemahiran Pergerakan" },
        objectives: [
          { code: "1.1", title_zh: "依动作概念探索身体形状、平衡等动作", title_bm: "Meneroka pelbagai corak pergerakan berdasarkan konsep pergerakan", terms: ["身体形状", "大字形", "动作概念", "konsep pergerakan", "bentuk badan"] },
          { code: "1.6", title_zh: "探索动物动作（低、中、高水平）", title_bm: "Melakukan penerokaan pergerakan haiwan", terms: ["动物动作", "动物模仿", "pergerakan haiwan", "aras rendah", "aras tinggi"] },
          { code: "1.7", title_zh: "平衡技能：单脚平衡、四至一个支撑点平衡", title_bm: "Melakukan kemahiran imbangan dengan lakuan yang betul", terms: ["平衡", "单脚站", "支撑点", "imbangan", "tapak sokongan"] },
        ],
      },
      {
        code: "3.0",
        title_zh: "体育：体能",
        title_bm: "Kecergasan",
        topic: { zh: "体能", bm: "Kecergasan" },
        objectives: [
          { code: "3.3", title_zh: "柔韧性：动态与静态伸展", title_bm: "Melakukan senaman kelenturan dengan lakuan yang betul", terms: ["伸展", "拉筋", "柔韧", "kelenturan", "regangan"] },
          { code: "3.4", title_zh: "肌耐力与肌力：保持俯卧撑预备姿势等", title_bm: "Melakukan senaman meningkatkan daya tahan dan kekuatan otot dengan lakuan yang betul", terms: ["肌耐力", "俯卧撑", "平板撑", "daya tahan otot", "tekan tubi"] },
        ],
      },
    ],
  },
  {
    // 依本机 DSKP 截取档：资料库/DSKP资料/KSSR2017/Pendidikan-Jasmani-Kesihatan/通用/TAHUN2.md
    // （PDF 自动提取，老师 2026-10-10 确认收录，未逐字人工核对）。马来文照该档内容标准原文。
    curriculum: "KSSR Semakan 2017",
    tahun: 2,
    subjek: "pjpk",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-2",
    sourceLabel: "DSKP Pendidikan Jasmani dan Pendidikan Kesihatan Tahun 2",
    verifiedAt: "2026-10-10",
    units: [
      {
        code: "1.0",
        title_zh: "体育：动作技能",
        title_bm: "Kemahiran Pergerakan",
        topic: { zh: "动作技能", bm: "Kemahiran Pergerakan" },
        objectives: [
          { code: "1.3", title_zh: "非移动动作：弯身、伸展、摇摆、卷缩、扭转、推拉、摆动与平衡", title_bm: "Melakukan pelbagai pergerakan bukan lokomotor", terms: ["非移动动作", "弯身", "伸展", "扭转", "bukan lokomotor", "fleksi badan", "meregang", "mengilas"] },
          { code: "1.7", title_zh: "平衡技能：不同支撑点的静态与动态平衡", title_bm: "Melakukan pergerakan yang memerlukan kawalan badan dan sokongan", terms: ["平衡", "静态平衡", "单脚站", "支撑点", "imbangan statik", "tapak sokongan"] },
        ],
      },
      {
        code: "3.0",
        title_zh: "体育：体能",
        title_bm: "Kecergasan",
        topic: { zh: "体能", bm: "Kecergasan" },
        objectives: [
          { code: "3.3", title_zh: "柔韧性：动态与静态伸展主要肌群", title_bm: "Melakukan senaman meningkatkan kelenturan dengan lakuan yang betul", terms: ["伸展", "拉筋", "柔韧", "kelenturan", "regangan"] },
          { code: "3.4", title_zh: "肌耐力与肌力：改良撑地、踮脚、半蹲等", title_bm: "Melakukan senaman meningkatkan daya tahan dan kekuatan otot dengan lakuan yang betul", terms: ["肌耐力", "改良撑地", "踮脚", "半蹲", "tekan tubi ubah suai", "jengkit kaki", "separa cangkung"] },
        ],
      },
    ],
  },
  {
    // 依本机 DSKP 截取档：资料库/DSKP资料/KSSR2017/Matematik/SJKC/TAHUN5.md（中文）与 SK/TAHUN5.md（马来文原文）。
    // 截取档头部注明「没有审核」，故 reviewed: false（页面显示「已对照」，不显示「已核对」）。只收录已有工具覆盖的 8.2，不是整个单元。
    // 2026-10-17 加 2.0 的 2.1.1 分数乘法（分数乘法格子板 tahun6-mt-pecahan：六年级复习五年级内容，工具 standards 用 tahun: 5 指到这里）。
    // 2.2 小数、2.3 百分比、2.4 解决问题未覆盖。
    // 2026-10-17 加 3.0 钱币的 3.1／3.2／3.5（钱币小掌柜 tahun5-mt-wang）；3.3 储蓄投资、3.4 信贷未覆盖。
    curriculum: "KSSR Semakan 2017",
    tahun: 5,
    subjek: "mt",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-5/223-dskp-kssr-semakan-2017-matematik-tahun-5-sjkc/file",
    sourceLabel: "DSKP Matematik Tahun 5 SJK(C)",
    reviewed: false,
    verifiedAt: "2026-10-12",
    units: [
      {
        code: "2.0",
        title_zh: "分数、小数与百分比",
        title_bm: "Pecahan, Perpuluhan dan Peratus",
        topic: { zh: "分数", bm: "Pecahan" },
        objectives: [
          { code: "2.1", title_zh: "分数：2.1.1 进行二个数目的分数乘法运算，涉及整数、真分数和带分数（分母至 10）", title_bm: "Pecahan: 2.1.1 Mendarab pecahan bagi dua nombor melibatkan nombor bulat, pecahan wajar dan nombor bercampur", terms: ["分数乘法", "分数", "真分数", "带分数", "假分数", "整数乘分数", "分子乘分子", "分母乘分母", "约简", "面积模型", "pecahan", "darab pecahan", "pecahan wajar", "nombor bercampur", "pecahan tak wajar"] },
        ],
      },
      {
        // 2026-10-17 加 3.0 钱币（钱币小掌柜 tahun5-mt-wang）：只收 3.1 基本运算、3.2 混合运算、3.5 解决问题；3.3 储蓄投资、3.4 信贷未覆盖。
        code: "3.0",
        title_zh: "钱币",
        title_bm: "Wang",
        topic: { zh: "钱币", bm: "Wang" },
        objectives: [
          { code: "3.1", title_zh: "钱币的基本运算：完成至三个币值的加法、减法，币值与至二位数、100 和 1000 的乘法与除法（RM1 000 000 以内）", title_bm: "Operasi asas melibatkan wang: menyelesaikan ayat matematik tambah, tolak, darab dan bahagi melibatkan nilai wang dalam lingkungan RM1 000 000", terms: ["钱币", "币值", "加法", "减法", "乘法", "除法", "找钱", "wang", "nilai wang", "operasi asas"] },
          { code: "3.2", title_zh: "钱币的混合运算：完成 RM1 000 000 以内有括号和没有括号的混合运算（加和乘、减和乘、加和除、减和除）", title_bm: "Operasi bergabung melibatkan wang, dalam lingkungan RM1 000 000, tanpa dan dengan tanda kurung", terms: ["混合运算", "两步题", "operasi bergabung"] },
          { code: "3.5", title_zh: "解决问题：3.5.1 解答涉及日常生活与 RM1 000 000 以内的钱币有关的应用题（波利亚模式：审题、拟定解答策略、进行解答策略、验算）", title_bm: "Penyelesaian masalah: 3.5.1 Menyelesaikan masalah melibatkan wang dalam lingkungan RM1 000 000 dalam situasi harian", terms: ["应用题", "解决问题", "波利亚", "验算", "选运算", "penyelesaian masalah", "Model Polya"] },
        ],
      },
      {
        code: "8.0",
        title_zh: "统计与概率——数据处理",
        title_bm: "Pengurusan Data",
        topic: { zh: "数据处理", bm: "Pengurusan Data" },
        objectives: [
          { code: "8.2", title_zh: "众数、中位数、平均数和极差：从非分组数据认识并确定", title_bm: "Mod, median, min dan julat: mengenal dan menentukan daripada data tak terkumpul", terms: ["众数", "中位数", "平均数", "极差", "非分组数据", "mod", "median", "min", "julat", "data tak terkumpul"] },
        ],
      },
    ],
  },
  {
    // 依本机 DSKP 截取档：资料库/DSKP资料/KSSR2017/Matematik/SJKC/TAHUN3.md（中文）与 SK/TAHUN3.md（马来文原文）。
    // 截取档头部注明「没有审核」，故 reviewed: false。只收录已有工具覆盖的 8.1.2、8.1.3，不是整个坐标单元（8.1.1 参考点词汇、8.2 应用题未覆盖）。
    // 2026-10-17 加 6.0 度量衡（换算工坊 tahun3-mt-sukatan）：只收 6.1／6.2／6.3 的换算与加减乘除，6.4 解决问题（编故事、应用题）未覆盖。
    curriculum: "KSSR Semakan 2017",
    tahun: 3,
    subjek: "mt",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3/132-dskp-kssr-semakan-2017-matematik-tahun-3-sjkc-v3/file",
    sourceLabel: "DSKP Matematik Tahun 3 SJK(C)",
    reviewed: false,
    verifiedAt: "2026-10-15",
    units: [
      {
        code: "6.0",
        title_zh: "度量衡",
        title_bm: "Ukuran dan Sukatan",
        topic: { zh: "度量衡", bm: "Ukuran dan Sukatan" },
        objectives: [
          { code: "6.1", title_zh: "长度：6.1.1 进行涉及米和厘米的长度单位换算；6.1.2–6.1.5 进行涉及米和厘米的长度加法（至三个）、减法、乘法和除法（与一位数）", title_bm: "Panjang: 6.1.1 Menukar unit ukuran panjang melibatkan meter dan sentimeter; 6.1.2–6.1.5 Menyelesaikan ayat matematik tambah, tolak, darab dan bahagi ukuran panjang melibatkan meter dan sentimeter", terms: ["长度", "米", "厘米", "单位换算", "复名数", "竖式", "进位", "借位", "panjang", "meter", "sentimeter", "menukar unit"] },
          { code: "6.2", title_zh: "质量：6.2.1 进行涉及公斤和克的质量单位换算；6.2.2–6.2.5 进行涉及公斤和克的质量加法（至三个）、减法、乘法和除法（与一位数）", title_bm: "Jisim: 6.2.1 Menukar unit ukuran jisim melibatkan kilogram dan gram; 6.2.2–6.2.5 Menyelesaikan ayat matematik tambah, tolak, darab dan bahagi ukuran jisim melibatkan kilogram dan gram", terms: ["质量", "公斤", "克", "单位换算", "jisim", "kilogram", "gram"] },
          { code: "6.3", title_zh: "液体的体积：6.3.1 进行涉及升和毫升的液体的体积单位换算；6.3.2–6.3.5 进行涉及升和毫升的液体的体积加法（至三个）、减法、乘法和除法（与一位数）", title_bm: "Isi padu cecair: 6.3.1 Menukar unit isi padu cecair melibatkan liter dan mililiter; 6.3.2–6.3.5 Menyelesaikan ayat matematik tambah, tolak, darab dan bahagi isi padu cecair melibatkan liter dan mililiter", terms: ["液体的体积", "升", "毫升", "单位换算", "isi padu cecair", "liter", "mililiter"] },
        ],
      },
      {
        code: "8.0",
        title_zh: "坐标",
        title_bm: "Koordinat",
        topic: { zh: "坐标", bm: "Koordinat" },
        objectives: [
          { code: "8.1", title_zh: "第一象限的坐标：8.1.2 根据横轴和纵轴上的位置，说出物体的名称；8.1.3 确定物体在横轴和纵轴上的位置", title_bm: "Koordinat pada sukuan pertama: 8.1.2 Menamakan objek berdasarkan kedudukan pada paksi mengufuk dan paksi mencancang; 8.1.3 Menentukan kedudukan objek pada paksi mengufuk dan paksi mencancang", terms: ["坐标", "横轴", "纵轴", "位置", "行", "列", "koordinat", "paksi mengufuk", "paksi mencancang", "kedudukan", "lajur", "baris"] },
        ],
      },
    ],
  },
  {
    // 依本机 DSKP 截取档：资料库/DSKP资料/KSSR2017/Bahasa-Inggeris/SJK/TAHUN1.md（英文原文，SJK 版官方 PDF 截取）。
    // 截取档头部注明「没有审核」，故 reviewed: false。BI 一律用英文原文（Hub 决定 26、27）。只收录已有工具覆盖的 4.3.2，不是整个 Writing 内容标准。
    curriculum: "KSSR Semakan 2017",
    tahun: 1,
    subjek: "bi",
    sourceUrl: "https://jpnpp.moe.gov.my/muat-turun/sektor/sektor-pembelajaran/bahasa/bahasa-inggeris/sjk/240-dskp-english-sjk-year-1/file",
    sourceLabel: "DSKP English SJK Year 1",
    reviewed: false,
    verifiedAt: "2026-10-12",
    units: [
      {
        code: "4.0",
        title_zh: "写作",
        title_bm: "Writing",
        objectives: [
          { code: "4.3", title_zh: "拼写熟悉的高频词（4.3.2）", title_bm: "Spell high frequency words accurately (4.3.2: Spell familiar high frequency words accurately)", topic: { zh: "拼写", bm: "Spelling" }, terms: ["spelling", "spell", "high frequency words", "fruit", "vegetables", "拼写", "听写"] },
        ],
      },
    ],
  },
  {
    // 2026-10-17 补（Hub 整理 P2，tahun2-bc-bishun、tahun2-bc-biaodian）。BC 不在资料库，来源是本专案 docs/dskp/tahun2/bahasa-cina.md（官方 PDF 摘要，查证日期 2026-07-21），
    // 所以 reviewed: false。只收录工具实际覆盖的 3.1、5.1、5.5。title_bm 是工作翻译，未核对官方 PDF 逐字马来文措辞
    curriculum: "KSSR Semakan 2017",
    tahun: 2,
    subjek: "bc",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-2/68-03-dskp-kssr-semakan-2017-bahasa-cina-tahun-2-v2/file",
    sourceLabel: "DSKP Bahasa Cina Tahun 2 SJK(C)",
    reviewed: false,
    verifiedAt: "2026-10-17",
    units: [
      {
        code: "3.0",
        title_zh: "书写技能",
        title_bm: "Kemahiran Menulis",
        objectives: [
          {
            code: "3.1",
            title_zh: "应用铅笔写字：在田字格上书写正楷，感受汉字形体美，执笔运笔坐姿笔画笔顺正确",
            title_bm: "Menulis aksara dengan pensel",
            topic: { zh: "写字", bm: "Menulis Aksara" },
            terms: ["写字", "笔顺", "笔画", "田字格", "描红", "习写", "menulis aksara"],
          },
        ],
      },
      {
        code: "5.0",
        title_zh: "语文基础知识",
        title_bm: "Pengetahuan Asas Bahasa",
        objectives: [
          {
            code: "5.1",
            title_zh: "掌握汉字基本知识：汉字演变基本知识；笔画、部首、偏旁和结构、笔顺规则",
            title_bm: "Menguasai pengetahuan asas aksara",
            terms: ["汉字基本知识", "笔画", "部首", "偏旁", "结构", "笔顺", "aksara"],
          },
          {
            // 2026-10-17 补（tahun2-bc-xingsi 拼字魔法锅）：docs/dskp/tahun2/bahasa-cina.md「5.3 认识各类词语｜5.3.1 认识量词、近似字、多音字，辨析理解词义」。
            // topic 跟一年级同一条一样挂「量词」；近似字工具在工具上用 topicOverride（同 tahun1-bc-xingsi）。title_bm 是工作翻译，未核对官方 PDF 逐字马来文措辞
            code: "5.3.1",
            title_zh: "认识量词、近似字、多音字，辨析理解词义",
            title_bm: "Mengenal pelbagai jenis perkataan (penjodoh bilangan, kata hampir sama, kata pelbagai bunyi)",
            topic: { zh: "量词", bm: "Penjodoh Bilangan" },
            terms: ["量词", "近似字", "形近字", "形似字", "多音字", "辨析词义", "penjodoh bilangan"],
          },
          {
            code: "5.5",
            title_zh: "认识各种标点符号：顿号、冒号、引号的使用（句号、问号、叹号、逗号为一年级所学）",
            title_bm: "Mengenal pelbagai tanda baca (tanda koma, tanda titik dua, tanda petik)",
            topic: { zh: "标点", bm: "Tanda Baca" },
            terms: ["标点符号", "顿号", "冒号", "引号", "句号", "问号", "叹号", "逗号", "tanda baca", "tanda petik"],
          },
        ],
      },
    ],
  },
  {
    // 2026-10-17 补（tahun4-bc-bishun）。来源：本专案 docs/dskp/tahun4/bahasa-cina.md（官方 PDF 摘要，查证日期 2026-07-21），reviewed: false。title_bm 是工作翻译
    curriculum: "KSSR Semakan 2017",
    tahun: 4,
    subjek: "bc",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3-1/148-dskp-kssr-semakan-2017-bahasa-cina-sjk-tahun-4/file",
    sourceLabel: "DSKP Bahasa Cina Tahun 4 SJK(C)",
    reviewed: false,
    verifiedAt: "2026-10-17",
    units: [
      {
        code: "3.0",
        title_zh: "书写技能",
        title_bm: "Kemahiran Menulis",
        objectives: [
          {
            code: "3.1",
            title_zh: "应用铅笔写字：书写正楷，做到字体规范、有一定书写速度",
            title_bm: "Menulis aksara dengan pensel",
            topic: { zh: "写字", bm: "Menulis Aksara" },
            terms: ["写字", "笔顺", "笔画", "田字格", "描红", "习写", "menulis aksara"],
          },
        ],
      },
      {
        code: "5.0",
        title_zh: "语文基础知识",
        title_bm: "Pengetahuan Asas Bahasa",
        objectives: [
          {
            code: "5.1",
            title_zh: "掌握汉字基本知识：汉字演变基本知识，加强识记",
            title_bm: "Menguasai pengetahuan asas aksara",
            terms: ["汉字基本知识", "笔画", "结构", "笔顺", "aksara"],
          },
        ],
      },
    ],
  },
  {
    // 2026-10-17 补（tahun2-dst-tower）。依资料库 KSSR2017/Sains/SJKC/TAHUN2.md（中文）与 SK/TAHUN2.md（马来文原文）。
    // 截取档头部注明「没有审核」，故 reviewed: false。只收录工具覆盖的 6.1 光和暗、8.1 混合物。
    // 科目码沿用平台分类 "dst"（Tahun 1-3 归「科学与科技世界」，见上方 Tahun 1 dst 记录的说明）。
    curriculum: "KSSR Semakan 2017",
    tahun: 2,
    subjek: "dst",
    sourceUrl: "https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-2/92-47-dskp-kssr-semakan-2017-sains-tahun-2-sjkc/file",
    sourceLabel: "DSKP Sains Tahun 2 SJK(C)",
    reviewed: false,
    verifiedAt: "2026-10-17",
    units: [
      {
        code: "6.1",
        title_zh: "光和暗",
        title_bm: "Terang dan gelap",
        topic: { zh: "光和暗", bm: "Terang dan Gelap" },
        objectives: [
          { code: "6.1.1", title_zh: "讲述光的来源", title_bm: "Menyatakan sumber cahaya", terms: ["光源", "sumber cahaya"] },
          { code: "6.1.2", title_zh: "比较在光和暗的情况下进行的活动", title_bm: "Membanding beza aktiviti yang dijalankan dalam keadaan terang dan gelap", terms: ["光和暗", "terang", "gelap"] },
          { code: "6.1.3", title_zh: "通过活动解释影子如何形成的", title_bm: "Menerangkan bagaimana bayang-bayang dihasilkan melalui aktiviti", terms: ["影子", "bayang-bayang"] },
          { code: "6.1.4", title_zh: "进行研究以比较与辨别当光被物体阻挡时影子的清晰度", title_bm: "Membanding dan membezakan kejelasan bayang-bayang apabila cahaya dihalang oleh objek yang berlainan dengan menjalankan penyiasatan", terms: ["影子清晰度", "透光", "kejelasan bayang-bayang"] },
        ],
      },
      {
        code: "8.1",
        title_zh: "混合物",
        title_bm: "Campuran",
        topic: { zh: "混合物", bm: "Campuran" },
        objectives: [
          { code: "8.1.1", title_zh: "描述分开混合物中各种材料或物体的方法", title_bm: "Memerihalkan kaedah untuk mengasingkan campuran pelbagai bahan atau objek", terms: ["分开混合物", "mengasingkan campuran"] },
          { code: "8.1.2", title_zh: "推断分开混合物中各种材料或物体的方法", title_bm: "Menaakul cara yang digunakan untuk mengasingkan campuran pelbagai bahan atau objek", terms: ["分离方法", "筛网", "penapis"] },
          { code: "8.1.3", title_zh: "进行研究以确认可溶解在水里和不可溶解在水里的材料", title_bm: "Mengenal pasti bahan yang boleh larut dan tidak boleh larut di dalam air dengan menjalankan penyiasatan", terms: ["溶解", "不溶解", "larut"] },
          { code: "8.1.4", title_zh: "进行研究以总结可以使材料快速溶解的方法", title_bm: "Merumuskan cara bahan boleh dilarutkan dengan lebih cepat dengan menjalankan penyiasatan", terms: ["加快溶解", "larut dengan lebih cepat"] },
        ],
      },
    ],
  },
  {
    // 2026-10-17 补（tahun1-am-cahaya）。依资料库 DSKP资料/DSKP2027-ALAM-DAN-MANUSIA-TAHUN1.md「5.0 TEMA JENDELA DUNIA · 5.1 Kraf Cahaya」（KP2027，马来文原文；截取档「没有审核」，故 reviewed: false）。
    // ⚠️ title_zh 是暂译：官方中文译名未核对（同 app.js SUBJECTS 里 am 的说明）。只收录工具覆盖的 5.1.1–5.1.4，5.1.5–5.1.8（歌曲、律动、工艺制作）未覆盖。sourceUrl 留空（docs/dskp 里没有 KP2027 官方网址）。
    curriculum: "KP2027",
    tahun: 1,
    subjek: "am",
    sourceUrl: "",
    sourceLabel: "DKP2027 Alam dan Manusia: Pembelajaran Bersepadu Tahun 1",
    reviewed: false,
    verifiedAt: "2026-10-17",
    units: [
      {
        code: "5.1",
        title_zh: "光的工艺（暂译）",
        title_bm: "Kraf Cahaya",
        topic: { zh: "光与光源", bm: "Cahaya" },
        objectives: [
          { code: "5.1.1", title_zh: "说出周围的光源（太阳、蜡烛、火、手电筒等）", title_bm: "Menyatakan sumber cahaya yang terdapat di sekeliling", terms: ["光源", "太阳", "蜡烛", "手电筒", "sumber cahaya"] },
          { code: "5.1.2", title_zh: "说出光的重要性：光让我们看得见", title_bm: "Menyatakan kepentingan cahaya", terms: ["光的重要性", "看得见", "kepentingan cahaya"] },
          { code: "5.1.3", title_zh: "比较在明亮与黑暗中进行的活动", title_bm: "Membanding beza aktiviti yang dijalankan dalam keadaan terang dan gelap", terms: ["明暗", "terang", "gelap"] },
          { code: "5.1.4", title_zh: "说出电子设备的光对眼睛健康的影响", title_bm: "Menyatakan kesan cahaya peranti digital kepada kesihatan mata", terms: ["电子设备", "眼睛", "peranti digital", "kesihatan mata"] },
        ],
      },
    ],
  },
  {
    // 2026-10-17 补（tahun2-mz-irama）。依资料库 KSSR2017/Pendidikan-Muzik/通用/TAHUN2.md（马来文，封面 BPK 2019；截取档「没有审核」，故 reviewed: false）。
    // 资料库只有 Tahun 2 的音乐 DSKP，没有 Tahun 1，所以 tahun1-mz-irama 用 topicOverride。⚠️ title_zh 是暂译（官方中文译名未核对）。
    // 截取档把内容标准 1.1 写成「1.1.1 Elemen Muzik」，这里按 1.1 收；2.2.3 那句在截取档里到「nilai」就断了（原样照录）。sourceUrl 留空。
    curriculum: "KSSR Semakan 2017",
    tahun: 2,
    subjek: "muzik",
    sourceUrl: "",
    sourceLabel: "DSKP Pendidikan Muzik Tahun 2",
    reviewed: false,
    verifiedAt: "2026-10-17",
    units: [
      {
        code: "1.1",
        title_zh: "音乐元素（暂译）",
        title_bm: "Elemen Muzik",
        topic: { zh: "节奏", bm: "Irama" },
        objectives: [
          { code: "1.1.1", title_zh: "认识并分辨快速与慢速的速度", title_bm: "Mengenal dan membezakan tempo cepat dan lambat", terms: ["快慢", "速度", "tempo"] },
          { code: "1.1.3", title_zh: "通过音乐活动应用对快速与慢速的理解", title_bm: "Mengaplikasikan pemahaman berkaitan tempo cepat dan lambat menerusi aktiviti muzik", terms: ["快慢", "速度", "tempo"] },
        ],
      },
      {
        code: "2.2",
        title_zh: "打击乐器演奏（暂译）",
        title_bm: "Permainan Alat Perkusi",
        topic: { zh: "节奏", bm: "Irama" },
        objectives: [
          { code: "2.2.1", title_zh: "依速度演奏打击乐器", title_bm: "Memainkan alat perkusi mengikut tempo", terms: ["打击乐器", "alat perkusi", "tempo"] },
          { code: "2.2.2", title_zh: "依图标谱（skor ikon）按歌曲拍点演奏打击乐器", title_bm: "Memainkan alat perkusi mengikut detik lagu berdasarkan skor ikon", terms: ["图像谱", "拍点", "skor ikon", "detik lagu"] },
          { code: "2.2.3", title_zh: "依代表音符时值的图标谱，按节奏型演奏打击乐器", title_bm: "Memainkan alat perkusi mengikut corak irama berdasarkan skor ikon yang mewakili nilai", terms: ["节奏型", "音符时值", "corak irama", "skor ikon"] },
        ],
      },
    ],
  },
  {
    // 2026-10-17 补（tahun2-bi-punctuation、tahun2-bi-dressing）。依资料库 KSSR2017/Bahasa-Inggeris/SJK/TAHUN2.md（英文原文；截取档「没有审核」，故 reviewed: false）。
    // BI 一律用英文原文（Hub 决定 26、27）。只收录工具覆盖的 4.3.1、4.3.2。
    curriculum: "KSSR Semakan 2017",
    tahun: 2,
    subjek: "bi",
    sourceUrl: "https://jpnpp.moe.gov.my/muat-turun/sektor/sektor-pembelajaran/bahasa/bahasa-inggeris/sjk/241-dskp-english-sjk-year-2/file",
    sourceLabel: "DSKP English SJK Year 2",
    reviewed: false,
    verifiedAt: "2026-10-17",
    units: [
      {
        code: "4.0",
        title_zh: "写作",
        title_bm: "Writing",
        objectives: [
          { code: "4.3.1", title_zh: "引导式写作中恰当使用大写字母和句号（句子层面）", title_bm: "Use capital letters and full stops appropriately in guided writing at sentence level", topic: { zh: "标点", bm: "Punctuation" }, terms: ["punctuation", "capital letters", "full stop", "question mark", "标点", "大写"] },
          { code: "4.3.2", title_zh: "引导式写作中准确拼写少量熟悉的高频词", title_bm: "Spell a narrow range of familiar high frequency words accurately in guided writing", topic: { zh: "拼写", bm: "Spelling" }, terms: ["spelling", "spell", "high frequency words", "拼写", "听写"] },
          // 2026-10-17 补（tahun2-bi-plural）。DSKP 二年级不设语法学习标准（截取档第 868 行：Year 2 不显式分析语法），工具练的是写简单句时的单复数与 a/an，挂 4.3.3。
          { code: "4.3.3", title_zh: "计划、起草并写出简单句子", title_bm: "Plan, draft and write simple sentences", topic: { zh: "单复数", bm: "Singular and Plural" }, terms: ["simple sentences", "singular", "plural", "a", "an", "articles", "写句子", "造句", "单数", "复数", "单复数"] },
        ],
      },
    ],
  },
  {
    // 2026-10-17 补（tahun4-bi-writing）。依资料库 KSSR2017/Bahasa-Inggeris/SJK/TAHUN4.md（英文原文；截取档「没有审核」，故 reviewed: false）。只收录工具覆盖的 4.2.5。
    curriculum: "KSSR Semakan 2017",
    tahun: 4,
    subjek: "bi",
    sourceUrl: "https://jpnpp.moe.gov.my/muat-turun/sektor/sektor-pembelajaran/bahasa/bahasa-inggeris/sjk/243-dskp-english-sjk-year-4/file",
    sourceLabel: "DSKP English SJK Year 4",
    reviewed: false,
    verifiedAt: "2026-10-17",
    units: [
      {
        code: "4.0",
        title_zh: "写作",
        title_bm: "Writing",
        objectives: [
          { code: "4.2.5", title_zh: "用基本并列连词和指代代词把句子连成连贯的段落", title_bm: "Connect sentences into a coherent paragraph using basic coordinating conjunctions and reference pronouns", topic: { zh: "段落写作", bm: "Paragraph Writing" }, terms: ["paragraph", "coherent paragraph", "coordinating conjunctions", "reference pronouns", "writing", "段落", "连词"] },
        ],
      },
    ],
  },
];
