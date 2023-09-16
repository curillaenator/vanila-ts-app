import styles from './button.module.scss';

interface ButtonProps extends Partial<HTMLButtonElement> {
  text?: string;
  icon?: string;
  active?: boolean;
  appearance?: 'solid' | 'transparent';
  fullwidth?: boolean;
}

/**
 * @constructor
 * @param {ButtonProps} props - import type { ButtonProps } from '@src/components/Button'
 *
 * UI Component
 */
export class Button {
  private button: HTMLButtonElement = document.createElement('button');
  private buttonText: HTMLSpanElement = document.createElement('span');
  private buttonIcon: HTMLSpanElement = document.createElement('div');

  constructor(props: ButtonProps) {
    const { text, appearance = 'solid', icon, dataset, fullwidth = false, ...rest } = props;

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.button[propName] = propValue;
    });

    if (dataset) {
      Object.entries(dataset).forEach(([ds, value]) => {
        this.button.dataset[ds] = value;
      });
    }

    this.buttonIcon.classList.add(styles.icon);

    if (icon) {
      this.buttonIcon.innerHTML = icon;
      this.button.append(this.buttonIcon);
    }

    this.buttonText.classList.add(styles.text);
    this.buttonText.innerText = text || '';
    this.button.append(this.buttonText);

    this.button.classList.add(styles.button, styles[appearance]);
    if (fullwidth) {
      this.button.classList.add(styles.button_fullwidth);
    }
  }

  updateText(newText: string) {
    this.buttonText.innerText = newText;
  }

  updateIcon(newIcon: string) {
    this.buttonIcon.innerHTML = newIcon;

    if (!this.buttonIcon) {
      this.button.prepend(this.buttonIcon);
    }
  }

  getDataset(key: string) {
    return this.button.dataset[key];
  }

  addClassNama(className: string) {
    this.button.classList.add(className);
  }

  removeClassNama(className: string) {
    this.button.classList.remove(className);
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

  render() {
    return this.button;
  }
}
