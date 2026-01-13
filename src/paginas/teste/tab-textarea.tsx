import React, { useState } from 'react';
import { AlertTriangle, MessageSquare, RotateCcw, Save, Type } from 'lucide-react';

import TextArea from '../../componentes/textarea';

const TabTextArea: React.FC = () => {
  // Estado simples apenas para exibir o valor no debug,
  // o controle do formulário é nativo no onSubmit.
  const [formData, setFormData] = useState({
    bio: '',
    feedback: '',
    notes: 'Anotações do sistema (Read Only).',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Se chegou aqui, a validação nativa (HTML5) passou
    alert(`Sucesso! Dados válidos:\n${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-gray-50 dark:bg-black min-h-screen transition-colors">
      <header className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Type className="text-blue-600" />
          TextArea
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Wrapper transparente com suporte a <strong>Validação Nativa</strong> e <strong>Auto-Resize</strong>.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* CASO 1: Auto-Resize + Required (Validação Nativa) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-green-500" />
              1. Auto-Resize (Obrigatório)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cresce automaticamente. Tente enviar vazio para ver o bloqueio nativo do navegador.
            </p>
            <TextArea
              label="Biografia / História"
              name="bio"
              placeholder="Digite um texto longo aqui para ver a caixa expandir..."
              value={formData.bio}
              onChange={handleChange}
              autoResize={true}
              required
              minLength={10}
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800"></div>

          {/* CASO 2: Padrão (Resize Manual) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Type size={16} className="text-purple-500" />
              2. Padrão (Manual)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Comportamento padrão (autoResize=false). Use o canto inferior direito para redimensionar.
            </p>
            <TextArea
              label="Feedback (Opcional)"
              name="feedback"
              placeholder="Arraste o canto para redimensionar..."
              value={formData.feedback}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800"></div>

          {/* CASO 3: ReadOnly / Disabled */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" />
              3. Estado ReadOnly
            </h3>
            <TextArea label="Notas do Sistema" name="notes" value={formData.notes} readOnly />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setFormData({ bio: '', feedback: '', notes: 'Anotações restauradas.' })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <RotateCcw size={16} /> Resetar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95">
              <Save size={16} /> Validar & Salvar
            </button>
          </div>
        </form>
      </div>

      {/* DEBUG */}
      <div className="p-4 bg-gray-900 text-gray-400 rounded-lg font-mono text-xs overflow-auto">
        <p className="mb-2 font-bold uppercase text-gray-500">Dados do State:</p>
        {JSON.stringify(formData, null, 2)}
      </div>
    </div>
  );
};

export default TabTextArea;
