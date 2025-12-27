import type { FormField, IValidationResult, ValidateFn } from '../hooks/use-form/props';

// Helper para criar retorno de erro padrão
const error = (message: string): IValidationResult => ({
  message,
  type: 'error',
});

/**
 * O Compositor: Executa validadores em sequência.
 * Para no primeiro erro encontrado.
 */
export const pipe = <T>(...validators: ValidateFn<T>[]): ValidateFn<T> => {
  return (value, field, formValues) => {
    for (const validator of validators) {
      const result = validator(value, field, formValues);
      if (result) {
        return result;
      } // Retorna o erro imediatamente
    }
    return undefined; // Sucesso
  };
};

// --- VALIDADORES COMUNS (Factories) ---

export const required =
  (msg = 'Campo obrigatório') =>
  (value: any, field: FormField | null) => {
    // Regra Híbrida: Se tem arquivo visual (data-has-existing), não é vazio
    if (field?.getAttribute('data-has-existing') === 'true') {
      return undefined;
    }

    // Regra Padrão
    if (value === null || value === undefined || value === '') {
      return error(msg);
    }
    if (Array.isArray(value) && value.length === 0) {
      return error(msg);
    }

    return undefined;
  };

export const minLength = (min: number, msg?: string) => (value: string) => {
  if (!value) {
    return undefined;
  } // Deixa o required cuidar de vazio
  if (String(value).length < min) {
    return error(msg || `Mínimo de ${min} caracteres`);
  }
};

export const isEmail =
  (msg = 'E-mail inválido') =>
  (value: string) => {
    if (!value) {
      return undefined;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      return error(msg);
    }
  };

// --- VALIDAÇÃO CRUZADA ---

/**
 * Verifica se o valor é igual a outro campo do formulário.
 */
export const equalsTo =
  (fieldName: string, msg = 'Os campos não conferem') =>
  (value: any, _field: any, formValues: any) => {
    if (value !== formValues[fieldName]) {
      return error(msg);
    }
  };

/**
 * Validação condicional: Só executa a regra SE uma condição for verdadeira.
 * Útil para: "Obrigatório APENAS SE o checkbox X estiver marcado".
 */
export const when = (predicate: (values: any) => boolean, validator: ValidateFn<any>): ValidateFn<any> => {
  return (value, field, formValues) => {
    if (predicate(formValues)) {
      return validator(value, field, formValues);
    }
    return undefined;
  };
};
