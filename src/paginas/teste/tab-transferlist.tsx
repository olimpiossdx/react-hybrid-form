import { useState } from 'react';
import { Pencil, Plus, Save, Trash2, Users, XCircle } from 'lucide-react';

import TransferList, { type TransferListItem } from '../../componentes/transferlist';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[]; // IDs dos usuários
}

// --- Dados Mockados ---
const AVAILABLE_USERS: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `u${i + 1}`,
  name: `Usuário ${i + 1}`,
  role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
}));

const INITIAL_GROUPS: Group[] = [
  { id: 'g1', name: 'Time de Desenvolvimento', description: 'Acesso aos repositórios e servidores', members: ['u1', 'u2', 'u5'] },
  { id: 'g2', name: 'Marketing', description: 'Acesso às redes sociais e ferramentas de analytics', members: ['u3', 'u4'] },
];

const userToTransferItem = (u: User): TransferListItem => ({
  key: u.id,
  label: `${u.name} (${u.role})`,
  disabled: false,
});

const TabTransferList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Group>>({});

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({ ...group });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGroup(null);
    setFormData({ name: '', description: '', members: [] });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza?')) {
      setGroups((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGroup) {
      // Update
      setGroups((prev) => prev.map((g) => (g.id === editingGroup.id ? ({ ...g, ...formData } as Group) : g)));
    } else {
      // Create
      const newGroup: Group = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || 'Novo Grupo',
        description: formData.description || '',
        members: formData.members || [],
      };
      setGroups((prev) => [...prev, newGroup]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="text-blue-600" />
            Gestão de Grupos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Exemplo CRUD usando TransferList para gerenciar membros.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">
          <Plus size={18} /> Novo Grupo
        </button>
      </div>

      {/* Lista de Grupos (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{group.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{group.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(group)}
                  className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Membros ({group.members.length})</span>
              <div className="mt-2 flex -space-x-2 overflow-hidden">
                {group.members.slice(0, 5).map((memberId) => {
                  const user = AVAILABLE_USERS.find((u) => u.id === memberId);
                  return (
                    <div
                      key={memberId}
                      title={user?.name}
                      className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {user?.name.charAt(0)}
                    </div>
                  );
                })}
                {group.members.length > 5 && (
                  <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                    +{group.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingGroup ? 'Editar Grupo' : 'Novo Grupo'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="group-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome do Grupo <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ex: Time de Design"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                    <input
                      type="text"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Breve descrição da finalidade..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <TransferList
                    label="Membros do Grupo"
                    titles={['Usuários Disponíveis', 'Membros Selecionados']}
                    dataSource={AVAILABLE_USERS.map(userToTransferItem)}
                    value={formData.members || []}
                    onChange={(newMembers) => setFormData({ ...formData, members: newMembers })}
                    required
                    className="h-[450px]"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Selecione os usuários que farão parte deste grupo. Arraste ou use os botões para mover.
                  </p>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                form="group-form"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                <Save size={18} />
                {editingGroup ? 'Salvar Alterações' : 'Criar Grupo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabTransferList;
