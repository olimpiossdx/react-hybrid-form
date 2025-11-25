// --- NOVO CENÁRIO 5: Currículo Completo (com Edição Contextual e Submit Parcial) ---

import React from 'react';
import showModal from '../../../componentes/modal/hook';
import useList from '../../../hooks/list';
import useForm from '../../../hooks/use-form';
import type { IEscolaridade, IExperiencia, IConhecimento, ICurriculumFormValues } from './types';
import ActionButtons from './action-button';
import DadosAdicionais from './dados-adicionais';

const CurriculumForm = ({ }) => {

  // --- Dados Iniciais ---
  const [initialEscolaridade] = React.useState<IEscolaridade[]>([{ nivel: 'Ensino Técnico - Superior', curso: 'Engenharia de Computação', situacao: 'Completo' }]);

  const [initialExperiencias] = React.useState<IExperiencia[]>([
    { nomeEmpresa: 'Teste de empresa', cargo: 'Cargo de empresa', inicio: '2025-02', finalizacao: '2024-01', atual: false, atividades: 'Profissão de empresa', },
    { nomeEmpresa: 'Supermercados BH', cargo: 'Desenvolvedor', inicio: '2019-04', finalizacao: '', atual: true, atividades: 'Desenvolvendo soluções para o supermercado BH.' },
  ]);

  const [initialConhecimentos] = React.useState<IConhecimento[]>([{ nivel: 'Intermediário', descricao: 'asdasd' },]);



  const { handleSubmit, formId, getValue, resetSection } = useForm<ICurriculumFormValues>('curriculum-form');

  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Ref para snapshot
  const originalEditDataRef = React.useRef<any>(null);

  const { fields: escolaridadeFields, append: appendEscolaridade, remove: removeEscolaridade } = useList<IEscolaridade>(initialEscolaridade);
  const { fields: experienciaFields, append: appendExperiencia, remove: removeExperiencia } = useList<IExperiencia>(initialExperiencias);
  const { fields: conhecimentoFields, append: appendConhecimento, remove: removeConhecimento, } = useList<IConhecimento>(initialConhecimentos);

  const handleEdit = (id: string, prefix: string) => {
    originalEditDataRef.current = getValue(prefix);
    setEditingId(id);
  };

  const handleCancel = (_: string, prefix: string) => {
    resetSection(prefix, originalEditDataRef.current);
    originalEditDataRef.current = null;
    setEditingId(null);
  };

  const onSubmit = (data: ICurriculumFormValues) => {
    /* ... clone ... */
    const cleanData = { ...data };

    showModal({
      title: 'Seção Salva!',
      content: () => (
        <div>{`Dados do Formulário Inteiro: ${JSON.stringify(cleanData, null, 2)}`}</div>
      ),
      // Callback - adicionando função de execução ao final do modal
      onClose: () => console.log('Fechou!'),
    });
    console.log('body', cleanData);
    setEditingId(null);
    originalEditDataRef.current = null;
  };

  const isEditingAny = editingId !== null;

  return (
    <div className='bg-gray-800 p-6 rounded-lg shadow-xl'>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* --- SEÇÃO DADOS ADICIONAIS --- */}
        <DadosAdicionais editingId={editingId} handleCancel={handleCancel} handleEdit={handleEdit} />

        {/* --- SEÇÃO ESCOLARIDADES (LISTA) --- */}
        <fieldset
          className='mb-6 border rounded border-gray-700'
          disabled={isEditingAny && editingId !== 'escolaridades'}
        >
          <legend className='text-lg font-semibold text-cyan-400 px-2 w-full flex justify-between items-center'>
            Escolaridades
            <ActionButtons
              sectionId='escolaridades'
              prefix='escolaridades.'
              isEditingThis={editingId === 'escolaridades'}
              isOtherEditing={isEditingAny && editingId !== 'escolaridades'}
              onEdit={() => handleEdit('escolaridades', 'escolaridades.')}
              onCancel={() => handleCancel('escolaridades', 'escolaridades.')}
            //onSave={() => {}} // O submit faz o save
            />
          </legend>
          <div className='p-4 space-y-4'>
            {escolaridadeFields.map((field, index) => {
              const isEditingThisSection = editingId === 'escolaridades';
              return (
                <fieldset
                  key={field.id}
                  className={`p-3 border rounded relative border-gray-600`}
                >
                  {/* Botão de remover SÓ aparece no modo de edição da seção */}
                  {isEditingThisSection && (
                    <button
                      type='button'
                      onClick={() => removeEscolaridade(index)}
                      className={`absolute top-2 right-2 py-0.5 px-2 rounded text-xs bg-red-600 hover:bg-red-700 text-white`}
                      title='Remover'
                    >
                      X
                    </button>
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-1'>
                    <div>
                      <label className='block text-sm mb-1'>
                        Escolaridade *
                      </label>
                      <select
                        name={`escolaridades.${index}.nivel`}
                        className='form-input bg-gray-600'
                        required
                        defaultValue={field.value.nivel}
                        disabled={!isEditingThisSection}
                      >
                        <option>Ensino Médio</option>
                        <option>Ensino Técnico - Superior</option>
                        <option>Pós-graduação</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Curso *</label>
                      <input
                        name={`escolaridades.${index}.curso`}
                        className='form-input'
                        required
                        defaultValue={field.value.curso}
                        readOnly={!isEditingThisSection}
                      />
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Situação *</label>
                      <select
                        name={`escolaridades.${index}.situacao`}
                        className='form-input bg-gray-600'
                        required
                        defaultValue={field.value.situacao}
                        disabled={!isEditingThisSection}
                      >
                        <option>Completo</option>
                        <option>Cursando</option>
                        <option>Incompleto</option>
                      </select>
                    </div>
                  </div>
                </fieldset>
              );
            })}
            {/* Botão Adicionar SÓ é habilitado/visível quando a seção está em edição */}
            {editingId === 'escolaridades' && (
              <button
                type='button'
                onClick={() =>
                  appendEscolaridade({
                    nivel: 'Ensino Médio',
                    curso: '',
                    situacao: 'Cursando',
                  })
                }
                className={`text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded w-full`}
              >
                + Adicionar Escolaridade
              </button>
            )}
          </div>
        </fieldset>

        {/* --- SEÇÃO EXPERIÊNCIAS (LISTA) --- */}
        <fieldset
          className='mb-6 border rounded border-gray-700'
          disabled={isEditingAny && editingId !== 'experiencias'}
        >
          <legend className='text-lg font-semibold text-cyan-400 px-2 w-full flex justify-between items-center'>
            Experiências
            <ActionButtons
              sectionId='experiencias'
              prefix='experiencias.'
              isEditingThis={editingId === 'experiencias'}
              isOtherEditing={isEditingAny && editingId !== 'experiencias'}
              onEdit={() => handleEdit('experiencias', 'experiencias.')}
              onCancel={() => handleCancel('experiencias', 'experiencias.')}
            //onSave={() => {}} // O submit faz o save
            />
          </legend>
          <div className='p-4 space-y-4'>
            {experienciaFields.map((field, index) => {
              const isEditingThisSection = editingId === 'experiencias';
              return (
                <fieldset
                  key={field.id}
                  className={`p-3 border rounded relative border-gray-600`}
                >
                  {isEditingThisSection && (
                    <button
                      type='button'
                      onClick={() => removeExperiencia(index)}
                      className={`absolute top-2 right-2 py-0.5 px-2 rounded text-xs bg-red-600 hover:bg-red-700 text-white`}
                      title='Remover'
                    >
                      X
                    </button>
                  )}
                  <div className='space-y-2 mt-1'>
                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <label className='block text-sm mb-1'>
                          Nome Empresa *
                        </label>
                        <input
                          name={`experiencias.${index}.nomeEmpresa`}
                          className='form-input'
                          required
                          defaultValue={field.value.nomeEmpresa}
                          readOnly={!isEditingThisSection}
                        />
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>Cargo *</label>
                        <input
                          name={`experiencias.${index}.cargo`}
                          className='form-input'
                          required
                          defaultValue={field.value.cargo}
                          readOnly={!isEditingThisSection}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-3 gap-2 items-end'>
                      <div>
                        <label className='block text-sm mb-1'>Início *</label>
                        <input
                          name={`experiencias.${index}.inicio`}
                          type='month'
                          className='form-input'
                          required
                          defaultValue={
                            field.value.inicio
                              ? field.value.inicio.substring(0, 7)
                              : ''
                          }
                          readOnly={!isEditingThisSection}
                        />
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>
                          Finalização
                        </label>
                        <input
                          name={`experiencias.${index}.finalizacao`}
                          type='month'
                          className='form-input'
                          defaultValue={
                            field.value.finalizacao
                              ? field.value.finalizacao.substring(0, 7)
                              : ''
                          }
                          readOnly={!isEditingThisSection || field.value.atual}
                          disabled={field.value.atual || !isEditingThisSection}
                        />
                      </div>
                      <div className='flex items-center pb-2'>
                        <label>
                          <input
                            type='checkbox'
                            name={`experiencias.${index}.atual`}
                            defaultChecked={field.value.atual}
                            disabled={!isEditingThisSection}
                            className='mr-1'
                          />
                          Emprego Atual
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>
                        Atividades Exercidas
                      </label>
                      <textarea
                        name={`experiencias.${index}.atividades`}
                        className='form-input h-16 resize-none'
                        defaultValue={field.value.atividades}
                        readOnly={!isEditingThisSection}
                      ></textarea>
                    </div>
                  </div>
                </fieldset>
              );
            })}
            {editingId === 'experiencias' && (
              <button
                type='button'
                onClick={() =>
                  appendExperiencia({
                    nomeEmpresa: '',
                    cargo: '',
                    inicio: '',
                    finalizacao: '',
                    atual: false,
                    atividades: '',
                  })
                }
                className={`text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded w-full`}
              >
                + Adicionar Experiência
              </button>
            )}
          </div>
        </fieldset>

        {/* --- SEÇÃO CONHECIMENTOS (LISTA) --- */}
        <fieldset
          className='mb-6 border rounded border-gray-700'
          disabled={isEditingAny && editingId !== 'conhecimentos'}
        >
          <legend className='text-lg font-semibold text-cyan-400 px-2 w-full flex justify-between items-center'>
            Conhecimentos
            <ActionButtons
              sectionId='conhecimentos'
              prefix='conhecimentos.'
              isEditingThis={editingId === 'conhecimentos'}
              isOtherEditing={isEditingAny && editingId !== 'conhecimentos'}
              onEdit={() => handleEdit('conhecimentos', 'conhecimentos.')}
              onCancel={() => handleCancel('conhecimentos', 'conhecimentos.')}
            //onSave={() => {}} // O submit faz o save
            />
          </legend>
          <div className='p-4 space-y-4'>
            {conhecimentoFields.map((field, index) => {
              const isEditingThisSection = editingId === 'conhecimentos';
              return (
                <fieldset
                  key={field.id}
                  className={`p-3 border rounded relative border-gray-600`}
                >
                  {isEditingThisSection && (
                    <button
                      type='button'
                      onClick={() => removeConhecimento(index)}
                      className={`absolute top-2 right-2 py-0.5 px-2 rounded text-xs bg-red-600 hover:bg-red-700 text-white`}
                      title='Remover'
                    >
                      X
                    </button>
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-1'>
                    <div>
                      <label className='block text-sm mb-1'>Nível *</label>
                      <select
                        name={`conhecimentos.${index}.nivel`}
                        className='form-input bg-gray-600'
                        required
                        defaultValue={field.value.nivel}
                        disabled={!isEditingThisSection}
                      >
                        <option>Básico</option>
                        <option>Intermediário</option>
                        <option>Avançado</option>
                      </select>
                    </div>
                    <div className='md:col-span-2'>
                      <label className='block text-sm mb-1'>Descrição *</label>
                      <input
                        name={`conhecimentos.${index}.descricao`}
                        className='form-input'
                        required
                        defaultValue={field.value.descricao}
                        readOnly={!isEditingThisSection}
                      />
                    </div>
                  </div>
                </fieldset>
              );
            })}
            {editingId === 'conhecimentos' && (
              <button
                type='button'
                onClick={() =>
                  appendConhecimento({ nivel: 'Básico', descricao: '' })
                }
                className={`text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded w-full`}
              >
                + Adicionar Conhecimento
              </button>
            )}
          </div>
        </fieldset>

        {/* O submit geral agora está dentro dos botões 'Salvar Seção' */}
      </form>
    </div>
  );
};

export default CurriculumForm;
