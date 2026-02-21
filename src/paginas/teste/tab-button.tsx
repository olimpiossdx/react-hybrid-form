import { useRef, useState } from 'react';
import { ArrowRight, Ban, CheckCircle2, Download, Mail, Play, Plus, Save, Send, Share2, Trash2 } from 'lucide-react';

import Button from '../../componentes/button';
import type { IButtonElement } from '../../componentes/button/propTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../componentes/card';
import { showModal } from '../../componentes/modal';

const ButtonShowcase = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Opção 1: Primary Clássico</h2>
        <p className="text-gray-500 mb-6">Azul sólido com texto branco forçado (!text-white). Alto contraste e peso visual.</p>

        <div className="flex flex-wrap items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Padrão */}
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-600 !text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none focus-visible:ring-offset-2">
            Salvar Dados
          </button>

          {/* Com Ícone (Esquerda) */}
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-600 !text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none focus-visible:ring-offset-2">
            <Plus size={18} /> Novo Grupo
          </button>

          {/* Com Ícone (Direita) */}
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-600 !text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none focus-visible:ring-offset-2">
            Enviar Formulário <Send size={18} />
          </button>

          {/* Estado Disabled */}
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-600 !text-white opacity-50 cursor-not-allowed shadow-sm">
            <Ban size={18} /> Processando...
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-800 w-full" />

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Opção 2: Primary Soft</h2>
        <p className="text-gray-500 mb-6">Tom sobre tom. Fundo claro com texto escuro. Extremamente confortável para os olhos e moderno.</p>

        <div className="flex flex-wrap items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Padrão */}
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-200 shadow-sm border border-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none focus-visible:ring-offset-2">
            Salvar Dados
          </button>

          {/* Com Ícone (Esquerda) */}
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-200 shadow-sm border border-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none focus-visible:ring-offset-2">
            <Plus size={18} /> Novo Grupo
          </button>

          {/* Com Ícone (Direita) */}
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-200 shadow-sm border border-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none focus-visible:ring-offset-2">
            Enviar Formulário <Send size={18} />
          </button>

          {/* Estado Disabled */}
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 ease-in-out bg-blue-50 text-blue-700 opacity-50 cursor-not-allowed shadow-sm border border-blue-100">
            <Ban size={18} /> Processando...
          </button>
        </div>
      </div>
    </div>
  );
};

// Subcomponente para renderizar o seu layout exato e podermos injetar a variante Primary que queremos testar
const ButtonLayoutTemplate = ({ primaryVariantTitle, primaryVariantName }: { primaryVariantTitle: string; primaryVariantName: any }) => {
  const [declarativeLoading, setDeclarativeLoading] = useState(false);
  const btnRef = useRef<IButtonElement>(null);

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

  const handleDeclarativeClick = () => {
    setDeclarativeLoading(true);
    setTimeout(() => {
      setDeclarativeLoading(false);
      showSuccessToast('Salvo com sucesso (Modo Declarativo)!');
    }, 2000);
  };

  const handleImperativeClick = () => {
    if (btnRef.current) {
      btnRef.current.setLoading(true);
      btnRef.current.focus();
      setTimeout(() => {
        btnRef.current?.setLoading(false);
        showSuccessToast('Enviado com sucesso (Modo Imperativo)!');
      }, 2000);
    }
  };

  return (
    <div className="space-y-10 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white/50 dark:bg-gray-900/20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{primaryVariantTitle}</h2>
      </div>

      <section className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Variantes</h3>
        <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Button variant={primaryVariantName}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Tamanhos</h3>
        <div className="flex flex-wrap items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Button size="sm" variant={primaryVariantName}>
            Small (sm)
          </Button>
          <Button size="md" variant={primaryVariantName}>
            Medium (md)
          </Button>
          <Button size="lg" variant={primaryVariantName}>
            Large (lg)
          </Button>
          <div className="h-8 w-px bg-gray-300 mx-2"></div>
          <Button size="icon" variant="outline">
            <Share2 size={18} />
          </Button>
          <Button size="icon" variant={primaryVariantName} className="rounded-full">
            <Play size={18} />
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Modo Declarativo</CardTitle>
            <CardDescription>
              Controlado por <code>useState</code> no componente pai.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <Button
              variant={primaryVariantName}
              isLoading={declarativeLoading}
              onClick={handleDeclarativeClick}
              leftIcon={<Save size={18} />}>
              Salvar (Props)
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-400">Re-renderiza o componente pai a cada mudança.</p>
          </CardFooter>
        </Card>

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

// Componente Pai que renderiza as duas opções
const TabButtonExample: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 p-6 pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Laboratório: Qual Primary escolher?</h1>
        <p className="text-gray-500 mt-3">Teste as duas filosofias lado a lado nos botões principais e de carregamento.</p>
      </div>

      {/* Renderiza o layout com o Primary Clássico */}
      <ButtonLayoutTemplate primaryVariantTitle="Filosofia 1: Primary Clássico (Alto Contraste)" primaryVariantName="primary-classic" />

      {/* Renderiza o layout com o Primary Soft */}
      <ButtonLayoutTemplate primaryVariantTitle="Filosofia 2: Primary Soft (Tom sobre Tom)" primaryVariantName="primary-soft" />
      <div>
        <ButtonShowcase />
      </div>
    </div>
  );
};

export default TabButtonExample;
