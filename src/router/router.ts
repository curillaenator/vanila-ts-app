interface RouterQuery {
  pageTitle: string;
  payload: string; // JSON stringified data
  queries: Record<string, string>;
}

interface ObserveURLProps {
  initiator: string;
  callback: () => void;
}

export class Router {
  private urlObservers: Record<string, () => void> = {};

  public routeLocation = location;

  public routePayload: string = JSON.stringify({});

  public routeQueries: RouterQuery['queries'] = {};

  public navigate(query: RouterQuery) {
    const { payload, pageTitle, queries } = query;

    history.pushState(payload, pageTitle, this.parseQueries(queries));

    this.routeLocation = location;
    this.routeQueries = queries;
    this.routePayload = JSON.stringify(payload);

    Object.values(this.urlObservers).forEach((cb) => cb());

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
