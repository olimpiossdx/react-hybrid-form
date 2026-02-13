import React, { useRef, useState } from 'react';

import Button from '../../componentes/button';
import { Card, CardContent } from '../../componentes/card';
import Form from '../../componentes/form';
import Input, { type IInputProps } from '../../componentes/input';
import { isEmail, pipe, required } from '../../utils/validate';

type UserForm = {
  name: string;
  email: string;
};

type ValidationMode = 'native' | 'helper' | 'both';

/**
 * Form em modo 100% nativo (como antes)
 */
const NativeFormPlayground: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Modo: native (apenas nativo)</h3>

      <Form<UserForm>
        id="user-form-native"
        initialValues={{ name: 'João', email: '' }}
        validationRules={{
          name: required('Nome obrigatório'),
          email: pipe(required('E-mail obrigatório'), isEmail()),
        }}
        validationMode="native"
        onSubmit={(values) => {
          console.log('[native] submit', values);
        }}>
        <Input name="name" placeholder="Nome" data-validation="name" required />
        <Input name="email" placeholder="E-mail" data-validation="email" type="email" required />
        <Button type="submit">Salvar (native)</Button>
      </Form>
    </div>
  );
};

/**
 * Form em modo helper: nada de texto no slot/balão nativo,
 * todas as mensagens vão para o helper-text (quando existir).
 */
const HelperFormPlayground: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Modo: helper (apenas helper-text)</h3>

      <Form<UserForm>
        id="user-form-helper"
        initialValues={{ name: 'Maria', email: '' }}
        validationRules={{
          name: required('Nome obrigatório'),
          email: pipe(required('E-mail obrigatório'), isEmail()),
        }}
        validationMode="helper"
        onSubmit={(values) => {
          console.log('[helper] submit', values);
        }}>
        {/* Este input NÃO tem helper, então em caso de erro só terá aria/css (sem texto) */}
        <Input name="name" placeholder="Nome (sem helper)" data-validation="name" required />

        {/* Este input tem helper-text, logo o erro aparecerá somente nele */}
        <Input name="email" placeholder="E-mail (com helper)" data-validation="email" type="email" required />

        <Button type="submit">Salvar (helper)</Button>
      </Form>
    </div>
  );
};

/**
 * Form em modo both: texto nativo + helper.
 * Aqui dá para usar o helper para explicar melhor a regra.
 */
const BothFormPlayground: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Modo: both (nativo + helper-text)</h3>

      <Form<UserForm>
        id="user-form-both"
        initialValues={{ name: '', email: '' }}
        validationRules={{
          name: required('Nome obrigatório'),
          email: pipe(required('E-mail obrigatório'), isEmail()),
        }}
        validationMode="both"
        onSubmit={(values) => {
          console.log('[both] submit', values);
        }}>
        <Input name="name" placeholder="Nome" data-validation="name" required />
        <Input name="email" placeholder="E-mail" data-validation="email" type="email" required />
        <Button type="submit">Salvar (both)</Button>
      </Form>
    </div>
  );
};

/**
 * Playground isolado do helper-text, para testar o ponteiro helperText manualmente.
 */
const InputHelperPlayground: React.FC = () => {
  const emailRef = useRef<IInputProps | null>(null);

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Input Helper Playground (manual)</h3>

      <Input name="email" placeholder="Digite seu e-mail" ref={emailRef} />

      <div className="flex gap-2">
        <Button type="button" onClick={() => emailRef.current?.helperText?.set('Usaremos apenas para contato.', 'info')}>
          Set helper (info)
        </Button>

        <Button type="button" variant="outline" onClick={() => emailRef.current?.helperText?.set(null)}>
          Clear helper
        </Button>

        <Button type="button" variant="secondary" onClick={() => console.log('helper message:', emailRef.current?.helperText?.message)}>
          Log helper
        </Button>
      </div>
    </div>
  );
};

/**
 * Exemplo de seleção dinâmica do validationMode,
 * para testar o mesmo form nas 3 combinações.
 */
const DynamicModeFormPlayground: React.FC = () => {
  const [mode, setMode] = useState<ValidationMode>('native');

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Form com modo dinâmico</h3>

      <div className="flex gap-2">
        <Button type="button" variant={mode === 'native' ? 'primary' : 'outline'} onClick={() => setMode('native')}>
          native
        </Button>
        <Button type="button" variant={mode === 'helper' ? 'primary' : 'outline'} onClick={() => setMode('helper')}>
          helper
        </Button>
        <Button type="button" variant={mode === 'both' ? 'primary' : 'outline'} onClick={() => setMode('both')}>
          both
        </Button>
      </div>

      <Form<UserForm>
        id="user-form-dynamic"
        initialValues={{ name: '', email: '' }}
        validationRules={{
          name: required('Nome obrigatório'),
          email: pipe(required('E-mail obrigatório'), isEmail()),
        }}
        validationMode={mode}
        onSubmit={(values) => {
          console.log(`[dynamic:${mode}] submit`, values);
        }}>
        <Input name="name" placeholder="Nome" data-validation="name" required />
        <Input name="email" placeholder="E-mail" data-validation="email" type="email" required />
        <Button type="submit">Salvar (modo: {mode})</Button>
      </Form>
    </div>
  );
};

const TabForm: React.FC = () => {
  return (
    <Card className="space-y-8">
      <CardContent className="space-y-8">
        <h2 className="text-xl font-bold">Form Playground – validationMode</h2>

        <NativeFormPlayground />
        <HelperFormPlayground />
        <BothFormPlayground />
        <DynamicModeFormPlayground />
        <InputHelperPlayground />
      </CardContent>
    </Card>
  );
};

export default TabForm;
