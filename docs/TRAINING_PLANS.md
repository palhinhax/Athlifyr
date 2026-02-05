# Training Plans System

Sistema de planos de treino estruturados para a plataforma Athlifyr.

## Visão Geral

O sistema de Training Plans permite criar programas de treino estruturados ao longo de várias semanas, similar a planos de ginásio ou programas de Personal Trainers.

## Conceitos Principais

### 1. **Training Plan (Plano de Treino)**

Um plano de treino é uma coleção organizada de workouts distribuídos ao longo de várias semanas.

**Características:**

- Nome e descrição
- Duração (em semanas)
- Dificuldade (1-5)
- Categoria (CrossFit, Strength, Running, etc.)
- Público-alvo (Beginners, Intermediate, Advanced)
- Goals (objetivos: perder peso, ganhar força, etc.)
- Requirements (equipamento necessário)
- Template e Public flags (para partilha)
- Premium flag (requer conta PRO)

**Exemplos:**

- "CrossFit Iniciantes - 8 Semanas"
- "Preparação Maratona - 12 Semanas"
- "Força e Hipertrofia - 6 Semanas"
- "Hybrid Athlete Program - 16 Semanas"

### 2. **Training Plan Week (Semana do Plano)**

Cada plano é dividido em semanas numeradas sequencialmente.

**Características:**

- Número da semana (1, 2, 3...)
- Nome opcional ("Fundamentos", "Teste de Volume", "Deload Week")
- Descrição do foco da semana
- Order index (para reordenar se necessário)

### 3. **Training Plan Workout (Workout na Semana)**

Define qual workout fazer em que dia da semana.

**Características:**

- Workout ID (referência ao workout existente)
- Day of Week (0=Domingo, 1=Segunda, ..., 6=Sábado)
- Order index (se houver múltiplos workouts no mesmo dia)
- Notes específicas para este workout nesta semana

### 4. **User Training Plan (Atribuição a Utilizador)**

Tracking da progressão de um utilizador através de um plano.

**Características:**

- User ID
- Plan ID
- Assigned by (coach que atribuiu, ou null se auto-atribuído)
- Start Date / End Date
- Current Week (semana atual do utilizador)
- Status (ACTIVE, PAUSED, COMPLETED, CANCELLED)
- Notes do coach ou utilizador

### 5. **Venue Session Plan (Plano para Sessões)**

Permite que um venue siga um plano estruturado nas suas sessões.

**Características:**

- Session ID
- Plan ID
- Start Date
- Current Week
- Notes

## Estrutura de Dados

```typescript
TrainingPlan (1)
  ├── TrainingPlanWeek (N) - Semanas do plano
  │     └── TrainingPlanWorkout (N) - Workouts em cada dia
  │           └── Workout (referência)
  └── UserTrainingPlan (N) - Utilizadores a seguir o plano
```

## Casos de Uso

### 1. **PT cria plano para um cliente**

```
1. PT cria um Training Plan personalizado
2. Adiciona semanas (1-12 weeks)
3. Para cada semana, atribui workouts aos dias:
   - Segunda: "Upper Body Strength"
   - Quarta: "AMRAP Conditioning"
   - Sexta: "Lower Body Power"
4. Atribui o plano ao cliente (UserTrainingPlan)
5. Cliente segue o plano semana a semana
```

### 2. **Box de CrossFit cria programa público**

```
1. Box cria um Training Plan público ("CrossFit Foundations - 8 Weeks")
2. Marca como Template e Public
3. Estrutura 8 semanas de progressão
4. Utilizadores podem "subscrever" o plano
5. Tracking individual de cada utilizador
```

### 3. **Venue segue plano nas sessões**

```
1. Venue escolhe um plano existente
2. Atribui o plano a sessões regulares (e.g., WOD class)
3. Sistema sugere qual workout executar baseado na semana atual
4. Progressão automática semana a semana
```

## Fluxo de Criação

### Passo 1: Criar o Plan

```typescript
const plan = await prisma.trainingPlan.create({
  data: {
    name: "CrossFit Iniciantes - 8 Semanas",
    description: "Programa de introdução ao CrossFit...",
    createdById: userId,
    duration: 8,
    difficulty: 2,
    category: "CrossFit",
    targetAudience: "Beginners",
    goals: ["Build Foundational Strength", "Learn Technique"],
    requirements: ["Barbell", "Pull-up Bar"],
    isPublic: true,
    isTemplate: true,
  },
});
```

### Passo 2: Criar Semanas

```typescript
for (let week = 1; week <= 8; week++) {
  await prisma.trainingPlanWeek.create({
    data: {
      planId: plan.id,
      weekNumber: week,
      name: `Week ${week}`,
      orderIndex: week - 1,
    },
  });
}
```

### Passo 3: Atribuir Workouts

```typescript
// Semana 1, Segunda-feira
await prisma.trainingPlanWorkout.create({
  data: {
    weekId: week1.id,
    workoutId: "workout-squat-basics",
    dayOfWeek: 1, // Monday
    orderIndex: 0,
    notes: "Focus on technique, not weight",
  },
});
```

### Passo 4: Atribuir a Utilizador

```typescript
await prisma.userTrainingPlan.create({
  data: {
    userId: clientId,
    planId: plan.id,
    assignedById: coachId,
    startDate: new Date(),
    endDate: calculateEndDate(new Date(), 8), // +8 weeks
    currentWeek: 1,
    status: "ACTIVE",
  },
});
```

## API Endpoints (a criar)

### Plans

- `GET /api/training-plans` - Lista todos os planos (públicos ou do user)
- `GET /api/training-plans/[id]` - Detalhes de um plano
- `POST /api/training-plans` - Criar plano
- `PATCH /api/training-plans/[id]` - Editar plano
- `DELETE /api/training-plans/[id]` - Apagar plano

### Weeks

- `POST /api/training-plans/[id]/weeks` - Adicionar semana
- `PATCH /api/training-plans/[id]/weeks/[weekId]` - Editar semana
- `DELETE /api/training-plans/[id]/weeks/[weekId]` - Remover semana

### Workouts in Plan

- `POST /api/training-plans/[id]/weeks/[weekId]/workouts` - Adicionar workout
- `DELETE /api/training-plans/[id]/weeks/[weekId]/workouts/[workoutId]` - Remover workout

### User Progress

- `GET /api/training-plans/user` - Planos do utilizador
- `POST /api/training-plans/[id]/assign` - Atribuir plano a utilizador
- `PATCH /api/training-plans/user/[userPlanId]` - Update progress (current week, status)
- `POST /api/training-plans/user/[userPlanId]/complete-week` - Marcar semana como completa

## UI Components (a criar)

1. **TrainingPlanCard** - Card preview de um plano
2. **TrainingPlanList** - Lista de planos disponíveis
3. **TrainingPlanBuilder** - Interface de criação/edição de planos
4. **WeekScheduleView** - Vista semanal com workouts por dia
5. **UserPlanProgress** - Dashboard de progresso do utilizador
6. **PlanCalendar** - Calendário mensal com workouts agendados

## Features Futuras

1. **Auto-progression**: Sistema inteligente de progressão baseado em performance
2. **Substitutions**: Sugerir workouts alternativos se faltar equipamento
3. **Rest Days**: Marcar dias de descanso explicitamente
4. **Deload Weeks**: Semanas de recuperação programadas
5. **Testing Weeks**: Semanas de teste de 1RM/benchmarks
6. **Plan Templates**: Marketplace de planos criados por coaches
7. **Copy & Customize**: Duplicar planos existentes e personalizar
8. **Notifications**: Lembrar utilizador dos workouts do dia
9. **Analytics**: Estatísticas de adesão e progressão
10. **Social Sharing**: Partilhar resultados e progressão

## Integração com Sistema Existente

- **Workouts**: Reutiliza workouts existentes do Workout Builder
- **User Performance**: Logs de workouts linkam ao plano
- **Venues**: Venues podem criar e atribuir planos aos seus membros
- **Sessions**: Workouts de sessões podem vir de um plano ativo

## Próximos Passos

1. ✅ Schema criado
2. ✅ Types TypeScript criados
3. ⏳ API routes para CRUD de planos
4. ⏳ UI components para criar/editar planos
5. ⏳ User dashboard para seguir planos
6. ⏳ Integration com workout logger
7. ⏳ Progress tracking e analytics

---

**Nota**: Este sistema complementa o Workout Builder existente, adicionando a camada de estruturação temporal e progressão.
