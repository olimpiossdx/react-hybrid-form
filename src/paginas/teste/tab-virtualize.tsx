import { Database, ArrowDownUp, RotateCcw, Save, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import React, { useRef, useState, useMemo } from "react";
import { showModal } from "../../componentes/modal";
import { toast } from "../../componentes/toast";
import useList from "../../hooks/list";
import useForm from "../../hooks/use-form";
import { useVirtualizer } from "../../hooks/virtualize";

interface IBigDataItem {
  id: string;
  sku: string;
  label: string;
  stock: number;
  // Estado local de UI para expansão (não salvo no banco, mas afeta altura)
  isExpanded?: boolean;
  details?: string;
}

const TOTAL_ITEMS = 500000;

const VirtualListExample = () => {
  const { formProps, handleSubmit, resetSection } = useForm("virtual-form");

  // 1. ESTRUTURA
  const {
    items: listItems,
    remove: listRemove,
    replace: listReplace,
  } = useList(TOTAL_ITEMS);

  // 2. DADOS (Memória com dados variáveis)
  const dataStore = useRef<IBigDataItem[]>(
    Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
      id: `legacy-${i}`,
      sku: `PROD-${String(i + 1).padStart(6, "0")}`,
      label: `Item Comercial ${i + 1}`,
      stock: Math.floor(Math.random() * 500),
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      isExpanded: false,
    }))
  );

  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  // 3. VIRTUALIZER DINÂMICO
  const scrollRefProxy = useMemo(
    () => ({ current: scrollElement }),
    [scrollElement]
  ) as React.RefObject<HTMLDivElement>;

  const {
    virtualItems,
    scrollToIndex,
    measureElement,
    containerProps,
    wrapperProps,
  } = useVirtualizer({
    count: listItems.length,
    scrollRef: scrollRefProxy,
    estimateSize: () => 56, // Altura inicial estimada
    overscan: 5,
  });

  // Toggle de Expansão (Afeta altura)
  const toggleExpand = (index: number) => {
    const item = dataStore.current[index];
    item.isExpanded = !item.isExpanded;
    // Força re-render para o virtualizer detectar a mudança de tamanho
    setScrollElement((prev) => prev); // Hack simples para forçar update visual no exemplo
  };

  const handleRemove = (index: number) => {
    listRemove(index);
    dataStore.current.splice(index, 1);
    toast.info("Item removido.");
  };

  const handleReset = () => {
    resetSection("", null);
    dataStore.current = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
      id: `legacy-${i}`,
      sku: `PROD-${String(i + 1).padStart(6, "0")}`,
      label: `Item Comercial ${i + 1}`,
      stock: 0,
      isExpanded: false,
    }));
    listReplace(TOTAL_ITEMS);
    scrollToIndex(0);
    toast.info("Reset completo.");
  };

  const onSubmit = (formData: any) => {
    const payload = {
      batchInfo: formData,
      items: dataStore.current.slice(0, 5),
      totalCount: dataStore.current.length,
    };

    showModal({
      title: "Submit Big Data",
      size: "lg",
      content: () => (
        <pre className="text-xs bg-black p-4 rounded text-green-400 max-h-60 overflow-auto border border-gray-700">
          {JSON.stringify(payload, null, 2)}
        </pre>
      ),
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 h-[700px] flex flex-col resize-y overflow-hidden transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="text-purple-600 dark:text-purple-400" />{" "}
            Virtualização Dinâmica
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 font-mono">
              {listItems.length.toLocaleString()} Linhas
            </span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <ArrowDownUp size={10} /> Altura Variável Suportada
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            type="submit"
            form="virtual-form"
            className="px-4 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <Save size={14} /> Salvar
          </button>
        </div>
      </div>

      <form
        {...formProps}
        id="virtual-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-4 mb-4 shrink-0 bg-gray-50 dark:bg-gray-900/30 p-3 rounded border border-gray-200 dark:border-gray-700/50">
          <input
            name="batchName"
            className="form-input text-sm"
            required
            defaultValue="Lote-Dynamic"
          />
          <input
            name="manager"
            className="form-input text-sm"
            required
            placeholder="Responsável..."
          />
        </div>

        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-x border-t border-gray-200 dark:border-gray-700 rounded-t-lg shrink-0 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pr-6">
          <div className="col-span-1 text-right">#</div>
          <div className="col-span-1">Expand</div>
          <div className="col-span-2">SKU</div>
          <div className="col-span-4">Descrição</div>
          <div className="col-span-3 text-right">Estoque</div>
          <div className="col-span-1 text-center">Ação</div>
        </div>

        {/* CONTAINER VIRTUALIZADO (Prop Getters) */}
        <div
          ref={setScrollElement} // Callback Ref do React
          {...containerProps} // Props do hook (overflow, width)
          className="flex-1 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg bg-gray-50 dark:bg-gray-900/10 custom-scrollbar"
        >
          <div {...wrapperProps}>
            {" "}
            {/* Wrapper Fantasma */}
            {virtualItems.map((virtualRow) => {
              const itemStruct = listItems[virtualRow.index];
              const itemData = dataStore.current[virtualRow.index];

              if (!itemStruct || !itemData) return null;

              return (
                <div
                  key={itemStruct.id}
                  // REF DE MEDIÇÃO: Essencial para altura dinâmica
                  ref={measureElement}
                  data-index={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    // Nota: Não definimos height fixa aqui, deixamos o conteúdo empurrar
                    // O transform cuida do Y
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`
                                grid grid-cols-12 gap-4 px-4 border-b border-gray-200 dark:border-gray-800 transition-colors
                                ${itemData.isExpanded ? "bg-blue-50 dark:bg-blue-900/20 py-4 items-start" : "hover:bg-gray-100 dark:hover:bg-gray-800/50 h-14 items-center"}
                            `}
                >
                  <span className="col-span-1 text-gray-400 dark:text-gray-600 font-mono text-xs text-right pt-2">
                    {virtualRow.index + 1}
                  </span>

                  <div className="col-span-1 flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => toggleExpand(virtualRow.index)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                    >
                      {itemData.isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  <span className="col-span-2 text-cyan-600 dark:text-cyan-500 font-mono text-xs truncate pt-2">
                    {itemData.sku}
                  </span>

                  <div className="col-span-4">
                    <input
                      defaultValue={itemData.label}
                      onChange={(e) => {
                        dataStore.current[virtualRow.index].label =
                          e.target.value;
                      }}
                      className="w-full bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none focus:text-black dark:focus:text-white border-b border-transparent focus:border-purple-500 transition-colors"
                    />
                    {/* Conteúdo Expandido (Condicional) */}
                    {itemData.isExpanded && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <p className="font-bold mb-1">Detalhes Adicionais:</p>
                        <textarea
                          className="form-input w-full text-xs h-16"
                          defaultValue={itemData.details}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      defaultValue={itemData.stock}
                      onChange={(e) => {
                        dataStore.current[virtualRow.index].stock = Number(
                          e.target.value
                        );
                      }}
                      className={`w-full bg-white dark:bg-gray-800 text-right text-sm rounded px-2 py-1 outline-none focus:ring-1 border border-gray-200 dark:border-gray-700 ${itemData.stock < 0 ? "text-red-500 border-red-500" : "text-green-600 dark:text-green-400"}`}
                    />
                  </div>

                  <div className="col-span-1 text-center pt-1">
                    <button
                      type="button"
                      onClick={() => handleRemove(virtualRow.index)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
