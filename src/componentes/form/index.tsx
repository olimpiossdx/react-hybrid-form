import React from 'react';

import FormAlert from './alert';
import { FormRegistryContext } from './context';
import type { AlertService, FormServices } from './services';
import { toast } from '../../componentes/toast';
import useForm from '../../hooks/use-form'; // seu hook [file:2]
import type { ValidatorMap } from '../../hooks/use-form/props'; // adequar imports [file:1]
import type { IInputProps } from '../input/index'; // onde você declarar a interface

export type FormProps<TValues> = {
  id?: string;
  initialValues?: TValues;
  validationRules?: ValidatorMap<TValues>;
  onSubmit?: (values: TValues, event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: React.ReactNode;
};

function Form<TValues extends Record<any, string>>(props: FormProps<TValues>) {
  const { id, initialValues, validationRules, onSubmit, children } = props;

  const { formProps, resetSection, setValidators, handleSubmit } = useForm<TValues>({ id, onSubmit }); // [file:2]

  // Registry name -> ref
  const fieldRefs = React.useRef<Map<string, IInputProps>>(new Map());

  const registerFieldRef = React.useCallback((name: string, ref: IInputProps | null) => {
    if (!ref) {
      fieldRefs.current.delete(name);
    } else {
      fieldRefs.current.set(name, ref);
    }
  }, []);

  // Services
  const servicesRef = React.useRef<FormServices>({});

  // Aplicar mapa de validação
  function initValidationRules() {
    if (validationRules) {
      setValidators(validationRules as any);
    }
  }
  React.useEffect(initValidationRules, [validationRules, setValidators]);

  // Aplicar valores iniciais
  function initModelValues() {
    if (initialValues) {
      resetSection('', initialValues);
    }
  }
  React.useEffect(initModelValues, [initialValues, resetSection]);

  // Handler de submit com hook
  let submitHandler = formProps.onSubmit;

  if (onSubmit) {
    submitHandler = handleSubmit(async (values: TValues, event: React.FormEvent<HTMLFormElement>) => {
      try {
        await onSubmit(values, event);
        toast.success('Salvo com sucesso.', { position: 'top-right' });
      } catch (error) {
        servicesRef.current.alert?.show('Erro ao salvar. Tente novamente.');
        toast.error('Erro no submit do formulário.', { position: 'top-right' });
        console.error('Erro no submit do formulário:', error);
        // você pode também logar o erro ou emitir no Graph Bus aqui
      }
    });
  }

  return (
    <FormRegistryContext.Provider value={{ registerFieldRef }}>
      <form {...formProps} onSubmit={submitHandler}>
        {/* Serviços de UI internos */}
        <FormAlert
          register={(svc: AlertService) => {
            servicesRef.current.alert = svc;
          }}
        />

        {children}
      </form>
    </FormRegistryContext.Provider>
  );
}
Form.displayName = 'Form';
export default Form;
