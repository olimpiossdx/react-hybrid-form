import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronsUpDown, ChevronUp, Search } from 'lucide-react';

import { Input } from '../input';
import Pagination from '../pagination';
import { Select } from '../select';
import { Spinner } from '../spinner';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '../table';

// --- Interfaces ---

export interface DataTableColumn<T = any> {
  accessorKey: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  cell?: (row: T) => React.ReactNode;
}

export interface PaginationState {
  pageIndex: number; // 0-based
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

  // Configuração
  density?: 'sm' | 'md' | 'lg';
  selectable?: boolean;
  searchable?: boolean;

  // Callbacks
  onRowSelect?: (selectedIds: (string | number)[]) => void;

  // --- Server-Side / Controle Externo ---
  manualPagination?: boolean;
  rowCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;

  manualSorting?: boolean;
  onSortingChange?: (sorting: SortingState) => void;

  // NOVO: Callback de busca para Server-Side Search
  onSearchChange?: (term: string) => void;
}

export function DataTable<T extends { id: string | number } & Record<string, any>>({
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
  onSearchChange, // Recebendo o callback
}: DataTableProps<T>) {
  // Estados Internos
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>({ column: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [globalFilter, setGlobalFilter] = useState('');

  // Debounce para a busca (evita chamadas excessivas na API)
  useEffect(() => {
    if (onSearchChange) {
      const timeoutId = setTimeout(() => {
        onSearchChange(globalFilter);
      }, 500); // 500ms delay
      return () => clearTimeout(timeoutId);
    }
  }, [globalFilter, onSearchChange]);

  // Handlers
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

  // --- Processamento de Dados ---

  // 1. Filtragem (Client-Side fallback)
  const filteredData = useMemo(() => {
    // Se tiver callback de busca externo (Server-Side), ignoramos o filtro local
    if (onSearchChange || !globalFilter) {
      return data;
    }

    const lowerFilter = globalFilter.toLowerCase();
    return data.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(lowerFilter)));
  }, [data, globalFilter, onSearchChange]);

  // 2. Ordenação
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

  // 3. Paginação
  const paginatedData = useMemo(() => {
    if (manualPagination) {
      return sortedData;
    }

    const start = pagination.pageIndex * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination, manualPagination]);

  const totalCount = manualPagination ? rowCount : filteredData.length;

  // Seleção
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map((row) => row.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
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
  };

  useEffect(() => {
    if (onRowSelect) {
      onRowSelect(Array.from(selectedRows));
    }
  }, [selectedRows, onRowSelect]);

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
        <Table density={density}>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-[50px]">
                  <Input
                    name="select_all_rows"
                    type="checkbox"
                    variant="ghost"
                    containerClassName="justify-center"
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
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
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Spinner size="md" /> Carregando dados...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center text-gray-500">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              paginatedData.map((row) => (
                <TableRow key={row.id} data-state={selectedRows.has(row.id) ? 'selected' : undefined}>
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {selectable && selectedRows.size > 0 && (
            <span className="mr-4 text-blue-600 font-medium">{selectedRows.size} selecionado(s)</span>
          )}
          <span>Total: {totalCount} registros</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Linhas:</span>
            <Select
              name="rows_per_page"
              value={pagination.pageSize}
              onChange={(e) => handlePaginationChange({ ...pagination, pageSize: Number(e.target.value), pageIndex: 0 })}
              sized="sm"
              variant="ghost"
              containerClassName="w-20">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </div>

          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalCount={totalCount}
            pageSize={pagination.pageSize}
            onPageChange={(page) => handlePaginationChange({ ...pagination, pageIndex: page - 1 })}
          />
        </div>
      </div>
    </div>
  );
}
