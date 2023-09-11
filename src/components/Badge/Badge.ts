import styles from './styles.module.scss';

export type BadgeAppearance = 'light' | 'attention' | 'positive' | 'negative' | 'info';

export class Badge {
  private badge = document.createElement('div');

  constructor(title: string, appearance: BadgeAppearance) {
    this.badge.innerHTML = title;
    this.badge.classList.add(styles.badge);
    this.badge.classList.add(styles[appearance]);
  }

  render() {
    return this.badge;
  }
}
