import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string; // Para mensagens de erro visuais adicionais (opcional, já que usamos nativa)
  autoResize?: boolean; // Habilita o crescimento automático
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, name, required, autoResize = false, style, onChange, ...props }, ref) => {
    // Refs internas para manipulação do DOM
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const inputId = id || name;

    // Conecta a ref externa à ref interna para permitir foco e validação externa
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);
    // Lógica de Auto-Resize
    React.useEffect(() => {
      if (!autoResize || !innerRef.current) {
        return;
      }

      const textarea = innerRef.current;

      const adjustHeight = () => {
        // Reseta a altura para 'auto' para calcular corretamente a diminuição do texto
        textarea.style.height = 'auto';
        // Define a nova altura baseada no conteúdo (scrollHeight) + bordas
        textarea.style.height = `${textarea.scrollHeight + 2}px`;
      };

      // Ajusta na montagem inicial e sempre que o valor mudar
      adjustHeight();

      // Adiciona listener para input (garantia extra além do onChange do React)
      textarea.addEventListener('input', adjustHeight);
      return () => textarea.removeEventListener('input', adjustHeight);
    }, [autoResize, props.value, props.defaultValue]);

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
          onChange={onChange}
          // A classe 'form-input' vem do seu src/index.css e garante a padronização visual.
          // Adicionamos classes de resize condicionalmente.
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

        {/* Espaço para erro customizado visual, se desejado, 
            embora a validação nativa use o tooltip do navegador */}
        {error && <span className="text-xs text-red-500 font-medium animate-fadeIn">{error}</span>}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
export default TextArea;
