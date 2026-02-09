import React, { forwardRef, type InputHTMLAttributes, type ReactNode, useCallback, useRef } from 'react';

import HelperText from '../helper-text';
import type { IHelperProps } from '../helper-text/propTypes';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerClassName?: string;
  // Propriedade para receber o helper text do Form
  helperText?: IHelperProps;
  /**
   * - 'outlined': Borda completa (Padrão). Label corta a borda superior.
   * - 'filled': Fundo cinza, borda inferior apenas. Label fica interno no topo.
   * - 'ghost': Sem borda, ideal para tabelas.
   */
  variant?: 'outlined' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  floatingLabel?: boolean;
}

const Input = forwardRef<IInputProps, IInputProps>(
  (
    {
      label,
      type = 'text',
      className,
      containerClassName,
      leftIcon,
      rightIcon,
      onInvalid,
      onInput,
      variant = 'outlined',
      size = 'md',
      floatingLabel = false,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const internalInputRef = useRef<HTMLInputElement>(null);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    //TODO: ajusta conflito de ref entre forwardRef e uso interno
    const useSetRef = useCallback(
      (element: HTMLInputElement | null) => {
        internalInputRef.current = element;
        if (typeof ref === 'function') {
          ref(internalInputRef.current as unknown as IInputProps);
        } else if (ref) {
          (ref.current as any) = element;
        }
      },
      [ref],
    );

    const useHandleAttachHelper = useCallback((helper: IHelperProps) => {
      const el = internalInputRef.current as IInputProps | null;
      if (el) {
        el.helperText = helper;
      }
    }, []);

    const isPasswordType = type === 'password';
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
        input.type = input.type === 'password' ? 'text' : 'password';
        setIsPasswordVisible(input.type === 'text');
      }
    };

    // --- CONFIGURAÇÃO DE ESTILOS ---

    // Classes Base comuns a todos os inputs de texto
    const commonClasses = `
      w-full transition-all duration-200
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
      focus:outline-none
      text-gray-900 dark:text-white
    `;

    // 1. Variantes Visuais (Ajustadas para distinção real)
    let variantClasses = '';
    let floatingLabelActiveStyle = ''; // Estilo do label quando "sobe"

    if (variant === 'filled') {
      // Estilo FILLED: Fundo cinza, borda inferior forte, cantos superiores arredondados
      variantClasses = `
        bg-gray-100 dark:bg-gray-800 
        border-b-2 border-gray-300 dark:border-gray-600 border-t-0 border-l-0 border-r-0
        rounded-t-md rounded-b-none
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:bg-gray-200 dark:focus:bg-gray-700
        focus:border-blue-600 dark:focus:border-blue-500
      `;
      // No Filled, o label flutua para dentro (topo), não corta a borda
      floatingLabelActiveStyle = `
        peer-focus:top-1 peer-focus:translate-y-0 peer-focus:scale-75
        peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75
      `;
    } else if (variant === 'ghost') {
      // Estilo GHOST: Transparente, sem borda visível até focar
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
      // Estilo OUTLINED (Padrão): Borda completa, fundo transparente
      variantClasses = `
        bg-transparent
        border border-gray-400 dark:border-gray-500 rounded-md
        hover:border-gray-600 dark:hover:border-gray-400
        focus:border-blue-600 focus:ring-1 focus:ring-blue-600
      `;
      // No Outlined, o label corta a borda superior (precisa de bg-white para mascarar)
      floatingLabelActiveStyle = `
        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1
        peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-800 peer-[:not(:placeholder-shown)]:px-1
      `;
    }

    // 2. Tamanhos (Paddings)
    // Se for 'filled' com floating label, precisamos de mais padding-top para o texto não sobrepor o label
    let sizeClasses = '';
    if (variant === 'filled' && floatingLabel) {
      // Filled + Floating: Texto empurrado para baixo
      sizeClasses = size === 'sm' ? 'pt-4 pb-0 text-xs h-8' : size === 'lg' ? 'pt-7 pb-2 text-lg h-16' : 'pt-6 pb-2 text-base h-14';
    } else {
      // Padrão
      sizeClasses = size === 'sm' ? 'py-1 text-xs h-8' : size === 'lg' ? 'py-3 text-lg h-12' : 'py-2.5 text-base h-11'; // Aumentei um pouco a altura padrão
    }

    // 3. Ícones
    const hasLeftContent = !isCheckOrRadio && leftIcon;
    const hasRightContent = !isCheckOrRadio && (rightIcon || isPasswordType);
    const iconPadding = `
      ${hasLeftContent ? 'pl-10' : ''} 
      ${hasRightContent ? 'pr-10' : ''}
    `;

    // 4. Input Final
    let finalInputClasses = '';

    if (isCheckOrRadio) {
      // Estilo Específico para Checkbox/Radio
      // Radio: rounded-full (Círculo)
      // Checkbox: rounded (Quadrado arredondado)
      // Tamanho: w-5 h-5 (Igual ao exemplo anterior)
      const shapeClass = type === 'radio' ? 'rounded-full' : 'rounded';

      finalInputClasses = `
        w-5 h-5 
        text-blue-600 
        border-gray-300 
        ${shapeClass}
        focus:ring-blue-500 
        cursor-pointer 
        accent-blue-600
      `;
    } else {
      finalInputClasses = `
        ${commonClasses}
        ${variantClasses}
        ${sizeClasses}
        ${iconPadding}
        ${floatingLabel ? 'placeholder-transparent' : ''}
        
        data-[invalid=true]:border-red-500 
        data-[invalid=true]:text-red-900 
        data-[invalid=true]:focus:border-red-500 
        data-[invalid=true]:focus:ring-red-500
        data-[invalid=true]:placeholder:text-red-300
      `;
    }

    return (
      <div className={`flex flex-col gap-1 w-full ${containerClassName || ''}`}>
        {/* Label Estático (Clássico) */}
        {label && !floatingLabel && (
          <label
            htmlFor={props.id}
            className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isCheckOrRadio ? 'cursor-pointer' : ''}`}>
            {label}
          </label>
        )}

        <div className="relative flex items-center group">
          {hasLeftContent && (
            <span className="absolute left-3 text-gray-500 pointer-events-none flex items-center justify-center z-10">{leftIcon}</span>
          )}

          <input
            ref={useSetRef}
            type={type}
            onInvalid={handleInvalid}
            onInput={handleInput}
            onAnimationEnd={handleAnimationEnd}
            className={`peer ${finalInputClasses} ${className || ''}`}
            placeholder={floatingLabel && !placeholder ? ' ' : placeholder}
            {...props}
          />

          {/* Floating Label (Material) */}
          {label && floatingLabel && !isCheckOrRadio && (
            <label
              htmlFor={props.id}
              className={`
                absolute left-3 transition-all duration-200 pointer-events-none z-10 origin-left
                text-gray-500 dark:text-gray-400
                
                /* Estado Inicial (Placeholder visível/Vazio) */
                top-1/2 -translate-y-1/2 scale-100
                
                /* Ajuste de posição horizontal se tiver ícone */
                ${hasLeftContent ? 'left-10' : 'left-3'}

                /* Estado Ativo (Focado ou Preenchido) - Definido pela variável floatingLabelActiveStyle acima */
                ${floatingLabelActiveStyle}
                
                /* Cor quando focado */
                peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                
                /* Cor de Erro */
                peer-data-[invalid=true]:text-red-500
              `}>
              {label}
            </label>
          )}

          {hasRightContent && (
            <div className="absolute right-3 flex items-center gap-2 text-gray-400 z-10">
              {rightIcon}
              {isPasswordType && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700"
                  tabIndex={-1}>
                  {isPasswordVisible ? (
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
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a9.04 9.04 0 0 1 4.37-6.09" />
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M2 2l20 20" />
                    </svg>
                  ) : (
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
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        <HelperText attach={useHandleAttachHelper} />
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
