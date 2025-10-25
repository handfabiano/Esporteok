# Guia: Separar Branches em Repositórios Independentes

Este guia explica como transformar as duas branches deste repositório em dois repositórios separados, cada um com sua própria branch `main`.

## Situação Atual

Você tem um repositório com duas branches:
1. `claude/create-ticket-sports-clone-011CUTGV8xJeRXLmGMFGW2Fa` - Projeto inicial (apenas README)
2. `claude/split-repo-branches-011CUUoWyCrFdXYTShA4jhLS` - Projeto completo Ticket Sports

## Objetivo

Criar dois repositórios separados:
1. **ticket-sports-starter** - Conteúdo da primeira branch
2. **ticket-sports-full** - Conteúdo da segunda branch

Ambos na branch `main`.

---

## Método 1: Scripts Automatizados (Recomendado)

### Pré-requisitos
- Git instalado
- Acesso ao GitHub
- GitHub CLI (`gh`) instalado (opcional, mas recomendado)

### Passos

#### 1. Execute o script de preparação

```bash
# Dê permissão de execução
chmod +x split-repo-step1.sh split-repo-step2.sh

# Execute o script para criar os diretórios
./split-repo-step1.sh
```

Este script vai criar dois diretórios:
- `../ticket-sports-starter/` - Com conteúdo da branch vazia
- `../ticket-sports-full/` - Com conteúdo da branch completa

#### 2. Crie os repositórios no GitHub

**Opção A: Usando GitHub CLI (gh)**

```bash
cd ../ticket-sports-starter
gh repo create ticket-sports-starter --public --source=. --remote=origin --push

cd ../ticket-sports-full
gh repo create ticket-sports-full --public --source=. --remote=origin --push
```

**Opção B: Manualmente pelo GitHub**

1. Acesse https://github.com/new
2. Crie um repositório chamado `ticket-sports-starter`
3. NÃO inicialize com README, .gitignore ou licença
4. Execute:
```bash
cd ../ticket-sports-starter
git remote add origin https://github.com/SEU-USUARIO/ticket-sports-starter.git
git push -u origin main
```

5. Repita para `ticket-sports-full`:
```bash
cd ../ticket-sports-full
git remote add origin https://github.com/SEU-USUARIO/ticket-sports-full.git
git push -u origin main
```

#### 3. Verifique os repositórios

Acesse os repositórios no GitHub e confirme que:
- Ambos estão na branch `main`
- O conteúdo está correto em cada um
- O histórico de commits está preservado

---

## Método 2: Manual (Passo a Passo)

Se preferir fazer manualmente:

### Para o Repositório 1 (ticket-sports-starter)

```bash
# 1. Vá para o diretório pai
cd /home/user

# 2. Crie um novo diretório
mkdir ticket-sports-starter
cd ticket-sports-starter

# 3. Clone o repositório original filtrando apenas a branch desejada
git clone --single-branch --branch claude/create-ticket-sports-clone-011CUTGV8xJeRXLmGMFGW2Fa /home/user/Esporte .

# 4. Remova o remote origin antigo
git remote remove origin

# 5. Renomeie a branch para main
git branch -m claude/create-ticket-sports-clone-011CUTGV8xJeRXLmGMFGW2Fa main

# 6. Limpe referências antigas
git gc --prune=now

# 7. Crie o repositório no GitHub e adicione como remote
git remote add origin https://github.com/SEU-USUARIO/ticket-sports-starter.git

# 8. Faça o push
git push -u origin main
```

### Para o Repositório 2 (ticket-sports-full)

```bash
# 1. Vá para o diretório pai
cd /home/user

# 2. Crie um novo diretório
mkdir ticket-sports-full
cd ticket-sports-full

# 3. Clone o repositório original filtrando apenas a branch desejada
git clone --single-branch --branch claude/split-repo-branches-011CUUoWyCrFdXYTShA4jhLS /home/user/Esporte .

# 4. Remova o remote origin antigo
git remote remove origin

# 5. Renomeie a branch para main
git branch -m claude/split-repo-branches-011CUUoWyCrFdXYTShA4jhLS main

# 6. Limpe referências antigas
git gc --prune=now

# 7. Crie o repositório no GitHub e adicione como remote
git remote add origin https://github.com/SEU-USUARIO/ticket-sports-full.git

# 8. Faça o push
git push -u origin main
```

---

## Método 3: Usando Subtree (Preserva histórico completo)

Este método é mais avançado mas preserva melhor o histórico:

```bash
# Para cada repositório
cd /home/user
mkdir ticket-sports-starter
cd ticket-sports-starter

# Inicie um novo repositório
git init

# Adicione o repo original como remote
git remote add origin-old /home/user/Esporte

# Busque a branch específica
git fetch origin-old claude/create-ticket-sports-clone-011CUTGV8xJeRXLmGMFGW2Fa

# Crie a branch main a partir dela
git checkout -b main origin-old/claude/create-ticket-sports-clone-011CUTGV8xJeRXLmGMFGW2Fa

# Remova o remote antigo
git remote remove origin-old

# Continue com criação do repo no GitHub...
```

---

## Limpeza (Opcional)

Depois de confirmar que os novos repositórios estão funcionando:

```bash
# Você pode deletar o repositório original
cd /home/user
rm -rf Esporte
```

**ATENÇÃO**: Só faça isso depois de ter certeza que os novos repositórios estão corretos!

---

## Estrutura Final

Após concluir, você terá:

```
/home/user/
├── ticket-sports-starter/  # Branch main com projeto inicial
│   └── README.md
│
└── ticket-sports-full/     # Branch main com projeto completo
    ├── app/
    ├── components/
    ├── prisma/
    ├── package.json
    └── ... (todos os arquivos do projeto)
```

---

## Dicas Importantes

1. **Teste antes de deletar**: Clone os novos repositórios em outro local e teste se tudo funciona
2. **Backup**: Faça backup do repositório original antes de deletar
3. **Variáveis de ambiente**: Lembre-se de configurar `.env` nos novos repositórios
4. **Dependências**: Execute `npm install` nos novos repositórios antes de usar

---

## Resolução de Problemas

### Erro: "fatal: destination path exists"
```bash
rm -rf <diretorio-destino>
# Tente novamente
```

### Erro ao fazer push: "permission denied"
```bash
# Configure suas credenciais do GitHub
gh auth login
# ou
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Branch não renomeia
```bash
git checkout <nome-branch-antiga>
git branch -m main
git branch -a  # Verifica
```

---

## Suporte

Se tiver problemas, verifique:
- Versão do Git: `git --version` (recomendado: 2.30+)
- GitHub CLI: `gh --version`
- Permissões de escrita nos diretórios
- Conexão com GitHub: `ssh -T git@github.com`
