import React from 'react';
import { CreditCard, Github, LayoutList, LogOut, MoreVertical, Plus, User } from 'lucide-react';

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
      </div>
    </div>
  );
};

export default TabDropdownShowcase;
