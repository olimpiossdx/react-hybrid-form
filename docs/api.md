# API Reference

Este documento lista as principais APIs expostas pelo React Hybrid Form.

---

## Hooks

### `useForm<T>(config)`

Core de formulários.

```ts
type FieldValidator<T> = (value: any, formData: T) => string | null;

type FormConfig<T> = {
  id: string;
  onSubmit: (data: T) => void | Promise<void>;
  validators?: Record<string, FieldValidator<T>>;
};

function useForm<T>(config: FormConfig<T>): {
  formProps: React.FormHTMLAttributes<HTMLFormElement>;
  getValue: (name: string) => unknown;
  setValue: (name: string, value: unknown) => void;
  setValidators: (validators: Record<string, FieldValidator<T>>) => void;
  validate: () => boolean;
};
```

Principais pontos:
- `id`: identificador único do formulário no DOM.
- `onSubmit`: recebe o objeto tipado com os dados.
- `validators`: mapa de `name` → função de validação.

---

### `useList<T>(config)`

Gerenciamento de listas dinâmicas.

```ts
type ListConfig<T> = {
  initialItems: T[];
  generateId: () => string;
};

function useList<T>(config: ListConfig<T>): {
  items: T[];
  addItem: (item: T) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, patch: Partial<T>) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
  clear: () => void;
};
```

Uso típico: formulários de pedido, itens de tabela, coleções aninhadas.

---

### `useVirtualizer(config)`

Virtualização de listas.

```ts
type VirtualizerConfig = {
  count: number;
  estimateSize: (index: number) => number;
  overscan?: number;
};

function useVirtualizer(config: VirtualizerConfig): {
  virtualItems: Array<{
    index: number;
    size: number;
    start: number;
    props: React.HTMLAttributes<HTMLDivElement>;
  }>;
  containerProps: React.HTMLAttributes<HTMLDivElement>;
  wrapperProps: React.HTMLAttributes<HTMLDivElement>;
  scrollToIndex: (index: number) => void;
};
```

---

### `useCheckbox(config)`

Checkbox master/slave.

```ts
type UseCheckboxConfig = {
  name: string;
  values: string[];
};

function useCheckbox(config: UseCheckboxConfig): {
  masterProps: React.InputHTMLAttributes<HTMLInputElement>;
  slaveProps: (index: number) => React.InputHTMLAttributes<HTMLInputElement>;
  isAllSelected: boolean;
  selectedCount: number;
};
```

---

### `useMask(config)`

Máscaras para inputs.

```ts
type UseMaskConfig = {
  mask: string;
  value?: string;
  onChange?: (masked: string, unmasked: string) => void;
};

function useMask(config: UseMaskConfig): {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  unmaskedValue: string;
};
```

---

### `useTable(config)`

Tabelas com ordenação, filtros e paginação.

```ts
type SortDirection = 'asc' | 'desc';

type TableConfig<T> = {
  data: T[];
  pageSize?: number;
  initialSort?: { column: keyof T; direction: SortDirection };
};

function useTable<T>(config: TableConfig<T>): {
  data: T[];
  sortBy?: keyof T;
  sortDirection?: SortDirection;
  handleSort: (column: keyof T) => void;
  filters: Record<string, any>;
  setFilter: (column: string, value: any) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};
```

---

### `usePaginationRange(config)`

Gera ranges de paginação.

```ts
type PaginationRangeConfig = {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  boundaryCount?: number;
};

function usePaginationRange(config: PaginationRangeConfig): Array<number | '...'>;
```

---

### `useNativeBus()`

Ponte entre manipulações DOM e React.

```ts
type NativeBus = {
  subscribe: (selector: string, handler: (value: any) => void) => () => void;
  publish: (selector: string, value: any) => void;
};

function useNativeBus(): NativeBus;
```

---

## Componentes

### `DateRangePicker`

Props principais (resumo conceitual):

- `startDateName`: nome do campo inicial.
- `endDateName`: nome do campo final.
- `label`: rótulo exibido.
- `minDate` / `maxDate`: limites.
- `presets`: array de atalhos de período.

---

### `Autocomplete`

- `name`: nome do campo no form.
- `loadOptions(query)`: busca assíncrona.
- `getOptionLabel` / `getOptionValue`.
- `debounceMs`: controle de debounce.
- Integração com form via shadow input/select.

---

### `StarRating`

- `name`: campo do formulário.
- `value` / `defaultValue`.
- `maxStars`: número de estrelas.
- `allowHalf`: permite meia estrela.
- `onChange(value)`: callback.

---

### `Switch`

- `name`: campo booleano.
- `label`: texto.
- `defaultChecked`: valor inicial.
- `onChange(checked)`: callback.

---

## Utils

Principais helpers:

```ts
setNativeValue(element: HTMLElement, value: any): void;
getFormFields(root: HTMLElement): HTMLInputElement[];
setNestedValue(obj: object, path: string, value: any): void;
getNestedValue(obj: object, path: string): any;
syncCheckboxGroup(master: HTMLInputElement, form: HTMLFormElement): void;
parseFormData<T>(formData: FormData): T;
serializeForm(form: HTMLFormElement): Record<string, any>;
```

Eles dão suporte à leitura/escrita no DOM, montagem de objetos aninhados e sincronização de checkboxes.
