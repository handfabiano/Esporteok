# Ticket Sports - Plataforma de Eventos Esportivos

Clone moderno e eficiente do [TicketSports.com.br](https://www.ticketsports.com.br/), desenvolvido com as tecnologias mais recentes (2025).

## Sobre o Projeto

Marketplace completo para eventos esportivos que conecta organizadores e atletas. A plataforma oferece:

### Para Participantes/Atletas
- Calendário completo de eventos esportivos
- Inscrição online rápida e segura
- Gestão de inscrições e pagamentos
- Consulta de resultados
- Perfil de atleta com histórico

### Para Organizadores
- Criação e gestão de eventos
- Dashboard com analytics
- Sistema de categorias e preços
- Gerenciamento de inscrições
- Controle de pagamentos

### Modalidades Suportadas
- Corrida
- Ciclismo
- Natação
- Triathlon
- MTB (Mountain Bike)
- Trail Running
- Caminhada
- E outros

## Stack Tecnológica

### Frontend & Backend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos

### Banco de Dados & ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Prisma](https://www.prisma.io/)** - ORM type-safe moderno

### Autenticação
- **[NextAuth.js v5](https://authjs.dev/)** - Autenticação completa

### Pagamentos
- **[Stripe](https://stripe.com/)** - Gateway de pagamento

### Deploy
- **[Vercel](https://vercel.com/)** - Plataforma otimizada para Next.js

## Instalação

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm, yarn ou pnpm

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Esporte
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ticketsports?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui-gere-com-openssl-rand-base64-32"

# Stripe (opcional por enquanto)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

4. **Configure o banco de dados**
```bash
# Gerar o Prisma Client
npm run db:generate

# Criar as tabelas no banco
npm run db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter
npm run db:generate  # Gera Prisma Client
npm run db:push      # Atualiza schema do banco
npm run db:studio    # Abre Prisma Studio (GUI do banco)
```

## Estrutura do Projeto

```
Esporte/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API Routes
│   │   ├── events/          # Endpoints de eventos
│   │   └── registrations/   # Endpoints de inscrições
│   ├── eventos/             # Páginas de eventos
│   │   ├── [slug]/         # Detalhes do evento
│   │   └── page.tsx        # Lista de eventos
│   ├── calendario/          # Página de calendário
│   ├── layout.tsx           # Layout raiz
│   ├── page.tsx             # Homepage
│   └── globals.css          # Estilos globais
├── components/
│   └── ui/                  # Componentes UI (shadcn)
├── lib/
│   ├── prisma.ts            # Cliente Prisma
│   └── utils.ts             # Utilitários
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Modelos de Dados (Prisma)

### User (Usuário)
- Informações pessoais
- Autenticação
- Role (PARTICIPANT, ORGANIZER, ADMIN)

### Event (Evento)
- Informações do evento
- Localização e datas
- Status e tipo
- Relacionamento com organizador

### Category (Categoria)
- Categorias de um evento
- Preços e limites
- Restrições (idade, gênero)

### Registration (Inscrição)
- Inscrição do atleta
- Status e informações adicionais
- Relacionamento com evento e categoria

### Payment (Pagamento)
- Controle de pagamentos
- Integração com Stripe
- Status e metadata

## API Routes

### Eventos

**GET /api/events**
- Lista todos os eventos
- Query params: `type`, `city`, `status`

**POST /api/events**
- Cria novo evento
- Requer autenticação (TODO)

**GET /api/events/[id]**
- Busca evento por ID
- Inclui organizador, categorias e inscrições

**PUT /api/events/[id]**
- Atualiza evento
- Requer autenticação (TODO)

**DELETE /api/events/[id]**
- Deleta evento
- Requer autenticação (TODO)

### Inscrições

**POST /api/registrations**
- Cria nova inscrição
- Cria pagamento pendente

**GET /api/registrations**
- Lista inscrições do usuário
- Query param: `userId`

## Próximos Passos (Roadmap)

### Autenticação
- [ ] Implementar NextAuth.js
- [ ] Login com email/senha
- [ ] Login social (Google, Facebook)
- [ ] Recuperação de senha

### Área do Organizador
- [ ] Dashboard de organizador
- [ ] Criação de eventos
- [ ] Gestão de inscrições
- [ ] Relatórios e analytics
- [ ] Exportação de dados

### Sistema de Pagamentos
- [ ] Integração Stripe completa
- [ ] Checkout de inscrição
- [ ] Webhooks de pagamento
- [ ] Reembolsos

### Funcionalidades Avançadas
- [ ] Sistema de resultados
- [ ] Upload de imagens
- [ ] Certificados digitais
- [ ] Notificações por email
- [ ] App mobile (React Native)

### Melhorias
- [ ] Testes automatizados
- [ ] Cache com Redis
- [ ] CDN para imagens
- [ ] Busca avançada
- [ ] Filtros dinâmicos

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é um clone educacional desenvolvido para fins de estudo e demonstração.

## Suporte

Para dúvidas e suporte, abra uma issue no GitHub.

---

Desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Prisma