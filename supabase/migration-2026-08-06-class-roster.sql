-- kelasku：老师注册学校/班级、生成 play_code、各教学工具用代码拉学生名单
-- 背景讨论见 Claude memory：kongsi-idea-teaching-tools-shared-db-architecture
-- 使用方式：跟 schema.sql 一样，整份在有 db 连线权限的环境执行一次即可（本次由 Claude 直连执行）

-- ============================================================
-- 0. 州属简称对照 + 学校代码自动生成
-- ============================================================
create sequence if not exists public.schools_code_seq;

create or replace function public.state_to_abbr(p_state text)
returns text
language sql
immutable
as $$
  select case p_state
    when '柔佛' then 'JH'
    when '吉打' then 'KD'
    when '吉兰丹' then 'KN'
    when '马六甲' then 'ML'
    when '森美兰' then 'NS'
    when '彭亨' then 'PH'
    when '槟城' then 'PG'
    when '霹雳' then 'PK'
    when '玻璃市' then 'PL'
    when '沙巴' then 'SB'
    when '砂拉越' then 'SR'
    when '雪兰莪' then 'SL'
    when '登嘉楼' then 'TR'
    when '吉隆坡' then 'KL'
    when '纳闽' then 'LB'
    when '布城' then 'PJ'
    else 'XX'
  end;
$$;

-- ============================================================
-- 1. 学校：预建全国华小名录（来自 data/sjkc-schools.json），代码系统自动分配、保证唯一
-- ============================================================
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  state text not null,
  district text,
  school_code text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.schools_set_code()
returns trigger
language plpgsql
as $$
begin
  if new.school_code is null or new.school_code = '' then
    new.school_code := public.state_to_abbr(new.state) || lpad(nextval('public.schools_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger schools_before_insert
  before insert on public.schools
  for each row execute function public.schools_set_code();

alter table public.schools enable row level security;

-- 下拉选单/查找学校要给所有人（含未登录）读
create policy "anyone can read schools"
  on public.schools for select
  to anon, authenticated
  using (true);

-- 名录找不到自己学校时，老师可以自己补登记；不开放 update/delete，避免有人乱改别人补的资料
create policy "authenticated can add missing school"
  on public.schools for insert
  to authenticated
  with check (true);

-- ============================================================
-- 2. 班级：老师登录后建立，play_code = 学校代码 + "-" + 班级缩写（自动大写）
-- ============================================================
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  class_name text not null check (class_name ~ '^[A-Za-z0-9]+$'), -- 只允许英文字母/数字，不含空格或"-"
  play_code text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 同一间学校底下，班级缩写不分大小写不能重复（1I 跟 1i 视为同一个）
create unique index classes_school_upper_name_idx on public.classes (school_id, upper(class_name));

create or replace function public.classes_set_play_code()
returns trigger
language plpgsql
as $$
declare
  v_school_code text;
begin
  select school_code into v_school_code from public.schools where id = new.school_id;
  new.play_code := v_school_code || '-' || upper(new.class_name);
  return new;
end;
$$;

create trigger classes_before_insert_update
  before insert or update of school_id, class_name on public.classes
  for each row execute function public.classes_set_play_code();

alter table public.classes enable row level security;

-- 教学工具（含匿名访客）要能用 play_code 查班级，所以读取全开
create policy "anyone can read classes"
  on public.classes for select
  to anon, authenticated
  using (true);

create policy "teachers insert own classes"
  on public.classes for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "teachers update own classes"
  on public.classes for update
  to authenticated
  using (owner_id = auth.uid());

create policy "teachers delete own classes"
  on public.classes for delete
  to authenticated
  using (owner_id = auth.uid());

-- ============================================================
-- 3. 学生：老师 bulk 贴入的名单，中英文名字都允许
-- ============================================================
create table public.students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.students enable row level security;

-- 教学工具要读名单显示给学生选，读取全开
create policy "anyone can read students"
  on public.students for select
  to anon, authenticated
  using (true);

create policy "teachers insert own students"
  on public.students for insert
  to authenticated
  with check (exists (
    select 1 from public.classes c where c.id = class_id and c.owner_id = auth.uid()
  ));

create policy "teachers update own students"
  on public.students for update
  to authenticated
  using (exists (
    select 1 from public.classes c where c.id = class_id and c.owner_id = auth.uid()
  ));

create policy "teachers delete own students"
  on public.students for delete
  to authenticated
  using (exists (
    select 1 from public.classes c where c.id = class_id and c.owner_id = auth.uid()
  ));

-- ============================================================
-- 4. 常用连结：kelasku「我的常用连结」，存的是生成好的 code 组合，不是新的代码系统
-- ============================================================
create table public.saved_links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  codes text not null, -- 例如 "JH0001-1I,2A"，跟工具网址 ?code= 后面那段完全一致
  created_at timestamptz not null default now()
);

alter table public.saved_links enable row level security;

create policy "teachers read own saved links"
  on public.saved_links for select
  to authenticated
  using (owner_id = auth.uid());

create policy "teachers insert own saved links"
  on public.saved_links for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "teachers delete own saved links"
  on public.saved_links for delete
  to authenticated
  using (owner_id = auth.uid());
