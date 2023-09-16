import { Button } from '@src/components/Button';
import { Layout } from '@src/components/Layout';
import { Menu } from '@src/components/Menu';

import { DEFAULT_ROUTE, ICONS_ASSOC, LOGOS_ASSOC } from './constants';

import type { RouterQuery, Route, ObserveURLProps } from './interfaces';

import styles from './styles.module.scss';

export class Router {
  private layout: Layout | null = null;
  public asideMenu: Menu | null = null;

  private urlObservers: Record<string, () => void> = {};

  private routes: Record<string, HTMLElement> = {};

  public routeLocation = location;
  public routePayload: string = JSON.stringify({});
  public routeQueries: RouterQuery['queries'] = {};

  constructor() {
    window.addEventListener('popstate', (e) => {
      const page = e.state;

      if (this.layout?.isAsideOpen) {
        this.asideMenu?.updateLogo(LOGOS_ASSOC[page]);
      } else {
        // @ts-expect-error
        this.asideMenu.logo.dataset.text = LOGOS_ASSOC[page];
      }

      this.layout?.setMainContent(this.routes[page]);
    });
  }

  connectLayout(layout: Layout) {
    this.layout = layout;

    if (!!this.asideMenu) {
      this.asideMenu.renderContent();
    }

    this.navigate({
      payload: 'tasks',
      pageTitle: 'Tasks',
      queries: { page: DEFAULT_ROUTE },
    });
  }

  connectAsideMenu(asideMenu: Menu) {
    this.asideMenu = asideMenu;
  }

  navigate(query: RouterQuery) {
    if (JSON.stringify(query.payload) === this.routePayload) return;

    const { payload, pageTitle, queries } = query;

    history.pushState(payload, pageTitle, this.parseQueries(queries));

    if (this.layout?.isAsideOpen) {
      this.asideMenu?.updateLogo(LOGOS_ASSOC[payload]);
    } else {
      // @ts-expect-error
      this.asideMenu.logo.dataset.text = LOGOS_ASSOC[payload];
    }

    this.routeLocation = location;
    this.routeQueries = queries;
    this.routePayload = JSON.stringify(payload);

    Object.values(this.urlObservers).forEach((cb) => cb());

    if (this.layout && queries.page in this.routes) {
      this.layout?.setMainContent.call(this.layout, this.routes[queries.page]);

      document.title = pageTitle;
    }

    this.asideMenu?.navItems.forEach((navButton) => {
      const navButtonRoute = navButton.getDataset('route');
      if (navButtonRoute === payload) {
        navButton.addClassNama(styles.activeRoute);
      } else {
        navButton.removeClassNama(styles.activeRoute);
      }
    });
  }

  observeURL(props: ObserveURLProps) {
    const { initiator, callback } = props;
    this.urlObservers[initiator] = callback;
  }

  setRoute(newRoute: Route) {
    if (newRoute.to !== 'settings') {
      this.asideMenu?.setNavItem.call(
        this.asideMenu,

        new Button({
          id: `nav-button-to-${newRoute.to}`,
          dataset: {
            route: newRoute.to,
          },
          appearance: 'transparent',
          text: newRoute.label,
          icon: ICONS_ASSOC[newRoute.to],
          fullwidth: true,
          onclick: () =>
            this.navigate({
              payload: newRoute.to,
              pageTitle: newRoute.label,
              queries: {
                page: newRoute.to,
              },
            }),
        }),
      );
    }

    this.routes[newRoute.to] = newRoute.element;
  }

  private parseQueries(queries: RouterQuery['queries']): string {
    if (!Object.keys(queries).length) return '';

    let queryString = '?';

    Object.entries(queries).forEach(([key, value]) => {
      if (queryString === '?') {
        queryString = `${queryString}${key}=${value}`;
      } else {
        queryString = `${queryString}&${key}=${value}`;
      }
    });

    return queryString;
  }
}

/**
 * @description Singleton providing app router
 */
export const router = new Router();
