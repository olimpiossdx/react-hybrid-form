import { useCallback } from 'react';
import type { GraphEventMap, GraphEventName } from '../../paginas/teste/graph-event-bus/event';
import { graph } from '../../core/native-bus';

export const useGraph = () => {
  
  // Emitir evento com tipagem garantida pelo TypeScript
  const emit = useCallback(<K extends GraphEventName>(
    event: K, 
    payload: GraphEventMap[K]
  ) => {
    graph.emit(event, payload);
  }, []);

  // Ouvir evento com tipagem garantida
  const on = useCallback(<K extends GraphEventName>(
    event: K, 
    callback: (payload: GraphEventMap[K]) => void
  ) => {
    return graph.on(event, callback);
  }, []);

  return { emit, on };
};