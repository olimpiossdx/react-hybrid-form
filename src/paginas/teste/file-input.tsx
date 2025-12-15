import React from "react";
import { Image, Files, Paperclip, ShieldCheck, FolderOpen } from "lucide-react";
import { showModal } from "../../componentes/modal";
import Switch from "../../componentes/switch";
import useForm from "../../hooks/use-form";
import type { FormField } from "../../hooks/use-form/props";
import { validateFileList } from "../../utils/fileUtils";
import FileInput from "../../componentes/file-input";

const FileExample: React.FC = () => {
  // --- CONSTANTES ESTÁVEIS (Evita Loop Infinito) ---
  const INITIAL_AVATAR = [
    { id: 1, name: "avatar-atual.png", url: "/img/avatar.png", size: 102400 },
  ];

  const INITIAL_DOCS = [
    { id: 10, name: "contrato_v1.pdf", url: "#", size: 102400 },
    { id: 11, name: "anexo_tecnico.docx", url: "#", size: 204800 },
  ];

  const [needsAttachment, setNeedsAttachment] = React.useState(false);

  const onSubmit = (data: any) => {
    const summary = {
      avatar: data.avatar ? `${data.avatar.length} arquivo(s)` : "Nenhum",
      gallery: data.gallery ? `${data.gallery.length} arquivo(s)` : "Nenhum",
      docs: data.docs ? `${data.docs.length} arquivo(s)` : "Nenhum",
      proof: data.proof ? `${data.proof.length} arquivo(s)` : "Nenhum",
    };

    showModal({
      title: "Uploads Prontos para Envio",
      size: "md",
      content: (
        <div className="space-y-4 text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            O formulário capturou os objetos <code>FileList</code> nativos do
            DOM.
          </p>
          <div className="bg-gray-100 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-800">
            <pre className="text-xs text-green-600 dark:text-green-400 font-mono">
              {JSON.stringify(summary, null, 2)}
            </pre>
          </div>
        </div>
      ),
    });
  };

  const { formProps, handleSubmit, resetSection, setValidators } =
    useForm("file-form");

  React.useEffect(() => {
    setValidators({
      // CORREÇÃO: O helper retorna string | null, mas o validador espera string | undefined.
      // Convertemos null para undefined com o operador || undefined.
      validarAvatar: (val: FileList) =>
        validateFileList(val, { required: true }) || undefined,
      validarGaleria: (val: FileList) =>
        validateFileList(val, {
          minFiles: 2,
          maxFiles: 5,
          maxTotalSize: 10 * 1024 * 1024,
        }) || undefined,

      validarProva: (val: FileList, _: FormField | null, formValues: any) => {
        if (formValues.has_proof && (!val || val.length === 0)) {
          return { message: "Anexo obrigatório.", type: "error" };
        }
        return undefined;
      },
    });
  }, [setValidators]);

  const handleLoadData = () => {
    resetSection("", null);
    alert("Dados resetados.");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto transition-colors">
      <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Paperclip className="text-cyan-600 dark:text-cyan-400" />
            Upload Híbrido
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerenciamento de arquivos nativo com interface rica e validação.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadData}
          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Resetar Exemplo
        </button>
      </div>

      <form
        {...formProps}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {/* 1. SINGLE (Avatar) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2">
            <Image size={16} className="text-blue-500" /> 1. Upload Simples
            (Avatar)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Seleção única com preview integrado.
              </p>
              <FileInput
                name="avatar"
                label="Foto de Perfil"
                accept="image/png, image/jpeg"
                maxSize={2 * 1024 * 1024}
                required
                // Agora podemos passar literal sem medo!
                initialFiles={INITIAL_AVATAR}
                data-validation="validarAvatar"
              />
            </div>
          </div>
        </section>

        {/* 2. MULTIPLE (Galeria) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2">
            <Files size={16} className="text-green-500" /> 2. Galeria
            (Múltiplos)
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Fotos do Projeto
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selecione entre 2 e 5 imagens.
              </p>
            </div>
            <FileInput
              name="gallery"
              multiple
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              data-validation="validarGaleria"
            />
          </div>
        </section>

        {/* 3. EDIÇÃO */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2">
            <FolderOpen size={16} className="text-yellow-500" /> 3. Edição
            (Arquivos Existentes)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Simula arquivos já existentes no servidor.
              </p>
              <FileInput
                name="docs"
                label="Documentação Técnica"
                multiple
                accept=".pdf, .docx"
                initialFiles={INITIAL_DOCS}
              />
            </div>
          </div>
        </section>

        {/* 4. CRUZADA */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm uppercase border-b border-gray-100 dark:border-gray-800 pb-2">
            <ShieldCheck size={16} className="text-purple-500" /> 4. Validação
            Cruzada
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-lg border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Comprovante
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Obrigatório se marcado.
                </p>
              </div>
              <Switch
                name="has_proof"
                label="Possui Comprovante?"
                onChange={(checked) => setNeedsAttachment(checked)}
                className="mb-0"
              />
            </div>

            <div
              className={`transition-all duration-300 ${needsAttachment ? "opacity-100 translate-y-0" : "opacity-50 grayscale pointer-events-none"}`}
            >
              <FileInput
                name="proof"
                accept=".pdf, .jpg, .png"
                disabled={!needsAttachment}
                data-validation="validarProva"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
          >
            Enviar Todos os Arquivos
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileExample;
