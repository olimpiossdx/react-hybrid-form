import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, Download, PieChart, Plus, RotateCcw, Trash2 } from 'lucide-react';

import showModal from '../../componentes/modal/hook';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';
import type { FormField } from '../../hooks/use-form/props';

// --- DEFINIÇÃO DE TIPOS ---
interface IDespesa {
  descricao: string;
  valor: number;
  data: string;
}

interface IProjetoForm {
  projeto: {
    nome: string;
    orcamento_total: number;
    data_inicio: string;
    despesas: IDespesa[];
  };
}

const EMPTY_PROJECT: IProjetoForm = {
  projeto: {
    nome: '',
    orcamento_total: 0,
    data_inicio: '',
    despesas: [],
  },
};

const BudgetProjectForm = () => {
  const onSubmit = (data: IProjetoForm) => {
    const despesas = data.projeto?.despesas || [];
    const total = Number(data.projeto?.orcamento_total || 0);
    const gasto = despesas.reduce((acc, item) => acc + Number(item.valor || 0), 0);

    showModal({
      title: 'Orçamento Aprovado',
      size: 'md',
      content: (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
            <div>
              <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Projeto</span>
              <strong className="text-gray-900 dark:text-white text-lg">{data.projeto.nome}</strong>
            </div>
            <div className="text-right">
              <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Balanço Final</span>
              <strong className={`text-xl ${total - gasto >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                R$ {(total - gasto).toFixed(2)}
              </strong>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 font-medium">Detalhes do Envio:</p>
            <pre className="text-xs bg-gray-100 dark:bg-black p-3 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 overflow-auto max-h-40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      ),
    });
  };

  const { formProps, setValidators, resetSection } = useForm<IProjetoForm>({
    id: 'budget-form',
    onSubmit,
  });

  const [formData, setFormData] = useState<IProjetoForm>(EMPTY_PROJECT);
  const [mode, setMode] = useState<'novo' | 'editando' | 'carregando'>('novo');

  // useList inicializado com os dados do state (Data-Driven)
  const { items, add, remove, replace, clear } = useList<IDespesa>(formData.projeto.despesas);

  // --- REGRAS DE VALIDAÇÃO ---
  useEffect(() => {
    setValidators({
      required: (val: any) => (!val ? { message: 'Obrigatório.', type: 'error' } : undefined),

      validarOrcamento: (val: number) => {
        if (Number(val) <= 0) {
          return { message: 'Deve ser positivo.', type: 'error' };
        }
      },

      // Validação Cruzada: Soma vs Total
      validarValorDespesa: (_: number, _field: FormField | null, formValues: IProjetoForm) => {
        const totalDisponivel = Number(formValues.projeto?.orcamento_total || 0);
        if (totalDisponivel === 0) {
          return { message: 'Defina o orçamento.', type: 'warning' };
        }

        const despesas = formValues.projeto?.despesas || [];
        // Soma incluindo o valor atual que está sendo digitado (já presente no formValues)
        const totalGasto = despesas.reduce((acc, item) => acc + Number(item.valor || 0), 0);

        if (totalGasto > totalDisponivel) {
          const excesso = totalGasto - totalDisponivel;
          return { message: `Estouro de R$ ${excesso}!`, type: 'error' };
        }
      },

      // Validação Cruzada: Datas
      validarDataDespesa: (val: string, _field: FormField | null, formValues: IProjetoForm) => {
        const inicioProjeto = formValues.projeto?.data_inicio;
        if (!inicioProjeto || !val) {
          return;
        }
        if (new Date(val) < new Date(inicioProjeto)) {
          return {
            message: `Anterior ao início (${inicioProjeto}).`,
            type: 'error',
          };
        }
      },
    });
  }, [setValidators]);

  const handleLoadData = async () => {
    setMode('carregando');
    try {
      const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const user = await userRes.json();
      const postsRes = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1');
      const posts = await postsRes.json();

      const apiData: IProjetoForm = {
        projeto: {
          nome: `Campanha ${user.company.name}`,
          orcamento_total: 15000,
          data_inicio: new Date().toISOString().split('T')[0],
          despesas: posts.slice(0, 4).map((post: any, i: number) => ({
            descricao: post.title.slice(0, 20) + '...',
            valor: (i + 1) * 1250,
            data: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          })),
        },
      };

      setFormData(apiData);
      setMode('editando');

      // Sincronia Estrutural
      replace(apiData.projeto.despesas);

      // Sincronia DOM
      setTimeout(() => resetSection('', apiData), 50);
    } catch (error) {
      alert('Erro ao carregar.');
      setMode('novo');
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_PROJECT);
    setMode('novo');
    clear(); // Limpa estrutura
    setTimeout(() => resetSection('', null), 50);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cyan-400 flex items-center gap-2">
            <PieChart size={24} />
            Gestão de Orçamento
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {mode === 'carregando' ? (
              <span className="text-yellow-500 animate-pulse">Buscando dados na API...</span>
            ) : (
              'Lista aninhada com validação matemática cruzada.'
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleLoadData}
            disabled={mode === 'carregando'}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Download size={14} /> Carregar JSONPlaceholder
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RotateCcw size={14} /> Novo
          </button>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <form {...formProps} className={mode === 'carregando' ? 'opacity-50 pointer-events-none' : ''} key={mode}>
        {/* PAI: CARD DO PROJETO */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">Dados do Projeto</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Nome do Projeto</label>
              <input
                name="projeto.nome"
                defaultValue={formData.projeto.nome}
                className="form-input"
                placeholder="Ex: Reforma Escritório"
                required
                data-validation="required"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Orçamento Total (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  type="number"
                  name="projeto.orcamento_total"
                  defaultValue={formData.projeto.orcamento_total || ''}
                  className="form-input pl-9 font-mono text-green-600 dark:text-green-400 font-bold"
                  placeholder="0.00"
                  required
                  data-validation="validarOrcamento"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Data Início</label>
              <div className="relative">
                <input
                  type="date"
                  name="projeto.data_inicio"
                  defaultValue={formData.projeto.data_inicio}
                  className="form-input"
                  required
                  data-validation="required"
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* FILHOS: LISTA DE DESPESAS */}
        <div>
          <div className="flex justify-between items-end mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              Despesas Previstas
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs normal-case">
                {items.length} itens
              </span>
            </h3>
            <button
              type="button"
              onClick={() => add()}
              className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-colors">
              <Plus size={14} /> Adicionar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col md:flex-row gap-4 items-start animate-in slide-in-from-bottom-2 fade-in">
                <div className="text-gray-400 dark:text-gray-600 font-mono text-xs pt-3 w-6 select-none">#{index + 1}</div>

                <div className="grow w-full">
                  <label className="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Descrição</label>
                  <input
                    name={`projeto.despesas[${index}].descricao`}
                    defaultValue={item.data.descricao}
                    className="form-input"
                    placeholder="Descrição do item..."
                    required
                    data-validation="required"
                  />
                </div>

                <div className="w-full md:w-32">
                  <label className="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    name={`projeto.despesas[${index}].valor`}
                    defaultValue={item.data.valor}
                    className="form-input font-mono text-right"
                    placeholder="0.00"
                    required
                    data-validation="validarValorDespesa"
                  />
                </div>

                <div className="w-full md:w-40">
                  <label className="block text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-1">Data Prevista</label>
                  <input
                    type="date"
                    name={`projeto.despesas[${index}].data`}
                    defaultValue={item.data.data}
                    className="form-input"
                    required
                    data-validation="validarDataDespesa"
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remover item">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-gray-400 dark:text-gray-500 text-sm">Nenhuma despesa lançada.</p>
                <button
                  type="button"
                  onClick={() => add()}
                  className="text-cyan-600 dark:text-cyan-400 text-xs font-bold mt-2 hover:underline">
                  Começar agora
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg hover:shadow-green-900/20 transition-all transform active:scale-95">
            Aprovar Orçamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetProjectForm;
