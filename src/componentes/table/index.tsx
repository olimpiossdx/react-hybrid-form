import React, { forwardRef } from 'react';

// --- 1. CONTAINER (Wrapper de Scroll) ---
// Responsável pelo scroll (X e Y) e pelo isolamento do contexto de layout.
// Aceita ref para conectar com virtualizadores.
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`w-full overflow-auto relative custom-scrollbar bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
));
Container.displayName = "Table.Container";

// --- 2. ROOT (A Tabela em si) ---
export const Root = forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(({ children, className = "", ...props }, ref) => (
  <table
    ref={ref}
    className={`w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse ${className}`}
    {...props}
  >
    {children}
  </table>
));
Root.displayName = "Table.Root";

// --- 3. SEÇÕES SEMÂNTICAS ---

export const Header = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={`
      text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 
      sticky top-0 z-10 shadow-sm
      ${className}
    `}
    {...props}
  >
    {children}
  </thead>
);

export const Body = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ children, className = "", ...props }, ref) => (
  <tbody ref={ref} className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`} {...props}>
    {children}
  </tbody>
));
Body.displayName = "Table.Body";

export const Footer = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={`bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </tfoot>
);

// --- 4. COLUNAS E LINHAS ---

export const ColGroup = ({ children }: { children: React.ReactNode }) => (
  <colgroup>{children}</colgroup>
);

export const Col = (props: React.ColHTMLAttributes<HTMLTableColElement>) => (
  <col {...props} />
);

export const Row = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={`
      bg-white dark:bg-gray-800 
      hover:bg-gray-50 dark:hover:bg-gray-700/50 
      transition-colors duration-150
      ${className}
    `}
    {...props}
  >
    {children}
  </tr>
);

// --- 5. CÉLULAS ---

export const HeadCell = ({ children, className = "", align = 'left', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    scope="col"
    className={`px-6 py-3 font-bold whitespace-nowrap text-${align} ${className}`}
    {...props}
  >
    {children}
  </th>
);

export const Cell = ({ children, className = "", align = 'left', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-${align} ${className}`}
    {...props}
  >
    {children}
  </td>
);

// --- 6. HELPERS VISUAIS (Opcionais) ---

export const Caption = ({ children, className = "" }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption className={`p-4 text-lg font-semibold text-left text-gray-900 dark:text-white bg-white dark:bg-gray-800 caption-top ${className}`}>
    {children}
  </caption>
);

// Namespace de Exportação
export const Table = {
  Container,
  Root,
  Header,
  Body,
  Footer,
  ColGroup,
  Col,
  Row,
  HeadCell,
  Cell,
  Caption
};