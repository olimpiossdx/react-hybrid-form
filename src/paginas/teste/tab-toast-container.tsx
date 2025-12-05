import { Bell, MapPin, Clock, Zap, Layout, CheckCircle, AlertTriangle, Info, AlertCircle, DownloadCloud, Trash2, Trophy, WifiOff } from 'lucide-react';
import { toast } from '../../componentes/toast';

const ToastContainerExample = () => {
 
  // Estilo base para os botões de grade
  const btnGridClass = "flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono text-gray-300 bg-gray-900 border border-gray-600 rounded hover:bg-gray-800 hover:text-white hover:border-cyan-500 transition-all active:scale-95";

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 max-w-6xl mx-auto">
      <div className="mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
           <Bell className="w-6 h-6" /> Central de Notificações
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
            Sistema de Toasts de Alta Performance com suporte a filas, posicionamento e ações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA DA ESQUERDA: Básico e Posição */}
        <div className="lg:col-span-5 space-y-8">
            
            {/* 1. Variantes Básicas */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Zap size={14} /> Variantes Semânticas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => toast.success("Dados salvos com sucesso!", { title: "Sucesso" })} 
                        className="p-3 bg-green-900/20 border border-green-800/50 rounded text-green-400 hover:bg-green-900/40 transition-colors text-left flex items-center gap-2"
                    >
                        <CheckCircle size={18} /> Sucesso
                    </button>
                    
                    <button 
                        onClick={() => toast.error("Não foi possível conectar.", { title: "Erro 500" })} 
                        className="p-3 bg-red-900/20 border border-red-800/50 rounded text-red-400 hover:bg-red-900/40 transition-colors text-left flex items-center gap-2"
                    >
                        <AlertCircle size={18} /> Erro
                    </button>
                    
                    <button 
                        onClick={() => toast.warning("Sessão expira em 2min.", { title: "Atenção" })} 
                        className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded text-yellow-400 hover:bg-yellow-900/40 transition-colors text-left flex items-center gap-2"
                    >
                        <AlertTriangle size={18} /> Aviso
                    </button>
                    
                    <button 
                        onClick={() => toast.info("Nova versão disponível.", { title: "Update" })} 
                        className="p-3 bg-blue-900/20 border border-blue-800/50 rounded text-blue-400 hover:bg-blue-900/40 transition-colors text-left flex items-center gap-2"
                    >
                        <Info size={18} /> Info
                    </button>
                </div>
            </div>

            {/* 2. Posicionamento */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <MapPin size={14} /> Posicionamento
                </h3>
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => toast.info("Topo Esquerda", { position: 'top-left' })} className={btnGridClass}>↖ TL</button>
                        <button onClick={() => toast.info("Topo Centro", { position: 'top-center' })} className={btnGridClass}>⬆ TC</button>
                        <button onClick={() => toast.info("Topo Direita", { position: 'top-right' })} className={btnGridClass}>↗ TR</button>
                        
                        <div className="col-span-3 h-8 flex items-center justify-center text-[10px] text-gray-600 font-mono">SCREEN</div>

                        <button onClick={() => toast.info("Baixo Esquerda", { position: 'bottom-left' })} className={btnGridClass}>↙ BL</button>
                        <button onClick={() => toast.info("Baixo Centro", { position: 'bottom-center' })} className={btnGridClass}>⬇ BC</button>
                        <button onClick={() => toast.info("Baixo Direita", { position: 'bottom-right' })} className={btnGridClass}>↘ BR</button>
                    </div>
                </div>
            </div>
        </div>

        {/* COLUNA DA DIREITA: Recursos Avançados */}
        <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <Layout size={14} /> Funcionalidades Avançadas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* TESTE 1: COM AÇÃO (UNDO) */}
                <button 
                    onClick={() => toast.warning("O item 'Relatório_Final.pdf' foi movido para a lixeira.", { 
                        title: "Item Excluído",
                        duration: 8000, // Tempo maior para dar tempo de clicar
                        action: { 
                            label: "Desfazer", 
                            onClick: () => toast.success("Ação desfeita! O item foi restaurado.") 
                        }
                    })} 
                    className="p-4 bg-gray-700/30 rounded border border-gray-600 hover:border-yellow-500/50 hover:bg-gray-700/50 text-left group transition-all"
                >
                    <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <Trash2 size={20} className="text-red-400" /> Com Ação (Undo)
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                        Exibe um botão dentro do toast para reverter a ação.
                    </p>
                </button>

                {/* TESTE 2: PERSISTENTE (INFINITO) */}
                <button 
                    onClick={() => toast.error("Conexão com o servidor perdida. Tentando reconectar...", { 
                        title: "Sem Internet",
                        icon: <WifiOff className="text-red-500 animate-pulse" />,
                        duration: Infinity, // Nunca fecha sozinho
                        action: { label: "Tentar Agora", onClick: () => window.location.reload() }
                    })} 
                    className="p-4 bg-gray-700/30 rounded border border-gray-600 hover:border-red-500/50 hover:bg-gray-700/50 text-left group transition-all"
                >
                    <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <Clock size={20} className="text-orange-400" /> Persistente
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                        Não desaparece até que o usuário feche ou clique na ação.
                    </p>
                </button>

                {/* TESTE 3: ÍCONE CUSTOMIZADO & COR */}
                <button 
                    onClick={() => toast.custom("Você desbloqueou o nível 'Master'!", { 
                        title: "Conquista!",
                        icon: <Trophy className="text-yellow-400 drop-shadow-lg animate-bounce" size={32} />,
                        duration: 5000
                    })} 
                    className="p-4 bg-gray-700/30 rounded border border-gray-600 hover:border-purple-500/50 hover:bg-gray-700/50 text-left group transition-all"
                >
                    <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <Trophy size={20} className="text-purple-400" /> Ícone Custom
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                        Permite passar qualquer ReactNode como ícone (ex: SVG animado).
                    </p>
                </button>

                {/* TESTE 4: TAMANHO GRANDE (DESCRIÇÃO LONGA) */}
                <button 
                    onClick={() => toast.info("O download do pacote de ativos (1.2GB) foi concluído e está disponível na sua pasta de downloads. Clique para abrir.", { 
                        title: "Download Finalizado",
                        size: 'large',
                        icon: <DownloadCloud className="text-blue-400" size={28} />,
                        duration: 6000
                    })} 
                    className="p-4 bg-gray-700/30 rounded border border-gray-600 hover:border-cyan-500/50 hover:bg-gray-700/50 text-left group transition-all"
                >
                    <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <Layout size={20} className="text-cyan-400" /> Tamanho Grande
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                        Layout expandido para mensagens longas ou detalhadas.
                    </p>
                </button>

            </div>

            <div className="mt-6 p-4 bg-black/30 rounded border border-gray-700/50">
                <p className="text-xs text-gray-500 font-mono">
                    * Dica: Clique várias vezes rapidamente para testar o empilhamento (Stacking).
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ToastContainerExample;