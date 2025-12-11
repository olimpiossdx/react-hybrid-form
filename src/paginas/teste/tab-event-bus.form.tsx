import React from "react";
import { Plus, Trash2, ShoppingCart, CheckSquare, Zap } from "lucide-react";
import showModal from "../../componentes/modal/hook";
import useList from "../../hooks/list";
import { useGraphBus } from "../../hooks/native-bus";

// Definição dos eventos locais deste cenário
interface ShoppingEvents {
  'shopping:add': { item: string; timestamp: number };
}

// ============================================================================
// LISTA A: Input Bloqueante (Prompt - Padrão)
// ============================================================================
const ListaComprasA = () => {
  const { items, add, remove } = useList(["leite", "pão", "ovos"]);

  function handleAddItem() {
    const newItem = prompt("Digite o nome do novo item para Lista A:");
    if (newItem) add(newItem);
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
        <CheckSquare className="text-cyan-400" />
        <div>
           <h3 className="text-lg font-bold text-white">Lista A (Direta)</h3>
           <p className="text-xs text-gray-400">Fluxo simples com função direta.</p>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar mb-4">
        {items.map((item, index) => (
          <div key={item.id} className="group flex items-center justify-between p-3 bg-gray-900/50 rounded border border-gray-800">
             <span className="text-gray-300">{String(item.data)}</span>
             <button type="button" onClick={() => remove(index)} className="text-gray-600 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
             </button>
          </div>
        ))}
      </div>

      <button onClick={handleAddItem} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded transition-colors flex justify-center items-center gap-2">
        <Plus size={18} /> Adicionar
      </button>
    </div>
  );
};

// ============================================================================
// LISTA B: Input via Graph Bus (Desacoplado)
// ============================================================================
const ListaComprasB = () => {
  // 1. Hook de Lista (Estrutura Local)
  const { items, add, remove } = useList(["arroz", "feijão", "macarrão"]);
  
  // 2. Conexão com o Barramento de Eventos
  const { on, emit } = useGraphBus<ShoppingEvents>();

  // 3. INVERSÃO DE CONTROLE:
  // A lista fica "ouvindo" o evento, em vez de passar a função 'add' para o botão.
  React.useEffect(() => {
      const unsubscribe = on('shopping:add', (payload) => {
          console.log("Evento recebido via Graph:", payload);
          add(payload.item);
      });
      return unsubscribe;
  }, [add, on]); // 'add' e 'on' são estáveis

  function handleAddItem() {
    let tempValue = "";

    showModal({
      title: "Adicionar via Event Bus",
      content: (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nome do Item</label>
          <input
            autoFocus
            type="text"
            className="form-input w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-green-500 outline-none"
            placeholder="Ex: Azeite"
            onChange={(e) => { tempValue = e.target.value; }}
          />
          <div className="mt-3 p-2 bg-green-900/20 border border-green-900/50 rounded text-xs text-green-400 flex gap-2 items-center">
             <Zap size={14} />
             <span>Este modal não conhece a lista. Ele apenas emite um evento.</span>
          </div>
        </div>
      ),
      actions: ({ onClose }: any) => (
        <div className="flex justify-end gap-2 w-full">
            <button onClick={onClose} className="px-3 py-1 text-gray-400 hover:text-white">Cancelar</button>
            <button 
                onClick={() => {
                    if (tempValue.trim()) {
                        // 4. EMISSÃO DO EVENTO:
                        // Dispara 'shopping:add' para quem estiver ouvindo (Lista B)
                        emit('shopping:add', { item: tempValue, timestamp: Date.now() });
                        onClose();
                    } else {
                        alert("Digite um nome!");
                    }
                }}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 font-bold"
            >
                Emitir Evento
            </button>
        </div>
      )
    });
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
        <ShoppingCart className="text-green-400" />
        <div>
           <h3 className="text-lg font-bold text-white">Lista B (Graph Bus)</h3>
           <p className="text-xs text-gray-400">Reage ao evento <code>shopping:add</code></p>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar mb-4">
        {items.map((item, index) => (
          <div key={item.id} className="group flex items-center justify-between p-3 bg-gray-900/50 rounded border border-gray-800 animate-in slide-in-from-right-2">
             <span className="text-gray-300">{String(item.data)}</span>
             <button 
                type="button" 
                onClick={() => remove(index)}
                className="text-gray-600 hover:text-red-400 transition-colors"
             >
                <Trash2 size={16} />
             </button>
          </div>
        ))}
      </div>

      <button 
        onClick={handleAddItem} 
        className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded transition-colors flex justify-center items-center gap-2"
      >
        <Plus size={18} /> Abrir Emissor
      </button>
    </div>
  );
};

const TabEventBusForm: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-white mb-2">Padrões de Comunicação</h1>
          <p className="text-gray-400">
            Comparação entre controle direto e comunicação desacoplada via <strong>Graph Bus</strong>.
          </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]">
          <ListaComprasA />
          <ListaComprasB />
      </div>
    </div>
  );
};

export default TabEventBusForm;
