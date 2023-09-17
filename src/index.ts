// START imports order matters
import layout from '@src/components/Layout'; // must be imported first
import router from '@src/core/Router';
// END imports order matters

import { TasksPage } from '@src/pages/Tasks';
import { LaunchTabRunner } from '@src/pages/LaunchTabs';
import { Settings } from '@src/pages/Settings';

import { Menu } from '@src/components/Menu';

// import { COLOR_MODES_ASSOC } from '@src/shared/constants';
import type { CommonPageProps } from '@src/types';
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
const COMMON_ROUTE_PROPS: CommonPageProps = {
  setHeaderLeftSlot: layout.setHeaderLeftSlot.bind(layout),
  setHeaderRightSlot: layout.setHeaderRightSlot.bind(layout),
  setDialogContent: layout.setDialogContent.bind(layout),
  toggleDialog: layout.toggleDialog.bind(layout),
};

router.setRoute.call(router, {
  to: 'tasks',
  label: 'Tasks',
  element: new TasksPage(COMMON_ROUTE_PROPS).render(),
});

router.setRoute.call(router, {
  to: 'launchtabs',
  label: 'LaunchTabs',
  element: new LaunchTabRunner(COMMON_ROUTE_PROPS).render(),
});

router.setRoute.call(router, {
  to: 'settings',
  label: 'Settings',
  element: new Settings({
    ...COMMON_ROUTE_PROPS,
    toggleColorMode: layout.toggleColorMode.bind(layout),
  }).render(),
});
// END routes

router.connectLayout.call(router, layout);

layout.setAsideContent.call(
  layout,
  // @ts-expect-error
  router.asideMenu.render(),
);

// layout.observeColorMode((cm) => colorModeButton.updateText(COLOR_MODES_ASSOC[cm]));
// layout.setHeaderLeftSlot.call(layout, colorModeButton.render());

// router.observeURL({
//   initiator: 'layout',
//   callback: layout.toggleColorMode.bind(layout),
// });
