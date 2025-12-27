import React from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';

import { DataTable } from '../../../componentes/data-table';

interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface IRowProductProps {
  item: { data: IProduct; id: string };
  index: number;
  isEditing: boolean;
  style: React.CSSProperties;
  onEdit: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onCancel: (e: React.MouseEvent) => void;
  // Não precisamos de onSave aqui porque o botão é type="submit" e o form pai captura
}

// O componente é memoizado: só renderiza se as props mudarem
const RowProduct = React.memo<IRowProductProps>(({ item, index, isEditing, style, onEdit, onDelete, onCancel }) => {
  // Log para validar a performance (só deve aparecer quando ESTA linha mudar)
  // console.log(`Render Row: ${item.id} - Editing: ${isEditing}`);

  return (
    <DataTable.Row style={style} className={isEditing ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
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
          <span className="font-medium text-gray-900 dark:text-white">{item.data.name || '(Sem nome)'}</span>
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
          <span className="text-gray-700 dark:text-gray-300">R$ {Number(item.data.price).toFixed(2)}</span>
        )}
      </DataTable.Cell>

      <DataTable.Cell columnIndex={2}>
        {isEditing ? (
          <input type="number" name={`items[${index}].stock`} defaultValue={item.data.stock} className="form-input h-8 text-sm" />
        ) : (
          <span
            className={`px-2 py-0.5 rounded text-xs border ${item.data.stock < 10 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
            {item.data.stock} un.
          </span>
        )}
      </DataTable.Cell>

      <DataTable.Cell columnIndex={3}>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                key="save"
                type="submit"
                className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 transition-colors"
                title="Salvar">
                <Check size={16} />
              </button>

              <button
                key="cancel"
                type="button"
                onClick={onCancel}
                className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors"
                title="Cancelar">
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                key="edit"
                type="button"
                onClick={(e) => onEdit(e, item.id)}
                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                title="Editar">
                <Edit2 size={16} />
              </button>

              <button
                key="delete"
                type="button"
                onClick={(e) => onDelete(e, item.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Excluir">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </DataTable.Cell>
    </DataTable.Row>
  );
});

export default RowProduct;
