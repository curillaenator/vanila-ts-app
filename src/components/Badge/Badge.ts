import { UIComponent } from '@src/core/UIComponent/UIComponent';

import type { BadgeProps } from './interfaces';
import styles from './styles.module.scss';

/**
 * @param {BadgeProps} props - import type { BadgeProps } from '@src/components/Badge'
 *
 * UI Component
 */
export class Badge extends UIComponent {
  constructor(props: BadgeProps) {
    const { title, appearance, size = 'medium', bordered = false, ...rest } = props;

    super({ ...rest, as: 'span' });

    this.component.innerText = title;
    this.component.classList.add(styles.badge, styles[appearance], styles[size]);
    if (bordered) this.component.classList.add(styles.badge_bordered);
  }
}
