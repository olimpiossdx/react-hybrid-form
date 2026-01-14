import React, { useState } from 'react';
import { Code, Flag, Layers, LayoutGrid, List } from 'lucide-react';

import { Radio, RadioGroup } from '../../componentes/radio-group';

const TabRadioGroup: React.FC = () => {
  // Estado para Opção A (Nativa)
  const [nativeVal, setNativeVal] = useState('yes');

  // Estado para Opção B (Data Driven)
  const [plan, setPlan] = useState<string | number>('pro');

  // Estado para Opção C (Compound)
  const [layout, setLayout] = useState<string | number>('grid');

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-gray-50 dark:bg-black min-h-screen transition-colors">
      <header className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <List className="text-blue-600" />
          Radio Group - 3 Abordagens
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Demonstração das estratégias de implementação: Nativa, Dados e Composição.</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* --- OPÇÃO A: NATIVA (BASE) --- */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Code size={20} className="text-gray-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Opção A: Nativa</h2>
              <p className="text-xs text-gray-500">
                Uso direto de HTML <code>&lt;input type="radio"&gt;</code>. Estilo global via CSS.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="native_option"
                value="yes"
                checked={nativeVal === 'yes'}
                onChange={(e) => setNativeVal(e.target.value)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Sim, aceito (Nativo)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="native_option"
                value="no"
                checked={nativeVal === 'no'}
                onChange={(e) => setNativeVal(e.target.value)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Não, recuso (Nativo)</span>
            </label>
          </div>
        </section>

        {/* --- OPÇÃO B: ABSTRATA (DATA DRIVEN) --- */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <List size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Opção B: Data Driven</h2>
              <p className="text-xs text-gray-500">
                Passando prop <code>options</code>. Ideal para listas simples vindas de API.
              </p>
            </div>
          </div>

          <RadioGroup
            name="plano"
            label="Escolha o Plano"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            options={[
              { label: 'Free (Grátis)', value: 'free' },
              { label: 'Pro (R$ 29,90)', value: 'pro' },
              { label: 'Enterprise (Consultar)', value: 'enterprise', disabled: true },
            ]}
          />

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">Variação Horizontal:</p>
            <RadioGroup
              name="plano_h"
              direction="row"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              options={[
                { label: 'Mensal', value: 'free' },
                { label: 'Anual', value: 'pro' },
              ]}
              className="mt-2"
            />
          </div>
        </section>

        {/* --- OPÇÃO C: COMPOSTA (DX FOCO) --- */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Layers size={20} className="text-purple-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Opção C: Compound (Composição)</h2>
              <p className="text-xs text-gray-500">Filhos livres. Ideal para layouts complexos (Cards, Grids, Ícones).</p>
            </div>
          </div>

          <RadioGroup name="layout" label="Modo de Visualização" value={layout} onChange={(e) => setLayout(e.target.value)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Card 1 */}
              <div
                className={`
                border rounded-lg p-4 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50
                ${layout === 'list' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-gray-700'}
              `}>
                <Radio value="list">
                  <div className="flex items-center gap-2 font-semibold">
                    <List size={18} /> Lista
                  </div>
                </Radio>
                <p className="text-xs text-gray-500 mt-2 pl-7">Visualização padrão em linhas verticais compactas.</p>
              </div>

              {/* Card 2 */}
              <div
                className={`
                border rounded-lg p-4 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50
                ${layout === 'grid' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-gray-700'}
              `}>
                <Radio value="grid">
                  <div className="flex items-center gap-2 font-semibold">
                    <LayoutGrid size={18} /> Grid
                  </div>
                </Radio>
                <p className="text-xs text-gray-500 mt-2 pl-7">Cards organizados em colunas responsivas.</p>
              </div>

              {/* Card 3 */}
              <div
                className={`
                border rounded-lg p-4 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50
                ${layout === 'kanban' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-gray-700'}
              `}>
                <Radio value="kanban">
                  <div className="flex items-center gap-2 font-semibold">
                    <Flag size={18} /> Kanban
                  </div>
                </Radio>
                <p className="text-xs text-gray-500 mt-2 pl-7">Colunas de status para gestão de fluxo.</p>
              </div>
            </div>
          </RadioGroup>
        </section>
      </div>

      {/* Debug */}
      <div className="fixed bottom-8 right-8 bg-gray-900 text-white p-4 rounded-lg shadow-xl text-xs font-mono border border-gray-700">
        <p className="mb-2 font-bold text-gray-500 uppercase">Estado Atual:</p>
        <pre>{JSON.stringify({ nativeVal, plan, layout }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TabRadioGroup;
