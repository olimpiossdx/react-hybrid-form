import React from 'react';
import { MoreVertical, User as UserIcon, Shield, Activity, Save } from 'lucide-react';
import Autocomplete from '../../componentes/autocomplete';
import { showModal } from '../../componentes/modal';
import Switch from '../../componentes/switch';
import { toast } from '../../componentes/toast';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';
import useTable, { type TableColumn } from '../../hooks/use-table';
import { DataTable } from '../../componentes/data-table';

interface User {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

const ROLES_OPTIONS = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' }
];

const EditUserForm = ({ user, onSave, onClose }: { user: User, onSave: (data: any) => void, onClose?: () => void }) => {
  const { formProps, resetSection } = useForm({
    id: "edit-user-modal",
    onSubmit: (data) => {
      onSave(data);
      if (onClose) onClose();
    }
  });

  React.useEffect(() => {
    // Delay seguro para garantir que o modal montou e o input do Autocomplete está pronto
    setTimeout(() => {
      resetSection("", {
        ...user,
        // Garante que o Autocomplete receba o objeto { label, value } para pré-seleção visual correta
        role: { label: user.role, value: user.role }
      });
    }, 50);
  }, [user, resetSection]);

  return (
    <form {...formProps} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">Nome</label>
        <input name="name" className="form-input" required defaultValue={user.name} />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">Permissão</label>
        <Autocomplete
          name="role"
          label=""
          options={ROLES_OPTIONS}
          required
          className="mb-0"
          // Fallback visual inicial
          defaultValue={user.role}
        />
      </div>
      <div className="pt-2">
        <Switch name="active" label="Usuário Ativo no Sistema" defaultValue={user.active} />
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-2 transition-colors">Cancelar</button>
        <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-transform active:scale-95">
          <Save size={16} /> Salvar Alterações
        </button>
      </div>
    </form>
  );
};

const TableStackCRUD = () => {
  const { items, update } = useList<User>([
    { id: 'u1', name: 'Ana Silva', role: 'Admin', active: true },
    { id: 'u2', name: 'Carlos Souza', role: 'Editor', active: false },
    { id: 'u3', name: 'Beatriz Lima', role: 'Viewer', active: true },
    { id: 'u4', name: 'João Paulo', role: 'Viewer', active: true },
  ]);

  const columns: TableColumn<User>[] = [
    { id: 'name', header: 'Usuário' },
    { id: 'role', header: 'Permissão' },
    { id: 'status', header: 'Status' },
    { id: 'actions', header: '', hideLabelOnStack: true }
  ];

  const table = useTable({ data: [], columns, responsiveMode: 'stack' });

  const handleSave = (structuralId: string, updatedData: Partial<User>) => {
    update(structuralId, updatedData);
    toast.success("Usuário atualizado com sucesso!");
  };

  const handleEdit = (user: User, structuralId: string) => {
    // Clona o usuário para garantir nova referência e disparar o useEffect do formulário
    const userData = { ...user };

    showModal({
      title: <div className="flex items-center gap-2 text-gray-900 dark:text-white"><UserIcon className="text-cyan-500" /> Editar Usuário</div>,
      size: 'sm',
      content: EditUserForm,
      props: {
        content: {
          user: userData,
          onSave: (data: any) => handleSave(structuralId, data)
        }
      }
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-[600px] overflow-y-auto transition-colors custom-scrollbar">

      <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <UserIcon className="text-purple-600 dark:text-purple-400" />
          Usuários (Modo Stack)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Em telas pequenas, as linhas se transformam em cards verticais.
        </p>
      </div>

      <DataTable.Root instance={table}>
        <DataTable.Header>
          {table.columns.map(col => <DataTable.HeadCell key={col.id}>{col.header}</DataTable.HeadCell>)}
        </DataTable.Header>

        <DataTable.Body>
          {items.map((item) => (
            <DataTable.Row key={item.id}>

              <DataTable.Cell columnIndex={0} className="md:w-auto w-full flex items-center justify-between md:justify-start md:block">
                <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Usuário</span>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-sm shadow-sm border border-cyan-200 dark:border-cyan-800">
                    {item.data.name.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{item.data.name}</span>
                </div>
              </DataTable.Cell>

              <DataTable.Cell columnIndex={1} className="md:w-auto w-full flex items-center justify-between md:justify-start md:block mt-2 md:mt-0">
                <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Permissão</span>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Shield size={14} className="text-purple-500" />
                  {item.data.role}
                </div>
              </DataTable.Cell>

              <DataTable.Cell columnIndex={2} className="md:w-auto w-full flex items-center justify-between md:justify-start md:block mt-2 md:mt-0">
                <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.data.active ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                  <Activity size={12} />
                  {item.data.active ? 'Ativo' : 'Inativo'}
                </span>
              </DataTable.Cell>

              <DataTable.Cell columnIndex={3} className="md:w-auto w-full flex justify-end md:justify-center mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-gray-700">
                <div className="flex justify-end md:justify-center w-full">
                  <button
                    onClick={() => handleEdit(item.data, item.id)}
                    className="flex items-center gap-2 px-3 py-1.5 md:p-2 bg-white md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent border md:border-none border-gray-300 dark:border-gray-600 rounded-md md:rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm md:shadow-none"
                    title="Editar"
                  >
                    <span className="md:hidden text-xs font-bold">Editar</span>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable.Root>
    </div>
  );
};

export default TableStackCRUD;