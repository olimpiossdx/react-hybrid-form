import React from "react";
import { Check, X, Edit2, Trash2, Package } from "lucide-react";
import { DataTable } from "../../../componentes/data-table";
import { showModal } from "../../../componentes/modal";
import { toast } from "../../../componentes/toast";
import useList from "../../../hooks/list";
import useForm from "../../../hooks/use-form";
import useTable, { type TableColumn } from "../../../hooks/use-table";

interface IProduct {
  id?: string;
  name: string;
  price: number;
  stock: number;
}

const TabTableScrollCRUD = () => {
  // Mock Data Estável
  const generateInitialData = () => [
    { id: "1", name: "Teclado Mecânico", price: 250, stock: 10 },
    { id: "2", name: "Mouse Gamer", price: 120, stock: 50 },
    { id: "3", name: "Monitor 4K", price: 1500, stock: 5 },
  ];

  // 1. Dados (useList gera IDs únicos automaticamente se não vierem no dado)
  const initialData = React.useMemo(() => generateInitialData(), []);
  const { items, remove, add, update } = useList<IProduct>(initialData);

  const [editingId, setEditingId] = React.useState<string | null>(null);

  const columns: TableColumn<IProduct>[] = [
    { id: "name", header: "Produto", width: "40%" },
    { id: "price", header: "Preço", width: "20%" },
    { id: "stock", header: "Estoque", width: "20%" },
    { id: "actions", header: "Ações", width: "20%", hideLabelOnStack: true },
  ];

  // Mapeia os dados do useList para a estrutura da tabela
  const tableData = React.useMemo(
    () => items.map((i) => ({ ...i.data, id: i.id })),
    [items]
  );

  const table = useTable({
    data: tableData,
    columns,
    responsiveMode: "scroll",
  });

  const onSubmit = (data: { items: IProduct[] }) => {
    // 1. Encontra o índice real do item sendo editado na lista
    const index = items.findIndex((i) => i.id === editingId);

    if (index === -1) {
      toast.error("Erro ao salvar: item não encontrado.");
      return;
    }

    // 2. Acessa o dado do formulário usando o índice
    // O useForm retorna um array onde apenas o índice editado tem dados
    const itemData = data.items?.[index];

    if (itemData) {
      // 3. Atualiza a memória (Persistência)
      update(editingId!, {
        name: itemData.name,
        price: Number(itemData.price),
        stock: Number(itemData.stock),
      });

      showModal({
        title: "Sucesso",
        size: "sm",
        content: (
          <div className="text-gray-600 dark:text-gray-300">
            Produto <strong>{itemData.name}</strong> atualizado.
          </div>
        ),
        actions: ({ onClose }: any) => (
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-4 py-2 rounded font-bold"
          >
            OK
          </button>
        ),
      });
    }

    setEditingId(null);
  };

  const { formProps, handleSubmit } = useForm({ id: "inline-crud", onSubmit });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne submit
    e.stopPropagation();
    add({ name: "", price: 0, stock: 0 });
    toast.info("Novo item adicionado. Clique no lápis para editar.");
  };

  // Handlers seguros para evitar propagação de eventos
  const handleEditClick = (_: React.MouseEvent, id: string) => {
    setEditingId(id);
  };

  const handleDeleteClick = (_: React.MouseEvent, id: string) => {
    remove(id);
    toast.error("Item removido.");
  };

  const handleCancelClick = (_: React.MouseEvent) => {
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col transition-colors">
      <div className="flex justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-cyan-600 dark:text-cyan-400" />
            Estoque (Inline Edit)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Edição linha a linha com validação.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded text-sm transition-colors font-bold shadow-sm flex items-center gap-2"
        >
          + Novo Produto
        </button>
      </div>

      <form
        {...formProps}
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 overflow-hidden flex flex-col"
      >
        <DataTable.Root instance={table} className="h-full">
          <DataTable.Header>
            {table.columns.map((col) => (
              <DataTable.HeadCell key={col.id}>{col.header}</DataTable.HeadCell>
            ))}
          </DataTable.Header>

          <DataTable.Body>
            {items.map((item, index) => {
              const isEditing = editingId === item.id;
              return (
                <DataTable.Row
                  key={item.id}
                  className={isEditing ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                >
                  <DataTable.Cell columnIndex={0}>
                    {isEditing ? (
                      <input
                        name={`items[${index}].name`}
                        defaultValue={item.data.name}
                        className="form-input h-8 text-sm"
                        autoFocus
                        placeholder="Nome do produto"
                        required
                      />
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.data.name || "(Sem nome)"}
                      </span>
                    )}
                  </DataTable.Cell>

                  <DataTable.Cell columnIndex={1}>
                    {isEditing ? (
                      <input
                        type="number"
                        name={`items[${index}].price`}
                        defaultValue={item.data.price}
                        className="form-input h-8 text-sm"
                        placeholder="0.00"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">
                        R$ {Number(item.data.price).toFixed(2)}
                      </span>
                    )}
                  </DataTable.Cell>

                  <DataTable.Cell columnIndex={2}>
                    {isEditing ? (
                      <input
                        type="number"
                        name={`items[${index}].stock`}
                        defaultValue={item.data.stock}
                        className="form-input h-8 text-sm"
                      />
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded text-xs border ${item.data.stock < 10 ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"}`}
                      >
                        {item.data.stock} un.
                      </span>
                    )}
                  </DataTable.Cell>

                  <DataTable.Cell columnIndex={3}>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          {/* Botão Salvar: Único submit do form */}
                          <button
                            key='save'
                            type="submit"
                            className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 transition-colors"
                            title="Salvar"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelClick}
                            className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors"
                            title="Cancelar"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={(e) => handleEditClick(e, item.id)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable.Body>

          <DataTable.Footer>
            <DataTable.Row>
              <DataTable.Cell>Total: {items.length}</DataTable.Cell>
              <DataTable.Cell>{/* Vazio */}</DataTable.Cell>
              <DataTable.Cell>
                <span className="font-mono text-gray-900 dark:text-white font-bold">
                  R${" "}
                  {items
                    .reduce(
                      (acc, i) =>
                        acc + Number(i.data.price) * Number(i.data.stock),
                      0
                    )
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </DataTable.Cell>
              <DataTable.Cell>{/* Vazio */}</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Footer>
        </DataTable.Root>
      </form>
    </div>
  );
};

export default TabTableScrollCRUD;
