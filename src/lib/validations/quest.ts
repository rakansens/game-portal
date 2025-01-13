import { z } from 'zod';

export const questSchema = z.object({
  title: z.string().min(1, '必須項目です').max(100, '100文字以内で入力してください'),
  description: z.string().min(1, '必須項目です').max(500, '500文字以内で入力してください'),
  type: z.string().nullable(),
  platform: z.string().nullable(),
  points: z.number().nullable(),
  status: z.enum(['draft', 'active', 'completed', 'archived']),
  difficulty: z.number().min(1).max(5),
  is_important: z.boolean(),
  is_limited: z.boolean(),
  category: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  exp_reward: z.number().min(0),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  participants_limit: z.number().nullable(),
  order_position: z.number().nullable(),
  estimated_time: z.number().nullable(),
  required_points: z.number().nullable(),
  auto_progress: z.boolean().optional(),
  verification_required: z.boolean().optional(),
  verification_type: z.enum(['manual', 'automatic']).nullable(),
  max_attempts: z.number().nullable(),
  cooldown_period: z.number().nullable(),
  external_url: z.string().url().nullable(),
  banner_url: z.string().url().nullable(),
});

export const questUpdateSchema = questSchema.partial();

export const questOrderSchema = z.object({
  quests: z.array(z.object({
    id: z.string().uuid(),
    order_position: z.number().min(0),
  })),
});

export type QuestValidationSchema = z.infer<typeof questSchema>;
export type QuestUpdateValidationSchema = z.infer<typeof questUpdateSchema>;
export type QuestOrderValidationSchema = z.infer<typeof questOrderSchema>;

export function validateQuest(data: unknown) {
  try {
    return { data: questSchema.parse(data), error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { data: null, error: [{ path: '', message: '不正なデータ形式です' }] };
  }
}

export function validateQuestUpdate(data: unknown) {
  try {
    return { data: questUpdateSchema.parse(data), error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { data: null, error: [{ path: '', message: '不正なデータ形式です' }] };
  }
}

export function validateQuestOrder(data: unknown) {
  try {
    return { data: questOrderSchema.parse(data), error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { data: null, error: [{ path: '', message: '不正なデータ形式です' }] };
  }
}