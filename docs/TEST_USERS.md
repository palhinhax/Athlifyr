# Test Users - Athlifyr

Este documento contém informações sobre os usuários de teste criados para validação de funcionalidades e permissões.

## 🔐 Credenciais de Acesso

Todos os usuários de teste usam a mesma password para facilitar os testes: **`Test123!`**

---

## 👥 Lista de Usuários de Teste

### 1. Admin da Aplicação

- **Email**: `admin@athlifyr.com`
- **Password**: `Test123!`
- **Role**: `ADMIN`
- **Descrição**: Acesso total à plataforma, incluindo painel de administração
- **Permissões**:
  - ✅ Acesso ao painel admin (`/admin`)
  - ✅ Gestão de eventos, venues, utilizadores
  - ✅ Acesso a todas as funcionalidades
  - ✅ Moderação de conteúdo

---

### 2. Gym Owner (Proprietário)

- **Email**: `owner@testgym.com`
- **Password**: `Test123!`
- **Role**: `USER`
- **Venue**: Test Gym CrossFit
- **Venue Role**: `OWNER`
- **Descrição**: Proprietário de um venue de teste
- **Permissões**:
  - ✅ Gestão completa do venue (editar, eliminar)
  - ✅ Gestão de membros (adicionar/remover admins, coaches, clients)
  - ✅ Gestão de planos e subscrições
  - ✅ Gestão de sessões e bookings
  - ✅ Ver tab "Team" com membros e subscritores
  - ✅ Responder a reviews do venue

---

### 3. Gym Admin (Administrador)

- **Email**: `admin@testgym.com`
- **Password**: `Test123!`
- **Role**: `USER`
- **Venue**: Test Gym CrossFit
- **Venue Role**: `ADMIN`
- **Descrição**: Administrador do venue de teste
- **Permissões**:
  - ✅ Gestão do venue (editar, mas não eliminar)
  - ✅ Gestão de membros (adicionar coaches e clients)
  - ✅ Gestão de planos e subscrições
  - ✅ Gestão de sessões e bookings
  - ✅ Ver tab "Team" com membros e subscritores
  - ✅ Responder a reviews do venue
  - ❌ Não pode eliminar o venue
  - ❌ Não pode remover o owner

---

### 4. Gym Coach (Treinador)

- **Email**: `coach@testgym.com`
- **Password**: `Test123!`
- **Role**: `USER`
- **Venue**: Test Gym CrossFit
- **Venue Role**: `COACH`
- **Descrição**: Treinador do venue de teste
- **Permissões**:
  - ✅ Ver sessões agendadas
  - ✅ Gerir bookings das suas sessões
  - ✅ Ver membros do venue
  - ❌ Não pode editar o venue
  - ❌ Não pode gerir planos ou subscrições
  - ❌ Não vê tab "Team"
  - ❌ Não pode responder a reviews

---

### 5. User sem Subscrição

- **Email**: `user.free@test.com`
- **Password**: `Test123!`
- **Role**: `USER`
- **Venue**: Test Gym CrossFit
- **Venue Role**: `CLIENT` (não subscrito)
- **Descrição**: Utilizador registado mas sem subscrição ativa
- **Permissões**:
  - ✅ Ver venue publicamente
  - ✅ Ver eventos públicos
  - ✅ Escrever reviews
  - ✅ Recomendar venues
  - ✅ Ver sessões disponíveis
  - ❌ Não pode fazer bookings sem plano
  - ❌ Não vê tab "Team"
  - ❌ Acesso limitado ao feed do venue

---

### 6. User com Subscrição

- **Email**: `user.premium@test.com`
- **Password**: `Test123!`
- **Role**: `USER`
- **Venue**: Test Gym CrossFit
- **Venue Role**: `CLIENT`
- **Subscription**: Active (Monthly Plan)
- **Descrição**: Utilizador com subscrição ativa no venue
- **Permissões**:
  - ✅ Ver venue publicamente
  - ✅ Ver eventos públicos
  - ✅ Escrever reviews
  - ✅ Recomendar venues
  - ✅ Fazer bookings em sessões
  - ✅ Acesso completo ao feed do venue
  - ✅ Cancelar bookings
  - ❌ Não vê tab "Team"
  - ❌ Não pode responder a reviews

---

## 🏢 Venue de Teste

### Test Gym CrossFit

- **Slug**: `test-gym-crossfit`
- **Type**: `CROSSFIT_BOX`
- **Location**: Lisboa, Portugal
- **Description**: Venue de teste para validação de funcionalidades
- **Members**:
  - Owner: owner@testgym.com
  - Admin: admin@testgym.com
  - Coach: coach@testgym.com
  - Client (Free): user.free@test.com
  - Client (Premium): user.premium@test.com

### Planos Disponíveis

1. **Monthly Plan** - €50/mês
   - Unlimited classes
   - Active subscription: user.premium@test.com

---

## 🧪 Como Criar os Usuários de Teste

```bash
# Executar o seed script de usuários de teste
pnpm db:seed:test-users
```

Ou manualmente via Prisma Studio:

```bash
npx prisma studio
```

---

## 📋 Checklist de Testes por User

### Admin da Aplicação

- [ ] Login com sucesso
- [ ] Acesso ao painel `/admin`
- [ ] Ver todos os eventos
- [ ] Ver todos os venues
- [ ] Ver todos os utilizadores
- [ ] Gestão de contactos
- [ ] Gestão de media

### Gym Owner

- [ ] Login com sucesso
- [ ] Ver venue "Test Gym CrossFit"
- [ ] Ver tab "Team" com membros e subscritores
- [ ] Editar informações do venue
- [ ] Criar/editar planos
- [ ] Criar/editar sessões
- [ ] Responder a reviews
- [ ] Adicionar/remover membros
- [ ] Ver dashboard de bookings

### Gym Admin

- [ ] Login com sucesso
- [ ] Ver venue "Test Gym CrossFit"
- [ ] Ver tab "Team" com membros e subscritores
- [ ] Editar informações do venue
- [ ] Criar/editar planos
- [ ] Criar/editar sessões
- [ ] Responder a reviews
- [ ] Adicionar coaches e clients
- [ ] Ver dashboard de bookings
- [ ] Não consegue eliminar o venue

### Gym Coach

- [ ] Login com sucesso
- [ ] Ver venue "Test Gym CrossFit"
- [ ] Não vê tab "Team"
- [ ] Ver sessões onde é responsável
- [ ] Gerir bookings das suas sessões
- [ ] Não consegue editar o venue
- [ ] Não consegue criar planos

### User sem Subscrição

- [ ] Login com sucesso
- [ ] Ver venue "Test Gym CrossFit" publicamente
- [ ] Não vê tab "Team"
- [ ] Ver feed público do venue
- [ ] Escrever review do venue
- [ ] Recomendar venue
- [ ] Ver sessões disponíveis
- [ ] Não consegue fazer booking sem plano
- [ ] Ver botão "Subscribe" nos planos

### User com Subscrição

- [ ] Login com sucesso
- [ ] Ver venue "Test Gym CrossFit" publicamente
- [ ] Não vê tab "Team"
- [ ] Ver feed completo do venue
- [ ] Escrever review do venue
- [ ] Recomendar venue
- [ ] Fazer booking em sessão
- [ ] Ver "My Bookings"
- [ ] Cancelar booking
- [ ] Ver subscrição ativa

---

## 🔄 Reset dos Usuários de Teste

Para resetar os usuários de teste e recriar do zero:

```bash
# Remover dados de teste
pnpm db:seed:test-users:reset

# Recriar usuários
pnpm db:seed:test-users
```

---

## 🤖 Testes Automatizados

Os testes automatizados estão localizados em `/tests/e2e/test-users/`:

```bash
# Executar todos os testes de navegação
pnpm test:e2e:users

# Executar teste específico por user
pnpm test:e2e:admin
pnpm test:e2e:gym-owner
pnpm test:e2e:gym-admin
pnpm test:e2e:gym-coach
pnpm test:e2e:user-free
pnpm test:e2e:user-premium
```

---

## 📝 Notas Importantes

1. **Nunca usar em produção**: Estes usuários são apenas para ambiente de desenvolvimento/staging
2. **Password simples**: A password `Test123!` é intencionalmente simples para facilitar testes
3. **Dados de teste**: Todos os dados criados por estes usuários devem ser claramente identificados como teste
4. **Reset regular**: Recomenda-se resetar os dados de teste regularmente para garantir consistência

---

## 🆘 Troubleshooting

### Não consigo fazer login

- Verificar se o seed script foi executado
- Verificar se o email está correto (case-sensitive)
- Verificar se a password é exatamente `Test123!`

### Permissões não funcionam

- Verificar na base de dados se o `VenueMember` foi criado
- Verificar o role do utilizador no venue
- Limpar cache do browser

### Venue não aparece

- Verificar se o venue foi criado pelo seed script
- Verificar se o slug está correto: `test-gym-crossfit`
- Verificar na base de dados: `npx prisma studio`

---

**Última atualização**: 23 de Janeiro de 2026
