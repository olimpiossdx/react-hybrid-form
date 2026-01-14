import type React from 'react';
import { Ban, CheckCircle2, Database, Filter, Globe, LayoutList, MapPin } from 'lucide-react';

import Button from '../../componentes/button';
import showModal from '../../componentes/modal/hook';
import { Select, type SelectOption } from '../../componentes/select';
import useForm from '../../hooks/use-form';

const TabSelect: React.FC = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: 'Seleção Enviada',
      content: (
        <div className="p-4">
          <p className="mb-4 text-green-600 font-medium">Formulário válido!</p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-auto text-gray-800 dark:text-gray-200">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps } = useForm({
    id: 'select-demo-form',
    onSubmit,
  });

  // Exemplo de dados para a prop 'options'
  const planosOptions: SelectOption[] = [
    { label: 'Plano Gratuito', value: 'free' },
    { label: 'Plano Pro (R$ 29/mês)', value: 'pro' },
    { label: 'Plano Enterprise (Desabilitado)', value: 'enterprise', disabled: true },
  ];

  const paisesOptions: SelectOption[] = [
    { label: 'Brasil', value: 'br' },
    { label: 'Estados Unidos', value: 'us' },
    { label: 'Canadá', value: 'ca' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Componente Select</h2>
        <p className="text-gray-500 mt-2">Select nativo estilizado com suporte a variantes, data-driven options e estados.</p>
      </div>

      <form {...formProps} noValidate={false} className="space-y-10">
        {/* DATA DRIVEN OPTIONS */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600">
            <Database size={20} /> Data Driven (Prop Options)
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Renderização automática passando um array de objetos <code>options</code>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select name="plano_assinatura" label="Selecione um Plano" placeholder="Escolha..." options={planosOptions} required />

            <Select
              name="pais_origem"
              label="País de Origem"
              placeholder="Selecione..."
              options={paisesOptions}
              leftIcon={<Globe size={18} />}
              variant="filled"
            />
          </div>
        </section>

        {/* VARIANTES */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-600">
            <LayoutList size={20} /> Variantes Visuais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select name="variant_outlined" label="Outlined (Padrão)" variant="outlined">
              <option value="1">Opção A</option>
              <option value="2">Opção B</option>
            </Select>

            <Select name="variant_filled" label="Filled" variant="filled">
              <option value="1">Opção A</option>
              <option value="2">Opção B</option>
            </Select>

            <Select name="variant_ghost" label="Ghost (Busca)" variant="ghost" leftIcon={<Filter size={18} />}>
              <option value="" disabled selected>
                Filtrar por...
              </option>
              <option value="name">Nome</option>
              <option value="date">Data</option>
            </Select>
          </div>
        </section>

        {/* ESTADOS DISABLED */}
        <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-500">
            <Ban size={20} /> Estados Desabilitados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select name="disabled_select" label="Select Desabilitado" disabled leftIcon={<MapPin size={18} />}>
              <option value="">Não é possível selecionar</option>
            </Select>

            <Select name="disabled_floating" label="Floating Disabled" floatingLabel disabled variant="filled">
              <option value="">Não editável</option>
            </Select>
          </div>
        </section>

        {/* TABELA / COMPACTO */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-600">
            <LayoutList size={20} /> Uso em Tabelas (Ghost + Small)
          </h3>
          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Funcionário</th>
                  <th className="px-4 py-3 w-40">Status</th>
                  <th className="px-4 py-3 w-48">Departamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-2">João Silva</td>
                  <td className="p-0">
                    <Select
                      name="status_1"
                      variant="ghost"
                      sized="sm"
                      containerClassName="rounded-none"
                      options={[
                        { label: 'Ativo', value: 'active' },
                        { label: 'Inativo', value: 'inactive' },
                      ]}
                    />
                  </td>
                  <td className="p-0">
                    <Select name="dept_1" variant="ghost" sized="sm" containerClassName="rounded-none">
                      <option value="dev">Desenvolvimento</option>
                      <option value="hr">RH</option>
                    </Select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" className="px-8 font-bold rounded-full flex items-center justify-center">
            <CheckCircle2 size={18} className="mr-2" /> Validar Selects
          </Button>
        </div>
      </form>
    </div>
  );
};
export default TabSelect;
