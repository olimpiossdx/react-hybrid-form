import React, { useState } from 'react';
import { ArrowRight, Github, Layout, Mail, MousePointer2, Palette, Settings, Sparkles, Zap } from 'lucide-react';

import Button from '../../componentes/button';

const TabButtonExample: React.FC = () => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  // Helper para simular loading individual por botão
  const handleLoad = (id: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {/* HEADER */}
      <header className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <MousePointer2 className="text-blue-600" size={32} />
          Button Component
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Componente interativo fundamental com suporte a variantes, tamanhos e sistema de ícones híbrido.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. VARIANTES (CORES E ESTILOS) */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="text-purple-500" size={20} />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Variantes de Estilo</h2>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link Button</Button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs text-gray-500 font-mono">
            variant="primary" | "secondary" | "outline" | "ghost" | "danger" | "link"
          </div>
        </section>

        {/* 2. TAMANHOS (SIZES) */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="text-blue-500" size={20} />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Tamanhos</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm" leftIcon="Minus">
              Small
            </Button>
            <Button size="md" leftIcon="Circle">
              Medium (Default)
            </Button>
            <Button size="lg" leftIcon="Plus">
              Large
            </Button>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-medium">Icon Only:</span>
            <Button size="icon" variant="secondary" leftIcon="Search" aria-label="Buscar" />
            <Button size="icon" variant="primary" leftIcon="Bell" aria-label="Notificações" />
            <Button size="icon" variant="danger" leftIcon="Trash2" aria-label="Deletar" />
            <Button size="icon" variant="ghost" leftIcon="MoreVertical" aria-label="Mais" />
          </div>
        </section>

        {/* 3. SISTEMA DE ÍCONES (STRING vs JSX) */}
        <section className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-500" size={20} />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Sistema de Ícones Híbrido</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Caso A: Strings (Produtividade) */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                🅰️ Uso com Strings (IntelliSense)
              </h3>
              <p className="text-sm text-gray-500">Basta passar o nome do ícone do Lucide. O componente resolve internamente.</p>
              <div className="flex flex-wrap gap-3">
                <Button leftIcon="Save" variant="primary">
                  Salvar
                </Button>
                <Button leftIcon="Download" variant="outline">
                  Baixar
                </Button>
                <Button rightIcon="ArrowRight" variant="ghost">
                  Avançar
                </Button>
                <Button leftIcon="Printer" variant="secondary">
                  Imprimir
                </Button>
              </div>
              <pre className="bg-gray-900 text-blue-300 p-3 rounded-lg text-xs overflow-x-auto">
                {`<Button leftIcon="Save">Salvar</Button>
<Button rightIcon="ArrowRight" variant="ghost">Avançar</Button>`}
              </pre>
            </div>

            {/* Caso B: JSX (Flexibilidade Total) */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                🅱️ Uso com JSX (Customização)
              </h3>
              <p className="text-sm text-gray-500">
                Passe o componente direto. O <code>Button</code> clonará e injetará as classes de tamanho corretas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button leftIcon={<Mail />} variant="secondary">
                  Email
                </Button>
                <Button leftIcon={<Github />} variant="outline">
                  Github
                </Button>
                <Button rightIcon={<Zap className="text-yellow-500 fill-yellow-500" />} variant="ghost">
                  Boost
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-xs overflow-x-auto">
                {`<Button leftIcon={<Github />}>Github</Button>
<Button rightIcon={<Zap className="text-yellow-500" />}>Boost</Button>`}
              </pre>
            </div>
          </div>
        </section>

        {/* 4. ESTADOS DE INTERAÇÃO */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-cyan-500" size={20} />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Estados Interativos</h2>
          </div>

          <div className="space-y-6">
            {/* Loading State */}
            <div className="flex items-center justify-between gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Loading State</span>
                <span className="text-xs text-gray-500">Substitui o ícone esquerdo por um spinner</span>
              </div>
              <div className="flex gap-2">
                <Button isLoading={loadingMap['load1']} onClick={() => handleLoad('load1')} leftIcon="Save">
                  Salvar
                </Button>
                <Button variant="outline" isLoading={loadingMap['load2']} onClick={() => handleLoad('load2')} rightIcon="Upload">
                  Enviar
                </Button>
              </div>
            </div>

            {/* Disabled State */}
            <div className="flex items-center justify-between gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Disabled State</span>
                <span className="text-xs text-gray-500">Opacidade reduzida e cursor not-allowed</span>
              </div>
              <div className="flex gap-2">
                <Button disabled leftIcon="Lock">
                  Bloqueado
                </Button>
                <Button disabled variant="ghost" leftIcon="Trash2">
                  Inativo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. LARGURA FLUIDA */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="text-orange-500" size={20} />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Layout Fluido</h2>
          </div>

          <p className="text-sm text-gray-500">
            A propriedade <code>fluid</code> faz o botão ocupar 100% do container pai.
          </p>

          <div className="w-full space-y-3">
            <Button fluid variant="primary" leftIcon="UserPlus">
              Criar Conta
            </Button>
            <Button fluid variant="outline">
              Já tenho uma conta
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TabButtonExample;
