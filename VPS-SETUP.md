# 🖥️ O QUE INSTALAR NA VPS (Hostinger + Coolify)

## ✅ O QUE VOCÊ JÁ TEM
- ✅ VPS Hostinger
- ✅ Coolify instalado

## 🎯 O QUE VOCÊ PRECISA INSTALAR NA VPS

### RESUMO RÁPIDO:
Na VPS você só precisa de **1 coisa**:
- **PostgreSQL** (banco de dados)

Todo o resto (Stripe, UploadThing, Resend) são serviços EXTERNOS (não vão na VPS).

---

## 📦 1. POSTGRESQL NO COOLIFY

### O que é?
PostgreSQL é o banco de dados onde ficam:
- Usuários
- Eventos
- Inscrições
- Pagamentos
- Resultados
- Notificações

### Como instalar no Coolify:

1. **Acesse o painel do Coolify**
   ```
   http://SEU-IP-DA-VPS:8000
   ou
   https://coolify.seudominio.com
   ```

2. **Criar novo banco**
   - Clique em: `+ New Resource`
   - Selecione: `Database`
   - Escolha: `PostgreSQL`

3. **Configurar o banco**
   ```
   Name: ticketsports-db
   PostgreSQL Version: 16 (ou latest)
   Database Name: ticketsports
   Username: ticketsports_user
   Password: [CRIE UMA SENHA FORTE - exemplo: T1ck3tSp0rts#2025!]
   Port: 5432
   ```

4. **Configurações importantes**
   - ✅ Marque: `Make it publicly available` (para Vercel acessar)
   - ✅ Anote a porta pública (ex: 54321)
   - ✅ Copie a Connection String

5. **Connection String vai ser algo assim:**
   ```
   postgresql://ticketsports_user:SUA_SENHA@SEU-IP-OU-DOMINIO:PORTA/ticketsports
   ```

   **Exemplos reais:**
   ```
   postgresql://ticketsports_user:T1ck3tSp0rts#2025!@123.456.789.10:5432/ticketsports

   ou com domínio:

   postgresql://ticketsports_user:T1ck3tSp0rts#2025!@vps.seudominio.com:5432/ticketsports
   ```

---

## 🔒 2. CONFIGURAR FIREWALL (IMPORTANTE!)

Se o PostgreSQL não conectar da Vercel, você precisa liberar a porta no firewall.

### No Ubuntu/Debian:

```bash
# SSH na VPS
ssh root@seu-ip

# Liberar porta do PostgreSQL (5432 ou a porta que o Coolify atribuiu)
sudo ufw allow 5432/tcp

# Verificar status
sudo ufw status
```

### No Coolify:
O Coolify geralmente já configura isso automaticamente quando você marca "publicly available".

---

## 🧪 3. TESTAR SE ESTÁ FUNCIONANDO

### Opção A: Testar da sua máquina local

```bash
# Instalar cliente PostgreSQL (se não tiver)
# Ubuntu/Debian:
sudo apt install postgresql-client

# macOS:
brew install postgresql

# Windows:
# Baixar pgAdmin ou usar WSL

# Testar conexão
psql "postgresql://ticketsports_user:SUA_SENHA@SEU-IP:5432/ticketsports"

# Se conectar e aparecer: ticketsports=>
# Significa que está funcionando!

# Para sair:
\q
```

### Opção B: Usar ferramenta visual

**TablePlus** (recomendado - grátis):
- Download: https://tableplus.com
- Criar nova conexão PostgreSQL
- Preencher os dados
- Testar conexão

**pgAdmin** (alternativa):
- Download: https://www.pgadmin.org
- Mais pesado, mas completo

---

## 📋 CHECKLIST - VPS

- [ ] Coolify já instalado ✅ (você já tem)
- [ ] PostgreSQL criado no Coolify
- [ ] Porta configurada como pública
- [ ] Firewall liberado (se necessário)
- [ ] Connection string copiada
- [ ] Teste de conexão funcionando

---

## ❌ O QUE **NÃO** PRECISA INSTALAR NA VPS

Estes serviços são EXTERNOS (na nuvem):

1. **Stripe** ❌
   - Não instala nada
   - Só cria conta e copia chaves
   - Site: https://stripe.com

2. **UploadThing** ❌
   - Não instala nada
   - Só cria conta e copia chaves
   - Site: https://uploadthing.com

3. **Resend** ❌
   - Não instala nada
   - Só cria conta e copia chaves
   - Site: https://resend.com

4. **Vercel** ❌
   - Não instala nada
   - App roda na Vercel (já fez deploy)
   - Site: https://vercel.com

---

## 🎯 RESUMO FINAL

### NA VPS (Coolify):
```
✅ PostgreSQL
```

### SERVIÇOS EXTERNOS (contas online):
```
✅ Stripe (pagamentos)
✅ UploadThing (upload de imagens)
✅ Resend (emails)
✅ Vercel (onde o app roda)
```

---

## 🚀 PRÓXIMO PASSO

Depois de criar o PostgreSQL no Coolify:

1. **Copie a Connection String**
   ```
   postgresql://ticketsports_user:SUA_SENHA@SEU-IP:5432/ticketsports
   ```

2. **Vá para a Vercel** e adicione nas variáveis de ambiente

3. **Execute as migrations** (veja DEPLOY.md)

4. **Teste o app!**

---

## 🆘 PROBLEMAS COMUNS

### "Connection refused" ou "timeout"
**Solução:**
1. Verifique se PostgreSQL está rodando no Coolify
2. Verifique firewall: `sudo ufw status`
3. Teste com IP público, não localhost
4. Verifique se marcou "publicly available" no Coolify

### "Password authentication failed"
**Solução:**
1. Verifique usuário e senha
2. Escape caracteres especiais na URL:
   - `#` vira `%23`
   - `@` vira `%40`
   - `!` vira `%21`

Exemplo:
```
Senha: T1ck3t#2025!
URL: postgresql://user:T1ck3t%232025%21@host:5432/db
```

### "Database does not exist"
**Solução:**
Conecte e crie:
```bash
psql "postgresql://ticketsports_user:SENHA@IP:5432/postgres"
CREATE DATABASE ticketsports;
\q
```

---

## 💡 DICA PRO

Se você tiver um domínio, aponte um subdomínio para o IP da VPS:

```
db.seudominio.com → IP da VPS
```

Aí pode usar:
```
postgresql://ticketsports_user:SENHA@db.seudominio.com:5432/ticketsports
```

Fica mais profissional e fácil de lembrar!

---

## 📞 SUPORTE

Se tiver problema:
1. Veja logs do Coolify (clique no PostgreSQL)
2. Teste conexão local primeiro
3. Verifique firewall
4. Verifique se a porta está correta

**Comando debug útil:**
```bash
# Ver se porta está aberta
telnet SEU-IP 5432

# Se conectar, a porta está aberta!
# Ctrl+C para sair
```

---

✅ **Pronto! Com apenas o PostgreSQL na VPS, seu projeto está completo!**
