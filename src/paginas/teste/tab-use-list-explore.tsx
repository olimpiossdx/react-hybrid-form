import React from 'react';
import { CheckSquare, CornerUpLeft, CornerUpRight, Filter, Package, Plus, ShieldCheck, ShoppingCart, Tag, Trash2 } from 'lucide-react';

import { type IModalOptions, showModal } from '../../componentes/modal';
import type { InjectedModalProps } from '../../componentes/modal/types';
import { toast } from '../../componentes/toast';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';

// TIPOS
interface ISimpleTask {
  description: string;
  done: boolean;
}

interface IProduct {
  name: string;
  quantity: number;
  category: string;
}

interface IUserRow {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  active: boolean;
}

// --- EXEMPLO 1: QuickList (já existente, levemente resumido) ---
const QuickList: React.FC = () => {
  const { items, add, removeAt } = useList<ISimpleTask>([
    { description: 'Revisar PRs', done: true },
    { description: 'Daily Meeting', done: false },
  ]);

  const { formProps, resetSection, setValidators } = useForm<{ newTask: string }>({
    id: 'quick-add-form',
    onSubmit: (data) => {
      const value = data.newTask?.trim();
      if (!value) {
        toast.warning('Digite uma descrição para a tarefa.');
        return;
      }
      add({ description: value, done: false });
      toast.success('Tarefa adicionada!');
      resetSection('newTask', { newTask: '' });
    },
  });

  React.useEffect(() => {
    setValidators({
      newTask: (val) => {
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
          <p className="text-xs text-gray-500 dark:text-gray-400">Entrada inline, validação simples e feedback imediato.</p>
        </div>
      </div>

      <form {...formProps} className="flex gap-2 mb-6">
        <input
          name="newTask"
          className="form-input flex-1"
          placeholder="O que precisa ser feito?"
          autoComplete="off"
          data-validation="newTask"
          required
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded transition-colors shadow-sm h-10.5 flex items-center gap-1 text-xs font-semibold">
          <Plus size={16} />
          Adicionar
        </button>
      </form>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={item._internalId}
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
                removeAt(index);
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

type ProductFormModalProps = InjectedModalProps & {
  onSave: (data: IProduct) => void;
};

// --- EXEMPLO 2: DetailedList (já existente, resumido) ---
const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose, onSave }) => {
  const { formProps } = useForm<IProduct>({
    id: 'product-modal-form',
    onSubmit: (data) => {
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
          <input name="quantity" type="number" defaultValue={1} className="form-input" required min={1} />
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

const DetailedList: React.FC = () => {
  const { items, add, removeAt } = useList<IProduct>([
    { name: 'Macbook Pro', category: 'Eletrônicos', quantity: 1 },
    { name: 'Mouse', category: 'Eletrônicos', quantity: 2 },
  ]);

  const handleOpenModal = () => {
    const options: IModalOptions<unknown, { onSave: (data: IProduct) => void }> = {
      title: (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Package />
          <span>Novo Produto</span>
        </div>
      ),
      size: 'sm',
      content: ProductFormModal,
      props: {
        content: {
          onSave: (data: IProduct) => {
            add(data);
            toast.success(`Produto ${data.name} adicionado!`);
          },
        },
      },
    };

    showModal(options);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col transition-colors shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Carrinho</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Entrada via modal com dados mais ricos.</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors shadow-sm font-bold flex items-center gap-1">
          <Plus size={14} />
          Novo
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={item._internalId}
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
                type="button"
                onClick={() => {
                  removeAt(index);
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

// --- EXEMPLO 3: Undo / histórico por lista ---
const UndoList: React.FC = () => {
  type Todo = { title: string; done: boolean };

  const { items, add, removeAt, update, set } = useList<Todo>([
    { title: 'Revisar PRs críticos', done: true },
    { title: 'Ajustar validações', done: false },
    { title: 'Refinar useList', done: false },
  ]);

  type HistoryState = {
    past: Todo[][];
    present: Todo[];
    future: Todo[][];
  };

  const HISTORY_LIMIT = 20;

  const [history, setHistory] = React.useState<HistoryState>(() => ({
    past: [],
    present: items.map((i) => i.data),
    future: [],
  }));

  const syncFromListToHistory = React.useCallback((nextItems: typeof items) => {
    const nextPresent = nextItems.map((i) => i.data);
    setHistory((prev) => {
      const sameLength = prev.present.length === nextPresent.length;
      const sameContent =
        sameLength && prev.present.every((p, idx) => p.title === nextPresent[idx].title && p.done === nextPresent[idx].done);
      if (sameContent) {
        return prev;
      }

      const newPast = [...prev.past, prev.present];
      const limitedPast = newPast.length > HISTORY_LIMIT ? newPast.slice(newPast.length - HISTORY_LIMIT) : newPast;

      return {
        past: limitedPast,
        present: nextPresent,
        future: [],
      };
    });
  }, []);

  React.useEffect(() => {
    setHistory({
      past: [],
      present: items.map((i) => i.data),
      future: [],
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const applyToList = (data: Todo[]) => {
    set(data.map((d) => ({ data: d }) as any));
  };

  const handleUndo = () => {
    if (!canUndo) {
      return;
    }
    setHistory((prev) => {
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      const newFuture = [prev.present, ...prev.future];
      applyToList(previous);
      return { past: newPast, present: previous, future: newFuture };
    });
    toast.info('Última ação desfeita.');
  };

  const handleRedo = () => {
    if (!canRedo) {
      return;
    }
    setHistory((prev) => {
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      const newPast = [...prev.past, prev.present];
      applyToList(next);
      return { past: newPast, present: next, future: newFuture };
    });
    toast.info('Ação refeita.');
  };

  const { formProps, resetSection } = useForm<{ todo: string }>({
    id: 'undo-list-form',
    onSubmit: (data) => {
      const value = data.todo.trim();
      if (!value) {
        toast.warning('Digite uma tarefa antes de adicionar.');
        return;
      }
      add({ title: value, done: false });
      syncFromListToHistory(
        // @ts-ignore: apenas para ler snapshot logo após add
        items as any as typeof items,
      );
      resetSection('todo', { todo: '' });
      toast.success('Tarefa adicionada!');
    },
  });

  const handleToggle = (index: number) => {
    const id = items[index]._internalId;
    update(id, { done: !items[index].data.done });
    syncFromListToHistory(items as any as typeof items);
  };

  const handleRemove = (index: number) => {
    removeAt(index);
    syncFromListToHistory(items as any as typeof items);
    toast.info('Tarefa removida.');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col transition-colors shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lista com Undo / Redo</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Histórico limitado de operações de lista.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <CornerUpLeft size={14} />
            Undo
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <CornerUpRight size={14} />
            Redo
          </button>
        </div>
      </div>

      <form {...formProps} className="flex gap-2 mb-4">
        <input name="todo" autoComplete="off" placeholder="Digite uma tarefa..." className="form-input flex-1" />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded shadow-sm flex items-center gap-1 text-xs font-semibold transition-colors">
          <Plus size={14} />
          Adicionar
        </button>
      </form>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={item._internalId}
            className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
            <input
              type="checkbox"
              checked={item.data.done}
              onChange={() => handleToggle(index)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                item.data.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'
              }`}>
              {item.data.title}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              title="Remover">
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {items.length === 0 && <p className="text-center text-xs text-gray-400 mt-8">Nenhuma tarefa. Comece adicionando algo acima.</p>}
      </div>

      <div className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 flex justify-between">
        <span>
          Histórico: {history.past.length} passado · {history.future.length} futuro
        </span>
        <span>Limite: {HISTORY_LIMIT} estados</span>
      </div>
    </div>
  );
};

// --- EXEMPLO 4: Dirty + validação de coleção + seleção/bulk ---
const AdvancedUsersList: React.FC = () => {
  const { items, update, removeAt, getItems } = useList<IUserRow>([
    {
      id: '1',
      name: 'Ana',
      email: 'ana@example.com',
      role: 'admin',
      active: true,
    },
    {
      id: '2',
      name: 'Bruno',
      email: 'bruno@example.com',
      role: 'user',
      active: true,
    },
    {
      id: '3',
      name: 'Carla',
      email: 'carla@example.com',
      role: 'viewer',
      active: false,
    },
  ]);

  const [dirtyIds, setDirtyIds] = React.useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [collectionErrors, setCollectionErrors] = React.useState<string[]>([]);

  const markDirty = (id: string) => {
    setDirtyIds((prev) => new Set(prev).add(id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = items.map((i) => i.data.id);
    const allSelected = visibleIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleBulkDeactivate = () => {
    if (selectedIds.size === 0) {
      toast.warning('Selecione pelo menos um usuário.');
      return;
    }
    items.forEach((item) => {
      if (selectedIds.has(item.data.id)) {
        update(item._internalId, { active: false });
        markDirty(item.data.id);
      }
    });
    toast.info('Usuários selecionados foram desativados.');
  };

  const handleBulkRemove = () => {
    if (selectedIds.size === 0) {
      toast.warning('Selecione pelo menos um usuário.');
      return;
    }
    const toRemove = new Set(selectedIds);
    for (let i = items.length - 1; i >= 0; i--) {
      if (toRemove.has(items[i].data.id)) {
        removeAt(i);
      }
    }
    setSelectedIds(new Set());
    toast.info('Usuários selecionados foram removidos.');
  };

  const runCollectionValidation = () => {
    const values = getItems().map((i) => i.data);
    const errors: string[] = [];

    const seen = new Map<string, string>();
    values.forEach((u) => {
      const key = u.email.toLowerCase();
      if (seen.has(key)) {
        errors.push(`E-mail duplicado: ${u.email} (${seen.get(key)} e ${u.name})`);
      } else {
        seen.set(key, u.name);
      }
    });

    const totalActive = values.filter((v) => v.active).length;
    if (totalActive === 0) {
      errors.push('Pelo menos um usuário deve estar ativo.');
    }

    if (errors.length === 0) {
      toast.success('Coleção válida. Nenhum problema encontrado.');
    }
    setCollectionErrors(errors);
  };

  const handleSaveDirty = () => {
    const values = getItems().map((i) => i.data);
    const dirty = values.filter((v) => dirtyIds.has(v.id));
    if (dirty.length === 0) {
      toast.info('Nenhum item sujo para salvar.');
      return;
    }

    console.log('Enviando apenas itens sujos:', dirty);
    toast.success(`Salvando ${dirty.length} usuário(s) modificado(s).`);
    setDirtyIds(new Set());
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col transition-colors shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Usuários (Dirty, Regras e Bulk)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Itens sujos, validação da coleção e ações em massa.</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveDirty}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded shadow-sm transition-colors">
              Salvar sujos
            </button>
            <button
              type="button"
              onClick={handleBulkDeactivate}
              className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-semibold rounded border border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1">
              <Filter size={12} />
              Desativar selecionados
            </button>
            <button
              type="button"
              onClick={handleBulkRemove}
              className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 text-xs font-semibold rounded border border-red-200 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              Remover selecionados
            </button>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            Sujos: {dirtyIds.size} · Selecionados: {selectedIds.size}
          </span>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={items.length > 0 && items.every((item) => selectedIds.has(item.data.id))}
              onChange={toggleSelectAllVisible}
              className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500"
            />
            <span>Selecionar todos visíveis</span>
          </label>
        </div>

        {items.map((item, index) => {
          const isDirty = dirtyIds.has(item.data.id);
          const isSelected = selectedIds.has(item.data.id);
          return (
            <div
              key={item._internalId}
              className={`flex items-center justify-between p-3 rounded border text-sm ${
                isDirty
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
              }`}>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(item.data.id)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500"
                />
                <div className="flex-1">
                  <input
                    className="bg-transparent border-none font-medium outline-none w-full text-gray-900 dark:text-gray-100"
                    defaultValue={item.data.name}
                    onChange={(e) => {
                      const id = item._internalId;
                      update(id, { name: e.target.value });
                      markDirty(item.data.id);
                    }}
                  />
                  <input
                    className="bg-transparent border-none text-[11px] outline-none w-full text-gray-500 dark:text-gray-400"
                    defaultValue={item.data.email}
                    onChange={(e) => {
                      const id = item._internalId;
                      update(id, { email: e.target.value });
                      markDirty(item.data.id);
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  className="text-[11px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-gray-700 dark:text-gray-200"
                  defaultValue={item.data.role}
                  onChange={(e) => {
                    const id = item._internalId;
                    update(id, { role: e.target.value as IUserRow['role'] });
                    markDirty(item.data.id);
                  }}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="viewer">Viewer</option>
                </select>
                <label className="flex items-center gap-1 text-[11px]">
                  <input
                    type="checkbox"
                    defaultChecked={item.data.active}
                    onChange={(e) => {
                      const id = item._internalId;
                      update(id, { active: e.target.checked });
                      markDirty(item.data.id);
                    }}
                    className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-600 dark:text-gray-300">Ativo</span>
                </label>
                <button type="button" onClick={() => removeAt(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && <p className="text-center text-xs text-gray-400 mt-6">Nenhum usuário na lista.</p>}
      </div>

      <button
        type="button"
        onClick={runCollectionValidation}
        className="mt-3 text-[11px] px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 self-start">
        <ShieldCheck size={14} />
        Validar regras da coleção
      </button>

      {collectionErrors.length > 0 && (
        <ul className="mt-2 text-[11px] text-red-600 dark:text-red-400 list-disc pl-5 space-y-0.5">
          {collectionErrors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- PÁGINA PRINCIPAL COM OS 4 EXEMPLOS ---
const TabUseListExploreAdvanced: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-green-600 dark:from-cyan-400 dark:to-green-500 mb-2">
          Padrões Avançados de Lista
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Exemplos práticos de uso do useList: entrada rápida, modal rico, histórico, itens sujos, validação da coleção e ações em massa.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-[minmax(0,380px)]">
        <QuickList />
        <DetailedList />
        <UndoList />
        <AdvancedUsersList />
      </div>
    </div>
  );
};

export default TabUseListExploreAdvanced;
