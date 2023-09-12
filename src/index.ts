import { Manager } from './manager/manager';
import { Form } from '@src/components/Form';
import { Dialog } from '@src/components/Dialog';
import { Button } from '@src/components/Button';
import { Badge, type BadgeAppearance } from '@src/components/Badge';

import styles from './styles.module.scss';
import './global.scss';

const header = document.getElementById('tasks-header') as HTMLElement;
header.classList.add(styles.header);

const taskContainer = document.getElementById('tasks-main') as HTMLElement;
taskContainer.classList.add(styles.taskContainer);

const headings = document.createElement('div');
headings.classList.add(styles.headings);

const HEADINGS_APPEARANCE_ASSOC: Record<string, BadgeAppearance> = {
  Opened: 'white',
  'In process': 'info',
  Accomplished: 'positive',
};

Object.keys(HEADINGS_APPEARANCE_ASSOC).forEach((el) => {
  const head = document.createElement('div');
  head.classList.add(styles.head);
  head.append(
    new Badge({
      title: el,
      appearance: 'white',
      size: 'large',
      bordered: true,
    }).render(),
  );
  headings.append(head);
});

taskContainer.prepend(headings);

const tm = new Manager();

const dialog = new Dialog();

const form = new Form({
  closeForm: dialog.close.bind(dialog),
  createTask: tm.create.bind(tm),
});

dialog.setContent(form.renderForm());

const formButton = new Button('New task').render();
formButton.onclick = () => dialog.open.call(dialog);

header.append(formButton);
