import React, { useCallback } from 'react';
import { applyPatternMask, applyCurrencyMask } from '../../utils/mask';

export type MaskPreset = 'cpf' | 'cnpj' | 'cep' | 'phone' | 'currency' | 'credit_card' | 'date' | 'time';
export type MaskFormat = MaskPreset | string | ((value: string) => string);

interface UseMaskOptions {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  // Configuração Específica para Currency
  currencyOptions?: {
    locale?: string;   // 'pt-BR', 'en-US'
    currency?: string; // 'BRL', 'USD', 'EUR'
  };
}

const PRESETS: Record<string, string> = {
  cpf: '999.999.999-99',
  cnpj: '99.999.999/9999-99',
  cep: '99999-999',
  date: '99/99/9999',
  time: '99:99',
  credit_card: '9999 9999 9999 9999',
};

export const useMask = (format: MaskFormat, options?: UseMaskOptions) => {

  const resolvePattern = (value: string): string => {
    if (typeof format === 'function') return format(value);

    if (format === 'phone') {
      const raw = value.replace(/\D/g, '');
      return raw.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999';
    }

    if (PRESETS[format as string]) return PRESETS[format as string];
    return format; // Custom pattern "AAA-0000"
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let maskedValue = '';

    if (format === 'currency') {
      maskedValue = applyCurrencyMask(
        value,
        options?.currencyOptions?.locale,
        options?.currencyOptions?.currency
      );
    } else {
      const pattern = resolvePattern(value);
      maskedValue = applyPatternMask(value, pattern);
    }

    e.target.value = maskedValue;

    if (options?.onChange) {
      options.onChange(e);
    }
  }, [format, options]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (options?.onBlur) {
      options.onBlur(e);
    }
  }, [options]);

  return {
    onChange: handleChange,
    onBlur: handleBlur,
    maxLength: format === 'cpf' ? 14 : undefined,
    inputMode: (format === 'currency' || format === 'phone' || format === 'cpf') ? 'numeric' as const : 'text' as const,
    'data-unmask': format === 'currency' ? 'currency' : 'default'
  };
};

export default useMask;