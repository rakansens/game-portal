import { Badge } from '@/components/shared/ui/Badge';
import { PublicQuest } from '@/types/quest';

interface QuestCardProps {
  quest: PublicQuest;
}

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{quest.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{quest.description}</p>
        </div>
        <Badge variant={quest.is_important ? 'danger' : 'default'}>
          {quest.is_important ? '重要' : 'ノーマル'}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quest.type && (
          <Badge variant="primary">{quest.type}</Badge>
        )}
        {quest.platform && (
          <Badge variant="secondary">{quest.platform}</Badge>
        )}
        <Badge variant="info">
          {quest.exp_reward}EXP
        </Badge>
        {quest.points && (
          <Badge variant="success">
            {quest.points}ポイント
          </Badge>
        )}
      </div>

      {quest.tags && quest.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {quest.tags.map((tag) => (
            <Badge key={tag} variant="gray">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
