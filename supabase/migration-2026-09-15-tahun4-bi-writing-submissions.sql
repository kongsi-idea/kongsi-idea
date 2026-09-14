-- Story Quest (tahun4-bi-writing) 投稿审核：pending/approved 表 + private storage bucket
-- 不收集学生姓名/学校/班级等个人资料，只存作业本身相关字段

create table if not exists public.tahun4_bi_writing_submissions (
  id uuid primary key default gen_random_uuid(),
  mission_id text not null,
  storage_path text not null,
  paragraph_text text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.tahun4_bi_writing_submissions enable row level security;

-- anon 只能新增投稿，且新增的 row 一定是 pending（挡掉直接插入 approved/rejected 的尝试）
create policy "tahun4_bi_writing_submissions_anon_insert"
  on public.tahun4_bi_writing_submissions
  for insert
  to anon
  with check (status = 'pending');

-- 刻意不建 anon 的 select/update/delete policy：RLS 默认全部拒绝，只有 service_role（bypass RLS）能审核/读取

-- Storage bucket：private，学生照片默认不公开
insert into storage.buckets (id, name, public)
values ('tahun4-bi-writing-submissions', 'tahun4-bi-writing-submissions', false)
on conflict (id) do nothing;

-- anon 只能上传（insert）到这个 bucket，不能读取/覆盖/删除任何物件
create policy "tahun4_bi_writing_submissions_storage_anon_insert"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'tahun4-bi-writing-submissions');

-- 刻意不建 anon 的 select/update/delete policy：RLS 默认全部拒绝，只有 service_role 能读取审核
