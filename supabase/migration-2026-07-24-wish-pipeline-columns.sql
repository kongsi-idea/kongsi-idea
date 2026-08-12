-- 迁移：给 wishes 表加上状态流转所需栏位
-- 背景：许愿单目前只有 new 一种状态，处理完全靠人工开 Supabase Dashboard 看，跟
--       teaching-tools/PROGRESS.md、已上架工具之间没有任何关联。这份迁移先只加栏位，
--       不建审核后台 UI——继续用 Dashboard 手动改 status/review_note/linked_tool_slug 即可。
-- 执行方式：贴进 kongsi-idea 项目（project ref gntnkhkkgonaehapcerr）的 Supabase Dashboard
--          → SQL Editor 执行。⚠️ 不要在其他 project 执行，先在 Dashboard 左上角确认项目名字。
-- 执行一次即可；如果 wishes 表已经手动加过这些栏位，重复执行也不会出错（用了 IF NOT EXISTS / DO block）。

alter table public.wishes
  add column if not exists review_note text,
  add column if not exists linked_tool_slug text;

-- status 从「自由文字，默认 new」收紧成「只能是流程里定义的几种状态」；
-- 如果目前表里已经有不在这个列表内的旧资料，这行会报错——先用
-- `select distinct status from public.wishes;` 确认现有资料都在列表内再执行。
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'wishes_status_check'
  ) then
    alter table public.wishes
      add constraint wishes_status_check
      check (status in ('new', 'triaged', 'researching', 'planned', 'building', 'shipped', 'declined'));
  end if;
end $$;
