import React, { createContext, useContext, forwardRef } from 'react';

// Contexto para compartilhar o Layout da Grid
const TableContext = createContext<{ columns: string }>({ columns: '1fr' });

interface RootProps {
  columns: string; // Ex: "50px 1fr 200px" (Sintaxe CSS Grid)
  children: React.ReactNode;
  className?: string;
}

export const TableRoot: React.FC<RootProps> = ({ columns, children, className = "" }) => (
  <TableContext.Provider value={{ columns }}>
    <div
      role="table"
      className={`
        border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col 
        bg-white dark:bg-gray-800 transition-colors shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  </TableContext.Provider>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { columns } = useContext(TableContext);
  return (
    <div role="rowgroup" className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 z-10">
      <div
        role="row"
        className="grid items-center gap-4 px-4 py-3"
        style={{ gridTemplateColumns: columns }}
      >
        {children}
      </div>
    </div>
  );
};

export const TableHeadCell: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }> = ({ children, className = "", align = 'left' }) => (
  <div
    role="columnheader"
    className={`
        text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none
        text-${align} ${className}
    `}
  >
    {children}
  </div>
);

// Aceita props extras para conectar com o Virtualizador (ref, onScroll, etc)
// ATUALIZADO: forwardRef para aceitar a ref do virtualizador corretamente
export const TableBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    role="rowgroup"
    className={`flex-1 overflow-y-auto custom-scrollbar ${className}`}
    {...props}
  >
    {children}
  </div>
));
TableBody.displayName = "TableBody";

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

export const TableRow: React.FC<RowProps> = ({ children, className = "", onClick, style, ...props }) => {
  const { columns } = useContext(TableContext);
  return (
    <div
      role="row"
      onClick={onClick}
      style={{ gridTemplateColumns: columns, ...style }}
      className={`
        grid items-center gap-4 px-4 border-b border-gray-100 dark:border-gray-800 last:border-0 
        hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors h-[57px]
        ${onClick ? 'cursor-pointer active:bg-gray-100 dark:active:bg-gray-700' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const TableCell: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }> = ({ children, className = "", align = 'left' }) => (
  <div role="cell" className={`text-sm text-gray-700 dark:text-gray-200 truncate text-${align} ${className}`}>
    {children}
  </div>
);

// Namespace para exportação
export const DataTable = {
  Root: TableRoot,
  Header: TableHeader,
  HeadCell: TableHeadCell,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell
};