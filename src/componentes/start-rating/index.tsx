import React, { useState, useRef, useEffect, useMemo } from 'react';

interface StarRatingProps {
  name: string;
  label?: string;
  
  // Padronização: defaultValue é o termo React correto para componentes não controlados
  defaultValue?: number;
  initialValue?: number; // Mantido para retrocompatibilidade
  
  maxStars?: number;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  validationKey?: string;
  className?: string;
  starClassName?: string;
}

/**
 * Componente de Avaliação Híbrido (v2.6).
 * * Suporte a Temas (Dark/Light) e Acessibilidade Nativa.
 */
const StarRating: React.FC<StarRatingProps> = ({ 
  name, 
  label, 
  required, 
  readOnly, 
  disabled,
  defaultValue = 0,
  initialValue,
  maxStars = 5,
  onChange,
  validationKey,
  className = "",
  starClassName = "w-8 h-8"
}) => {
  // Resolve o valor inicial (prioriza defaultValue)
  const startValue = defaultValue || initialValue || 0;

  const [currentValue, setCurrentValue] = useState<number>(Number(startValue));
  const [hoverValue, setHoverValue] = useState<number>(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const effectiveDisabled = disabled || readOnly;
  const starsArray = useMemo(() => Array.from({ length: maxStars }, (_, i) => i + 1), [maxStars]);

  // Sincronia de Prop (se mudar externamente)
  useEffect(() => { setCurrentValue(Number(startValue)); }, [startValue]);

  // Sincronia com DOM (Reset & Load Data)
  useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      const handleExternalUpdate = () => {
          const val = Number(input.value);
          const safeVal = isNaN(val) ? 0 : val;
          setCurrentValue(prev => (prev !== safeVal ? safeVal : prev));
      };

      input.addEventListener('input', handleExternalUpdate);
      input.addEventListener('change', handleExternalUpdate);
      
      return () => {
          input.removeEventListener('input', handleExternalUpdate);
          input.removeEventListener('change', handleExternalUpdate);
      };
  }, []);

  const updateValue = (newValue: number) => {
    if (newValue !== currentValue) setCurrentValue(newValue);
    if (onChange) onChange(newValue);
    
    if (inputRef.current) {
      if (inputRef.current.value !== String(newValue || '')) {
          inputRef.current.value = newValue === 0 ? '' : String(newValue);
          inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
      inputRef.current.setCustomValidity("");
    }
  };

  const handleClick = (value: number) => {
    if (effectiveDisabled) return;
    const newValue = value === currentValue ? 0 : value;
    updateValue(newValue);
    containerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (effectiveDisabled) return;
    switch (e.key) {
        case 'ArrowRight': case 'ArrowUp': e.preventDefault(); updateValue(Math.min(maxStars, currentValue + 1)); break;
        case 'ArrowLeft': case 'ArrowDown': e.preventDefault(); updateValue(Math.max(0, currentValue - 1)); break;
        case 'Home': e.preventDefault(); updateValue(0); break;
        case 'End': e.preventDefault(); updateValue(maxStars); break;
    }
  };

  const handleInvalid = (_: React.FormEvent<HTMLInputElement>) => {
      // Deixa o comportamento nativo fluir
  };

  const handleBlur = () => {
    if (effectiveDisabled) return;
    inputRef.current?.dispatchEvent(new Event('blur', { bubbles: true }));
  };

  const displayValue = hoverValue || currentValue;

  return (
    <div className={`relative mb-4 ${effectiveDisabled ? 'opacity-60' : ''} ${className}`}>
      {label && (
        <label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300' htmlFor={name}>
            {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}
      
      <div className="relative w-fit group">
        
        {/* CAMADA VISUAL (Estrelas) */}
        <div 
          ref={containerRef} 
          className={`
              flex items-center gap-1 p-1 rounded-md outline-none transition-colors
              ${effectiveDisabled ? 'pointer-events-none' : ''}
              /* FOCO: Anel azul claro no Light, azul neon no Dark */
              focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 
              focus:bg-gray-100 dark:focus:bg-gray-800
          `}
          tabIndex={effectiveDisabled ? -1 : 0} 
          role="slider" 
          aria-valuenow={currentValue} 
          aria-valuemax={maxStars}
          aria-label={label || name}
          onBlur={handleBlur} 
          onKeyDown={handleKeyDown} 
          onMouseLeave={() => setHoverValue(0)}
        >
          {starsArray.map((starIndex) => (
            <svg 
              key={starIndex} 
              onClick={() => handleClick(starIndex)} 
              onMouseEnter={() => !effectiveDisabled && setHoverValue(starIndex)}
              className={`
                  transition-transform duration-100 relative z-10
                  ${starClassName} 
                  ${effectiveDisabled ? '' : 'cursor-pointer hover:scale-110'} 
                  /* COR DINÂMICA: Amarelo se ativo, Cinza se inativo */
                  ${displayValue >= starIndex 
                      ? 'text-yellow-500 dark:text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'}
              `}
              fill='currentColor' 
              viewBox='0 0 20 20'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
          ))}
        </div>

        {/* INPUT SENTINELA (Validação Nativa)
            - w-full h-full + z-0: Garante que o navegador veja o input atrás das estrelas
            - pointer-events-auto: Permite que o balão de erro ancore aqui
        */}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type='number'
          onInvalid={handleInvalid}
          required={required}
          min={required ? 1 : 0}
          max={maxStars}
          disabled={disabled}
          data-validation={validationKey}
          defaultValue={currentValue === 0 ? '' : currentValue}
          tabIndex={-1} 
          className="absolute bottom-0 left-0 w-full h-full opacity-0 pointer-events-auto z-0"
          style={{ appearance: "none" }}
        />
      </div>
    </div>
  );
};

export default StarRating;