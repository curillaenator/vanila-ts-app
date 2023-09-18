import { UIComponent } from '@src/core/UIComponent/UIComponent';

import type { ButtonProps } from './interfaces';
import styles from './button.module.scss';

/**
 * @param {ButtonProps} props - import type { ButtonProps } from '@src/components/Button'
 *
 * UI Component
 */
export class Button extends UIComponent {
  private buttonText: HTMLSpanElement = document.createElement('span');
  private buttonIcon: HTMLSpanElement = document.createElement('div');

  constructor(props: ButtonProps) {
    const { text, icon, appearance = 'solid', fullwidth = false, ...rest } = props;

    super({ ...rest, as: 'button' });

    this.buttonIcon.classList.add(styles.icon);

    this.buttonText.classList.add(styles.text);
    this.buttonText.innerText = text || '';

    this.component.classList.add(styles.button, styles[appearance]);
    if (fullwidth) {
      this.component.classList.add(styles.button_fullwidth);
    }

    if (icon) {
      this.buttonIcon.innerHTML = icon;
      this.component.append(this.buttonIcon);
    }

    this.component.append(this.buttonText);
  }

  updateText(newText: string) {
    this.buttonText.innerText = newText;
  }

  updateIcon(newIcon: string) {
    this.buttonIcon.innerHTML = newIcon;

    if (!this.buttonIcon) {
      this.component.prepend(this.buttonIcon);
    }
  }

  getDataset(key: string) {
    return this.component.dataset[key];
  }

  addClassName(className: string) {
    this.component.classList.add(className);
  }

  removeClassName(className: string) {
    this.component.classList.remove(className);
  }

  hideText(action: boolean) {
    if (action) {
      this.buttonText.dataset.text = this.buttonText.innerText;
      this.buttonText.innerText = '';
    } else {
      this.buttonText.innerText = this.buttonText.dataset.text || '';
      this.buttonText.dataset.text = '';
    }
  }
}
