import React, { createContext,  forwardRef } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

// Contexto para compartilhar configurações entre componentes da tabela
const TableContext = createContext<{ 
  responsiveMode?: 'scroll' | 'stack' | 'collapse';
}>({ 
  responsiveMode: 'scroll' 
});

interface RootProps extends React.TableHTMLAttributes<HTMLTableElement> {
  instance?: {
    responsiveMode?: 'scroll' | 'stack' | 'collapse';
    [key: string]: any;
  };
  children: React.ReactNode;
}

// 1. ROOT (A Tabela em si)
export const TableRoot = forwardRef<HTMLTableElement, RootProps>(({ 
  instance, children, className = "", ...props 
}, ref) => {
  
  const responsiveMode = instance?.responsiveMode || 'scroll';
  
  // Classes para modo Stack (Mobile Cards)
  // Transforma a tabela em blocos no mobile
  const stackClasses = responsiveMode === 'stack' 
    ? `
      md:table 
      [&_thead]:hidden md:[&_thead]:table-header-group 
      [&_tbody]:block md:[&_tbody]:table-row-group 
      [&_tr]:block md:[&_tr]:table-row 
      [&_td]:block md:[&_td]:table-cell 
      [&_td]:text-right md:[&_td]:text-left
      [&_td]:flex md:[&_td]:table-cell
      [&_td]:justify-between md:[&_td]:justify-start
      [&_td]:items-center md:[&_td]:items-start
      [&_td::before]:content-[attr(data-label)] 
      [&_td::before]:font-bold [&_td::before]:text-gray-500 [&_td::before]:mr-auto md:[&_td::before]:hidden
    `
    : "table";

  return (
    <TableContext.Provider value={{ responsiveMode }}>
      <table 
        ref={ref}
        role="table" 
        className={`
            w-full text-sm text-left border-collapse 
            ${stackClasses}
            ${className}
        `}
        {...props}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
});
TableRoot.displayName = "Table.Root";

// 2. CONTAINER (Wrapper de Scroll)
export const TableContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = "", ...props }, ref) => (
  <div 
    ref={ref}
    className={`w-full overflow-auto relative custom-scrollbar bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
));
TableContainer.displayName = "Table.Container";

// 3. CAPTION
export const TableCaption = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption className={`p-4 text-lg font-semibold text-left text-gray-900 dark:text-white bg-white dark:bg-gray-800 caption-top border-b border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </caption>
);

// 4. COLGROUP & COL
export const TableColGroup = ({ children }: { children: React.ReactNode }) => (
  <colgroup>{children}</colgroup>
);

export const TableCol = (props: React.ColHTMLAttributes<HTMLTableColElement>) => (
  <col {...props} />
);

// 5. HEADER (THEAD)
export const TableHeader = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead 
      className={`
        text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 
        sticky top-0 z-10 shadow-sm
        ${className}
      `} 
      {...props}
    >
      <tr>{children}</tr>
    </thead>
  );
};

// 6. HEAD CELL (TH)
interface HeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  direction?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHeadCell: React.FC<HeadCellProps> = ({ 
  children, className = "", align = 'left', sortable, direction, onSort, ...props 
}) => (
  <th 
    scope="col" 
    onClick={sortable ? onSort : undefined}
    className={`
        px-6 py-3 font-bold whitespace-nowrap
        text-${align} 
        ${sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group' : ''}
        ${className}
    `}
    {...props}
  >
    <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {children}
      {sortable && (
          <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
              {direction === 'asc' ? <ArrowUp size={14} /> : direction === 'desc' ? <ArrowDown size={14} /> : <ChevronsUpDown size={14} />}
          </span>
      )}
    </div>
  </th>
);

// 7. BODY (TBODY)
export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ children, className = "", ...props }, ref) => (
  <tbody 
    ref={ref}
    className={`divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 ${className}`}
    {...props}
  >
    {children}
  </tbody>
));
TableBody.displayName = "Table.Body";

// 8. ROW (TR)
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  onClick?: () => void;
}

export const TableRow: React.FC<RowProps> = ({ children, className = "", onClick, ...props }) => (
  <tr 
    onClick={onClick}
    className={`
      hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors
      ${onClick ? 'cursor-pointer active:bg-gray-100 dark:active:bg-gray-700' : ''} 
      ${className}
    `}
    {...props}
  >
    {children}
  </tr>
);

// 9. CELL (TD)
export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement> & { columnIndex?: number; label?: string }> = ({ 
    children, className = "", align = 'left', columnIndex, label, ...props 
}) => (
  <td 
    data-label={label}
    className={`
        px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 
        text-${align} 
        ${className}
    `}
    {...props}
  >
    {children}
  </td>
);

// 10. FOOTER (TFOOT)
export const TableFooter = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot 
    className={`bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white ${className}`}
    {...props}
  >
    {children}
  </tfoot>
);

export const DataTable = { 
    Container: TableContainer,
    Root: TableRoot, 
    Caption: TableCaption,
    ColGroup: TableColGroup,
    Col: TableCol,
    Header: TableHeader, 
    HeadCell: TableHeadCell,
    Body: TableBody, 
    Row: TableRow, 
    Cell: TableCell,
    Footer: TableFooter
};