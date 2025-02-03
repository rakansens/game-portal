import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rankingSchema } from '@/lib/validations/ranking';
import { Input } from '@/components/admin/ui/Input';
import { Button } from '@/components/admin/ui/Button';
import { UserRanking, RankingFormData } from '@/types/ranking';
import { useState, useEffect } from 'react';

interface RankingFormProps {
  initialData?: UserRanking;
  onSubmit: (data: RankingFormData) => void;
  onCancel: () => void;
}

interface UserOption {
  value: string;
  label: string;
  avatar_url: string | null;
}

export function RankingForm({ initialData, onSubmit, onCancel }: RankingFormProps) {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RankingFormData>({
    resolver: zodResolver(rankingSchema),
    defaultValues: initialData ? {
      user_id: initialData.user_id,
      points: initialData.points
    } : undefined
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users/list');
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }
        const users = await response.json();
        setUsers(
          users.map((user: any) => ({
            value: user.line_user_id,
            label: user.display_name || 'Unknown User',
            avatar_url: user.picture_url
          }))
        );
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const selectedUserId = watch('user_id');
  const selectedUser = users.find(user => user.value === selectedUserId);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white">
      <div className="border-b border-gray-200 pb-6">
        <p className="text-sm text-gray-500">ランキング情報を入力してください</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ユーザー</label>
          <select
            {...register('user_id')}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            disabled={!!initialData}
          >
            <option value="">ユーザーを選択</option>
            {users.map(user => (
              <option key={user.value} value={user.value}>
                {user.label}
              </option>
            ))}
          </select>
          {errors.user_id && (
            <p className="text-sm text-red-500">{errors.user_id.message}</p>
          )}
        </div>

        {selectedUser && (
          <div className="flex items-center space-x-4">
            <img
              src={selectedUser.avatar_url || '/default-avatar.png'}
              alt={selectedUser.label}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <p className="font-medium">{selectedUser.label}</p>
            </div>
          </div>
        )}

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
