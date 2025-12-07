import { useCallback } from 'react';
import { graph } from '../../core/native-bus';

// Tipo padrão: Aceita qualquer string como evento e qualquer coisa como payload
type DefaultEventMap = Record<string, any>;

/**
 * Hook para comunicação via Graph Bus (Pub/Sub).
 * @template E - Interface que define o mapa de eventos { 'evento': payload }
 */
export const useGraph = <E extends Record<string, any> = DefaultEventMap>() => {
  // Emitir com tipagem forte baseada em E
  const emit = useCallback(<K extends keyof E>( event: K extends string ? K : never, payload: E[K]) => {
    graph.emit(event as string, payload);
  }, []);

  // Ouvir com tipagem forte
  const on = useCallback(<K extends keyof E>(event: K extends string ? K : never, callback: (payload: E[K]) => void) => {
    return graph.on(event as string, callback);
  }, []);

  return { emit, on };
};