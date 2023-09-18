export type StatePayloadType = string | boolean | null | StateObserverType[];
export type StateObserverType = <P extends StatePayloadType>(newPayload: P) => void;

export type GlobalStoreType = Record<string, StatePayloadType>;
