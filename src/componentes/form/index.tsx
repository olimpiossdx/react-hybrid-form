import React from 'react';

import FormAlert from './alert';
import { FormRegistryContext } from './context';
import type { AlertService, FormServices, SnackService } from './services';
import FormSnack from './snack';
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
  React.useEffect(() => {
    if (validationRules) {
      setValidators(validationRules as any);
    }
  }, [validationRules, setValidators]);

  // Aplicar valores iniciais
  React.useEffect(() => {
    if (initialValues) {
      resetSection('', initialValues);
    }
  }, [initialValues, resetSection]);

  // Handler de submit com hook
  const submitHandler = onSubmit
    ? handleSubmit(async (values: TValues, event: React.FormEvent<HTMLFormElement>) => {
        try {
          await onSubmit(values, event);
          servicesRef.current.snack?.show('Salvo com sucesso.', 'success');
        } catch (error) {
          console.error('Erro no submit do formulário:', error);
          servicesRef.current.snack?.show('Erro ao salvar formulário.', 'error');
          servicesRef.current.alert?.show('Erro ao salvar. Tente novamente.');
          // você pode também logar o erro ou emitir no Graph Bus aqui
        }
      })
    : formProps.onSubmit;

  return (
    <FormRegistryContext.Provider value={{ registerFieldRef }}>
      <form {...formProps} onSubmit={submitHandler}>
        {/* Serviços de UI internos */}
        <FormAlert
          register={(svc: AlertService) => {
            servicesRef.current.alert = svc;
          }}
        />
        <FormSnack
          register={(svc: SnackService) => {
            servicesRef.current.snack = svc;
          }}
        />

        {children}
      </form>
    </FormRegistryContext.Provider>
  );
}

export default Form;
