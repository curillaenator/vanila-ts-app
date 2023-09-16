import router from '@src/router';
import { Button } from '@src/components/Button';

import type { CommonPageProps } from '@src/types';
import styles from './settings.module.scss';

export interface SettingsProps extends Partial<CommonPageProps> {
  toggleColorMode: () => void;
}

export class Settings {
  container: HTMLElement = document.createElement('div');

  constructor(props: SettingsProps) {
    const {
      toggleColorMode,
      setHeaderLeftSlot = () => {},
      setHeaderRightSlot = () => {},
      setDialogContent = () => {},
    } = props;

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

    this.container.classList.add(styles.container);
    this.container.append(
      new Button({
        text: 'Mode',
        appearance: 'solid',
        onclick: () => toggleColorMode(),
      }).render(),
    );
  }

  render() {
    return this.container;
  }
}
