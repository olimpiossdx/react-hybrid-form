import { Database, RotateCcw, Save } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import showModal from "../../componentes/modal/hook";
import { toast } from "../../componentes/toast";
import useForm from "../../hooks/use-form";
import { useVirtualizer } from "../../hooks/virtualize";

interface IBigDataItem {
  id: number;
  sku: string;
  label: string;
  stock: number;
}


const VirtualListExample = () => {
  const { formProps, handleSubmit, resetSection } = useForm("virtual-form");

  // Fonte da Verdade (Memória)
  const dataStore = useRef<IBigDataItem[]>(
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      sku: `PROD-${String(i + 1).padStart(5, '0')}`,
      label: `Item Comercial ${i + 1}`,
      stock: Math.floor(Math.random() * 500)
    }))
  );

  // 1. CORREÇÃO DE RENDERIZAÇÃO: Usar State em vez de Ref
  // Isso garante que o componente re-renderize assim que a DIV de scroll for montada no DOM.
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  // 2. CORREÇÃO DE TIPO E ESTABILIDADE
  // Criamos um objeto "falsa ref" que muda sempre que o scrollElement muda.
  // Isso força o useEffect dentro do useVirtualizer a rodar novamente e detectar a altura correta.
  // O cast 'as any' resolve o conflito estrito de tipos entre HTMLDivElement e HTMLElement no RefObject.
  const scrollRefProxy = useMemo(() => ({ current: scrollElement }), [scrollElement]);

  const { virtualItems, totalHeight } = useVirtualizer({
    count: dataStore.current.length,
    scrollRef: scrollRefProxy as any, // Cast necessário para satisfazer a assinatura estrita do hook
    estimateSize: () => 56,
    overscan: 5
  });

  const onSubmit = (formData: any) => {
    debugger;
    const payload = {
      batchInfo: formData,
      items: dataStore.current
    };

    showModal({
      title: "Processamento em Lote",
      content: () => (
        <div className="space-y-4">
          <p className="text-green-400 font-bold">
            Sucesso! {payload.items.length.toLocaleString()} itens processados.
          </p>
          <pre className="text-xs bg-black p-4 rounded text-gray-300 max-h-60 overflow-auto">
            {JSON.stringify(payload.items.slice(0, 3), null, 2)}
          </pre>
        </div>
      )
    });
  };

  const handleReset = () => {
    resetSection("", null);

    dataStore.current = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      sku: `PROD-${String(i + 1).padStart(5, '0')}`,
      label: `Item Comercial ${i + 1}`,
      stock: 0
    }));

    // Reseta a posição do scroll visualmente
    if (scrollElement) scrollElement.scrollTop = 0;
    toast.info("Dados resetados para zero.");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 h-[650px] flex flex-col">

      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="text-purple-400" /> Virtualização Híbrida
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded border border-purple-800">
              10.000 Itens
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleReset} className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600 flex items-center gap-2">
            <RotateCcw size={14} /> Reset
          </button>
          <button type="submit" form="virtual-form" className="px-4 py-1.5 text-xs bg-green-600 text-white font-bold rounded shadow-lg hover:bg-green-500 flex items-center gap-2 transition-transform active:scale-95">
            <Save size={14} /> Salvar Lote
          </button>
        </div>
      </div>

      <form {...formProps} id="virtual-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">

        <div className="grid grid-cols-2 gap-4 mb-4 shrink-0 bg-gray-900/30 p-3 rounded border border-gray-700/50">
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Identificação</label>
            <input name="batchName" className="w-full bg-gray-800 border-gray-600 rounded p-1.5 text-sm text-white focus:border-purple-500 outline-none" required defaultValue="Lote-2024-Q1" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Responsável</label>
            <input name="manager" className="w-full bg-gray-800 border-gray-600 rounded p-1.5 text-sm text-white focus:border-purple-500 outline-none" required placeholder="Nome..." />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-900 border-x border-t border-gray-700 rounded-t-lg shrink-0 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <div className="col-span-1 text-right">#</div>
          <div className="col-span-2">SKU</div>
          <div className="col-span-6">Descrição</div>
          <div className="col-span-3 text-right">Estoque</div>
        </div>

        {/* CONTAINER DE SCROLL COM CALLBACK REF */}
        <div
          ref={setScrollElement}
          className="flex-1 border-x border-b border-gray-700 rounded-b-lg bg-gray-900/10 overflow-y-auto relative custom-scrollbar"
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative', width: '100%' }}>
            {virtualItems.map((virtualRow) => {
              const item = dataStore.current[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                  className="grid grid-cols-12 gap-4 items-center px-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors h-56px"
                >
                  <span className="col-span-1 text-gray-600 font-mono text-xs text-right">
                    {virtualRow.index + 1}
                  </span>

                  <span className="col-span-2 text-cyan-500 font-mono text-xs truncate">
                    {item.sku}
                  </span>

                  <div className="col-span-6">
                    <input
                      defaultValue={item.label}
                      onChange={(e) => {
                        dataStore.current[virtualRow.index].label = e.target.value;
                      }}
                      className="w-full bg-transparent text-sm text-gray-300 outline-none focus:text-white border-b border-transparent focus:border-purple-500 transition-colors placeholder-gray-600"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      defaultValue={item.stock}
                      onChange={(e) => {
                        dataStore.current[virtualRow.index].stock = Number(e.target.value);
                      }}
                      className="w-full bg-gray-800 text-right text-sm text-green-400 rounded px-2 py-1 outline-none focus:ring-1 ring-green-500 border border-gray-700"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default VirtualListExample;