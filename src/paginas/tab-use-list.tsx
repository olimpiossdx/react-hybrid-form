// ListTestPage.tsx

import React from 'react';

import Button from '../componentes/button';
import useList from '../hooks/list';
import type { ListRowComponent } from '../hooks/list/create-row';

// Tipo de dado de negócio
type User = {
  name: string;
  email: string;
};

const initialUsers: User[] = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
];

// Row base, sem memo, apenas descreve UI de um item
const UserRowBase: ListRowComponent<User> = ({ data, onChange, onRemove }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        className="border px-2 py-1 rounded w-40"
        placeholder="Nome"
        value={data.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <input
        className="border px-2 py-1 rounded w-60"
        placeholder="Email"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <Button variant="outline" size="sm" onClick={onRemove}>
        Remover
      </Button>
    </div>
  );
};

const ListTestPage: React.FC = () => {
  const {
    items,
    add,
    insertAt,
    update,
    updateAt,
    move,
    removeById,
    removeAt,
    set,
    clear,
    resetToInitial,
    setInitialSnapshot,
    createRowComponent,
  } = useList<User>(initialUsers);

  // Row memoizada, criada uma vez
  const UserRow = React.useMemo(
    () =>
      createRowComponent(UserRowBase, {
        // opcional: só re-renderiza se o objeto data mudar
        areEqual: (prev, next) => prev.data === next.data,
      }),
    [createRowComponent],
  );

  const handleAdd = () => {
    add({ name: '', email: '' });
  };

  const handleInsertAt1 = () => {
    insertAt(1, { name: 'Novo no meio', email: 'novo@example.com' });
  };

  const handleMoveFirstToLast = () => {
    if (items.length < 2) {
      return;
    }
    move(0, items.length - 1);
  };

  const handleRemoveFirst = () => {
    if (!items.length) {
      return;
    }
    removeAt(0);
  };

  const handleReset = () => {
    resetToInitial();
  };

  const handleSetInitialToCurrent = () => {
    const currentData = items.map((it) => it.data);
    setInitialSnapshot(currentData);
  };

  const handleSet2ItensExemplo = () => {
    set([
      { name: 'Exemplo 1', email: 'ex1@example.com' },
      { name: 'Exemplo 2', email: 'ex2@example.com' },
    ]);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Teste do useList v2</h1>

      <div className="space-x-2">
        <Button size="sm" onClick={handleAdd}>
          Adicionar
        </Button>
        <Button size="sm" variant="secondary" onClick={handleInsertAt1}>
          Inserir na posição 1
        </Button>
        <Button size="sm" variant="secondary" onClick={handleMoveFirstToLast}>
          Mover primeiro para último
        </Button>
        <Button size="sm" variant="destructive" onClick={handleRemoveFirst}>
          Remover primeiro
        </Button>
      </div>

      <div className="space-x-2">
        <Button size="sm" variant="outline" onClick={handleSet2ItensExemplo}>
          Setar 2 itens de exemplo
        </Button>
        <Button size="sm" variant="outline" onClick={handleSetInitialToCurrent}>
          Definir snapshot inicial = estado atual
        </Button>
        <Button size="sm" variant="ghost" onClick={handleReset}>
          Resetar para snapshot inicial
        </Button>
        <Button size="sm" variant="ghost" onClick={clear}>
          Limpar tudo
        </Button>
      </div>

      <div className="mt-4">
        {items.map((item, index) => (
          <UserRow
            key={item._internalId}
            internalId={item._internalId}
            index={index}
            data={item.data}
            onChange={(patch) => update(item._internalId, patch)}
            onRemove={() => removeById(item._internalId)}
          />
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500 mt-2">Nenhum item na lista.</p>}
      </div>
    </div>
  );
};

export default ListTestPage;
