# Video Analysis API - Documentação Completa

## 📋 Visão Geral

As APIs centralizadas de análise de vídeo processam vídeos de fitness/desporto usando uma API externa especializada hospedada no Railway. **Toda a análise de vídeo é feita externamente** - a aplicação Athlifyr apenas faz proxy para os serviços de processamento.

### Endpoints Disponíveis

| Endpoint                       | Tipo           | Quando Usar                                                 |
| ------------------------------ | -------------- | ----------------------------------------------------------- |
| `/api/lift-analysis/process`   | Barbell + Pose | Deadlift, Squat, Clean, Snatch, Bench Press (vista lateral) |
| `/api/motion-analysis/process` | Full Body Pose | Yoga, Mobilidade, Stretching, Cardio, Form Check            |

### Características

- ✅ **Processamento 100% externo** via `https://barbell-path-tracker-production.up.railway.app`
- ✅ **Barbell tracking** com linha dourada mostrando caminho da barra
- ✅ **Pose estimation** com esqueleto verde néon
- ✅ **Ângulos das articulações** (anca, joelho, cotovelo, ombro, tornozelo, tronco)
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
  }
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
  }
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

```
┌─────────────┐
│   Mobile    │
│  iOS/Android│
└──────┬──────┘
       │
       │ POST /api/lift-analysis/process
       │ POST /api/motion-analysis/process
       ▼
┌─────────────┐
│   Athlifyr  │
│   Backend   │ (Next.js API Routes)
│ (proxy only)│
└──────┬──────┘
       │
       │ POST /analyze/full
       │ POST /analyze/body
       ▼
┌──────────────────────┐
│ barbell-path-tracker │
│  Railway Service     │ (Python FastAPI)
│  - OpenCV tracking   │
│  - MediaPipe pose    │
└──────────────────────┘
```

**Nota:** A app Athlifyr **NÃO processa vídeos localmente**. Serve apenas como proxy para o serviço externo Railway.

---

## 📞 Suporte

**Dúvidas ou problemas?**

- GitHub Issues: [github.com/palhinhax/Athlifyr/issues](https://github.com/palhinhax/Athlifyr/issues)
- Documentação externa: [barbell-path-tracker docs](https://barbell-path-tracker-production.up.railway.app/docs)

---

## 📝 Changelog

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

**Última atualização:** 19 de Fevereiro de 2026  
**Versão da API:** 2.0.0
