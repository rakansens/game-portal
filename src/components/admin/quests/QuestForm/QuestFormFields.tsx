'use client';

import { Input } from '@/components/shared/ui/Input';
import { Select } from '@/components/shared/ui/Select';
import { Checkbox } from '@/components/shared/ui/Checkbox';
import { QuestFormFieldsProps } from './types';
import { QuestStatus, QuestType } from '@/types/quest';

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Select
          label="タイプ"
          {...register('type')}
          error={errors.type?.message}
          disabled={isSubmitting}
          options={[
            { value: 'normal', label: 'ノーマル' },
            { value: 'special', label: 'スペシャル' },
            { value: 'limited_time', label: '期間限定' },
          ]}
        />

        <Select
          label="ステータス"
          {...register('status')}
          error={errors.status?.message}
          disabled={isSubmitting}
          options={[
            { value: 'draft', label: '下書き' },
            { value: 'active', label: 'アクティブ' },
            { value: 'completed', label: '完了' },
            { value: 'archived', label: 'アーカイブ' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          type="number"
          label="EXP報酬"
          {...register('exp_reward')}
          error={errors.exp_reward?.message}
          disabled={isSubmitting}
        />

        <Input
          type="number"
          label="ポイント報酬"
          {...register('points')}
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
          {...register('participants_limit')}
          error={errors.participants_limit?.message}
          disabled={isSubmitting}
        />

        <Input
          type="number"
          label="推定所要時間（分）"
          {...register('estimated_time')}
          error={errors.estimated_time?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          type="number"
          label="必要ポイント"
          {...register('required_points')}
          error={errors.required_points?.message}
          disabled={isSubmitting}
        />

        <Input
          type="number"
          label="最大挑戦回数"
          {...register('max_attempts')}
          error={errors.max_attempts?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          type="number"
          label="クールダウン期間（分）"
          {...register('cooldown_period')}
          error={errors.cooldown_period?.message}
          disabled={isSubmitting}
        />

        <Input
          label="外部URL"
          {...register('external_url')}
          error={errors.external_url?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-4">
        <Checkbox
          label="重要"
          {...register('is_important')}
          error={errors.is_important?.message}
          disabled={isSubmitting}
        />

        <Checkbox
          label="期間限定"
          {...register('is_limited')}
          error={errors.is_limited?.message}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}