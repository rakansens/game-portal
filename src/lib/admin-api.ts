import { Quest } from '../types/supabase';

type CreateQuestInput = Omit<Quest, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'modified_by'>;
type UpdateQuestInput = Partial<CreateQuestInput> & { id: string };

export async function createQuest(quest: CreateQuestInput): Promise<Quest> {
  const response = await fetch('/api/admin/quests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quest),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create quest');
  }

  return response.json();
}

export async function updateQuest(quest: UpdateQuestInput): Promise<Quest> {
  const response = await fetch('/api/admin/quests', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quest),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update quest');
  }

  return response.json();
}

export async function deleteQuest(id: string): Promise<void> {
  const response = await fetch(`/api/admin/quests?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete quest');
  }
}