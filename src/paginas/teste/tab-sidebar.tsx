// src/paginas/teste/tab-sidebar.tsx
import React from 'react';

import { Sidebar } from '../../componentes/sidebar';
// importe seus ícones aqui

export const TabSidebar: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar.Root>
        <Sidebar.Header>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-indigo-600" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Meu Sistema</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Ambiente de teste</span>
              </div>
            </div>

            {/* Botão de abrir/fechar menu no mobile, agora dentro do Provider */}
            <Sidebar.MobileToggle />
          </div>
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Item active>Dashboard</Sidebar.Item>

          <Sidebar.Group title="Cadastros">
            <Sidebar.Item>Clientes</Sidebar.Item>
            <Sidebar.Item>Produtos</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <Sidebar.Item>Logout</Sidebar.Item>
        </Sidebar.Footer>
      </Sidebar.Root>

      <main className="flex-1 bg-gray-50 p-4 dark:bg-gray-900">
        <header className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-800">
          {/* Sem MobileToggle aqui */}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Conteúdo de teste</h1>
        </header>

        <div className="mt-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">Aqui entra o conteúdo da página de teste.</p>
        </div>
      </main>
    </div>
  );
};

export default TabSidebar;
