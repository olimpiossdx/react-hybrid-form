import React from 'react';
import { CheckSquare, Package, Plus, ShoppingCart, Tag, Trash2 } from 'lucide-react';

import showModal from '../../componentes/modal/hook';
import { toast } from '../../componentes/toast';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';

// --- TIPOS ---
interface ISimpleTask {
  description: string;
  done: boolean;
}

interface IProduct {
  name: string;
  quantity: number;
  category: string;
}

// ============================================================================
// PADRÃO 1: INLINE ENTRY (Rápido, Síncrono)
// ============================================================================
const QuickList = () => {
  // 1. Hook de Lista (Estrutura)
  const { items, add, remove } = useList<ISimpleTask>([
    { description: 'Revisar PRs', done: true },
    { description: 'Daily Meeting', done: false },
  ]);

  // Handler estável para adicionar tarefa
  const handleQuickAdd = React.useCallback(
    (data: { newTask: string }) => {
      // Dupla verificação (trim)
      if (!data.newTask || data.newTask.trim() === '') {
        toast.warning('Digite uma descrição para a tarefa.');
        return;
      }

      // Adiciona na lista
      add({ description: data.newTask, done: false });
      toast.success('Tarefa adicionada!');

      // Limpa o input e mantém o foco (comportamento padrão do resetSection em inputs focados)
      resetSection('', { newTask: '' });
    },
    [add],
  );

  // 2. Hook de Formulário
  const { formProps, resetSection, setValidators } = useForm<{
    newTask: string;
  }>({ id: 'quick-add-form', onSubmit: handleQuickAdd });

  // Validação Customizada (Garante que espaços em branco não passem)
  React.useEffect(() => {
    setValidators({
      validarTarefa: (val: string) => {
        if (!val || val.trim().length === 0) {
          return { message: 'A descrição é obrigatória.', type: 'error' };
        }
        if (val.trim().length < 3) {
          return { message: 'Mínimo 3 caracteres.', type: 'warning' };
        }
      },
    });
  }, [setValidators]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col transition-colors shadow-lg">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <CheckSquare className="text-cyan-600 dark:text-cyan-400" />
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tarefas Rápidas</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Padrão Inline (Enter para adicionar)</p>
        </div>
      </div>

      {/* Área de Inserção Inline */}
      <form {...formProps} className="flex gap-2 mb-6">
        <div className="flex-1">
          <input
            name="newTask"
            className="form-input"
            placeholder="O que precisa ser feito?"
            autoComplete="off"
            data-validation="validarTarefa"
            required // Validação Nativa
          />
        </div>
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded transition-colors shadow-sm h-[42px]">
          <Plus size={20} />
        </button>
      </form>

      {/* Lista */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all animate-in slide-in-from-left-2">
            <input
              type="checkbox"
              name={`tasks[${index}].done`}
              defaultChecked={item.data.done}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
            <input
              name={`tasks[${index}].description`}
              defaultValue={item.data.description}
              className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 w-full focus:text-gray-900 dark:focus:text-white outline-none"
            />
            <button
              type="button"
              onClick={() => {
                remove(index);
                toast.info('Tarefa removida.');
              }}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              title="Remover">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-xs text-gray-400 mt-10">Nenhuma tarefa pendente.</p>}
      </div>
    </div>
  );
};

// ============================================================================
// PADRÃO 2: MODAL ENTRY (Detalhado, Transacional)
// ============================================================================

// Form dentro do Modal (Componente Isolado)
const ProductFormModal = ({ onClose, onSave }: any) => {
  const { formProps } = useForm<IProduct>({
    id: 'product-modal-form',
    onSubmit: (data) => {
      // Validação extra se necessário
      if (data.quantity <= 0) {
        toast.error('Quantidade deve ser positiva.');
        return;
      }
      onSave(data);
      onClose();
    },
  });

  return (
    <form {...formProps} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Nome do Produto</label>
        <input name="name" className="form-input" autoFocus required placeholder="Ex: Notebook" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Categoria</label>
          <select name="category" className="form-input">
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Qtd</label>
          <input name="quantity" type="number" defaultValue="1" className="form-input" required min="1" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded font-medium transition-colors">
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg transition-transform active:scale-95">
          Adicionar
        </button>
      </div>
    </form>
  );
};

const DetailedList = () => {
  const { items, add, remove } = useList<IProduct>([{ name: 'Macbook Pro', category: 'Eletrônicos', quantity: 1 }]);

  const handleOpenModal = () => {
    showModal({
      title: (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Package /> Novo Produto
        </div>
      ),
      size: 'sm',
      content: ProductFormModal,
      props: {
        content: {
          onSave: (data: IProduct) => {
            add(data);
            toast.success(`Produto "${data.name}" adicionado!`);
          },
        },
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col transition-colors shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Carrinho</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Padrão Modal (Dados Complexos)</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors shadow-sm font-bold flex items-center gap-1">
          <Plus size={14} /> Novo
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded border-l-4 border-green-500 shadow-sm animate-in zoom-in-95">
            <div>
              <input
                name={`products[${index}].name`}
                defaultValue={item.data.name}
                className="font-bold text-gray-900 dark:text-white bg-transparent outline-none block w-full text-sm"
              />
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-white dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 flex items-center gap-1 shadow-sm">
                  <Tag size={10} />
                  {item.data.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase block font-bold mb-1">Qtd</span>
                <input
                  type="number"
                  name={`products[${index}].quantity`}
                  defaultValue={item.data.quantity}
                  className="w-12 bg-white dark:bg-gray-800 text-center text-gray-900 dark:text-white rounded border border-gray-200 dark:border-gray-700 text-sm focus:border-green-500 outline-none p-1"
                />
              </div>
              <button
                onClick={() => {
                  remove(index);
                  toast.info('Produto removido.');
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remover">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-xs text-gray-400 mt-10">Carrinho vazio.</p>}
      </div>
    </div>
  );
};

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

const ListPatternsExample = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-green-600 dark:from-cyan-400 dark:to-green-500 mb-2">
          Padrões de Lista & UX
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comparação entre adição rápida (Inline) e adição rica (Modal) usando a mesma arquitetura <code>useList</code> com validação e
          feedback.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <QuickList />
        <DetailedList />
      </div>
    </div>
  );
};

export default ListPatternsExample;
