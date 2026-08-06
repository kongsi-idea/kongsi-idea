-- 幫 schools 补上官方 Kod Sekolah（马来西亚教育部真实学校代码），取代自动生成的占位代码
-- 背景：kelasku 上线后发现自动生成的 school_code（如 JH0043）跟老师认得的真实 Kod Sekolah（如 JBC1037）对不上
--
-- 数据来源与做法（本次由 Claude 直连数据库执行，不是纯 SQL migration，记录在这里方便日后重跑/接续）：
-- 1. 逐州重新抓马来文维基百科的原始 wikitext（跟 data/sjkc-schools.json 当初同一批来源页面），
--    这次额外把表格里原本就有、但当初收集时被漏掉的「Kod sekolah」栏位也抓出来
-- 2. 用「州属 + 中文校名完全一致」跟 schools 表做比对，比对上就把 school_code 换成真的 Kod Sekolah，
--    并标记 code_official = true；比对不上的维持原本自动生成的占位代码，code_official 保持 false
-- 3. 2026-08-06 第一批结果：1310 间里 975 间（约74%）换成真的官方代码，
--    剩下约335间（表格解析漏行 + 校名写法对不上）留着占位代码，清单存在
--    supabase/kod-sekolah-unmatched-2026-08-06.json，之后分批继续核对补齐

alter table public.schools add column if not exists code_official boolean not null default false;

-- 补充说明给以后接手的人：
-- - code_official = true 的代码可以放心当成真实官方码使用
-- - code_official = false 的代码目前只是「保证全国唯一」的占位符，不是真的 Kod Sekolah，
--   老师在 kelasku 手动补登记学校时新建的 school 也一律是 code_official = false
-- - 之后要继续核对，思路是扩大 data.gov.my 官方 2022 年小学名录（KODSEKOLAH/NAMASEKOLAH/NEGERI）
--   跟维基百科数据的比对范围，或修掉这次 wikitext 表格解析器漏掉 rowspan 合并儲存格那部分的 bug
