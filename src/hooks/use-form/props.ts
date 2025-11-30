// props.ts

export interface IAnyObject {
  [key: string]: any;
}

/**
 * Interface para o resultado da validação
 */
export interface IValidationResult {
  message: string;
  type: "error" | "warning" | "info" | "success";
}

/**
 * O tipo de retorno da função de validação
 */
export type ValidationResult = string | IValidationResult | undefined;

/**
 * Configura Mapa de tipos de elementos do formulário aceitos
 */
export type FormField =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Assinatura da função de validação (com genéricos)
 */
export type ValidateFn<FormValues> = <T = any>(
  value: T,
  field: FormField | null,
  formValues: FormValues
) => ValidationResult;

/**
 * Configura Mapa de validadores com parametro FV (form value)
 */
export type ValidatorMap<FV> = Record<string, ValidateFn<FV>>;

/**
 * Tipo para armazenar referências aos listeners anexados
 */
export type ListenerRef = { blur: EventListener; change: EventListener };

/**
 * Mapa de ListenerRefs associados a elementos do formulário
 */
export type FieldListenerMap = Map<HTMLElement, ListenerRef>;

// --- TYPE SAFETY MAGIC (Paths) ---

/**
 * Extrai todas as chaves aninhadas de um objeto como string (ex: "user.name" | "items.0.id")
 */
export type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? `${K}` | `${K}.${Path<T[K]>}` : never;
    }[keyof T]
  : never;

/**
 * Infere o tipo do valor baseado no caminho (Path)
 */
export type PathValue<
  T,
  P extends Path<T>,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;
