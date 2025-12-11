import React, { useCallback } from 'react';

type MaskType = 'cpf' | 'cnpj' | 'cep' | 'phone' | 'currency' | string;

interface UseMaskOptions {
  // Callbacks opcionais do usuário
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Hook para aplicar máscaras de formatação em inputs.
 * Retorna as props necessárias (onChange, maxLength, etc) para espalhar no input.
 */
export const useMask = (format: MaskType, options?: UseMaskOptions) => {

  const applyMask = (value: string, type: MaskType) => {
    const raw = value.replace(/\D/g, ''); // Remove não-números
    let pattern = type;

    // 1. Lógica Dinâmica (Telefone 8 vs 9 dígitos)
    if (type === 'phone') {
        pattern = raw.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999';
    } 
    // 2. Padrões Fixos
    else if (type === 'cpf') pattern = '999.999.999-99';
    else if (type === 'cnpj') pattern = '99.999.999/9999-99';
    else if (type === 'cep') pattern = '99999-999';
    
    // Se for string customizada (ex: '999-99'), usa ela direto.

    // 3. Aplicação caractere por caractere
    let i = 0;
    let v = 0;
    let output = '';
    
    while (v < raw.length && i < pattern.length) {
      const maskChar = pattern[i];
      const valChar = raw[v];

      if (maskChar === '9') {
        output += valChar;
        v++;
      } else {
        output += maskChar;
        // Se o usuário digitou o caractere especial, avançamos no valor também
        if (valChar === maskChar) v++;
      }
      i++;
    }
    return output;
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Aplica a máscara
    const originalValue = e.target.value;
    const maskedValue = applyMask(originalValue, format);
    
    // 2. Atualiza o DOM
    e.target.value = maskedValue;

    // 3. Executa o callback do usuário (se existir)
    // O evento já vai com o valor formatado no target
    if (options?.onChange) {
      options.onChange(e);
    }
  }, [format, options]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (options?.onBlur) {
      options.onBlur(e);
    }
  }, [options]);

  // Definição de MaxLength baseada no tipo para ajudar o navegador
  const getMaxLength = () => {
      if (format === 'cpf') return 14;
      if (format === 'cnpj') return 18;
      if (format === 'cep') return 9;
      if (format === 'phone') return 15; // (11) 99999-9999
      return undefined;
  };

  return {
    onChange: handleChange,
    onBlur: handleBlur,
    maxLength: getMaxLength(),
    placeholder: format === 'phone' ? '(99) 99999-9999' : undefined,
    // Marcador para o nosso parser saber que deve limpar formatação no submit
    'data-unmask': true 
  };
};

export default useMask;