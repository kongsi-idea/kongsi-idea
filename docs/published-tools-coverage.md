# 已上架工具总览（覆盖情况一览）

> 每次有新工具真正上架（`status: "published"`），都要回来更新这份文件——目的是让「这个平台还缺什么」一眼看得出来，不用回头翻 `app.js` 逐条数。
> 资料来源：`app.js` 里 `status: "published"` 的条目 + `data/dskp-index.js` 里对应的 `standards` 引用。示例作品（`isDemo: true`）不算，因为不是真的工具。

## 已上架工具清单

| slug | 年级 | 科目 | 名称 | 对应 DSKP 单元/学习标准 | 上线网址 | 本机源码 |
|---|---|---|---|---|---|---|
| `tahun2-mt-wang` | Tahun 2 | 数学 (mt) | 钱币乐园 | 4.0 钱币 — 4.1/4.2/4.3/4.6 | https://tahun2-mt-wang.vercel.app | `../teaching-tools/tahun2-mt-wang/` |
| `tahun1-mt-bundar` | Tahun 1 | 数学 (mt) | 近似值特快车 | 1.0 数与运算 — 1.8 近似值 | https://tahun1-mt-bundar.vercel.app | `../teaching-tools/tahun1-mt-bundar/` |
| `tahun4-mt-nombor` | Tahun 4 | 数学 (mt) | 数学知识大比拼 | 1.0 数与运算 — 1.1 数值 | https://tahun4-mt-nombor.vercel.app | `../teaching-tools/tahun4-mt-nombor/` |
| `tahun1-bc-shizi` | Tahun 1 | 华文 (bc) | 识字大对决 | 2.0 阅读技能 — 2.1 阅读与理解教材 | https://tahun1-bc-shizi.vercel.app | `../teaching-tools/tahun1-bc-shizi/` |
| `tahun1-bm-kvkv` | Tahun 1 | 马来文 (bm) | KVKV音节打地鼠 | 2.0 阅读技能 — 2.1 基础阅读与理解 | https://tahun1-bm-kvkv.vercel.app | `../teaching-tools/tahun1-bm-kvkv/` |
| `tahun1-bc-bushou` | Tahun 1 | 华文 (bc) | 部首大对垒 | 5.0 语文基础知识 — 5.1 汉字基本知识 | https://tahun1-bc-bushou.vercel.app | `../teaching-tools/tahun1-bc-bushou/` |
| `tahun1-bc-zaoju` | Tahun 1 | 华文 (bc) | 神奇句子小火车 | 3.0 书写技能 — 3.2 书面表达能力 | https://tahun1-bc-zaoju.vercel.app | `../teaching-tools/tahun1-bc-zaoju/` |
| `tahun2-mt-shuzhi` | Tahun 2 | 数学 (mt) | 苹果果园数学 | 1.0 数与运算 — 1.4 数位 | https://tahun2-mt-shuzhi.vercel.app | `../teaching-tools/tahun2-mt-shuzhi/` |
| `tahun2-mt-shulie-explore` | Tahun 2 | 数学 (mt) | 数序列小探险 | 1.0 数与运算 — 1.7 有规律的数列 | https://tahun2-mt-shulie-explore.vercel.app | `../teaching-tools/tahun2-mt-shulie-explore/` |
| `tahun2-mt-shulie-boss` | Tahun 2 | 数学 (mt) | 数字数列大对决 | 1.0 数与运算 — 1.7 有规律的数列 | https://tahun2-mt-shulie-boss.vercel.app | `../teaching-tools/tahun2-mt-shulie-boss/` |
| `tahun2-mt-shulie-duel` | Tahun 2 | 数学 (mt) | 双人数字对决 | 1.0 数与运算 — 1.7 有规律的数列 | https://tahun2-mt-shulie-duel.vercel.app | `../teaching-tools/tahun2-mt-shulie-duel/` |
| `tahun2-mt-baigetu` | Tahun 2 | 数学 (mt) | 百格图乘法表动画 | 2.0 基本运算 — 2.3 乘法 | https://tahun2-mt-baigetu.vercel.app | `../teaching-tools/tahun2-mt-baigetu/` |
| `tahun3-bc-kewen` | Tahun 3 | 华文 (bc) | 语文课文大PK | 2.0 阅读技能 — 2.1 阅读与理解教材 | https://tahun3-bc-kewen.vercel.app | `../teaching-tools/tahun3-bc-kewen/` |
| `tahun1-dst-magnet` | Tahun 1 | 科学 (dst) | 磁铁大发现 | 7.1 磁铁 — 7.1.1/7.1.2/7.1.3/7.1.4 | https://tahun1-dst-magnet.vercel.app | `../teaching-tools/tahun1-dst-magnet/` |
| `tahun3-dst-density` | Tahun 3 | 科学 (dst) | 浮沉实验室：密度大发现 | 7.1 密度 — 7.1.1/7.1.2/7.1.3/7.1.4 | https://tahun3-dst-density.vercel.app | `../teaching-tools/tahun3-dst-density/` |

## 年级 × 科目覆盖矩阵

科目缩写对照见 `app.js` 的 `SUBJECTS`：bm马来文／bi英文／bc华文／mt数学／dst科学与科技世界(1-3)／sains科学(4-6)／sejarah历史(4-6)／rbt设计与工艺(4-6)／islam伊斯兰／moral道德／seni视觉艺术／muzik音乐／pjpk体育与健康

| 年级 \ 科目 | bm | bi | bc | mt | dst/sains | sejarah | rbt | islam | moral | seni | muzik | pjpk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tahun 1 | ✅ 2.1音节 | — | ✅ 2.1/3.2/5.1 (3个) | ✅ 1.8近似值 | ✅ 7.1磁铁 | — | — | — | — | — | — | — |
| Tahun 2 | — | — | — | ✅ 4.0钱币/1.4数位/1.7数列(3个)/2.3乘法 (共5个) | — | — | — | — | — | — | — | — |
| Tahun 3 | — | — | ✅ 2.1课文理解 | — | ✅ 7.1密度 | — | — | — | — | — | — | — | — |
| Tahun 4 | — | — | — | ✅ 1.1数值 | — | — | — | — | — | — | — | — |
| Tahun 5 | — | — | — | — | — | — | — | — | — | — | — | — |
| Tahun 6 | — | — | — | — | — | — | — | — | — | — | — | — |

**一眼看出的缺口**（2026-07-21 更新）：15 个工具，Tahun 1/2 数学+华文仍最密集，Tahun 2 数学一个年级就占了 5 个（钱币/数位/数列×3/乘法），但每个工具教学场景不同（solo/双人/整班），不算重复堆砌。科学工具增加到 2 个：`tahun1-dst-magnet`（磁铁）+ `tahun3-dst-density`（密度浮沉），两个都是自主开发不靠老师投稿。**英文（bi）、历史/设计与工艺/伊斯兰/道德/视觉艺术/音乐/体育 这 7 个科目仍然完全空白**；数学 Tahun 3/5/6、华文 Tahun 2/4/5/6、马来文 Tahun 2-6、科学 Tahun 2/4/5/6 也都还空着。下次找素材/构思新工具时优先看这些空科目/年级。

**关于自主开发（不靠老师投稿）**：`tahun1-dst-magnet`「磁铁大发现」是本平台第一个不来自 `yquan77/teaching-tools` 素材、而是直接照 `docs/dskp/` 内容标准自己设计构思的工具——用户确认这条路径可行（不只是等老师给点子，也可以自己照 DSKP 找空白年级/科目主动开发），但强调核心玩法/教学设计还是要用户本人的教学判断把关，不是纯粹照表操课。以后可以持续沿用这个模式补齐上面列出的空白科目。

**关于"参考成熟设计再自研"这条新路径**：`tahun3-dst-density`「浮沉实验室」是第一个采用这个做法的工具——用户观察到磁铁工具上线后有不少 bug/操作问题，提出与其从零发明互动机制，不如先跨中文/马来文/英文三语搜索这个学习目标已有的优秀教育游戏/模拟，参考其中被验证有效的机制（不是抄代码/素材），再重新设计实现成自己的版本。这次搜索找到的最佳参考是科罗拉多大学 PhET 团队的 Density 模拟（GPLv3 开源，可读源码学习，但代码本身较复杂——只借鉴了「质量体积→丢入水中→按密度浮沉→可调液体密度」这个核心机制概念，没有照搬代码）。以后遇到功能类似、已有成熟案例的学习目标，可以优先考虑这条路径。

**这次因内容重复或版本被取代而没有搬的**：`二年级数位与数值分析.html`（内含两个子工具，各只有2-3道写死题目，被功能更完整的「苹果果园数学」取代）。`yquan77/teaching-tools` 仓库里的教学向素材已经全部处理完，剩下的都是非教学工具（LDP系列/家庭相关/摊位报告/班级果实树等），不属于这条流水线。

## 更新方法
1. 新工具 `status` 改成 `published` 且加了真实 `standards` 字段后，回来这份文件加一行清单 + 在矩阵里把对应格子改成 ✅
2. 矩阵格子里简短写「✅ 单元号+关键词」就好，不用整段描述，详细内容清单表已经有了
3. 这份文件跟 `handoff.md` 是两回事：`handoff.md` 记流程/踩坑/待办，这份文件只做「现状总览」，不夹杂过程性内容
