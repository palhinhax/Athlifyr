import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedPoiaresTrail2026() {
  console.log("🌲 Seeding Poiares Trail 2026...");

  // Base event data
  const eventSlug = "poiares-trail-2026";
  const eventStartDate = new Date("2026-02-22T09:00:00Z");
  const eventEndDate = new Date("2026-02-22T17:30:00Z");

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
      title: "Poiares Trail 2026",
      description: `**🌲 Poiares Trail 2026 - Trail Running no Coração de Portugal**

O **Poiares Trail 2026** regressa a **22 de fevereiro** a **Vila Nova de Poiares**, no coração da região centro de Portugal. Organizado pela **ARSM – Associação Recreativa de São Miguel**, em parceria com o Município de Vila Nova de Poiares, este evento oferece uma experiência única de trail running pelas serras e trilhos da região.

![Poiares Trail - Serras de Vila Nova de Poiares](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop)

---

## 🏔️ Provas Disponíveis

### **PT35K Maxivisão** - Trail Longo
- **Distância:** 35 km
- **Desnível:** 1700D+ / 1700D-
- **Tempo Máximo:** 8 horas
- **Dificuldade:** Nível 2 (difícil)
- **Idade Mínima:** 20 anos
- Percurso técnico pelas serras do Bidoeiro, Carvalho e Vilar

### **PT22K Decathlon** - Trail Curto
- **Distância:** 22 km
- **Desnível:** 1100D+ / 1100D-
- **Tempo Máximo:** 6 horas
- **Dificuldade:** Nível 2 (difícil)
- **Idade Mínima:** 18 anos (Sub20)

### **PT13K Fresbeira** - Mini Trail
- **Distância:** 13 km
- **Desnível:** 400D+ / 400D-
- **Tempo Máximo:** 4 horas
- **Dificuldade:** Nível 1 (médio)
- **Idade Mínima:** 16 anos

### **Estafetas 35K Ansell Portugal**
- **Distância Total:** 35 km (3 atletas)
- **Formato:** Equipas de 3 elementos
- **Percursos:** 12km + 10km + 13km (aproximado)
- **Zonas de Transição:** Venda Nova e Louredo Natura Parque

### **Caminhada 13K Farmácia Santo André**
- **Distância:** 13 km
- **Caráter:** Não competitivo
- **Idade Mínima:** 16 anos

![Trail pela floresta portuguesa](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Destaques do Evento

✅ **3 postos de abastecimento** com líquidos e sólidos (PT35K/Estafetas)
✅ **Sistema de enchimento de recipientes** (regime semi-autossuficiência)
✅ **Seguro de responsabilidade civil e acidentes pessoais**
✅ **Transporte para partida** (PT35K e Estafetas)
✅ **Refeição quente** no final da prova
✅ **Prémio finisher** para todos os classificados
✅ **Banho** disponível na arena da prova
✅ **Cronometragem eletrónica** por chip

![Arena da prova - Mercado Municipal](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Locais de Partida e Chegada

### **Partidas:**
- **PT35K Maxivisão / Estafetas 35K:** Pavilhão da ARSM, São Miguel de Poiares *(transfere incluído)*
- **PT22K Decathlon / PT13K Fresbeira:** Mercado Municipal de Vila Nova de Poiares

### **Chegada (todas as provas):**
Arena da Prova - **Mercado Municipal de Vila Nova de Poiares**

---

## ⏱️ Horários (22 Fevereiro 2026)

- **07h30** - Abertura do secretariado
- **07h45** - Início do transfere para PT35K/Estafetas
- **09h00** - **PARTIDA PT35K Maxivisão e Estafetas 35K**
- **09h30** - **PARTIDA PT22K Decathlon**
- **10h00** - **PARTIDA PT13K Fresbeira e Caminhada 13K**
- **12h30** - Início do almoço
- **14h00-15h00** - Entrega de prémios

---

## 🏆 Premiações

### **Troféus:**
- 3 primeiros classificados (M/F) na geral do PT35K e PT22K
- Todos os escalões etários premiados
- 3 primeiras equipas (M/F/Mistas) - PT35K e PT22K
- Pódio alargado até ao 6º lugar (M/F) - PT13K

### **Inclui na Inscrição:**
- Dorsal com chip de cronometragem
- Toalha de banho (brinde da prova)
- Prémio finisher
- Seguro de acidentes pessoais
- Refeição quente

![Troféus e prémios](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Preços (EVENTO ADIADO)

**⚠️ AVISO IMPORTANTE:**
O evento originalmente agendado para 7 de fevereiro foi **adiado para 22 de fevereiro de 2026** devido a condições meteorológicas adversas e situação de calamidade no concelho.

### **Fases de Inscrição:**
**1ª Fase (até 31/12/2025):**
- PT35K Maxivisão: €23,00 (ADAC: €21,50)
- PT22K Decathlon: €18,00
- PT13K Fresbeira: €13,00
- Estafetas 35K: €39,00/equipa

**2ª Fase (01 a 25/01/2026):**
- PT35K Maxivisão: €26,00 (ADAC: €24,50)
- PT22K Decathlon: €21,00
- PT13K Fresbeira: €16,00
- Estafetas 35K: €48,00/equipa

**Grupos:** 10ª inscrição gratuita (mediante contacto prévio)

---

## 📋 Material Obrigatório

### **PT35K Maxivisão / Estafetas 35K:**
✅ Dorsal visível
✅ Manta térmica
✅ Apito
✅ Telemóvel operacional com bateria

### **PT22K Decathlon:**
✅ Dorsal visível
✅ Manta térmica
✅ Apito
✅ Telemóvel operacional

### **PT13K Fresbeira:**
✅ Dorsal visível

### **Material Recomendado (todas as provas):**
- Depósito de água (0,5L mínimo)
- Alimentação de reserva
- Casaco impermeável
- Mochila adequada

**⚠️ IMPORTANTE:** Marcar todas as embalagens de nutrição com o número de dorsal. Embalagens vazias devem ser transportadas até à meta ou depositadas nos postos de abastecimento.

---

## 🎫 Check-In e Levantamento de Dorsais

### **Centro Cultural de Vila Nova de Poiares**

**Sexta-feira, 21/02/2026:**
- 19h00 às 20h30

**Sábado, 22/02/2026:**
- 07h30 às 09h30

**Documentos Necessários:**
- Bilhete de Identidade / Cartão de Cidadão / Passaporte
- Autorização do Encarregado de Educação (menores de 18 anos)

---

## 🚨 Barreira Horária

### **PT35K Maxivisão / Estafetas 35K:**
**Abastecimento Estrada para Soutelo (27 km):**
- Hora limite de chegada: **15h45** (6h45 de prova)
- Atletas fora do tempo serão retirados de prova e transportados para a meta

---

## 🌍 Sustentabilidade Ambiental

O Poiares Trail 2026 decorre em **regime de semi-autossuficiência**:
- ♻️ Não há distribuição de garrafas descartáveis
- 💧 Enchimento de recipientes nos postos de abastecimento
- 🗑️ Atletas devem transportar embalagens vazias até à meta
- 🎁 **Sorteio de 3 inscrições gratuitas 2027** entre embalagens marcadas corretamente

---

## 🚗 Como Chegar

**Vila Nova de Poiares** está localizada a cerca de **25 km de Coimbra**.

### **Principais Acessos:**
- **N17** - Estrada da Beira
- **IP3** - Via rápida Coimbra-Viseu

**Coordenadas GPS:**
- Arena/Chegada: 40.213056, -8.258423
- Partida PT35K: 40.212147, -8.232183

---

## 📞 Contactos

**Email:** poiarestrail@gmail.com
**Website:** www.poiarestrail.pt
**Inscrições:** www.stopandgo.com.pt

**Organização:**
ARSM – Associação Recreativa de São Miguel
Em parceria com o Município de Vila Nova de Poiares

---

🏃 **Vem correr pelas serras de Vila Nova de Poiares! Uma experiência de trail running autêntica no coração de Portugal!** 🌲`,
      city: "Vila Nova de Poiares",
      region: "Coimbra",
      metaTitle:
        "Poiares Trail 2026 | Vila Nova de Poiares | 22 Fevereiro 2026",
      metaDescription:
        "Poiares Trail 2026 a 22 de fevereiro em Vila Nova de Poiares. Provas: PT35K Maxivisão, PT22K Decathlon, PT13K Fresbeira, Estafetas 35K e Caminhada 13K. Inscrições abertas!",
    },
    en: {
      title: "Poiares Trail 2026",
      description: `**🌲 Poiares Trail 2026 - Trail Running in the Heart of Portugal**

The **Poiares Trail 2026** returns on **February 22** to **Vila Nova de Poiares**, in the heart of central Portugal. Organized by **ARSM – Associação Recreativa de São Miguel**, in partnership with the Municipality of Vila Nova de Poiares, this event offers a unique trail running experience through the mountains and trails of the region.

![Poiares Trail - Vila Nova de Poiares Mountains](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop)

---

## 🏔️ Available Races

### **PT35K Maxivisão** - Long Trail
- **distanceKm:** 35 km
- **Elevation:** 1700D+ / 1700D-
- **Time Limit:** 8 hours
- **mountainLevel:** Level 2 (hard)
- **Minimum Age:** 20 years
- Technical course through Bidoeiro, Carvalho and Vilar mountains

### **PT22K Decathlon** - Short Trail
- **distanceKm:** 22 km
- **Elevation:** 1100D+ / 1100D-
- **Time Limit:** 6 hours
- **mountainLevel:** Level 2 (hard)
- **Minimum Age:** 18 years (U20)

### **PT13K Fresbeira** - Mini Trail
- **distanceKm:** 13 km
- **Elevation:** 400D+ / 400D-
- **Time Limit:** 4 hours
- **mountainLevel:** Level 1 (medium)
- **Minimum Age:** 16 years

### **35K Relay Ansell Portugal**
- **Total distanceKm:** 35 km (3 athletes)
- **Format:** Teams of 3 members
- **Legs:** 12km + 10km + 13km (approximate)
- **Transition Zones:** Venda Nova and Louredo Natura Park

### **13K Walk Farmácia Santo André**
- **distanceKm:** 13 km
- **Nature:** Non-competitive
- **Minimum Age:** 16 years

![Trail through Portuguese forest](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Event Highlights

✅ **3 aid stations** with liquids and solids (PT35K/Relays)
✅ **Container refill system** (semi-self-sufficiency regime)
✅ **Civil liability and personal accident insurance**
✅ **Transport to start** (PT35K and Relays)
✅ **Hot meal** at the finish
✅ **Finisher prize** for all classified runners
✅ **Shower** available at race arena
✅ **Electronic timing** by chip

![Race arena - Municipal Market](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Start and Finish Locations

### **Starts:**
- **PT35K Maxivisão / 35K Relay:** ARSM Pavilion, São Miguel de Poiares *(transfer included)*
- **PT22K Decathlon / PT13K Fresbeira:** Municipal Market of Vila Nova de Poiares

### **Finish (all races):**
Race Arena - **Municipal Market of Vila Nova de Poiares**

---

## ⏱️ Schedule (February 22, 2026)

- **07:30** - Registration opens
- **07:45** - Start of transfer to PT35K/Relays
- **09:00** - **START PT35K Maxivisão and 35K Relay**
- **09:30** - **START PT22K Decathlon**
- **10:00** - **START PT13K Fresbeira and 13K Walk**
- **12:30** - Lunch begins
- **14:00-15:00** - Award ceremony

---

## 🏆 Awards

### **Trophies:**
- Top 3 overall (M/F) in PT35K and PT22K
- All age categories awarded
- Top 3 teams (M/F/Mixed) - PT35K and PT22K
- Extended podium up to 6th place (M/F) - PT13K

### **Included in Registration:**
- Race bib with timing chip
- Bath towel (race gift)
- Finisher prize
- Personal accident insurance
- Hot meal

![Trophies and prizes](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Prices (EVENT POSTPONED)

**⚠️ IMPORTANT NOTICE:**
The event originally scheduled for February 7 has been **postponed to February 22, 2026** due to adverse weather conditions and calamity situation in the municipality.

### **Registration Phases:**
**Phase 1 (until 31/12/2025):**
- PT35K Maxivisão: €23.00 (ADAC: €21.50)
- PT22K Decathlon: €18.00
- PT13K Fresbeira: €13.00
- 35K Relay: €39.00/team

**Phase 2 (01 to 25/01/2026):**
- PT35K Maxivisão: €26.00 (ADAC: €24.50)
- PT22K Decathlon: €21.00
- PT13K Fresbeira: €16.00
- 35K Relay: €48.00/team

**Groups:** 10th registration free (with prior contact)

---

## 📋 Mandatory Equipment

### **PT35K Maxivisão / 35K Relay:**
✅ Visible race bib
✅ Thermal blanket
✅ Whistle
✅ Operational mobile phone with battery

### **PT22K Decathlon:**
✅ Visible race bib
✅ Thermal blanket
✅ Whistle
✅ Operational mobile phone

### **PT13K Fresbeira:**
✅ Visible race bib

### **Recommended Equipment (all races):**
- Water reservoir (0.5L minimum)
- Reserve food
- Waterproof jacket
- Suitable backpack

**⚠️ IMPORTANT:** Mark all nutrition packaging with bib number. Empty packaging must be carried to finish or deposited at aid stations.

---

## 🎫 Check-In and Bib Collection

### **Vila Nova de Poiares Cultural Center**

**Friday, 21/02/2026:**
- 19:00 to 20:30

**Saturday, 22/02/2026:**
- 07:30 to 09:30

**Required Documents:**
- ID Card / Passport
- Parent/Guardian Authorization (under 18 years)

---

## 🚨 Time Barrier

### **PT35K Maxivisão / 35K Relay:**
**Soutelo Road Aid Station (27 km):**
- Cutoff time: **15:45** (6h45 race time)
- Athletes over time will be removed from race and transported to finish

---

## 🌍 Environmental Sustainability

Poiares Trail 2026 runs in **semi-self-sufficiency regime**:
- ♻️ No disposable bottles distributed
- 💧 Container refilling at aid stations
- 🗑️ Athletes must carry empty packaging to finish
- 🎁 **Draw of 3 free 2027 registrations** among correctly marked packaging

---

## 🚗 How to Get There

**Vila Nova de Poiares** is located approximately **25 km from Coimbra**.

### **Main Access Routes:**
- **N17** - Estrada da Beira
- **IP3** - Coimbra-Viseu expressway

**GPS Coordinates:**
- Arena/Finish: 40.213056, -8.258423
- PT35K Start: 40.212147, -8.232183

---

## 📞 Contacts

**Email:** poiarestrail@gmail.com
**Website:** www.poiarestrail.pt
**Registration:** www.stopandgo.com.pt

**Organization:**
ARSM – Associação Recreativa de São Miguel
In partnership with Municipality of Vila Nova de Poiares

---

🏃 **Come run through the mountains of Vila Nova de Poiares! An authentic trail running experience in the heart of Portugal!** 🌲`,
      city: "Vila Nova de Poiares",
      region: "Coimbra",
      metaTitle: "Poiares Trail 2026 | Vila Nova de Poiares | 22 February 2026",
      metaDescription:
        "Poiares Trail 2026 on February 22 in Vila Nova de Poiares. Races: PT35K Maxivisão, PT22K Decathlon, PT13K Fresbeira, 35K Relay and 13K Walk. Registration open!",
    },
    es: {
      title: "Poiares Trail 2026",
      description: `**🌲 Poiares Trail 2026 - Trail Running en el Corazón de Portugal**

El **Poiares Trail 2026** regresa el **22 de febrero** a **Vila Nova de Poiares**, en el corazón del centro de Portugal. Organizado por la **ARSM – Associação Recreativa de São Miguel**, en colaboración con el Municipio de Vila Nova de Poiares, este evento ofrece una experiencia única de trail running por las montañas y senderos de la región.

![Poiares Trail - Montañas de Vila Nova de Poiares](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop)

---

## 🏔️ Pruebas Disponibles

### **PT35K Maxivisão** - Trail Largo
- **Distancia:** 35 km
- **Desnivel:** 1700D+ / 1700D-
- **Tiempo Máximo:** 8 horas
- **Dificultad:** Nivel 2 (difícil)
- **Edad Mínima:** 20 años
- Recorrido técnico por las montañas de Bidoeiro, Carvalho y Vilar

### **PT22K Decathlon** - Trail Corto
- **Distancia:** 22 km
- **Desnivel:** 1100D+ / 1100D-
- **Tiempo Máximo:** 6 horas
- **Dificultad:** Nivel 2 (difícil)
- **Edad Mínima:** 18 años (Sub20)

### **PT13K Fresbeira** - Mini Trail
- **Distancia:** 13 km
- **Desnivel:** 400D+ / 400D-
- **Tiempo Máximo:** 4 horas
- **Dificultad:** Nivel 1 (medio)
- **Edad Mínima:** 16 años

### **Relevos 35K Ansell Portugal**
- **Distancia Total:** 35 km (3 atletas)
- **Formato:** Equipos de 3 miembros
- **Tramos:** 12km + 10km + 13km (aproximado)
- **Zonas de Transición:** Venda Nova y Louredo Natura Parque

### **Caminata 13K Farmácia Santo André**
- **Distancia:** 13 km
- **Carácter:** No competitivo
- **Edad Mínima:** 16 años

![Trail por el bosque portugués](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Aspectos Destacados del Evento

✅ **3 puestos de avituallamiento** con líquidos y sólidos (PT35K/Relevos)
✅ **Sistema de rellenado de recipientes** (régimen de semi-autosuficiencia)
✅ **Seguro de responsabilidad civil y accidentes personales**
✅ **Transporte a la salida** (PT35K y Relevos)
✅ **Comida caliente** en la meta
✅ **Premio finisher** para todos los clasificados
✅ **Ducha** disponible en la arena de la prueba
✅ **Cronometraje electrónico** por chip

![Arena de la prueba - Mercado Municipal](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Ubicaciones de Salida y Meta

### **Salidas:**
- **PT35K Maxivisão / Relevos 35K:** Pabellón ARSM, São Miguel de Poiares *(transporte incluido)*
- **PT22K Decathlon / PT13K Fresbeira:** Mercado Municipal de Vila Nova de Poiares

### **Meta (todas las pruebas):**
Arena de la Prueba - **Mercado Municipal de Vila Nova de Poiares**

---

## ⏱️ Horarios (22 Febrero 2026)

- **07:30** - Apertura de secretaría
- **07:45** - Inicio del transporte a PT35K/Relevos
- **09:00** - **SALIDA PT35K Maxivisão y Relevos 35K**
- **09:30** - **SALIDA PT22K Decathlon**
- **10:00** - **SALIDA PT13K Fresbeira y Caminata 13K**
- **12:30** - Inicio del almuerzo
- **14:00-15:00** - Entrega de premios

---

## 🏆 Premiaciones

### **Trofeos:**
- 3 primeros clasificados (M/F) en la general del PT35K y PT22K
- Todas las categorías de edad premiadas
- 3 primeros equipos (M/F/Mixtos) - PT35K y PT22K
- Podio ampliado hasta el 6º lugar (M/F) - PT13K

### **Incluido en la Inscripción:**
- Dorsal con chip de cronometraje
- Toalla de baño (regalo de la prueba)
- Premio finisher
- Seguro de accidentes personales
- Comida caliente

![Trofeos y premios](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Precios (EVENTO POSPUESTO)

**⚠️ AVISO IMPORTANTE:**
El evento originalmente programado para el 7 de febrero ha sido **pospuesto al 22 de febrero de 2026** debido a condiciones meteorológicas adversas y situación de calamidad en el municipio.

### **Fases de Inscripción:**
**Fase 1 (hasta 31/12/2025):**
- PT35K Maxivisão: €23,00 (ADAC: €21,50)
- PT22K Decathlon: €18,00
- PT13K Fresbeira: €13,00
- Relevos 35K: €39,00/equipo

**Fase 2 (01 a 25/01/2026):**
- PT35K Maxivisão: €26,00 (ADAC: €24,50)
- PT22K Decathlon: €21,00
- PT13K Fresbeira: €16,00
- Relevos 35K: €48,00/equipo

**Grupos:** 10ª inscripción gratuita (con contacto previo)

---

## 📋 Material Obligatorio

### **PT35K Maxivisão / Relevos 35K:**
✅ Dorsal visible
✅ Manta térmica
✅ Silbato
✅ Teléfono móvil operativo con batería

### **PT22K Decathlon:**
✅ Dorsal visible
✅ Manta térmica
✅ Silbato
✅ Teléfono móvil operativo

### **PT13K Fresbeira:**
✅ Dorsal visible

### **Material Recomendado (todas las pruebas):**
- Depósito de agua (0,5L mínimo)
- Alimentación de reserva
- Chaqueta impermeable
- Mochila adecuada

**⚠️ IMPORTANTE:** Marcar todos los envases de nutrición con el número de dorsal. Los envases vacíos deben llevarse a la meta o depositarse en los puestos de avituallamiento.

---

## 🎫 Check-In y Recogida de Dorsales

### **Centro Cultural de Vila Nova de Poiares**

**Viernes, 21/02/2026:**
- 19:00 a 20:30

**Sábado, 22/02/2026:**
- 07:30 a 09:30

**Documentos Necesarios:**
- DNI / Pasaporte
- Autorización del Tutor Legal (menores de 18 años)

---

## 🚨 Barrera Horaria

### **PT35K Maxivisão / Relevos 35K:**
**Puesto de Avituallamiento Carretera a Soutelo (27 km):**
- Hora límite de llegada: **15:45** (6h45 de prueba)
- Atletas fuera de tiempo serán retirados de la prueba y transportados a la meta

---

## 🌍 Sostenibilidad Ambiental

El Poiares Trail 2026 se desarrolla en **régimen de semi-autosuficiencia**:
- ♻️ No se distribuyen botellas desechables
- 💧 Rellenado de recipientes en los puestos de avituallamiento
- 🗑️ Los atletas deben llevar los envases vacíos a la meta
- 🎁 **Sorteo de 3 inscripciones gratuitas 2027** entre envases marcados correctamente

---

## 🚗 Cómo Llegar

**Vila Nova de Poiares** está ubicada a aproximadamente **25 km de Coimbra**.

### **Principales Accesos:**
- **N17** - Estrada da Beira
- **IP3** - Autovía Coimbra-Viseu

**Coordenadas GPS:**
- Arena/Meta: 40.213056, -8.258423
- Salida PT35K: 40.212147, -8.232183

---

## 📞 Contactos

**Email:** poiarestrail@gmail.com
**Sitio Web:** www.poiarestrail.pt
**Inscripciones:** www.stopandgo.com.pt

**Organización:**
ARSM – Associação Recreativa de São Miguel
En colaboración con el Municipio de Vila Nova de Poiares

---

🏃 **¡Ven a correr por las montañas de Vila Nova de Poiares! ¡Una experiencia auténtica de trail running en el corazón de Portugal!** 🌲`,
      city: "Vila Nova de Poiares",
      region: "Coimbra",
      metaTitle: "Poiares Trail 2026 | Vila Nova de Poiares | 22 Febrero 2026",
      metaDescription:
        "Poiares Trail 2026 el 22 de febrero en Vila Nova de Poiares. Pruebas: PT35K Maxivisão, PT22K Decathlon, PT13K Fresbeira, Relevos 35K y Caminata 13K. ¡Inscripciones abiertas!",
    },
    fr: {
      title: "Poiares Trail 2026",
      description: `**🌲 Poiares Trail 2026 - Trail Running au Cœur du Portugal**

Le **Poiares Trail 2026** revient le **22 février** à **Vila Nova de Poiares**, au cœur du centre du Portugal. Organisé par l'**ARSM – Associação Recreativa de São Miguel**, en partenariat avec la Municipalité de Vila Nova de Poiares, cet événement offre une expérience unique de trail running à travers les montagnes et sentiers de la région.

![Poiares Trail - Montagnes de Vila Nova de Poiares](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop)

---

## 🏔️ Courses Disponibles

### **PT35K Maxivisão** - Trail Long
- **distanceKm:** 35 km
- **Dénivelé:** 1700D+ / 1700D-
- **Temps Maximum:** 8 heures
- **Difficulté:** Niveau 2 (difficile)
- **Âge Minimum:** 20 ans
- Parcours technique à travers les montagnes de Bidoeiro, Carvalho et Vilar

### **PT22K Decathlon** - Trail Court
- **distanceKm:** 22 km
- **Dénivelé:** 1100D+ / 1100D-
- **Temps Maximum:** 6 heures
- **Difficulté:** Niveau 2 (difficile)
- **Âge Minimum:** 18 ans (U20)

### **PT13K Fresbeira** - Mini Trail
- **distanceKm:** 13 km
- **Dénivelé:** 400D+ / 400D-
- **Temps Maximum:** 4 heures
- **Difficulté:** Niveau 1 (moyen)
- **Âge Minimum:** 16 ans

### **Relais 35K Ansell Portugal**
- **Distance Totale:** 35 km (3 athlètes)
- **Format:** Équipes de 3 membres
- **Étapes:** 12km + 10km + 13km (approximatif)
- **Zones de Transition:** Venda Nova et Louredo Natura Parque

### **Randonnée 13K Farmácia Santo André**
- **distanceKm:** 13 km
- **Caractère:** Non compétitif
- **Âge Minimum:** 16 ans

![Trail à travers la forêt portugaise](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Points Forts de l'Événement

✅ **3 postes de ravitaillement** avec liquides et solides (PT35K/Relais)
✅ **Système de remplissage de contenants** (régime de semi-autosuffisance)
✅ **Assurance responsabilité civile et accidents corporels**
✅ **Transport au départ** (PT35K et Relais)
✅ **Repas chaud** à l'arrivée
✅ **Prix finisher** pour tous les classés
✅ **Douche** disponible à l'arène de course
✅ **Chronométrage électronique** par puce

![Arène de course - Marché Municipal](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Lieux de Départ et d'Arrivée

### **Départs:**
- **PT35K Maxivisão / Relais 35K:** Pavillon ARSM, São Miguel de Poiares *(transport inclus)*
- **PT22K Decathlon / PT13K Fresbeira:** Marché Municipal de Vila Nova de Poiares

### **Arrivée (toutes les courses):**
Arène de Course - **Marché Municipal de Vila Nova de Poiares**

---

## ⏱️ Horaires (22 Février 2026)

- **07:30** - Ouverture du secrétariat
- **07:45** - Début du transport vers PT35K/Relais
- **09:00** - **DÉPART PT35K Maxivisão et Relais 35K**
- **09:30** - **DÉPART PT22K Decathlon**
- **10:00** - **DÉPART PT13K Fresbeira et Randonnée 13K**
- **12:30** - Début du déjeuner
- **14:00-15:00** - Remise des prix

---

## 🏆 Récompenses

### **Trophées:**
- 3 premiers classés (H/F) au général du PT35K et PT22K
- Toutes les catégories d'âge récompensées
- 3 premières équipes (H/F/Mixtes) - PT35K et PT22K
- Podium élargi jusqu'à la 6ème place (H/F) - PT13K

### **Inclus dans l'Inscription:**
- Dossard avec puce de chronométrage
- Serviette de bain (cadeau de la course)
- Prix finisher
- Assurance accidents corporels
- Repas chaud

![Trophées et prix](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Prix (ÉVÉNEMENT REPORTÉ)

**⚠️ AVIS IMPORTANT:**
L'événement initialement prévu pour le 7 février a été **reporté au 22 février 2026** en raison de conditions météorologiques défavorables et d'une situation de calamité dans la municipalité.

### **Phases d'Inscription:**
**Phase 1 (jusqu'au 31/12/2025):**
- PT35K Maxivisão: €23,00 (ADAC: €21,50)
- PT22K Decathlon: €18,00
- PT13K Fresbeira: €13,00
- Relais 35K: €39,00/équipe

**Phase 2 (du 01 au 25/01/2026):**
- PT35K Maxivisão: €26,00 (ADAC: €24,50)
- PT22K Decathlon: €21,00
- PT13K Fresbeira: €16,00
- Relais 35K: €48,00/équipe

**Groupes:** 10ème inscription gratuite (avec contact préalable)

---

## 📋 Matériel Obligatoire

### **PT35K Maxivisão / Relais 35K:**
✅ Dossard visible
✅ Couverture thermique
✅ Sifflet
✅ Téléphone portable opérationnel avec batterie

### **PT22K Decathlon:**
✅ Dossard visible
✅ Couverture thermique
✅ Sifflet
✅ Téléphone portable opérationnel

### **PT13K Fresbeira:**
✅ Dossard visible

### **Matériel Recommandé (toutes les courses):**
- Réservoir d'eau (0,5L minimum)
- Alimentation de réserve
- Veste imperméable
- Sac à dos adapté

**⚠️ IMPORTANT:** Marquer tous les emballages de nutrition avec le numéro de dossard. Les emballages vides doivent être transportés jusqu'à l'arrivée ou déposés aux postes de ravitaillement.

---

## 🎫 Check-In et Retrait des Dossards

### **Centre Culturel de Vila Nova de Poiares**

**Vendredi, 21/02/2026:**
- 19:00 à 20:30

**Samedi, 22/02/2026:**
- 07:30 à 09:30

**Documents Nécessaires:**
- Carte d'Identité / Passeport
- Autorisation du Tuteur Légal (moins de 18 ans)

---

## 🚨 Barrière Horaire

### **PT35K Maxivisão / Relais 35K:**
**Poste de Ravitaillement Route de Soutelo (27 km):**
- Heure limite d'arrivée: **15:45** (6h45 de course)
- Les athlètes hors temps seront retirés de la course et transportés à l'arrivée

---

## 🌍 Durabilité Environnementale

Le Poiares Trail 2026 se déroule en **régime de semi-autosuffisance**:
- ♻️ Pas de bouteilles jetables distribuées
- 💧 Remplissage de contenants aux postes de ravitaillement
- 🗑️ Les athlètes doivent transporter les emballages vides jusqu'à l'arrivée
- 🎁 **Tirage au sort de 3 inscriptions gratuites 2027** parmi les emballages correctement marqués

---

## 🚗 Comment s'y Rendre

**Vila Nova de Poiares** est située à environ **25 km de Coimbra**.

### **Principaux Accès:**
- **N17** - Estrada da Beira
- **IP3** - Voie rapide Coimbra-Viseu

**Coordonnées GPS:**
- Arène/Arrivée: 40.213056, -8.258423
- Départ PT35K: 40.212147, -8.232183

---

## 📞 Contacts

**Email:** poiarestrail@gmail.com
**Site Web:** www.poiarestrail.pt
**Inscriptions:** www.stopandgo.com.pt

**Organisation:**
ARSM – Associação Recreativa de São Miguel
En partenariat avec la Municipalité de Vila Nova de Poiares

---

🏃 **Venez courir à travers les montagnes de Vila Nova de Poiares! Une expérience authentique de trail running au cœur du Portugal!** 🌲`,
      city: "Vila Nova de Poiares",
      region: "Coimbra",
      metaTitle: "Poiares Trail 2026 | Vila Nova de Poiares | 22 Février 2026",
      metaDescription:
        "Poiares Trail 2026 le 22 février à Vila Nova de Poiares. Courses: PT35K Maxivisão, PT22K Decathlon, PT13K Fresbeira, Relais 35K et Randonnée 13K. Inscriptions ouvertes!",
    },
    de: {
      title: "Poiares Trail 2026",
      description: `**🌲 Poiares Trail 2026 - Trail Running im Herzen Portugals**

Der **Poiares Trail 2026** kehrt am **22. Februar** nach **Vila Nova de Poiares** zurück, im Herzen Zentralportugals. Organisiert von der **ARSM – Associação Recreativa de São Miguel** in Zusammenarbeit mit der Gemeinde Vila Nova de Poiares bietet diese Veranstaltung ein einzigartiges Trail-Running-Erlebnis durch die Berge und Wege der Region.

![Poiares Trail - Berge von Vila Nova de Poiares](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop)

---

## 🏔️ Verfügbare Rennen

### **PT35K Maxivisão** - Langer Trail
- **Distanz:** 35 km
- **Höhenunterschied:** 1700Hm+ / 1700Hm-
- **Zeitlimit:** 8 Stunden
- **Schwierigkeit:** Stufe 2 (schwierig)
- **Mindestalter:** 20 Jahre
- Technische Strecke durch die Berge Bidoeiro, Carvalho und Vilar

### **PT22K Decathlon** - Kurzer Trail
- **Distanz:** 22 km
- **Höhenunterschied:** 1100Hm+ / 1100Hm-
- **Zeitlimit:** 6 Stunden
- **Schwierigkeit:** Stufe 2 (schwierig)
- **Mindestalter:** 18 Jahre (U20)

### **PT13K Fresbeira** - Mini Trail
- **Distanz:** 13 km
- **Höhenunterschied:** 400Hm+ / 400Hm-
- **Zeitlimit:** 4 Stunden
- **Schwierigkeit:** Stufe 1 (mittel)
- **Mindestalter:** 16 Jahre

### **Staffel 35K Ansell Portugal**
- **Gesamtdistanz:** 35 km (3 Athleten)
- **Format:** Teams von 3 Mitgliedern
- **Etappen:** 12km + 10km + 13km (ungefähr)
- **Übergangszonen:** Venda Nova und Louredo Natura Parque

### **Wanderung 13K Farmácia Santo André**
- **Distanz:** 13 km
- **Charakter:** Nicht wettbewerbsfähig
- **Mindestalter:** 16 Jahre

![Trail durch portugiesischen Wald](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Event-Highlights

✅ **3 Verpflegungsstellen** mit Flüssigkeiten und festen Nahrungsmitteln (PT35K/Staffel)
✅ **Behälter-Nachfüllsystem** (Halbautarkie-Regime)
✅ **Haftpflicht- und Unfallversicherung**
✅ **Transport zum Start** (PT35K und Staffel)
✅ **Warme Mahlzeit** im Ziel
✅ **Finisher-Preis** für alle klassifizierten Läufer
✅ **Dusche** in der Rennarena verfügbar
✅ **Elektronische Zeitmessung** per Chip

![Rennarena - Städtischer Markt](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Start- und Zielorte

### **Starts:**
- **PT35K Maxivisão / Staffel 35K:** ARSM Pavilion, São Miguel de Poiares *(Transport inklusive)*
- **PT22K Decathlon / PT13K Fresbeira:** Städtischer Markt von Vila Nova de Poiares

### **Ziel (alle Rennen):**
Rennarena - **Städtischer Markt von Vila Nova de Poiares**

---

## ⏱️ Zeitplan (22. Februar 2026)

- **07:30** - Eröffnung des Sekretariats
- **07:45** - Beginn des Transports zu PT35K/Staffel
- **09:00** - **START PT35K Maxivisão und Staffel 35K**
- **09:30** - **START PT22K Decathlon**
- **10:00** - **START PT13K Fresbeira und Wanderung 13K**
- **12:30** - Mittagessen beginnt
- **14:00-15:00** - Siegerehrung

---

## 🏆 Auszeichnungen

### **Pokale:**
- Top 3 Gesamtwertung (M/W) in PT35K und PT22K
- Alle Altersklassen ausgezeichnet
- Top 3 Teams (M/W/Gemischt) - PT35K und PT22K
- Erweitertes Podium bis zum 6. Platz (M/W) - PT13K

### **In der Anmeldung enthalten:**
- Startnummer mit Zeitmess-Chip
- Badetuch (Renngeschenk)
- Finisher-Preis
- Unfallversicherung
- Warme Mahlzeit

![Pokale und Preise](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Preise (VERANSTALTUNG VERSCHOBEN)

**⚠️ WICHTIGER HINWEIS:**
Die ursprünglich für den 7. Februar geplante Veranstaltung wurde aufgrund widriger Wetterbedingungen und einer Katastrophensituation in der Gemeinde auf den **22. Februar 2026 verschoben**.

### **Anmeldephasen:**
**Phase 1 (bis 31.12.2025):**
- PT35K Maxivisão: €23,00 (ADAC: €21,50)
- PT22K Decathlon: €18,00
- PT13K Fresbeira: €13,00
- Staffel 35K: €39,00/Team

**Phase 2 (01. bis 25.01.2026):**
- PT35K Maxivisão: €26,00 (ADAC: €24,50)
- PT22K Decathlon: €21,00
- PT13K Fresbeira: €16,00
- Staffel 35K: €48,00/Team

**Gruppen:** 10. Anmeldung kostenlos (mit vorherigem Kontakt)

---

## 📋 Pflichtausrüstung

### **PT35K Maxivisão / Staffel 35K:**
✅ Sichtbare Startnummer
✅ Thermodecke
✅ Pfeife
✅ Betriebsfähiges Mobiltelefon mit Batterie

### **PT22K Decathlon:**
✅ Sichtbare Startnummer
✅ Thermodecke
✅ Pfeife
✅ Betriebsfähiges Mobiltelefon

### **PT13K Fresbeira:**
✅ Sichtbare Startnummer

### **Empfohlene Ausrüstung (alle Rennen):**
- Wasserbehälter (mindestens 0,5L)
- Reserveverpflegung
- Regenjacke
- Geeigneter Rucksack

**⚠️ WICHTIG:** Alle Verpackungen von Nahrungsmitteln mit der Startnummer markieren. Leere Verpackungen müssen bis zum Ziel getragen oder an Verpflegungsstellen deponiert werden.

---

## 🎫 Check-In und Startnummernausgabe

### **Kulturzentrum Vila Nova de Poiares**

**Freitag, 21.02.2026:**
- 19:00 bis 20:30

**Samstag, 22.02.2026:**
- 07:30 bis 09:30

**Erforderliche Dokumente:**
- Personalausweis / Reisepass
- Genehmigung des Erziehungsberechtigten (unter 18 Jahren)

---

## 🚨 Zeitbarriere

### **PT35K Maxivisão / Staffel 35K:**
**Verpflegungsstelle Soutelo-Straße (27 km):**
- Grenzzeit für Ankunft: **15:45** (6h45 Rennzeit)
- Athleten außerhalb der Zeit werden aus dem Rennen genommen und zum Ziel transportiert

---

## 🌍 Umwelt-Nachhaltigkeit

Der Poiares Trail 2026 läuft im **Halbautarkie-Regime**:
- ♻️ Keine Einwegflaschen verteilt
- 💧 Behälter-Nachfüllung an Verpflegungsstellen
- 🗑️ Athleten müssen leere Verpackungen zum Ziel tragen
- 🎁 **Verlosung von 3 kostenlosen Anmeldungen 2027** unter korrekt markierten Verpackungen

---

## 🚗 Anreise

**Vila Nova de Poiares** liegt etwa **25 km von Coimbra** entfernt.

### **Hauptzufahrten:**
- **N17** - Estrada da Beira
- **IP3** - Schnellstraße Coimbra-Viseu

**GPS-Koordinaten:**
- Arena/Ziel: 40.213056, -8.258423
- Start PT35K: 40.212147, -8.232183

---

## 📞 Kontakte

**E-Mail:** poiarestrail@gmail.com
**Website:** www.poiarestrail.pt
**Anmeldung:** www.stopandgo.com.pt

**Organisation:**
ARSM – Associação Recreativa de São Miguel
In Zusammenarbeit mit der Gemeinde Vila Nova de Poiares

---

🏃 **Kommen Sie und laufen Sie durch die Berge von Vila Nova de Poiares! Ein authentisches Trail-Running-Erlebnis im Herzen Portugals!** 🌲`,
      city: "Vila Nova de Poiares",
      region: "Coimbra",
      metaTitle: "Poiares Trail 2026 | Vila Nova de Poiares | 22. Februar 2026",
      metaDescription:
        "Poiares Trail 2026 am 22. Februar in Vila Nova de Poiares. Rennen: PT35K Maxivisão, PT22K Decathlon, PT13K Fresbeira, Staffel 35K und Wanderung 13K. Anmeldung offen!",
    },
    it: {
      title: "Poiares Trail 2026",
      description: `**🌲 Poiares Trail 2026 - Trail Running nel Cuore del Portogallo**

Il **Poiares Trail 2026** torna il **22 febbraio** a **Vila Nova de Poiares**, nel cuore del Portogallo centrale. Organizzato dall'**ARSM – Associação Recreativa de São Miguel**, in collaborazione con il Comune di Vila Nova de Poiares, questo evento offre un'esperienza unica di trail running attraverso le montagne e i sentieri della regione.

![Poiares Trail - Montagne di Vila Nova de Poiares](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop)

---

## 🏔️ Gare Disponibili

### **PT35K Maxivisão** - Trail Lungo
- **Distanza:** 35 km
- **Dislivello:** 1700D+ / 1700D-
- **Tempo Massimo:** 8 ore
- **Difficoltà:** Livello 2 (difficile)
- **Età Minima:** 20 anni
- Percorso tecnico attraverso le montagne di Bidoeiro, Carvalho e Vilar

### **PT22K Decathlon** - Trail Corto
- **Distanza:** 22 km
- **Dislivello:** 1100D+ / 1100D-
- **Tempo Massimo:** 6 ore
- **Difficoltà:** Livello 2 (difficile)
- **Età Minima:** 18 anni (U20)

### **PT13K Fresbeira** - Mini Trail
- **Distanza:** 13 km
- **Dislivello:** 400D+ / 400D-
- **Tempo Massimo:** 4 ore
- **Difficoltà:** Livello 1 (medio)
- **Età Minima:** 16 anni

### **Staffetta 35K Ansell Portugal**
- **Distanza Totale:** 35 km (3 atleti)
- **Formato:** Squadre di 3 membri
- **Tappe:** 12km + 10km + 13km (approssimativo)
- **Zone di Transizione:** Venda Nova e Louredo Natura Parque

### **Camminata 13K Farmácia Santo André**
- **Distanza:** 13 km
- **Carattere:** Non competitivo
- **Età Minima:** 16 anni

![Trail attraverso la foresta portoghese](https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&auto=format&fit=crop)

---

## 🎯 Punti Salienti dell'Evento

✅ **3 punti ristoro** con liquidi e solidi (PT35K/Staffetta)
✅ **Sistema di riempimento contenitori** (regime di semi-autosufficienza)
✅ **Assicurazione responsabilità civile e infortuni personali**
✅ **Trasporto alla partenza** (PT35K e Staffetta)
✅ **Pasto caldo** all'arrivo
✅ **Premio finisher** per tutti i classificati
✅ **Doccia** disponibile nell'arena della gara
✅ **Cronometraggio elettronico** tramite chip

![Arena della gara - Mercato Municipale](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop)

---

## 📍 Luoghi di Partenza e Arrivo

### **Partenze:**
- **PT35K Maxivisão / Staffetta 35K:** Padiglione ARSM, São Miguel de Poiares *(trasporto incluso)*
- **PT22K Decathlon / PT13K Fresbeira:** Mercato Municipale di Vila Nova de Poiares

### **Arrivo (tutte le gare):**
Arena della Gara - **Mercato Municipale di Vila Nova de Poiares**

---

## ⏱️ Orari (22 Febbraio 2026)

- **07:30** - Apertura segreteria
- **07:45** - Inizio trasporto a PT35K/Staffetta
- **09:00** - **PARTENZA PT35K Maxivisão e Staffetta 35K**
- **09:30** - **PARTENZA PT22K Decathlon**
- **10:00** - **PARTENZA PT13K Fresbeira e Camminata 13K**
- **12:30** - Inizio pranzo
- **14:00-15:00** - Premiazioni

---

## 🏆 Premi

### **Trofei:**
- Primi 3 classificati (M/F) nella generale del PT35K e PT22K
- Tutte le categorie di età premiate
- Prime 3 squadre (M/F/Miste) - PT35K e PT22K
- Podio esteso fino al 6° posto (M/F) - PT13K

### **Incluso nell'Iscrizione:**
- Pettorale con chip di cronometraggio
- Asciugamano da bagno (regalo della gara)
- Premio finisher
- Assicurazione infortuni personali
- Pasto caldo

![Trofei e premi](https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop)

---

## 💰 Prezzi (EVENTO RINVIATO)

**⚠️ AVVISO IMPORTANTE:**
L'evento originariamente previsto per il 7 febbraio è stato **rinviato al 22 febbraio 2026** a causa di condizioni meteorologiche avverse e situazione di calamità nel comune.

### **Fasi di Iscrizione:**
**Fase 1 (fino al 31/12/2025):**
- PT35K Maxivisão: €23,00 (ADAC: €21,50)
- PT22K Decathlon: €18,00
- PT13K Fresbeira: €13,00
- Staffetta 35K: €39,00/squadra

**Fase 2 (dal 01 al 25/01/2026):**
- PT35K Maxivisão: €26,00 (ADAC: €24,50)
- PT22K Decathlon: €21,00
- PT13K Fresbeira: €16,00
- Staffetta 35K: €48,00/squadra

**Gruppi:** 10ª iscrizione gratuita (con contatto preventivo)

---

## 📋 Materiale Obbligatorio

### **PT35K Maxivisão / Staffetta 35K:**
✅ Pettorale visibile
✅ Coperta termica
✅ Fischietto
✅ Telefono cellulare operativo con batteria

### **PT22K Decathlon:**
✅ Pettorale visibile
✅ Coperta termica
✅ Fischietto
✅ Telefono cellulare operativo

### **PT13K Fresbeira:**
✅ Pettorale visibile

### **Materiale Raccomandato (tutte le gare):**
- Serbatoio d'acqua (0,5L minimo)
- Alimentazione di riserva
- Giacca impermeabile
- Zaino adeguato

**⚠️ IMPORTANTE:** Marcare tutti gli imballaggi di nutrizione con il numero di pettorale. Gli imballaggi vuoti devono essere trasportati fino al traguardo o depositati ai punti ristoro.

---

## 🎫 Check-In e Ritiro Pettorali

### **Centro Culturale di Vila Nova de Poiares**

**Venerdì, 21/02/2026:**
- 19:00 alle 20:30

**Sabato, 22/02/2026:**
- 07:30 alle 09:30

**Documenti Necessari:**
- Carta d'Identità / Passaporto
- Autorizzazione del Tutore Legale (minori di 18 anni)

---

## 🚨 Barriera Oraria

### **PT35K Maxivisão / Staffetta 35K:**
**Punto Ristoro Strada per Soutelo (27 km):**
- Ora limite di arrivo: **15:45** (6h45 di gara)
- Gli atleti fuori tempo saranno ritirati dalla gara e trasportati al traguardo

---

## 🌍 Sostenibilità Ambientale

Il Poiares Trail 2026 si svolge in **regime di semi-autosufficienza**:
- ♻️ Nessuna bottiglia usa e getta distribuita
- 💧 Riempimento contenitori ai punti ristoro
- 🗑️ Gli atleti devono trasportare gli imballaggi vuoti al traguardo
- 🎁 **Sorteggio di 3 iscrizioni gratuite 2027** tra gli imballaggi correttamente marcati

---

## 🚗 Come Arrivare

**Vila Nova de Poiares** si trova a circa **25 km da Coimbra**.

### **Principali Accessi:**
- **N17** - Estrada da Beira
- **IP3** - Superstrada Coimbra-Viseu

**Coordinate GPS:**
- Arena/Arrivo: 40.213056, -8.258423
- Partenza PT35K: 40.212147, -8.232183

---

## 📞 Contatti

**Email:** poiarestrail@gmail.com
**Sito Web:** www.poiarestrail.pt
**Iscrizioni:** www.stopandgo.com.pt

**Organizzazione:**
ARSM – Associação Recreativa de São Miguel
In collaborazione con il Comune di Vila Nova de Poiares

---

🏃 **Vieni a correre tra le montagne di Vila Nova de Poiares! Un'esperienza autentica di trail running nel cuore del Portogallo!** 🌲`,
      city: "Vila Nova de Poiares",
      region: "Coimbra",
      metaTitle: "Poiares Trail 2026 | Vila Nova de Poiares | 22 Febbraio 2026",
      metaDescription:
        "Poiares Trail 2026 il 22 febbraio a Vila Nova de Poiares. Gare: PT35K Maxivisão, PT22K Decathlon, PT13K Fresbeira, Staffetta 35K e Camminata 13K. Iscrizioni aperte!",
    },
  };

  // FAQ data for ALL 6 languages
  const faqs = {
    pt: [
      {
        question: "O evento foi adiado?",
        answer:
          "Sim, o Poiares Trail 2026 foi adiado de 7 de fevereiro para 22 de fevereiro de 2026 devido a condições meteorológicas adversas e situação de calamidade no concelho de Vila Nova de Poiares.",
      },
      {
        question: "Qual é a idade mínima para participar?",
        answer:
          "A idade mínima varia por prova: PT35K Maxivisão requer 20 anos, PT22K Decathlon permite Sub20 (18-19 anos), e PT13K Fresbeira/Estafetas 35K permitem participantes a partir dos 16 anos. Menores de 18 anos necessitam de autorização dos pais.",
      },
      {
        question: "Qual é o material obrigatório?",
        answer:
          "Para o PT35K e Estafetas 35K: dorsal visível, manta térmica, apito e telemóvel operacional. Para o PT22K: dorsal, manta térmica, apito e telemóvel. Para o PT13K: apenas dorsal visível. Material recomendado inclui depósito de água (0,5L mínimo) e alimentação de reserva.",
      },
      {
        question: "Os postos de abastecimento fornecem água em garrafas?",
        answer:
          "Não. Por motivos ambientais, a prova decorre em regime de semi-autossuficiência com enchimento de recipientes. Não serão distribuídas garrafas de água ou copos descartáveis.",
      },
      {
        question: "O que está incluído na inscrição?",
        answer:
          "A inscrição inclui: dorsal com chip de cronometragem, seguro de responsabilidade civil e acidentes pessoais, abastecimentos durante a prova, transfere para a partida (PT35K/Estafetas), toalha de banho, prémio finisher, banho e refeição quente no final.",
      },
      {
        question: "Existem descontos para grupos?",
        answer:
          "Sim! Para grupos/equipas, a cada dez inscrições, a organização oferece a décima gratuitamente. Esta situação deve ser reportada à organização via email.",
      },
      {
        question: "Posso cancelar a minha inscrição?",
        answer:
          "Sim, mas apenas em caso de acidente ou doença diagnosticada após o registo, mediante apresentação de atestado médico. Reembolso: 50% até 31/12/2025, 25% até 01/02/2026, sem reembolso após 02/02/2026.",
      },
      {
        question: "Onde é o check-in e levantamento de dorsais?",
        answer:
          "No Centro Cultural de Vila Nova de Poiares. Sexta-feira (21/02) das 19h00 às 20h30 e Sábado (22/02) das 07h30 às 09h30. É obrigatório apresentar BI/CC/Passaporte.",
      },
      {
        question: "Existe barreira horária?",
        answer:
          "Sim, para o PT35K e Estafetas 35K há uma barreira horária no abastecimento da Estrada para o Soutelo (27km): hora limite de chegada às 15h45 (6h45 de prova). Atletas fora do tempo serão retirados de prova.",
      },
      {
        question: "Como funcionam as Estafetas 35K?",
        answer:
          "A estafeta é realizada por equipas de 3 elementos no percurso dos 35K. Cada atleta percorre entre 12-15km. Há um dorsal único (porta-dorsais) transmitido nas zonas de transição (Venda Nova e Louredo Natura Parque). Transporte incluído para os locais de transição.",
      },
      {
        question: "Há prémios?",
        answer:
          "Sim! Troféus para os 3 primeiros classificados (M/F) da geral e de todos os escalões etários no PT35K e PT22K. Troféus para as 3 primeiras equipas (M/F/Mistas). Pódio alargado até ao 6º lugar no PT13K. Todos os finishers recebem prémio de participação.",
      },
      {
        question:
          "O que acontece se eu não conseguir transportar as embalagens vazias de nutrição?",
        answer:
          "É obrigatório marcar todas as embalagens com o número de dorsal e transportá-las até à meta ou depositá-las nos postos de abastecimento. No final, serão sorteadas 3 embalagens que darão inscrição gratuita para o Poiares Trail 2027!",
      },
    ],
    en: [
      {
        question: "Has the event been postponed?",
        answer:
          "Yes, Poiares Trail 2026 has been postponed from February 7 to February 22, 2026 due to adverse weather conditions and calamity situation in the municipality of Vila Nova de Poiares.",
      },
      {
        question: "What is the minimum age to participate?",
        answer:
          "Minimum age varies by race: PT35K Maxivisão requires 20 years, PT22K Decathlon allows U20 (18-19 years), and PT13K Fresbeira/35K Relay allow participants from 16 years. Under 18 requires parental authorization.",
      },
      {
        question: "What is the mandatory equipment?",
        answer:
          "For PT35K and 35K Relay: visible bib, thermal blanket, whistle, and operational mobile phone. For PT22K: bib, thermal blanket, whistle, and phone. For PT13K: only visible bib. Recommended equipment includes water reservoir (0.5L minimum) and reserve food.",
      },
      {
        question: "Do aid stations provide bottled water?",
        answer:
          "No. For environmental reasons, the race operates in semi-self-sufficiency regime with container refilling. No disposable bottles or cups will be distributed.",
      },
      {
        question: "What is included in registration?",
        answer:
          "Registration includes: bib with timing chip, civil liability and personal accident insurance, aid during race, transport to start (PT35K/Relay), bath towel, finisher prize, shower, and hot meal at finish.",
      },
      {
        question: "Are there group discounts?",
        answer:
          "Yes! For groups/teams, for every ten registrations, the organization offers the tenth free. This must be reported to the organization via email.",
      },
      {
        question: "Can I cancel my registration?",
        answer:
          "Yes, but only in case of accident or illness diagnosed after registration, upon presentation of medical certificate. Refund: 50% until 31/12/2025, 25% until 01/02/2026, no refund after 02/02/2026.",
      },
      {
        question: "Where is check-in and bib collection?",
        answer:
          "At Vila Nova de Poiares Cultural Center. Friday (21/02) from 19:00 to 20:30 and Saturday (22/02) from 07:30 to 09:30. ID Card/Passport required.",
      },
      {
        question: "Is there a time barrier?",
        answer:
          "Yes, for PT35K and 35K Relay there is a time barrier at Soutelo Road aid station (27km): cutoff time at 15:45 (6h45 race time). Athletes over time will be removed from race.",
      },
      {
        question: "How do the 35K Relays work?",
        answer:
          "The relay is done by teams of 3 members on the 35K course. Each athlete covers 12-15km. There is a single bib (bib holder) transmitted at transition zones (Venda Nova and Louredo Natura Park). Transport included to transition locations.",
      },
      {
        question: "Are there prizes?",
        answer:
          "Yes! Trophies for top 3 overall (M/F) and all age categories in PT35K and PT22K. Trophies for top 3 teams (M/F/Mixed). Extended podium up to 6th place in PT13K. All finishers receive participation prize.",
      },
      {
        question: "What happens if I cannot carry empty nutrition packaging?",
        answer:
          "It is mandatory to mark all packaging with bib number and carry them to finish or deposit at aid stations. At the end, 3 packaging will be drawn for a free Poiares Trail 2027 registration!",
      },
    ],
    es: [
      {
        question: "¿El evento ha sido pospuesto?",
        answer:
          "Sí, el Poiares Trail 2026 ha sido pospuesto del 7 de febrero al 22 de febrero de 2026 debido a condiciones meteorológicas adversas y situación de calamidad en el municipio de Vila Nova de Poiares.",
      },
      {
        question: "¿Cuál es la edad mínima para participar?",
        answer:
          "La edad mínima varía por prueba: PT35K Maxivisão requiere 20 años, PT22K Decathlon permite Sub20 (18-19 años), y PT13K Fresbeira/Relevos 35K permiten participantes desde 16 años. Menores de 18 requieren autorización parental.",
      },
      {
        question: "¿Cuál es el material obligatorio?",
        answer:
          "Para PT35K y Relevos 35K: dorsal visible, manta térmica, silbato y teléfono móvil operativo. Para PT22K: dorsal, manta térmica, silbato y teléfono. Para PT13K: solo dorsal visible. Material recomendado incluye depósito de agua (0,5L mínimo) y alimentación de reserva.",
      },
      {
        question:
          "¿Los puestos de avituallamiento proporcionan agua embotellada?",
        answer:
          "No. Por motivos ambientales, la prueba se desarrolla en régimen de semi-autosuficiencia con rellenado de recipientes. No se distribuirán botellas desechables ni vasos.",
      },
      {
        question: "¿Qué incluye la inscripción?",
        answer:
          "La inscripción incluye: dorsal con chip de cronometraje, seguro de responsabilidad civil y accidentes personales, avituallamiento durante la prueba, transporte a la salida (PT35K/Relevos), toalla de baño, premio finisher, ducha y comida caliente en la meta.",
      },
      {
        question: "¿Hay descuentos para grupos?",
        answer:
          "¡Sí! Para grupos/equipos, cada diez inscripciones, la organización ofrece la décima gratis. Esto debe informarse a la organización por email.",
      },
      {
        question: "¿Puedo cancelar mi inscripción?",
        answer:
          "Sí, pero solo en caso de accidente o enfermedad diagnosticada después del registro, con presentación de certificado médico. Reembolso: 50% hasta 31/12/2025, 25% hasta 01/02/2026, sin reembolso después del 02/02/2026.",
      },
      {
        question: "¿Dónde es el check-in y recogida de dorsales?",
        answer:
          "En el Centro Cultural de Vila Nova de Poiares. Viernes (21/02) de 19:00 a 20:30 y Sábado (22/02) de 07:30 a 09:30. Se requiere DNI/Pasaporte.",
      },
      {
        question: "¿Hay barrera horaria?",
        answer:
          "Sí, para PT35K y Relevos 35K hay barrera horaria en el puesto de avituallamiento de Carretera a Soutelo (27km): hora límite 15:45 (6h45 de prueba). Atletas fuera de tiempo serán retirados de la prueba.",
      },
      {
        question: "¿Cómo funcionan los Relevos 35K?",
        answer:
          "El relevo se realiza por equipos de 3 miembros en el recorrido de 35K. Cada atleta cubre 12-15km. Hay un dorsal único (portadorsales) transmitido en zonas de transición (Venda Nova y Louredo Natura Parque). Transporte incluido a ubicaciones de transición.",
      },
      {
        question: "¿Hay premios?",
        answer:
          "¡Sí! Trofeos para los 3 primeros clasificados (M/F) de la general y todas las categorías de edad en PT35K y PT22K. Trofeos para los 3 primeros equipos (M/F/Mixtos). Podio ampliado hasta el 6º lugar en PT13K. Todos los finishers reciben premio de participación.",
      },
      {
        question:
          "¿Qué pasa si no puedo llevar los envases vacíos de nutrición?",
        answer:
          "Es obligatorio marcar todos los envases con el número de dorsal y llevarlos a la meta o depositarlos en los puestos de avituallamiento. ¡Al final se sortearán 3 envases para una inscripción gratuita al Poiares Trail 2027!",
      },
    ],
    fr: [
      {
        question: "L'événement a-t-il été reporté ?",
        answer:
          "Oui, le Poiares Trail 2026 a été reporté du 7 février au 22 février 2026 en raison de conditions météorologiques défavorables et d'une situation de calamité dans la municipalité de Vila Nova de Poiares.",
      },
      {
        question: "Quel est l'âge minimum pour participer ?",
        answer:
          "L'âge minimum varie selon la course : PT35K Maxivisão nécessite 20 ans, PT22K Decathlon permet U20 (18-19 ans), et PT13K Fresbeira/Relais 35K permettent les participants dès 16 ans. Moins de 18 ans nécessite autorisation parentale.",
      },
      {
        question: "Quel est le matériel obligatoire ?",
        answer:
          "Pour PT35K et Relais 35K : dossard visible, couverture thermique, sifflet et téléphone portable opérationnel. Pour PT22K : dossard, couverture thermique, sifflet et téléphone. Pour PT13K : seulement dossard visible. Matériel recommandé inclut réservoir d'eau (0,5L minimum) et alimentation de réserve.",
      },
      {
        question:
          "Les postes de ravitaillement fournissent-ils de l'eau en bouteille ?",
        answer:
          "Non. Pour des raisons environnementales, la course fonctionne en régime de semi-autosuffisance avec remplissage de contenants. Aucune bouteille jetable ou gobelet ne sera distribué.",
      },
      {
        question: "Qu'est-ce qui est inclus dans l'inscription ?",
        answer:
          "L'inscription comprend : dossard avec puce de chronométrage, assurance responsabilité civile et accidents corporels, ravitaillement pendant la course, transport au départ (PT35K/Relais), serviette de bain, prix finisher, douche et repas chaud à l'arrivée.",
      },
      {
        question: "Y a-t-il des réductions pour les groupes ?",
        answer:
          "Oui ! Pour les groupes/équipes, pour dix inscriptions, l'organisation offre la dixième gratuitement. Cela doit être signalé à l'organisation par email.",
      },
      {
        question: "Puis-je annuler mon inscription ?",
        answer:
          "Oui, mais uniquement en cas d'accident ou de maladie diagnostiquée après l'inscription, sur présentation d'un certificat médical. Remboursement : 50% jusqu'au 31/12/2025, 25% jusqu'au 01/02/2026, aucun remboursement après le 02/02/2026.",
      },
      {
        question: "Où se trouve le check-in et le retrait des dossards ?",
        answer:
          "Au Centre Culturel de Vila Nova de Poiares. Vendredi (21/02) de 19:00 à 20:30 et Samedi (22/02) de 07:30 à 09:30. Carte d'identité/Passeport requis.",
      },
      {
        question: "Y a-t-il une barrière horaire ?",
        answer:
          "Oui, pour PT35K et Relais 35K il y a une barrière horaire au poste de ravitaillement Route de Soutelo (27km) : heure limite 15:45 (6h45 de course). Les athlètes hors temps seront retirés de la course.",
      },
      {
        question: "Comment fonctionnent les Relais 35K ?",
        answer:
          "Le relais est effectué par équipes de 3 membres sur le parcours de 35K. Chaque athlète couvre 12-15km. Il y a un dossard unique (porte-dossard) transmis aux zones de transition (Venda Nova et Louredo Natura Parque). Transport inclus vers les lieux de transition.",
      },
      {
        question: "Y a-t-il des prix ?",
        answer:
          "Oui ! Trophées pour les 3 premiers classés (H/F) au général et toutes les catégories d'âge en PT35K et PT22K. Trophées pour les 3 premières équipes (H/F/Mixtes). Podium élargi jusqu'à la 6ème place en PT13K. Tous les finishers reçoivent un prix de participation.",
      },
      {
        question:
          "Que se passe-t-il si je ne peux pas transporter les emballages vides de nutrition ?",
        answer:
          "Il est obligatoire de marquer tous les emballages avec le numéro de dossard et de les transporter jusqu'à l'arrivée ou de les déposer aux postes de ravitaillement. À la fin, 3 emballages seront tirés au sort pour une inscription gratuite au Poiares Trail 2027 !",
      },
    ],
    de: [
      {
        question: "Wurde die Veranstaltung verschoben?",
        answer:
          "Ja, der Poiares Trail 2026 wurde vom 7. Februar auf den 22. Februar 2026 verschoben aufgrund widriger Wetterbedingungen und einer Katastrophensituation in der Gemeinde Vila Nova de Poiares.",
      },
      {
        question: "Was ist das Mindestalter für die Teilnahme?",
        answer:
          "Das Mindestalter variiert je nach Rennen: PT35K Maxivisão erfordert 20 Jahre, PT22K Decathlon erlaubt U20 (18-19 Jahre), und PT13K Fresbeira/Staffel 35K erlauben Teilnehmer ab 16 Jahren. Unter 18 Jahren ist elterliche Genehmigung erforderlich.",
      },
      {
        question: "Was ist die Pflichtausrüstung?",
        answer:
          "Für PT35K und Staffel 35K: sichtbare Startnummer, Thermodecke, Pfeife und betriebsfähiges Mobiltelefon. Für PT22K: Startnummer, Thermodecke, Pfeife und Telefon. Für PT13K: nur sichtbare Startnummer. Empfohlene Ausrüstung umfasst Wasserbehälter (mindestens 0,5L) und Reserveverpflegung.",
      },
      {
        question: "Bieten Verpflegungsstellen Wasser in Flaschen an?",
        answer:
          "Nein. Aus Umweltgründen läuft das Rennen im Halbautarkie-Regime mit Behälter-Nachfüllung. Es werden keine Einwegflaschen oder Becher verteilt.",
      },
      {
        question: "Was ist in der Anmeldung enthalten?",
        answer:
          "Die Anmeldung umfasst: Startnummer mit Zeitmess-Chip, Haftpflicht- und Unfallversicherung, Verpflegung während des Rennens, Transport zum Start (PT35K/Staffel), Badetuch, Finisher-Preis, Dusche und warme Mahlzeit im Ziel.",
      },
      {
        question: "Gibt es Gruppenrabatte?",
        answer:
          "Ja! Für Gruppen/Teams bietet die Organisation bei zehn Anmeldungen die zehnte kostenlos an. Dies muss der Organisation per E-Mail mitgeteilt werden.",
      },
      {
        question: "Kann ich meine Anmeldung stornieren?",
        answer:
          "Ja, aber nur im Falle eines Unfalls oder einer nach der Anmeldung diagnostizierten Krankheit, bei Vorlage eines ärztlichen Attests. Rückerstattung: 50% bis 31.12.2025, 25% bis 01.02.2026, keine Rückerstattung nach 02.02.2026.",
      },
      {
        question: "Wo ist der Check-in und die Startnummernausgabe?",
        answer:
          "Im Kulturzentrum Vila Nova de Poiares. Freitag (21.02.) von 19:00 bis 20:30 und Samstag (22.02.) von 07:30 bis 09:30. Personalausweis/Reisepass erforderlich.",
      },
      {
        question: "Gibt es eine Zeitbarriere?",
        answer:
          "Ja, für PT35K und Staffel 35K gibt es eine Zeitbarriere an der Verpflegungsstelle Soutelo-Straße (27km): Grenzzeit 15:45 (6h45 Rennzeit). Athleten außerhalb der Zeit werden aus dem Rennen genommen.",
      },
      {
        question: "Wie funktionieren die Staffel 35K?",
        answer:
          "Die Staffel wird von Teams mit 3 Mitgliedern auf der 35K-Strecke durchgeführt. Jeder Athlet legt 12-15km zurück. Es gibt eine einzige Startnummer (Startnummernhalter), die an Übergangszonen (Venda Nova und Louredo Natura Parque) übergeben wird. Transport zu Übergabeorten inklusive.",
      },
      {
        question: "Gibt es Preise?",
        answer:
          "Ja! Pokale für die Top 3 Gesamtwertung (M/W) und alle Altersklassen in PT35K und PT22K. Pokale für die Top 3 Teams (M/W/Gemischt). Erweitertes Podium bis zum 6. Platz in PT13K. Alle Finisher erhalten einen Teilnahmepreis.",
      },
      {
        question:
          "Was passiert, wenn ich leere Verpackungen von Nahrungsmitteln nicht tragen kann?",
        answer:
          "Es ist obligatorisch, alle Verpackungen mit der Startnummer zu markieren und sie zum Ziel zu tragen oder an Verpflegungsstellen zu deponieren. Am Ende werden 3 Verpackungen für eine kostenlose Poiares Trail 2027-Anmeldung verlost!",
      },
    ],
    it: [
      {
        question: "L'evento è stato rinviato?",
        answer:
          "Sì, il Poiares Trail 2026 è stato rinviato dal 7 febbraio al 22 febbraio 2026 a causa di condizioni meteorologiche avverse e situazione di calamità nel comune di Vila Nova de Poiares.",
      },
      {
        question: "Qual è l'età minima per partecipare?",
        answer:
          "L'età minima varia per gara: PT35K Maxivisão richiede 20 anni, PT22K Decathlon permette U20 (18-19 anni), e PT13K Fresbeira/Staffetta 35K permettono partecipanti da 16 anni. Sotto i 18 richiede autorizzazione parentale.",
      },
      {
        question: "Qual è il materiale obbligatorio?",
        answer:
          "Per PT35K e Staffetta 35K: pettorale visibile, coperta termica, fischietto e telefono cellulare operativo. Per PT22K: pettorale, coperta termica, fischietto e telefono. Per PT13K: solo pettorale visibile. Materiale raccomandato include serbatoio d'acqua (0,5L minimo) e alimentazione di riserva.",
      },
      {
        question: "I punti ristoro forniscono acqua in bottiglia?",
        answer:
          "No. Per motivi ambientali, la gara si svolge in regime di semi-autosufficienza con riempimento contenitori. Non saranno distribuite bottiglie usa e getta o bicchieri.",
      },
      {
        question: "Cosa è incluso nell'iscrizione?",
        answer:
          "L'iscrizione include: pettorale con chip di cronometraggio, assicurazione responsabilità civile e infortuni personali, ristoro durante la gara, trasporto alla partenza (PT35K/Staffetta), asciugamano da bagno, premio finisher, doccia e pasto caldo all'arrivo.",
      },
      {
        question: "Ci sono sconti per gruppi?",
        answer:
          "Sì! Per gruppi/squadre, per dieci iscrizioni, l'organizzazione offre la decima gratis. Questo deve essere comunicato all'organizzazione via email.",
      },
      {
        question: "Posso cancellare la mia iscrizione?",
        answer:
          "Sì, ma solo in caso di incidente o malattia diagnosticata dopo la registrazione, su presentazione di certificato medico. Rimborso: 50% fino al 31/12/2025, 25% fino al 01/02/2026, nessun rimborso dopo il 02/02/2026.",
      },
      {
        question: "Dove si trova il check-in e il ritiro dei pettorali?",
        answer:
          "Al Centro Culturale di Vila Nova de Poiares. Venerdì (21/02) dalle 19:00 alle 20:30 e Sabato (22/02) dalle 07:30 alle 09:30. Carta d'identità/Passaporto richiesto.",
      },
      {
        question: "C'è una barriera oraria?",
        answer:
          "Sì, per PT35K e Staffetta 35K c'è una barriera oraria al punto ristoro Strada per Soutelo (27km): ora limite 15:45 (6h45 di gara). Gli atleti fuori tempo saranno ritirati dalla gara.",
      },
      {
        question: "Come funzionano le Staffette 35K?",
        answer:
          "La staffetta è realizzata da squadre di 3 membri sul percorso di 35K. Ogni atleta copre 12-15km. C'è un pettorale unico (portapettorali) trasmesso nelle zone di transizione (Venda Nova e Louredo Natura Parque). Trasporto incluso per le località di transizione.",
      },
      {
        question: "Ci sono premi?",
        answer:
          "Sì! Trofei per i primi 3 classificati (M/F) nella generale e tutte le categorie di età in PT35K e PT22K. Trofei per le prime 3 squadre (M/F/Miste). Podio esteso fino al 6° posto in PT13K. Tutti i finisher ricevono un premio di partecipazione.",
      },
      {
        question:
          "Cosa succede se non posso trasportare gli imballaggi vuoti di nutrizione?",
        answer:
          "È obbligatorio marcare tutti gli imballaggi con il numero di pettorale e trasportarli al traguardo o depositarli ai punti ristoro. Alla fine saranno sorteggiati 3 imballaggi per un'iscrizione gratuita al Poiares Trail 2027!",
      },
    ],
  };

  // Create the event
  const event = await prisma.event.create({
    data: {
      slug: eventSlug,
      title: "Poiares Trail 2026",
      description:
        "Poiares Trail 2026 - Trail Running no Coração de Portugal. Evento de trail running em Vila Nova de Poiares com provas de 35km, 22km, 13km, estafetas e caminhada.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Vila Nova de Poiares",
      country: "Portugal",
      sportTypes: [SportType.TRAIL],
      isFeatured: false,
      registrationDeadline: new Date("2026-02-15T23:59:59Z"),
      latitude: 40.2123,
      longitude: -8.23105,
      googleMapsUrl: "https://maps.app.goo.gl/7heZD2Mk1VmJomcZ7",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&auto=format&fit=crop",
      externalUrl: "https://stopandgo.net/events/poiares-trail-2026",
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Create translations for ALL 6 languages
  console.log("🌍 Creating translations for all 6 languages...");
  const languages: Language[] = [
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
    await prisma.eventTranslation.create({
      data: {
        eventId: event.id,
        language: lang,
        title: translations[langKey].title,
        description: translations[langKey].description,
        city: translations[langKey].city,
        metaTitle: translations[langKey].metaTitle,
        metaDescription: translations[langKey].metaDescription,
      },
    });
    console.log(`   ✅ Created ${lang.toUpperCase()} translation`);
  }

  // Delete existing pricing phases for this event (idempotency)
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  // Define variants with their pricing phases
  const variants = [
    {
      name: "PT35K Maxivisão",
      distanceKm: 35.0,
      elevationGainM: 1700,
      elevationLossM: 1700,
      maxParticipants: 240,
      cutoffTimeHours: 8.0,
      mountainLevel: 2,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-11T20:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 23.0,
          currency: Currency.EUR,
          note: "ADAC: €21,50",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 26.0,
          currency: Currency.EUR,
          note: "ADAC: €24,50",
        },
      ],
    },
    {
      name: "PT22K Decathlon",
      distanceKm: 22.0,
      elevationGainM: 1100,
      elevationLossM: 1100,
      maxParticipants: 450,
      cutoffTimeHours: 6.0,
      mountainLevel: 2,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-11T20:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 18.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 21.0,
          currency: Currency.EUR,
          note: null,
        },
      ],
    },
    {
      name: "PT13K Fresbeira",
      distanceKm: 13.0,
      elevationGainM: 400,
      elevationLossM: 400,
      maxParticipants: 400,
      cutoffTimeHours: 4.0,
      mountainLevel: 1,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-11T20:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 13.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: null,
        },
      ],
    },
    {
      name: "Estafetas 35K Ansell Portugal",
      distanceKm: 35.0,
      elevationGainM: 1700,
      elevationLossM: 1700,
      maxParticipants: 60,
      cutoffTimeHours: 8.0,
      mountainLevel: 2,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-11T20:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 13.0,
          currency: Currency.EUR,
          note: "Preço por atleta (equipa de 3)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "Preço por atleta (equipa de 3)",
        },
      ],
    },
    {
      name: "Caminhada 13K Farmácia Santo André",
      distanceKm: 13.0,
      elevationGainM: 400,
      elevationLossM: 400,
      maxParticipants: 150,
      cutoffTimeHours: 4.0,
      mountainLevel: 1,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-11T20:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 13.0,
          currency: Currency.EUR,
          note: "Não competitivo",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "Não competitivo",
        },
      ],
    },
  ];

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

  console.log("✅ Poiares Trail 2026 seed completed successfully!");
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedPoiaresTrail2026()
    .catch((e) => {
      console.error("❌ Error seeding Poiares Trail 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
