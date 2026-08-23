-- 时刻大对决加上「课堂对垒 / 自由作答」两种模式（规格见 docs/tool-modes-spec.md）
--
-- 为什么要分开存：对垒模式有抢答压力、题数由老师定；自由作答可以慢慢想、还会计时。
-- 两者的成绩不可比，混在同一张榜上等于鼓励学生去刷比较好刷的那一种。

alter table public.tahun1_mt_masa_scores
  add column if not exists mode text not null default 'duel'
    check (mode in ('duel','solo')),
  add column if not exists elapsed_ms int;   -- 只有自由作答会记，对垒模式是 null

-- 「同一个人只留最好一局」的合并键要带 mode，否则两种模式会互相覆盖
drop index if exists tahun1_mt_masa_scores_key;
create unique index tahun1_mt_masa_scores_key
  on public.tahun1_mt_masa_scores (play_code, name, mode)
  where play_code is not null;

create or replace function public.submit_tahun1_mt_masa_score(
  p_play_code   text,
  p_class_label text,
  p_name        text,
  p_score       int,
  p_rounds      int,
  p_mode        text default 'duel',
  p_elapsed_ms  int  default null
)
returns table(best int, best_rounds int, best_elapsed_ms int, attempts int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_old_score int;
  v_old_rounds int;
  v_old_elapsed int;
  v_better boolean;
begin
  if p_rounds is null or p_rounds <= 0 then
    raise exception 'p_rounds must be positive';
  end if;
  if p_score is null or p_score < 0 or p_score > p_rounds then
    raise exception 'p_score must be between 0 and p_rounds';
  end if;
  if p_mode not in ('duel','solo') then
    raise exception 'p_mode must be duel or solo';
  end if;

  if p_play_code is not null then
    select s.id, s.score, s.rounds, s.elapsed_ms
      into v_id, v_old_score, v_old_rounds, v_old_elapsed
      from public.tahun1_mt_masa_scores s
      where s.play_code = p_play_code and s.name = p_name and s.mode = p_mode
      limit 1;
  end if;

  if v_id is not null then
    -- 对垒：先比正确率，正确率一样比题数多的那局
    -- 自由作答：先比正确率，正确率一样比用时短的那局
    if (p_score::numeric / p_rounds) <> (v_old_score::numeric / v_old_rounds) then
      v_better := (p_score::numeric / p_rounds) > (v_old_score::numeric / v_old_rounds);
    elsif p_mode = 'solo' then
      v_better := p_elapsed_ms is not null
                  and (v_old_elapsed is null or p_elapsed_ms < v_old_elapsed);
    else
      v_better := p_rounds > v_old_rounds;
    end if;

    return query
      update public.tahun1_mt_masa_scores t
      set score       = case when v_better then p_score      else t.score      end,
          rounds      = case when v_better then p_rounds     else t.rounds     end,
          elapsed_ms  = case when v_better then p_elapsed_ms else t.elapsed_ms end,
          attempts    = t.attempts + 1,
          class_label = p_class_label,
          updated_at  = now()
      where t.id = v_id
      returning t.score, t.rounds, t.elapsed_ms, t.attempts;
  else
    return query
      insert into public.tahun1_mt_masa_scores
        (play_code, class_label, name, score, rounds, mode, elapsed_ms, attempts)
      values (p_play_code, p_class_label, p_name, p_score, p_rounds, p_mode, p_elapsed_ms, 1)
      returning tahun1_mt_masa_scores.score,
                tahun1_mt_masa_scores.rounds,
                tahun1_mt_masa_scores.elapsed_ms,
                tahun1_mt_masa_scores.attempts;
  end if;
end;
$$;

-- 旧的 5 参数版本要丢掉，否则两个同名函数会让 PostgREST 无法决定呼叫哪一个
drop function if exists public.submit_tahun1_mt_masa_score(text, text, text, int, int);

grant execute on function
  public.submit_tahun1_mt_masa_score(text, text, text, int, int, text, int)
  to anon, authenticated;
