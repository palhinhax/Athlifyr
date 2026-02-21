# Video Analysis API - Documentação Completa

## 📋 Visão Geral

As APIs centralizadas de análise de vídeo processam vídeos de fitness/desporto usando uma API externa especializada hospedada no Railway. **Toda a análise de vídeo é feita externamente** - a aplicação Athlifyr apenas faz proxy para os serviços de processamento.

### Endpoints Disponíveis

| Endpoint                          | Tipo           | Quando Usar                                                 |
| --------------------------------- | -------------- | ----------------------------------------------------------- |
| `/api/lift-analysis/process`      | Barbell + Pose | Legacy: upload direto multipart (dev local / mobile antigo) |
| `/api/motion-analysis/process`    | Full Body Pose | Legacy: upload direto multipart (dev local / mobile antigo) |
| `/api/lift-analysis/process-b2`   | Barbell + Pose | **Produção**: via B2 presigned URL (web + mobile)           |
| `/api/motion-analysis/process-b2` | Full Body Pose | **Produção**: via B2 presigned URL (web + mobile)           |
| `/api/uploads/presign`            | Upload         | Gera presigned PUT URL para upload direto ao B2             |

### Características

- ✅ **Processamento 100% externo** via `https://barbell-path-tracker-production.up.railway.app`
- ✅ **Upload direto ao B2** — vídeo nunca passa pelo Vercel (evita limite de 4.5 MB)
- ✅ **Railway descarrega o vídeo** diretamente do B2 via presigned URL
- ✅ **Barbell tracking** com linha dourada mostrando caminho da barra
- ✅ **Pose estimation** com esqueleto verde néon
- ✅ **Ângulos das articulações** (anca, joelho, cotovelo, ombro, tornozelo, tronco)
- ✅ **3D Skeleton frames** com landmarks MediaPipe por frame (33 landmarks, 35 bones)
- ✅ **Watermark "Athlifyr"** em todos os vídeos processados
- ✅ **Mobile & Web** suportados (iOS, Android, Browser)
- ✅ **Vídeos até 500MB** e 120 segundos de duração

---

## 🏋️ Lift Analysis API

### Endpoint

```
POST /api/lift-analysis/process
```

**Descrição:** Combina tracking da barra com análise de pose corporal de perfil. Ideal para levantamentos olímpicos e powerlifting onde é necessário ver o caminho da barra e a posição do corpo.

**API Externa:** Chama `POST /analyze/full` do serviço Railway.

### Parâmetros (multipart/form-data)

| Campo              | Tipo             | Obrigatório | Default  | Descrição                                               |
| ------------------ | ---------------- | ----------- | -------- | ------------------------------------------------------- |
| `video`            | File             | ✅ Sim      | -        | Ficheiro de vídeo (mp4, mov, avi, mkv, webm, máx 500MB) |
| `seed_x`           | string (number)  | ✅ Sim      | -        | Coordenada X pixel onde utilizador tocou no disco/peso  |
| `seed_y`           | string (number)  | ✅ Sim      | -        | Coordenada Y pixel onde utilizador tocou no disco/peso  |
| `seed_frame`       | string (number)  | Não         | `"0"`    | Frame onde o ponto foi selecionado                      |
| `show_angles`      | string (boolean) | Não         | `"true"` | Mostrar ângulos no vídeo processado                     |
| `max_duration_sec` | string (number)  | Não         | `"60"`   | Duração máxima do vídeo (máx: 120s)                     |
| `auto_detect`      | string (boolean) | Não         | `"true"` | Auto-detectar centro do disco                           |

### Response (200 OK)

```typescript
{
  success: true,
  message: "Análise completa! Tracking: ✓, Pose: 95%",
  videoUrl: "https://barbell-path-tracker-production.up.railway.app/download/full_abc12345.mp4",
  tracking: {
    success: true,
    autoDetected: true,
    detectedCenter: { x: 342, y: 456 },
    detectedRadius: 45,
    totalTravelPx: 523.7,
    maxVerticalDisplacementPx: 312.4,
    maxHorizontalDisplacementPx: 89.2
  },
  pose: {
    framesProcessed: 180,
    framesWithPose: 171,
    detectionRate: 95.0,
    durationSec: 6.0,
    averageAngles: {
      leftKnee: 145.2,
      rightKnee: 147.8,
      leftHip: 165.3,
      rightHip: 163.9,
      leftElbow: 172.1,
      rightElbow: 170.5,
      leftShoulder: 45.2,
      rightShoulder: 43.8,
      leftAnkle: 88.5,
      rightAnkle: 87.2,
      torsoInclination: 12.5
    }
  },
  skeletonFrames: [
    {
      frameWidth: 1920,
      frameHeight: 1080,
      landmarks: [
        {
          name: "left_shoulder",
          index: 11,
          x: 0.45, y: 0.35, z: -0.12,
          visibility: 0.98,
          pixelX: 864, pixelY: 378,
          worldX: -0.15, worldY: 0.42, worldZ: -0.08
        }
        // ... 33 landmarks total (MediaPipe Pose)
      ],
      bones: [
        { startIndex: 11, endIndex: 13, startName: "left_shoulder", endName: "left_elbow" }
        // ... 35 bones total
      ]
    }
    // ... one SkeletonFrame per video frame
  ]
}
```

### Ideal Para

- 🏋️ **Deadlift** - Caminho da barra + ângulos anca/joelho
- 🏋️ **Squat** - Profundidade + inclinação tronco
- 🏋️ **Clean & Jerk** - Tracking vertical
- 🏋️ **Snatch** - Path completo
- 🏋️ **Bench Press** (lateral) - Path horizontal

---

## 🧘 Motion Analysis API

### Endpoint

```
POST /api/motion-analysis/process
```

**Descrição:** Análise de pose corporal completa sem tracking de barra. Funciona com qualquer ângulo de câmara e qualquer tipo de movimento.

**API Externa:** Chama `POST /analyze/body` do serviço Railway.

### Parâmetros (multipart/form-data)

| Campo              | Tipo             | Obrigatório | Default  | Descrição                                               |
| ------------------ | ---------------- | ----------- | -------- | ------------------------------------------------------- |
| `video`            | File             | ✅ Sim      | -        | Ficheiro de vídeo (mp4, mov, avi, mkv, webm, máx 500MB) |
| `show_angles`      | string (boolean) | Não         | `"true"` | Mostrar ângulos no vídeo processado                     |
| `max_duration_sec` | string (number)  | Não         | `"60"`   | Duração máxima do vídeo (máx: 120s)                     |

⚡ **Mais simples!** Não precisa de seed point - basta enviar o vídeo.

### Response (200 OK)

```typescript
{
  success: true,
  message: "Body analysis complete! Pose detected in 98% of frames",
  videoUrl: "https://barbell-path-tracker-production.up.railway.app/download/body_xyz98765.mp4",
  pose: {
    framesProcessed: 150,
    framesWithPose: 147,
    detectionRate: 98.0,
    durationSec: 5.0,
    averageAngles: {
      leftKnee: 170.5,
      rightKnee: 168.2,
      leftHip: 175.8,
      rightHip: 174.3,
      leftElbow: 165.0,
      rightElbow: 163.5,
      leftShoulder: 90.2,
      rightShoulder: 88.7,
      leftAnkle: 92.1,
      rightAnkle: 91.5,
      torsoInclination: 5.2
    }
  },
  skeletonFrames: [
    {
      frameWidth: 1280,
      frameHeight: 720,
      landmarks: [
        {
          name: "left_hip",
          index: 23,
          x: 0.52, y: 0.58, z: -0.05,
          visibility: 0.95,
          pixelX: 665, pixelY: 417,
          worldX: 0.02, worldY: -0.01, worldZ: -0.03
        }
        // ... 33 landmarks total
      ],
      bones: [
        { startIndex: 23, endIndex: 25, startName: "left_hip", endName: "left_knee" }
        // ... 35 bones total
      ]
    }
    // ... one SkeletonFrame per video frame
  ]
}
```

### Ideal Para

- 🧘 **Yoga** - Verificar alinhamento
- 🤸 **Mobilidade** - Amplitude de movimento
- 💪 **Stretching** - Ângulos de extensão
- 📐 **Form Check** - Análise de postura
- 🏃 **Cardio** - Movimento dinâmico

---

## 📱 Implementação Mobile

### TypeScript/React Native (Lift Analysis)

```typescript
import { trackBarbell } from "@/src/lib/barbell-api";

async function analyzeLiftVideo(
  videoUri: string,
  tapX: number,
  tapY: number,
  videoWidth: number,
  videoHeight: number
) {
  try {
    // Normalize tap coordinates to 0-1
    const seedNorm = {
      x: tapX / videoWidth,
      y: tapY / videoHeight,
    };

    const result = await trackBarbell(
      videoUri,
      seedNorm,
      videoWidth,
      videoHeight,
      (progress) => {
        console.log(`${progress.step}: ${progress.progress}%`);
      }
    );

    if (result.success) {
      console.log("Video URL:", result.videoUrl);
      console.log("Tracking success:", result.tracking.success);
      console.log("Pose detection:", result.pose.detectionRate + "%");

      if (result.pose.averageAngles) {
        console.log("Hip angle:", result.pose.averageAngles.leftHip);
        console.log("Knee angle:", result.pose.averageAngles.leftKnee);
      }
    }
  } catch (error) {
    console.error("Analysis failed:", error);
  }
}
```

### TypeScript/React Native (Motion Analysis)

```typescript
import { analyzeMotion } from "@/src/lib/motion-api";

async function analyzeBodyMovement(videoUri: string) {
  try {
    const result = await analyzeMotion(videoUri, (progress) => {
      console.log(`${progress.step}: ${progress.progress}%`);
    });

    if (result.success) {
      console.log("Video URL:", result.videoUrl);
      console.log("Pose detection:", result.pose.detectionRate + "%");

      if (result.pose.averageAngles) {
        console.log("Shoulder angle:", result.pose.averageAngles.leftShoulder);
        console.log(
          "Torso inclination:",
          result.pose.averageAngles.torsoInclination
        );
      }
    }
  } catch (error) {
    console.error("Analysis failed:", error);
  }
}
```

---

## 🌐 Implementação Web

### TypeScript/React (usando client helper)

```typescript
import {
  processLiftAnalysis,
  processMotionAnalysis,
} from "@/lib/lift-analysis-client";

// Lift Analysis
async function handleLiftUpload(file: File, clickX: number, clickY: number) {
  try {
    const result = await processLiftAnalysis(
      {
        video: file,
        seedX: clickX,
        seedY: clickY,
        showAngles: true,
        autoDetect: true,
      },
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      (progress) => {
        console.log(`Upload: ${progress.loaded}/${progress.total}`);
      }
    );

    console.log("Processed video:", result.videoUrl);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Motion Analysis
async function handleMotionUpload(file: File) {
  try {
    const result = await processMotionAnalysis(
      {
        video: file,
        showAngles: true,
      },
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      (progress) => {
        console.log(`Upload: ${progress.loaded}/${progress.total}`);
      }
    );

    console.log("Processed video:", result.videoUrl);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## ❌ Erros Comuns

### Response (400/500)

```typescript
{
  error: "Video exceeds 500 MB limit";
}
```

### Códigos de Status

| Código | Descrição                                           |
| ------ | --------------------------------------------------- |
| `200`  | Sucesso - Análise completa                          |
| `400`  | Bad Request - Parâmetros inválidos                  |
| `500`  | Internal Server Error                               |
| `503`  | Service Unavailable - Serviço externo indisponível  |
| `504`  | Gateway Timeout - Processamento demorou muito tempo |

### Mensagens de Erro

```typescript
// Vídeo muito longo
"Video duration exceeds maximum of 120 seconds";

// Ficheiro muito grande
"Video exceeds 500 MB limit";

// Formato não suportado
"Only mp4, mov, avi, mkv, and webm videos are supported";

// Coordenadas inválidas (lift only)
"seed_x and seed_y must be valid numbers";

// Timeout
"Request timeout. Video processing took too long.";

// Serviço indisponível
"Failed to connect to video processing service";
```

### Error Handling

```typescript
try {
  const result = await processLiftAnalysis(params, apiUrl);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      alert("Processamento demorou muito. Tente com vídeo mais curto.");
    } else if (error.message.includes("500 MB")) {
      alert("Vídeo muito grande. Limite é 500 MB.");
    } else if (error.message.includes("120 seconds")) {
      alert("Vídeo muito longo. Limite é 2 minutos.");
    } else {
      alert(`Erro: ${error.message}`);
    }
  }
}
```

---

## ⚡ Limites e Restrições

| Recurso                        | Limite                               |
| ------------------------------ | ------------------------------------ |
| **Tamanho máximo**             | 500 MB                               |
| **Duração máxima**             | 120 segundos                         |
| **Duração default processada** | 60 segundos                          |
| **Formatos aceites**           | mp4, mov, avi, mkv, webm             |
| **Tempo de retenção**          | ~1 hora (vídeos processados expiram) |
| **Timeout de request**         | 5 minutos                            |

---

## 📐 Ângulos das Articulações

Todos os ângulos são devolvidos em **graus (0-180)**.

### Ângulos Disponíveis

| Ângulo                           | Descrição            | Componentes                 |
| -------------------------------- | -------------------- | --------------------------- |
| `leftKnee` / `rightKnee`         | Flexão do joelho     | Anca → Joelho → Tornozelo   |
| `leftHip` / `rightHip`           | Flexão da anca       | Ombro → Anca → Joelho       |
| `leftElbow` / `rightElbow`       | Flexão do cotovelo   | Ombro → Cotovelo → Pulso    |
| `leftShoulder` / `rightShoulder` | Elevação do ombro    | Anca → Ombro → Cotovelo     |
| `leftAnkle` / `rightAnkle`       | Dorsiflexão          | Joelho → Tornozelo → Pé     |
| `torsoInclination`               | Inclinação do tronco | Vertical → Linha Ombro-Anca |

### Interpretação

```typescript
// Exemplo: Squat depth analysis
if (result.pose.averageAngles.leftKnee < 90) {
  console.log("✅ Profundidade adequada (below parallel)");
} else {
  console.log("⚠️ Squat acima do paralelo");
}

// Exemplo: Deadlift back angle
if (result.pose.averageAngles.torsoInclination < 20) {
  console.log("✅ Costas relativamente verticais");
} else {
  console.log("⚠️ Inclinação excessiva do tronco");
}
```

---

## 🎯 Melhores Práticas

### Para Lift Analysis (Barbell Tracking)

1. **Vista de perfil perfeita** - Câmara perpendicular ao movimento
2. **Tocar no disco/peso** - Centro ou borda do disco serve
3. **Barra visível** - Não obstruir a barra com o corpo
4. **Auto-detect ativo** - Deixar `auto_detect=true` para melhor precisão
5. **Iluminação adequada** - Evitar sombras sobre a barra
6. **Fundo simples** - Facilita deteção do disco

### Para Motion Analysis (Pose Only)

1. **Qualquer ângulo funciona** - Frente, perfil, diagonal
2. **Corpo visível** - Atleta deve estar no frame
3. **Uma pessoa no vídeo** - Melhor performance
4. **Boa iluminação** - Evitar contraluz
5. **Roupa contrastante** - Facilita deteção de keypoints

---

## 🔧 Troubleshooting

### Tracking falhou mas Pose funcionou

```typescript
{
  tracking: { success: false },
  pose: { detectionRate: 92 }
}
```

**Solução:**

- Melhorar iluminação do disco/peso
- Garantir que o disco é circular e visível
- Tocar mais próximo do centro do disco
- Usar fundo menos confuso

### Pose detection rate baixa (< 70%)

**Causas comuns:**

- Má iluminação
- Corpo parcialmente fora do frame
- Roupas que se confundem com o fundo
- Movimento muito rápido

**Solução:**

- Melhorar iluminação
- Ajustar enquadramento
- Usar roupa contrastante
- Reduzir velocidade do movimento

---

## 📚 TypeScript Types

```typescript
// Lift Analysis Types
import type {
  LiftAnalysisProcessRequest,
  LiftAnalysisProcessResponse,
  TrackingData,
  PoseData,
  PoseAngles,
  Landmark3D,
  SkeletonBone,
  SkeletonFrame,
} from "@/types/lift-analysis";

// Motion Analysis Types
import type {
  MotionAnalysisProcessRequest,
  MotionAnalysisProcessResponse,
} from "@/types/lift-analysis";

// Client Functions
import {
  processLiftAnalysis,
  processMotionAnalysis,
} from "@/lib/lift-analysis-client";

// Mobile Functions
import { trackBarbell } from "@/src/lib/barbell-api";
import { analyzeMotion } from "@/src/lib/motion-api";
```

---

## 🔗 Arquitetura

### Produção (B2 + Railway URL — recomendado)

```
┌─────────────┐   PUT presigned URL    ┌──────────────────┐
│   Client    │ ─────────────────────► │  Backblaze B2    │
│ (Browser /  │   (upload direto)      │  (S3-compatible) │
│  Mobile)    │                        └────────┬─────────┘
└──────┬──────┘                                 │
       │ POST JSON {key, params}                │ GET presigned URL
       ▼                                        ▼
┌──────────────┐   POST JSON            ┌──────────────────────┐
│   Vercel     │ ─────────────────────► │ barbell-path-tracker │
│  (thin proxy │   {video_url, params}  │  Railway Service     │
│   ~1KB JSON) │                        │                      │
│              │ ◄───────────────────── │  1. Download video   │
│              │   JSON response        │  2. Trim/transcode   │
└──────────────┘                        │  3. Process (OpenCV  │
                                        │     + MediaPipe)     │
                                        │  4. Return results   │
                                        └──────────────────────┘
```

**Nota:** Vercel **nunca toca nos bytes do vídeo**. Gera apenas um presigned URL e envia JSON ao Railway.

### Legacy / Desenvolvimento Local

```
┌─────────────┐
│   Mobile    │
│  iOS/Android│
└──────┬──────┘
       │
       │ POST /api/lift-analysis/process   (multipart/form-data)
       │ POST /api/motion-analysis/process
       ▼
┌─────────────┐
│   Athlifyr  │
│   Backend   │ (Next.js API Routes)
│ (proxy only)│
└──────┬──────┘
       │
       │ POST /analyze/full   (multipart/form-data)
       │ POST /analyze/body
       ▼
┌──────────────────────┐
│ barbell-path-tracker │
│  Railway Service     │ (Python FastAPI)
│  - OpenCV tracking   │
│  - MediaPipe pose    │
└──────────────────────┘
```

**⚠️ O fluxo legacy funciona apenas para vídeos < 4.5 MB em produção (Vercel).** Para vídeos maiores, usar o fluxo B2.

---

## 📞 Suporte

**Dúvidas ou problemas?**

- GitHub Issues: [github.com/palhinhax/Athlifyr/issues](https://github.com/palhinhax/Athlifyr/issues)
- Documentação externa: [barbell-path-tracker docs](https://barbell-path-tracker-production.up.railway.app/docs)

---

## 🦴 3D Skeleton Data (skeleton_frames)

Ambos os endpoints devolvem `skeletonFrames` — um array com dados de esqueleto 3D por frame de vídeo. Estes dados permitem rendering de esqueleto em 3D (Three.js, SceneKit, etc.).

### Estrutura

Cada `SkeletonFrame` contém:

- **33 landmarks** (pontos do corpo MediaPipe Pose)
- **35 bones** (conexões entre landmarks)
- **Dimensões do frame** original

### Landmark3D

| Campo                        | Tipo           | Descrição                                           |
| ---------------------------- | -------------- | --------------------------------------------------- |
| `name`                       | string         | Nome do landmark (e.g., "left_shoulder")            |
| `index`                      | number         | Índice MediaPipe (0-32)                             |
| `x`, `y`, `z`                | number         | Coordenadas normalizadas (0-1, z: negativo = perto) |
| `visibility`                 | number         | Confiança da deteção (0-1, threshold: 0.5)          |
| `pixelX`, `pixelY`           | number         | Coordenadas em pixéis no frame original             |
| `worldX`, `worldY`, `worldZ` | number \| null | Coordenadas em metros (origem: centro da anca)      |

### SkeletonBone

| Campo        | Tipo   | Descrição                  |
| ------------ | ------ | -------------------------- |
| `startIndex` | number | Índice do landmark inicial |
| `endIndex`   | number | Índice do landmark final   |
| `startName`  | string | Nome do landmark inicial   |
| `endName`    | string | Nome do landmark final     |

### Exemplo de Uso (Three.js)

```typescript
import type { SkeletonFrame, Landmark3D } from "@/types/lift-analysis";

function renderSkeleton(frame: SkeletonFrame) {
  // Render landmarks como esferas
  for (const lm of frame.landmarks) {
    if (lm.visibility > 0.5 && lm.worldX !== null) {
      addSphere(lm.worldX, lm.worldY!, lm.worldZ!, 0.02);
    }
  }

  // Render bones como linhas
  for (const bone of frame.bones) {
    const start = frame.landmarks[bone.startIndex];
    const end = frame.landmarks[bone.endIndex];
    if (start.visibility > 0.5 && end.visibility > 0.5) {
      addLine(
        start.worldX!,
        start.worldY!,
        start.worldZ!,
        end.worldX!,
        end.worldY!,
        end.worldZ!
      );
    }
  }
}
```

### Landmarks MediaPipe Pose (33 pontos)

```
0: nose                 11: left_shoulder      23: left_hip
1: left_eye_inner       12: right_shoulder     24: right_hip
2: left_eye             13: left_elbow         25: left_knee
3: left_eye_outer       14: right_elbow        26: right_knee
4: right_eye_inner      15: left_wrist         27: left_ankle
5: right_eye            16: right_wrist        28: right_ankle
6: right_eye_outer      17: left_pinky         29: left_heel
7: left_ear             18: right_pinky        30: right_heel
8: right_ear            19: left_index         31: left_foot_index
9: mouth_left           20: right_index        32: right_foot_index
10: mouth_right         21: left_thumb
                        22: right_thumb
```

---

## 📝 Changelog

### v3.0.0 (Current)

- 🚀 **Upload direto ao Backblaze B2** — vídeo nunca passa pelo Vercel
- 🚀 **Railway descarrega o vídeo** via presigned URL (novos endpoints `/analyze/full/url` e `/analyze/body/url`)
- 🚀 **Railway faz upload do vídeo resultado** diretamente ao B2 via presigned PUT URL (`result_upload_url`)
- 🚀 **Vercel é um thin JSON proxy** (~1 KB) — resolve o erro `FUNCTION_PAYLOAD_TOO_LARGE`
- 🚀 **Zero bytes de vídeo passam pelo Vercel** — nem input, nem output
- ✨ Endpoint `/api/uploads/presign` para gerar presigned PUT URLs
- ✨ Endpoints `/api/lift-analysis/process-b2` e `/api/motion-analysis/process-b2`
- ✨ Trim e transcode delegados ao Railway
- ✨ Save routes detectam vídeo já no B2 e evitam download desnecessário
- 📚 Documentação Railway: `docs/api/RAILWAY_URL_ENDPOINTS.md`

### v2.1.0

- ✨ Suporte para **skeleton_frames** com dados 3D por frame
- ✨ 33 landmarks MediaPipe Pose por frame (coordenadas normalizadas + world em metros)
- ✨ 35 conexões de ossos (bone connections) para rendering de esqueleto
- ✨ Save endpoints agora aceitam `analysisData` (resposta completa do proxy incluindo skeletonFrames)
- ✨ Upload web guarda toda a resposta da análise incluindo dados 3D
- 📚 Documentação atualizada com tipos 3D e exemplos

### v2.0.0 (19 Fevereiro 2026)

- ✨ Migração completa para processamento externo
- ✨ Endpoint `/api/lift-analysis/process` (proxy para `/analyze/full`)
- ✨ Endpoint `/api/motion-analysis/process` (proxy para `/analyze/body`)
- ✨ Novos ângulos: shoulder, ankle, torso inclination
- ✨ Suporte mobile e web unificado
- ✨ Remoção de processamento local (TensorFlow.js WebView)
- ✨ Types TypeScript completos
- 📚 Documentação completa

---

**Última atualização:** 21 de Fevereiro de 2026  
**Versão da API:** 3.0.0
