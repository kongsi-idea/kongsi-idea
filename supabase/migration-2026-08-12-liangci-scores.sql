-- 量词大冒险（tahun1-bc-liangci）专属排行榜，取代原本 Google Apps Script + localStorage 那套
-- 命名沿用「工具代号前缀」约定：liangci_scores 只属于这个工具，不跟其他工具共用

create table public.liangci_scores (
  id uuid primary key default gen_random_uuid(),
  play_code text,            -- kelasku 班级代码，GUEST（不选名字）模式是 null
  class_label text not null, -- 显示用，例如 "1I 班" 或 "访客"
  name text not null,
  score int not null,
  attempts int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.liangci_scores enable row level security;

-- 排行榜要给所有人看，读取全开
create policy "anyone can read liangci scores"
  on public.liangci_scores for select
  to anon, authenticated
  using (true);

-- 刻意不开放 insert/update/delete 给 anon/authenticated：只能透过下面的
-- SECURITY DEFINER 函数提交成绩，避免有人直接写入/篡改任意分数

-- 同一个 play_code + 姓名 只留历史最高分那一笔（GUEST 模式 play_code 是 null，每次都新增一笔，不合并）
create or replace function public.submit_liangci_score(p_play_code text, p_class_label text, p_name text, p_score int)
returns table(best int, attempts int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_play_code is not null then
    select id into v_id from public.liangci_scores
      where play_code = p_play_code and name = p_name
      limit 1;
  end if;

  if v_id is not null then
    return query
      update public.liangci_scores
      set score = greatest(liangci_scores.score, p_score),
          attempts = liangci_scores.attempts + 1,
          class_label = p_class_label,
          updated_at = now()
      where id = v_id
      returning liangci_scores.score, liangci_scores.attempts;
  else
    return query
      insert into public.liangci_scores (play_code, class_label, name, score, attempts)
      values (p_play_code, p_class_label, p_name, p_score, 1)
      returning liangci_scores.score, liangci_scores.attempts;
  end if;
end;
$$;

grant execute on function public.submit_liangci_score(text, text, text, int) to anon, authenticated;
