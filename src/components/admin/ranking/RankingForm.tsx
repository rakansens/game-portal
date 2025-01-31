import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rankingSchema, type RankingFormData } from '@/lib/validations/ranking';
import { Input } from '@/components/admin/ui/Input';
import { Button } from '@/components/admin/ui/Button';
import { UserRanking } from '@/types/ranking';

interface RankingFormProps {
  initialData?: UserRanking;
  onSubmit: (data: RankingFormData) => void;
  onCancel: () => void;
}

export function RankingForm({ initialData, onSubmit, onCancel }: RankingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RankingFormData>({
    resolver: zodResolver(rankingSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white">
      <div className="border-b border-gray-200 pb-6">
        <p className="text-sm text-gray-500">ランキング情報を入力してください</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ユーザー名</label>
          <Input
            {...register('username')}
            type="text"
            placeholder="ユーザー名を入力"
            error={errors.username?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">アバターURL</label>
          <Input
            {...register('avatar_url')}
            type="url"
            placeholder="https://example.com/avatar.png"
            error={errors.avatar_url?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ポイント</label>
          <Input
            {...register('points', { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="0"
            error={errors.points?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">レベル</label>
          <Input
            {...register('level', { valueAsNumber: true })}
            type="number"
            min={1}
            placeholder="1"
            error={errors.level?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">完了クエスト数</label>
          <Input
            {...register('quest_completed', { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="0"
            error={errors.quest_completed?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ランク</label>
          <Input
            {...register('rank', { valueAsNumber: true })}
            type="number"
            min={1}
            placeholder="1"
            error={errors.rank?.message}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  );
}
