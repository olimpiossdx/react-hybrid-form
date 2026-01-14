import { forwardRef, type OptionHTMLAttributes, type ReactNode, type SelectHTMLAttributes, useCallback, useRef } from 'react';

// Interface para objetos de opção (Data Driven)
// Herda todas as props nativas do <option> (disabled, className, style, etc)
export interface SelectOption extends OptionHTMLAttributes<HTMLOptionElement> {
  label: string;
  value: string | number;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  /**
   * Lista de opções para renderização automática.
   * Alternativa ao uso de children.
   */
  options?: SelectOption[];
  /**
   * - 'outlined': Borda completa (Padrão).
   * - 'filled': Fundo cinza, borda inferior.
   * - 'ghost': Sem borda, ideal para tabelas.
   */
  variant?: 'outlined' | 'filled' | 'ghost';
  sized?: 'sm' | 'md' | 'lg';
  floatingLabel?: boolean;
  placeholder?: string; // Texto do placeholder opcional
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      className,
      containerClassName,
      leftIcon,
      rightIcon,
      onInvalid,
      onInput,
      onChange,
      variant = 'outlined',
      sized = 'md',
      floatingLabel = false,
      children,
      placeholder,
      options,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLSelectElement>(null);

    const setRef = useCallback(
      (element: HTMLSelectElement | null) => {
        internalRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLSelectElement | null>).current = element;
        }
      },
      [ref],
    );

    const checkHasValue = (target: HTMLSelectElement) => target.value !== '';

    const handleInvalid = (e: React.FormEvent<HTMLSelectElement>) => {
      e.currentTarget.setAttribute('data-invalid', 'true');
      e.currentTarget.classList.add('animate-shake');
      if (onInvalid) {
        onInvalid(e);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.currentTarget;
      if (target.validity.valid) {
        target.removeAttribute('data-invalid');
      }

      if (checkHasValue(target)) {
        target.setAttribute('data-has-value', 'true');
      } else {
        target.removeAttribute('data-has-value');
      }

      if (onInput) {
        onInput(e);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const target = e.currentTarget;
      if (checkHasValue(target)) {
        target.setAttribute('data-has-value', 'true');
      } else {
        target.removeAttribute('data-has-value');
      }

      if (onChange) {
        onChange(e);
      }
    };

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLSelectElement>) => {
      e.currentTarget.classList.remove('animate-shake');
    };

    // --- ESTILOS ---

    const commonClasses = `
      w-full appearance-none transition-all duration-200
      disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 dark:disabled:bg-gray-800 dark:disabled:border-gray-700
      focus:outline-none
      text-gray-900 dark:text-white
      cursor-pointer
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
        peer-data-[has-value=true]:top-1 peer-data-[has-value=true]:translate-y-0 peer-data-[has-value=true]:scale-75
      `;
    } else if (variant === 'ghost') {
      variantClasses = `
        bg-transparent border border-transparent rounded-md
        hover:bg-gray-50 dark:hover:bg-gray-800/30
        focus:bg-white dark:focus:bg-gray-800 focus:shadow-sm focus:ring-2 focus:ring-blue-500
      `;
      floatingLabelActiveStyle = `
        peer-focus:-top-2 peer-focus:-translate-y-0 peer-focus:scale-75 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1
        peer-data-[has-value=true]:-top-2 peer-data-[has-value=true]:-translate-y-0 peer-data-[has-value=true]:scale-75 peer-data-[has-value=true]:bg-white dark:peer-data-[has-value=true]:bg-gray-800 peer-data-[has-value=true]:px-1
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
        peer-data-[has-value=true]:top-0 peer-data-[has-value=true]:-translate-y-1/2 peer-data-[has-value=true]:scale-75 peer-data-[has-value=true]:bg-white dark:peer-data-[has-value=true]:bg-gray-800 peer-data-[has-value=true]:px-1
      `;
    }

    let sizeClasses = '';
    if (variant === 'filled' && floatingLabel) {
      sizeClasses = sized === 'sm' ? 'pt-4 pb-0 text-xs h-8' : sized === 'lg' ? 'pt-7 pb-2 text-lg h-16' : 'pt-6 pb-2 text-base h-14';
    } else {
      sizeClasses = sized === 'sm' ? 'py-1 text-xs h-8' : sized === 'lg' ? 'py-3 text-lg h-12' : 'py-2.5 text-base h-11';
    }

    const hasLeftIcon = !!leftIcon;
    const paddingClasses = `
      ${hasLeftIcon ? 'pl-10' : 'pl-3'}
      pr-10
    `;

    const finalClasses = `
      ${commonClasses}
      ${variantClasses}
      ${sizeClasses}
      ${paddingClasses}
      ${floatingLabel ? 'text-transparent data-[has-value=true]:text-gray-900 dark:data-[has-value=true]:text-white focus:text-gray-900 dark:focus:text-white' : ''} 
      
      data-[invalid=true]:border-red-500 
      data-[invalid=true]:text-red-900 
      data-[invalid=true]:focus:border-red-500 
      data-[invalid=true]:focus:ring-red-500
    `;

    return (
      <div className={`flex flex-col gap-1 w-full ${containerClassName || ''}`}>
        {label && !floatingLabel && (
          <label htmlFor={props.id} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            {label}
          </label>
        )}

        <div className="relative flex items-center group">
          {leftIcon && (
            <span
              className={`absolute left-3 pointer-events-none flex items-center justify-center z-10 ${props.disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500'}`}>
              {leftIcon}
            </span>
          )}

          <select
            ref={setRef}
            onInvalid={handleInvalid}
            onInput={handleInput}
            onChange={handleChange}
            onAnimationEnd={handleAnimationEnd}
            className={`peer ${finalClasses} ${className || ''}`}
            {...props}>
            {/* Placeholder Opcional */}
            {placeholder && (
              <option value="" disabled selected hidden>
                {placeholder}
              </option>
            )}

            {/* Renderização Data Driven (via prop options) */}
            {options?.map(({ label: optLabel, value, ...optProps }) => (
              <option key={value} value={value} {...optProps}>
                {optLabel}
              </option>
            ))}

            {/* Renderização Manual (via children) */}
            {children}
          </select>

          {label && floatingLabel && (
            <label
              htmlFor={props.id}
              className={`
                absolute left-3 transition-all duration-200 pointer-events-none z-10 origin-left
                text-gray-500 dark:text-gray-400
                top-1/2 -translate-y-1/2 scale-100
                ${hasLeftIcon ? 'left-10' : 'left-3'}
                ${floatingLabelActiveStyle}
                peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                peer-data-[invalid=true]:text-red-500
                /* Ajuste de cor quando desabilitado */
                peer-disabled:text-gray-300 dark:peer-disabled:text-gray-600
              `}>
              {label}
            </label>
          )}

          <div
            className={`absolute right-3 flex items-center pointer-events-none z-10 ${props.disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500'}`}>
            {rightIcon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
