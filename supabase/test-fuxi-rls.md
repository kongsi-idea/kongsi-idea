# tahun1_bc_fuxi_okt_answers：执行 migration 后的 RLS 验证（5 条＋收尾）

> 由主对话在 migration 执行后跑，不是 B 实作员跑的。**migration 本身是 DB schema 变更，要老师同意后才执行。**
> 全部写在 `begin; ... rollback;` 里，不留测试资料。用 psql 或 Supabase SQL Editor 都行（SQL Editor 以 postgres 身份跑，所以靠 `set local role` 切身份）。
> 先准备三个值（用真实资料查出来，别写死）：
> - `:CODE` = 一个真实存在的班级代码（`select play_code, id from classes limit 5;`）
> - `:TEACHER` = 该班某位老师的 `auth.users.id`（`select teacher_id from class_teachers where class_id = '<上面班级 id>';`）
> - `:OTHER` = 一个**不在**该班 class_teachers 里的 `auth.users.id`（`select id from auth.users where id not in (select teacher_id from class_teachers where class_id = '<班级 id>') limit 1;`）
>
> `:'CODE'` 是 psql 变量写法；SQL Editor 里直接换成字面值（如 `'JBC1037-1I'`）。
> 同一事务里前一个语句出错，后面全部会 `current transaction is aborted`：出错的测完就 `rollback; begin;` 重开（重新塞行、重新切身份）。
> 预期写在每条后面；任何一条与预期不符就停手回报，别往下用。

## 前置：每个事务开头，先用 postgres 身份塞一笔「老师可读」的测试行（回滚时一起消失）

```sql
begin;
insert into public.tahun1_bc_fuxi_okt_answers
  (play_code, student_name, in_roster, attempt_no, item_id, answer, is_correct, error_tag)
values (:'CODE', '__rls_test__', false, 1, 'a1', '{"v":"国庆日"}'::jsonb, true, null);
```

## 1. anon 插入成功

```sql
set local role anon;
insert into public.tahun1_bc_fuxi_okt_answers
  (play_code, student_name, in_roster, attempt_no, item_id, answer, is_correct, error_tag)
values (:'CODE', '__rls_anon__', false, 1, 'a2', '{"v":"白纸"}'::jsonb, false, 'read-detail');
-- 预期：INSERT 0 1
-- 写作题（is_correct 为 null）与多选（v 是数组）也要能插：
insert into public.tahun1_bc_fuxi_okt_answers
  (play_code, student_name, in_roster, attempt_no, item_id, answer, is_correct, error_tag)
values (:'CODE', '__rls_anon__', false, 1, 'a7', '{"v":"马来西亚，生日快乐！"}'::jsonb, null, null),
       (:'CODE', '__rls_anon__', false, 1, 'a8', '{"v":["太空","空地"]}'::jsonb, false, 'polyphone');
-- 预期：INSERT 0 2
```

附加（各自单独跑，都应失败，确认防乱灌生效）：

```sql
-- 班级代码不存在：预期 ERROR 42501 new row violates row-level security policy
insert into public.tahun1_bc_fuxi_okt_answers (play_code, student_name, in_roster, item_id, answer)
values ('NOPE-9Z', 'x', false, 'a1', '{"v":"x"}'::jsonb);
-- answer 过大：预期 ERROR 42501
insert into public.tahun1_bc_fuxi_okt_answers (play_code, student_name, in_roster, item_id, answer)
values (:'CODE', 'x', false, 'a1', to_jsonb(repeat('x', 3000)));
-- 题号格式不对：预期 ERROR 23514 violates check constraint "fuxi_okt_item_fmt"
insert into public.tahun1_bc_fuxi_okt_answers (play_code, student_name, in_roster, item_id, answer)
values (:'CODE', 'x', false, 'zzz', '{"v":"x"}'::jsonb);
-- answer 没有 v：预期 ERROR 23514 violates check constraint "fuxi_okt_answer_shape"
insert into public.tahun1_bc_fuxi_okt_answers (play_code, student_name, in_roster, item_id, answer)
values (:'CODE', 'x', false, 'a1', '{"x":1}'::jsonb);
```

## 2. anon 读失败；anon 改、删失败

```sql
rollback; begin;  -- 重塞前置行后：
set local role anon;
select count(*) from public.tahun1_bc_fuxi_okt_answers;
-- 预期：ERROR 42501 permission denied（已 revoke select）；若是 0 行也算通过。
--       不通过＝能读到前置那笔 __rls_test__ 或 __rls_anon__。
update public.tahun1_bc_fuxi_okt_answers set attempt_no = 2;
-- 预期：ERROR 42501 permission denied（anon 没有 update 权限）
delete from public.tahun1_bc_fuxi_okt_answers;
-- 预期：ERROR 42501 permission denied
```

用真实 REST 再确认一次读（anon key 是公开的；**只读，不要用 curl 往真库 POST**）：

```bash
# 预期：401/403 permission denied 或 200 且 []
curl -s "$SUPABASE_URL/rest/v1/tahun1_bc_fuxi_okt_answers?select=id&limit=1" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
```

## 3. 非该班老师读不到、改不了、删不了、写不了

```sql
rollback; begin;  -- 重塞前置行后：
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'OTHER', 'role', 'authenticated')::text, true);
select count(*) from public.tahun1_bc_fuxi_okt_answers where play_code = :'CODE';
-- 预期：0
update public.tahun1_bc_fuxi_okt_answers set student_name = 'hacked' where play_code = :'CODE';
-- 预期：UPDATE 0（行对他不可见）
delete from public.tahun1_bc_fuxi_okt_answers where play_code = :'CODE';
-- 预期：DELETE 0
insert into public.tahun1_bc_fuxi_okt_answers (play_code, student_name, in_roster, item_id, answer)
values (:'CODE', '__rls_other__', true, 'a1', '{"v":"x"}'::jsonb);
-- 预期：ERROR 42501 permission denied（authenticated 本来就没有 insert 权限；这支工具老师不代写）
```

## 4. 该班老师读得到

```sql
rollback; begin;  -- 重塞前置行后：
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'TEACHER', 'role', 'authenticated')::text, true);
select count(*) from public.tahun1_bc_fuxi_okt_answers where play_code = :'CODE';
-- 预期：>= 1（至少看得到 __rls_test__）
```

## 5. 该班老师可「合并名字」，但只能改名字，不能改别的，也不能搬班

```sql
rollback; begin;  -- 重塞前置行后：
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'TEACHER', 'role', 'authenticated')::text, true);
update public.tahun1_bc_fuxi_okt_answers
  set student_name = '__rls_merged__', in_roster = true
  where play_code = :'CODE' and student_name = '__rls_test__';
-- 预期：UPDATE 1（后台「合并到名单」功能依赖这个）
update public.tahun1_bc_fuxi_okt_answers set play_code = 'NOPE-9Z' where student_name = '__rls_merged__';
-- 预期：ERROR 42501 permission denied for table（column-level 授权只含 student_name、in_roster）
rollback; begin;  -- 重塞前置行、切成 TEACHER 后：
update public.tahun1_bc_fuxi_okt_answers set is_correct = true where student_name = '__rls_test__';
-- 预期：ERROR 42501（老师不能改对错）
delete from public.tahun1_bc_fuxi_okt_answers where student_name = '__rls_test__';
-- 预期：DELETE 1
rollback;
```

## 收尾检查

```sql
select count(*) from public.tahun1_bc_fuxi_okt_answers where student_name like '\_\_rls%';
-- 预期：0（全程 begin/rollback，不该留下任何测试行）
select policyname, cmd, roles from pg_policies where tablename = 'tahun1_bc_fuxi_okt_answers' order by cmd, policyname;
-- 预期 4 条：anon 只有 INSERT 一条；authenticated 有 SELECT、UPDATE、DELETE 各一条（没有 INSERT）
```
