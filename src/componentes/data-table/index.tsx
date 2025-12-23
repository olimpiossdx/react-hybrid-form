import React, { createContext, useContext, forwardRef } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

// Contexto de Configuração
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
  columns?: string;
  instance?: {
    columns: Array<{ width?: string | number; id: string }>;
    responsiveMode?: 'scroll' | 'stack' | 'collapse';
    [key: string]: any;
  };
  minWidth?: string;
  children: React.ReactNode;
}

// 1. ROOT
export const TableRoot: React.FC<RootProps> = ({
  columns, instance, minWidth = '100%', children, className = "", ...props
}) => {

  const resolveGridTemplate = () => {
    if (columns) return columns;
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

  return (
    <TableContext.Provider value={{ columns: gridColumns, minWidth, responsiveMode }}>
      <div
        role="table"
        // Injeta a variável CSS globalmente para este escopo
        style={{ '--table-cols': gridColumns } as React.CSSProperties}
        className={`
            flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden 
            ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};

// 2. CONTAINER
export const TableContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`overflow-auto relative flex-1 custom-scrollbar ${className}`}
    {...props}
  >
    {children}
  </div>
));
TableContainer.displayName = "TableContainer";

// 3. HEADER
export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { minWidth, responsiveMode } = useContext(TableContext);

  // No modo stack, o cabeçalho some em telas pequenas porque os labels vão para dentro dos cards
  const responsiveClass = responsiveMode === 'stack' ? 'hidden md:block' : '';

  return (
    <div
      role="rowgroup"
      className={`sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${responsiveClass}`}
      style={{ minWidth }}
    >
      {/* Sempre Grid no Header */}
      <div role="row" className="grid items-center gap-4 px-4 py-3" style={{ gridTemplateColumns: 'var(--table-cols)' }}>
        {children}
      </div>
    </div>
  );
};

// 4. HEAD CELL
interface HeadCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  direction?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHeadCell: React.FC<HeadCellProps> = ({ children, className = "", align = 'left', sortable, direction, onSort }) => (
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
      <div style={{ minWidth, height: '100%' }}>
        {children}
      </div>
    </div>
  );
});
TableBody.displayName = "TableBody";

// 6. ROW (Onde a mágica da responsividade acontece)
export const TableRow: React.FC<React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }> = ({ children, className = "", onClick, style, ...props }) => {
  const { responsiveMode } = useContext(TableContext);

  let layoutClasses = "";

  if (responsiveMode === 'stack') {
    // Mobile: Flex Column (Card) com bordas e espaçamento
    // Desktop (md): Grid (Tabela) limpa
    layoutClasses = `
        flex flex-col p-4 mb-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30
        md:grid md:p-0 md:mb-0 md:rounded-none md:border-0 md:border-b md:bg-transparent md:dark:bg-transparent md:items-center md:gap-4 md:px-4 md:min-h-[57px]
      `;
  } else {
    // Padrão Scroll: Sempre Grid
    layoutClasses = "grid items-center gap-4 px-4 border-b border-gray-100 dark:border-gray-800 min-h-[57px]";
  }

  // Interatividade
  const interactiveClasses = onClick
    ? 'cursor-pointer active:bg-gray-100 dark:active:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors'
    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors';

  return (
    <div
      role="row"
      onClick={onClick}
      style={{
        ...style,
        // APLICAÇÃO DE GRID UNIVERSAL:
        // No mobile (flex), essa propriedade é ignorada pelo browser.
        // No desktop (grid), ela define as colunas corretamente.
        gridTemplateColumns: 'var(--table-cols)'
      }}
      className={`
        last:border-0 
        ${layoutClasses}
        ${interactiveClasses}
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
    data-column-index={columnIndex}
    className={`
        text-sm text-gray-700 dark:text-gray-200 truncate 
        w-full md:w-auto 
        text-${align} 
        /* No modo stack mobile, itens podem precisar de margem ou ajuste flex, mas deixamos genérico aqui */
        ${className}
    `}
  >
    {children}
  </div>
);

export const DataTable = { Root: TableRoot, Container: TableContainer, Header: TableHeader, HeadCell: TableHeadCell, Body: TableBody, Row: TableRow, Cell: TableCell };