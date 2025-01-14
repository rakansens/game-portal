import { HTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { badgeVariants } from './styles';

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}