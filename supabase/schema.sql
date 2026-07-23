-- 课堂点子铺（kongsi-idea）Supabase 数据库结构
-- 用途：老师登录（Auth）+ 点子许愿池提交 + 全站真实的工具喜欢数/使用次数聚合
-- 使用方式：整份贴进 Supabase Dashboard 的 SQL Editor 执行（MCP 目前连的是另一个 project，没法远端跑）

-- ============================================================
-- 1. 点子许愿池：老师登录后提交的三步需求单
-- ============================================================
create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  tahun int,
  subjek text,
  unit_objective text,
  learning_goal text not null,
  lesson_moment text,
  problem_description text not null,
  difficulty_tags text[] not null default '{}',
  tried_already text,
  constraints text[] not null default '{}',
  desired_help text not null,
  usage_modes text[] not null default '{}',
  must_have_or_avoid text,
  classroom_context text,
  school_state text,
  school_district text,
  school_name text,
  school_source text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.wishes enable row level security;

-- 老师只能新增自己的许愿单，且 teacher_id 必须是自己
create policy "teachers insert own wishes"
  on public.wishes for insert
  to authenticated
  with check (teacher_id = auth.uid());

-- 老师只能看到自己提交过的许愿单，看不到别人的（第7节：默认不公开）
create policy "teachers read own wishes"
  on public.wishes for select
  to authenticated
  using (teacher_id = auth.uid());

-- ============================================================
-- 2. 工具全站真实统计：喜欢数 / 使用次数
-- ============================================================
create table public.tool_stats (
  tool_slug text primary key,
  likes_count int not null default 0,
  uses_count int not null default 0
);

alter table public.tool_stats enable row level security;

-- 首页统计条和工具卡片需要读全部工具的聚合数字，任何人可读
create policy "anyone can read tool stats"
  on public.tool_stats for select
  to anon, authenticated
  using (true);

-- 刻意不开放 insert/update/delete 给 anon/authenticated：
-- 计数只能透过下面的 SECURITY DEFINER 函数变动，避免有人直接改成任意数字。

-- 每个浏览器（voter_key，存在 localStorage 的随机 id）对每个工具最多一票，
-- 用来判断「这台浏览器有没有喜欢过」以及防止重复计数
create table public.tool_like_votes (
  tool_slug text not null references public.tool_stats(tool_slug) on delete cascade,
  voter_key text not null,
  created_at timestamptz not null default now(),
  primary key (tool_slug, voter_key)
);

alter table public.tool_like_votes enable row level security;

create policy "anyone can read like votes"
  on public.tool_like_votes for select
  to anon, authenticated
  using (true);

-- ============================================================
-- 3. RPC：切换喜欢状态（新增或取消一票，同步更新 tool_stats.likes_count）
-- ============================================================
create or replace function public.toggle_tool_like(p_slug text, p_voter_key text)
returns table(liked boolean, likes_count int)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_existing boolean;
begin
  insert into public.tool_stats(tool_slug) values (p_slug)
    on conflict (tool_slug) do nothing;

  select exists(
    select 1 from public.tool_like_votes
    where tool_slug = p_slug and voter_key = p_voter_key
  ) into v_existing;

  if v_existing then
    delete from public.tool_like_votes where tool_slug = p_slug and voter_key = p_voter_key;
    update public.tool_stats set likes_count = greatest(0, likes_count - 1) where tool_slug = p_slug;
  else
    insert into public.tool_like_votes(tool_slug, voter_key) values (p_slug, p_voter_key);
    update public.tool_stats set likes_count = likes_count + 1 where tool_slug = p_slug;
  end if;

  return query select not v_existing, ts.likes_count from public.tool_stats ts where ts.tool_slug = p_slug;
end;
$$;

grant execute on function public.toggle_tool_like(text, text) to anon, authenticated;

-- ============================================================
-- 4. RPC：工具使用次数 +1
-- ============================================================
create or replace function public.increment_tool_uses(p_slug text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.tool_stats(tool_slug, uses_count) values (p_slug, 1)
    on conflict (tool_slug) do update set uses_count = public.tool_stats.uses_count + 1;

  select uses_count into v_count from public.tool_stats where tool_slug = p_slug;
  return v_count;
end;
$$;

grant execute on function public.increment_tool_uses(text) to anon, authenticated;
