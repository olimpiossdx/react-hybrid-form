import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook para gerenciar listas dinâmicas.
 * Suporta inicialização com DADOS (para edição) ou QUANTIDADE (para vazio).
 * * @template T Tipo dos dados da lista
 */
const useList = <T = any>(initialDataOrCount: T[] | number = []) => {

  const generateItem = (data?: T) => ({
    id: `item-${crypto.randomUUID()}`, // Chave estável para o React
    data: data || ({} as T)            // Dados para o defaultValue
  });

  // Inicializa o estado mesclando IDs com os Dados recebidos
  const [items, setItems] = useState(() => {
    if (typeof initialDataOrCount === 'number') {
      return Array.from({ length: initialDataOrCount }, () => generateItem());
    }
    return (initialDataOrCount || []).map(item => generateItem(item));
  });

  // Ref para controlar se é a primeira renderização (evita resetar se o pai re-renderizar)
  const isFirstRender = useRef(true);

  // Sincroniza apenas se a prop mudar drasticamente (ex: nova busca de API)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (Array.isArray(initialDataOrCount)) {
      setItems(initialDataOrCount.map(item => generateItem(item)));
    } else if (typeof initialDataOrCount === 'number') {
      // Se mudou a contagem fixa
      setItems(prev => {
        if (prev.length === initialDataOrCount) return prev;
        return Array.from({ length: initialDataOrCount }, () => generateItem());
      });
    }
  }, [initialDataOrCount]);

  const add = useCallback((initialValues?: T) => {
    setItems(prev => [...prev, generateItem(initialValues)]);
  }, []);

  const remove = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, remove, clear };
};

export default useList;