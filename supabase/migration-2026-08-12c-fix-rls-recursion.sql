-- 修 bug：class_teachers 自己的 select/delete policy 里查自己这张表，
-- 触发 "infinite recursion detected in policy for relation class_teachers"
-- 用 SECURITY DEFINER 函数打破递归（函数内部查表会跳过 RLS，不会再触发同一条 policy）

create or replace function public.is_class_teacher(p_class_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.class_teachers
    where class_id = p_class_id and teacher_id = auth.uid()
  );
$$;

grant execute on function public.is_class_teacher(uuid) to authenticated;

drop policy "teachers read own class members" on public.class_teachers;
create policy "teachers read own class members"
  on public.class_teachers for select
  to authenticated
  using (public.is_class_teacher(class_id));

drop policy "class members can leave or remove" on public.class_teachers;
create policy "class members can leave or remove"
  on public.class_teachers for delete
  to authenticated
  using (public.is_class_teacher(class_id));

-- classes/students 的 policy 本来查的是别的表（不是自己），理论上不会递归，
-- 但换成同一个函数比较一致、也少一次 EXISTS 子查询的开销
drop policy "class teachers update classes" on public.classes;
create policy "class teachers update classes"
  on public.classes for update to authenticated using (public.is_class_teacher(id));

drop policy "class teachers delete classes" on public.classes;
create policy "class teachers delete classes"
  on public.classes for delete to authenticated using (public.is_class_teacher(id));

drop policy "class teachers insert students" on public.students;
create policy "class teachers insert students"
  on public.students for insert to authenticated with check (public.is_class_teacher(class_id));

drop policy "class teachers update students" on public.students;
create policy "class teachers update students"
  on public.students for update to authenticated using (public.is_class_teacher(class_id));

drop policy "class teachers delete students" on public.students;
create policy "class teachers delete students"
  on public.students for delete to authenticated using (public.is_class_teacher(class_id));

drop policy "class teachers read snapshots" on public.class_snapshots;
create policy "class teachers read snapshots"
  on public.class_snapshots for select to authenticated using (public.is_class_teacher(class_id));
