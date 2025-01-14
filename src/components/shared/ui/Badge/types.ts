export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'gray'
  | 'indigo'
  | 'purple'
  | 'special'
  | 'limited'
  | 'exp'
  | 'points';

export type BadgeSize = 'default' | 'sm' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}