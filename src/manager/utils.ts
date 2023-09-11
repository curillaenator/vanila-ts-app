import { BadgeAppearance } from '@src/components/Badge';

const DAY = 1000 * 60 * 60 * 24;
const HALFSPRINT = DAY * 3;
const SPRINT = DAY * 7;

export const checkExpiry = (expiresAt: Date): BadgeAppearance => {
  const diff = +new Date(expiresAt) - +new Date();

  switch (true) {
    case diff < DAY:
      return 'negative';
    case diff < HALFSPRINT:
      return 'attention';
    case diff < SPRINT:
      return 'info';
    default:
      return 'light';
  }
};
