// START imports order matters
import layout from '@src/components/Layout'; // must be imported first
import manager from '@src/manager';
import router from '@src/router';
// END imports order matters
import { Menu } from '@src/components/Menu';
import { Form } from '@src/components/Form';
import { Button } from '@src/components/Button';

import { COLOR_MODES_ASSOC } from '@src/shared/constants';
import './global.scss';

layout.setAsideContent.call(
  layout,

  new Menu({
    toggleAside: layout.toggleAside.bind(layout),
    subscribeOnAsideToggle: layout.observeToggleAside.bind(layout),
  }).render(),
);

const colorModeButton = new Button({
  id: 'tasks-color-mode-button',
  text: 'Dark',
  onclick: layout.toggleColorMode.bind(layout),
});

layout.observeColorMode((cm) => colorModeButton.updateText(COLOR_MODES_ASSOC[cm]));
// router.observeURL({
//   initiator: 'layout',
//   callback: layout.toggleColorMode.bind(layout),
// });

const form = new Form({
  closeForm: layout.toggleDialog.bind(layout),
  createTask: manager.create.bind(manager),
});

layout.setHeaderLeftSlot.call(layout, colorModeButton.render());

layout.setHeaderRightSlot.call(
  layout,

  new Button({
    text: 'Authenticate (route without page reload)',
    onclick: () => {
      router.navigate({
        payload: 'Authenticate payload',
        pageTitle: 'Authenticate',
        queries: {
          page: 'auth',
        },
      });
    },
  }).render(),

  new Button({
    text: 'Create',
    onclick: () => {
      layout.setDialogContent(form.render.call(form));
      layout.toggleDialog();
    },
  }).render(),
);
