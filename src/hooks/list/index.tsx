// hooks/list/index.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';

import createRowComponent from './create-row';
import type { ListDirtyEvent, ListItem, UseListReturn } from './proptypes';
import { createId } from '../../utils/utilities';
import { useGraphBus } from '../native-bus';

const generateItem = <T,>(data?: T): ListItem<T> => ({
  _internalId: `item-${createId()}`,
  data: data ?? ({} as T),
});

export const useList = <T = any,>(initialDataOrCount: T[] | number = []): UseListReturn<T> => {
  const [items, setItems] = useState<ListItem<T>[]>(() => {
    if (typeof initialDataOrCount === 'number') {
      return Array.from({ length: initialDataOrCount }, () => generateItem<T>());
    }
    return (initialDataOrCount || []).map((item) => generateItem<T>(item));
  });
  // store imperativa
  const itemsRef = useRef<ListItem<T>[]>([]);
  const listenersRef = useRef<Set<() => void>>(new Set());

  useEffect(() => {
    itemsRef.current = items;
    if (listenersRef.current.size > 0) {
      listenersRef.current.forEach((fn) => fn());
    }
  }, [items]);

  // Map para acesso rápido por id
  const indexMapRef = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    const map = new Map<string, number>();
    items.forEach((item, idx) => map.set(item._internalId, idx));
    indexMapRef.current = map;
  }, [items]);

  // Snapshot inicial para reset
  const initialRef = useRef<ListItem<T>[]>([]);
  useEffect(() => {
    if (initialRef.current.length === 0 && items.length > 0) {
      initialRef.current = items.map((it) => ({
        _internalId: it._internalId,
        data: { ...it.data },
      }));
    }
  }, [items]);

  // Dirty
  const dirtyRef = useRef<Set<string>>(new Set());
  const listIdRef = useRef<string | undefined>(undefined);
  const { emit } = useGraphBus<ListDirtyEvent>();

  const notifyDirtyChange = useCallback(
    (isDirty: boolean) => {
      emit('list:dirty', { listId: listIdRef.current, isDirty });
    },
    [emit],
  );

  const markDirty = useCallback(
    (id: string) => {
      const prevSize = dirtyRef.current.size;
      dirtyRef.current.add(id);
      if (dirtyRef.current.size !== prevSize) {
        notifyDirtyChange(true);
      }
    },
    [notifyDirtyChange],
  );

  const clearDirty = React.useCallback(() => {
    if (dirtyRef.current.size > 0) {
      dirtyRef.current.clear();
      notifyDirtyChange(false);
    }
  }, [notifyDirtyChange]);

  const getDirtySnapshot = () => ({
    isDirty: dirtyRef.current.size > 0,
    dirtyIds: new Set(dirtyRef.current),
  });

  // operações

  const add = useCallback((payload?: T | T[]) => {
    setItems((prev) => {
      if (Array.isArray(payload)) {
        const newItems = payload.map((item) => generateItem<T>(item));
        return [...prev, ...newItems];
      }
      return [...prev, generateItem<T>(payload)];
    });
  }, []);

  const insertAt = useCallback((index: number, payload?: T) => {
    setItems((prev) => {
      const newItem = generateItem<T>(payload);
      const next = [...prev];
      next.splice(index, 0, newItem);
      return next;
    });
  }, []);

  const update = useCallback(
    (id: string, payload: Partial<T>) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item._internalId === id) {
            markDirty(id);
            return { ...item, data: { ...item.data, ...payload } };
          }
          return item;
        }),
      );
    },
    [markDirty],
  );

  const updateAt = useCallback(
    (index: number, payload: Partial<T>) => {
      setItems((prev) => {
        if (index < 0 || index >= prev.length) {
          return prev;
        }
        const next = [...prev];
        const target = next[index];
        markDirty(target._internalId);
        next[index] = { ...target, data: { ...target.data, ...payload } };
        return next;
      });
    },
    [markDirty],
  );

  const move = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      if (toIndex < 0 || toIndex >= prev.length || fromIndex < 0 || fromIndex >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const removeById = useCallback(
    (id: string) => {
      setItems((prev) => {
        const index = indexMapRef.current.get(id)!;
        if (index === null) {
          return prev;
        }
        const next = [...prev];
        next.splice(index, 1);
        markDirty(id);
        return next;
      });
    },
    [markDirty],
  );

  const removeAt = useCallback(
    (index: number) => {
      setItems((prev) => {
        if (index < 0 || index >= prev.length) {
          return prev;
        }
        const target = prev[index];
        const next = prev.filter((_, i) => i !== index);
        markDirty(target._internalId);
        return next;
      });
    },
    [markDirty],
  );

  const set = useCallback(
    (dataOrCount: T[] | number) => {
      setItems(() => {
        if (typeof dataOrCount === 'number') {
          return Array.from({ length: dataOrCount }, () => generateItem<T>());
        }
        return (dataOrCount || []).map((item) => generateItem<T>(item));
      });
      clearDirty();
      initialRef.current = [];
    },
    [clearDirty],
  );

  const clear = useCallback(() => {
    setItems([]);
    clearDirty();
    initialRef.current = [];
  }, [clearDirty]);

  const resetToInitial = useCallback(() => {
    if (!initialRef.current.length) {
      return;
    }
    const clone = initialRef.current.map((it) => ({
      _internalId: it._internalId,
      data: { ...it.data },
    }));
    setItems(clone);
    clearDirty();
  }, [clearDirty]);

  const setInitialSnapshot = useCallback(
    (data: T[]) => {
      const snapshot = data.map((d) => ({
        _internalId: `item-${createId()}`,
        data: { ...d },
      }));
      initialRef.current = snapshot;
      setItems(snapshot);
      clearDirty();
    },
    [clearDirty],
  );
  const getItems = () => itemsRef.current;

  const subscribe = (listener: () => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  };

  return {
    items,
    add,
    insertAt,
    update,
    updateAt,
    move,
    removeById,
    removeAt,
    set,
    clear,
    resetToInitial,
    setInitialSnapshot,
    createRowComponent,
    getDirtySnapshot,
    getItems,
    subscribe,
  };
};

export default useList;
