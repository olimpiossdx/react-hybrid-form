import React, { useEffect, useState } from 'react';
import showModal from '../../componentes/modal/hook';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';
import type { FormField } from '../../hooks/use-form/props';

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
        nome: "",
        orcamento_total: 0,
        data_inicio: "",
        despesas: [] 
    }
};

const BudgetProjectForm: React.FC = () => {
    const onSubmit = (data: IProjetoForm) => {
    const despesas = data.projeto?.despesas || [];
    const total = Number(data.projeto?.orcamento_total || 0);
    const gasto = despesas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
    
    showModal({
      title: "Orçamento Aprovado ✅",
      content: () => (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 bg-gray-900 p-3 rounded border border-gray-700">
             <div><span className="block text-gray-500 text-xs">Projeto</span><strong className="text-white">{data.projeto.nome}</strong></div>
             <div className="text-right"><span className="block text-gray-500 text-xs">Balanço</span><strong className={total - gasto >= 0 ? "text-green-400" : "text-red-400"}>R$ {(total - gasto).toFixed(2)}</strong></div>
          </div>
          <pre className="text-xs bg-black p-3 rounded text-gray-300 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )
    });
  };
  const { formProps, setValidators, resetSection } = useForm<IProjetoForm>({id:"budget-form", onSubmit});
  
  const [formData, setFormData] = useState<IProjetoForm>(EMPTY_PROJECT);
  
  const [mode, setMode] = useState<'novo' | 'editando' | 'carregando'>('novo');

  // Adicionado 'replace' e 'clear' para manipulação programática
  const { items, add, remove, replace, clear } = useList<IDespesa>(formData.projeto.despesas);

  useEffect(() => {
    setValidators({
      required: (val: any) => !val ? { message: "Obrigatório.", type: "error" } : undefined,
      validarOrcamento: (val: number) => Number(val) <= 0 ? { message: "Deve ser positivo.", type: "error" } : undefined,
      validarValorDespesa: (_: number, _field: FormField | null, formValues: IProjetoForm) => {
        const totalDisponivel = Number(formValues.projeto?.orcamento_total || 0);
        if (totalDisponivel === 0) return { message: "Defina o orçamento.", type: "warning" };
        const despesas = formValues.projeto?.despesas || [];
        const totalGasto = despesas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
        if (totalGasto > totalDisponivel) return { message: `Estouro de R$ ${totalGasto - totalDisponivel}!`, type: "error" };
      },
      validarDataDespesa: (val: string, _field: FormField | null, formValues: IProjetoForm) => {
        const inicioProjeto = formValues.projeto?.data_inicio;
        if (!inicioProjeto || !val) return;
        if (new Date(val) < new Date(inicioProjeto)) return { message: `Anterior ao início (${inicioProjeto}).`, type: "error" };
      }
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
                    data: new Date(Date.now() + (i * 86400000)).toISOString().split('T')[0]
                }))
            }
        };

        setFormData(apiData);
        setMode('editando');
        
        // CORREÇÃO CRÍTICA:
        // Atualiza explicitamente a lista do hook com os dados da API.
        // Isso força a recriação dos itens com os novos dados em 'item.data'.
        replace(apiData.projeto.despesas);

        // Aguarda a renderização dos novos inputs para preencher os campos simples
        setTimeout(() => resetSection("", apiData), 50);

    } catch (error) {
        alert("Erro ao carregar.");
        setMode('novo');
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_PROJECT);
    setMode('novo');
    
    // Limpa a lista
    clear();
    
    setTimeout(() => resetSection("", null), 50);
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
         <div>
            <h2 className="text-cyan-400 font-bold">Gestão de Orçamento</h2>
            {mode === 'carregando' && <span className="text-xs text-yellow-400 animate-pulse">Buscando dados...</span>}
         </div>
         <div className="flex gap-2">
            <button type="button" onClick={handleLoadData} disabled={mode === 'carregando'} className="px-3 py-1 text-sm bg-blue-900 text-blue-200 rounded border border-blue-700 hover:bg-blue-800 disabled:opacity-50">📥 Carregar JSONPlaceholder</button>
            <button type="button" onClick={handleReset} className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600">↺ Novo</button>
         </div>
      </div>

      {/* Mantemos key={mode} para garantir um reset visual completo do form,
          mas agora usamos replace() para garantir que a lista interna tenha os dados corretos
      */}
      <form {...formProps} noValidate className={mode === 'carregando' ? 'opacity-50 pointer-events-none' : ''} key={mode}>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">📁 Dados do Projeto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome</label>
                    <input name="projeto.nome" defaultValue={formData.projeto.nome} className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white outline-none" required data-validation="required" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Orçamento (R$)</label>
                    <input type="number" name="projeto.orcamento_total" defaultValue={formData.projeto.orcamento_total} className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-green-400 font-mono outline-none" required data-validation="validarOrcamento" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Início</label>
                    <input type="date" name="projeto.data_inicio" defaultValue={formData.projeto.data_inicio} className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-white outline-none" required data-validation="required" />
                </div>
            </div>
        </div>

        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2">💸 Despesas <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-400">{items.length}</span></h3>
                <button type="button" onClick={() => add()} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"><span>+</span> Adicionar</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.map((item, index) => (
                    <div key={item.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors flex flex-col md:flex-row gap-4 items-start animate-in slide-in-from-bottom-1">
                        <div className="text-gray-600 font-mono text-xs pt-3 w-6">#{index + 1}</div>
                        <div className="grow w-full">
                            <label className="block text-[10px] text-gray-500 uppercase mb-1">Descrição</label>
                            {/* Usa item.data para preencher defaultValue */}
                            <input name={`projeto.despesas.${index}.descricao`} defaultValue={item.data.descricao} className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-purple-500 outline-none" required data-validation="required" />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-[10px] text-gray-500 uppercase mb-1">Valor</label>
                            <input type="number" name={`projeto.despesas[${index}].valor`} defaultValue={item.data.valor} className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white font-mono focus:border-purple-500 outline-none" required data-validation="validarValorDespesa" />
                        </div>
                        <div className="w-full md:w-40">
                            <label className="block text-[10px] text-gray-500 uppercase mb-1">Data</label>
                            <input type="date" name={`projeto.despesas[${index}].data`} defaultValue={item.data.data} className="form-input w-full bg-gray-900 border-gray-600 rounded p-2 text-sm text-white focus:border-purple-500 outline-none" required data-validation="validarDataDespesa" />
                        </div>
                        <div className="pt-6"><button type="button" onClick={() => remove(index)} className="text-gray-500 hover:text-red-400 p-2">✕</button></div>
                    </div>
                ))}
                {items.length === 0 && <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg text-gray-500">Nenhuma despesa lançada.</div>}
            </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-700 mt-6">
            <button type="submit" className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg">Aprovar Orçamento</button>
        </div>
      </form>
    </div>
  );
};

export default BudgetProjectForm;