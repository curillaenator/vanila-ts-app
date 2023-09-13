import { Manager } from './manager/manager';
import { Layout } from '@src/components/Layout';
import { Menu } from '@src/components/Menu';
import { Form } from '@src/components/Form';
import { Button } from '@src/components/Button';

import './global.scss';

const layout = new Layout();
const tm = new Manager();

layout.setAsideContent.call(
  layout,

  new Menu({
    toggleAside: layout.toggleAside.bind(layout),
    subscribeOnAsideToggle: layout.subscribeOnAsideToggle.bind(layout),
  }).render(),
);

layout.setHeaderLeftSlot.call(
  layout,

  new Button({
    text: 'Mode',
    onclick: layout.toggleColorMode.bind(layout),
  }).render(),
);

const form = new Form({
  closeForm: layout.toggleDialog.bind(layout),
  createTask: tm.create.bind(tm),
});

layout.setHeaderRightSlot.call(
  layout,

  new Button({
    text: 'Create',
    onclick: () => {
      layout.setDialogContent(form.render.call(form));
      layout.toggleDialog();
    },
  }).render(),
);
