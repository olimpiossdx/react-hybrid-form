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
  // Opcional: callback para mudar o tamanho da página. Se fornecido, mostra o Select.
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];

  mode?: PaginationMode;
  className?: string;

  // Novas props visuais
  variant?: 'outline' | 'ghost'; // Estilo base dos botões
  size?: 'sm' | 'md'; // Tamanho dos botões
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
  size = 'sm', // Padrão sm para tabelas
}) => {
  const paginationRange = usePaginationRange({
    currentPage,
    totalCount,
    pageSize,
  }) as (number | string)[];

  // Se não houver páginas suficientes, não renderiza nada (exceto se for para mostrar o PageSize selector sempre)
  if (currentPage === 0 || (paginationRange && paginationRange.length < 2 && mode === 'range')) {
    // Se quisermos mostrar o seletor de tamanho mesmo com 1 página, descomente abaixo.
    // Por padrão, muitas tabelas escondem pagination se só tem 1 página.
    return null;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Seletor de Tamanho da Página (Opcional) */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">Linhas:</span>
          <Select
            name="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            variant="ghost"
            sized="sm"
            containerClassName="w-20">
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center gap-1">
        {/* First / Prev */}
        {(mode === 'extended' || mode === 'simple' || mode === 'range') && (
          <>
            {/* First Page (Só no extended) */}
            {mode === 'extended' && (
              <Button
                variant={variant}
                size="icon"
                // Ajuste fino de tamanho para alinhar com 'sm'
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
        {mode !== 'simple' &&
          paginationRange.map((pageNumber, idx) => {
            if (pageNumber === DOTS) {
              return (
                <span key={idx} className="px-2 text-gray-400 select-none">
                  ...
                </span>
              );
            }

            const isActive = pageNumber === currentPage;

            return (
              <Button
                key={idx}
                // Botão Ativo ganha destaque (primary ou secondary)
                variant={isActive ? 'primary' : 'ghost'}
                size="icon"
                className={`${size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'} font-medium`}
                onClick={() => onPageChange(Number(pageNumber))}>
                {pageNumber}
              </Button>
            );
          })}

        {/* Textual Info para modo Simple */}
        {mode === 'simple' && (
          <span className="text-sm text-gray-500 px-2">
            Página {currentPage} de {totalPages}
          </span>
        )}

        {/* Next / Last */}
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
