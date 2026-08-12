-- kelasku 第二阶段：多老师共编班级 + 改动前自动快照 + 学生资料拆中文名/英文名/座号
-- 背景讨论见 Claude memory：kongsi-idea-teaching-tools-shared-db-architecture
--
-- 权限模型改变：从「单一 owner_id」改成「class_teachers 成员制」——
-- 加入即时生效，不卡审批（老师当下就要能用）；换成靠「改动前自动存快照，
-- 班级页可以一键还原」来保护资料，而不是靠卡准入门槛防破坏。

-- ============================================================
-- 1. class_teachers：谁在管这个班，加入即时生效
-- ============================================================
create table public.class_teachers (
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, teacher_id)
);

alter table public.class_teachers enable row level security;

-- 老师只能看到「自己也在管的班」有哪些人，不能看别人班级的成员名单
create policy "teachers read own class members"
  on public.class_teachers for select
  to authenticated
  using (exists (
    select 1 from public.class_teachers ct2
    where ct2.class_id = class_teachers.class_id and ct2.teacher_id = auth.uid()
  ));

-- 加入即时生效：任何登录老师都能替自己插入一笔（等于「加入这个班」），
-- 但只能替自己加，不能替别人加
create policy "teachers can join classes"
  on public.class_teachers for insert
  to authenticated
  with check (teacher_id = auth.uid());

-- 移除自己，或移除同班的其他老师（把不该在的人踢掉）
create policy "class members can leave or remove"
  on public.class_teachers for delete
  to authenticated
  using (exists (
    select 1 from public.class_teachers ct2
    where ct2.class_id = class_teachers.class_id and ct2.teacher_id = auth.uid()
  ));

-- 建班的人自动加入自己的 class_teachers
create or replace function public.classes_add_creator_as_teacher()
returns trigger
language plpgsql
as $$
begin
  insert into public.class_teachers (class_id, teacher_id) values (new.id, new.created_by)
    on conflict do nothing;
  return new;
end;
$$;

create trigger classes_after_insert_add_teacher
  after insert on public.classes
  for each row execute function public.classes_add_creator_as_teacher();

-- ============================================================
-- 2. classes / students：owner_id 改名 created_by（只作纪录，不再用来判断权限），
--    RLS 换成看 class_teachers 有没有这个人
-- ============================================================
alter table public.classes rename column owner_id to created_by;

drop policy "teachers insert own classes" on public.classes;
drop policy "teachers update own classes" on public.classes;
drop policy "teachers delete own classes" on public.classes;

create policy "teachers insert classes"
  on public.classes for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "class teachers update classes"
  on public.classes for update
  to authenticated
  using (exists (
    select 1 from public.class_teachers ct where ct.class_id = classes.id and ct.teacher_id = auth.uid()
  ));

create policy "class teachers delete classes"
  on public.classes for delete
  to authenticated
  using (exists (
    select 1 from public.class_teachers ct where ct.class_id = classes.id and ct.teacher_id = auth.uid()
  ));

drop policy "teachers insert own students" on public.students;
drop policy "teachers update own students" on public.students;
drop policy "teachers delete own students" on public.students;

create policy "class teachers insert students"
  on public.students for insert
  to authenticated
  with check (exists (
    select 1 from public.class_teachers ct where ct.class_id = students.class_id and ct.teacher_id = auth.uid()
  ));

create policy "class teachers update students"
  on public.students for update
  to authenticated
  using (exists (
    select 1 from public.class_teachers ct where ct.class_id = students.class_id and ct.teacher_id = auth.uid()
  ));

create policy "class teachers delete students"
  on public.students for delete
  to authenticated
  using (exists (
    select 1 from public.class_teachers ct where ct.class_id = students.class_id and ct.teacher_id = auth.uid()
  ));

-- 老师自己能不能新建班级还是看有没有登录（created_by = auth.uid()），跟这张表不冲突

-- 把既有资料（目前只有测试资料）里的 owner 补进 class_teachers，避免既有班级变成没人能管
insert into public.class_teachers (class_id, teacher_id)
  select id, created_by from public.classes
  on conflict do nothing;

-- ============================================================
-- 3. students 拆栏位：中文名 / 英文名 / 座号
-- ============================================================
alter table public.students add column name_zh text;
alter table public.students add column name_en text;
alter table public.students add column seat_no int;

update public.students set name_zh = name where name_zh is null;

alter table public.students alter column name drop not null;
comment on column public.students.name is '已弃用，改用 name_zh / name_en；留着只是过渡期兼容，之后确认没有地方读它可以整个拿掉';

-- 至少要有一个名字（中文或英文），不能两个都空
alter table public.students add constraint students_has_a_name check (name_zh is not null or name_en is not null);

-- ============================================================
-- 4. class_snapshots：改动前自动存档，一键还原
-- ============================================================
create table public.class_snapshots (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  students_json jsonb not null,
  taken_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.class_snapshots enable row level security;

create policy "class teachers read snapshots"
  on public.class_snapshots for select
  to authenticated
  using (exists (
    select 1 from public.class_teachers ct where ct.class_id = class_snapshots.class_id and ct.teacher_id = auth.uid()
  ));

-- insert/delete 都不开放直接操作，只透过下面两个 SECURITY DEFINER 函数

-- 存一份「现在」的学生名单快照；同一个班最多留 20 份，超过自动删最旧的
create or replace function public.snapshot_class_students(p_class_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.class_teachers where class_id = p_class_id and teacher_id = auth.uid()) then
    raise exception '不是这个班的管理老师，不能存快照';
  end if;

  insert into public.class_snapshots (class_id, students_json, taken_by)
  select p_class_id,
    coalesce(jsonb_agg(jsonb_build_object('name_zh', name_zh, 'name_en', name_en, 'seat_no', seat_no)), '[]'::jsonb),
    auth.uid()
  from public.students where class_id = p_class_id;

  delete from public.class_snapshots
  where class_id = p_class_id
    and id not in (
      select id from public.class_snapshots where class_id = p_class_id
      order by created_at desc limit 20
    );
end;
$$;

grant execute on function public.snapshot_class_students(uuid) to authenticated;

-- 用某份快照整批覆盖回现在的学生名单（还原前会先把「还原前」的现状也存一份，避免误按还原也没得回头）
create or replace function public.restore_class_snapshot(p_snapshot_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_id uuid;
  v_students jsonb;
begin
  select class_id, students_json into v_class_id, v_students
    from public.class_snapshots where id = p_snapshot_id;

  if v_class_id is null then
    raise exception '找不到这份快照';
  end if;
  if not exists (select 1 from public.class_teachers where class_id = v_class_id and teacher_id = auth.uid()) then
    raise exception '不是这个班的管理老师，不能还原';
  end if;

  perform public.snapshot_class_students(v_class_id);

  delete from public.students where class_id = v_class_id;
  insert into public.students (class_id, name_zh, name_en, seat_no)
  select v_class_id, x.name_zh, x.name_en, x.seat_no
  from jsonb_to_recordset(v_students) as x(name_zh text, name_en text, seat_no int);
end;
$$;

grant execute on function public.restore_class_snapshot(uuid) to authenticated;
