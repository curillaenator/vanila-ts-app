import { Manager } from './manager/manager';
import { Form } from '@src/components/Form';
import { Dialog } from '@src/components/Dialog';
import { Button } from '@src/components/Button';

import styles from './styles.module.scss';
import './global.scss';

const header = document.getElementById('tasks-header') as HTMLElement;
header.classList.add(styles.header);

document.getElementById('tasks-main')?.classList.add(styles.taskContainer);

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
