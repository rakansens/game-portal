'use client';

import { Input } from '@/components/shared/ui/Input';
import { QuestFormFieldsProps } from './types';

export function QuestFormFields({
  register,
  errors,
  control,
  isSubmitting,
}: QuestFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <Input
          label="タイトル"
          {...register('title')}
          error={errors.title?.message}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Input
          label="説明"
          {...register('description')}
          error={errors.description?.message}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Input
          type="number"
          label="ポイント報酬"
          {...register('points', { valueAsNumber: true })}
          error={errors.points?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          type="date"
          label="開始日"
          {...register('start_date')}
          error={errors.start_date?.message}
          disabled={isSubmitting}
        />

        <Input
          type="date"
          label="終了日"
          {...register('end_date')}
          error={errors.end_date?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          type="number"
          label="参加者上限"
          {...register('participants_limit', { valueAsNumber: true })}
          error={errors.participants_limit?.message}
          disabled={isSubmitting}
        />

        <Input
          type="number"
          label="必要ポイント"
          {...register('required_points', { valueAsNumber: true })}
          error={errors.required_points?.message}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}