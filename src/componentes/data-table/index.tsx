import React, { createContext, useContext, forwardRef } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

// Contexto expandido para suportar Responsividade e Layout
const TableContext = createContext<{
  columns: string;
  minWidth?: string;
  responsiveMode?: 'scroll' | 'stack' | 'collapse';
}>({
  columns: '1fr',
  minWidth: '100%',
  responsiveMode: 'scroll'
});

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  // Modo Manual: String CSS Grid
  columns?: string;

  // Modo Automático: Instância do hook useTable
  instance?: {
    columns: Array<{ width?: string | number; id: string }>;
    responsiveMode?: 'scroll' | 'stack' | 'collapse';
  };

  minWidth?: string;
  children: React.ReactNode;
}

// 1. ROOT: O Cérebro de Layout
export const TableRoot: React.FC<RootProps> = ({
  columns,
  instance,
  minWidth = '100%',
  children,
  className = "",
  ...props
}) => {

  // Resolve o layout das colunas
  const resolveGridTemplate = () => {
    // 1. Prioridade: Prop explícita
    if (columns) return columns;

    // 2. Automático: Baseado na configuração do hook useTable
    if (instance?.columns) {
      return instance.columns.map(col => {
        if (!col.width) return '1fr';
        return typeof col.width === 'number' ? `${col.width}px` : col.width;
      }).join(' ');
    }

    return '1fr';
  };

  const gridColumns = resolveGridTemplate();
  const responsiveMode = instance?.responsiveMode || 'scroll';

  // Classes condicionais para o modo Stack (Mobile Cards)
  // Se mode='stack', em telas pequenas transformamos o grid em block
  const stackClasses = responsiveMode === 'stack'
    ? "[&_[role=row]]:flex-col [&_[role=row]]:h-auto [&_[role=row]]:items-start md:[&_[role=row]]:grid md:[&_[role=row]]:items-center [&_[role=columnheader]]:hidden md:[&_[role=columnheader]]:flex"
    : "";

  return (
    <TableContext.Provider value={{ columns: gridColumns, minWidth, responsiveMode }}>
      <div
        role="table"
        className={`
            flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden 
            ${stackClasses}
            ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};

// 2. CONTAINER (Wrapper de Scroll)
export const TableContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`overflow-auto relative ${className}`}
    {...props}
  >
    {children}
  </div>
));
TableContainer.displayName = "TableContainer";

// 3. HEADER
export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { columns, minWidth } = useContext(TableContext);
  return (
    <div
      role="rowgroup"
      className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
      style={{ minWidth }}
    >
      <div role="row" className="grid items-center gap-4 px-4 py-3" style={{ gridTemplateColumns: columns }}>
        {children}
      </div>
    </div>
  );
};

// 4. HEAD CELL
interface HeadCellProps {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  direction?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHeadCell: React.FC<HeadCellProps> = ({
  children, className = "", align = 'left', sortable, direction, onSort
}) => (
  <div
    role="columnheader"
    onClick={sortable ? onSort : undefined}
    className={`
        flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none
        ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}
        ${sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors' : ''}
        ${className}
    `}
  >
    {children}
    {sortable && (
      <span className="text-gray-400">
        {direction === 'asc' ? <ArrowUp size={14} /> : direction === 'desc' ? <ArrowDown size={14} /> : <ChevronsUpDown size={14} />}
      </span>
    )}
  </div>
);

// 5. BODY
export const TableBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = "", ...props }, ref) => {
  const { minWidth } = useContext(TableContext);
  return (
    <div
      ref={ref}
      role="rowgroup"
      className={`flex-1 overflow-y-auto custom-scrollbar relative ${className}`}
      {...props}
    >
      {/* Wrapper interno para garantir min-width no scroll horizontal */}
      <div style={{ minWidth, height: '100%' }}>
        {children}
      </div>
    </div>
  );
});
TableBody.displayName = "TableBody";

// 6. ROW
export const TableRow: React.FC<React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }> = ({ children, className = "", onClick, style, ...props }) => {
  const { columns, responsiveMode } = useContext(TableContext);

  // Se for stack (mobile), removemos o gridTemplateColumns para deixar o flex agir
  // Se for scroll (desktop), aplicamos o grid
  // Nota: A classe CSS injetada no Root já trata a troca de display: grid para flex em telas pequenas se necessário,
  // mas aqui garantimos que o estilo inline não sobrescreva o comportamento stack.
  const rowStyle = responsiveMode === 'stack' ? { ...style } : { gridTemplateColumns: columns, ...style };

  return (
    <div
      role="row"
      onClick={onClick}
      style={rowStyle}
      className={`
        grid items-center gap-4 px-4 border-b border-gray-100 dark:border-gray-800 last:border-0 
        hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors
        ${onClick ? 'cursor-pointer active:bg-gray-100 dark:active:bg-gray-700' : ''} 
        /* Ajuste de altura mínima para manter ritmo vertical */
        min-h-[57px]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// 7. CELL
export const TableCell: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right'; columnIndex?: number }> = ({
  children, className = "", align = 'left', columnIndex
}) => (
  <div
    role="cell"
    data-column-index={columnIndex} // Útil para CSS mobile (labels)
    className={`text-sm text-gray-700 dark:text-gray-200 truncate text-${align} ${className}`}
  >
    {children}
  </div>
);

export const DataTable = {
  Root: TableRoot,
  Container: TableContainer,
  Header: TableHeader,
  HeadCell: TableHeadCell,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell
};