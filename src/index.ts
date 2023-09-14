import { Manager } from './manager/manager';
import { Layout } from '@src/components/Layout';
import { Menu } from '@src/components/Menu';
import { Form } from '@src/components/Form';
import { Button } from '@src/components/Button';

import { COLOR_MODES_ASSOC } from '@src/shared/constants';

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

const colorModeButton = new Button({
  id: 'tasks-color-mode-button',
  text: 'Dark',
  onclick: () => {
    layout.toggleColorMode.call(layout);
  },
});

layout.subscribeOnColorMode((cm) => colorModeButton.updateText(COLOR_MODES_ASSOC[cm]));

layout.setHeaderLeftSlot.call(layout, colorModeButton.render());

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
