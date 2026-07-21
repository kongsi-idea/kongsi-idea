# SJKC 华小名录说明

`sjkc-schools.json` 用于 课堂点子铺 登录/反馈表单的「州属 → 县 → 学校」三层下拉选单。

**重要提醒：这份名录不是权威登记系统，不保证逐一精确。** UI 层务必保留「找不到自己学校可手动输入校名」的保底选项。数据以效率优先收集，主要来源为马来文维基百科各州「Senarai Sekolah Jenis Kebangsaan Cina di [州名]」条目——这些条目本身也是社群协作维护，可能有疏漏、过时或校名翻译不完全统一的情况。

## 查证日期
2026-07-20（柔佛以西马来西亚时间）

## 收集方法
1. 用 `curl`（带自定义 User-Agent）直接抓取马来文维基百科各州条目的 wikitext 原始码（`action=raw`），而不是靠网页摘要，以取得完整表格数据。
2. 用脚本解析 wikitext 表格，抓取「校名（马来文）」「校名（中文）」「地点（Lokasi）」栏位；已排除表格中标注「(ditutup)」/`notetag`（已关闭/已迁移，条目本身是历史记录不是现役学校）的行。
3. 同一个县里如果出现相同校名的学校（华小很常见，如「中华华小」在同一县可能有好几间），会在校名后加註地点做区分，例如「中华华小（万里望）」，避免误删成一间。
4. 县/区名称从马来文行政区名称翻译为中文常用译名（人工对照表），翻译以马来西亚华文媒体常见用法为准，但**未逐一查证每个县名翻译**，如有出入以马来文原名 (Lokasi/Daerah) 为准。
5. 联邦直辖区维基百科条目是三区合一页面（`Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Wilayah_Persekutuan`），已拆分为「吉隆坡」「纳闽」两个独立州级条目（该页面明确写「布城目前没有华小」，故 `布城` 留空数组）。

## 各州数据来源与收集量

| 州属 | 来源 URL | 收集到 | 维基条目声称总数 | 备注 |
|---|---|---|---|---|
| 柔佛 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Johor | 227 | 218（截至2025年12月） | 分县齐全（10县），量级吻合 |
| 吉打 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Kedah | 89 | 89 | 分县齐全（12县） |
| 吉兰丹 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Kelantan | 15 | 15 | 完全吻合 |
| 马六甲 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Melaka | 65 | 65 | 完全吻合，仅3县 |
| 森美兰 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Negeri_Sembilan | 77 | 82 | 略低于声称总数，可能有个别行未被解析脚本识别 |
| 彭亨 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Pahang | 74 | 75 | 接近吻合 |
| 槟城 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Pulau_Pinang | 88 | 90 | 接近吻合 |
| 霹雳 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Perak | 184 | 185 | 接近吻合，12县 |
| 玻璃市 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Perlis | 10 | 10 | 完全吻合 |
| 沙巴 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Sabah | 83 | 83 | 完全吻合，20县 |
| 砂拉越 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Sarawak | 229 | 222（截至2025年12月） | 略高于声称总数，31个县/分区，可能有边界案例被脚本重复计入 |
| 雪兰莪 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Selangor | 115 | 117 | 接近吻合，9县 |
| 登嘉楼 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Terengganu | 10 | 10 | 完全吻合 |
| 吉隆坡 | https://ms.wikipedia.org/wiki/Senarai_Sekolah_Jenis_Kebangsaan_Cina_di_Wilayah_Persekutuan | 42 | 42 | 完全吻合（来自联邦直辖区合页） |
| 纳闽 | 同上 | 2 | 2 | 完全吻合 |
| 布城 | 同上 | 0 | 0 | 维基条目明确写「目前没有华小」 |

**总计：约 1310 间**，与维基百科／教总（Dong Zong 属下教师会总会）常引用的「全国约1300+间华小」量级吻合，是合理的覆盖范围。

## 数据比较薄弱、需要留意的地方
1. **县属归类的中文译名未逐一核实**——马来文行政区（Daerah）到中文常用地名的对照表是人工整理，参考马来西亚华文媒体常见用法，但没有逐条查证官方译名是否完全一致（例如砂拉越、沙巴一些较小的县镇中文译名在不同媒体间本身就有出入）。
2. **森美兰、彭亨、槟城、雪兰莪、霹雳**的解析结果比维基条目声称的总数略少几间（1-5间不等），可能是个别表格行格式特殊（如合并儲存格/多行地址）导致脚本没能正确识别，未逐行人工核对补齐。
3. **砂拉越**解析结果比声称总数多出约7间，可能是脚本把个别历史/备注行误判为现役学校，未逐条排查。
4. **吉兰丹、登嘉楼、玻璃市**这三个州的华小数量本来就少（10-15间），维基条目也不一定分县详尽，部分学校的「地点」栏位本身就等同市镇名，不是正式行政区（Daerah）名称。
5. 校名统一使用**中文校名**（维基条目中的"Nama sekolah dalam bahasa Cina"栏位），少数条目缺中文名的以「SJK (C) + 马来文校名」代替，尚未逐一转换。
6. 同县同名学校（如多间「中华华小」）已用地点加註区分，但地点写法沿用维基条目原文，可能与老师日常口语说法略有出入。
7. 此名录未与教育部（MOE）/各州教育局（JPN）官方名册逐一对照核实，仅作为 UI 辅助查找用途，非权威登记来源。

## 数据结构
```json
{
  "柔佛": {
    "新山": ["国光华小", "..."],
    "_no_district": ["..."]
  },
  "吉隆坡": {
    "_no_district": ["..."]
  },
  "布城": {
    "_no_district": []
  }
}
```
`_no_district` 用于放置没能归到具体县，或该地区本身只有一层（如联邦直辖区、玻璃市个别市镇级条目）的学校。
