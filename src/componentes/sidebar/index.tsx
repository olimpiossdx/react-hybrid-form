// src/ui/sidebar/index.tsx
import React, { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

import { Slot } from './slot';
import { cn } from '../../utils/cn';

type SidebarContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('Sidebar components must be used within <Sidebar.Root>');
  }
  return ctx;
}

export type SidebarRootProps = {
  children: ReactNode;
  /**
   * Largura da sidebar no desktop (Tailwind class).
   * Ex: "w-64", "w-72".
   */
  widthClassName?: string;
  /**
   * Classe extra aplicada na wrapper da sidebar (container fixo).
   */
  className?: string;
};

function SidebarRoot({ children, widthClassName = 'w-64', className }: SidebarRootProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSetMobileOpen = useCallback((open: boolean) => {
    setMobileOpen(open);
  }, []);

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen: handleSetMobileOpen }}>
      {/* Wrapper geral: sidebar + backdrop mobile */}
      {/* 
        A ideia é que o layout externo faça algo como:
        <div className="flex h-screen">
          <Sidebar.Root>...</Sidebar.Root>
          <main className="flex-1">...</main>
        </div>
      */}
      <div className={cn('relative', className)}>
        {/* Backdrop mobile */}
        <SidebarMobileBackdrop />

        {/* Sidebar em si */}
        <SidebarPanel widthClassName={widthClassName}>{children}</SidebarPanel>
      </div>
    </SidebarContext.Provider>
  );
}

type SidebarPanelProps = {
  children: ReactNode;
  widthClassName: string;
};

function SidebarPanel({ children, widthClassName }: SidebarPanelProps) {
  const { mobileOpen } = useSidebarContext();

  return (
    <>
      {/* Desktop: fixa à esquerda */}
      <aside
        className={cn(
          'hidden md:fixed md:inset-y-0 md:left-0 md:z-20 md:flex md:flex-col',
          widthClassName,
          'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
        )}>
        <div className="flex h-full flex-col">{children}</div>
      </aside>

      {/* Mobile: off-canvas */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
          'transform transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:hidden',
        )}>
        <div className="flex h-full flex-col">{children}</div>
      </aside>
    </>
  );
}

function SidebarMobileBackdrop() {
  const { mobileOpen, setMobileOpen } = useSidebarContext();

  if (!mobileOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
  );
}

/**
 * Botão opcional para abrir/fechar a sidebar no mobile.
 * Você pode usar dentro do Header global da aplicação.
 */
export type SidebarMobileToggleProps = {
  children?: ReactNode;
  className?: string;
};

function SidebarMobileToggle({ children, className }: SidebarMobileToggleProps) {
  const { mobileOpen, setMobileOpen } = useSidebarContext();

  return (
    <button
      type="button"
      onClick={() => setMobileOpen(!mobileOpen)}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden',
        className,
      )}
      aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={mobileOpen}>
      {children ?? (
        // Ícone hamburguer simples (você pode trocar pelo seu ícone)
        <span className="block h-0.5 w-5 bg-current shadow-[0_6px_0_0_currentColor,0_12px_0_0_currentColor]" />
      )}
    </button>
  );
}

export type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement>;

function SidebarHeader({ className, ...rest }: SidebarSectionProps) {
  return <div className={cn('flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-gray-700', className)} {...rest} />;
}

function SidebarContent({ className, ...rest }: SidebarSectionProps) {
  return <div className={cn('flex-1 overflow-y-auto px-2 py-2', className)} {...rest} />;
}

export type SidebarGroupProps = {
  title?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function SidebarGroup({ title, className, children, ...rest }: SidebarGroupProps) {
  return (
    <div className={cn('mb-3', className)} {...rest}>
      {title && <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{title}</div>}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export type SidebarItemProps = {
  icon?: React.ComponentType<{ className?: string }>;
  badge?: ReactNode;
  active?: boolean;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function SidebarItem({ icon: Icon, badge, active, asChild, className, children, ...rest }: SidebarItemProps) {
  const Comp = (asChild ? Slot : 'button') as React.ElementType;

  return (
    <Comp
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
        className,
      )}
      {...rest}>
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="flex-1 truncate">{children}</span>
      {badge && (
        <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-200">
          {badge}
        </span>
      )}
    </Comp>
  );
}

function SidebarFooter({ className, ...rest }: SidebarSectionProps) {
  return <div className={cn('border-t border-gray-200 px-3 py-3 dark:border-gray-700', className)} {...rest} />;
}

export const Sidebar = {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Content: SidebarContent,
  Group: SidebarGroup,
  Item: SidebarItem,
  Footer: SidebarFooter,
  MobileToggle: SidebarMobileToggle,
};
