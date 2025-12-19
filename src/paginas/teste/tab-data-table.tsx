import React from 'react';
import Alert from '../../componentes/alert';
import { DataTable } from '../../componentes/data-table';
import { showModal } from '../../componentes/modal';
import Switch from '../../componentes/switch';
import { toast } from '../../componentes/toast';
import useList from '../../hooks/list';
import useForm from '../../hooks/use-form';
import { useVirtualizer } from '../../hooks/virtualize';
import { Trash2, Save, AlertCircle, Search, Database } from 'lucide-react';

// --- MOCK DATA ---
const generateUsers = (qtd: number) => Array.from({ length: qtd }, (_, i) => ({
  id: i + 1,
  name: `Funcionário ${i + 1}`,
  email: `func.${i + 1}@empresa.com`,
  role: i % 3 === 0 ? 'Admin' : 'User',
  active: i % 5 !== 0 // Alguns inativos
}));

const DataTableExample = () => {
  // 1. DADOS (Memória - 1000 itens)
  const { items, remove } = useList(generateUsers(1000));
  const [searchTerm, setSearchTerm] = React.useState('');

  // 2. LÓGICA DE FILTRO
  // Filtra a lista visual antes de passar para o virtualizador.
  // Isso permite buscar em tempo real sem perder a performance.
  const filteredItems = React.useMemo(() => {
    if (!searchTerm) {
      return items;
    };

    const lowerTerm = searchTerm.toLowerCase();
    return items.filter(item => item.data.name.toLowerCase().includes(lowerTerm) || item.data.email.toLowerCase().includes(lowerTerm));
  }, [items, searchTerm]);

  // 4. VIRTUALIZAÇÃO (Integração Limpa)
  // O hook agora gerencia a ref internamente se não passarmos scrollRef
  // Nota: Usamos 'filteredItems' aqui para que o scroll e a altura correspondam à busca
  const { virtualItems, wrapperProps, containerProps } = useVirtualizer({ count: filteredItems.length, estimateSize: () => 57, overscan: 10 });

  // --- AÇÕES ---

  // Alterado para receber ID (string) em vez de index, pois o index muda com o filtro
  const handleDelete = (id: string, name: string) => {
    showModal({
      title: 'Excluir Registro',
      size: 'sm',
      content: <p className='text-gray-600 dark:text-gray-300'>Tem certeza que deseja remover <strong>{name}</strong>?</p>,
      actions: ({ onClose }: any) => {
        const handleClick = () => {
          remove(id); // Remove pelo ID estrutural
          toast.error(`Usuário ${name} removido.`);
          onClose();
        };

        return (<div className='flex justify-end gap-2'>
          <button onClick={onClose} className='px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors'>
            Cancelar
          </button>
          <button onClick={handleClick} className='px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors'>
            Excluir
          </button>
        </div>);
      }
    });
  };

  const onSubmit = (data: any) => {
    if (Math.random() > 0.8) {
      toast.warning('Erro de validação no servidor (Simulado). Tente novamente.');
      return;
    };

    showModal({
      title: 'Edição em Massa Salva',
      size: 'lg',
      content: () => {
        return (<div className='space-y-3'>
          <Alert variant='success' title='Operação Concluída'>
            Foram processados {items.length} registros com sucesso.
          </Alert>
          <div className='space-y-1'>
            <p className='text-xs text-gray-500 dark:text-gray-400 uppercase font-bold'>Amostra do Payload (Form Data):</p>
            <pre className='text-xs bg-gray-100 dark:bg-black p-4 rounded text-green-600 dark:text-green-400 overflow-auto max-h-60 border border-gray-200 dark:border-gray-800'>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>)
      }
    });
  };

  // 3. FORMULÁRIO (Edição em Massa)
  const { formProps } = useForm({ id: 'bulk-edit-form', onSubmit });

  return (<div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 h-[750px] flex flex-col transition-colors'>

    {/* Header da Página */}
    <div className='flex justify-between items-end mb-4 shrink-0 border-b border-gray-100 dark:border-gray-700 pb-4'>
      <div>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
          <Database className='text-cyan-600 dark:text-cyan-400' /> Gestão de Usuários
        </h2>
        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
          Tabela Virtualizada ({filteredItems.length} visíveis) com Edição Inline.
        </p>
      </div>
      <div className='flex gap-2'>
        <div className='relative'>
          <input
            placeholder='Filtrar por nome ou email...'
            className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded pl-8 p-1.5 text-sm text-gray-900 dark:text-white focus:border-cyan-500 outline-none transition-colors w-64'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-2.5 top-2 text-gray-400 w-4 h-4' />
        </div>
        <button
          type='submit'
          form='bulk-edit-form'
          className='flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded shadow-lg transition-transform active:scale-95 text-sm font-bold'
        >
          <Save size={16} /> Salvar Tudo
        </button>
      </div>
    </div>

    {/* Aviso de UX */}
    <div className='mb-4 shrink-0'>
      <Alert variant='info' icon={<AlertCircle size={18} />}>
        Esta tabela renderiza apenas os itens visíveis para performance. Os dados editados persistem no DOM/Memória durante o scroll.
      </Alert>
    </div>

    {/* A TABELA (Formulário Gigante) */}
    <form {...formProps} id='bulk-edit-form' className='flex-1 overflow-hidden flex flex-col'>

      <DataTable.Root columns='60px 1fr 1.5fr 100px 80px 50px' className='h-full'>

        <DataTable.Header>
          <DataTable.HeadCell>ID</DataTable.HeadCell>
          <DataTable.HeadCell>Nome Completo</DataTable.HeadCell>
          <DataTable.HeadCell>E-mail Corporativo</DataTable.HeadCell>
          <DataTable.HeadCell>Cargo</DataTable.HeadCell>
          <DataTable.HeadCell align='center'>Ativo</DataTable.HeadCell>
          <DataTable.HeadCell>Ações</DataTable.HeadCell>
        </DataTable.Header>

        {/* CORPO VIRTUALIZADO */}
        <DataTable.Body {...containerProps}>
          <div {...wrapperProps}>
            {virtualItems.map(virtualRow => {
              // Usa a lista FILTRADA para renderizar
              const item = filteredItems[virtualRow.index];
              const index = virtualRow.index;

              if (!item) return null;

              return (
                <DataTable.Row
                  key={item.id}
                  style={virtualRow.props.style}
                  className='absolute w-full top-0 left-0'
                >
                  <DataTable.Cell className='text-gray-400 font-mono text-xs'>
                    #{item.data.id}
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <input
                      name={`users[${index}].name`}
                      defaultValue={item.data.name}
                      className='w-full bg-transparent outline-none border-b border-transparent focus:border-cyan-500 text-gray-900 dark:text-white transition-colors text-sm py-1'
                    />
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <input
                      name={`users[${index}].email`}
                      defaultValue={item.data.email}
                      className='w-full bg-transparent outline-none text-gray-500 dark:text-gray-400 text-sm focus:text-gray-900 dark:focus:text-white border-b border-transparent focus:border-cyan-500 transition-colors py-1'
                    />
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600'>
                      {item.data.role}
                    </span>
                  </DataTable.Cell>

                  <DataTable.Cell className='flex justify-center'>
                    <Switch
                      name={`users[${index}].active`}
                      defaultValue={item.data.active}
                      size='sm'
                      className='mb-0'
                    />
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <button
                      type='button'
                      // Passa o ID estável para remoção, não o índice visual
                      onClick={() => handleDelete(item.id, item.data.name)}
                      className='p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors hover:bg-red-50 dark:hover:bg-red-900/20'
                      title='Excluir Linha'
                    >
                      <Trash2 size={16} />
                    </button>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </div>
        </DataTable.Body>
      </DataTable.Root>
    </form>
  </div>);
};

export default DataTableExample;