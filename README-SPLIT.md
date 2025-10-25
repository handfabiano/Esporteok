# Guia Rápido: Separar Repositório

## Início Rápido

Você tem 2 branches que serão 2 repositórios:

1. **ticket-sports-starter** - Projeto inicial (só README)
2. **ticket-sports-full** - Projeto completo

## Opção 1: Scripts Automatizados (Mais Fácil)

```bash
# Passo 1: Criar repositórios locais
./split-repo-step1.sh

# Passo 2: Fazer push para GitHub
./split-repo-step2.sh
```

Pronto! Os scripts vão te guiar pelo processo.

## Opção 2: Manual

Siga as instruções detalhadas em: `SPLIT-REPOS.md`

## O que os scripts fazem?

**Step 1:**
- Cria `/home/user/ticket-sports-starter`
- Cria `/home/user/ticket-sports-full`
- Cada um com branch `main` e conteúdo correto

**Step 2:**
- Cria repositórios no GitHub (usa `gh` CLI ou manual)
- Faz push de ambos
- Mostra URLs dos novos repos

## Depois de separar

1. ✓ Verifique os repos no GitHub
2. ✓ Clone onde precisar
3. ✓ Configure `.env` nos novos repos
4. ✓ Execute `npm install` no projeto full

## Ajuda

Problemas? Veja `SPLIT-REPOS.md` para:
- Instruções detalhadas
- Métodos alternativos
- Resolução de problemas
- Suporte

---

**IMPORTANTE:** Teste os novos repositórios antes de deletar o original!
