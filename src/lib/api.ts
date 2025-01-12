import { Quest } from '../types/supabase';

export async function fetchQuests(): Promise<Quest[]> {
  try {
    const response = await fetch('/api/quests');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch quests');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching quests:', error);
    throw error;
  }
}