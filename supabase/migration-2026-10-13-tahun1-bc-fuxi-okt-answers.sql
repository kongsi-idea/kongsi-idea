-- 一年级10月华文复习本（tahun1-bc-fuxi-oktober）：逐题作答记录
-- 命名照 agents.md 约定用完整 slug 当前缀（连字号换底线）。结构抄自 migration-2026-10-12-tahun1-mt-latihan-okt-answers.sql。
--
-- 这张表「只有老师看得到」：
--   anon（学生）：只能 insert，不能 select／update／delete（没有任何 anon policy 给这三种动作）。
--   authenticated：只能碰「自己是班级老师」的班（play_code 对应 classes，且 is_class_teacher(classes.id) 为真）。
--     · select／delete：整行
--     · update：只给「合并名字」用，column-level 授权只含 student_name、in_roster
--     · insert：不给（老师不需要代学生写；华文这支没有纸本回填）
-- 和数学那张的差别：没有 source 栏（全部在线）；is_correct 可为 null（写作题不批改）。
-- 依赖：public.classes（play_code 唯一）、public.is_class_teacher(uuid)（migration-2026-08-12c）。
-- 注意（agents.md 第 17 条）：前端对这张表 insert 不可带 .select()／return=representation，
--   否则 RETURNING 要过 SELECT 检查，会撞 42501。

create table if not exists public.tahun1_bc_fuxi_okt_answers (
  id uuid primary key default gen_random_uuid(),
  play_code text not null,                 -- Hub 班级代码（大写，如 JBC1037-1I）；没有访客模式，必填
  student_name text not null,              -- 名单里选的名字，或学生手动输入的名字
  in_roster boolean not null,              -- 名字是否来自名单（手动输入为 false，老师后台可合并）
  attempt_no int not null default 1,       -- 第一次作答 1；答错后「再试一次」为 2。分析一律以 attempt_no = 1 为准
  item_id text not null,                   -- 题号，如 a1、g5（见 bank.js）
  answer jsonb not null,                   -- {"v": 字符串或字符串数组}
  is_correct boolean,                      -- 批改题 true／false；写作题为 null
  error_tag text,                          -- grade 给的错误类别 key；答对／写作为 null
  created_at timestamptz not null default now(),
  -- 基本形状限制（防乱灌，不影响正常使用）
  constraint fuxi_okt_attempt_range check (attempt_no between 1 and 20),
  constraint fuxi_okt_name_len check (char_length(btrim(student_name)) between 1 and 40),
  constraint fuxi_okt_item_fmt check (item_id ~ '^[a-h][0-9]{1,2}$'),
  constraint fuxi_okt_tag_len check (error_tag is null or char_length(error_tag) <= 60),
  constraint fuxi_okt_code_len check (char_length(play_code) between 1 and 40),
  constraint fuxi_okt_answer_shape check (jsonb_typeof(answer) = 'object' and answer ? 'v')
);

create index if not exists tahun1_bc_fuxi_okt_answers_code_student_idx
  on public.tahun1_bc_fuxi_okt_answers (play_code, student_name);
create index if not exists tahun1_bc_fuxi_okt_answers_code_item_idx
  on public.tahun1_bc_fuxi_okt_answers (play_code, item_id);

alter table public.tahun1_bc_fuxi_okt_answers enable row level security;

-- 双保险：不靠 Supabase 默认授权，明确收回再只给需要的。
revoke all on public.tahun1_bc_fuxi_okt_answers from anon, authenticated;
grant insert on public.tahun1_bc_fuxi_okt_answers to anon;
grant select, delete on public.tahun1_bc_fuxi_okt_answers to authenticated;
grant update (student_name, in_roster) on public.tahun1_bc_fuxi_okt_answers to authenticated;   -- 只给「合并名字」

-- ============================================================
-- anon：只能 insert
--   · answer 不能过大
--   · play_code 必须真的存在于 classes（classes 对 anon 本来就可读，exists 子查询可用）
-- 不建任何 anon 的 select／update／delete policy。
-- ============================================================
drop policy if exists "anon insert fuxi okt answers" on public.tahun1_bc_fuxi_okt_answers;
create policy "anon insert fuxi okt answers"
  on public.tahun1_bc_fuxi_okt_answers for insert
  to anon
  with check (
    pg_column_size(answer) < 2000
    and exists (
      select 1 from public.classes c
      where c.play_code = tahun1_bc_fuxi_okt_answers.play_code
    )
  );

-- ============================================================
-- authenticated（老师）：只限「自己是老师的班」
-- ============================================================
drop policy if exists "class teachers select fuxi okt answers" on public.tahun1_bc_fuxi_okt_answers;
create policy "class teachers select fuxi okt answers"
  on public.tahun1_bc_fuxi_okt_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun1_bc_fuxi_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

-- update 的 using 看旧行、with check 看新行；play_code 本来就没有 update 权限，不会被搬到别的班。
drop policy if exists "class teachers update fuxi okt answers" on public.tahun1_bc_fuxi_okt_answers;
create policy "class teachers update fuxi okt answers"
  on public.tahun1_bc_fuxi_okt_answers for update
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun1_bc_fuxi_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  )
  with check (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun1_bc_fuxi_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );

drop policy if exists "class teachers delete fuxi okt answers" on public.tahun1_bc_fuxi_okt_answers;
create policy "class teachers delete fuxi okt answers"
  on public.tahun1_bc_fuxi_okt_answers for delete
  to authenticated
  using (
    exists (
      select 1 from public.classes c
      where c.play_code = tahun1_bc_fuxi_okt_answers.play_code
        and public.is_class_teacher(c.id)
    )
  );
