-- 一起写好字（tahun1-bc-bishun）—— 学生习写生字进度
-- 规格参考 docs/tool-modes-spec.md 的「自由作答」模式；这个工具只有 solo 模式
--（笔顺描红是个人练习，不做课堂对垒）。
--
-- 命名照 agents.md 约定：完整 slug 连字号换底线当前缀（tahun1_bc_bishun_*），
-- 不只取「bishun」关键词，免得以后 tahun2/tahun3 抢同一张表。
--
-- 跟 masa 排行榜不同的是：这里存的是「进度」不是「一局的成绩」——
-- chars_json 存整份 { 字: 0|1|2 } 状态图，学生换一台电脑登入自己的名字就能接回进度。
-- 使用方式：跟其他 migration 一样，在有 db 连线权限的环境执行一次。

create table if not exists public.tahun1_bc_bishun_progress (
  id uuid primary key default gen_random_uuid(),
  play_code text,             -- kelasku 班级代码；访客模式是 null
  class_label text not null,  -- 显示用，例如 "1I" 或 "访客"
  name text not null,
  chars_done int not null default 0,        -- 写好（状态 2 / ★）的字数
  chars_json jsonb not null default '{}'::jsonb,  -- 整份 { 字: 0|1|2 } 状态图
  attempts int not null default 1,          -- 累计同步次数（约等于练习节数）
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tahun1_bc_bishun_progress enable row level security;

-- 老师要看全班进度、学生之间看不到彼此细节也没关系（只有名字和字数），读取全开
drop policy if exists "anyone can read tahun1_bc_bishun progress" on public.tahun1_bc_bishun_progress;
create policy "anyone can read tahun1_bc_bishun progress"
  on public.tahun1_bc_bishun_progress for select
  to anon, authenticated
  using (true);

-- 刻意不开放 insert/update/delete 给 anon/authenticated：
-- 只能透过下面的 SECURITY DEFINER 函数提交，避免有人直接改任意学生的进度。

-- 同一个 play_code + 姓名 只留一行，chars_json 逐字取「较高的状态」合并
--（0 未学 < 1 描过 < 2 写好），所以多台电脑、乱序同步都不会把进度改小。
-- 访客模式（play_code 为 null）不合并，每次各留一行。
create unique index if not exists tahun1_bc_bishun_progress_key
  on public.tahun1_bc_bishun_progress (play_code, name)
  where play_code is not null;

create or replace function public.submit_tahun1_bc_bishun_progress(
  p_play_code   text,
  p_class_label text,
  p_name        text,
  p_chars_json  jsonb
)
returns table(chars_done int, chars_json jsonb, attempts int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_old jsonb;
  v_merged jsonb;
  v_key text;
  v_done int;
begin
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'p_name required';
  end if;
  if p_chars_json is null or jsonb_typeof(p_chars_json) <> 'object' then
    raise exception 'p_chars_json must be a json object';
  end if;

  if p_play_code is not null then
    select s.id, s.chars_json into v_id, v_old
      from public.tahun1_bc_bishun_progress s
      where s.play_code = p_play_code and s.name = p_name
      limit 1;
  end if;

  -- 逐字取较高状态合并
  v_merged := coalesce(v_old, '{}'::jsonb);
  for v_key in select jsonb_object_keys(p_chars_json) loop
    if not (v_merged ? v_key)
       or (p_chars_json ->> v_key)::int > (v_merged ->> v_key)::int then
      v_merged := jsonb_set(v_merged, array[v_key], p_chars_json -> v_key, true);
    end if;
  end loop;

  select count(*) into v_done
    from jsonb_each_text(v_merged) e
    where e.value::int >= 2;

  if v_id is not null then
    return query
      update public.tahun1_bc_bishun_progress t
      set chars_json  = v_merged,
          chars_done  = v_done,
          class_label = p_class_label,
          attempts    = t.attempts + 1,
          updated_at  = now()
      where t.id = v_id
      returning t.chars_done, t.chars_json, t.attempts;
  else
    return query
      insert into public.tahun1_bc_bishun_progress
        (play_code, class_label, name, chars_json, chars_done, attempts)
      values (p_play_code, p_class_label, p_name, v_merged, v_done, 1)
      returning tahun1_bc_bishun_progress.chars_done,
                tahun1_bc_bishun_progress.chars_json,
                tahun1_bc_bishun_progress.attempts;
  end if;
end;
$$;

grant execute on function
  public.submit_tahun1_bc_bishun_progress(text, text, text, jsonb)
  to anon, authenticated;
