import { z } from 'zod';

export const rankingSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1, '名前は必須です'),
  points: z.number().min(0, 'ポイントは0以上である必要があります'),
  level: z.number().min(1, 'レベルは1以上である必要があります'),
  quest_completed: z.number().min(0, '完了クエスト数は0以上である必要があります'),
  avatar_url: z.string().url('有効なURLを入力してください'),
  rank: z.number().min(1, 'ランクは1以上である必要があります'),
});

export type RankingFormData = z.infer<typeof rankingSchema>;
