export type LiffUser = {
  id: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

export type AuthState = {
  user: LiffUser | null;
  isLoading: boolean;
  error: string | null;
};

export type QuestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type Quest = {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  reward: number;
  category: string;
  tags: string[];
  isPublished: boolean;
};

export type UserQuest = {
  id: string;
  userId: string;
  questId: string;
  status: QuestStatus;
  progress: number;
  startedAt: Date;
  updatedAt: Date;
};
