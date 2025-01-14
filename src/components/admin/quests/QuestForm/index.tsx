'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/admin/ui/Button';
import { QuestFormData } from '@/types/quest';
import { questSchema } from '@/lib/validations/quest';
import { QuestFormFields } from './QuestFormFields';
import { QuestFormProps } from './types';
import type { UseFormRegister, Control, FieldErrors } from 'react-hook-form';

const defaultValues: QuestFormData = {
  title: '',
  description: '',
  type: null,
  platform: null,
  points: null,
  status: 'draft',
  difficulty: 1,
  is_important: false,
  is_limited: false,
  category: null,
  tags: null,
  exp_reward: 100,
  start_date: null,
  end_date: null,
  participants_limit: null,
  order_position: 0,
  estimated_time: null,
  required_points: null,
  auto_progress: false,
  verification_required: false,
  verification_type: null,
  max_attempts: null,
  cooldown_period: null,
  external_url: null,
  banner_url: null,
};

export function QuestForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: QuestFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: initialData || defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <QuestFormFields
        register={register as UseFormRegister<QuestFormData>}
        errors={errors as FieldErrors<QuestFormData>}
        control={control as Control<QuestFormData>}
        isSubmitting={isSubmitting}
      />

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  );
}