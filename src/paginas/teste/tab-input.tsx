import React from 'react';
import { CheckSquare, CreditCard, Edit3, Globe, LayoutList, Lock, Mail, Monitor, Search, ShieldAlert, User } from 'lucide-react';

import Button from '../../componentes/button';
import Input from '../../componentes/input';
import { showModal } from '../../componentes/modal';
import useForm from '../../hooks/use-form';

const TabInputTypes: React.FC = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: 'Formulário Enviado',
      content: (
        <div className="p-4">
          <p className="mb-4 text-green-600 font-medium">Todos os campos estão válidos!</p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-auto max-h-60 text-gray-800 dark:text-gray-200">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps, setValidators } = useForm({
    id: 'all-types-form',
    onSubmit,
  });

  // Configuração das Validações Customizadas e Cruzadas
  React.useEffect(() => {
    setValidators({
      // Validação Customizada Simples
      validarUsuario: (val: string) => {
        if (val && val.length < 3) {
          return { message: 'Mínimo 3 letras.', type: 'error' };
        }
        if (val && !/^[a-z0-9]+$/i.test(val)) {
          return { message: 'Apenas letras e números.', type: 'error' };
        }
      },
      // Validação Cruzada (Depende de outro campo)
      validarConfirmacao: (val: string, _, model) => {
        if (val !== model.senha_complexa) {
          return { message: 'As senhas não conferem.', type: 'error' };
        }
      },
      // Validação de Formato (Simulação de CPF)
      validarCPF: (val: string) => {
        if (val && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val)) {
          return { message: 'Formato inválido (000.000.000-00)', type: 'error' };
        }
      },
    });
  }, [setValidators]); // Dependência crucial para validação cruzada reativa

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Design System: Inputs</h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Catálogo completo demonstrando variantes, tamanhos, floating labels e tipos de dados suportados pelo componente{' '}
          <code>&lt;Input /&gt;</code>.
        </p>
      </div>

      <form {...formProps} noValidate={false} className="space-y-10">
        {/* --- SEÇÃO 1: VALIDAÇÃO CRUZADA E CUSTOMIZADA --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
          <div className="mb-6 border-l-4 border-red-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ShieldAlert size={24} className="text-red-500" /> Validações Avançadas
            </h3>
            <p className="text-sm text-gray-500">
              Integração do Hook <code>use-form</code> com feedback visual nativo do Input.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="usuario_custom"
              label="Usuário (Custom)"
              placeholder="Ex: user123"
              variant="outlined"
              leftIcon={<User size={18} />}
              required
              // Conecta com a função 'validarUsuario' no useEffect
              data-validation="validarUsuario"
              title="Apenas letras e números, min 3 chars."
            />

            <Input
              name="cpf_simulado"
              label="CPF (Regex Custom)"
              placeholder="000.000.000-00"
              variant="outlined"
              leftIcon={<CreditCard size={18} />}
              required
              data-validation="validarCPF"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <Input
              name="senha_complexa"
              type="password"
              label="Senha Original"
              placeholder="Digite uma senha"
              variant="filled"
              leftIcon={<Lock size={18} />}
              required
              minLength={6}
            />

            <Input
              name="confirmar_senha"
              type="password"
              label="Confirmar Senha (Cruzada)"
              placeholder="Repita a senha"
              variant="filled"
              leftIcon={<Lock size={18} />}
              required
              // Conecta com 'validarConfirmacao' que compara com 'values.senha_complexa'
              data-validation="validarConfirmacao"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">* Tente digitar senhas diferentes para ver o erro de confirmação.</p>
        </section>

        {/* --- SEÇÃO 2: VARIANTES VISUAIS --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="mb-6 border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Edit3 size={24} className="text-blue-500" /> Variantes Visuais
            </h3>
            <p className="text-sm text-gray-500">Três estilos principais para diferentes contextos de UI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Outlined (Padrão)</span>
              <Input
                name="variant_outlined"
                label="Nome do Usuário"
                placeholder="Ex: jdoe"
                variant="outlined"
                leftIcon={<User size={18} />}
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filled</span>
              <Input
                name="variant_filled"
                label="Endereço de Email"
                placeholder="email@exemplo.com"
                variant="filled"
                leftIcon={<Mail size={18} />}
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ghost</span>
              <Input
                name="variant_ghost"
                label="Buscar..."
                placeholder="Digite para buscar"
                variant="ghost"
                leftIcon={<Search size={18} />}
              />
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 3: FLOATING LABELS (MATERIAL STYLE) --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="mb-6 border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Monitor size={24} className="text-purple-500" /> Floating Labels
            </h3>
            <p className="text-sm text-gray-500">Estilo Material Design onde o rótulo flutua ao focar, economizando espaço vertical.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Input name="floating_simple" label="Floating Label Simples" floatingLabel variant="outlined" />

            <Input name="floating_filled" label="Floating Filled" floatingLabel variant="filled" />

            <Input
              name="floating_icon"
              label="Com Ícone (Recuo Automático)"
              floatingLabel
              leftIcon={<Globe size={18} />}
              variant="outlined"
            />

            <Input
              name="floating_password"
              type="password"
              label="Senha Flutuante"
              floatingLabel
              leftIcon={<Lock size={18} />}
              variant="outlined"
            />
          </div>
        </section>

        {/* --- SEÇÃO 4: DENSIDADE E TAMANHOS --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="mb-6 border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <LayoutList size={24} className="text-green-500" /> Tamanhos e Densidade
            </h3>
            <p className="text-sm text-gray-500">Controle de altura e padding para diferentes necessidades de informação.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-bold text-gray-400">Small (sm)</div>
              <div className="flex-1">
                <Input name="size_sm" size="sm" placeholder="Input Compacto (32px)" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-bold text-gray-400">Medium (md)</div>
              <div className="flex-1">
                <Input name="size_md" size="md" placeholder="Input Padrão (40px)" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-bold text-gray-400">Large (lg)</div>
              <div className="flex-1">
                <Input name="size_lg" size="lg" placeholder="Input Expandido (48px)" leftIcon={<Search size={20} />} />
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO 5: APLICAÇÃO EM TABELAS (GHOST + COMPACT) --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="mb-6 border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <LayoutList size={24} className="text-orange-500" /> Caso de Uso: Tabela Editável
            </h3>
            <p className="text-sm text-gray-500">
              Combinação de <code>variant="ghost"</code> e <code>size="sm"</code> para edição inline limpa.
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3 w-32">Qtd</th>
                  <th className="px-4 py-3 w-40">Preço (R$)</th>
                  <th className="px-4 py-3 w-48">Código</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr>
                  <td className="p-0">
                    <Input name="prod_1" variant="ghost" size="sm" placeholder="Nome do produto" containerClassName="rounded-none" />
                  </td>
                  <td className="p-0">
                    <Input name="qtd_1" type="number" variant="ghost" size="sm" placeholder="0" containerClassName="rounded-none" />
                  </td>
                  <td className="p-0">
                    <Input
                      name="price_1"
                      variant="ghost"
                      size="sm"
                      leftIcon={<span className="text-xs">R$</span>}
                      placeholder="0.00"
                      containerClassName="rounded-none"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      name="code_1"
                      variant="ghost"
                      size="sm"
                      placeholder="COD-000"
                      className="font-mono text-xs uppercase"
                      containerClassName="rounded-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-0">
                    <Input
                      name="prod_2"
                      variant="ghost"
                      size="sm"
                      placeholder="Nome do produto"
                      containerClassName="rounded-none"
                      defaultValue="Teclado Mecânico"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      name="qtd_2"
                      type="number"
                      variant="ghost"
                      size="sm"
                      placeholder="0"
                      containerClassName="rounded-none"
                      defaultValue={1}
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      name="price_2"
                      variant="ghost"
                      size="sm"
                      leftIcon={<span className="text-xs">R$</span>}
                      placeholder="0.00"
                      containerClassName="rounded-none"
                      defaultValue="350.00"
                    />
                  </td>
                  <td className="p-0">
                    <Input
                      name="code_2"
                      variant="ghost"
                      size="sm"
                      placeholder="COD-000"
                      className="font-mono text-xs uppercase"
                      containerClassName="rounded-none"
                      defaultValue="TEC-99"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* --- SEÇÃO 6: SELEÇÃO E OPÇÕES (CHECKBOX/RADIO) --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="mb-6 border-l-4 border-pink-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <CheckSquare size={24} className="text-pink-500" /> Seleção e Opções
            </h3>
            <p className="text-sm text-gray-500">Estilos unificados para inputs de seleção nativos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Checkbox */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Checkboxes</h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3 border border-gray-100 dark:border-gray-700">
                <Input
                  name="terms_v2"
                  id="terms_v2"
                  type="checkbox"
                  containerClassName="flex-row-reverse justify-end gap-3 items-center w-auto"
                  label="Aceito os termos e condições"
                  required
                />
                <Input
                  name="newsletter_v2"
                  id="newsletter_v2"
                  type="checkbox"
                  containerClassName="flex-row-reverse justify-end gap-3 items-center w-auto"
                  label="Receber novidades por email"
                />
              </div>
            </div>

            {/* Radio Button */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Radio Group</h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3 border border-gray-100 dark:border-gray-700">
                <Input
                  name="plan_v2"
                  id="plan_free_v2"
                  type="radio"
                  value="free"
                  containerClassName="flex-row-reverse justify-end gap-3 items-center w-auto"
                  label="Plano Gratuito"
                  required
                />
                <Input
                  name="plan_v2"
                  id="plan_pro_v2"
                  type="radio"
                  value="pro"
                  containerClassName="flex-row-reverse justify-end gap-3 items-center w-auto"
                  label="Plano Profissional"
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER DE AÇÃO --- */}
        <div className="sticky bottom-6 mx-auto max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 border border-gray-200 dark:border-gray-700 rounded-full shadow-2xl flex justify-between items-center gap-4 z-50">
          <span className="text-xs text-gray-500 ml-4 hidden sm:inline">Preencha os campos obrigatórios para testar a validação</span>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={() => window.location.reload()} className="flex-1 sm:flex-none rounded-full">
              Limpar
            </Button>
            <Button type="submit" variant="primary" className="flex-1 sm:flex-none px-8 font-bold rounded-full">
              Validar Tudo
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default TabInputTypes;
