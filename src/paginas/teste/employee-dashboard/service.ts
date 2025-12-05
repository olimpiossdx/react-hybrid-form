import { api } from "../../../service/api";
import type { IApiResponse } from "../../../service/http/types";
import type { IEmployee, IEmployeeFilter } from "./types";

const ROLES = ['Frontend Developer', 'Backend Engineer', 'Product Owner', 'UX Designer'];

// Helper: Transforma o dado cru da API (JSONPlaceholder) no nosso Modelo de Domínio (IEmployee)
// Adiciona campos que a API fake não tem (Rating, Status, Data)
const enrichUser = (user: any): IEmployee => ({
  id: user.id,
  name: user.name,
  email: user.email.toLowerCase(),
  role: ROLES[user.id % ROLES.length],
  rating: (user.id % 5) + 1,
  status: user.id % 2 !== 0, 
  admissionDate: new Date(2020, 0, user.id * 10).toISOString().split('T')[0]
});

export const EmployeeService = {
  
  /**
   * Busca todos os funcionários e aplica filtros em memória (simulação).
   */
  async getAll(filters?: IEmployeeFilter): Promise<IApiResponse<IEmployee[]>> {
    // 1. Chamada Real
    // O smartAdapter no HttpClient detecta que o retorno é um Array e processa corretamente
    const response = await api.get<any[]>('https://jsonplaceholder.typicode.com/users');

    // 2. Tratamento de Negócio (Transformação de Dados)
    if (response.isSuccess && response.data) {
        let employees = response.data.map(enrichUser);

        // Filtro em Memória (Simulando o que um Backend real faria com SQL)
        if (filters) {
            if (filters.term) {
                const t = filters.term.toLowerCase();
                employees = employees.filter(e => e.name.toLowerCase().includes(t) || e.email.includes(t));
            }
            if (filters.role) {
                employees = employees.filter(e => e.role === filters.role);
            }
            if (filters.date_start) {
                employees = employees.filter(e => e.admissionDate >= filters.date_start);
            }
            if (filters.date_end) {
                employees = employees.filter(e => e.admissionDate <= filters.date_end);
            }
        }

        // Retorna o envelope mantendo o status original, mas com dados transformados
        return { ...response, data: employees };
    }

    // Se deu erro, retorna o envelope de erro original
    return response as IApiResponse<IEmployee[]>;
  },

  /**
   * Simula o salvamento de um funcionário.
   */
  async save(data: Partial<IEmployee>): Promise<IApiResponse<IEmployee>> {
    // Simulação de Regra de Negócio Específica (Validação de Backend)
    if (data.name === 'Erro') {
        return {
            isSuccess: false,
            data: null,
            status: 400,
            headers: new Headers(),
            notifications: [],
            error: { code: 'BUSINESS_RULE', message: "Nome inválido (Simulação de Backend)." }
        };
    }

    const response = await api.post<IEmployee>('https://jsonplaceholder.typicode.com/users', data);
    
    // Complementa o dado retornado (pois a API fake retorna objeto incompleto)
    if (response.isSuccess && response.data) {
        const saved = { ...data, id: response.data.id || Math.floor(Math.random() * 1000) } as IEmployee;
        return { ...response, data: saved };
    }

    return response;
  },
  
  /**
   * Altera o status (Ativo/Inativo).
   */
  async toggleStatus(id: number, status: boolean): Promise<IApiResponse<any>> {
     // Se o ID for > 10, forçamos um erro 500 para testar o tratamento de erro na UI
     const url = id > 10 
        ? 'https://httpstat.us/500' 
        : `https://jsonplaceholder.typicode.com/users/${id}`;

     const response = await api.request(url, { 
         method: id > 10 ? 'GET' : 'PATCH', // JSONPlaceholder aceita PATCH
         body: JSON.stringify({ status }) 
     });

     return response;
  }
};