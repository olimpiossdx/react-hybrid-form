// ==========================================
// 5. Página de Teste (Uso)
// ==========================================

import { useState } from 'react';
import { List, RotateCcw } from 'lucide-react';

import TransferList, { type TransferListItem } from '../../componentes/transferlist';

const TabTransferList: React.FC = () => {
  const [mockData] = useState<TransferListItem[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      key: `user-${i + 1}`,
      label: `Usuário ${i + 1} (${i % 2 === 0 ? 'Admin' : 'User'})`,
      disabled: i === 2,
    })),
  );

  const [formData, setFormData] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Enviado! IDs: ${JSON.stringify(formData)}`);
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors max-w-5xl mx-auto min-h-[600px] flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <List className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Transfer List v1.0
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Componente de seleção múltipla com suporte a drag & drop.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData([])}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RotateCcw size={14} /> Limpar
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TransferList
            name="users_list"
            label="Gerenciamento de Acessos"
            dataSource={mockData}
            value={formData}
            onChange={setFormData}
            titles={['Usuários Disponíveis', 'Usuários com Acesso']}
            required
          />

          <div className="flex justify-end pt-4 gap-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="px-6 py-2 text-sm font-bold text-white rounded-lg bg-green-600 hover:bg-green-700 shadow-md hover:shadow-green-500/20 transition-all active:scale-95">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TabTransferList;
