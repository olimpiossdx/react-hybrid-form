import React, { useState, useRef, useEffect } from 'react';
import Popover from '../popover';
import CalendarGrid from './grid';
import { 
  toISODate, parseISODate, toDisplayDate, getToday, addDays, addMonths, isBefore,
  smartParseDate, maskDateInput, isWeekend,
  isAfter
} from '../../utils/date';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface IDatePreset {
  label: string;
  getValue: () => [Date, Date];
}

interface IDateRangeProps {
  startDateName: string;
  endDateName: string;
  label?: string;
  minDate?: string;
  maxDate?: string;
  excludeWeekends?: boolean;
  months?: 1 | 2;
  showPresets?: boolean;
  matchInputWidth?: boolean;
  presets?: IDatePreset[];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Nova prop de tamanho
}

const DEFAULT_PRESETS: IDatePreset[] = [
  { label: 'Hoje', getValue: () => [getToday(), getToday()] },
  { label: 'Ontem', getValue: () => [addDays(getToday(), -1), addDays(getToday(), -1)] },
  { label: 'Últimos 7 Dias', getValue: () => [addDays(getToday(), -7), getToday()] },
  { label: 'Últimos 30 Dias', getValue: () => [addDays(getToday(), -30), getToday()] },
  { label: 'Este Mês', getValue: () => {
      const now = getToday();
      return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)];
  }},
];

const DateRangePicker: React.FC<IDateRangeProps> = ({
  startDateName, endDateName, label, required, disabled, readOnly, excludeWeekends,
  minDate, maxDate, showPresets = true, months = 1, matchInputWidth = false,
  presets = DEFAULT_PRESETS, className = "", size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(getToday());
  
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const visualStartRef = useRef<HTMLInputElement>(null);
  const visualEndRef = useRef<HTMLInputElement>(null);

  const effectiveDisabled = disabled || readOnly;

  // Configuração de Estilos por Tamanho
  const sizeStyles = {
    sm: {
      container: 'rounded-md',
      input: 'text-xs py-1.5 px-2 min-w-[4.5rem]',
      iconSize: 14,
      arrowSize: 12,
      buttonPadding: 'p-1.5'
    },
    md: {
      container: 'rounded-lg',
      input: 'text-sm p-2.5 min-w-[5.5rem]',
      iconSize: 18,
      arrowSize: 14,
      buttonPadding: 'p-2.5'
    },
    lg: {
      container: 'rounded-xl',
      input: 'text-base p-3.5 min-w-[7rem]',
      iconSize: 22,
      arrowSize: 16,
      buttonPadding: 'p-3.5'
    }
  };

  const currentStyle = sizeStyles[size];

  useEffect(() => {
      if (document.activeElement !== visualStartRef.current) setStartText(toDisplayDate(start));
      if (document.activeElement !== visualEndRef.current) setEndText(toDisplayDate(end));
  }, [start, end]);

  useEffect(() => {
    const handleExternalUpdate = () => {
       if (startInputRef.current) setStart(parseISODate(startInputRef.current.value));
       if (endInputRef.current) setEnd(parseISODate(endInputRef.current.value));
    };
    handleExternalUpdate();
    const sInput = startInputRef.current;
    const eInput = endInputRef.current;
    if (sInput && eInput) {
        sInput.addEventListener('input', handleExternalUpdate);
        sInput.addEventListener('change', handleExternalUpdate);
        eInput.addEventListener('input', handleExternalUpdate);
        eInput.addEventListener('change', handleExternalUpdate);
    }
    return () => {
        if (sInput && eInput) {
            sInput.removeEventListener('input', handleExternalUpdate);
            sInput.removeEventListener('change', handleExternalUpdate);
            eInput.removeEventListener('input', handleExternalUpdate);
            eInput.removeEventListener('change', handleExternalUpdate);
        }
    };
  }, []);

  const isDateAllowed = (date: Date) => {
      if (excludeWeekends && isWeekend(date)) return false;
      if (minDate) {
          const min = parseISODate(minDate);
          if (min && isBefore(date, min)) return false;
      }
      if (maxDate) {
          const max = parseISODate(maxDate);
          if (max && isAfter(date, max)) return false;
      }
      return true;
  };

  const applyRange = (newStart: Date | null, newEnd: Date | null) => {
    setStart(newStart);
    setEnd(newEnd);
    if (startInputRef.current) {
        const iso = toISODate(newStart);
        if (startInputRef.current.value !== iso) {
            startInputRef.current.value = iso;
            startInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    if (endInputRef.current) {
        const iso = toISODate(newEnd);
        if (endInputRef.current.value !== iso) {
            endInputRef.current.value = iso;
            endInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
            if (newStart) endInputRef.current.min = toISODate(newStart);
        }
    }
  };

  const handleVisualChange = (e: React.ChangeEvent<HTMLInputElement>, isStart: boolean) => {
      const val = e.target.value;
      const masked = maskDateInput(val);
      if (isStart) setStartText(masked);
      else setEndText(masked);
  };

  const handleVisualBlur = (isStart: boolean) => {
      const ref = isStart ? visualStartRef : visualEndRef;
      const text = ref.current ? ref.current.value : "";
      const date = smartParseDate(text);
      if (date) {
          if (!isDateAllowed(date)) {
              const prev = isStart ? start : end;
              if (isStart) setStartText(toDisplayDate(prev));
              else setEndText(toDisplayDate(prev));
              return;
          }
          if (isStart) {
              applyRange(date, end && isBefore(end, date) ? null : end); 
              setViewDate(date);
          } else {
              if (start && isBefore(date, start)) setEndText(toDisplayDate(end)); 
              else applyRange(start, date);
          }
      } else {
          if (text.trim() === "") {
              if (isStart) applyRange(null, end);
              else applyRange(start, null);
          } else {
              const prev = isStart ? start : end;
              if (isStart) setStartText(toDisplayDate(prev));
              else setEndText(toDisplayDate(prev));
          }
      }
  };

  const handleVisualKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isStart: boolean) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleVisualBlur(isStart);
          if (isStart) {
              visualEndRef.current?.focus();
              setIsOpen(true);
          } else {
              setIsOpen(false);
          }
      }
      if (e.key === 'Tab' && !e.shiftKey && !isStart) {
          setIsOpen(false);
      }
  };

  const handleDayClick = (date: Date) => {
    if (!isDateAllowed(date)) return;
    if (!start || (start && end)) {
        applyRange(date, null);
        return;
    }
    if (isBefore(date, start)) {
        applyRange(date, start);
    } else {
        applyRange(start, date);
        setIsOpen(false);
    }
  };

  const handlePresetClick = (preset: IDatePreset) => {
     const [s, e] = preset.getValue();
     applyRange(s, e);
     setViewDate(s);
     setIsOpen(false);
  };

  return (
    <div className={`relative mb-4 ${className}`} ref={containerRef}>
      {label && (
         <label className={`block mb-1 font-medium text-gray-700 dark:text-gray-300 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
         </label>
      )}

      {/* INPUT VISUAL */}
      <div 
        className={`
            flex items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 transition-colors focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent overflow-hidden
            ${effectiveDisabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}
            ${currentStyle.container}
        `}
      >
        <input 
            ref={visualStartRef}
            value={startText}
            onChange={(e) => handleVisualChange(e, true)}
            onBlur={() => handleVisualBlur(true)}
            onKeyDown={(e) => handleVisualKeyDown(e, true)}
            onFocus={() => !effectiveDisabled && !readOnly && setIsOpen(true)}
            placeholder="Início"
            className={`flex-1 bg-transparent text-gray-900 dark:text-white outline-none text-center placeholder-gray-400 dark:placeholder-gray-500 ${currentStyle.input}`}
            readOnly={readOnly}
            disabled={disabled}
        />
        <span className="text-gray-400 dark:text-gray-500 shrink-0 px-1">
            <ArrowRight size={currentStyle.arrowSize}/>
        </span>
        <input 
            ref={visualEndRef}
            value={endText}
            onChange={(e) => handleVisualChange(e, false)}
            onBlur={() => handleVisualBlur(false)}
            onKeyDown={(e) => handleVisualKeyDown(e, false)}
            onFocus={() => !effectiveDisabled && !readOnly && setIsOpen(true)}
            placeholder="Fim"
            className={`flex-1 bg-transparent text-gray-900 dark:text-white outline-none text-center placeholder-gray-400 dark:placeholder-gray-500 ${currentStyle.input}`}
            readOnly={readOnly}
            disabled={disabled}
        />
        <button 
            type="button"
            onClick={() => !effectiveDisabled && setIsOpen(!isOpen)}
            className={`${currentStyle.buttonPadding} text-gray-400 hover:text-gray-600 dark:hover:text-white focus:outline-none shrink-0`}
            tabIndex={-1}
        >
            <Calendar size={currentStyle.iconSize} />
        </button>
      </div>

      {/* POPOVER */}
      <Popover 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        triggerRef={containerRef}
        fullWidth={matchInputWidth}
        className="flex flex-col sm:flex-row overflow-hidden shadow-2xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        {showPresets && (
            <div className="w-full sm:w-36 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50 shrink-0 flex flex-row sm:flex-col overflow-x-auto sm:overflow-visible gap-1 no-scrollbar">
                {presets.map((p, i) => (
                    <button key={i} type="button" onClick={() => handlePresetClick(p)} className="w-auto sm:w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded transition-all whitespace-nowrap border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                        {p.label}
                    </button>
                ))}
            </div>
        )}

        <div className="flex flex-col w-full">
             <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button type="button" onClick={() => setViewDate(addMonths(viewDate, -1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"><ChevronLeft size={20}/></button>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Seleção</div>
                <button type="button" onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"><ChevronRight size={20}/></button>
            </div>

            <div className="flex flex-col sm:flex-row bg-white dark:bg-gray-800">
                <CalendarGrid 
                    monthDate={viewDate}
                    start={start} end={end} hoverDate={hoverDate}
                    minDate={minDate} maxDate={maxDate} excludeWeekends={excludeWeekends}
                    onDayClick={handleDayClick} onHover={setHoverDate}
                />
                
                {months === 2 && (
                    <div className="hidden sm:block border-l border-gray-200 dark:border-gray-700">
                        <CalendarGrid 
                            monthDate={addMonths(viewDate, 1)}
                            start={start} end={end} hoverDate={hoverDate}
                            minDate={minDate} maxDate={maxDate} excludeWeekends={excludeWeekends}
                            onDayClick={handleDayClick} onHover={setHoverDate}
                        />
                    </div>
                )}
            </div>
        </div>
      </Popover>

      <input ref={startInputRef} type="date" name={startDateName} required={required} min={minDate} max={maxDate} className="sr-only" tabIndex={-1} />
      <input ref={endInputRef} type="date" name={endDateName} required={required} min={toISODate(start) || minDate} max={maxDate} className="sr-only" tabIndex={-1} />
    </div>
  );
};

export default DateRangePicker;