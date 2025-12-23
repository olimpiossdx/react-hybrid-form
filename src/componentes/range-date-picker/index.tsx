import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getToday, toDisplayDate, parseISODate, isWeekend, isBefore, isAfter, toISODate, maskDateInput, smartParseDate, addMonths } from '../../utils/date';
import Popover from '../popover';
import CalendarGrid from './grid';
import { type IDateRangeProps, DEFAULT_PRESETS, type DatePreset } from './props';


const DateRangePicker: React.FC<IDateRangeProps> = ({
    startDateName, endDateName, label, required, disabled, readOnly, excludeWeekends,
    minDate, maxDate, showPresets = true, months = 1, matchInputWidth = false,
    presets = DEFAULT_PRESETS, className = ""
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

    // Sincronia Texto <-> Data
    useEffect(() => {
        if (document.activeElement !== visualStartRef.current) setStartText(toDisplayDate(start));
        if (document.activeElement !== visualEndRef.current) setEndText(toDisplayDate(end));
    }, [start, end]);

    // Sincronia DOM
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
        // Leitura direta do valor do input para evitar atrasos de estado
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

    const handlePresetClick = (preset: DatePreset) => {
        const [s, e] = preset.getValue();
        applyRange(s, e);
        setViewDate(s);
        setIsOpen(false);
    };

    return (
        <div className={`${className}`} ref={containerRef}>
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
                </label>
            )}

            {/* 1. INPUT VISUAL (TEMA HÍBRIDO) */}
            <div
                className={`
            flex items-center rounded-lg border transition-colors focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent overflow-hidden
            ${effectiveDisabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'}
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
                    className="flex-1 min-w-22 bg-transparent text-sm text-gray-900 dark:text-white p-2.5 outline-none text-center placeholder-gray-400 dark:placeholder-gray-500"
                    readOnly={readOnly}
                    disabled={disabled}
                />
                <span className="text-gray-400 dark:text-gray-500 shrink-0 px-1"><ArrowRight size={14} /></span>
                <input
                    ref={visualEndRef}
                    value={endText}
                    onChange={(e) => handleVisualChange(e, false)}
                    onBlur={() => handleVisualBlur(false)}
                    onKeyDown={(e) => handleVisualKeyDown(e, false)}
                    onFocus={() => !effectiveDisabled && !readOnly && setIsOpen(true)}
                    placeholder="Fim"
                    className="flex-1 min-w-22 bg-transparent text-sm text-gray-900 dark:text-white p-2.5 outline-none text-center placeholder-gray-400 dark:placeholder-gray-500"
                    readOnly={readOnly}
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={() => !effectiveDisabled && setIsOpen(!isOpen)}
                    className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white focus:outline-none shrink-0"
                    tabIndex={-1}
                >
                    <Calendar size={18} />
                </button>
            </div>

            {/* 2. POPOVER (TEMA HÍBRIDO) */}
            <Popover
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                triggerRef={containerRef}
                fullWidth={matchInputWidth}
                className="flex overflow-hidden shadow-2xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
                <div className="flex flex-col sm:flex-row">
                    {/* Sidebar */}
                    {showPresets && (
                        <div className="w-full sm:w-36 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50 shrink-0 flex flex-row sm:flex-col overflow-x-auto sm:overflow-visible gap-1">
                            {presets.map((p, i) => (
                                <button key={i} type="button" onClick={() => handlePresetClick(p)} className="w-auto sm:w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded transition-all whitespace-nowrap border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col">
                        <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
                            <button type="button" onClick={() => setViewDate(addMonths(viewDate, -1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"><ChevronLeft size={20} /></button>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Seleção</div>
                            <button type="button" onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"><ChevronRight size={20} /></button>
                        </div>

                        <div className="flex flex-col sm:flex-row">
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
                </div>
            </Popover>

            {/* 3. INPUTS OCULTOS (Dados) */}
            <input ref={startInputRef} type="date" name={startDateName} required={required} min={minDate} max={maxDate} className="sr-only" tabIndex={-1} />
            <input ref={endInputRef} type="date" name={endDateName} required={required} min={toISODate(start) || minDate} max={maxDate} className="sr-only" tabIndex={-1} />
        </div>
    );
};

export default DateRangePicker;