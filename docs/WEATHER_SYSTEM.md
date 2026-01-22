# Weather System Setup

Este documento explica como configurar e usar o sistema de previsão do tempo para eventos.

## 📋 Visão Geral

O sistema atualiza automaticamente as previsões do tempo para todos os eventos nos próximos 6 dias:

- ✅ Suporta **eventos de vários dias** (startDate → endDate)
- ✅ Usa **OpenWeatherMap API** (gratuito até 1.000 chamadas/dia)
- ✅ Atualização automática **diária via GitHub Actions**
- ✅ Dados guardados na base de dados (cache)
- ✅ Componente React para exibir previsões

---

## 🗄️ Modelo de Dados

### EventWeather

```prisma
model EventWeather {
  id          String   @id @default(cuid())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  date        DateTime // Data da previsão
  temperature Float    // Temperatura em Celsius
  condition   String   // Condição (ex: "Clear", "Rain", "Clouds")
  humidity    Int?     // Humidade (%)
  windSpeed   Float?   // Velocidade do vento (m/s)
  icon        String?  // Código do ícone
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([eventId, date])
  @@index([eventId])
  @@index([date])
}
```

---

## ⚙️ Configuração

### 1. Obter API Key do OpenWeatherMap

1. Criar conta em [OpenWeatherMap](https://openweathermap.org/api)
2. Ir para **API Keys** no dashboard
3. Copiar a API key

### 2. Configurar Variáveis de Ambiente

Adicionar ao ficheiro `.env` (local e produção):

```bash
# OpenWeatherMap API Key
OPENWEATHER_API_KEY="your_api_key_here"

# Security token for weather updates (generate with: openssl rand -hex 32)
WEATHER_UPDATE_SECRET="your_secure_random_token_here"
```

### 3. Gerar Token de Segurança

```bash
openssl rand -hex 32
```

### 4. Configurar GitHub Secrets

No repositório GitHub, ir para **Settings → Secrets and variables → Actions** e adicionar:

- **WEATHER_UPDATE_SECRET**: O token gerado no passo 3

---

## 🚀 Executar Migração

```bash
pnpm prisma migrate dev --name add-event-weather
pnpm prisma generate
```

---

## 📅 GitHub Actions Workflow

O ficheiro `.github/workflows/update-weather.yml` executa automaticamente:

- **Diariamente às 6:00 AM UTC**
- **Manualmente via GitHub Actions UI**

```yaml
name: Update Event Weather Forecasts

on:
  schedule:
    - cron: "0 6 * * *" # Daily at 6:00 AM UTC
  workflow_dispatch: # Allow manual trigger
```

---

## 🔄 API Endpoint

### POST `/api/weather/update`

Atualiza as previsões do tempo para todos os eventos nos próximos 6 dias.

**Headers:**

```
Authorization: Bearer YOUR_WEATHER_UPDATE_SECRET
Content-Type: application/json
```

**Exemplo de chamada manual:**

```bash
curl -X POST https://athlifyr.com/api/weather/update \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json"
```

**Resposta de sucesso:**

```json
{
  "success": true,
  "message": "Weather update completed",
  "stats": {
    "totalEvents": 15,
    "successCount": 15,
    "errorCount": 0
  }
}
```

---

## 🎨 Componente React

### EventWeather

Exibe as previsões do tempo para um evento.

**Uso:**

```tsx
import { EventWeather } from "@/components/event-weather";

// Numa página de evento
const weather = await prisma.eventWeather.findMany({
  where: { eventId: event.id },
  orderBy: { date: "asc" },
});

<EventWeather weather={weather} />;
```

**Features:**

- ✅ Ícones do tempo (OpenWeatherMap)
- ✅ Temperatura, humidade, velocidade do vento
- ✅ Formatação de datas em português
- ✅ Suporta múltiplos dias (eventos longos)

---

## 📊 Lógica de Funcionamento

### 1. Seleção de Eventos

Busca eventos que:

- Começam entre **hoje** e **daqui a 6 dias**
- Têm **latitude e longitude** definidas

### 2. Previsão por Dia

Para eventos de vários dias (startDate → endDate):

- Busca previsão para **cada dia do evento**
- Usa previsão mais próxima do **meio-dia (12:00)** de cada dia

### 3. Rate Limiting

- **1 pedido por segundo** (60 req/min = limite da API gratuita)
- Delay de 1,1 segundos entre chamadas

### 4. Atualização Incremental

- Usa `upsert` → atualiza se já existir, cria se não existir
- Eventos podem ter previsões atualizadas múltiplas vezes

---

## 🧪 Testar Localmente

```bash
# 1. Configurar .env com OPENWEATHER_API_KEY e WEATHER_UPDATE_SECRET

# 2. Executar a API de update manualmente
curl -X POST http://localhost:3000/api/weather/update \
  -H "Authorization: Bearer YOUR_LOCAL_SECRET" \
  -H "Content-Type: application/json"
```

---

## 📈 Limites da API Gratuita

**OpenWeatherMap Free Tier:**

- ✅ 1.000 chamadas/dia
- ✅ 60 chamadas/minuto
- ✅ Previsões até 5 dias (intervalos de 3h)
- ✅ Uso comercial permitido com atribuição

**Estimativa de consumo:**

- Se tiveres **100 eventos** nos próximos 6 dias
- Cada evento consome **1 chamada** (forecast cobre todos os dias)
- **100 chamadas/dia** = bem dentro do limite gratuito

---

## 🔐 Segurança

1. **Token de autorização**: Endpoint protegido por `WEATHER_UPDATE_SECRET`
2. **GitHub Secrets**: Token guardado de forma segura no GitHub
3. **Rate limiting**: Respeita limites da API (1 req/s)

---

## 🐛 Troubleshooting

### Erro: "OpenWeather API key not configured"

- Verificar se `OPENWEATHER_API_KEY` está no `.env`
- Confirmar que a key está ativa (pode demorar alguns minutos após criação)

### Erro: "Unauthorized" (401)

- Verificar se o token `Authorization: Bearer` está correto
- Confirmar que `WEATHER_UPDATE_SECRET` corresponde no GitHub Actions

### Sem previsões para alguns eventos

- Verificar se eventos têm **latitude e longitude** definidas
- Confirmar que eventos estão dentro da janela de 6 dias
- Verificar logs no GitHub Actions para erros específicos

---

## 📝 TODO / Melhorias Futuras

- [ ] Adicionar traduções para condições meteorológicas (pt, en, es, fr, de, it)
- [ ] Exibir alertas meteorológicos (chuva forte, vento, etc.)
- [ ] Cache de previsões por mais tempo (reduzir chamadas API)
- [ ] Dashboard admin para ver estatísticas de updates
- [ ] Notificações para organizadores se tempo estiver mau

---

## 🎯 Conclusão

O sistema está pronto para:

1. ✅ Atualizar previsões automaticamente todos os dias
2. ✅ Suportar eventos de múltiplos dias
3. ✅ Exibir dados nas páginas de eventos
4. ✅ Escalar até centenas de eventos sem ultrapassar limites gratuitos

**Next steps:**

1. Executar migração: `pnpm prisma migrate dev`
2. Configurar secrets no GitHub
3. Testar workflow manualmente
4. Adicionar componente `<EventWeather>` nas páginas de eventos
