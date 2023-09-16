// START imports order matters
import layout from '@src/components/Layout'; // must be imported first
import router from '@src/router';
// END imports order matters

import { TasksPage } from '@src/pages/Tasks';
import { LaunchTabRunner } from '@src/pages/LaunchTabs';

import { Menu } from '@src/components/Menu';
import { Button } from '@src/components/Button';

import { COLOR_MODES_ASSOC } from '@src/shared/constants';
import './global.scss';

router.connectAsideMenu.call(
  router,

  new Menu({
    navigate: router.navigate.bind(router),
    toggleAside: layout.toggleAside.bind(layout),
    subscribeOnAsideToggle: layout.observeToggleAside.bind(layout),
  }),
);

// START routes
router.setRoute.call(router, {
  to: 'tasks',
  label: 'Tasks',
  element: new TasksPage({
    setHeaderLeftSlot: layout.setHeaderLeftSlot.bind(layout),
    setHeaderRightSlot: layout.setHeaderRightSlot.bind(layout),
    setDialogContent: layout.setDialogContent.bind(layout),
    toggleDialog: layout.toggleDialog.bind(layout),
  }).render(),
});

router.setRoute.call(router, {
  to: 'launchtabs',
  label: 'LaunchTabs',
  element: new LaunchTabRunner({
    setHeaderLeftSlot: layout.setHeaderLeftSlot.bind(layout),
    setHeaderRightSlot: layout.setHeaderRightSlot.bind(layout),
    setDialogContent: layout.setDialogContent.bind(layout),
    toggleDialog: layout.toggleDialog.bind(layout),
  }).render(),
});

router.setRoute.call(router, {
  to: 'settings',
  label: 'Settings',
  element: document.createElement('article'),
});
// END routes

router.connectLayout.call(router, layout);

layout.setAsideContent.call(
  layout,
  // @ts-expect-error
  router.asideMenu.render(),
);

const colorModeButton = new Button({
  id: 'tasks-color-mode-button',
  text: 'Dark',
  onclick: layout.toggleColorMode.bind(layout),
});

layout.observeColorMode((cm) => colorModeButton.updateText(COLOR_MODES_ASSOC[cm]));
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
