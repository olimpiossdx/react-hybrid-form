import { toast } from "../../../componentes/toast";
import type { IApiResponse } from "../../../service/http/types";
import type { IEmployee, IEmployeeFilter } from "./types";

const ROLES = ['Frontend Developer', 'Backend Engineer', 'Product Owner', 'UX Designer'];

// Helper para gerar dados fakes
const enrichUser = (user: any): IEmployee => ({
  id: user.id,
  name: user.name,
  email: user.email.toLowerCase(),
  role: ROLES[user.id % ROLES.length],
  rating: (user.id % 5) + 1,
  status: user.id % 2 !== 0, 
  admissionDate: new Date(2020, 0, user.id * 10).toISOString().split('T')[0]
});

// Helper para criar Envelope de Sucesso
const success = <T>(data: T): IApiResponse<T> => ({
    data, error: null, isSuccess: true, status: 200, headers: new Headers()
});

// Helper para criar Envelope de Erro (e notificar)
// CORREÇÃO: Usamos 'any' no genérico para que o retorno seja compatível com qualquer tipo de resposta esperado (IEmployee[], boolean, etc)
const failure = (message: string): IApiResponse<any> => {
    // A camada de serviço notifica, a UI não precisa saber
    toast.error(message);
    return {
        data: null, 
        error: { code: 'MOCK_ERROR', message }, 
        isSuccess: false, 
        status: 500, 
        headers: new Headers()
    };
};

export const EmployeeService = {
  // Retorna IApiResponse, garantindo que nunca lança exceção para a UI
  async getAll(filters?: IEmployeeFilter): Promise<IApiResponse<IEmployee[]>> {
    try {
        await new Promise(r => setTimeout(r, 600));

        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) return failure("Erro ao conectar com API externa.");

        const users = await response.json();
        let employees = users.map(enrichUser);

        // Filtro Backend Simulado
        if (filters) {
            if (filters.term) {
                const t = filters.term.toLowerCase();
                employees = employees.filter((e: IEmployee) => e.name.toLowerCase().includes(t) || e.email.includes(t));
            }
            if (filters.role) {
                employees = employees.filter((e: IEmployee) => e.role === filters.role);
            }
        }
        
        return success(employees);

    } catch (e) {
        return failure("Falha crítica no serviço de funcionários.");
    }
  },

  async save(data: Partial<IEmployee>): Promise<IApiResponse<IEmployee>> {
    try {
        await new Promise(r => setTimeout(r, 1000));
        
        // Simulação de Validação de Backend
        if (data.name === 'Erro') return failure("Nome inválido (Simulação de Backend).");

        const saved = { ...data, id: data.id || Math.floor(Math.random() * 1000) } as IEmployee;
        return success(saved);

    } catch (e) {
        return failure("Não foi possível salvar os dados.");
    }
  },
  
  async toggleStatus(_: number, __: boolean): Promise<IApiResponse<boolean>> {
     await new Promise(r => setTimeout(r, 300));
     // Simula sucesso sempre
     return success(true);
  }
};