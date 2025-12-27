import React from 'react';
import { Binary, CreditCard, FileText, User, Wallet } from 'lucide-react';

import showModal from '../../componentes/modal/hook';
import useForm from '../../hooks/use-form';
import useMask from '../../hooks/use-mask';
import { unmaskValue } from '../../utils/mask';

const MaskExample: React.FC = () => {
  // DX: formProps
  const { formProps, handleSubmit } = useForm('mask-gallery');

  // Masks
  const cpfMask = useMask('cpf');
  const cnpjMask = useMask('cnpj');
  const phoneMask = useMask('phone');
  const brlMask = useMask('currency');
  const usdMask = useMask('currency', {
    currencyOptions: { locale: 'en-US', currency: 'USD' },
  });
  const eurMask = useMask('currency', {
    currencyOptions: { locale: 'de-DE', currency: 'EUR' },
  });
  const cardMask = useMask('9999 9999 9999 9999');
  const dateMask = useMask('99/99');
  const cvvMask = useMask('999');
  const placaMask = useMask('aaa-9*99');

  const onSubmit = (data: any) => {
    const cleanData = {
      raw: data,
      cleaned: {
        valor_brl: Number(unmaskValue(data.valor_brl, 'currency')),
        valor_usd: Number(unmaskValue(data.valor_usd, 'currency')),
        cpf: unmaskValue(data.doc_cpf),
        cartao: unmaskValue(data.cc_num),
      },
    };

    showModal({
      title: 'Dados Processados',
      size: 'lg',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Valores brutos vs. higienizados (unmasked):</p>
          <pre className="text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 border border-gray-200 dark:border-gray-700 overflow-auto max-h-[60vh]">
            {JSON.stringify(cleanData, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto transition-colors">
      <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FileText className="text-cyan-600 dark:text-cyan-400" /> Galeria de Máscaras
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Validação de input masks utilizando <code>useMask</code> e engine <code>Intl</code>.
        </p>
      </div>

      <form {...formProps} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. FINANCEIRO */}
        <section className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase mb-4 flex items-center gap-2">
            <Wallet size={16} /> Financeiro (Sem Limites)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">Real (PT-BR)</label>
              <input
                name="valor_brl"
                className="form-input font-mono text-right text-green-700 dark:text-green-400 font-bold"
                placeholder="R$ 0,00"
                {...brlMask}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">Dólar (EN-US)</label>
              <input name="valor_usd" className="form-input font-mono text-right" placeholder="$ 0.00" {...usdMask} />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">Euro (DE-DE)</label>
              <input name="valor_eur" className="form-input font-mono text-right" placeholder="€ 0,00" {...eurMask} />
            </div>
          </div>
        </section>

        {/* 2. PAGAMENTO */}
        <section className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-4 flex items-center gap-2">
            <CreditCard size={16} /> Pagamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">Cartão</label>
              <input name="cc_num" className="form-input font-mono" placeholder="0000 0000 0000 0000" {...cardMask} />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">Validade</label>
              <input name="cc_exp" className="form-input text-center" placeholder="MM/AA" {...dateMask} />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">CVV</label>
              <input name="cc_cvv" type="password" className="form-input text-center" placeholder="123" {...cvvMask} />
            </div>
          </div>
        </section>

        {/* 3. CADASTRO */}
        <section className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase mb-4 flex items-center gap-2">
            <User size={16} /> Dados Cadastrais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">CPF</label>
              <input name="doc_cpf" className="form-input" placeholder="000.000.000-00" {...cpfMask} />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">CNPJ</label>
              <input name="doc_cnpj" className="form-input" placeholder="00.000.000/0000-00" {...cnpjMask} />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block">Celular</label>
              <input name="telefone" className="form-input" placeholder="(00) 90000-0000" {...phoneMask} />
            </div>
          </div>
        </section>

        {/* 4. CUSTOM */}
        <section className="p-5 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                <Binary size={12} /> Placa Mercosul
              </label>
              <input name="placa" className="form-input uppercase" placeholder="ABC-1D23" {...placaMask} />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95">
            Validar e Processar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaskExample;
