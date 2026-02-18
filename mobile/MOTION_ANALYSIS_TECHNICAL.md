# Deteção Corporal & Esqueleto de Paus — Documentação Técnica

## Visão Geral

A funcionalidade de **Motion Analysis** permite ao utilizador gravar ou importar um vídeo do seu movimento (corrida, agachamento, etc.) e a app analisa automaticamente a pose corporal frame a frame, gerando um esqueleto de paus animado com métricas biomecânicas.

```
Vídeo → Trim → WebView (TensorFlow.js + MoveNet) → PoseFrames → Stickman + Métricas
```

---

## Arquitetura do Sistema

```
app/motion-analysis.tsx                  ← Ecrã principal (orquestrador)
├── TrimSlider                           ← Selecionar segmento do vídeo
├── PoseWebViewRunner                    ← Motor de deteção (invisível)
│   └── WebView com TF.js + MoveNet     ← IA a correr na WebView
├── StickmanRenderer                     ← Renderização SVG do esqueleto
├── PoseResultTabs                       ← Tabs com replay + métricas
└── src/lib/pose-utils.ts               ← Cálculos e suavização
```

---

## Fase 1 — Trimming do Vídeo

**Ficheiro:** `src/components/motion-analysis/TrimSlider.tsx`

O utilizador vê o vídeo e dois handles deslizantes (início e fim) para selecionar apenas o segmento relevante do movimento. Isto reduz o tempo de análise e melhora a precisão.

- Os handles são arrastáveis e limitados à duração total do vídeo
- O segmento selecionado é passado como `startMs` e `endMs` para a análise
- Máximo recomendado: 30 segundos (para performance)

---

## Fase 2 — Deteção de Pose (IA)

### Como funciona a WebView

**Ficheiro:** `src/components/motion-analysis/PoseWebViewRunner.tsx`

A deteção de pose usa **TensorFlow.js** e o modelo **MoveNet** — uma rede neuronal especializada em deteção de pontos-chave do corpo humano em tempo real. Como o React Native não tem suporte nativo para TF.js, a solução usa uma `WebView` invisível (1×1 px, fora do ecrã) como motor de execução.

```
React Native
    │
    ▼
WebView (1x1px, position: absolute, top:-100)
    │  HTML inline com TF.js + MoveNet carregados via CDN
    │
    ├── Carrega modelo MoveNet (SinglePose Thunder)
    ├── Carrega vídeo via file:// URI (acesso direto ao sistema de ficheiros)
    ├── Para cada frame amostrado:
    │   ├── Seek do vídeo para o timestamp
    │   ├── drawImage(video) → canvas
    │   └── MoveNet.estimatePoses(canvas) → 17 keypoints
    │
    └── Envia resultados via postMessage → React Native
```

### Por que WebView e não native?

| Opção                               | Problema                                                        |
| ----------------------------------- | --------------------------------------------------------------- |
| TF.js nativo em RN                  | Não suporta modelos de pose complexos em RN 0.81+               |
| React Native Vision Camera + plugin | Requer build nativo separado por plataforma                     |
| WebView + TF.js                     | ✅ Sem dependências nativas extras, funciona em qualquer device |

### Comunicação RN ↔ WebView

```
React Native → WebView:
  postMessage({ type: 'START_ANALYSIS', config: { videoFileUri, startMs, endMs, sampleFps } })

WebView → React Native:
  postMessage({ type: 'MODEL_READY' })         ← modelo carregado
  postMessage({ type: 'POSE_PROGRESS', progress: 45 })   ← progresso %
  postMessage({ type: 'POSE_RESULT', data: { poseFrames, meta } })  ← resultado final
  postMessage({ type: 'POSE_ERROR', error: '...' })       ← erro
```

### O Modelo MoveNet

**MoveNet SinglePose Thunder** é um modelo de deteção de pose de alta precisão do Google/TensorFlow:

- **Input:** frame de vídeo (qualquer resolução, desenhado num canvas)
- **Output:** 17 keypoints, cada um com `x`, `y` (normalizados 0→1) e `score` (confiança 0→1)
- **Performance:** ~15–30ms por frame em dispositivos modernos

Os 17 keypoints detetados:

```
 0: nose               (nariz)
 1: left_eye           (olho esquerdo)
 2: right_eye          (olho direito)
 3: left_ear           (orelha esquerda)
 4: right_ear          (orelha direita)
 5: left_shoulder      (ombro esquerdo)
 6: right_shoulder     (ombro direito)
 7: left_elbow         (cotovelo esquerdo)
 8: right_elbow        (cotovelo direito)
 9: left_wrist         (pulso esquerdo)
10: right_wrist        (pulso direito)
11: left_hip           (anca esquerda)
12: right_hip          (anca direita)
13: left_knee          (joelho esquerdo)
14: right_knee         (joelho direito)
15: left_ankle         (tornozelo esquerdo)
16: right_ankle        (tornozelo direito)
```

### Amostragem de Frames

Não se analisa cada frame do vídeo (seria demasiado lento). Em vez disso, a app amostra frames a uma taxa configurável:

```typescript
sampleFps = 12; // default: 12 frames por segundo
// num vídeo de 5s → 60 frames amostrados
// intervalo entre frames = 1000ms / 12 = ~83ms
```

Para cada frame:

1. `videoEl.currentTime = timestamp` → seek para o instante
2. Aguarda o evento `seeked`
3. `ctx.drawImage(videoEl, 0, 0)` → copia frame para canvas
4. `detector.estimatePoses(canvas)` → MoveNet processa o canvas
5. Normaliza coordenadas: `x = kp.x / videoWidth`, `y = kp.y / videoHeight`

---

## Fase 3 — Suavização Temporal

**Ficheiro:** `src/lib/pose-utils.ts` → `smoothPoseFrames()`

Os keypoints crus do MoveNet têm jitter frame a frame (o nariz "salta" ligeiramente entre frames). Aplica-se uma **média ponderada com kernel Gaussiano** para suavizar sem perder movimentos rápidos.

```
Janela de 5 frames (windowSize=2): pesos [1, 2, 3, 2, 1]

Frame N suavizado = (1×F[N-2] + 2×F[N-1] + 3×F[N] + 2×F[N+1] + 1×F[N+2]) / 9
```

Keypoints com score baixo (< 0.2) são ignorados ou recebem menos peso — significa que o modelo não está confiante (ex: membro fora de campo, oclusão).

---

## Fase 4 — Renderização do Esqueleto de Paus

**Ficheiro:** `src/components/motion-analysis/StickmanRenderer.tsx`

O esqueleto é desenhado com **react-native-svg** (primitivas `<Line>` e `<Circle>` sobre um `<Svg>`), sem canvas nativo, o que garante performance suave mesmo durante animação.

### Ligações (Bones) do Esqueleto

**Ficheiro:** `src/lib/pose-utils.ts` → `SKELETON_EDGES`

```
           nose
          /    \
left_shoulder—right_shoulder
    |    ╲  ╱    |
    |     ╳      |
left_elbow   right_elbow
    |              |
left_wrist    right_wrist

left_shoulder—left_hip
right_shoulder—right_hip
    left_hip—right_hip

left_hip—left_knee—left_ankle
right_hip—right_knee—right_ankle
```

18 arestas no total definem o esqueleto completo. Cada aresta só é desenhada se **ambos** os keypoints tiverem `score >= 0.2`.

### Dois Modos de Renderização

#### Modo `overlay`

Sobreposto ao vídeo original durante a reprodução. As coordenadas normalizadas (0→1) são convertidas para pixels tendo em conta o **letterboxing/pillarboxing** do vídeo:

```
Se o vídeo é 16:9 e o container é quadrado:
  → barras pretas em cima e em baixo (pillarboxing)
  → offset Y = (containerH - renderH) / 2
  → os keypoints são desenhados dentro da área real do vídeo
```

#### Modo `replay`

Modo isolado sem vídeo: o esqueleto é auto-centrado e escalado para preencher o container usando o **bounding box** dos keypoints visíveis + 12% de padding.

### Detalhes Extras — Pés (Foot Stubs)

O MoveNet não tem keypoints para os dedos dos pés. Para tornar o esqueleto mais natural, renderiza-se um "stub" do pé a partir do tornozelo, perpendicular à direção da canela:

```typescript
// Direção da canela (joelho → tornozelo)
const shinDx = ankle.x - knee.x;
const shinDy = ankle.y - knee.y;

// Perpendicular (simula a sola do pé)
const perpX = -shinDy / shinLen;
const footLen = shinLen * 0.3; // pé = 30% da canela
```

### Pontos de Articulação (Joints)

Círculos brancos desenhados em cada keypoint visível. Os keypoints faciais (nariz, olhos, orelhas) são desenhados com raio menor.

---

## Fase 5 — Métricas Biomecânicas

**Ficheiro:** `src/lib/pose-utils.ts` → `computePoseMetrics()`

A partir das pose frames suavizadas, calculam-se métricas do movimento:

| Métrica                  | Como é calculada                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **Cadência**             | Ciclos de movimento por minuto (deteção de picos no deslocamento vertical das ancas) |
| **Amplitude de passada** | Distância horizontal máxima entre tornozelos                                         |
| **Simetria**             | Comparação lado esquerdo vs direito (ombros, ancas, joelhos)                         |
| **Inclinação do tronco** | Ângulo entre ombros e ancas relativamente à vertical                                 |
| **Flexão do joelho**     | Ângulo mínimo atingido no joelho durante o ciclo                                     |
| **Elevação dos braços**  | Amplitude de movimento dos pulsos                                                    |

---

## Fase 6 — Replay Animado

No tab "Replay" do ecrã de resultados, o esqueleto é animado frame a frame com `setInterval` a 12fps (igual à taxa de amostragem), sincronia com o índice de frames.

---

## Fluxo Completo de Dados

```
1. Utilizador grava vídeo (câmara) ou importa da galeria
       ↓
2. motion-analysis.tsx recebe { videoUri, durationMs }
       ↓
3. Fase TRIM: utilizador seleciona segmento (startMs, endMs)
       ↓
4. Fase ANALYZING:
   PoseWebViewRunner escreve HTML → ficheiro cache (file://)
   WebView carrega HTML → carrega TF.js + MoveNet via CDN
   WebView recebe START_ANALYSIS via postMessage
   WebView processa frames do vídeo (seek → canvas → MoveNet)
   WebView envia POSE_PROGRESS → AnalysisProgress (barra de progresso)
   WebView envia POSE_RESULT → PoseFrames[]
       ↓
5. smoothPoseFrames() → suavização temporal
   computePoseMetrics() → métricas biomecânicas
       ↓
6. Fase RESULTS:
   PoseResultTabs → Tab "Overlay": vídeo + StickmanRenderer (overlay mode)
                 → Tab "Replay":  StickmanRenderer isolado (replay mode)
                 → Tab "Métricas": cards com dados numéricos
       ↓
7. Guardar → MotionAnalysis salvo no store (Zustand + AsyncStorage)
```

---

## Limitações Conhecidas

| Limitação                    | Causa                                | Mitigação                                               |
| ---------------------------- | ------------------------------------ | ------------------------------------------------------- |
| Requer ligação à internet    | MoveNet carregado via CDN na WebView | Poderia ser bundled localmente (aumenta tamanho da app) |
| Lento em vídeos longos       | Frame-by-frame seek + inferência     | Limite de 30s + sampleFps máximo 15                     |
| Apenas 1 pessoa              | MoveNet SinglePose                   | Poderia usar MultiPose para grupos                      |
| Sem keypoints das mãos/dedos | MoveNet não inclui                   | BlazePose (maior) incluiria                             |
| Oclusão reduz precisão       | Score baixo = keypoint ignorado      | Suavização temporal compensa parcialmente               |

---

## Dependências

| Biblioteca                          | Versão       | Papel                             |
| ----------------------------------- | ------------ | --------------------------------- |
| `react-native-webview`              | ~14.x        | Motor de execução do TF.js        |
| `@tensorflow/tfjs`                  | 4.22.0 (CDN) | Framework de ML                   |
| `@tensorflow-models/pose-detection` | 2.1.3 (CDN)  | Modelo MoveNet                    |
| `react-native-svg`                  | ~15.x        | Renderização do esqueleto         |
| `expo-file-system`                  | ~19.x        | Escrever HTML para ficheiro cache |
| `expo-video`                        | ~3.x         | Reprodução do vídeo overlay       |
