export interface QuestProgress {
  questId: number;
  questName: string;
  points: number;
  completedAt: string;
}

export interface LineUser {
  id: string;
  displayName: string;
  pictureUrl: string;
  statusMessage?: string;
  email?: string;
  isBlocked: boolean;
  registeredAt: string;
  lastLoginAt: string;
  totalPoints: number;
  completedQuests: QuestProgress[];
  currentQuests: QuestProgress[];
}
