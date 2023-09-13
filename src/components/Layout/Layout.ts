import { Dialog } from '@src/components/Dialog';
import { Badge } from '@src/components/Badge';

import styles from './layout.module.scss';

const COLUMN_IDS = ['tasks-opened', 'tasks-in-process', 'tasks-done'];
const COLUMN_TITLES = ['Opened', 'In process', 'Accomplished'];

/**
 * Singleton providing generated layout instance
 */
export class Layout {
  public colorMode: 'light' | 'dark' = 'light';

  private instance: Layout | null = null;

  private header: HTMLElement = document.createElement('header');
  private headerRightSlots: HTMLElement[] = [];
  private headerLeftSlots: HTMLElement[] = [];

  private taskContainer: HTMLElement = document.createElement('main');
  private dialog = new Dialog({ portalId: 'tasks-modal-portal' });

  constructor() {
    if (this.instance) return this.instance;

    document.body.dataset.theme = this.colorMode;

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

    document.body.append(
      this.header,
      this.taskContainer,
      // dialog must be always last
      this.dialog.dialogNode,
    );

    this.instance = this;
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
