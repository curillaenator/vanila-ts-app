import { UIComponent } from '@src/core/UIComponent/UIComponent';

import type { DialogProps } from './interfaces';
import styles from './dialog.module.scss';

/**
 * @param {DialogProps} props - import type { DialogProps } from '@src/components/Dialog'
 *
 * UI Component
 */
export class Dialog extends UIComponent {
  public isOpen: boolean = false;

  private overlay: HTMLDivElement = document.createElement('div');
  private content: HTMLElement = document.createElement('div');

  constructor(props?: DialogProps) {
    const { openByDefault = false, portalId = 'dialog-portal', ...rest } = props || {};

    super({ ...rest, as: 'div' });

    this.isOpen = openByDefault;

    this.component.id = portalId;
    this.component.classList.add(styles.container);
    this.content.classList.add(styles.content);

    this.overlay.classList.add(styles.overlay);
    this.overlay.onclick = () => this.close.call(this);
  }

  open() {
    this.component.append(this.overlay, this.content);
    this.component.classList.add(styles.container_open);
    this.component.classList.add(styles.container_visible);
    this.isOpen = true;
  }

  close() {
    this.component.classList.remove(styles.container_open);

    setTimeout(() => {
      this.component.classList.remove(styles.container_visible);
      this.isOpen = false;
      this.component.innerHTML = '';
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
}
