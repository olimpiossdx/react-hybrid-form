// ListTestPage.tsx

import React from 'react';

import Button from '../../componentes/button';
import useList from '../../hooks/list';
import type { ListRowComponent } from '../../hooks/list/create-row';
import { useVirtualizer } from '../../hooks/virtualize';

type User = {
  name: string;
  email: string;
};

const initialUsers: User[] = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
];

// Row base (sem memo). createRowComponent vai aplicar React.memo
const UserRowBase: ListRowComponent<User> = ({ data, onChange, onRemove }) => {
  console.log('render row', data.name);

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

// Dentro do mesmo arquivo ListTestPage.tsx
const BIG_COUNT = 500_000;

const makeBigInitialData = (): User[] => {
  const arr: User[] = [];
  for (let i = 0; i < BIG_COUNT; i++) {
    arr.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
    });
  }
  return arr;
};

// Reaproveite o mesmo UserRowBase do teste anterior, se quiser
const VirtualRowBase: ListRowComponent<User> = ({ data, onChange, onRemove }) => {
  return (
    <div className="flex items-center gap-2 mb-1">
      <input className="border px-2 py-1 rounded w-40" value={data.name} onChange={(e) => onChange({ name: e.target.value })} />
      <input className="border px-2 py-1 rounded w-60" value={data.email} onChange={(e) => onChange({ email: e.target.value })} />
      <Button variant="outline" size="sm" onClick={onRemove}>
        Remover
      </Button>
    </div>
  );
};

const VirtualizedSection: React.FC = () => {
  // useList com muitos itens
  const { items, update, removeById, getItems, createRowComponent } = useList<User>(React.useMemo(makeBigInitialData, []));

  // Handlers estáveis para rows
  const handleRowChange = React.useCallback(
    (id: string, patch: Partial<User>) => {
      update(id, patch);
    },
    [update],
  );

  const handleRowRemove = React.useCallback(
    (id: string) => {
      removeById(id);
    },
    [removeById],
  );

  // Row memoizada
  const VirtualRow = React.useMemo(
    () =>
      createRowComponent(VirtualRowBase, {
        areEqual: (prev, next) => prev.data === next.data && prev.index === next.index,
      }),
    [createRowComponent],
  );

  // Virtualização
  const { virtualItems, containerProps, wrapperProps, measureElement } = useVirtualizer({
    count: items.length,
    estimateSize: () => 40,
    overscan: 5,
  });

  const handleLogStore = () => {
    const all = getItems();
    console.log('Virtualized store: total itens =', all.length, ' primeiros =', all.slice(0, 3));
  };

  return (
    <section className="mt-8 space-y-2">
      <h2 className="font-semibold text-sm">Virtualized (500.000 itens, janela visível)</h2>
      <p className="text-xs text-gray-500">
        Edite alguns itens visíveis, depois clique em &quot;Logar getItems&quot; para verificar que o modelo global foi atualizado.
      </p>

      <Button size="sm" variant="outline" onClick={handleLogStore}>
        Logar getItems() (500.000)
      </Button>

      <div
        {...containerProps}
        style={{
          ...containerProps.style,
          height: 400,
        }}>
        <div {...wrapperProps}>
          {virtualItems.map(({ index, props }) => {
            const item = items[index];
            return (
              <div key={item._internalId} {...props} ref={measureElement as any}>
                <VirtualRow
                  internalId={item._internalId}
                  index={index}
                  data={item.data}
                  onChange={(patch) => handleRowChange(item._internalId, patch)}
                  onRemove={() => handleRowRemove(item._internalId)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ListTestPage: React.FC = () => {
  const {
    items,
    add,
    insertAt,
    update,
    move,
    removeById,
    removeAt,
    set,
    clear,
    resetToInitial,
    setInitialSnapshot,
    createRowComponent,
    getDirtySnapshot,
    getItems,
    subscribe,
  } = useList<User>(initialUsers);

  console.log('render ListTestPage');

  // handlers estáveis para rows
  const handleRowChange = React.useCallback(
    (id: string, patch: Partial<User>) => {
      update(id, patch);
    },
    [update],
  );

  const handleRowRemove = React.useCallback(
    (id: string) => {
      removeById(id);
    },
    [removeById],
  );

  // Row memoizada: testa se apenas o item alterado re-renderiza
  const UserRow = React.useMemo(
    () =>
      createRowComponent(UserRowBase, {
        // foca apenas em data + index
        areEqual: (prev, next) => prev.data === next.data && prev.index === next.index,
      }),
    [createRowComponent],
  );

  // --- Teste de operações básicas (add/insert/move/remove/set/clear) ---

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

  const handleSet2ItensExemplo = () => {
    set([
      { name: 'Exemplo 1', email: 'ex1@example.com' },
      { name: 'Exemplo 2', email: 'ex2@example.com' },
    ]);
  };

  // --- Teste de reset/snapshot ---

  const handleReset = () => {
    resetToInitial();
  };

  const handleSetInitialToCurrent = () => {
    const currentData = items.map((it) => it.data);
    setInitialSnapshot(currentData);
  };

  // --- Teste de dirty (getDirtySnapshot) ---

  const dirtySnapshot = getDirtySnapshot();

  // --- Teste de store (getItems/subscribe) ---

  const [storeVersion, setStoreVersion] = React.useState(0);

  React.useEffect(() => {
    // registra listener para observar mudanças via store
    const unsubscribe = subscribe(() => {
      setStoreVersion((v) => v + 1);
    });
    return unsubscribe;
  }, [subscribe]);

  const handleLogStore = () => {
    const storeItems = getItems();
    console.log('Store items', storeItems.length, storeItems);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Teste do useList v2</h1>

      {/* Status geral */}
      <p className="text-sm">
        Dirty: {dirtySnapshot.isDirty ? 'SIM' : 'NÃO'} ({dirtySnapshot.dirtyIds.size} itens) | Store version: {storeVersion} | Items
        renderizados: {items.length}
      </p>

      {/* Seção 1: operações básicas */}
      <section className="space-y-2">
        <h2 className="font-semibold text-sm">Operações básicas</h2>
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
          <Button size="sm" variant="ghost" onClick={clear}>
            Limpar tudo
          </Button>
        </div>
      </section>

      {/* Seção 2: reset/snapshot */}
      <section className="space-y-2">
        <h2 className="font-semibold text-sm">Reset / Snapshot</h2>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={handleSetInitialToCurrent}>
            Definir snapshot inicial = estado atual
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Resetar para snapshot inicial
          </Button>
        </div>
      </section>

      {/* Seção 3: store (getItems/subscribe) */}
      <section className="space-y-2">
        <h2 className="font-semibold text-sm">Store (getItems / subscribe)</h2>
        <Button size="sm" variant="outline" onClick={handleLogStore}>
          Logar itens da store no console
        </Button>
      </section>

      {/* Lista renderizada */}
      <div className="mt-4">
        {items.map((item, index) => (
          <UserRow
            key={item._internalId}
            internalId={item._internalId}
            index={index}
            data={item.data}
            onChange={(patch) => handleRowChange(item._internalId, patch)}
            onRemove={() => handleRowRemove(item._internalId)}
          />
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500 mt-2">Nenhum item na lista.</p>}
      </div>
    </div>
  );
};

const TabListTestPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <ListTestPage />
      {/* Seção 4: virtualização com 500k */}
      <VirtualizedSection />
    </div>
  );
};

export default TabListTestPage;
