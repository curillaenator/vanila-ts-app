import styles from './button.module.scss';

interface ButtonProps extends Partial<HTMLButtonElement> {
  text?: string;
  active?: boolean;
  appearance?: 'solid' | 'transparent';
}

/**
 * @constructor
 * @param {ButtonProps} props - import type { ButtonProps } from '@src/components/Button'
 *
 * UI Component
 */
export class Button {
  private button = document.createElement('button');

  constructor(props: ButtonProps) {
    const { text, appearance = 'solid', ...rest } = props;

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.button[propName] = propValue;
    });

    this.button.innerHTML = `<span class="${styles.text}">${text}</span>`;
    this.button.classList.add(styles.button, styles[appearance]);

    return this;
  }

  render() {
    return this.button;
  }
}
