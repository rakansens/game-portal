import { Quest } from '@/types/supabase';

export interface QuestTableProps {
  quests: Quest[];
  onDelete?: (quest: Quest) => void;
  onOrderChange?: (quests: Quest[]) => void;
}

export interface DraggableRowProps {
  quest: Quest;
  onDelete?: (quest: Quest) => void;
}