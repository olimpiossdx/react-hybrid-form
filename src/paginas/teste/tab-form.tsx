import React, { useRef } from 'react';

import { Card, CardContent } from '../../componentes/card';
import Form from '../../componentes/form';
import Input, { type IInputProps } from '../../componentes/input'; // ajuste o caminho
// import type { IInputElementProps } from '../../componentes/input/types'; // onde você declarar a interface
import { isEmail, pipe, required } from '../../utils/validate';

type UserForm = {
  name: string;
  email: string;
};

const FormBasicPlayground: React.FC = () => {
  return (
    <Form<UserForm>
      id="user-form"
      initialValues={{ name: 'João', email: '' }}
      validationRules={{
        name: required('Nome obrigatório'),
        email: pipe(required('E-mail obrigatório'), isEmail()),
      }}
      onSubmit={(values) => {
        console.log('submit', values);
      }}>
      <Input name="name" placeholder="Nome" data-validation="name" required />
      <Input name="email" placeholder="E-mail" data-validation="email" type="email" required />
      <button type="submit">Salvar</button>
    </Form>
  );
};

const InputHelperPlayground: React.FC = () => {
  const emailRef = useRef<IInputProps | null>(null);

  return (
    <div className="p-4 space-y-4">
      <Input name="email" placeholder="Digite seu e-mail" ref={emailRef} />

      <div className="flex gap-2">
        <button type="button" onClick={() => emailRef.current?.helperText?.set('Usaremos apenas para contato.')}>
          Set helper
        </button>
        <button type="button" onClick={() => emailRef.current?.helperText?.set(null)}>
          Clear helper
        </button>
        <button type="button" onClick={() => console.log(emailRef.current?.helperText?.message)}>
          Log helper
        </button>
      </div>
    </div>
  );
};

const TabForm: React.FC = () => {
  return (
    <Card className="space-y-8">
      <CardContent>
        <h2 className="text-xl font-bold">Form Playground</h2>
        <FormBasicPlayground />
        <h2 className="text-xl font-bold">Input Helper Playground</h2>
        <InputHelperPlayground />
      </CardContent>
    </Card>
  );
};

export default TabForm;
