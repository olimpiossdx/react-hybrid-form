// ----------------------------------------------------------------------
// UTILITÁRIO CUSTOMIZADO: cn (ClassNames)
// Substitui a necessidade de 'clsx' e 'tailwind-merge'
// ----------------------------------------------------------------------

type ClassValue = string | number | boolean | undefined | null | ClassValue[] | { [key: string]: any };

/**
 * Função auxiliar para processar argumentos de classe recursivamente (estilo clsx)
 */
function toVal(mix: ClassValue): string {
  let k,
    y,
    str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            str && (str += ' ');
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix && mix[k]) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          str && (str += ' ');
          str += k;
        }
      }
    }
  }

  return str;
}

/**
 * Resolve conflitos básicos de Tailwind.
 * Ex: Se tiver 'p-4' e depois 'p-2', mantém apenas o último ('p-2').
 * Nota: Esta é uma heurística simplificada. O tailwind-merge real é muito mais complexo.
 */
function mergeTailwindClasses(className: string): string {
  if (!className) {
    return '';
  }

  const classes = className.split(' ').filter(Boolean);
  const classMap: Record<string, string> = {};
  const finalClasses: string[] = [];

  // Lista de prefixos conflitantes comuns que queremos resolver (o último ganha)
  const conflictPrefixes = [
    'p-',
    'pt-',
    'pb-',
    'pl-',
    'pr-',
    'px-',
    'py-', // Padding
    'm-',
    'mt-',
    'mb-',
    'ml-',
    'mr-',
    'mx-',
    'my-', // Margin
    'text-',
    'bg-',
    'border-',
    'rounded-', // Cores e Bordas
    'w-',
    'h-',
    'min-w-',
    'max-w-', // Tamanhos
    'flex-',
    'grid-',
    'justify-',
    'items-', // Layout
    'top-',
    'bottom-',
    'left-',
    'right-',
    'inset-', // Posição
  ];

  classes.forEach((cls) => {
    // Verifica se a classe começa com algum prefixo conhecido
    const prefix = conflictPrefixes.find((p) => cls.startsWith(p));

    if (prefix) {
      // Se encontrou conflito, substitui no mapa (o último loop vence)
      classMap[prefix] = cls;
    } else {
      // Classes sem conflito mapeado (ex: 'relative', 'block') são mantidas
      // Adicionamos diretamente ao array final ou usamos um identificador único
      finalClasses.push(cls);
    }
  });

  // Reconstrói a string com as classes resolvidas + classes sem conflito
  return [...finalClasses, ...Object.values(classMap)].join(' ');
}

/**
 * Função principal exportada 'cn'
 * Combina classes e tenta limpar conflitos básicos.
 */
export function cn(...inputs: ClassValue[]) {
  // 1. Concatena tudo (comportamento clsx)
  let concatenated = '';
  for (let i = 0; i < inputs.length; i++) {
    const x = toVal(inputs[i]);
    if (x) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      concatenated && (concatenated += ' ');
      concatenated += x;
    }
  }

  // 2. (Opcional) Aplica o merge customizado se desejar resolver conflitos
  // Se preferir apenas concatenação pura, retorne 'concatenated'
  return mergeTailwindClasses(concatenated);
}
