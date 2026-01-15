import * as React from 'react';

// --- Contexto de Densidade ---
type typeTableDensity = 'sm' | 'md' | 'lg';

interface TableContextValue {
  density: typeTableDensity;
}

const TableContext = React.createContext<TableContextValue>({
  density: 'md',
});

// --- Componentes ---

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm ${
      className || ''
    }`}
    {...props}
  />
));
TableContainer.displayName = 'TableContainer';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  density?: typeTableDensity;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, density = 'md', ...props }, ref) => {
  return (
    <TableContext.Provider value={{ density }}>
      <table ref={ref} className={`w-full caption-bottom text-sm text-left ${className || ''}`} {...props} />
    </TableContext.Provider>
  );
});
Table.displayName = 'Table';

// CORREÇÃO: TableHeader renderiza APENAS 'thead'.
// Removemos qualquer 'tr' que pudesse estar hardcoded aqui.
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={`bg-gray-50/50 dark:bg-gray-900/20 [&_tr]:border-b ${className || ''}`} {...props} />
  ),
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props} />,
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={`border-t bg-gray-50/50 font-medium [&>tr]:last:border-b-0 dark:bg-gray-900/50 ${className || ''}`}
      {...props}
    />
  ),
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50 data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-gray-800 ${
      className || ''
    }`}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => {
  const { density } = React.useContext(TableContext);

  // Altura e padding dinâmicos baseados na densidade
  const heightClass = density === 'sm' ? 'h-8' : density === 'lg' ? 'h-14' : 'h-10';
  const paddingClass = density === 'sm' ? 'px-2' : density === 'lg' ? 'px-6' : 'px-4';

  return (
    <th
      ref={ref}
      className={`${heightClass} ${paddingClass} text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 ${
        className || ''
      }`}
      {...props}
    />
  );
});
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => {
  const { density } = React.useContext(TableContext);

  const paddingClass = density === 'sm' ? 'p-2' : density === 'lg' ? 'p-6' : 'p-4';

  return (
    <td
      ref={ref}
      className={`${paddingClass} align-middle text-gray-900 dark:text-gray-100 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5 ${
        className || ''
      }`}
      {...props}
    />
  );
});
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={`mt-4 text-sm text-gray-500 dark:text-gray-400 ${className || ''}`} {...props} />
  ),
);
TableCaption.displayName = 'TableCaption';

export { Table, TableBody, TableCaption, TableCell, TableContainer, TableFooter, TableHead, TableHeader, TableRow };
