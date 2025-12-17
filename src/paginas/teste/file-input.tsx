import React from "react";
import { Image, Files, Paperclip, ShieldCheck, FolderOpen, HardDrive } from "lucide-react";
import { showModal } from "../../componentes/modal";
import Switch from "../../componentes/switch";
import useForm from "../../hooks/use-form";
import type { FormField } from "../../hooks/use-form/props";
import FileInput from "../../componentes/file-input";
import { validateFileField } from "../../utils/fileUtils";

const MOCK_SERVER_FILES = [
  { id: 10, name: "contrato_antigo.pdf", url: "#", size: 102400 },
  { id: 11, name: "especificacao_tecnica.docx", url: "#", size: 204800 }
];

const INITIAL_AVATAR = [
  { id: 1, name: "avatar-atual.png", url: "/img/avatar.png", size: 50000 }
];

const FileExample = () => {
  const [needsProof, setNeedsProof] = React.useState(false);

  const onSubmit = (data: any) => {
    const formatField = (val: any) => {
      if (!val) return "Vazio";
      if (val.isHybrid) {
        const novos = val.new ? Array.from(val.new).map((f: any) => f.name) : [];
        const mantidos = val.keep ? val.keep.map((f: any) => `ID:${f.id}`) : [];
        if (novos.length === 0 && mantidos.length === 0) return "Vazio (Removido)";
        return { estado: "Híbrido", novos, mantidos, total: val.totalCount };
      }
      if (val instanceof FileList || Array.isArray(val)) return `Nativo: ${val.length} arquivos`;
      return "Desconhecido";
    };

    const summary = {
      "1_nativo_bruto": formatField(data.native_file),
      "2_avatar_single": formatField(data.avatar),
      "3_galeria_multi": formatField(data.gallery),
      "4_edicao_mista": formatField(data.docs_edit),
      "5_condicional": formatField(data.proof)
    };

    showModal({
      title: "Inspeção do Payload",
      size: 'lg',
      content: (
        <div className="bg-gray-100 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-800">
          <pre className="text-xs text-green-600 dark:text-green-400 font-mono overflow-auto max-h-96">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </div>
      )
    });
  };

  const { formProps, handleSubmit, resetSection, setValidators } = useForm("file-full-test");

  React.useEffect(() => {
    setValidators({
      // Passa 'field' como terceiro argumento
      // CORREÇÃO: Converter null para undefined para satisfazer a interface
      validarNativo: (val: any, field: FormField | null) =>
        validateFileField(val, { required: true }, field) || undefined,
      validarAvatar: (val: any, field: FormField | null) =>
        validateFileField(val, { required: true }, field) || undefined,
      validarGaleria: (val: any, field: FormField | null) =>
        validateFileField(val, { minFiles: 2, maxFiles: 5 }, field) || undefined,
      validarEdicao: (val: any, field: FormField | null) =>
        validateFileField(val, { required: true }, field) || undefined,
      validarProva: (val: any, field: FormField | null, formValues: any) => {
        if (formValues.has_proof) return validateFileField(val, { required: true }, field) || undefined;
      }
    });
  }, [setValidators]);

  const handleLoadData = () => {
    resetSection("", null);
    alert("Dados resetados.");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto transition-colors">
      <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Paperclip className="text-cyan-600 dark:text-cyan-400" /> Laboratório de Arquivos
        </h2>
        <button type="button" onClick={handleLoadData} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded transition-colors">Resetar</button>
      </div>

      <form {...formProps} onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <section>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2"><HardDrive size={16} /> 1. Input Nativo</div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Arquivo Bruto (Required)</label>
            <input type="file" name="native_file" data-validation="validarNativo" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 dark:file:bg-cyan-900 dark:file:text-cyan-300" />
          </div>
        </section>
        <section>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2"><Image size={16} /> 2. Componente Rico (Single)</div>
          <FileInput name="avatar" label="Foto de Perfil (Required)" accept="image/*" maxSize={2 * 1024 * 1024} required defaultValue={INITIAL_AVATAR} data-validation="validarAvatar" />
        </section>
        <section>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2"><Files size={16} /> 3. Galeria (Múltiplos)</div>
          <FileInput name="gallery" multiple accept="image/*" maxSize={5 * 1024 * 1024} data-validation="validarGaleria" />
        </section>
        <section>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2"><FolderOpen size={16} /> 4. Edição (Misto)</div>
          <FileInput name="docs_edit" label="Documentação" multiple accept=".pdf, .docx" defaultValue={MOCK_SERVER_FILES} required data-validation="validarEdicao" />
        </section>
        <section>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2"><ShieldCheck size={16} /> 5. Cruzada</div>
          <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-lg border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center justify-between mb-4">
              <Switch name="has_proof" label="Exigir Comprovante" onChange={setNeedsProof} className="mb-0" />
            </div>
            <div className={`transition-all duration-300 ${needsProof ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <FileInput name="proof" accept=".pdf, .jpg" disabled={!needsProof} data-validation="validarProva" />
            </div>
          </div>
        </section>
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <button type="submit" className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg">Enviar Todos</button>
        </div>
      </form>
    </div>
  );
};
export default FileExample;