import React, { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';

// --- CONTEXTO ---
interface TabsContextType {
  activeTab: string;
  setActiveTab: (newValue: string) => void;
  registerPanel: (value: string, node: HTMLElement | null) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// --- TIPOS ---
interface TabsRootProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Função executada antes de trocar de aba.
   * Se retornar false, a troca é cancelada.
   * Útil para validação de Wizard.
   * @param newValue A aba que o usuário quer ir
   * @param oldValue A aba onde o usuário está
   * @param oldPanel O elemento DOM do painel atual (para validar escopo)
   */
  beforeChange?: (newValue: string, oldValue: string, oldPanel: HTMLElement | null) => boolean | Promise<boolean>;
  onValueChange?: (value: string) => void;
}

// --- COMPONENTES ---

const Root: React.FC<TabsRootProps> = ({ defaultValue, children, className = '', beforeChange, onValueChange }) => {
  const [activeTab, setActiveTabState] = useState(defaultValue);

  // Mapa de Refs para acessar os painéis diretamente
  const panelsRef = useRef<Map<string, HTMLElement>>(new Map());

  const registerPanel = useCallback((value: string, node: HTMLElement | null) => {
    if (node) {
      panelsRef.current.set(value, node);
    } else {
      panelsRef.current.delete(value);
    }
  }, []);

  const handleTabChange = async (newValue: string) => {
    if (newValue === activeTab) {
      return;
    }

    if (beforeChange) {
      const currentPanel = panelsRef.current.get(activeTab) || null;
      // Permite validação síncrona ou assíncrona
      const canChange = await beforeChange(newValue, activeTab, currentPanel);
      if (!canChange) {
        return;
      } // Bloqueia navegação
    }

    setActiveTabState(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange, registerPanel }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

const List: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex border-b border-gray-200 dark:border-gray-700 mb-4 gap-2 overflow-x-auto ${className}`}>{children}</div>
);

const Trigger: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({ value, children, className = '', disabled }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs.Trigger must be used within Tabs.Root');
  }

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => context.setActiveTab(value)}
      data-state={isActive ? 'active' : 'inactive'}
      className={`
        px-4 py-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap
        ${
          isActive
            ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}>
      {children}
    </button>
  );
};

const Content: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs.Content must be used within Tabs.Root');
  }

  const isActive = context.activeTab === value;
  const ref = useRef<HTMLDivElement>(null);

  // Registra a ref no Pai para validação de escopo
  useLayoutEffect(() => {
    context.registerPanel(value, ref.current);
  }, [value, context.registerPanel]);

  return (
    <div
      ref={ref}
      role="tabpanel"
      // ESTRATÉGIA CSS HIDING: O elemento continua no DOM para o useForm ler os valores
      hidden={!isActive}
      className={`
        outline-none focus:ring-0 
        ${isActive ? 'animate-in fade-in slide-in-from-bottom-2 duration-300' : ''}
        ${className}
      `}>
      {children}
    </div>
  );
};

// Exportação Composta
export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
};
