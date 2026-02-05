/**
 * Seed Trail da CabeçAlta 2026
 * Complete with translations in all 6 languages
 * Trail running event in Videmonte, Guarda, Serra da Estrela, Portugal
 * Organized by Associação Cultural e Social de Videmonte
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Trail da CabeçAlta 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "trail-cabecalta-2026" },
    update: {
      title: "Trail da CabeçAlta 2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**Uma aventura épica no coração da Serra da Estrela!**

O Trail da CabeçAlta realiza-se a **22 de fevereiro de 2026** em Videmonte, Guarda, proporcionando uma experiência única pelos trilhos mais emblemáticos do Parque Natural da Serra da Estrela.

### 🏃 As Provas

**Trail Longo (26km)** - O desafio principal
- Distância: ~26 km
- Desnível positivo: 1100 metros
- Tempo limite: 5h30
- Prova competitiva de corrida em montanha

**Trail Curto (14km)** - Desafio técnico
- Distância: ~14 km
- Desnível positivo: 800 metros
- Tempo limite: 3h00
- Prova competitiva para todos os níveis

**Caminhada (12km)** - Para todos
- Distância: ~12 km
- Carácter não competitivo
- Ambiente familiar e descontraído

### 🌿 Ética e Valores

O Trail da CabeçAlta baseia-se em ética e valores fundamentais partilhados por todos os corredores, parceiros, voluntários e organizadores:

- **Responsabilidade Ecológica**: Nunca deitar lixo ao chão, respeitar a fauna e flora, seguir estritamente a rota marcada
- **Responsabilidade Social**: Partilhar o gosto pelos trilhos da serra com a comunidade
- **Solidariedade**: Todos os atletas têm a obrigação de prestar ajuda a outros participantes

### 🎒 Material Obrigatório

| Material | Trail Curto | Trail Longo | Caminhada |
|----------|-------------|-------------|-----------|
| 🏷️ Dorsal | Obrigatório | Obrigatório | - |
| 🔔 Apito | Obrigatório | Obrigatório | - |
| 📱 Telemóvel | Obrigatório | Obrigatório | Recomendado |
| 🧊 Manta sobrevivência | Recomendado | Obrigatório | - |
| 💧 Reservatório 1L | Recomendado | Obrigatório | - |
| 🧥 Impermeável/Corta-vento | Recomendado | Recomendado | Recomendado |
| 🥤 Copo 0.5L | Obrigatório | Obrigatório | Recomendado |
| 🩹 Ligadura | Obrigatório | Obrigatório | Recomendado |

### 🎁 Kit de Participante

- 🏷️ Dorsal personalizado com chip
- 👕 T-Shirt Técnica OFICIAL marca EM3
- 🥖 1 Pão de Centeio de Videmonte
- 🏅 Medalha Finisher
- 💆 Massagem de recuperação no final
- ⏱️ Cronometragem
- 🎁 Brindes alusivos à prova
- 🏥 Seguro desportivo
- 🚐 Transporte para a meta em caso de desistência
- 📸 Registo fotográfico
- 💊 Vale de desconto de 25% Mondego Saúde - Fisioterapia & Bem-Estar

### 📅 Programa

**Domingo, 22 de Fevereiro de 2026:**
- 07h30-09h00 - Abertura do Secretariado (Salão Cultural de Videmonte)
- 08h30 - Controlo de atletas para Trail Curto e Trail Longo
- 09h00 - Partida Trail Curto (tempo limite 3h00) e Trail Longo (tempo limite 5h30)
- 09h05 - Partida Caminhada
- 13h00-15h00 - Almoço e Cerimónia de entrega de prémios (Salão Cultural de Videmonte)

### 🏆 Prémios e Classificações

**Classificação Geral:**
- Troféus para os 3 primeiros masculinos e femininas (Trail Curto e Trail Longo)

**Meta-Volante:**
- Prémio extra para o primeiro masculino e primeira feminina (ambas as provas)

**Por Escalões:**
- Sub-23 (18 aos 23 anos)
- Seniores (24 aos 39 anos)
- M40/F40 (40 aos 49 anos)
- M50/F50 (50 aos 59 anos)
- M60/F60 (60 em diante)

**Prémios Coletivos:**
- 3 melhores equipas masculinas e femininas (mínimo 6 atletas a terminar)

### ⚠️ Regras e Penalizações

| Infração | Penalização |
|----------|-------------|
| Sair do percurso marcado | 15 minutos |
| Fazer-se acompanhar de não inscritos | 2 horas |
| Atalho significativo | 1 a 4 horas |
| Atirar lixo voluntariamente | Desclassificado |
| Falta de item obrigatório | Desclassificado |
| Não ajudar atleta em necessidade | Desclassificado |

### ℹ️ Informações Importantes

- 📍 Local: Salão Cultural de Videmonte, Guarda
- 🏞️ Parque Natural da Serra da Estrela
- 📅 Data: 22 de fevereiro de 2026
- 🔗 Inscrições: [stopandgo.net](https://stopandgo.net/events/trail-da-cabecalta-2026)
- 📧 Contacto: ptn.sport.eventos@gmail.com
- 🎂 Idade mínima: 18 anos (provas competitivas), menores de 16 anos na caminhada acompanhados por adulto

### 🍽️ Almoço Incluído

O almoço está incluído no valor da inscrição e será servido no Salão Cultural de Videmonte.

📍 **Coordenadas:** 40.5376, -7.2673`,
      startDate: new Date("2026-02-22T09:00:00Z"),
      endDate: new Date("2026-02-22T15:00:00Z"),
      registrationDeadline: new Date("2026-02-15T23:59:59Z"),
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      city: "Guarda",
      country: "Portugal",
      latitude: 40.5376,
      longitude: -7.2673,
      googleMapsUrl: "https://maps.app.goo.gl/Ytpq8FULugXLiw4g9",
      externalUrl: "https://stopandgo.net/events/trail-da-cabecalta-2026",
      imageUrl: "",
    },
    create: {
      title: "Trail da CabeçAlta 2026",
      slug: "trail-cabecalta-2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**Uma aventura épica no coração da Serra da Estrela!**

O Trail da CabeçAlta realiza-se a **22 de fevereiro de 2026** em Videmonte, Guarda, proporcionando uma experiência única pelos trilhos mais emblemáticos do Parque Natural da Serra da Estrela.

### 🏃 As Provas

**Trail Longo (26km)** - O desafio principal
- Distância: ~26 km
- Desnível positivo: 1100 metros
- Tempo limite: 5h30
- Prova competitiva de corrida em montanha

**Trail Curto (14km)** - Desafio técnico
- Distância: ~14 km
- Desnível positivo: 800 metros
- Tempo limite: 3h00
- Prova competitiva para todos os níveis

**Caminhada (12km)** - Para todos
- Distância: ~12 km
- Carácter não competitivo
- Ambiente familiar e descontraído

### 🌿 Ética e Valores

O Trail da CabeçAlta baseia-se em ética e valores fundamentais partilhados por todos os corredores, parceiros, voluntários e organizadores:

- **Responsabilidade Ecológica**: Nunca deitar lixo ao chão, respeitar a fauna e flora, seguir estritamente a rota marcada
- **Responsabilidade Social**: Partilhar o gosto pelos trilhos da serra com a comunidade
- **Solidariedade**: Todos os atletas têm a obrigação de prestar ajuda a outros participantes

### 🎒 Material Obrigatório

| Material | Trail Curto | Trail Longo | Caminhada |
|----------|-------------|-------------|-----------|
| 🏷️ Dorsal | Obrigatório | Obrigatório | - |
| 🔔 Apito | Obrigatório | Obrigatório | - |
| 📱 Telemóvel | Obrigatório | Obrigatório | Recomendado |
| 🧊 Manta sobrevivência | Recomendado | Obrigatório | - |
| 💧 Reservatório 1L | Recomendado | Obrigatório | - |
| 🧥 Impermeável/Corta-vento | Recomendado | Recomendado | Recomendado |
| 🥤 Copo 0.5L | Obrigatório | Obrigatório | Recomendado |
| 🩹 Ligadura | Obrigatório | Obrigatório | Recomendado |

### 🎁 Kit de Participante

- 🏷️ Dorsal personalizado com chip
- 👕 T-Shirt Técnica OFICIAL marca EM3
- 🥖 1 Pão de Centeio de Videmonte
- 🏅 Medalha Finisher
- 💆 Massagem de recuperação no final
- ⏱️ Cronometragem
- 🎁 Brindes alusivos à prova
- 🏥 Seguro desportivo
- 🚐 Transporte para a meta em caso de desistência
- 📸 Registo fotográfico
- 💊 Vale de desconto de 25% Mondego Saúde - Fisioterapia & Bem-Estar

### 📅 Programa

**Domingo, 22 de Fevereiro de 2026:**
- 07h30-09h00 - Abertura do Secretariado (Salão Cultural de Videmonte)
- 08h30 - Controlo de atletas para Trail Curto e Trail Longo
- 09h00 - Partida Trail Curto (tempo limite 3h00) e Trail Longo (tempo limite 5h30)
- 09h05 - Partida Caminhada
- 13h00-15h00 - Almoço e Cerimónia de entrega de prémios (Salão Cultural de Videmonte)

### 🏆 Prémios e Classificações

**Classificação Geral:**
- Troféus para os 3 primeiros masculinos e femininas (Trail Curto e Trail Longo)

**Meta-Volante:**
- Prémio extra para o primeiro masculino e primeira feminina (ambas as provas)

**Por Escalões:**
- Sub-23 (18 aos 23 anos)
- Seniores (24 aos 39 anos)
- M40/F40 (40 aos 49 anos)
- M50/F50 (50 aos 59 anos)
- M60/F60 (60 em diante)

**Prémios Coletivos:**
- 3 melhores equipas masculinas e femininas (mínimo 6 atletas a terminar)

### ⚠️ Regras e Penalizações

| Infração | Penalização |
|----------|-------------|
| Sair do percurso marcado | 15 minutos |
| Fazer-se acompanhar de não inscritos | 2 horas |
| Atalho significativo | 1 a 4 horas |
| Atirar lixo voluntariamente | Desclassificado |
| Falta de item obrigatório | Desclassificado |
| Não ajudar atleta em necessidade | Desclassificado |

### ℹ️ Informações Importantes

- 📍 Local: Salão Cultural de Videmonte, Guarda
- 🏞️ Parque Natural da Serra da Estrela
- 📅 Data: 22 de fevereiro de 2026
- 🔗 Inscrições: [stopandgo.net](https://stopandgo.net/events/trail-da-cabecalta-2026)
- 📧 Contacto: ptn.sport.eventos@gmail.com
- 🎂 Idade mínima: 18 anos (provas competitivas), menores de 16 anos na caminhada acompanhados por adulto

### 🍽️ Almoço Incluído

O almoço está incluído no valor da inscrição e será servido no Salão Cultural de Videmonte.

📍 **Coordenadas:** 40.5376, -7.2673`,
      startDate: new Date("2026-02-22T09:00:00Z"),
      endDate: new Date("2026-02-22T15:00:00Z"),
      registrationDeadline: new Date("2026-02-15T23:59:59Z"),
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      city: "Guarda",
      country: "Portugal",
      latitude: 40.5376,
      longitude: -7.2673,
      googleMapsUrl: "https://maps.app.goo.gl/Ytpq8FULugXLiw4g9",
      externalUrl: "https://stopandgo.net/events/trail-da-cabecalta-2026",
      imageUrl: "",
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Step 2: Upsert translations for all 6 languages
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "Trail da CabeçAlta 2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**Uma aventura épica no coração da Serra da Estrela!**

O Trail da CabeçAlta realiza-se a **22 de fevereiro de 2026** em Videmonte, Guarda, proporcionando uma experiência única pelos trilhos mais emblemáticos do Parque Natural da Serra da Estrela.

### 🏃 As Provas

**Trail Longo (26km)** - O desafio principal
- Distância: ~26 km
- Desnível positivo: 1100 metros
- Tempo limite: 5h30
- Prova competitiva de corrida em montanha

**Trail Curto (14km)** - Desafio técnico
- Distância: ~14 km
- Desnível positivo: 800 metros
- Tempo limite: 3h00
- Prova competitiva para todos os níveis

**Caminhada (12km)** - Para todos
- Distância: ~12 km
- Carácter não competitivo
- Ambiente familiar e descontraído

### 🌿 Ética e Valores

O Trail da CabeçAlta baseia-se em ética e valores fundamentais partilhados por todos os corredores, parceiros, voluntários e organizadores:

- **Responsabilidade Ecológica**: Nunca deitar lixo ao chão, respeitar a fauna e flora, seguir estritamente a rota marcada
- **Responsabilidade Social**: Partilhar o gosto pelos trilhos da serra com a comunidade
- **Solidariedade**: Todos os atletas têm a obrigação de prestar ajuda a outros participantes

### 🎒 Material Obrigatório

| Material | Trail Curto | Trail Longo | Caminhada |
|----------|-------------|-------------|-----------|
| 🏷️ Dorsal | Obrigatório | Obrigatório | - |
| 🔔 Apito | Obrigatório | Obrigatório | - |
| 📱 Telemóvel | Obrigatório | Obrigatório | Recomendado |
| 🧊 Manta sobrevivência | Recomendado | Obrigatório | - |
| 💧 Reservatório 1L | Recomendado | Obrigatório | - |
| 🧥 Impermeável/Corta-vento | Recomendado | Recomendado | Recomendado |
| 🥤 Copo 0.5L | Obrigatório | Obrigatório | Recomendado |
| 🩹 Ligadura | Obrigatório | Obrigatório | Recomendado |

### 🎁 Kit de Participante

- 🏷️ Dorsal personalizado com chip
- 👕 T-Shirt Técnica OFICIAL marca EM3
- 🥖 1 Pão de Centeio de Videmonte
- 🏅 Medalha Finisher
- 💆 Massagem de recuperação no final
- ⏱️ Cronometragem
- 🎁 Brindes alusivos à prova
- 🏥 Seguro desportivo
- 🚐 Transporte para a meta em caso de desistência
- 📸 Registo fotográfico
- 💊 Vale de desconto de 25% Mondego Saúde - Fisioterapia & Bem-Estar

### 📅 Programa

**Domingo, 22 de Fevereiro de 2026:**
- 07h30-09h00 - Abertura do Secretariado (Salão Cultural de Videmonte)
- 08h30 - Controlo de atletas para Trail Curto e Trail Longo
- 09h00 - Partida Trail Curto (tempo limite 3h00) e Trail Longo (tempo limite 5h30)
- 09h05 - Partida Caminhada
- 13h00-15h00 - Almoço e Cerimónia de entrega de prémios

### 🏆 Prémios e Classificações

**Classificação Geral:**
- Troféus para os 3 primeiros masculinos e femininas (Trail Curto e Trail Longo)

**Meta-Volante:**
- Prémio extra para o primeiro masculino e primeira feminina (ambas as provas)

**Por Escalões:**
- Sub-23 (18 aos 23 anos)
- Seniores (24 aos 39 anos)
- M40/F40 (40 aos 49 anos)
- M50/F50 (50 aos 59 anos)
- M60/F60 (60 em diante)

### ℹ️ Informações Importantes

- 📍 Local: Salão Cultural de Videmonte, Guarda
- 🏞️ Parque Natural da Serra da Estrela
- 📅 Data: 22 de fevereiro de 2026
- 🎂 Idade mínima: 18 anos (provas competitivas)
- 🍽️ Almoço incluído na inscrição`,
      city: "Guarda",
      metaTitle: "Trail da CabeçAlta 2026 | Videmonte, Guarda | 22 Fevereiro",
      metaDescription:
        "Trail da CabeçAlta 2026 - 22 de fevereiro em Videmonte, Guarda. Provas: Trail Longo 26km (D+1100m), Trail Curto 14km (D+800m) e Caminhada 12km. Serra da Estrela.",
    },
    en: {
      title: "Trail da CabeçAlta 2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**An epic adventure in the heart of Serra da Estrela!**

Trail da CabeçAlta takes place on **February 22, 2026** in Videmonte, Guarda, offering a unique experience through the most emblematic trails of the Serra da Estrela Natural Park.

### 🏃 The Races

**Long Trail (26km)** - The main challenge
- Distance: ~26 km
- Elevation gain: 1100 meters
- Time limit: 5h30
- Competitive mountain running race

**Short Trail (14km)** - Technical challenge
- Distance: ~14 km
- Elevation gain: 800 meters
- Time limit: 3h00
- Competitive race for all levels

**Walk (12km)** - For everyone
- Distance: ~12 km
- Non-competitive nature
- Family-friendly atmosphere

### 🌿 Ethics and Values

Trail da CabeçAlta is based on fundamental ethics and values shared by all runners, partners, volunteers and organizers:

- **Environmental Responsibility**: Never throw litter on the ground, respect fauna and flora, strictly follow the marked route
- **Social Responsibility**: Share the love for mountain trails with the community
- **Solidarity**: All athletes are obliged to help other participants in need

### 🎒 Mandatory Equipment

| Equipment | Short Trail | Long Trail | Walk |
|-----------|-------------|------------|------|
| 🏷️ Bib | Mandatory | Mandatory | - |
| 🔔 Whistle | Mandatory | Mandatory | - |
| 📱 Mobile phone | Mandatory | Mandatory | Recommended |
| 🧊 Survival blanket | Recommended | Mandatory | - |
| 💧 1L Water reservoir | Recommended | Mandatory | - |
| 🧥 Waterproof/Windbreaker | Recommended | Recommended | Recommended |
| 🥤 0.5L Cup | Mandatory | Mandatory | Recommended |
| 🩹 Bandage | Mandatory | Mandatory | Recommended |

### 🎁 Participant Kit

- 🏷️ Personalized bib with chip
- 👕 Official Technical T-Shirt EM3 brand
- 🥖 1 Videmonte Rye Bread
- 🏅 Finisher Medal
- 💆 Recovery massage at the finish
- ⏱️ Timing
- 🎁 Event souvenirs
- 🏥 Sports insurance
- 🚐 Transport to finish line if withdrawing
- 📸 Photo coverage
- 💊 25% discount voucher Mondego Saúde - Physiotherapy & Wellness

### 📅 Schedule

**Sunday, February 22, 2026:**
- 07:30-09:00 - Registration opens (Videmonte Cultural Hall)
- 08:30 - Athlete check-in for Short and Long Trail
- 09:00 - Start Short Trail (3h limit) and Long Trail (5h30 limit)
- 09:05 - Start Walk
- 13:00-15:00 - Lunch and Award ceremony

### 🏆 Awards and Rankings

**Overall Classification:**
- Trophies for top 3 male and female (Short and Long Trail)

**Flying Finish:**
- Extra prize for first male and female (both races)

**By Age Group:**
- Sub-23 (18 to 23 years)
- Seniors (24 to 39 years)
- M40/F40 (40 to 49 years)
- M50/F50 (50 to 59 years)
- M60/F60 (60 and over)

### ℹ️ Important Information

- 📍 Location: Videmonte Cultural Hall, Guarda
- 🏞️ Serra da Estrela Natural Park
- 📅 Date: February 22, 2026
- 🎂 Minimum age: 18 years (competitive races)
- 🍽️ Lunch included in registration`,
      city: "Guarda",
      metaTitle: "Trail da CabeçAlta 2026 | Videmonte, Guarda | February 22",
      metaDescription:
        "Trail da CabeçAlta 2026 - February 22 in Videmonte, Guarda. Races: Long Trail 26km (D+1100m), Short Trail 14km (D+800m) and Walk 12km. Serra da Estrela.",
    },
    es: {
      title: "Trail da CabeçAlta 2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**¡Una aventura épica en el corazón de Serra da Estrela!**

El Trail da CabeçAlta se celebra el **22 de febrero de 2026** en Videmonte, Guarda, ofreciendo una experiencia única por los senderos más emblemáticos del Parque Natural de Serra da Estrela.

### 🏃 Las Carreras

**Trail Largo (26km)** - El desafío principal
- Distancia: ~26 km
- Desnivel positivo: 1100 metros
- Límite de tiempo: 5h30
- Carrera competitiva de montaña

**Trail Corto (14km)** - Desafío técnico
- Distancia: ~14 km
- Desnivel positivo: 800 metros
- Límite de tiempo: 3h00
- Carrera competitiva para todos los niveles

**Caminata (12km)** - Para todos
- Distancia: ~12 km
- Carácter no competitivo
- Ambiente familiar y relajado

### 🌿 Ética y Valores

El Trail da CabeçAlta se basa en ética y valores fundamentales compartidos por todos los corredores, socios, voluntarios y organizadores:

- **Responsabilidad Ecológica**: Nunca tirar basura al suelo, respetar la fauna y flora, seguir estrictamente la ruta marcada
- **Responsabilidad Social**: Compartir el gusto por los senderos de montaña con la comunidad
- **Solidaridad**: Todos los atletas tienen la obligación de ayudar a otros participantes

### 🎒 Material Obligatorio

| Material | Trail Corto | Trail Largo | Caminata |
|----------|-------------|-------------|----------|
| 🏷️ Dorsal | Obligatorio | Obligatorio | - |
| 🔔 Silbato | Obligatorio | Obligatorio | - |
| 📱 Teléfono móvil | Obligatorio | Obligatorio | Recomendado |
| 🧊 Manta supervivencia | Recomendado | Obligatorio | - |
| 💧 Depósito agua 1L | Recomendado | Obligatorio | - |
| 🧥 Impermeable/Cortaviento | Recomendado | Recomendado | Recomendado |
| 🥤 Vaso 0.5L | Obligatorio | Obligatorio | Recomendado |
| 🩹 Venda | Obligatorio | Obligatorio | Recomendado |

### 🎁 Kit del Participante

- 🏷️ Dorsal personalizado con chip
- 👕 Camiseta Técnica OFICIAL marca EM3
- 🥖 1 Pan de Centeno de Videmonte
- 🏅 Medalla Finisher
- 💆 Masaje de recuperación al final
- ⏱️ Cronometraje
- 🎁 Recuerdos del evento
- 🏥 Seguro deportivo
- 🚐 Transporte a meta en caso de abandono
- 📸 Cobertura fotográfica
- 💊 Vale descuento 25% Mondego Saúde - Fisioterapia & Bienestar

### 📅 Programa

**Domingo, 22 de Febrero de 2026:**
- 07:30-09:00 - Apertura del Secretariado (Salón Cultural de Videmonte)
- 08:30 - Control de atletas para Trail Corto y Trail Largo
- 09:00 - Salida Trail Corto (límite 3h) y Trail Largo (límite 5h30)
- 09:05 - Salida Caminata
- 13:00-15:00 - Almuerzo y Ceremonia de entrega de premios

### 🏆 Premios y Clasificaciones

**Clasificación General:**
- Trofeos para los 3 primeros masculinos y femeninas (Trail Corto y Trail Largo)

**Meta Volante:**
- Premio extra para el primer masculino y primera femenina (ambas carreras)

**Por Categorías de Edad:**
- Sub-23 (18 a 23 años)
- Seniores (24 a 39 años)
- M40/F40 (40 a 49 años)
- M50/F50 (50 a 59 años)
- M60/F60 (60 en adelante)

### ℹ️ Información Importante

- 📍 Lugar: Salón Cultural de Videmonte, Guarda
- 🏞️ Parque Natural de Serra da Estrela
- 📅 Fecha: 22 de febrero de 2026
- 🎂 Edad mínima: 18 años (carreras competitivas)
- 🍽️ Almuerzo incluido en la inscripción`,
      city: "Guarda",
      metaTitle: "Trail da CabeçAlta 2026 | Videmonte, Guarda | 22 Febrero",
      metaDescription:
        "Trail da CabeçAlta 2026 - 22 de febrero en Videmonte, Guarda. Carreras: Trail Largo 26km (D+1100m), Trail Corto 14km (D+800m) y Caminata 12km. Serra da Estrela.",
    },
    fr: {
      title: "Trail da CabeçAlta 2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**Une aventure épique au cœur de la Serra da Estrela !**

Le Trail da CabeçAlta a lieu le **22 février 2026** à Videmonte, Guarda, offrant une expérience unique sur les sentiers les plus emblématiques du Parc Naturel de la Serra da Estrela.

### 🏃 Les Courses

**Trail Long (26km)** - Le défi principal
- Distance : ~26 km
- Dénivelé positif : 1100 mètres
- Limite de temps : 5h30
- Course compétitive de montagne

**Trail Court (14km)** - Défi technique
- Distance : ~14 km
- Dénivelé positif : 800 mètres
- Limite de temps : 3h00
- Course compétitive pour tous les niveaux

**Randonnée (12km)** - Pour tous
- Distance : ~12 km
- Caractère non compétitif
- Ambiance familiale et décontractée

### 🌿 Éthique et Valeurs

Le Trail da CabeçAlta repose sur une éthique et des valeurs fondamentales partagées par tous les coureurs, partenaires, bénévoles et organisateurs :

- **Responsabilité Écologique** : Ne jamais jeter de déchets par terre, respecter la faune et la flore, suivre strictement le parcours balisé
- **Responsabilité Sociale** : Partager l'amour des sentiers de montagne avec la communauté
- **Solidarité** : Tous les athlètes sont tenus d'aider les autres participants en difficulté

### 🎒 Matériel Obligatoire

| Matériel | Trail Court | Trail Long | Randonnée |
|----------|-------------|------------|-----------|
| 🏷️ Dossard | Obligatoire | Obligatoire | - |
| 🔔 Sifflet | Obligatoire | Obligatoire | - |
| 📱 Téléphone portable | Obligatoire | Obligatoire | Recommandé |
| 🧊 Couverture de survie | Recommandé | Obligatoire | - |
| 💧 Réservoir d'eau 1L | Recommandé | Obligatoire | - |
| 🧥 Imperméable/Coupe-vent | Recommandé | Recommandé | Recommandé |
| 🥤 Gobelet 0.5L | Obligatoire | Obligatoire | Recommandé |
| 🩹 Bandage | Obligatoire | Obligatoire | Recommandé |

### 🎁 Kit du Participant

- 🏷️ Dossard personnalisé avec puce
- 👕 T-Shirt Technique OFFICIEL marque EM3
- 🥖 1 Pain de Seigle de Videmonte
- 🏅 Médaille Finisher
- 💆 Massage de récupération à l'arrivée
- ⏱️ Chronométrage
- 🎁 Souvenirs de l'événement
- 🏥 Assurance sportive
- 🚐 Transport vers l'arrivée en cas d'abandon
- 📸 Couverture photo
- 💊 Bon de réduction 25% Mondego Saúde - Physiothérapie & Bien-être

### 📅 Programme

**Dimanche 22 Février 2026 :**
- 07h30-09h00 - Ouverture du Secrétariat (Salle Culturelle de Videmonte)
- 08h30 - Contrôle des athlètes pour Trail Court et Trail Long
- 09h00 - Départ Trail Court (limite 3h) et Trail Long (limite 5h30)
- 09h05 - Départ Randonnée
- 13h00-15h00 - Déjeuner et Cérémonie de remise des prix

### 🏆 Prix et Classements

**Classement Général :**
- Trophées pour les 3 premiers hommes et femmes (Trail Court et Trail Long)

**Ligne d'Arrivée Volante :**
- Prix supplémentaire pour le premier homme et première femme (les deux courses)

**Par Catégories d'Âge :**
- Sub-23 (18 à 23 ans)
- Seniors (24 à 39 ans)
- M40/F40 (40 à 49 ans)
- M50/F50 (50 à 59 ans)
- M60/F60 (60 ans et plus)

### ℹ️ Informations Importantes

- 📍 Lieu : Salle Culturelle de Videmonte, Guarda
- 🏞️ Parc Naturel de la Serra da Estrela
- 📅 Date : 22 février 2026
- 🎂 Âge minimum : 18 ans (courses compétitives)
- 🍽️ Déjeuner inclus dans l'inscription`,
      city: "Guarda",
      metaTitle: "Trail da CabeçAlta 2026 | Videmonte, Guarda | 22 Février",
      metaDescription:
        "Trail da CabeçAlta 2026 - 22 février à Videmonte, Guarda. Courses : Trail Long 26km (D+1100m), Trail Court 14km (D+800m) et Randonnée 12km. Serra da Estrela.",
    },
    de: {
      title: "Trail da CabeçAlta 2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**Ein episches Abenteuer im Herzen der Serra da Estrela!**

Der Trail da CabeçAlta findet am **22. Februar 2026** in Videmonte, Guarda statt und bietet ein einzigartiges Erlebnis auf den emblematischsten Wegen des Naturparks Serra da Estrela.

### 🏃 Die Rennen

**Langer Trail (26km)** - Die Hauptherausforderung
- Distanz: ~26 km
- Höhenunterschied: 1100 Meter
- Zeitlimit: 5h30
- Wettkampf-Berglauf

**Kurzer Trail (14km)** - Technische Herausforderung
- Distanz: ~14 km
- Höhenunterschied: 800 Meter
- Zeitlimit: 3h00
- Wettkampfrennen für alle Niveaus

**Wanderung (12km)** - Für alle
- Distanz: ~12 km
- Nicht-wettbewerblicher Charakter
- Familienfreundliche Atmosphäre

### 🌿 Ethik und Werte

Der Trail da CabeçAlta basiert auf grundlegenden Ethik und Werten, die von allen Läufern, Partnern, Freiwilligen und Organisatoren geteilt werden:

- **Ökologische Verantwortung**: Niemals Müll auf den Boden werfen, Fauna und Flora respektieren, strikt der markierten Route folgen
- **Soziale Verantwortung**: Die Liebe zu den Bergpfaden mit der Gemeinschaft teilen
- **Solidarität**: Alle Athleten sind verpflichtet, anderen Teilnehmern in Not zu helfen

### 🎒 Pflichtausrüstung

| Ausrüstung | Kurzer Trail | Langer Trail | Wanderung |
|------------|--------------|--------------|-----------|
| 🏷️ Startnummer | Pflicht | Pflicht | - |
| 🔔 Pfeife | Pflicht | Pflicht | - |
| 📱 Mobiltelefon | Pflicht | Pflicht | Empfohlen |
| 🧊 Rettungsdecke | Empfohlen | Pflicht | - |
| 💧  1L Wasserbehälter | Empfohlen | Pflicht | - |
| 🧥 Regenjacke/Windjacke | Empfohlen | Empfohlen | Empfohlen |
| 🥤 0.5L Becher | Pflicht | Pflicht | Empfohlen |
| 🩹 Verband | Pflicht | Pflicht | Empfohlen |

### 🎁 Teilnehmerpaket

- 🏷️ Personalisierte Startnummer mit Chip
- 👕 Offizielles technisches T-Shirt der Marke EM3
- 🥖 1 Videmonte Roggenbrot
- 🏅 Finisher-Medaille
- 💆 Erholungsmassage am Ziel
- ⏱️ Zeitmessung
- 🎁 Veranstaltungs-Souvenirs
- 🏥 Sportversicherung
- 🚐 Transport zum Ziel bei Aufgabe
- 📸 Fotoberichterstattung
- 💊 25% Rabattgutschein Mondego Saúde - Physiotherapie & Wellness

### 📅 Programm

**Sonntag, 22. Februar 2026:**
- 07:30-09:00 - Öffnung des Sekretariats (Kulturhalle Videmonte)
- 08:30 - Athletenkontrolle für Kurzen und Langen Trail
- 09:00 - Start Kurzer Trail (Limit 3h) und Langer Trail (Limit 5h30)
- 09:05 - Start Wanderung
- 13:00-15:00 - Mittagessen und Preisverleihung

### 🏆 Preise und Wertungen

**Gesamtwertung:**
- Trophäen für die ersten 3 Männer und Frauen (Kurzer und Langer Trail)

**Fliegende Ziellinie:**
- Extrapreis für den ersten Mann und erste Frau (beide Rennen)

**Nach Altersklassen:**
- Sub-23 (18 bis 23 Jahre)
- Senioren (24 bis 39 Jahre)
- M40/F40 (40 bis 49 Jahre)
- M50/F50 (50 bis 59 Jahre)
- M60/F60 (ab 60 Jahren)

### ℹ️ Wichtige Informationen

- 📍 Ort: Kulturhalle Videmonte, Guarda
- 🏞️ Naturpark Serra da Estrela
- 📅 Datum: 22. Februar 2026
- 🎂 Mindestalter: 18 Jahre (Wettkampfrennen)
- 🍽️ Mittagessen in der Anmeldung enthalten`,
      city: "Guarda",
      metaTitle: "Trail da CabeçAlta 2026 | Videmonte, Guarda | 22. Februar",
      metaDescription:
        "Trail da CabeçAlta 2026 - 22. Februar in Videmonte, Guarda. Rennen: Langer Trail 26km (D+1100m), Kurzer Trail 14km (D+800m) und Wanderung 12km. Serra da Estrela.",
    },
    it: {
      title: "Trail da CabeçAlta 2026",
      description: `## 🏔️ Trail da CabeçAlta 2026

**Un'avventura epica nel cuore della Serra da Estrela!**

Il Trail da CabeçAlta si svolge il **22 febbraio 2026** a Videmonte, Guarda, offrendo un'esperienza unica sui sentieri più emblematici del Parco Naturale della Serra da Estrela.

### 🏃 Le Gare

**Trail Lungo (26km)** - La sfida principale
- Distanza: ~26 km
- Dislivello positivo: 1100 metri
- Limite di tempo: 5h30
- Gara competitiva di corsa in montagna

**Trail Corto (14km)** - Sfida tecnica
- Distanza: ~14 km
- Dislivello positivo: 800 metri
- Limite di tempo: 3h00
- Gara competitiva per tutti i livelli

**Camminata (12km)** - Per tutti
- Distanza: ~12 km
- Carattere non competitivo
- Atmosfera familiare e rilassata

### 🌿 Etica e Valori

Il Trail da CabeçAlta si basa su etica e valori fondamentali condivisi da tutti i corridori, partner, volontari e organizzatori:

- **Responsabilità Ecologica**: Mai gettare rifiuti a terra, rispettare fauna e flora, seguire rigorosamente il percorso segnato
- **Responsabilità Sociale**: Condividere l'amore per i sentieri di montagna con la comunità
- **Solidarietà**: Tutti gli atleti sono obbligati ad aiutare gli altri partecipanti in difficoltà

### 🎒 Materiale Obbligatorio

| Materiale | Trail Corto | Trail Lungo | Camminata |
|-----------|-------------|-------------|-----------|
| 🏷️ Pettorale | Obbligatorio | Obbligatorio | - |
| 🔔 Fischietto | Obbligatorio | Obbligatorio | - |
| 📱 Telefono cellulare | Obbligatorio | Obbligatorio | Raccomandato |
| 🧊 Coperta di sopravvivenza | Raccomandato | Obbligatorio | - |
| 💧 Serbatoio acqua 1L | Raccomandato | Obbligatorio | - |
| 🧥 Impermeabile/Antivento | Raccomandato | Raccomandato | Raccomandato |
| 🥤 Bicchiere 0.5L | Obbligatorio | Obbligatorio | Raccomandato |
| 🩹 Benda | Obbligatorio | Obbligatorio | Raccomandato |

### 🎁 Kit del Partecipante

- 🏷️ Pettorale personalizzato con chip
- 👕 T-Shirt Tecnica UFFICIALE marca EM3
- 🥖 1 Pane di Segale di Videmonte
- 🏅 Medaglia Finisher
- 💆 Massaggio di recupero all'arrivo
- ⏱️ Cronometraggio
- 🎁 Souvenir dell'evento
- 🏥 Assicurazione sportiva
- 🚐 Trasporto al traguardo in caso di ritiro
- 📸 Copertura fotografica
- 💊 Buono sconto 25% Mondego Saúde - Fisioterapia & Benessere

### 📅 Programma

**Domenica 22 Febbraio 2026:**
- 07:30-09:00 - Apertura della Segreteria (Sala Culturale di Videmonte)
- 08:30 - Controllo atleti per Trail Corto e Trail Lungo
- 09:00 - Partenza Trail Corto (limite 3h) e Trail Lungo (limite 5h30)
- 09:05 - Partenza Camminata
- 13:00-15:00 - Pranzo e Cerimonia di premiazione

### 🏆 Premi e Classifiche

**Classifica Generale:**
- Trofei per i primi 3 uomini e donne (Trail Corto e Trail Lungo)

**Traguardo Volante:**
- Premio extra per il primo uomo e prima donna (entrambe le gare)

**Per Fasce d'Età:**
- Sub-23 (18 a 23 anni)
- Senior (24 a 39 anni)
- M40/F40 (40 a 49 anni)
- M50/F50 (50 a 59 anni)
- M60/F60 (60 anni in poi)

### ℹ️ Informazioni Importanti

- 📍 Luogo: Sala Culturale di Videmonte, Guarda
- 🏞️ Parco Naturale della Serra da Estrela
- 📅 Data: 22 febbraio 2026
- 🎂 Età minima: 18 anni (gare competitive)
- 🍽️ Pranzo incluso nell'iscrizione`,
      city: "Guarda",
      metaTitle: "Trail da CabeçAlta 2026 | Videmonte, Guarda | 22 Febbraio",
      metaDescription:
        "Trail da CabeçAlta 2026 - 22 febbraio a Videmonte, Guarda. Gare: Trail Lungo 26km (D+1100m), Trail Corto 14km (D+800m) e Camminata 12km. Serra da Estrela.",
    },
  };

  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Delete existing variants and create new ones
  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Create variants
  const trailLongo = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail Longo (26km)",
      distanceKm: 26,
      elevationGainM: 1100,
      startTime: "09:00",
      cutoffTimeHours: 5.5,
    },
  });

  const trailCurto = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail Curto (14km)",
      distanceKm: 14,
      elevationGainM: 800,
      startTime: "09:00",
      cutoffTimeHours: 3.0,
    },
  });

  const caminhada = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada (12km)",
      distanceKm: 12,
      elevationGainM: null,
      startTime: "09:05",
      cutoffTimeHours: null,
    },
  });

  const variants = [trailLongo, trailCurto, caminhada];

  console.log("🏃 Variants created (3 variants)");

  // Step 4: Upsert variant translations
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "Trail Longo (26km)": {
      pt: {
        name: "Trail Longo (26km)",
        description:
          "Prova competitiva de corrida em montanha com ~26km e 1100m de desnível positivo. Tempo limite: 5h30.",
      },
      en: {
        name: "Long Trail (26km)",
        description:
          "Competitive mountain running race with ~26km and 1100m elevation gain. Time limit: 5h30.",
      },
      es: {
        name: "Trail Largo (26km)",
        description:
          "Carrera competitiva de montaña con ~26km y 1100m de desnivel positivo. Límite de tiempo: 5h30.",
      },
      fr: {
        name: "Trail Long (26km)",
        description:
          "Course compétitive de montagne avec ~26km et 1100m de dénivelé positif. Limite de temps: 5h30.",
      },
      de: {
        name: "Langer Trail (26km)",
        description:
          "Wettkampf-Berglauf mit ~26km und 1100m Höhenunterschied. Zeitlimit: 5h30.",
      },
      it: {
        name: "Trail Lungo (26km)",
        description:
          "Gara competitiva di corsa in montagna con ~26km e 1100m di dislivello positivo. Limite di tempo: 5h30.",
      },
    },
    "Trail Curto (14km)": {
      pt: {
        name: "Trail Curto (14km)",
        description:
          "Prova competitiva de corrida em montanha com ~14km e 800m de desnível positivo. Tempo limite: 3h00.",
      },
      en: {
        name: "Short Trail (14km)",
        description:
          "Competitive mountain running race with ~14km and 800m elevation gain. Time limit: 3h00.",
      },
      es: {
        name: "Trail Corto (14km)",
        description:
          "Carrera competitiva de montaña con ~14km y 800m de desnivel positivo. Límite de tiempo: 3h00.",
      },
      fr: {
        name: "Trail Court (14km)",
        description:
          "Course compétitive de montagne avec ~14km et 800m de dénivelé positif. Limite de temps: 3h00.",
      },
      de: {
        name: "Kurzer Trail (14km)",
        description:
          "Wettkampf-Berglauf mit ~14km und 800m Höhenunterschied. Zeitlimit: 3h00.",
      },
      it: {
        name: "Trail Corto (14km)",
        description:
          "Gara competitiva di corsa in montagna con ~14km e 800m di dislivello positivo. Limite di tempo: 3h00.",
      },
    },
    "Caminhada (12km)": {
      pt: {
        name: "Caminhada (12km)",
        description:
          "Caminhada em montanha com ~12km de carácter não competitivo. Ambiente familiar e descontraído.",
      },
      en: {
        name: "Walk (12km)",
        description:
          "Mountain walk with ~12km of non-competitive nature. Family-friendly atmosphere.",
      },
      es: {
        name: "Caminata (12km)",
        description:
          "Caminata en montaña con ~12km de carácter no competitivo. Ambiente familiar y relajado.",
      },
      fr: {
        name: "Randonnée (12km)",
        description:
          "Randonnée en montagne avec ~12km de caractère non compétitif. Ambiance familiale et décontractée.",
      },
      de: {
        name: "Wanderung (12km)",
        description:
          "Bergwanderung mit ~12km nicht-wettbewerblichen Charakter. Familienfreundliche Atmosphäre.",
      },
      it: {
        name: "Camminata (12km)",
        description:
          "Camminata in montagna con ~12km di carattere non competitivo. Atmosfera familiare e rilassata.",
      },
    },
  };

  for (const variant of variants) {
    for (const lang of languages) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang,
          },
        },
        update: {
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
      });
    }
  }

  console.log("📝 Variant translations upserted for all 3 variants");

  // Step 5: Create pricing phases (using eventId pattern)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findOrCreatePricingPhase = async (name: string, data: any) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  // Trail Longo (26km) - 1ª Fase
  await findOrCreatePricingPhase("Trail Longo (26km) - 1ª Fase", {
    startDate: new Date("2026-01-08T00:00:00Z"),
    endDate: new Date("2026-02-14T23:59:59Z"),
    price: 25.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "1ª Fase de inscrição para Trail Longo. Inclui kit de atleta, almoço e seguro.",
  });

  // Trail Longo (26km) - 2ª Fase
  await findOrCreatePricingPhase("Trail Longo (26km) - 2ª Fase", {
    startDate: new Date("2026-02-15T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 28.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "2ª Fase de inscrição para Trail Longo. Último dia de inscrições. Inclui kit de atleta, almoço e seguro.",
  });

  // Trail Curto (14km) - 1ª Fase
  await findOrCreatePricingPhase("Trail Curto (14km) - 1ª Fase", {
    startDate: new Date("2026-01-08T00:00:00Z"),
    endDate: new Date("2026-02-14T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "1ª Fase de inscrição para Trail Curto. Inclui kit de atleta, almoço e seguro.",
  });

  // Trail Curto (14km) - 2ª Fase
  await findOrCreatePricingPhase("Trail Curto (14km) - 2ª Fase", {
    startDate: new Date("2026-02-15T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "2ª Fase de inscrição para Trail Curto. Último dia de inscrições. Inclui kit de atleta, almoço e seguro.",
  });

  // Caminhada (12km) - 1ª Fase
  await findOrCreatePricingPhase("Caminhada (12km) - 1ª Fase", {
    startDate: new Date("2026-01-08T00:00:00Z"),
    endDate: new Date("2026-02-14T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "1ª Fase de inscrição para Caminhada. Inclui kit de participante e almoço.",
  });

  // Caminhada (12km) - 2ª Fase
  await findOrCreatePricingPhase("Caminhada (12km) - 2ª Fase", {
    startDate: new Date("2026-02-15T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "2ª Fase de inscrição para Caminhada. Último dia de inscrições. Inclui kit de participante e almoço.",
  });

  console.log("💰 Pricing phases created (6 phases for 3 variants)");

  // Step 6: Create FAQs
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing) {
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    }
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // FAQ 1: Material obrigatório
  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual é o material obrigatório para as provas?",
    "O material varia consoante a prova. Para o Trail Longo é obrigatório: dorsal, apito, telemóvel, manta de sobrevivência, reservatório de água 1L, copo 0.5L e ligadura. Para o Trail Curto: dorsal, apito, telemóvel, copo 0.5L e ligadura. Para a Caminhada apenas é recomendado telemóvel."
  );

  const faq1Translations = {
    pt: {
      question: "Qual é o material obrigatório para as provas?",
      answer:
        "O material varia consoante a prova. Para o Trail Longo é obrigatório: dorsal, apito, telemóvel, manta de sobrevivência, reservatório de água 1L, copo 0.5L e ligadura. Para o Trail Curto: dorsal, apito, telemóvel, copo 0.5L e ligadura. Para a Caminhada apenas é recomendado telemóvel.",
    },
    en: {
      question: "What is the mandatory equipment for the races?",
      answer:
        "Equipment varies by race. For Long Trail it's mandatory: bib, whistle, mobile phone, survival blanket, 1L water reservoir, 0.5L cup and bandage. For Short Trail: bib, whistle, mobile phone, 0.5L cup and bandage. For the Walk only a mobile phone is recommended.",
    },
    es: {
      question: "¿Cuál es el material obligatorio para las carreras?",
      answer:
        "El material varía según la carrera. Para el Trail Largo es obligatorio: dorsal, silbato, teléfono móvil, manta de supervivencia, depósito de agua 1L, vaso 0.5L y venda. Para el Trail Corto: dorsal, silbato, teléfono móvil, vaso 0.5L y venda. Para la Caminata solo se recomienda teléfono móvil.",
    },
    fr: {
      question: "Quel est le matériel obligatoire pour les courses ?",
      answer:
        "Le matériel varie selon la course. Pour le Trail Long c'est obligatoire: dossard, sifflet, téléphone portable, couverture de survie, réservoir d'eau 1L, gobelet 0.5L et bandage. Pour le Trail Court: dossard, sifflet, téléphone portable, gobelet 0.5L et bandage. Pour la Randonnée seul un téléphone portable est recommandé.",
    },
    de: {
      question: "Was ist die Pflichtausrüstung für die Rennen?",
      answer:
        "Die Ausrüstung variiert je nach Rennen. Für den Langen Trail ist Pflicht: Startnummer, Pfeife, Mobiltelefon, Rettungsdecke, 1L Wasserbehälter, 0.5L Becher und Verband. Für den Kurzen Trail: Startnummer, Pfeife, Mobiltelefon, 0.5L Becher und Verband. Für die Wanderung wird nur ein Mobiltelefon empfohlen.",
    },
    it: {
      question: "Qual è il materiale obbligatorio per le gare?",
      answer:
        "Il materiale varia a seconda della gara. Per il Trail Lungo è obbligatorio: pettorale, fischietto, telefono cellulare, coperta di sopravvivenza, serbatoio acqua 1L, bicchiere 0.5L e benda. Per il Trail Corto: pettorale, fischietto, telefono cellulare, bicchiere 0.5L e benda. Per la Camminata è solo raccomandato il telefono cellulare.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: lang } },
      update: faq1Translations[lang],
      create: { faqId: faq1.id, language: lang, ...faq1Translations[lang] },
    });
  }

  // FAQ 2: Almoço incluído
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "O almoço está incluído na inscrição?",
    "Sim, o almoço está incluído no valor da inscrição para todas as provas. Será servido no Salão Cultural de Videmonte entre as 13h00 e as 15h00."
  );

  const faq2Translations = {
    pt: {
      question: "O almoço está incluído na inscrição?",
      answer:
        "Sim, o almoço está incluído no valor da inscrição para todas as provas. Será servido no Salão Cultural de Videmonte entre as 13h00 e as 15h00.",
    },
    en: {
      question: "Is lunch included in the registration?",
      answer:
        "Yes, lunch is included in the registration fee for all races. It will be served at Videmonte Cultural Hall between 1:00 PM and 3:00 PM.",
    },
    es: {
      question: "¿El almuerzo está incluido en la inscripción?",
      answer:
        "Sí, el almuerzo está incluido en el precio de inscripción para todas las carreras. Se servirá en el Salón Cultural de Videmonte entre las 13:00 y las 15:00.",
    },
    fr: {
      question: "Le déjeuner est-il inclus dans l'inscription ?",
      answer:
        "Oui, le déjeuner est inclus dans le prix d'inscription pour toutes les courses. Il sera servi à la Salle Culturelle de Videmonte entre 13h00 et 15h00.",
    },
    de: {
      question: "Ist das Mittagessen in der Anmeldung enthalten?",
      answer:
        "Ja, das Mittagessen ist im Anmeldepreis für alle Rennen enthalten. Es wird in der Kulturhalle Videmonte zwischen 13:00 und 15:00 Uhr serviert.",
    },
    it: {
      question: "Il pranzo è incluso nell'iscrizione?",
      answer:
        "Sì, il pranzo è incluso nel prezzo di iscrizione per tutte le gare. Sarà servito nella Sala Culturale di Videmonte tra le 13:00 e le 15:00.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }

  // FAQ 3: Idade mínima
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual é a idade mínima para participar?",
    "A idade mínima para participar nas provas competitivas (Trail Longo e Trail Curto) é de 18 anos. A Caminhada é aberta a todos, sendo que crianças com menos de 16 anos têm de ser acompanhadas por um adulto."
  );

  const faq3Translations = {
    pt: {
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima para participar nas provas competitivas (Trail Longo e Trail Curto) é de 18 anos. A Caminhada é aberta a todos, sendo que crianças com menos de 16 anos têm de ser acompanhadas por um adulto.",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "The minimum age to participate in competitive races (Long Trail and Short Trail) is 18 years old. The Walk is open to everyone, children under 16 years old must be accompanied by an adult.",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "La edad mínima para participar en las carreras competitivas (Trail Largo y Trail Corto) es de 18 años. La Caminata está abierta a todos, los niños menores de 16 años deben ir acompañados de un adulto.",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer ?",
      answer:
        "L'âge minimum pour participer aux courses compétitives (Trail Long et Trail Court) est de 18 ans. La Randonnée est ouverte à tous, les enfants de moins de 16 ans doivent être accompagnés d'un adulte.",
    },
    de: {
      question: "Was ist das Mindestalter für die Teilnahme?",
      answer:
        "Das Mindestalter für die Teilnahme an Wettkampfrennen (Langer Trail und Kurzer Trail) beträgt 18 Jahre. Die Wanderung ist für alle offen, Kinder unter 16 Jahren müssen von einem Erwachsenen begleitet werden.",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "L'età minima per partecipare alle gare competitive (Trail Lungo e Trail Corto) è di 18 anni. La Camminata è aperta a tutti, i bambini sotto i 16 anni devono essere accompagnati da un adulto.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }

  // FAQ 4: Reembolso
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "Posso cancelar a minha inscrição e obter reembolso?",
    "Em caso de desistência por motivo de lesão ou doença, com apresentação de atestado médico até dia 8 de Fevereiro de 2026, será devolvido 50% do valor da inscrição. Após esta data não haverá direito a qualquer reembolso."
  );

  const faq4Translations = {
    pt: {
      question: "Posso cancelar a minha inscrição e obter reembolso?",
      answer:
        "Em caso de desistência por motivo de lesão ou doença, com apresentação de atestado médico até dia 8 de Fevereiro de 2026, será devolvido 50% do valor da inscrição. Após esta data não haverá direito a qualquer reembolso.",
    },
    en: {
      question: "Can I cancel my registration and get a refund?",
      answer:
        "In case of withdrawal due to injury or illness, with presentation of medical certificate until February 8, 2026, 50% of the registration fee will be refunded. After this date there will be no refund entitlement.",
    },
    es: {
      question: "¿Puedo cancelar mi inscripción y obtener un reembolso?",
      answer:
        "En caso de baja por lesión o enfermedad, con presentación de certificado médico hasta el 8 de Febrero de 2026, se devolverá el 50% del importe de inscripción. Después de esta fecha no habrá derecho a reembolso.",
    },
    fr: {
      question: "Puis-je annuler mon inscription et obtenir un remboursement ?",
      answer:
        "En cas de désistement pour cause de blessure ou maladie, avec présentation d'un certificat médical jusqu'au 8 février 2026, 50% du prix d'inscription sera remboursé. Après cette date, il n'y aura pas de remboursement.",
    },
    de: {
      question:
        "Kann ich meine Anmeldung stornieren und eine Rückerstattung erhalten?",
      answer:
        "Bei Rücktritt wegen Verletzung oder Krankheit mit Vorlage eines ärztlichen Attests bis zum 8. Februar 2026 werden 50% der Anmeldegebühr erstattet. Nach diesem Datum besteht kein Anspruch auf Rückerstattung.",
    },
    it: {
      question: "Posso annullare la mia iscrizione e ottenere un rimborso?",
      answer:
        "In caso di ritiro per infortunio o malattia, con presentazione di certificato medico entro l'8 febbraio 2026, verrà rimborsato il 50% della quota di iscrizione. Dopo questa data non ci sarà diritto al rimborso.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }

  // FAQ 5: Onde levantar o kit
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Onde e quando posso levantar o kit de atleta?",
    "Os kits devem ser levantados no próprio dia do evento no Salão Cultural de Videmonte, entre as 07h30 e as 09h00. Nenhum kit será entregue ou enviado após o evento. É necessário apresentar documento de identificação com fotografia."
  );

  const faq5Translations = {
    pt: {
      question: "Onde e quando posso levantar o kit de atleta?",
      answer:
        "Os kits devem ser levantados no próprio dia do evento no Salão Cultural de Videmonte, entre as 07h30 e as 09h00. Nenhum kit será entregue ou enviado após o evento. É necessário apresentar documento de identificação com fotografia.",
    },
    en: {
      question: "Where and when can I pick up my athlete kit?",
      answer:
        "Kits must be picked up on race day at Videmonte Cultural Hall, between 7:30 AM and 9:00 AM. No kit will be delivered or sent after the event. You must present an ID document with photo.",
    },
    es: {
      question: "¿Dónde y cuándo puedo recoger mi kit de atleta?",
      answer:
        "Los kits deben recogerse el mismo día del evento en el Salón Cultural de Videmonte, entre las 07:30 y las 09:00. Ningún kit será entregado o enviado después del evento. Es necesario presentar documento de identificación con fotografía.",
    },
    fr: {
      question: "Où et quand puis-je récupérer mon kit athlète ?",
      answer:
        "Les kits doivent être récupérés le jour de l'événement à la Salle Culturelle de Videmonte, entre 7h30 et 9h00. Aucun kit ne sera livré ou envoyé après l'événement. Vous devez présenter une pièce d'identité avec photo.",
    },
    de: {
      question: "Wo und wann kann ich mein Athletenpaket abholen?",
      answer:
        "Die Pakete müssen am Veranstaltungstag in der Kulturhalle Videmonte zwischen 7:30 und 9:00 Uhr abgeholt werden. Kein Paket wird nach der Veranstaltung geliefert oder versendet. Sie müssen einen Ausweis mit Foto vorlegen.",
    },
    it: {
      question: "Dove e quando posso ritirare il mio kit atleta?",
      answer:
        "I kit devono essere ritirati il giorno dell'evento presso la Sala Culturale di Videmonte, tra le 07:30 e le 09:00. Nessun kit sarà consegnato o inviato dopo l'evento. È necessario presentare un documento d'identità con foto.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  console.log("❓ FAQs created (5 FAQs with translations in all 6 languages)");

  console.log("\n🎉 Trail da CabeçAlta 2026 seed completed successfully!");
  console.log("📍 Location: Videmonte, Guarda, Portugal");
  console.log("🏞️ Serra da Estrela Natural Park");
  console.log("📅 Date: February 22, 2026");
  console.log(
    "🏃 3 variants: Trail Longo (26km), Trail Curto (14km), Caminhada (12km)"
  );
  console.log(
    "🔗 External URL: https://stopandgo.net/events/trail-da-cabecalta-2026"
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
