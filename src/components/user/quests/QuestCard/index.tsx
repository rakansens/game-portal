'use client';

import { Badge } from '@/components/shared/ui/Badge';
import { QuestCardProps } from './types';
import {
  cardStyles,
  headerStyles,
  titleContainerStyles,
  titleStyles,
  descriptionStyles,
  badgeContainerStyles,
  tagContainerStyles,
} from './styles';

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <div className={cardStyles}>
      <div className={headerStyles}>
        <div className={titleContainerStyles}>
          <h3 className={titleStyles}>{quest.title}</h3>
          <p className={descriptionStyles}>{quest.description}</p>
        </div>
        <Badge variant={quest.is_important ? 'danger' : 'default'}>
          {quest.is_important ? '重要' : 'ノーマル'}
        </Badge>
      </div>

      <div className={badgeContainerStyles}>
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
        <div className={tagContainerStyles}>
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
