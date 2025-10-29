# 🔴 Diagnóstico: Erro 500 em /api/auth/register

**Data:** 29 de outubro de 2024
**Status:** Erro identificado - Necessita correção

---

## 🎯 Problema Identificado

Você está recebendo **erro 500** ao tentar criar conta no aplicativo.

```
Failed to load resource: the server responded with a status of 500 ()
```

---

## 🔍 Causa Provável

O erro 500 em `/api/auth/register` indica que as **variáveis de ambiente NÃO estão configuradas** na Vercel ou estão **incorretas**.

### Possíveis causas:

1. ❌ Variável `DATABASE_URL` não configurada ou incorreta
2. ❌ Variável `AUTH_SECRET` não configurada
3. ❌ Prisma não consegue conectar ao PostgreSQL
4. ❌ Senha do PostgreSQL incorreta

---

## ✅ SOLUÇÃO PASSO A PASSO

### PASSO 1: Verificar Variáveis na Vercel

1. Acesse: https://vercel.com
2. Selecione seu projeto **Esporteok**
3. Vá em: **Settings** → **Environment Variables**
4. Verifique se estas 4 variáveis existem:

| Variável | Status |
|----------|--------|
| `DATABASE_URL` | ⚠️ Deve estar configurada |
| `AUTH_SECRET` | ⚠️ Deve estar configurada |
| `NEXTAUTH_URL` | ⚠️ Deve estar configurada |
| `ADMIN_SETUP_KEY` | ⚠️ Deve estar configurada |

---

### PASSO 2: Adicionar Variáveis (Se não existem)

Clique em **"Add"** para cada variável:

#### 1. DATABASE_URL
```
postgresql://postgres:PGA0QYShOxqWBdrGkrpELwstPg9I2O62tyF09eRgUgo=@92.112.176.108:5434/ticketsports?sslmode=require
```
⚠️ **IMPORTANTE:** Use a senha nova que você alterou no PostgreSQL!

Se você **NÃO alterou** a senha ainda:
```
postgresql://postgres:Vieira%402025@92.112.176.108:5434/ticketsports?sslmode=require
```

#### 2. AUTH_SECRET
```
L/wHZronew/4GkmdrrVWoHNmJMWE1Sf1psypskOrVSs=
```

#### 3. NEXTAUTH_URL
```
https://SEU-DOMINIO.vercel.app
```
⚠️ **Substitua** `SEU-DOMINIO` pelo domínio real do seu projeto!

**Como descobrir seu domínio:**
- Na Vercel: **Deployments** → Copie a URL (ex: `esporteok-abc123.vercel.app`)

#### 4. ADMIN_SETUP_KEY
```
jgF58PxB0pd2rvLO/Re+76FCZKoUycAPTxtXykSYjeM=
```

---

### PASSO 3: Configurar Ambiente Correto

**CRÍTICO:** Para cada variável, você DEVE selecionar:

- ✅ **Production** (obrigatório)
- ✅ **Preview** (recomendado)
- ✅ **Development** (recomendado)

Se você marcar apenas "Production", o erro continuará nos previews!

---

### PASSO 4: Redeploy (OBRIGATÓRIO!)

Após adicionar/corrigir as variáveis:

1. Vá em: **Deployments**
2. Clique nos **"..."** do último deploy
3. Clique em: **"Redeploy"**
4. Aguarde o build completar (1-2 minutos)

**⚠️ SEM REDEPLOY, AS VARIÁVEIS NÃO SERÃO APLICADAS!**

---

### PASSO 5: Executar Migrations (Se ainda não fez)

As tabelas precisam existir no banco! No seu terminal local:

```bash
# 1. Configurar .env.local com DATABASE_URL correto
# (já fizemos isso anteriormente)

# 2. Executar migrations
npx prisma db push

# 3. Verificar se tabelas foram criadas
npx prisma studio
# Vai abrir http://localhost:5555 - você deve ver as tabelas User, Event, etc
```

---

### PASSO 6: Testar Novamente

1. Acesse seu aplicativo: `https://seu-dominio.vercel.app`
2. Vá em: **"Criar Conta"**
3. Preencha os dados:
   - Nome: Teste
   - Email: teste@teste.com
   - Senha: Teste123! (precisa ter maiúscula, minúscula e número)
   - Tipo: Participante
4. Clique em **"Criar Conta"**

**✅ Se funcionar:** Você verá mensagem de sucesso!
**❌ Se ainda der erro:** Vá para "Diagnóstico Avançado" abaixo

---

## 🔧 Diagnóstico Avançado

### Como Ver o Erro Exato na Vercel

1. Acesse: https://vercel.com
2. Vá em: **Deployments** → Último deploy
3. Clique em: **"View Function Logs"**
4. Procure por erros em vermelho

**Erros comuns e soluções:**

#### Erro: "Can't reach database server"
```
Solução:
1. Verifique se PostgreSQL está rodando
2. Verifique se a porta 5434 está aberta
3. Teste conexão: telnet 92.112.176.108 5434
```

#### Erro: "AUTH_SECRET is required"
```
Solução:
1. Adicione AUTH_SECRET na Vercel
2. Certifique-se que marcou "Production"
3. Faça Redeploy
```

#### Erro: "Invalid connection string"
```
Solução:
1. Verifique formato da DATABASE_URL
2. Certifique-se que está usando "postgresql://" (não "postgres://")
3. Senha com caracteres especiais deve usar URL encoding
```

#### Erro: "Password authentication failed"
```
Solução:
1. A senha no DATABASE_URL está incorreta
2. Altere a senha no PostgreSQL
3. Atualize DATABASE_URL na Vercel com senha correta
4. Redeploy
```

---

## 📋 Checklist de Verificação

Marque cada item conforme verificar:

- [ ] Acesso à Vercel (login funcionando)
- [ ] DATABASE_URL configurado na Vercel
- [ ] AUTH_SECRET configurado na Vercel
- [ ] NEXTAUTH_URL configurado com domínio correto
- [ ] ADMIN_SETUP_KEY configurado na Vercel
- [ ] Todos os 3 ambientes marcados (Production, Preview, Development)
- [ ] Redeploy realizado após adicionar variáveis
- [ ] Aguardei build completar (não cancelei)
- [ ] Migrations executadas localmente (npx prisma db push)
- [ ] Testei criar conta novamente

---

## 🎯 Status das Correções

### ✅ Corrigido
- Erro 404 em `/privacidade` - Página criada

### ⏳ Aguardando Correção
- Erro 500 em `/api/auth/register` - Depende de configuração na Vercel

---

## 🆘 Ainda com Problema?

Se após seguir todos os passos o erro continuar:

1. **Tire um print das variáveis de ambiente na Vercel**
   - Settings → Environment Variables
   - Esconda apenas os valores (deixe os nomes visíveis)

2. **Copie os logs de erro completos**
   - Deployments → View Function Logs
   - Procure por mensagens em vermelho

3. **Verifique se PostgreSQL está acessível**
   ```bash
   telnet 92.112.176.108 5434
   ```
   Se conectar: está OK
   Se não conectar: problema de firewall/rede

---

## 📞 Comandos Úteis

```bash
# Testar conexão ao banco localmente
npx prisma db pull

# Ver logs da Vercel (se tiver CLI instalado)
vercel logs

# Testar build local (simula Vercel)
npm run build && npm run start

# Verificar variáveis localmente
cat .env.local
```

---

## 🎉 Após Resolver

Quando tudo funcionar:

1. ✅ Criar conta funcionando
2. ✅ Login funcionando
3. ✅ Criar evento (organizadores)
4. ✅ Inscrever-se em evento

**Próximo passo:** Criar usuário admin!

```bash
curl -X POST https://seu-dominio.vercel.app/api/setup/admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@ticketsports.com",
    "password": "SuaSenhaForte123!",
    "setupKey": "jgF58PxB0pd2rvLO/Re+76FCZKoUycAPTxtXykSYjeM="
  }'
```

---

**Criado por:** Claude Code
**Última atualização:** 29/10/2024
