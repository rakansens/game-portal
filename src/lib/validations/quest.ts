import { z } from 'zod';

export const questSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  description: z.string().min(1, '必須項目です'),
  points: z.number().min(0, 'ポイントは0以上である必要があります'),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  participants_limit: z.number().nullable(),
  required_points: z.number().min(0, '必要ポイントは0以上である必要があります').nullable(),
  banner_url: z.string().url().optional(),
  order_position: z.number().optional(),
  participant_count: z.number().optional(),
});

export const questProgressSchema = z.object({
  questId: z.string().uuid(),
  progress: z.number().min(0).max(100),
  status: z.enum(['not_started', 'in_progress', 'completed', 'failed']),
});

export const questOrderSchema = z.object({
  quests: z.array(
    z.object({
      id: z.string().uuid(),
      order_position: z.number().min(0),
    })
  ),
});

export function validateQuest(data: unknown) {
  return questSchema.safeParse(data);
}

export function validateQuestUpdate(data: unknown) {
  return questSchema.partial().safeParse(data);
}

export function validateQuestProgress(data: unknown) {
  return questProgressSchema.safeParse(data);
}

export function validateQuestOrder(data: unknown) {
  return questOrderSchema.safeParse(data);
}