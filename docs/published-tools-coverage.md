# 已上架工具总览（覆盖情况一览）

> 每次有新工具真正上架（`status: "published"`），都要回来更新这份文件——目的是让「这个平台还缺什么」一眼看得出来，不用回头翻 `app.js` 逐条数。
> 资料来源：`app.js` 里 `status: "published"` 的条目 + `data/dskp-index.js` 里对应的 `standards` 引用。示例作品（`isDemo: true`）不算，因为不是真的工具。

## 已上架工具清单

| slug | 年级 | 科目 | 名称 | 对应 DSKP 单元/学习标准 | 上线网址 |
|---|---|---|---|---|---|
| `tahun2-mt-wang` | Tahun 2 | 数学 (mt) | 钱币乐园 | 4.0 钱币 — 4.1/4.2/4.3/4.6 | https://tahun2-mt-wang.vercel.app |
| `tahun1-mt-bundar` | Tahun 1 | 数学 (mt) | 近似值特快车 | 1.0 数与运算 — 1.8 近似值 | https://tahun1-mt-bundar.vercel.app |
| `tahun4-mt-nombor` | Tahun 4 | 数学 (mt) | 数学知识大比拼 | 1.0 数与运算 — 1.1 数值 | https://tahun4-mt-nombor.vercel.app |
| `tahun1-bc-shizi` | Tahun 1 | 华文 (bc) | 识字大对决 | 2.0 阅读技能 — 2.1 阅读与理解教材 | https://tahun1-bc-shizi.vercel.app |

## 年级 × 科目覆盖矩阵

科目缩写对照见 `app.js` 的 `SUBJECTS`：bm马来文／bi英文／bc华文／mt数学／dst科学与科技世界(1-3)／sains科学(4-6)／sejarah历史(4-6)／rbt设计与工艺(4-6)／islam伊斯兰／moral道德／seni视觉艺术／muzik音乐／pjpk体育与健康

| 年级 \ 科目 | bm | bi | bc | mt | dst/sains | sejarah | rbt | islam | moral | seni | muzik | pjpk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tahun 1 | — | — | ✅ 2.1识字 | ✅ 1.8近似值 | — | — | — | — | — | — | — | — |
| Tahun 2 | — | — | — | ✅ 4.0钱币 | — | — | — | — | — | — | — | — |
| Tahun 3 | — | — | — | — | — | — | — | — | — | — | — | — |
| Tahun 4 | — | — | — | ✅ 1.1数值 | — | — | — | — | — | — | — | — |
| Tahun 5 | — | — | — | — | — | — | — | — | — | — | — | — |
| Tahun 6 | — | — | — | — | — | — | — | — | — | — | — | — |

**一眼看出的缺口**：4 个工具里 3 个数学 1 个华文，其余 11 个科目一个都还没有；数学覆盖 Tahun 1/2/4，Tahun 3/5/6 数学空着；华文只有 Tahun 1，其他年级还空着。马来文/英文/科学完全空白——`yquan77/teaching-tools` 里的 `y1-bc-火车造句`、`pm-bm-kvkv`（马来文拼音）、`三年级华文课文理解PK` 等可以优先看，能补上这些空缺。

## 更新方法
1. 新工具 `status` 改成 `published` 且加了真实 `standards` 字段后，回来这份文件加一行清单 + 在矩阵里把对应格子改成 ✅
2. 矩阵格子里简短写「✅ 单元号+关键词」就好，不用整段描述，详细内容清单表已经有了
3. 这份文件跟 `handoff.md` 是两回事：`handoff.md` 记流程/踩坑/待办，这份文件只做「现状总览」，不夹杂过程性内容
