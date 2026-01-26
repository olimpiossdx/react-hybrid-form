import { useCallback, useState } from 'react';

import type { ListRowComponent, ListRowProps } from './create-row';

export interface ListItem<T> {
  _internalId: string;
  data: T;
}

export interface UseListReturn<T> {
  items: ListItem<T>[];

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
}
const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const useList = <T = any,>(initialDataOrCount: T[] | number = []): IUseListReturn<T> => {
  const generateItem = <T,>(data?: T): ListItem<T> => ({
    _internalId: `item-${createId()}`,
    data: data ?? ({} as T),
  });

  const [items, setItems] = useState<ListItem<T>[]>(() => {
    if (typeof initialDataOrCount === 'number') {
      return Array.from({ length: initialDataOrCount }, () => generateItem<T>());
    }
    return (initialDataOrCount || []).map((item) => generateItem<T>(item));
  });

  const add = useCallback((payload?: T | T[]) => {
    setItems((prev) => {
      if (Array.isArray(payload)) {
        const newItems = payload.map((item) => generateItem(item));
        return [...prev, ...newItems];
      }
      return [...prev, generateItem(payload)];
    });
  }, []);

  const insertAt = useCallback((index: number, payload?: T) => {
    setItems((prev) => {
      const newItem = generateItem(payload);
      const newItems = [...prev];
      newItems.splice(index, 0, newItem);
      return newItems;
    });
  }, []);

  // --- MÉTODO DE ATUALIZAÇÃO ---
  const update = useCallback((id: string, payload: Partial<T>) => {
    setItems((prev) => prev.map((item) => (item._internalId === id ? { ...item, data: { ...item.data, ...payload } } : item)));
  }, []);

  const updateAt = useCallback((index: number, payload: Partial<T>) => {
    setItems((prev) => {
      if (index < 0 || index >= prev.length) {
        return prev;
      }
      const newItems = [...prev];
      const target = newItems[index];
      newItems[index] = { ...target, data: { ...target.data, ...payload } };
      return newItems;
    });
  }, []);

  const move = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      if (toIndex < 0 || toIndex >= prev.length || fromIndex < 0 || fromIndex >= prev.length) {
        return prev;
      }
      const newItems = [...prev];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return newItems;
    });
  }, []);

  const removeById = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item._internalId !== id));
  }, []);

  const removeAt = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const set = useCallback((dataOrCount: T[] | number) => {
    setItems(() => {
      if (typeof dataOrCount === 'number') {
        return Array.from({ length: dataOrCount }, () => generateItem<T>());
      }
      return (dataOrCount || []).map((item) => generateItem<T>(item));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, insertAt, update, updateAt, move, removeById, removeAt, set, clear };
};

export default useList;
