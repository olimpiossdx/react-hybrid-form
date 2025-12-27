import { useCallback, useState } from 'react';

export interface ListItem<T> {
  id: string;
  data: T;
}

export interface IUseListReturn<T> {
  items: ListItem<T>[];
  add: (payload?: T | T[]) => void;
  insertAt: (index: number, payload?: T) => void;
  update: (id: string, payload: Partial<T>) => void; // <--- NOVO
  move: (fromIndex: number, toIndex: number) => void;
  remove: (identifier: number | string | { id: string }) => void;
  replace: (dataOrCount: T[] | number) => void;
  clear: () => void;
}

export const useList = <T = any,>(initialDataOrCount: T[] | number = []): IUseListReturn<T> => {
  const generateItem = (data?: T): ListItem<T> => ({
    id: `item-${crypto.randomUUID()}`,
    data: data || ({} as T),
  });

  const [items, setItems] = useState<ListItem<T>[]>(() => {
    if (typeof initialDataOrCount === 'number') {
      return Array.from({ length: initialDataOrCount }, () => generateItem());
    }
    return (initialDataOrCount || []).map((item) => generateItem(item));
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
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Merge dos dados antigos com os novos
          return { ...item, data: { ...item.data, ...payload } };
        }
        return item;
      }),
    );
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

  const remove = useCallback((identifier: number | string | { id: string }) => {
    setItems((prev) => {
      if (typeof identifier === 'number') {
        return prev.filter((_, i) => i !== identifier);
      }
      if (typeof identifier === 'string') {
        return prev.filter((item) => item.id !== identifier);
      }
      if (typeof identifier === 'object' && 'id' in identifier) {
        return prev.filter((item) => item.id !== identifier.id);
      }
      return prev;
    });
  }, []);

  const replace = useCallback((dataOrCount: T[] | number) => {
    setItems(() => {
      if (typeof dataOrCount === 'number') {
        return Array.from({ length: dataOrCount }, () => generateItem());
      }
      return (dataOrCount || []).map((item) => generateItem(item));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, insertAt, update, move, remove, replace, clear };
};

export default useList;
