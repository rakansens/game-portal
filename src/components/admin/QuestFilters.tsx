import { Select } from '@/components/shared/ui/Select';
import { Quest } from '@/types/quest';
import { Checkbox } from '@/components/shared/ui/Checkbox';

interface QuestFiltersProps {
  quests: Quest[];
  selectedTypes: string[];
  selectedPlatforms: string[];
  selectedStatuses: string[];
  onTypeChange: (types: string[]) => void;
  onPlatformChange: (platforms: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
}

export function QuestFilters({
  quests,
  selectedTypes,
  selectedPlatforms,
  selectedStatuses,
  onTypeChange,
  onPlatformChange,
  onStatusChange,
}: QuestFiltersProps) {
  // クエストの種類、プラットフォーム、ステータスの一覧を取得（nullを除外）
  const types = Array.from(
    new Set(quests.map((quest) => quest.type).filter((type): type is string => type !== null))
  );
  const platforms = Array.from(
    new Set(quests.map((quest) => quest.platform).filter((platform): platform is string => platform !== null))
  );
  const statuses = Array.from(
    new Set(quests.map((quest) => quest.status))
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">タイプ</h3>
        <div className="space-y-2">
          {types.map((type) => (
            <Checkbox
              key={type}
              label={type}
              checked={selectedTypes.includes(type)}
              onChange={(e) => {
                if (e.target.checked) {
                  onTypeChange([...selectedTypes, type]);
                } else {
                  onTypeChange(selectedTypes.filter((t) => t !== type));
                }
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">プラットフォーム</h3>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <Checkbox
              key={platform}
              label={platform}
              checked={selectedPlatforms.includes(platform)}
              onChange={(e) => {
                if (e.target.checked) {
                  onPlatformChange([...selectedPlatforms, platform]);
                } else {
                  onPlatformChange(selectedPlatforms.filter((p) => p !== platform));
                }
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">ステータス</h3>
        <div className="space-y-2">
          {statuses.map((status) => (
            <Checkbox
              key={status}
              label={status}
              checked={selectedStatuses.includes(status)}
              onChange={(e) => {
                if (e.target.checked) {
                  onStatusChange([...selectedStatuses, status]);
                } else {
                  onStatusChange(selectedStatuses.filter((s) => s !== status));
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}