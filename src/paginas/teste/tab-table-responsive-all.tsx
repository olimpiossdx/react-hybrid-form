/**
 * ===========================================================================
 * DEMONSTRAÇÃO COMPLETA: TABELAS RESPONSIVAS
 * ===========================================================================
 *
 * Este arquivo demonstra TODAS as soluções de tabelas responsivas baseadas no
 * artigo do Medium: "5 Practical Solutions to Make Responsive Data Tables"
 *
 * MODOS IMPLEMENTADOS:
 * 1. SCROLL (Moveable) - Scroll horizontal com overflow
 * 2. SHORTEN - Esconde colunas de baixa prioridade em mobile
 * 3. STACK - Labels via data-label, layout empilhado
 * 4. CARDS - Stack com visual de card
 * 5. ACCORDION - Stack + detalhes expansíveis
 * 6. COMPARE - Prioriza colunas para comparação
 * ===========================================================================
 */
import React, { useState } from 'react';
import { ChevronDown, CreditCard, Eye, Info, Layers, Layout, List, Repeat } from 'lucide-react';

import { DataTable, type DataTableColumn } from '../../componentes/data-table';
import { cn } from '../../utils/cn';

// -----------------------------------------------------------------------------
// Tipos e dados base
// -----------------------------------------------------------------------------
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  phone: string;
  location: string;
  createdAt: string;
  lastLogin: string;
};

const USERS: User[] = [
  {
    id: '1',
    name: 'Alice Silva',
    email: 'alice@example.com',
    role: 'Admin',
    department: 'TI',
    status: 'active',
    phone: '(11) 98765-4321',
    location: 'São Paulo',
    createdAt: '2024-01-10',
    lastLogin: '2024-02-15 10:30',
  },
  {
    id: '2',
    name: 'Bruno Costa',
    email: 'bruno@example.com',
    role: 'User',
    department: 'Vendas',
    status: 'inactive',
    phone: '(21) 97654-3210',
    location: 'Rio de Janeiro',
    createdAt: '2024-02-05',
    lastLogin: '2024-02-10 14:20',
  },
  {
    id: '3',
    name: 'Carla Lima',
    email: 'carla@example.com',
    role: 'Manager',
    department: 'RH',
    status: 'active',
    phone: '(31) 96543-2109',
    location: 'Belo Horizonte',
    createdAt: '2024-03-12',
    lastLogin: '2024-03-15 09:15',
  },
  {
    id: '4',
    name: 'Daniel Oliveira',
    email: 'daniel@example.com',
    role: 'Developer',
    department: 'TI',
    status: 'active',
    phone: '(41) 95432-1098',
    location: 'Curitiba',
    createdAt: '2024-01-20',
    lastLogin: '2024-02-14 16:45',
  },
  {
    id: '5',
    name: 'Elena Ferreira',
    email: 'elena@example.com',
    role: 'Designer',
    department: 'Marketing',
    status: 'active',
    phone: '(51) 94321-0987',
    location: 'Porto Alegre',
    createdAt: '2024-01-15',
    lastLogin: '2024-02-15 16:30',
  },
];

const BASE_COLUMNS: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    sortable: true,
    priority: 'high',
    mobileLabel: 'Nome',
    width: '200px',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortable: true,
    priority: 'medium',
    mobileLabel: 'Email',
    width: '250px',
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
    priority: 'medium',
    mobileLabel: 'Cargo',
    width: '150px',
  },
  {
    accessorKey: 'department',
    header: 'Departamento',
    priority: 'medium',
    mobileLabel: 'Depto.',
    width: '140px',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    priority: 'high',
    mobileLabel: 'Situação',
    width: '100px',
    align: 'center',
    cell: (row) => (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          row.status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        )}>
        {row.status === 'active' ? 'Ativo' : 'Inativo'}
      </span>
    ),
  },
  {
    accessorKey: 'location',
    header: 'Localização',
    priority: 'low',
    mobileLabel: 'Cidade',
    width: '150px',
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    priority: 'low',
    mobileLabel: 'Tel.',
    width: '140px',
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    priority: 'low',
    mobileLabel: 'Cadastro',
    width: '120px',
  },
];

// -----------------------------------------------------------------------------
// COMPONENTE DE DOCUMENTAÇÃO/INFO
// -----------------------------------------------------------------------------
type InfoBoxProps = {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  useCase: string;
  mode: string;
  icon?: React.ReactNode;
};

function InfoBox({ title, description, pros, cons, useCase, mode, icon = <Info /> }: InfoBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">{icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
              {title}
              <code className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded font-mono">{mode}</code>
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">{description}</p>

            {isExpanded && (
              <div className="space-y-3 mt-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1.5 flex items-center gap-1.5">
                      <span className="text-green-600">✅</span> Vantagens:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-700 dark:text-blue-300 pl-1">
                      {pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1.5 flex items-center gap-1.5">
                      <span className="text-amber-600">⚠️</span> Desvantagens:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-700 dark:text-blue-300 pl-1">
                      {cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200/50 dark:border-blue-800/50">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-1.5">🚀 Melhor uso:</p>
                  <p className="text-blue-700 dark:text-blue-300">{useCase}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded transition-colors"
          title={isExpanded ? 'Ver menos' : 'Ver mais detalhes'}>
          <ChevronDown className={cn('w-5 h-5 transition-transform duration-300', isExpanded && 'rotate-180')} />
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// EXEMPLOS
// -----------------------------------------------------------------------------

function Example01Scroll() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">1. Modo SCROLL (Nativo)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Mantém o layout original e permite scroll horizontal.</p>
      </div>
      <InfoBox
        mode="responsiveMode='scroll'"
        title="Scroll - O Clássico"
        description="A tabela mantém sua estrutura original. O container permite o movimento horizontal em telas pequenas."
        pros={['Preserva o layout original', 'Fácil comparação entre colunas', 'Baixo esforço de implementação']}
        cons={['Pode ser difícil de navegar em telas muito pequenas', 'Usuário pode não perceber o scroll']}
        useCase="Tabelas complexas onde a relação entre colunas é vital"
        icon={<Layout />}
      />
      <DataTable<User> data={USERS} columns={BASE_COLUMNS} density="sm" responsiveMode="scroll" />
    </section>
  );
}

function Example02Shorten() {
  const columns: DataTableColumn<User>[] = BASE_COLUMNS.map((col) => {
    if (['phone', 'location', 'createdAt', 'lastLogin'].includes(String(col.accessorKey))) {
      return { ...col, hideOnMobile: true, priority: 'low' };
    }
    return col;
  });

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">2. Modo SHORTEN (Encurtar)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Esconde colunas menos importantes em mobile.</p>
      </div>
      <InfoBox
        mode="responsiveMode='shorten'"
        title="Shorten - Menos é Mais"
        description="Remove colunas não essenciais em mobile, mantendo apenas o que é crucial."
        pros={['Layout limpo', 'Não exige scroll', 'Melhor para leitura rápida']}
        cons={['Informação é ocultada do usuário', 'Exige decisão editorial sobre o que é importante']}
        useCase="Listas de produtos, catálogos, onde alguns dados são secundários"
        icon={<List />}
      />
      <DataTable<User> data={USERS} columns={columns} density="sm" responsiveMode="shorten" />
    </section>
  );
}

function Example03Stack() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">3. Modo STACK (Empilhado)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Transforma cada linha em um bloco com labels inline.</p>
      </div>
      <InfoBox
        mode="responsiveMode='stack'"
        title="Stack - Layout Mobile-First"
        description="Transforma a tabela em uma lista de blocos onde cada célula exibe seu label."
        pros={['Aproveita 100% da largura mobile', 'Nenhuma informação é perdida', 'Acessível']}
        cons={['Ocupa muito espaço vertical', 'Dificulta comparação direta entre itens']}
        useCase="Formulários, listagens detalhadas de usuários ou processos"
        icon={<Layers />}
      />
      <DataTable<User> data={USERS} columns={BASE_COLUMNS} density="sm" responsiveMode="stack" />
    </section>
  );
}

function Example04Cards() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">4. Modo CARDS (Visual Moderno)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Stack com visual de cartões separados.</p>
      </div>
      <InfoBox
        mode="responsiveMode='cards'"
        title="Cards - Estilo Aplicativo"
        description="Semelhante ao Stack, mas com separação visual clara entre os registros."
        pros={['Visual moderno e limpo', 'Fácil separação entre registros', 'Excelente UX mobile']}
        cons={['Pode alongar muito a página', 'Não ideal para comparação massiva de dados']}
        useCase="E-commerce, portfólios, cards de perfil"
        icon={<CreditCard />}
      />
      <DataTable<User> data={USERS.slice(0, 3)} columns={BASE_COLUMNS.slice(0, 5)} density="sm" responsiveMode="cards" />
    </section>
  );
}

function Example05Accordion() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">5. Modo ACCORDION (Expansível)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Stack que esconde detalhes extras em um sub-componente.</p>
      </div>
      <InfoBox
        mode="responsiveMode='accordion'"
        title="Accordion - Detalhes sob Demanda"
        description="Mantém o essencial visível e permite expandir para ver o restante dos dados."
        pros={['Economiza espaço vertical', 'Foco no conteúdo principal', 'Suporta sub-componentes ricos']}
        cons={['Exige ação do usuário (clique)', 'Atraso na visualização completa']}
        useCase="Sistemas complexos, logs, auditorias"
        icon={<Eye />}
      />
      <DataTable<User>
        data={USERS}
        columns={BASE_COLUMNS.slice(0, 4)}
        density="sm"
        responsiveMode="accordion"
        renderSubComponent={(row) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Informações de Contato</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-gray-500">Email:</span> {row.email}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Telefone:</span> {row.phone}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Localização:</span> {row.location}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Metadados</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-gray-500">ID:</span> {row.id}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Criado em:</span> {row.createdAt}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Último Login:</span> {row.lastLogin}
                </p>
              </div>
            </div>
          </div>
        )}
      />
    </section>
  );
}

function Example06Compare() {
  const columns: DataTableColumn<User>[] = BASE_COLUMNS.map((col) => {
    // Prioriza Nome e Status para comparação
    if (['name', 'status', 'role'].includes(String(col.accessorKey))) {
      return { ...col, priority: 'high' };
    }
    return { ...col, priority: 'low' };
  });

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">6. Modo COMPARE (Comparação)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Prioriza colunas específicas para facilitar a comparação.</p>
      </div>
      <InfoBox
        mode="responsiveMode='compare'"
        title="Compare - Foco Competitivo"
        description="Similar ao Shorten, mas otimizado para manter colunas 'High Priority' sempre lado a lado."
        pros={['Facilita comparação entre linhas', 'Mantém o contexto crítico visível', 'Visual otimizado']}
        cons={['Pode esconder muitos detalhes', 'Sensível à largura das colunas prioritárias']}
        useCase="Comparativo de planos, preços, especificações técnicas"
        icon={<Repeat />}
      />
      <DataTable<User> data={USERS} columns={columns} density="sm" responsiveMode="compare" />
    </section>
  );
}

// -----------------------------------------------------------------------------
// MAIN PAGE
// -----------------------------------------------------------------------------

const TabTableResponsiveAll: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: 'Scroll', component: <Example01Scroll /> },
    { id: 1, label: 'Shorten', component: <Example02Shorten /> },
    { id: 2, label: 'Stack', component: <Example03Stack /> },
    { id: 3, label: 'Cards', component: <Example04Cards /> },
    { id: 4, label: 'Accordion', component: <Example05Accordion /> },
    { id: 5, label: 'Compare', component: <Example06Compare /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Tabelas Responsivas</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          Exploração completa das estratégias de responsividade baseadas no artigo do Medium. Cada modo resolve um desafio específico de UX
          em telas pequenas.
        </p>
      </header>

      {/* Navegação de Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-800 pb-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50',
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in slide-in-from-left-2 duration-300">{tabs[activeTab].component}</div>

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-500 italic">
          Demonstração gerada para fins de teste de arquitetura de componentes.
        </p>
      </footer>
    </div>
  );
};

export default TabTableResponsiveAll;
