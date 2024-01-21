export type StoreStateFunc<T extends object> = {
  setData: (data: Partial<T>) => void;
  resetData: () => void;
};
