import { Game } from '@/types/game';
import { supabase } from '@/lib/supabase';

export async function fetchGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) {
    console.error('Error fetching games:', error);
    throw error;
  }

  return data || [];
}