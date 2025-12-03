import React, { useState } from 'react';
import type { IModalOptions } from '../../componentes/modal/types';
import { CheckCircle, AlertTriangle, Trash2, Lock, User, Wand2, Settings, ChevronRight, Bell, Shield, CreditCard, MessageSquare, Star, LayoutTemplate, FileText, Layers } from 'lucide-react';

// =============================================================================
// 1. COMPONENTES DE UI REUTILIZÁVEIS (PEDAÇOS DO MODAL)
// =============================================================================

// --- Header Genérico com Ícone ---
interface ICustomTitleProps {
  titulo: string;
  icon?: React.ElementType;
}
const CustomTitle: React.FC<ICustomTitleProps> = ({ titulo, icon: Icon }) => (
  <div className="flex items-center gap-3 text-cyan-400">
    {Icon && <Icon className="w-6 h-6" />}
    <span className="text-xl font-bold uppercase tracking-widest">{titulo}</span>
  </div>
);

// --- Footer Genérico de Confirmação ---
interface IActionProps {
  onConfirm: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}
const ActionFooter: React.FC<IActionProps> = ({
  onConfirm, onClose, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive
}) => (
  <div className="flex justify-end gap-3 w-full">
    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
      {cancelText}
    </button>
    <button
      onClick={onConfirm}
      className={`px-6 py-2 text-sm text-white font-bold rounded shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-500'
        }`}
    >
      {isDestructive && <Trash2 size={16} />}
      {confirmText}
    </button>
  </div>
);

// =============================================================================
// 2. CONTEÚDOS DE FORMULÁRIOS COMPLEXOS
// =============================================================================

// --- CENÁRIO A: LOGIN FORM ---
const LoginFormContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Login realizado com sucesso!");
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
        <input type="email" required className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-cyan-500 outline-none" placeholder="user@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
        <input type="password" required className="w-full bg-gray-900 border border-gray-600 rounded p-2.5 text-white focus:border-cyan-500 outline-none" placeholder="••••••" />
      </div>
      <button disabled={loading} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold py-2.5 rounded transition-all flex justify-center items-center gap-2 mt-2">
        {loading ? "Autenticando..." : <><Lock size={16} /> Acessar Painel</>}
      </button>
    </form>
  );
};

// --- CENÁRIO B: WIZARD (PASSO A PASSO) ---
const WizardContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const steps = [
    { title: "Dados", icon: <User size={20} /> },
    { title: "Config", icon: <Settings size={20} /> },
    { title: "Fim", icon: <CheckCircle size={20} /> }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-8 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 z-0"></div>
        {steps.map((s, idx) => {
          const active = step >= idx + 1;
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2 bg-gray-800 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${active ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-500'}`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase ${active ? 'text-cyan-400' : 'text-gray-600'}`}>{s.title}</span>
            </div>
          );
        })}
      </div>

      <div className="grow py-2 min-h-[150px]">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-lg font-bold text-white">Identificação</h3>
            <input className="w-full bg-gray-900 p-3 rounded text-white border border-gray-600 focus:border-cyan-500 outline-none" placeholder="Nome Completo" />
            <input className="w-full bg-gray-900 p-3 rounded text-white border border-gray-600 focus:border-cyan-500 outline-none" placeholder="Cargo Atual" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-lg font-bold text-white">Preferências</h3>
            <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded cursor-pointer hover:bg-gray-700/50 border border-gray-700">
              <input type="checkbox" className="w-5 h-5 accent-cyan-500" defaultChecked />
              <span className="text-gray-300">Receber Newsletter</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded cursor-pointer hover:bg-gray-700/50 border border-gray-700">
              <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
              <span className="text-gray-300">Modo Escuro Automático</span>
            </label>
          </div>
        )}
        {step === 3 && (
          <div className="text-center py-4 animate-in zoom-in fade-in">
            <div className="inline-block p-4 bg-green-500/20 rounded-full text-green-400 mb-3">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-white">Tudo Pronto!</h3>
            <p className="text-gray-400 text-sm mt-2">Seus dados foram configurados corretamente.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-700">
        <button onClick={() => step > 1 ? setStep(step - 1) : onClose?.()} className="px-4 py-2 text-gray-400 hover:text-white">
          {step === 1 ? 'Cancelar' : 'Voltar'}
        </button>
        <button
          onClick={() => step < 3 ? setStep(step + 1) : (alert('Finalizado!'), onClose?.())}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold flex items-center gap-2 transition-transform active:scale-95"
        >
          {step === 3 ? 'Concluir' : <>Próximo <ChevronRight size={16} /></>}
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
      <div className="w-1/3 flex flex-col gap-1 border-r border-gray-700 pr-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm transition-all ${activeTab === tab.id ? 'bg-cyan-900/50 text-cyan-400 border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'profile' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">JD</div>
              <div><p className="font-bold text-white">John Doe</p><p className="text-xs text-gray-500">Admin</p></div>
            </div>
            <input defaultValue="John Doe" className="w-full bg-gray-900 rounded p-2 text-sm text-white border border-gray-600" />
            <textarea defaultValue="Bio..." className="w-full bg-gray-900 rounded p-2 text-sm text-white border border-gray-600 h-20" />
          </div>
        )}
        {activeTab === 'notif' && (
          <div className="space-y-2 animate-in fade-in">
            <h4 className="text-sm font-bold text-white mb-2">Canais de Comunicação</h4>
            {['Email', 'SMS', 'Push'].map(c => (
              <label key={c} className="flex justify-between items-center p-2 bg-gray-700/30 rounded border border-gray-700 cursor-pointer">
                <span className="text-sm text-gray-300">{c}</span>
                <input type="checkbox" defaultChecked className="accent-cyan-500" />
              </label>
            ))}
          </div>
        )}
        {activeTab === 'billing' && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-in fade-in">
            <Shield size={32} className="mb-2 opacity-30" />
            <p className="text-xs">Área segura. Nenhuma fatura pendente.</p>
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
    if (rating === 0) return alert("Selecione uma nota!");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Feedback enviado!");
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(star => (
          <button type="button" key={star} onClick={() => setRating(star)} className={`transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>
            <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
      <textarea className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-cyan-500 outline-none h-24 resize-none mb-4" placeholder="Conte-nos sua experiência..." />
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">Cancelar</button>
        <button type="submit" disabled={loading} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold rounded transition-colors">
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};

// --- CENÁRIO E: RELATÓRIO (FULL SCREEN) ---
const ReportContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-700 p-4 rounded border border-gray-600">
          <h4 className="text-gray-400 text-sm">Métrica {i}</h4>
          <p className="text-2xl font-bold text-white mt-1">{(Math.random() * 1000).toFixed(2)}</p>
        </div>
      ))}
    </div>
    <div className="bg-gray-900 p-4 rounded font-mono text-sm text-green-400 border border-gray-700">
      <p>{`> Iniciando análise de sistema...`}</p>
      <p>{`> Carregando módulos de dados... [OK]`}</p>
      <p>{`> Relatório gerado com sucesso.`}</p>
    </div>
    <p className="text-gray-300">Este relatório demonstra o uso de um modal em tela cheia (size="full") para visualização de dados densos.</p>
  </div>
);


// =============================================================================
// 3. O CONSUMO (DEMONSTRAÇÃO)
// =============================================================================

const ModalInjectionExample = ({ showModal }: { showModal: <H, C, A>(opts: IModalOptions<H, C, A>) => void }) => {

  const openSuccess = () => showModal({
    title: <div className="flex items-center gap-2 text-green-400"><CheckCircle size={24} /><span>Sucesso</span></div>,
    content: <div className="py-4 text-gray-300">Operação realizada com sucesso!</div>,
    size: 'sm',
    actions: <div className="flex justify-end"><button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">OK</button></div>
  });

  const openLogin = () => showModal({
    size: 'sm',
    title: CustomTitle,
    content: LoginFormContent,
    props: {
      title: { titulo: "Acesso Restrito", icon: Lock },
      content: {}
    }
  });

  const openWizard = () => showModal({
    size: 'lg',
    title: CustomTitle,
    content: WizardContent,
    props: {
      title: { titulo: "Setup da Conta", icon: Wand2 },
      content: {}
    }
  });

  const openSettings = () => showModal({
    size: 'xl',
    title: CustomTitle,
    content: SettingsContent,
    actions: ActionFooter,
    props: {
      title: { titulo: "Painel de Controle", icon: Settings },
      content: {},
      actions: {
        confirmText: "Salvar Alterações",
        onConfirm: () => alert("Configurações salvas!")
      }
    }
  });

  const openFeedback = () => showModal({
    size: 'sm',
    title: CustomTitle,
    content: FeedbackContent,
    props: {
      title: { titulo: "Avalie-nos", icon: MessageSquare },
      content: {}
    }
  });

  const openDestructive = () => showModal({
    title: CustomTitle,
    content: <div className="text-gray-300 py-4">Tem certeza que deseja excluir este registro permanentemente?</div>,
    actions: ActionFooter,
    props: {
      title: { titulo: "Excluir Item?", icon: AlertTriangle },
      actions: {
        isDestructive: true,
        confirmText: "Sim, Excluir",
        onConfirm: () => alert("Excluído!")
      }
    }
  });

  const openFull = () => showModal({
    title: "Relatório Completo",
    content: ReportContent,
    size: 'full',
    actions: ({ onClose }: any) => <button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded">Fechar</button>
  });

  const openStacked = () => showModal({
    title: "Nível 1",
    size: 'md',
    content: () => (
      <div className="flex flex-col gap-4 items-center py-8 text-gray-300">
        <p>Modal Inicial. Clique abaixo para navegar.</p>
        <button
          onClick={() => showModal({
            title: "Nível 2 (Alerta)",
            size: 'sm',
            content: <div className="text-red-400 font-bold py-4">Sessão Expirada!</div>
          })}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Layers size={16} /> Abrir Próximo Nível
        </button>
      </div>
    )
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <LayoutTemplate className="text-cyan-400 w-8 h-8" />
        <div>
          <h2 className="text-xl font-bold text-white">Galeria de Modais (Injeção)</h2>
          <p className="text-xs text-gray-400">Demonstração da flexibilidade de injeção de componentes tipados.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardButton title="Simples" desc="Alerta de Sucesso" onClick={openSuccess} icon={CheckCircle} color="green" />
        <CardButton title="Login Form" desc="State local e loading" onClick={openLogin} icon={User} color="cyan" />
        <CardButton title="Wizard Step" desc="Navegação interna" onClick={openWizard} icon={Wand2} color="purple" />
        <CardButton title="Settings Tabs" desc="Layout complexo" onClick={openSettings} icon={Settings} color="orange" />
        <CardButton title="Feedback" desc="Avaliação com estrelas" onClick={openFeedback} icon={Star} color="yellow" />
        <CardButton title="Confirmação" desc="Ação destrutiva" onClick={openDestructive} icon={Trash2} color="red" />
        <CardButton title="Full Screen" desc="Relatórios densos" onClick={openFull} icon={FileText} color="blue" />
        <CardButton title="Stacked" desc="Navegação entre modais" onClick={openStacked} icon={Layers} color="indigo" />
      </div>
    </div>
  );
};

// Helper de UI para os botões do grid
const CardButton = ({ title, desc, onClick, icon: Icon, color }: any) => {
  const colorClasses: any = {
    green: "border-green-500/30 hover:border-green-500 text-green-400",
    cyan: "border-cyan-500/30 hover:border-cyan-500 text-cyan-400",
    purple: "border-purple-500/30 hover:border-purple-500 text-purple-400",
    orange: "border-orange-500/30 hover:border-orange-500 text-orange-400",
    yellow: "border-yellow-500/30 hover:border-yellow-500 text-yellow-400",
    red: "border-red-500/30 hover:border-red-500 text-red-400",
    blue: "border-blue-500/30 hover:border-blue-500 text-blue-400",
    indigo: "border-indigo-500/30 hover:border-indigo-500 text-indigo-400",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start p-4 bg-gray-900/50 rounded-lg border transition-all duration-200 hover:bg-gray-800 hover:shadow-lg group ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} />
        <span className="font-bold text-white">{title}</span>
      </div>
      <p className="text-xs text-gray-500 text-left">{desc}</p>
    </button>
  );
}

export default ModalInjectionExample;