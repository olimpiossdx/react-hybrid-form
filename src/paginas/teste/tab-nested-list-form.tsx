import React, { useEffect, useState } from 'react';
import { Layers, Package, Plus, RotateCcw, Save, ShoppingBag, Tag } from 'lucide-react';

import showModal from '../../componentes/modal/hook';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';

// --- TIPOS ---
interface IProduct {
  name: string;
  stock: number;
  price: number;
}

interface ICategory {
  name: string;
  active: boolean;
  products: IProduct[];
}

interface IInventoryForm {
  storeName: string;
  categories: ICategory[];
}

// --- MOCK DATA ---
const MOCK_INVENTORY: IInventoryForm = {
  storeName: 'Supermercado Central',
  categories: [
    {
      name: 'Bebidas',
      active: true,
      products: [
        { name: 'Refrigerante Cola', stock: 100, price: 5.5 },
        { name: 'Suco de Laranja', stock: 50, price: 8.9 },
      ],
    },
    {
      name: 'Padaria',
      active: true,
      products: [
        { name: 'Pão Francês', stock: 500, price: 0.8 },
        { name: 'Bolo de Cenoura', stock: 10, price: 25.0 },
      ],
    },
  ],
};

const EMPTY_INVENTORY: IInventoryForm = {
  storeName: '',
  categories: [],
};

// --- SUB-COMPONENTE: PRODUTOS (NÍVEL 2) ---
const ProductList: React.FC<{
  categoryIndex: number;
  initialProducts?: IProduct[];
}> = ({ categoryIndex, initialProducts = [] }) => {
  // Hook useList aninhado: Gerencia a lista de produtos desta categoria específica
  const { items, add, remove } = useList<IProduct>(initialProducts);

  return (
    <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold flex items-center gap-2">
          <Package size={14} /> Produtos ({items.length})
        </h4>
        <button
          type="button"
          onClick={() => add()}
          className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1">
          <Plus size={10} /> Add Produto
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center animate-in fade-in slide-in-from-left-1">
            <div className="col-span-5">
              <input
                name={`categories[${categoryIndex}].products[${index}].name`}
                defaultValue={item.data.name}
                placeholder="Nome do Produto"
                className="form-input text-xs"
                required
              />
            </div>
            <div className="col-span-3">
              <input
                type="number"
                name={`categories[${categoryIndex}].products[${index}].stock`}
                defaultValue={item.data.stock}
                placeholder="Qtd"
                className="form-input text-xs"
              />
            </div>
            <div className="col-span-3">
              <input
                type="number"
                step="0.01"
                name={`categories[${categoryIndex}].products[${index}].price`}
                defaultValue={item.data.price}
                placeholder="R$"
                className="form-input text-xs"
                required
              />
            </div>
            <div className="col-span-1 text-center">
              <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                ✕
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && <div className="text-[10px] text-gray-400 italic py-1">Nenhum produto nesta categoria.</div>}
      </div>
    </div>
  );
};

// --- COMPONENTE PAI ---
const NestedListForm = () => {
  const onSubmit = (data: IInventoryForm) => {
    showModal({
      title: 'Inventário Salvo',
      size: 'sm',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
            <ShoppingBag size={20} />
            <span>Dados hierárquicos processados.</span>
          </div>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-700 overflow-auto text-gray-700 dark:text-gray-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps, resetSection, setValidators } = useForm<IInventoryForm>({
    id: 'nested-list-form',
    onSubmit,
  });

  // Estados Data-Driven
  const [formData, setFormData] = useState<IInventoryForm>(EMPTY_INVENTORY);
  const [mode, setMode] = useState<'novo' | 'editando'>('novo');

  // Hook useList Raiz: Gerencia as Categorias
  // Adicionado 'replace' para atualizar a lista programaticamente
  const { items, add, remove, replace } = useList<ICategory>(formData.categories);

  // --- VALIDAÇÃO ---
  useEffect(() => {
    setValidators({
      // Validação de Estoque Mínimo (Exemplo de lógica em lista aninhada)
      validarEstoque: (val: number) => {
        if (Number(val) < 0) {
          return { message: 'Estoque inválido', type: 'error' };
        }
        if (Number(val) < 10) {
          return { message: 'Estoque baixo!', type: 'warning' };
        }
      },
    });
  }, [setValidators]);

  // --- HANDLERS ---
  const handleLoadData = () => {
    setMode('editando');
    setFormData(MOCK_INVENTORY);

    // 1. CORREÇÃO: Força a atualização da estrutura da lista (useList)
    // Como o useList não reage mais a mudanças de props (para evitar loop),
    // precisamos avisar explicitamente: "Ei, os dados mudaram, reconstrua a lista!"
    replace(MOCK_INVENTORY.categories);

    // 2. Sincronia DOM fina (Preenche inputs simples como storeName)
    setTimeout(() => {
      resetSection('', MOCK_INVENTORY);
    }, 50);
  };

  const handleReset = () => {
    setMode('novo');
    setFormData(EMPTY_INVENTORY);

    // Limpa a lista estrutural
    replace([]);

    setTimeout(() => resetSection('', null), 50);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cyan-400 flex items-center gap-2">
            <Layers size={24} />
            Inventário (Nested)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Demonstração de <code>useList</code> dentro de <code>useList</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLoadData}
            className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            📥 Carregar Mock
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            ↺ Limpar
          </button>
        </div>
      </div>

      {/* KEY para forçar remontagem limpa ao trocar dados base */}
      <form {...formProps} key={mode === 'editando' ? 'loaded' : 'empty'}>
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Nome da Loja</label>
          <input name="storeName" defaultValue={formData.storeName} className="form-input" required />
        </div>

        {/* LISTA DE CATEGORIAS (NÍVEL 1) */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Categorias</h3>
            <button
              type="button"
              onClick={() => add()}
              className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded shadow-sm flex items-center gap-1 transition-colors">
              <Plus size={14} /> Nova Categoria
            </button>
          </div>

          {items.map((catItem, index) => (
            <div
              key={catItem.id}
              className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 relative group animate-in fade-in slide-in-from-bottom-2">
              {/* Cabeçalho da Categoria */}
              <div className="flex gap-4 items-center mb-2">
                <div className="grow">
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                      name={`categories[${index}].name`}
                      defaultValue={catItem.data.name}
                      placeholder="Nome da Categoria (ex: Limpeza)"
                      className="form-input pl-9 font-bold"
                      required
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name={`categories[${index}].active`}
                    defaultChecked={catItem.data.active !== false} // Default true
                    className="rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500"
                  />
                  Ativo
                </label>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2"
                  title="Remover Categoria">
                  <RotateCcw className="rotate-45" size={18} />
                </button>
              </div>

              {/* LISTA DE PRODUTOS (NÍVEL 2) */}
              {/* Passamos os produtos desta categoria específica para o sub-componente */}
              <ProductList categoryIndex={index} initialProducts={catItem.data.products} />
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400">
              <p>Nenhuma categoria cadastrada.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95">
            <Save size={18} /> Salvar Inventário
          </button>
        </div>
      </form>
    </div>
  );
};

export default NestedListForm;
