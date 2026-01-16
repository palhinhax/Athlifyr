# Modo de Manutenção 🔧

Este documento explica como ativar e desativar o modo de manutenção da aplicação Athlifyr.

## O que é o Modo de Manutenção?

Quando o modo de manutenção está ativado, **todos os utilizadores** (incluindo administradores) veem apenas a página de manutenção. Isto é útil quando precisas de:

- Fazer atualizações críticas na base de dados
- Realizar migrações que possam afetar a aplicação
- Fazer manutenção que possa causar instabilidade
- Atualizar configurações sensíveis

## Como Ativar o Modo de Manutenção

### 1. Adicionar Variável ao `.env`

Adiciona ou atualiza a seguinte variável no teu ficheiro `.env`:

```bash
MAINTENANCE_MODE="true"
```

### 2. Reiniciar a Aplicação

Após alterar o `.env`, reinicia a aplicação:

```bash
# Desenvolvimento
pnpm dev

# Produção
pm2 restart athlifyr
# ou
docker-compose restart
```

### 3. Verificar

Acede a qualquer página da aplicação e deverás ver a página de manutenção.

## Como Desativar o Modo de Manutenção

### 1. Atualizar Variável no `.env`

Altera a variável para `false` ou remove-a completamente:

```bash
MAINTENANCE_MODE="false"
```

ou simplesmente comenta a linha:

```bash
# MAINTENANCE_MODE="true"
```

### 2. Reiniciar a Aplicação

```bash
# Desenvolvimento
pnpm dev

# Produção
pm2 restart athlifyr
```

## Características do Modo de Manutenção

### ✅ O que funciona durante a manutenção:

- Página de manutenção é sempre acessível
- Assets estáticos (CSS, JS, imagens) continuam a funcionar
- Vídeos de fundo na página de manutenção
- Detecção automática de idioma

### ❌ O que não funciona durante a manutenção:

- Todas as páginas da aplicação (home, eventos, perfil, etc.)
- APIs não são acessíveis
- Login e autenticação
- Qualquer funcionalidade da aplicação

## Página de Manutenção

A página de manutenção (`/app/maintenance.tsx`) apresenta:

- **Código HTTP 503** (Service Unavailable)
- **Vídeo de fundo aleatório** da pasta `/public/promo`
- **Traduções em 6 idiomas**: pt, en, es, fr, de, it
- **Botões de ação**:
  - "Voltar ao Início" - redireciona para a homepage (quando manutenção terminar)
  - "Tentar Novamente" - recarrega a página para verificar se a manutenção terminou
- **Ícone de chave inglesa animado** (pulse)

## Boas Práticas

### ✅ Quando Usar

- **Antes de migrações grandes**: Sempre que alterares o schema da base de dados
- **Atualizações críticas**: Quando a aplicação possa ficar instável
- **Manutenção programada**: Avisa os utilizadores com antecedência

### ⚠️ Avisos

1. **Comunica antecipadamente**: Informa os utilizadores sobre a manutenção
2. **Testa primeiro**: Testa as alterações em staging antes de produção
3. **Minimiza o tempo**: Mantém a manutenção o mais curta possível
4. **Verifica depois**: Confirma que tudo funciona após desativar

## Exemplo de Workflow

```bash
# 1. Ativar modo de manutenção
echo 'MAINTENANCE_MODE="true"' >> .env

# 2. Reiniciar aplicação
pm2 restart athlifyr

# 3. Fazer a manutenção necessária
pnpm prisma migrate deploy
# ou qualquer outra operação

# 4. Verificar se tudo está OK
pnpm build
pnpm test

# 5. Desativar modo de manutenção
sed -i 's/MAINTENANCE_MODE="true"/MAINTENANCE_MODE="false"/' .env

# 6. Reiniciar aplicação
pm2 restart athlifyr

# 7. Testar aplicação
curl https://athlifyr.com
```

## Verificar Estado Atual

Para verificar se o modo de manutenção está ativo:

```bash
# Verificar variável de ambiente
grep MAINTENANCE_MODE .env

# Ver logs da aplicação
pm2 logs athlifyr | grep maintenance
```

## Troubleshooting

### Problema: Página de manutenção não aparece

**Solução**:

- Verifica se a variável está corretamente definida no `.env`
- Reinicia a aplicação completamente
- Limpa a cache do Next.js: `rm -rf .next`

### Problema: Não consigo desativar o modo de manutenção

**Solução**:

- Verifica se alteraste o `.env` correto
- Confirma que a aplicação foi reiniciada
- Verifica se não há cache do browser (Ctrl+Shift+R)

### Problema: Assets não carregam durante manutenção

**Solução**:

- Verifica o middleware para garantir que os caminhos estáticos estão excluídos
- Confirma que os ficheiros estão na pasta `/public`

## Notas de Segurança

- ⚠️ **Não faças commit do `.env`**: O ficheiro `.env` nunca deve ir para o Git
- ✅ **Usa `.env.example`**: Documenta as variáveis no `.env.example`
- 🔒 **Protege o acesso**: Em produção, apenas administradores devem poder ativar/desativar

## Relacionado

- [Página 404 (Not Found)](../app/not-found.tsx)
- [Página de Manutenção](../app/maintenance.tsx)
- [Middleware](../middleware.ts)

---

**Última atualização**: 16 de Janeiro de 2026
