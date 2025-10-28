# 🔧 Guia Rápido: Como Configurar o Login de Admin

Este guia irá te ajudar a configurar corretamente o sistema de autenticação administrativa.

## ⚠️ Problema Comum

Se você está tendo problemas para fazer login como admin, provavelmente é porque:

1. ❌ As variáveis de ambiente não estão configuradas corretamente
2. ❌ O banco de dados não foi inicializado (tabelas não criadas)
3. ❌ O usuário admin não foi criado no banco de dados
4. ❌ A chave AUTH_SECRET não está definida

## ✅ Solução em 4 Passos

### Passo 1: Configurar Variáveis de Ambiente

#### No Vercel (Produção):

1. Acesse seu projeto no Vercel
2. Vá em **Settings → Environment Variables**
3. Adicione as seguintes variáveis:

```
AUTH_SECRET=<gere uma chave com: openssl rand -base64 32>
NEXTAUTH_URL=https://seu-dominio.vercel.app
DATABASE_URL=<sua connection string do postgres>
```

4. **IMPORTANTE**: Depois de adicionar, faça um **Redeploy** do projeto

#### Localmente (.env):

Crie/edite o arquivo `.env` na raiz do projeto:

```bash
# Database
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"

# NextAuth
AUTH_SECRET="wxH/i1o4Szy/RJXlYINHYN/GULfbzIw0Pcbne60FSd0="
NEXTAUTH_URL="http://localhost:3000"
```

### Passo 2: Inicializar o Banco de Dados

Primeiro, você precisa criar as tabelas no banco de dados.

#### Via API (Recomendado para Produção):

```bash
# Criar as tabelas no banco
curl -X POST https://seu-app.vercel.app/api/setup/database \
  -H "Content-Type: application/json"
```

Ou simplesmente abra no navegador e acesse:
```
https://seu-app.vercel.app/api/setup/database
```

Aguarde alguns segundos. Você deve ver:
```json
{
  "success": true,
  "message": "Banco de dados inicializado com sucesso",
  "nextStep": "Agora acesse /api/setup/admin para criar o usuário admin"
}
```

### Passo 3: Criar Usuário Admin

Depois de inicializar o banco, crie o admin:

```bash
# Criar admin
curl -X POST https://seu-app.vercel.app/api/setup/admin \
  -H "Content-Type: application/json"
```

Ou acesse no navegador:
```
https://seu-app.vercel.app/api/setup/admin
```

A resposta irá mostrar as credenciais:
```json
{
  "success": true,
  "message": "Usuário admin criado com sucesso",
  "credentials": {
    "email": "admin@ticketsports.com",
    "password": "admin123",
    "warning": "IMPORTANTE: Altere a senha após o primeiro login!"
  }
}
```

#### Opção B: Via Seed (Desenvolvimento Local)

Se você tem acesso local ao banco:

```bash
npm install tsx --save-dev
npm run db:generate
npm run db:seed
```

### Passo 3: Fazer Login

1. Acesse: `https://seu-app.vercel.app/login`
2. Use as credenciais:
   - **Email:** `admin@ticketsports.com`
   - **Senha:** `admin123`
3. Após o login, vá para `/admin` para acessar o painel
4. **IMPORTANTE:** Vá em `/minha-conta/configuracoes` e altere a senha!

## 🔍 Troubleshooting

### Erro: "The table public.User does not exist"

**Solução:**
- ✔️ Execute o Passo 2 → POST /api/setup/database
- ✔️ Aguarde a criação das tabelas completar
- ✔️ Depois execute o Passo 3 → POST /api/setup/admin

### Erro: "Email ou senha incorretos"

**Causas possíveis:**
- ✔️ O banco não foi inicializado → Execute o Passo 2
- ✔️ O usuário admin não foi criado → Execute o Passo 3
- ✔️ AUTH_SECRET está incorreto/faltando → Verifique o Passo 1
- ✔️ Você não fez redeploy após adicionar env vars → Faça redeploy no Vercel

### Erro: "Acesso negado" ao acessar /admin

**Causas possíveis:**
- ✔️ Você não está logado → Faça login primeiro
- ✔️ Seu usuário não tem role ADMIN → Verifique no banco ou recrie o admin
- ✔️ Token de sessão expirou → Faça logout e login novamente

### Como verificar se o admin existe?

Acesse: `https://seu-app.vercel.app/api/setup/admin`

Deve retornar:
```json
{
  "success": true,
  "hasAdmin": true,
  "adminCount": 1,
  "message": "Sistema já possui usuário(s) admin"
}
```

### Como resetar tudo?

1. Exclua o usuário admin do banco (via Prisma Studio ou SQL)
2. Execute novamente: `POST /api/setup/admin`
3. Faça login com as novas credenciais

## 📋 Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] `AUTH_SECRET` está definido no Vercel/env
- [ ] `NEXTAUTH_URL` está definido corretamente
- [ ] `DATABASE_URL` está correto e acessível
- [ ] Você fez **Redeploy** no Vercel após adicionar as variáveis
- [ ] As tabelas foram criadas (POST /api/setup/database)
- [ ] O usuário admin foi criado (POST /api/setup/admin)
- [ ] Você está usando o email e senha corretos
- [ ] O browser não está bloqueando cookies

## 🆘 Ainda não funciona?

Se seguiu todos os passos e ainda não funciona:

1. Verifique os logs no Vercel (Runtime Logs)
2. Abra o console do navegador (F12) e veja se há erros
3. Teste fazer login com outro usuário para ver se é problema do admin ou da autenticação em geral
4. Verifique se o banco de dados está online e acessível

## ✨ Sucesso!

Quando tudo estiver funcionando, você verá:

1. ✅ Login bem-sucedido
2. ✅ Redirecionamento para a página inicial
3. ✅ Acesso liberado para `/admin`
4. ✅ Painel administrativo carregando com estatísticas

---

**Próximos passos:**
- Altere a senha padrão em `/minha-conta/configuracoes`
- Configure outras variáveis de ambiente (Stripe, Google OAuth, etc)
- Comece a usar o painel admin em `/admin`
