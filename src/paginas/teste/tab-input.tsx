import { useEffect } from 'react';
import { Briefcase, Calendar, CheckSquare, Clock, CreditCard, Eye, Globe, Hash, Lock, Mail, Phone, Search, User } from 'lucide-react';

import Button from '../../componentes/button';
import { Input } from '../../componentes/input';
import { showModal } from '../../componentes/modal';
import useForm from '../../hooks/use-form';

const TabInputTypes = () => {
  const onSubmit = (data: any) => {
    showModal({
      title: 'Formulário Enviado',
      content: (
        <div className="p-4">
          <p className="mb-4 text-green-600 font-medium">Todos os campos estão válidos!</p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">{JSON.stringify(data, null, 2)}</pre>
        </div>
      ),
    });
  };

  const { formProps } = useForm({
    id: 'all-types-form',
    onSubmit,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 pb-20">
      <div className="text-center border-b pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Catálogo de Tipos de Input</h2>
        <p className="text-gray-500 mt-2">
          Demonstração do componente <code>&lt;Input /&gt;</code> lidando com diversos atributos HTML5 e validações nativas.
        </p>
      </div>

      <form {...formProps} noValidate={false} className="space-y-8">
        {/* SEÇÃO 1: TEXTO E IDENTIFICAÇÃO */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
            <User size={20} /> Campos de Texto Comuns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="username" label="Username (Simples)" placeholder="jdoe123" required />

            <Input
              name="fullname"
              label="Nome Completo (Com Ícone)"
              placeholder="John Doe"
              leftIcon={<User size={18} />}
              required
              minLength={3}
            />

            <Input
              name="email"
              type="email"
              label="E-mail (Validação de Tipo)"
              placeholder="nome@empresa.com"
              leftIcon={<Mail size={18} />}
              required
            />

            <Input
              name="password"
              type="password"
              label="Senha (Toggle Automático)"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              required
              minLength={6}
            />
          </div>
        </section>

        {/* SEÇÃO 2: NÚMEROS E MÁSCARAS NATIVAS */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600">
            <Hash size={20} /> Números e Padrões
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              name="age"
              label="Idade (Number)"
              type="number"
              min={18}
              max={120}
              placeholder="18+"
              required
              title="A idade deve ser entre 18 e 120"
            />

            <Input
              name="price"
              label="Preço (Step 0.01)"
              type="number"
              step="0.01"
              leftIcon={<span className="text-xs font-bold">R$</span>}
              placeholder="0.00"
            />

            <Input
              name="zipcode"
              label="CEP (Pattern RegEx)"
              placeholder="12345-678"
              pattern="\d{5}-\d{3}"
              title="Formato: 12345-678"
              maxLength={9}
              rightIcon={<Search size={16} className="text-gray-400" />}
            />
          </div>
        </section>

        {/* SEÇÃO 3: DATA E HORA */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600">
            <Calendar size={20} /> Datas e Horários
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input name="birthdate" label="Data de Nascimento" type="date" required leftIcon={<Calendar size={18} />} />

            <Input name="appointment" label="Data e Hora Local" type="datetime-local" required />

            <Input name="meetingTime" label="Horário (Time)" type="time" leftIcon={<Clock size={18} />} />
          </div>
        </section>

        {/* SEÇÃO 4: TIPOS ESPECIAIS (WEB) */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-600">
            <Globe size={20} /> Tipos Web Especiais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="website"
              label="Website (URL)"
              type="url"
              placeholder="https://exemplo.com"
              pattern="https://.*"
              title="Deve começar com https://"
              leftIcon={<Globe size={18} />}
            />

            <Input name="phone" label="Telefone (Tel)" type="tel" placeholder="(xx) 9xxxx-xxxx" leftIcon={<Phone size={18} />} />

            <Input name="search" label="Busca (Search)" type="search" placeholder="Buscar..." rightIcon={<Search size={18} />} />

            <div className="flex gap-4">
              <Input
                name="color"
                label="Cor Favorita"
                type="color"
                className="h-10 p-1 w-full cursor-pointer"
                containerClassName="flex-1"
              />
              <Input name="range" label="Nível (Range)" type="range" min="0" max="10" className="mt-2" containerClassName="flex-1" />
            </div>
          </div>
        </section>

        {/* SEÇÃO 5: SELEÇÃO E OPÇÕES */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-600">
            <CheckSquare size={20} /> Seleção e Opções
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Checkbox */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Checkbox Simples</h4>
              <div className="flex items-center gap-4">
                <Input
                  name="terms"
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  containerClassName="w-auto flex-row-reverse gap-2 items-center"
                  label="Aceito os termos e condições"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <Input
                  name="newsletter"
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  containerClassName="w-auto flex-row-reverse gap-2 items-center"
                  label="Receber novidades por email"
                />
              </div>
            </div>

            {/* Radio Button */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Radio Group (Nativo)</h4>
              <div className="space-y-2">
                <Input
                  name="plan"
                  type="radio"
                  value="free"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  containerClassName="w-auto flex-row-reverse gap-2 items-center"
                  label="Plano Gratuito"
                  required
                />
                <Input
                  name="plan"
                  type="radio"
                  value="pro"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  containerClassName="w-auto flex-row-reverse gap-2 items-center"
                  label="Plano Pro"
                  required
                />
                <Input
                  name="plan"
                  type="radio"
                  value="enterprise"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  containerClassName="w-auto flex-row-reverse gap-2 items-center"
                  label="Plano Enterprise"
                  required
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Nota: Para checkboxes, o input usa a propriedade <code>containerClassName</code> com <code>flex-row-reverse</code> para
            posicionar o label à direita do input.
          </p>
        </section>

        {/* SEÇÃO 6: ESTADOS (DISABLED / READONLY) */}
        <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-500">
            <Lock size={20} /> Estados Especiais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="disabledInput"
              label="Desabilitado (Disabled)"
              placeholder="Não editável"
              disabled
              leftIcon={<Lock size={18} />}
              value="Valor Fixo"
            />

            <Input
              name="readonlyInput"
              label="Apenas Leitura (ReadOnly)"
              placeholder="Apenas leitura"
              readOnly
              value="ID: #839201"
              rightIcon={<CreditCard size={18} />}
            />
          </div>
        </section>

        <div className="sticky bottom-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-4 border rounded-lg shadow-lg flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Limpar
          </Button>
          <Button type="submit" variant="primary" className="px-8 font-bold">
            Validar Todos
          </Button>
        </div>
      </form>
    </div>
  );
};
export default TabInputTypes;
