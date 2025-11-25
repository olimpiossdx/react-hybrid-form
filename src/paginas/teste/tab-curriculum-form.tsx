// --- NOVO CENÁRIO 5: Currículo Completo (com Edição Contextual e Submit Parcial) ---

import React from "react";
import showModal from "../../componentes/modal/hook";
import useList from "../../hooks/list";
import useForm from "../../hooks/use-form";

// --- Tipos para o Currículo ---
interface IEscolaridade {
  nivel: string;
  curso: string;
  situacao: string;
}
interface IExperiencia {
  nomeEmpresa: string;
  cargo: string;
  inicio: string;
  finalizacao: string;
  atual: boolean;
  atividades: string;
}
interface IConhecimento {
  nivel: string;
  descricao: string;
}
interface IDadosAdicionais {
  rg: string;
  orgaoEmissor: string;
  pis: string;
  filiacao1: string;
  filiacao2: string;
  nacionalidade: string;
  naturalidade: string;
  raca: string;
  tipoResidencia: string;
  parenteEmpresa: string;
  situacao: string;
  ultimaConsulta: string;
  retorno: string;
  exFuncionario: string;
  pcdFisico: boolean;
  pcdIntelectual: boolean;
  pcdVisual: boolean;
  pcdAuditivo: boolean;
  pcdOutra: boolean;
  pcdDetalhe: string;
  altura: string;
  tamanhoUniforme: string;
  tamanhoCalcado: string;
}
interface ICurriculumFormValues {
  dadosAdicionais?: IDadosAdicionais;
  escolaridades?: IEscolaridade[];
  experiencias?: IExperiencia[];
  conhecimentos?: IConhecimento[];
}

const CurriculumForm = ({ }) => {

  // --- Dados Iniciais ---
  const [initialEscolaridade] = React.useState<IEscolaridade[]>([
    {
      nivel: "Ensino Técnico - Superior",
      curso: "Engenharia de Computação",
      situacao: "Completo",
    },
  ]);
  const [initialExperiencias] = React.useState<IExperiencia[]>([
    {
      nomeEmpresa: "Teste de empresa",
      cargo: "Cargo de empresa",
      inicio: "2025-02",
      finalizacao: "2024-01",
      atual: false,
      atividades: "Profissão de empresa",
    },
    {
      nomeEmpresa: "Supermercados BH",
      cargo: "Desenvolvedor",
      inicio: "2019-04",
      finalizacao: "",
      atual: true,
      atividades: "Desenvolvendo soluções para o supermercado BH.",
    },
  ]);
  const [initialConhecimentos] = React.useState<IConhecimento[]>([
    { nivel: "Intermediário", descricao: "asdasd" },
  ]);
  const [initialDadosAdicionais] = React.useState<IDadosAdicionais>({
    rg: "mg 888888",
    orgaoEmissor: "ssp",
    pis: "123.12233.44-5",
    filiacao1: "MINHA MÃE",
    filiacao2: "MEU PAI",
    nacionalidade: "Brasileira",
    naturalidade: "BETIM - MG",
    raca: "Branca",
    tipoResidencia: "Própria",
    parenteEmpresa: "false",
    situacao: "Trabalhando",
    ultimaConsulta: "2025-10-13",
    retorno: "(13454) OLIMPIO...",
    exFuncionario: "false",
    pcdFisico: false,
    pcdIntelectual: false,
    pcdVisual: false,
    pcdAuditivo: false,
    pcdOutra: false,
    pcdDetalhe: "um teste",
    altura: "0,00",
    tamanhoUniforme: "Não",
    tamanhoCalcado: "0",
  });

  const { handleSubmit, formId, getValue, resetSection } =
    useForm<ICurriculumFormValues>("curriculum-form");

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const originalEditDataRef = React.useRef<any>(null); // Ref para snapshot

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
    const cleanData = { ...data /* ... limpeza ... */ };

    showModal({
      title: "Seção Salva!",
      content: () => (
        <div>{`Dados do Formulário Inteiro: ${JSON.stringify(cleanData, null, 2)}`}</div>
      ),
      onClose: () => console.log("Fechou!"), // Callback
    });

    setEditingId(null);
    originalEditDataRef.current = null;
  };

  const ActionButtons: React.FC<{
    sectionId: string;
    prefix: string;
    onCancel: () => void;
    onEdit: () => void;
    isOtherEditing: boolean;
    isEditingThis: boolean;
  }> = ({ onCancel, onEdit, isOtherEditing, isEditingThis }) => (
    <div className="flex justify-end gap-2 mt-2 shrink-0">
      {!isEditingThis && (
        <button
          type="button"
          onClick={onEdit}
          disabled={isOtherEditing}
          className={`py-1 px-3 rounded text-sm font-medium ${isOtherEditing
            ? "bg-gray-500 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          Editar
        </button>
      )}
      {isEditingThis && (
        <>
          <button
            type="button"
            onClick={onCancel}
            className="py-1 px-3 rounded text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-1 px-3 rounded text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
          >
            Salvar
          </button>
        </>
      )}
    </div>
  );

  const isEditingAny = editingId !== null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* --- SEÇÃO DADOS ADICIONAIS --- */}
        <fieldset
          className="mb-6 p-4 border rounded border-gray-700"
          disabled={isEditingAny && editingId !== "dadosAdicionais"}
        >
          <legend className="text-lg font-semibold text-cyan-400 px-2 flex justify-between items-center w-full">
            Dados Adicionais
            <ActionButtons
              sectionId="dadosAdicionais"
              prefix="dadosAdicionais."
              isEditingThis={editingId === "dadosAdicionais"}
              isOtherEditing={isEditingAny && editingId !== "dadosAdicionais"}
              onEdit={() => handleEdit("dadosAdicionais", "dadosAdicionais.")}
              onCancel={() =>
                handleCancel("dadosAdicionais", "dadosAdicionais.")
              }
            />
          </legend>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2`}
          >
            <div>
              <label className="block text-sm mb-1">RG</label>
              <input
                name="dadosAdicionais.rg"
                className="form-input"
                defaultValue={initialDadosAdicionais.rg}
                readOnly={editingId !== "dadosAdicionais"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Órgão Emissor</label>
              <input
                name="dadosAdicionais.orgaoEmissor"
                className="form-input"
                defaultValue={initialDadosAdicionais.orgaoEmissor}
                readOnly={editingId !== "dadosAdicionais"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">PIS</label>
              <input
                name="dadosAdicionais.pis"
                className="form-input"
                type="number"
                defaultValue={initialDadosAdicionais.pis}
                readOnly={editingId !== "dadosAdicionais"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Filiação 1</label>
              <input
                name="dadosAdicionais.filiacao1"
                className="form-input"
                defaultValue={initialDadosAdicionais.filiacao1}
                readOnly={editingId !== "dadosAdicionais"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Filiação 2</label>
              <input
                name="dadosAdicionais.filiacao2"
                className="form-input"
                defaultValue={initialDadosAdicionais.filiacao2}
                readOnly={editingId !== "dadosAdicionais"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Nacionalidade *</label>
              <input
                name="dadosAdicionais.nacionalidade"
                className="form-input"
                required
                defaultValue={initialDadosAdicionais.nacionalidade}
                readOnly={editingId !== "dadosAdicionais"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Naturalidade *</label>
              <input
                name="dadosAdicionais.naturalidade"
                className="form-input"
                required
                defaultValue={initialDadosAdicionais.naturalidade}
                readOnly={editingId !== "dadosAdicionais"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Raça *</label>
              <select
                name="dadosAdicionais.raca"
                className="form-input bg-gray-600"
                required
                defaultValue={initialDadosAdicionais.raca}
                disabled={editingId !== "dadosAdicionais"}
              >
                <option>Branca</option>
                <option>Parda</option>
                <option>Preta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Tipo Residência *</label>
              <select
                name="dadosAdicionais.tipoResidencia"
                className="form-input bg-gray-600"
                required
                defaultValue={initialDadosAdicionais.tipoResidencia}
                disabled={editingId !== "dadosAdicionais"}
              >
                <option>Própria</option>
                <option>Alugada</option>
              </select>
            </div>
            <div className="col-span-full">
              <label className="block text-sm mb-1">
                Possui parente na empresa?
              </label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="dadosAdicionais.parenteEmpresa"
                    value="true"
                    defaultChecked={
                      initialDadosAdicionais.parenteEmpresa === "true"
                    }
                    disabled={editingId !== "dadosAdicionais"}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="dadosAdicionais.parenteEmpresa"
                    value="false"
                    defaultChecked={
                      initialDadosAdicionais.parenteEmpresa === "false"
                    }
                    disabled={editingId !== "dadosAdicionais"}
                  />
                  Não
                </label>
              </div>
            </div>
            {/* ... (outros campos) ... */}
          </div>
        </fieldset>

        {/* --- SEÇÃO ESCOLARIDADES (LISTA) --- */}
        <fieldset
          className="mb-6 border rounded border-gray-700"
          disabled={isEditingAny && editingId !== "escolaridades"}
        >
          <legend className="text-lg font-semibold text-cyan-400 px-2 w-full flex justify-between items-center">
            Escolaridades
            <ActionButtons
              sectionId="escolaridades"
              prefix="escolaridades."
              isEditingThis={editingId === "escolaridades"}
              isOtherEditing={isEditingAny && editingId !== "escolaridades"}
              onEdit={() => handleEdit("escolaridades", "escolaridades.")}
              onCancel={() => handleCancel("escolaridades", "escolaridades.")}
            //onSave={() => {}} // O submit faz o save
            />
          </legend>
          <div className="p-4 space-y-4">
            {escolaridadeFields.map((field, index) => {
              const isEditingThisSection = editingId === "escolaridades";
              return (
                <fieldset
                  key={field.id}
                  className={`p-3 border rounded relative border-gray-600`}
                >
                  {/* Botão de remover SÓ aparece no modo de edição da seção */}
                  {isEditingThisSection && (
                    <button
                      type="button"
                      onClick={() => removeEscolaridade(index)}
                      className={`absolute top-2 right-2 py-0.5 px-2 rounded text-xs bg-red-600 hover:bg-red-700 text-white`}
                      title="Remover"
                    >
                      X
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                    <div>
                      <label className="block text-sm mb-1">
                        Escolaridade *
                      </label>
                      <select
                        name={`escolaridades.${index}.nivel`}
                        className="form-input bg-gray-600"
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
                      <label className="block text-sm mb-1">Curso *</label>
                      <input
                        name={`escolaridades.${index}.curso`}
                        className="form-input"
                        required
                        defaultValue={field.value.curso}
                        readOnly={!isEditingThisSection}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Situação *</label>
                      <select
                        name={`escolaridades.${index}.situacao`}
                        className="form-input bg-gray-600"
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
            {editingId === "escolaridades" && (
              <button
                type="button"
                onClick={() =>
                  appendEscolaridade({
                    nivel: "Ensino Médio",
                    curso: "",
                    situacao: "Cursando",
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
          className="mb-6 border rounded border-gray-700"
          disabled={isEditingAny && editingId !== "experiencias"}
        >
          <legend className="text-lg font-semibold text-cyan-400 px-2 w-full flex justify-between items-center">
            Experiências
            <ActionButtons
              sectionId="experiencias"
              prefix="experiencias."
              isEditingThis={editingId === "experiencias"}
              isOtherEditing={isEditingAny && editingId !== "experiencias"}
              onEdit={() => handleEdit("experiencias", "experiencias.")}
              onCancel={() => handleCancel("experiencias", "experiencias.")}
            //onSave={() => {}} // O submit faz o save
            />
          </legend>
          <div className="p-4 space-y-4">
            {experienciaFields.map((field, index) => {
              const isEditingThisSection = editingId === "experiencias";
              return (
                <fieldset
                  key={field.id}
                  className={`p-3 border rounded relative border-gray-600`}
                >
                  {isEditingThisSection && (
                    <button
                      type="button"
                      onClick={() => removeExperiencia(index)}
                      className={`absolute top-2 right-2 py-0.5 px-2 rounded text-xs bg-red-600 hover:bg-red-700 text-white`}
                      title="Remover"
                    >
                      X
                    </button>
                  )}
                  <div className="space-y-2 mt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm mb-1">
                          Nome Empresa *
                        </label>
                        <input
                          name={`experiencias.${index}.nomeEmpresa`}
                          className="form-input"
                          required
                          defaultValue={field.value.nomeEmpresa}
                          readOnly={!isEditingThisSection}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Cargo *</label>
                        <input
                          name={`experiencias.${index}.cargo`}
                          className="form-input"
                          required
                          defaultValue={field.value.cargo}
                          readOnly={!isEditingThisSection}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-end">
                      <div>
                        <label className="block text-sm mb-1">Início *</label>
                        <input
                          name={`experiencias.${index}.inicio`}
                          type="month"
                          className="form-input"
                          required
                          defaultValue={
                            field.value.inicio
                              ? field.value.inicio.substring(0, 7)
                              : ""
                          }
                          readOnly={!isEditingThisSection}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">
                          Finalização
                        </label>
                        <input
                          name={`experiencias.${index}.finalizacao`}
                          type="month"
                          className="form-input"
                          defaultValue={
                            field.value.finalizacao
                              ? field.value.finalizacao.substring(0, 7)
                              : ""
                          }
                          readOnly={!isEditingThisSection || field.value.atual}
                          disabled={field.value.atual || !isEditingThisSection}
                        />
                      </div>
                      <div className="flex items-center pb-2">
                        <label>
                          <input
                            type="checkbox"
                            name={`experiencias.${index}.atual`}
                            defaultChecked={field.value.atual}
                            disabled={!isEditingThisSection}
                            className="mr-1"
                          />
                          Emprego Atual
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Atividades Exercidas
                      </label>
                      <textarea
                        name={`experiencias.${index}.atividades`}
                        className="form-input h-16 resize-none"
                        defaultValue={field.value.atividades}
                        readOnly={!isEditingThisSection}
                      ></textarea>
                    </div>
                  </div>
                </fieldset>
              );
            })}
            {editingId === "experiencias" && (
              <button
                type="button"
                onClick={() =>
                  appendExperiencia({
                    nomeEmpresa: "",
                    cargo: "",
                    inicio: "",
                    finalizacao: "",
                    atual: false,
                    atividades: "",
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
          className="mb-6 border rounded border-gray-700"
          disabled={isEditingAny && editingId !== "conhecimentos"}
        >
          <legend className="text-lg font-semibold text-cyan-400 px-2 w-full flex justify-between items-center">
            Conhecimentos
            <ActionButtons
              sectionId="conhecimentos"
              prefix="conhecimentos."
              isEditingThis={editingId === "conhecimentos"}
              isOtherEditing={isEditingAny && editingId !== "conhecimentos"}
              onEdit={() => handleEdit("conhecimentos", "conhecimentos.")}
              onCancel={() => handleCancel("conhecimentos", "conhecimentos.")}
            //onSave={() => {}} // O submit faz o save
            />
          </legend>
          <div className="p-4 space-y-4">
            {conhecimentoFields.map((field, index) => {
              const isEditingThisSection = editingId === "conhecimentos";
              return (
                <fieldset
                  key={field.id}
                  className={`p-3 border rounded relative border-gray-600`}
                >
                  {isEditingThisSection && (
                    <button
                      type="button"
                      onClick={() => removeConhecimento(index)}
                      className={`absolute top-2 right-2 py-0.5 px-2 rounded text-xs bg-red-600 hover:bg-red-700 text-white`}
                      title="Remover"
                    >
                      X
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                    <div>
                      <label className="block text-sm mb-1">Nível *</label>
                      <select
                        name={`conhecimentos.${index}.nivel`}
                        className="form-input bg-gray-600"
                        required
                        defaultValue={field.value.nivel}
                        disabled={!isEditingThisSection}
                      >
                        <option>Básico</option>
                        <option>Intermediário</option>
                        <option>Avançado</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Descrição *</label>
                      <input
                        name={`conhecimentos.${index}.descricao`}
                        className="form-input"
                        required
                        defaultValue={field.value.descricao}
                        readOnly={!isEditingThisSection}
                      />
                    </div>
                  </div>
                </fieldset>
              );
            })}
            {editingId === "conhecimentos" && (
              <button
                type="button"
                onClick={() =>
                  appendConhecimento({ nivel: "Básico", descricao: "" })
                }
                className={`text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded w-full`}
              >
                + Adicionar Conhecimento
              </button>
            )}
          </div>
        </fieldset>

        {/* O submit geral agora está dentro dos botões "Salvar Seção" */}
      </form>
    </div>
  );
};

export default CurriculumForm;
