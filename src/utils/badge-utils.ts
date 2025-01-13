export const BADGE_COLORS = {
  status: {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
    default: 'bg-gray-100 text-gray-800'
  },
  type: {
    limited_time: 'bg-purple-100 text-purple-800',
    roulette: 'bg-blue-100 text-blue-800',
    normal: 'bg-gray-100 text-gray-800',
    default: 'bg-gray-100 text-gray-800'
  }
} as const;

export function getStatusBadgeColor(status: string): string {
  return BADGE_COLORS.status[status as keyof typeof BADGE_COLORS.status] || BADGE_COLORS.status.default;
}

export function getTypeBadgeColor(type: string | null): string {
  if (!type) return BADGE_COLORS.type.normal;
  return BADGE_COLORS.type[type as keyof typeof BADGE_COLORS.type] || BADGE_COLORS.type.default;
}