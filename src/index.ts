// тут должна быть работа с DOM с использованием методов и свойст менеджера.

import { Manager } from './manager';
import styles from './styles.module.scss';
import './global.scss';

const header = document.getElementById('tasks-header');
header?.classList.add(styles.header);

document.getElementById('tasks-main')?.classList.add(styles.taskContainer);

const tm = new Manager();

const button = document.createElement('button');
button.classList.add(styles.createTaskButton);
button.onclick = () =>
  tm.create({
    title: 'Task',
    description: 'jkdshjk jkgu ugsd ui',
    expiresAt: new Date(),
  });
button.innerHTML = 'Create';

header?.append(button);
