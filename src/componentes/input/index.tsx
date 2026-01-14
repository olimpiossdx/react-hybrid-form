import { forwardRef, type InputHTMLAttributes, type ReactNode, useCallback, useRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', className, containerClassName, leftIcon, rightIcon, onInvalid, onInput, ...props }, ref) => {
    // Refs para manipulação direta do DOM (Zero State)
    const internalInputRef = useRef<HTMLInputElement>(null);

    // Estado apenas para UI Toggle da senha
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Hook para combinar a ref externa (do usuário) com a nossa ref interna
    const setRef = useCallback(
      (element: HTMLInputElement | null) => {
        internalInputRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
        }
      },
      [ref],
    );

    const isPasswordType = type === 'password';
    // Se o tipo for checkbox ou radio, mudamos drasticamente o estilo base
    const isCheckOrRadio = type === 'checkbox' || type === 'radio';

    const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
      e.currentTarget.setAttribute('data-invalid', 'true');
      e.currentTarget.classList.add('animate-shake');
      if (onInvalid) {
        onInvalid(e);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        e.currentTarget.removeAttribute('data-invalid');
      }
      if (onInput) {
        onInput(e);
      }
    };

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLInputElement>) => {
      e.currentTarget.classList.remove('animate-shake');
    };

    const togglePasswordVisibility = (e: React.MouseEvent) => {
      e.preventDefault();
      const input = internalInputRef.current;
      if (input) {
        // Alterna o tipo do input real e o estado do ícone
        const newType = input.type === 'password' ? 'text' : 'password';
        input.type = newType;
        setIsPasswordVisible(newType === 'text');
      }
    };

    // Define classes base dependendo se é campo de texto ou seleção
    const baseInputClasses = isCheckOrRadio
      ? 'w-5 h-5 accent-blue-600 cursor-pointer' // Estilo unificado para Checkbox e Radio (conforme exemplo)
      : 'w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white placeholder:text-gray-400';

    return (
      <div className={`flex flex-col gap-1 w-full ${containerClassName || ''}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isCheckOrRadio ? 'cursor-pointer' : ''}`}>
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && !isCheckOrRadio && (
            <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center">{leftIcon}</span>
          )}

          <input
            ref={setRef}
            type={type}
            onInvalid={handleInvalid}
            onInput={handleInput}
            onAnimationEnd={handleAnimationEnd}
            className={`
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              
              /* Estilo Base Condicional */
              ${baseInputClasses}
              
              /* Estilo de Erro (Data Attribute) */
              data-[invalid=true]:border-red-500 
              data-[invalid=true]:text-red-900 
              data-[invalid=true]:focus:border-red-500 
              data-[invalid=true]:focus:ring-red-500
              
              /* Ajustes de Padding para Ícones (Apenas Texto) */
              ${!isCheckOrRadio && leftIcon ? 'pl-10' : ''}
              ${!isCheckOrRadio && (rightIcon || isPasswordType) ? 'pr-10' : ''}
              
              ${className || ''}
            `}
            {...props}
          />

          {(rightIcon || isPasswordType) && !isCheckOrRadio && (
            <div className="absolute right-3 flex items-center gap-2 text-gray-400">
              {rightIcon}

              {isPasswordType && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                  tabIndex={-1}
                  aria-label="Alternar visibilidade da senha">
                  {/* Ícone: Mostrar Senha (quando está oculta) */}
                  {!isPasswordVisible && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  )}

                  {/* Ícone: Ocultar Senha (quando está visível) */}
                  {isPasswordVisible && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
