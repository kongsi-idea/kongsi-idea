-- 时刻大对决（tahun1-mt-masa）专属排行榜
-- 命名照 agents.md 的约定用完整 slug 当前缀（连字号换底线），不只取「masa」这个关键词，
-- 免得以后出现 tahun2-mt-masa / tahun3-mt-masa 时抢同一张表（2026-08-12 量词那次踩过）。

create table if not exists public.tahun1_mt_masa_scores (
  id uuid primary key default gen_random_uuid(),
  play_code text,            -- kelasku 班级代码；没选班级（访客模式）时是 null
  class_label text not null, -- 显示用，例如 "1I 班" 或 "访客"
  name text not null,
  score int not null,        -- 一局里答对的题数
  rounds int not null,       -- 这一局总共几题（好让排行榜能显示 8/10 而不只是 8）
  attempts int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tahun1_mt_masa_scores enable row level security;

-- 排行榜要给所有人（含未登录学生）看，读取全开
drop policy if exists "anyone can read tahun1_mt_masa scores" on public.tahun1_mt_masa_scores;
create policy "anyone can read tahun1_mt_masa scores"
  on public.tahun1_mt_masa_scores for select
  to anon, authenticated
  using (true);

-- 刻意不开放 insert/update/delete 给 anon/authenticated：
-- 只能透过下面的 SECURITY DEFINER 函数提交成绩，避免有人直接写入或篡改任意分数。

-- 同一个 play_code + 姓名 只留历史最好的那一笔。
-- 「最好」的定义：先比正确率，正确率一样再比题数多的那笔（10题全对 > 4题全对）。
-- 访客模式（play_code 为 null）不合并，每局各留一笔。
create or replace function public.submit_tahun1_mt_masa_score(
  p_play_code text,
  p_class_label text,
  p_name text,
  p_score int,
  p_rounds int
)
returns table(best int, best_rounds int, attempts int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_old_score int;
  v_old_rounds int;
  v_better boolean;
begin
  if p_rounds is null or p_rounds <= 0 then
    raise exception 'p_rounds must be positive';
  end if;
  if p_score is null or p_score < 0 or p_score > p_rounds then
    raise exception 'p_score must be between 0 and p_rounds';
  end if;

  if p_play_code is not null then
    select s.id, s.score, s.rounds
      into v_id, v_old_score, v_old_rounds
      from public.tahun1_mt_masa_scores s
      where s.play_code = p_play_code and s.name = p_name
      limit 1;
  end if;

  if v_id is not null then
    v_better := (p_score::numeric / p_rounds) > (v_old_score::numeric / v_old_rounds)
             or ((p_score::numeric / p_rounds) = (v_old_score::numeric / v_old_rounds)
                 and p_rounds > v_old_rounds);

    return query
      update public.tahun1_mt_masa_scores t
      set score      = case when v_better then p_score  else t.score  end,
          rounds     = case when v_better then p_rounds else t.rounds end,
          attempts   = t.attempts + 1,
          class_label = p_class_label,
          updated_at = now()
      where t.id = v_id
      returning t.score, t.rounds, t.attempts;
  else
    return query
      insert into public.tahun1_mt_masa_scores (play_code, class_label, name, score, rounds, attempts)
      values (p_play_code, p_class_label, p_name, p_score, p_rounds, 1)
      returning tahun1_mt_masa_scores.score,
                tahun1_mt_masa_scores.rounds,
                tahun1_mt_masa_scores.attempts;
  end if;
end;
$$;

grant execute on function public.submit_tahun1_mt_masa_score(text, text, text, int, int) to anon, authenticated;
