import React from 'react';
import { DataTable } from '../../componentes/data-table';
import useList from '../../hooks/list';
import { ChevronDown, ChevronRight, Calendar, FileText } from 'lucide-react';
import { showModal } from '../../componentes/modal';


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
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDetails = (item: any) => {
    showModal({
      title: `Fatura ${item.id}`,
      size: 'sm',
      content: <div className="p-4 text-gray-600 dark:text-gray-300">{item.details}</div>
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

      {/* CONTAINER DE SCROLL */}
      <DataTable.Container>
        <DataTable.Root>

          {/* DEFINIÇÃO DE LARGURAS (Nativo) - Comentários removidos para evitar erro de hidratação */}
          <DataTable.ColGroup>
            <DataTable.Col style={{ width: '40px' }} />
            <DataTable.Col style={{ width: '100px' }} />
            <DataTable.Col />
            <DataTable.Col className="hidden md:table-column" style={{ width: '120px' }} />
            <DataTable.Col className="hidden md:table-column" style={{ width: '100px' }} />
            <DataTable.Col style={{ width: '120px' }} />
          </DataTable.ColGroup>

          <DataTable.Header>
            <DataTable.HeadCell></DataTable.HeadCell>
            <DataTable.HeadCell>ID</DataTable.HeadCell>
            <DataTable.HeadCell>Cliente</DataTable.HeadCell>
            <DataTable.HeadCell className="hidden md:table-cell">Data</DataTable.HeadCell>
            <DataTable.HeadCell className="hidden md:table-cell">Status</DataTable.HeadCell>
            <DataTable.HeadCell align="right">Valor</DataTable.HeadCell>
          </DataTable.Header>

          <DataTable.Body>
            {items.map(item => {
              const isExpanded = expandedRows.has(item.id);
              const statusColors: any = {
                'Pago': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
                'Pendente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
                'Atrasado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
              };

              return (
                <React.Fragment key={item.id}>
                  {/* LINHA PRINCIPAL */}
                  <DataTable.Row
                    className={`transition-all ${isExpanded ? 'bg-gray-50 dark:bg-gray-900/40' : ''}`}
                    onClick={() => toggleRow(item.id)}
                  >
                    <DataTable.Cell>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition-colors">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </DataTable.Cell>

                    <DataTable.Cell>
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{item.data.id}</span>
                    </DataTable.Cell>

                    <DataTable.Cell>
                      <span className="font-bold text-gray-900 dark:text-white">{item.data.client}</span>
                    </DataTable.Cell>

                    {/* Colunas ocultas no mobile */}
                    <DataTable.Cell className="hidden md:table-cell">
                      {item.data.date}
                    </DataTable.Cell>

                    <DataTable.Cell className="hidden md:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${statusColors[item.data.status]}`}>
                        {item.data.status}
                      </span>
                    </DataTable.Cell>

                    <DataTable.Cell align="right">
                      <span className="font-mono font-medium text-gray-900 dark:text-white">
                        R$ {item.data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </DataTable.Cell>
                  </DataTable.Row>

                  {/* LINHA DE DETALHE (EXPANSÃO) */}
                  {isExpanded && (
                    <DataTable.Row className="bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-50 dark:hover:bg-gray-900/20">
                      <DataTable.Cell colSpan={6} className="p-0">
                        <div className="p-4 pl-12 text-sm animate-in slide-in-from-top-2 fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Informações que foram ocultadas no mobile */}
                            <div className="md:hidden space-y-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Data de Emissão</p>
                                <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <Calendar size={14} className="text-cyan-500" /> {item.data.date}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Status Atual</p>
                                <span className={`text-xs px-2 py-1 rounded inline-block border ${statusColors[item.data.status]}`}>
                                  {item.data.status}
                                </span>
                              </div>
                            </div>

                            {/* Detalhes Extras */}
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Descrição do Serviço</p>
                              <div className="text-gray-700 dark:text-gray-300 leading-relaxed border-l-2 border-gray-300 dark:border-gray-600 pl-3 py-1">
                                {item.data.details}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDetails(item.data); }}
                                className="mt-3 text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                              >
                                <FileText size={12} /> Ver Fatura Original
                              </button>
                            </div>
                          </div>
                        </div>
                      </DataTable.Cell>
                    </DataTable.Row>
                  )}
                </React.Fragment>
              );
            })}
          </DataTable.Body>

          <DataTable.Footer>
            <DataTable.Row>
              <DataTable.Cell colSpan={3}>Total</DataTable.Cell>
              <DataTable.Cell className="hidden md:table-cell" colSpan={2}></DataTable.Cell>
              <DataTable.Cell align="right">
                R$ {items.reduce((acc, curr) => acc + curr.data.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable.Footer>

        </DataTable.Root>
      </DataTable.Container>
    </div>
  );
};

export default TabTableCollapse;