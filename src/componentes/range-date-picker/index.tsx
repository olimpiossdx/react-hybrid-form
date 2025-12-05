import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getToday, addDays, parseISODate, toISODate, isWeekend, isBefore, isAfter, toDisplayDate, addMonths, getDaysInMonthGrid, isSameDay, isBetween } from '../../utils/date';
import Popover from '../popover';

interface DateRangeProps {
  startDateName: string;
  endDateName: string;
  label?: string;
  
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  excludeWeekends?: boolean;
  
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

// CORREÇÃO: Tipagem explícita para garantir Tupla [Date, Date]
const PRESETS: { label: string; getValue: () => [Date, Date] }[] = [
  { label: 'Hoje', getValue: () => [getToday(), getToday()] },
  { label: 'Ontem', getValue: () => [addDays(getToday(), -1), addDays(getToday(), -1)] },
  { label: 'Últimos 7 Dias', getValue: () => [addDays(getToday(), -7), getToday()] },
  { label: 'Últimos 30 Dias', getValue: () => [addDays(getToday(), -30), getToday()] },
  { label: 'Próximos 7 Dias', getValue: () => [getToday(), addDays(getToday(), 7)] },
];

const DateRangePicker: React.FC<DateRangeProps> = ({
  startDateName,
  endDateName,
  label,
  required,
  disabled,
  readOnly,
  excludeWeekends,
  minDate,
  maxDate
}) => {
  // ESTADOS INTERNOS
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(getToday()); // Mês visível
  
  // Intervalo Selecionado (Objeto Date ou null)
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // REFS (DOM)
  const containerRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const effectiveDisabled = disabled || readOnly;

  // --- SINCRONIA COM DOM (Reset/Load) ---
  // Ouve mudanças nos inputs ocultos vindas do useForm
  useEffect(() => {
    const handleExternalUpdate = () => {
       if (startInputRef.current) setStart(parseISODate(startInputRef.current.value));
       if (endInputRef.current) setEnd(parseISODate(endInputRef.current.value));
    };

    // Inicializa
    handleExternalUpdate();

    const sInput = startInputRef.current;
    const eInput = endInputRef.current;

    if (sInput && eInput) {
        sInput.addEventListener('input', handleExternalUpdate); // Reset dispara input
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

  // --- ATUALIZAÇÃO DO DOM ---
  const applyRange = (newStart: Date | null, newEnd: Date | null) => {
    setStart(newStart);
    setEnd(newEnd);

    // Atualiza Input Start
    if (startInputRef.current) {
        const iso = toISODate(newStart);
        if (startInputRef.current.value !== iso) {
            startInputRef.current.value = iso;
            startInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Atualiza Input End
    if (endInputRef.current) {
        const iso = toISODate(newEnd);
        if (endInputRef.current.value !== iso) {
            endInputRef.current.value = iso;
            endInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Cross-Validation: Define min do fim como o início
            if (newStart) endInputRef.current.min = toISODate(newStart);
        }
    }
  };

  // --- HELPER DE VISIBILIDADE ---
  // Verifica se o dia está bloqueado por regras de negócio (Fim de semana ou Min/Max)
  const isDateDisabled = (date: Date) => {
      if (excludeWeekends && isWeekend(date)) return true;
      
      // Parse dos limites se existirem
      if (minDate) {
          const min = parseISODate(minDate);
          if (min && isBefore(date, min)) return true;
      }
      if (maxDate) {
          const max = parseISODate(maxDate);
          if (max && isAfter(date, max)) return true;
      }
      
      return false;
  };

  // --- LÓGICA DE SELEÇÃO ---
  const handleDayClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    // Caso 1: Novo Início (se já tinha range completo ou nenhum)
    if (!start || (start && end)) {
        applyRange(date, null);
        return;
    }

    // Caso 2: Fechando o Range
    if (isBefore(date, start)) {
        // Clicou antes do início -> Inverte (Auto-swap UX)
        applyRange(date, start);
    } else {
        // Clicou depois -> Fecha normal
        applyRange(start, date);
        setIsOpen(false); // Fecha ao completar
    }
  };

  const handlePresetClick = (preset: { getValue: () => [Date, Date] }) => {
     const [s, e] = preset.getValue();
     
     // Valida se o preset respeita os limites (Opcional, mas boa prática)
     if ((minDate && isBefore(s, parseISODate(minDate)!)) || 
         (maxDate && isAfter(e, parseISODate(maxDate)!))) {
         // Poderíamos mostrar um erro ou apenas ignorar
         // Por enquanto aplicamos e deixamos a validação nativa do input pegar
     }

     applyRange(s, e);
     setViewDate(s); // Pula para o mês do início
     setIsOpen(false);
  };

  // Renderização do Texto Visual
  const displayText = start 
    ? `${toDisplayDate(start)} ${end ? ` - ${toDisplayDate(end)}` : ''}` 
    : "Selecione o período...";

  return (
    <div className="relative mb-4" ref={containerRef}>
      {label && (
         <label className="block mb-1 text-gray-300">
            {label} {required && <span className="text-red-400">*</span>}
         </label>
      )}

      {/* 1. TRIGGER VISUAL */}
      <div 
        className={`
            flex items-center justify-between p-2.5 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors
            ${effectiveDisabled ? 'opacity-50 pointer-events-none' : ''}
            ${isOpen ? 'ring-2 ring-cyan-500 border-transparent' : ''}
        `}
        onClick={() => !effectiveDisabled && setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${start ? 'text-white' : 'text-gray-400'}`}>
            {displayText}
        </span>
        <Calendar size={18} className="text-gray-400" />
      </div>

      {/* 2. POPOVER (PORTAL) */}
      <Popover 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        triggerRef={containerRef}
        className="flex overflow-hidden w-auto max-w-[90vw]"
      >
        {/* Sidebar Presets */}
        <div className="w-40 border-r border-gray-700 p-2 bg-gray-900/50 hidden sm:block">
            {PRESETS.map((p, i) => (
                <button
                   key={i}
                   type="button"
                   onClick={() => handlePresetClick(p)}
                   className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
                >
                    {p.label}
                </button>
            ))}
        </div>

        {/* Calendar Grid */}
        <div className="p-4 w-72">
            <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={() => setViewDate(addMonths(viewDate, -1))} className="p-1 hover:bg-gray-700 rounded text-gray-400"><ChevronLeft size={20}/></button>
                <span className="font-bold text-white text-sm">
                    {viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <button type="button" onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-gray-700 rounded text-gray-400"><ChevronRight size={20}/></button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['D','S','T','Q','Q','S','S'].map(d => (
                    <span key={d} className="text-center text-[10px] text-gray-500 font-bold">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {getDaysInMonthGrid(viewDate).map((day, idx) => {
                    if (!day) return <div key={idx} />;
                    
                    const disabledDay = isDateDisabled(day);

                    // Estado Visual
                    const isSelStart = start && isSameDay(day, start);
                    const isSelEnd = end && isSameDay(day, end);
                    const isInRange = start && end && isBetween(day, start, end);
                    const isHoverRange = start && !end && hoverDate && isBetween(day, start, hoverDate);
                    
                    return (
                        <button
                           key={day.toISOString()}
                           type="button"
                           disabled={disabledDay}
                           onClick={() => handleDayClick(day)}
                           onMouseEnter={() => setHoverDate(day)}
                           className={`
                               h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all relative
                               ${disabledDay ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-700'}
                               ${(isSelStart || isSelEnd) ? 'bg-cyan-600 text-white font-bold z-10' : 'text-gray-300'}
                               ${(isInRange || isHoverRange) && !(isSelStart || isSelEnd) ? 'bg-cyan-900/50 text-cyan-200 rounded-none' : ''}
                               ${(isSelStart && (end || hoverDate)) ? 'rounded-r-none' : ''}
                               ${(isSelEnd || (start && !end && isSameDay(day, hoverDate!))) ? 'rounded-l-none' : ''}
                           `}
                        >
                           {day.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
      </Popover>

      {/* 3. DUAL SHADOW INPUTS (A Verdade do DOM) */}
      <input 
          ref={startInputRef} 
          type="date" 
          name={startDateName} 
          required={required} 
          min={minDate} 
          max={maxDate}
          className="sr-only" 
          tabIndex={-1}
      />
      <input 
          ref={endInputRef} 
          type="date" 
          name={endDateName} 
          required={required} 
          min={toISODate(start) || minDate} // Cross-validation nativa
          max={maxDate}
          className="sr-only"
          tabIndex={-1}
      />
    </div>
  );
};

export default DateRangePicker;