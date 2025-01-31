import { z } from 'zod';

export const questSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  description: z.string().min(1, '必須項目です'),
  type: z.string().nullable(),
  platform: z.string().nullable(),
  points: z.number().nullable(),
  status: z.enum(['draft', 'active', 'completed', 'archived']).default('draft'),
  difficulty: z.number().min(1).max(5).default(1),
  is_important: z.boolean().default(false),
  is_limited: z.boolean().default(false),
  category: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  exp_reward: z.number().min(0).default(100),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  participants_limit: z.number().nullable(),
  estimated_time: z.number().nullable(),
  required_points: z.number().nullable(),
  auto_progress: z.boolean().default(false),
  verification_required: z.boolean().default(false),
  verification_type: z.enum(['manual', 'automatic']).nullable(),
  max_attempts: z.number().nullable(),
  cooldown_period: z.number().nullable(),
  external_url: z.string().url('有効なURLを入力してください').min(1, '必須項目です'),
  banner_url: z.string().url('有効なURLを入力してください').nullable(),
  order_position: z.number().default(0),
  participant_count: z.number().nullable(),
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