-- 首页「位老师」那一格的第二行：来自 X 间学校 · X 个州（2026-10-17 老师同意）
-- 来源：kelasku 建班／加入班级时选的学校（class_teachers → classes → schools），现有资料直接算，不用从 0 累计
-- 只算「至少有一位老师在管的班」所属的学校；只用过许愿池、没建班的老师没有学校资料，不在里面
-- 照 get_teacher_count() 的模式：SECURITY DEFINER 只回传两个总数，不公开任何学校或老师名单

-- 老师找不到学校时手动补登，同一间学校会出现好几笔（2026-10-17 查到 5 笔）。
-- 不能把班级搬到正确那笔：classes 的触发器会用学校代码重算 play_code，学生手上的班级代码会失效。
-- 所以只标记「这笔＝哪一间」，计数时并成一间，班级与代码都不动
alter table public.schools add column if not exists same_as uuid references public.schools(id);

update public.schools set same_as = (select id from public.schools where school_code = 'JBC1037')
  where school_code in ('JH1315', 'JH1328');                                                     -- SJK (C) KUO KUANG 2、Sjkc 国光2校 → 国光华小（二）校
update public.schools set same_as = (select id from public.schools where school_code = 'YCC6105')
  where school_code = 'SR1327';                                                                  -- SJKC SU KWONG → 泗光华小（砂拉越泗里街）
update public.schools set same_as = (select id from public.schools where school_code = 'JH1321')
  where school_code = 'JH1324';                                                                  -- SJK C CHEE TONG 两笔
update public.schools set same_as = (select id from public.schools where school_code = 'SL1318')
  where school_code = 'SL1316';                                                                  -- SJK (C) SIN MING, SEMENYIH 两笔

create or replace function public.get_school_count()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'schools', count(distinct coalesce(s.same_as, s.id)),
    'states', count(distinct s.state)
  )
  from public.class_teachers ct
  join public.classes c on c.id = ct.class_id
  join public.schools s on s.id = c.school_id;
$$;

grant execute on function public.get_school_count() to anon, authenticated;
