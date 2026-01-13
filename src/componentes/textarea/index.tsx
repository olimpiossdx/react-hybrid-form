import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string; // Mensagem de erro visual (opcional)
  autoResize?: boolean; // Se true, ajusta a altura ao conteúdo. Se false, permite resize manual.
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, name, required, autoResize = false, style, onChange, ...props }, ref) => {
    // Ref interna para manipular a altura do DOM
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const inputId = id || name;

    // Garante que a ref externa (do use-form) tenha acesso ao elemento
    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    // --- Lógica de Auto-Resize ---
    const adjustHeight = () => {
      const textarea = innerRef.current;
      if (!textarea) {
        return;
      }

      // Reseta para calcular a redução de altura corretamente
      textarea.style.height = 'auto';
      // Define a nova altura baseada no scrollHeight + bordas
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    };

    useEffect(() => {
      if (!autoResize || !innerRef.current) {
        return;
      }

      // Ajusta na montagem (caso tenha valor inicial)
      adjustHeight();

      // Listener nativo para performance suave
      const textarea = innerRef.current;
      textarea.addEventListener('input', adjustHeight);

      return () => textarea.removeEventListener('input', adjustHeight);
    }, [autoResize, props.value, props.defaultValue]);

    // Wrapper do onChange para garantir resize imediato ao digitar
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        adjustHeight();
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={innerRef}
          id={inputId}
          name={name}
          required={required}
          onChange={handleChange}
          // Classe .form-input: Herda estilos globais do sistema (cores, bordas, foco)
          // O CSS global já trata .form-input.is-touched:invalid se o seu sistema injeta essa classe
          className={`
            form-input 
            min-h-[100px] 
            text-sm
            block w-full
            ${autoResize ? 'resize-none overflow-hidden' : 'resize-y'}
            ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
          `}
          style={style}
          {...props}
        />

        {/* Mensagem de erro visual opcional */}
        {error && <span className="text-xs text-red-500 font-medium animate-fadeIn">{error}</span>}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
export default TextArea;
