-- 许愿池审核后台：只有 admins 表里的账号能看全部许愿单、改状态
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
-- 不开放任何 policy：前端读不到这张表，只能透过下面的函数判断「我是不是管理员」

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;
grant execute on function public.is_admin() to authenticated;

-- 管理员列出全部许愿单（附老师登录邮箱，方便回访）；非管理员直接回空
create or replace function public.admin_list_wishes()
returns table (
  id uuid, created_at timestamptz, status text, tahun int, subjek text,
  unit_objective text, learning_goal text, lesson_moment text, problem_description text,
  difficulty_tags text[], tried_already text, constraints text[], desired_help text,
  usage_modes text[], must_have_or_avoid text, classroom_context text,
  school_state text, school_district text, school_name text,
  review_note text, linked_tool_slug text, teacher_email text
)
language sql
security definer
set search_path = public
stable
as $$
  select w.id, w.created_at, w.status, w.tahun, w.subjek,
         w.unit_objective, w.learning_goal, w.lesson_moment, w.problem_description,
         w.difficulty_tags, w.tried_already, w.constraints, w.desired_help,
         w.usage_modes, w.must_have_or_avoid, w.classroom_context,
         w.school_state, w.school_district, w.school_name,
         w.review_note, w.linked_tool_slug, u.email::text
  from public.wishes w
  join auth.users u on u.id = w.teacher_id
  where public.is_admin()
  order by w.created_at desc;
$$;
grant execute on function public.admin_list_wishes() to authenticated;

-- 管理员改状态／备注／关联工具
create or replace function public.admin_update_wish(p_id uuid, p_status text, p_note text, p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'not admin'; end if;
  update public.wishes
     set status = p_status, review_note = nullif(p_note, ''), linked_tool_slug = nullif(p_slug, '')
   where id = p_id;
end;
$$;
grant execute on function public.admin_update_wish(uuid, text, text, text) to authenticated;

-- 管理员列出全部注册老师（邮箱、姓名、注册／最近登录时间、许愿数）；非管理员回空
create or replace function public.admin_list_teachers()
returns table (email text, full_name text, created_at timestamptz, last_sign_in_at timestamptz, wish_count int)
language sql
security definer
set search_path = public
stable
as $$
  select u.email::text, coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
         u.created_at, u.last_sign_in_at,
         (select count(*)::int from public.wishes w where w.teacher_id = u.id)
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.is_admin()
  order by u.created_at desc;
$$;
grant execute on function public.admin_list_teachers() to authenticated;
