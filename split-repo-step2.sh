#!/bin/bash

# Script para separar branches em repositórios independentes
# Parte 2: Push para GitHub

set -e  # Parar em caso de erro

echo "======================================"
echo "Separação de Repositórios - Parte 2"
echo "======================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis
PARENT_DIR="/home/user"
STARTER_DIR="$PARENT_DIR/ticket-sports-starter"
FULL_DIR="$PARENT_DIR/ticket-sports-full"

# Verifica se os diretórios existem
if [ ! -d "$STARTER_DIR" ] || [ ! -d "$FULL_DIR" ]; then
    echo -e "${RED}ERRO: Repositórios locais não encontrados!${NC}"
    echo "Execute primeiro o script: ./split-repo-step1.sh"
    exit 1
fi

echo -e "${YELLOW}Este script vai ajudá-lo a fazer push dos repositórios para o GitHub.${NC}"
echo ""
echo "Você precisa ter:"
echo "  1. Conta no GitHub"
echo "  2. GitHub CLI (gh) instalado OU acesso manual ao GitHub"
echo ""

# Verifica se gh está instalado
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓ GitHub CLI (gh) detectado!${NC}"
    echo ""

    # Verifica autenticação
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✓ Você está autenticado no GitHub${NC}"
        echo ""
        USE_GH_CLI=true
    else
        echo -e "${YELLOW}⚠ Você não está autenticado no GitHub CLI${NC}"
        echo ""
        read -p "Deseja fazer login agora? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            gh auth login
            USE_GH_CLI=true
        else
            USE_GH_CLI=false
        fi
    fi
else
    echo -e "${YELLOW}⚠ GitHub CLI (gh) não encontrado${NC}"
    echo "Você pode instalá-lo: https://cli.github.com/"
    echo ""
    USE_GH_CLI=false
fi

# Função para criar e fazer push usando gh CLI
create_and_push_with_gh() {
    local repo_dir=$1
    local repo_name=$2

    echo ""
    echo -e "${BLUE}Processando: $repo_name${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    cd "$repo_dir"

    echo -n "Criando repositório no GitHub... "
    if gh repo create "$repo_name" --public --source=. 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Repositório pode já existir${NC}"
    fi

    echo -n "Adicionando remote origin... "
    git remote remove origin 2>/dev/null || true
    gh repo set-default
    echo -e "${GREEN}✓${NC}"

    echo -n "Fazendo push para main... "
    git push -u origin main --force
    echo -e "${GREEN}✓${NC}"

    echo ""
    echo -e "${GREEN}✓ $repo_name criado com sucesso!${NC}"
    gh repo view --web
}

# Função para instruções manuais
manual_instructions() {
    local repo_dir=$1
    local repo_name=$2

    echo ""
    echo -e "${BLUE}Repositório: $repo_name${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Acesse: ${BLUE}https://github.com/new${NC}"
    echo "2. Nome do repositório: ${GREEN}$repo_name${NC}"
    echo "3. Escolha: Público ou Privado"
    echo "4. ${RED}NÃO${NC} inicialize com README, .gitignore ou licença"
    echo "5. Clique em 'Create repository'"
    echo ""
    read -p "Pressione ENTER quando o repositório estiver criado no GitHub..."
    echo ""

    echo "Digite o URL do repositório (ex: https://github.com/usuario/$repo_name.git):"
    read -r REPO_URL

    cd "$repo_dir"

    echo -n "Adicionando remote... "
    git remote remove origin 2>/dev/null || true
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✓${NC}"

    echo -n "Fazendo push... "
    git push -u origin main
    echo -e "${GREEN}✓${NC}"

    echo ""
    echo -e "${GREEN}✓ $repo_name enviado com sucesso!${NC}"
    echo "Acesse: $REPO_URL"
}

# Processa repositório starter
echo ""
echo "======================================"
echo "REPOSITÓRIO 1: ticket-sports-starter"
echo "======================================"

if [ "$USE_GH_CLI" = true ]; then
    create_and_push_with_gh "$STARTER_DIR" "ticket-sports-starter"
else
    manual_instructions "$STARTER_DIR" "ticket-sports-starter"
fi

# Processa repositório full
echo ""
echo "======================================"
echo "REPOSITÓRIO 2: ticket-sports-full"
echo "======================================"

if [ "$USE_GH_CLI" = true ]; then
    create_and_push_with_gh "$FULL_DIR" "ticket-sports-full"
else
    manual_instructions "$FULL_DIR" "ticket-sports-full"
fi

# Sumário final
echo ""
echo "======================================"
echo -e "${GREEN}PROCESSO CONCLUÍDO!${NC}"
echo "======================================"
echo ""
echo "Seus novos repositórios:"
echo ""
echo -e "  ${GREEN}✓${NC} ticket-sports-starter"
echo "    Projeto inicial (README básico)"
echo ""
echo -e "  ${GREEN}✓${NC} ticket-sports-full"
echo "    Projeto completo Ticket Sports"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo ""
echo "1. Verifique os repositórios no GitHub"
echo "2. Clone em outros lugares se necessário"
echo "3. Configure os arquivos .env nos novos repositórios"
echo "4. Execute npm install nos projetos"
echo ""
echo -e "${YELLOW}Limpeza (OPCIONAL):${NC}"
echo "Após confirmar que tudo funciona, você pode remover o repo original:"
echo "  rm -rf /home/user/Esporte"
echo ""
echo -e "${RED}ATENÇÃO:${NC} Só remova após ter certeza que os novos repos estão OK!"
echo ""
