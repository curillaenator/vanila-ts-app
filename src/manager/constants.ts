import type { StatusType } from '@src/types';
import type { BadgeAppearance } from '@src/components/Badge';

export const BADGE_APPEARANCE_ASSOC: Record<StatusType, BadgeAppearance> = {
  open: 'light',
  inProces: 'info',
  done: 'positive',
};
