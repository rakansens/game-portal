-- クエストの並び順を更新する関数
create or replace function update_quest_order_after_delete(target_position integer)
returns void
language plpgsql
security definer
as $$
begin
  -- 削除されたクエストより後ろの並び順を1つずつ前にずらす
  update public.quests
  set order_position = order_position - 1
  where order_position > target_position;
end;
$$;