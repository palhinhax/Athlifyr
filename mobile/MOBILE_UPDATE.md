# Mobile App - Event Cards & Detail Page Update

Os cards de eventos e a página de detalhes do mobile estão agora **iguais ao Next.js**! 🎉

## ✅ O Que Foi Atualizado

### 1. **EventCard Component** - Igual ao Web
O card de eventos agora tem o mesmo visual do Next.js:

- ✅ **SportBadges** com ícones e traduções
- ✅ **Data formatada** com range (igual ao web)
- ✅ **Variantes** mostradas como chips (até 3, depois +N)
- ✅ **Badge "Vou"** para eventos que o user vai participar
- ✅ **Contador de comentários**
- ✅ **Imagem** com 192px de altura
- ✅ **Border verde** quando o user está participando

### 2. **Página de Detalhes** - `/events/[slug]`
Página de detalhes completa com:

- ✅ **Header transparente** com botão voltar
- ✅ **Imagem grande** com badges overlay
- ✅ **Título e informações** principais
- ✅ **Descrição** do evento
- ✅ **Lista de variantes** com datas e horários
- ✅ **Botão "Visit Official Website"** para link externo
- ✅ **Design** igual ao Next.js

### 3. **Componentes Criados**

#### `SportBadge.tsx`
```tsx
<SportBadge sportType="RUNNING" size="md" />
```
- Mostra ícone emoji + nome traduzido
- Tamanhos: sm, md, lg
- Cores do tema

#### `event-utils.ts`
Funções de utilidade:
- `formatDateRange()` - Formata ranges de datas igual ao web
- `formatDate()` - Formata datas
- `getSportIcon()` - Retorna emoji do desporto
- `sportTypeIcons` - Mapa de ícones

### 4. **API Update**
Endpoint `GET /api/events/[id]` agora aceita **slug ou ID**:

```typescript
// Ambos funcionam:
GET /api/events/corrida-lisboa-2026  // slug
GET /api/events/uuid-123-456         // id
```

## 📱 Como Usar

### Ver Lista de Eventos
```bash
cd mobile
npx expo start
# Press 'i' for iOS ou 'a' for Android
```

A página principal (Events) mostra todos os eventos com os cards atualizados.

### Ver Detalhes de um Evento
1. Toque num card de evento
2. Abre a página de detalhes com todas as informações
3. Scroll para ver variantes, descrição, etc.
4. Toque em "Visit Official Website" para abrir o link externo

## 🎨 Design Matching

### EventCard
```
┌─────────────────────────┐
│  Imagem (192px)         │
│  [Sport Badges]   [Vou] │  ← Top overlay
└─────────────────────────┘
│ Título do Evento        │
│ 📅 Data (formatada)      │
│ 📍 Cidade, País          │
│ 🛣️  5km  10km  21km +2  │  ← Variantes
│              💬 15       │  ← Comentários
└─────────────────────────┘
```

### Event Detail Page
```
┌─────────────────────────┐
│ [← Back]                │  ← Transparent header
│                         │
│    Imagem Grande        │
│    [Sport Badges]       │  ← Badges overlay
│                         │
└─────────────────────────┘
│                         │
│ Título Grande           │
│                         │
│ 📅 Data Range           │
│ 📍 Location             │
│                         │
│ About                   │
│ Descrição...            │
│                         │
│ Distances               │
│ ┌─────────────────┐     │
│ │ 10 km           │     │
│ │ 🕐 15 Mar • 9:00│     │
│ └─────────────────┘     │
│                         │
│ [Visit Official Website]│
└─────────────────────────┘
```

## 🌍 Traduções

Adicionadas traduções de desportos:
- `sports.RUNNING` = "Running"
- `sports.TRAIL` = "Trail"
- `sports.HYROX` = "HYROX"
- etc.

## 📂 Novos Arquivos

```
mobile/
├── app/
│   └── events/
│       └── [slug].tsx              # 👈 Página de detalhes
├── src/
│   ├── components/
│   │   ├── EventCard.tsx           # 👈 Atualizado (igual web)
│   │   └── SportBadge.tsx          # 👈 Novo
│   └── lib/
│       └── event-utils.ts          # 👈 Novo (utils)
```

## 🔄 API Changes

`app/api/events/[id]/route.ts`:
- Agora aceita slug ou UUID
- Retorna variantes com triathlon segments
- Inclui contador de comentários

## 🎯 Próximos Passos

Para completar o mobile app, pode adicionar:

- [ ] Comentários na página de detalhes
- [ ] Mapa de localização
- [ ] Botão "Vou" / "Não vou"
- [ ] Partilhar evento
- [ ] Favoritos
- [ ] Filtros avançados

## 🚀 Test it!

```bash
# 1. Backend running
cd ..
pnpm dev

# 2. Mobile app
cd mobile
npx expo start

# 3. Navegar
- Ver lista de eventos
- Tocar num evento
- Ver detalhes completos!
```

Enjoy! 🎉
