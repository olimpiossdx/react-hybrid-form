import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, FileText } from 'lucide-react';
import useList from '../../hooks/list';
import { showModal } from '../../componentes/modal';
import { DataTable } from '../../componentes/data-table';


// --- MOCK DATA ---
const DATA = [
  { id: 'INV-001', client: 'Acme Corp', date: '2023-10-01', amount: 5000, status: 'Pago', details: 'Consultoria de Software - Q3' },
  { id: 'INV-002', client: 'Global Tech', date: '2023-10-05', amount: 12000, status: 'Pendente', details: 'Licença Anual Enterprise' },
  { id: 'INV-003', client: 'Local Coff', date: '2023-10-10', amount: 350, status: 'Pago', details: 'Catering Evento de Lançamento' },
  { id: 'INV-004', client: 'Startup Inc', date: '2023-10-12', amount: 2500, status: 'Atrasado', details: 'Design System MVP' },
  { id: 'INV-005', client: 'Mega Corp', date: '2023-10-15', amount: 50000, status: 'Pago', details: 'Servidores Dedicados' },
];

const TabTableCollapse = () => {
  const { items } = useList(DATA);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const handleDetails = (item: any) => {
    showModal({
      title: `Fatura ${item.id}`,
      size: 'sm',
      content: <div className="p-4 text-gray-300">{item.details}</div>
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col transition-colors">

      <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FileText className="text-purple-600 dark:text-purple-400" />
          Faturas (Modo Collapse)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Redimensione a tela. As colunas "Data" e "Status" somem no mobile e aparecem ao expandir.
        </p>
      </div>

      {/* GRID TEMPLATE: 
            - 40px: Seta Expansão
            - 100px: ID
            - 1fr: Cliente (Flexível)
            - 120px: Data (Hidden mobile)
            - 100px: Status (Hidden mobile)
            - 120px: Valor (Alinhado à direita)
        */}
      <DataTable.Root columns="40px 100px 1fr 120px 100px 120px" className="flex-1">

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
            const statusColors: any = {
              'Pago': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
              'Pendente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
              'Atrasado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            };

            return (
              <React.Fragment key={item.id}>
                {/* LINHA PRINCIPAL */}
                <DataTable.Row
                  className={`border-l-4 transition-all ${isExpanded ? 'border-l-cyan-500 bg-gray-50 dark:bg-gray-900/30' : 'border-l-transparent'}`}
                  onClick={() => toggleRow(item.id)} // Clica na linha toda para expandir
                >
                  <DataTable.Cell>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{item.data.id}</span>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <span className="font-bold text-gray-900 dark:text-white">{item.data.client}</span>
                  </DataTable.Cell>

                  {/* Colunas que somem no mobile (hidden md:block) */}
                  <DataTable.Cell className="hidden md:block">
                    {item.data.date}
                  </DataTable.Cell>

                  <DataTable.Cell className="hidden md:block">
                    <span className={`text-[10px] px-2 py-0.5 rounded border border-transparent ${statusColors[item.data.status]}`}>
                      {item.data.status}
                    </span>
                  </DataTable.Cell>

                  <DataTable.Cell align="right" className="font-mono font-medium text-gray-900 dark:text-white">
                    R$ {item.data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </DataTable.Cell>
                </DataTable.Row>

                {/* LINHA DE DETALHE (EXPANSÃO) */}
                {isExpanded && (
                  <div className="col-span-full p-4 bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-gray-800 text-sm animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Informações que foram ocultadas no mobile */}
                      <div className="md:hidden space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Data de Emissão</p>
                          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Calendar size={14} className="text-cyan-500" /> {item.data.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Status Atual</p>
                          <span className={`text-xs px-2 py-1 rounded inline-block ${statusColors[item.data.status]}`}>
                            {item.data.status}
                          </span>
                        </div>
                      </div>

                      {/* Detalhes Extras (Visível sempre que expandir) */}
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Descrição do Serviço</p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                          {item.data.details}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDetails(item.data); }}
                          className="mt-3 text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <FileText size={12} /> Ver Fatura Original
                        </button>
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

export default TabTableCollapse;