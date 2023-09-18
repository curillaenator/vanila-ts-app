import { api } from '@src/api';
import store, { useGlobalState } from '@src/core/GlobalStore';
import { Dialog } from '@src/components/Dialog';

import type { ScreenType, ColorMode } from '@src/types';
import styles from './layout.module.scss';

/**
 * @description Singleton providing generated layout instance
 */

export class Layout {
  public screen: ScreenType = 'desktop';

  private pageContainer: HTMLElement = document.createElement('div');

  private aside: HTMLElement = document.createElement('aside');
  public isAsideOpen: boolean = true;
  private asideopenSubscribers: ((isAsideOpen: boolean) => void)[] = [];

  private header: HTMLElement = document.createElement('header');
  private headerRightSlots: HTMLElement[] = [];
  private headerLeftSlots: HTMLElement[] = [];

  private dialog = new Dialog({ portalId: 'app-modal-portal' });

  private contentContainer: HTMLElement = document.createElement('main');

  constructor() {
    store.create({
      colorMode: 'light',
    });

    const [getColorMode, setColorMode] = useGlobalState<ColorMode>('colorMode');

    api.getSettings().then((res) => {
      setColorMode(res.colorMode);
      document.body.dataset.theme = getColorMode();
    });

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
      this.dialog.render(), // dialog must be always last
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

  renderHeaderContent() {
    const left = this.header.querySelector('#slots-left') as HTMLElement;
    const right = this.header.querySelector('#slots-right') as HTMLElement;

    left.innerHTML = '';
    right.innerHTML = '';

    if (!this.headerLeftSlots.length && !this.headerRightSlots.length) {
      this.header.classList.add(styles.header_hidden);
    } else {
      this.header.classList.remove(styles.header_hidden);
    }

    // TODO: optimize rerender
    this.headerLeftSlots.forEach((htmlEl) => {
      left.append(htmlEl);
    });

    this.headerRightSlots.forEach((htmlEl) => {
      right.append(htmlEl);
    });
  }

  setDialogContent(dialogContent: HTMLElement) {
    this.dialog.setContent.call(this.dialog, dialogContent);
  }

  setAsideContent(asideContent: HTMLElement) {
    this.aside.innerHTML = '';
    this.aside.append(asideContent);
  }

  setMainContent(mainContent: HTMLElement) {
    this.contentContainer.innerHTML = '';
    this.contentContainer.append(mainContent);
  }

  observeToggleAside(fn: (isAsideOpen: boolean) => void) {
    this.asideopenSubscribers.push(fn);
  }

  toggleAside() {
    this.isAsideOpen = !this.isAsideOpen;

    if (this.isAsideOpen) {
      document.body.style.setProperty('--app-layout-aside-w', '384px');
    } else {
      document.body.style.setProperty('--app-layout-aside-w', '98px');
    }

    this.asideopenSubscribers.forEach((fn) => fn(this.isAsideOpen));
  }

  toggleDialog() {
    this.dialog.toggleDialog.call(this.dialog);
  }

  setHeaderLeftSlot(...elements: HTMLElement[]) {
    this.headerLeftSlots = elements;
    this.renderHeaderContent();
  }

  setHeaderRightSlot(...elements: HTMLElement[]) {
    this.headerRightSlots = elements;
    this.renderHeaderContent();
  }
}

/**
 * @description Singleton providing generated layout instance
 */
export const layout = new Layout();
