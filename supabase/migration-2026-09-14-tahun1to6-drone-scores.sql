-- 飞学竞场（tahun1to6-drone）班级排行榜，照抄 migration-2026-08-12-liangci-scores.sql 的
-- RLS/RPC 骨架。跟 liangci 不同的是：这个工具的排行榜限定要有班级代码才启用（没有公开/GUEST 模式），
-- 而且游戏有两种玩法（穿环竞速／答题竞速）× 三种难度，所以用 mode + difficulty 分榜，
-- 不再细分年级/学科——这跟游戏本机最佳成绩的 key（mode:difficulty:control）保持同一套简化逻辑。
-- 命名沿用「工具代号前缀」约定：tahun1to6_drone_scores 只属于这个工具，不跟其他工具共用。

create table public.tahun1to6_drone_scores (
  id uuid primary key default gen_random_uuid(),
  play_code text,            -- kelasku 班级代码
  class_label text not null, -- 显示用，例如 "1I 班"
  name text not null,
  mode text not null check (mode in ('race', 'quiz')),
  difficulty text not null check (difficulty in ('easy', 'normal', 'hard')),
  score int not null check (score >= 0 and score <= 999),
  attempts int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tahun1to6_drone_scores enable row level security;

-- 排行榜要给所有人看，读取全开（跟 liangci_scores 同一套模型：class_label/play_code 隔离
-- 靠前端查询时加 .eq('play_code', code)，不是靠 RLS 强制——这是平台既有、一致的取舍）
create policy "anyone can read tahun1to6 drone scores"
  on public.tahun1to6_drone_scores for select
  to anon, authenticated
  using (true);

-- 刻意不开放 insert/update/delete 给 anon/authenticated：只能透过下面的
-- SECURITY DEFINER 函数提交成绩，避免有人直接写入/篡改任意分数

-- 同一个 play_code + 姓名 + 玩法 + 难度 只留历史最高分那一笔
create or replace function public.submit_tahun1to6_drone_score(
  p_play_code text, p_class_label text, p_name text,
  p_mode text, p_difficulty text, p_score int
)
returns table(best int, attempts int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id from public.tahun1to6_drone_scores
    where play_code = p_play_code and name = p_name and mode = p_mode and difficulty = p_difficulty
    limit 1;

  if v_id is not null then
    return query
      update public.tahun1to6_drone_scores
      set score = greatest(tahun1to6_drone_scores.score, p_score),
          attempts = tahun1to6_drone_scores.attempts + 1,
          class_label = p_class_label,
          updated_at = now()
      where id = v_id
      returning tahun1to6_drone_scores.score, tahun1to6_drone_scores.attempts;
  else
    return query
      insert into public.tahun1to6_drone_scores (play_code, class_label, name, mode, difficulty, score, attempts)
      values (p_play_code, p_class_label, p_name, p_mode, p_difficulty, greatest(p_score, 0), 1)
      returning tahun1to6_drone_scores.score, tahun1to6_drone_scores.attempts;
  end if;
end;
$$;

grant execute on function public.submit_tahun1to6_drone_score(text, text, text, text, text, int) to anon, authenticated;
