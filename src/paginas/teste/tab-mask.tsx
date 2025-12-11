import React from 'react';

import { CreditCard, Wallet, User, FileText } from 'lucide-react';
import useForm from '../../hooks/use-form';
import useMask from '../../hooks/use-mask';
import { unmaskValue } from '../../utils/mask';
import showModal from '../../componentes/modal/hook';

const MaskExample: React.FC = () => {
  const { handleSubmit, formProps } = useForm("mask-gallery");

  // --- CONFIGURAÇÃO ---
  const cpfMask = useMask('cpf');
  const cnpjMask = useMask('cnpj');
  const phoneMask = useMask('phone');

  // Financeiro Livre (BigInt)
  const brlMask = useMask('currency');
  const usdMask = useMask('currency', { currencyOptions: { locale: 'en-US', currency: 'USD' } });
  const eurMask = useMask('currency', { currencyOptions: { locale: 'de-DE', currency: 'EUR' } });

  // Cartão
  const cardMask = useMask('9999 9999 9999 9999');
  const dateMask = useMask('99/99'); // Validade
  const cvvMask = useMask('999');

  const onSubmit = (data: any) => {
    // Limpeza manual para demonstração (O useForm poderia fazer isso automaticamente se configurado)
    const cleanData = {
      raw: data,
      cleaned: {
        valor_brl: Number(unmaskValue(data.valor_brl, 'currency')),
        valor_usd: Number(unmaskValue(data.valor_usd, 'currency')),
        cpf: unmaskValue(data.doc_cpf),
        cartao: unmaskValue(data.cc_num)
      }
    };

    showModal({
      title: "Dados Processados",
      content: () => (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs">Note como os valores monetários viraram floats válidos e os documentos strings limpas.</p>
          <pre className="text-xs bg-black p-4 rounded text-green-400 border border-gray-700 overflow-auto">
            {JSON.stringify(cleanData, null, 2)}
          </pre>
        </div>
      )
    });
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 max-w-5xl mx-auto">
      <div className="mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <FileText className="text-cyan-400" /> Máscaras Avançadas
        </h2>
        <p className="text-gray-400 text-sm">
          Inputs formatados em tempo real. Suporte a BigInt (Trilhões), Internacionalização e Padrões Dinâmicos.
        </p>
      </div>

      <form {...formProps} onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* 1. SEÇÃO FINANCEIRA (BIG DATA) */}
        <section className="bg-gray-900/30 p-5 rounded border border-gray-700">
          <h3 className="text-sm font-bold text-green-400 uppercase mb-4 flex items-center gap-2">
            <Wallet size={16} /> Financeiro (Sem Limites)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Real (PT-BR)</label>
              <input name="valor_brl" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white font-mono text-right focus:border-green-500 outline-none" placeholder="R$ 0,00" {...brlMask} />
              <p className="text-[10px] text-gray-500 mt-1">Tente digitar 18 dígitos...</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Dólar (EN-US)</label>
              <input name="valor_usd" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white font-mono text-right focus:border-green-500 outline-none" placeholder="$ 0.00" {...usdMask} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Euro (DE-DE)</label>
              <input name="valor_eur" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white font-mono text-right focus:border-green-500 outline-none" placeholder="€ 0,00" {...eurMask} />
            </div>
          </div>
        </section>

        {/* 2. CHECKOUT (CARTÃO) */}
        <section className="bg-gray-900/30 p-5 rounded border border-gray-700">
          <h3 className="text-sm font-bold text-purple-400 uppercase mb-4 flex items-center gap-2">
            <CreditCard size={16} /> Pagamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Número do Cartão</label>
              <input name="cc_num" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white focus:border-purple-500 outline-none font-mono" placeholder="0000 0000 0000 0000" {...cardMask} />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Validade</label>
              <input name="cc_exp" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white focus:border-purple-500 outline-none text-center" placeholder="MM/AA" {...dateMask} />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">CVV</label>
              <input name="cc_cvv" type="password" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white focus:border-purple-500 outline-none text-center" placeholder="123" {...cvvMask} />
            </div>
          </div>
        </section>

        {/* 3. CADASTRO (PADRÕES BR) */}
        <section className="bg-gray-900/30 p-5 rounded border border-gray-700">
          <h3 className="text-sm font-bold text-cyan-400 uppercase mb-4 flex items-center gap-2">
            <User size={16} /> Dados Cadastrais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">CPF</label>
              <input name="doc_cpf" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white focus:border-cyan-500 outline-none" placeholder="000.000.000-00" {...cpfMask} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">CNPJ</label>
              <input name="doc_cnpj" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white focus:border-cyan-500 outline-none" placeholder="00.000.000/0000-00" {...cnpjMask} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Celular</label>
              <input name="telefone" className="form-input w-full bg-gray-800 border-gray-600 rounded p-2.5 text-white focus:border-cyan-500 outline-none" placeholder="(00) 90000-0000" {...phoneMask} />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button type="submit" className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-lg transition-transform active:scale-95">
            Validar e Processar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaskExample;