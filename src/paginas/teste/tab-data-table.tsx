import React from 'react';
import { Trash2, Save, User, Database, Mail, Shield } from 'lucide-react';
import { DataTable } from '../../componentes/data-table';
import { showModal } from '../../componentes/modal';
import Switch from '../../componentes/switch';
import { toast } from '../../componentes/toast';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';
import { useVirtualizer } from '../../hooks/virtualize';

const generateUsers = (qtd: number) => Array.from({ length: qtd }, (_, i) => ({
  id: String(i + 1),
  name: `Funcionário ${i + 1}`,
  email: `func.${i + 1}@empresa.com`,
  role: i % 3 === 0 ? 'Admin' : 'User',
  active: i % 5 !== 0
}));

const TabDataTable = () => {
  // 1. DADOS (1000 itens)
  const initialData = React.useMemo(() => generateUsers(1000), []);
  const { items, remove } = useList(initialData);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortState, setSortState] = React.useState<{ key: string, dir: 'asc' | 'desc' } | null>(null);

  // 2. FILTRO & SORT
  const processedItems = React.useMemo(() => {
    let result = items;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.data.name.toLowerCase().includes(lowerTerm) ||
        item.data.email.toLowerCase().includes(lowerTerm)
      );
    }
    if (sortState) {
      result = [...result].sort((a, b) => {
        const valA = a.data[sortState.key as keyof typeof a.data];
        const valB = b.data[sortState.key as keyof typeof b.data];
        if (valA < valB) return sortState.dir === 'asc' ? -1 : 1;
        if (valA > valB) return sortState.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [items, searchTerm, sortState]);



  // 4. VIRTUALIZAÇÃO (Hook Genérico)
  // O hook gerencia a ref do container automaticamente
  const { virtualItems, totalHeight, containerProps } = useVirtualizer({
    count: processedItems.length,
    estimateSize: () => 57,
    overscan: 10
  });

  // 5. CÁLCULO DE PADDING (Virtualização Nativa para Tabela)
  // Em vez de position: absolute, usamos TRs vazias com altura para empurrar o conteúdo
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom = virtualItems.length > 0
    ? totalHeight - (virtualItems[virtualItems.length - 1].start + virtualItems[virtualItems.length - 1].size)
    : 0;

  // --- AÇÕES ---
  const handleDelete = (id: string, name: string) => {
    showModal({
      title: "Excluir Registro",
      size: 'sm',
      content: <p className="text-gray-600 dark:text-gray-300">Remover <strong>{name}</strong>?</p>,
      actions: ({ onClose }: any) => (
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">Cancelar</button>
          <button onClick={() => { remove(id); toast.error(`Removido: ${name}`); onClose(); }} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Excluir</button>
        </div>
      )
    });
  };

  const handleSort = (key: string) => {
    setSortState(prev => ({ key, dir: prev?.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const onSubmit = (data: any) => {
    showModal({
      title: "Salvo",
      size: 'lg',
      content: <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 overflow-auto max-h-60 border border-gray-200 dark:border-gray-800 font-mono">{JSON.stringify(data, null, 2)}</pre>
    });
  };

  // 3. FORMULÁRIO
  const { formProps } = useForm({ id: "bulk-edit-form", onSubmit });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 h-[750px] flex flex-col transition-colors">

      <div className="flex justify-between items-end mb-4 shrink-0 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="text-cyan-600 dark:text-cyan-400" /> Gestão de Usuários
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Virtualização Nativa ({processedItems.length} visíveis).</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="Filtrar..." className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded pl-4 p-1.5 text-sm text-gray-900 dark:text-white focus:border-cyan-500 outline-none w-48" onChange={(e) => setSearchTerm(e.target.value)} />
          <button type="submit" form="bulk-edit-form" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded shadow text-sm font-bold flex items-center gap-2"><Save size={16} /> Salvar</button>
        </div>
      </div>

      <form {...formProps} id="bulk-edit-form" className="flex-1 overflow-hidden flex flex-col">

        {/* CONTAINER DE SCROLL: Recebe a ref do virtualizador */}
        <DataTable.Container {...containerProps}>

          <DataTable.Root className="min-w-[800px]">
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
              <DataTable.HeadCell sortable direction={sortState?.key === 'name' ? sortState.dir : null} onSort={() => handleSort('name')}>Nome</DataTable.HeadCell>
              <DataTable.HeadCell sortable direction={sortState?.key === 'email' ? sortState.dir : null} onSort={() => handleSort('email')}>Email</DataTable.HeadCell>
              <DataTable.HeadCell>Cargo</DataTable.HeadCell>
              <DataTable.HeadCell align="center">Ativo</DataTable.HeadCell>
              <DataTable.HeadCell align="center">Ações</DataTable.HeadCell>
            </DataTable.Header>

            <DataTable.Body>
              {/* 1. Espaçador Superior */}
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} colSpan={6} />
                </tr>
              )}

              {/* 2. Itens Reais */}
              {virtualItems.map(virtualRow => {
                const item = processedItems[virtualRow.index];
                const index = virtualRow.index; // Índice visual para inputs
                if (!item) return null;

                return (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell className="text-gray-400 font-mono text-xs">#{item.data.id}</DataTable.Cell>
                    <DataTable.Cell>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-purple-400" />
                        <input name={`users[${index}].name`} defaultValue={item.data.name} className="w-full bg-transparent outline-none border-b border-transparent focus:border-cyan-500 text-gray-900 dark:text-white transition-colors text-sm py-1" />
                      </div>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <input name={`users[${index}].email`} defaultValue={item.data.email} className="w-full bg-transparent outline-none text-gray-500 dark:text-gray-400 text-sm focus:text-gray-900 dark:focus:text-white border-b border-transparent focus:border-cyan-500 transition-colors py-1" />
                      </div>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 flex items-center gap-1 w-fit">
                        <Shield size={10} /> {item.data.role}
                      </span>
                    </DataTable.Cell>
                    <DataTable.Cell className="flex justify-center">
                      <Switch name={`users[${index}].active`} defaultValue={item.data.active} size="sm" className="mb-0" />
                    </DataTable.Cell>
                    <DataTable.Cell className="text-center">
                      <button type="button" onClick={() => handleDelete(item.id, item.data.name)} className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 size={16} />
                      </button>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}

              {/* 3. Espaçador Inferior */}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} colSpan={6} />
                </tr>
              )}
            </DataTable.Body>

          </DataTable.Root>
        </DataTable.Container>
      </form>
    </div>
  );
};

export default TabDataTable;