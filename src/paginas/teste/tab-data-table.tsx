import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Database, Edit2, Mail, RefreshCw, Trash2, XCircle } from 'lucide-react';

// Componentes de UI
import Badge from '../../componentes/badge';
import Button from '../../componentes/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../componentes/card';
// Importa o NOVO componente DataTable (Smart)
import { DataTable, type DataTableColumn } from '../../componentes/data-table';
import { toast } from '../../componentes/toast';

// --- Tipos ---

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'active' | 'inactive' | 'pending';
}

// --- Geração de Dados ---
const generateUsers = (qtd: number): User[] =>
  Array.from({ length: qtd }, (_, i) => ({
    id: String(i + 1),
    name: `Funcionário ${i + 1}`,
    email: `func.${i + 1}@empresa.com`,
    role: i % 3 === 0 ? 'Admin' : 'User',
    status: i % 5 === 0 ? 'inactive' : i % 3 === 0 ? 'pending' : 'active',
  }));

const TabDataTable = () => {
  // Geramos 1000 itens, mas o DataTable lidará com a paginação client-side automaticamente
  const data = useMemo(() => generateUsers(1000), []);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Lista atualizada!');
    }, 1000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remover ${name}?`)) {
      toast.success(`Usuário ${id} removido.`);
    }
  };

  // --- Definição das Colunas ---
  const columns: DataTableColumn<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      width: '80px',
      align: 'center',
      sortable: true,
      cell: (row) => <span className="font-mono text-xs text-gray-500">#{row.id}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Colaborador',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>
          <span className="text-xs text-gray-500">{row.role}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (row) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Mail size={14} /> {row.email}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      align: 'center',
      width: '120px',
      cell: (row) => {
        const variants = {
          active: { color: 'success', icon: CheckCircle2, label: 'Ativo' },
          pending: { color: 'warning', icon: Clock, label: 'Pendente' },
          inactive: { color: 'default', icon: XCircle, label: 'Inativo' },
        };
        const config = variants[row.status];
        const Icon = config.icon;

        return (
          <Badge variant={config.color as any} size="sm" className="gap-1 pl-1">
            <Icon size={12} /> {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Ações',
      align: 'right',
      width: '80px',
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Editar">
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            onClick={() => handleDelete(row.id, row.name)}
            title="Excluir">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6 pb-20 max-w-7xl mx-auto">
      {/* Header da Página */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Database className="text-blue-600" /> Diretório de Pessoal
            </CardTitle>
            <CardDescription>Gerenciamento de {data.length} colaboradores (Client-Side Pagination).</CardDescription>
          </div>

          <Button variant="outline" onClick={handleRefresh} isLoading={isLoading} leftIcon={<RefreshCw size={16} />}>
            Atualizar Dados
          </Button>
        </CardHeader>
      </Card>

      {/* Tabela Inteligente */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-0">
          {/* USANDO O NOVO COMPONENTE */}
          <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            selectable
            searchable
            density="md"
            onRowSelect={(ids) => setSelectedIds(ids)}
          />
        </CardContent>
      </Card>

      {/* Feedback de Seleção */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
          <div className="p-4 bg-gray-900 text-white rounded-lg shadow-xl flex items-center gap-4 border border-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={20} />
              <span className="font-bold">{selectedIds.length} selecionados</span>
            </div>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-200 border-0 h-8"
                onClick={() => alert(selectedIds.join(', '))}>
                Exportar
              </Button>
              <Button size="sm" variant="destructive" className="h-8" onClick={() => setSelectedIds([])}>
                Limpar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabDataTable;
