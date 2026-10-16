-- 首页「几台设备用过」的底层资料（2026-10-17 老师同意开始累计，首页暂不显示，等累积够了再取代「次到访」）
-- 设备＝浏览器 localStorage 里的随机 id（kongsi-idea-device-key），不含任何个人资料
-- 限制：localStorage 各网域分开，同一台电脑直接打开不同工具网址会各有一个 id。
--   Hub 点「开始使用」时把 Hub 的 id 带过去（?kd=），工具就沿用同一个；直接打开的才会各算各的。
--   所以「全站设备数」是上限估计；「某个工具几台设备用过」（按 scope 算）是准的。
-- 历史补不回来，从部署当天起算

create table public.device_seen (
  device_key uuid not null,
  scope text not null, -- 'hub' 或工具 slug
  first_seen timestamptz not null default now(),
  primary key (device_key, scope)
);

alter table public.device_seen enable row level security;
-- 不开放任何直接 select/insert/update policy，只能通过下面两个 SECURITY DEFINER 函数操作

create or replace function public.register_device(p_key uuid, p_scope text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.device_seen (device_key, scope) values (p_key, left(p_scope, 80))
    on conflict do nothing;
$$;

grant execute on function public.register_device(uuid, text) to anon, authenticated;

create or replace function public.get_device_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(distinct device_key) from public.device_seen;
$$;

grant execute on function public.get_device_count() to anon, authenticated;
