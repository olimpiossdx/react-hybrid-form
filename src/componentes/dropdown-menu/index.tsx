import React, { createContext, type ElementType, type ReactNode, useContext, useRef, useState } from 'react';

import { cn } from '../../utils/cn'; // Utilitário de classes
import Popover from '../popover'; // Importando o Popover que já existe/validamos

// ============================================================================
// 1. CONTEXTO E TIPOS
// ============================================================================

interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.RefObject<any>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu');
  }
  return context;
};

// Tipo para o Modo Padrão (Data-Driven)
export interface DropdownMenuItemDef {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  shortcut?: string; // Ex: ⌘+S
  separator?: boolean; // Se true, renderiza um separador ANTES deste item
}

interface DropdownMenuProps {
  children?: ReactNode;
  /**
   * Modo Padrão: Passe um array de itens para renderizar automaticamente.
   */
  items?: DropdownMenuItemDef[];
  /**
   * Gatilho personalizado para o Modo Padrão (se não passar children).
   * Ex: <Button>Opções</Button>
   */
  trigger?: ReactNode;

  // Configurações visuais
  width?: string;
  align?: 'start' | 'end'; // Alinhamento futuro (o popover atual é fixo, mas preparamos a API)
}

// ============================================================================
// 2. SUB-COMPONENTES (MODO CUSTOMIZADO / COMPOUND)
// ============================================================================

type TriggerChildProps = {
  onClick?: (event: React.MouseEvent<any>) => void;
  // Em geral, Button/Link aceitam ref; o tipo concreto vem do próprio elemento.
};

interface DropdownTriggerProps {
  children: React.ReactElement<TriggerChildProps>;
}
/**
 * Gatilho do Dropdown.
 * Clona o elemento filho para injetar a ref e o onClick automaticamente.
 * Funciona com Button, div, span, Avatar, etc.
 */
export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children }) => {
  const { toggle, triggerRef, isOpen } = useDropdown();

  if (!React.isValidElement<TriggerChildProps>(children)) {
    // Se quiser ser mais estrito: lançar erro em vez de retornar null
    return null;
  }

  return React.cloneElement(children as React.ReactElement<any>, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent<any>) => {
      children.props.onClick?.(e);
      toggle();
    },
    'aria-haspopup': true,
    'aria-expanded': isOpen, // agora reflete o estado real
  });
};

/**
 * Container do conteúdo do Dropdown.
 * Wrapper estilizado para o Popover.
 */
export const DropdownContent = ({ children, width = 'w-56', className }: { children: ReactNode; width?: string; className?: string }) => {
  const { isOpen, close, triggerRef } = useDropdown();

  return (
    <Popover
      isOpen={isOpen}
      onClose={close}
      triggerRef={triggerRef}
      className={cn('p-1 shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg', className)}>
      <div className={cn('flex flex-col', width)}>{children}</div>
    </Popover>
  );
};

/**
 * Item interativo do Dropdown.
 * Suporta polimorfismo via prop 'as' (padrão: 'button').
 */
export interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  shortcut?: string;
  className?: string;
  /**
   * Componente ou tag HTML a ser renderizado.
   * Ex: as="a" para links, as={Link} para router.
   */
  as?: ElementType;
  [key: string]: any; // Permite outras props (href, to, etc)
}

export const DropdownItem = ({
  children,
  onClick,
  icon: Icon,
  disabled,
  variant = 'default',
  shortcut,
  className,
  as: Component = 'button',
  ...props
}: DropdownItemProps) => {
  const { close } = useDropdown();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
    close();
  };

  const variantStyles =
    variant === 'destructive'
      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700';

  return (
    <Component
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors select-none outline-none data-disabled:pointer-events-none data-disabled:opacity-50 text-left',
        variantStyles,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <span className="ml-auto text-xs tracking-widest text-gray-400">{shortcut}</span>}
    </Component>
  );
};

export const DropdownLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider', className)}>
    {children}
  </div>
);

export const DropdownSeparator = ({ className }: { className?: string }) => (
  <div className={cn('h-px bg-gray-200 dark:bg-gray-700 my-1 mx-1', className)} />
);

export const DropdownHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('px-2 py-2 mb-1 bg-gray-50 dark:bg-gray-900/50 rounded-md', className)}>{children}</div>
);

// ============================================================================
// 3. COMPONENTE RAIZ (CONTROLADOR HÍBRIDO)
// ============================================================================

export const DropdownMenu = ({ children, items, trigger, width }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const contextValue = { isOpen, toggle, close, triggerRef };

  // --- RENDERIZAÇÃO ---

  // MODO 1: PADRÃO (Data Driven)
  // Se 'items' for fornecido, montamos a estrutura automaticamente
  if (items && trigger) {
    return (
      <DropdownContext.Provider value={contextValue}>
        <DropdownTrigger>
          {/* Se o trigger for texto string, envolvemos num span, senão clonamos o elemento */}
          {React.isValidElement(trigger) ? trigger : <span>{trigger}</span>}
        </DropdownTrigger>

        <DropdownContent width={width}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.separator && <DropdownSeparator />}
              <DropdownItem
                onClick={item.onClick}
                icon={item.icon}
                disabled={item.disabled}
                variant={item.variant}
                shortcut={item.shortcut}>
                {item.label}
              </DropdownItem>
            </React.Fragment>
          ))}
        </DropdownContent>
      </DropdownContext.Provider>
    );
  }

  // MODO 2: CUSTOMIZADO (Compound)
  // Renderiza os filhos livremente (espera-se Trigger e Content)
  return <DropdownContext.Provider value={contextValue}>{children}</DropdownContext.Provider>;
};
