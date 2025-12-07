// --- CONTRATO DE EVENTOS (Tipagem Local) ---

export interface IGraphEvents {
  'sys:mode_change': { mode: 'normal' | 'emergency'; timestamp: number };
  'filter:apply': { category: string; term: string };
  'mouse:move': { x: number; y: number };
  'tree:search': { term: string };
  'service:select': { id: string; name: string; type: string; status: string; region: string };
}
export type GraphEventName = keyof IGraphEvents;