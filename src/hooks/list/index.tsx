import React from 'react';

/**
 * Hook para gerenciar a ESTRUTURA de listas dinâmicas.
 * * * Correção de Arquitetura (v0.6):
 * O hook agora trata 'initialDataOrCount' estritamente como VALOR INICIAL.
 * Removemos o useEffect de sincronização automática para evitar loops infinitos 
 * quando arrays literais são passados.
 * * Para atualizar a lista após o mount, use o método 'replace'.
 */
export const useList = <T = any>(initialDataOrCount: T[] | number = []) => {
  
  const generateItem = (data?: T) => ({
    id: `item-${crypto.randomUUID()}`, 
    data: data || null
  });

  // Inicializa o estado UMA VEZ. 
  // Alterações subsequentes na prop initialDataOrCount serão ignoradas,
  // prevenindo re-renders cíclicos.
  const [items, setItems] = React.useState(() => {
    if (typeof initialDataOrCount === 'number') {
        return Array.from({ length: initialDataOrCount }, () => generateItem());
    }
    return (initialDataOrCount || []).map(item => generateItem(item));
  });

  const add = React.useCallback((initialValues?: T) => {
    setItems(prev => [...prev, generateItem(initialValues)]);
  }, []);

  const remove = React.useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const replace = React.useCallback((count: number) => {
    setItems(Array.from({ length: count }, () => generateItem()));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  return { items, add, remove, replace, clear };
};

export default useList;