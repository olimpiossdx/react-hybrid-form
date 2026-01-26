import React from 'react';

import type { IButtonElement, IButtonProps } from './propTypes';
import { cn } from '../../utils/cn';
import { Spinner } from '../spinner';

// --- Componente ---

const Button = React.forwardRef<IButtonElement, IButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading: propLoading,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Referência interna ao elemento DOM real
    const internalRef = React.useRef<HTMLButtonElement>(null);

    // Estado interno para controle imperativo (via ref.setLoading)
    const [internalLoading, setInternalLoading] = React.useState(false);

    // Estado Efetivo: Propriedade externa ganha se estiver definida, senão usa interno
    const isEffectiveLoading = propLoading !== undefined ? propLoading : internalLoading;

    // A mágica da Ref Híbrida:
    // Expõe o elemento DOM nativo MAS adiciona os métodos customizados nele
    React.useImperativeHandle(ref, () => {
      const element = internalRef.current;

      if (!element) {
        return null as unknown as IButtonElement;
      }

      // Usamos Object.assign ou definimos propriedades diretamente na instância do elemento
      // Isso permite que 'ref.current.focus()' continue funcionando nativamente
      const augmentedElement = element as IButtonElement;

      augmentedElement.setLoading = (val: boolean) => {
        setInternalLoading(val);
      };

      // Definimos um getter para 'loading' refletir o estado atual
      Object.defineProperty(augmentedElement, 'loading', {
        get: () => isEffectiveLoading,
        configurable: true, // Permite reconfiguração se necessário
      });

      return augmentedElement;
    }, [isEffectiveLoading]); // Recria o handle se o estado mudar

    // --- Estilização (Tailwind) ---

    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm border border-transparent',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-transparent',
      outline:
        'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
      ghost: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-600 dark:text-gray-400',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      link: 'text-blue-600 underline-offset-4 hover:underline',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm', // Alinhado com Input md
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    // Combinando classes usando cn (tailwind-merge)
    const finalClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      widthClass,
      className, // Classes externas ganham prioridade
    );

    return (
      <button ref={internalRef} type={type} className={finalClassName} disabled={isEffectiveLoading || disabled} {...props}>
        {isEffectiveLoading ? (
          <>
            {/* Mantém a largura ou substitui conteúdo? 
                Geralmente substituir o ícone esquerdo é mais estável visualmente */}
            <Spinner size={size === 'sm' ? 'sm' : 'md'} className={`animate-spin ${children ? 'mr-2' : ''}`} />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
