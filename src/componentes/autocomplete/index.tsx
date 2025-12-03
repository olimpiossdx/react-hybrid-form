import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

export interface IOption extends React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement> {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  name: string;
  label: string;
  options: IOption[];
  initialValue?: string;
  placeholder?: string;

  // Async
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  debounceTime?: number;

  // Paginação
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;

  errorMessage?: string;
  clearable?: boolean;
  
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  validationKey?: string;
  className?: string;
  
  // Custom Render
  renderOption?: (option: IOption) => React.ReactNode;
}

/**
 * Componente Autocomplete Híbrido (v2.5 - Validation Proxy).
 */
const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  label,
  options = [],
  required,
  validationKey,
  initialValue = "",
  disabled,
  readOnly,
  onSearch,
  onLoadMore,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  errorMessage,
  clearable = false,
  debounceTime = 300,
  className = "",
  placeholder,
  renderOption
}) => {
  const getOptionLabel = (opt: IOption) => opt.label || (typeof opt.children === 'string' ? opt.children : "");

  const findLabelByValue = (val: string) => {
    const found = options.find(s => s.value === val);
    return found ? getOptionLabel(found) : "";
  };

  const [inputValue, setInputValue] = useState<string>(""); 
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isTyping, setIsTyping] = useState(false);
  
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

  const selectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- SINCRONIA DOM ---
  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;

    const handleExternalChange = () => {
      if (document.activeElement === visibleInputRef.current) return;

      const newValue = select.value;
      
      // Lógica Híbrida: Dataset Label (Prioridade) ou Lista (Fallback)
      const labelFromDataset = select.dataset.label;
      const labelFromList = findLabelByValue(newValue);
      const finalLabel = labelFromDataset || labelFromList;
      
      setSelectedValue(newValue);
      
      if (finalLabel || newValue === "") {
          setInputValue(finalLabel || "");
      }
    };

    if (!inputValue) handleExternalChange();

    select.addEventListener('change', handleExternalChange);
    // Ouvimos 'input' para capturar resets do setNativeValue imediatamente
    select.addEventListener('input', handleExternalChange);

    return () => {
        select.removeEventListener('change', handleExternalChange);
        select.removeEventListener('input', handleExternalChange);
    };
  }, [options, initialValue]); 

  // --- POSITIONING ---
  const updateDropdownPosition = () => {
    if (showSuggestions && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, { capture: true });
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, { capture: true });
    };
  }, [showSuggestions]);

  useEffect(() => {
    if (showSuggestions && activeIndex >= 0 && listRef.current) {
        const activeItem = listRef.current.children[activeIndex] as HTMLElement;
        if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, showSuggestions]);

  const handleOpen = () => {
      if (readOnly || disabled) return;
      setShowSuggestions(true);
  };

  // --- ATUALIZAÇÃO DE VALOR ---
  const updateHiddenSelect = (newSelectedValue: string, newLabel?: string) => {
    setSelectedValue(newSelectedValue);
    
    // 1. Limpa o erro no input VISÍVEL imediatamente (UX: Reward Early)
    if (visibleInputRef.current) {
        visibleInputRef.current.setCustomValidity("");
    }

    if (selectRef.current) {
      const nativeSelect = selectRef.current;
      nativeSelect.value = newSelectedValue;
      
      if (newLabel) nativeSelect.dataset.label = newLabel;
      else if (newSelectedValue === "") delete nativeSelect.dataset.label;

      nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const filteredSuggestions = useMemo(() => {
    if (onSearch) return options;
    if (!inputValue && !showSuggestions) return options;
    if (!inputValue) return options;
    return options.filter(suggestion =>
      getOptionLabel(suggestion).toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue, showSuggestions, onSearch]);

  const handleScrollList = (e: React.UIEvent<HTMLUListElement>) => {
      if (!onLoadMore || isLoadingMore || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight + 10) onLoadMore();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setInputValue(text);
    if (!showSuggestions) setShowSuggestions(true);
    setActiveIndex(-1);

    // Limpa erro visual ao começar a digitar
    event.target.setCustomValidity("");

    if (selectedValue) updateHiddenSelect("");

    if (onSearch) {
        setIsTyping(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { onSearch(text); setIsTyping(false); }, debounceTime);
    } else {
        const exactMatch = options.find(s => getOptionLabel(s).toLowerCase() === text.toLowerCase());
        if (exactMatch) updateHiddenSelect(exactMatch.value, getOptionLabel(exactMatch));
    }
  };

  const handleSelectOption = (suggestion: IOption) => {
    if (suggestion.disabled) return;
    const displayLabel = getOptionLabel(suggestion);
    
    setInputValue(displayLabel);
    updateHiddenSelect(suggestion.value, displayLabel);
    
    setShowSuggestions(false);
    setActiveIndex(-1);
    visibleInputRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    updateHiddenSelect("");
    visibleInputRef.current?.focus();
    if (onSearch) onSearch("");
  };

  // --- O PROXY DE VALIDAÇÃO ---
  // Captura o erro do Select Oculto e exibe no Input Visível
  const handleInvalidSelect = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault(); // Impede o balão no select oculto
    
    if (visibleInputRef.current) {
      const msg = e.currentTarget.validationMessage;
      // Transfere a mensagem
      visibleInputRef.current.setCustomValidity(msg);
      // Exibe o balão no lugar certo
      visibleInputRef.current.reportValidity();
    }
  };

  const handleBlur = (_: React.FocusEvent<HTMLDivElement>) => {
    setTimeout(() => {
       if (document.activeElement !== visibleInputRef.current) {
           setShowSuggestions(false);
           if (!onSearch && selectedValue) {
               const isValid = options.some(s => getOptionLabel(s) === inputValue);
               if (!isValid) { setInputValue(""); updateHiddenSelect(""); }
           }
       }
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault(); handleOpen(); return;
      }
      const maxIndex = filteredSuggestions.length - 1;
      if (e.key === 'ArrowDown') {
        e.preventDefault(); setActiveIndex(prev => (prev < maxIndex ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && filteredSuggestions[activeIndex]) handleSelectOption(filteredSuggestions[activeIndex]);
      } else if (e.key === 'Escape') setShowSuggestions(false);
  };

  const isBusy = isLoading || isTyping;
  const finalPlaceholder = isBusy ? "Buscando..." : (placeholder || "Selecione...");

  // Portal Content (Mantido igual)
  const dropdownContent = (showSuggestions || isBusy || errorMessage) && !disabled && !readOnly && (
    <ul ref={listRef} onScroll={handleScrollList} className="bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-2xl z-9999"
      style={{ position: 'absolute', top: dropdownCoords.top, left: dropdownCoords.left, width: dropdownCoords.width }}
      onMouseDown={(e) => e.preventDefault()} 
    >
      {isBusy && filteredSuggestions.length === 0 && (
         <li className="px-4 py-3 text-sm text-cyan-400 text-center flex items-center justify-center gap-2">
             <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
             Buscando...
         </li>
      )}
      {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion, index) => (
              <li key={suggestion.value} role="option" aria-selected={selectedValue === suggestion.value}
                className={`cursor-pointer transition-colors border-b border-gray-600/30 last:border-0 ${index === activeIndex ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-600'} ${selectedValue === suggestion.value ? 'font-semibold bg-gray-600' : ''} ${!renderOption ? 'px-4 py-2.5 text-sm' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleSelectOption(suggestion); }}
              >
                {renderOption ? renderOption(suggestion) : getOptionLabel(suggestion)}
              </li>
          ))
      ) : (
          !isBusy && !errorMessage && <li className="px-4 py-3 text-sm text-gray-400 text-center">{onSearch && !inputValue ? "Digite para pesquisar..." : "Nenhum resultado encontrado."}</li>
      )}
      {isLoadingMore && <li className="px-4 py-2 text-xs text-center text-blue-300">Carregando mais...</li>}
      {errorMessage && <li className="px-4 py-2 text-xs text-center text-red-300">⚠️ {errorMessage}</li>}
    </ul>
  );

  return (
    <div className={`relative mb-4 ${className}`} ref={containerRef} onBlur={handleBlur}>
      <label className="block mb-1 text-gray-300" htmlFor={`autocomplete-${name}`}>{label} {required && <span className="text-red-400">*</span>}</label>
      <div className="relative">
          <input ref={visibleInputRef} id={`autocomplete-${name}`} type="text" value={inputValue} onChange={handleInputChange}
            onFocus={handleOpen} onClick={handleOpen} onKeyDown={handleKeyDown} disabled={disabled} readOnly={readOnly}
            role="combobox" aria-expanded={showSuggestions} autoComplete="off" placeholder={finalPlaceholder}
            className={`form-input w-full p-2.5 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-8 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${errorMessage ? 'border-red-500' : ''}`}
          />
          <div className="absolute right-2 top-3 text-gray-400 flex items-center">
              {isBusy ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-500 border-t-transparent"></div> : 
               clearable && inputValue && !disabled && !readOnly && <button type="button" onClick={handleClear} className="hover:text-white">✕</button>}
          </div>
      </div>
      
      {/* SELECT OCULTO (COM O PROXY) */}
      <select
        ref={selectRef}
        id={name}
        name={name}
        defaultValue={initialValue}
        onInvalid={handleInvalidSelect} // <--- AQUI
        required={required}
        disabled={disabled}
        data-validation={validationKey}
        className='absolute w-px h-px overflow-hidden clip-[rect(0,0,0,0)] bottom-0 left-0'
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">Selecione...</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{getOptionLabel(opt)}</option>)}
      </select>

      {showSuggestions && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default Autocomplete;