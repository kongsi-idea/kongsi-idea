-- 综合挑战（tahun2-bc-zonghe）专属排行榜
-- 正式主线共 22 题，最高分 800；每题最多一颗宝石。

create table if not exists public.tahun2_bc_zonghe_scores (
  id uuid primary key default gen_random_uuid(),
  play_code text,                    -- 班级／游戏代码；访客模式为 null
  class_label text not null,          -- 显示用班级名称或「访客」
  member_key text not null,           -- trim 后、转小写并排序的姓名键
  member_names text[] not null,
  team_size int not null check (team_size between 2 and 3),
  score int not null check (score between 0 and 800),
  gems int not null check (gems between 0 and 22),
  attempts int not null default 1 check (attempts > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tahun2_bc_zonghe_scores_member_key_length
    check (char_length(member_key) between 3 and 56),
  constraint tahun2_bc_zonghe_scores_member_names_size
    check (cardinality(member_names) between 2 and 3),
  constraint tahun2_bc_zonghe_scores_play_code_length
    check (play_code is null or char_length(play_code) between 3 and 120),
  constraint tahun2_bc_zonghe_scores_class_label_length
    check (char_length(class_label) between 1 and 40),
  constraint tahun2_bc_zonghe_scores_team_size_matches_names
    check (team_size = cardinality(member_names))
);

comment on table public.tahun2_bc_zonghe_scores is
  'tahun2-bc-zonghe public scores; visitors create one row per play, coded plays keep their best result';
comment on column public.tahun2_bc_zonghe_scores.member_key is
  'Lowercase, trimmed, deterministically sorted member names joined with |';
comment on column public.tahun2_bc_zonghe_scores.attempts is
  'Number of submissions for this play_code/member_key pair; visitors remain at one per row';

alter table public.tahun2_bc_zonghe_scores enable row level security;

drop policy if exists "anyone can read tahun2_bc_zonghe scores"
  on public.tahun2_bc_zonghe_scores;
create policy "anyone can read tahun2_bc_zonghe scores"
  on public.tahun2_bc_zonghe_scores for select
  to anon, authenticated
  using (true);

-- 只允许公开读取；写入必须经过下面的 SECURITY DEFINER 函数。
revoke all on table public.tahun2_bc_zonghe_scores from anon, authenticated, public;
grant select on table public.tahun2_bc_zonghe_scores to anon, authenticated;

create index if not exists tahun2_bc_zonghe_scores_leaderboard
  on public.tahun2_bc_zonghe_scores (score desc, gems desc, updated_at desc);
create index if not exists tahun2_bc_zonghe_scores_play_code
  on public.tahun2_bc_zonghe_scores (play_code)
  where play_code is not null;
create unique index if not exists tahun2_bc_zonghe_scores_play_member_key
  on public.tahun2_bc_zonghe_scores (play_code, member_key)
  where play_code is not null;

create or replace function public.submit_tahun2_bc_zonghe_score(
  p_play_code text,
  p_class_label text,
  p_member_key text,
  p_member_names text[],
  p_team_size int,
  p_score int,
  p_gems int
)
returns table(best_score int, best_gems int, attempts int)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_play_code text := nullif(btrim(p_play_code), '');
  v_class_label text := btrim(p_class_label);
  v_names text[];
  v_name text;
  v_expected_key text;
  v_best_score int;
  v_best_gems int;
  v_attempts int;
begin
  if p_member_names is null or cardinality(p_member_names) not between 2 and 3 then
    raise exception 'p_member_names must contain 2 or 3 names';
  end if;
  if p_team_size is null or p_team_size <> cardinality(p_member_names) then
    raise exception 'p_team_size must match the number of names';
  end if;
  if v_play_code is not null and char_length(v_play_code) not between 3 and 120 then
    raise exception 'p_play_code must be null or 3 to 120 characters';
  end if;
  if v_class_label is null or char_length(v_class_label) not between 1 and 40 then
    raise exception 'p_class_label must be 1 to 40 characters';
  end if;

  v_names := array[]::text[];
  foreach v_name in array p_member_names loop
    if v_name is null or char_length(btrim(v_name)) not between 1 and 18 then
      raise exception 'each member name must be 1 to 18 characters after trimming';
    end if;
    v_names := v_names || btrim(v_name);
  end loop;

  select string_agg(lower(n), '|' order by lower(n), n)
    into v_expected_key
    from unnest(v_names) as names(n);

  if (select count(distinct lower(n)) from unnest(v_names) as names(n)) <> cardinality(v_names) then
    raise exception 'member names must be distinct';
  end if;

  if p_member_key is null
     or char_length(p_member_key) not between 3 and 56
     or p_member_key <> v_expected_key then
    raise exception 'p_member_key must be the normalized sorted member key';
  end if;
  if p_score is null or p_score not between 0 and 800 then
    raise exception 'p_score must be between 0 and 800';
  end if;
  if p_gems is null or p_gems not between 0 and 22 then
    raise exception 'p_gems must be between 0 and 22';
  end if;

  insert into public.tahun2_bc_zonghe_scores
    (play_code, class_label, member_key, member_names, team_size, score, gems, attempts)
  values
    (v_play_code, v_class_label, p_member_key, v_names, p_team_size, p_score, p_gems, 1)
  on conflict (play_code, member_key) where play_code is not null
  do update set
    class_label = excluded.class_label,
    member_names = excluded.member_names,
    team_size = excluded.team_size,
    score = case
      when excluded.score > tahun2_bc_zonghe_scores.score
        or (excluded.score = tahun2_bc_zonghe_scores.score
            and excluded.gems > tahun2_bc_zonghe_scores.gems)
        then excluded.score
      else tahun2_bc_zonghe_scores.score
    end,
    gems = case
      when excluded.score > tahun2_bc_zonghe_scores.score
        or (excluded.score = tahun2_bc_zonghe_scores.score
            and excluded.gems > tahun2_bc_zonghe_scores.gems)
        then excluded.gems
      else tahun2_bc_zonghe_scores.gems
    end,
    attempts = tahun2_bc_zonghe_scores.attempts + 1,
    updated_at = now()
  returning tahun2_bc_zonghe_scores.score,
            tahun2_bc_zonghe_scores.gems,
            tahun2_bc_zonghe_scores.attempts
    into v_best_score, v_best_gems, v_attempts;

  return query select v_best_score, v_best_gems, v_attempts;
end;
$$;

revoke execute on function
  public.submit_tahun2_bc_zonghe_score(text, text, text, text[], int, int, int)
  from public;
grant execute on function
  public.submit_tahun2_bc_zonghe_score(text, text, text, text[], int, int, int)
  to anon, authenticated;

comment on function public.submit_tahun2_bc_zonghe_score(text, text, text, text[], int, int, int) is
  'Submit a tahun2-bc-zonghe score; coded plays merge by play_code/member_key and visitors insert per play';
