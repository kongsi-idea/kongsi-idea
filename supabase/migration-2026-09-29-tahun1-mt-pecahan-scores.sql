-- 燕菜切切乐（tahun1-mt-pecahan）排行榜：只记「燕菜铺开张」模式的星星（10 位客人，满分 30 颗）
-- 命名照 agents.md 约定用完整 slug 当前缀（连字号换底线）。
-- 结构照 tahun1_mt_masa_scores：公开可读、不开放直接写入，只能透过 SECURITY DEFINER 函数提交。

create table if not exists public.tahun1_mt_pecahan_scores (
  id uuid primary key default gen_random_uuid(),
  play_code text,            -- kelasku 班级代码；访客模式是 null
  class_label text not null, -- 显示用，例如 "1I" 或 "访客"
  name text not null,
  stars int not null,        -- 这一局得到的星星
  max_stars int not null,    -- 这一局满分（客人数 × 3）
  attempts int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tahun1_mt_pecahan_scores_code_idx
  on public.tahun1_mt_pecahan_scores (play_code);

alter table public.tahun1_mt_pecahan_scores enable row level security;

drop policy if exists "anyone can read tahun1_mt_pecahan scores" on public.tahun1_mt_pecahan_scores;
create policy "anyone can read tahun1_mt_pecahan scores"
  on public.tahun1_mt_pecahan_scores for select
  to anon, authenticated
  using (true);

-- 同一个 play_code + 姓名 只留最好的一笔（比星星占满分的比例，一样再比满分大的）。
-- 访客（play_code 为 null）不合并，每局各留一笔。
create or replace function public.submit_tahun1_mt_pecahan_score(
  p_play_code text,
  p_class_label text,
  p_name text,
  p_stars int,
  p_max_stars int
)
returns table(best int, best_max int, attempts int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_old int;
  v_old_max int;
  v_better boolean;
begin
  if p_max_stars is null or p_max_stars <= 0 or p_max_stars > 90 then
    raise exception 'p_max_stars out of range';
  end if;
  if p_stars is null or p_stars < 0 or p_stars > p_max_stars then
    raise exception 'p_stars must be between 0 and p_max_stars';
  end if;
  if p_name is null or length(trim(p_name)) = 0 or length(p_name) > 40 then
    raise exception 'p_name required (max 40 chars)';
  end if;
  if length(coalesce(p_class_label, '')) > 40 then
    raise exception 'p_class_label too long';
  end if;

  if p_play_code is not null then
    select s.id, s.stars, s.max_stars into v_id, v_old, v_old_max
      from public.tahun1_mt_pecahan_scores s
      where s.play_code = p_play_code and s.name = p_name
      limit 1;
  end if;

  if v_id is not null then
    v_better := (p_stars::numeric / p_max_stars) > (v_old::numeric / v_old_max)
             or ((p_stars::numeric / p_max_stars) = (v_old::numeric / v_old_max) and p_max_stars > v_old_max);
    return query
      update public.tahun1_mt_pecahan_scores t
      set stars      = case when v_better then p_stars     else t.stars     end,
          max_stars  = case when v_better then p_max_stars else t.max_stars end,
          attempts   = t.attempts + 1,
          class_label = coalesce(p_class_label, t.class_label),
          updated_at = now()
      where t.id = v_id
      returning t.stars, t.max_stars, t.attempts;
  else
    return query
      insert into public.tahun1_mt_pecahan_scores (play_code, class_label, name, stars, max_stars, attempts)
      values (p_play_code, coalesce(p_class_label, '访客'), trim(p_name), p_stars, p_max_stars, 1)
      returning tahun1_mt_pecahan_scores.stars,
                tahun1_mt_pecahan_scores.max_stars,
                tahun1_mt_pecahan_scores.attempts;
  end if;
end;
$$;

revoke all on function public.submit_tahun1_mt_pecahan_score(text, text, text, int, int) from public;
grant execute on function public.submit_tahun1_mt_pecahan_score(text, text, text, int, int) to anon, authenticated;
