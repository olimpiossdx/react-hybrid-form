// FormListTestSection.tsx (pode ser no mesmo arquivo da ListTestPage ou importado)

import React from 'react';

import Button from '../../componentes/button';
import Flex from '../../componentes/flex';
import Input from '../../componentes/input';
import useList from '../../hooks/list';
import type { ListRowComponent } from '../../hooks/list/create-row';
import useForm from '../../hooks/use-form';

type User = {
  name: string;
  email: string;
};

const initialFormValues = {
  usuarios: [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
  ] as User[],
};

// Row base específica para integração com useForm
const FormUserRowBase: ListRowComponent<User> = ({ index, data, onChange, onRemove }) => {
  // O valor real vem do DOM + useForm; aqui só usamos data como fallback inicial
  return (
    <Flex gap="2" mb="2" align="center">
      <Input
        className="border px-2 py-1 rounded w-40"
        placeholder="Nome"
        onChange={onChange}
        name={`usuarios.${index}.name`}
        defaultValue={data.name}
      />
      <Input
        className="border px-2 py-1 rounded w-60"
        placeholder="Email"
        onChange={onChange}
        name={`usuarios.${index}.email`}
        defaultValue={data.email}
      />
      <Button variant="outline" size="sm" onClick={onRemove}>
        Remover
      </Button>
    </Flex>
  );
};

const TabFormListTestSection: React.FC = () => {
  // Form hook
  const { formProps, getValue, resetSection } = useForm<typeof initialFormValues>({
    onSubmit: (data) => {
      console.log('Submit useForm data:', data);
    },
  });

  // Lista gerenciando estrutura de usuarios
  const { items, add, insertAt, move, removeById, removeAt, set, resetToInitial, setInitialSnapshot, createRowComponent, getItems } =
    useList<User>(initialFormValues.usuarios);

  const FormUserRow = React.useMemo(
    () =>
      createRowComponent(FormUserRowBase, {
        areEqual: (prev, next) => prev.data === next.data && prev.index === next.index,
      }),
    [createRowComponent],
  );

  const handleAdd = () => {
    add({ name: '', email: '' });
  };

  const handleInsertAt0 = () => {
    insertAt(0, { name: 'Novo usuário', email: 'novo@example.com' });
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

  const handleResetFormAndList = () => {
    // reset formulário inteiro
    resetSection('usuarios', initialFormValues.usuarios);
    // reset estrutura da lista
    resetToInitial();
  };

  const handleDefineSnapshotFromForm = () => {
    const raw = getValue('usuarios' as any);
    console.log('getValue("usuarios") raw:', raw);

    if (!raw || typeof raw !== 'object') {
      console.warn('usuarios não parece um objeto indexado, ignorando setInitialSnapshot');
      return;
    }

    // Converte {0: {...}, 1: {...}} para [{...}, {...}] ordenado por índice
    const entries = Object.entries(raw)
      .filter(([key]) => !isNaN(Number(key)))
      .sort(([a], [b]) => Number(a) - Number(b));

    const current: User[] = entries.map(([, value]) => value as User);

    setInitialSnapshot(current);
  };

  const handleSetExampleUsers = () => {
    const novos = [
      { name: 'Exemplo F1', email: 'f1@example.com' },
      { name: 'Exemplo F2', email: 'f2@example.com' },
      { name: 'Exemplo F3', email: 'f3@example.com' },
    ];
    // estrutura da lista
    set(novos);
    // resetar campos do form com esses valores
    resetSection('usuarios', novos);
  };

  const handleLogFormVsList = () => {
    const formData = getValue('usuarios') as User[];
    const listData = getItems().map((i) => i.data);
    console.log('Form usuarios:', formData);
    console.log('List usuarios (getItems):', listData);
  };

  return (
    <section className="mt-8 space-y-4">
      <h2 className="font-semibold text-sm">Form + useList (integração híbrida)</h2>
      <p className="text-xs text-gray-500">
        Essa seção testa o fluxo: useForm (DOM como fonte de verdade) + useList controlando a estrutura da lista. O submit usa useForm; o
        getItems() mostra o modelo da lista.
      </p>

      <form {...formProps}>
        {/* Controles da lista + form */}
        <div className="space-y-2 mb-4">
          <div className="space-x-2">
            <Button size="sm" onClick={handleAdd} type="button">
              Adicionar usuário
            </Button>
            <Button size="sm" variant="secondary" onClick={handleInsertAt0} type="button">
              Inserir na posição 0
            </Button>
            <Button size="sm" variant="secondary" onClick={handleMoveFirstToLast} type="button">
              Mover primeiro para último
            </Button>
            <Button size="sm" variant="destructive" onClick={handleRemoveFirst} type="button">
              Remover primeiro
            </Button>
          </div>

          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={handleSetExampleUsers} type="button">
              Setar usuários de exemplo (lista + form)
            </Button>
            <Button size="sm" variant="outline" onClick={handleDefineSnapshotFromForm} type="button">
              Definir snapshot inicial a partir do form
            </Button>
            <Button size="sm" variant="ghost" onClick={handleResetFormAndList} type="button">
              Resetar form + lista para snapshot inicial
            </Button>
          </div>

          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={handleLogFormVsList} type="button">
              Logar useForm vs useList.getItems()
            </Button>
          </div>
        </div>

        {/* Lista de usuários controlada pela estrutura do useList */}
        <div className="mt-2">
          {items.map((item, index) => (
            <FormUserRow
              key={item._internalId}
              internalId={item._internalId}
              index={index}
              data={item.data}
              onChange={(item) => {
                console.log('item', item);
                // neste cenário, o valor “de verdade” vem do DOM/useForm,
                // então não usamos onChange para atualizar data aqui
              }}
              onRemove={() => removeById(item._internalId)}
            />
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500 mt-2">Nenhum usuário na lista.</p>}
        </div>

        {/* Submit usa apenas o useForm */}
        <div className="mt-4">
          <Button type="submit" variant="primary">
            Enviar (useForm onSubmit)
          </Button>
        </div>
      </form>
    </section>
  );
};

export default TabFormListTestSection;
