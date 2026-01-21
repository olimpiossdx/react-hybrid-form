import React, { useState } from 'react';
import { Activity, CheckCircle2, MoreVertical, Save, Shield, User as UserIcon } from 'lucide-react';

import Badge from '../../componentes/badge';
import Button from '../../componentes/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../componentes/card';
// Componentes do Design System Moderno
import { DataTable, type DataTableColumn } from '../../componentes/data-table';
import { Input } from '../../componentes/input';
import showModal from '../../componentes/modal/hook';
import { ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '../../componentes/modal/modal';
import { Select } from '../../componentes/select';
import { toast } from '../../componentes/toast'; // Mantendo toast se existir

// --- DADOS E TIPOS ---

interface User {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

const INITIAL_DATA: User[] = [
  { id: '1', name: 'Ana Silva', role: 'Admin', active: true },
  { id: '2', name: 'Carlos Lima', role: 'Editor', active: false },
  { id: '3', name: 'Beatriz Souza', role: 'Viewer', active: true },
  { id: '4', name: 'Daniel Costa', role: 'Viewer', active: true },
];

const ROLES_OPTIONS = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' },
];

export const TabTableStackCrud = () => {
  const [data, setData] = useState<User[]>(INITIAL_DATA);

  // --- AÇÕES DO CRUD ---

  const handleSave = (updatedUser: User) => {
    setData((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    toast.success('Usuário atualizado com sucesso!');
  };

  const handleEdit = (user: User) => {
    // Estado local temporário para o formulário do modal
    const formData = { ...user };

    showModal({
      title: `Editar ${user.name}`,
      size: 'md',
      content: ({ onClose }) => (
        <EditUserModal
          initialData={formData}
          onSave={(newData) => {
            handleSave(newData);
            onClose();
          }}
          onClose={onClose}
        />
      ),
    });
  };

  // Componente interno do Modal para gerenciar o estado do formulário isoladamente
  const EditUserModal = ({ initialData, onSave, onClose }: { initialData: User; onSave: (u: User) => void; onClose: () => void }) => {
    const [formState, setFormState] = useState(initialData);

    return (
      <>
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <UserIcon className="text-blue-500" /> Editar Usuário
          </ModalTitle>
          <ModalDescription>Altere as permissões e status de acesso.</ModalDescription>
        </ModalHeader>

        <ModalContent className="space-y-4 pt-4">
          <Input
            label="Nome Completo"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            variant="filled"
            name={''}
          />

          <Select
            label="Função (Role)"
            value={formState.role}
            onChange={(e) => setFormState({ ...formState, role: e.target.value })}
            variant="outlined"
            options={ROLES_OPTIONS}
            name={''}
          />

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100 block">Status da Conta</label>
              <span className="text-xs text-gray-500">
                {formState.active ? 'Conta ativa e acessível.' : 'Acesso bloqueado temporariamente.'}
              </span>
            </div>
            {/* Usando Switch (se disponível) ou Input Checkbox estilizado */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${formState.active ? 'text-green-600' : 'text-gray-400'}`}>
                {formState.active ? 'ATIVO' : 'INATIVO'}
              </span>
              <Input
                type="checkbox"
                checked={formState.active}
                onChange={(e) => setFormState({ ...formState, active: e.target.checked })}
                className="w-5 h-5 accent-blue-600"
                containerClassName="w-auto"
                name={''}
              />
            </div>
          </div>
        </ModalContent>

        <ModalFooter className="bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => onSave(formState)} leftIcon={<Save size={16} />}>
            Salvar Alterações
          </Button>
        </ModalFooter>
      </>
    );
  };

  // --- DEFINIÇÃO DAS COLUNAS ---

  const columns: DataTableColumn<User>[] = [
    {
      accessorKey: 'name',
      header: 'Usuário',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>
            <span className="text-xs text-gray-400">ID: {row.id}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Permissão',
      width: '150px',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.role === 'Admin' ? <Shield size={14} className="text-purple-500" /> : <UserIcon size={14} className="text-gray-400" />}
          <span>{row.role}</span>
        </div>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Status',
      align: 'center',
      width: '120px',
      cell: (row) => (
        <Badge variant={row.active ? 'success' : 'default'} size="sm" className="gap-1 pl-1">
          {row.active ? <CheckCircle2 size={12} /> : <Activity size={12} />}
          {row.active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: '',
      align: 'right',
      width: '60px',
      cell: (row) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-blue-600"
          onClick={() => handleEdit(row)}
          title="Editar">
          <MoreVertical size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <Activity className="text-blue-600" /> Stacked CRUD
        </h2>
        <p className="text-gray-500 mt-2">Tabela moderna com edição via Modal e atualização de estado local.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Controle de Acesso</CardTitle>
          <CardDescription>Gerencie os usuários e suas permissões no sistema.</CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable data={data} columns={columns} searchable density="md" />
        </CardContent>
      </Card>
    </div>
  );
};

export default TabTableStackCrud;
