# 🧪 Utilizadores de Teste - Athlifyr

Este documento lista os utilizadores de teste para validar todas as funcionalidades da aplicação.

> **Base de dados:** Development (ep-holy-silence-ah0owe5y)
>
> **Password padrão:** `Test123!` (para contas com password)

---

## 📊 Matriz de Funcionalidades

| Utilizador   | Role          | Box Owner           | Coach               | Membro Box          | Atleta | Eventos |
| ------------ | ------------- | ------------------- | ------------------- | ------------------- | ------ | ------- |
| Admin Master | ADMIN         | ❌                  | ❌                  | ❌                  | ❌     | ❌      |
| João Owner   | USER          | ✅ CrossFit Cascais | ✅                  | ✅                  | ✅     | ✅      |
| Maria Coach  | USER          | ❌                  | ✅ CrossFit Cascais | ✅                  | ✅     | ✅      |
| Pedro Atleta | USER          | ❌                  | ❌                  | ✅ CrossFit Cascais | ✅     | ✅      |
| Ana Free     | USER          | ❌                  | ❌                  | ❌                  | ✅     | ✅      |
| Carlos Multi | USER          | ✅ HYROX Lisboa     | ✅                  | ✅ (2 boxes)        | ✅     | ✅      |
| Sofia Nova   | USER          | ❌                  | ❌                  | ❌                  | ❌     | ❌      |
| Banned User  | USER (banned) | ❌                  | ❌                  | ❌                  | ❌     | ❌      |

---

## 👤 Detalhes dos Utilizadores

### 1. Admin Master (Administrador)

| Campo                  | Valor              |
| ---------------------- | ------------------ |
| **Nome**               | Admin Master       |
| **Email**              | admin@athlifyr.com |
| **Role**               | `ADMIN`            |
| **Email Verificado**   | ✅ Sim             |
| **Notificações Email** | ✅ Ativadas        |

**O que testa:**

- Acesso ao painel de administração (`/admin`)
- Gestão de utilizadores (ban/unban)
- Gestão de eventos (aprovar, editar, eliminar)
- Gestão de venues/boxes
- Moderação de conteúdo (comentários, posts)
- Claims de ownership de venues
- Relatórios e estatísticas

---

### 2. João Owner (Dono de Box)

| Campo                   | Valor               |
| ----------------------- | ------------------- |
| **Nome**                | João Silva          |
| **Email**               | joao.owner@test.com |
| **Role**                | `USER`              |
| **Email Verificado**    | ✅ Sim              |
| **Notificações Email**  | ✅ Ativadas         |
| **Desportos Favoritos** | `CROSSFIT`, `HYROX` |

**Venues (Owner):**

- **CrossFit Cascais** - Owner/Admin
  - Role: `OWNER`
  - Status: `ACTIVE`

**O que testa:**

- Dashboard de owner de venue
- Gestão de membros da box (convidar, remover, alterar roles)
- Gestão de coaches
- Criação e gestão de sessões/aulas
- Configuração de planos e subscrições
- Gestão de reservas
- Estatísticas da box
- Configuração de pagamentos (Stripe Connect)
- Edição de informações da venue

---

### 3. Maria Coach (Treinadora)

| Campo                   | Valor                       |
| ----------------------- | --------------------------- |
| **Nome**                | Maria Santos                |
| **Email**               | maria.coach@test.com        |
| **Role**                | `USER`                      |
| **Email Verificado**    | ✅ Sim                      |
| **Notificações Email**  | ✅ Ativadas                 |
| **Desportos Favoritos** | `CROSSFIT`, `WEIGHTLIFTING` |

**Venues (Membro):**

- **CrossFit Cascais**
  - Role: `COACH`
  - Status: `ACTIVE`

**O que testa:**

- Dashboard de coach
- Visualização de aulas atribuídas
- Gestão de presenças dos atletas
- Check-in de membros
- Visualização de membros da box
- Criação de WODs/treinos (se permitido)
- Não pode: gerir outros coaches, alterar configurações da box

---

### 4. Pedro Atleta (Membro de Box)

| Campo                   | Valor                 |
| ----------------------- | --------------------- |
| **Nome**                | Pedro Costa           |
| **Email**               | pedro.atleta@test.com |
| **Role**                | `USER`                |
| **Email Verificado**    | ✅ Sim                |
| **Notificações Email**  | ✅ Ativadas           |
| **Desportos Favoritos** | `CROSSFIT`            |

**Venues (Membro):**

- **CrossFit Cascais**
  - Role: `MEMBER`
  - Status: `ACTIVE`
  - Subscrição: Plano Mensal (ativa)

**Participações em Eventos:**

- Trail Manuelino 2026 - Inscrito (Trail 32km)
- HYROX Lisboa 2026 - Inscrito (Individual)

**O que testa:**

- Dashboard de membro de box
- Reserva de aulas/sessões
- Visualização de horários
- Histórico de presenças
- Gestão da subscrição
- Cancelamento de reservas
- Participação em eventos
- Histórico de resultados
- Feed social da box

---

### 5. Ana Free (Atleta Independente)

| Campo                   | Valor                        |
| ----------------------- | ---------------------------- |
| **Nome**                | Ana Ferreira                 |
| **Email**               | ana.free@test.com            |
| **Role**                | `USER`                       |
| **Email Verificado**    | ✅ Sim                       |
| **Notificações Email**  | ❌ Desativadas               |
| **Desportos Favoritos** | `TRAIL_RUNNING`, `TRIATHLON` |

**Venues:** Nenhuma (atleta independente)

**Participações em Eventos:**

- Trail Manuelino 2026 - Inscrito (Sprint 18km)
- Ultra Trail Serra da Estrela - Inscrito

**O que testa:**

- Experiência de utilizador sem box
- Descoberta de venues/boxes
- Pesquisa e inscrição em eventos
- Exploração do mapa de eventos
- Feed social público
- Perfil público de atleta
- Recomendação de venues
- Pedido de adesão a boxes

---

### 6. Carlos Multi (Multi-Box + Owner)

| Campo                   | Valor                                     |
| ----------------------- | ----------------------------------------- |
| **Nome**                | Carlos Rodrigues                          |
| **Email**               | carlos.multi@test.com                     |
| **Role**                | `USER`                                    |
| **Email Verificado**    | ✅ Sim                                    |
| **Notificações Email**  | ✅ Ativadas                               |
| **Desportos Favoritos** | `CROSSFIT`, `HYROX`, `FUNCTIONAL_FITNESS` |

**Venues (Owner):**

- **HYROX Lisboa**
  - Role: `OWNER`
  - Status: `ACTIVE`

**Venues (Membro):**

- **CrossFit Cascais**
  - Role: `MEMBER`
  - Status: `ACTIVE`
- **Box Funcional Porto**
  - Role: `COACH`
  - Status: `ACTIVE`

**O que testa:**

- Gestão de múltiplas boxes (owner + membro + coach)
- Alternância entre contextos de venue
- Dashboard consolidado
- Notificações de múltiplas fontes
- Conflitos de horários entre boxes
- Gestão de uma box enquanto é membro/coach de outras

---

### 7. Sofia Nova (Utilizador Novo)

| Campo                   | Valor               |
| ----------------------- | ------------------- |
| **Nome**                | Sofia Mendes        |
| **Email**               | sofia.nova@test.com |
| **Role**                | `USER`              |
| **Email Verificado**    | ❌ Não              |
| **Notificações Email**  | ❌ Desativadas      |
| **Desportos Favoritos** | Nenhum selecionado  |

**Venues:** Nenhuma
**Eventos:** Nenhum

**O que testa:**

- Onboarding de novo utilizador
- Fluxo de verificação de email
- Seleção inicial de desportos favoritos
- Recomendações personalizadas
- Descoberta da plataforma
- Limitações sem email verificado
- Primeiro contacto com venues e eventos

---

### 8. Banned User (Utilizador Banido)

| Campo                | Valor           |
| -------------------- | --------------- |
| **Nome**             | Banned Test     |
| **Email**            | banned@test.com |
| **Role**             | `USER`          |
| **isBanned**         | ✅ `true`       |
| **Email Verificado** | ✅ Sim          |

**O que testa:**

- Bloqueio de acesso à plataforma
- Mensagem de conta suspensa
- Impossibilidade de fazer login
- Fluxo de recurso/contacto suporte

---

## 🏢 Venues de Teste

### CrossFit Cascais

| Campo           | Valor                                         |
| --------------- | --------------------------------------------- |
| **Nome**        | CrossFit Cascais                              |
| **Tipo**        | `CROSSFIT_BOX`                                |
| **Localização** | Cascais, Portugal                             |
| **Owner**       | João Silva                                    |
| **Coaches**     | Maria Santos                                  |
| **Membros**     | Pedro Costa, Carlos Rodrigues                 |
| **Planos**      | Mensal (€80), Trimestral (€210), Anual (€750) |
| **Stripe**      | Configurado (test mode)                       |

---

### HYROX Lisboa

| Campo           | Valor                       |
| --------------- | --------------------------- |
| **Nome**        | HYROX Training Lisboa       |
| **Tipo**        | `HYROX_GYM`                 |
| **Localização** | Lisboa, Portugal            |
| **Owner**       | Carlos Rodrigues            |
| **Coaches**     | (nenhum)                    |
| **Membros**     | (nenhum)                    |
| **Planos**      | Drop-in (€15), Mensal (€90) |
| **Stripe**      | Não configurado             |

---

### Box Funcional Porto

| Campo           | Valor                |
| --------------- | -------------------- |
| **Nome**        | Box Funcional Porto  |
| **Tipo**        | `FUNCTIONAL_FITNESS` |
| **Localização** | Porto, Portugal      |
| **Owner**       | (outro utilizador)   |
| **Coaches**     | Carlos Rodrigues     |
| **Membros**     | (vários)             |

---

## 🎫 Eventos de Teste

### Trail Manuelino 2026

- **Data:** 1 Fevereiro 2026
- **Local:** Abiul, Pombal
- **Variantes:** Trail 32km, Sprint 18km, Mini 12km, Caminhada 12km
- **Inscritos de teste:** Pedro Atleta (32km), Ana Free (18km)

### HYROX Lisboa 2026

- **Data:** 15 Março 2026
- **Local:** Altice Arena, Lisboa
- **Variantes:** Individual, Doubles, Relay
- **Inscritos de teste:** Pedro Atleta (Individual)

---

## 🔐 Credenciais de Acesso

### Contas com Google OAuth

- `joao.owner@test.com`
- `maria.coach@test.com`
- `carlos.multi@test.com`

### Contas com Password

- Todas as outras contas
- **Password:** `Test123!`

---

## 📝 Notas de Teste

### Cenários Prioritários

1. **Fluxo completo de owner:** Criar venue → Configurar → Adicionar coaches → Convidar membros → Criar aulas → Gerir reservas

2. **Fluxo de membro:** Descobrir box → Pedir adesão → Subscrever plano → Reservar aulas → Check-in

3. **Fluxo de evento:** Descobrir evento → Ver detalhes → Inscrever → Pagar → Receber confirmação

4. **Fluxo social:** Criar post → Comentar → Reagir → Partilhar resultado

### Edge Cases a Testar

- [ ] Utilizador tenta aceder a box sem ser membro
- [ ] Coach tenta alterar configurações da box
- [ ] Membro tenta reservar aula lotada
- [ ] Utilizador não verificado tenta ativar notificações
- [ ] Owner tenta eliminar venue com membros ativos
- [ ] Subscrição expirada - acesso a aulas

---

## 🔄 Reset de Dados de Teste

Para resetar os dados de teste, corre:

```bash
# Usando a DB de desenvolvimento
$env:DATABASE_URL="postgresql://neondb_owner:npg_8fFlJy2PROmb@ep-holy-silence-ah0owe5y-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Reset completo
pnpm prisma migrate reset

# Ou apenas re-seed
pnpm prisma db seed
```

---

_Última atualização: Janeiro 2026_
