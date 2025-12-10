import React from "react";
import { Database, Save, RotateCcw, Trash2, ArrowDownUp } from "lucide-react";
import { toast } from "../../componentes/toast";
import useList from "../../hooks/list";
import useForm from "../../hooks/use-form";
import { useVirtualizer } from "../../hooks/virtualize";
import showModal from "../../componentes/modal/hook";

interface IBigDataItem {
  id: string;
  sku: string;
  label: string;
  stock: number;
};

const TabVirtualListExample = () => {
  const { formProps, handleSubmit, resetSection } = useForm("virtual-form");

  // 1. Lógica de Dados
  const { items: listItems, remove: listRemove, replace: listReplace } = useList(10000);

  const dataStore = React.useRef<IBigDataItem[]>(
    Array.from({ length: 10000 }, (_, i) => ({
      id: `legacy-${i}`,
      sku: `PROD-${String(i + 1).padStart(5, "0")}`,
      label: `Item Comercial ${i + 1}`,
      stock: Math.floor(Math.random() * 500),
    }))
  );

  // 2. VIRTUALIZAÇÃO (DX MELHORADA)
  // Não precisamos mais criar refs ou states manuais aqui. O hook entrega as props.
  const { virtualItems, containerProps, wrapperProps, scrollToIndex } =
    useVirtualizer({
      count: listItems.length,
      estimateSize: () => 56, // Altura da linha
      overscan: 5,
    });

  const handleRemove = (index: number) => {
    listRemove(index);
    dataStore.current.splice(index, 1);
    toast.info("Item removido");
  };

  const handleReset = () => {
    resetSection("", null);
    dataStore.current = Array.from({ length: 10000 }, (_, i) => ({
      id: `legacy-${i}`,
      sku: `PROD-${String(i + 1).padStart(5, "0")}`,
      label: `Item Comercial ${i + 1}`,
      stock: 0,
    }));
    listReplace(10000);
    scrollToIndex(0); // Usa o helper do hook
    toast.info("Dados resetados.");
  };

  function handleChangeDescricao(event: React.ChangeEvent<HTMLInputElement>) {
    const itemID = parseInt(event.target.getAttribute('itemID') ?? '');

    if (Number.NaN != itemID) {
      toast.warning("Não foi possível alterar descrição, tente outro momento.")
      return;
    }

    dataStore.current[itemID].label = event.target.value;
  }

  const onSubmit = (formData: any) => {
    const payload = {
      batchInfo: formData,
      items: dataStore.current.slice(0, 5),
    };
    showModal({
      title: "Submit (Amostra)",
      content: () => (
        <pre className="text-xs bg-black p-4 text-green-400">
          {JSON.stringify(payload, null, 2)}
        </pre>
      ),
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 h-[650px] flex flex-col resize-y overflow-hidden">
      {/* Header (Mantido igual) */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="text-purple-400" /> Virtualização Híbrida
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded border border-purple-800">
              {listItems.length.toLocaleString()} Itens
            </span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <ArrowDownUp size={10} /> Auto-Resize
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600 flex items-center gap-2"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            type="submit"
            form="virtual-form"
            className="px-4 py-1.5 text-xs bg-green-600 text-white font-bold rounded shadow-lg hover:bg-green-500 flex items-center gap-2 transition-transform active:scale-95"
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
        {/* Campos Fixos */}
        <div className="grid grid-cols-2 gap-4 mb-4 shrink-0 bg-gray-900/30 p-3 rounded border border-gray-700/50">
          <input
            name="batchName"
            className="w-full bg-gray-800 border-gray-600 rounded p-1.5 text-sm text-white"
            defaultValue="Lote-2024-Q1"
          />
          <input
            name="manager"
            className="w-full bg-gray-800 border-gray-600 rounded p-1.5 text-sm text-white"
            placeholder="Responsável..."
            required
          />
        </div>

        {/* Header da Tabela */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-900 border-x border-t border-gray-700 rounded-t-lg shrink-0 text-xs font-bold text-gray-400 uppercase">
          <div className="col-span-1 text-right">#</div>
          <div className="col-span-2">SKU</div>
          <div className="col-span-6">Descrição</div>
          <div className="col-span-3 text-right">Estoque</div>
        </div>

        {/* --- ÁREA VIRTUALIZADA (LIMPA) --- */}
        <div
          {...containerProps} // Injeta ref, onScroll e overflow
          className="flex-1 border-x border-b border-gray-700 rounded-b-lg bg-gray-900/10 custom-scrollbar"
        >
          {/* Injeta height total e relative */}
          <div {...wrapperProps}>
            {virtualItems.map((virtualRow) => {
              const itemStruct = listItems[virtualRow.index];
              const itemData = dataStore.current[virtualRow.index];
              if (!itemStruct || !itemData) {
                return null;
              };

              // Injeta position: absolute, top, height automaticamente
              return (<div key={itemStruct.id} {...virtualRow.props}
                className="grid grid-cols-12 gap-4 items-center px-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                {/* Conteúdo da linha (Mantido igual) */}
                <span className="col-span-1 text-gray-600 font-mono text-xs text-right">
                  {virtualRow.index + 1}
                </span>
                <span className="col-span-2 text-cyan-500 font-mono text-xs truncate">
                  {itemData.sku}
                </span>
                <div className="col-span-6">
                  <input
                    defaultValue={itemData.label}
                    itemID={`${virtualRow.index}`}
                    onChange={handleChangeDescricao}
                    className="w-full bg-transparent text-sm text-gray-300 outline-none focus:text-white border-b border-transparent focus:border-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    defaultValue={itemData.stock}
                    onChange={(e) => {
                      dataStore.current[virtualRow.index].stock = Number(
                        e.target.value
                      );
                    }}
                    className={`w-full bg-gray-800 text-right text-sm rounded px-2 py-1 outline-none focus:ring-1 border border-gray-700 ${itemData.stock < 0 ? "text-red-400" : "text-green-400"}`}
                  />
                </div>
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(virtualRow.index)}
                    className="text-gray-600 hover:text-red-400"
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

export default TabVirtualListExample;
