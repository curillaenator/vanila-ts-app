import styles from './dialog.module.scss';

export interface DialogProps extends Partial<HTMLDivElement> {
  portalId?: string;
  openByDefault?: boolean;
}

/**
 * Singleton
 * @constructor
 * @param {DialogProps} props - import type { DialogProps } from '@src/components/Dialog'
 */
export class Dialog {
  public isOpen: boolean = false;

  private instance: Dialog | null = null;

  private container: HTMLDivElement = document.createElement('div');
  private overlay: HTMLDivElement = document.createElement('div');
  private content: HTMLElement = document.createElement('div');

  constructor(props?: DialogProps) {
    if (this.instance !== null) {
      return this.instance;
    }

    const { openByDefault = false, portalId = 'dialog-portal', ...rest } = props || {};

    this.isOpen = openByDefault;

    this.container.id = portalId;
    this.container.classList.add(styles.container);
    this.content.classList.add(styles.content);

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.container[propName] = propValue;
    });

    this.overlay.classList.add(styles.overlay);
    this.overlay.onclick = () => this.close.call(this);

    // document.body.append(this.container);

    this.instance = this;
  }

  open() {
    this.container.append(this.overlay, this.content);
    this.container.classList.add(styles.container_open);
    this.container.classList.add(styles.container_visible);
    this.isOpen = true;
  }

  close() {
    this.container.classList.remove(styles.container_open);

    setTimeout(() => {
      this.container.classList.remove(styles.container_visible);
      this.isOpen = false;
      this.container.innerHTML = '';
    }, 200);
  }

  toggleDialog() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  setContent(dialogContent: HTMLElement) {
    this.content.innerHTML = '';
    this.content.append(dialogContent);
  }

  render() {
    return this.container;
  }
}
