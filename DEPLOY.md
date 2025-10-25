# Guia Completo de Deploy - Ticket Sports

## 🎯 Visão Geral

Você precisará configurar:
1. **PostgreSQL** no Coolify (VPS Hostinger)
2. **Variáveis de ambiente** na Vercel
3. **Serviços externos** (Stripe, UploadThing, Resend)
4. **Database migrations** (Prisma)

---

## 📦 PARTE 1: PostgreSQL no Coolify

### Passo 1: Criar banco PostgreSQL no Coolify

1. **Acesse o Coolify** na sua VPS
   - URL: `http://seu-ip:8000` ou seu domínio

2. **Crie um novo Banco de Dados**
   - Vá em: `Resources` → `+ New` → `Database`
   - Selecione: **PostgreSQL**
   - Configure:
     ```
     Name: ticketsports-db
     PostgreSQL Version: 16 (ou latest)
     Database Name: ticketsports
     Username: ticketsports_user
     Password: [GERE UMA SENHA FORTE]
     Port: 5432
     ```

3. **Anote a Connection String**
   Após criar, o Coolify vai gerar uma connection string como:
   ```
   postgresql://ticketsports_user:SUA_SENHA@seu-ip-ou-dominio:5432/ticketsports
   ```

4. **Configurar Acesso Externo** (para Vercel acessar)
   - No Coolify, vá em configurações do PostgreSQL
   - Habilite: **Public Port** ou **Allow External Connections**
   - Anote a URL pública (pode ser algo como):
     ```
     postgresql://ticketsports_user:SUA_SENHA@seu-dominio.com:5432/ticketsports
     ```

### Passo 2: Testar Conexão (Opcional)

Se quiser testar localmente:

```bash
# Instalar psql (se não tiver)
# Ubuntu/Debian:
sudo apt install postgresql-client

# Testar conexão
psql "postgresql://ticketsports_user:SUA_SENHA@seu-ip:5432/ticketsports"

# Se conectar, está funcionando!
# Sair: \q
```

---

## 🔧 PARTE 2: Configurar Serviços Externos

### 1. Stripe (Pagamentos) 💳

**a) Criar conta Stripe**
- Acesse: https://stripe.com
- Crie uma conta (grátis)
- Ative o modo de testes

**b) Obter chaves da API**
1. Vá em: `Developers` → `API Keys`
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

**c) Configurar Webhook**
1. Vá em: `Developers` → `Webhooks`
2. Clique: `Add endpoint`
3. URL do endpoint:
   ```
   https://seu-app.vercel.app/api/stripe/webhook
   ```
4. Eventos para ouvir:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copie o **Webhook Secret** (whsec_...)

### 2. UploadThing (Upload de Imagens) 📸

**a) Criar conta**
- Acesse: https://uploadthing.com
- Faça login com GitHub

**b) Criar app**
1. Clique: `Create App`
2. Nome: `ticketsports`

**c) Obter chaves**
1. Vá em: `API Keys`
2. Copie:
   - **App ID**
   - **Secret Key** (sk_live_...)

### 3. Resend (Envio de Emails) 📧

**a) Criar conta**
- Acesse: https://resend.com
- Crie uma conta (100 emails/dia grátis)

**b) Obter API Key**
1. Vá em: `API Keys`
2. Clique: `Create API Key`
3. Nome: `ticketsports-production`
4. Copie a chave (re_...)

**c) Configurar domínio (Opcional - Recomendado)**
1. Vá em: `Domains`
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Use: `noreply@seudominio.com`

OU use o domínio deles:
```
onboarding@resend.dev
```

---

## ⚙️ PARTE 3: Configurar Variáveis de Ambiente na Vercel

### Passo 1: Acessar Vercel

1. Vá em: https://vercel.com
2. Acesse seu projeto
3. Vá em: `Settings` → `Environment Variables`

### Passo 2: Adicionar TODAS as variáveis

```env
# Database
DATABASE_URL=postgresql://ticketsports_user:SUA_SENHA@seu-dominio.com:5432/ticketsports

# NextAuth
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=GERE_UMA_SENHA_ALEATORIA_AQUI_32_CHARS_MIN

# Google OAuth (Opcional - pode pular por enquanto)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=seu-app-id

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM=Ticket Sports <noreply@seudominio.com>
```

### Passo 3: Gerar NEXTAUTH_SECRET

Execute localmente:
```bash
openssl rand -base64 32
```

Copie o resultado e use como `NEXTAUTH_SECRET`

### Passo 4: Salvar e Redeploy

1. Clique em `Save` em cada variável
2. Selecione: `Production`, `Preview`, `Development`
3. Vá em: `Deployments` → clique nos `...` → `Redeploy`

---

## 🗄️ PARTE 4: Executar Database Migrations

### Opção A: Via Vercel CLI (Recomendado)

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Link ao projeto**
   ```bash
   cd Esporte
   vercel link
   ```

4. **Baixar variáveis de ambiente**
   ```bash
   vercel env pull .env.local
   ```

5. **Executar migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Opção B: Localmente (mais simples)

1. **Criar arquivo .env.local**
   ```bash
   cd Esporte
   ```

2. **Copiar .env.example para .env.local**
   ```bash
   cp .env.example .env.local
   ```

3. **Editar .env.local** com as mesmas variáveis da Vercel

4. **Executar migrations**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   ```

5. **Verificar**
   ```bash
   npx prisma studio
   ```
   Isso abrirá uma interface web para ver o banco!

---

## 🔍 PARTE 5: Verificar se está Funcionando

### 1. Teste de Build
```bash
npm run build
```

Se passar sem erros, está OK!

### 2. Teste Local
```bash
npm run dev
```

Acesse: http://localhost:3000

Tente:
- Criar uma conta
- Fazer login
- Criar um evento (se for organizador)

### 3. Teste na Vercel

Acesse: https://seu-app.vercel.app

---

## 🐛 SOLUÇÃO DE PROBLEMAS COMUNS

### Erro: "Can't reach database server"

**Causa:** Banco não está acessível externamente

**Solução:**
1. No Coolify, verifique se o PostgreSQL está com porta pública
2. Verifique firewall da VPS (liberar porta 5432)
3. Teste conexão:
   ```bash
   telnet seu-ip 5432
   ```

### Erro: "Invalid connection string"

**Causa:** URL do banco incorreta

**Solução:**
Formato correto:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Erro: "Table does not exist"

**Causa:** Migrations não foram executadas

**Solução:**
```bash
npx prisma db push --force-reset
```

### Erro no build da Vercel

**Causa:** Prisma não consegue gerar client

**Solução:**
Adicione no package.json:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

E faça commit:
```bash
git add package.json
git commit -m "fix: add postinstall script for prisma"
git push
```

---

## 📝 CHECKLIST FINAL

Antes de considerar completo, verifique:

- [ ] PostgreSQL criado no Coolify
- [ ] Connection string funcionando
- [ ] Conta Stripe criada e chaves copiadas
- [ ] Webhook Stripe configurado
- [ ] Conta UploadThing criada e chaves copiadas
- [ ] Conta Resend criada e API key copiada
- [ ] Todas as variáveis de ambiente na Vercel
- [ ] NEXTAUTH_SECRET gerado
- [ ] Prisma migrations executadas
- [ ] Build local funcionando
- [ ] Deploy na Vercel funcionando
- [ ] Consegue fazer login
- [ ] Consegue criar evento

---

## 🚀 PRÓXIMOS PASSOS

Após tudo configurado:

1. **Criar primeiro usuário organizador**
   - Acesse: https://seu-app.vercel.app/cadastro
   - Selecione: "Organizador"
   - Faça cadastro

2. **Criar primeiro evento**
   - Login → Dashboard Organizador
   - Criar Evento

3. **Testar fluxo completo**
   - Inscrição em evento
   - Pagamento (use cartão de teste Stripe)
   - Upload de resultados

4. **Domínio customizado** (Opcional)
   - Na Vercel: Settings → Domains
   - Adicionar: seudominio.com
   - Configurar DNS conforme instruções

---

## 📞 SUPORTE

Se tiver algum problema:

1. Verifique logs da Vercel
2. Verifique logs do Coolify (PostgreSQL)
3. Teste conexão ao banco localmente
4. Verifique se todas as env vars estão setadas

### Comandos úteis:

```bash
# Ver logs Vercel
vercel logs

# Testar build local
npm run build

# Ver schema do banco
npx prisma studio

# Reset completo do banco (CUIDADO!)
npx prisma db push --force-reset
```

---

## 🎉 Conclusão

Com isso configurado, você terá:
- ✅ Banco PostgreSQL profissional na sua VPS
- ✅ App rodando na Vercel (serverless)
- ✅ Pagamentos com Stripe
- ✅ Upload de imagens com UploadThing
- ✅ Emails com Resend
- ✅ Deploy automático via Git

**Boa sorte! 🚀**
