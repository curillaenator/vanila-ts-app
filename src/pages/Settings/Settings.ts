import { UIComponent } from '@src/core/UIComponent';

import { api } from '@src/api';
import store from '@src/core/GlobalStore';
import router from '@src/core/Router';
import { useGlobalState } from '@src/core/GlobalStore';

import { Button } from '@src/components/Button';

import type { CommonPageProps, ColorMode } from '@src/types';
import { COLOR_MODES_ASSOC } from '@src/shared/constants';
import { DARK_ICON } from '@src/shared/icons';

import { COLOR_MODE_ICONS_ASSOC } from './constants';
import styles from './settings.module.scss';

export class Settings extends UIComponent {
  private colorModeButton = new Button({
    id: 'settings-color-mode',
    appearance: 'solid',
    icon: DARK_ICON,
    dataset: {
      colorMode: 'dark',
    },
  });

  constructor(props: Partial<CommonPageProps>) {
    super({ as: 'div' });

    const { setHeaderLeftSlot = () => {}, setHeaderRightSlot = () => {}, setDialogContent = () => {} } = props;

    const [getColorMode, setColorMode] = useGlobalState<ColorMode>('colorMode');

    router.observeURL({
      initiator: 'settigs-page',

      callback: () => {
        if (router.routeQueries.page === 'settings') {
          const pageTitle = document.createElement('h3');
          pageTitle.classList.add(styles.pageTitle);
          pageTitle.innerText = 'Application settings';

          setDialogContent(document.createElement('div'));

          setHeaderLeftSlot(pageTitle);
          setHeaderRightSlot(...[]);
        }
      },
    });

    this.component.classList.add(styles.container);

    this.colorModeButton.component.onclick = () => setColorMode(COLOR_MODES_ASSOC[getColorMode()]);

    // @ts-expect-error
    store.addStateObserver('colorMode', (colorMode: ColorMode) => {
      document.body.dataset.theme = colorMode;
      api.setSettings({ colorMode });
      this.updateColorModeButton(colorMode, COLOR_MODE_ICONS_ASSOC[colorMode]);
    });

    this.component.append(this.colorModeButton.render());
  }

  updateColorModeButton(colorMode: string, icon: string) {
    this.colorModeButton.updateText(colorMode);
    this.colorModeButton.updateIcon(icon);
  }
}
