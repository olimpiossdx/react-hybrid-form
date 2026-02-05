import React from 'react';
import {
  Bell,
  CreditCard,
  FilePlus,
  FolderOpen,
  Github,
  LayoutList,
  LogOut,
  MoreVertical,
  Plus,
  Save,
  Search,
  Settings,
  SunMedium,
  Trash2,
  User,
} from 'lucide-react';

import Badge from '../../componentes/badge';
import Button from '../../componentes/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../componentes/card';
import {
  DropdownContent,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  type DropdownMenuItemDef,
  DropdownSeparator,
  DropdownTrigger,
} from '../../componentes/dropdown-menu';
import Input from '../../componentes/input';

// ============================================================================
// 1. Menu "Arquivo" (data-driven com button)
// ============================================================================

const fileItems: DropdownMenuItemDef[] = [
  {
    as: 'button',
    label: 'Novo arquivo',
    icon: FilePlus,
    shortcut: '⌘+N',
    props: {
      type: 'button',
      onClick: () => console.log('Novo arquivo'),
    },
  },
  {
    as: 'button',
    label: 'Abrir...',
    icon: FolderOpen,
    shortcut: '⌘+O',
    props: {
      type: 'button',
      onClick: () => console.log('Abrir arquivo'),
    },
  },
  {
    as: 'button',
    label: 'Salvar',
    icon: Save,
    shortcut: '⌘+S',
    props: {
      type: 'button',
      onClick: () => console.log('Salvar'),
    },
  },
  {
    as: 'button',
    label: 'Salvar como...',
    shortcut: '⇧+⌘+S',
    props: {
      type: 'button',
      onClick: () => console.log('Salvar como'),
    },
  },
  {
    as: 'button',
    separator: true,
    label: 'Mover para lixeira',
    icon: Trash2,
    variant: 'destructive',
    props: {
      type: 'button',
      onClick: () => console.log('Mover para lixeira'),
    },
  },
];

export function FileMenuExample() {
  return (
    <DropdownMenu
      trigger={<button className="px-3 py-2 rounded-md bg-slate-900 text-white">Arquivo</button>}
      items={fileItems}
      width="w-64"
    />
  );
}

// ============================================================================
// 2. Menu de Usuário (data-driven com a, input, button)
// ============================================================================

const userItems: DropdownMenuItemDef[] = [
  {
    as: 'input',
    label: 'Buscar',
    props: {
      type: 'text',
      placeholder: 'Buscar opções...',
      className: 'w-full px-2 py-1 mb-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500',
      onChange: (e) => console.log('Filtro:', e.target.value),
    },
  },
  {
    as: 'a',
    label: 'Meu perfil',
    icon: User,
    props: {
      href: '#perfil',
      onClick: (e) => {
        e.preventDefault();
        console.log('Ir para perfil');
      },
    },
  },
  {
    as: 'a',
    label: 'Notificações',
    icon: Bell,
    props: {
      href: '#notificacoes',
    },
  },
  {
    as: 'a',
    label: 'Configurações',
    icon: Settings,
    props: {
      href: '#config',
    },
  },
  {
    as: 'button',
    separator: true,
    label: 'Sair',
    icon: LogOut,
    variant: 'destructive',
    props: {
      type: 'button',
      onClick: () => console.log('Logout'),
    },
  },
];

export function UserMenuDataDrivenExample() {
  return (
    <DropdownMenu
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-slate-100">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">U</span>
          <span className="text-sm font-medium">Usuário</span>
        </button>
      }
      items={userItems}
      width="w-72"
    />
  );
}

// ============================================================================
// 3. Menu de Usuário (compound API mais rica)
// ============================================================================

export function UserMenuCompoundExample() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  return (
    <DropdownMenu>
      <DropdownTrigger>
        <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-slate-100">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">U</span>
          <span className="text-sm font-medium">Usuário</span>
        </button>
      </DropdownTrigger>

      <DropdownContent width="w-72">
        <DropdownHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm">U</div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">Usuário Demo</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">usuario@dominio.com</span>
            </div>
          </div>
        </DropdownHeader>

        <DropdownLabel>Conta</DropdownLabel>

        <DropdownItem as="a" href="#perfil" icon={User}>
          Meu perfil
        </DropdownItem>

        <DropdownItem as="a" href="#notificacoes" icon={Bell}>
          Notificações
        </DropdownItem>

        <DropdownSeparator />

        <DropdownLabel>Preferências</DropdownLabel>

        <DropdownItem
          as="button"
          onClick={(e) => {
            e.preventDefault();
            setNotificationsEnabled((prev) => !prev);
          }}>
          {notificationsEnabled ? 'Desativar notificações' : 'Ativar notificações'}
        </DropdownItem>

        <DropdownItem
          as="button"
          icon={theme === 'light' ? SunIcon : MoonIcon}
          onClick={(e) => {
            e.preventDefault();
            setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
          }}>
          Tema: {theme === 'light' ? 'Claro' : 'Escuro'}
        </DropdownItem>

        <DropdownSeparator />

        <DropdownItem as="button" variant="destructive" icon={LogOut} onClick={() => console.log('Logout')}>
          Sair
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return <SunMedium {...props} />;
}
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Search {...props} />;
}

// ============================================================================
// 4. Menu contextual usando div, span, li
// ============================================================================

const contextualItems: DropdownMenuItemDef[] = [
  {
    as: 'li',
    label: 'Item de lista 1',
    props: {
      className: 'list-none px-2 py-1',
      onClick: () => console.log('Item 1'),
    },
  },
  {
    as: 'li',
    label: 'Item de lista 2',
    props: {
      className: 'list-none px-2 py-1',
      onClick: () => console.log('Item 2'),
    },
  },
  {
    as: 'div',
    separator: true,
    label: 'Bloco informativo',
    props: {
      className: 'px-2 py-2 text-xs text-slate-500',
    },
  },
  {
    as: 'span',
    label: 'Texto simples',
    props: {
      className: 'px-2 py-1 text-xs text-slate-400',
    },
  },
];

export function ContextMenuExample() {
  return <DropdownMenu trigger={<button className="px-2 py-1 border rounded">Mais opções</button>} items={contextualItems} width="w-60" />;
}

const TabDropdownShowcase: React.FC = () => {
  // CONFIGURAÇÃO PARA MODO PADRÃO (DATA DRIVEN)
  const items: DropdownMenuItemDef[] = [
    {
      as: 'a',
      props: {
        draggable: true,
        href: '#perfil',
        onClick: (e) => {
          console.log(' e', e);
        },
        onMouseEnter: () => {},
      },
      label: 'Meu Perfil',
      icon: User,
    },
    {
      as: 'button',
      props: {
        type: 'button',
        onClick: () => alert('Sair'),
      },
      label: 'Sair',
      variant: 'destructive',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 pb-40">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dropdown Menu</h2>
        <p className="text-gray-500 mt-2">Flexibilidade total: De listas simples a layouts complexos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CENÁRIO 1: MODO PADRÃO (DATA DRIVEN) */}
        <Card>
          <CardHeader>
            <CardTitle>1. Modo Padrão (Array)</CardTitle>
            <CardDescription>
              Ideal para menus simples. Passe apenas <code>items</code> e <code>trigger</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <DropdownMenu trigger={<Button variant="outline">Opções Rápidas</Button>} items={items} />
          </CardContent>
        </Card>

        {/* CENÁRIO 2: MODO CUSTOMIZADO + POLIMORFISMO */}
        <Card>
          <CardHeader>
            <CardTitle>2. Modo Customizado (Compound)</CardTitle>
            <CardDescription>
              Uso de <code>children</code> para layout livre e prop <code>as</code> para links.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md gap-4">
            {/* Exemplo A: Gatilho Customizado (Badge) */}
            <DropdownMenu>
              <DropdownTrigger>
                {/* O trigger pode ser qualquer coisa, ex: um Badge clicável */}
                <div className="cursor-pointer">
                  <Badge variant="info" className="gap-2 px-3 py-1">
                    Status: Online <MoreVertical size={14} />
                  </Badge>
                </div>
              </DropdownTrigger>

              <DropdownContent width="w-56">
                <DropdownLabel>Alterar Status</DropdownLabel>
                <DropdownItem>Disponível</DropdownItem>
                <DropdownItem>Ocupado</DropdownItem>
                <DropdownItem>Invisível</DropdownItem>
              </DropdownContent>
            </DropdownMenu>

            {/* Exemplo B: Avatar Trigger + Links */}
            <DropdownMenu>
              <DropdownTrigger>
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-purple-600 cursor-pointer shadow-md hover:scale-105 transition-transform" />
              </DropdownTrigger>

              <DropdownContent width="w-64">
                <DropdownHeader>
                  <p className="font-bold text-sm">Pedro Duarte</p>
                  <p className="text-xs text-gray-500">pedro@empresa.com</p>
                </DropdownHeader>

                <DropdownSeparator />

                <DropdownItem icon={User}>Editar Perfil</DropdownItem>

                {/* POLIMORFISMO: Renderizando como Link <a> */}
                <DropdownItem as="a" href="https://github.com" target="_blank" icon={Github} className="text-blue-600 dark:text-blue-400">
                  GitHub (Link Externo)
                </DropdownItem>

                <DropdownItem icon={CreditCard} disabled>
                  Faturamento (Bloqueado)
                </DropdownItem>

                <DropdownSeparator />

                <DropdownItem variant="destructive" icon={LogOut}>
                  Sair
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* CENÁRIO 3: INTERATIVIDADE INTERNA */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>3. Conteúdo Rico & Interativo</CardTitle>
            <CardDescription>Inserindo Inputs e Botões dentro do Dropdown sem fechar automaticamente.</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <DropdownMenu>
              <DropdownTrigger>
                <Button variant="primary" leftIcon={<Plus size={16} />}>
                  Nova Tarefa
                </Button>
              </DropdownTrigger>

              <DropdownContent width="w-72">
                <DropdownLabel>Criar Rapidamente</DropdownLabel>

                {/* Item como 'div' para não ser clicável/interativo padrão */}
                <div className="p-2">
                  <Input placeholder="Nome da tarefa..." className="mb-2" autoFocus name={'task'} />
                  <div className="flex gap-2">
                    <Button size="sm" fullWidth onClick={() => alert('Criado!')}>
                      Criar
                    </Button>
                  </div>
                </div>

                <DropdownSeparator />

                <DropdownItem icon={LayoutList}>Ver todas as tarefas</DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* CENÁRIO 3: INTERATIVIDADE INTERNA */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Menu de Usuário (compound API mais rica)</CardTitle>
            <CardDescription>Inserindo Inputs e Botões dentro do Dropdown sem fechar automaticamente.</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <ContextMenuExample />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Menu de Usuário (data-driven com a, input, button)</CardTitle>
            <CardDescription>Inserindo Inputs e Botões dentro do Dropdown sem fechar automaticamente.</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <UserMenuCompoundExample />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Menu de Usuário (compound API mais rica)</CardTitle>
            <CardDescription>Inserindo Inputs e Botões dentro do Dropdown sem fechar automaticamente.</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <UserMenuDataDrivenExample />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Menu "Arquivo" (data-driven com button)</CardTitle>
            <CardDescription>Inserindo Inputs e Botões dentro do Dropdown sem fechar automaticamente.</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <FileMenuExample />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabDropdownShowcase;
