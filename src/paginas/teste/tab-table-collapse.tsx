import React from 'react';
import { ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import { DataTable } from '../../componentes/data-table';
import useList from '../../hooks/list';

const DATA = [
  { id: 'INV-001', client: 'Acme Corp', date: '2023-10-01', amount: 5000, status: 'Pago', details: 'Consultoria de Software' },
  { id: 'INV-002', client: 'Global Tech', date: '2023-10-05', amount: 12000, status: 'Pendente', details: 'Licença Anual' },
  { id: 'INV-003', client: 'Local Coff', date: '2023-10-10', amount: 350, status: 'Pago', details: 'Catering Evento' },
];

const TableCollapseExample: React.FC = () => {
  const { items } = useList(DATA);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Faturas (Modo Collapse)</h2>
      <p className="text-xs text-gray-500 mb-6">
        Redimensione a tela. Colunas "Data" e "Status" somem no mobile (classe `hidden md:table-cell`).
        Use a seta para ver detalhes.
      </p>

      {/* Grid Template: 
            - 40px: Seta Expansão
            - 100px: ID
            - 1fr: Cliente
            - 120px: Data (Hidden mobile)
            - 100px: Status (Hidden mobile)
            - 100px: Valor
        */}
      <DataTable.Root columns="40px 100px 1fr 120px 100px 100px">
        <DataTable.Header>
          <DataTable.HeadCell></DataTable.HeadCell>
          <DataTable.HeadCell>ID</DataTable.HeadCell>
          <DataTable.HeadCell>Cliente</DataTable.HeadCell>
          <DataTable.HeadCell className="hidden md:block">Data</DataTable.HeadCell>
          <DataTable.HeadCell className="hidden md:block">Status</DataTable.HeadCell>
          <DataTable.HeadCell align="right">Valor</DataTable.HeadCell>
        </DataTable.Header>

        <DataTable.Body>
          {items.map(item => {
            const isExpanded = expandedRows.has(item.id);
            return (
              <React.Fragment key={item.id}>
                <DataTable.Row className={`border-l-4 ${isExpanded ? 'border-l-cyan-500 bg-gray-50 dark:bg-gray-900/30' : 'border-l-transparent'}`}>
                  <DataTable.Cell>
                    <button onClick={() => toggleRow(item.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </DataTable.Cell>
                  <DataTable.Cell><span className="font-mono text-xs">{item.data.id}</span></DataTable.Cell>
                  <DataTable.Cell><span className="font-bold text-gray-900 dark:text-white">{item.data.client}</span></DataTable.Cell>
                  <DataTable.Cell className="hidden md:block">{item.data.date}</DataTable.Cell>
                  <DataTable.Cell className="hidden md:block">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${item.data.status === 'Pago' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {item.data.status}
                    </span>
                  </DataTable.Cell>
                  <DataTable.Cell align="right" className="font-mono">
                    R$ {item.data.amount}
                  </DataTable.Cell>
                </DataTable.Row>

                {/* LINHA DE DETALHE (EXPANSÃO) */}
                {isExpanded && (
                  <div className="col-span-full p-4 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-gray-800 text-sm animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="md:hidden">
                        <p className="text-xs text-gray-500 uppercase font-bold">Data</p>
                        <p className="flex items-center gap-2"><Calendar size={14} /> {item.data.date}</p>
                      </div>
                      <div className="md:hidden">
                        <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                        <p>{item.data.status}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 uppercase font-bold">Detalhes do Serviço</p>
                        <p className="text-gray-700 dark:text-gray-300">{item.data.details}</p>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </DataTable.Body>
      </DataTable.Root>
    </div>
  );
};

export default TableCollapseExample;