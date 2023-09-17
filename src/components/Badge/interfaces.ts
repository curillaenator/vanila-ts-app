export type BadgeAppearance = 'white' | 'light' | 'attention' | 'positive' | 'negative' | 'info';

export interface BadgeProps extends Partial<HTMLSpanElement> {
  title: string;
  appearance: 'white' | 'light' | 'attention' | 'positive' | 'negative' | 'info';
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
}
