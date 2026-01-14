import { forwardRef, type ReactNode, type TextareaHTMLAttributes, useCallback, useEffect, useRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  /**
   * - 'outlined': Borda completa (Padrão).
   * - 'filled': Fundo cinza, borda inferior.
   * - 'ghost': Sem borda, ideal para notas rápidas ou tabelas.
   */
  variant?: 'outlined' | 'filled' | 'ghost';
  /**
   * Ativa o rótulo flutuante.
   */
  floatingLabel?: boolean;
  /**
   * Exibe um contador de caracteres no canto inferior direito.
   * Funciona melhor quando maxLength é definido.
   */
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      className,
      containerClassName,
      leftIcon,
      rightIcon,
      onInvalid,
      onInput,
      variant = 'outlined',
      floatingLabel = false,
      showCount = false,
      placeholder,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);

    const setRef = useCallback(
      (element: HTMLTextAreaElement | null) => {
        internalRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
        }
      },
      [ref],
    );

    useEffect(() => {
      if (showCount && internalRef.current && counterRef.current) {
        const len = internalRef.current.value.length;
        const max = internalRef.current.maxLength;
        counterRef.current.innerText = max > 0 ? `${len} / ${max}` : `${len}`;
      }
    }, [showCount, props.defaultValue, props.value]);

    const handleInvalid = (e: React.FormEvent<HTMLTextAreaElement>) => {
      e.currentTarget.setAttribute('data-invalid', 'true');
      e.currentTarget.classList.add('animate-shake');
      if (onInvalid) {
        onInvalid(e);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.currentTarget;
      if (target.validity.valid) {
        target.removeAttribute('data-invalid');
      }
      if (showCount && counterRef.current) {
        const len = target.value.length;
        const max = target.maxLength;
        counterRef.current.innerText = max > 0 ? `${len} / ${max}` : `${len}`;
      }
      if (onInput) {
        onInput(e);
      }
    };

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLTextAreaElement>) => {
      e.currentTarget.classList.remove('animate-shake');
    };

    // --- ESTILOS ---

    const commonClasses = `
      w-full min-h-[80px] transition-all duration-200
      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
      focus:outline-none
      text-gray-900 dark:text-white
      align-top resize-y
    `;

    let variantClasses = '';
    let floatingLabelActiveStyle = '';

    if (variant === 'filled') {
      variantClasses = `
        bg-gray-100 dark:bg-gray-800 
        border-b-2 border-gray-300 dark:border-gray-600 border-t-0 border-l-0 border-r-0
        rounded-t-md rounded-b-none
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:bg-gray-200 dark:focus:bg-gray-700
        focus:border-blue-600 dark:focus:border-blue-500
      `;
      floatingLabelActiveStyle = `
        peer-focus:top-1 peer-focus:translate-y-0 peer-focus:scale-75
        peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75
      `;
    } else if (variant === 'ghost') {
      variantClasses = `
        bg-transparent border border-transparent rounded-md
        hover:bg-gray-50 dark:hover:bg-gray-800/30
        focus:bg-white dark:focus:bg-gray-800 focus:shadow-sm focus:ring-2 focus:ring-blue-500
      `;
      floatingLabelActiveStyle = `
        peer-focus:-top-2 peer-focus:-translate-y-0 peer-focus:scale-75 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1
        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-800 peer-[:not(:placeholder-shown)]:px-1
      `;
    } else {
      // Outlined
      variantClasses = `
        bg-transparent
        border border-gray-400 dark:border-gray-500 rounded-md
        hover:border-gray-600 dark:hover:border-gray-400
        focus:border-blue-600 focus:ring-1 focus:ring-blue-600
      `;
      floatingLabelActiveStyle = `
        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1
        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-800 peer-[:not(:placeholder-shown)]:px-1
      `;
    }

    let paddingClasses = 'py-2.5';
    if (variant === 'filled' && floatingLabel) {
      paddingClasses = 'pt-6 pb-2';
    }

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;
    const iconPadding = `
      ${hasLeftIcon ? 'pl-10' : 'pl-3'} 
      ${hasRightIcon ? 'pr-10' : 'pr-3'}
    `;

    // Correção Lógica de Cores do Placeholder:
    // Se Floating Label estiver ativo, a transparência deve ter prioridade máxima
    // a menos que o campo esteja focado. O erro não deve tornar o placeholder visível se ele deveria estar transparente.

    let placeholderClasses = '';
    if (floatingLabel) {
      placeholderClasses = `
        placeholder-transparent 
        /* Só mostra placeholder no foco */
        focus:placeholder-gray-400 dark:focus:placeholder-gray-500
        /* Se der erro: MANTÉM transparente se não focado */
        data-[invalid=true]:placeholder-transparent
        /* Se der erro E focado: Mostra vermelho claro */
        data-[invalid=true]:focus:placeholder-red-300
      `;
    } else {
      placeholderClasses = `
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        data-[invalid=true]:placeholder:text-red-300
      `;
    }

    const finalClasses = `
      ${commonClasses}
      ${variantClasses}
      ${paddingClasses}
      ${iconPadding}
      ${placeholderClasses}
      
      data-[invalid=true]:border-red-500 
      data-[invalid=true]:text-red-900 
      data-[invalid=true]:focus:border-red-500 
      data-[invalid=true]:focus:ring-red-500
    `;

    return (
      <div className={`flex flex-col gap-1 w-full ${containerClassName || ''}`}>
        {label && !floatingLabel && (
          <label htmlFor={props.id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <div className="relative flex items-start group">
          {leftIcon && <span className="absolute left-3 top-3 text-gray-500 pointer-events-none z-10">{leftIcon}</span>}

          <textarea
            ref={setRef}
            onInvalid={handleInvalid}
            onInput={handleInput}
            onAnimationEnd={handleAnimationEnd}
            className={`peer ${finalClasses} ${className || ''}`}
            // Garante que haja um placeholder "fake" se floatingLabel estiver ativo, para o seletor CSS funcionar
            placeholder={floatingLabel && !placeholder ? ' ' : placeholder}
            maxLength={maxLength}
            {...props}
          />

          {label && floatingLabel && (
            <label
              htmlFor={props.id}
              className={`
                absolute left-3 transition-all duration-200 pointer-events-none z-10 origin-left
                text-gray-500 dark:text-gray-400
                
                /* Estado Inicial (Label agindo como Placeholder) */
                top-4 scale-100
                
                ${hasLeftIcon ? 'left-10' : 'left-3'}

                /* Estado Ativo (Focado ou Preenchido) */
                ${floatingLabelActiveStyle}
                
                peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                peer-data-[invalid=true]:text-red-500
              `}>
              {label}
            </label>
          )}

          {rightIcon && <div className="absolute right-3 top-3 flex items-center pointer-events-none text-gray-500 z-10">{rightIcon}</div>}
        </div>

        {showCount && (
          <div className="flex justify-end w-full">
            <span ref={counterRef} className="text-xs text-gray-400 font-mono text-right">
              0 {maxLength ? `/ ${maxLength}` : ''}
            </span>
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export default Textarea;
