// Tokens padrão de mercado
const TOKENS: Record<string, RegExp> = {
  '9': /\d/,       // Apenas números
  'a': /[a-zA-Z]/, // Apenas letras
  '*': /[a-zA-Z0-9]/ // Alfanumérico
};

/**
 * Motor de Máscara Posicional (Pattern).
 * Ex: "999.999.999-99"
 */
export const applyPatternMask = (value: string, pattern: string): string => {
  const raw = value.replace(/[^a-zA-Z0-9]/g, '');
  let i = 0;
  let v = 0;
  let output = '';

  while (i < pattern.length && v < raw.length) {
    const patternChar = pattern[i];
    const valueChar = raw[v];
    const regex = TOKENS[patternChar];

    if (regex) {
      if (regex.test(valueChar)) {
        output += valueChar;
        v++;
      } else {
        v++; // Pula caractere inválido no valor
        continue;
      }
    } else {
      output += patternChar;
      if (valueChar === patternChar) {
          v++; // Consome se o usuário digitou o literal
      }
    }
    i++;
  }
  return output;
};

/**
 * Motor de Máscara Monetária (BigInt String-Based).
 * Suporta números infinitos sem perder precisão.
 */
export const applyCurrencyMask = (value: string, locale = 'pt-BR', currency = 'BRL'): string => {
  // 1. Limpa tudo que não é dígito
  const raw = value.replace(/\D/g, '');
  
  if (!raw) return '';

  // 2. Garante mínimo de 3 dígitos para formatar (0,01)
  const padded = raw.padStart(3, '0');

  // 3. Separa Centavos (últimos 2) e Inteiro (o resto)
  const cents = padded.slice(-2);
  const integerPart = padded.slice(0, -2);

  // 4. Formata o Inteiro usando BigInt para suportar números gigantes
  // Remove zeros à esquerda automaticamente via BigInt
  const formattedInteger = BigInt(integerPart).toLocaleString(locale);

  // 5. Descobre os símbolos do Locale (R$, vírgula, ponto)
  // Truque: Formata 1.1 para descobrir o separador decimal
  const parts = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(1.1);
  const symbol = parts.find(p => p.type === 'currency')?.value || '$';
  const decimal = parts.find(p => p.type === 'decimal')?.value || ',';
  
  // O separador de milhar já veio no toLocaleString do BigInt

  return `${symbol} ${formattedInteger}${decimal}${cents}`;
};

/**
 * Remove formatação para envio (limpa literais).
 * - Currency: Retorna string float ("1234.56") pronta para API/Banco.
 * - Pattern: Retorna string limpa ("123456").
 */
export const unmaskValue = (value: string, type?: string): string => {
  if (!value) return '';

  if (type === 'currency') {
      const raw = value.replace(/\D/g, '');
      if (!raw) return '';
      // Insere o ponto decimal manualmente antes dos últimos 2 dígitos
      const padded = raw.padStart(3, '0');
      const integer = padded.slice(0, -2);
      const decimal = padded.slice(-2);
      // Remove zeros à esquerda do inteiro para ficar limpo (ex: 001.23 -> 1.23)
      return `${BigInt(integer)}.${decimal}`;
  }
  
  // Padrão: remove tudo que não é alfanumérico
  return value.replace(/[^a-zA-Z0-9]/g, '');
};