import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import showModal from "../../../componentes/modal/hook";
import { toast } from "../../../componentes/toast";
import EmployeeModal from "./components/employeeModal";
import EmployeeTable from "./components/employeeTable";
import { EmployeeService } from "./service";
import type { IEmployee, IEmployeeFilter } from "./types";
import EmployeeFilter from "./components/employeeFilter";

const EmployeeDashboard = () => {
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
          toast.success("Funcionário salvo com sucesso!");
          loadData(); 
          return true;
      }
      // Erro já tratado pelo HttpClient/Service (toast automático ou envelope de erro)
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
                      const success = await handleSave({ ...employee, ...data });
                      if (success) onClose();
                  }}
              />
          )
      });
  };

  const handleToggleStatus = async (id: number, status: boolean) => {
      // Optimistic Update
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status } : e));

      const response = await EmployeeService.toggleStatus(id, status);

      if (!response.isSuccess) {
          // Rollback se falhar
          setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: !status } : e));
      }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-end border-b border-gray-700 pb-4">
            <div>
                <h1 className="text-3xl font-bold text-white">Gestão de Pessoas</h1>
                <p className="text-gray-400">Dashboard administrativo com Service Layer segura.</p>
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

export default EmployeeDashboard;