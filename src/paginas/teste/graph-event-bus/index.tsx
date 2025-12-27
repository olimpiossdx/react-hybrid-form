import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Cpu,
  Database,
  FileText,
  FolderOpen,
  Globe,
  MousePointer2,
  Network,
  Search,
  Server,
} from 'lucide-react';

import { useGraphBus } from '../../../hooks/native-bus';

// --- CONTRATO DE EVENTOS (Tipagem Local) ---
interface GraphEvents {
  'sys:mode_change': { mode: 'normal' | 'emergency'; timestamp: number };
  'filter:apply': { category: string; term: string };
  'mouse:move': { x: number; y: number };
  'tree:search': { term: string };
  'service:select': {
    id: string;
    name: string;
    type: string;
    status: string;
    region: string;
  };
}

// ============================================================================
// CENÁRIO 1: BROADCAST GLOBAL (Header -> Widgets)
// ============================================================================

const HeaderControl = memo(() => {
  const { emit } = useGraphBus<GraphEvents>();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-900 rounded-t-lg transition-colors">
      <div className="flex items-center gap-2">
        <Network className="text-purple-600 dark:text-purple-400" />
        <span className="font-bold text-gray-700 dark:text-gray-300">Central de Comando</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => emit('sys:mode_change', { mode: 'normal', timestamp: Date.now() })}
          className="px-3 py-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded text-xs transition-colors shadow-sm">
          Normal
        </button>
        <button
          onClick={() =>
            emit('sys:mode_change', {
              mode: 'emergency',
              timestamp: Date.now(),
            })
          }
          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs animate-pulse font-bold shadow-sm">
          🚨 EMERGÊNCIA
        </button>
      </div>
    </div>
  );
});

const StatusWidget = memo(({ label }: { id: string; label: string }) => {
  const { on } = useGraphBus<GraphEvents>();
  const [status, setStatus] = useState('normal');

  useEffect(() => {
    return on('sys:mode_change', ({ mode }) => setStatus(mode));
  }, [on]);

  const isEmergency = status === 'emergency';

  return (
    <div
      className={`p-4 rounded border transition-all duration-500 flex flex-col items-center justify-center gap-2 shadow-sm
      ${isEmergency ? 'bg-red-50 dark:bg-red-900/30 border-red-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
      {isEmergency ? (
        <AlertTriangle className="text-red-500 dark:text-red-400" />
      ) : (
        <CheckCircle className="text-green-500 dark:text-green-400" />
      )}
      <span className="font-bold text-gray-900 dark:text-white text-sm">{label}</span>
      <span
        className={`text-[10px] uppercase font-mono ${isEmergency ? 'text-red-600 dark:text-red-300' : 'text-gray-500 dark:text-gray-500'}`}>
        {status}
      </span>
    </div>
  );
});

// ============================================================================
// CENÁRIO 2: COMUNICAÇÃO ENTRE IRMÃOS (Filtro -> Tabela)
// ============================================================================

const SidebarFilter = memo(() => {
  const { emit } = useGraphBus<GraphEvents>();
  return (
    <div className="w-1/3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded border border-gray-200 dark:border-gray-700 flex flex-col gap-2 h-64 transition-colors">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Filtros (Sidebar)</h4>
      <p className="text-[10px] text-gray-400 mb-4">
        Emite <code>filter:apply</code>
      </p>

      <button
        onClick={() => emit('filter:apply', { category: 'Eletrônicos', term: '' })}
        className="text-left text-sm text-cyan-600 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded transition-colors font-medium">
        &bull; Eletrônicos
      </button>
      <button
        onClick={() => emit('filter:apply', { category: 'Livros', term: '' })}
        className="text-left text-sm text-cyan-600 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded transition-colors font-medium">
        &bull; Livros
      </button>
      <button
        onClick={() => emit('filter:apply', { category: 'Móveis', term: '' })}
        className="text-left text-sm text-cyan-600 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded transition-colors font-medium">
        &bull; Móveis
      </button>
    </div>
  );
});

const ContentTable = memo(() => {
  const { on } = useGraphBus<GraphEvents>();
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return on('filter:apply', ({ category }) => {
      setLoading(true);
      setTimeout(() => {
        setFilter(category);
        setLoading(false);
      }, 400);
    });
  }, [on]);

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 relative h-64 flex items-center justify-center transition-colors shadow-sm">
      <div className="absolute top-2 left-3 text-xs font-bold text-gray-400 uppercase">Grid de Dados</div>

      {loading ? (
        <span className="text-cyan-600 dark:text-cyan-400 animate-pulse text-sm font-medium">Carregando dados de {filter}...</span>
      ) : (
        <div className="text-center">
          <p className="text-4xl mb-2">📦</p>
          <p className="text-gray-900 dark:text-white text-lg">
            Exibindo: <strong className="text-cyan-600 dark:text-cyan-400">{filter}</strong>
          </p>
          <p className="text-xs text-gray-500 mt-2">O componente reagiu ao evento sem props.</p>
        </div>
      )}
    </div>
  );
});

// ============================================================================
// CENÁRIO 3: ALTA PERFORMANCE (Mouse Tracker)
// ============================================================================

const MouseTracker = memo(() => {
  const { emit, on } = useGraphBus<GraphEvents>();
  const labelRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    emit('mouse:move', { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  useEffect(() => {
    return on('mouse:move', ({ x, y }) => {
      if (labelRef.current) {
        labelRef.current.textContent = `X: ${x} | Y: ${y}`;
      }
      if (targetRef.current) {
        targetRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }, [on]);

  return (
    <div
      className="h-64 bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded relative overflow-hidden cursor-crosshair group transition-colors"
      onMouseMove={handleMove}>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-green-600 dark:text-green-400 bg-white/80 dark:bg-black/80 px-2 py-1 rounded z-10 border border-green-200 dark:border-green-900">
        <span ref={labelRef}>Mova o mouse</span>
      </div>
      <div
        ref={targetRef}
        className="w-4 h-4 bg-green-500 rounded-full absolute top-0 left-0 -ml-2 -mt-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(34,197,94,0.6)]"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
        <MousePointer2 className="text-gray-400 dark:text-gray-600 mb-2" size={32} />
        <span className="text-gray-500 dark:text-gray-500 text-xs">Área de Alta Frequência (60 FPS)</span>
        <span className="text-gray-400 dark:text-gray-600 text-[10px]">Manipulação Direta de DOM</span>
      </div>
    </div>
  );
});

// ============================================================================
// CENÁRIO 4: TREE VIEW
// ============================================================================

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const FILE_SYSTEM: TreeNode[] = [
  {
    id: '1',
    label: 'src',
    children: [
      {
        id: '1-1',
        label: 'components',
        children: [
          { id: '1-1-1', label: 'Button.tsx' },
          { id: '1-1-2', label: 'Modal.tsx' },
        ],
      },
      {
        id: '1-2',
        label: 'hooks',
        children: [
          { id: '1-2-1', label: 'useForm.ts' },
          { id: '1-2-2', label: 'useGraph.ts' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'public',
    children: [
      { id: '2-1', label: 'index.html' },
      { id: '2-2', label: 'favicon.ico' },
    ],
  },
];

const FileNode = memo(({ node, level = 0 }: { node: TreeNode; level?: number }) => {
  const { on } = useGraphBus<GraphEvents>();
  const [isMatch, setIsMatch] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    return on('tree:search', ({ term }) => {
      if (!term) {
        setIsMatch(false);
        setIsDimmed(false);
        setIsExpanded(level < 1);
        return;
      }

      const termLower = term.toLowerCase();
      const match = node.label.toLowerCase().includes(termLower);

      setIsMatch(match);
      setIsExpanded(true);
      setIsDimmed(!match);
    });
  }, [node.label, on, level]);

  return (
    <div style={{ paddingLeft: level * 16 }}>
      <div
        className={`
                    flex items-center gap-2 py-1 px-2 rounded text-sm cursor-pointer transition-all duration-300
                    ${isMatch ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-500/50 font-bold' : ''}
                    ${isDimmed && !isMatch ? 'opacity-40 grayscale' : 'opacity-100'}
                    ${!isMatch && !isDimmed ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                `}
        onClick={() => setIsExpanded(!isExpanded)}>
        {node.children ? (
          <span className="text-gray-400">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
        ) : (
          <div className="w-3.5" />
        )}

        {node.children ? (
          <FolderOpen size={16} className="text-blue-500 dark:text-blue-400" />
        ) : (
          <FileText size={16} className="text-gray-400 dark:text-gray-500" />
        )}
        <span>{node.label}</span>
      </div>

      {node.children && isExpanded && (
        <div className="border-l border-gray-200 dark:border-gray-700 ml-2">
          {node.children.map((child) => (
            <FileNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

const TreeSearch = memo(() => {
  const { emit } = useGraphBus<GraphEvents>();
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
      <input
        placeholder="Filtrar arquivos..."
        className="w-full bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 p-2 text-sm text-gray-900 dark:text-white focus:border-yellow-500 outline-none transition-colors"
        onChange={(e) => emit('tree:search', { term: e.target.value })}
      />
    </div>
  );
});

// ============================================================================
// CENÁRIO 5: SERVICE MESH (Navegação Cruzada)
// ============================================================================

const SERVICES = [
  {
    id: 'svc-1',
    name: 'API Gateway',
    type: 'globe',
    status: 'active',
    region: 'us-east-1',
  },
  {
    id: 'svc-2',
    name: 'Auth Service',
    type: 'server',
    status: 'active',
    region: 'us-east-1',
  },
  {
    id: 'svc-3',
    name: 'Payment Worker',
    type: 'cpu',
    status: 'error',
    region: 'eu-west-2',
  },
  {
    id: 'svc-4',
    name: 'User DB',
    type: 'db',
    status: 'active',
    region: 'us-east-1',
  },
];

const ServiceNode = memo(({ data }: { data: any }) => {
  const { emit } = useGraphBus<GraphEvents>();

  const icons: any = { globe: Globe, server: Server, cpu: Cpu, db: Database };
  const Icon = icons[data.type];

  return (
    <div
      onClick={() => emit('service:select', data)}
      className={`
                flex items-center gap-3 p-3 rounded border cursor-pointer transition-all hover:scale-[1.02] shadow-sm
                ${
                  data.status === 'error'
                    ? 'border-red-200 dark:border-red-500/50 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-cyan-500'
                }
            `}>
      <div
        className={`p-2 rounded-lg ${data.status === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-cyan-600 dark:text-cyan-400'}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{data.name}</div>
        <div className="text-[10px] text-gray-500 uppercase">{data.id}</div>
      </div>
      {data.status === 'error' && <AlertTriangle size={14} className="ml-auto text-red-500 animate-pulse" />}
    </div>
  );
});

const ServiceDetails = memo(() => {
  const { on } = useGraphBus<GraphEvents>();
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    return on('service:select', (data) => setSelected(data));
  }, [on]);

  if (!selected) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
        <MousePointer2 size={32} className="mb-2 opacity-50" />
        <p className="text-sm">Selecione um serviço</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 h-full animate-in slide-in-from-right-4 fade-in shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-bold uppercase ${selected.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
          {selected.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase font-bold">ID do Serviço</label>
          <p className="font-mono text-cyan-600 dark:text-cyan-300">{selected.id}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase font-bold">Região</label>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Globe size={14} /> {selected.region}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-black/30 rounded border border-gray-200 dark:border-gray-700 mt-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-2">
            <Activity size={14} /> Métricas em Tempo Real (Mock)
          </div>
          <div className="h-16 flex items-end gap-1">
            {[40, 60, 30, 80, 50, 90, 45].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 bg-cyan-200 dark:bg-cyan-900/50 hover:bg-cyan-500 transition-colors rounded-t-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// ORQUESTRADOR
// ============================================================================

const GraphExample = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-6xl mx-auto space-y-12 transition-colors">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400">
          Graph Bus Architecture
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comunicação desacoplada entre componentes isolados usando <code>Native EventTarget</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Cenario 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs px-2 py-1 rounded border border-purple-200 dark:border-purple-700">
              Cenário 1
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Broadcast Global (1-para-N)</h3>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-64 shadow-sm">
            <HeaderControl />
            <div className="p-6 grid grid-cols-3 gap-4 bg-gray-50 dark:bg-black/20 h-full">
              <StatusWidget id="A" label="App Core" />
              <StatusWidget id="B" label="Database" />
              <StatusWidget id="C" label="Cache" />
            </div>
          </div>
        </section>

        {/* Cenario 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded border border-blue-200 dark:border-blue-700">
              Cenário 2
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Comunicação Lateral (Irmãos)</h3>
          </div>
          <div className="flex gap-4 h-64">
            <SidebarFilter />
            <ContentTable />
          </div>
        </section>

        {/* Cenario 4 - TREE VIEW */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs px-2 py-1 rounded border border-yellow-200 dark:border-yellow-700">
              Cenário 3
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Busca Profunda (Performance)</h3>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded border border-gray-200 dark:border-gray-700 h-96 overflow-y-auto custom-scrollbar flex flex-col">
            <TreeSearch />
            <div className="pl-1 mt-2 flex-1">
              {FILE_SYSTEM.map((node) => (
                <FileNode key={node.id} node={node} />
              ))}
            </div>
          </div>
        </section>

        {/* Cenario 5 - SERVICE MESH */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200 text-xs px-2 py-1 rounded border border-cyan-200 dark:border-cyan-700">
              Cenário 4
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Navegação Cruzada (Master-Detail)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 h-96">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-y-auto space-y-3 custom-scrollbar">
              {SERVICES.map((svc) => (
                <ServiceNode key={svc.id} data={svc} />
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-1 rounded border border-gray-200 dark:border-gray-700">
              <ServiceDetails />
            </div>
          </div>
        </section>

        {/* Cenario 3 - MOUSE */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs px-2 py-1 rounded border border-green-200 dark:border-green-700">
              Performance
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Zero Re-render (Bypass do React)</h3>
          </div>
          <MouseTracker />
        </section>
      </div>
    </div>
  );
};

export default GraphExample;
