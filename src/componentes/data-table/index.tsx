import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronsUpDown, ChevronUp, Search } from 'lucide-react';

import Button from '../button';
import { Input } from '../input';
import { Pagination } from '../pagination';
import { Spinner } from '../spinner';
import { Table as SimpleTable, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableHeader, TableRow } from '../table';

// ============================================================================
// PARTE 1: IMPLEMENTAÇÃO "SMART" (Para novos exemplos simples)
// ============================================================================

export interface DataTableColumn<T = any> {
  accessorKey: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
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
}

function DataTableSmart<T extends { id: string | number } & Record<string, any>>({
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

  return (
    <div className="space-y-4 w-full">
      {searchable && (
        <div className="flex items-center justify-between">
          <div className="w-full max-w-sm">
            <Input
              name="global_search"
              aria-label="Filtrar dados"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              leftIcon={<Search size={16} />}
              size="sm"
            />
          </div>
        </div>
      )}

      <TableContainer>
        <SimpleTable density={density}>
          <TableHeader>
            <TableRow>
              {renderSubComponent && <TableHead className="w-10"></TableHead>}

              {selectable && (
                <TableHead className="w-12.5">
                  <Input
                    name="select_all_rows"
                    type="checkbox"
                    variant="ghost"
                    containerClassName="justify-center"
                    checked={isAllPageSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
              )}

              {columns.map((col) => (
                <TableHead
                  key={String(col.accessorKey)}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                  className={col.sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                  onClick={() => col.sortable && handleSort(String(col.accessorKey))}>
                  <div
                    className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}>
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
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (renderSubComponent ? 1 : 0)} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Spinner size="md" /> Carregando dados...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (renderSubComponent ? 1 : 0)}
                  className="h-24 text-center text-gray-500">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              paginatedData.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={selectedRows.has(row.id) ? 'selected' : expandedRows.has(row.id) ? 'expanded' : undefined}>
                    {renderSubComponent && (
                      <TableCell className="p-0 text-center w-10">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRowExpansion(row.id)}>
                          <ChevronRight
                            size={16}
                            className={`transition-transform duration-200 ${expandedRows.has(row.id) ? 'rotate-90' : ''}`}
                          />
                        </Button>
                      </TableCell>
                    )}

                    {selectable && (
                      <TableCell className="text-center p-0">
                        <Input
                          name={`select_row_${row.id}`}
                          type="checkbox"
                          variant="ghost"
                          containerClassName="justify-center"
                          checked={selectedRows.has(row.id)}
                          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell
                        key={`${row.id}-${String(col.accessorKey)}`}
                        className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}>
                        {col.cell ? col.cell(row) : row[col.accessorKey]}
                      </TableCell>
                    ))}
                  </TableRow>

                  {renderSubComponent && expandedRows.has(row.id) && (
                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-50/50">
                      <TableCell colSpan={columns.length + (selectable ? 1 : 0) + 1} className="p-0">
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
