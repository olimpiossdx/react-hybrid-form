import { CheckCircle2, Clock, Info, Tag, XCircle } from 'lucide-react';

import Badge from '../../componentes/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../componentes/card';

const TabBadge = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <Tag className="text-blue-600" /> Componente Badge
        </h2>
        <p className="text-gray-500 mt-2">Etiquetas para status, categorias e indicadores visuais.</p>
      </div>

      {/* 1. VARIANTES SEMÂNTICAS (CORES) */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Variantes Semânticas</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* 2. ESTILOS VISUAIS (APPEARANCE) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Soft (Padrão)</CardTitle>
            <CardDescription>Fundo suave, ideal para UI moderna.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge appearance="soft" variant="success">
              Aprovado
            </Badge>
            <Badge appearance="soft" variant="error">
              Rejeitado
            </Badge>
            <Badge appearance="soft" variant="info">
              Novo
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solid</CardTitle>
            <CardDescription>Alto contraste para destaque.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge appearance="solid" variant="success">
              100%
            </Badge>
            <Badge appearance="solid" variant="error">
              Falha Crítica
            </Badge>
            <Badge appearance="solid" variant="warning">
              Atenção
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outline</CardTitle>
            <CardDescription>Discreto, apenas bordas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge appearance="outline" variant="default">
              Rascunho
            </Badge>
            <Badge appearance="outline" variant="info">
              Em Análise
            </Badge>
            <Badge appearance="outline" variant="success">
              Publicado
            </Badge>
          </CardContent>
        </Card>
      </section>

      {/* 3. TAMANHOS E FORMAS */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Tamanhos e Formas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase">Pill (Redondo)</h4>
            <div className="flex items-center gap-4">
              <Badge size="sm" shape="pill">
                Small
              </Badge>
              <Badge size="md" shape="pill">
                Medium (Default)
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase">Square (Quadrado)</h4>
            <div className="flex items-center gap-4">
              <Badge size="sm" shape="square" variant="info">
                v1.0.2
              </Badge>
              <Badge size="md" shape="square" variant="warning">
                BETA
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXEMPLOS REAIS (COM ÍCONES) */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Casos de Uso</h3>

        <div className="border rounded-lg overflow-hidden dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Pagamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 font-medium">#4291</td>
                <td className="px-6 py-4">
                  <Badge variant="success" size="sm" className="gap-1">
                    <CheckCircle2 size={12} /> Concluído
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="success" appearance="outline" size="sm">
                    Pago
                  </Badge>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">#4292</td>
                <td className="px-6 py-4">
                  <Badge variant="warning" size="sm" className="gap-1">
                    <Clock size={12} /> Processando
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="warning" appearance="outline" size="sm">
                    Pendente
                  </Badge>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">#4293</td>
                <td className="px-6 py-4">
                  <Badge variant="error" size="sm" className="gap-1">
                    <XCircle size={12} /> Cancelado
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="default" appearance="outline" size="sm">
                    Estornado
                  </Badge>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">#4294</td>
                <td className="px-6 py-4">
                  <Badge variant="info" size="sm" className="gap-1">
                    <Info size={12} /> Em Separação
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="success" appearance="outline" size="sm">
                    Pago
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default TabBadge;
