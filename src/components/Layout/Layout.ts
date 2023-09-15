import { Dialog } from '@src/components/Dialog';
// import { Badge } from '@src/components/Badge';

import type { ScreenType, ColorMode } from '@src/types';
import styles from './layout.module.scss';

// const COLUMN_IDS = ['tasks-opened', 'tasks-in-process', 'tasks-done'];
// const COLUMN_TITLES = ['Opened', 'In process', 'Accomplished'];

/**
 * @description Singleton providing generated layout instance
 */

export class Layout {
  public colorMode: ColorMode = 'light';
  private colorModeSubscribers: ((cMode: ColorMode) => void)[] = [];

  public screen: ScreenType = 'desktop';

  private pageContainer: HTMLElement = document.createElement('div');

  private aside: HTMLElement = document.createElement('aside');
  private isAsideOpen: boolean = true;
  private asideopenSubscribers: ((isAsideOpen: boolean) => void)[] = [];

  private header: HTMLElement = document.createElement('header');
  private headerRightSlots: HTMLElement[] = [];
  private headerLeftSlots: HTMLElement[] = [];

  private dialog = new Dialog({ portalId: 'app-modal-portal' });

  private contentContainer: HTMLElement = document.createElement('main');

  constructor() {
    document.body.dataset.theme = this.colorMode;
    document.body.style.setProperty('--app-layout-aside-w', '384px');

    window.addEventListener('resize', this.watchWindowSize);

    this.pageContainer.id = 'app-page';
    this.pageContainer.classList.add(styles.pageContainer);

    this.header.id = 'app-header';
    this.header.classList.add(styles.header);
    this.header.append(
      ...['left', 'right'].map((slot) => {
        const slotContainer = document.createElement('div');
        slotContainer.id = `slots-${slot}`;
        slotContainer.classList.add(styles.slots);
        return slotContainer;
      }),
    );

    this.aside.id = 'app-aside';
    this.aside.classList.add(styles.aside);

    this.contentContainer.id = 'app-main';

    this.pageContainer.append(this.header, this.contentContainer);

    document.body.append(
      this.aside,
      this.pageContainer,
      this.dialog.dialogNode, // dialog must be always last
    );

    return this;
  }

  private watchWindowSize() {
    let newScreen: ScreenType;
    const w = window.innerWidth;

    switch (true) {
      case w < 768:
        newScreen = 'mobile';
        break;
      case w < 1280:
        newScreen = 'tablet';
        break;
      case w < 1920:
        newScreen = 'laptop';
        break;
      default:
        newScreen = 'desktop';
        break;
    }

    if (this.screen !== newScreen) {
      this.screen = newScreen;
    }
  }

  private renderHeaderContent() {
    const left = this.header.querySelector('#slots-left') as HTMLElement;
    const right = this.header.querySelector('#slots-right') as HTMLElement;

    left.innerHTML = '';
    right.innerHTML = '';

    // TODO: optimize rerender
    this.headerLeftSlots.forEach((htmlEl) => {
      left.append(htmlEl);
    });

    this.headerRightSlots.forEach((htmlEl) => {
      right.append(htmlEl);
    });
  }

  public setDialogContent(dialogContent: HTMLElement) {
    this.dialog.setContent.call(this.dialog, dialogContent);
  }

  public setAsideContent(asideContent: HTMLElement) {
    this.aside.innerHTML = '';
    this.aside.append(asideContent);
  }

  public setMainContent(mainContent: HTMLElement) {
    this.contentContainer.innerHTML = '';
    this.contentContainer.append(mainContent);
  }

  public observeToggleAside(fn: (isAsideOpen: boolean) => void) {
    this.asideopenSubscribers.push(fn);
  }

  public observeColorMode(fn: (cMode: ColorMode) => void) {
    this.colorModeSubscribers.push(fn);
  }

  public toggleAside() {
    this.isAsideOpen = !this.isAsideOpen;

    if (this.isAsideOpen) {
      document.body.style.setProperty('--app-layout-aside-w', '384px');
    } else {
      document.body.style.setProperty('--app-layout-aside-w', '98px');
    }

    this.asideopenSubscribers.forEach((fn) => fn(this.isAsideOpen));
  }

  public toggleDialog() {
    this.dialog.toggleDialog.call(this.dialog);
  }

  public toggleColorMode() {
    this.colorMode = this.colorMode === 'light' ? 'dark' : 'light';

    document.body.dataset.theme = this.colorMode;

    this.colorModeSubscribers.forEach((fn) => fn(this.colorMode));
  }

  public setHeaderLeftSlot(...elements: HTMLElement[]) {
    this.headerLeftSlots.unshift(...elements);
    this.renderHeaderContent();
  }

  public setHeaderRightSlot(...elements: HTMLElement[]) {
    this.headerRightSlots.push(...elements);
    this.renderHeaderContent();
  }
}

/**
 * @description Singleton providing generated layout instance
 */
export const layout = new Layout();
