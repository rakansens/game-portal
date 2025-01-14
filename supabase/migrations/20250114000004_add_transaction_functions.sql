-- クエストの並び順を一括更新する関数
create or replace function update_quests_order(quest_updates json[])
returns void
language plpgsql
security definer
as $$
declare
  quest_update json;
begin
  -- 各クエストの並び順を更新
  for quest_update in select * from unnest(quest_updates)
  loop
    update public.quests
    set order_position = (quest_update->>'order_position')::integer
    where id = (quest_update->>'id')::uuid;
  end loop;
end;
$$;