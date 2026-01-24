// examples/data-table-examples.tsx
import React from 'react';

import { DataTable } from '../../componentes/data-table';
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableHeader, TableRow } from '../../componentes/table';

// -----------------------------------------------------------------------------
// Tipos e mocks
// -----------------------------------------------------------------------------

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

const users: User[] = [
  {
    id: '1',
    name: 'Alice Silva',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Bruno Costa',
    email: 'bruno@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: '2024-02-05',
  },
  {
    id: '3',
    name: 'Carla Lima',
    email: 'carla@example.com',
    role: 'Manager',
    status: 'active',
    createdAt: '2024-03-12',
  },
];

// -----------------------------------------------------------------------------
// Exemplo 1 – Table simples com overflow (desktop-first)
// -----------------------------------------------------------------------------

export function ExampleBasicTable() {
  return (
    <TableContainer>
      <Table density="md">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status === 'active' ? 'Ativo' : 'Inativo'}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              <span className="text-sm text-gray-500">Total de registros: {users.length}</span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 2 – DataTable “smart” com seleção, busca e expand
// (usa DataTableSmart por default: paginação local, ordenação local, search)
// -----------------------------------------------------------------------------

const dataTableColumns = [
  {
    accessorKey: 'name',
    header: 'Nome',
    sortable: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (row: User) =>
      row.status === 'active' ? (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Ativo</span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">Inativo</span>
      ),
  },
] as const;

export function ExampleDataTableSmart() {
  const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([]);

  return (
    <div className="space-y-4">
      <DataTable<User>
        data={users}
        columns={dataTableColumns as any}
        density="md"
        selectable
        searchable
        onRowSelect={setSelectedIds}
        renderSubComponent={(row) => (
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">ID:</span> {row.id}
            </div>
            <div>
              <span className="font-medium">Email:</span> {row.email}
            </div>
            <div>
              <span className="font-medium">Criado em:</span> {row.createdAt}
            </div>
          </div>
        )}
      />

      {selectedIds.length > 0 && <p className="text-sm text-gray-600">Selecionados: {selectedIds.join(', ')}</p>}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 3 – DataTable responsivo “cards” no mobile
// (conceito inspirado no CodePen: cada linha vira card em telas pequenas)
// -----------------------------------------------------------------------------

/**
 * Ideia: usamos a mesma API de DataTable, mas configuramos as colunas
 * de forma que no mobile cada célula vira um “bloco” com label.
 *
 * A parte responsiva (CSS) fica na implementação da Table base / theme:
 *  - em breakpoint pequeno, o TableRow vira display:block;
 *  - cada TableCell recebe um pseudo-elemento com o label da coluna.
 *
 * Aqui só mostramos como ficaria o uso no nível de DataTable.
 */

const responsiveColumns = [
  {
    accessorKey: 'name',
    header: 'Nome',
    sortable: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (row: User) => (row.status === 'active' ? 'Ativo' : 'Inativo'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
  },
] as const;

export function ExampleDataTableResponsiveCards() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        Em telas pequenas, cada linha é renderizada como card empilhado. Em telas maiores, continua sendo uma tabela normal.
      </p>

      <DataTable<User> data={users} columns={responsiveColumns as any} density="sm" searchable />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Agrupador para playground / storybook
// -----------------------------------------------------------------------------

function TabTableComplexo() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-base font-semibold">Exemplo 1 – Table básica</h2>
        <p className="text-sm text-gray-500">Tabela simples, apenas com overflow horizontal e densidade padrão.</p>
        <ExampleBasicTable />
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Exemplo 2 – DataTable com seleção, busca e detalhes</h2>
        <p className="text-sm text-gray-500">
          Usa a implementação “smart”: ordenação local, seleção de linha, expand/collapse e busca global.
        </p>
        <ExampleDataTableSmart />
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Exemplo 3 – DataTable responsivo (cards no mobile)</h2>
        <p className="text-sm text-gray-500">
          Mesmo DataTable, mas preparado para o comportamento responsivo onde cada linha vira um card em telas pequenas.
        </p>
        <ExampleDataTableResponsiveCards />
      </section>
    </div>
  );
}
export default TabTableComplexo;
