import { z } from 'zod';

export const rankingSchema = z.object({
  user_id: z.string().min(1, 'ユーザーを選択してください'),
  points: z.number().min(0, 'ポイントは0以上である必要があります'),
});

export type RankingFormData = z.infer<typeof rankingSchema>;
