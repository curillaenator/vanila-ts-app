import styles from './dialog.module.scss';

export class Dialog {
  public isOpen: boolean = false;

  private openClassName?: string;
  private visibleClassName?: string;

  private container: HTMLDivElement;
  private content: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add(styles.container);

    const overlay = document.createElement('div');
    overlay.classList.add(styles.overlay);
    overlay.onclick = this.close.bind(this);

    this.content = document.createElement('div');
    this.content.classList.add(styles.content);

    this.container.append(overlay);
    this.container.append(this.content);

    document.body.append(this.container);
  }

  open() {
    this.openClassName = styles.container_open;
    this.visibleClassName = styles.container_visible;

    this.container.classList.add(this.openClassName);
    this.container.classList.add(this.visibleClassName);

    this.isOpen = true;
  }

  close() {
    this.container.classList.remove(this.openClassName as string);

    setTimeout(() => {
      this.container.classList.remove(this.visibleClassName as string);
      this.isOpen = false;
    }, 200);
  }

  setContent(dialogContent: HTMLElement) {
    this.content.innerHTML = '';
    this.content.append(dialogContent);
  }
}
