import React from 'react';

import FormAlert from './alert';
import { FormRegistryContext } from './context';
import type { AlertService, FormServices } from './services';
import { toast } from '../../componentes/toast';
import useForm from '../../hooks/use-form';
import type { ValidationMode, ValidatorMap } from '../../hooks/use-form/props';
import type { IInputProps } from '../input';

export type FormProps<TValues> = {
  id?: string;
  initialValues?: TValues;
  validationRules?: ValidatorMap<TValues>;
  validationMode?: ValidationMode; // NOVO
  onSubmit?: (values: TValues, event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: React.ReactNode;
};

function Form<TValues extends Record<any, string> = Record<any, string>>(props: FormProps<TValues>) {
  const { id, initialValues, validationRules, validationMode, onSubmit, children } = props;

  const { formProps, resetSection, setValidators, handleSubmit } = useForm<TValues>({ id, onSubmit, validationMode });

  // Registry name -> ref (se você quiser usar no futuro para foco, etc.)
  const fieldRefs = React.useRef<Map<string, IInputProps>>(new Map());

  const registerFieldRef = React.useCallback((name: string, ref: IInputProps | null) => {
    if (!ref) {
      fieldRefs.current.delete(name);
    } else {
      fieldRefs.current.set(name, ref);
    }
  }, []);

  // Services (Alert por enquanto)
  const servicesRef = React.useRef<FormServices>({});

  // Aplicar mapa de validação
  const initValidationRules = React.useCallback(() => {
    if (validationRules) {
      setValidators(validationRules as ValidatorMap<TValues>);
    }
  }, [validationRules, setValidators]);

  React.useEffect(initValidationRules, [initValidationRules]);

  // Aplicar valores iniciais
  const initModelValues = React.useCallback(() => {
    if (initialValues) {
      resetSection('', initialValues);
    }
  }, [initialValues, resetSection]);

  React.useEffect(initModelValues, [initModelValues]);

  // Handler de submit com hook (sucesso/erro)
  let submitHandler: React.FormEventHandler<HTMLFormElement> | undefined = formProps.onSubmit;

  if (onSubmit) {
    submitHandler = handleSubmit(async (values: TValues, event: React.FormEvent<HTMLFormElement>) => {
      try {
        await onSubmit(values, event);
        toast.success('Salvo com sucesso.', { position: 'top-right' });
      } catch (error) {
        servicesRef.current.alert?.show('Erro ao salvar. Tente novamente.');
        toast.error('Erro no submit do formulário.', { position: 'top-right' });
        console.error('Erro no submit do formulário:', error);
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
