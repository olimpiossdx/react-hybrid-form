import { useState, useCallback } from 'react';

// Tipo auxiliar para o item da lista (Estrutura)
export interface ListItem<T> {
  /** ID único e estável para ser usado na prop 'key' do React */
  id: string; 
  /** O dado inicial injetado (para ser usado no defaultValue do input) */
  data: T;    
}

/**
 * Interface de retorno do hook useList.
 * Documentação explícita aqui garante que o IntelliSense funcione ao consumir o hook.
 */
export interface UseListReturn<T> {
  /** A lista atual de itens com IDs estáveis. */
  items: ListItem<T>[];

  /**
   * Adiciona novos itens ao final da lista.
   * Suporta adição única ou em lote (batch).
   */
  add: (payload?: T | T[]) => void;

  /**
   * Insere um item em uma posição específica.
   * @param index - O índice onde inserir.
   * @param payload - O dado do item (opcional).
   */
  insertAt: (index: number, payload?: T) => void;

  /**
   * Move um item de uma posição para outra.
   * Útil para Drag & Drop ou botões de ordenação.
   */
  move: (fromIndex: number, toIndex: number) => void;

  /**
   * Remove um item da lista.
   * Aceita índice numérico, ID string ou o próprio objeto do item.
   */
  remove: (identifier: number | string | { id: string }) => void;

  /**
   * Substitui a lista inteira.
   * Aceita um número (cria linhas vazias) OU um array de dados (cria linhas preenchidas).
   */
  replace: (dataOrCount: T[] | number) => void;

  /**
   * Remove todos os itens da lista.
   */
  clear: () => void;
}

/**
 * Hook para gerenciar a ESTRUTURA de listas dinâmicas em formulários não controlados.
 */
export const useList = <T = any>(initialDataOrCount: T[] | number = []): UseListReturn<T> => {
  
  // Helper interno: Cria o objeto estrutural com ID único
  const generateItem = (data?: T): ListItem<T> => ({
    id: `item-${crypto.randomUUID()}`, 
    data: data || ({} as T)
  });

  // Inicializa o estado UMA VEZ na montagem.
  const [items, setItems] = useState<ListItem<T>[]>(() => {
    if (typeof initialDataOrCount === 'number') {
        return Array.from({ length: initialDataOrCount }, () => generateItem());
    }
    return (initialDataOrCount || []).map(item => generateItem(item));
  });

  const add = useCallback((payload?: T | T[]) => {
    setItems(prev => {
        if (Array.isArray(payload)) {
            const newItems = payload.map(item => generateItem(item));
            return [...prev, ...newItems];
        }
        return [...prev, generateItem(payload)];
    });
  }, []);

  // --- NOVO: Inserção em índice específico ---
  const insertAt = useCallback((index: number, payload?: T) => {
    setItems(prev => {
        const newItem = generateItem(payload);
        const newItems = [...prev];
        // Insere na posição sem substituir nada
        newItems.splice(index, 0, newItem);
        return newItems;
    });
  }, []);

  // --- NOVO: Reordenação ---
  const move = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
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
    setItems(prev => {
        if (typeof identifier === 'number') {
            return prev.filter((_, i) => i !== identifier);
        }
        if (typeof identifier === 'string') {
            return prev.filter(item => item.id !== identifier);
        }
        if (typeof identifier === 'object' && 'id' in identifier) {
            return prev.filter(item => item.id !== identifier.id);
        }
        return prev;
    });
  }, []);

  // --- MELHORIA: Replace Polimórfico (Dados ou Quantidade) ---
  const replace = useCallback((dataOrCount: T[] | number) => {
    setItems(() => {
        if (typeof dataOrCount === 'number') {
            return Array.from({ length: dataOrCount }, () => generateItem());
        }
        return (dataOrCount || []).map(item => generateItem(item));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, insertAt, move, remove, replace, clear };
};

export default useList;