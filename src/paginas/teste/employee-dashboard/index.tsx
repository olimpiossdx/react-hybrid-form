import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

import EmployeeFilter from './components/employeeFilter';
import EmployeeModal from './components/employeeModal';
import EmployeeTable from './components/employeeTable';
import { EmployeeService } from './service';
import type { IEmployee, IEmployeeFilter } from './types';
import showModal from '../../../componentes/modal/hook';
import { toast } from '../../../componentes/toast';

const EmployeeDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<IEmployeeFilter | undefined>(undefined);

  const loadData = async () => {
    setLoading(true);
    const response = await EmployeeService.getAll(filters);
    if (response.isSuccess && response.data) {
      setEmployees(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSave = async (data: any) => {
    const response = await EmployeeService.save(data);
    if (response.isSuccess) {
      toast.success('Funcionário salvo com sucesso!');
      loadData();
      return true;
    }
    return false;
  };

  const openEditModal = (employee?: IEmployee) => {
    showModal({
      title: (
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
          <Users /> <span>{employee ? 'Editar Funcionário' : 'Novo Funcionário'}</span>
        </div>
      ),
      size: 'lg',
      content: ({ onClose }: any) => (
        <EmployeeModal
          employee={employee || null}
          onCancel={onClose}
          onSave={async (data) => {
            const success = await handleSave({ ...employee, ...data });
            if (success) {
              onClose();
            }
          }}
        />
      ),
    });
  };

  const handleToggleStatus = async (id: number, status: boolean) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    const response = await EmployeeService.toggleStatus(id, status);
    if (!response.isSuccess) {
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: !status } : e)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Pessoas</h1>
          <p className="text-gray-500 dark:text-gray-400">Dashboard administrativo com arquitetura Safe Envelope.</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95">
          + Novo Funcionário
        </button>
      </header>

      <EmployeeFilter onFilter={setFilters} />
      <EmployeeTable data={employees} isLoading={loading} onEdit={openEditModal} onToggleStatus={handleToggleStatus} />
    </div>
  );
};

export default EmployeeDashboard;
