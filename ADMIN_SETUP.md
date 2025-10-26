# 🔐 Painel Administrativo - Setup e Uso

## 📋 Funcionalidades Implementadas

### ✅ Gestão de Perfil do Usuário
- **Rota:** `/minha-conta/configuracoes`
- Editar nome, telefone, CPF
- Alterar senha
- Validação completa

### ✅ Painel Admin Completo
- **Rota:** `/admin`
- Dashboard com estatísticas
- Gestão completa de usuários (CRUD)
- Proteção por role ADMIN

### ✅ Gestão de Usuários (Admin)
- **Rota:** `/admin/usuarios`
- Listar todos os usuários
- Buscar por nome/email/CPF
- Editar qualquer usuário
- Alterar role (PARTICIPANT ↔ ORGANIZER ↔ ADMIN)
- Excluir usuários
- Ver número de inscrições por usuário

---

## 🚀 Como Usar

### 1️⃣ Criar Usuário Admin Inicial

Execute o script de seed para criar o primeiro admin:

```bash
npm run db:seed
```

**Credenciais padrão criadas:**
- **Admin:**
  - Email: `admin@ticketsports.com`
  - Senha: `admin123`
  - ⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

- **Organizador (teste):**
  - Email: `organizador@test.com`
  - Senha: `123456`

- **Participante (teste):**
  - Email: `participante@test.com`
  - Senha: `123456`

---

### 2️⃣ Fazer Login como Admin

1. Acesse: `https://seu-app.vercel.app/login`
2. Entre com:
   - Email: `admin@ticketsports.com`
   - Senha: `admin123`
3. Você será redirecionado para a página inicial
4. Acesse: `https://seu-app.vercel.app/admin`

---

### 3️⃣ Alterar Senha do Admin

1. Acesse: `/minha-conta/configuracoes`
2. Role até "Alterar Senha"
3. Digite:
   - Senha Atual: `admin123`
   - Nova Senha: (sua senha segura)
   - Confirmar: (mesma senha)
4. Clique em "Alterar Senha"

---

## 🔒 Níveis de Acesso

### ADMIN
- ✅ Acesso total ao painel `/admin`
- ✅ Gerenciar todos os usuários
- ✅ Gerenciar todos os eventos
- ✅ Ver estatísticas completas
- ✅ Alterar role de qualquer usuário

### ORGANIZER
- ✅ Criar eventos
- ✅ Gerenciar próprios eventos
- ✅ Ver inscrições dos seus eventos
- ❌ Não acessa `/admin`

### PARTICIPANT
- ✅ Se inscrever em eventos
- ✅ Ver próprias inscrições
- ✅ Editar próprio perfil
- ❌ Não cria eventos
- ❌ Não acessa `/admin`

---

## 📍 Rotas Criadas

### Páginas
- `/admin` - Dashboard administrativo
- `/admin/usuarios` - Gestão de usuários
- `/minha-conta/configuracoes` - Editar perfil

### APIs
- `GET /api/admin/users` - Listar usuários (admin only)
- `PUT /api/admin/users/[id]` - Atualizar usuário (admin only)
- `DELETE /api/admin/users/[id]` - Excluir usuário (admin only)
- `PUT /api/user/profile` - Atualizar próprio perfil
- `PUT /api/user/password` - Alterar própria senha

---

## 🛡️ Segurança

### Proteção de Rotas
- ✅ Middleware atualizado com proteção de rotas
- ✅ Rotas `/admin/*` requerem role ADMIN
- ✅ Rotas `/organizador/*` requerem login
- ✅ Rotas `/minha-conta/*` requerem login
- ✅ APIs de admin verificam role no servidor

### Validações
- ✅ Email único
- ✅ CPF único
- ✅ Senha mínima 6 caracteres
- ✅ Hash bcrypt para senhas
- ✅ Validação com Zod

### Restrições
- ❌ Admin não pode excluir a própria conta
- ❌ Email não pode ser alterado
- ❌ Não pode excluir usuário com dados relacionados

---

## 🎯 Próximos Passos Recomendados

### Segurança
1. **TROCAR SENHA DO ADMIN** após primeiro login
2. Considerar adicionar 2FA
3. Implementar log de ações admin
4. Adicionar limite de tentativas de login

### Funcionalidades
1. Exportar lista de usuários (CSV/Excel)
2. Enviar email para usuários
3. Suspender/bloquear usuários temporariamente
4. Gestão de eventos pelo admin
5. Gestão financeira

---

## 📊 Como Testar

### Teste Completo do Admin
1. ✅ Login como admin
2. ✅ Acesse `/admin` - Veja dashboard
3. ✅ Acesse `/admin/usuarios` - Veja lista
4. ✅ Clique em Editar um usuário
5. ✅ Altere o role de PARTICIPANT para ORGANIZER
6. ✅ Salve - Verifique alteração
7. ✅ Faça busca por nome/email
8. ✅ Teste exclusão de usuário

### Teste Editar Perfil
1. ✅ Login com qualquer usuário
2. ✅ Acesse `/minha-conta/configuracoes`
3. ✅ Altere nome, telefone, CPF
4. ✅ Salve - Veja mensagem de sucesso
5. ✅ Altere senha
6. ✅ Faça logout e login com nova senha

---

## ❓ Troubleshooting

### "Acesso negado" ao tentar acessar /admin
- ✔️ Verifique se está logado
- ✔️ Verifique se seu usuário tem role ADMIN
- ✔️ Execute `npm run db:seed` para criar admin

### Não consigo fazer login
- ✔️ Verifique se o email está correto
- ✔️ Verifique se a senha está correta
- ✔️ Verifique se executou `npm run db:seed`

### Erro ao executar seed
- ✔️ Verifique se DATABASE_URL está configurada
- ✔️ Execute `npm run db:push` primeiro
- ✔️ Verifique logs de erro

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do console do navegador (F12)
2. Verifique logs do Vercel (Runtime Logs)
3. Verifique se todas as variáveis de ambiente estão configuradas

---

**✨ Painel Admin criado com Claude Code**
