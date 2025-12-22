import React from 'react';
import { showModal } from '../../componentes/modal';
import useList from '../../hooks/list';
import useTable, { type TableColumn } from '../../hooks/use-table';
import { Activity, MoreVertical, Shield, UserIcon } from 'lucide-react';
import Autocomplete from '../../componentes/autocomplete';
import { DataTable } from '../../componentes/data-table';
import Switch from '../../componentes/switch';
import useForm from '../../hooks/use-form';


interface User {
  id?: string;
  name: string;
  role: string;
  active: boolean;
}

// --- FORMULÁRIO DO MODAL ---
const EditUserForm = ({ user, onSave, onClose }: { user: User, onSave: (data: any) => void, onClose?: () => void }) => {
  const { formProps, resetSection } = useForm({
    id: "edit-user-modal",
    onSubmit: (data) => {
      onSave({ ...user, ...data });
      if (onClose) onClose();
    }
  });

  // Carrega dados iniciais
  React.useEffect(() => {
    // Mapeia para o formato do Autocomplete se necessário
    resetSection("", {
      ...user,
      role: { label: user.role, value: user.role }
    });
  }, []);

  return (
    <form {...formProps} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Nome</label>
        <input name="name" className="form-input mt-1" required />
      </div>
      <div>
        <Autocomplete
          name="role"
          label="Permissão"
          options={[{ label: 'Admin', value: 'Admin' }, { label: 'Editor', value: 'Editor' }, { label: 'Viewer', value: 'Viewer' }]}
          required
        />
      </div>
      <div className="pt-2">
        <Switch name="active" label="Usuário Ativo no Sistema" />
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-2">Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-bold shadow-lg">Salvar Alterações</button>
      </div>
    </form>
  );
};

const TableStackCRUD = () => {
  const { items, replace } = useList<User>([
    { name: 'Ana Silva', role: 'Admin', active: true },
    { name: 'Carlos Souza', role: 'Editor', active: false },
    { name: 'Beatriz Lima', role: 'Viewer', active: true },
  ]);

  const columns: TableColumn<User>[] = [
    { id: 'name', header: 'Usuário' },
    { id: 'role', header: 'Permissão' },
    { id: 'status', header: 'Status' },
    { id: 'actions', header: '', hideLabelOnStack: true }
  ];

  const table = useTable({ data: [], columns, responsiveMode: 'stack' });

  const handleSave = (updatedUser: User) => {
    // Atualiza a lista local (Optimistic Update)
    const newList = items.map(item => item.id === updatedUser.id ? { ...item, data: updatedUser } : item);
    // Hack para atualizar a lista já que useList é estrutural: recriamos com os dados novos
    // Em produção, usaria um método update() no useList ou estado separado.
    // Para o exemplo, vamos reconstruir a lista.
    const dataOnly = newList.map(n => n.data);
    replace(dataOnly);
  };

  const handleEdit = (user: any, id: string) => {
    // Passamos o ID estrutural + dados
    const userData = { ...user, id };

    showModal({
      title: <div className="flex items-center gap-2"><UserIcon className="text-cyan-500" /> Editar Usuário</div>,
      size: 'sm',
      content: EditUserForm,
      props: {
        content: { user: userData, onSave: handleSave }
      }
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow h-[600px] overflow-y-auto transition-colors">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Usuários (Modo Stack/Card)</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Em telas pequenas (mobile), as linhas viram cards. Experimente reduzir a janela.
      </p>

      <DataTable.Root instance={table}>
        <DataTable.Header>
          {/* No modo stack, o header é oculto via CSS automaticamente em telas pequenas */}
          {table.columns.map(col => <DataTable.HeadCell key={col.id}>{col.header}</DataTable.HeadCell>)}
        </DataTable.Header>

        <DataTable.Body>
          {items.map((item, _) => (
            <DataTable.Row key={item.id} className="relative">
              <DataTable.Cell columnIndex={0}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-xs">
                    {item.data.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{item.data.name}</span>
                </div>
              </DataTable.Cell>

              <DataTable.Cell columnIndex={1}>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-purple-500" />
                  {item.data.role}
                </div>
              </DataTable.Cell>

              <DataTable.Cell columnIndex={2}>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${item.data.active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                  <Activity size={12} />
                  {item.data.active ? 'Ativo' : 'Inativo'}
                </span>
              </DataTable.Cell>

              <DataTable.Cell columnIndex={3}>
                <button onClick={() => handleEdit(item.data, item.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable.Root>
    </div>
  );
};

export default TableStackCRUD;