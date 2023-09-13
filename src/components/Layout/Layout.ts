import { Dialog } from '@src/components/Dialog';
import { Badge } from '@src/components/Badge';

import type { ScreenType, ColorMode } from '@src/types';
import styles from './layout.module.scss';

const COLUMN_IDS = ['tasks-opened', 'tasks-in-process', 'tasks-done'];
const COLUMN_TITLES = ['Opened', 'In process', 'Accomplished'];

/**
 * @description Singleton providing generated layout instance
 */
export class Layout {
  private instance: Layout | null = null;

  public colorMode: ColorMode = 'light';
  public screen: ScreenType = 'desktop';

  private pageContainer: HTMLElement = document.createElement('div');

  private aside: HTMLElement = document.createElement('aside');
  private isAsideOpen: boolean = true;

  private header: HTMLElement = document.createElement('header');
  private headerRightSlots: HTMLElement[] = [];
  private headerLeftSlots: HTMLElement[] = [];

  private taskContainer: HTMLElement = document.createElement('main');
  private dialog = new Dialog({ portalId: 'tasks-modal-portal' });

  constructor() {
    if (this.instance) return this.instance;

    document.body.dataset.theme = this.colorMode;
    document.body.style.setProperty('--tasks-layout-aside-w', '384px');

    window.addEventListener('resize', this.watchWindowSize);

    this.pageContainer.id = 'tasks-page';
    this.pageContainer.classList.add(styles.pageContainer);

    this.header.id = 'tasks-header';
    this.header.classList.add(styles.header);
    this.header.append(
      ...['left', 'right'].map((slot) => {
        const slotContainer = document.createElement('div');
        slotContainer.id = `slots-${slot}`;
        slotContainer.classList.add(styles.slots);
        return slotContainer;
      }),
    );

    this.aside.id = 'tasks-aside';
    this.aside.classList.add(styles.aside);

    this.taskContainer.id = 'tasks-main';
    this.taskContainer.classList.add(styles.taskContainer);

    const columnHeadings = document.createElement('div');
    columnHeadings.classList.add(styles.headings);

    const columnHeadingsTitles = COLUMN_TITLES.map((colTitle) => {
      const heading = document.createElement('div');
      heading.classList.add(styles.head);

      heading.append(
        new Badge({
          title: colTitle,
          appearance: 'white',
          size: 'large',
          bordered: true,
        }).render(),
      );

      return heading;
    });

    columnHeadings.append(...columnHeadingsTitles);

    const columns = COLUMN_IDS.map((colId) => {
      const column = document.createElement('div');
      column.id = colId;
      column.classList.add(styles.column);
      return column;
    });

    this.taskContainer.append(columnHeadings, ...columns);

    this.pageContainer.append(this.header, this.taskContainer);

    document.body.append(
      this.aside,
      this.pageContainer,
      this.dialog.dialogNode, // dialog must be always last
    );

    this.instance = this;
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

  public toggleAside() {
    this.isAsideOpen = !this.isAsideOpen;

    if (this.isAsideOpen) {
      document.body.style.setProperty('--tasks-layout-aside-w', '384px');
    } else {
      document.body.style.setProperty('--tasks-layout-aside-w', '96px');
    }
  }

  public toggleDialog() {
    this.dialog.toggleDialog.call(this.dialog);
  }

  public toggleColorMode() {
    this.colorMode = this.colorMode === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = this.colorMode;
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
