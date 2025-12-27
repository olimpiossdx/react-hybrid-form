````markdown
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

---

## 📦 Estrutura do Projeto

```text
src/
├── hooks/
│   └── useForm.ts        # O Core. Validação, submit e leitura do DOM.
│   └── useList.ts        # Gerenciador estrutural para listas dinâmicas.
│   └── useVirtualizer.ts # Engine de Windowing para listas gigantes.
├── services/
│   ├── api.ts            # Instância Singleton do cliente HTTP.
│   └── http/             # Camada de Serviço (HttpClient, Adapters).
├── components/
│   ├── modal/            # Sistema de Modais.
│   ├── Autocomplete.tsx  # Input Async com Portal.
│   ├── StarRating.tsx    # Avaliação acessível.
│   ├── Switch.tsx        # Toggle booleano.
│   ├── DateRangePicker.tsx # Seleção de período com Dual Calendar.
│   └── Alert.tsx         # Feedback visual contextual.
├── utils/
│   ├── props.ts          # Definições de Tipos.
│   └── utilities.ts      # Helpers de DOM, Parser e Lógica.
└── scenarios/            # Exemplos de implementação.
```
````

---

## 🛠️ Hook Core: `useForm`

Conecte o formulário HTML à lógica React com apenas uma linha de props.

```tsx
import useForm from './hooks/useForm';

interface FormData {
  user: { name: string; age: number };
}

const MyForm = () => {
  const onSubmit = (data: FormData) => {
    console.log('JSON Submetido:', data);
  };

  // Configura ID e Submit Handler diretamente no hook
  const { formProps, getValue, setValidators } = useForm<FormData>({
    id: 'my-form',
    onSubmit: onSubmit,
  });

  return (
    // Conecta ID, Ref e onSubmit automaticamente
    <form {...formProps}>
      <input name="user.name" required />
      <button type="submit">Enviar</button>
    </form>
  );
};
```

---

## 🌐 Camada de Serviço (`HttpClient`)

Um cliente HTTP resiliente que padroniza o consumo de APIs.

### Recursos

- **Smart Adapter:** Detecta automaticamente se a resposta é um envelope padrão (`{ data, isSuccess }`) ou um dado cru (ex: JSONPlaceholder).
- **Retry Exponencial:** Tenta novamente em caso de falhas de rede ou erros 5xx/429.
- **Notification System:** Integração automática com Toasts de erro/sucesso.

<!-- end list -->

```tsx
import { api } from './services/api';

const loadData = async () => {
  // 1. Chamada Padrão (Tipada)
  const res = await api.get<IUser[]>('/users');

  if (res.isSuccess) {
    setUsers(res.data);
  }

  // 2. Chamada com Cancelamento e Retry
  const controller = new AbortController();

  await api.post('/dados', payload, {
    retries: 3, // Tenta 3x
    notifyOnError: true, // Mostra Toast se falhar
    signal: controller.signal,
  });
};
```

---

## 🧩 Componentes Ricos

### DateRangePicker (Dual Calendar)

Componente de seleção de período com inteligência de entrada.

- **Smart Parse:** Digite "1" e ele entende "01/Mes/Ano".
- **Presets:** Atalhos configuráveis como "Últimos 7 dias".
- **Shadow Inputs:** Mantém dois inputs `date` ocultos para validação nativa.

<!-- end list -->

```tsx
<DateRangePicker
  startDateName="inicio"
  endDateName="fim"
  label="Período"
  minDate="2024-01-01"
  presets={FINANCIAL_PRESETS} // Opcional
/>
```

### Autocomplete (Async)

- **Shadow Select:** Mantém integridade de dados no DOM.
- **Portal:** Fura `overflow: hidden` e `z-index`.
- **Async:** Busca remota e paginação infinita.

### StarRating & Switch

- **Anchor/Overlay Input:** Utilizam inputs nativos invisíveis posicionados estrategicamente para garantir acessibilidade e ancoragem do balão de erro.

---

## ♾️ Virtualização (`useVirtualizer`)

Para lidar com listas massivas (ex: 10.000 linhas), utilizamos o padrão **Virtual Windowing** com detecção de redimensionamento (`ResizeObserver`).

```tsx
const { virtualItems, containerProps, wrapperProps } = useVirtualizer({
  count: 10000,
  estimateSize: () => 56, // Altura da linha
  overscan: 5,
});

// Renderização Otimizada
return (
  <div {...containerProps} className="h-full">
    <div {...wrapperProps}>
      {virtualItems.map((row) => (
        <div key={row.index} {...row.props}>
          Linha {row.index}
        </div>
      ))}
    </div>
  </div>
);
```

> **⚠️ Estratégia de Persistência Híbrida:**
> Em listas virtuais, o DOM não contém todos os dados. O `onSubmit` deve fazer o merge manual dos dados do Header (DOM) com os dados da Lista (Memória/Ref).

---

## 🖥️ Sistema de Modais (Imperativo)

Abra modais de qualquer lugar sem sujar o JSX do componente pai.

```tsx
import { showModal } from './components/modal';

const handleOpen = () => {
  showModal({
    title: "Confirmação",
    size: "sm",
    content: <p>Deseja excluir este item?</p>,
    actions: <button onClick={...}>Sim</button>
  });
};
```

---

## 🛡️ Validação: "Native-First"

O pipeline de validação garante performance e UX:

1.  **Nível 1 (Browser):** Verifica regras HTML (`required`, `min`, `pattern`). Se falhar, para e exibe mensagem nativa.
2.  **Nível 2 (Custom):** Verifica regras JavaScript (`setValidators`). Se falhar, injeta o erro no navegador via `setCustomValidity`.

---

## 🧪 Utilitários (`utilities.ts`)

Funções puras exportadas para uso geral:

- `setNativeValue(element, value)`: Define valor e dispara eventos, burlando o bloqueio de Synthetic Events do React.
- `getFormFields(root)`: Busca inputs válidos dentro de qualquer container.
- `setNestedValue(obj, path, value)`: Cria objetos profundos a partir de strings de caminho.
- `syncCheckboxGroup(target, form)`: Lógica central que sincroniza Mestres e Filhos.

### Licença

MIT

```

```
