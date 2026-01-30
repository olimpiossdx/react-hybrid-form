import React from 'react';
import { CornerDownRight, FileJson, FolderTree, Plus, Save, Trash2 } from 'lucide-react';

import showModal from './modal/hook';
import useList from '../hooks/list';
import useForm from '../hooks/use-form';

// Tipagem Recursiva
interface CategoryNode {
  name: string;
  subcategories: CategoryNode[];
}

interface FormValues {
  taxonomy: CategoryNode[];
}

// --- COMPONENTE RECURSIVO (O Nó da Árvore) ---
interface CategoryItemProps {
  prefix: string; // Caminho atual (ex: taxonomy[0].subcategories[2])
  onDelete?: () => void;
  level?: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ prefix, onDelete, level = 0 }) => {
  // Cada nó gerencia sua própria lista de filhos estruturalmente
  const { items, add, removeAt } = useList<CategoryNode>(0);

  return (
    <div className={`relative pl-4 sm:pl-6 ${level > 0 ? 'border-l border-gray-200 dark:border-gray-700 ml-2' : ''} transition-colors`}>
      {/* Linha do Item Atual */}
      <div className="flex flex-wrap items-center gap-2 mb-3 group">
        <CornerDownRight size={16} className="text-gray-400 dark:text-gray-500" />

        <input name={`${prefix}.name`} className="form-input w-48 sm:w-64" placeholder="Nome da Categoria" required />

        {/* Ações (Aparecem no Hover ou Foco) */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => add()}
            className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800"
            title="Adicionar Subcategoria">
            <Plus size={14} />
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-200 dark:border-red-800"
              title="Remover esta categoria">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Renderização Recursiva dos Filhos */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <CategoryItem
            key={item._internalId}
            // Constrói o caminho profundo dinamicamente
            prefix={`${prefix}.subcategories[${index}]`}
            onDelete={() => removeAt(index)}
            level={level + 1}
          />
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const NestedLevelForm = () => {
  const onSubmit = (data: FormValues) => {
    showModal({
      title: 'Taxonomia Gerada',
      size: 'lg',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <FileJson size={20} />
            <span className="font-bold">Estrutura JSON Resultante</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            O <code>useForm</code> percorreu a árvore DOM recursiva e montou este objeto automaticamente:
          </p>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-700 overflow-auto max-h-[60vh] text-gray-800 dark:text-gray-300 font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps } = useForm<FormValues>({
    id: 'fractal-form',
    onSubmit,
  });

  // Lista Raiz (Começa com 1 item)
  const { items, add, removeAt } = useList<CategoryNode>(1);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-4xl mx-auto">
      <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cyan-400 flex items-center gap-2">
            <FolderTree className="w-6 h-6" />
            Taxonomia Fractal
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Formulário recursivo infinito. Cada nó gerencia seus próprios filhos estruturalmente.
          </p>
        </div>
        <button
          type="button"
          onClick={() => add()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <Plus size={14} /> Nova Raiz
        </button>
      </div>

      <form {...formProps} className="space-y-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <CategoryItem key={item._internalId} prefix={`taxonomy[${index}]`} onDelete={() => removeAt(index)} />
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-8 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg transition-transform active:scale-95">
            <Save size={18} /> Salvar Estrutura
          </button>
        </div>
      </form>
    </div>
  );
};

export default NestedLevelForm;
