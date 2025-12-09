import React, { useMemo, useRef, useState } from "react";
import { Database, RotateCcw, Save } from "lucide-react";
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

  // Helper para gerar os dados originais (Single Source of Truth)
  const generateData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      sku: `PROD-${String(i + 1).padStart(5, '0')}`,
      label: `Item Comercial ${i + 1}`,
      stock: 0 // Valor inicial zero
    }));


  // 1. MEMÓRIA: Dados mutáveis de alta performance
  const dataStore = useRef<IBigDataItem[]>(generateData(10000));

  // 2. VERSIONAMENTO: Controla o ciclo de vida visual da lista
  // Toda vez que isso mudar, a lista virtual é destruída e recriada
  const [dataVersion, setDataVersion] = useState(0);

  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const scrollRefProxy = useMemo(() => ({ current: scrollElement }), [scrollElement]);

  const { virtualItems, totalHeight } = useVirtualizer({
    count: dataStore.current.length,
    scrollRef: scrollRefProxy as any,
    estimateSize: () => 56,
    overscan: 5
  });

  const onSubmit = (formData: any) => {
    const payload = {
      batchInfo: formData,
      items: dataStore.current
    };

    // Validação visual simples: Conta quantos itens têm estoque > 0
    const changedCount = dataStore.current.filter(i => i.stock > 0).length;

    showModal({
      title: "Processamento em Lote",
      content: () => (
        <div className="space-y-4">
          <p className="text-green-400 font-bold">
            Sucesso! Total: {payload.items.length.toLocaleString()} | Alterados: {changedCount}
          </p>
          <pre className="text-xs bg-black p-4 rounded text-gray-300 max-h-60 overflow-auto border border-gray-700">
            {/* Mostra itens que realmente mudaram para provar que a memória está funcionando */}
            {JSON.stringify(dataStore.current.filter(i => i.stock > 0).slice(0, 5), null, 2)}
          </pre>
        </div>
      )
    });
  };

  const handleReset = () => {
    // A. Reseta Header (Campos normais do DOM)
    resetSection("", null);

    // B. Reseta Memória (Dados invisíveis e visíveis)
    // Restauramos o array original
    dataStore.current = generateData(10000);

    // C. Reseta Visual (Força Remount)
    // Ao mudar a key, o React joga fora os inputs sujos e cria novos.
    // Os novos inputs leem o defaultValue da memória (que acabamos de limpar no passo B).
    setDataVersion(prev => prev + 1);

    // Opcional: Volta o scroll para o topo
    if (scrollElement) scrollElement.scrollTop = 0;

    toast.info("Todos os 10.000 itens foram resetados.");
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
            <span className="text-xs text-gray-400">
              Edição Direta em Memória + Reset Total
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

        {/* CONTAINER DE SCROLL */}
        <div
          ref={setScrollElement}
          className="flex-1 border-x border-b border-gray-700 rounded-b-lg bg-gray-900/10 overflow-y-auto relative custom-scrollbar"
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative', width: '100%' }}>
            {/* A KEY MÁGICA: `dataVersion`. 
                   Quando ela muda (no reset), o React desmonta tudo aqui dentro e remonta.
                   Os novos inputs leem o `defaultValue` fresco do `dataStore.current`.
                */}
            <React.Fragment key={dataVersion}>
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
                          // Atualização Atômica na Memória
                          dataStore.current[virtualRow.index].label = e.target.value;
                        }}
                        className="w-full bg-transparent text-sm text-gray-300 outline-none focus:text-white border-b border-transparent focus:border-purple-500 transition-colors placeholder-gray-600"
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        // IMPORTANTE: defaultValue lê da memória. 
                        // Se resetamos a memória e remontamos o componente, ele lê o zero.
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
            </React.Fragment>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VirtualListExample;