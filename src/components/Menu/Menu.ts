import { Button } from '@src/components/Button';
import type { RouterQuery } from '@src/router';

import { CARET_LEFT, CARET_RIGHT, SETTINGS_ICON } from '@src/shared/icons';
import styles from './menu.module.scss';

interface MenuProps extends Partial<HTMLDivElement> {
  toggleAside: () => void;
  subscribeOnAsideToggle: (fn: (isAsideOpen: boolean) => void) => void;
  navigate: (q: RouterQuery) => void;
}

export interface NavItem {
  id: string;
  to: string;
  label: string;
  icon?: string;
}

/**
 * @constructor
 * @param {MenuProps} props - import type { MenuProps } from '@src/components/Menu'
 *
 * UI Component
 */
export class Menu {
  private container: HTMLElement = document.createElement('div');

  private logo: HTMLElement = document.createElement('h1');
  private openButton = new Button({ appearance: 'transparent' }).render();
  private header: HTMLElement = document.createElement('header');

  private content: HTMLElement = document.createElement('nav');
  private navItems: Button[] = [];

  private footer: HTMLElement = document.createElement('footer');
  private footerButton: HTMLElement = document.createElement('button');

  constructor(props: MenuProps) {
    const { toggleAside, subscribeOnAsideToggle, navigate, ...rest } = props;

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.container[propName] = propValue;
    });

    this.container.id = 'app-aside-menu';
    this.container.classList.add(styles.menu);

    this.header.classList.add(styles.header);
    this.content.classList.add(styles.content);
    this.footer.classList.add(styles.footer);

    this.logo.classList.add(styles.logo);
    this.logo.innerText = 'Tasks';

    this.openButton.innerHTML = CARET_LEFT;
    this.openButton.onclick = toggleAside;

    this.footerButton.onclick = () =>
      navigate({
        payload: '',
        pageTitle: 'Settings',
        queries: {
          page: 'settings',
        },
      });
    this.footerButton.innerHTML = `<span>Settings</span>${SETTINGS_ICON}`;

    this.header.append(this.logo, this.openButton);

    this.footer.append(this.footerButton);

    this.container.append(this.header, this.content, this.footer);

    subscribeOnAsideToggle(this.setIsOpen.bind(this));
  }

  private setIsOpen(isAsideOpen: boolean) {
    this.rerender(isAsideOpen);
  }

  private rerender(isAsideOpen: boolean) {
    if (isAsideOpen) {
      this.logo.innerText = 'Tasks';
      this.openButton.innerHTML = CARET_LEFT;
      this.footerButton.innerHTML = `<span>Settings</span>${SETTINGS_ICON}`;
      this.navItems.forEach((navButton) => navButton.hideText.call(navButton, false));
    } else {
      this.logo.innerText = '';
      this.openButton.innerHTML = CARET_RIGHT;
      this.footerButton.innerHTML = `<span></span>${SETTINGS_ICON}`;
      this.navItems.forEach((navButton) => navButton.hideText.call(navButton, true));
    }
  }

  setNavItem(navItem: Button) {
    this.navItems.push(navItem);
  }

  renderContent() {
    this.content.append(...this.navItems.map((navButton) => navButton.render()));
  }

  render() {
    return this.container;
  }
}
