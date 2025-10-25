#!/bin/bash

# Script para separar branches em repositórios independentes
# Parte 1: Criação dos diretórios locais

set -e  # Parar em caso de erro

echo "======================================"
echo "Separação de Repositórios - Parte 1"
echo "======================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variáveis
CURRENT_REPO="/home/user/Esporte"
PARENT_DIR="/home/user"
STARTER_DIR="$PARENT_DIR/ticket-sports-starter"
FULL_DIR="$PARENT_DIR/ticket-sports-full"
BRANCH_STARTER="claude/create-ticket-sports-clone-011CUTGV8xJeRXLmGMFGW2Fa"
BRANCH_FULL="claude/split-repo-branches-011CUUoWyCrFdXYTShA4jhLS"

echo -e "${YELLOW}Este script irá criar dois novos repositórios:${NC}"
echo "  1. ticket-sports-starter (projeto inicial)"
echo "  2. ticket-sports-full (projeto completo)"
echo ""
echo -e "${YELLOW}Localização: $PARENT_DIR${NC}"
echo ""
read -p "Continuar? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operação cancelada."
    exit 1
fi

# Função para criar repositório a partir de uma branch
create_repo_from_branch() {
    local repo_name=$1
    local branch_name=$2
    local target_dir=$3

    echo ""
    echo -e "${GREEN}Criando repositório: $repo_name${NC}"
    echo "Branch origem: $branch_name"
    echo "Destino: $target_dir"
    echo ""

    # Remove diretório se já existir
    if [ -d "$target_dir" ]; then
        echo -e "${YELLOW}Diretório $target_dir já existe. Removendo...${NC}"
        rm -rf "$target_dir"
    fi

    # Cria diretório
    mkdir -p "$target_dir"
    cd "$target_dir"

    # Inicializa git
    git init
    echo "  ✓ Git inicializado"

    # Adiciona remote temporário
    git remote add temp "$CURRENT_REPO"
    echo "  ✓ Remote temporário adicionado"

    # Busca apenas a branch específica
    git fetch temp "$branch_name"
    echo "  ✓ Branch fetchada"

    # Cria branch main a partir da branch origem
    git checkout -b main "temp/$branch_name"
    echo "  ✓ Branch main criada"

    # Remove remote temporário
    git remote remove temp
    echo "  ✓ Remote temporário removido"

    # Limpa referências
    git gc --prune=now --quiet
    echo "  ✓ Repositório limpo"

    echo -e "${GREEN}✓ Repositório $repo_name criado com sucesso!${NC}"
}

# Cria repositório starter
create_repo_from_branch "ticket-sports-starter" "$BRANCH_STARTER" "$STARTER_DIR"

# Cria repositório full
create_repo_from_branch "ticket-sports-full" "$BRANCH_FULL" "$FULL_DIR"

# Sumário
echo ""
echo "======================================"
echo -e "${GREEN}PARTE 1 CONCLUÍDA COM SUCESSO!${NC}"
echo "======================================"
echo ""
echo "Repositórios criados:"
echo "  1. $STARTER_DIR"
echo "  2. $FULL_DIR"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo ""
echo "Execute o script da Parte 2 para criar os repositórios no GitHub:"
echo "  ./split-repo-step2.sh"
echo ""
echo "OU faça manualmente:"
echo ""
echo "1. Crie os repositórios no GitHub:"
echo "   - ticket-sports-starter"
echo "   - ticket-sports-full"
echo ""
echo "2. Adicione os remotes e faça push:"
echo ""
echo "   cd $STARTER_DIR"
echo "   git remote add origin https://github.com/SEU-USUARIO/ticket-sports-starter.git"
echo "   git push -u origin main"
echo ""
echo "   cd $FULL_DIR"
echo "   git remote add origin https://github.com/SEU-USUARIO/ticket-sports-full.git"
echo "   git push -u origin main"
echo ""
