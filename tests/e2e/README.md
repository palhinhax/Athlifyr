# Test Users - Quick Start

## 🚀 Setup Rápido

### 1. Criar os Usuários de Teste

```bash
pnpm db:seed:test-users
```

Este comando cria:

- ✅ 8 usuários de teste com diferentes roles (ver docs/test-users.md)
- ✅ Venues de teste (CrossFit Cascais, HYROX Lisboa, Box Funcional Porto)
- ✅ Planos de subscrição
- ✅ Subscrições ativas
- ✅ Sessões de teste

### 2. Login Manual

Aceder a: `http://localhost:3000/auth/signin`

**Credenciais** (password igual para todos: `Test123!`):

| User Type              | Email                   | Role          | Permissions                         |
| ---------------------- | ----------------------- | ------------- | ----------------------------------- |
| **App Admin**          | `admin@athlifyr.com`    | ADMIN         | Acesso total à plataforma           |
| **Box Owner (João)**   | `joao.owner@test.com`   | USER (OWNER)  | Gestão completa do CrossFit Cascais |
| **Coach (Maria)**      | `maria.coach@test.com`  | USER (COACH)  | Treinadora no CrossFit Cascais      |
| **Member (Pedro)**     | `pedro.atleta@test.com` | USER (MEMBER) | Membro do CrossFit Cascais          |
| **Free Athlete (Ana)** | `ana.free@test.com`     | USER          | Atleta independente, sem box        |
| **Multi-Box (Carlos)** | `carlos.multi@test.com` | USER          | Owner HYROX + Membro/Coach outros   |
| **New User (Sofia)**   | `sofia.nova@test.com`   | USER          | Email não verificado                |
| **Banned User**        | `banned@test.com`       | USER (BANNED) | Conta suspensa                      |

### 3. Testar Navegação

**Venues de Teste**:

- `/venues/crossfit-cascais`
- `/venues/hyrox-lisboa`

---

## 🧪 Testes Automatizados

### Instalar Playwright (primeira vez)

```bash
pnpm add -D @playwright/test
pnpm exec playwright install
```

### Executar Todos os Testes

```bash
pnpm test:e2e
```

### Executar com UI Mode (Recomendado)

```bash
pnpm test:e2e:ui
```

### Executar Testes Específicos

```bash
# Apenas admin
pnpm test:e2e:admin

# Apenas gym owner
pnpm test:e2e:gym-owner

# Apenas gym admin
pnpm test:e2e:gym-admin

# Apenas gym coach
pnpm test:e2e:gym-coach

# Apenas user free
pnpm test:e2e:user-free

# Apenas user premium
pnpm test:e2e:user-premium
```

---

## 📋 Checklist de Testes Manuais

### App Admin (`admin@athlifyr.com`)

- [ ] Login → `/admin` → Ver todos os tabs
- [ ] Gerir eventos
- [ ] Gerir venues
- [ ] Gerir users

### Gym Owner (`owner@testgym.com`)

- [ ] Login → `/venues/test-gym-crossfit`
- [ ] Ver tab "Team" ✅
- [ ] Editar venue ✅
- [ ] Criar/editar planos ✅
- [ ] Responder a reviews ✅
- [ ] Gerir membros ✅

### Gym Admin (`admin@testgym.com`)

- [ ] Login → `/venues/test-gym-crossfit`
- [ ] Ver tab "Team" ✅
- [ ] Editar venue ✅
- [ ] NÃO pode eliminar venue ❌
- [ ] Responder a reviews ✅

### Gym Coach (`coach@testgym.com`)

- [ ] Login → `/venues/test-gym-crossfit`
- [ ] NÃO vê tab "Team" ❌
- [ ] NÃO pode editar venue ❌
- [ ] NÃO pode responder reviews ❌
- [ ] Ver sessões públicas ✅

### Free User (`user.free@test.com`)

- [ ] Login → `/venues/test-gym-crossfit`
- [ ] NÃO vê tab "Team" ❌
- [ ] Ver sessões ✅
- [ ] Escrever reviews ✅
- [ ] Recomendar venue ✅
- [ ] Ver botão "Subscribe" nos planos ✅
- [ ] NÃO pode fazer bookings ❌

### Premium User (`user.premium@test.com`)

- [ ] Login → `/venues/test-gym-crossfit`
- [ ] NÃO vê tab "Team" ❌
- [ ] Ver subscrição ativa ✅
- [ ] Fazer bookings ✅
- [ ] Cancelar bookings ✅
- [ ] Escrever reviews ✅

---

## 🔄 Resetar Dados de Teste

Para remover e recriar os usuários de teste:

```bash
# Remover apenas os usuários de teste
pnpm db:studio
# Depois eliminar manualmente:
# - User: admin@athlifyr.com, owner@testgym.com, etc.
# - Venue: test-gym-crossfit

# Recriar
pnpm db:seed:test-users
```

---

## 📖 Documentação Completa

Ver `docs/TEST_USERS.md` para:

- Descrição completa de cada user
- Permissões detalhadas
- Troubleshooting
- Mais exemplos de testes

---

## ⚠️ Importante

- **Nunca usar em produção!**
- Password simples apenas para testes: `Test123!`
- Dados claramente identificados como teste
- Resetar regularmente para garantir consistência

---

## 🆘 Problemas Comuns

### Erro "User already exists"

```bash
# Verificar se já existe
pnpm db:studio
# Eliminar users de teste manualmente
# Executar seed novamente
pnpm db:seed:test-users
```

### Playwright não encontra elementos

```bash
# Verificar se o servidor está a correr
pnpm dev

# Executar testes com debug
pnpm exec playwright test --debug
```

### Venue não aparece

```bash
# Verificar na base de dados
pnpm db:studio
# Procurar por: slug = "test-gym-crossfit"
```

---

**Happy Testing!** 🎉
