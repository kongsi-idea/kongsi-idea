-- liangci_scores 改名成 tahun1_bc_liangci_scores：用完整 slug 当前缀而不是只取关键词，
-- 避免以后如果出现「tahun2-bc-liangci」这种同关键词不同年级的工具时抢同一张表
-- 用 RENAME 保留既有 42 笔真实学生成绩，不是丢掉重建

alter table public.liangci_scores rename to tahun1_bc_liangci_scores;

drop function public.submit_liangci_score(text, text, text, int);

create or replace function public.submit_tahun1_bc_liangci_score(p_play_code text, p_class_label text, p_name text, p_score int)
returns table(best int, attempts int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_play_code is not null then
    select id into v_id from public.tahun1_bc_liangci_scores
      where play_code = p_play_code and name = p_name
      limit 1;
  end if;

  if v_id is not null then
    return query
      update public.tahun1_bc_liangci_scores
      set score = greatest(tahun1_bc_liangci_scores.score, p_score),
          attempts = tahun1_bc_liangci_scores.attempts + 1,
          class_label = p_class_label,
          updated_at = now()
      where id = v_id
      returning tahun1_bc_liangci_scores.score, tahun1_bc_liangci_scores.attempts;
  else
    return query
      insert into public.tahun1_bc_liangci_scores (play_code, class_label, name, score, attempts)
      values (p_play_code, p_class_label, p_name, p_score, 1)
      returning tahun1_bc_liangci_scores.score, tahun1_bc_liangci_scores.attempts;
  end if;
end;
$$;

grant execute on function public.submit_tahun1_bc_liangci_score(text, text, text, int) to anon, authenticated;
