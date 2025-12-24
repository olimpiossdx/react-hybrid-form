import React from "react";
import {
  getDaysInMonthGrid,
  isSameDay,
  isBetween,
  isWeekend,
  isBefore,
  isAfter,
  parseISODate,
} from "../../utils/date";

interface CalendarGridProps {
  monthDate: Date;
  start: Date | null;
  end: Date | null;
  hoverDate: Date | null;
  minDate?: string;
  maxDate?: string;
  excludeWeekends?: boolean;
  onDayClick: (date: Date) => void;
  onHover: (date: Date | null) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthDate,
  start,
  end,
  hoverDate,
  minDate,
  maxDate,
  excludeWeekends,
  onDayClick,
  onHover,
}) => {
  const isDateDisabled = (date: Date) => {
    if (excludeWeekends && isWeekend(date)) return true;
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

  return (
    // CORREÇÃO: Removido 'w-64' fixo. Agora é 'w-full' com um mínimo para não quebrar layout.
    <div className="w-full min-w-[18rem] p-3">
      {/* Cabeçalho do Mês */}
      <div className="text-center mb-4 font-bold text-gray-900 dark:text-white text-sm capitalize">
        {monthDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <span
            key={i}
            className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-bold"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Grade de Dias */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonthGrid(monthDate).map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const disabledDay = isDateDisabled(day);
          const isSelStart = isSameDay(day, start);
          const isSelEnd = isSameDay(day, end);
          const isInRange = isBetween(day, start, end);
          const isHoverRange =
            start && !end && hoverDate && isBetween(day, start, hoverDate);

          // Classes Base
          let bgClass =
            "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300";
          let roundedClass = "rounded-full";

          if (disabledDay) {
            bgClass = "opacity-20 cursor-not-allowed";
          } else if (isSelStart || isSelEnd) {
            bgClass =
              "bg-cyan-600 text-white font-bold z-10 relative shadow-md";
          } else if (isInRange || isHoverRange) {
            // Range: Azul bem claro no Light, Azul escuro no Dark
            bgClass =
              "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200";
            roundedClass = "rounded-none";
          }

          // Arredondamento das pontas do range
          if (isSelStart && (end || (hoverDate && isAfter(hoverDate, start)))) {
            roundedClass = "rounded-l-full rounded-r-none";
          }
          if (
            isSelEnd ||
            (start && !end && hoverDate && isSameDay(day, hoverDate))
          ) {
            roundedClass = "rounded-r-full rounded-l-none";
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabledDay}
              onClick={(e) => {
                e.stopPropagation();
                onDayClick(day);
              }}
              onMouseEnter={() => onHover(day)}
              className={`
                         h-8 w-full text-xs flex items-center justify-center transition-all
                         ${bgClass} ${roundedClass}
                     `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
