import React from 'react';
import { Check, Edit2, Package, Trash2, X } from 'lucide-react';

import { DataTable } from '../../../componentes/data-table';
import { toast } from '../../../componentes/toast';
import useList from '../../../hooks/list';
import useForm from '../../../hooks/use-form';
import { type TableColumn, useTable } from '../../../hooks/use-table';

interface IProduct {
  id?: string;
  name: string;
  price: number;
  stock: number;
}

const generateInitialData = () => [
  { id: '1', name: 'Teclado Mecânico', price: 250, stock: 10 },
  { id: '2', name: 'Mouse Gamer', price: 120, stock: 50 },
  { id: '3', name: 'Monitor 4K', price: 1500, stock: 5 },
];

const TableScrollCRUD = () => {
  const initialData = React.useMemo(() => generateInitialData(), []);
  const { items, remove, add, update } = useList<IProduct>(initialData);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const columns: TableColumn<IProduct>[] = [
    { id: 'name', header: 'Produto', width: '40%' },
    { id: 'price', header: 'Preço', width: '20%' },
    { id: 'stock', header: 'Estoque', width: '20%' },
    { id: 'actions', header: 'Ações', width: '20%', hideLabelOnStack: true },
  ];

  const table = useTable({
    data: items.map((i) => ({ ...i.data, id: i.id })),
    columns,
    responsiveMode: 'scroll',
  });

  const onSubmit = (formData: any) => {
    if (editingId) {
      const index = items.findIndex((i) => i.id === editingId);
      const editedItemData = formData.items?.[index];
      if (editedItemData) {
        update(editingId, {
          name: editedItemData.name,
          price: Number(editedItemData.price),
          stock: Number(editedItemData.stock),
        });
        toast.success('Produto atualizado!');
      }
    }
    setEditingId(null);
  };

  const { formProps, handleSubmit } = useForm({ id: 'inline-crud', onSubmit });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({ name: '', price: 0, stock: 0 });
    toast.info('Novo item adicionado.');
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    remove(id);
    toast.error('Item removido.');
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col transition-colors">
      <div className="flex justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-cyan-600 dark:text-cyan-400" />
            Estoque (Inline Edit)
          </h2>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded text-sm transition-colors font-bold shadow-sm flex items-center gap-2">
          + Novo Produto
        </button>
      </div>

      <form {...formProps} onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
        <DataTable.Root instance={table} className="h-full">
          <DataTable.Container>
            <DataTable.Table>
              <DataTable.Header>
                {table.columns.map((col) => (
                  <DataTable.HeadCell key={col.id}>{col.header}</DataTable.HeadCell>
                ))}
              </DataTable.Header>

              <DataTable.Body>
                {items.map((item, index) => {
                  const isEditing = editingId === item.id;
                  return (
                    <DataTable.Row key={item.id} className={isEditing ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                      <DataTable.Cell>
                        {isEditing ? (
                          <input
                            name={`items[${index}].name`}
                            defaultValue={item.data.name}
                            className="form-input h-8 text-sm"
                            autoFocus
                            required
                          />
                        ) : (
                          item.data.name || '(Sem nome)'
                        )}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        {isEditing ? (
                          <input
                            type="number"
                            name={`items[${index}].price`}
                            defaultValue={item.data.price}
                            className="form-input h-8 text-sm"
                          />
                        ) : (
                          `R$ ${Number(item.data.price).toFixed(2)}`
                        )}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        {isEditing ? (
                          <input
                            type="number"
                            name={`items[${index}].stock`}
                            defaultValue={item.data.stock}
                            className="form-input h-8 text-sm"
                          />
                        ) : (
                          item.data.stock
                        )}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="submit"
                                className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                                <Check size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={(e) => handleEdit(e, item.id)} className="p-1.5 text-blue-500 rounded">
                                <Edit2 size={16} />
                              </button>
                              <button type="button" onClick={(e) => handleDelete(e, item.id)} className="p-1.5 text-red-500 rounded">
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
            </DataTable.Table>
          </DataTable.Container>
        </DataTable.Root>
      </form>
    </div>
  );
};
export default TableScrollCRUD;
