# Live Race — Visão Geral do Produto

Sistema de acompanhamento de corridas em tempo real da Athlifyr. Permite que **atletas** sejam seguidos via GPS durante uma prova, **espetadores** acompanhem tudo ao vivo, e **organizadores** controlem o estado da corrida a partir de um painel de gestão.

---

## Índice

1. [O que é a Live Race](#o-que-é-a-live-race)
2. [Personas e Objetivos](#personas-e-objetivos)
3. [Experiência do Espetador](#experiência-do-espetador)
4. [Experiência do Atleta](#experiência-do-atleta)
5. [Experiência do Organizador](#experiência-do-organizador)
6. [Ciclo de Vida de uma Corrida](#ciclo-de-vida-de-uma-corrida)
7. [Funcionalidades Sociais e Chat](#funcionalidades-sociais-e-chat)
8. [Privacidade do Atleta](#privacidade-do-atleta)
9. [Cenários e Edge Cases](#cenários-e-edge-cases)
10. [Resumo de Funcionalidades por Persona](#resumo-de-funcionalidades-por-persona)

---

## O que é a Live Race

A **Live Race** é a funcionalidade central de acompanhamento ao vivo da Athlifyr. Transforma qualquer evento desportivo (trail running, corrida de estrada, caminhada, etc.) numa experiência interativa em tempo real para todos os envolvidos.

### Problema que resolve

- **Atletas** não têm feedback em tempo real sobre a sua posição relativa durante uma prova
- **Espetadores** (família, amigos, fãs) não conseguem saber o que está a acontecer na corrida sem estar fisicamente no local
- **Organizadores** não têm ferramentas acessíveis para gerir o estado da corrida e comunicar com o público

### Como funciona (resumo)

1. O **organizador** ativa a Live Race no evento e controla o seu estado (check-in → warmup → live → finished)
2. Os **atletas** participam com a app móvel, que envia a sua posição GPS em tempo real para o servidor
3. Os **espetadores** abrem a página do evento no browser e vêem automaticamente o leaderboard, feed de eventos e estado da corrida — tudo atualizado em tempo real via WebSocket

---

## Personas e Objetivos

### 🏃 Atleta

| Objetivo                  | Descrição                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Competir informado**    | Ver a sua posição no ranking em tempo real, mesmo durante a prova                                          |
| **Métricas ao vivo**      | Consultar tempo decorrido, distância, ritmo médio, velocidade, elevação e progresso                        |
| **Visualizar o percurso** | Ver o mapa com o traçado da rota, checkpoints e a sua posição atual                                        |
| **Não perder dados**      | Se perder ligação, os pontos GPS são guardados localmente e sincronizados automaticamente quando reconecta |
| **Privacidade**           | Controlar quem pode ver a sua posição — público, apenas amigos, ou apenas organizador                      |

### 👀 Espetador

| Objetivo                                   | Descrição                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Seguir atletas favoritos**               | Acompanhar a progressão de amigos e familiares no leaderboard                       |
| **Viver a emoção ao vivo**                 | Sentir a energia da corrida mesmo à distância, com atualizações a cada 2-5 segundos |
| **Saber o estado da corrida**              | Ver claramente se a corrida já começou, está em aquecimento ou já terminou          |
| **Receber notificações de momentos-chave** | Saber quando um atleta passa num checkpoint ou cruza a meta                         |
| **Interagir socialmente**                  | Usar o chat para falar com amigos durante a corrida                                 |

### 🎯 Organizador

| Objetivo                         | Descrição                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| **Controlar o fluxo da corrida** | Gerir todas as fases da prova com botões claros e intuitivos                              |
| **Monitorizar em tempo real**    | Ver quantos atletas estão ligados, quantos espetadores estão a assistir                   |
| **Validar antes de começar**     | Sistema de readiness checks que valida se tudo está pronto — rotas, checkpoints, horários |
| **Gerir emergências**            | Pausar a corrida imediatamente em caso de incidente, retomar quando seguro                |
| **Comunicar profissionalismo**   | Oferecer uma experiência moderna e interativa ao público do evento                        |

---

## Experiência do Espetador

### O que vê na página do evento

Quando a Live Race está ativa, uma secção dedicada aparece automaticamente na página pública do evento (`/events/{slug}`):

#### 1. Badge de Estado

Indicador visual sempre visível no topo da secção:

| Estado            | Aparência                       | Significado                                       |
| ----------------- | ------------------------------- | ------------------------------------------------- |
| **CHECK_IN_OPEN** | 🟡 Amarelo                      | Check-in aberto — a corrida começa em breve       |
| **WARMUP**        | 🟠 Âmbar                        | Aquecimento — atletas a preparar-se               |
| **LIVE**          | 🔴 Vermelho (animado com pulso) | Corrida a decorrer em tempo real                  |
| **PAUSED**        | ⚪ Cinzento                     | Corrida temporariamente pausada                   |
| **FINISHED**      | 🟢 Verde                        | Corrida terminada — resultados finais disponíveis |

#### 2. Contagem Decrescente (CHECK_IN_OPEN e WARMUP)

- Timer grande com formato HH:MM:SS sincronizado com o servidor
- Mostra quanto tempo falta para a hora de início prevista
- Cria expectativa e mantém os espetadores na página

#### 3. Banner de Check-in (CHECK_IN_OPEN)

- Banner promocional com indicador animado
- Texto: "Check-in aberto — a corrida começa em breve"
- Informa os espetadores que a prova está iminente

#### 4. Leaderboard em Tempo Real (LIVE e FINISHED)

Tabela de classificação atualizada a cada 2-5 segundos:

| Coluna               | Descrição                                    |
| -------------------- | -------------------------------------------- |
| **Posição**          | Ranking atual na corrida                     |
| **Atleta**           | Avatar, nome e dorsal                        |
| **Distância**        | Quilómetros percorridos                      |
| **Gap**              | Diferença de tempo para o líder              |
| **Progresso**        | Barra de progresso visual (% do percurso)    |
| **Estado**           | Badge: ACTIVE, FINISHED, OFF_ROUTE, DNF, DSQ |
| **Tempo de Chegada** | Tempo final (quando termina)                 |

- Mostra os top 20 atletas
- Filtros disponíveis: Todos / Masculino / Feminino / Grupo etário

#### 5. Feed de Eventos ao Vivo (LIVE)

Timeline cronológica inversa com eventos recentes:

- 🚩 **Checkpoint**: "João Silva passou no Checkpoint 3" (com split time)
- 🏁 **Chegada**: "Maria Santos terminou em 1º lugar — 02:34:17"
- Cada entrada tem timestamp relativo ("há 30s", "há 2min")

#### 6. Contador de Espetadores

- Ícone de olho + número de pessoas a assistir em tempo real
- Dá uma sensação de comunidade e escala ao evento

#### 7. Mensagem de Estado

- **WARMUP**: "A corrida está prestes a começar. Os atletas estão a aquecer."
- **FINISHED**: "A corrida terminou. Consulta os resultados finais abaixo."
- **Sem ligação**: "Ligação ao servidor perdida. A reconectar..."

### Fluxo do espetador

```
1. Abre a página do evento (/events/{slug})
2. Se o evento tem Live Race ativa → secção LiveRace aparece automaticamente
3. Conexão WebSocket estabelecida automaticamente como "spectator"
4. Recebe atualizações em tempo real:
   - Mudanças de estado (WARMUP → LIVE → FINISHED)
   - Leaderboard atualizado a cada 2-5s
   - Posições GPS dos atletas a cada 2s
   - Notificações de checkpoints e chegadas
   - Contagem de espetadores
5. Se a corrida já terminou → carrega resultados finais via API (sem WebSocket)
```

---

## Experiência do Atleta

### O que vê na app móvel

Ecrã imersivo dedicado à corrida, com três camadas:

#### 1. Mapa (Parte Superior)

- Mapa Mapbox em ecrã cheio
- **Polilinha do percurso** com o traçado completo da rota
- **Ponto azul** com a posição atual do atleta
- **Pontos pequenos** com as posições dos outros atletas
- **Marcadores de checkpoints** ao longo do percurso
- **Barra de progresso** visual no topo do mapa

#### 2. HUD — Heads-Up Display (Sobreposição)

Dashboard translúcido sobreposto ao mapa com métricas em tempo real:

**Linha Superior:**
| Métrica | Ícone | Formato |
|---------|-------|---------|
| Tempo Decorrido | ⏱️ | HH:MM:SS |
| Distância | 📍 | km ou metros |
| Ritmo Médio | 📊 | min/km |
| Velocidade | 🏁 | km/h |

**Linha Inferior:**
| Métrica | Ícone | Formato |
|---------|-------|---------|
| Ganho de Elevação | ⬆️ | +metros |
| Altitude | ⛰️ | metros |
| Progresso | 📈 | percentagem |
| Checkpoints | 🚩 | passados/total (ex: 2/5) |

**Indicadores de Estado:**

- 🟢 Conectado (✓) — ligação ao servidor ativa
- 🔴 Desconectado (✗) — sem ligação, a registar offline
- 📦 Pontos em fila — número de pontos GPS guardados localmente
- 🔄 A sincronizar... — upload de batch em progresso
- 👁️ Espetadores — quantas pessoas estão a assistir

#### 3. Mini Leaderboard (Painel Deslizante)

- Painel inferior deslizável (swipeable bottom sheet)
- Leaderboard ao vivo com a posição do atleta destacada
- Minimizável para não tapar o mapa

### Capacidade Offline

O sistema é resiliente a falhas de rede — essencial em provas de montanha:

1. Se perder ligação, os pontos GPS são **acumulados localmente** (até 5000 pontos)
2. O atleta vê um indicador: "A registar offline — 47 pontos em fila"
3. Quando reconecta, o batch é **enviado automaticamente** via `liverace:gps_batch`
4. O servidor processa por ordem cronológica e emite progresso
5. O atleta vê: "Sincronização completa: 47 sincronizados, 0 ignorados"

### Anti-Cheat

O servidor rejeita automaticamente dados suspeitos:

- Pontos com precisão GPS abaixo do threshold (GPS impreciso)
- Saltos de velocidade impossíveis (indicativo de teleportação)
- Timestamps no futuro ou demasiado antigos (> 24h)
- Desvios significativos do percurso (marcado como OFF_ROUTE)

### Fluxo do atleta

```
1. Abre o evento na app móvel
2. Conecta via WebSocket com autenticação JWT
3. Servidor verifica que o atleta está registado na prova
4. Em WARMUP: GPS aceite mas não processado para leaderboard (teste de ligação)
5. Em LIVE: GPS enviado a cada 1-3s → processado pelo route engine:
   - Projeção no percurso (snap-to-route)
   - Deteção de passagem em checkpoints
   - Deteção de cruzamento da meta (finish line)
   - Cálculo de posição no ranking
6. Se perder ligação: GPS bufferizado localmente
7. Ao reconectar: batch enviado e processado automaticamente
8. Quando cruza a meta: marcado como FINISHED com tempo oficial
```

---

## Experiência do Organizador

### Painel de Gestão

Acessível em: `/events/{slug}/manage` → tab **LiveRace** (ícone de antena)

#### 1. Validação de Prontidão (Readiness Checks)

Antes de iniciar, o sistema valida automaticamente:

| Check                   | Tipo     | Descrição                                      |
| ----------------------- | -------- | ---------------------------------------------- |
| Live Race ativada       | ❌ Erro  | O evento tem `hasLiveRace = true`              |
| Variantes existem       | ❌ Erro  | Pelo menos uma variante/prova configurada      |
| Rota definida           | ❌ Erro  | Cada variante tem um percurso com pontos GPX   |
| Checkpoint de partida   | ❌ Erro  | Cada variante tem um ponto de partida          |
| Checkpoint de chegada   | ❌ Erro  | Cada variante tem um ponto de chegada          |
| Hora de início          | ❌ Erro  | Hora de largada definida                       |
| Checkpoints intermédios | ⚠️ Aviso | Checkpoints ao longo do percurso (recomendado) |

- **Erros** (vermelhos): Impedem o início — devem ser corrigidos
- **Avisos** (amarelos): Não impedem mas são recomendados
- **Tudo pronto** (verde): "Live race pronta para iniciar"

#### 2. Métricas em Tempo Real

O painel mostra e atualiza a cada 10 segundos:

- **Estado atual** — badge colorido com o estado da prova
- **Atletas ligados** — quantos atletas têm GPS ativo
- **Espetadores** — quantas pessoas estão a assistir
- **Estado do servidor** — online (✓) ou offline (✗)
- **Última atualização** — timestamp da última comunicação

#### 3. Botões de Controlo

Os botões disponíveis mudam consoante o estado atual:

| Estado Atual  | Botão Disponível     | Efeito                              |
| ------------- | -------------------- | ----------------------------------- |
| SCHEDULED     | **Abrir Check-in**   | Abre o check-in para atletas        |
| CHECK_IN_OPEN | **Ativar Warmup**    | Cria a sala, aceita conexões        |
| WARMUP        | **Iniciar Corrida**  | Começa o cronómetro, GPS processado |
| LIVE          | **Pausar**           | Suspende a corrida (emergência)     |
| PAUSED        | **Retomar**          | Retoma a corrida                    |
| LIVE / PAUSED | **Terminar Corrida** | Encerra, guarda resultados          |
| Qualquer      | **Cancelar**         | Cancela a corrida                   |

#### 4. Link para Página Pública

Botão "Ver página pública" para o organizador confirmar em tempo real o que os espetadores estão a ver.

### Fluxo do organizador no dia da prova

```
⏰ ~1h antes da largada
   └─ Abrir Check-in → atletas recebem notificação para fazer check-in

⏰ ~15-30min antes
   └─ Ativar Warmup → sala criada, espetadores vêem badge WARMUP
      Atletas podem ligar-se e testar GPS (não conta para ranking)

⏰ Hora da largada
   └─ Iniciar Corrida → cronómetro arranca, GPS processado, leaderboard ativo
      Badge muda para LIVE (vermelho animado)

🚨 Se houver incidente
   └─ Pausar → GPS ignorado, leaderboard congela
   └─ Retomar → corrida continua de onde parou

🏁 Último atleta chega / fim da prova
   └─ Terminar Corrida → resultados guardados permanentemente
      Sala destruída após 60 segundos
      Badge muda para FINISHED (verde)
```

---

## Ciclo de Vida de uma Corrida

### Diagrama de Estados

```
SCHEDULED
    │
    │  [Abrir Check-in]
    ▼
CHECK_IN_OPEN
    │
    │  [Ativar Warmup]
    ▼
WARMUP  ◄──────────────────────┐
    │                          │
    │  [Iniciar Corrida]       │
    ▼                          │
   LIVE ───────────────────────┘
    │  │
    │  │  [Pausar]
    │  ▼
    │ PAUSED
    │  │
    │  │  [Retomar]
    │  └──────► LIVE
    │
    │  [Terminar Corrida]
    ▼
FINISHED

Qualquer estado ──► CANCELLED  (via [Cancelar])
```

### O que acontece em cada transição

| Transição        | Base de Dados           | Live Server                                  | Espetadores                           | Atletas                                     |
| ---------------- | ----------------------- | -------------------------------------------- | ------------------------------------- | ------------------------------------------- |
| → CHECK_IN_OPEN  | `liveStatus` atualizado | —                                            | Banner de check-in                    | Notificação para check-in                   |
| → WARMUP         | `liveStatus` atualizado | Sala criada em memória, config carregada     | Badge WARMUP + countdown              | Podem ligar-se, GPS aceite (não processado) |
| → LIVE           | `liveStatus` atualizado | `raceStartTime = now`, processing ativo      | Badge LIVE animado, leaderboard, feed | GPS processado, ranking calculado           |
| → PAUSED         | `liveStatus` atualizado | GPS ignorado, broadcasts param               | Badge PAUSED, leaderboard congelado   | "Corrida pausada"                           |
| → LIVE (retomar) | `liveStatus` atualizado | Processing retoma                            | Badge LIVE regressa                   | GPS retomado                                |
| → FINISHED       | `liveStatus` atualizado | Resultados persistidos, sala destruída (60s) | Badge FINISHED, resultados finais     | Tempo oficial registado                     |
| → CANCELLED      | `liveStatus` atualizado | Sala destruída                               | "Corrida cancelada"                   | Desconectados                               |

---

## Funcionalidades Sociais e Chat

### Chat em Tempo Real

Durante uma corrida ao vivo, os espetadores podem:

- Conversar com amigos que estão também a assistir
- Trocar mensagens via chat integrado (1:1)
- Receber notificações de novas mensagens

O chat funciona via WebSocket através do mesmo Live Server, com persistência via API do Next.js.

### Feed de Eventos Partilhado

O feed de eventos ao vivo cria uma experiência social coletiva:

- Todos os espetadores vêem os mesmos eventos em tempo real
- Passagens em checkpoints com split times
- Chegadas à meta com posição e tempo
- Cria uma sensação de "estar a assistir juntos"

---

## Privacidade do Atleta

Os atletas controlam quem pode ver a sua posição durante a corrida:

| Nível                  | Ícone | Quem vê                           |
| ---------------------- | ----- | --------------------------------- |
| **Público**            | 🌍    | Todos os espetadores              |
| **Apenas Amigos**      | 👥    | Só amigos do atleta na plataforma |
| **Apenas Organizador** | 🔒    | Apenas o organizador do evento    |

- Configurável em: Perfil → Privacidade → Visibilidade Live Race
- O servidor respeita estas definições ao enviar posições GPS para espetadores
- Mesmo no modo "Apenas Organizador", o atleta aparece no leaderboard (sem posição GPS no mapa)

---

## Cenários e Edge Cases

### Perda de ligação do atleta

1. GPS continua a ser registado localmente (até 5000 pontos)
2. Indicador visual muda para "Desconectado — a registar offline"
3. Ao reconectar, batch é sincronizado automaticamente
4. O servidor recalcula checkpoints e posição baseado nos timestamps

### Atleta sai do percurso

1. Route engine deteta desvio significativo do traçado
2. Atleta marcado como `OFF_ROUTE`
3. Espetadores vêem badge "Fora de rota" no leaderboard
4. Se voltar ao percurso, estado regressa a `ACTIVE`

### Muitos espetadores em simultâneo

1. Broadcasts de leaderboard otimizados (a cada 2-5s, não por cada GPS update)
2. Posições GPS agregadas antes de enviar para espetadores
3. Contagem de espetadores atualizada periodicamente

### Corrida com múltiplas variantes

1. Cada variante (ex: Trail 50km, Trail 25km, Mini Trail 10km) tem o seu percurso
2. Leaderboard pode ser filtrado por variante
3. Cada variante pode ter hora de largada diferente
4. Checkpoints são específicos de cada variante

### Emergência / Pausar a corrida

1. Organizador clica "Pausar" → transição imediata
2. GPS dos atletas é ignorado (não processado)
3. Leaderboard congela no último estado
4. Espetadores vêem "Corrida Pausada"
5. Quando o organizador clica "Retomar", tudo regressa ao normal

---

## Resumo de Funcionalidades por Persona

| Funcionalidade                | Espetador                       | Atleta                            | Organizador                   |
| ----------------------------- | ------------------------------- | --------------------------------- | ----------------------------- |
| **Leaderboard em tempo real** | ✅ Ver top 20, gaps             | ✅ Ver posição própria            | ✅ Monitorizar todos          |
| **Mapa com tracking GPS**     | 👀 Página de apresentação       | ✅ Mapa Mapbox completo           | ✅ Dashboard de rotas         |
| **Contagem decrescente**      | ✅ Durante CHECK_IN / WARMUP    | ✅ No HUD móvel                   | ✅ Ver estado                 |
| **Contador de espetadores**   | ✅ Ver quantos estão a assistir | ✅ Ver no HUD                     | ✅ Monitorizar audiência      |
| **Tracking GPS**              | —                               | ✅ Contínuo em foreground         | —                             |
| **Buffer offline**            | —                               | ✅ Auto-sync ao reconectar        | —                             |
| **Feed de eventos**           | ✅ Checkpoints e chegadas       | —                                 | —                             |
| **Chat**                      | ✅ Mensagens entre amigos       | —                                 | —                             |
| **Readiness checks**          | —                               | —                                 | ✅ Validação pré-corrida      |
| **Comandos de corrida**       | —                               | —                                 | ✅ Start, Pause, Finish, etc. |
| **Banner de check-in**        | ✅ Ver banner informativo       | ✅ Fazer check-in na app          | ✅ Abrir check-in             |
| **Badges de estado**          | ✅ LIVE, WARMUP, FINISHED       | ✅ ACTIVE, FINISHED, DNF          | ✅ Todos os estados           |
| **Controlo de privacidade**   | —                               | ✅ Público / Amigos / Organizador | ✅ Respeita definições        |
| **Anti-cheat**                | —                               | Automático (servidor)             | —                             |
| **Métricas ao vivo (HUD)**    | —                               | ✅ Tempo, distância, ritmo, etc.  | —                             |

---

## Tecnologias Envolvidas

| Componente                | Tecnologia                             |
| ------------------------- | -------------------------------------- |
| Comunicação em tempo real | Socket.io (WebSocket)                  |
| Servidor Live             | Fastify + Socket.io (serviço separado) |
| App principal             | Next.js (React)                        |
| App móvel                 | React Native (Expo)                    |
| Mapas (mobile)            | Mapbox                                 |
| Persistência              | PostgreSQL (Prisma)                    |
| Cache/sessões             | Redis (opcional)                       |
| Autenticação atletas      | JWT                                    |
| Autenticação web          | NextAuth (session cookies)             |
| Hosting Live Server       | Railway                                |
| Hosting Web               | Vercel                                 |
