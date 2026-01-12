import React, { useMemo, useState } from 'react';
import { AlertCircle, Database, Mail, Save, Search, Shield, Trash2, User } from 'lucide-react';

import Alert from '../../componentes/alert';
import { DataTable } from '../../componentes/data-table';
import { showModal } from '../../componentes/modal';
import Switch from '../../componentes/switch';
import { toast } from '../../componentes/toast';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';
import { useVirtualizer } from '../../hooks/virtualize';

const TabDataTable = () => {
  const generateUsers = (qtd: number) =>
    Array.from({ length: qtd }, (_, i) => ({
      id: String(i + 1),
      name: `Funcionário ${i + 1}`,
      email: `func.${i + 1}@empresa.com`,
      role: i % 3 === 0 ? 'Admin' : 'User',
      active: i % 5 !== 0,
    }));
  const initialData = useMemo(() => generateUsers(1000), []);
  const { items, remove } = useList(initialData);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortState, setSortState] = useState<{
    key: string;
    dir: 'asc' | 'desc';
  } | null>(null);

  const processedItems = useMemo(() => {
    let result = items;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) => item.data.name.toLowerCase().includes(lowerTerm) || item.data.email.toLowerCase().includes(lowerTerm),
      );
    }
    if (sortState) {
      result = [...result].sort((a, b) => {
        const valA = a.data[sortState.key as keyof typeof a.data];
        const valB = b.data[sortState.key as keyof typeof b.data];
        if (valA < valB) {
          return sortState.dir === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortState.dir === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [items, searchTerm, sortState]);

  const onSubmit = (data: any) => {
    if (Math.random() > 0.9) {
      toast.warning('Erro de validação no servidor (Simulado).');
      return;
    }
    showModal({
      title: 'Edição em Massa Salva',
      size: 'lg',
      content: (
        <div className="space-y-3">
          <Alert variant="success" title="Operação Concluída">
            Foram processados {items.length} registros com sucesso.
          </Alert>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 overflow-auto max-h-60 border border-gray-200 dark:border-gray-800 font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps } = useForm({ id: 'bulk-edit-form', onSubmit });

  const { virtualItems, totalHeight, containerProps } = useVirtualizer({
    count: processedItems.length,
    estimateSize: () => 57,
    overscan: 10,
  });

  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0 ? totalHeight - (virtualItems[virtualItems.length - 1].start + virtualItems[virtualItems.length - 1].size) : 0;

  const handleDelete = (_: React.MouseEvent, id: string, name: string) => {
    showModal({
      title: 'Excluir Registro',
      size: 'sm',
      content: (
        <p className="text-gray-600 dark:text-gray-300">
          Tem certeza que deseja remover <strong>{name}</strong>?
        </p>
      ),
      actions: ({ onClose }: any) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => {
              remove(id);
              toast.error(`Usuário ${name} removido.`);
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm">
            Excluir
          </button>
        </div>
      ),
    });
  };

  const handleSort = (key: string) => {
    setSortState((prev) => ({
      key,
      dir: prev?.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 h-[750px] flex flex-col transition-colors">
      <div className="flex justify-between items-end mb-4 shrink-0 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="text-cyan-600 dark:text-cyan-400" /> Gestão de Usuários
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Virtualização ({processedItems.length} visíveis).</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input
              placeholder="Filtrar..."
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded pl-9 p-1.5 text-sm text-gray-900 dark:text-white focus:border-cyan-500 outline-none transition-colors w-64 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2 text-gray-400 w-4 h-4" />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded shadow-lg transition-transform active:scale-95 text-sm font-bold">
            <Save size={16} /> Salvar Tudo
          </button>
        </div>
      </div>

      <div className="mb-4 shrink-0">
        <Alert variant="info" icon={<AlertCircle size={18} />}>
          Renderização virtual ativa.
        </Alert>
      </div>

      <form {...formProps} id="bulk-edit-form" className="flex-1 overflow-hidden flex flex-col relative">
        {/* 1. ROOT: Provedor de Contexto */}
        <DataTable.Root className="h-full">
          {/* 2. CONTAINER: Scroll Virtualizado (Recebe as props do hook) */}
          <DataTable.Container {...containerProps}>
            {/* 3. TABLE: A Tag Table Real (Corrige o erro de HTML inválido) */}
            <DataTable.Table className="min-w-[800px]">
              <DataTable.ColGroup>
                <DataTable.Col style={{ width: '80px' }} />
                <DataTable.Col />
                <DataTable.Col style={{ width: '250px' }} />
                <DataTable.Col style={{ width: '150px' }} />
                <DataTable.Col style={{ width: '100px' }} />
                <DataTable.Col style={{ width: '80px' }} />
              </DataTable.ColGroup>

              <DataTable.Header>
                <DataTable.HeadCell>ID</DataTable.HeadCell>
                <DataTable.HeadCell sortable direction={sortState?.key === 'name' ? sortState.dir : null} onSort={() => handleSort('name')}>
                  Nome
                </DataTable.HeadCell>
                <DataTable.HeadCell
                  sortable
                  direction={sortState?.key === 'email' ? sortState.dir : null}
                  onSort={() => handleSort('email')}>
                  Email
                </DataTable.HeadCell>
                <DataTable.HeadCell>Cargo</DataTable.HeadCell>
                <DataTable.HeadCell align="center">Ativo</DataTable.HeadCell>
                <DataTable.HeadCell align="center">Ações</DataTable.HeadCell>
              </DataTable.Header>

              <DataTable.Body>
                {paddingTop > 0 && (
                  <tr>
                    <td style={{ height: `${paddingTop}px` }} colSpan={6} />
                  </tr>
                )}

                {virtualItems.map((virtualRow) => {
                  const item = processedItems[virtualRow.index];
                  const index = virtualRow.index;

                  if (!item) {
                    return null;
                  }

                  return (
                    <DataTable.Row key={item.id}>
                      <DataTable.Cell className="text-gray-400 font-mono text-xs select-none">#{item.data.id}</DataTable.Cell>
                      <DataTable.Cell>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-purple-400 shrink-0" />
                          <input
                            name={`users[${index}].name`}
                            defaultValue={item.data.name}
                            className="w-full bg-transparent outline-none border-b border-transparent focus:border-cyan-500 text-gray-900 dark:text-white transition-colors text-sm py-1"
                          />
                        </div>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400 shrink-0" />
                          <input
                            name={`users[${index}].email`}
                            defaultValue={item.data.email}
                            className="w-full bg-transparent outline-none text-gray-500 dark:text-gray-400 text-sm focus:text-gray-900 dark:focus:text-white border-b border-transparent focus:border-cyan-500 transition-colors py-1"
                          />
                        </div>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 w-fit flex items-center gap-1">
                          <Shield size={12} />
                          {item.data.role}
                        </span>
                      </DataTable.Cell>
                      <DataTable.Cell className="flex justify-center" colSpan={2}>
                        <Switch name={`users[${index}].active`} defaultValue={item.data.active} size="sm" className="mb-0" />
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item.id, item.data.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={16} />
                        </button>
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}

                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: `${paddingBottom}px` }} colSpan={6} />
                  </tr>
                )}
              </DataTable.Body>
            </DataTable.Table>
          </DataTable.Container>
        </DataTable.Root>
      </form>
    </div>
  );
};

export default TabDataTable;
