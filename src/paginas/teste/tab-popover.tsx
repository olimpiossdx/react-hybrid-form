import React, { useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Copy,
  Filter,
  HelpCircle,
  LogIn,
  LogOut,
  MoreHorizontal,
  Palette,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';

import Button from '../../componentes/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../componentes/card';
import Input from '../../componentes/input';
import Popover from '../../componentes/popover';

// --- Wrapper Auxiliar para reduzir repetição de código ---
const PopoverDemo = ({
  trigger,
  content,
  fullWidth = false,
  className = '',
}: {
  trigger: (props: { isOpen: boolean }) => React.ReactNode;
  content: (props: { close: () => void }) => React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className="inline-block w-auto">
        {trigger({ isOpen })}
      </div>

      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} triggerRef={triggerRef} fullWidth={fullWidth} className={className}>
        {/* Passamos a função close para o conteúdo poder fechar o popover */}
        {content({ close: () => setIsOpen(false) })}
      </Popover>
    </>
  );
};

// Ícone Auxiliar
const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-8 h-8 ${className}`}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const TabPopover = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 pb-40">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <MessageSquareIcon className="text-purple-600" /> Componente Popover
        </h2>
        <p className="text-gray-500 mt-2">Janelas contextuais flutuantes, posicionadas automaticamente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 1. MENU DE AÇÕES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Menu de Ações</CardTitle>
            <CardDescription>Estilo Dropdown clássico.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <PopoverDemo
              trigger={() => (
                <Button variant="outline" size="icon">
                  <MoreHorizontal size={18} />
                </Button>
              )}
              content={({ close }) => (
                <div className="flex flex-col p-1 min-w-40">
                  <Button variant="ghost" size="sm" className="justify-start" onClick={close} leftIcon={<Copy size={14} />}>
                    Duplicar
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={close} leftIcon={<Settings size={14} />}>
                    Configurar
                  </Button>
                  <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={close}
                    leftIcon={<Trash2 size={14} />}>
                    Excluir
                  </Button>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 2. PROFILE CARD */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Profile Card</CardTitle>
            <CardDescription>Menu de usuário rico.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <PopoverDemo
              trigger={() => (
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full pr-4 transition-colors border">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">JS</div>
                  <span className="text-sm font-medium">João Silva</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              )}
              content={({ close }) => (
                <div className="w-64 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">JS</div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">João Silva</p>
                      <p className="text-xs text-gray-500">joao@exemplo.com</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" fullWidth className="justify-start">
                      Perfil
                    </Button>
                    <Button variant="ghost" size="sm" fullWidth className="justify-start">
                      Assinatura
                    </Button>
                  </div>
                  <div className="h-px bg-gray-100 dark:bg-gray-700 my-3" />
                  <Button variant="outline" size="sm" fullWidth leftIcon={<LogOut size={14} />} onClick={close}>
                    Sair da Conta
                  </Button>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 3. FILTROS RÁPIDOS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Filtros</CardTitle>
            <CardDescription>Mini formulário interno.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <PopoverDemo
              trigger={({ isOpen }) => (
                <Button variant={isOpen ? 'primary' : 'outline'} leftIcon={<Filter size={16} />}>
                  Filtrar Status
                </Button>
              )}
              content={({ close }) => (
                <div className="p-4 w-72 space-y-4">
                  <h4 className="font-medium text-sm text-gray-500 uppercase">Status do Pedido</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" /> <span>Em Aberto</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" /> <span>Processando</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" /> <span>Concluído</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button size="sm" variant="ghost" onClick={close}>
                      Limpar
                    </Button>
                    <Button size="sm" variant="primary" onClick={close}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 4. COLOR PICKER */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">4. Color Picker</CardTitle>
            <CardDescription>Grid layout dentro do popover.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <PopoverDemo
              trigger={() => (
                <Button variant="ghost" size="icon" className="bg-linear-to-br from-red-400 via-green-400 to-blue-500 text-white shadow-sm">
                  <Palette size={18} />
                </Button>
              )}
              content={({ close }) => (
                <div className="p-3 grid grid-cols-4 gap-2">
                  {[
                    'bg-red-500',
                    'bg-orange-500',
                    'bg-yellow-500',
                    'bg-green-500',
                    'bg-teal-500',
                    'bg-blue-500',
                    'bg-indigo-500',
                    'bg-purple-500',
                    'bg-pink-500',
                    'bg-rose-500',
                    'bg-gray-500',
                    'bg-black',
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform shadow-sm`}
                      onClick={close}
                    />
                  ))}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 5. NOTIFICAÇÕES (SCROLL) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">5. Scrollable</CardTitle>
            <CardDescription>Conteúdo longo com scroll.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <PopoverDemo
              trigger={() => (
                <div className="relative">
                  <Button variant="outline" size="icon">
                    <Bell size={18} />
                  </Button>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
              content={() => (
                <div className="w-80">
                  <div className="p-3 border-b dark:border-gray-700 font-bold text-sm bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
                    Notificações
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer transition-colors border-b last:border-0 border-gray-50 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-800 dark:text-white">Atualização do Sistema</p>
                        <p className="text-xs text-gray-500 truncate">A versão 2.{i}.0 foi lançada com melhorias...</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t dark:border-gray-700 text-center">
                    <Button variant="ghost" size="sm" fullWidth>
                      Marcar todas como lidas
                    </Button>
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 6. CONTEXT HELP */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">6. Help Tooltip</CardTitle>
            <CardDescription>Informação rica ao clique.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center gap-2 py-8">
            <span className="text-sm text-gray-600">Margem de Lucro</span>
            <PopoverDemo
              trigger={() => (
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                  <HelpCircle size={16} />
                </button>
              )}
              content={() => (
                <div className="w-64 p-4 text-sm">
                  <h5 className="font-bold text-gray-900 dark:text-white mb-2">Como é calculado?</h5>
                  <p className="text-gray-500 mb-2">A margem de lucro é calculada subtraindo o custo dos produtos da receita total.</p>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs text-blue-600">(Receita - Custo) / Receita</code>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 7. FULL WIDTH (COMBOBOX) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">7. Full Width</CardTitle>
            <CardDescription>Popover acompanha a largura do trigger.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center py-8 px-4">
            <PopoverDemo
              fullWidth
              trigger={({ isOpen }) => (
                <div className="relative w-full">
                  <Input name="cliente" placeholder="Selecione um cliente..." readOnly className="cursor-pointer" />
                  <ChevronDown
                    size={16}
                    className={`absolute right-3 top-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              )}
              content={({ close }) => (
                <div className="p-1">
                  <div className="relative mb-2 px-2 pt-2">
                    <Search size={14} className="absolute left-4 top-4 text-gray-400" />
                    <input
                      className="w-full pl-8 pr-2 py-1 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:outline-none"
                      placeholder="Buscar..."
                      autoFocus
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {['Apple Inc.', 'Microsoft', 'Google', 'Amazon', 'Facebook', 'Tesla'].map((opt) => (
                      <div
                        key={opt}
                        onClick={close}
                        className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm cursor-pointer rounded flex justify-between items-center group">
                        {opt}
                        <Check size={14} className="opacity-0 group-hover:opacity-100 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 8. DATA RÁPIDA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">8. Quick Dates</CardTitle>
            <CardDescription>Seleção rápida de períodos.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <PopoverDemo
              trigger={() => (
                <Button variant="outline" leftIcon={<Calendar size={16} />}>
                  Período
                </Button>
              )}
              content={({ close }) => (
                <div className="p-2 w-48 grid grid-cols-1 gap-1">
                  <Button variant="ghost" size="sm" className="justify-start font-normal" onClick={close}>
                    Hoje
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start font-normal" onClick={close}>
                    Ontem
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start font-normal" onClick={close}>
                    Esta Semana
                  </Button>
                  <div className="h-px bg-gray-100 my-1" />
                  <Button variant="ghost" size="sm" className="justify-start font-normal" onClick={close}>
                    Customizado...
                  </Button>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* 9. MINI LOGIN FORM */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">9. Mini Form</CardTitle>
            <CardDescription>Login rápido sem redirect.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <PopoverDemo
              trigger={() => (
                <Button variant="primary" leftIcon={<LogIn size={16} />}>
                  Acesso Restrito
                </Button>
              )}
              content={({ close }) => (
                <div className="p-4 w-72 space-y-3">
                  <h4 className="font-bold text-center">Credenciais Admin</h4>
                  <Input name="senha" placeholder="Senha Mestra" type="password" autoFocus />
                  <Button fullWidth size="sm" onClick={close}>
                    Confirmar
                  </Button>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabPopover;
