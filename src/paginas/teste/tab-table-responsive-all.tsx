// examples/tab-table-responsive-all.tsx
import React from 'react';

import { DataTable, type DataTableColumn } from '../../componentes/data-table';
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableHeader, TableRow } from '../../componentes/table';

// -----------------------------------------------------------------------------
// Tipos e dados base
// -----------------------------------------------------------------------------

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

const USERS: User[] = [
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

// Colunas base que serão reutilizadas nos modos de DataTable
const BASE_COLUMNS: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    sortable: true,
    priority: 'high',
    mobileLabel: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortable: true,
    priority: 'medium',
    mobileLabel: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
    priority: 'medium',
    mobileLabel: 'Cargo',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    priority: 'high',
    mobileLabel: 'Situação',
    cell: (row) => (row.status === 'active' ? 'Ativo' : 'Inativo'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    priority: 'low',
    mobileLabel: 'Criado em',
  },
];

// -----------------------------------------------------------------------------
// Exemplo extra – Layout do CodePen (Statement Summary)
// -----------------------------------------------------------------------------

type StatementItem = {
  id: string;
  account: string;
  dueDate: string;
  amount: string;
  period: string;
};

const STATEMENT_DATA: StatementItem[] = [
  {
    id: '1',
    account: 'Visa - 3412',
    dueDate: '02/01/2016',
    amount: '$1,181',
    period: '01/01/2016 - 01/31/2016',
  },
  {
    id: '2',
    account: 'Visa - 6076',
    dueDate: '03/01/2016',
    amount: '$2,443',
    period: '02/01/2016 - 02/29/2016',
  },
  {
    id: '3',
    account: 'Corporate AMEX',
    dueDate: '03/01/2016',
    amount: '$1,181',
    period: '02/01/2016 - 02/29/2016',
  },
];

const STATEMENT_COLUMNS: DataTableColumn<StatementItem>[] = [
  {
    accessorKey: 'account',
    header: 'Account',
    priority: 'high',
    mobileLabel: 'Account',
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    priority: 'high',
    mobileLabel: 'Due Date',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    priority: 'high',
    mobileLabel: 'Amount',
  },
  {
    accessorKey: 'period',
    header: 'Period',
    priority: 'medium',
    mobileLabel: 'Period',
  },
];

function ExampleCodePenLikeStack() {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">Exemplo CodePen – Statement Summary</h3>
      <p className="text-sm text-gray-500">
        Reimplementação do padrão do CodePen usando o modo <code>stack</code> da DataTable: cabeçalho oculto em telas pequenas e labels via{' '}
        <code>data-label</code> em cada célula.
      </p>

      <DataTable<StatementItem> data={STATEMENT_DATA} columns={STATEMENT_COLUMNS} density="sm" responsiveMode="stack" />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 1 – none / scroll (Table simples)
// -----------------------------------------------------------------------------

function ExampleResponsiveNoneScroll() {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">Modo none / scroll</h3>
      <p className="text-sm text-gray-500">
        Tabela simples com overflow horizontal (desktop-first). Use o container para permitir scroll em telas pequenas.
      </p>

      <TableContainer>
        <Table density="md" responsiveMode="scroll">
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
            {USERS.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.status === 'active' ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell>{u.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <span className="text-sm text-gray-500">Total de registros: {USERS.length}</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 2 – shorten (esconde colunas de baixa prioridade em mobile)
// -----------------------------------------------------------------------------

function ExampleResponsiveShorten() {
  const columns: DataTableColumn<User>[] = BASE_COLUMNS.map((c) =>
    c.accessorKey === 'createdAt' ? { ...c, priority: 'low', hideOnMobile: true } : c,
  );

  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">Modo shorten</h3>
      <p className="text-sm text-gray-500">
        Em telas pequenas, esconde colunas de baixa prioridade (ex.: data de criação), mantendo nome, email e status visíveis.
      </p>

      <DataTable<User> data={USERS} columns={columns} density="md" searchable responsiveMode="shorten" />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 3 – stack (estilo CodePen: labels via data-label)
// -----------------------------------------------------------------------------

function ExampleResponsiveStack() {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">Modo stack</h3>
      <p className="text-sm text-gray-500">
        Em telas pequenas, o cabeçalho some e cada linha vira um bloco empilhado, com labels à esquerda (via data-label) e valores à
        direita.
      </p>

      <DataTable<User> data={USERS} columns={BASE_COLUMNS} density="sm" responsiveMode="stack" />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 4 – cards (stack + visual de card)
// -----------------------------------------------------------------------------

function ExampleResponsiveCards() {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">Modo cards</h3>
      <p className="text-sm text-gray-500">
        Mesmo comportamento estrutural do stack, mas com visual de card em telas pequenas (borda, fundo e sombra).
      </p>

      <DataTable<User> data={USERS} columns={BASE_COLUMNS} density="sm" responsiveMode="cards" />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 5 – compare (prioriza colunas críticas em mobile)
// -----------------------------------------------------------------------------

function ExampleResponsiveCompare() {
  const columns: DataTableColumn<User>[] = BASE_COLUMNS.map((c) => (c.accessorKey === 'role' ? { ...c, priority: 'low' } : c));

  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">Modo compare</h3>
      <p className="text-sm text-gray-500">
        Em telas pequenas, prioriza colunas de maior importância para comparação (nome, email e status) e reduz detalhes.
      </p>

      <DataTable<User> data={USERS} columns={columns} density="md" responsiveMode="compare" />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Exemplo 6 – accordion (stack/cards + renderSubComponent)
// -----------------------------------------------------------------------------

function ExampleResponsiveAccordion() {
  const columns: DataTableColumn<User>[] = BASE_COLUMNS;

  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold">Modo accordion</h3>
      <p className="text-sm text-gray-500">Combina layout empilhado com detalhes expansíveis por linha, usando renderSubComponent.</p>

      <DataTable<User>
        data={USERS}
        columns={columns}
        density="sm"
        responsiveMode="accordion"
        selectable
        searchable
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
            <div>
              <span className="font-medium">Status:</span> {row.status === 'active' ? 'Ativo' : 'Inativo'}
            </div>
          </div>
        )}
      />
    </section>
  );
}

// -----------------------------------------------------------------------------
// Showcase geral – Tab principal
// -----------------------------------------------------------------------------

const TabTableResponsiveAll: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 pb-24">
      <header className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Tabelas Responsivas – Modos de Layout</h2>
        <p className="text-gray-500 mt-2">
          Demonstração dos modos none/scroll, shorten, stack, cards, compare e accordion aplicados à mesma fonte de dados.
        </p>
      </header>

      <ExampleResponsiveNoneScroll />
      <ExampleResponsiveShorten />
      <ExampleResponsiveStack />
      <ExampleResponsiveCards />
      <ExampleResponsiveCompare />
      <ExampleResponsiveAccordion />
      <ExampleCodePenLikeStack />
    </div>
  );
};

export default TabTableResponsiveAll;
