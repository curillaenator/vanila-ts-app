export interface ButtonProps extends Partial<HTMLButtonElement> {
  text?: string;
  icon?: string;
  appearance?: 'solid' | 'transparent';
  fullwidth?: boolean;
}
