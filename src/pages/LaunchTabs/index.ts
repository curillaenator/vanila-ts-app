import router from '@src/core/Router';

import type { CommonPageProps } from '@src/types';
import styles from './styles.module.scss';

export class LaunchTabRunner {
  private launchTabs: HTMLIFrameElement = document.createElement('iframe');

  constructor(props: CommonPageProps) {
    const { setHeaderRightSlot, setHeaderLeftSlot, setDialogContent } = props;

    this.launchTabs.classList.add(styles.frame);
    this.launchTabs.src = 'https://launchtab-81b06.web.app/';
    this.launchTabs.title = "ART's LaunchTabs";

    router.observeURL({
      initiator: 'launchtabs-page',

      callback: () => {
        if (router.routeQueries.page === 'launchtabs') {
          const pageTitle = document.createElement('h3');
          pageTitle.classList.add(styles.pageTitle);
          pageTitle.innerText = 'Bookmarks service';

          setDialogContent(document.createElement('div'));

          setHeaderLeftSlot(pageTitle);
          setHeaderRightSlot(...[]);
        }
      },
    });
  }

  render() {
    return this.launchTabs;
  }
}
