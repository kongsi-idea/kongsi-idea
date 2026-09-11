-- 首页统计条「次网页浏览」从设备本地 localStorage（app.js 旧版 VISITS_KEY）换成全站真实数字
-- 旧版从没有回传服务器，历史浏览数据从一开始就没有被记录下来，无法补回，这里诚实地从 0 开始重新计数
-- 结构照抄 migration-2026-08-07-teacher-count.sql 的 get_teacher_count() 模式：
-- 单行计数器 + SECURITY DEFINER 函数，anon 可以调用来 +1，不开放直接读写这张表

create table public.page_view_counter (
  id boolean primary key default true,
  count bigint not null default 0,
  constraint page_view_counter_single_row check (id)
);

insert into public.page_view_counter (id, count) values (true, 0);

alter table public.page_view_counter enable row level security;
-- 不开放任何直接 select/insert/update policy，只能通过下面两个 SECURITY DEFINER 函数操作

create or replace function public.increment_page_views()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count bigint;
begin
  update public.page_view_counter set count = count + 1 where id = true
    returning count into v_count;
  return v_count;
end;
$$;

grant execute on function public.increment_page_views() to anon, authenticated;

create or replace function public.get_page_views()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count from public.page_view_counter where id = true;
$$;

grant execute on function public.get_page_views() to anon, authenticated;
