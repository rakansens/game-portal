import { z } from 'zod';

export const questSchema = z.object({
  title: z.string().min(1, '必須項目です').max(100, '100文字以内で入力してください'),
  description: z.string().min(1, '必須項目です').max(500, '500文字以内で入力してください'),
  type: z.enum(['normal', 'special', 'limited_time']).nullable(),
  platform: z.string().nullable(),
  points: z.coerce.number().min(0).default(0),
  status: z.enum(['draft', 'active', 'completed', 'archived']).default('active'),
  difficulty: z.number().min(1).max(5).default(1),
  is_important: z.boolean().default(false),
  is_limited: z.boolean().default(false),
  category: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  exp_reward: z.coerce.number().min(0).default(0),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  participants_limit: z.coerce.number().nullable(),
  order_position: z.number().nullable(),
  estimated_time: z.coerce.number().nullable(),
  required_points: z.coerce.number().nullable(),
  max_attempts: z.coerce.number().nullable(),
  cooldown_period: z.coerce.number().nullable(),
  external_url: z.string().url().nullable().optional(),
  banner_url: z.string().url().nullable().optional(),
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