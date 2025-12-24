import { useState, useMemo } from "react";

export type ResponsiveMode = "scroll" | "stack" | "collapse";

export interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  width?: string;
  priority?: number;
  hideLabelOnStack?: boolean;
}

interface UseTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  responsiveMode?: ResponsiveMode;

  // Paginação
  pagination?: {
    manual?: boolean; // Se true, não fatia os dados (Server-side)
    pageSize?: number;
  };
}

export const useTable = <T>({
  data,
  columns,
  responsiveMode = "scroll",
  pagination,
}: UseTableProps<T>) => {
  const [sortState, setSortState] = useState<{
    key: string;
    dir: "asc" | "desc";
  } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set()
  );

  // Estado de Paginação
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);

  // 1. Ordenação
  const sortedData = useMemo(() => {
    if (!sortState || !sortState.key) return data;
    return [...data].sort((a: any, b: any) => {
      if (a[sortState.key] < b[sortState.key])
        return sortState.dir === "asc" ? -1 : 1;
      if (a[sortState.key] > b[sortState.key])
        return sortState.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortState]);

  // 2. Paginação (Client-Side Slice)
  const paginatedData = useMemo(() => {
    if (pagination?.manual) return sortedData; // API já retorna paginado
    const start = (pageIndex - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pageIndex, pageSize, pagination?.manual]);

  const totalCount = data.length;
  const pageCount = Math.ceil(totalCount / pageSize);

  const toggleRowExpand = (id: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return {
    // Dados Finais (Ordenados e Paginados)
    data: paginatedData,
    // Dados Originais (para contadores)
    totalRows: totalCount,

    columns,
    responsiveMode,
    sortState,
    setSortState,
    expandedRows,
    toggleRowExpand,

    // API de Paginação
    pagination: {
      pageIndex,
      setPageIndex,
      pageSize,
      setPageSize,
      pageCount,
      canNext: pageIndex < pageCount,
      canPrev: pageIndex > 1,
    },
  };
};
