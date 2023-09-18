import type { StateObserverType, StatePayloadType, GlobalStoreType } from './interfaces';

export class GlobalStore {
  store: Map<string, StatePayloadType>;

  constructor() {
    this.store = new Map();
  }

  create(initialState: GlobalStoreType) {
    if (Object.keys(initialState).length) {
      Object.entries(initialState).forEach(([stateName, statePayload]) => {
        this.createState(stateName, statePayload);
      });
    }
  }

  createState(stateName: string, payload: StatePayloadType, observers?: StateObserverType[]) {
    this.store.set(stateName, payload);
    this.store.set(`${stateName}_observers`, observers || []);
  }

  getState(stateName: string) {
    return this.store.get(stateName) as StatePayloadType;
  }

  updateState(stateName: string, payload: StatePayloadType) {
    if (this.store.has(stateName)) {
      this.store.set(stateName, payload);

      const observers = this.store.get(`${stateName}_observers`) as StateObserverType[];
      observers.forEach((observerFn) => observerFn(payload));
    } else {
      alert('no such state');
    }
  }

  addStateObserver(stateName: string, observer: StateObserverType) {
    if (this.store.has(stateName)) {
      this.store.set(`${stateName}_observers`, [
        ...(this.store.get(`${stateName}_observers`) as StateObserverType[]),
        observer,
      ]);
    } else {
      alert('no such state');
    }
  }
}

/**
 * Sigleton
 */
export const _globalStore = new GlobalStore();

export function useGlobalState<T extends StatePayloadType>(stateName: string): [() => T, (payload: T) => void] {
  return [
    // @ts-expect-error
    () => _globalStore.getState.call(_globalStore, stateName),

    (payload: T) => {
      _globalStore.updateState.call(_globalStore, stateName, payload as StatePayloadType);
    },
  ];
}
