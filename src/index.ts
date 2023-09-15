// START imports order matters
import layout from '@src/components/Layout'; // must be imported first
import router from '@src/router';
// END imports order matters
import { TasksPage } from '@src/pages/Tasks';

import { Menu } from '@src/components/Menu';
import { Button } from '@src/components/Button';

import { COLOR_MODES_ASSOC } from '@src/shared/constants';
import './global.scss';

router.connectLayout.call(router, layout);

router.setRoute.call(router, {
  to: 'tasks',
  element: new TasksPage({
    setHeaderRightSlot: layout.setHeaderRightSlot.bind(layout),
    setDialogContent: layout.setDialogContent.bind(layout),
    toggleDialog: layout.toggleDialog.bind(layout),
  }).render(),
});

// console.table(manager);

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

router.navigate.call(router, {
  payload: '',
  pageTitle: '',
  queries: {
    page: 'tasks',
  },
});

layout.setHeaderLeftSlot.call(layout, colorModeButton.render());

// router.observeURL({
//   initiator: 'layout',
//   callback: layout.toggleColorMode.bind(layout),
// });

//   new Button({
//     text: 'Authenticate (route without page reload)',
//     onclick: () => {
//       router.navigate({
//         payload: 'Authenticate payload',
//         pageTitle: 'Authenticate',
//         queries: {
//           page: 'auth',
//         },
//       });
//     },
//   }).render(),
