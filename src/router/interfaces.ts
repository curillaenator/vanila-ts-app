export interface RouterQuery {
  pageTitle: string;
  payload: string; // JSON stringified data
  queries: Record<string, string>;
}

export interface ObserveURLProps {
  initiator: string;
  callback: () => void;
}

export interface Route {
  to: string;
  label: string;
  element: HTMLElement;
}
