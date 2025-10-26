# 🔧 Tutorial: Configurar Variáveis de Ambiente no Vercel

## 📋 Índice
1. [Variáveis ESSENCIAIS (mínimo para funcionar)](#variáveis-essenciais)
2. [Como adicionar no Vercel](#como-adicionar-no-vercel)
3. [Variáveis OPCIONAIS (features adicionais)](#variáveis-opcionais)

---

## ⚠️ Variáveis ESSENCIAIS

Estas variáveis são **obrigatórias** para o sistema funcionar:

### 1. **DATABASE_URL** (Banco de Dados)
**Você já tem configurado!**
```
DATABASE_URL=postgres://postgres:Vieira%402025@92.112.176.108:5434/ticketsports?sslmode=require
```

### 2. **NEXTAUTH_URL** (URL do Site)
```
NEXTAUTH_URL=https://seu-app.vercel.app
```
**Como obter:**
- Após o primeiro deploy no Vercel, você receberá uma URL tipo: `https://esporteok.vercel.app`
- Use essa URL aqui
- ⚠️ **NÃO coloque barra no final** (errado: `https://app.vercel.app/`)

### 3. **NEXTAUTH_SECRET** (Chave Secreta de Criptografia)
```
NEXTAUTH_SECRET=gere-uma-chave-secreta-aqui
```
**Como gerar:**

**Opção A - Online (mais fácil):**
1. Acesse: https://generate-secret.vercel.app/32
2. Copie a chave gerada
3. Cole no Vercel

**Opção B - Terminal:**
```bash
openssl rand -base64 32
```

---

## 🚀 Como Adicionar no Vercel

### Passo 1: Acessar Settings
1. Acesse seu projeto no Vercel: https://vercel.com/dashboard
2. Clique no seu projeto **Esporteok**
3. Clique na aba **Settings** (no topo)
4. No menu lateral, clique em **Environment Variables**

### Passo 2: Adicionar Variáveis
Para cada variável:
1. Em **Key**, coloque o nome (ex: `DATABASE_URL`)
2. Em **Value**, cole o valor
3. Marque **Production**, **Preview** e **Development**
4. Clique em **Save**

### Passo 3: Exemplo Visual
```
┌─────────────────────────────────────────┐
│ Environment Variables                    │
├─────────────────────────────────────────┤
│ Key:   DATABASE_URL                      │
│ Value: postgres://postgres:Vieira...    │
│                                          │
│ ☑ Production  ☑ Preview  ☑ Development │
│                                          │
│           [Save]                         │
└─────────────────────────────────────────┘
```

### Passo 4: Re-deploy
⚠️ **IMPORTANTE:** Após adicionar variáveis, você precisa fazer um novo deploy!

1. Vá na aba **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **Redeploy**
4. Clique em **Redeploy** novamente para confirmar

---

## ✅ Checklist Rápido - MÍNIMO ESSENCIAL

Copie e cole estas 3 variáveis no Vercel:

```env
# 1. Banco de Dados (já configurado)
DATABASE_URL=postgres://postgres:Vieira%402025@92.112.176.108:5434/ticketsports?sslmode=require

# 2. URL do seu site no Vercel (MUDE PARA SUA URL!)
NEXTAUTH_URL=https://seu-app.vercel.app

# 3. Gere em: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET=COLE_A_CHAVE_GERADA_AQUI
```

Com apenas essas 3 variáveis, o sistema já vai funcionar com:
- ✅ Login com email/senha
- ✅ Cadastro de usuários
- ✅ Navegação e menus
- ✅ Criação de eventos
- ✅ Inscrições em eventos

---

## 🎯 Variáveis OPCIONAIS

Adicione depois para ativar features extras:

### 4. **Google OAuth** (Login com Google) - OPCIONAL
```
GOOGLE_CLIENT_ID=seu-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-secret
```

<details>
<summary>📖 Como obter credenciais do Google</summary>

#### Passo 1: Acessar Google Cloud Console
1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google

#### Passo 2: Criar Projeto
1. No topo, clique em **Select a project**
2. Clique em **NEW PROJECT**
3. Nome: "Ticket Sports" ou "Esporteok"
4. Clique em **CREATE**

#### Passo 3: Configurar OAuth
1. No menu lateral, vá em **APIs & Services** → **OAuth consent screen**
2. Escolha **External**
3. Preencha:
   - App name: `Ticket Sports`
   - User support email: seu email
   - Developer email: seu email
4. Clique em **Save and Continue** (3x)

#### Passo 4: Criar Credenciais
1. Vá em **Credentials** (menu lateral)
2. Clique em **+ CREATE CREDENTIALS**
3. Escolha **OAuth client ID**
4. Application type: **Web application**
5. Name: `Ticket Sports Web`
6. **Authorized redirect URIs**, adicione:
   ```
   https://seu-app.vercel.app/api/auth/callback/google
   ```
7. Clique em **CREATE**

#### Passo 5: Copiar Credenciais
- **Client ID**: cole em `GOOGLE_CLIENT_ID`
- **Client Secret**: cole em `GOOGLE_CLIENT_SECRET`

</details>

### 5. **Stripe** (Pagamentos) - OPCIONAL
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

<details>
<summary>📖 Como obter chaves do Stripe</summary>

1. Acesse: https://stripe.com
2. Crie uma conta (gratuito)
3. Vá em **Developers** → **API Keys**
4. Copie:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
5. Para `STRIPE_WEBHOOK_SECRET`:
   - Vá em **Developers** → **Webhooks**
   - Clique em **Add endpoint**
   - URL: `https://seu-app.vercel.app/api/stripe/webhook`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copie o **Signing secret**

</details>

### 6. **UploadThing** (Upload de Imagens) - OPCIONAL
```
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=seu-app-id
```

<details>
<summary>📖 Como obter chaves do UploadThing</summary>

1. Acesse: https://uploadthing.com
2. Faça login com GitHub
3. Clique em **New App**
4. Nome: "Ticket Sports"
5. Copie:
   - **Secret** → `UPLOADTHING_SECRET`
   - **App ID** → `UPLOADTHING_APP_ID`

</details>

### 7. **Resend** (Envio de Emails) - OPCIONAL
```
RESEND_API_KEY=re_...
EMAIL_FROM=Ticket Sports <noreply@seudominio.com>
```

<details>
<summary>📖 Como obter chave do Resend</summary>

1. Acesse: https://resend.com
2. Crie uma conta (gratuito - 100 emails/dia)
3. Vá em **API Keys**
4. Clique em **Create API Key**
5. Nome: "Production"
6. Copie a chave → `RESEND_API_KEY`
7. Para `EMAIL_FROM`:
   - Se não tem domínio: `Ticket Sports <onboarding@resend.dev>`
   - Se tem domínio: configure em **Domains** primeiro

</details>

---

## 🎬 Resumo Final

### Para começar AGORA (apenas o essencial):
1. ✅ `DATABASE_URL` - Já tem!
2. 🔧 `NEXTAUTH_URL` - Pegar no Vercel após deploy
3. 🔑 `NEXTAUTH_SECRET` - Gerar em https://generate-secret.vercel.app/32

### Para depois (features extras):
- 🔐 Google OAuth - Login social
- 💳 Stripe - Pagamentos
- 📷 UploadThing - Upload de imagens
- 📧 Resend - Emails transacionais

---

## ❓ Problemas Comuns

### Menu não aparece após deploy
**Causa:** `NEXTAUTH_URL` ou `NEXTAUTH_SECRET` faltando
**Solução:** Adicione as 3 variáveis essenciais e faça redeploy

### Erro de banco de dados
**Causa:** `DATABASE_URL` incorreta
**Solução:** Verifique se a URL está exatamente como está no arquivo .env

### Login não funciona
**Causa:** `NEXTAUTH_SECRET` não foi configurado
**Solução:** Gere um novo secret e adicione no Vercel

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique se todas as 3 variáveis essenciais estão configuradas
2. Verifique se fez redeploy após adicionar variáveis
3. Limpe cache do navegador (Ctrl + Shift + R)
4. Abra em aba anônima para testar

---

**Criado com 🤖 Claude Code**
