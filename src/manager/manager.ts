import uniqid from 'uniqid';
import { api } from '@src/api';
import type { TaskProps } from '@src/types';

import binIcon from '@src/assets/binIcon.png';
import styles from '../styles.module.scss';

export class Manager {
  private _openedContainer: HTMLDivElement;
  private _opened: TaskProps[] = [];

  private _inProcessContainer: HTMLDivElement;
  private _inProcess: TaskProps[] = [];

  private _doneContainer: HTMLDivElement;
  private _done: TaskProps[] = [];

  constructor() {
    this._openedContainer = document.getElementById('tasks-opened') as HTMLDivElement;
    this._inProcessContainer = document.getElementById('tasks-in-process') as HTMLDivElement;
    this._doneContainer = document.getElementById('tasks-done') as HTMLDivElement;

    api.getTasks('open').then((openedTasks) => {
      this._opened = openedTasks;
      this.renderOpened();
    });

    api.getTasks('inProces').then((inProcessTasks) => {
      this._inProcess = inProcessTasks;
    });

    api.getTasks('done').then((doneTasks) => {
      this._done = doneTasks;
    });
  }

  renderOpened() {
    this._openedContainer.innerHTML = '';
    this._opened.forEach((task) => this._openedContainer.append(this.prepareTaskDomElement(task)));
  }

  prepareTaskDomElement(payload: TaskProps) {
    const {
      id,
      title,
      description,
      status,
      // expiresAt
    } = payload;

    const task = document.createElement('div');
    task.id = id;
    task.dataset.status = status;

    task.classList.add(styles.task);

    const taskHeader = document.createElement('div');
    taskHeader.classList.add(styles.task_header);

    const taskHeaderTitle = document.createElement('h3');
    taskHeaderTitle.innerHTML = title;

    const taskHeaderDeleteButton = document.createElement('button');

    const taskHeaderDeleteButtonIcon = document.createElement('img');
    taskHeaderDeleteButtonIcon.src = binIcon;
    taskHeaderDeleteButtonIcon.alt = 'Del';

    taskHeaderDeleteButton.classList.add(styles.iconButton);
    taskHeaderDeleteButton.append(taskHeaderDeleteButtonIcon);
    taskHeaderDeleteButton.onclick = () => this.delete(id);

    taskHeader.append(taskHeaderTitle);
    taskHeader.append(taskHeaderDeleteButton);

    const descriptionEl = document.createElement('span');
    descriptionEl.innerHTML = description;

    // task.onclick = (handler: () => void) => handler();
    // task.onclick = (e) => (handler: () => void) => handler();

    task.append(taskHeader);
    task.append(descriptionEl);

    return task;
  }

  create(payload: TaskProps) {
    const { title, description, expiresAt, status } = payload;

    const newTask: TaskProps = {
      id: uniqid(),
      title,
      description,
      created: new Date(),
      expiresAt,
      status,
    };

    this._opened = [newTask, ...this._opened];

    api.setTasks('open', this._opened);
    this.renderOpened();
  }

  // upadate(taskId: string, payload: TaskProps) {}

  delete(taskId: string) {
    const openedTasks = [];
    const inProcesTasks = [];
    const doneTasks = [];

    for (let i = 0; i < this._opened.length; i++) {
      if (this._opened[i].id !== taskId) openedTasks.push(this._opened[i]);
    }

    for (let i = 0; i < this._inProcess.length; i++) {
      if (this._inProcess[i].id !== taskId) inProcesTasks.push(this._opened[i]);
    }

    for (let i = 0; i < this._done.length; i++) {
      if (this._done[i].id === taskId) doneTasks.push(this._opened[i]);
    }

    if (this._opened.length !== openedTasks.length) {
      this._opened = openedTasks;
      api.setTasks('open', openedTasks);
      this.renderOpened();
    }
  }
}
