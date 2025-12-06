// Define o payload (dados) esperado para cada evento
export interface GraphEventMap {
  // Cenário 1: Broadcast Global
  'sys:mode_change': { mode: 'normal' | 'emergency'; timestamp: number };
  
  // Cenário 2: Comunicação entre Irmãos/Primos
  'filter:apply': { category: string; term: string };
  
  // Cenário 3: Alta Performance (Zero Render)
  'mouse:move': { x: number; y: number };

  // Cenário 4: TreeView (Broadcast Recursivo)
  'tree:search': { term: string };
}

export type GraphEventName = keyof GraphEventMap;