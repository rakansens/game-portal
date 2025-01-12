import { Quest } from '../types/supabase';

const API_BASE_URL = '/api/admin';

export async function fetchQuests(): Promise<Quest[]> {
  const response = await fetch(`${API_BASE_URL}/quests`);
  if (!response.ok) {
    throw new Error('Failed to fetch quests');
  }
  return response.json();
}

export async function fetchQuestById(id: string): Promise<Quest> {
  const response = await fetch(`${API_BASE_URL}/quests?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quest');
  }
  return response.json();
}

export async function createQuest(quest: Partial<Quest>): Promise<Quest> {
  const response = await fetch(`${API_BASE_URL}/quests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quest),
  });

  if (!response.ok) {
    throw new Error('Failed to create quest');
  }

  return response.json();
}

export async function updateQuest(id: string, quest: Partial<Quest>): Promise<Quest> {
  const response = await fetch(`${API_BASE_URL}/quests?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quest),
  });

  if (!response.ok) {
    throw new Error('Failed to update quest');
  }

  return response.json();
}

export async function deleteQuest(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/quests?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete quest');
  }
}

export async function updateQuestsOrder(quests: Quest[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/quests/order`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quests: quests.map((quest, index) => ({
        id: quest.id,
        order_index: index,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update quests order');
  }
}