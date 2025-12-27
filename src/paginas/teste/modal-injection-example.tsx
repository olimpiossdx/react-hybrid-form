import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileText,
  Layers,
  LayoutTemplate,
  Lock,
  MessageSquare,
  Settings,
  Shield,
  Star,
  Trash2,
  User,
  Wand2,
} from 'lucide-react';

import type { IModalOptions } from '../../componentes/modal/types';

// =============================================================================
// 1. COMPONENTES DE UI REUTILIZÁVEIS (PEDAÇOS DO MODAL)
// =============================================================================

// Header Genérico
interface ICustomTitleProps {
  title: string;
  icon?: React.ElementType;
}
const CustomTitle: React.FC<ICustomTitleProps> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400">
    {Icon && <Icon className="w-6 h-6" />}
    <span className="text-xl font-bold uppercase tracking-widest">{title}</span>
  </div>
);

// Footer Genérico
interface IActionProps {
  onConfirm: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}
const ActionFooter: React.FC<IActionProps> = ({
  onConfirm,
  onClose,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive,
}) => (
  <div className="flex justify-end gap-3 w-full">
    <button
      onClick={onClose}
      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
      {cancelText}
    </button>
    <button
      onClick={onConfirm}
      className={`px-6 py-2 text-sm text-white font-bold rounded shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${
        isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'
      }`}>
      {isDestructive && <Trash2 size={16} />}
      {confirmText}
    </button>
  </div>
);

// =============================================================================
// 2. CONTEÚDOS DE FORMULÁRIOS COMPLEXOS
// =============================================================================

const LoginFormContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Login OK!');
      if (onClose) {
        onClose();
      }
    }, 1000);
  };
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">E-mail</label>
        <input type="email" required className="form-input" placeholder="user@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Senha</label>
        <input type="password" required className="form-input" placeholder="••••••" />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold py-2.5 rounded transition-all mt-2">
        {loading ? '...' : 'Acessar'}
      </button>
    </form>
  );
};

const WizardContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const steps = [
    { title: 'Dados', icon: <User size={20} /> },
    { title: 'Config', icon: <Settings size={20} /> },
    { title: 'Fim', icon: <CheckCircle size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-8 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
        {steps.map((s, idx) => {
          const active = step >= idx + 1;
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-gray-800 px-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${active ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'}`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grow py-2 min-h-[150px]">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Identificação</h3>
            <input className="form-input" placeholder="Nome Completo" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preferências</h3>
            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded cursor-pointer border border-gray-200 dark:border-gray-700">
              <input type="checkbox" className="w-5 h-5 accent-cyan-500" defaultChecked />
              <span className="text-gray-700 dark:text-gray-300">Newsletter</span>
            </label>
          </div>
        )}
        {step === 3 && (
          <div className="text-center py-4 animate-in zoom-in fade-in">
            <div className="inline-block p-4 bg-green-100 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400 mb-3">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tudo Pronto!</h3>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : onClose?.())}
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          {step === 1 ? 'Cancelar' : 'Voltar'}
        </button>
        <button
          onClick={() => (step < 3 ? setStep(step + 1) : (alert('Fim!'), onClose?.()))}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold flex items-center gap-2 transition-transform active:scale-95">
          {step === 3 ? (
            'Concluir'
          ) : (
            <>
              Próximo <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- CENÁRIO C: CONFIGURAÇÕES (TABS INTERNAS) ---
const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notif', label: 'Alertas', icon: Bell },
    { id: 'billing', label: 'Cobrança', icon: CreditCard },
  ];

  return (
    <div className="flex h-[300px] gap-6">
      <div className="w-1/3 flex flex-col gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm transition-all ${activeTab === tab.id ? 'bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 border-l-2 border-cyan-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'profile' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-gray-700 dark:text-white">
                JD
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <input defaultValue="John Doe" className="form-input" />
            <textarea defaultValue="Bio..." className="form-input h-20" />
          </div>
        )}
        {activeTab === 'notif' && (
          <div className="space-y-2 animate-in fade-in">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Canais de Comunicação</h4>
            {['Email', 'SMS', 'Push'].map((c) => (
              <label
                key={c}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded border border-gray-200 dark:border-gray-700 cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">{c}</span>
                <input type="checkbox" defaultChecked className="accent-cyan-500 w-4 h-4" />
              </label>
            ))}
          </div>
        )}
        {activeTab === 'billing' && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 animate-in fade-in">
            <Shield size={32} className="mb-2 opacity-30" />
            <p className="text-xs">Área segura.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- CENÁRIO D: FEEDBACK FORM (COM RATING) ---
const FeedbackContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      return alert('Selecione uma nota!');
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Feedback enviado!');
      if (onClose) {
        onClose();
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className={`transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>
            <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      <textarea className="form-input h-24 resize-none mb-4" placeholder="Conte-nos sua experiência..." />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors font-medium">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold rounded transition-colors">
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};

const ReportContent = () => (
  <div className="text-gray-600 dark:text-gray-300 space-y-4">
    <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Relatório Completo</h4>
    <p>Dados detalhados do sistema...</p>
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-center font-mono">
          Metric {i}
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// 3. ORQUESTRADOR DE EXEMPLOS
// =============================================================================

const ModalInjectionExample = ({ showModal }: { showModal: <H, C, A>(opts: IModalOptions<H, C, A>) => void }) => {
  // Handlers
  const openLogin = () =>
    showModal({
      size: 'sm',
      title: CustomTitle,
      content: LoginFormContent,
      props: { title: { title: 'Acesso Restrito', icon: Lock }, content: {} },
    });
  const openWizard = () =>
    showModal({
      size: 'lg',
      title: CustomTitle,
      content: WizardContent,
      props: { title: { title: 'Setup da Conta', icon: Wand2 }, content: {} },
    });
  const openSettings = () =>
    showModal({
      size: 'xl',
      title: CustomTitle,
      content: SettingsContent,
      actions: ActionFooter,
      props: {
        title: { title: 'Painel de Controle', icon: Settings },
        content: {},
        actions: {
          confirmText: 'Salvar Alterações',
          onConfirm: () => alert('Configurações salvas!'),
        },
      },
    });
  const openFeedback = () =>
    showModal({
      size: 'sm',
      title: CustomTitle,
      content: FeedbackContent,
      props: {
        title: { title: 'Avalie-nos', icon: MessageSquare },
        content: {},
      },
    });
  const openDestructive = () =>
    showModal({
      title: CustomTitle,
      content: <div className="text-gray-600 dark:text-gray-300 py-4">Tem certeza que deseja excluir este registro permanentemente?</div>,
      actions: ActionFooter,
      props: {
        title: { title: 'Excluir Item?', icon: AlertTriangle },
        actions: {
          isDestructive: true,
          confirmText: 'Sim, Excluir',
          onConfirm: () => alert('Excluído!'),
        },
      },
    });
  const openSuccess = () =>
    showModal({
      title: (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle size={24} />
          <span>Sucesso</span>
        </div>
      ),
      content: <div className="py-4 text-gray-600 dark:text-gray-300">Operação realizada com sucesso!</div>,
      size: 'sm',
      actions: (
        <div className="flex justify-end">
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded font-medium">
            OK
          </button>
        </div>
      ),
    });
  const openFull = () =>
    showModal({
      title: 'Relatório',
      content: ReportContent,
      size: 'full',
      actions: ({ onClose }: any) => (
        <button onClick={onClose} className="bg-cyan-600 text-white px-4 py-2 rounded">
          Fechar
        </button>
      ),
    });

  // Stacked Modal
  const openStacked = () =>
    showModal({
      title: 'Nível 1',
      size: 'md',
      content: () => (
        <div className="flex flex-col gap-4 items-center py-6">
          <button
            onClick={() =>
              showModal({
                title: 'Nível 2',
                size: 'sm',
                content: <div className="text-red-500 font-bold py-4">Erro Crítico!</div>,
              })
            }
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700 transition-colors">
            <Layers size={16} /> Abrir Próximo
          </button>
        </div>
      ),
    });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <LayoutTemplate className="text-cyan-600 dark:text-cyan-400 w-8 h-8" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Galeria de Modais</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Teste de injeção de componentes e temas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardButton title="Simples" desc="Alerta básico" onClick={openSuccess} icon={CheckCircle} color="green" />
        <CardButton title="Login Form" desc="State local" onClick={openLogin} icon={User} color="cyan" />
        <CardButton title="Wizard" desc="Multi-passos" onClick={openWizard} icon={Wand2} color="purple" />
        <CardButton title="Settings" desc="Tabs internas" onClick={openSettings} icon={Settings} color="orange" />
        <CardButton title="Feedback" desc="Com Rating" onClick={openFeedback} icon={Star} color="yellow" />
        <CardButton title="Perigo" desc="Confirmação" onClick={openDestructive} icon={Trash2} color="red" />
        <CardButton title="Full Screen" desc="Relatórios" onClick={openFull} icon={FileText} color="blue" />
        <CardButton title="Stacked" desc="Sobreposição" onClick={openStacked} icon={Layers} color="indigo" />
      </div>
    </div>
  );
};

// Helper de UI adaptado para Light/Dark
const CardButton = ({ title, desc, onClick, icon: Icon, color }: any) => {
  const colors: any = {
    green:
      'border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 hover:border-green-500',
    cyan: 'border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/10 hover:border-cyan-500',
    purple:
      'border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10 hover:border-purple-500',
    orange:
      'border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 hover:border-orange-500',
    yellow:
      'border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 hover:border-yellow-500',
    red: 'border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:border-red-500',
    blue: 'border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 hover:border-blue-500',
    indigo:
      'border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 hover:border-indigo-500',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start p-4 rounded-lg border transition-all duration-200 hover:shadow-md group ${colors[color] || colors.cyan}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} />
        <span className="font-bold">{title}</span>
      </div>
      <p className="text-xs opacity-70 text-left">{desc}</p>
    </button>
  );
};

export default ModalInjectionExample;
