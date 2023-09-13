import { Manager } from './manager/manager';
import { Layout } from '@src/components/Layout/Layout';
import { Form } from '@src/components/Form';
import { Button } from '@src/components/Button';

import './global.scss';

const layout = new Layout();
const tm = new Manager();

const form = new Form({
  closeForm: layout.toggleDialog.bind(layout),
  createTask: tm.create.bind(tm),
});

layout.setHeaderRightSlot.call(
  layout,

  new Button({
    text: 'Mode',
    onclick: layout.toggleColorMode.bind(layout),
  }).render(),

  new Button({
    text: 'Create',
    onclick: () => {
      layout.setDialogContent(form.renderForm());
      layout.toggleDialog();
    },
  }).render(),
);
