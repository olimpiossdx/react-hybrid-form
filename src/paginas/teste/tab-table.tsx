import { Edit2, FileText, Trash2 } from 'lucide-react';

import Badge from '../../componentes/badge';
import Button from '../../componentes/button';
import { Input } from '../../componentes/input';
import { TableBody, TableCaption, TableCell, TableContainer, TableFooter, TableHeader, TableRow } from '../../componentes/table';
import { Table, TableHead } from '../../componentes/table';

const invoices = [
  {
    invoice: 'INV001',
    status: 'Pago',
    statusVariant: 'success',
    method: 'Cartão de Crédito',
    amount: 'R$ 250,00',
  },
  {
    invoice: 'INV002',
    status: 'Pendente',
    statusVariant: 'warning',
    method: 'PIX',
    amount: 'R$ 150,00',
  },
  {
    invoice: 'INV003',
    status: 'Cancelado',
    statusVariant: 'error',
    method: 'Boleto',
    amount: 'R$ 350,00',
  },
  {
    invoice: 'INV004',
    status: 'Processando',
    statusVariant: 'info',
    method: 'Cartão de Crédito',
    amount: 'R$ 450,00',
  },
  {
    invoice: 'INV005',
    status: 'Pago',
    statusVariant: 'success',
    method: 'PIX',
    amount: 'R$ 550,00',
  },
];

export const TabTable = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Simple Table</h2>
        <p className="text-gray-500 mt-2">Componentes compostos para construção de tabelas semânticas e estilizadas.</p>
      </div>

      {/* --- EXEMPLO 1: TABELA PADRÃO --- */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Tabela Padrão (Card Style)</h3>

        <TableContainer>
          <Table>
            <TableCaption>Lista de faturas recentes.</TableCaption>

            {/* ESTRUTURA CORRETA E OBRIGATÓRIA: thead -> tr -> th */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Fatura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[100px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.statusVariant as any} size="sm">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.method}</TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="icon" title="Editar">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Detalhes">
                        <FileText size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right font-bold">R$ 1.750,00</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </section>

      {/* --- EXEMPLO 2: DENSIDADE COMPACTA --- */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Tabela Compacta (Editável)</h3>
        <p className="text-sm text-gray-500">
          Utilizando <code>density="sm"</code> e Inputs com <code>variant="ghost"</code>.
        </p>

        <TableContainer>
          <Table density="sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Produto</TableHead>
                <TableHead className="w-[100px]">Qtd</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="p-0">
                  <Input variant="ghost" size="sm" defaultValue="Teclado Mecânico" containerClassName="rounded-none" name={''} />
                </TableCell>
                <TableCell className="p-0">
                  <Input type="number" variant="ghost" size="sm" defaultValue={1} containerClassName="rounded-none" name={''} />
                </TableCell>
                <TableCell className="p-0">
                  <Input variant="ghost" size="sm" defaultValue="R$ 350,00" containerClassName="rounded-none" name={''} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="p-0">
                  <Input variant="ghost" size="sm" defaultValue="Mouse Gamer" containerClassName="rounded-none" name={''} />
                </TableCell>
                <TableCell className="p-0">
                  <Input type="number" variant="ghost" size="sm" defaultValue={2} containerClassName="rounded-none" name={''} />
                </TableCell>
                <TableCell className="p-0">
                  <Input variant="ghost" size="sm" defaultValue="R$ 120,00" containerClassName="rounded-none" name={''} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </div>
  );
};
