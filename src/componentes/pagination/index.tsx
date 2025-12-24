import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePaginationRange, DOTS } from "../../hooks/use-pagination-range";

export type PaginationMode = "range" | "simple" | "extended";

interface IPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  mode?: PaginationMode;
  className?: string;
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  mode = "range",
  className = "",
}) => {
  // CORREÇÃO: Cast explícito para garantir que o TS entenda que é um array
  const paginationRange = usePaginationRange({    currentPage,    totalCount,    pageSize,  }) as (number | string)[];

  // Se não tem páginas ou só tem 1, não renderiza (opcional)
  if (
    currentPage === 0 ||
    (paginationRange && paginationRange.length < 2 && mode === "range")
  ) {
    return null;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  // Estilos Base (Estrutura)
  const btnBase =
    "p-2 rounded-lg border transition-colors flex items-center justify-center min-w-[32px] h-8 text-xs font-bold";

  // Estilos de Estado (Cores)
  const btnActive =
    "bg-cyan-600 text-white border-cyan-600 shadow-sm hover:bg-cyan-700";
  const btnInactive =
    "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 ${className}`}
    >
      {/* 1. Info e Page Size */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>
          Mostrando{" "}
          <strong>
            {Math.min((currentPage - 1) * pageSize + 1, totalCount)}
          </strong>{" "}
          a <strong>{Math.min(currentPage * pageSize, totalCount)}</strong> de{" "}
          <strong>{totalCount}</strong>
        </span>

        {onPageSizeChange && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs">Exibir:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="form-input py-1 px-2 text-xs w-auto h-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. Controles de Navegação */}
      <div className="flex gap-1">
        {/* First / Prev */}
        {(mode === "extended" || mode === "simple") && (
          <>
            <button
              className={`${btnBase} ${btnInactive}`}
              onClick={() => onPageChange(1)}
              disabled={isFirst}
              title="Primeira"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className={`${btnBase} ${btnInactive}`}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirst}
              title="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}

        {/* Range de Números */}
        {mode !== "simple" &&
          paginationRange?.map((pageNumber, idx) => {
            if (pageNumber === DOTS) {
              return (
                <span key={idx} className="px-2 py-1 text-gray-400 font-bold">
                  ...
                </span>
              );
            }
            return (
              <button
                key={idx}
                className={`${btnBase} ${pageNumber === currentPage ? btnActive : btnInactive}`}
                onClick={() => onPageChange(Number(pageNumber))}
              >
                {pageNumber}
              </button>
            );
          })}

        {/* Next / Last */}
        {(mode === "extended" || mode === "simple") && (
          <>
            <button
              className={`${btnBase} ${btnInactive}`}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLast}
              title="Próxima"
            >
              <ChevronRight size={16} />
            </button>
            <button
              className={`${btnBase} ${btnInactive}`}
              onClick={() => onPageChange(totalPages)}
              disabled={isLast}
              title="Última"
            >
              <ChevronsRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
