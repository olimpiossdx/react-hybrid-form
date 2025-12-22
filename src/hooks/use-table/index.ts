import React from "react";

export type ResponsiveMode = 'scroll' | 'stack' | 'collapse';

export interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;

  // Largura (para colgroup)
  width?: string;

  // Prioridade para modo Collapse (1 = alta, 5 = baixa)
  priority?: number;

  // Se true, esconde o label no modo Stack (bom para botões de ação)
  hideLabelOnStack?: boolean;
}

interface UseTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  responsiveMode?: ResponsiveMode;
}

const useTable = <T>({
  data,
  columns,
  responsiveMode = 'scroll'
}: UseTableProps<T>) => {
  const [sortState, setSortState] = React.useState<{ key: string, dir: 'asc' | 'desc' } | null>(null);
    const [expandedRows, setExpandedRows] = React.useState<Set<string | number>>(new Set());

  // Lógica de Ordenação (Client-side simples)
  const sortedData = React.useMemo(() => {
    if (!sortState || !sortState.key) return data;
    return [...data].sort((a: any, b: any) => {
      if (a[sortState.key] < b[sortState.key]) return sortState.dir === 'asc' ? -1 : 1;
      if (a[sortState.key] > b[sortState.key]) return sortState.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortState]);

  const toggleRowExpand = (id: string | number) => {
        setExpandedRows(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
  };

      return {
        data: sortedData,
      columns,
      responsiveMode,
      sortState,
      setSortState,
      expandedRows,
      toggleRowExpand
  };
};

export default  useTable;