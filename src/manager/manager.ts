import uniqid from 'uniqid';
import { format } from 'date-fns';
import { api } from '@src/api';
import { Badge } from '@src/components/Badge';
import type { TaskProps } from '@src/types';

import { checkExpiry } from './utils';

import binIcon from '@src/assets/binIcon.png';
import styles from '../styles.module.scss';

const TASK_IN_DRUG_ACTION = 'TASK_IN_DRUG_ACTION';

export class Manager {
  private _openedContainer: HTMLDivElement;
  private _opened: TaskProps[] = [];

  private _inProcessContainer: HTMLDivElement;
  private _inProcess: TaskProps[] = [];

  private _doneContainer: HTMLDivElement;
  private _done: TaskProps[] = [];

  constructor() {
    this._openedContainer = document.getElementById('tasks-opened') as HTMLDivElement;

    this._openedContainer.ondrop = (e) => {
      e.preventDefault();
      const draggingData = JSON.parse(e.dataTransfer?.getData(TASK_IN_DRUG_ACTION) || '') as TaskProps;
      const updatedTask: TaskProps = { ...draggingData, status: 'open' };

      this.delete(updatedTask.id);

      this._opened = [updatedTask, ...this._opened];

      api.setTasks('open', this._opened);

      this.renderOpened();
    };

    this._openedContainer.ondragover = (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    };

    // ////
    this._inProcessContainer = document.getElementById('tasks-in-process') as HTMLDivElement;

    this._inProcessContainer.ondrop = (e) => {
      e.preventDefault();
      const draggingData = JSON.parse(e.dataTransfer?.getData(TASK_IN_DRUG_ACTION) || '') as TaskProps;
      const updatedTask: TaskProps = { ...draggingData, status: 'inProces' };

      this.delete(updatedTask.id);

      this._inProcess = [updatedTask, ...this._inProcess];

      api.setTasks('inProces', this._inProcess);

      this.renderInProgress();
    };

    this._inProcessContainer.ondragover = (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    };

    // ////
    this._doneContainer = document.getElementById('tasks-done') as HTMLDivElement;

    this._doneContainer.ondrop = (e) => {
      e.preventDefault();
      const draggingData = JSON.parse(e.dataTransfer?.getData(TASK_IN_DRUG_ACTION) || '') as TaskProps;
      const updatedTask: TaskProps = { ...draggingData, status: 'done' };

      this.delete(updatedTask.id);

      this._done = [updatedTask, ...this._done];

      api.setTasks('done', this._done);

      this.renderDone();
    };

    this._doneContainer.ondragover = (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    };

    // ///
    api.getTasks('open').then((openedTasks) => {
      this._opened = openedTasks;
      this.renderOpened();
    });

    api.getTasks('inProces').then((inProcessTasks) => {
      this._inProcess = inProcessTasks;
      this.renderInProgress();
    });

    api.getTasks('done').then((doneTasks) => {
      this._done = doneTasks;
      this.renderDone();
    });
  }

  renderOpened() {
    this._openedContainer.innerHTML = '';
    this._opened.forEach((task) => this._openedContainer.append(this.prepareTaskDomElement(task)));
  }

  renderInProgress() {
    this._inProcessContainer.innerHTML = '';
    this._inProcess.forEach((task) => this._inProcessContainer.append(this.prepareTaskDomElement(task)));
  }

  renderDone() {
    this._doneContainer.innerHTML = '';
    this._done.forEach((task) => this._doneContainer.append(this.prepareTaskDomElement(task)));
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

  delete(taskId: string) {
    const openedTasks = [];
    const inProcesTasks = [];
    const doneTasks = [];

    for (let i = 0; i < this._opened.length; i++) {
      if (this._opened[i].id !== taskId) openedTasks.push(this._opened[i]);
    }

    for (let i = 0; i < this._inProcess.length; i++) {
      if (this._inProcess[i].id !== taskId) inProcesTasks.push(this._inProcess[i]);
    }

    for (let i = 0; i < this._done.length; i++) {
      if (this._done[i].id !== taskId) doneTasks.push(this._done[i]);
    }

    if (this._opened.length !== openedTasks.length) {
      this._opened = openedTasks;
      api.setTasks('open', openedTasks);
      this.renderOpened();
    }

    if (this._inProcess.length !== inProcesTasks.length) {
      this._inProcess = inProcesTasks;
      api.setTasks('inProces', inProcesTasks);
      this.renderInProgress();
    }

    if (this._done.length !== doneTasks.length) {
      this._done = doneTasks;
      api.setTasks('done', doneTasks);
      this.renderDone();
    }
  }

  prepareTaskDomElement(payload: TaskProps) {
    const { id, title, description, status, expiresAt } = payload;

    const task = document.createElement('div');
    task.id = id;
    task.dataset.status = status;
    task.draggable = true;
    task.classList.add(styles.task);

    task.ondragstart = (e) => {
      task.classList.add(styles.task_dragging);

      if (e.dataTransfer) {
        e.dataTransfer.setData(TASK_IN_DRUG_ACTION, JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'move';
      }
    };

    task.ondragend = () => {
      task.classList.remove(styles.task_dragging);
    };

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
    descriptionEl.classList.add(styles.description);
    descriptionEl.innerText = description;

    const info = document.createElement('div');
    info.classList.add(styles.info);
    const infoLabel = document.createElement('span');
    infoLabel.dataset.label = 'true';
    infoLabel.innerText = 'Acomplish till:';

    const badge = new Badge({
      title: format(new Date(expiresAt), 'yyyy-MM-dd'),
      appearance: checkExpiry(expiresAt),
      size: 'small',
      bordered: true,
    }).render();

    info.append(infoLabel, badge);

    task.append(taskHeader, descriptionEl, info);

    return task;
  }
}
