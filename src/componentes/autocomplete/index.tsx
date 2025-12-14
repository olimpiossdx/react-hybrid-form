import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export interface IOption
  extends React.DetailedHTMLProps<
    React.OptionHTMLAttributes<HTMLOptionElement>,
    HTMLOptionElement
  > {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  name: string;
  label: string;
  options: IOption[];

  // MUDANÇA: Padronizado para defaultValue conforme nossa arquitetura
  defaultValue?: string;

  placeholder?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  debounceTime?: number;
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
  renderOption?: (option: IOption) => React.ReactNode;

  // Compatibilidade com código legado que usa initialValue
  initialValue?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  label,
  options = [],
  required,
  validationKey,
  defaultValue = "",
  initialValue, // Suporte a ambos
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
  renderOption,
}) => {
  // Resolve valor inicial (prioriza defaultValue novo, fallback para initialValue antigo)
  const realDefaultValue = defaultValue || initialValue || "";

  const getOptionLabel = (opt: IOption) =>
    opt.label || (typeof opt.children === "string" ? opt.children : "");
  const findLabelByValue = (val: string) => {
    const found = options.find((s) => s.value === val);
    return found ? getOptionLabel(found) : "";
  };

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>(realDefaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const selectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincronia DOM (Reset)
  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;

    const handleExternalChange = () => {
      if (document.activeElement === visibleInputRef.current) return;

      const newValue = select.value;
      if (!newValue) {
        setSelectedValue("");
        setInputValue("");
        return;
      }

      const labelFromDataset = select.dataset.label;
      const labelFromList = findLabelByValue(newValue);
      const finalLabel = labelFromDataset || labelFromList;

      setSelectedValue(newValue);
      if (finalLabel) setInputValue(finalLabel);

      if (visibleInputRef.current)
        visibleInputRef.current.setCustomValidity("");
    };

    if (!inputValue) handleExternalChange();

    select.addEventListener("change", handleExternalChange);
    select.addEventListener("input", handleExternalChange);
    return () => {
      select.removeEventListener("change", handleExternalChange);
      select.removeEventListener("input", handleExternalChange);
    };
  }, [options, realDefaultValue]);

  // Positioning
  const updateDropdownPosition = () => {
    if (showSuggestions && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, {
      capture: true,
    });
    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, {
        capture: true,
      });
    };
  }, [showSuggestions]);

  useEffect(() => {
    if (showSuggestions && activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, showSuggestions]);

  const handleOpen = () => {
    if (!readOnly && !disabled) setShowSuggestions(true);
  };

  const updateHiddenSelect = (newSelectedValue: string, newLabel?: string) => {
    setSelectedValue(newSelectedValue);
    if (visibleInputRef.current) visibleInputRef.current.setCustomValidity("");

    if (selectRef.current) {
      const nativeSelect = selectRef.current;
      nativeSelect.value = newSelectedValue;
      if (newLabel) nativeSelect.dataset.label = newLabel;
      else if (newSelectedValue === "") delete nativeSelect.dataset.label;
      nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const filteredSuggestions = useMemo(() => {
    if (onSearch) return options;
    if (!inputValue && !showSuggestions) return options;
    if (!inputValue) return options;
    return options.filter((s) =>
      getOptionLabel(s).toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue, showSuggestions, onSearch]);

  const handleScrollList = (e: React.UIEvent<HTMLUListElement>) => {
    if (!onLoadMore || isLoadingMore || !hasMore) return;
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
      e.currentTarget.clientHeight + 10
    )
      onLoadMore();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setInputValue(text);
    if (!showSuggestions) setShowSuggestions(true);
    setActiveIndex(-1);
    event.target.setCustomValidity("");
    if (selectedValue) updateHiddenSelect("");

    if (onSearch) {
      setIsTyping(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(text);
        setIsTyping(false);
      }, debounceTime);
    } else {
      const exactMatch = options.find(
        (s) => getOptionLabel(s).toLowerCase() === text.toLowerCase()
      );
      if (exactMatch)
        updateHiddenSelect(exactMatch.value, getOptionLabel(exactMatch));
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

  const handleInvalidSelect = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();
    if (visibleInputRef.current) {
      visibleInputRef.current.setCustomValidity(
        e.currentTarget.validationMessage
      );
      visibleInputRef.current.reportValidity();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== visibleInputRef.current) {
        setShowSuggestions(false);
        if (!onSearch && selectedValue) {
          const isValid = options.some((s) => getOptionLabel(s) === inputValue);
          if (!isValid) {
            setInputValue("");
            updateHiddenSelect("");
          }
        }
      }
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      handleOpen();
      return;
    }
    const maxIndex = filteredSuggestions.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filteredSuggestions[activeIndex])
        handleSelectOption(filteredSuggestions[activeIndex]);
    } else if (e.key === "Escape") setShowSuggestions(false);
  };

  const isBusy = isLoading || isTyping;
  const finalPlaceholder = isBusy
    ? "Buscando..."
    : placeholder || "Selecione...";

  // --- RENDERIZAÇÃO DO PORTAL (TEMA APLICADO) ---
  const dropdownContent = (showSuggestions || isBusy || errorMessage) &&
    !disabled &&
    !readOnly && (
      <ul
        ref={listRef}
        onScroll={handleScrollList}
        className={`
        absolute z-9999 rounded-b-lg border shadow-2xl mt-1 max-h-60 overflow-y-auto
        /* TEMA: Fundo Branco (Light) / Cinza (Dark) */
        bg-white dark:bg-gray-800 
        border-gray-200 dark:border-gray-700
      `}
        style={{
          top: dropdownCoords.top,
          left: dropdownCoords.left,
          width: dropdownCoords.width,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {isBusy && filteredSuggestions.length === 0 && (
          <li className="px-4 py-3 text-sm text-cyan-600 dark:text-cyan-400 text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-cyan-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            Buscando...
          </li>
        )}
        {filteredSuggestions.length > 0
          ? filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.value}
                role="option"
                aria-selected={selectedValue === suggestion.value}
                className={`
                    px-4 py-2.5 text-sm cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0
                    ${
                      index === activeIndex
                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-100"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                    ${
                      selectedValue === suggestion.value
                        ? "font-bold bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    ${!renderOption ? "" : ""}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectOption(suggestion);
                }}
              >
                {renderOption
                  ? renderOption(suggestion)
                  : getOptionLabel(suggestion)}
              </li>
            ))
          : !isBusy &&
            !errorMessage && (
              <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                {onSearch && !inputValue
                  ? "Digite para pesquisar..."
                  : "Nenhum resultado encontrado."}
              </li>
            )}
        {isLoadingMore && (
          <li className="px-4 py-2 text-xs text-center text-blue-600 dark:text-blue-400 border-t border-gray-100 dark:border-gray-700">
            Carregando mais...
          </li>
        )}
        {errorMessage && (
          <li className="px-4 py-2 text-xs text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800">
            ⚠️ {errorMessage}
          </li>
        )}
      </ul>
    );

  return (
    <div
      className={`relative mb-4 ${className}`}
      ref={containerRef}
      onBlur={handleBlur}
    >
      <label
        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={`autocomplete-${name}`}
      >
        {label}{" "}
        {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          ref={visibleInputRef}
          id={`autocomplete-${name}`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleOpen}
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          role="combobox"
          aria-expanded={showSuggestions}
          autoComplete="off"
          placeholder={finalPlaceholder}
          className={`form-input pr-8 ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${errorMessage ? "border-red-500" : ""}`}
        />
        <div className="absolute right-2 top-2.5 text-gray-400 flex items-center">
          {isBusy ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-500 border-t-transparent"></div>
          ) : (
            clearable &&
            inputValue &&
            !disabled &&
            !readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            )
          )}
        </div>
      </div>

      <select
        ref={selectRef}
        id={name}
        name={name}
        defaultValue={realDefaultValue}
        onInvalid={handleInvalidSelect}
        required={required}
        disabled={disabled}
        data-validation={validationKey}
        className="absolute w-px h-px overflow-hidden clip-[rect(0,0,0,0)] bottom-0 left-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {getOptionLabel(opt)}
          </option>
        ))}
      </select>
      {showSuggestions && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default Autocomplete;
