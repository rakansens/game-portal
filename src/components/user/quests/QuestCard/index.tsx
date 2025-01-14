'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Badge } from '@/components/shared/ui/Badge';
import { QuestCardProps } from './types';
import {
  cardStyles,
  headerStyles,
  titleContainerStyles,
  titleStyles,
  descriptionStyles,
  badgeContainerStyles,
  infoContainerStyles,
  infoItemStyles,
  infoLabelStyles,
  infoValueStyles,
  tagContainerStyles,
  rewardContainerStyles,
  rewardItemStyles,
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
      </div>

      <div className={rewardContainerStyles}>
        <div className={rewardItemStyles}>
          <Badge variant="info">
            {quest.exp_reward}EXP
          </Badge>
        </div>
        {quest.points && (
          <div className={rewardItemStyles}>
            <Badge variant="success">
              {quest.points}ポイント
            </Badge>
          </div>
        )}
      </div>

      <div className={infoContainerStyles}>
        {quest.start_date && (
          <div className={infoItemStyles}>
            <span className={infoLabelStyles}>開始日:</span>
            <span className={infoValueStyles}>
              {format(new Date(quest.start_date), 'yyyy年MM月dd日', { locale: ja })}
            </span>
          </div>
        )}
        {quest.end_date && (
          <div className={infoItemStyles}>
            <span className={infoLabelStyles}>終了日:</span>
            <span className={infoValueStyles}>
              {format(new Date(quest.end_date), 'yyyy年MM月dd日', { locale: ja })}
            </span>
          </div>
        )}
        {quest.estimated_time && (
          <div className={infoItemStyles}>
            <span className={infoLabelStyles}>所要時間:</span>
            <span className={infoValueStyles}>約{quest.estimated_time}分</span>
          </div>
        )}
        {quest.participants_limit && (
          <div className={infoItemStyles}>
            <span className={infoLabelStyles}>参加状況:</span>
            <span className={infoValueStyles}>
              {quest.participant_count || 0}/{quest.participants_limit}人
            </span>
          </div>
        )}
        {quest.required_points && (
          <div className={infoItemStyles}>
            <span className={infoLabelStyles}>必要ポイント:</span>
            <span className={infoValueStyles}>{quest.required_points}ポイント</span>
          </div>
        )}
        {quest.max_attempts && (
          <div className={infoItemStyles}>
            <span className={infoLabelStyles}>挑戦回数:</span>
            <span className={infoValueStyles}>最大{quest.max_attempts}回まで</span>
          </div>
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
