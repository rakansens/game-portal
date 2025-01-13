import { Quest } from '@/types/supabase';
import { API_ERRORS, handleAPIResponse, createQueryString } from '@/utils/api-utils';

const API_BASE_URL = '/api/admin';

export async function fetchQuests(): Promise<Quest[]> {
  const response = await fetch(`${API_BASE_URL}/quests`);
  return handleAPIResponse(response, API_ERRORS.FETCH_QUESTS);
}

export async function fetchQuestById(id: string): Promise<Quest> {
  const query = createQueryString({ id });
  const response = await fetch(`${API_BASE_URL}/quests${query}`);
  return handleAPIResponse(response, API_ERRORS.FETCH_QUEST);
}

export async function createQuest(quest: Partial<Quest>): Promise<Quest> {
  const response = await fetch(`${API_BASE_URL}/quests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quest),
  });

  return handleAPIResponse(response, API_ERRORS.CREATE_QUEST);
}

export async function updateQuest(id: string, quest: Partial<Quest>): Promise<Quest> {
  const query = createQueryString({ id });
  const response = await fetch(`${API_BASE_URL}/quests${query}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quest),
  });

  return handleAPIResponse(response, API_ERRORS.UPDATE_QUEST);
}

export async function deleteQuest(id: string): Promise<void> {
  const query = createQueryString({ id });
  const response = await fetch(`${API_BASE_URL}/quests${query}`, {
    method: 'DELETE',
  });

  return handleAPIResponse(response, API_ERRORS.DELETE_QUEST);
}

interface UpdateOrderRequest {
  id: string;
  order_position: number;
}

export async function updateQuestsOrder(quests: Quest[]): Promise<void> {
  const orderUpdates: UpdateOrderRequest[] = quests.map((quest) => ({
    id: quest.id,
    order_position: quest.order_position,
  }));

  const response = await fetch(`${API_BASE_URL}/quests/order`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quests: orderUpdates }),
  });

  return handleAPIResponse(response, API_ERRORS.UPDATE_ORDER);
}