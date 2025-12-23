import React, { createContext, forwardRef } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

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

// 1. ROOT
export const TableRoot = forwardRef<HTMLTableElement, RootProps>(({
  instance, children, className = "", ...props
}, ref) => {
  const responsiveMode = instance?.responsiveMode || 'scroll';

  return (
    <TableContext.Provider value={{ responsiveMode }}>
      <table
        ref={ref}
        role="table"
        className={`w-full text-sm text-left border-collapse ${className}`}
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

// 4. COLGROUP
export const TableColGroup = ({ children }: { children: React.ReactNode }) => (
  <colgroup>{children}</colgroup>
);

export const TableCol = (props: React.ColHTMLAttributes<HTMLTableColElement>) => (
  <col {...props} />
);

// 5. HEADER (CORREÇÃO: Adicionado <tr> interno)
export const TableHeader = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead
      className={`
        text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/90 dark:text-gray-400 
        sticky top-0 z-10 shadow-sm
        ${className}
      `}
      {...props}
    >
      <tr>{children}</tr>
    </thead>
  );
};

// 6. HEAD CELL
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

// 7. BODY
export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ children, className = "", ...props }, ref) => (
  <tbody ref={ref} className={`divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 ${className}`} {...props}>
    {children}
  </tbody>
));
TableBody.displayName = "Table.Body";

// 8. ROW
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

// 9. CELL
export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement> & { columnIndex?: number; label?: string }> = ({
  children, className = "", align = 'left', columnIndex, label, ...props
}) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-${align} ${className}`}
    {...props}
  >
    {children}
  </td>
);

// 10. FOOTER
export const TableFooter = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={`bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white ${className}`} {...props}>
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