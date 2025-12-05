import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import showModal from "../../../componentes/modal/hook";
import { toast } from "../../../componentes/toast";
import EmployeeFilter from "./components/EmployeeFilter";
import EmployeeModal from "./components/employeeModal";
import EmployeeTable from "./components/employeeTable";
import { EmployeeService } from "./service";
import type { IEmployee, IEmployeeFilter } from "./types";

const TabEmployeeDashboard = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado para recarregar a tabela
  const [filters, setFilters] = useState<IEmployeeFilter | undefined>(undefined);

  // --- LÓGICA LIMPA (SEM TRY/CATCH) ---
  const loadData = async () => {
    setLoading(true);

    // O Serviço garante o tratamento de exceção e retorna o envelope seguro
    const response = await EmployeeService.getAll(filters);

    if (response.isSuccess && response.data) {
      setEmployees(response.data);
    }
    // Se falhou (isSuccess: false), o serviço já disparou o Toast. 
    // A UI apenas para de carregar.

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSave = async (data: any) => {
    // Salva e recebe o envelope
    const response = await EmployeeService.save(data);

    if (response.isSuccess) {
      toast.success("Funcionário salvo com sucesso!");
      loadData(); // Recarrega tabela
      return true; // Sinaliza para o modal fechar
    }

    // Se falhou, o modal continua aberto. O toast de erro já foi exibido pelo serviço.
    return false;
  };

  const openEditModal = (employee?: IEmployee) => {
    showModal({
      title: <div className="flex items-center gap-2 text-cyan-400"><Users /> <span>{employee ? 'Editar Funcionário' : 'Novo Funcionário'}</span></div>,
      size: 'lg',
      content: ({ onClose }: any) => (
        <EmployeeModal
          employee={employee || null}
          onCancel={onClose}
          onSave={async (data) => {
            // Só fecha o modal se o save retornar sucesso
            const success = await handleSave({ ...employee, ...data });
            if (success) onClose();
          }}
        />
      )
    });
  };

  const handleToggleStatus = async (id: number, status: boolean) => {
    // Optimistic UI: Atualiza na hora
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status } : e));

    // Chama API em background
    const response = await EmployeeService.toggleStatus(id, status);

    if (!response.isSuccess) {
      // Se deu erro, reverte (Rollback)
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: !status } : e));
      // Toast de erro já foi disparado pelo serviço
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-end border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Pessoas</h1>
          <p className="text-gray-400">Dashboard administrativo com filtros avançados.</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold shadow-lg flex items-center gap-2"
        >
          + Novo Funcionário
        </button>
      </header>

      <EmployeeFilter onFilter={setFilters} />

      <EmployeeTable
        data={employees}
        isLoading={loading}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default TabEmployeeDashboard;