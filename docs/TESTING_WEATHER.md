# 🧪 Como Testar o Sistema de Previsão do Tempo

## 📋 Pré-requisitos

1. ✅ Migração executada: `pnpm prisma migrate dev --name add-event-weather`
2. ✅ Variáveis de ambiente configuradas no `.env`:
   - `OPENWEATHER_API_KEY` - Tua API key do OpenWeatherMap
   - `WEATHER_UPDATE_SECRET` - Token de segurança (gerar com `openssl rand -hex 32`)

---

## 🚀 Teste Local

### 1. Verificar se há eventos nos próximos 6 dias

```bash
# Executar no terminal Prisma Studio ou query direto
pnpm prisma studio
```

Ou criar um evento de teste com coordenadas:

```typescript
// Exemplo: evento daqui a 3 dias em Lisboa
const testEvent = await prisma.event.create({
  data: {
    title: "Teste Weather Event",
    slug: "teste-weather-event",
    description: "Evento para testar previsão do tempo",
    sportTypes: ["RUNNING"],
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 dias
    city: "Lisboa",
    country: "Portugal",
    latitude: 38.7223,
    longitude: -9.1393,
  },
});
```

### 2. Testar a API manualmente

```bash
# Substituir YOUR_SECRET pelo valor do teu .env
curl -X POST http://localhost:3000/api/weather/update \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**

```json
{
  "success": true,
  "message": "Weather update completed",
  "stats": {
    "totalEvents": 5,
    "successCount": 5,
    "errorCount": 0
  }
}
```

### 3. Verificar os dados na base de dados

```bash
pnpm prisma studio
```

Ir para a tabela **EventWeather** e verificar se aparecem registos com:

- `eventId`
- `date`
- `temperature`
- `condition`
- `humidity`
- `windSpeed`
- `icon`

---

## 🌐 Ver na Interface

1. Ir para a página de um evento: `http://localhost:3000/pt/events/teste-weather-event`
2. Deves ver o componente de previsão do tempo:
   - **Mobile**: Após a meta info do evento
   - **Desktop**: Na sidebar direita

---

## 🐛 Troubleshooting

### Erro: "OpenWeather API key not configured"

```bash
# Verificar se a variável está no .env
cat .env | grep OPENWEATHER_API_KEY
```

### Erro: "Unauthorized" (401)

```bash
# Verificar se o token está correto
cat .env | grep WEATHER_UPDATE_SECRET

# O token no curl deve corresponder ao do .env
curl -X POST http://localhost:3000/api/weather/update \
  -H "Authorization: Bearer $(grep WEATHER_UPDATE_SECRET .env | cut -d '=' -f2 | tr -d '"')" \
  -H "Content-Type: application/json"
```

### Erro: "The database server was reached but timed out"

```bash
# Tentar novamente (pode ser timeout temporário)
pnpm prisma migrate dev --name add-event-weather
```

### Nenhum evento encontrado

```bash
# Verificar eventos nos próximos 6 dias com coordenadas
pnpm prisma studio
# Filtrar: startDate >= hoje AND startDate <= hoje+6 dias AND latitude IS NOT NULL
```

---

## 📊 Logs Esperados

Ao executar o update, deves ver logs assim:

```
📅 Found 5 events in the next 6 days
🌤️  Fetching weather for "Trail Manuelino 2026" (1 day)
   ✅ 2026-02-01: 12°C, Clear
🌤️  Fetching weather for "Lisbon Eco Marathon 2026" (1 day)
   ✅ 2026-02-15: 15°C, Clouds
...
```

---

## 🎯 Teste Completo - Checklist

- [ ] Migração executada com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] API retorna `success: true`
- [ ] Dados aparecem na tabela `EventWeather`
- [ ] Componente aparece na página do evento (mobile)
- [ ] Componente aparece no sidebar (desktop)
- [ ] Ícones do tempo aparecem corretamente
- [ ] Temperatura, humidade e vento exibidos

---

## 🚀 Deploy para Produção

### 1. Configurar Secrets no GitHub

**Settings → Secrets and variables → Actions → New repository secret**

- Name: `WEATHER_UPDATE_SECRET`
- Value: (o mesmo valor do `.env` de produção)

### 2. Configurar Variáveis de Ambiente no Vercel/Host

No painel de configuração do teu hosting, adicionar:

```
OPENWEATHER_API_KEY=tua_key_aqui
WEATHER_UPDATE_SECRET=mesmo_token_do_github
```

### 3. Executar Workflow Manualmente

1. Ir para **Actions** no GitHub
2. Selecionar **Update Event Weather Forecasts**
3. Clicar em **Run workflow**
4. Verificar logs

### 4. Confirmar Schedule Automático

O workflow vai correr automaticamente todos os dias às **6:00 AM UTC**.

---

## 📈 Monitorização

### Ver execuções do workflow

1. GitHub → **Actions**
2. Clicar em **Update Event Weather Forecasts**
3. Ver histórico de execuções

### Verificar últimas atualizações

```sql
SELECT
  e.title,
  ew.date,
  ew.temperature,
  ew.condition,
  ew.updatedAt
FROM "EventWeather" ew
JOIN "Event" e ON e.id = ew."eventId"
ORDER BY ew."updatedAt" DESC
LIMIT 20;
```

---

## 🎉 Sucesso!

Se todos os passos funcionarem, o sistema está 100% operacional! 🌤️

O tempo será atualizado automaticamente todos os dias para eventos nos próximos 6 dias.
