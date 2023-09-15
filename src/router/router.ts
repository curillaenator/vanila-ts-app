import { Layout } from '@src/components/Layout';

interface RouterQuery {
  pageTitle: string;
  payload: string; // JSON stringified data
  queries: Record<string, string>;
}

interface ObserveURLProps {
  initiator: string;
  callback: () => void;
}

interface Route {
  to: string;
  element: HTMLElement;
}

const DEFAULT_ROUTE = 'tasks';

export class Router {
  private layout: Layout | null = null;

  private urlObservers: Record<string, () => void> = {};

  private routes: Record<string, HTMLElement> = {};

  public routeLocation = location;
  public routePayload: string = JSON.stringify({});
  public routeQueries: RouterQuery['queries'] = {};

  constructor() {
    this.navigate({
      payload: 'Tasks page',
      pageTitle: 'Tasks page',
      queries: {
        page: DEFAULT_ROUTE,
      },
    });
  }

  public connectLayout(layout: Layout) {
    this.layout = layout;
  }

  public navigate(query: RouterQuery) {
    const { payload, pageTitle, queries } = query;

    history.pushState(payload, pageTitle, this.parseQueries(queries));

    this.routeLocation = location;
    this.routeQueries = queries;
    this.routePayload = JSON.stringify(payload);

    Object.values(this.urlObservers).forEach((cb) => cb());

    console.table(this.routes);

    if (this.layout && queries.page in this.routes) {
      this.layout?.setMainContent.call(this.layout, this.routes[queries.page]);
    }

    // console.table({
    //   location: this.routeLocation,
    //   payload: this.routePayload,
    //   queries: this.routeQueries,
    // });
  }

  public observeURL(props: ObserveURLProps) {
    const { initiator, callback } = props;
    this.urlObservers[initiator] = callback;
  }

  public setRoute(newRoute: Route) {
    this.routes[newRoute.to] = newRoute.element;
  }

  private parseQueries(queries: RouterQuery['queries']) {
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
