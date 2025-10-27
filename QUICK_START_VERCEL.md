# ⚡ Quick Start - Deploy no Vercel em 5 Minutos

## 🎯 Checklist Rápido

### ✅ Antes do Deploy
- [x] Código está no GitHub
- [x] Banco de dados PostgreSQL funcionando
- [ ] Conta no Vercel criada

### 🚀 Passo a Passo

#### 1. Conectar ao Vercel (2 min)
```
1. Acesse: https://vercel.com
2. Clique em "Sign Up" → "Continue with GitHub"
3. Autorize o Vercel a acessar seus repositórios
4. Clique em "Import Project"
5. Selecione o repositório: handfabiano/Esporteok
6. Clique em "Import"
```

#### 2. Configurar Build (1 min)
```
✅ Framework Preset: Next.js
✅ Build Command: npm run build
✅ Output Directory: .next
✅ Install Command: npm install

NÃO MUDE NADA - Está correto!
```

#### 3. Adicionar Variáveis de Ambiente (2 min)
Clique em "Environment Variables" e adicione:

```env
# 1. Banco de Dados
DATABASE_URL
postgres://postgres:Vieira%402025@92.112.176.108:5434/ticketsports?sslmode=require

# 2. URL do Site (MUDE após primeiro deploy!)
NEXTAUTH_URL
https://seu-app.vercel.app

# 3. Secret (Gere em: https://generate-secret.vercel.app/32)
NEXTAUTH_SECRET
[cole a chave gerada]
```

⚠️ Para cada variável:
- Marque: ☑ Production ☑ Preview ☑ Development

#### 4. Deploy! (<1 min)
```
Clique em "Deploy"
Aguarde ~2 minutos
🎉 Site no ar!
```

#### 5. Atualizar NEXTAUTH_URL (1 min)
```
1. Após deploy, copie a URL gerada (ex: https://esporteok.vercel.app)
2. Vá em Settings → Environment Variables
3. Clique em NEXTAUTH_URL
4. Clique em "Edit"
5. Substitua pelo novo valor
6. Clique em "Save"
7. Vá em Deployments → Clique nos 3 pontos → Redeploy
```

---

## 📱 Testando

Após o deploy:
1. ✅ Abra a URL do site
2. ✅ Veja se o header aparece
3. ✅ Clique em "Entrar" (deve abrir tela de login)
4. ✅ Clique em "Cadastrar" (deve abrir tela de cadastro)
5. ✅ No mobile, veja se aparece o menu hamburger (☰)

---

## ⚠️ Se algo der errado

### Build falhou
```bash
# No terminal local, teste:
npm install
npm run build

# Se funcionar local, o problema é variável de ambiente
```

### Menu não aparece
```
Causa: NEXTAUTH_URL ou NEXTAUTH_SECRET faltando
Solução: Verifique se adicionou as 3 variáveis essenciais
```

### Erro de banco de dados
```
Causa: DATABASE_URL incorreta
Solução: Verifique se copiou exatamente como está no .env
```

---

## 📊 Variáveis por Importância

### 🔴 ESSENCIAL (Adicione AGORA)
```
DATABASE_URL          → Banco de dados
NEXTAUTH_URL          → URL do site
NEXTAUTH_SECRET       → Segurança
```

### 🟡 IMPORTANTE (Adicione depois se precisar)
```
GOOGLE_CLIENT_ID      → Login com Google
GOOGLE_CLIENT_SECRET  → Login com Google
STRIPE_*              → Pagamentos
```

### 🟢 OPCIONAL (Features extras)
```
UPLOADTHING_*         → Upload de imagens
RESEND_*              → Envio de emails
```

---

## 🎓 Próximos Passos

Depois que o site estiver no ar:

1. **Testar autenticação**
   - Criar uma conta
   - Fazer login
   - Testar menu mobile

2. **Configurar Google OAuth** (se quiser)
   - Seguir tutorial completo em `TUTORIAL_VARIAVEIS_AMBIENTE.md`

3. **Configurar Stripe** (para pagamentos)
   - Seguir tutorial completo em `TUTORIAL_VARIAVEIS_AMBIENTE.md`

4. **Configurar domínio customizado**
   - Vercel → Settings → Domains
   - Adicionar seu domínio
   - Atualizar `NEXTAUTH_URL` com novo domínio

---

## 💡 Dicas

- 🔄 **Sempre faça redeploy** após mudar variáveis de ambiente
- 🧹 **Limpe o cache** do navegador após cada deploy (Ctrl+Shift+R)
- 🕵️ **Teste em aba anônima** para garantir que não é cache
- 📱 **Teste no mobile** para ver o menu hamburger
- 🔐 **Nunca compartilhe** suas variáveis de ambiente

---

## 🆘 Precisa de ajuda?

1. Verifique: https://vercel.com/docs/deployments/troubleshoot
2. Logs do build: Vercel → Seu projeto → Deployments → Ver logs
3. Runtime logs: Vercel → Seu projeto → Logs

---

**Bom deploy! 🚀**
