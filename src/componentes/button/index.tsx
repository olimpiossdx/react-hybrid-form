import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
// Importa todo o namespace para permitir tipagem dinâmica e lookup
import * as lucideIcons from 'lucide-react';

// --- 1. Tipagem Dinâmica ---
// Isso gera um tipo gigante: "AArrowDown" | "AArrowUp" | ... | "ZoomOut"
// O VS Code usará isso para o autocomplete.
export type LucideIconName = keyof typeof lucideIcons;

// --- 2. Interfaces ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;

  // O pulo do gato: Aceita string (com autocomplete) ou nó React direto
  leftIcon?: LucideIconName | React.ReactNode;
  rightIcon?: LucideIconName | React.ReactNode;

  fluid?: boolean; // Largura 100%
}

// --- 3. Componente ---
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      fluid = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Renderiza o ícone dinamicamente
    const renderIcon = (iconProp: LucideIconName | React.ReactNode, sizeClass: string) => {
      if (!iconProp) {
        return null;
      }

      // Se for string, busca no objeto importado
      if (typeof iconProp === 'string') {
        const IconComponent = (lucideIcons as any)[iconProp];

        // Proteção contra nomes inválidos ou exports que não são ícones
        if (!IconComponent) {
          console.warn(`Ícone "${iconProp}" não encontrado.`);
          return null;
        }
        return <IconComponent className={sizeClass} />;
      }

      // Se for JSX (ex: <Mail />), clona para injetar tamanho se possível
      if (React.isValidElement(iconProp)) {
        return React.cloneElement(iconProp as React.ReactElement<{ className?: string }>, {
          className: `${(iconProp.props as any).className || ''} ${sizeClass}`.trim(),
        });
      }

      return iconProp;
    };

    // --- Estilos Base ---
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]';

    // Variantes de Cor
    const variants = {
      primary:
        'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm border border-transparent dark:bg-blue-600 dark:hover:bg-blue-500',
      secondary:
        'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-400',
      outline:
        'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20 focus:ring-blue-500',
      ghost:
        'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:ring-gray-400',
      danger:
        'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 focus:ring-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 dark:border-red-900',
      link: 'bg-transparent text-blue-600 hover:underline p-0 h-auto shadow-none focus:ring-0 active:scale-100',
    };

    // Tamanhos (Padding e Ícones)
    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-3',
      icon: 'p-2 aspect-square',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      icon: 'w-5 h-5',
    };

    const currentIconClass = iconSizes[size] || 'w-4 h-4';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fluid ? 'w-full' : ''}
        ${className}
      `}
        {...props}>
        {/* Loading (Spinner) */}
        {isLoading ? <Loader2 className={`animate-spin ${currentIconClass}`} /> : renderIcon(leftIcon, currentIconClass)}

        {/* Conteúdo */}
        {children && <span className="flex">{children}</span>}

        {/* Ícone Direito */}
        {!isLoading && renderIcon(rightIcon, currentIconClass)}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
