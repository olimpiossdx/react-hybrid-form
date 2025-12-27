import React, { createContext, forwardRef } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import Pagination from '../pagination';

// Contexto para compartilhar configurações entre componentes da tabela
const TableContext = createContext<{
  responsiveMode?: 'scroll' | 'stack' | 'collapse';
}>({
  responsiveMode: 'scroll',
});

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  instance?: {
    responsiveMode?: 'scroll' | 'stack' | 'collapse';
    [key: string]: any;
  };
  children: React.ReactNode;
}

// 1. ROOT (Wrapper Principal + Contexto)
// Renderiza uma DIV para encapsular a tabela e a paginação/toolbar.
export const TableRoot = forwardRef<HTMLDivElement, RootProps>(({ instance, children, className = '', ...props }, ref) => {
  const responsiveMode = instance?.responsiveMode || 'scroll';

  return (
    <TableContext.Provider value={{ responsiveMode }}>
      <div
        ref={ref}
        role="region"
        aria-label="Tabela de Dados"
        className={`flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden ${className}`}
        {...props}>
        {children}
      </div>
    </TableContext.Provider>
  );
});
TableRoot.displayName = 'Table.Root';

// 2. CONTAINER (Wrapper de Scroll)
// Responsável pelo scroll (X e Y). Deve envolver a <Table>.
export const TableContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`w-full overflow-auto relative custom-scrollbar ${className}`} {...props}>
      {children}
    </div>
  ),
);
TableContainer.displayName = 'Table.Container';

// 3. TABLE (A Tag Tabela Real - Obrigatória)
// Deve ser filha direta de Container ou Root.
export const TableMain = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ children, className = '', ...props }, ref) => {
    const { responsiveMode } = React.useContext(TableContext);

    // Classes para transformar a tabela em Cards no mobile (Modo Stack)
    const stackClasses =
      responsiveMode === 'stack'
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
        : 'table';

    return (
      <table ref={ref} className={`w-full text-sm text-left border-collapse ${stackClasses} ${className}`} {...props}>
        {children}
      </table>
    );
  },
);
TableMain.displayName = 'Table.Main';

// 4. HEADER (THEAD)
// Deve ser filho de <Table>.
export const TableHeader = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={`
      text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 
      sticky top-0 z-10 shadow-sm
      ${className}
    `}
    {...props}>
    <tr>{children}</tr>
  </thead>
);

// 5. BODY (TBODY)
// Deve ser filho de <Table>. Aceita ref para virtualização.
export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, className = '', ...props }, ref) => (
    <tbody ref={ref} className={`divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 ${className}`} {...props}>
      {children}
    </tbody>
  ),
);
TableBody.displayName = 'Table.Body';

// 6. CAPTION
export const TableCaption = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={`p-4 text-lg font-semibold text-left text-gray-900 dark:text-white bg-white dark:bg-gray-800 caption-top border-b border-gray-200 dark:border-gray-700 ${className}`}
    {...props}>
    {children}
  </caption>
);

// 7. COLGROUP & COL
export const TableColGroup = ({ children }: { children: React.ReactNode }) => <colgroup>{children}</colgroup>;
export const TableCol = (props: React.ColHTMLAttributes<HTMLTableColElement>) => <col {...props} />;

// 8. ROW (TR)
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  onClick?: () => void;
}
export const TableRow: React.FC<RowProps> = ({ children, className = '', onClick, ...props }) => (
  <tr
    onClick={onClick}
    className={`
      hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150
      ${onClick ? 'cursor-pointer active:bg-gray-100 dark:active:bg-gray-700' : ''} 
      ${className}
    `}
    {...props}>
    {children}
  </tr>
);

// 9. HEAD CELL (TH)
interface HeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  direction?: 'asc' | 'desc' | null;
  onSort?: () => void;
}
export const TableHeadCell: React.FC<HeadCellProps> = ({
  children,
  className = '',
  align = 'left',
  sortable,
  direction,
  onSort,
  ...props
}) => (
  <th
    scope="col"
    onClick={sortable ? onSort : undefined}
    className={`
        px-6 py-3 font-bold whitespace-nowrap bg-gray-50 dark:bg-gray-900/90
        text-${align} 
        ${sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group' : ''}
        ${className}
    `}
    {...props}>
    <div
      className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {children}
      {sortable && (
        <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
          {direction === 'asc' ? <ArrowUp size={14} /> : direction === 'desc' ? <ArrowDown size={14} /> : <ChevronsUpDown size={14} />}
        </span>
      )}
    </div>
  </th>
);

// 10. CELL (TD)
export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    columnIndex?: number;
    label?: string;
  }
> = ({ children, className = '', align = 'left', columnIndex, label, ...props }) => (
  <td
    data-label={label}
    className={`
        px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 
        text-${align} 
        ${className}
    `}
    {...props}>
    {children}
  </td>
);

// 11. FOOTER (TFOOT)
export const TableFooter = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot
    className={`bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white ${className}`}
    {...props}>
    {children}
  </tfoot>
);

// 12. PAGINATION WRAPPER
interface TablePaginationProps {
  instance: any;
  mode?: 'range' | 'simple' | 'extended';
  className?: string;
}
export const TablePagination: React.FC<TablePaginationProps> = ({ instance, mode, className }) => {
  // Safe check
  if (!instance?.pagination) {
    return null;
  }

  const {
    pagination: { pageIndex, setPageIndex, pageSize, setPageSize },
    totalRows,
  } = instance;
  return (
    <Pagination
      currentPage={pageIndex}
      totalCount={totalRows}
      pageSize={pageSize}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
      mode={mode}
      className={`border-t border-gray-200 dark:border-gray-700 ${className}`}
    />
  );
};

// EXPORTAÇÃO FINAL
export const DataTable = {
  Root: TableRoot,
  Container: TableContainer,
  Table: TableMain, // Essencial para HTML válido
  Header: TableHeader,
  HeadCell: TableHeadCell,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Footer: TableFooter,
  Caption: TableCaption,
  ColGroup: TableColGroup,
  Col: TableCol,
  Pagination: TablePagination,
};
