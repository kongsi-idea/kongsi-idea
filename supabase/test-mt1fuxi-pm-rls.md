# tahun1_mt_fuxi_pecahan_masa_answers：执行 migration 后的 RLS 验证（7 条：权限 5 条＋收尾＋附）

> 由主对话在 migration 执行后跑，不是 B 实作员跑的。
> 全部写在 `begin; ... rollback;` 里，不留测试资料。用 psql 或 Supabase SQL Editor 都行（SQL Editor 以 postgres 身份跑，所以靠 `set local role` 切身份）。
> 先准备三个值（用真实资料查出来，别写死）：
> - `:CODE` = 一个真实存在的班级代码（`select play_code, id from classes limit 5;`）
> - `:TEACHER` = 该班某位老师的 `auth.users.id`（`select teacher_id from class_teachers where class_id = '<上面班级 id>';`）
> - `:OTHER` = 一个**不在**该班 class_teachers 里的 `auth.users.id`（`select id from auth.users where id not in (select teacher_id from class_teachers where class_id = '<班级 id>') limit 1;`）
>
> 预期是写在每条后面的；任何一条与预期不符就停手回报，别往下用。

## 前置：先用 postgres 身份塞一笔「老师可读」的测试行（回滚时一起消失）

```sql
begin;
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, attempt_no, item_id, answer, is_correct, error_tag)
values (:'CODE', '__rls_test__', false, 'online', 1, 'a1', '"3/4"'::jsonb, true, null);
```

（`:'CODE'` 是 psql 变量写法；SQL Editor 里直接换成 `'JBC1037-1I'` 之类的字面值。）

## 1. anon 插入成功（source='online'，班级代码存在）

```sql
set local role anon;
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, attempt_no, item_id, answer, is_correct, error_tag)
values (:'CODE', '__rls_anon__', false, 'online', 1, 'a1', '"1/4"'::jsonb, false, 'frac-counted-blank');
-- 预期：INSERT 0 1
```

附加（同样应失败，确认防乱灌也生效）：

```sql
-- 班级代码不存在：预期 ERROR 42501 new row violates row-level security policy
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, item_id, answer, is_correct)
values ('NOPE-9Z', 'x', false, 'online', 'a1', '1'::jsonb, true);
-- answer 过大：预期 ERROR 42501
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, item_id, answer, is_correct)
values (:'CODE', 'x', false, 'online', 'a1', to_jsonb(repeat('x', 3000)), true);
```

> 注意：同一个事务里前一个语句出错会让后面的全部 `current transaction is aborted`。
> 想连着测就每条之间 `rollback; begin; set local role anon;` 重开，或者各自单独跑。

## 2. anon 读失败

```sql
rollback; begin; set local role anon;
select count(*) from public.tahun1_mt_fuxi_pecahan_masa_answers;
-- 预期：0 行（RLS 过滤，count = 0），或 ERROR 42501 permission denied（已 revoke select）。
--       两种都算通过；不通过＝能读到前置那笔 __rls_test__ 或 __rls_anon__。
update public.tahun1_mt_fuxi_pecahan_masa_answers set student_name = 'hacked';
-- 预期：ERROR 42501 permission denied（anon 没有 update 权限）
delete from public.tahun1_mt_fuxi_pecahan_masa_answers;
-- 预期：ERROR 42501 permission denied
```

另外用真实 REST 再确认一次（anon key 是公开的，可以直接用；`Prefer: return=minimal` 很重要）：

```bash
# 读：预期 401/403 permission denied 或 200 且 []
curl -s "$SUPABASE_URL/rest/v1/tahun1_mt_fuxi_pecahan_masa_answers?select=id&limit=1" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
```

> 这条 curl 只读，不写库。anon 的写入测试只用上面事务里的 SQL（会回滚），**不要用 curl 往真库 POST**。

## 3. anon 插入 source='paper' 失败

```sql
rollback; begin; set local role anon;
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, attempt_no, item_id, answer, is_correct)
values (:'CODE', '__rls_anon_paper__', false, 'paper', 1, 'a1', '"3/4"'::jsonb, true);
-- 预期：ERROR 42501 new row violates row-level security policy
```

## 4. 非该班老师读不到（也写不了、改不了、删不了）

```sql
rollback; begin;
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, attempt_no, item_id, answer, is_correct)
values (:'CODE', '__rls_test__', false, 'online', 1, 'a1', '"3/4"'::jsonb, true);   -- 以 postgres 身份重塞一笔
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'OTHER', 'role', 'authenticated')::text, true);
select count(*) from public.tahun1_mt_fuxi_pecahan_masa_answers where play_code = :'CODE';
-- 预期：0
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, attempt_no, item_id, answer, is_correct)
values (:'CODE', '__rls_other__', true, 'paper', 1, 'a1', '"3/4"'::jsonb, true);
-- 预期：ERROR 42501 new row violates row-level security policy
```

再单独跑（上一句出错后要 rollback 重开，同样要塞行和切身份）：

```sql
-- update/delete 预期 UPDATE 0 / DELETE 0（行对他不可见）
update public.tahun1_mt_fuxi_pecahan_masa_answers set student_name = 'hacked' where play_code = :'CODE';
delete from public.tahun1_mt_fuxi_pecahan_masa_answers where play_code = :'CODE';
```

## 5. 该班老师读得到（并可写 paper、可改、可删）

```sql
rollback; begin;
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, attempt_no, item_id, answer, is_correct)
values (:'CODE', '__rls_test__', false, 'online', 1, 'a1', '"3/4"'::jsonb, true);
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'TEACHER', 'role', 'authenticated')::text, true);
select count(*) from public.tahun1_mt_fuxi_pecahan_masa_answers where play_code = :'CODE';
-- 预期：>= 1（至少看得到 __rls_test__）
insert into public.tahun1_mt_fuxi_pecahan_masa_answers
  (play_code, student_name, in_roster, source, attempt_no, item_id, answer, is_correct)
values (:'CODE', '__rls_teacher_paper__', true, 'paper', 1, 'a1', '"3/4"'::jsonb, true);
-- 预期：INSERT 0 1
update public.tahun1_mt_fuxi_pecahan_masa_answers
  set student_name = '__rls_merged__', in_roster = true
  where play_code = :'CODE' and student_name = '__rls_test__';
-- 预期：UPDATE 1（合并名字功能依赖这个）
update public.tahun1_mt_fuxi_pecahan_masa_answers set play_code = 'NOPE-9Z' where student_name = '__rls_merged__';
-- 预期：ERROR 42501（with check 挡住「把行搬到别人的班」）
rollback; begin;  -- 上一句出错后重开再测 delete
-- （重塞行、切身份同上）
delete from public.tahun1_mt_fuxi_pecahan_masa_answers where student_name = '__rls_test__';
-- 预期：DELETE 1
rollback;
```

## 收尾检查

```sql
select count(*) from public.tahun1_mt_fuxi_pecahan_masa_answers where student_name like '\_\_rls%';
-- 预期：0（全程 begin/rollback，不该留下任何测试行）
select policyname, cmd, roles from pg_policies where tablename = 'tahun1_mt_fuxi_pecahan_masa_answers' order by cmd, policyname;
-- 预期 5 条：anon 只有 INSERT 一条；authenticated 有 SELECT/INSERT/UPDATE/DELETE 各一条
```

## 附：确认没动到别的表

```sql
select tablename, count(*) from pg_policies
where tablename in ('tahun2_mt_fuxi_okt_answers', 'tahun1_mt_latihan_okt_answers', 'tahun2_mt_latihan_okt_answers')
group by tablename order by tablename;
-- 预期：三张表各 5（本次 migration 只建 tahun1_mt_fuxi_pecahan_masa_answers 的表与 policy，不碰别的表）
```
