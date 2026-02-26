import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedMamoaRiverTrail2026() {
  console.log("🏞️ Seeding Mâmoa River Trail 2026...");

  // Base event data
  const eventSlug = "mamoa-river-trail-2026";
  const eventStartDate = new Date("2026-05-17T09:00:00Z");
  const eventEndDate = new Date("2026-05-17T14:30:00Z");

  // Check if event already exists (idempotency)
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log(
      `⚠️  Event "${eventSlug}" already exists. Deleting to recreate...`
    );
    await prisma.event.delete({
      where: { slug: eventSlug },
    });
  }

  // Translations for ALL 6 languages
  const translations = {
    pt: {
      title: "Mâmoa River Trail 2026 - 6ª Edição",
      description: `**🏞️ Mâmoa River Trail 2026 - 6ª Edição - Trilhos de Sempre**

A **6ª Edição do Mâmoa River Trail** regressa a **17 de maio de 2026** à **Praia Fluvial da Mâmoa**, em **Milheirós de Poiares**, concelho de **Santa Maria da Feira**. Organizado pela **Obra do Frei Gil**, em parceria com a **Câmara Municipal de Santa Maria da Feira**, este evento oferece uma experiência única de trail running pelas ribeiras, trilhos e serras da região.

![Mâmoa River Trail - Praia Fluvial da Mâmoa](https://radiosintonia.pt/wp-content/uploads/praia-mamoa--768x416.jpg)

---

## 🏔️ Provas Disponíveis

### **Trail Curto** - 16 km
- **Distância:** 16 km
- **Desnível Positivo:** 800m
- **Tempo Máximo:** 3h30 min
- **Dificuldade:** Nível 2 (médio)
- **Idade Mínima:** 18 anos
- **Caráter:** Competitivo
- Percurso entre ribeiras, trilhos sinalizados e obstáculos naturais

### **Caminhada** - 9 km
- **Distância:** 9 km
- **Desnível Positivo:** 400m
- **Caráter:** Não competitivo
- **Idade:** Aberta a menores acompanhados por adulto
- Experiência de contacto com a natureza

### **Trail Kids**
- **Caráter:** Competitivo
- **Idades:** 6 aos 12 anos (Benjamins, Infantis, Iniciados)
- **Inscrição:** Gratuita mas obrigatória
- **Local:** Periferia da Praia Fluvial da Mâmoa
- Promoção da prática desportiva para os mais jovens

![Trail entre ribeiras e natureza](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Destaques do Evento

✅ **1 posto de abastecimento** sólido e líquido no percurso (Trail e Caminhada)
✅ **Seguro de acidentes pessoais** incluído
✅ **T-shirt técnica** para todos os participantes
✅ **Balneários disponíveis** no Pavilhão EB23 Milheirós de Poiares
✅ **Cronometragem eletrónica** por chip
✅ **Troféus** para pódios e escalões
✅ **Regime de semi-autossuficiência** - trazer o próprio copo

![Arena da prova - Praia Fluvial da Mâmoa](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Locais de Partida e Chegada

### **Partida e Chegada (todas as provas):**
**Praia Fluvial da Mâmoa**  
Milheirós de Poiares, Santa Maria da Feira

**Coordenadas GPS:** 40.9282, -8.4669  
[Ver no Google Maps](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## ⏱️ Horários (17 Maio 2026)

**Sábado, 16/05/2026:**
- **14h00 - 19h00** - Entrega de dorsais no Pavilhão EB 2,3 Milheirós de Poiares

**Domingo, 17/05/2026:**
- **07h00 - 09h00** - Entrega de dorsais no Pavilhão EB 2,3 Milheirós de Poiares
- **09h00** - **PARTIDA Trail Kids**
- **09h30** - **PARTIDA Trail Curto 16 km**
- **09h35** - **PARTIDA Caminhada 9 km**
- **12h30** - Cerimónia de entrega de prémios (após chegada do último atleta premiado)
- **14h30** - Encerramento do evento

*Horários sujeitos a alterações*

---

## 🏆 Premiações

### **Trail Curto - Troféus:**
- **3 primeiros classificados Geral Masculino e Feminino**
- **3 primeiros classificados por escalão (M/F):**
  - Sub23 Masculino/Feminino
  - Seniores Masculino/Feminino
  - Masc./Fem. 40
  - Masc./Fem. 50
  - Masc./Fem. 60
- **Geral Equipas:** 3 primeiros classificados de cada equipa (independente do género)

### **Trail Kids - Troféus:**
- **3 primeiros Geral Masculino/Feminino**
- **3 primeiros por escalão:**
  - Benjamins (até 9 anos) M/F
  - Infantis (10-11 anos) M/F
  - Iniciados (12-13 anos) M/F

### **Inclui na Inscrição:**
- Dorsal com chip de cronometragem (Trail Curto)
- T-shirt técnica do evento
- Seguro de acidentes pessoais
- Abastecimentos sólidos e líquidos

![Troféus e prémios](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Preços

### **Trail Curto 16K:**
**1ª Fase (até 19/04/2026):** €12,00  
**2ª Fase (20/04 a 03/05/2026):** €14,00  
**3ª Fase (04/05 a 13/05/2026):** €16,00

### **Caminhada 9K:**
**Todas as fases:** €7,50

### **Trail Kids:**
**Inscrição GRATUITA** (mas obrigatória - confirmação até 22/06/2025)

**⚠️ IMPORTANTE:** A organização não devolve o valor da inscrição. Apenas são permitidas transferências de inscrição para outro atleta até ao fecho das inscrições.

---

## 📋 Material Obrigatório

### **Trail Curto 16K:**
✅ **Dorsal visível** (colocado à frente, altura do peito)
✅ **Recipiente para água** (copo próprio - organização não fornece copos)
✅ **Manta térmica**
✅ **Apito**
✅ **Corta-vento** (recomendado)

### **Material Recomendado:**
- Mochila camelbak ou sistema de hidratação
- Alimentos energéticos
- Chapéu ou gorro
- Calçado e vestuário adequados para trail running

**⚠️ Controlo aleatório de material poderá ocorrer. Não levar material obrigatório resulta em desclassificação.**

---

## 🎫 Levantamento de Dorsais

### **Pavilhão EB 2,3 Milheirós de Poiares**

**Sábado, 16/05/2026:**
- 14h00 às 19h00

**Domingo, 17/05/2026:**
- 07h00 às 09h00

**Documentos Necessários:**
- Bilhete de Identidade / Cartão de Cidadão / Passaporte
- Autorização do Encarregado de Educação (Trail Kids - obrigatório)

---

## 🚨 Tempo Limite e Barreiras Horárias

### **Trail Curto 16K:**
**Tempo Máximo:** 3h30 min

Ultrapassando o tempo limite, os atletas serão barrados pelos "corredores vassouras", que poderão levantar as fitas de marcação do percurso.

**Importante:** Se a organização entender que um atleta deve ser afastado devido ao seu estado de saúde, este deve acatar a decisão para garantir o seu bem-estar.

---

## 🌲 Sinalização e Percurso

- **Cor da fita** será anunciada no momento da partida
- Percurso entre **ribeiras, trilhos sinalizados, estradões e obstáculos naturais**
- **Provas em estrada aberta** - cuidado com viaturas, pessoas e animais
- **Não atalhar** sob pena de desclassificação
- Em caso de se perder: voltar atrás e procurar o caminho sinalizado
- **Postos de controlo** obrigatórios ao longo do percurso

---

## 🌍 Sustentabilidade Ambiental

O Mâmoa River Trail 2026 decorre em **regime de semi-autossuficiência**:

- 🥤 **Trazer o próprio copo** - a organização não fornece copos
- 🗑️ **Transportar o lixo que fizer** - não prejudicar o ambiente
- 🌿 **Respeito pela natureza** - não danificar os locais por onde transita
- ♻️ **Impacto ambiental nulo** - compromisso de todos os participantes

---

## ⚖️ Penalizações e Desclassificações

Será **penalizado** ou **desclassificado** o atleta que:

- ❌ Não leve material obrigatório → **Desclassificação**
- ❌ Não complete a totalidade do percurso → **Desclassificação**
- ❌ Desrespeite ou suje o meio ambiente → **Desclassificação**
- ⚠️ Não leve dorsal bem visível → **Penalização 10 minutos**
- ❌ Altere o dorsal → **Desqualificação**
- ⚠️ Ignore indicações da organização → **Penalização 1 hora**
- ❌ Tenha conduta anti-desportiva → **Desclassificação**
- ❌ Não passe nos postos de controlo → **Desclassificação**

---

## 🚗 Como Chegar

**Praia Fluvial da Mâmoa** está localizada em **Milheirós de Poiares**, concelho de **Santa Maria da Feira**.

### **Principais Acessos:**
- **A1** - Saída Santa Maria da Feira
- **A32** - Ligação à A1
- De **Porto:** aproximadamente 35 km (30 minutos)
- De **Aveiro:** aproximadamente 30 km (25 minutos)

**Coordenadas GPS:**  
40.9282, -8.4669

**Google Maps:**  
[https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## 🏥 Segurança e Apoio

- **Seguro de acidentes pessoais** incluído no valor da inscrição
- **Elementos da organização** identificados durante a prova
- **Postos de abastecimento** com apoio
- **Comunicação de lesões:** atletas lesionados nunca devem ficar sozinhos
- **Autonomia em montanha:** cada atleta deve ter capacidade de gerir problemas físicos e mentais

---

## 📞 Contactos

**Inscrições:** [www.lap2go.com/mamoarivertrail2026](https://lap2go.com/pt/event/mamoa-river-trail-2026)  
**Suporte Inscrições:** suporte@lap2go.com | +351 308 801 674  
**Diretor de Prova:** Agostinho Costa

**Organização:**  
Obra do Frei Gil  
Em parceria com Câmara Municipal de Santa Maria da Feira

**Reclamações:**  
Prazo de 1 semana por email para suporte@lap2go.com

---

## 🏃 Regras de Conduta Desportiva

Aos atletas participantes exige-se:

- ✅ **Respeito pelo desafio** e pelos outros concorrentes
- ✅ **Entre-ajuda** entre participantes
- ✅ **Respeito pelos organizadores** e colaboradores
- ✅ **Respeito pelo ambiente natural** - impacto ambiental nulo
- ✅ **Nunca deixar um atleta sozinho** em caso de lesão
- ✅ **Comunicar lesões** à organização logo que possível

**Comportamento inadequado**, linguagem ofensiva ou agressão verbal serão alvo de **advertência, expulsão ou desqualificação**.

---

## 📜 Direitos de Imagem

A inscrição na prova implica:

- Aceitação do presente regulamento
- Autorização de gravação total ou parcial da participação
- Concordância para utilização da imagem do atleta para promoção e difusão da prova
- Uso em rádio, imprensa, vídeo, fotografia, Internet, cartazes e meios de comunicação social
- Sem direito a compensação económica por parte do atleta

---

🏃 **Vem correr os Trilhos de Sempre na Praia Fluvial da Mâmoa! Uma experiência autêntica de trail running em contacto com a natureza!** 🏞️`,
      city: "Milheirós de Poiares",
      metaTitle:
        "Mâmoa River Trail 2026 - 6ª Edição | Santa Maria da Feira | 17 Maio",
      metaDescription:
        "Mâmoa River Trail 2026 - 6ª edição a 17 de maio na Praia Fluvial da Mâmoa, Milheirós de Poiares. Provas: Trail Curto 16km, Caminhada 9km e Trail Kids. Inscrições abertas!",
    },
    en: {
      title: "Mâmoa River Trail 2026 - 6th Edition",
      description: `**🏞️ Mâmoa River Trail 2026 - 6th Edition - Trails of Always**

The **6th Edition of Mâmoa River Trail** returns on **May 17, 2026** to **Mâmoa River Beach**, in **Milheirós de Poiares**, municipality of **Santa Maria da Feira**. Organized by **Obra do Frei Gil**, in partnership with **Santa Maria da Feira City Council**, this event offers a unique trail running experience through the rivers, trails and mountains of the region.

![Mâmoa River Trail - Mâmoa River Beach](https://radiosintonia.pt/wp-content/uploads/praia-mamoa--768x416.jpg)

---

## 🏔️ Available Races

### **Short Trail** - 16 km
- **Distance:** 16 km
- **Elevation Gain:** 800m
- **Time Limit:** 3h30 min
- **Difficulty:** Level 2 (medium)
- **Minimum Age:** 18 years
- **Character:** Competitive
- Route between rivers, marked trails and natural obstacles

### **Walk** - 9 km
- **Distance:** 9 km
- **Elevation Gain:** 400m
- **Character:** Non-competitive
- **Age:** Open to minors accompanied by adults
- Nature contact experience

### **Trail Kids**
- **Character:** Competitive
- **Ages:** 6 to 12 years (Benjamins, Children, Beginners)
- **Registration:** Free but mandatory
- **Location:** Mâmoa River Beach periphery
- Promoting sports practice for young people

![Trail between rivers and nature](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Event Highlights

✅ **1 aid station** with solid and liquid refreshments (Trail and Walk)
✅ **Personal accident insurance** included
✅ **Technical T-shirt** for all participants
✅ **Showers available** at EB23 Milheirós de Poiares Pavilion
✅ **Electronic timing** by chip
✅ **Trophies** for podiums and categories
✅ **Semi-self-sufficiency regime** - bring your own cup

![Race arena - Mâmoa River Beach](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Start and Finish Location

### **Start and Finish (all races):**
**Mâmoa River Beach**  
Milheirós de Poiares, Santa Maria da Feira

**GPS Coordinates:** 40.9282, -8.4669  
[View on Google Maps](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## ⏱️ Schedule (May 17, 2026)

**Saturday, 16/05/2026:**
- **14:00 - 19:00** - Bib collection at EB 2,3 Milheirós de Poiares Pavilion

**Sunday, 17/05/2026:**
- **07:00 - 09:00** - Bib collection at EB 2,3 Milheirós de Poiares Pavilion
- **09:00** - **START Trail Kids**
- **09:30** - **START Short Trail 16 km**
- **09:35** - **START Walk 9 km**
- **12:30** - Award ceremony (after last awarded athlete arrives)
- **14:30** - Event closure

*Schedule subject to change*

---

## 🏆 Awards

### **Short Trail - Trophies:**
- **Top 3 Overall Male and Female**
- **Top 3 by category (M/F):**
  - Sub23 Male/Female
  - Seniors Male/Female
  - M/F 40
  - M/F 50
  - M/F 60
- **Overall Teams:** Top 3 from each team (regardless of gender)

### **Trail Kids - Trophies:**
- **Top 3 Overall Male/Female**
- **Top 3 by category:**
  - Benjamins (up to 9 years) M/F
  - Children (10-11 years) M/F
  - Beginners (12-13 years) M/F

### **Included in Registration:**
- Race bib with timing chip (Short Trail)
- Event technical T-shirt
- Personal accident insurance
- Solid and liquid refreshments

![Trophies and prizes](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Prices

### **Short Trail 16K:**
**Phase 1 (until 19/04/2026):** €12.00  
**Phase 2 (20/04 to 03/05/2026):** €14.00  
**Phase 3 (04/05 to 13/05/2026):** €16.00

### **Walk 9K:**
**All phases:** €7.50

### **Trail Kids:**
**FREE Registration** (but mandatory - confirmation until 22/06/2025)

**⚠️ IMPORTANT:** No refunds. Only registration transfers to another athlete allowed until registration closes.

---

## 📋 Mandatory Equipment

### **Short Trail 16K:**
✅ **Visible race bib** (placed at front, chest height)
✅ **Water container** (own cup - organization does not provide cups)
✅ **Thermal blanket**
✅ **Whistle**
✅ **Windbreaker** (recommended)

### **Recommended Equipment:**
- Camelbak backpack or hydration system
- Energy food
- Hat or cap
- Appropriate footwear and clothing for trail running

**⚠️ Random equipment checks may occur. Not carrying mandatory equipment results in disqualification.**

---

## 🎫 Bib Collection

### **EB 2,3 Milheirós de Poiares Pavilion**

**Saturday, 16/05/2026:**
- 14:00 to 19:00

**Sunday, 17/05/2026:**
- 07:00 to 09:00

**Required Documents:**
- ID Card / Passport
- Parent/Guardian Authorization (Trail Kids - mandatory)

---

## 🚨 Time Limit and Cutoffs

### **Short Trail 16K:**
**Maximum Time:** 3h30 min

Exceeding the time limit, athletes will be stopped by "sweepers" who may remove course markings.

**Important:** If the organization determines an athlete should be removed due to health condition, this decision must be followed for their well-being.

---

## 🌲 Course Marking and Route

- **Ribbon color** announced at start
- Route between **rivers, marked trails, dirt roads and natural obstacles**
- **Open road races** - beware of vehicles, people and animals
- **No shortcuts** under penalty of disqualification
- If lost: retrace steps and find marked route
- **Mandatory checkpoints** along the course

---

## 🌍 Environmental Sustainability

Mâmoa River Trail 2026 operates in **semi-self-sufficiency regime**:

- 🥤 **Bring your own cup** - organization does not provide cups
- 🗑️ **Carry your waste** - do not harm the environment
- 🌿 **Respect nature** - do not damage areas you pass through
- ♻️ **Zero environmental impact** - everyone's commitment

---

## ⚖️ Penalties and Disqualifications

Athletes will be **penalized** or **disqualified** for:

- ❌ Not carrying mandatory equipment → **Disqualification**
- ❌ Not completing the entire course → **Disqualification**
- ❌ Disrespecting or littering the environment → **Disqualification**
- ⚠️ Not wearing visible bib → **10-minute penalty**
- ❌ Altering race bib → **Disqualification**
- ⚠️ Ignoring organization instructions → **1-hour penalty**
- ❌ Unsportsmanlike conduct → **Disqualification**
- ❌ Missing checkpoints → **Disqualification**

---

## 🚗 How to Get There

**Mâmoa River Beach** is located in **Milheirós de Poiares**, municipality of **Santa Maria da Feira**.

### **Main Access Routes:**
- **A1** - Santa Maria da Feira exit
- **A32** - Connection to A1
- From **Porto:** approximately 35 km (30 minutes)
- From **Aveiro:** approximately 30 km (25 minutes)

**GPS Coordinates:**  
40.9282, -8.4669

**Google Maps:**  
[https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## 🏥 Safety and Support

- **Personal accident insurance** included in registration fee
- **Identified organization staff** during the race
- **Aid stations** with support
- **Injury reporting:** injured athletes should never be left alone
- **Mountain autonomy:** each athlete must be able to manage physical and mental problems

---

## 📞 Contacts

**Registration:** [www.lap2go.com/mamoarivertrail2026](https://lap2go.com/pt/event/mamoa-river-trail-2026)  
**Registration Support:** suporte@lap2go.com | +351 308 801 674  
**Race Director:** Agostinho Costa

**Organization:**  
Obra do Frei Gil  
In partnership with Santa Maria da Feira City Council

**Complaints:**  
1-week deadline by email to suporte@lap2go.com

---

## 🏃 Sportsmanship Rules

Athletes are required to:

- ✅ **Respect the challenge** and other competitors
- ✅ **Help each other**
- ✅ **Respect organizers** and staff
- ✅ **Respect the natural environment** - zero environmental impact
- ✅ **Never leave an athlete alone** in case of injury
- ✅ **Report injuries** to organization as soon as possible

**Inappropriate behavior**, offensive language or verbal aggression will result in **warning, expulsion or disqualification**.

---

## 📜 Image Rights

Registration in the race implies:

- Acceptance of these regulations
- Authorization for full or partial recording of participation
- Agreement for use of athlete's image for race promotion
- Use in radio, press, video, photography, Internet, posters and media
- No right to financial compensation by the athlete

---

🏃 **Come run the Trails of Always at Mâmoa River Beach! An authentic trail running experience in contact with nature!** 🏞️`,
      city: "Milheirós de Poiares",
      metaTitle:
        "Mâmoa River Trail 2026 - 6th Edition | Santa Maria da Feira | May 17",
      metaDescription:
        "Mâmoa River Trail 2026 - 6th edition on May 17 at Mâmoa River Beach, Milheirós de Poiares. Races: Short Trail 16km, Walk 9km and Trail Kids. Registration open!",
    },
    es: {
      title: "Mâmoa River Trail 2026 - 6ª Edición",
      description: `**🏞️ Mâmoa River Trail 2026 - 6ª Edición - Senderos de Siempre**

La **6ª Edición del Mâmoa River Trail** regresa el **17 de mayo de 2026** a la **Playa Fluvial de Mâmoa**, en **Milheirós de Poiares**, municipio de **Santa Maria da Feira**. Organizado por **Obra do Frei Gil**, en asociación con el **Ayuntamiento de Santa Maria da Feira**, este evento ofrece una experiencia única de trail running por los ríos, senderos y montañas de la región.

![Mâmoa River Trail - Playa Fluvial de Mâmoa](https://radiosintonia.pt/wp-content/uploads/praia-mamoa--768x416.jpg)

---

## 🏔️ Pruebas Disponibles

### **Trail Corto** - 16 km
- **Distancia:** 16 km
- **Desnivel Positivo:** 800m
- **Tiempo Máximo:** 3h30 min
- **Dificultad:** Nivel 2 (medio)
- **Edad Mínima:** 18 años
- **Carácter:** Competitivo
- Recorrido entre ríos, senderos señalizados y obstáculos naturales

### **Caminata** - 9 km
- **Distancia:** 9 km
- **Desnivel Positivo:** 400m
- **Carácter:** No competitivo
- **Edad:** Abierto a menores acompañados por adultos
- Experiencia de contacto con la naturaleza

### **Trail Kids**
- **Carácter:** Competitivo
- **Edades:** 6 a 12 años (Benjamines, Infantiles, Iniciados)
- **Inscripción:** Gratuita pero obligatoria
- **Lugar:** Periferia de la Playa Fluvial de Mâmoa
- Promoción de la práctica deportiva para jóvenes

![Trail entre ríos y naturaleza](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Aspectos Destacados del Evento

✅ **1 puesto de avituallamiento** con sólidos y líquidos (Trail y Caminata)
✅ **Seguro de accidentes personales** incluido
✅ **Camiseta técnica** para todos los participantes
✅ **Vestuarios disponibles** en el Pabellón EB23 Milheirós de Poiares
✅ **Cronometraje electrónico** por chip
✅ **Trofeos** para podios y categorías
✅ **Régimen de semi-autosuficiencia** - traer vaso propio

![Arena de la prueba - Playa Fluvial de Mâmoa](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Lugar de Salida y Llegada

### **Salida y Llegada (todas las pruebas):**
**Playa Fluvial de Mâmoa**  
Milheirós de Poiares, Santa Maria da Feira

**Coordenadas GPS:** 40.9282, -8.4669  
[Ver en Google Maps](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## ⏱️ Horarios (17 Mayo 2026)

**Sábado, 16/05/2026:**
- **14:00 - 19:00** - Recogida de dorsales en el Pabellón EB 2,3 Milheirós de Poiares

**Domingo, 17/05/2026:**
- **07:00 - 09:00** - Recogida de dorsales en el Pabellón EB 2,3 Milheirós de Poiares
- **09:00** - **SALIDA Trail Kids**
- **09:30** - **SALIDA Trail Corto 16 km**
- **09:35** - **SALIDA Caminata 9 km**
- **12:30** - Ceremonia de entrega de premios (tras llegada del último atleta premiado)
- **14:30** - Cierre del evento

*Horarios sujetos a cambios*

---

## 🏆 Premiaciones

### **Trail Corto - Trofeos:**
- **3 primeros clasificados General Masculino y Femenino**
- **3 primeros clasificados por categoría (M/F):**
  - Sub23 Masculino/Femenino
  - Seniores Masculino/Femenino
  - Masc./Fem. 40
  - Masc./Fem. 50
  - Masc./Fem. 60
- **General Equipos:** 3 primeros clasificados de cada equipo (independiente del género)

### **Trail Kids - Trofeos:**
- **3 primeros General Masculino/Femenino**
- **3 primeros por categoría:**
  - Benjamines (hasta 9 años) M/F
  - Infantiles (10-11 años) M/F
  - Iniciados (12-13 años) M/F

### **Incluido en la Inscripción:**
- Dorsal con chip de cronometraje (Trail Corto)
- Camiseta técnica del evento
- Seguro de accidentes personales
- Avituallamientos sólidos y líquidos

![Trofeos y premios](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Precios

### **Trail Corto 16K:**
**Fase 1 (hasta 19/04/2026):** €12,00  
**Fase 2 (20/04 a 03/05/2026):** €14,00  
**Fase 3 (04/05 a 13/05/2026):** €16,00

### **Caminata 9K:**
**Todas las fases:** €7,50

### **Trail Kids:**
**Inscripción GRATUITA** (pero obligatoria - confirmación hasta 22/06/2025)

**⚠️ IMPORTANTE:** No hay devoluciones. Solo se permiten transferencias de inscripción a otro atleta hasta el cierre de inscripciones.

---

## 📋 Material Obligatorio

### **Trail Corto 16K:**
✅ **Dorsal visible** (colocado al frente, altura del pecho)
✅ **Recipiente para agua** (vaso propio - organización no proporciona vasos)
✅ **Manta térmica**
✅ **Silbato**
✅ **Cortavientos** (recomendado)

### **Material Recomendado:**
- Mochila camelbak o sistema de hidratación
- Alimentos energéticos
- Gorra o sombrero
- Calzado y ropa adecuados para trail running

**⚠️ Pueden realizarse controles aleatorios de material. No llevar material obligatorio resulta en descalificación.**

---

## 🎫 Recogida de Dorsales

### **Pabellón EB 2,3 Milheirós de Poiares**

**Sábado, 16/05/2026:**
- 14:00 a 19:00

**Domingo, 17/05/2026:**
- 07:00 a 09:00

**Documentos Necesarios:**
- DNI / Pasaporte
- Autorización del Tutor Legal (Trail Kids - obligatorio)

---

## 🚨 Tiempo Límite y Barreras Horarias

### **Trail Corto 16K:**
**Tiempo Máximo:** 3h30 min

Superando el tiempo límite, los atletas serán detenidos por los "escobas" que podrán retirar las marcas del recorrido.

**Importante:** Si la organización determina que un atleta debe ser retirado por su estado de salud, esta decisión debe acatarse por su bienestar.

---

## 🌲 Señalización y Recorrido

- **Color de cinta** anunciado en la salida
- Recorrido entre **ríos, senderos señalizados, caminos y obstáculos naturales**
- **Carreras en carretera abierta** - cuidado con vehículos, personas y animales
- **No atajar** bajo pena de descalificación
- Si se pierde: retroceder y buscar el camino señalizado
- **Puntos de control obligatorios** a lo largo del recorrido

---

## 🌍 Sostenibilidad Ambiental

El Mâmoa River Trail 2026 se desarrolla en **régimen de semi-autosuficiencia**:

- 🥤 **Traer vaso propio** - organización no proporciona vasos
- 🗑️ **Llevar tu basura** - no perjudicar el medio ambiente
- 🌿 **Respetar la naturaleza** - no dañar zonas por donde se pasa
- ♻️ **Impacto ambiental cero** - compromiso de todos los participantes

---

## ⚖️ Penalizaciones y Descalificaciones

Los atletas serán **penalizados** o **descalificados** por:

- ❌ No llevar material obligatorio → **Descalificación**
- ❌ No completar el recorrido completo → **Descalificación**
- ❌ Faltar al respeto o ensuciar el medio ambiente → **Descalificación**
- ⚠️ No llevar dorsal visible → **Penalización 10 minutos**
- ❌ Alterar dorsal → **Descalificación**
- ⚠️ Ignorar instrucciones de organización → **Penalización 1 hora**
- ❌ Conducta antideportiva → **Descalificación**
- ❌ No pasar por puntos de control → **Descalificación**

---

## 🚗 Cómo Llegar

**Playa Fluvial de Mâmoa** está ubicada en **Milheirós de Poiares**, municipio de **Santa Maria da Feira**.

### **Principales Accesos:**
- **A1** - Salida Santa Maria da Feira
- **A32** - Conexión con A1
- Desde **Oporto:** aproximadamente 35 km (30 minutos)
- Desde **Aveiro:** aproximadamente 30 km (25 minutos)

**Coordenadas GPS:**  
40.9282, -8.4669

**Google Maps:**  
[https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## 🏥 Seguridad y Apoyo

- **Seguro de accidentes personales** incluido en la inscripción
- **Personal identificado de la organización** durante la carrera
- **Puestos de avituallamiento** con apoyo
- **Comunicación de lesiones:** atletas lesionados nunca deben quedarse solos
- **Autonomía en montaña:** cada atleta debe poder gestionar problemas físicos y mentales

---

## 📞 Contactos

**Inscripciones:** [www.lap2go.com/mamoarivertrail2026](https://lap2go.com/pt/event/mamoa-river-trail-2026)  
**Soporte Inscripciones:** suporte@lap2go.com | +351 308 801 674  
**Director de Carrera:** Agostinho Costa

**Organización:**  
Obra do Frei Gil  
En asociación con Ayuntamiento de Santa Maria da Feira

**Reclamaciones:**  
Plazo de 1 semana por email a suporte@lap2go.com

---

## 🏃 Reglas de Conducta Deportiva

Se exige a los atletas:

- ✅ **Respetar el desafío** y otros competidores
- ✅ **Ayuda mutua**
- ✅ **Respetar organizadores** y personal
- ✅ **Respetar el entorno natural** - impacto ambiental cero
- ✅ **Nunca dejar un atleta solo** en caso de lesión
- ✅ **Comunicar lesiones** a organización lo antes posible

**Comportamiento inapropiado**, lenguaje ofensivo o agresión verbal resultará en **advertencia, expulsión o descalificación**.

---

## 📜 Derechos de Imagen

La inscripción en la carrera implica:

- Aceptación de este reglamento
- Autorización para grabación total o parcial de la participación
- Acuerdo para uso de imagen del atleta para promoción de la carrera
- Uso en radio, prensa, vídeo, fotografía, Internet, carteles y medios de comunicación
- Sin derecho a compensación económica por parte del atleta

---

🏃 **¡Ven a correr los Senderos de Siempre en la Playa Fluvial de Mâmoa! ¡Una experiencia auténtica de trail running en contacto con la naturaleza!** 🏞️`,
      city: "Milheirós de Poiares",
      metaTitle:
        "Mâmoa River Trail 2026 - 6ª Edición | Santa Maria da Feira | 17 Mayo",
      metaDescription:
        "Mâmoa River Trail 2026 - 6ª edición el 17 de mayo en Playa Fluvial de Mâmoa, Milheirós de Poiares. Pruebas: Trail Corto 16km, Caminata 9km y Trail Kids. ¡Inscripciones abiertas!",
    },
    fr: {
      title: "Mâmoa River Trail 2026 - 6ème Édition",
      description: `**🏞️ Mâmoa River Trail 2026 - 6ème Édition - Sentiers de Toujours**

La **6ème Édition du Mâmoa River Trail** revient le **17 mai 2026** à la **Plage Fluviale de Mâmoa**, à **Milheirós de Poiares**, municipalité de **Santa Maria da Feira**. Organisé par **Obra do Frei Gil**, en partenariat avec la **Mairie de Santa Maria da Feira**, cet événement offre une expérience unique de trail running à travers les rivières, sentiers et montagnes de la région.

![Mâmoa River Trail - Plage Fluviale de Mâmoa](https://radiosintonia.pt/wp-content/uploads/praia-mamoa--768x416.jpg)

---

## 🏔️ Courses Disponibles

### **Trail Court** - 16 km
- **Distance:** 16 km
- **Dénivelé Positif:** 800m
- **Temps Maximum:** 3h30 min
- **Difficulté:** Niveau 2 (moyen)
- **Âge Minimum:** 18 ans
- **Caractère:** Compétitif
- Parcours entre rivières, sentiers balisés et obstacles naturels

### **Randonnée** - 9 km
- **Distance:** 9 km
- **Dénivelé Positif:** 400m
- **Caractère:** Non compétitif
- **Âge:** Ouvert aux mineurs accompagnés d'adultes
- Expérience de contact avec la nature

### **Trail Kids**
- **Caractère:** Compétitif
- **Âges:** 6 à 12 ans (Benjamins, Enfants, Débutants)
- **Inscription:** Gratuite mais obligatoire
- **Lieu:** Périphérie de la Plage Fluviale de Mâmoa
- Promotion de la pratique sportive pour les jeunes

![Trail entre rivières et nature](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Points Forts de l'Événement

✅ **1 poste de ravitaillement** avec solides et liquides (Trail et Randonnée)
✅ **Assurance accidents corporels** incluse
✅ **T-shirt technique** pour tous les participants
✅ **Douches disponibles** au Pavillon EB23 Milheirós de Poiares
✅ **Chronométrage électronique** par puce
✅ **Trophées** pour podiums et catégories
✅ **Régime de semi-autosuffisance** - apporter son gobelet

![Arène de course - Plage Fluviale de Mâmoa](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Lieu de Départ et d'Arrivée

### **Départ et Arrivée (toutes les courses):**
**Plage Fluviale de Mâmoa**  
Milheirós de Poiares, Santa Maria da Feira

**Coordonnées GPS:** 40.9282, -8.4669  
[Voir sur Google Maps](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## ⏱️ Horaires (17 Mai 2026)

**Samedi, 16/05/2026:**
- **14:00 - 19:00** - Retrait des dossards au Pavillon EB 2,3 Milheirós de Poiares

**Dimanche, 17/05/2026:**
- **07:00 - 09:00** - Retrait des dossards au Pavillon EB 2,3 Milheirós de Poiares
- **09:00** - **DÉPART Trail Kids**
- **09:30** - **DÉPART Trail Court 16 km**
- **09:35** - **DÉPART Randonnée 9 km**
- **12:30** - Cérémonie de remise des prix (après arrivée du dernier athlète primé)
- **14:30** - Clôture de l'événement

*Horaires sujets à modifications*

---

## 🏆 Récompenses

### **Trail Court - Trophées:**
- **3 premiers classés Général Masculin et Féminin**
- **3 premiers classés par catégorie (H/F):**
  - Sub23 Masculin/Féminin
  - Seniors Masculin/Féminin
  - H/F 40
  - H/F 50
  - H/F 60
- **Général Équipes:** 3 premiers classés de chaque équipe (indépendamment du genre)

### **Trail Kids - Trophées:**
- **3 premiers Général Masculin/Féminin**
- **3 premiers par catégorie:**
  - Benjamins (jusqu'à 9 ans) H/F
  - Enfants (10-11 ans) H/F
  - Débutants (12-13 ans) H/F

### **Inclus dans l'Inscription:**
- Dossard avec puce de chronométrage (Trail Court)
- T-shirt technique de l'événement
- Assurance accidents corporels
- Ravitaillements solides et liquides

![Trophées et prix](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Prix

### **Trail Court 16K:**
**Phase 1 (jusqu'au 19/04/2026):** €12,00  
**Phase 2 (20/04 au 03/05/2026):** €14,00  
**Phase 3 (04/05 au 13/05/2026):** €16,00

### **Randonnée 9K:**
**Toutes les phases:** €7,50

### **Trail Kids:**
**Inscription GRATUITE** (mais obligatoire - confirmation jusqu'au 22/06/2025)

**⚠️ IMPORTANT:** Pas de remboursement. Seuls les transferts d'inscription à un autre athlète sont autorisés jusqu'à la clôture des inscriptions.

---

## 📋 Matériel Obligatoire

### **Trail Court 16K:**
✅ **Dossard visible** (placé à l'avant, hauteur de poitrine)
✅ **Récipient pour eau** (gobelet personnel - organisation ne fournit pas de gobelets)
✅ **Couverture thermique**
✅ **Sifflet**
✅ **Coupe-vent** (recommandé)

### **Matériel Recommandé:**
- Sac à dos camelbak ou système d'hydratation
- Aliments énergétiques
- Chapeau ou casquette
- Chaussures et vêtements appropriés pour trail running

**⚠️ Des contrôles aléatoires de matériel peuvent avoir lieu. Ne pas porter le matériel obligatoire entraîne la disqualification.**

---

## 🎫 Retrait des Dossards

### **Pavillon EB 2,3 Milheirós de Poiares**

**Samedi, 16/05/2026:**
- 14:00 à 19:00

**Dimanche, 17/05/2026:**
- 07:00 à 09:00

**Documents Nécessaires:**
- Carte d'Identité / Passeport
- Autorisation du Tuteur Légal (Trail Kids - obligatoire)

---

## 🚨 Temps Limite et Barrières Horaires

### **Trail Court 16K:**
**Temps Maximum:** 3h30 min

En dépassant le temps limite, les athlètes seront arrêtés par les "balayeurs" qui pourront retirer les marques du parcours.

**Important:** Si l'organisation détermine qu'un athlète doit être retiré en raison de son état de santé, cette décision doit être respectée pour son bien-être.

---

## 🌲 Balisage et Parcours

- **Couleur du ruban** annoncée au départ
- Parcours entre **rivières, sentiers balisés, chemins et obstacles naturels**
- **Courses sur route ouverte** - attention aux véhicules, personnes et animaux
- **Pas de raccourcis** sous peine de disqualification
- Si perdu: rebrousser chemin et chercher le parcours balisé
- **Points de contrôle obligatoires** le long du parcours

---

## 🌍 Durabilité Environnementale

Le Mâmoa River Trail 2026 se déroule en **régime de semi-autosuffisance**:

- 🥤 **Apporter son gobelet** - organisation ne fournit pas de gobelets
- 🗑️ **Transporter ses déchets** - ne pas nuire à l'environnement
- 🌿 **Respecter la nature** - ne pas endommager les zones traversées
- ♻️ **Impact environnemental zéro** - engagement de tous les participants

---

## ⚖️ Pénalités et Disqualifications

Les athlètes seront **pénalisés** ou **disqualifiés** pour:

- ❌ Ne pas porter le matériel obligatoire → **Disqualification**
- ❌ Ne pas terminer le parcours complet → **Disqualification**
- ❌ Manquer de respect ou polluer l'environnement → **Disqualification**
- ⚠️ Ne pas porter de dossard visible → **Pénalité 10 minutes**
- ❌ Modifier le dossard → **Disqualification**
- ⚠️ Ignorer les instructions de l'organisation → **Pénalité 1 heure**
- ❌ Conduite antisportive → **Disqualification**
- ❌ Ne pas passer aux points de contrôle → **Disqualification**

---

## 🚗 Comment s'y Rendre

**Plage Fluviale de Mâmoa** est située à **Milheirós de Poiares**, municipalité de **Santa Maria da Feira**.

### **Principaux Accès:**
- **A1** - Sortie Santa Maria da Feira
- **A32** - Connexion à A1
- De **Porto:** environ 35 km (30 minutes)
- D'**Aveiro:** environ 30 km (25 minutes)

**Coordonnées GPS:**  
40.9282, -8.4669

**Google Maps:**  
[https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## 🏥 Sécurité et Assistance

- **Assurance accidents corporels** incluse dans les frais d'inscription
- **Personnel identifié de l'organisation** pendant la course
- **Postes de ravitaillement** avec assistance
- **Signalement de blessures:** les athlètes blessés ne doivent jamais rester seuls
- **Autonomie en montagne:** chaque athlète doit pouvoir gérer les problèmes physiques et mentaux

---

## 📞 Contacts

**Inscriptions:** [www.lap2go.com/mamoarivertrail2026](https://lap2go.com/pt/event/mamoa-river-trail-2026)  
**Support Inscriptions:** suporte@lap2go.com | +351 308 801 674  
**Directeur de Course:** Agostinho Costa

**Organisation:**  
Obra do Frei Gil  
En partenariat avec la Mairie de Santa Maria da Feira

**Réclamations:**  
Délai de 1 semaine par email à suporte@lap2go.com

---

## 🏃 Règles de Conduite Sportive

Les athlètes doivent:

- ✅ **Respecter le défi** et les autres concurrents
- ✅ **S'entraider**
- ✅ **Respecter les organisateurs** et le personnel
- ✅ **Respecter l'environnement naturel** - impact environnemental zéro
- ✅ **Ne jamais laisser un athlète seul** en cas de blessure
- ✅ **Signaler les blessures** à l'organisation dès que possible

**Comportement inapproprié**, langage offensant ou agression verbale entraînera un **avertissement, expulsion ou disqualification**.

---

## 📜 Droits d'Image

L'inscription à la course implique:

- Acceptation de ce règlement
- Autorisation d'enregistrement total ou partiel de la participation
- Accord pour l'utilisation de l'image de l'athlète pour la promotion de la course
- Utilisation à la radio, presse, vidéo, photographie, Internet, affiches et médias
- Pas de droit à compensation financière pour l'athlète

---

🏃 **Venez courir les Sentiers de Toujours à la Plage Fluviale de Mâmoa! Une expérience authentique de trail running en contact avec la nature!** 🏞️`,
      city: "Milheirós de Poiares",
      metaTitle:
        "Mâmoa River Trail 2026 - 6ème Édition | Santa Maria da Feira | 17 Mai",
      metaDescription:
        "Mâmoa River Trail 2026 - 6ème édition le 17 mai à Plage Fluviale de Mâmoa, Milheirós de Poiares. Courses: Trail Court 16km, Randonnée 9km et Trail Kids. Inscriptions ouvertes!",
    },
    de: {
      title: "Mâmoa River Trail 2026 - 6. Ausgabe",
      description: `**🏞️ Mâmoa River Trail 2026 - 6. Ausgabe - Wege von Immer**

Die **6. Ausgabe des Mâmoa River Trail** kehrt am **17. Mai 2026** zum **Mâmoa Flussstrand** zurück, in **Milheirós de Poiares**, Gemeinde **Santa Maria da Feira**. Organisiert von **Obra do Frei Gil** in Zusammenarbeit mit der **Stadtverwaltung von Santa Maria da Feira**, bietet diese Veranstaltung ein einzigartiges Trail-Running-Erlebnis durch die Flüsse, Wege und Berge der Region.

![Mâmoa River Trail - Mâmoa Flussstrand](https://radiosintonia.pt/wp-content/uploads/praia-mamoa--768x416.jpg)

---

## 🏔️ Verfügbare Rennen

### **Kurzer Trail** - 16 km
- **Distanz:** 16 km
- **Höhenunterschied:** 800m
- **Zeitlimit:** 3h30 min
- **Schwierigkeit:** Stufe 2 (mittel)
- **Mindestalter:** 18 Jahre
- **Charakter:** Wettbewerbsfähig
- Strecke zwischen Flüssen, markierten Wegen und natürlichen Hindernissen

### **Wanderung** - 9 km
- **Distanz:** 9 km
- **Höhenunterschied:** 400m
- **Charakter:** Nicht wettbewerbsfähig
- **Alter:** Offen für Minderjährige in Begleitung von Erwachsenen
- Naturkontakterlebnis

### **Trail Kids**
- **Charakter:** Wettbewerbsfähig
- **Alter:** 6 bis 12 Jahre (Benjamins, Kinder, Anfänger)
- **Anmeldung:** Kostenlos aber obligatorisch
- **Ort:** Peripherie des Mâmoa Flussstrands
- Förderung der Sportpraxis für Jugendliche

![Trail zwischen Flüssen und Natur](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Event-Highlights

✅ **1 Verpflegungsstation** mit fester und flüssiger Nahrung (Trail und Wanderung)
✅ **Unfallversicherung** inklusive
✅ **Technisches T-Shirt** für alle Teilnehmer
✅ **Umkleideräume verfügbar** im Pavillon EB23 Milheirós de Poiares
✅ **Elektronische Zeitmessung** per Chip
✅ **Pokale** für Podien und Kategorien
✅ **Halbautarkie-Regime** - eigenen Becher mitbringen

![Rennarena - Mâmoa Flussstrand](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Start- und Zielort

### **Start und Ziel (alle Rennen):**
**Mâmoa Flussstrand**  
Milheirós de Poiares, Santa Maria da Feira

**GPS-Koordinaten:** 40.9282, -8.4669  
[Auf Google Maps anzeigen](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## ⏱️ Zeitplan (17. Mai 2026)

**Samstag, 16.05.2026:**
- **14:00 - 19:00** - Startnummernausgabe im Pavillon EB 2,3 Milheirós de Poiares

**Sonntag, 17.05.2026:**
- **07:00 - 09:00** - Startnummernausgabe im Pavillon EB 2,3 Milheirós de Poiares
- **09:00** - **START Trail Kids**
- **09:30** - **START Kurzer Trail 16 km**
- **09:35** - **START Wanderung 9 km**
- **12:30** - Siegerehrung (nach Ankunft des letzten prämierten Athleten)
- **14:30** - Veranstaltungsende

*Zeitplan kann geändert werden*

---

## 🏆 Auszeichnungen

### **Kurzer Trail - Pokale:**
- **Top 3 Gesamtwertung Männlich und Weiblich**
- **Top 3 pro Kategorie (M/W):**
  - Sub23 Männlich/Weiblich
  - Senioren Männlich/Weiblich
  - M/W 40
  - M/W 50
  - M/W 60
- **Gesamtwertung Teams:** Top 3 jedes Teams (unabhängig vom Geschlecht)

### **Trail Kids - Pokale:**
- **Top 3 Gesamtwertung Männlich/Weiblich**
- **Top 3 pro Kategorie:**
  - Benjamins (bis 9 Jahre) M/W
  - Kinder (10-11 Jahre) M/W
  - Anfänger (12-13 Jahre) M/W

### **In der Anmeldung enthalten:**
- Startnummer mit Zeitmess-Chip (Kurzer Trail)
- Event-T-Shirt
- Unfallversicherung
- Feste und flüssige Verpflegung

![Pokale und Preise](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Preise

### **Kurzer Trail 16K:**
**Phase 1 (bis 19.04.2026):** €12,00  
**Phase 2 (20.04. bis 03.05.2026):** €14,00  
**Phase 3 (04.05. bis 13.05.2026):** €16,00

### **Wanderung 9K:**
**Alle Phasen:** €7,50

### **Trail Kids:**
**KOSTENLOSE Anmeldung** (aber obligatorisch - Bestätigung bis 22.06.2025)

**⚠️ WICHTIG:** Keine Rückerstattungen. Nur Übertragungen der Anmeldung auf einen anderen Athleten bis zum Anmeldeschluss erlaubt.

---

## 📋 Pflichtausrüstung

### **Kurzer Trail 16K:**
✅ **Sichtbare Startnummer** (vorne platziert, Brusthöhe)
✅ **Wasserbehälter** (eigener Becher - Organisation stellt keine Becher zur Verfügung)
✅ **Thermodecke**
✅ **Pfeife**
✅ **Windbreaker** (empfohlen)

### **Empfohlene Ausrüstung:**
- Camelbak-Rucksack oder Hydrationssystem
- Energienahrung
- Mütze oder Kappe
- Geeignetes Schuhwerk und Kleidung für Trail Running

**⚠️ Zufällige Ausrüstungskontrollen können stattfinden. Nicht mitführen der Pflichtausrüstung führt zur Disqualifikation.**

---

## 🎫 Startnummernausgabe

### **Pavillon EB 2,3 Milheirós de Poiares**

**Samstag, 16.05.2026:**
- 14:00 bis 19:00

**Sonntag, 17.05.2026:**
- 07:00 bis 09:00

**Erforderliche Dokumente:**
- Personalausweis / Reisepass
- Genehmigung des Erziehungsberechtigten (Trail Kids - obligatorisch)

---

## 🚨 Zeitlimit und Zeitbarrieren

### **Kurzer Trail 16K:**
**Maximale Zeit:** 3h30 min

Bei Überschreitung des Zeitlimits werden Athleten von "Kehrmaschinen" gestoppt, die die Streckenmarkierungen entfernen können.

**Wichtig:** Wenn die Organisation feststellt, dass ein Athlet aufgrund seines Gesundheitszustands entfernt werden sollte, muss diese Entscheidung zu seinem Wohlbefinden befolgt werden.

---

## 🌲 Markierung und Strecke

- **Bandfarbe** wird beim Start bekannt gegeben
- Strecke zwischen **Flüssen, markierten Wegen, Feldwegen und natürlichen Hindernissen**
- **Rennen auf offener Straße** - Vorsicht vor Fahrzeugen, Menschen und Tieren
- **Keine Abkürzungen** unter Androhung der Disqualifikation
- Bei Verlaufen: Zurückgehen und markierte Strecke suchen
- **Obligatorische Kontrollpunkte** entlang der Strecke

---

## 🌍 Umwelt-Nachhaltigkeit

Der Mâmoa River Trail 2026 läuft im **Halbautarkie-Regime**:

- 🥤 **Eigenen Becher mitbringen** - Organisation stellt keine Becher zur Verfügung
- 🗑️ **Müll mitnehmen** - Umwelt nicht belasten
- 🌿 **Natur respektieren** - Bereiche nicht beschädigen
- ♻️ **Null Umweltbelastung** - Verpflichtung aller Teilnehmer

---

## ⚖️ Strafen und Disqualifikationen

Athleten werden **bestraft** oder **disqualifiziert** für:

- ❌ Nicht mitführen der Pflichtausrüstung → **Disqualifikation**
- ❌ Nicht vollständige Strecke → **Disqualifikation**
- ❌ Respektlosigkeit oder Verschmutzung der Umwelt → **Disqualifikation**
- ⚠️ Nicht sichtbare Startnummer → **10-Minuten-Strafe**
- ❌ Änderung der Startnummer → **Disqualifikation**
- ⚠️ Ignorieren von Organisationsanweisungen → **1-Stunden-Strafe**
- ❌ Unsportliches Verhalten → **Disqualifikation**
- ❌ Fehlende Kontrollpunkte → **Disqualifikation**

---

## 🚗 Anreise

**Mâmoa Flussstrand** befindet sich in **Milheirós de Poiares**, Gemeinde **Santa Maria da Feira**.

### **Hauptzufahrten:**
- **A1** - Ausfahrt Santa Maria da Feira
- **A32** - Verbindung zur A1
- Von **Porto:** etwa 35 km (30 Minuten)
- Von **Aveiro:** etwa 30 km (25 Minuten)

**GPS-Koordinaten:**  
40.9282, -8.4669

**Google Maps:**  
[https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## 🏥 Sicherheit und Unterstützung

- **Unfallversicherung** in Anmeldegebühr enthalten
- **Identifiziertes Organisationspersonal** während des Rennens
- **Verpflegungsstellen** mit Unterstützung
- **Verletzungsmeldung:** Verletzte Athleten sollten nie allein gelassen werden
- **Berg-Autonomie:** Jeder Athlet muss physische und mentale Probleme bewältigen können

---

## 📞 Kontakte

**Anmeldung:** [www.lap2go.com/mamoarivertrail2026](https://lap2go.com/pt/event/mamoa-river-trail-2026)  
**Anmeldungs-Support:** suporte@lap2go.com | +351 308 801 674  
**Rennleiter:** Agostinho Costa

**Organisation:**  
Obra do Frei Gil  
In Zusammenarbeit mit der Stadtverwaltung Santa Maria da Feira

**Beschwerden:**  
1-Wochen-Frist per E-Mail an suporte@lap2go.com

---

## 🏃 Sportlichkeitsregeln

Von Athleten wird erwartet:

- ✅ **Respekt für die Herausforderung** und andere Wettkämpfer
- ✅ **Gegenseitige Hilfe**
- ✅ **Respekt für Organisatoren** und Personal
- ✅ **Respekt für natürliche Umgebung** - null Umweltbelastung
- ✅ **Nie einen Athleten allein lassen** bei Verletzung
- ✅ **Verletzungen melden** an Organisation so schnell wie möglich

**Unangemessenes Verhalten**, beleidigende Sprache oder verbale Aggression führt zu **Verwarnung, Ausschluss oder Disqualifikation**.

---

## 📜 Bildrechte

Die Anmeldung zum Rennen impliziert:

- Akzeptanz dieser Vorschriften
- Genehmigung zur vollständigen oder teilweisen Aufzeichnung der Teilnahme
- Zustimmung zur Verwendung des Athletenbildes zur Rennförderung
- Verwendung in Radio, Presse, Video, Fotografie, Internet, Plakaten und Medien
- Kein Recht auf finanzielle Entschädigung durch den Athleten

---

🏃 **Kommen Sie und laufen Sie die Wege von Immer am Mâmoa Flussstrand! Ein authentisches Trail-Running-Erlebnis in Kontakt mit der Natur!** 🏞️`,
      city: "Milheirós de Poiares",
      metaTitle:
        "Mâmoa River Trail 2026 - 6. Ausgabe | Santa Maria da Feira | 17. Mai",
      metaDescription:
        "Mâmoa River Trail 2026 - 6. Ausgabe am 17. Mai am Mâmoa Flussstrand, Milheirós de Poiares. Rennen: Kurzer Trail 16km, Wanderung 9km und Trail Kids. Anmeldung offen!",
    },
    it: {
      title: "Mâmoa River Trail 2026 - 6ª Edizione",
      description: `**🏞️ Mâmoa River Trail 2026 - 6ª Edizione - Sentieri di Sempre**

La **6ª Edizione del Mâmoa River Trail** torna il **17 maggio 2026** alla **Spiaggia Fluviale di Mâmoa**, a **Milheirós de Poiares**, comune di **Santa Maria da Feira**. Organizzato da **Obra do Frei Gil**, in collaborazione con il **Comune di Santa Maria da Feira**, questo evento offre un'esperienza unica di trail running attraverso i fiumi, sentieri e montagne della regione.

![Mâmoa River Trail - Spiaggia Fluviale di Mâmoa](https://radiosintonia.pt/wp-content/uploads/praia-mamoa--768x416.jpg)

---

## 🏔️ Gare Disponibili

### **Trail Corto** - 16 km
- **Distanza:** 16 km
- **Dislivello Positivo:** 800m
- **Tempo Massimo:** 3h30 min
- **Difficoltà:** Livello 2 (medio)
- **Età Minima:** 18 anni
- **Carattere:** Competitivo
- Percorso tra fiumi, sentieri segnalati e ostacoli naturali

### **Camminata** - 9 km
- **Distanza:** 9 km
- **Dislivello Positivo:** 400m
- **Carattere:** Non competitivo
- **Età:** Aperto a minori accompagnati da adulti
- Esperienza di contatto con la natura

### **Trail Kids**
- **Carattere:** Competitivo
- **Età:** 6-12 anni (Benjamins, Bambini, Principianti)
- **Iscrizione:** Gratuita ma obbligatoria
- **Luogo:** Periferia della Spiaggia Fluviale di Mâmoa
- Promozione della pratica sportiva per i giovani

![Trail tra fiumi e natura](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Punti Salienti dell'Evento

✅ **1 punto ristoro** con solidi e liquidi (Trail e Camminata)
✅ **Assicurazione infortuni personali** inclusa
✅ **T-shirt tecnica** per tutti i partecipanti
✅ **Spogliatoi disponibili** al Padiglione EB23 Milheirós de Poiares
✅ **Cronometraggio elettronico** tramite chip
✅ **Trofei** per podi e categorie
✅ **Regime di semi-autosufficienza** - portare la propria tazza

![Arena della gara - Spiaggia Fluviale di Mâmoa](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Luogo di Partenza e Arrivo

### **Partenza e Arrivo (tutte le gare):**
**Spiaggia Fluviale di Mâmoa**  
Milheirós de Poiares, Santa Maria da Feira

**Coordinate GPS:** 40.9282, -8.4669  
[Vedi su Google Maps](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## ⏱️ Orari (17 Maggio 2026)

**Sabato, 16/05/2026:**
- **14:00 - 19:00** - Ritiro pettorali al Padiglione EB 2,3 Milheirós de Poiares

**Domenica, 17/05/2026:**
- **07:00 - 09:00** - Ritiro pettorali al Padiglione EB 2,3 Milheirós de Poiares
- **09:00** - **PARTENZA Trail Kids**
- **09:30** - **PARTENZA Trail Corto 16 km**
- **09:35** - **PARTENZA Camminata 9 km**
- **12:30** - Cerimonia di premiazione (dopo arrivo dell'ultimo atleta premiato)
- **14:30** - Chiusura evento

*Orari soggetti a modifiche*

---

## 🏆 Premi

### **Trail Corto - Trofei:**
- **Primi 3 classificati Generale Maschile e Femminile**
- **Primi 3 classificati per categoria (M/F):**
  - Sub23 Maschile/Femminile
  - Seniors Maschile/Femminile
  - M/F 40
  - M/F 50
  - M/F 60
- **Generale Squadre:** Primi 3 classificati di ogni squadra (indipendentemente dal genere)

### **Trail Kids - Trofei:**
- **Primi 3 Generale Maschile/Femminile**
- **Primi 3 per categoria:**
  - Benjamins (fino a 9 anni) M/F
  - Bambini (10-11 anni) M/F
  - Principianti (12-13 anni) M/F

### **Incluso nell'Iscrizione:**
- Pettorale con chip di cronometraggio (Trail Corto)
- T-shirt tecnica dell'evento
- Assicurazione infortuni personali
- Ristori solidi e liquidi

![Trofei e premi](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Prezzi

### **Trail Corto 16K:**
**Fase 1 (fino al 19/04/2026):** €12,00  
**Fase 2 (20/04 al 03/05/2026):** €14,00  
**Fase 3 (04/05 al 13/05/2026):** €16,00

### **Camminata 9K:**
**Tutte le fasi:** €7,50

### **Trail Kids:**
**Iscrizione GRATUITA** (ma obbligatoria - conferma entro 22/06/2025)

**⚠️ IMPORTANTE:** Nessun rimborso. Solo trasferimenti di iscrizione ad altro atleta permessi fino alla chiusura iscrizioni.

---

## 📋 Materiale Obbligatorio

### **Trail Corto 16K:**
✅ **Pettorale visibile** (posizionato davanti, altezza petto)
✅ **Contenitore per acqua** (tazza propria - organizzazione non fornisce tazze)
✅ **Coperta termica**
✅ **Fischietto**
✅ **Giacca antivento** (raccomandato)

### **Materiale Raccomandato:**
- Zaino camelbak o sistema di idratazione
- Alimenti energetici
- Cappello o berretto
- Calzature e abbigliamento adeguati per trail running

**⚠️ Possono verificarsi controlli casuali del materiale. Non portare il materiale obbligatorio comporta la squalifica.**

---

## 🎫 Ritiro Pettorali

### **Padiglione EB 2,3 Milheirós de Poiares**

**Sabato, 16/05/2026:**
- 14:00 alle 19:00

**Domenica, 17/05/2026:**
- 07:00 alle 09:00

**Documenti Necessari:**
- Carta d'Identità / Passaporto
- Autorizzazione del Tutore Legale (Trail Kids - obbligatorio)

---

## 🚨 Tempo Limite e Barriere Orarie

### **Trail Corto 16K:**
**Tempo Massimo:** 3h30 min

Superando il tempo limite, gli atleti saranno fermati dagli "spazzaneve" che potranno rimuovere le segnalazioni del percorso.

**Importante:** Se l'organizzazione determina che un atleta deve essere ritirato a causa del suo stato di salute, questa decisione deve essere rispettata per il suo benessere.

---

## 🌲 Segnaletica e Percorso

- **Colore del nastro** annunciato alla partenza
- Percorso tra **fiumi, sentieri segnalati, strade sterrate e ostacoli naturali**
- **Gare su strada aperta** - attenzione a veicoli, persone e animali
- **Nessuna scorciatoia** pena la squalifica
- Se persi: tornare indietro e cercare il percorso segnalato
- **Punti di controllo obbligatori** lungo il percorso

---

## 🌍 Sostenibilità Ambientale

Il Mâmoa River Trail 2026 si svolge in **regime di semi-autosufficienza**:

- 🥤 **Portare la propria tazza** - organizzazione non fornisce tazze
- 🗑️ **Trasportare i propri rifiuti** - non danneggiare l'ambiente
- 🌿 **Rispettare la natura** - non danneggiare le aree attraversate
- ♻️ **Impatto ambientale zero** - impegno di tutti i partecipanti

---

## ⚖️ Penalità e Squalifiche

Gli atleti saranno **penalizzati** o **squalificati** per:

- ❌ Non portare materiale obbligatorio → **Squalifica**
- ❌ Non completare il percorso intero → **Squalifica**
- ❌ Mancare di rispetto o inquinare l'ambiente → **Squalifica**
- ⚠️ Non indossare pettorale visibile → **Penalità 10 minuti**
- ❌ Alterare il pettorale → **Squalifica**
- ⚠️ Ignorare istruzioni dell'organizzazione → **Penalità 1 ora**
- ❌ Condotta antisportiva → **Squalifica**
- ❌ Non passare ai punti di controllo → **Squalifica**

---

## 🚗 Come Arrivare

**Spiaggia Fluviale di Mâmoa** si trova a **Milheirós de Poiares**, comune di **Santa Maria da Feira**.

### **Principali Accessi:**
- **A1** - Uscita Santa Maria da Feira
- **A32** - Collegamento con A1
- Da **Porto:** circa 35 km (30 minuti)
- Da **Aveiro:** circa 30 km (25 minuti)

**Coordinate GPS:**  
40.9282, -8.4669

**Google Maps:**  
[https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7](https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7)

---

## 🏥 Sicurezza e Supporto

- **Assicurazione infortuni personali** inclusa nella quota di iscrizione
- **Personale identificato dell'organizzazione** durante la gara
- **Punti ristoro** con supporto
- **Segnalazione infortuni:** atleti infortunati non devono mai essere lasciati soli
- **Autonomia in montagna:** ogni atleta deve poter gestire problemi fisici e mentali

---

## 📞 Contatti

**Iscrizioni:** [www.lap2go.com/mamoarivertrail2026](https://lap2go.com/pt/event/mamoa-river-trail-2026)  
**Supporto Iscrizioni:** suporte@lap2go.com | +351 308 801 674  
**Direttore di Gara:** Agostinho Costa

**Organizzazione:**  
Obra do Frei Gil  
In collaborazione con il Comune di Santa Maria da Feira

**Reclami:**  
Termine di 1 settimana via email a suporte@lap2go.com

---

## 🏃 Regole di Condotta Sportiva

Agli atleti è richiesto:

- ✅ **Rispettare la sfida** e gli altri concorrenti
- ✅ **Aiuto reciproco**
- ✅ **Rispettare organizzatori** e personale
- ✅ **Rispettare l'ambiente naturale** - impatto ambientale zero
- ✅ **Mai lasciare un atleta solo** in caso di infortunio
- ✅ **Segnalare infortuni** all'organizzazione il prima possibile

**Comportamento inappropriato**, linguaggio offensivo o aggressione verbale comporterà **avvertimento, espulsione o squalifica**.

---

## 📜 Diritti d'Immagine

L'iscrizione alla gara implica:

- Accettazione di questo regolamento
- Autorizzazione per registrazione totale o parziale della partecipazione
- Accordo per uso dell'immagine dell'atleta per promozione della gara
- Uso in radio, stampa, video, fotografia, Internet, manifesti e media
- Nessun diritto a compensazione finanziaria da parte dell'atleta

---

🏃 **Vieni a correre i Sentieri di Sempre alla Spiaggia Fluviale di Mâmoa! Un'esperienza autentica di trail running a contatto con la natura!** 🏞️`,
      city: "Milheirós de Poiares",
      metaTitle:
        "Mâmoa River Trail 2026 - 6ª Edizione | Santa Maria da Feira | 17 Maggio",
      metaDescription:
        "Mâmoa River Trail 2026 - 6ª edizione il 17 maggio alla Spiaggia Fluviale di Mâmoa, Milheirós de Poiares. Gare: Trail Corto 16km, Camminata 9km e Trail Kids. Iscrizioni aperte!",
    },
  };

  // FAQ data for ALL 6 languages
  const faqs = {
    pt: [
      {
        question: "Onde posso fazer a inscrição?",
        answer:
          "As inscrições devem ser efetuadas exclusivamente na plataforma lap2go.com. Após a inscrição, deve regularizar o pagamento no prazo máximo de 3 dias, caso contrário a inscrição será anulada.",
      },
      {
        question: "Posso transferir a minha inscrição para outra pessoa?",
        answer:
          "Sim, são permitidas transferências de inscrição para outro atleta até ao fecho das inscrições. Contacte suporte@lap2go.com para realizar a transferência.",
      },
      {
        question: "A inscrição do Trail Kids é gratuita?",
        answer:
          "Sim, a inscrição do Trail Kids é GRATUITA, mas obrigatória. A confirmação deve ser feita até ao dia 22 de junho de 2025.",
      },
      {
        question: "Qual é o material obrigatório para o Trail Curto?",
        answer:
          "Para o Trail Curto 16K é obrigatório: dorsal visível (à frente), recipiente para água (copo próprio), manta térmica e apito. Poderá haver controlo aleatório de material.",
      },
      {
        question: "A organização fornece copos nos abastecimentos?",
        answer:
          "NÃO. O evento decorre em regime de semi-autossuficiência. Cada atleta deve trazer o seu próprio copo para se servir dos líquidos nos abastecimentos.",
      },
      {
        question: "Onde e quando posso levantar o dorsal?",
        answer:
          "No Pavilhão EB 2,3 Milheirós de Poiares: Sábado (16/05) das 14h00 às 19h00 ou Domingo (17/05) das 07h00 às 09h00. É necessário apresentar documento de identificação.",
      },
      {
        question: "Qual é o tempo limite para o Trail Curto?",
        answer:
          "O tempo máximo para completar o Trail Curto de 16km é de 3h30 minutos. Ultrapassando este tempo, os atletas serão barrados pelos 'corredores vassouras'.",
      },
      {
        question: "Há balneários disponíveis após a prova?",
        answer:
          "Sim, estarão disponíveis balneários no Pavilhão da Escola EB23 Milheirós de Poiares para banho após a prova.",
      },
      {
        question: "Que prémios serão atribuídos?",
        answer:
          "No Trail Curto: troféus para os 3 primeiros da geral M/F e 3 primeiros de cada escalão (Sub23, Seniores, 40, 50, 60), além da geral por equipas. No Trail Kids: troféus para os 3 primeiros da geral M/F e de cada escalão etário.",
      },
      {
        question: "O que acontece se não passar nos postos de controlo?",
        answer:
          "Não passar nos postos de controlo obrigatórios resulta em desclassificação automática. É essencial seguir o percurso completo e passar por todos os pontos de controlo.",
      },
      {
        question: "Posso participar na caminhada com crianças?",
        answer:
          "Sim, a caminhada de 9km é aberta a menores desde que acompanhados por uma pessoa maior de idade. É uma atividade não competitiva ideal para toda a família.",
      },
      {
        question: "Como funciona a classificação por equipas?",
        answer:
          "Na classificação geral por equipas, contabilizam-se os 3 primeiros classificados de cada equipa, independentemente do género (pode ser masculino, feminino ou misto).",
      },
    ],
    en: [
      {
        question: "Where can I register?",
        answer:
          "Registrations must be made exclusively on the lap2go.com platform. After registration, you must complete payment within a maximum of 3 days, otherwise the registration will be cancelled.",
      },
      {
        question: "Can I transfer my registration to another person?",
        answer:
          "Yes, registration transfers to another athlete are allowed until registration closes. Contact suporte@lap2go.com to make the transfer.",
      },
      {
        question: "Is Trail Kids registration free?",
        answer:
          "Yes, Trail Kids registration is FREE, but mandatory. Confirmation must be made by June 22, 2025.",
      },
      {
        question: "What is the mandatory equipment for the Short Trail?",
        answer:
          "For Short Trail 16K it is mandatory: visible race bib (at front), water container (own cup), thermal blanket and whistle. Random equipment checks may occur.",
      },
      {
        question: "Does the organization provide cups at aid stations?",
        answer:
          "NO. The event operates in semi-self-sufficiency regime. Each athlete must bring their own cup to serve themselves liquids at aid stations.",
      },
      {
        question: "Where and when can I collect my race bib?",
        answer:
          "At EB 2,3 Milheirós de Poiares Pavilion: Saturday (16/05) from 14:00 to 19:00 or Sunday (17/05) from 07:00 to 09:00. ID document is required.",
      },
      {
        question: "What is the time limit for the Short Trail?",
        answer:
          "The maximum time to complete the 16km Short Trail is 3h30 minutes. Exceeding this time, athletes will be stopped by 'sweepers'.",
      },
      {
        question: "Are showers available after the race?",
        answer:
          "Yes, showers will be available at the EB23 Milheirós de Poiares School Pavilion for bathing after the race.",
      },
      {
        question: "What prizes will be awarded?",
        answer:
          "In Short Trail: trophies for top 3 overall M/F and top 3 in each category (Sub23, Seniors, 40, 50, 60), plus overall teams. In Trail Kids: trophies for top 3 overall M/F and in each age category.",
      },
      {
        question: "What happens if I miss checkpoints?",
        answer:
          "Missing mandatory checkpoints results in automatic disqualification. It is essential to follow the complete course and pass through all control points.",
      },
      {
        question: "Can I participate in the walk with children?",
        answer:
          "Yes, the 9km walk is open to minors as long as they are accompanied by an adult. It is a non-competitive activity ideal for the whole family.",
      },
      {
        question: "How does team classification work?",
        answer:
          "In overall team classification, the top 3 finishers from each team are counted, regardless of gender (can be male, female or mixed).",
      },
    ],
    es: [
      {
        question: "¿Dónde puedo inscribirme?",
        answer:
          "Las inscripciones deben realizarse exclusivamente en la plataforma lap2go.com. Después de la inscripción, debe regularizar el pago en un plazo máximo de 3 días, de lo contrario la inscripción será anulada.",
      },
      {
        question: "¿Puedo transferir mi inscripción a otra persona?",
        answer:
          "Sí, se permiten transferencias de inscripción a otro atleta hasta el cierre de inscripciones. Contacte con suporte@lap2go.com para realizar la transferencia.",
      },
      {
        question: "¿La inscripción del Trail Kids es gratuita?",
        answer:
          "Sí, la inscripción del Trail Kids es GRATUITA, pero obligatoria. La confirmación debe realizarse hasta el 22 de junio de 2025.",
      },
      {
        question: "¿Cuál es el material obligatorio para el Trail Corto?",
        answer:
          "Para el Trail Corto 16K es obligatorio: dorsal visible (al frente), recipiente para agua (vaso propio), manta térmica y silbato. Pueden realizarse controles aleatorios de material.",
      },
      {
        question: "¿La organización proporciona vasos en los avituallamientos?",
        answer:
          "NO. El evento se desarrolla en régimen de semi-autosuficiencia. Cada atleta debe traer su propio vaso para servirse los líquidos en los avituallamientos.",
      },
      {
        question: "¿Dónde y cuándo puedo recoger el dorsal?",
        answer:
          "En el Pabellón EB 2,3 Milheirós de Poiares: Sábado (16/05) de 14:00 a 19:00 o Domingo (17/05) de 07:00 a 09:00. Es necesario presentar documento de identificación.",
      },
      {
        question: "¿Cuál es el tiempo límite para el Trail Corto?",
        answer:
          "El tiempo máximo para completar el Trail Corto de 16km es de 3h30 minutos. Superando este tiempo, los atletas serán detenidos por los 'escobas'.",
      },
      {
        question: "¿Hay vestuarios disponibles después de la prueba?",
        answer:
          "Sí, estarán disponibles vestuarios en el Pabellón de la Escuela EB23 Milheirós de Poiares para ducha después de la prueba.",
      },
      {
        question: "¿Qué premios se otorgarán?",
        answer:
          "En Trail Corto: trofeos para los 3 primeros de la general M/F y 3 primeros de cada categoría (Sub23, Seniores, 40, 50, 60), además de la general por equipos. En Trail Kids: trofeos para los 3 primeros de la general M/F y de cada categoría de edad.",
      },
      {
        question: "¿Qué pasa si no paso por los puntos de control?",
        answer:
          "No pasar por los puntos de control obligatorios resulta en descalificación automática. Es esencial seguir el recorrido completo y pasar por todos los puntos de control.",
      },
      {
        question: "¿Puedo participar en la caminata con niños?",
        answer:
          "Sí, la caminata de 9km está abierta a menores siempre que vayan acompañados por una persona mayor de edad. Es una actividad no competitiva ideal para toda la familia.",
      },
      {
        question: "¿Cómo funciona la clasificación por equipos?",
        answer:
          "En la clasificación general por equipos, se contabilizan los 3 primeros clasificados de cada equipo, independientemente del género (puede ser masculino, femenino o mixto).",
      },
    ],
    fr: [
      {
        question: "Où puis-je m'inscrire?",
        answer:
          "Les inscriptions doivent être effectuées exclusivement sur la plateforme lap2go.com. Après l'inscription, vous devez régulariser le paiement dans un délai maximum de 3 jours, sinon l'inscription sera annulée.",
      },
      {
        question: "Puis-je transférer mon inscription à une autre personne?",
        answer:
          "Oui, les transferts d'inscription à un autre athlète sont autorisés jusqu'à la clôture des inscriptions. Contactez suporte@lap2go.com pour effectuer le transfert.",
      },
      {
        question: "L'inscription au Trail Kids est-elle gratuite?",
        answer:
          "Oui, l'inscription au Trail Kids est GRATUITE, mais obligatoire. La confirmation doit être faite avant le 22 juin 2025.",
      },
      {
        question: "Quel est le matériel obligatoire pour le Trail Court?",
        answer:
          "Pour le Trail Court 16K il est obligatoire: dossard visible (à l'avant), récipient pour eau (gobelet personnel), couverture thermique et sifflet. Des contrôles aléatoires de matériel peuvent avoir lieu.",
      },
      {
        question:
          "L'organisation fournit-elle des gobelets aux points de ravitaillement?",
        answer:
          "NON. L'événement se déroule en régime de semi-autosuffisance. Chaque athlète doit apporter son propre gobelet pour se servir des liquides aux points de ravitaillement.",
      },
      {
        question: "Où et quand puis-je récupérer mon dossard?",
        answer:
          "Au Pavillon EB 2,3 Milheirós de Poiares: Samedi (16/05) de 14:00 à 19:00 ou Dimanche (17/05) de 07:00 à 09:00. Une pièce d'identité est requise.",
      },
      {
        question: "Quelle est la limite de temps pour le Trail Court?",
        answer:
          "Le temps maximum pour terminer le Trail Court de 16km est de 3h30 minutes. En dépassant ce temps, les athlètes seront arrêtés par les 'balayeurs'.",
      },
      {
        question: "Y a-t-il des douches disponibles après la course?",
        answer:
          "Oui, des douches seront disponibles au Pavillon de l'École EB23 Milheirós de Poiares pour se laver après la course.",
      },
      {
        question: "Quels prix seront attribués?",
        answer:
          "Dans le Trail Court: trophées pour les 3 premiers au général H/F et 3 premiers de chaque catégorie (Sub23, Seniors, 40, 50, 60), plus le général par équipes. Dans le Trail Kids: trophées pour les 3 premiers au général H/F et dans chaque catégorie d'âge.",
      },
      {
        question:
          "Que se passe-t-il si je ne passe pas aux points de contrôle?",
        answer:
          "Ne pas passer aux points de contrôle obligatoires entraîne une disqualification automatique. Il est essentiel de suivre le parcours complet et de passer par tous les points de contrôle.",
      },
      {
        question: "Puis-je participer à la randonnée avec des enfants?",
        answer:
          "Oui, la randonnée de 9km est ouverte aux mineurs tant qu'ils sont accompagnés d'un adulte. C'est une activité non compétitive idéale pour toute la famille.",
      },
      {
        question: "Comment fonctionne le classement par équipes?",
        answer:
          "Dans le classement général par équipes, les 3 premiers classés de chaque équipe sont comptabilisés, indépendamment du genre (peut être masculin, féminin ou mixte).",
      },
    ],
    de: [
      {
        question: "Wo kann ich mich anmelden?",
        answer:
          "Anmeldungen müssen ausschließlich auf der Plattform lap2go.com erfolgen. Nach der Anmeldung müssen Sie die Zahlung innerhalb von maximal 3 Tagen abschließen, andernfalls wird die Anmeldung storniert.",
      },
      {
        question: "Kann ich meine Anmeldung auf eine andere Person übertragen?",
        answer:
          "Ja, Anmeldungsübertragungen auf einen anderen Athleten sind bis zum Anmeldeschluss erlaubt. Kontaktieren Sie suporte@lap2go.com, um die Übertragung vorzunehmen.",
      },
      {
        question: "Ist die Trail Kids Anmeldung kostenlos?",
        answer:
          "Ja, die Trail Kids Anmeldung ist KOSTENLOS, aber obligatorisch. Die Bestätigung muss bis zum 22. Juni 2025 erfolgen.",
      },
      {
        question: "Was ist die Pflichtausrüstung für den Kurzen Trail?",
        answer:
          "Für den Kurzen Trail 16K ist obligatorisch: sichtbare Startnummer (vorne), Wasserbehälter (eigener Becher), Thermodecke und Pfeife. Zufällige Ausrüstungskontrollen können stattfinden.",
      },
      {
        question:
          "Stellt die Organisation Becher an den Verpflegungsstellen zur Verfügung?",
        answer:
          "NEIN. Die Veranstaltung läuft im Halbautarkie-Regime. Jeder Athlet muss seinen eigenen Becher mitbringen, um sich an den Verpflegungsstellen mit Flüssigkeiten zu versorgen.",
      },
      {
        question: "Wo und wann kann ich meine Startnummer abholen?",
        answer:
          "Im Pavillon EB 2,3 Milheirós de Poiares: Samstag (16.05.) von 14:00 bis 19:00 oder Sonntag (17.05.) von 07:00 bis 09:00. Ein Ausweisdokument ist erforderlich.",
      },
      {
        question: "Was ist das Zeitlimit für den Kurzen Trail?",
        answer:
          "Die maximale Zeit zum Abschließen des 16km Kurzen Trails beträgt 3h30 Minuten. Bei Überschreitung dieser Zeit werden Athleten von 'Kehrmaschinen' gestoppt.",
      },
      {
        question: "Sind Duschen nach dem Rennen verfügbar?",
        answer:
          "Ja, Duschen sind im Pavillon der Schule EB23 Milheirós de Poiares zum Baden nach dem Rennen verfügbar.",
      },
      {
        question: "Welche Preise werden vergeben?",
        answer:
          "Im Kurzen Trail: Pokale für die Top 3 Gesamt M/W und Top 3 in jeder Kategorie (Sub23, Senioren, 40, 50, 60), plus Gesamt-Teams. Im Trail Kids: Pokale für die Top 3 Gesamt M/W und in jeder Alterskategorie.",
      },
      {
        question: "Was passiert, wenn ich Kontrollpunkte verpasse?",
        answer:
          "Das Verpassen obligatorischer Kontrollpunkte führt zur automatischen Disqualifikation. Es ist wichtig, die vollständige Strecke zu folgen und alle Kontrollpunkte zu passieren.",
      },
      {
        question: "Kann ich mit Kindern an der Wanderung teilnehmen?",
        answer:
          "Ja, die 9km Wanderung steht Minderjährigen offen, solange sie von einem Erwachsenen begleitet werden. Es ist eine nicht wettbewerbsfähige Aktivität, ideal für die ganze Familie.",
      },
      {
        question: "Wie funktioniert die Teamwertung?",
        answer:
          "In der Gesamt-Teamwertung werden die Top 3 jedes Teams gezählt, unabhängig vom Geschlecht (kann männlich, weiblich oder gemischt sein).",
      },
    ],
    it: [
      {
        question: "Dove posso iscrivermi?",
        answer:
          "Le iscrizioni devono essere effettuate esclusivamente sulla piattaforma lap2go.com. Dopo l'iscrizione, deve regolarizzare il pagamento entro un massimo di 3 giorni, altrimenti l'iscrizione sarà annullata.",
      },
      {
        question: "Posso trasferire la mia iscrizione ad un'altra persona?",
        answer:
          "Sì, sono permessi trasferimenti di iscrizione ad altro atleta fino alla chiusura delle iscrizioni. Contattare suporte@lap2go.com per effettuare il trasferimento.",
      },
      {
        question: "L'iscrizione al Trail Kids è gratuita?",
        answer:
          "Sì, l'iscrizione al Trail Kids è GRATUITA, ma obbligatoria. La conferma deve essere fatta entro il 22 giugno 2025.",
      },
      {
        question: "Qual è il materiale obbligatorio per il Trail Corto?",
        answer:
          "Per il Trail Corto 16K è obbligatorio: pettorale visibile (davanti), contenitore per acqua (tazza propria), coperta termica e fischietto. Possono verificarsi controlli casuali del materiale.",
      },
      {
        question: "L'organizzazione fornisce tazze ai punti ristoro?",
        answer:
          "NO. L'evento si svolge in regime di semi-autosufficienza. Ogni atleta deve portare la propria tazza per servirsi dei liquidi ai punti ristoro.",
      },
      {
        question: "Dove e quando posso ritirare il pettorale?",
        answer:
          "Al Padiglione EB 2,3 Milheirós de Poiares: Sabato (16/05) dalle 14:00 alle 19:00 o Domenica (17/05) dalle 07:00 alle 09:00. È richiesto un documento d'identità.",
      },
      {
        question: "Qual è il tempo limite per il Trail Corto?",
        answer:
          "Il tempo massimo per completare il Trail Corto di 16km è di 3h30 minuti. Superando questo tempo, gli atleti saranno fermati dagli 'spazzaneve'.",
      },
      {
        question: "Ci sono spogliatoi disponibili dopo la gara?",
        answer:
          "Sì, saranno disponibili spogliatoi al Padiglione della Scuola EB23 Milheirós de Poiares per la doccia dopo la gara.",
      },
      {
        question: "Quali premi saranno assegnati?",
        answer:
          "Nel Trail Corto: trofei per i primi 3 della generale M/F e primi 3 di ogni categoria (Sub23, Seniors, 40, 50, 60), oltre alla generale per squadre. Nel Trail Kids: trofei per i primi 3 della generale M/F e di ogni categoria di età.",
      },
      {
        question: "Cosa succede se non passo ai punti di controllo?",
        answer:
          "Non passare ai punti di controllo obbligatori comporta la squalifica automatica. È essenziale seguire il percorso completo e passare per tutti i punti di controllo.",
      },
      {
        question: "Posso partecipare alla camminata con bambini?",
        answer:
          "Sì, la camminata di 9km è aperta ai minori purché accompagnati da un adulto. È un'attività non competitiva ideale per tutta la famiglia.",
      },
      {
        question: "Come funziona la classifica per squadre?",
        answer:
          "Nella classifica generale per squadre, si contano i primi 3 classificati di ogni squadra, indipendentemente dal genere (può essere maschile, femminile o misto).",
      },
    ],
  };

  // Create event
  const event = await prisma.event.create({
    data: {
      title: "Mâmoa River Trail 2026 - 6ª Edição",
      slug: eventSlug,
      description:
        "6ª Edição do Mâmoa River Trail - Trail running pela Praia Fluvial da Mâmoa, Milheirós de Poiares, Santa Maria da Feira.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Santa Maria da Feira",
      country: "Portugal",
      sportTypes: [SportType.TRAIL],
      imageUrl:
        "https://radiosintonia.pt/wp-content/uploads/praia-mamoa--768x416.jpg",
      externalUrl: "https://lap2go.com/pt/event/mamoa-river-trail-2026",
      registrationDeadline: new Date("2026-05-13T23:59:59Z"),
      latitude: 40.9282,
      longitude: -8.4669,
      googleMapsUrl: "https://maps.app.goo.gl/h9JqHyy1m9BhzLTC7",
      isFeatured: true,
    },
  });

  console.log(`✅ Created event: ${eventSlug}`);

  // Create translations for ALL 6 languages
  console.log("🌍 Creating translations for all 6 languages...");
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  for (const lang of languages) {
    const langKey = lang.toLowerCase() as
      | "pt"
      | "en"
      | "es"
      | "fr"
      | "de"
      | "it";
    const translation = translations[langKey];

    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: {
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });

    console.log(`   ✅ Created ${lang.toUpperCase()} translation`);
  }

  // Event variants with pricing phases
  const variants = [
    {
      name: "Trail Curto 16K",
      distanceKm: 16.0,
      elevationGainM: 800,
      elevationLossM: 800,
      cutoffTimeHours: 3.5,
      mountainLevel: 2,
      maxParticipants: 300,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-04-19T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: "Até 19/04/2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-04-20T00:00:00Z"),
          endDate: new Date("2026-05-03T23:59:59Z"),
          price: 14.0,
          currency: Currency.EUR,
          note: "20/04 a 03/05/2026",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-05-04T00:00:00Z"),
          endDate: new Date("2026-05-13T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "04/05 a 13/05/2026",
        },
      ],
    },
    {
      name: "Caminhada 9K",
      distanceKm: 9.0,
      elevationGainM: 400,
      elevationLossM: 400,
      cutoffTimeHours: null,
      mountainLevel: 1,
      maxParticipants: 200,
      pricingPhases: [
        {
          name: "Todas as Fases",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-05-13T23:59:59Z"),
          price: 7.5,
          currency: Currency.EUR,
          note: "Preço único",
        },
      ],
    },
    {
      name: "Trail Kids",
      distanceKm: 1.0,
      elevationGainM: 0,
      elevationLossM: 0,
      cutoffTimeHours: null,
      mountainLevel: 0,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "Inscrição Gratuita",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-06-22T23:59:59Z"),
          price: 0.0,
          currency: Currency.EUR,
          note: "GRATUITA - Confirmação até 22/06/2025",
        },
      ],
    },
  ];

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases for this variant
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ linked to eventId (event-level display)
          variantId: variant.id, // ✅ linked to variantId (variant-level pricing)
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  // Create FAQs with translations for ALL 6 languages
  console.log("❓ Creating FAQs with translations for all 6 languages...");

  // First, create FAQs with Portuguese (base) content
  const ptFaqs = faqs.pt;
  for (let i = 0; i < ptFaqs.length; i++) {
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: ptFaqs[i].question,
        answer: ptFaqs[i].answer,
        order: i + 1,
      },
    });

    // Now create translations for all 6 languages
    for (const lang of languages) {
      const langKey = lang.toLowerCase() as
        | "pt"
        | "en"
        | "es"
        | "fr"
        | "de"
        | "it";
      const langFaq = faqs[langKey][i];

      await prisma.eventFAQTranslation.create({
        data: {
          faqId: faq.id,
          language: lang,
          question: langFaq.question,
          answer: langFaq.answer,
        },
      });
    }

    console.log(`   ✅ Created FAQ ${i + 1} with all 6 language translations`);
  }

  console.log("✅ Mâmoa River Trail 2026 seed completed successfully!");
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedMamoaRiverTrail2026()
    .catch((e) => {
      console.error("❌ Error seeding Mâmoa River Trail 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
