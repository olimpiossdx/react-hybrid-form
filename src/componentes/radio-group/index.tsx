import React, { createContext, forwardRef, useContext } from 'react';

// ============================================================================
// CONTEXTO (Para comunicação entre Pai e Filhos - Opção C)
// ============================================================================

interface RadioGroupContextValue {
  name?: string;
  value?: string | number | readonly string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const RadioContext = createContext<RadioGroupContextValue | null>(null);

// ============================================================================
// TIPOS
// ============================================================================

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps {
  children?: React.ReactNode; // Opção C (Compound)
  options?: RadioOption[]; // Opção B (Data Driven)

  name?: string;
  value?: string | number | readonly string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  direction?: 'col' | 'row'; // Apenas para Opção B
}

// ============================================================================
// CONTAINER PRINCIPAL (RadioGroup)
// ============================================================================

export const RadioGroup = ({
  children,
  options,
  name,
  value,
  onChange,
  label,
  error,
  disabled,
  className = '',
  direction = 'col',
}: RadioGroupProps) => {
  // Renderizador para Opção B (Data Driven)
  const renderOptions = () => (
    <div className={`flex ${direction === 'row' ? 'flex-row gap-6 flex-wrap' : 'flex-col gap-2'}`}>
      {options?.map((opt) => (
        <Radio key={opt.value} value={opt.value} label={opt.label} disabled={opt.disabled} />
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">{label}</span>}

      <div className={`flex flex-col gap-2 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
        <RadioContext.Provider value={{ name, value, onChange, disabled }}>{options ? renderOptions() : children}</RadioContext.Provider>
      </div>

      {error && <span className="text-xs text-red-500 font-medium animate-fadeIn">{error}</span>}
    </div>
  );
};

// ============================================================================
// ITEM INDIVIDUAL (Radio)
// ============================================================================

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number;
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, label, children, className = '', onChange, checked, disabled, name, ...props }, ref) => {
    // Tenta consumir o contexto (se estiver dentro de um RadioGroup)
    const context = useContext(RadioContext);

    // Determina os valores finais (Prioridade: Contexto > Props Individuais)
    const finalName = context?.name || name;
    const finalDisabled = context?.disabled || disabled;
    const finalOnChange = context?.onChange || onChange;

    // Lógica de Checked: Se tem contexto, compara valor. Se não, usa prop checked.
    const isChecked = context ? String(context.value) === String(value) : checked;

    return (
      <label className={`inline-flex items-center gap-3 cursor-pointer group ${className}`}>
        {/* Input Nativo: Estilizado globalmente pelo index.css */}
        <input
          ref={ref}
          type="radio"
          name={finalName}
          value={value}
          checked={isChecked}
          onChange={finalOnChange}
          disabled={finalDisabled}
          className="peer"
          {...props}
        />

        {/* Texto do Radio */}
        <span
          className={`text-sm transition-colors ${isChecked ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
          {children || label}
        </span>
      </label>
    );
  },
);
Radio.displayName = 'RadioGroup.Item';
