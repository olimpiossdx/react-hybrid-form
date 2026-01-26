import { BellRing, Check, CreditCard, Settings, User } from 'lucide-react';

import Button from '../../componentes/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../componentes/card';
import Input from '../../componentes/input';
import { Select } from '../../componentes/select';

const TabCard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 pb-20">
      <div className="text-center border-b pb-6 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Componente Card</h2>
        <p className="text-gray-500 mt-2">Container composto para agrupamento de conteúdo e ações.</p>
      </div>

      {/* --- EXEMPLO 1: VARIANTES VISUAIS --- */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Variantes Visuais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Elevated (Default) */}
          <Card>
            <CardHeader>
              <CardTitle>Elevated (Padrão)</CardTitle>
              <CardDescription>Sombra suave e fundo branco.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ideal para destacar conteúdo principal em fundos cinzas ou neutros. É a variante mais comum para dashboards.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                Detalhes
              </Button>
            </CardFooter>
          </Card>

          {/* Outlined */}
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Outlined</CardTitle>
              <CardDescription>Borda visível, sem sombra.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Perfeito para agrupar informações secundárias ou quando já existe muita profundidade na página.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                Editar
              </Button>
            </CardFooter>
          </Card>

          {/* Ghost */}
          <Card variant="ghost">
            <CardHeader>
              <CardTitle>Ghost</CardTitle>
              <CardDescription>Sem borda, sem fundo.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Utilizado quando o conteúdo precisa se alinhar ao grid sem uma "caixa" visual explícita ao redor.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="ghost" className="pl-0">
                Ler mais &rarr;
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* --- EXEMPLO 2: FORMULÁRIO DE CADASTRO --- */}
      <section className="flex justify-center">
        <Card className="w-full max-w-lg" variant="outlined">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>Inicie seu teste gratuito de 30 dias.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="nome" label="Nome" placeholder="João" variant="outlined" />
              <Input name="sobrenome" label="Sobrenome" placeholder="Silva" variant="outlined" />
            </div>
            <Input name="email" type="email" label="E-mail Corporativo" placeholder="voce@empresa.com" leftIcon={<User size={18} />} />
            <Select name="cargo" label="Cargo" placeholder="Selecione...">
              <option value="dev">Desenvolvedor</option>
              <option value="mgr">Gerente de Produto</option>
              <option value="ceo">Diretor / CEO</option>
            </Select>
            <Input name="senha" type="password" label="Senha" placeholder="••••••••" />
          </CardContent>

          <CardFooter className="flex justify-between border-t dark:border-gray-700 pt-6 mt-2 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <Button variant="ghost">Cancelar</Button>
            <Button variant="primary">Criar Conta</Button>
          </CardFooter>
        </Card>
      </section>

      {/* --- EXEMPLO 3: CONFIGURAÇÕES E NOTIFICAÇÕES (DASHBOARD STYLE) --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Painel de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Método de Pagamento</CardTitle>
            <CardDescription>Gerencie seus cartões e faturamento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <CreditCard className="h-6 w-6 text-gray-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Visa final 4242</p>
                <p className="text-sm text-gray-500">Expira em 12/2025</p>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                Editar
              </Button>
            </div>

            <div className="space-y-2">
              <Input name="nome_cartao" label="Nome no Cartão" placeholder="João S Silva" variant="filled" size="sm" />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  name="numero"
                  label="Número"
                  placeholder="0000 0000 0000 0000"
                  variant="filled"
                  size="sm"
                  containerClassName="col-span-2"
                />
                <Input name="cvc" label="CVC" placeholder="123" variant="filled" size="sm" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="primary">
              Atualizar Pagamento
            </Button>
          </CardFooter>
        </Card>

        {/* Painel de Notificações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Escolha o que você quer receber.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            {/* Lista Simulada */}
            <div className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
              <BellRing className="mt-1 h-5 w-5 text-gray-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Tudo</p>
                <p className="text-sm text-gray-500">Receber todas as atualizações.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
              <User className="mt-1 h-5 w-5 text-gray-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Apenas Menções</p>
                <p className="text-sm text-gray-500">Apenas quando me citarem.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
              <Settings className="mt-1 h-5 w-5 text-gray-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Sistema</p>
                <p className="text-sm text-gray-500">Alertas de segurança e manutenção.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-gray-500">
              <Check className="mr-2 h-4 w-4" /> Marcar todas como lidas
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default TabCard;
