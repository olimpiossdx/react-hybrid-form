import React, { useState, useRef, useEffect, useMemo } from 'react';

interface StarRatingProps {
  name: string;
  label?: string;
  initialValue?: number;
  maxStars?: number;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  validationKey?: string;
  className?: string;
  starClassName?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  name, label, required, readOnly, disabled, initialValue = 0, maxStars = 5,
  onChange, validationKey, className = "", starClassName = "w-8 h-8"
}) => {
  const [currentValue, setCurrentValue] = useState<number>(Number(initialValue) || 0);
  const [hoverValue, setHoverValue] = useState<number>(0);
  const logicInputRef = useRef<HTMLInputElement>(null);
  const anchorInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const effectiveDisabled = disabled || readOnly;
  const starsArray = useMemo(() => Array.from({ length: maxStars }, (_, i) => i + 1), [maxStars]);

  useEffect(() => { setCurrentValue(Number(initialValue) || 0); }, [initialValue]);

  useEffect(() => {
      const input = logicInputRef.current;
      if (!input) return;
      const handleExternalUpdate = () => {
          const val = Number(input.value);
          setCurrentValue(isNaN(val) ? 0 : val);
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
    if (logicInputRef.current && logicInputRef.current.value !== String(newValue || '')) {
      logicInputRef.current.value = newValue === 0 ? '' : String(newValue);
      logicInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (anchorInputRef.current) anchorInputRef.current.setCustomValidity("");
  };

  const handleClick = (value: number) => {
    if (effectiveDisabled) return;
    const newValue = value === currentValue ? 0 : value;
    updateValue(newValue);
    containerRef.current?.focus();
  };

  // --- LÓGICA DE TOUCH (SWIPE) ---
  // Permite arrastar o dedo sobre as estrelas para selecionar
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (effectiveDisabled || !containerRef.current) return;
    
    // Evita scroll da tela enquanto arrasta as estrelas
    // (Opcional: remover se quiser permitir scroll vertical se o gesto for muito inclinado)
    // e.preventDefault(); 

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calcula a posição relativa do toque dentro do container
    const x = touch.clientX - rect.left;
    
    // Descobre qual estrela corresponde a essa posição X
    // (Largura total / num estrelas)
    const widthPerStar = rect.width / maxStars;
    const rawValue = Math.ceil(x / widthPerStar);
    
    // Clampa entre 0 e maxStars
    const newValue = Math.max(0, Math.min(maxStars, rawValue));
    
    // Atualiza visualmente (Hover) enquanto arrasta
    setHoverValue(newValue);
  };

  const handleTouchEnd = () => {
    if (effectiveDisabled) return;
    // Ao soltar o dedo, comita o valor que estava no hover
    if (hoverValue > 0) {
        updateValue(hoverValue);
    }
    setHoverValue(0); // Limpa o hover
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

  return (
    <div className={`relative mb-4 ${effectiveDisabled ? 'opacity-50' : ''} ${className}`}>
      {label && <label className='block mb-1 text-gray-300'>{label} {required && <span className="text-red-400">*</span>}</label>}
      <div className="relative w-fit">
        <div 
            ref={containerRef} 
            className="flex items-center gap-1 p-1 rounded-md outline-none focus:ring-2 focus:ring-yellow-400 touch-none" // touch-none ajuda no mobile
            tabIndex={effectiveDisabled ? -1 : 0} 
            role="slider" 
            aria-valuenow={currentValue} 
            aria-valuemax={maxStars}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseLeave={() => setHoverValue(0)}
            // Eventos de Touch
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => setHoverValue(0)}
        >
          {starsArray.map((starIndex) => (
            <svg key={starIndex} onClick={() => handleClick(starIndex)} onMouseEnter={() => !effectiveDisabled && setHoverValue(starIndex)}
              className={`transition-transform duration-100 z-10 relative ${starClassName} ${effectiveDisabled ? '' : 'cursor-pointer hover:scale-110'} ${(hoverValue || currentValue) >= starIndex ? 'text-yellow-400' : 'text-gray-600'}`}
              fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
          ))}
        </div>
        <input ref={anchorInputRef} type="text" readOnly tabIndex={-1} style={{ height: '1px', opacity: 0 }} className="absolute bottom-0 left-0 w-full pointer-events-none" />
      </div>
      <input ref={logicInputRef} id={name} name={name} type='number' value={currentValue === 0 ? '' : currentValue} onChange={() => {}} 
        onInvalid={(e) => { e.preventDefault(); anchorInputRef.current?.setCustomValidity((e.target as HTMLInputElement).validationMessage); anchorInputRef.current?.reportValidity(); }}
        required={required} min={required ? 1 : 0} max={maxStars} disabled={disabled} data-validation={validationKey} tabIndex={-1}
        className='absolute w-full h-px opacity-0 bottom-0 left-0 m-0 p-0 border-0 pointer-events-auto z-0' />
    </div>
  );
  
  function handleBlur() {
    if (effectiveDisabled) return;
    logicInputRef.current?.dispatchEvent(new Event('blur', { bubbles: true }));
  }
};

export default StarRating;