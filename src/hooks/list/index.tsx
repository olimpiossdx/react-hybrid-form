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
   * Adiciona novos itens à lista.
   * Suporta adição única ou em lote (batch) para performance.
   * * @param payload - O dado do novo item, um array de dados, ou vazio (undefined).
   * * @example
   * // 1. Adicionar linha vazia
   * add();
   * * // 2. Adicionar com dados padrão
   * add({ name: "Novo Item", qtd: 1 });
   * * // 3. Adicionar Múltiplos (Batch - 1 Render)
   * add([{ name: "A" }, { name: "B" }]);
   */
  add: (payload?: T | T[]) => void;

  /**
   * Remove um item da lista.
   * Flexível: aceita índice numérico, ID string ou o próprio objeto do item.
   * * @param identifier - O índice (number), o ID (string) ou o Objeto Item.
   * * @example
   * // 1. Por Índice (comum em maps)
   * <button onClick={() => remove(index)}>X</button>
   * * // 2. Por ID (mais seguro se a lista for filtrada)
   * remove("item-123-abc");
   * * // 3. Pelo Objeto (se você tiver a referência)
   * remove(itemAtual);
   */
  remove: (identifier: number | string | { id: string }) => void;

  /**
   * Substitui a lista inteira por N linhas novas vazias.
   * Útil para preparar a estrutura do formulário antes de injetar dados via DOM (`resetSection`).
   * * @param count - O número de linhas a serem criadas.
   * * @example
   * // "Limpa" a lista e deixa 5 espaços prontos para edição
   * replace(5);
   */
  replace: (count: number) => void;

  /**
   * Remove todos os itens da lista, deixando-a com tamanho 0.
   */
  clear: () => void;
}

/**
 * Hook para gerenciar a ESTRUTURA de listas dinâmicas em formulários não controlados.
 * * * **Filosofia:**
 * Este hook não controla os valores dos inputs em tempo real (para performance). 
 * Ele gerencia a quantidade de linhas e seus IDs únicos, permitindo renderizar a lista 
 * e injetar dados iniciais via `defaultValue`.
 * * @template T Tipo dos dados da lista.
 * @param initialDataOrCount Dados iniciais (Array de objetos) ou Quantidade de linhas vazias (Number).
 * * @example
 * // 1. Inicializar vazio (1 linha)
 * const list = useList(1);
 * * // 2. Inicializar com dados (Edição)
 * const list = useList([{ name: "Ana" }, { name: "Bob" }]);
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
        // Cenário Lote (Array)
        if (Array.isArray(payload)) {
            const newItems = payload.map(item => generateItem(item));
            return [...prev, ...newItems];
        }

        // Cenário Único (Item ou Vazio)
        return [...prev, generateItem(payload)];
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

  const replace = useCallback((count: number) => {
    setItems(Array.from({ length: count }, () => generateItem()));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, remove, replace, clear };
};

export default useList;