-- 首页统计条「位老师注册」从「即将上线」占位换成全站真实数字
-- 用法：kelasku 上线后，登录用的是同一个 Supabase project 的 Google OAuth，
-- 借这个共用的登录状态记一份「谁登录过」的极简登记表，只用来算总数，不公开任何身份信息

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 老师登录后自己写一笔（只能写自己那笔），不开放公开读取整张表，避免任何人枚举出已注册的 user id 列表
create policy "users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- 首页统计条只需要总数，不需要看到任何一笔资料，所以用 SECURITY DEFINER 函数只回传数字
create or replace function public.get_teacher_count()
returns int
language sql
security definer
set search_path = public
as $$
  select count(*)::int from public.profiles;
$$;

grant execute on function public.get_teacher_count() to anon, authenticated;
