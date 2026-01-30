import type { ListRowComponent, ListRowProps } from './create-row';

export interface ListItem<T> {
  _internalId: string;
  data: T;
}

export interface ListDirtyEvent {
  'list:dirty': { listId?: string; isDirty: boolean };
}

export interface UseListReturn<T> {
  items: ListItem<T>[];

  getItems: () => ListItem<T>[];
  add: (payload?: T | T[]) => void;
  insertAt: (index: number, payload?: T) => void;
  update: (id: string, payload: Partial<T>) => void;
  updateAt: (index: number, payload: Partial<T>) => void;
  move: (fromIndex: number, toIndex: number) => void;
  removeById: (id: string) => void;
  removeAt: (index: number) => void;
  set: (dataOrCount: T[] | number) => void;
  clear: () => void;

  resetToInitial: () => void;
  setInitialSnapshot: (items: T[]) => void;

  createRowComponent: (
    Component: ListRowComponent<T>,
    options?: {
      areEqual?: (prev: ListRowProps<T>, next: ListRowProps<T>) => boolean;
    },
  ) => React.MemoExoticComponent<ListRowComponent<T>>;

  getDirtySnapshot: () => { isDirty: boolean; dirtyIds: Set<string> };
  subscribe: (listener: () => void) => () => void;
}
