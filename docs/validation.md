# Guia de Validação

## Visão Geral

A validação no React Hybrid Form segue a estratégia **Native-First**:
1. Primeiro, usamos a Constraint Validation API do navegador (`required`, `min`, `max`, `pattern`, etc.).
2. Depois, aplicamos validadores customizados via `setValidators`, injetando erros com `setCustomValidity`.

Isso garante alta performance e UX consistente, reaproveitando o que o navegador já faz bem.

---

## Validação Nativa (Nível 1)

Exemplo básico usando apenas HTML5:

```tsx
const { formProps } = useForm({
  id: 'native-only',
  onSubmit: (data) => console.log(data),
});

<form {...formProps}>
  <input name="user.email" type="email" required />
  <input name="user.age" type="number" min={18} />
  <button type="submit">Enviar</button>
</form>
```

O navegador se encarrega de:
- Bloquear o submit quando inválido.
- Exibir mensagens nativas.
- Gerenciar `ValidityState` e foco no primeiro campo inválido.

---

## Validação Customizada (Nível 2)

Use `setValidators` para regras de negócio mais complexas.

```tsx
type Form = { user: { email: string; password: string; confirmPassword: string } };

const { formProps, setValidators } = useForm<Form>({
  id: 'signup-form',
  onSubmit: handleSubmit,
});

useEffect(() => {
  setValidators({
    'user.email': (value) => {
      if (!value) return 'Email é obrigatório';
      if (!value.includes('@')) return 'Email inválido';
      return null;
    },
    'user.password': (value) => {
      if (value.length < 8) return 'Senha deve ter no mínimo 8 caracteres';
      if (!/[A-Z]/.test(value)) return 'Senha deve conter pelo menos uma letra maiúscula';
      return null;
    },
    'user.confirmPassword': (value, formData) => {
      if (value !== formData.user.password) return 'As senhas não conferem';
      return null;
    },
  });
}, [setValidators]);
```

Cada validador:
- Recebe o `value` do campo.
- Opcionalmente recebe `formData` para validações cross-field.
- Retorna `string` (mensagem de erro) ou `null` (válido).

---

## Estratégia "Reward Early, Punish Late"

- **Reward Early:** ao corrigir um campo inválido, a validação é disparada imediatamente e a mensagem some assim que ficar válido.
- **Punish Late:** mensagens só aparecem após `blur` ou tentativa de submit, evitando "pisca-pisca" de erro enquanto o usuário digita.

Essa estratégia equilibra feedback rápido com uma interface mais calma.

---

## Validação Cross-Field

Exemplo clássico de confirmação de senha:

```tsx
setValidators({
  'user.confirmPassword': (value, formData) => {
    if (!value) return 'Confirmação obrigatória';
    if (value !== formData.user.password) return 'As senhas não conferem';
    return null;
  },
});
```

Outros exemplos:
- Data final maior ou igual à data inicial.
- Descontos que não podem ultrapassar um percentual máximo.
- Campos obrigatórios condicionais (ex.: CPF ou CNPJ).

---

## Erros de API (Server-Side)

Você pode transformar erros do backend em erros "nativos" de campo:

```tsx
const onSubmit = async (data: Form, helpers: { setFieldError: (name: string, message: string) => void }) => {
  const result = await api.post('/signup', data);

  if (!result.isSuccess && result.errors) {
    // Exemplo: result.errors = { 'user.email': 'Email já cadastrado' }
    Object.entries(result.errors).forEach(([name, message]) => {
      helpers.setFieldError(name, String(message));
    });
    return;
  }

  // sucesso...
};
```

Dessa forma:
- O erro continua integrado com a UX de validação padrão.
- Leitores de tela e navegação por teclado continuam funcionando como esperado.

---

## Boas Práticas

- Use atributos HTML sempre que possível (`required`, `type`, `min`, `max`, `pattern`).
- Deixe para o nível customizado:
  - Regras de negócio.
  - Validações cross-field.
  - Erros de API.
- Mensagens:
  - Curta, clara, com linguagem de usuário final.
  - Evite "campo inválido", seja específico (ex.: "Informe um CPF válido").
