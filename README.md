# 🚀 React Hybrid Form `v0.6.1`

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18%2B-cyan)
![TypeScript](https://img.shields.io/badge/typescript-5%2B-blue)
![Performance](https://img.shields.io/badge/performance-uncontrolled-green)

Uma arquitetura de formulários para React focada em **alta performance**, **acessibilidade (a11y)** e uso robusto da **API de Validação Nativa do DOM**.

> **💡 Filosofia:** O estado do formulário vive no DOM, não no React. O React entra apenas para orquestrar validações complexas, componentes ricos e a submissão. Zero re-renders ao digitar.

---

## ✨ Destaques da Versão

- **🏎️ Performance Extrema:** Componentes não controlados (_Uncontrolled_) por padrão. Digitar em um input não causa re-renderização do formulário.
- **🌐 HTTP Client Enterprise:** Wrapper robusto sobre `fetch` com **Retry Policy**, **AbortController**, **Interceptors** e **Smart Adapters** (detecta automaticamente JSON vs Raw).
- **♾️ Virtualização (Big Data):** Renderize listas de 10.000+ itens com performance nativa (60fps) usando `useVirtualizer` e `ResizeObserver`.
- **🧠 Smart Validation:** Estratégia "Reward Early, Punish Late". Feedback imediato ao corrigir, suave ao errar.
- **📅 DateRange Avançado:** Seleção de períodos com calendário duplo, presets (atalhos), validação cruzada e input inteligente (digitação).
- **🖥️ Sistema de Modais:** Arquitetura de **Portals** com Hook Headless (`showModal`) e suporte a Stacking (Modais sobrepostos).
- **🔌 Native Bypass:** Sincronia perfeita entre alterações programáticas do DOM e o estado do React.
- **📋 Gerenciamento de Listas Dinâmicas:** Sistema robusto para adicionar/remover itens com validação e sincronização DOM.
- **🎭 Sistema de Máscaras:** Aplicação inteligente de máscaras em inputs com suporte a formatação customizada.
- **🎯 Checkbox Hierárquico:** Implementação completa de checkbox master/slave com sincronização bidirecional.

---

## 📦 Estrutura do Projeto

```text
src/
├── hooks/
│   ├── use-form/           # Core do formulário (validação, submit, DOM)
│   ├── list/               # Gerenciador de listas dinâmicas
│   ├── virtualize/         # Engine de virtualização para grandes volumes
│   ├── use-checkbox/       # Sistema de checkbox master/slave
│   ├── use-mask/           # Sistema de máscaras para inputs
│   ├── use-table/          # Gerenciamento de tabelas com ordenação/filtros
│   ├── use-pagination-range/ # Lógica de paginação inteligente
│   └── native-bus/         # Sistema de eventos DOM-React
├── service/
│   ├── api.ts              # Instância Singleton do cliente HTTP
│   └── http/               # Camada de Serviço (HttpClient, Adapters)
├── componentes/
│   ├── modal/              # Sistema de Modais com Portals
│   ├── Autocomplete.tsx    # Input Async com Portal
│   ├── StarRating.tsx      # Avaliação acessível
│   ├── Switch.tsx          # Toggle booleano
│   ├── DateRangePicker.tsx # Seleção de período com Dual Calendar
│   ├── Alert.tsx           # Feedback visual contextual
│   ├── Checkbox.tsx        # Checkbox com suporte a hierarquia
│   └── Input.tsx           # Input base com validação
├── core/                   # Utilitários e tipos base
├── utils/                  # Helpers de DOM, Parser e Lógica
└── paginas/                # Exemplos de implementação
```

---

## 🛠️ Hooks Principais

### `useForm` - Core do Formulário

Conecte o formulário HTML à lógica React com apenas uma linha de props.

```tsx
import useForm from './hooks/use-form';

interface FormData {
  user: { name: string; age: number };
}

const MyForm = () => {
  const onSubmit = (data: FormData) => {
    console.log('JSON Submetido:', data);
  };

  const { formProps, getValue, setValue, setValidators, validate } = useForm<FormData>({
    id: 'my-form',
    onSubmit: onSubmit,
  });

  return (
    <form {...formProps}>
      <input name="user.name" required />
      <input name="user.age" type="number" min="18" />
      <button type="submit">Enviar</button>
    </form>
  );
};
```

**Recursos:**
- Validação nativa do navegador (HTML5)
- Validação customizada via `setValidators`
- Leitura de valores do DOM sem re-renders
- Suporte a objetos aninhados (dot notation)
- Integração com sistema de eventos nativos

---

### `useList` - Gerenciamento de Listas Dinâmicas

Gerencia adição, remoção e ordenação de itens em listas com sincronização DOM-React.

```tsx
import { useList } from './hooks/list';

interface Item {
  id: string;
  name: string;
  quantity: number;
}

const DynamicList = () => {
  const {
    items,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    clear
  } = useList<Item>({
    initialItems: [],
    generateId: () => crypto.randomUUID(),
  });

  const handleAdd = () => {
    addItem({ id: '', name: '', quantity: 0 });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id}>
          <input name={`items[${index}].name`} defaultValue={item.name} />
          <input name={`items[${index}].quantity`} type="number" defaultValue={item.quantity} />
          <button onClick={() => removeItem(item.id)}>Remover</button>
        </div>
      ))}
      <button onClick={handleAdd}>Adicionar Item</button>
    </div>
  );
};
```

**Recursos:**
- Adição/remoção de itens sem re-render completo
- Reordenação com drag-and-drop
- Validação por item
- Sincronização automática com formulário pai
- Suporte a listas aninhadas

---

### `useVirtualizer` - Virtualização de Listas

Para lidar com listas massivas (10.000+ itens) com performance de 60fps.

```tsx
import { useVirtualizer } from './hooks/virtualize';

const VirtualList = ({ data }: { data: any[] }) => {
  const { virtualItems, containerProps, wrapperProps, scrollToIndex } = useVirtualizer({
    count: data.length,
    estimateSize: () => 56, // Altura estimada da linha
    overscan: 5, // Itens extras renderizados fora da viewport
  });

  return (
    <div {...containerProps} className="h-[600px] overflow-auto">
      <div {...wrapperProps}>
        {virtualItems.map((virtualRow) => {
          const item = data[virtualRow.index];
          return (
            <div key={virtualRow.index} {...virtualRow.props}>
              <span>Item {item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

**Recursos:**
- Renderização apenas dos itens visíveis
- Detecção automática de redimensionamento (ResizeObserver)
- Scroll programático (`scrollToIndex`)
- Suporte a altura variável
- Performance constante independente do tamanho da lista

> **⚠️ Estratégia de Persistência Híbrida:**
> Em listas virtuais, o DOM não contém todos os dados. O `onSubmit` deve fazer o merge manual dos dados do Header (DOM) com os dados da Lista (Memória/Ref).

---

### `useCheckbox` - Checkbox Hierárquico

Sistema completo de checkbox master/slave com sincronização bidirecional.

```tsx
import { useCheckbox } from './hooks/use-checkbox';

const CheckboxGroup = () => {
  const { masterProps, slaveProps, isAllSelected, selectedCount } = useCheckbox({
    name: 'items',
    values: ['item1', 'item2', 'item3'],
  });

  return (
    <div>
      <label>
        <input {...masterProps} />
        Selecionar Todos ({selectedCount} de {values.length})
      </label>
      
      <div>
        <label><input {...slaveProps(0)} /> Item 1</label>
        <label><input {...slaveProps(1)} /> Item 2</label>
        <label><input {...slaveProps(2)} /> Item 3</label>
      </div>
    </div>
  );
};
```

**Recursos:**
- Sincronização automática master ↔ slave
- Estado indeterminado quando parcialmente selecionado
- Funciona com formulários nativos
- Suporte a validação `required`
- Performance otimizada sem re-renders

---

### `useMask` - Sistema de Máscaras

Aplicação inteligente de máscaras em inputs com formatação em tempo real.

```tsx
import { useMask } from './hooks/use-mask';

const MaskedInput = () => {
  const { inputProps, unmaskedValue } = useMask({
    mask: '(99) 99999-9999', // Celular brasileiro
    value: '',
    onChange: (masked, unmasked) => {
      console.log('Valor formatado:', masked);
      console.log('Valor limpo:', unmasked);
    }
  });

  return <input {...inputProps} placeholder="(00) 00000-0000" />;
};
```

**Máscaras Pré-Configuradas:**
- CPF: `999.999.999-99`
- CNPJ: `99.999.999/9999-99`
- Telefone: `(99) 9999-9999`
- Celular: `(99) 99999-9999`
- CEP: `99999-999`
- Data: `99/99/9999`
- Hora: `99:99`
- Cartão de Crédito: `9999 9999 9999 9999`

**Recursos:**
- Máscara customizável
- Remoção automática de caracteres inválidos
- Suporte a múltiplos formatos
- Não interfere com validação nativa
- Performance otimizada

---

### `useTable` - Gerenciamento de Tabelas

Controle completo de tabelas com ordenação, filtros e paginação.

```tsx
import { useTable } from './hooks/use-table';

const DataTable = () => {
  const {
    data,
    sortBy,
    sortDirection,
    handleSort,
    filters,
    setFilter,
    page,
    setPage,
    totalPages
  } = useTable({
    data: originalData,
    pageSize: 10,
    initialSort: { column: 'name', direction: 'asc' }
  });

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>
            Nome {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('date')}>Data</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

**Recursos:**
- Ordenação multi-coluna
- Filtros por coluna
- Paginação integrada
- Busca global
- Export de dados (CSV, JSON)
- Seleção de linhas

---

### `usePaginationRange` - Paginação Inteligente

Gera ranges de paginação otimizados para UX.

```tsx
import { usePaginationRange } from './hooks/use-pagination-range';

const Pagination = ({ currentPage, totalPages }: Props) => {
  const pages = usePaginationRange({
    currentPage,
    totalPages,
    siblingCount: 1, // Páginas ao redor da atual
    boundaryCount: 1 // Páginas nas extremidades
  });

  return (
    <div>
      {pages.map((page, index) => (
        page === '...' ? (
          <span key={index}>...</span>
        ) : (
          <button key={index} disabled={page === currentPage}>
            {page}
          </button>
        )
      ))}
    </div>
  );
};
```

**Recursos:**
- Algoritmo inteligente de truncamento
- Sempre exibe primeira e última página
- Configurável (siblings e boundaries)
- Suporte a grandes volumes (1000+ páginas)
- Sem re-cálculos desnecessários

---

### `useNativeBus` - Sistema de Eventos DOM-React

Sincroniza alterações programáticas no DOM com o estado React.

```tsx
import { useNativeBus } from './hooks/native-bus';

const SyncedComponent = () => {
  const { subscribe, publish } = useNativeBus();

  useEffect(() => {
    // Escuta mudanças no DOM
    const unsubscribe = subscribe('input[name="email"]', (value) => {
      console.log('Email alterado:', value);
    });

    return unsubscribe;
  }, []);

  const updateExternally = () => {
    // Atualiza DOM e notifica React
    publish('input[name="email"]', 'novo@email.com');
  };

  return <button onClick={updateExternally}>Atualizar Email</button>;
};
```

**Recursos:**
- Ponte entre manipulações DOM e React
- Evita inconsistências de estado
- Suporte a custom events
- Garbage collection automático
- Performance otimizada

---

## 🌐 Camada de Serviço (`HttpClient`)

Um cliente HTTP resiliente que padroniza o consumo de APIs.

### Recursos

- **Smart Adapter:** Detecta automaticamente se a resposta é um envelope padrão (`{ data, isSuccess }`) ou um dado cru (ex: JSONPlaceholder).
- **Retry Exponencial:** Tenta novamente em caso de falhas de rede ou erros 5xx/429.
- **Notification System:** Integração automática com Toasts de erro/sucesso.
- **Interceptors:** Request/Response interceptors para autenticação, logging, etc.
- **AbortController:** Cancelamento de requisições em andamento.

```tsx
import { api } from './service/api';

const loadData = async () => {
  // 1. Chamada Padrão (Tipada)
  const res = await api.get<IUser[]>('/users');

  if (res.isSuccess) {
    setUsers(res.data);
  }

  // 2. Chamada com Cancelamento e Retry
  const controller = new AbortController();

  await api.post('/dados', payload, {
    retries: 3, // Tenta 3x em caso de falha
    notifyOnError: true, // Mostra Toast se falhar
    signal: controller.signal,
  });

  // 3. Interceptors
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.status === 401) {
        // Redireciona para login
      }
      throw error;
    }
  );
};
```

---

## 🧩 Componentes Ricos

### DateRangePicker (Dual Calendar)

Componente de seleção de período com inteligência de entrada.

- **Smart Parse:** Digite "1" e ele entende "01/Mes/Ano".
- **Presets:** Atalhos configuráveis como "Últimos 7 dias".
- **Shadow Inputs:** Mantém dois inputs `date` ocultos para validação nativa.
- **Validação Cruzada:** Impede que data final seja menor que inicial.

```tsx
<DateRangePicker
  startDateName="inicio"
  endDateName="fim"
  label="Período"
  minDate="2024-01-01"
  maxDate="2026-12-31"
  presets={[
    { label: 'Hoje', getValue: () => ({ start: today, end: today }) },
    { label: 'Últimos 7 dias', getValue: () => ({ start: minus7Days, end: today }) },
    { label: 'Este mês', getValue: () => ({ start: startOfMonth, end: today }) }
  ]}
/>
```

### Autocomplete (Async)

- **Shadow Select:** Mantém integridade de dados no DOM.
- **Portal:** Fura `overflow: hidden` e `z-index`.
- **Async:** Busca remota e paginação infinita.
- **Debounce:** Otimiza requests durante digitação.
- **Keyboard Navigation:** Navegação completa por teclado (a11y).

```tsx
<Autocomplete
  name="user"
  placeholder="Buscar usuário..."
  loadOptions={async (query) => {
    const res = await api.get(`/users?search=${query}`);
    return res.data;
  }}
  getOptionLabel={(option) => option.name}
  getOptionValue={(option) => option.id}
  debounceMs={300}
/>
```

### StarRating

- **Anchor/Overlay Input:** Utiliza input nativo invisível para validação e acessibilidade.
- **Hover Preview:** Mostra rating ao passar o mouse.
- **Half Stars:** Suporte a avaliações fracionadas (0.5).
- **Read-only Mode:** Exibe rating sem permitir edição.

```tsx
<StarRating
  name="rating"
  value={4.5}
  maxStars={5}
  allowHalf
  required
  onChange={(value) => console.log('Rating:', value)}
/>
```

### Switch

- **Input Nativo:** Baseado em checkbox nativo.
- **Acessível:** Suporte completo a leitores de tela.
- **Customizável:** Cores, tamanhos e estados.

```tsx
<Switch
  name="notifications"
  label="Receber notificações"
  defaultChecked
  onChange={(checked) => console.log('Enabled:', checked)}
/>
```

---

## 🛡️ Validação: "Native-First"

O pipeline de validação garante performance e UX:

1. **Nível 1 (Browser):** Verifica regras HTML (`required`, `min`, `max`, `pattern`). Se falhar, para e exibe mensagem nativa.
2. **Nível 2 (Custom):** Verifica regras JavaScript (`setValidators`). Se falhar, injeta o erro no navegador via `setCustomValidity`.

### Exemplo de Validação Customizada

```tsx
const { formProps, setValidators } = useForm({
  id: 'signup-form',
  onSubmit: handleSubmit,
});

useEffect(() => {
  setValidators({
    'user.email': (value) => {
      if (!value.includes('@')) {
        return 'Email inválido';
      }
      return null; // Válido
    },
    'user.password': (value) => {
      if (value.length < 8) {
        return 'Senha deve ter no mínimo 8 caracteres';
      }
      if (!/[A-Z]/.test(value)) {
        return 'Senha deve conter pelo menos uma letra maiúscula';
      }
      return null;
    },
    'user.confirmPassword': (value, formData) => {
      if (value !== formData.user.password) {
        return 'As senhas não conferem';
      }
      return null;
    }
  });
}, [setValidators]);
```

**Estratégia de Feedback:**
- **Reward Early:** Ao corrigir um erro, valida imediatamente e remove a mensagem.
- **Punish Late:** Ao cometer um erro, aguarda o blur do campo para mostrar a mensagem.

---

## 🖥️ Sistema de Modais (Imperativo)

Abra modais de qualquer lugar sem sujar o JSX do componente pai.

```tsx
import { showModal } from './componentes/modal';

const handleDelete = () => {
  showModal({
    title: 'Confirmar Exclusão',
    size: 'sm', // xs, sm, md, lg, xl, full
    content: (
      <p>Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.</p>
    ),
    actions: (
      <>
        <button onClick={() => closeModal()}>Cancelar</button>
        <button onClick={() => {
          deleteItem();
          closeModal();
        }}>
          Confirmar
        </button>
      </>
    ),
    closeOnEscape: true,
    closeOnBackdrop: false,
  });
};
```

**Recursos:**
- Portal para renderização fora da hierarquia
- Stacking (múltiplos modais sobrepostos)
- Animações de entrada/saída
- Trap de foco para acessibilidade
- Scroll lock no body
- Histórico de modais (navegação)

---

## 🧪 Utilitários

### DOM Utilities (`utils/`)

Funções puras exportadas para uso geral:

```tsx
import {
  setNativeValue,
  getFormFields,
  setNestedValue,
  getNestedValue,
  syncCheckboxGroup,
  parseFormData,
  serializeForm
} from './utils';

// Define valor e dispara eventos, burlando bloqueio de Synthetic Events
setNativeValue(inputElement, 'novo valor');

// Busca inputs válidos dentro de qualquer container
const fields = getFormFields(formElement);

// Cria objetos profundos a partir de strings de caminho
setNestedValue(obj, 'user.address.street', 'Rua A');

// Lê valores aninhados com segurança
const street = getNestedValue(obj, 'user.address.street');

// Sincroniza checkboxes master/slave
syncCheckboxGroup(checkboxElement, formElement);

// Converte FormData em objeto JSON tipado
const data = parseFormData<User>(new FormData(formElement));

// Serializa formulário para objeto JSON
const json = serializeForm(formElement);
```

### Type Utilities

```tsx
import type {
  FormConfig,
  ValidationRule,
  FieldValidator,
  ListConfig,
  VirtualizerConfig,
  HttpClientConfig
} from './core/types';

// Tipos para configuração de formulários
const config: FormConfig<UserForm> = {
  id: 'user-form',
  onSubmit: handleSubmit,
  validators: { ... }
};

// Tipos para validação
const emailValidator: FieldValidator = (value, formData) => {
  // Lógica de validação
  return null; // ou string de erro
};
```

---

## 🎯 Cenários de Uso

### Formulário Simples

```tsx
const SimpleForm = () => {
  const { formProps } = useForm({
    id: 'contact',
    onSubmit: (data) => console.log(data)
  });

  return (
    <form {...formProps}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Enviar</button>
    </form>
  );
};
```

### Formulário com Lista Dinâmica

```tsx
const OrderForm = () => {
  const { formProps } = useForm({ id: 'order', onSubmit: handleSubmit });
  const { items, addItem, removeItem } = useList({
    initialItems: [],
    generateId: () => crypto.randomUUID()
  });

  return (
    <form {...formProps}>
      <input name="customerName" required />
      
      <h3>Itens do Pedido</h3>
      {items.map((item, idx) => (
        <div key={item.id}>
          <input name={`items[${idx}].product`} required />
          <input name={`items[${idx}].quantity`} type="number" min="1" required />
          <button type="button" onClick={() => removeItem(item.id)}>Remover</button>
        </div>
      ))}
      
      <button type="button" onClick={() => addItem({ id: '', product: '', quantity: 1 })}>
        Adicionar Item
      </button>
      
      <button type="submit">Finalizar Pedido</button>
    </form>
  );
};
```

### Tabela Virtualizada com Filtros

```tsx
const BigDataTable = () => {
  const { data, handleSort, setFilter } = useTable({
    data: largeDataset, // 100k+ registros
    pageSize: 50
  });

  const { virtualItems, containerProps, wrapperProps } = useVirtualizer({
    count: data.length,
    estimateSize: () => 48
  });

  return (
    <div>
      <input
        placeholder="Filtrar por nome..."
        onChange={(e) => setFilter('name', e.target.value)}
      />
      
      <div {...containerProps} className="h-[600px]">
        <div {...wrapperProps}>
          {virtualItems.map((vRow) => {
            const row = data[vRow.index];
            return (
              <div key={vRow.index} {...vRow.props}>
                {row.name} - {row.email}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

---

## 📚 Documentação Adicional

- **[Guia de Validação](./docs/validation.md)** - Estratégias avançadas de validação
- **[Performance](./docs/performance.md)** - Otimizações e benchmarks
- **[Acessibilidade](./docs/accessibility.md)** - Práticas de a11y implementadas
- **[API Reference](./docs/api.md)** - Documentação completa de todas as APIs

---

## 🚀 Instalação e Setup

```bash
# Clone o repositório
git clone https://github.com/olimpiossdx/react-hybrid-form.git

# Instale as dependências
cd react-hybrid-form
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por [olimpiossdx](https://github.com/olimpiossdx)

---

## 🙏 Agradecimentos

- Comunidade React pela inspiração
- Contribuidores do projeto
- Todos que reportaram issues e sugeriram melhorias
