import React from 'react';

import TransferList, { type TransferListItem } from '../../componentes/transferlist';

const TabTransferList: React.FC = () => {
  const [mockData] = React.useState<TransferListItem[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      key: `user-${i + 1}`,
      label: `Usuário ${i + 1} (${i % 2 === 0 ? 'Admin' : 'User'})`,
      disabled: i === 2,
    })),
  );

  const [formData, setFormData] = React.useState<string[]>([]);

  const handleSubmit = (_: React.FormEvent) => {
    alert(`Enviado com sucesso!\nIDs Selecionados: ${JSON.stringify(formData)}`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen bg-gray-50 dark:bg-black transition-colors">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transfer List - Validação Nativa</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Tente enviar o formulário vazio. O tooltip "Preencha este campo" (ou similar) deverá aparecer na parte inferior do componente.
        </p>
      </header>

      <div className="p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TransferList
            name="users_list"
            label="Gerenciamento de Acessos"
            dataSource={mockData}
            value={formData}
            onChange={setFormData}
            titles={['Usuários Disponíveis', 'Usuários com Acesso']}
            required // Ativa a validação nativa
          />

          <div className="flex justify-end pt-4 gap-2 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setFormData([])}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors
                text-gray-600 dark:text-gray-300
                bg-gray-100 dark:bg-gray-800 
                hover:bg-gray-200 dark:hover:bg-gray-700
              ">
              Limpar Seleção
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-md 
                bg-blue-600 hover:bg-blue-700 
                dark:bg-blue-600 dark:hover:bg-blue-500
              ">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TabTransferList;
