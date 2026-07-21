# DSKP 马来文官方标题核对表 — 数学（Matematik）与科学（Sains）

> 查证日期：2026-07-21
> 用途：给 `data/dskp-index.js` 的 `title_bm` 字段核对官方马来文用词，避免用回译/工作翻译冒充官方原文。

## ⚠️ 最重要的发现：SJK(C) 版数学／科学 DSKP 原文全篇是中文，没有马来文单元/学习目标标题

用 `pdf` skill 打开 BPK 官网上的《Matematik SJK(C)》《Sains SJK(C)》各年级 DSKP 原文后发现：**这两科的 SJK(C) 版官方文件，内容标准／学习标标准／表现标准整段都是用中文写的**（因为 SJKC 的数学、科学教学媒介语是华语），只有封面页、Rukun Negara、Falsafah Pendidikan Kebangsaan 等固定官方前言用马来文，正文完全没有马来文版的单元/目标标题可抄。

这跟原本任务设想（「SJK(C) 原文里每个学习标准本来就是马来文，照抄即可」）不符——**SJK(C) 数学/科学 DSKP 反而是没有马来文标题的那一份**。

因此，本表**全部条目都改用 SK（国小）版 DSKP 做马来文标题的核对来源**，并非任务原先设想的「找不到才退而求其次」，而是**这两科全部年级都必须依赖 SK 版**（如实标注，不隐瞒）。好消息是：经比对，SK 版与 SJK(C) 版的单元代码（如 4.0／4.1／4.2）结构、条目数量完全一致（同一套 KSSR 课纲框架，只是教学媒介语不同），可以放心按代码对应。已验证的一个例子（Tahun 2 数学 4.0 钱币）显示 SK 版马来文标题与专案原本回译的工作翻译**逐字吻合**，说明这个学科的回译品质本身是可靠的，但仍需要逐一走一遍核对流程，不能预设都对。

## 来源 PDF 一览（本次新查证／下载）

| 科目 | 年级 | 版本 | 来源网址 |
|---|---|---|---|
| Matematik | 1 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-1/51-34-dskp-kssr-semakan-matematik-tahun-1/file |
| Matematik | 2 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-2/70-05-dskp-kssr-semakan-2017-matematik-tahun-2-v2/file |
| Matematik | 3 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3/107-005-dskp-kssr-semakan-2017-matematik-tahun-3/file |
| Matematik | 4 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3-1/156-dskp-kssr-semakan-2017-matematik-tahun-4/file |
| Matematik | 5 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-5/187-009-dskp-kssr-semakan-2017-matematik-thn5-print/file |
| Matematik | 6 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-6/232-3-dskp-matematik-tahun-6-isbn/file |
| Sains | 4 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-3-1/175-dskp-kssr-semakan-2017-sains-tahun-4-v2/file |
| Sains | 5 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-5/189-012-dskp-kssr-semakan-2017-sains-thn5-print/file |
| Sains | 6 | SK | https://bpk.moe.gov.my/kurikulum/kssr/kssr-tahun-6/235-4-dskp-kssr-semakan-2017-sains-tahun-6-isbn/file |

对照用的中文摘要来源：`docs/dskp/tahun{N}/matematik.md`、`docs/dskp/tahun{4,5,6}/sains.md`（原本各自记录的是 SJK(C) 中文原文的来源网址，见各文件开头，与上表的 SK 网址是两份不同文件，本表只是借用 SK 版的马来文措辞）。

---

## 数学 Matematik

### Tahun 1（8 个单元，全部单元＋学习目标已核对，来源：SK 版，核对日期 2026-07-21）

| 单元/目标代码 | 中文标题 | 马来文官方标题（SK版） |
|---|---|---|
| 1.0 | 数与运算 — 100以内的整数 | NOMBOR BULAT HINGGA 100 |
| 1.1 | 以直观法说出数量 | Kuantiti secara intuitif. |
| 1.2 | 数值 | Nilai Nombor. |
| 1.3 | 写出数目 | Menulis nombor. |
| 1.4 | 数目的组合 | Kombinasi nombor. |
| 1.5 | 数列 | Rangkaian nombor. |
| 1.6 | 数位 | Nilai tempat. |
| 1.7 | 估算 | Menganggar. |
| 1.8 | 近似值 | Membundarkan nombor.（学习标准 1.8.1 全文：Membundarkan nombor bulat kepada puluh terdekat） |
| 1.9 | 数列的规律 | Pola nombor. |
| 1.10 | 解决问题 | Penyelesaian masalah. |
| 2.0 | 数与运算 — 基本运算 | OPERASI ASAS |
| 2.1 | 加和减的概念 | Konsep tambah dan tolak. |
| 2.2 | 100以内的加法 | Tambah dalam lingkungan 100. |
| 2.3 | 100以内的减法 | Tolak dalam lingkungan 100. |
| 2.4 | 解决问题 | Penyelesaian masalah. |
| 2.5 | 连加法 | Tambah berulang. |
| 2.6 | 连减法 | Tolak berturut-turut. |
| 3.0 | 数与运算 — 分数 | PECAHAN |
| 3.1 | 二等份和四等份的真分数概念 | Konsep perdua dan perempat pecahan wajar. |
| 3.2 | 解决问题 | Penyelesaian masalah. |
| 4.0 | 数与运算 — 钱币 | WANG |
| 4.1 | 纸币和硬币 | Wang kertas dan duit syiling. |
| 4.2 | 经济来源和储蓄 | Sumber kewangan dan simpanan. |
| 4.3 | 解决问题 | Penyelesaian masalah. |
| 5.0 | 测量与几何 — 时间与时刻 | MASA DAN WAKTU |
| 5.1 | 天和月份 | Hari dan bulan. |
| 5.2 | 钟面 | Muka jam. |
| 5.3 | 解决问题 | Penyelesaian masalah. |
| 6.0 | 测量与几何 — 度量衡 | UKURAN DAN SUKATAN |
| 6.1 | 以相对单位测量长度、质量和液体的体积 | Unit relatif untuk mengukur panjang, jisim dan isi padu cecair. |
| 6.2 | 解决问题 | Penyelesaian masalah. |
| 7.0 | 测量与几何 — 空间 | RUANG |
| 7.1 | 立体图形 | Bentuk tiga dimensi. |
| 7.2 | 平面图形 | Bentuk dua dimensi. |
| 7.3 | 解决问题 | Penyelesaian masalah. |
| 8.0 | 统计与概率 — 数据处理 | PENGURUSAN DATA |
| 8.1 | 收集、分类和整理数据 | Mengumpul, mengelas dan menyusun data. |
| 8.2 | 象形统计图 | Piktograf. |
| 8.3 | 解决问题 | Penyelesaian masalah. |

### Tahun 2（8 个单元，全部单元＋学习目标已核对，来源：SK 版，核对日期 2026-07-21）

> `data/dskp-index.js` 目前唯一一笔结构化记录（4.0 钱币）已用本表核对，见文末「dskp-index.js 修正结果」。

| 单元/目标代码 | 中文标题 | 马来文官方标题（SK版） |
|---|---|---|
| 1.0 | 数与运算 — 1000以内的整数 | NOMBOR BULAT HINGGA 1000 |
| 1.1 | 数值 | Nilai Nombor. |
| 1.2 | 写出数目 | Menulis nombor. |
| 1.3 | 数列 | Rangkaian nombor. |
| 1.4 | 数位 | Nilai tempat. |
| 1.5 | 估算 | Menganggar. |
| 1.6 | 近似值 | Membundarkan nombor. |
| 1.7 | 有规律的数列 | Pola nombor. |
| 1.8 | 解决问题 | Penyelesaian masalah. |
| 2.0 | 数与运算 — 基本运算 | OPERASI ASAS |
| 2.1 | 加法（1000以内） | Tambah dalam lingkungan 1000. |
| 2.2 | 减法（1000以内） | Tolak dalam lingkungan 1000. |
| 2.3 | 乘法（1000以内） | Darab dalam lingkungan 1000. |
| 2.4 | 除法（1000以内） | Bahagi dalam lingkungan 1000. |
| 2.5 | 解决问题 | Penyelesaian masalah. |
| 3.0 | 数与运算 — 分数与小数 | PECAHAN DAN PERPULUHAN |
| 3.1 | 真分数 | Pecahan wajar. |
| 3.2 | 小数 | Perpuluhan. |
| 3.3 | 分数与小数 | Pecahan dan Perpuluhan. |
| 3.4 | 解决问题 | Penyelesaian masalah. |
| 4.0 | 数与运算 — 钱币 | WANG |
| 4.1 | 纸币和硬币 | Wang kertas dan duit syiling.（✅ 与 dskp-index.js 既有工作翻译逐字吻合） |
| 4.2 | 钱币加法 | Tambah wang.（✅ 与既有工作翻译逐字吻合） |
| 4.3 | 钱币减法 | Tolak wang（✅ 与既有工作翻译逐字吻合，官方原文无句号） |
| 4.4 | 钱币乘法 | Darab wang（dskp-index.js 目前没有这一条目标） |
| 4.5 | 钱币除法 | Bahagi wang（dskp-index.js 目前没有这一条目标） |
| 4.6 | 储蓄与投资 | Simpanan dan pelaburan.（✅ 与既有工作翻译逐字吻合） |
| 4.7 | 解决问题 | Penyelesaian masalah.（dskp-index.js 目前没有这一条目标） |
| 5.0 | 测量与几何 — 时间与时刻 | MASA DAN WAKTU |
| 5.1 | 时刻 | Waktu dalam jam dan minit. |
| 5.2 | 时间单位关系 | Perkaitan dalam waktu. |
| 5.3 | 解决问题 | Penyelesaian masalah. |
| 6.0 | 测量与几何 — 度量衡 | UKURAN DAN SUKATAN |
| 6.1 | 长度 | Panjang |
| 6.2 | 质量 | Jisim |
| 6.3 | 液体的体积 | Isi padu cecair. |
| 6.4 | 解决问题 | Penyelesaian masalah. |
| 7.0 | 测量与几何 — 空间 | RUANG |
| 7.1 | 立体图形 | Bentuk tiga dimensi. |
| 7.2 | 平面图形 | Bentuk dua dimensi. |
| 7.3 | 解决问题 | Penyelesaian masalah. |
| 8.0 | 统计与概率 — 数据处理 | PENGURUSAN DATA |
| 8.1 | 收集分类整理数据 | Mengumpul, mengelas dan menyusun data. |
| 8.2 | 条形统计图 | Carta palang. |
| 8.3 | 解决问题 | Penyelesaian masalah. |

### Tahun 3–6（只核对到「单元」层级，来源：SK 版，核对日期 2026-07-21；单元内逐条学习目标标题未核对，见文末待确认清单）

| 年级 | 单元代码 | 中文标题 | 马来文官方标题（SK版） |
|---|---|---|---|
| 3 | 1.0 | 数与运算 — 10000以内的整数 | NOMBOR BULAT HINGGA 10 000 |
| 3 | 2.0 | 数与运算 — 基本运算 | OPERASI ASAS |
| 3 | 3.0 | 数与运算 — 分数、小数与百分比 | PECAHAN, PERPULUHAN DAN PERATUS |
| 3 | 4.0 | 数与运算 — 钱币 | WANG |
| 3 | 5.0 | 测量与几何 — 时间与时刻 | MASA DAN WAKTU |
| 3 | 6.0 | 测量与几何 — 度量衡 | UKURAN DAN SUKATAN |
| 3 | 7.0 | 测量与几何 — 空间 | RUANG |
| 3 | 8.0 | 联系与代数 — 坐标 | KOORDINAT |
| 3 | 9.0 | 统计与概率 — 数据处理 | PENGURUSAN DATA |
| 4 | 1.0 | 数与运算 — 整数与运算 | NOMBOR BULAT DAN OPERASI ASAS |
| 4 | 2.0 | 数与运算 — 分数、小数与百分比 | PECAHAN, PERPULUHAN DAN PERATUS |
| 4 | 3.0 | 数与运算 — 钱币 | WANG |
| 4 | 4.0 | 测量与几何 — 时间与时刻 | MASA DAN WAKTU |
| 4 | 5.0 | 测量与几何 — 度量衡 | UKURAN DAN SUKATAN |
| 4 | 6.0 | 测量与几何 — 空间 | RUANG |
| 4 | 7.0 | 联系与代数 — 坐标，比与比例 | KOORDINAT, NISBAH DAN KADARAN |
| 4 | 8.0 | 统计与概率 — 数据处理 | PENGURUSAN DATA |
| 5 | 1.0 | 数与运算 — 整数与基本运算 | NOMBOR BULAT DAN OPERASI ASAS |
| 5 | 2.0 | 数与运算 — 分数、小数与百分比 | PECAHAN, PERPULUHAN DAN PERATUS |
| 5 | 3.0 | 数与运算 — 钱币 | WANG |
| 5 | 4.0 | 测量与几何 — 时间与时刻 | MASA DAN WAKTU |
| 5 | 5.0 | 测量与几何 — 度量衡 | UKURAN DAN SUKATAN |
| 5 | 6.0 | 测量与几何 — 空间 | RUANG |
| 5 | 7.0 | 联系与代数 — 坐标、比与比例 | KOORDINAT, NISBAH DAN KADARAN |
| 5 | 8.0 | 统计与概率 — 数据处理 | PENGURUSAN DATA |
| 6 | 1.0 | 数与运算 — 整数与基本运算 | NOMBOR BULAT DAN OPERASI ASAS |
| 6 | 2.0 | 数与运算 — 分数、小数与百分比 | PECAHAN, PERPULUHAN DAN PERATUS |
| 6 | 3.0 | 数与运算 — 钱币 | WANG |
| 6 | 4.0 | 测量与几何 — 时间与时刻 | MASA DAN WAKTU |
| 6 | 5.0 | 测量与几何 — 度量衡 | UKURAN DAN SUKATAN |
| 6 | 6.0 | 测量与几何 — 空间 | RUANG |
| 6 | 7.0 | 联系与代数 — 坐标、比与比例 | KOORDINAT, NISBAH DAN KADARAN |
| 6 | 8.0 | 统计与概率 — 数据处理与可能性 | PENGURUSAN DATA DAN KEBOLEHJADIAN |

---

## 科学 Sains（Tahun 1–3 尚未独立成科，故只有 4–6 年级）

只核对到「单元／课题」层级（来源：SK 版，核对日期 2026-07-21）；单元内逐条学习目标标题未核对，仅示范核对了 Tahun 4 单元 2.0 其中一条（见下方标注 ✅ 处），其余见文末待确认清单。

| 年级 | 单元代码 | 中文标题 | 马来文官方标题（SK版） |
|---|---|---|---|
| 4 | 1.0 | 科学技能 | KEMAHIRAN SAINTIFIK |
| 4 | 2.0 | 人类 | MANUSIA |
| 4 | 2.1 | 人类的呼吸 | Pernafasan Manusia.（✅ 已逐字核对原文，学习标准与内容标准标题一致） |
| 4 | 3.0 | 动物 | HAIWAN |
| 4 | 4.0 | 植物 | TUMBUHAN |
| 4 | 5.0 | 光的特性 | SIFAT CAHAYA |
| 4 | 6.0 | 声音 | BUNYI |
| 4 | 7.0 | 能 | TENAGA |
| 4 | 8.0 | 材料（对应中文摘要「材料科学」域下 8.1/8.2） | BAHAN |
| 4 | 9.0 | 地球（对应中文摘要「地球与宇宙」域下 9.1/9.2） | BUMI |
| 4 | 10.0 | 机械（对应中文摘要「工艺」域下 10.1/10.2） | MESIN |
| 5 | 1.0 | 科学技能 | KEMAHIRAN SAINTIFIK |
| 5 | 2.0 | 人类 | MANUSIA |
| 5 | 3.0 | 动物 | HAIWAN |
| 5 | 4.0 | 植物 | TUMBUHAN |
| 5 | 5.0 | 电 | ELEKTRIK |
| 5 | 6.0 | 热 | HABA |
| 5 | 7.0 | 生锈 | PENGARATAN |
| 5 | 8.0 | 物质 | JIRIM |
| 5 | 9.0 | 月相与星座 | FASA BULAN DAN BURUJ |
| 5 | 10.0 | 机械 | MESIN |
| 6 | 1.0 | 科学技能 | KEMAHIRAN SAINTIFIK |
| 6 | 2.0 | 人类 | MANUSIA |
| 6 | 3.0 | 微生物 | MIKROORGANISMA |
| 6 | 4.0 | 生物之间的相互关系 | INTERAKSI ANTARA HIDUPAN |
| 6 | 5.0 | 保护和复育 | PEMELIHARAAN DAN PEMULIHARAAN |
| 6 | 6.0 | 力 | DAYA |
| 6 | 7.0 | 速度 | KELAJUAN |
| 6 | 8.0 | 食物保存科技 | TEKNOLOGI PENGAWETAN MAKANAN |
| 6 | 9.0 | 废物 | BAHAN BUANGAN |
| 6 | 10.0 | 日食与月食 | GERHANA |
| 6 | 11.0 | 星系 | GALAKSI |
| 6 | 12.0 | 平稳性和坚固性 | KESTABILAN DAN KEKUATAN |
| 6 | 13.0 | 工艺 | TEKNOLOGI |

---

## `data/dskp-index.js` 修正结果

- **Tahun 2 数学 4.0 钱币**（objectives 4.1/4.2/4.3/4.6）：核对后确认原本的 `title_bm` 全部**逐字正确**，不需要改字——`Wang`／`Wang kertas dan duit syiling`／`Tambah wang`／`Tolak wang`／`Simpanan dan pelaburan` 与 SK 版官方原文一字不差。已把文件开头「工作翻译未核对」的警语改写为写明核对来源（SK 版 PDF）与核对日期 2026-07-21，不再是「未核对」状态。
- **Tahun 1 数学 1.8 近似值**：本来就已经用 WebSearch 核对过，本次用完整 SK 版 PDF 再次确认一致，未改动。

## 待确认清单（如实列出，不用猜测填补）

1. **数学 Tahun 3–6 各单元内的逐条学习目标标题（X.Y 层级）未核对**——只核对到单元层级（X.0）。如果之后要把这些年级也编进 `data/dskp-index.js`，需要回头逐条打开 SK 版 PDF 核对（本次因时间关系只做了 Tahun 1、Tahun 2 的完整逐条核对）。
2. **科学 Tahun 4–6 各单元内的逐条学习目标标题（X.Y 层级）几乎未核对**——只核对到单元层级，外加 Tahun 4「2.1 人类的呼吸」一条作示范验证，其余全部待确认。
3. **本表全部使用 SK（国小）版 DSKP 做马来文标题来源，不是 SJK(C) 版**——因为 SJK(C) 版数学/科学 DSKP 原文本身没有马来文单元/目标标题（详见文首说明）。如果日后需要「绝对忠于 SJK(C) 官方文件」的马来文标题，目前找不到这样的来源，只能确认「SK 版与 SJK(C) 版单元代码结构一致、措辞照抄 SK 版」这个做法是否被专案接受。
4. **Tahun 4 单元 8.0/9.0/10.0（材料/地球/机械）跟中文摘要「域」分组的对应关系是靠单元数量与顺序推断**（中文摘要按「生命科学/物理科学/材料科学/地球与宇宙/工艺」五大域分组，不是按 X.0 单元数字分组），虽然逻辑上吻合，但没有像其他单元一样逐字比对到原文的「BIDANG PEMBELAJARAN」标签，建议之后有空二次确认。
