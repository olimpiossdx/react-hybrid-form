import React, { createContext, useContext } from 'react';
import type { TableColumn, ResponsiveMode } from '../../hooks/use-table';

// Contexto para passar configurações da tabela para as linhas/células
const TableContext = createContext<{
  columns: TableColumn<any>[];
  responsiveMode: ResponsiveMode;
}>({ columns: [], responsiveMode: 'scroll' });

// --- ROOT ---
interface TableRootProps {
  instance: any; // Retorno do useTable
  children: React.ReactNode;
  className?: string;
}

export const Root: React.FC<TableRootProps> = ({ instance, children, className = "" }) => {
  const { responsiveMode } = instance;

  // Classes para modo Stack (Mobile Cards)
  // No mobile, a tabela vira flex/block. No desktop (md), volta a ser table.
  const stackClasses = responsiveMode === 'stack'
    ? "[&_table]:block md:[&_table]:table [&_thead]:hidden md:[&_thead]:table-header-group [&_tr]:block md:[&_tr]:table-row [&_tr]:mb-4 md:[&_tr]:mb-0 [&_tr]:border [&_tr]:rounded-lg md:[&_tr]:border-b-0 [&_td]:flex md:[&_td]:table-cell [&_td]:justify-between [&_td]:px-4 [&_td]:py-2 [&_td]:text-right md:[&_td]:text-left [&_td::before]:content-[attr(data-label)] [&_td::before]:font-bold [&_td::before]:text-gray-500 [&_td::before]:mr-4 md:[&_td::before]:hidden"
    : "";

  return (
    <TableContext.Provider value={{ columns: instance.columns, responsiveMode }}>
      <div className={`w-full overflow-x-auto ${stackClasses} ${className}`}>
        <table className="w-full text-sm text-left border-collapse">
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
};

// --- SEMÂNTICA HTML ---
export const Caption = ({ children }: { children: React.ReactNode }) => (
  <caption className="p-4 text-lg font-semibold text-left text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    {children}
  </caption>
);

export const ColGroup = () => {
  const { columns } = useContext(TableContext);
  return (
    <colgroup>
      {columns.map(col => (
        <col key={col.id} style={{ width: col.width }} />
      ))}
    </colgroup>
  );
};

export const Header = ({ children }: { children: React.ReactNode }) => (
  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>{children}</tr>
  </thead>
);

export const HeadCell = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" onClick={onClick}>
    {children}
  </th>
);

export const Body = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    {children}
  </tbody>
);

export const Footer = ({ children }: { children: React.ReactNode }) => (
  <tfoot className="bg-gray-50 dark:bg-gray-700 font-bold text-gray-900 dark:text-white">
    {children}
  </tfoot>
);

// --- LINHA INTELIGENTE ---
export const Row = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <tr className={`hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b dark:border-gray-700 ${className}`}>
    {children}
  </tr>
);

// --- CÉLULA INTELIGENTE (Auto Label) ---
interface CellProps {
  children?: React.ReactNode;
  columnIndex?: number; // Para saber qual label usar no modo stack
  className?: string;
}

export const Cell = ({ children, columnIndex, className = "" }: CellProps) => {
  const { columns, responsiveMode } = useContext(TableContext);

  // Se estivermos em modo stack, precisamos injetar o label da coluna para o CSS ::before pegar
  const label = (responsiveMode === 'stack' && columnIndex !== undefined && !columns[columnIndex]?.hideLabelOnStack)
    ? columns[columnIndex]?.header
    : undefined;

  return (
    <td
      data-label={label} // O CSS usa isso: content: attr(data-label)
      className={`px-6 py-4 ${className}`}
    >
      {children}
    </td>
  );
};

export const Table = { Root, Caption, ColGroup, Header, HeadCell, Body, Row, Cell, Footer };