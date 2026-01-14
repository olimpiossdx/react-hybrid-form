import React from 'react';
import { Loader2 } from 'lucide-react';

import Button from '../../componentes/button';
import { Spinner } from '../../componentes/spinner';

const TabSpinner: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6 pb-20">
      {/* Header */}
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <Loader2 className="animate-spin-slow" size={32} /> Componente Spinner
        </h2>
        <p className="text-gray-500 mt-2">Indicadores de carregamento leves, acessíveis e flexíveis baseados em SVG.</p>
      </div>

      {/* 1. Tamanhos */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Tamanhos Disponíveis</h3>
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" className="text-blue-600" />
            <span className="text-xs text-gray-400 font-mono">sm (16px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" className="text-blue-600" />
            <span className="text-xs text-gray-400 font-mono">md (24px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" className="text-blue-600" />
            <span className="text-xs text-gray-400 font-mono">lg (48px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xl" className="text-blue-600" />
            <span className="text-xs text-gray-400 font-mono">xl (64px)</span>
          </div>
        </div>
      </section>

      {/* 2. Cores e Contexto */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Cores e Contexto (Tailwind)</h3>
        <p className="text-sm text-gray-500 mb-4">
          O Spinner herda a cor do texto (currentColor), facilitando a customização via classes utilitárias.
        </p>

        <div className="flex flex-wrap gap-6 mb-8">
          <Spinner size="md" className="text-gray-400" />
          <Spinner size="md" className="text-red-500" />
          <Spinner size="md" className="text-yellow-500" />
          <Spinner size="md" className="text-green-500" />
          <Spinner size="md" className="text-indigo-600" />
          <Spinner size="md" className="text-pink-500" />
        </div>

        <div className="p-4 bg-gray-900 rounded-lg flex gap-4">
          <span className="text-white text-sm self-center">Em fundo escuro:</span>
          <Spinner size="md" className="text-white" />
          <Spinner size="md" className="text-blue-400" />
        </div>
      </section>

      {/* 3. Integração com Botões */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Uso em Botões (Estados de Loading)</h3>

        <div className="flex flex-wrap gap-4">
          <Button disabled variant="primary" className="flex items-center justify-center gap-2 px-4 py-2">
            <Spinner size="sm" className="text-white" />
            Salvando...
          </Button>

          <Button disabled variant="outline" className="flex items-center justify-center gap-2 px-4 py-2">
            <Spinner size="sm" />
            Processando
          </Button>

          <Button disabled variant="secondary" className="w-10 h-10 p-0 rounded-full flex items-center justify-center">
            <Spinner size="sm" />
          </Button>
        </div>
      </section>

      {/* 4. Overlay / Card Loading */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden min-h-[200px]">
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Overlay de Carregamento</h3>
        <p className="text-gray-500 mb-4">Simulação de carregamento de conteúdo.</p>

        {/* Conteúdo Falso de Fundo */}
        <div className="space-y-3 opacity-20 filter blur-[1px]">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-32 bg-gray-100 rounded w-full mt-4"></div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <Spinner size="lg" className="text-blue-600 mb-3" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Carregando dados...</span>
        </div>
      </section>
    </div>
  );
};

export default TabSpinner;
