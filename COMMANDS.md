# Ticket Sports - Comandos Úteis

## 🚀 Development

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm run start
```

## 🗄️ Database (Prisma)

```bash
# Gerar Prisma Client
npm run db:generate
# ou
npx prisma generate

# Aplicar schema ao banco (sem migrations)
npm run db:push
# ou
npx prisma db push

# Abrir Prisma Studio (GUI do banco)
npm run db:studio
# ou
npx prisma studio

# Reset completo do banco (CUIDADO!)
npx prisma db push --force-reset

# Ver o SQL que será executado
npx prisma db push --preview-feature
```

## 🔧 Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link ao projeto
vercel link

# Baixar variáveis de ambiente
vercel env pull .env.local

# Ver logs
vercel logs

# Deploy manual
vercel --prod
```

## 🐳 Coolify / PostgreSQL

```bash
# Conectar ao banco via psql
psql "postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# Listar databases
\l

# Conectar a database
\c ticketsports

# Listar tabelas
\dt

# Ver schema de uma tabela
\d User

# Executar query
SELECT * FROM "User";

# Sair
\q
```

## 📧 Testar Serviços

### Testar conexão com banco
```bash
# Via psql
psql "postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# Via Node
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ Connected')).catch(e => console.error('❌', e))"
```

### Testar Stripe (webhook local)
```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe
# ou
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe

# Login
stripe login

# Escutar webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Testar webhook
stripe trigger payment_intent.succeeded
```

## 🔍 Debug

```bash
# Ver variáveis de ambiente
printenv | grep -i "stripe\|database\|nextauth"

# Testar build localmente
npm run build && npm run start

# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json && npm install
```

## 📊 Produção

```bash
# Ver status do deploy
vercel ls

# Ver domínios
vercel domains ls

# Adicionar domínio
vercel domains add seudominio.com

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável de ambiente
vercel env add DATABASE_URL production

# Remover variável
vercel env rm DATABASE_URL production
```

## 🧪 Testes Locais

```bash
# Testar criação de usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456",
    "role": "PARTICIPANT"
  }'

# Testar listagem de eventos
curl http://localhost:3000/api/events
```

## 🔐 Gerar Secrets

```bash
# NEXTAUTH_SECRET (32 caracteres)
openssl rand -base64 32

# NEXTAUTH_SECRET (hex)
openssl rand -hex 32

# UUID
uuidgen
```

## 📝 Git

```bash
# Ver status
git status

# Adicionar todos os arquivos
git add -A

# Commit
git commit -m "feat: sua mensagem"

# Push
git push

# Ver logs
git log --oneline -10

# Ver diferenças
git diff
```

## 🎨 Tailwind

```bash
# Rebuild CSS
npx tailwindcss -i ./app/globals.css -o ./public/output.css

# Watch mode
npx tailwindcss -i ./app/globals.css -o ./public/output.css --watch
```

## 🔄 Backup e Restore

```bash
# Backup do banco PostgreSQL
pg_dump "postgresql://USER:PASSWORD@HOST:5432/DATABASE" > backup.sql

# Restore
psql "postgresql://USER:PASSWORD@HOST:5432/DATABASE" < backup.sql

# Backup apenas schema
pg_dump --schema-only "postgresql://USER:PASSWORD@HOST:5432/DATABASE" > schema.sql

# Backup apenas dados
pg_dump --data-only "postgresql://USER:PASSWORD@HOST:5432/DATABASE" > data.sql
```

## 🚑 Troubleshooting

```bash
# Verificar se porta 3000 está em uso
lsof -i :3000
# Matar processo
kill -9 PID

# Limpar tudo e começar do zero
rm -rf .next node_modules package-lock.json
npm install
npx prisma generate
npx prisma db push
npm run dev

# Verificar versão do Node
node -v
# Precisa ser 18+

# Verificar versão do npm
npm -v
```

## 📱 Mobile (futuro)

```bash
# Iniciar projeto React Native
npx react-native init TicketSportsMobile

# Rodar Android
npx react-native run-android

# Rodar iOS
npx react-native run-ios
```
