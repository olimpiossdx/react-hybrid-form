import React from 'react';

import { DataTable } from '../../componentes/data-table';
import Pagination from '../../componentes/pagination';
import useList from '../../hooks/list';
import { useTable } from '../../hooks/use-table';
// Gera 125 itens para testar paginação
const generateData = () =>
  Array.from({ length: 125 }, (_, i) => ({
    id: i + 1,
    name: `Registro ${i + 1}`,
    status: i % 2 === 0 ? 'Ativo' : 'Pendente',
  }));

const TabPagination = () => {
  // Dados estáticos
  const { items } = useList(generateData());
  const data = items.map((i) => i.data);

  // Tabela com Paginação Client-Side ativada (pageSize: 10)
  const table = useTable({
    data,
    columns: [],
    pagination: { pageSize: 10 },
  });

  // Estado para brincar com os modos no exemplo visual isolado
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <div className="space-y-8 p-4">
      {/* 1. COMPONENTE ISOLADO (Playground) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Componente Isolado</h3>
        <div className="flex flex-col gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-2 bg-gray-100 dark:bg-gray-900 text-xs font-bold uppercase text-center text-gray-500">
              Modo Range (Padrão)
            </div>
            <Pagination currentPage={page} totalCount={500} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-2 bg-gray-100 dark:bg-gray-900 text-xs font-bold uppercase text-center text-gray-500">
              Modo Simple (Mobile)
            </div>
            <Pagination currentPage={page} totalCount={500} pageSize={pageSize} onPageChange={setPage} mode="simple" />
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-2 bg-gray-100 dark:bg-gray-900 text-xs font-bold uppercase text-center text-gray-500">
              Modo Extended (Completo)
            </div>
            <Pagination currentPage={page} totalCount={500} pageSize={pageSize} onPageChange={setPage} mode="extended" />
          </div>
        </div>
      </div>

      {/* 2. INTEGRAÇÃO COM DATATABLE */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col transition-colors">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tabela Paginada</h3>

        {/* ESTRUTURA CORRIGIDA */}
        <DataTable.Root instance={table} className="h-full">
          <DataTable.Container>
            {/* A tag TABLE agora é um componente filho explícito */}
            <DataTable.Table>
              <DataTable.Header>
                <DataTable.HeadCell>ID</DataTable.HeadCell>
                <DataTable.HeadCell>Nome</DataTable.HeadCell>
                <DataTable.HeadCell>Status</DataTable.HeadCell>
              </DataTable.Header>
              <DataTable.Body>
                {table.data.map((row: any) => (
                  <DataTable.Row key={row.id}>
                    <DataTable.Cell>#{row.id}</DataTable.Cell>
                    <DataTable.Cell>{row.name}</DataTable.Cell>
                    <DataTable.Cell>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${row.status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {row.status}
                      </span>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable.Body>
            </DataTable.Table>
          </DataTable.Container>

          <DataTable.Pagination instance={table} mode="extended" />
        </DataTable.Root>
      </div>
    </div>
  );
};

export default TabPagination;
