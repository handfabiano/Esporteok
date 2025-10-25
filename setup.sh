#!/bin/bash

# Script de setup para Ticket Sports
# Execute: chmod +x setup.sh && ./setup.sh

echo "🎯 Ticket Sports - Setup Wizard"
echo "================================"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto!"
    exit 1
fi

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 2. Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais!"
    echo ""
fi

# 3. Gerar NEXTAUTH_SECRET se não existir
if ! grep -q "NEXTAUTH_SECRET=.*[a-zA-Z0-9]" .env; then
    echo "🔐 Gerando NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    # Substituir a linha do NEXTAUTH_SECRET
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    else
        # Linux
        sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    fi
    echo "✅ NEXTAUTH_SECRET gerado!"
fi

# 4. Verificar se DATABASE_URL está configurada
if grep -q "DATABASE_URL=\"postgresql://user:password@localhost" .env; then
    echo ""
    echo "⚠️  ATENÇÃO: Configure a DATABASE_URL no arquivo .env"
    echo "Exemplo:"
    echo "DATABASE_URL=\"postgresql://ticketsports_user:SUA_SENHA@seu-ip:5432/ticketsports\""
    echo ""
    read -p "Deseja continuar mesmo assim? (s/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# 5. Gerar Prisma Client
echo "🗄️  Gerando Prisma Client..."
npx prisma generate

# 6. Perguntar se quer fazer push do schema
echo ""
read -p "Deseja criar as tabelas no banco de dados agora? (s/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🚀 Executando migrations..."
    npx prisma db push
    echo "✅ Tabelas criadas!"
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure todas as variáveis no arquivo .env"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
echo ""
echo "📚 Documentação completa: DEPLOY.md"
echo ""
