import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { DOTS, usePaginationRange } from '../../hooks/use-pagination-range';
import Button from '../button';
import { Select } from '../select';

export type PaginationMode = 'range' | 'simple' | 'extended';

export interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  mode?: PaginationMode;
  className?: string;
  variant?: 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  mode = 'range',
  className = '',
  variant = 'outline',
  size = 'sm',
}) => {
  const paginationRange = usePaginationRange({
    currentPage,
    totalCount,
    pageSize,
  }) as (number | string)[];

  // Se não houver páginas suficientes, não renderiza (opcional)
  if (currentPage === 0 || (paginationRange && paginationRange.length < 2 && mode === 'range')) {
    return null;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Seletor de Tamanho */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">Linhas:</span>
          <Select
            name="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            variant="ghost"
            sized="sm"
            containerClassName="w-16">
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Navegação e Números */}
      {/* Adicionado 'flex-wrap' e 'justify-center' aqui também para permitir que os botões quebrem linha */}
      <div className="flex flex-wrap items-center gap-1 justify-center">
        {/* Setas Esquerda */}
        {(mode === 'extended' || mode === 'simple' || mode === 'range') && (
          <>
            {mode === 'extended' && (
              <Button
                variant={variant}
                size="icon"
                className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'}
                onClick={() => onPageChange(1)}
                disabled={isFirst}
                title="Primeira Página">
                <ChevronsLeft size={16} />
              </Button>
            )}

            <Button
              variant={variant}
              size="icon"
              className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirst}
              title="Anterior">
              <ChevronLeft size={16} />
            </Button>
          </>
        )}

        {/* Números das Páginas */}
        {mode !== 'simple' && (
          <>
            {/* Em telas muito pequenas (mobile), esconde os números intermediários para economizar espaço */}
            <div className="flex flex-wrap items-center gap-1">
              {paginationRange.map((pageNumber, idx) => {
                if (pageNumber === DOTS) {
                  return (
                    <span key={idx} className="px-1 text-gray-400 select-none text-xs">
                      ...
                    </span>
                  );
                }

                const isActive = pageNumber === currentPage;

                return (
                  <Button
                    key={idx}
                    variant={isActive ? 'primary' : 'ghost'}
                    size="icon"
                    className={`${size === 'sm' ? 'h-10 w-10 text-xs' : 'h-10 w-10 text-sm'} font-medium`}
                    onClick={() => onPageChange(Number(pageNumber))}>
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
          </>
        )}

        {/* Info Textual (Modo Simples ou Fallback Mobile) */}
        {mode === 'simple' && (
          <span className="text-sm text-gray-500 px-2 whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>
        )}

        {/* Setas Direita */}
        {(mode === 'extended' || mode === 'simple' || mode === 'range') && (
          <>
            <Button
              variant={variant}
              size="icon"
              className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLast}
              title="Próxima">
              <ChevronRight size={16} />
            </Button>

            {mode === 'extended' && (
              <Button
                variant={variant}
                size="icon"
                className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'}
                onClick={() => onPageChange(totalPages)}
                disabled={isLast}
                title="Última">
                <ChevronsRight size={16} />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
