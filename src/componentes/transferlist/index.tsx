import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, GripVertical, Search, X } from 'lucide-react';

// ==========================================
// 1. Definições de Tipos
// ==========================================

export interface TransferListItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TransferListProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  dataSource: TransferListItem[];
  value?: string[];
  onChange?: (value: string[]) => void;
  titles?: [string, string];
  oneWay?: boolean;
  label?: string;
  // Removemos 'error' pois usaremos validação nativa
}

// ==========================================
// 2. Subcomponentes e Utilitários
// ==========================================

const ActionButton = ({
  onClick,
  disabled,
  icon,
  ariaLabel,
}: {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  ariaLabel: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    tabIndex={-1}
    className="
      flex items-center justify-center h-8 w-8 rounded-md border shadow-sm transition-all
      bg-white dark:bg-gray-800 
      border-gray-200 dark:border-gray-700 
      text-gray-500 dark:text-gray-400
      
      hover:bg-blue-50 dark:hover:bg-blue-900/30 
      hover:text-blue-600 dark:hover:text-blue-400 
      hover:border-blue-200 dark:hover:border-blue-800

      disabled:opacity-50 disabled:cursor-not-allowed 
      disabled:bg-gray-50 dark:disabled:bg-gray-800/50 
      disabled:text-gray-300 dark:disabled:text-gray-600
      
      active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
    ">
    {icon}
  </button>
);

const TransferListColumn = ({
  title,
  items,
  checkedKeys,
  focusedKey,
  onItemClick,
  onKeyDown,
  onSearch,
  searchValue,
  side,
  isDraggingOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  setFocusedKey,
}: any) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (focusedKey && listRef.current) {
      const focusedEl = listRef.current.querySelector(`[data-key="${focusedKey}"]`);
      if (focusedEl) {
        focusedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedKey]);

  const checkedCountInList = items.filter((i: any) => checkedKeys.includes(i.key)).length;

  return (
    <div
      className={`
        flex flex-1 flex-col h-full rounded-lg border transition-all duration-200 overflow-hidden 
        bg-white dark:bg-gray-800
        ${isDraggingOver ? 'border-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/30' : 'border-gray-200 dark:border-gray-700'}
        focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-900/50 
        focus-within:border-blue-400 dark:focus-within:border-blue-600
      `}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}>
      <div
        className="flex items-center justify-between border-b px-3 py-2 select-none
        border-gray-100 dark:border-gray-700 
        bg-gray-50/50 dark:bg-gray-900/50
      ">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
            {items.length} itens {checkedCountInList > 0 && `• ${checkedCountInList} selec.`}
          </span>
        </div>
      </div>

      <div className="p-2 border-b border-gray-100 dark:border-gray-700">
        <div className="relative group">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors
            text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400
          "
          />
          <input
            type="text"
            placeholder="Filtrar..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-md border py-1.5 pl-9 pr-8 text-sm transition-all
              bg-white dark:bg-gray-950
              border-gray-200 dark:border-gray-700
              text-gray-700 dark:text-gray-200
              placeholder:text-gray-400 dark:placeholder:text-gray-600
              focus:border-blue-500 dark:focus:border-blue-500 
              focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900
            "
          />
          {searchValue && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full 
                hover:bg-gray-100 dark:hover:bg-gray-800 
                text-gray-400 dark:text-gray-500"
              tabIndex={-1}>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto p-1 min-h-[300px] outline-none scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700"
        tabIndex={0}
        role="listbox"
        aria-multiselectable="true"
        onKeyDown={(e) => onKeyDown(e, items, side)}
        onFocus={() => {
          if (!focusedKey && items.length > 0) {
            setFocusedKey(items[0].key);
          }
        }}>
        {items.length === 0 ? (
          <div
            className="h-full flex flex-col items-center justify-center p-4 text-center select-none
            text-gray-400 dark:text-gray-500
          ">
            <p className="text-sm italic opacity-60">Lista vazia</p>
          </div>
        ) : (
          items.map((item: any) => {
            const isChecked = checkedKeys.includes(item.key);
            const isFocused = focusedKey === item.key;

            return (
              <li
                key={item.key}
                data-key={item.key}
                role="option"
                aria-selected={isChecked}
                draggable={!item.disabled}
                onDragStart={(e) => onDragStart(e, item.key)}
                onClick={(e) => !item.disabled && onItemClick(e, item)}
                className={`
                  relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-75 border border-transparent
                  ${
                    isChecked
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                  ${isFocused ? 'ring-1 ring-inset ring-blue-500 bg-blue-50/50 dark:bg-blue-900/30 z-10' : ''}
                  ${item.disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                `}>
                <div className="flex items-center justify-center w-4">
                  {!item.disabled && (
                    <GripVertical className="h-4 w-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
                  )}
                </div>

                <div
                  className={`
                  flex items-center justify-center h-4 w-4 rounded border transition-colors
                  ${
                    isChecked
                      ? 'bg-blue-600 border-blue-600 dark:bg-blue-600 dark:border-blue-600'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {isChecked && <Check className="h-3 w-3 text-white" />}
                </div>

                <span className="truncate flex-1">{item.label}</span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

// ==========================================
// 3. Componente TransferList Principal
// ==========================================

const TransferList = forwardRef<HTMLSelectElement, TransferListProps>(
  (
    {
      dataSource = [],
      value = [],
      onChange,
      titles = ['Disponíveis', 'Selecionados'],
      className = '',
      oneWay = false,
      label,
      id,
      name,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const internalSelectRef = useRef<HTMLSelectElement>(null);
    useImperativeHandle(ref, () => internalSelectRef.current as HTMLSelectElement);

    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [lastCheckedKey, setLastCheckedKey] = useState<string | null>(null);
    const [focusedKey, setFocusedKey] = useState<string | null>(null);

    const [searchLeft, setSearchLeft] = useState('');
    const [searchRight, setSearchRight] = useState('');
    const [dragOverSide, setDragOverSide] = useState<'left' | 'right' | null>(null);

    const { leftItems, rightItems } = useMemo(() => {
      const safeDataSource = Array.isArray(dataSource) ? dataSource : [];
      const rightSet = new Set(value.map(String));

      return {
        leftItems: safeDataSource.filter(
          (item) => !rightSet.has(String(item.key)) && item.label.toLowerCase().includes(searchLeft.toLowerCase()),
        ),
        rightItems: safeDataSource
          .filter((item) => rightSet.has(String(item.key)))
          .filter((item) => item.label.toLowerCase().includes(searchRight.toLowerCase())),
      };
    }, [dataSource, value, searchLeft, searchRight]);

    const triggerChange = useCallback(
      (newTargetKeys: string[]) => {
        if (disabled) {
          return;
        }
        onChange?.(newTargetKeys);
      },
      [onChange, disabled],
    );

    const handleItemClick = (e: React.MouseEvent, item: TransferListItem) => {
      e.preventDefault();
      const key = item.key;
      setFocusedKey(key);

      let newCheckedKeys = [...checkedKeys];

      if (e.shiftKey && lastCheckedKey) {
        const list = leftItems.find((i) => i.key === key) ? leftItems : rightItems;
        const startIdx = list.findIndex((i) => i.key === lastCheckedKey);
        const endIdx = list.findIndex((i) => i.key === key);

        if (startIdx !== -1 && endIdx !== -1) {
          const [min, max] = [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)];
          const rangeKeys = list.slice(min, max + 1).map((i) => i.key);
          newCheckedKeys = Array.from(new Set([...newCheckedKeys, ...rangeKeys]));
        }
      } else if (e.ctrlKey || e.metaKey) {
        if (newCheckedKeys.includes(key)) {
          newCheckedKeys = newCheckedKeys.filter((k) => k !== key);
        } else {
          newCheckedKeys.push(key);
        }
        setLastCheckedKey(key);
      } else {
        newCheckedKeys = [key];
        setLastCheckedKey(key);
      }

      setCheckedKeys(newCheckedKeys);
    };

    const handleKeyDown = (e: React.KeyboardEvent, listItems: TransferListItem[], side: 'left' | 'right') => {
      if (!listItems || listItems.length === 0) {
        return;
      }

      const currentIndex = listItems.findIndex((i) => i.key === focusedKey);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, listItems.length - 1);
          setFocusedKey(listItems[nextIndex].key);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = Math.max(currentIndex - 1, 0);
          setFocusedKey(listItems[prevIndex].key);
          break;
        }
        case ' ':
        case 'Enter': {
          e.preventDefault();
          if (focusedKey && !e.ctrlKey) {
            const isSelected = checkedKeys.includes(focusedKey);
            if (isSelected) {
              setCheckedKeys((p) => p.filter((k) => k !== focusedKey));
            } else {
              setCheckedKeys((p) => [...p, focusedKey]);
              setLastCheckedKey(focusedKey);
            }
          }
          break;
        }
        case 'a': {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const allKeys = listItems.map((i) => i.key);
            setCheckedKeys((prev) => Array.from(new Set([...prev, ...allKeys])));
          }
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          if (side === 'left') {
            moveItems('right');
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          if (side === 'right') {
            moveItems('left');
          }
          break;
        }
      }
    };

    const moveItems = useCallback(
      (direction: 'right' | 'left', moveAll: boolean = false) => {
        if (disabled) {
          return;
        }
        let keysToMove: string[] = [];

        if (direction === 'right') {
          keysToMove = moveAll ? leftItems.map((i) => i.key) : checkedKeys.filter((k) => leftItems.some((i) => i.key === k));

          if (keysToMove.length === 0) {
            return;
          }

          const nextTargetKeys = oneWay ? [...value, ...keysToMove] : [...value, ...keysToMove];
          triggerChange(Array.from(new Set(nextTargetKeys)));
        } else {
          keysToMove = moveAll ? rightItems.map((i) => i.key) : checkedKeys.filter((k) => rightItems.some((i) => i.key === k));

          if (keysToMove.length === 0) {
            return;
          }
          triggerChange(value.filter((k) => !keysToMove.includes(k)));
        }

        setCheckedKeys((prev) => prev.filter((k) => !keysToMove.includes(k)));
        setFocusedKey(null);
      },
      [leftItems, rightItems, checkedKeys, value, triggerChange, oneWay, disabled],
    );

    const handleDragStart = (e: React.DragEvent, key: string, source: 'left' | 'right') => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('key', key);
      e.dataTransfer.setData('source', source);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetSide: 'left' | 'right') => {
      if (disabled) {
        return;
      }
      e.preventDefault();
      setDragOverSide(null);
      const key = e.dataTransfer.getData('key');
      const sourceSide = e.dataTransfer.getData('source');

      if (sourceSide === targetSide) {
        return;
      }

      const item = dataSource.find((i) => String(i.key) === key);
      if (!item || item.disabled) {
        return;
      }

      if (targetSide === 'right') {
        if (!value.includes(key)) {
          triggerChange([...value, key]);
        }
      } else {
        triggerChange(value.filter((k) => k !== key));
      }
    };

    return (
      <div className={`relative flex flex-col gap-2 ${className}`}>
        {/* Label Visual */}
        {label && (
          <label htmlFor={id || name} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Interface Visual */}
        <div className={`flex flex-col md:flex-row gap-4 h-[400px] ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
          <TransferListColumn
            side="left"
            title={titles[0]}
            items={leftItems}
            checkedKeys={checkedKeys}
            focusedKey={focusedKey}
            setFocusedKey={setFocusedKey}
            onItemClick={handleItemClick}
            onKeyDown={handleKeyDown}
            onToggleAll={() => {
              const allKeys = leftItems.map((i) => i.key);
              const allChecked = allKeys.every((k) => checkedKeys.includes(k));
              if (allChecked) {
                setCheckedKeys((p) => p.filter((k) => !allKeys.includes(k)));
              } else {
                setCheckedKeys((p) => [...p, ...allKeys]);
              }
            }}
            searchValue={searchLeft}
            onSearch={setSearchLeft}
            isDraggingOver={dragOverSide === 'left'}
            onDragStart={(e: any, key: any) => handleDragStart(e, key, 'left')}
            onDragOver={(e: any) => {
              e.preventDefault();
              if (dragOverSide !== 'left') {
                setDragOverSide('left');
              }
            }}
            onDragLeave={() => setDragOverSide(null)}
            onDrop={(e: any) => handleDrop(e, 'left')}
          />

          <div className="flex flex-row md:flex-col items-center justify-center gap-2 px-2 shrink-0">
            <ActionButton
              onClick={() => moveItems('right', true)}
              disabled={disabled || leftItems.length === 0}
              icon={<ChevronsRight className="w-4 h-4 rotate-90 md:rotate-0" />}
              ariaLabel="Mover todos para direita"
            />
            <ActionButton
              onClick={() => moveItems('right')}
              disabled={disabled || checkedKeys.filter((k) => leftItems.some((i) => i.key === k)).length === 0}
              icon={<ChevronRight className="w-4 h-4 rotate-90 md:rotate-0" />}
              ariaLabel="Mover selecionados para direita"
            />
            <ActionButton
              onClick={() => moveItems('left')}
              disabled={disabled || checkedKeys.filter((k) => rightItems.some((i) => i.key === k)).length === 0}
              icon={<ChevronLeft className="w-4 h-4 rotate-90 md:rotate-0" />}
              ariaLabel="Mover selecionados para esquerda"
            />
            <ActionButton
              onClick={() => moveItems('left', true)}
              disabled={disabled || rightItems.length === 0}
              icon={<ChevronsLeft className="w-4 h-4 rotate-90 md:rotate-0" />}
              ariaLabel="Mover todos para esquerda"
            />
          </div>

          <TransferListColumn
            side="right"
            title={titles[1]}
            items={rightItems}
            checkedKeys={checkedKeys}
            focusedKey={focusedKey}
            setFocusedKey={setFocusedKey}
            onItemClick={handleItemClick}
            onKeyDown={handleKeyDown}
            onToggleAll={() => {
              const allKeys = rightItems.map((i) => i.key);
              const allChecked = allKeys.every((k) => checkedKeys.includes(k));
              if (allChecked) {
                setCheckedKeys((p) => p.filter((k) => !allKeys.includes(k)));
              } else {
                setCheckedKeys((p) => [...p, ...allKeys]);
              }
            }}
            searchValue={searchRight}
            onSearch={setSearchRight}
            isDraggingOver={dragOverSide === 'right'}
            onDragStart={(e: any, key: any) => handleDragStart(e, key, 'right')}
            onDragOver={(e: any) => {
              e.preventDefault();
              if (dragOverSide !== 'right') {
                setDragOverSide('right');
              }
            }}
            onDragLeave={() => setDragOverSide(null)}
            onDrop={(e: any) => handleDrop(e, 'right')}
          />
        </div>

        {/* Elemento Nativo Oculto (Shadow Input)
        Posicionado absolutamente no fundo para que o tooltip apareça embaixo do componente
      */}
        <div className="absolute bottom-0 left-0 w-full h-0 flex justify-center pointer-events-none">
          <select
            ref={internalSelectRef}
            multiple
            name={name}
            id={id || name}
            required={required} // Validação Nativa Ativada
            disabled={disabled}
            value={value}
            onChange={() => {}}
            className="opacity-0 w-full h-1 pointer-events-none" // Height 1px para ter onde ancorar o tooltip
            tabIndex={-1}
            {...props}>
            {dataSource.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  },
);

TransferList.displayName = 'TransferList';
export default TransferList;
