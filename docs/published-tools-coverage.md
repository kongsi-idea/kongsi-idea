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
| `tahun1-bm-kvkv` | Tahun 1 | 马来文 (bm) | KVKV音节打地鼠 | 2.0 阅读技能 — 2.1 基础阅读与理解 | https://tahun1-bm-kvkv.vercel.app |
| `tahun1-bc-bushou` | Tahun 1 | 华文 (bc) | 部首大对垒 | 5.0 语文基础知识 — 5.1 汉字基本知识 | https://tahun1-bc-bushou.vercel.app |
| `tahun1-bc-zaoju` | Tahun 1 | 华文 (bc) | 神奇句子小火车 | 3.0 书写技能 — 3.2 书面表达能力 | https://tahun1-bc-zaoju.vercel.app |
| `tahun2-mt-shuzhi` | Tahun 2 | 数学 (mt) | 苹果果园数学 | 1.0 数与运算 — 1.4 数位 | https://tahun2-mt-shuzhi.vercel.app |
| `tahun2-mt-shulie-explore` | Tahun 2 | 数学 (mt) | 数序列小探险 | 1.0 数与运算 — 1.7 有规律的数列 | https://tahun2-mt-shulie-explore.vercel.app |
| `tahun2-mt-shulie-boss` | Tahun 2 | 数学 (mt) | 数字数列大对决 | 1.0 数与运算 — 1.7 有规律的数列 | https://tahun2-mt-shulie-boss.vercel.app |
| `tahun2-mt-shulie-duel` | Tahun 2 | 数学 (mt) | 双人数字对决 | 1.0 数与运算 — 1.7 有规律的数列 | https://tahun2-mt-shulie-duel.vercel.app |
| `tahun2-mt-baigetu` | Tahun 2 | 数学 (mt) | 百格图乘法表动画 | 2.0 基本运算 — 2.3 乘法 | https://tahun2-mt-baigetu.vercel.app |
| `tahun3-bc-kewen` | Tahun 3 | 华文 (bc) | 语文课文大PK | 2.0 阅读技能 — 2.1 阅读与理解教材 | https://tahun3-bc-kewen.vercel.app |

## 年级 × 科目覆盖矩阵

科目缩写对照见 `app.js` 的 `SUBJECTS`：bm马来文／bi英文／bc华文／mt数学／dst科学与科技世界(1-3)／sains科学(4-6)／sejarah历史(4-6)／rbt设计与工艺(4-6)／islam伊斯兰／moral道德／seni视觉艺术／muzik音乐／pjpk体育与健康

| 年级 \ 科目 | bm | bi | bc | mt | dst/sains | sejarah | rbt | islam | moral | seni | muzik | pjpk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tahun 1 | ✅ 2.1音节 | — | ✅ 2.1/3.2/5.1 (3个) | ✅ 1.8近似值 | — | — | — | — | — | — | — | — |
| Tahun 2 | — | — | — | ✅ 4.0钱币/1.4数位/1.7数列(3个)/2.3乘法 (共5个) | — | — | — | — | — | — | — | — |
| Tahun 3 | — | — | ✅ 2.1课文理解 | — | — | — | — | — | — | — | — | — |
| Tahun 4 | — | — | — | ✅ 1.1数值 | — | — | — | — | — | — | — | — |
| Tahun 5 | — | — | — | — | — | — | — | — | — | — | — | — |
| Tahun 6 | — | — | — | — | — | — | — | — | — | — | — | — |

**一眼看出的缺口**（2026-07-21 更新，`yquan77/teaching-tools` 已全部处理完）：13 个工具集中在 Tahun 1/2 数学+华文，Tahun 2 数学一个年级就占了 5 个（钱币/数位/数列×3/乘法），略显集中，但每个工具教学场景不同（solo/双人/整班），不算重复堆砌。**英文（bi）、科学（dst/sains）、历史/设计与工艺/伊斯兰/道德/视觉艺术/音乐/体育 这 8 个科目完全空白**；数学 Tahun 3/5/6、华文 Tahun 2/4/5/6、马来文 Tahun 2-6 也都还空着。下次找素材时优先看这些空科目/年级，而不是继续堆 Tahun1-2 数学/华文。

**这次因内容重复或版本被取代而没有搬的**：`二年级数位与数值分析.html`（内含两个子工具，各只有2-3道写死题目，被功能更完整的「苹果果园数学」取代）。`yquan77/teaching-tools` 仓库里的教学向素材已经全部处理完，剩下的都是非教学工具（LDP系列/家庭相关/摊位报告/班级果实树等），不属于这条流水线。

## 更新方法
1. 新工具 `status` 改成 `published` 且加了真实 `standards` 字段后，回来这份文件加一行清单 + 在矩阵里把对应格子改成 ✅
2. 矩阵格子里简短写「✅ 单元号+关键词」就好，不用整段描述，详细内容清单表已经有了
3. 这份文件跟 `handoff.md` 是两回事：`handoff.md` 记流程/踩坑/待办，这份文件只做「现状总览」，不夹杂过程性内容
