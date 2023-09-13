import { Button } from '@src/components/Button';

import { CARET_LEFT, CARET_RIGHT } from './constants';
import styles from './menu.module.scss';

interface MenuProps extends Partial<HTMLDivElement> {
  toggleAside: () => void;
  subscribeOnAsideToggle: (fn: (isAsideOpen: boolean) => void) => void;
}

/**
 * @constructor
 * @param {MenuProps} props - import type { MenuProps } from '@src/components/Menu'
 *
 * UI Component
 */
export class Menu {
  private isOpen: boolean = true;

  private container: HTMLElement = document.createElement('div');

  private header: HTMLElement = document.createElement('div');
  private logo: HTMLElement = document.createElement('h1');
  private openButton = new Button({ appearance: 'transparent' }).render();

  constructor(props: MenuProps) {
    const { toggleAside, subscribeOnAsideToggle, ...rest } = props;

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.container[propName] = propValue;
    });

    this.container.id = 'tasks-aside-menu';
    this.container.classList.add(styles.menu);

    this.header.classList.add(styles.header);

    this.logo.classList.add(styles.logo);
    this.logo.innerText = 'Tasks';

    this.openButton.innerHTML = CARET_LEFT;
    this.openButton.onclick = toggleAside;

    this.header.append(this.logo, this.openButton);

    this.container.append(this.header);

    subscribeOnAsideToggle(this.setIsOpen.bind(this));
  }

  private setIsOpen(isAsideOpen: boolean) {
    this.isOpen = isAsideOpen;
    this.rerenderHeader(isAsideOpen);
  }

  private rerenderHeader(isAsideOpen: boolean) {
    if (isAsideOpen) {
      this.logo.innerText = 'Tasks';
      this.openButton.innerHTML = CARET_LEFT;
    } else {
      this.logo.innerText = '';
      this.openButton.innerHTML = CARET_RIGHT;
    }

    this.header.innerHTML = '';
    this.header.append(this.logo, this.openButton);
  }

  render() {
    return this.container;
  }
}
