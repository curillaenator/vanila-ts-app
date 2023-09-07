import uniqid from 'uniqid';
import type { TaskProps } from '@src/types';
import styles from '../styles.module.scss';

export class Manager {
  private _openedContainer = document.getElementById('tasks-opened') as HTMLDivElement;
  private _inProcessContainer = document.getElementById('tasks-in-process') as HTMLDivElement;
  private _doneContainer = document.getElementById('tasks-done') as HTMLDivElement;

  _opened: TaskProps[] = [];

  _inProcess: TaskProps[] = [];

  _tasks: TaskProps[] = [];

  constructor() {}

  makeTask(payload: TaskProps) {
    const task = document.createElement('div');
    task.id = payload.id;
    task.classList.add(styles.task);

    const title = document.createElement('h3');
    title.innerHTML = payload.title;

    const description = document.createElement('span');
    description.innerHTML = payload.description;

    task.append(title);
    task.append(description);

    return task;
  }

  create(payload: Pick<TaskProps, 'title' | 'description' | 'expiresAt'>) {
    const { title, description, expiresAt } = payload;

    const newTask: TaskProps = {
      id: uniqid(),
      title,
      description,
      created: new Date(),
      expiresAt,
    };

    const newTaskElement = this.makeTask(newTask);

    this._openedContainer.prepend(newTaskElement);
  }

  upadate(taskId: string, payload: TaskProps) {}

  delete(taskId: string) {}

  get tasks() {
    return this._opened;
  }
}
