import { AlertTriangle, AlignLeft, CheckCircle2, Edit3, FileText, MessageCircle, MessageSquare } from 'lucide-react';

import Button from '../../componentes/button';
import showModal from '../../componentes/modal/hook';
import Textarea from '../../componentes/textarea';
import useForm from '../../hooks/use-form';

const TabTextarea = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: 'Texto Enviado',
      content: (
        <div className="p-4">
          <p className="mb-4 text-green-600 font-medium">Validação bem sucedida!</p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-auto text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ),
    });
  };

  const { formProps } = useForm({
    id: 'textarea-demo-form',
    onSubmit,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Componente Textarea</h2>
        <p className="text-gray-500 mt-2">Campos de texto multilinha com suporte a variantes, contadores e auto-validação.</p>
      </div>

      <form {...formProps} noValidate={false} className="space-y-10">
        {/* --- SEÇÃO 1: CONTADORES E LIMITES --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600">
            <AlignLeft size={20} /> Contadores de Caracteres
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Use a prop <code>showCount</code> combinada com <code>maxLength</code> para feedback em tempo real.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Textarea
              name="bio_limitada"
              label="Biografia Curta (Max 140)"
              placeholder="Escreva sobre você..."
              maxLength={140}
              showCount
              rows={3}
              required
            />

            <Textarea
              name="obs_livre"
              label="Observações (Apenas Contador)"
              placeholder="Digite sem limite definido..."
              showCount
              variant="filled"
              rows={3}
            />
          </div>
        </section>

        {/* --- SEÇÃO 2: VARIANTES VISUAIS --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-600">
            <Edit3 size={20} /> Variantes Visuais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Textarea name="variant_outlined" label="Outlined (Padrão)" variant="outlined" placeholder="Borda completa..." rows={4} />

            <Textarea name="variant_filled" label="Filled" variant="filled" placeholder="Fundo preenchido..." rows={4} />

            <Textarea name="variant_ghost" label="Ghost" variant="ghost" placeholder="Sem bordas (Transparente)..." rows={4} />
          </div>
        </section>

        {/* --- SEÇÃO 3: FLOATING LABELS --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-600">
            <MessageSquare size={20} /> Floating Labels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Textarea
              name="floating_simple"
              label="Mensagem (Floating)"
              floatingLabel
              placeholder="Digite sua mensagem"
              leftIcon={<MessageCircle size={18} />}
              required
              rows={4}
            />

            <Textarea
              name="floating_filled"
              label="Descrição Detalhada"
              variant="filled"
              floatingLabel
              placeholder="" // Placeholder vazio para efeito limpo
              rightIcon={<FileText size={18} />}
              required
              rows={4}
            />
          </div>
        </section>

        {/* --- SEÇÃO 4: VALIDAÇÃO (REQUIRED / MINLENGTH) --- */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500">
            <AlertTriangle size={20} /> Validação Nativa
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Tente enviar vazio ou com menos de 20 caracteres para ver o <strong>Shake</strong>.
          </p>

          <Textarea
            name="feedback_cliente"
            label="Feedback do Cliente (Obrigatório, Min 20)"
            placeholder="Por favor, detalhe sua experiência..."
            required
            minLength={20}
            showCount
            variant="outlined"
            containerClassName="max-w-2xl"
            rows={5}
          />
        </section>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" className="px-8 font-bold rounded-full flex items-center justify-center">
            <CheckCircle2 size={18} className="mr-2" /> Validar Textos
          </Button>
        </div>
      </form>
    </div>
  );
};
export default TabTextarea;
