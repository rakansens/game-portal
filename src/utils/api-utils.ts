export const API_ERRORS = {
  FETCH_QUESTS: 'クエストの取得に失敗しました',
  FETCH_QUEST: 'クエストの取得に失敗しました',
  CREATE_QUEST: 'クエストの作成に失敗しました',
  UPDATE_QUEST: 'クエストの更新に失敗しました',
  DELETE_QUEST: 'クエストの削除に失敗しました',
  UPDATE_ORDER: '並び順の更新に失敗しました',
} as const;

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function handleAPIResponse<T>(
  response: Response,
  errorMessage: string
): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      error.message || errorMessage,
      response.status,
      error.code
    );
  }
  return response.json();
}

export function createQueryString(params: Record<string, string>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}