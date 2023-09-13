import styles from './styles.module.scss';

interface ButtonProps extends Partial<HTMLButtonElement> {
  text?: string;
  active?: boolean;
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
    const { text, ...rest } = props;

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.button[propName] = propValue;
    });

    this.button.innerText = text || '';
    this.button.classList.add(styles.button);

    return this;
  }

  render() {
    return this.button;
  }
}
