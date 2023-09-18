// import store, { useGlobalState } from '@src/core/GlobalStore';

import { Button } from '@src/components/Button';
import { Layout } from '@src/components/Layout';
import { Menu } from '@src/components/Menu';

import { DEFAULT_ROUTE, ICONS_ASSOC } from './constants'; // LOGOS_ASSOC

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

    const {
      payload: pageName,
      pageTitle,
      queries,
      // smth,
    } = query;

    history.pushState(pageName, pageTitle, this.parseQueries(queries));

    this.routeLocation = location;
    this.routeQueries = queries;
    this.routePayload = JSON.stringify(pageName);

    Object.values(this.urlObservers).forEach((cb) => cb()); // TODO: to global store obses fires on chanche URL

    if (this.layout && queries.page in this.routes) {
      this.layout?.setMainContent.call(this.layout, this.routes[queries.page]);

      document.title = pageTitle;
    }

    this.asideMenu?.navItems.forEach((navButton) => {
      const navButtonRoute = navButton.getDataset('route');

      if (navButtonRoute === pageName) {
        navButton.addClassName(styles.activeRoute);
      } else {
        navButton.removeClassName(styles.activeRoute);
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
