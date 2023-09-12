import styles from './styles.module.scss';

export type BadgeAppearance = 'white' | 'light' | 'attention' | 'positive' | 'negative' | 'info';

interface BadgeProps extends Partial<HTMLSpanElement> {
  title: string;
  appearance: 'white' | 'light' | 'attention' | 'positive' | 'negative' | 'info';
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
}

export class Badge {
  private badge = document.createElement('span');

  constructor(props: BadgeProps) {
    const { title, appearance, size = 'medium', bordered = false, ...rest } = props;

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.badge[propName] = propValue;
    });

    this.badge.innerText = title;
    this.badge.classList.add(styles.badge);
    if (bordered) this.badge.classList.add(styles.badge_bordered);
    this.badge.classList.add(styles[appearance]);
    this.badge.classList.add(styles[size]);
  }

  render() {
    return this.badge;
  }
}
