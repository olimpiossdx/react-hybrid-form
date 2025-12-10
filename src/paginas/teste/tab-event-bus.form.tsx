import React from "react";
import useList from "../../hooks/list";
import showModal from "../../componentes/modal/hook";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useGraphBus } from "../../hooks/native-bus";

interface IBarramentoAeB {
  limparListB: { isResertOrFill: boolean };
}

const ListaComprasA = () => {
  const { emit } = useGraphBus<IBarramentoAeB>();
  const isResertOrFill = React.useRef(true);

  const { items, add } = useList(["leite", "pão", "ovos"]);

  function handleAddItem(_: React.MouseEvent<HTMLUListElement, MouseEvent>) {
    const newItem = prompt("Digite o nome do novo item:");

    if (newItem) {
      add(newItem);
    }
  };

  function handleLimparListaB(_: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    emit("limparListB", { isResertOrFill: isResertOrFill.current });
    isResertOrFill.current = !isResertOrFill.current;
  };

  return (<div>
    <div className="flex justify-between">
      <h1>Lista de Compras A</h1>
      <button
        onClick={handleLimparListaB}
        className="border border-red-50 bg-red-500 rounded p-0.5"
      >
        Limpar lista B
      </button>
    </div>
    <ul onClick={handleAddItem}>
      {items.map((item) => (
        <li key={item.id}>{item.data}</li>
      ))}
    </ul>
  </div>);
};

const ListaComprasB = () => {
  const { on } = useGraphBus<IBarramentoAeB>();
  const initial = ["arroz", "feijão", "macarrão"];
  const { items, add, remove, clear } = useList(initial);

  React.useEffect(() => {
    return on("limparListB", ({ isResertOrFill }) => {
      if (isResertOrFill) {
        clear();
      } else {
        add(initial);
      }
    });
  }, []);

  function handleAddItem(_: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    let newItem: string | undefined;
    showModal({
      title: "Adicionar Item",
      content: () => (
        <div>
          <input
            type="text"
            id="new-item"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Nome do item"
            onInput={(e) => (newItem = e.currentTarget.value)}
          />
        </div>
      ),
      actions: ({ onClose }: any) => {
        const handleAdd = () => {
          add(newItem);
          onClose();
        };
        return (
          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 border border-gray-600"
            >
              Salvar
            </button>
          </div>
        );
      },
    });
  }

  function handleRemoveItem(event: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const itemId = event.currentTarget.getAttribute("id");
    remove(itemId!);
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Lista de Compras B</h1>
        <button
          onClick={handleAddItem}
          className="px-3 py-1 text-sm bg-blue-900 text-blue-200 rounded hover:bg-blue-800 border border-blue-700 cursor-pointer flex items-center"
        >
          <PlusIcon className="inline-block w-4 h-4 mr-1" />
          Adicionar item
        </button>
      </div>
      <ul className="p-0.5">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between p-0.5">
            <span>{item.data}</span>
            <TrashIcon
              id={item.id}
              onClick={handleRemoveItem}
              className="inline-block w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const TabEventBusForm: React.FC = () => {
  return (
    <div>
      <h1>Tab Event Bus Form</h1>
      <p>This is a placeholder for the Tab Event Bus Form component.</p>
      <ListaComprasA />
      <ListaComprasB />
    </div>
  );
};

export default TabEventBusForm;
