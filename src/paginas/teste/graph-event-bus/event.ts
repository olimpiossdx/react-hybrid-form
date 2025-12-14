// Define o payload (dados) esperado para cada evento
export interface GraphEventMap {
  // ... eventos existentes ...
  'sys:mode_change': { mode: 'normal' | 'emergency'; timestamp: number };
  'filter:apply': { category: string; term: string };
  'mouse:move': { x: number; y: number };
  'tree:search': { term: string };
  'service:select': { id: string; name: string; type: string; status: string; region: string };
  'shopping:add': { item: string; timestamp: number };

  // NOVO EVENTO: Mudança de Tema
  'sys:theme_change': { theme: 'light' | 'dark' };
}

export type GraphEventName = keyof GraphEventMap;