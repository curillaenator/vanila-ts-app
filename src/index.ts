import { Manager } from './manager/manager';
import { Form } from '@src/components/Form';
import { Dialog } from '@src/components/Dialog';
import { Button } from '@src/components/Button';
import { Badge } from '@src/components/Badge';

import styles from './styles.module.scss';
import './global.scss';

const taskContainer = document.getElementById('tasks-main') as HTMLElement;
taskContainer.classList.add(styles.taskContainer);

const headings = document.createElement('div');
headings.classList.add(styles.headings);

['Opened', 'In process', 'Accomplished'].forEach((el) => {
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

const formButton = new Button('New task').render();
formButton.onclick = () => {
  dialog.setContent(form.renderForm());
  dialog.open.call(dialog);
};

const colorModeButton = new Button('Mode').render();
colorModeButton.onclick = () => tm.setColorMode.call(tm);

// HEADER
const header = document.getElementById('tasks-header') as HTMLElement;
header.classList.add(styles.header);

header.append(formButton, colorModeButton);
