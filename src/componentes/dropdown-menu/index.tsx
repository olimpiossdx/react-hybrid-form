import React, { createContext, type ElementType, type ReactNode, useContext, useRef, useState } from 'react';

import { cn } from '../../utils/cn';
import Popover from '../popover';

// ============================================================================
// 1. CONTEXTO
// ============================================================================

interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu');
  }
  return context;
};

// ============================================================================
// 2. TIPOS PARA MODO DATA-DRIVEN ({ as, props })
// ============================================================================

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

interface DropdownMenuItemBase {
  /** Renderiza um separador antes do item. */
  separator?: boolean;
  /** Label a ser exibido; se omitido, usa children de props.children. */
  label?: ReactNode;
  icon?: React.ElementType;
  variant?: 'default' | 'destructive';
  shortcut?: string;
  disabled?: boolean;
}

/**
 * Item intrínseco parametrizado por tag.
 * as: 'button' | 'a' | 'div' | 'span' | ...
 * props: JSX.IntrinsicElements[as]
 */
type DropdownIntrinsicItem<T extends IntrinsicTag> = DropdownMenuItemBase & {
  as: T;
  props?: React.JSX.IntrinsicElements[T];
};

/**
 * Conjunto de tags mais comuns para menus na web.
 */
export type DropdownMenuItemDef =
  | DropdownIntrinsicItem<'button'>
  | DropdownIntrinsicItem<'a'>
  | DropdownIntrinsicItem<'div'>
  | DropdownIntrinsicItem<'span'>
  | DropdownIntrinsicItem<'li'>
  | DropdownIntrinsicItem<'input'>;

interface DropdownMenuProps {
  children?: ReactNode;
  items?: DropdownMenuItemDef[];
  trigger?: ReactNode;
  width?: string;
  className?: string;
}

// ============================================================================
// 3. SUB-COMPONENTES (COMPOUND)
// ============================================================================

/**
 * Gatilho do Dropdown.
 * Clona o elemento filho para injetar a ref e o onClick automaticamente.
 */
type TriggerChildProps = {
  onClick?: (event: React.MouseEvent<any>) => void;
  ref?: React.Ref<any>;
};

interface DropdownTriggerProps {
  children: React.ReactElement<TriggerChildProps>;
}

export const DropdownTrigger = ({ children }: DropdownTriggerProps) => {
  const { toggle, triggerRef, isOpen } = useDropdown();

  return React.cloneElement(children as React.ReactElement<any>, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      toggle();
    },
    'aria-haspopup': true,
    'aria-expanded': isOpen,
  });
};

/**
 * Container do conteúdo (usa Popover).
 */
interface DropdownContentProps {
  children: ReactNode;
  width?: string;
  className?: string;
}

export const DropdownContent = ({ children, width = 'w-56', className }: DropdownContentProps) => {
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

// --- DropdownItem Polimórfico com Typescript Generics ---

type DropdownItemOwnProps<E extends ElementType = 'button'> = {
  children: ReactNode;
  icon?: React.ElementType;
  variant?: 'default' | 'destructive';
  shortcut?: string;
  disabled?: boolean;
  className?: string;
  /**
   * Elemento ou componente a ser renderizado.
   * Padrão: 'button'
   */
  as?: E;
};

type PolymorphicComponentProps<E extends ElementType, P> = DropdownItemOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof DropdownItemOwnProps | keyof P> &
  P;

export type DropdownItemProps<E extends ElementType = 'button'> = PolymorphicComponentProps<
  E,
  { onClick?: (event: React.MouseEvent<any>) => void }
>;

export const DropdownItem = <E extends ElementType = 'button'>(props: DropdownItemProps<E>) => {
  const { children, onClick, icon: Icon, disabled, variant = 'default', shortcut, className, as, ...rest } = props;

  const { close } = useDropdown();

  const Component = (as || 'button') as ElementType;

  const handleClick = (e: React.MouseEvent<any>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    close();
  };

  const variantStyles =
    variant === 'destructive'
      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700';

  const isButton = Component === 'button';

  return (
    <Component
      onClick={handleClick}
      {...(isButton ? { disabled } : { 'aria-disabled': disabled || undefined })}
      className={cn(
        'relative flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors select-none outline-none text-left',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        variantStyles,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...(rest as any)}>
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
// 4. COMPONENTE RAIZ HÍBRIDO
// ============================================================================

export const DropdownMenu = ({ children, items, trigger, width, className }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const contextValue: DropdownContextType = { isOpen, toggle, close, triggerRef };

  const hasItems = !!items && items.length > 0;

  // MODO 1: DATA-DRIVEN ({ as, props })
  if (hasItems && trigger) {
    return (
      <DropdownContext.Provider value={contextValue}>
        <DropdownTrigger>{React.isValidElement(trigger) ? trigger : <span>{trigger}</span>}</DropdownTrigger>

        <DropdownContent width={width} className={className}>
          {items!.map((item, index) => {
            const { separator, as, props: itemProps, label, icon, variant, shortcut, disabled } = item;

            const Tag = as;
            const finalChildren = label ?? (itemProps as any)?.children ?? null;

            return (
              <React.Fragment key={index}>
                {separator && <DropdownSeparator />}

                <DropdownItem as={Tag as any} icon={icon} variant={variant} shortcut={shortcut} disabled={disabled} {...(itemProps as any)}>
                  {finalChildren}
                </DropdownItem>
              </React.Fragment>
            );
          })}
        </DropdownContent>
      </DropdownContext.Provider>
    );
  }

  // MODO 2: COMPOUND (Customizado)
  return <DropdownContext.Provider value={contextValue}>{children}</DropdownContext.Provider>;
};
