import router from '@src/core/Router';

import { Form } from '@src/components/Form';
import { Badge } from '@src/components/Badge';
import { Button } from '@src/components/Button';

import { Manager } from './manager';

import type { CommonPageProps } from '@src/types';
import styles from './styles.module.scss';

const COLUMN_IDS = ['tasks-opened', 'tasks-in-process', 'tasks-done'];
const COLUMN_TITLES = ['Opened', 'In process', 'Accomplished'];

export class TasksPage {
  private container: HTMLElement = document.createElement('div');

  private manager?: Manager;

  constructor(props: CommonPageProps) {
    const { setHeaderLeftSlot, setHeaderRightSlot, setDialogContent, toggleDialog } = props;

    this.container.classList.add(styles.taskContainer);

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

    this.container.append(columnHeadings, ...columns);

    this.manager = new Manager({
      openedContainer: columns[0],
      inProcessContainer: columns[1],
      doneContainer: columns[2],
    });

    router.observeURL({
      initiator: 'tasks-page',

      callback: () => {
        if (router.routeQueries.page === 'tasks') {
          const pageTitle = document.createElement('h3');
          pageTitle.classList.add(styles.pageTitle);
          pageTitle.innerText = 'Tasks manager';

          setHeaderLeftSlot(pageTitle);

          setDialogContent(
            new Form({
              closeForm: toggleDialog,
              createTask: this.manager?.create.bind(this.manager) || (() => {}),
            }).render(),
          );

          setHeaderRightSlot(
            new Button({
              text: 'Create',
              onclick: toggleDialog,
            }).render(),
          );
        }
      },
    });
  }

  render() {
    return this.container;
  }
}
