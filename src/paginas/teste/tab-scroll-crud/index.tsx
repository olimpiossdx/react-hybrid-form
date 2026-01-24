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

  const { formProps } = useForm({ id: 'inline-crud', onSubmit });

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="text-blue-600" />
          <h2 className="text-xl font-semibold">Estoque (Inline Edit)</h2>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600 text-white text-sm">
          + Novo Produto
        </button>
      </div>
      <form {...formProps} id="inline-crud" className="flex-1 overflow-hidden">
        <DataTable.Root instance={table} className="h-full">
          <div className="w-full flex flex-col h-full">
            <DataTable.Container>
              <DataTable.Table>
                <DataTable.Header>
                  <DataTable.Row>
                    {table.columns.map((col) => (
                      <DataTable.HeadCell key={col.id} style={{ width: col.width }}>
                        {col.header}
                      </DataTable.HeadCell>
                    ))}
                  </DataTable.Row>
                </DataTable.Header>

                <DataTable.Body>
                  {items.map((item, index) => {
                    const isEditing = editingId === item.id;

                    return (
                      <DataTable.Row key={item.id}>
                        {/* Produto */}
                        <DataTable.Cell>
                          {isEditing ? (
                            <input
                              name={`items[${index}].name`}
                              defaultValue={item.data.name}
                              className="w-full px-2 py-1 text-sm border rounded"
                            />
                          ) : (
                            item.data.name || '(Sem nome)'
                          )}
                        </DataTable.Cell>

                        {/* Preço */}
                        <DataTable.Cell>
                          {isEditing ? (
                            <input
                              name={`items[${index}].price`}
                              defaultValue={item.data.price}
                              type="number"
                              step="0.01"
                              className="w-full px-2 py-1 text-sm border rounded"
                            />
                          ) : (
                            `R$ ${Number(item.data.price).toFixed(2)}`
                          )}
                        </DataTable.Cell>

                        {/* Estoque */}
                        <DataTable.Cell>
                          {isEditing ? (
                            <input
                              name={`items[${index}].stock`}
                              defaultValue={item.data.stock}
                              type="number"
                              className="w-full px-2 py-1 text-sm border rounded"
                            />
                          ) : (
                            item.data.stock
                          )}
                        </DataTable.Cell>

                        {/* Ações */}
                        <DataTable.Cell className="text-right">
                          {isEditing ? (
                            <>
                              <button type="submit" className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Salvar">
                                <Check size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="p-1.5 text-gray-500 hover:bg-gray-50 rounded"
                                title="Cancelar">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={(e) => handleEdit(e, item.id)}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                                title="Editar">
                                <Edit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDelete(e, item.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Excluir">
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </DataTable.Cell>
                      </DataTable.Row>
                    );
                  })}
                </DataTable.Body>
              </DataTable.Table>
            </DataTable.Container>
          </div>
        </DataTable.Root>
      </form>
    </div>
  );
};
export default TableScrollCRUD;
