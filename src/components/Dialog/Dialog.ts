import styles from './dialog.module.scss';

export interface DialogProps extends Partial<HTMLDivElement> {
  openByDefault?: boolean;
}

export class Dialog {
  public isOpen: boolean;

  private container: HTMLDivElement;
  private content: HTMLElement;

  constructor(props?: DialogProps) {
    const { openByDefault = false, ...rest } = props || {};

    this.isOpen = openByDefault;

    this.container = document.createElement('div');
    this.container.id = 'tasks-modal-portal';
    this.container.classList.add(styles.container);

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.container[propName] = propValue;
    });

    const overlay = document.createElement('div');
    overlay.classList.add(styles.overlay);
    overlay.onclick = this.close.bind(this);

    this.content = document.createElement('div');
    this.content.classList.add(styles.content);

    this.container.append(overlay, this.content);

    document.body.append(this.container);
  }

  open() {
    this.container.classList.add(styles.container_open);
    this.container.classList.add(styles.container_visible);
    this.isOpen = true;
  }

  close() {
    this.container.classList.remove(styles.container_open);
    setTimeout(() => {
      this.container.classList.remove(styles.container_visible);
      this.isOpen = false;
    }, 200);
  }

  setContent(dialogContent: HTMLElement) {
    this.content.innerHTML = '';
    this.content.append(dialogContent);
  }
}
