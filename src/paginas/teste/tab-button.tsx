import React, { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Download, Mail, Play, Save, Share2, Trash2 } from 'lucide-react';

import Button, { type ButtonElement } from '../../componentes/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../componentes/card';
import { showModal } from '../../componentes/modal';

const TabButtonExample: React.FC = () => {
  // --- Estado para Modo Declarativo ---
  const [declarativeLoading, setDeclarativeLoading] = useState(false);

  // --- Ref para Modo Imperativo ---
  const btnRef = useRef<ButtonElement>(null);

  // Helper para mostrar feedback visual
  const showSuccessToast = (message: string) => {
    showModal({
      title: 'Ação Concluída',
      size: 'sm',
      content: (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      ),
    });
  };

  // Handler Declarativo
  const handleDeclarativeClick = () => {
    setDeclarativeLoading(true);
    setTimeout(() => {
      setDeclarativeLoading(false);
      showSuccessToast('Salvo com sucesso (Modo Declarativo)!');
    }, 2000);
  };

  // Handler Imperativo (Zero Re-render do Pai)
  const handleImperativeClick = () => {
    if (btnRef.current) {
      // 1. Acessa método customizado
      btnRef.current.setLoading(true);

      // 2. Mantém foco (método nativo)
      btnRef.current.focus();

      setTimeout(() => {
        // 3. Finaliza
        btnRef.current?.setLoading(false);
        showSuccessToast('Enviado com sucesso (Modo Imperativo)!');
      }, 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Componente Button</h2>
        <p className="text-gray-500 mt-2">Botões com suporte a variantes, tamanhos e controle híbrido de carregamento.</p>
      </div>

      {/* --- SEÇÃO 1: VARIANTES E CORES --- */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Variantes</h3>
        <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>

      {/* --- SEÇÃO 2: TAMANHOS --- */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Tamanhos</h3>
        <div className="flex flex-wrap items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Button size="sm">Small (sm)</Button>
          <Button size="md">Medium (md)</Button>
          <Button size="lg">Large (lg)</Button>
          <div className="h-8 w-px bg-gray-300 mx-2"></div>
          <Button size="icon" variant="outline">
            <Share2 size={18} />
          </Button>
          <Button size="icon" variant="primary" className="rounded-full">
            <Play size={18} className="ml-1" />
          </Button>
        </div>
      </section>

      {/* --- SEÇÃO 3: CONTROLE DE LOADING (HÍBRIDO) --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Caso A: Declarativo */}
        <Card>
          <CardHeader>
            <CardTitle>Modo Declarativo</CardTitle>
            <CardDescription>
              Controlado por <code>useState</code> no componente pai.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <Button isLoading={declarativeLoading} onClick={handleDeclarativeClick} leftIcon={<Save size={18} />}>
              Salvar (Props)
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-400">Re-renderiza o componente pai a cada mudança.</p>
          </CardFooter>
        </Card>

        {/* Caso B: Imperativo */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-400">Modo Imperativo (Ref)</CardTitle>
            <CardDescription>
              Controlado diretamente via <code>ref.current.setLoading()</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-24 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <Button
              ref={btnRef}
              onClick={handleImperativeClick}
              rightIcon={<ArrowRight size={18} />}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Enviar (Ref)
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-blue-400">Zero re-render no pai. Performance pura.</p>
          </CardFooter>
        </Card>
      </section>

      {/* --- SEÇÃO 4: ÍCONES E COMPOSIÇÃO --- */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Ícones e Composição</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button variant="destructive" leftIcon={<Trash2 size={18} />} fullWidth>
            Excluir Conta (Full Width)
          </Button>

          <Button variant="secondary" rightIcon={<Download size={18} />}>
            Baixar Relatório
          </Button>

          <Button variant="ghost" leftIcon={<Mail size={18} />} className="justify-start">
            contato@empresa.com
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TabButtonExample;
