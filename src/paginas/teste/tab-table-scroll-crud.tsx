import React from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';
import { showModal } from '../../componentes/modal';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';
import useTable, { type TableColumn } from '../../hooks/use-table';
import { DataTable } from '../../componentes/data-table';

interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
}

const TabTableScrollCRUD: React.FC = () => {
  const { items, remove, add } = useList<Product>([
    { name: 'Teclado Mecânico', price: 250, stock: 10 },
    { name: 'Mouse Gamer', price: 120, stock: 50 },
    { name: 'Monitor 4K', price: 1500, stock: 5 },
  ]);

  // Controla qual ID está sendo editado
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const columns: TableColumn<Product>[] = [
    { id: 'name', header: 'Produto', width: '40%' },
    { id: 'price', header: 'Preço', width: '20%' },
    { id: 'stock', header: 'Estoque', width: '20%' },
    { id: 'actions', header: 'Ações', width: '20%', hideLabelOnStack: true }
  ];

  const table = useTable({ data: items.map(i => ({ ...i.data, id: i.id })), columns, responsiveMode: 'scroll' });

  const onSubmit = (_: any) => {
    // Aqui capturamos os dados do formulário todo
    // Em um cenário real, você filtraria apenas o item editado ou enviaria o batch
    showModal({
      title: "Alterações Salvas",
      size: 'sm',
      content: <div className="text-gray-300">O produto foi atualizado com sucesso.</div>,
      actions: ({ onClose }: any) => <button onClick={onClose} className="bg-green-600 text-white px-4 py-2 rounded">OK</button>
    });
    setEditingId(null);
  };

  const { formProps, handleSubmit } = useForm({
    id: "inline-crud",
    onSubmit
  });

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col transition-colors">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Estoque (Inline Edit)</h2>
        <button
          type="button"
          onClick={() => add({ name: '', price: 0, stock: 0 })}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          + Novo Produto
        </button>
      </div>

      <form {...formProps} onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
        <DataTable.Root instance={table} className="h-full">
          <DataTable.Header>
            {table.columns.map(col => <DataTable.HeadCell key={col.id}>{col.header}</DataTable.HeadCell>)}
          </DataTable.Header>

          <DataTable.Body>
            {items.map((item, index) => {
              const isEditing = editingId === item.id;
              return (
                <DataTable.Row key={item.id} className={isEditing ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>

                  <DataTable.Cell columnIndex={0}>
                    {isEditing ? (
                      <input
                        name={`items[${index}].name`}
                        defaultValue={item.data.name}
                        className="form-input h-8 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">{item.data.name || "Novo Item"}</span>
                    )}
                  </DataTable.Cell>

                  <DataTable.Cell columnIndex={1}>
                    {isEditing ? (
                      <input
                        type="number"
                        name={`items[${index}].price`}
                        defaultValue={item.data.price}
                        className="form-input h-8 text-sm"
                      />
                    ) : (
                      <span>R$ {item.data.price}</span>
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
                      <span className={`px-2 py-0.5 rounded text-xs ${item.data.stock < 10 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        {item.data.stock} un.
                      </span>
                    )}
                  </DataTable.Cell>

                  <DataTable.Cell columnIndex={3}>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          {/* Botão de Salvar (Submit do Form) */}
                          <button type="submit" className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50">
                            <Check size={16} />
                          </button>
                          {/* Botão Cancelar (Type Button) */}
                          <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => setEditingId(item.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                            <Edit2 size={16} />
                          </button>
                          <button type="button" onClick={() => remove(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
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
        </DataTable.Root>
      </form>
    </div>
  );
};

export default TabTableScrollCRUD;