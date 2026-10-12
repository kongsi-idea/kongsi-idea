-- 一年级10月数学练习（tahun1-mt-latihan-oktober）：逐题作答记录
-- 命名照 agents.md 约定用完整 slug 当前缀（连字号换底线）。
--
-- 和 tahun1_mt_pecahan_scores 的最大差别：这张表「只有老师看得到」。
--   anon（学生）：只能 insert，不能 select／update／delete（没有任何 anon policy 给这三种动作）。
--   authenticated：只能碰「自己是班级老师」的班（play_code 对应 classes，且 is_class_teacher(classes.id) 为真）。
-- 依赖：public.classes（play_code 唯一）、public.is_class_teacher(uuid)（migration-2026-08-12c）。
-- 注意（agents.md 第 17 条）：前端对这张表 insert 不可带 .select()／return=representation，
--   否则 RETURNING 要过 SELECT 检查，会撞 42501。

create table if not exists public.tahun1_mt_latihan_okt_answers (
  id uuid primary key default gen_random_uuid(),
  play_code text not null,                 -- Hub 班级代码（大写，如 JBC1037-1I）；没有访客模式，必填
  student_name text not null,              -- 名单里选的名字，或学生手动输入的名字
  in_roster boolean not null,              -- 名字是否来自名单（手动输入为 false，老师后台可合并）
  source text not null check (source in ('online', 'paper')),   -- 在线作答 / 老师回填纸本
  attempt_no int not null default 1,       -- 在线重做错题时递增；分析一律以 attempt_no = 1 为准
  item_id text not null,                   -- 题号，如 q3-1（见 bank.js）
  answer jsonb not null,                   -- 学生答案（格式由题型决定）
  is_correct boolean not null,             -- 写入者用 LatihanBank.grade 算
  error_tag text,                          -- grade 给的错误类型 key；答对为 null
  created_at timestamptz not null default now(),
  -- 基本形状限制（防乱灌，不影响正常使用）
  constraint latihan_okt_attempt_range check (attempt_no between 1 and 20),
  constraint latihan_okt_name_len check (char_length(btrim(student_name)) between 1 and 40),
  constraint latihan_okt_item_len check (char_length(item_id) between 1 and 20),
  constraint latihan_okt_tag_len check (error_tag is null or char_length(error_tag) <= 60),
  constraint latihan_okt_code_len check (char_length(play_code) between 1 and 40)
);

create index if not exists tahun1_mt_latihan_okt_answers_code_student_idx
  on public.tahun1_mt_latihan_okt_answers (play_code, student_name);
create index if not exists tahun1_mt_latihan_okt_answers_code_item_idx
  on public.tahun1_mt_latihan_okt_answers (play_code, item_id);

alter table public.tahun1_mt_latihan_okt_answers enable row level security;

-- 双保险：不靠 Supabase 默认授权，明确收回再只给需要的。
revoke all on public.tahun1_mt_latihan_okt_answers from anon, authenticated;
grant insert on public.tahun1_mt_latihan_okt_answers to anon;
grant select, insert, update, delete on public.tahun1_mt_latihan_okt_answers to authenticated;

-- ============================================================
-- anon：只能 insert
--   · source 必须是 online（纸本只有老师能写）
--   · answer 不能过大
--   · play_code 必须真的存在于 classes（classes 对 anon 本来就可读，exists 子查询可用）
-- 不建任何 anon 的 select／update／delete policy。
-- ============================================================
drop policy if exists "anon insert online latihan okt answers" on public.tahun1_mt_latihan_okt_answers;
create policy "anon insert online latihan okt answers"
  on public.tahun1_mt_latihan_okt_answers for insert
  to anon
  with check (
    source = 'online'
    and pg_column_size(answer) < 2000
    and exists (
      select 1 from public.classes c
      where c.play_code = tahun1_mt_latihan_okt_answers.play_code
    )
  );

-- ============================================================
-- authenticated（老师）：只限「自己是老师的班」
-- ============================================================
drop policy if exists "class teachers select latihan okt answers" on public.tahun1_mt_latihan_okt_answers;
create policy "class teachers select latihan okt answers"
  on public.tahun1_mt_latihan_okt_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun1_mt_latihan_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

drop policy if exists "class teachers insert latihan okt answers" on public.tahun1_mt_latihan_okt_answers;
create policy "class teachers insert latihan okt answers"
  on public.tahun1_mt_latihan_okt_answers for insert
  to authenticated
  with check (
    pg_column_size(answer) < 2000
    and exists (
      select 1 from public.classes c
      where c.play_code = tahun1_mt_latihan_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

-- update 的 using 看旧行、with check 看新行：两边都要是自己的班，避免把行「搬」到别人的班。
drop policy if exists "class teachers update latihan okt answers" on public.tahun1_mt_latihan_okt_answers;
create policy "class teachers update latihan okt answers"
  on public.tahun1_mt_latihan_okt_answers for update
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun1_mt_latihan_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  )
  with check (
    pg_column_size(answer) < 2000
    and exists (
      select 1 from public.classes c
      where c.play_code = tahun1_mt_latihan_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

drop policy if exists "class teachers delete latihan okt answers" on public.tahun1_mt_latihan_okt_answers;
create policy "class teachers delete latihan okt answers"
  on public.tahun1_mt_latihan_okt_answers for delete
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun1_mt_latihan_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );
