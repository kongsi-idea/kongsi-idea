-- 零用钱跑腿日（tahun2-mt-wang-practice，2026-10-20）：逐题作答记录（每题答对时送一笔，attempt_no＝第几次玩这一天；dN-money 是理财记录）
-- 命名照 agents.md 约定用完整 slug 当前缀（连字号换底线）。
--
-- 由 migration-2026-10-19-tahun1-mt-fuxi-pecahan-masa-answers.sql 只换表名／约束名／policy 名生成，结构与 RLS 逐条相同。和 tahun1_mt_pecahan_scores 的最大差别：这张表「只有老师看得到」。
--   anon（学生）：只能 insert，不能 select／update／delete（没有任何 anon policy 给这三种动作）。
--   authenticated：只能碰「自己是班级老师」的班（play_code 对应 classes，且 is_class_teacher(classes.id) 为真）。
-- 依赖：public.classes（play_code 唯一）、public.is_class_teacher(uuid)（migration-2026-08-12c）。
-- 注意（agents.md 第 17 条）：前端对这张表 insert 不可带 .select()／return=representation，
--   否则 RETURNING 要过 SELECT 检查，会撞 42501。

create table if not exists public.tahun2_mt_wang_practice_answers (
  id uuid primary key default gen_random_uuid(),
  play_code text not null,                 -- Hub 班级代码（大写，如 JBC1037-1I）；没有访客模式，必填
  student_name text not null,              -- 名单里选的名字，或学生手动输入的名字
  in_roster boolean not null,              -- 名字是否来自名单（手动输入为 false，老师后台可合并）
  source text not null check (source in ('online', 'paper')),   -- 在线作答 / 老师回填纸本
  attempt_no int not null default 1,       -- 第几次玩这一天（玩超过 20 次都记 20）；分析一律以 attempt_no = 1 为准
  item_id text not null,                   -- 题号，如 d1-05、d2-money（见 bank.js 的 Mt2WangBank）
  answer jsonb not null,                   -- 学生答案（格式由题型决定）
  is_correct boolean not null,             -- 第一次的答案对不对（Mt2WangBank.grade）
  error_tag text,                          -- grade 给的错误类型 key；答对为 null
  created_at timestamptz not null default now(),
  -- 基本形状限制（防乱灌，不影响正常使用）
  constraint tahun2_mt_wang_pr_attempt_range check (attempt_no between 1 and 20),
  constraint tahun2_mt_wang_pr_name_len check (char_length(btrim(student_name)) between 1 and 40),
  constraint tahun2_mt_wang_pr_item_len check (char_length(item_id) between 1 and 20),
  constraint tahun2_mt_wang_pr_tag_len check (error_tag is null or char_length(error_tag) <= 60),
  constraint tahun2_mt_wang_pr_code_len check (char_length(play_code) between 1 and 40)
);

create index if not exists tahun2_mt_wang_practice_answers_code_student_idx
  on public.tahun2_mt_wang_practice_answers (play_code, student_name);
create index if not exists tahun2_mt_wang_practice_answers_code_item_idx
  on public.tahun2_mt_wang_practice_answers (play_code, item_id);

alter table public.tahun2_mt_wang_practice_answers enable row level security;

-- 双保险：不靠 Supabase 默认授权，明确收回再只给需要的。
revoke all on public.tahun2_mt_wang_practice_answers from anon, authenticated;
grant insert on public.tahun2_mt_wang_practice_answers to anon;
grant select, insert, update, delete on public.tahun2_mt_wang_practice_answers to authenticated;

-- ============================================================
-- anon：只能 insert
--   · source 必须是 online（纸本只有老师能写）
--   · answer 不能过大
--   · play_code 必须真的存在于 classes（classes 对 anon 本来就可读，exists 子查询可用）
-- 不建任何 anon 的 select／update／delete policy。
-- ============================================================
drop policy if exists "anon insert online wang practice answers" on public.tahun2_mt_wang_practice_answers;
create policy "anon insert online wang practice answers"
  on public.tahun2_mt_wang_practice_answers for insert
  to anon
  with check (
    source = 'online'
    and pg_column_size(answer) < 2000
    and exists (
      select 1 from public.classes c
      where c.play_code = tahun2_mt_wang_practice_answers.play_code
    )
  );

-- ============================================================
-- authenticated（老师）：只限「自己是老师的班」
-- ============================================================
drop policy if exists "class teachers select wang practice answers" on public.tahun2_mt_wang_practice_answers;
create policy "class teachers select wang practice answers"
  on public.tahun2_mt_wang_practice_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun2_mt_wang_practice_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

drop policy if exists "class teachers insert wang practice answers" on public.tahun2_mt_wang_practice_answers;
create policy "class teachers insert wang practice answers"
  on public.tahun2_mt_wang_practice_answers for insert
  to authenticated
  with check (
    pg_column_size(answer) < 2000
    and exists (
      select 1 from public.classes c
      where c.play_code = tahun2_mt_wang_practice_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

-- update 的 using 看旧行、with check 看新行：两边都要是自己的班，避免把行「搬」到别人的班。
drop policy if exists "class teachers update wang practice answers" on public.tahun2_mt_wang_practice_answers;
create policy "class teachers update wang practice answers"
  on public.tahun2_mt_wang_practice_answers for update
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun2_mt_wang_practice_answers.play_code
        and public.is_class_teacher(c.id)
    )
  )
  with check (
    pg_column_size(answer) < 2000
    and exists (
      select 1 from public.classes c
      where c.play_code = tahun2_mt_wang_practice_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

drop policy if exists "class teachers delete wang practice answers" on public.tahun2_mt_wang_practice_answers;
create policy "class teachers delete wang practice answers"
  on public.tahun2_mt_wang_practice_answers for delete
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun2_mt_wang_practice_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );
