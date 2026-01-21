import React from 'react';
import { Calendar, FileText, LayoutList } from 'lucide-react';

import Badge from '../../componentes/badge';
import Button from '../../componentes/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../componentes/card';
import { DataTable, type DataTableColumn } from '../../componentes/data-table';
import showModal from '../../componentes/modal/hook';

// --- MOCK DATA ---
const DATA = [
  {
    id: 'INV-001',
    client: 'Acme Corp',
    date: '2023-10-01',
    amount: 5000,
    status: 'Pago',
    details: 'Consultoria de Software - Q3. Entregáveis: Relatório de Arquitetura e Protótipo de Alta Fidelidade.',
    items: [
      { desc: 'Consultoria Técnica', qtd: 40, unit: 100 },
      { desc: 'Licença Software', qtd: 1, unit: 1000 },
    ],
  },
  {
    id: 'INV-002',
    client: 'Global Tech',
    date: '2023-10-05',
    amount: 12000,
    status: 'Pendente',
    details: 'Licença Anual Enterprise + Suporte Premium 24/7.',
    items: [{ desc: 'Plano Enterprise', qtd: 1, unit: 12000 }],
  },
  {
    id: 'INV-003',
    client: 'Local Coff',
    date: '2023-10-10',
    amount: 350,
    status: 'Pago',
    details: 'Catering Evento de Lançamento. Coffee Break para 50 pessoas.',
    items: [{ desc: 'Kit Café', qtd: 50, unit: 7 }],
  },
  {
    id: 'INV-004',
    client: 'Startup Inc',
    date: '2023-10-12',
    amount: 2500,
    status: 'Atrasado',
    details: 'Design System MVP. Criação de tokens e componentes base.',
    items: [{ desc: 'Design UI', qtd: 20, unit: 125 }],
  },
];

export const TabTableCollapse: React.FC = () => {
  const handleDetails = (data: any) => {
    showModal({
      title: `Detalhes da Fatura ${data.id}`,
      size: 'md',
      content: (
        <div className="space-y-4 py-2">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Cliente:</strong> {data.client}
            </p>
            <p>
              <strong>Data:</strong> {data.date}
            </p>
            <p className="mt-2">{data.details}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => alert('Download PDF iniciado...')}>
              <FileText size={16} className="mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      ),
      footer: ({ onClose }: any) => (
        <Button onClick={onClose} fullWidth>
          Fechar
        </Button>
      ),
    });
  };

  const columns: DataTableColumn<(typeof DATA)[0]>[] = [
    { accessorKey: 'id', header: 'Fatura', width: '100px', cell: (row) => <span className="font-mono text-xs">{row.id}</span> },
    { accessorKey: 'client', header: 'Cliente', sortable: true, cell: (row) => <span className="font-medium">{row.client}</span> },
    {
      accessorKey: 'date',
      header: 'Data',
      cell: (row) => (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={14} /> {row.date}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Valor',
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-medium">{row.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      align: 'center',
      width: '100px',
      cell: (row) => {
        const variants = { Pago: 'success', Pendente: 'warning', Atrasado: 'error' };
        return (
          <Badge variant={variants[row.status as keyof typeof variants] as any} size="sm">
            {row.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <LayoutList className="text-blue-600" /> Tabela Expansível
        </h2>
        <p className="text-gray-500 mt-2">
          Demonstração de linhas expansíveis usando a nova prop <code>renderSubComponent</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturas Recentes</CardTitle>
          <CardDescription>Clique na seta para ver os itens da fatura.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={DATA}
            columns={columns}
            searchable
            // PROP MÁGICA: Renderiza o conteúdo expandido
            renderSubComponent={(row) => (
              <div className="flex flex-col md:flex-row gap-6 p-2">
                {/* Detalhes do Lado Esquerdo */}
                <div className="flex-1 space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 border-b pb-1 mb-2">Descrição do Serviço</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{row.details}</p>
                  <Button variant="link" size="sm" className="p-0 h-auto text-blue-600" onClick={() => handleDetails(row)}>
                    Ver fatura original complet &rarr;
                  </Button>
                </div>

                {/* Tabela de Itens (Nested) Lado Direito */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500">
                      <tr>
                        <th className="px-3 py-2">Item</th>
                        <th className="px-3 py-2 text-right">Qtd</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {row.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">{item.desc}</td>
                          <td className="px-3 py-2 text-right">{item.qtd}</td>
                          <td className="px-3 py-2 text-right">
                            {(item.qtd * item.unit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50/50 font-bold">
                        <td className="px-3 py-2" colSpan={2}>
                          Total
                        </td>
                        <td className="px-3 py-2 text-right">
                          {row.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TabTableCollapse;
