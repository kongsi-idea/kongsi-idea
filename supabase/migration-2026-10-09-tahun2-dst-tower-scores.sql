-- 科学叠叠塔（tahun2-dst-tower）班级排行榜
-- 骨架照抄 migration-2026-09-21-tahun2-bc-zonghe-scores.sql：公开可读，写入只能走 SECURITY DEFINER 函数。
-- 排行榜限定要有班级代码（play_code）才记录；访客不上榜，所以 play_code 不允许 null。
-- 每个「班级＋学生＋题库」只留历史最高塔，attempts 记提交次数。

create table if not exists public.tahun2_dst_tower_scores (
  id uuid primary key default gen_random_uuid(),
  play_code text not null,            -- kelasku 班级代码，例如 JBC1037-1A
  class_label text not null,          -- 显示用班级名称
  student_key text not null,          -- 座号|姓名，同班同名靠座号区分
  name text not null,
  unit text not null,                 -- 题库 id：light／mixtures
  height int not null check (height between 0 and 5000),
  blocks int not null default 0 check (blocks between 0 and 600),
  correct int not null default 0 check (correct between 0 and 600),
  attempts int not null default 0 check (attempts between 0 and 600),
  plays int not null default 1 check (plays > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tahun2_dst_tower_scores_correct_le_attempts check (correct <= attempts),
  constraint tahun2_dst_tower_scores_play_code_length check (char_length(play_code) between 3 and 120),
  constraint tahun2_dst_tower_scores_class_label_length check (char_length(class_label) between 1 and 40),
  constraint tahun2_dst_tower_scores_name_length check (char_length(name) between 1 and 40),
  constraint tahun2_dst_tower_scores_student_key_length check (char_length(student_key) between 3 and 60),
  constraint tahun2_dst_tower_scores_unit_valid check (unit in ('light', 'mixtures'))
);

comment on table public.tahun2_dst_tower_scores is
  'tahun2-dst-tower class leaderboard; one best-height row per play_code/student_key/unit';

alter table public.tahun2_dst_tower_scores enable row level security;

drop policy if exists "anyone can read tahun2_dst_tower scores"
  on public.tahun2_dst_tower_scores;
create policy "anyone can read tahun2_dst_tower scores"
  on public.tahun2_dst_tower_scores for select
  to anon, authenticated
  using (true);

-- 只允许公开读取；写入必须经过下面的 SECURITY DEFINER 函数。
revoke all on table public.tahun2_dst_tower_scores from anon, authenticated, public;
grant select on table public.tahun2_dst_tower_scores to anon, authenticated;

create index if not exists tahun2_dst_tower_scores_board
  on public.tahun2_dst_tower_scores (play_code, unit, height desc, updated_at);
create unique index if not exists tahun2_dst_tower_scores_student_unit
  on public.tahun2_dst_tower_scores (play_code, student_key, unit);

create or replace function public.submit_tahun2_dst_tower_score(
  p_play_code text,
  p_class_label text,
  p_student_key text,
  p_name text,
  p_unit text,
  p_height int,
  p_blocks int,
  p_correct int,
  p_attempts int
)
returns table(best_height int, plays int)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_play_code text := btrim(p_play_code);
  v_class_label text := btrim(p_class_label);
  v_name text := btrim(p_name);
  v_key text := btrim(p_student_key);
  v_best int;
  v_plays int;
begin
  if v_play_code is null or char_length(v_play_code) not between 3 and 120 then
    raise exception 'p_play_code must be 3 to 120 characters';
  end if;
  if v_class_label is null or char_length(v_class_label) not between 1 and 40 then
    raise exception 'p_class_label must be 1 to 40 characters';
  end if;
  if v_name is null or char_length(v_name) not between 1 and 40 then
    raise exception 'p_name must be 1 to 40 characters';
  end if;
  if v_key is null or char_length(v_key) not between 3 and 60 then
    raise exception 'p_student_key must be 3 to 60 characters';
  end if;
  if p_unit is null or p_unit not in ('light', 'mixtures') then
    raise exception 'p_unit must be light or mixtures';
  end if;
  if p_height is null or p_height not between 0 and 5000 then
    raise exception 'p_height must be between 0 and 5000';
  end if;
  if p_blocks is null or p_blocks not between 0 and 600 then
    raise exception 'p_blocks must be between 0 and 600';
  end if;
  if p_attempts is null or p_attempts not between 0 and 600
     or p_correct is null or p_correct not between 0 and p_attempts then
    raise exception 'p_correct must be between 0 and p_attempts (max 600)';
  end if;

  insert into public.tahun2_dst_tower_scores as s
    (play_code, class_label, student_key, name, unit, height, blocks, correct, attempts, plays)
  values
    (v_play_code, v_class_label, v_key, v_name, p_unit, p_height, p_blocks, p_correct, p_attempts, 1)
  on conflict (play_code, student_key, unit)
  do update set
    class_label = excluded.class_label,
    name = excluded.name,
    height = greatest(s.height, excluded.height),
    blocks = case when excluded.height > s.height then excluded.blocks else s.blocks end,
    correct = case when excluded.height > s.height then excluded.correct else s.correct end,
    attempts = case when excluded.height > s.height then excluded.attempts else s.attempts end,
    plays = s.plays + 1,
    updated_at = now()
  returning s.height, s.plays into v_best, v_plays;

  return query select v_best, v_plays;
end;
$$;

revoke execute on function
  public.submit_tahun2_dst_tower_score(text, text, text, text, text, int, int, int, int)
  from public;
grant execute on function
  public.submit_tahun2_dst_tower_score(text, text, text, text, text, int, int, int, int)
  to anon, authenticated;

comment on function public.submit_tahun2_dst_tower_score(text, text, text, text, text, int, int, int, int) is
  'Submit a tahun2-dst-tower score; keeps the best height per play_code/student_key/unit';
