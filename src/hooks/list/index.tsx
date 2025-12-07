import { useState, useCallback } from 'react';

// Tipo auxiliar para o item da lista
export interface ListItem<T> {
  id: string;
  data: T;
}

/**
 * Hook para gerenciar listas dinâmicas.
 * * @template T Tipo dos dados da lista
 */
export const useList = <T = any>(initialDataOrCount: T[] | number = []) => {
  
  const generateItem = (data?: T): ListItem<T> => ({
    id: `item-${crypto.randomUUID()}`, 
    data: data || ({} as T)
  });

  // Inicializa o estado UMA VEZ na montagem.
  // Ignora alterações futuras em initialDataOrCount para evitar loops infinitos com arrays literais.
  const [items, setItems] = useState<ListItem<T>[]>(() => {
    if (typeof initialDataOrCount === 'number') {
        return Array.from({ length: initialDataOrCount }, () => generateItem());
    }
    return (initialDataOrCount || []).map(item => generateItem(item));
  });

  const add = useCallback((initialValues?: T) => {
    setItems(prev => [...prev, generateItem(initialValues)]);
  }, []);

  /**
   * Remove um item da lista.
   * Suporta remoção por:
   * 1. Índice (number): remove(0)
   * 2. ID (string): remove("item-123...")
   * 3. Objeto (Item): remove(item)
   */
  const remove = useCallback((identifier: number | string | { id: string }) => {
    setItems(prev => {
        // Caso 1: Remoção por Índice (number)
        if (typeof identifier === 'number') {
            return prev.filter((_, i) => i !== identifier);
        }

        // Caso 2: Remoção por ID (string)
        if (typeof identifier === 'string') {
            return prev.filter(item => item.id !== identifier);
        }

        // Caso 3: Remoção por Objeto (item completo)
        if (typeof identifier === 'object' && 'id' in identifier) {
            return prev.filter(item => item.id !== identifier.id);
        }

        return prev;
    });
  }, []);

  const replace = useCallback((count: number) => {
    setItems(Array.from({ length: count }, () => generateItem()));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, remove, replace, clear };
};

export default useList;