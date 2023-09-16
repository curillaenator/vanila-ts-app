import uniqid from 'uniqid';
import { format } from 'date-fns';
import styles from './form.module.scss';

import { Button } from '@src/components/Button';

import { StatusType, TaskProps } from '@src/types';

import { CLOSE_ICON } from './constants';

interface FormOptions {
  closeForm: () => void;
  createTask: (payload: TaskProps) => void;
}

/**
 * @constructor
 * @param {FormOptions} options - import type { FormOptions } from '@src/components/Form'
 *
 * UI Component
 */
export class Form {
  private _form: HTMLFormElement;

  private _title?: string;
  private _description?: string;
  private _expiresAt: Date = new Date();
  private _status?: StatusType;

  constructor(options: FormOptions) {
    const { closeForm, createTask } = options;

    const form = document.createElement('form');
    form.classList.add(styles.form);
    form.onsubmit = (e) => e.preventDefault();

    const formTitle = document.createElement('div');
    const formText = document.createElement('h3');
    formText.innerText = 'Create task';

    // const closeButtonIcon = document.createElement('img');
    // closeButtonIcon.src = closeIcon;

    const closeButton = new Button({
      type: 'button',
      onclick: (e) => {
        this.resetForm();
        e.preventDefault();
        closeForm();
      },
    }).render();
    closeButton.innerHTML = CLOSE_ICON;
    // closeButton.classList.add(styles.iconButton);
    // closeButton.append(closeButtonIcon);

    formTitle.classList.add(styles.title);
    formTitle.append(formText, closeButton);

    const submitButton = new Button({
      text: 'Create',
      type: 'submit',
      onclick: (e) => {
        e.preventDefault();
        createTask(this.getFormData());
        this.resetForm();
        closeForm();
      },
    }).render();

    form.append(
      formTitle,
      this.addTextInput('form-title', '_title', 'Task title'),
      this.addTextInput('form-description', '_description', 'Task description'),
      this.addDateInput(format(new Date(), 'yyyy-MM-dd')),
      submitButton,
    );

    this._form = form;
  }

  private addTextInput(id: string, name: string, ph: string) {
    const input = document.createElement('input');
    input.classList.add(styles.input);
    // @ts-ignore
    input.value = this[name] || '';
    input.onchange = (e) => {
      // @ts-ignore
      this[name] = e.target.value;
    };

    input.type = 'text';
    input.required = true;
    input.autocomplete = 'off';
    input.id = id;
    input.name = name;
    input.placeholder = ph;

    return input;
  }

  private addDateInput(min: string) {
    const dateInput = document.createElement('input');
    dateInput.classList.add(styles.dateInput);
    dateInput.type = 'date';
    dateInput.autocomplete = 'off';
    dateInput.min = min;
    dateInput.value = format(this._expiresAt, 'yyyy-MM-dd');
    dateInput.onchange = (e) => {
      // @ts-ignore
      this._expiresAt = new Date(e.target?.value);
    };

    return dateInput;
  }

  render() {
    return this._form;
  }

  resetForm() {
    this._title = '';
    this._description = '';
    this._expiresAt = new Date();
    this._status = 'open';
  }

  getFormData() {
    return {
      id: uniqid(),
      title: this._title || '',
      description: this._description || '',
      created: new Date(),
      expiresAt: this._expiresAt,
      status: this._status || 'open',
    };
  }
}
