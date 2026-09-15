-- 四年级写字（tahun4-bc-bishun）——学生习写生字进度
-- 本文件只准备 migration，2026-09-15 尚未执行线上数据库变更。

create table if not exists public.tahun4_bc_bishun_progress (
  id uuid primary key default gen_random_uuid(),
  play_code text,
  class_label text not null,
  name text not null,
  chars_done int not null default 0,
  chars_json jsonb not null default '{}'::jsonb,
  attempts int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tahun4_bc_bishun_progress enable row level security;

drop policy if exists "anyone can read tahun4_bc_bishun progress" on public.tahun4_bc_bishun_progress;
create policy "anyone can read tahun4_bc_bishun progress"
  on public.tahun4_bc_bishun_progress for select
  to anon, authenticated using (true);

create unique index if not exists tahun4_bc_bishun_progress_key
  on public.tahun4_bc_bishun_progress (play_code, name)
  where play_code is not null;

create or replace function public.submit_tahun4_bc_bishun_progress(
  p_play_code text, p_class_label text, p_name text, p_chars_json jsonb
)
returns table(chars_done int, chars_json jsonb, attempts int)
language plpgsql security definer set search_path = public
as $$
declare
  v_id uuid; v_old jsonb; v_merged jsonb; v_key text; v_done int;
begin
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'p_name required'; end if;
  if p_chars_json is null or jsonb_typeof(p_chars_json) <> 'object' then raise exception 'p_chars_json must be a json object'; end if;
  if p_play_code is not null then
    select s.id, s.chars_json into v_id, v_old
      from public.tahun4_bc_bishun_progress s
      where s.play_code = p_play_code and s.name = p_name limit 1;
  end if;
  v_merged := coalesce(v_old, '{}'::jsonb);
  for v_key in select jsonb_object_keys(p_chars_json) loop
    if not (v_merged ? v_key) or (p_chars_json ->> v_key)::int > (v_merged ->> v_key)::int then
      v_merged := jsonb_set(v_merged, array[v_key], p_chars_json -> v_key, true);
    end if;
  end loop;
  select count(*) into v_done from jsonb_each_text(v_merged) e where e.value::int >= 2;
  if v_id is not null then
    return query update public.tahun4_bc_bishun_progress t
      set chars_json=v_merged, chars_done=v_done, class_label=p_class_label,
          attempts=t.attempts+1, updated_at=now() where t.id=v_id
      returning t.chars_done, t.chars_json, t.attempts;
  else
    return query insert into public.tahun4_bc_bishun_progress
      (play_code,class_label,name,chars_json,chars_done,attempts)
      values (p_play_code,p_class_label,p_name,v_merged,v_done,1)
      returning tahun4_bc_bishun_progress.chars_done,
                tahun4_bc_bishun_progress.chars_json,
                tahun4_bc_bishun_progress.attempts;
  end if;
end;
$$;

grant execute on function public.submit_tahun4_bc_bishun_progress(text,text,text,jsonb)
  to anon, authenticated;
