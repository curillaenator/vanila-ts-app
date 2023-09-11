import styles from './styles.module.scss';

export class Button {
  private button = document.createElement('button');

  constructor(title: string) {
    this.button.innerHTML = title;
    this.button.classList.add(styles.button);
  }

  render() {
    return this.button;
  }
}
