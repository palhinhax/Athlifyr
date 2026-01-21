# Vercel Web Analytics - Custom Events

## 📊 Eventos Implementados

Esta documentação descreve todos os eventos personalizados implementados no Vercel Analytics.

### ✅ Eventos de Autenticação

#### Signup_Start

**Quando**: Utilizador inicia o processo de signup  
**Dados**:

- `method`: "email" | "google"

**Localizações**:

- [components/auth/signup-form.tsx](../components/auth/signup-form.tsx)

#### Signup_Completed

**Quando**: Conta criada com sucesso  
**Dados**:

- `method`: "email" | "google"
- `userId`: ID do novo utilizador (server-side only)

**Localizações**:

- Client: [components/auth/signup-form.tsx](../components/auth/signup-form.tsx)
- Server: [app/api/auth/register/route.ts](../app/api/auth/register/route.ts)

#### Signup_Failed

**Quando**: Erro durante o signup  
**Dados**:

- `method`: "email" | "google"
- `error`: código ou mensagem do erro

**Localizações**:

- [components/auth/signup-form.tsx](../components/auth/signup-form.tsx)

---

### 🎫 Eventos de Participação em Eventos

#### Event_View

**Quando**: Utilizador clica num event card  
**Dados**:

- `eventId`: ID do evento
- `eventTitle`: Título do evento
- `location`: Contexto de onde vem (ex: "homepage", "events_page")
- `sportTypes`: Tipos de desporto (CSV)
- `city`: Cidade do evento
- `country`: País do evento

**Localizações**:

- [components/event-card.tsx](../components/event-card.tsx)

#### Event_Register

**Quando**: Utilizador regista participação num evento (status "going")  
**Dados**:

- `eventId`: ID do evento
- `userId`: ID do utilizador
- `variantId`: ID da variante (se aplicável)
- `eventTitle`: Título do evento

**Localizações**:

- [app/api/participations/route.ts](../app/api/participations/route.ts)

#### Event_Share

**Quando**: Utilizador partilha um evento  
**Dados**:

- `eventId`: ID do evento
- `method`: "copy_link" | "facebook" | "twitter" | "whatsapp" | "linkedin" | "email" | "native"

**Localizações**:

- [components/share-button.tsx](../components/share-button.tsx)

---

### 🏋️ Eventos de Bookings (Venues)

#### Booking_Completed

**Quando**: Booking de sessão criado com sucesso  
**Dados**:

- `venueId`: ID do venue
- `sessionId`: ID da sessão
- `userId`: ID do utilizador
- `venueName`: Nome do venue

**Localizações**:

- [app/api/venues/[id]/sessions/[sessionId]/book/route.ts](../app/api/venues/[id]/sessions/[sessionId]/book/route.ts)

---

### 💳 Eventos de Compra (Subscriptions)

#### Purchase_Completed

**Quando**: Pagamento confirmado e subscrição ativada  
**Dados**:

- `userId`: ID do utilizador
- `venueId`: ID do venue
- `planId`: ID do plano
- `planName`: Nome do plano
- `amount`: Valor pago
- `subscriptionId`: ID da subscrição

**Localizações**:

- [app/api/payment-intents/[id]/confirm/route.ts](../app/api/payment-intents/[id]/confirm/route.ts)

---

### 🧭 Eventos de Navegação

#### Navigation_Click

**Quando**: Utilizador clica num link da navegação principal  
**Dados**:

- `destination`: "profile" | "events" | "venues" | "feed" | "admin"
- `location`: "header"
- `authenticated`: "true" | "false"

**Localizações**:

- [components/nav-links.tsx](../components/nav-links.tsx)

#### Logo_Click

**Quando**: Utilizador clica no logo Athlifyr  
**Dados**:

- `location`: "header"
- `destination`: "homepage"

**Localizações**:

- [components/logo-link.tsx](../components/logo-link.tsx)

---

### 🏠 Eventos da Homepage

#### Homepage_CTA_Explore_Click

**Quando**: Utilizador clica em "Explorar Eventos" na secção CTA  
**Dados**:

- `location`: "cta_section"

**Localizações**:

- [components/home-client-tracking.tsx](../components/home-client-tracking.tsx)

#### Homepage_SeeAll_Click

**Quando**: Utilizador clica em "Ver Todos" na secção de eventos  
**Dados**:

- `location`: "events_section"

**Localizações**:

- [components/home-client-tracking.tsx](../components/home-client-tracking.tsx)

#### Homepage_NoEvents_Explore_Click

**Quando**: Utilizador clica em "Explorar" quando não há eventos disponíveis  
**Dados**:

- `location`: "no_events_message"

**Localizações**:

- [components/home-client-tracking.tsx](../components/home-client-tracking.tsx)

---

## 📈 Como Visualizar os Dados

1. Aceder ao [Vercel Dashboard](https://vercel.com)
2. Selecionar o projeto Athlifyr
3. Ir para **Analytics** → **Events**
4. Filtrar por nome de evento ou data

---

## 🔧 Como Adicionar Novos Eventos

### Client-side (React Components)

```tsx
import { analyticsEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

function MyComponent() {
  const handleClick = () => {
    analyticsEvent(ANALYTICS_EVENTS.EVENT_NAME, {
      key: "value",
      number: 123,
      boolean: true,
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Server-side (API Routes)

```ts
import { trackServerEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export async function POST(request: Request) {
  // ... your logic

  await trackServerEvent(ANALYTICS_EVENTS.EVENT_NAME, {
    userId: user.id,
    action: "completed",
  });

  return NextResponse.json({ success: true });
}
```

---

## ⚠️ Restrições Importantes

- **Apenas tipos primitivos**: string, number, boolean, null
- **Sem objetos aninhados**
- **Máximo 255 caracteres** por valor string
- **Disponível apenas em planos Pro/Enterprise** da Vercel

---

## 📊 Métricas Sugeridas para Análise

### Funil de Conversão - Homepage

1. Page View (Homepage)
2. `Event_View` (cliques em cards)
3. `Event_Register` (participação)

### Funil de Conversão - Signup

1. `Signup_Start`
2. `Signup_Completed` / `Signup_Failed`

### Análise de Navegação

- Paths mais populares via `Navigation_Click`
- Quantas vezes voltam à homepage via `Logo_Click`

### Performance de CTAs

- CTR de `Homepage_CTA_Explore_Click`
- CTR de `Homepage_SeeAll_Click`

### Engagement com Eventos

- Eventos mais vistos (`Event_View`)
- Taxa de conversão view → register
- Partilhas por método (`Event_Share`)

---

## 🎯 Próximos Eventos a Implementar

- [ ] Filtro de eventos aplicado
- [ ] Pesquisa de eventos
- [ ] Scroll depth na homepage
- [ ] Video play/pause (se houver)
- [ ] Download de conteúdos
- [ ] Newsletter signup
- [ ] Contact form submission

---

## 📝 Convenção de Nomenclatura

Todos os eventos seguem o padrão:

```
<Categoria>_<Ação>[_<Contexto>]
```

Exemplos:

- ✅ `Signup_Completed`
- ✅ `Event_View`
- ✅ `Homepage_CTA_Click`
- ❌ `userClickedButton` (não seguir camelCase)
- ❌ `clicked-signup` (não usar hífens)

---

## 🔗 Recursos

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Custom Events Docs](https://vercel.com/docs/analytics/custom-events)
- [Wrapper Utilities](../lib/analytics.ts)
