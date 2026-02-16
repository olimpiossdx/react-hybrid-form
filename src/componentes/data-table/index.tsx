import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronsUpDown, ChevronUp, Search } from 'lucide-react';

import { cn } from '../../utils/cn';
import Button from '../button';
import Input from '../input';
import { Pagination } from '../pagination';
import {
  Table as SimpleTable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  type TableResponsiveMode,
  TableRow,
} from '../table';

// ============================================================================
// PARTE 1: IMPLEMENTAÇÃO "SMART" (Para novos exemplos simples)
// ============================================================================

export interface DataTableColumn<T = any> {
  accessorKey: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  /**
   * Ajuda os modos shorten/compare a decidir o que mostrar em telas pequenas.
   */
  priority?: 'high' | 'medium' | 'low';
  /**
   * Label alternativo para ser usado no mobile (stack/cards).
   */
  mobileLabel?: string;
  /**
   * Força esconder esta coluna em mobile.
   */
  hideOnMobile?: boolean;
  cell?: (row: T) => React.ReactNode;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  column: string | null;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  density?: 'sm' | 'md' | 'lg';
  selectable?: boolean;
  searchable?: boolean;
  onRowSelect?: (selectedIds: (string | number)[]) => void;

  manualPagination?: boolean;
  rowCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;

  manualSorting?: boolean;
  onSortingChange?: (sorting: SortingState) => void;

  onSearchChange?: (term: string) => void;
  renderSubComponent?: (row: T) => React.ReactNode;

  /**
   * Novo: modo de responsividade herdado da Table base.
   * Default mantém o comportamento atual.
   */
  responsiveMode?: TableResponsiveMode;
}

function DataTableSmart<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  density = 'md',
  selectable = false,
  searchable = false,
  onRowSelect,
  manualPagination = false,
  rowCount = 0,
  onPaginationChange,
  manualSorting = false,
  onSortingChange,
  onSearchChange,
  renderSubComponent,
  responsiveMode = 'none',
}: DataTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>({ column: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [globalFilter, setGlobalFilter] = useState('');

  // Debounce Busca
  useEffect(() => {
    if (onSearchChange) {
      const timeoutId = setTimeout(() => {
        onSearchChange(globalFilter);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [globalFilter, onSearchChange]);

  const handlePaginationChange = (newPagination: PaginationState) => {
    setPagination(newPagination);
    if (onPaginationChange) {
      onPaginationChange(newPagination);
    }
  };

  const handleSort = (columnKey: string) => {
    const newDirection = sorting.column === columnKey && sorting.direction === 'asc' ? 'desc' : 'asc';
    const newSorting: SortingState = { column: columnKey, direction: newDirection };

    setSorting(newSorting);
    if (onSortingChange) {
      onSortingChange(newSorting);
    }
  };

  const toggleRowExpansion = (id: string | number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredData = useMemo(() => {
    if (onSearchChange || !globalFilter) {
      return data;
    }
    const lowerFilter = globalFilter.toLowerCase();
    return data.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(lowerFilter)));
  }, [data, globalFilter, onSearchChange]);

  const sortedData = useMemo(() => {
    if (manualSorting || !sorting.column) {
      return filteredData;
    }
    return [...filteredData].sort((a, b) => {
      const valA = a[sorting.column as keyof T];
      const valB = b[sorting.column as keyof T];
      if (valA < valB) {
        return sorting.direction === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sorting.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sorting, manualSorting]);

  const paginatedData = useMemo(() => {
    if (manualPagination) {
      return sortedData;
    }
    const start = pagination.pageIndex * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination, manualPagination]);

  const totalCount = manualPagination ? rowCount : filteredData.length;

  const handleSelectAll = (checked: boolean) => {
    let newSelected: Set<string | number>;
    if (checked) {
      const allIds = paginatedData.map((row) => row.id);
      newSelected = new Set([...Array.from(selectedRows), ...allIds]);
    } else {
      newSelected = new Set(selectedRows);
      paginatedData.forEach((row) => newSelected.delete(row.id));
    }
    setSelectedRows(newSelected);
    if (onRowSelect) {
      onRowSelect(Array.from(newSelected));
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    if (onRowSelect) {
      onRowSelect(Array.from(newSelected));
    }
  };

  useEffect(() => {
    if (!manualPagination) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [globalFilter, manualPagination]);

  const isAllPageSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(row.id));
  const isStackLike = responsiveMode === 'stack' || responsiveMode === 'cards' || responsiveMode === 'accordion';

  function getCellLabel(col: DataTableColumn<T>): string {
    return col.mobileLabel ?? col.header;
  }

  function getColumnVisibilityClasses(col: DataTableColumn<T>): string {
    if (responsiveMode === 'shorten') {
      if (col.hideOnMobile || col.priority === 'low') {
        return 'hidden md:table-cell';
      }
    }
    if (responsiveMode === 'compare') {
      if (col.hideOnMobile || col.priority === 'low' || col.priority === 'medium') {
        return 'hidden md:table-cell';
      }
    }
    if (isStackLike) {
      return 'block md:table-cell';
    }
    return '';
  }

  return (
    <div className="namespace-y-4 w-full">
      {searchable && (
        <div className="flex items-center justify-between">
          <div className="w-full max-w-sm">
            <Input
              name="global-search"
              aria-label="Filtrar dados"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              leftIcon={<Search />}
              size="sm"
            />
          </div>
        </div>
      )}

      <TableContainer>
        <SimpleTable density={density} responsiveMode={responsiveMode}>
          <TableHeader>
            <TableRow data-state={/* podemos usar depois no accordion */ undefined}>
              {renderSubComponent && <TableHead className="w-10" />}
              {selectable && (
                <TableHead className="w-12.5">
                  <Input
                    name="select-all-rows"
                    type="checkbox"
                    variant="ghost"
                    containerClassName="justify-center"
                    checked={isAllPageSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
              )}

              {columns.map((col) => {
                const visibility = getColumnVisibilityClasses(col);
                const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';

                return (
                  <TableHead
                    key={String(col.accessorKey)}
                    style={{
                      width: col.width,
                      textAlign: col.align ?? 'left',
                    }}
                    className={cn(
                      col.sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800',
                      visibility,
                      alignClass,
                    )}
                    onClick={col.sortable ? () => handleSort(String(col.accessorKey)) : undefined}>
                    <div
                      className={cn(
                        'flex items-center gap-2',
                        col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start',
                      )}>
                      {col.header}
                      {col.sortable && (
                        <span className="text-gray-400">
                          {sorting.column === col.accessorKey ? (
                            sorting.direction === 'asc' ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <ChevronsUpDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* ... estados de loading e vazio iguais ... */}

            {!isLoading &&
              paginatedData.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={selectedRows.has(row.id) ? 'selected' : expandedRows.has(row.id) ? 'expanded' : undefined}>
                    {renderSubComponent && (
                      <TableCell className="p-0 text-center w-10">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRowExpansion(row.id)}>
                          <ChevronRight
                            size={16}
                            className={cn('transition-transform duration-200', expandedRows.has(row.id) && 'rotate-90')}
                          />
                        </Button>
                      </TableCell>
                    )}

                    {selectable && (
                      <TableCell className="text-center p-0">
                        <Input
                          name={`select-row-${row.id}`}
                          type="checkbox"
                          variant="ghost"
                          containerClassName="justify-center"
                          checked={selectedRows.has(row.id)}
                          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        />
                      </TableCell>
                    )}

                    {columns.map((col) => {
                      const visibility = getColumnVisibilityClasses(col);
                      const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';

                      return (
                        <TableCell
                          key={`${row.id}-${String(col.accessorKey)}`}
                          className={cn(visibility, alignClass)}
                          data-label={isStackLike ? getCellLabel(col) : undefined}>
                          {col.cell ? col.cell(row) : (row as any)[col.accessorKey]}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {renderSubComponent && expandedRows.has(row.id) && (
                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-50/50">
                      <TableCell colSpan={columns.length + (selectable ? 1 : 0) + 1 /* botão expand */} className="p-0">
                        <div className="p-4 animate-in slide-in-from-top-2 duration-200">{renderSubComponent(row)}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </SimpleTable>
      </TableContainer>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {selectable && selectedRows.size > 0 && (
            <span className="mr-4 text-blue-600 font-medium">{selectedRows.size} selecionado(s)</span>
          )}
          <span>Total: {totalCount} registros</span>
        </div>

        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalCount={totalCount}
          pageSize={pagination.pageSize}
          onPageChange={(page) => handlePaginationChange({ ...pagination, pageIndex: page - 1 })}
          onPageSizeChange={(size) => handlePaginationChange({ ...pagination, pageSize: size, pageIndex: 0 })}
          pageSizeOptions={[5, 10, 20, 50]}
          size="sm"
          variant="ghost"
          className="w-full sm:w-auto justify-center sm:justify-end"
        />
      </div>
    </div>
  );
}

// ============================================================================
// PARTE 2: IMPLEMENTAÇÃO "COMPOUND" (Restaurada para TabDataTable legado)
// ============================================================================

const DataTableContext = React.createContext<{ instance?: any }>({});

const Root = ({ children, instance, className }: { children: React.ReactNode; instance?: any; className?: string }) => (
  <DataTableContext.Provider value={{ instance }}>
    <div className={`w-full flex flex-col ${className || ''}`}>{children}</div>
  </DataTableContext.Provider>
);

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <TableContainer className={`border-0 shadow-none rounded-none ${className || ''}`}>{children}</TableContainer>
);

const TableComponent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <SimpleTable className={className}>{children}</SimpleTable>
);

// CORREÇÃO CRÍTICA: O Header agora apenas repassa os filhos.
// A responsabilidade de criar a <TableRow> é do consumidor (TabDataTable),
// para garantir que ele possa customizar a linha do cabeçalho.
const Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <TableHeader className={className}>{children}</TableHeader>
);

const HeadCell = ({ children, className, onClick, style }: any) => (
  <TableHead className={className} onClick={onClick} style={style}>
    {children}
  </TableHead>
);

const Body = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <TableBody className={className}>{children}</TableBody>
);

const Row = ({ children, className, onClick, style }: any) => (
  <TableRow className={className} onClick={onClick} style={style}>
    {children}
  </TableRow>
);

const Cell = ({ children, className, colSpan, align, style }: any) => (
  <TableCell className={className} colSpan={colSpan} style={{ textAlign: align, ...style }}>
    {children}
  </TableCell>
);

const Footer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <TableFooter className={className}>{children}</TableFooter>
);

const PaginationComponent = ({
  instance,
  mode = 'range',
  className,
}: {
  instance?: any;
  mode?: 'range' | 'simple' | 'extended';
  className?: string;
}) => {
  const context = React.useContext(DataTableContext);
  const table = instance || context.instance;
  if (!table || !table.pagination) {
    return null;
  }
  const { page, pageSize, total, setPage, setPageSize } = table.pagination;
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 ${className || ''}`}>
      <div className="hidden sm:block text-sm text-gray-500">Total: {total} registros</div>
      <Pagination
        currentPage={page}
        totalCount={total}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        size="sm"
        variant="outline"
        mode={mode}
      />
    </div>
  );
};

// ============================================================================
// EXPORTAÇÃO HÍBRIDA
// ============================================================================

export const DataTable = Object.assign(DataTableSmart, {
  Root,
  Container,
  Table: TableComponent,
  Header,
  HeadCell,
  Body,
  Row,
  Cell,
  Footer,
  Pagination: PaginationComponent,
});
