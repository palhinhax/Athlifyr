import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Linhas de Torres 100 2026...");

  const slug = "linhas-torres-100-2026";

  // Upsert Event
  const event = await prisma.event.upsert({
    where: { slug },
    update: {
      title: "Linhas de Torres 100",
      description:
        "O Linhas de Torres 100 é uma prova certificada pela ATRP que integra os Circuitos Nacionais de Trail Ultra Endurance, Trail Ultra, Trail e Trail Sprint. Evento com 10 variantes de corrida em plena natureza, percorrendo as Linhas de Torres Vedras, um sistema militar defensivo classificado como monumento nacional.",
      startDate: new Date("2026-01-30T22:00:00Z"),
      endDate: new Date("2026-01-31T20:00:00Z"),
      registrationDeadline: new Date("2026-01-24T23:59:59Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.09370899611603,
      longitude: -9.265213245453257,
      sportTypes: [SportType.TRAIL],
      externalUrl:
        "https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=630&fit=crop",
    },
    create: {
      slug,
      title: "Linhas de Torres 100",
      description:
        "O Linhas de Torres 100 é uma prova certificada pela ATRP que integra os Circuitos Nacionais de Trail Ultra Endurance, Trail Ultra, Trail e Trail Sprint. Evento com 10 variantes de corrida em plena natureza, percorrendo as Linhas de Torres Vedras, um sistema militar defensivo classificado como monumento nacional.",
      startDate: new Date("2026-01-30T22:00:00Z"),
      endDate: new Date("2026-01-31T20:00:00Z"),
      registrationDeadline: new Date("2026-01-24T23:59:59Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.09370899611603,
      longitude: -9.265213245453257,
      sportTypes: [SportType.TRAIL],
      externalUrl:
        "https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=630&fit=crop",
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Upsert Translations for all 6 languages
  const translations = {
    pt: {
      title: "Linhas de Torres 100",
      description: `O **Linhas de Torres 100** é uma prova certificada pela **ATRP – Associação de Trail Running de Portugal** que integra os **Circuitos Nacionais de Trail Ultra Endurance (LT100 – K100)**, **Trail Ultra (LT100 – K50)**, **Trail (LT100 – K30)** e **Trail Sprint (LT100 – K20)**.

Organizado pela **Associação Desportiva Trilhos do Costume**, este evento realiza-se nos dias **30 e 31 de janeiro de 2026**, percorrendo as **Linhas de Torres Vedras**, um sistema militar defensivo classificado como monumento nacional, erguido entre 1809 e 1810 para evitar que Napoleão capturasse Lisboa.

## 🏔️ Sobre as Linhas de Torres

Situado a norte de Lisboa, este conjunto de **152 fortificações, caminhos militares e modelações dos terrenos** formam o maior sistema defensivo de campanha que nunca foi ultrapassado. O evento pretende homenagear os construtores e defensores desta grande obra histórica.

## 🏃 Provas Disponíveis

### LT100 – K100 (Solo)
- **Distância:** 100km
- **Tempo Limite:** 24 horas
- **Partida:** Sexta-feira, 30/01, às 22h00 (Vila Franca de Xira - Monumento a Hércules)
- **Chegada:** Expo Torres, Torres Vedras
- **Circuito:** Circuito Nacional de Ultra Endurance ATRP
- **Idade Mínima:** 18 anos

### LT100 – K100/2 (Estafetas de 2 Elementos)
- **Distância:** 100km (dividido entre 2 atletas)
- **Tempo Limite:** 24 horas
- **Partida:** Sexta-feira, 30/01, às 22h00 (Vila Franca de Xira)
- **Chegada:** Expo Torres, Torres Vedras
- **Nota:** Inscrições em "inscrição coletiva" com mesmo nome de equipa

### LT100 – K100/4 (Estafetas de até 4 Elementos)
- **Distância:** 100km (dividido entre até 4 atletas)
- **Tempo Limite:** 24 horas
- **Partida:** Sexta-feira, 30/01, às 22h00 (Vila Franca de Xira)
- **Chegada:** Expo Torres, Torres Vedras
- **Nota:** Inscrições em "inscrição coletiva" com mesmo nome de equipa

### LT100 – K50
- **Distância:** 50km
- **Tempo Limite:** 13 horas
- **Partida:** Sábado, 31/01, às 08h15 (Sobral de Monte Agraço - Núcleo de Apoio ao Forte do Alqueidão)
- **Chegada:** Expo Torres, Torres Vedras
- **Circuitos:** Circuito de Trail Ultra AAL e Circuito Nacional de Trail Ultra ATRP
- **Idade Mínima:** 18 anos

### LT100 – K30
- **Distância:** 30km
- **Tempo Limite:** 9 horas
- **Partida:** Sábado, 31/01, às 09h30 (Sobral de Monte Agraço - Clube Desportivo e Recreativo de Pêro Negro)
- **Chegada:** Expo Torres, Torres Vedras
- **Circuitos:** Campeonato Regional de Trail Longo, Circuito de Trail Longo AAL e Circuito Nacional de Trail ATRP
- **Idade Mínima:** 18 anos

### LT100 – K20
- **Distância:** 20km
- **Tempo Limite:** 8 horas
- **Partida:** Sábado, 31/01, às 10h30 (Torres Vedras - Serra do Socorro)
- **Chegada:** Expo Torres, Torres Vedras
- **Circuitos:** Circuito de Trail Curto AAL e Circuito Nacional de Trail Sprint ATRP
- **Idade Mínima:** 17 anos (Juniores)

### LT100 – C20 (Caminhada)
- **Distância:** 20km
- **Tempo Limite:** 10 horas
- **Partida:** Sábado, 31/01, às 10h30 (Torres Vedras - Serra do Socorro)
- **Chegada:** Expo Torres, Torres Vedras
- **Idade:** Aberta a todos

### LT100 – K10
- **Distância:** 10km
- **Tempo Limite:** 4 horas
- **Partida:** Sábado, 31/01, às 10h30 (Torres Vedras - Expo Torres)
- **Chegada:** Expo Torres, Torres Vedras
- **Idade Mínima:** 18 anos

### LT100 – C10 (Passeio Pedestre / Caminhada Ecológica)
- **Distância:** 10km
- **Partida:** Sábado, 31/01, às 11h10 (Torres Vedras - Expo Torres)
- **Chegada:** Expo Torres, Torres Vedras
- **Idade:** Aberta a todos

### LT100 – TK (Trail Kids) - GRATUITA
Conjunto de 4 provas gratuitas destinadas a crianças e jovens:
- **Benjamins A** (7-9 anos)
- **Benjamins B** (10-11 anos)
- **Infantis** (12-13 anos)
- **Iniciados** (14-15 anos)

**Partidas:** Sábado, 31/01, a partir das 15h00 (Torres Vedras)

## 📋 Programa Completo

### Sexta-feira, 30 de Janeiro de 2026

**Torres Vedras, Expo Torres:**
- 17h00 - Abertura do Secretariado (entrega de dorsais e sacos para base de vida)
- 20h30 - Partida dos transportes para Vila Franca de Xira

**Vila Franca de Xira - Monumento a Hércules:**
- 21h30 - Abertura da câmara de chamada (controlo de material obrigatório)
- 22h00 - **Partida LT100 – K100, K100/2 e K100/4**

### Sábado, 31 de Janeiro de 2026

**Torres Vedras, Expo Torres:**
- 07h00 - Abertura do Secretariado
- 07h20 - Partida dos transportes para LT100 – K50
- 09h00 - Partida dos transportes para LT100 – K30
- 10h00 - Partida dos transportes para LT100 – K20 e C20

**Locais de Partida:**
- 08h00 - Câmara de chamada LT100 – K50
- 08h15 - **Partida LT100 – K50** (Sobral de Monte Agraço - Núcleo de Apoio ao Forte do Alqueidão)
- 09h15 - Câmara de chamada LT100 – K30
- 09h30 - **Partida LT100 – K30** (Sobral de Monte Agraço - Clube Desportivo de Pêro Negro)
- 10h15 - Câmara de chamada LT100 – K20 e C20
- 10h30 - **Partida LT100 – K20 e C20** (Torres Vedras - Serra do Socorro)
- 11h00 - **Partida LT100 – K10** (Torres Vedras)
- 11h10 - **Partida LT100 – C10** (Torres Vedras)

**Trail Kids:**
- 13h30 - Abertura do Secretariado Trail Kids
- 15h00 - Partida Benjamins A (7-9 anos)
- 15h10 - Partida Benjamins B (10-11 anos)
- 15h20 - Partida Infantis (12-13 anos)
- 15h30 - Partida Iniciados (14-15 anos)

## 🎯 Material Obrigatório

### LT100 – K100, K100/2, K100/4 (100km)
✅ **Obrigatório:**
- Dorsal (permanentemente visível)
- Telemóvel operacional
- Relógio GPS ou telemóvel com percurso instalado e ativo
- Reservatório de água (mínimo 1L)
- Apito
- Manta térmica
- Frontal
- Corta-vento
- Recipiente/copo para líquidos

### LT100 – K50
✅ **Obrigatório:**
- Dorsal (permanentemente visível)
- Telemóvel operacional
- Reservatório de água (mínimo 1L)
- Apito
- Manta térmica
- Corta-vento
- Recipiente/copo para líquidos

### LT100 – K30
✅ **Obrigatório:**
- Dorsal (permanentemente visível)
- Telemóvel operacional
- Reservatório de água (mínimo 1L)
- Apito
- Manta térmica
- Recipiente/copo para líquidos

### LT100 – K20
✅ **Obrigatório:**
- Dorsal (permanentemente visível)
- Telemóvel operacional
- Apito
- Manta térmica
- Recipiente/copo para líquidos

**⚠️ Importante:** O material obrigatório será controlado à entrada para a câmara de chamada e poderá ser inspecionado durante a prova. A organização não disponibiliza copos/recipientes nos PAC's.

## 🥤 Postos de Apoio e Controlo (PAC)

As provas são em **semiautonomia** por trilhos e estrada:

- **LT100 – K100:** 9 PAC
- **LT100 – K50:** 5 PAC
- **LT100 – K30:** 3 PAC
- **LT100 – K20 e C20:** 2 PAC
- **LT100 – K10 e C10:** 1 PAC

Os PAC são pontos obrigatórios de passagem. Não controlar um ou mais pontos levará à desclassificação.

**Bases de Vida:**
Os participantes no LT100 – K100 podem entregar uma mochila/saco fechado no local da partida (identificado com o número de dorsal). Esse material estará disponível no PAC5 (meio do percurso) e na Meta.

## 📦 Kit de Participação

### Provas 100K, 50K, 30K e 20K
✅ 1 T-shirt técnica
✅ 1 Saco/Mochila
✅ 1 Dorsal
✅ Medalha de Finisher
✅ Ofertas dos patrocinadores

**Bonus K100 Solo:**
✅ Sweat / T-shirt de Finisher (para quem concluir a prova)

### Provas 10K e Caminhadas
✅ 1 Buff
✅ 1 Saco/Mochila
✅ 1 Dorsal
✅ Medalha de Finisher
✅ Ofertas dos patrocinadores

### Trail Kids (Gratuita)
✅ Diploma
✅ Brindes dos patrocinadores

**Tamanhos Disponíveis:** S, M, L, XL, XXL
**Nota:** Tamanhos distribuídos conforme pedido na inscrição. Em caso de rutura de stock, será proposto tamanho alternativo.

## 🏆 Prémios e Escalões

### Classificações
- **Classificação geral:** Masculina e Feminina
- **Classificação por escalões**
- **Classificação por equipas**

### Pódios
Os **3 primeiros classificados da geral** sobem ao pódio e recebem troféu.

### Escalões Etários
(Idade a 30 de Setembro de 2026)
- M/F Júnior: 18-19 anos
- M/F Sub23: 20-22 anos
- M/F Seniores: 23-34 anos
- M/F35: 35-39 anos
- M/F40: 40-44 anos
- M/F45: 45-49 anos
- M/F50: 50-54 anos
- M/F55: 55-59 anos
- M/F60: 60-64 anos
- M/F65: 65-69 anos
- M/F70: 70 anos ou mais

**Reclamações:** Devem ser apresentadas até 30 minutos após a chegada do último participante da distância respetiva.

## 🚌 Transporte para Locais de Partida

Transporte disponível a partir da zona da meta (Expo Torres):

- **LT100 – K100/K100/2/K100/4:** 5€
- **LT100 – K50:** 4€
- **LT100 – K30:** 3€
- **LT100 – K20 e C20:** 3€

**⚠️ Nota:** A reserva do transporte deve ser efetuada no momento da inscrição. Nas estafetas, o transporte está disponível apenas para a partida do LT100 – K100, não para os pontos de transição.

## 🌍 Responsabilidade Ambiental

✅ Respeitar a natureza e não poluir os trilhos
✅ Não destruir ou alterar elementos naturais
✅ Colocar lixo nos locais apropriados
✅ Deixar o ambiente como o encontrou

**Qualquer atleta que polua ou destrua elementos naturais será desqualificado.**

## 📜 Penalizações e Desclassificações

### Penalizações
- **Não apresentar material obrigatório:** 1 hora por item

### Desclassificações
❌ Falsificar elementos da inscrição
❌ Não apresentar dorsal e chip na partida
❌ Mau estado físico
❌ Dorsal não visível ou mal colocado
❌ Utilizar dorsal de outro atleta
❌ Uso inadequado do chip
❌ Não cumprir o percurso na totalidade
❌ Não respeitar instruções da organização
❌ Comportamento antidesportivo
❌ Deitar lixo no percurso

## 🎯 Objetivo Solidário

O objetivo solidário deste evento concretiza-se na obtenção de fundos para a **APSA – Associação Portuguesa de Síndrome de Asperger**.

## 👥 Organização e Apoios

**Organização:**
- Associação Desportiva Trilhos do Costume

**Certificação:**
- ATRP – Associação de Trail Running de Portugal

**Apoios Institucionais:**
- Câmara Municipal de Torres Vedras
- Câmara Municipal de Vila Franca de Xira
- Câmara Municipal de Sobral de Monte Agraço
- Câmara Municipal de Arruda dos Vinhos
- Câmara Municipal de Loures
- Câmara Municipal de Mafra
- RHLT - Rota Histórica das Linhas de Torres

**Circuitos:**
- Circuito Nacional de Trail Ultra Endurance ATRP (K100)
- Circuito Nacional de Trail Ultra ATRP (K50)
- Circuito de Trail Ultra AAL (K50)
- Circuito Nacional de Trail ATRP (K30)
- Circuito de Trail Longo AAL (K30)
- Campeonato Regional de Trail Longo (K30)
- Circuito Nacional de Trail Sprint ATRP (K20)
- Circuito de Trail Curto AAL (K20)

## 📞 Contactos

**Email Organização:**
- trilhosdocostume@gmail.com

**Email Inscrições:**
- infotrilhoperdido@gmail.com

**Plataforma de Inscrições:**
- [Trilho Perdido](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)

**Cronometragem:**
- Trilho Perdido
- Telefone: 934 568 787 (Segunda a Sexta, 10h-13h / 14h-17h30)

---

**⚠️ A inscrição implica total aceitação do regulamento oficial da prova.**

**Regulamento completo:** [Download](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)`,
      city: "Torres Vedras",
      metaTitle: "Linhas de Torres 100 2026 | Torres Vedras | 30-31 Janeiro",
      metaDescription:
        "Linhas de Torres 100 a 30-31 de janeiro de 2026 em Torres Vedras. Provas: K100 (solo e estafetas), K50, K30, K20, C20, K10, C10 e Trail Kids. Circuitos ATRP Ultra Endurance, Ultra, Trail e Sprint.",
    },
    en: {
      title: "Linhas de Torres 100",
      description: `**Linhas de Torres 100** is a race certified by **ATRP – Portuguese Trail Running Association** that is part of the **National Trail Ultra Endurance Circuit (LT100 – K100)**, **Trail Ultra Circuit (LT100 – K50)**, **Trail Circuit (LT100 – K30)** and **Trail Sprint Circuit (LT100 – K20)**.

Organized by **Associação Desportiva Trilhos do Costume**, this event takes place on **January 30-31, 2026**, running through the **Lines of Torres Vedras**, a defensive military system classified as a national monument, built between 1809 and 1810 to prevent Napoleon from capturing Lisbon.

## 🏔️ About the Lines of Torres

Located north of Lisbon, this set of **152 fortifications, military roads and terrain modifications** forms the largest defensive field system that was never breached. The event aims to honor the builders and defenders of this great historical work.

## 🏃 Available Races

### LT100 – K100 (Solo)
- **Distance:** 100km
- **Time Limit:** 24 hours
- **Start:** Friday, 30/01, at 10:00 PM (Vila Franca de Xira - Hercules Monument)
- **Finish:** Expo Torres, Torres Vedras
- **Circuit:** ATRP National Ultra Endurance Circuit
- **Minimum Age:** 18 years

### LT100 – K100/2 (Relay Team of 2)
- **Distance:** 100km (divided between 2 athletes)
- **Time Limit:** 24 hours
- **Start:** Friday, 30/01, at 10:00 PM (Vila Franca de Xira)
- **Finish:** Expo Torres, Torres Vedras
- **Note:** Registrations as "collective registration" with same team name

### LT100 – K100/4 (Relay Team of up to 4)
- **Distance:** 100km (divided among up to 4 athletes)
- **Time Limit:** 24 hours
- **Start:** Friday, 30/01, at 10:00 PM (Vila Franca de Xira)
- **Finish:** Expo Torres, Torres Vedras
- **Note:** Registrations as "collective registration" with same team name

### LT100 – K50
- **Distance:** 50km
- **Time Limit:** 13 hours
- **Start:** Saturday, 31/01, at 8:15 AM (Sobral de Monte Agraço - Alqueidão Fort Support Center)
- **Finish:** Expo Torres, Torres Vedras
- **Circuits:** AAL Trail Ultra Circuit and ATRP National Trail Ultra Circuit
- **Minimum Age:** 18 years

### LT100 – K30
- **Distance:** 30km
- **Time Limit:** 9 hours
- **Start:** Saturday, 31/01, at 9:30 AM (Sobral de Monte Agraço - Pêro Negro Sports Club)
- **Finish:** Expo Torres, Torres Vedras
- **Circuits:** Regional Long Trail Championship, AAL Long Trail Circuit and ATRP National Trail Circuit
- **Minimum Age:** 18 years

### LT100 – K20
- **Distance:** 20km
- **Time Limit:** 8 hours
- **Start:** Saturday, 31/01, at 10:30 AM (Torres Vedras - Serra do Socorro)
- **Finish:** Expo Torres, Torres Vedras
- **Circuits:** AAL Short Trail Circuit and ATRP National Trail Sprint Circuit
- **Minimum Age:** 17 years (Juniors)

### LT100 – C20 (Hiking)
- **Distance:** 20km
- **Time Limit:** 10 hours
- **Start:** Saturday, 31/01, at 10:30 AM (Torres Vedras - Serra do Socorro)
- **Finish:** Expo Torres, Torres Vedras
- **Age:** Open to all

### LT100 – K10
- **Distance:** 10km
- **Time Limit:** 4 hours
- **Start:** Saturday, 31/01, at 10:30 AM (Torres Vedras - Expo Torres)
- **Finish:** Expo Torres, Torres Vedras
- **Minimum Age:** 18 years

### LT100 – C10 (Ecological Hike)
- **Distance:** 10km
- **Start:** Saturday, 31/01, at 11:10 AM (Torres Vedras - Expo Torres)
- **Finish:** Expo Torres, Torres Vedras
- **Age:** Open to all

### LT100 – TK (Trail Kids) - FREE
Set of 4 free races for children and youth:
- **Benjamins A** (7-9 years)
- **Benjamins B** (10-11 years)
- **Children** (12-13 years)
- **Youth** (14-15 years)

**Starts:** Saturday, 31/01, from 3:00 PM (Torres Vedras)

## 📋 Full Schedule

### Friday, January 30, 2026

**Torres Vedras, Expo Torres:**
- 5:00 PM - Registration desk opening (bib collection and life base bags)
- 8:30 PM - Transport departure to Vila Franca de Xira

**Vila Franca de Xira - Hercules Monument:**
- 9:30 PM - Call room opening (mandatory equipment check)
- 10:00 PM - **Start LT100 – K100, K100/2 and K100/4**

### Saturday, January 31, 2026

**Torres Vedras, Expo Torres:**
- 7:00 AM - Registration desk opening
- 7:20 AM - Transport departure for LT100 – K50
- 9:00 AM - Transport departure for LT100 – K30
- 10:00 AM - Transport departure for LT100 – K20 and C20

**Start Locations:**
- 8:00 AM - Call room LT100 – K50
- 8:15 AM - **Start LT100 – K50** (Sobral de Monte Agraço - Alqueidão Fort Support Center)
- 9:15 AM - Call room LT100 – K30
- 9:30 AM - **Start LT100 – K30** (Sobral de Monte Agraço - Pêro Negro Sports Club)
- 10:15 AM - Call room LT100 – K20 and C20
- 10:30 AM - **Start LT100 – K20 and C20** (Torres Vedras - Serra do Socorro)
- 11:00 AM - **Start LT100 – K10** (Torres Vedras)
- 11:10 AM - **Start LT100 – C10** (Torres Vedras)

**Trail Kids:**
- 1:30 PM - Trail Kids registration desk opening
- 3:00 PM - Start Benjamins A (7-9 years)
- 3:10 PM - Start Benjamins B (10-11 years)
- 3:20 PM - Start Children (12-13 years)
- 3:30 PM - Start Youth (14-15 years)

## 🎯 Mandatory Equipment

### LT100 – K100, K100/2, K100/4 (100km)
✅ **Mandatory:**
- Race bib (permanently visible)
- Operational mobile phone
- GPS watch or phone with active route
- Water reservoir (minimum 1L)
- Whistle
- Emergency blanket
- Headlamp
- Windbreaker
- Container/cup for liquids

### LT100 – K50
✅ **Mandatory:**
- Race bib (permanently visible)
- Operational mobile phone
- Water reservoir (minimum 1L)
- Whistle
- Emergency blanket
- Windbreaker
- Container/cup for liquids

### LT100 – K30
✅ **Mandatory:**
- Race bib (permanently visible)
- Operational mobile phone
- Water reservoir (minimum 1L)
- Whistle
- Emergency blanket
- Container/cup for liquids

### LT100 – K20
✅ **Mandatory:**
- Race bib (permanently visible)
- Operational mobile phone
- Whistle
- Emergency blanket
- Container/cup for liquids

**⚠️ Important:** Mandatory equipment will be checked at call room entrance and may be inspected during the race. The organization does not provide cups/containers at aid stations.

## 🏆 Prizes and Categories

### Classifications
- **Overall classification:** Male and Female
- **Age category classification**
- **Team classification**

### Podiums
The **top 3 overall finishers** receive trophies.

### Age Categories
(Age as of September 30, 2026)
- M/F Junior: 18-19 years
- M/F Sub23: 20-22 years
- M/F Seniors: 23-34 years
- M/F35: 35-39 years
- M/F40: 40-44 years
- M/F45: 45-49 years
- M/F50: 50-54 years
- M/F55: 55-59 years
- M/F60: 60-64 years
- M/F65: 65-69 years
- M/F70: 70 years or more

## 🚌 Transport to Start Locations

Transport available from the finish area (Expo Torres):

- **LT100 – K100/K100/2/K100/4:** €5
- **LT100 – K50:** €4
- **LT100 – K30:** €3
- **LT100 – K20 and C20:** €3

**⚠️ Note:** Transport booking must be done at registration. For relay teams, transport is only available for LT100 – K100 start, not for transition points.

## 👥 Organization and Support

**Organization:**
- Associação Desportiva Trilhos do Costume

**Certification:**
- ATRP – Portuguese Trail Running Association

**Institutional Support:**
- Torres Vedras City Council
- Vila Franca de Xira City Council
- Sobral de Monte Agraço City Council
- Arruda dos Vinhos City Council
- Loures City Council
- Mafra City Council
- RHLT - Historical Route of the Lines of Torres

**Circuits:**
- ATRP National Ultra Endurance Trail Circuit (K100)
- ATRP National Ultra Trail Circuit (K50)
- AAL Ultra Trail Circuit (K50)
- ATRP National Trail Circuit (K30)
- AAL Long Trail Circuit (K30)
- Regional Long Trail Championship (K30)
- ATRP National Trail Sprint Circuit (K20)
- AAL Short Trail Circuit (K20)

## 📞 Contacts

**Organization Email:**
- trilhosdocostume@gmail.com

**Registration Email:**
- infotrilhoperdido@gmail.com

**Registration Platform:**
- [Trilho Perdido](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)

**Timing:**
- Trilho Perdido
- Phone: +351 934 568 787 (Monday to Friday, 10 AM-1 PM / 2-5:30 PM)

---

**⚠️ Registration implies full acceptance of the official race regulations.**

**Full regulations:** [Download](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)`,
      city: "Torres Vedras",
      metaTitle: "Linhas de Torres 100 2026 | Torres Vedras | January 30-31",
      metaDescription:
        "Linhas de Torres 100 on January 30-31, 2026 in Torres Vedras. Races: K100 (solo and relay), K50, K30, K20, C20, K10, C10 and Trail Kids. ATRP Ultra Endurance, Ultra, Trail and Sprint Circuits.",
    },
    es: {
      title: "Linhas de Torres 100",
      description: `**Linhas de Torres 100** es una carrera certificada por **ATRP – Asociación de Trail Running de Portugal** que forma parte del **Circuito Nacional de Trail Ultra Endurance (LT100 – K100)**, **Circuito Trail Ultra (LT100 – K50)**, **Circuito Trail (LT100 – K30)** y **Circuito Trail Sprint (LT100 – K20)**.

Organizado por **Associação Desportiva Trilhos do Costume**, este evento se celebra los días **30 y 31 de enero de 2026**, recorriendo las **Líneas de Torres Vedras**, un sistema militar defensivo clasificado como monumento nacional, construido entre 1809 y 1810 para evitar que Napoleón capturara Lisboa.

## 🏔️ Sobre las Líneas de Torres

Situado al norte de Lisboa, este conjunto de **152 fortificaciones, caminos militares y modificaciones del terreno** forma el mayor sistema defensivo de campaña que nunca fue atravesado. El evento pretende homenajear a los constructores y defensores de esta gran obra histórica.

## 🏃 Carreras Disponibles

### LT100 – K100 (Individual)
- **Distancia:** 100km
- **Tiempo Límite:** 24 horas
- **Salida:** Viernes, 30/01, a las 22:00 (Vila Franca de Xira - Monumento a Hércules)
- **Meta:** Expo Torres, Torres Vedras
- **Circuito:** Circuito Nacional de Ultra Endurance ATRP
- **Edad Mínima:** 18 años

### LT100 – K100/2 (Relevos de 2)
- **Distancia:** 100km (dividido entre 2 atletas)
- **Tiempo Límite:** 24 horas
- **Salida:** Viernes, 30/01, a las 22:00 (Vila Franca de Xira)
- **Meta:** Expo Torres, Torres Vedras
- **Nota:** Inscripciones como "inscripción colectiva" con mismo nombre de equipo

### LT100 – K100/4 (Relevos de hasta 4)
- **Distancia:** 100km (dividido entre hasta 4 atletas)
- **Tiempo Límite:** 24 horas
- **Salida:** Viernes, 30/01, a las 22:00 (Vila Franca de Xira)
- **Meta:** Expo Torres, Torres Vedras
- **Nota:** Inscripciones como "inscripción colectiva" con mismo nombre de equipo

### LT100 – K50
- **Distancia:** 50km
- **Tiempo Límite:** 13 horas
- **Salida:** Sábado, 31/01, a las 8:15 (Sobral de Monte Agraço - Centro de Apoyo al Fuerte del Alqueidão)
- **Meta:** Expo Torres, Torres Vedras
- **Circuitos:** Circuito de Trail Ultra AAL y Circuito Nacional de Trail Ultra ATRP
- **Edad Mínima:** 18 años

### LT100 – K30
- **Distancia:** 30km
- **Tiempo Límite:** 9 horas
- **Salida:** Sábado, 31/01, a las 9:30 (Sobral de Monte Agraço - Club Deportivo de Pêro Negro)
- **Meta:** Expo Torres, Torres Vedras
- **Circuitos:** Campeonato Regional de Trail Largo, Circuito de Trail Largo AAL y Circuito Nacional de Trail ATRP
- **Edad Mínima:** 18 años

### LT100 – K20
- **Distancia:** 20km
- **Tiempo Límite:** 8 horas
- **Salida:** Sábado, 31/01, a las 10:30 (Torres Vedras - Serra do Socorro)
- **Meta:** Expo Torres, Torres Vedras
- **Circuitos:** Circuito de Trail Corto AAL y Circuito Nacional de Trail Sprint ATRP
- **Edad Mínima:** 17 años (Juniors)

### LT100 – C20 (Senderismo)
- **Distancia:** 20km
- **Tiempo Límite:** 10 horas
- **Salida:** Sábado, 31/01, a las 10:30 (Torres Vedras - Serra do Socorro)
- **Meta:** Expo Torres, Torres Vedras
- **Edad:** Abierto a todos

### LT100 – K10
- **Distancia:** 10km
- **Tiempo Límite:** 4 horas
- **Salida:** Sábado, 31/01, a las 10:30 (Torres Vedras - Expo Torres)
- **Meta:** Expo Torres, Torres Vedras
- **Edad Mínima:** 18 años

### LT100 – C10 (Senderismo Ecológico)
- **Distancia:** 10km
- **Salida:** Sábado, 31/01, a las 11:10 (Torres Vedras - Expo Torres)
- **Meta:** Expo Torres, Torres Vedras
- **Edad:** Abierto a todos

### LT100 – TK (Trail Kids) - GRATUITA
Conjunto de 4 carreras gratuitas para niños y jóvenes:
- **Benjamins A** (7-9 años)
- **Benjamins B** (10-11 años)
- **Infantiles** (12-13 años)
- **Iniciados** (14-15 años)

**Salidas:** Sábado, 31/01, a partir de las 15:00 (Torres Vedras)

## 🏆 Premios y Categorías

### Clasificaciones
- **Clasificación general:** Masculina y Femenina
- **Clasificación por categorías de edad**
- **Clasificación por equipos**

### Podios
Los **3 primeros clasificados generales** reciben trofeos.

### Categorías de Edad
(Edad a 30 de septiembre de 2026)
- M/F Júnior: 18-19 años
- M/F Sub23: 20-22 años
- M/F Sénior: 23-34 años
- M/F35: 35-39 años
- M/F40: 40-44 años
- M/F45: 45-49 años
- M/F50: 50-54 años
- M/F55: 55-59 años
- M/F60: 60-64 años
- M/F65: 65-69 años
- M/F70: 70 años o más

## 👥 Organización y Apoyo

**Organización:**
- Associação Desportiva Trilhos do Costume

**Certificación:**
- ATRP – Asociación de Trail Running de Portugal

**Apoyo Institucional:**
- Ayuntamiento de Torres Vedras
- Ayuntamiento de Vila Franca de Xira
- Ayuntamiento de Sobral de Monte Agraço
- Ayuntamiento de Arruda dos Vinhos
- Ayuntamiento de Loures
- Ayuntamiento de Mafra
- RHLT - Ruta Histórica de las Líneas de Torres

**Circuitos:**
- Circuito Nacional de Trail Ultra Endurance ATRP (K100)
- Circuito Nacional de Trail Ultra ATRP (K50)
- Circuito de Trail Ultra AAL (K50)
- Circuito Nacional de Trail ATRP (K30)
- Circuito de Trail Largo AAL (K30)
- Campeonato Regional de Trail Largo (K30)
- Circuito Nacional de Trail Sprint ATRP (K20)
- Circuito de Trail Corto AAL (K20)

## 📞 Contactos

**Email Organización:**
- trilhosdocostume@gmail.com

**Email Inscripciones:**
- infotrilhoperdido@gmail.com

**Plataforma de Inscripciones:**
- [Trilho Perdido](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)

**Cronometraje:**
- Trilho Perdido
- Teléfono: +351 934 568 787 (Lunes a Viernes, 10:00-13:00 / 14:00-17:30)

---

**⚠️ La inscripción implica la aceptación total del reglamento oficial de la carrera.**

**Reglamento completo:** [Descargar](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)`,
      city: "Torres Vedras",
      metaTitle: "Linhas de Torres 100 2026 | Torres Vedras | 30-31 Enero",
      metaDescription:
        "Linhas de Torres 100 el 30-31 de enero de 2026 en Torres Vedras. Carreras: K100 (individual y relevos), K50, K30, K20, C20, K10, C10 y Trail Kids. Circuitos ATRP Ultra Endurance, Ultra, Trail y Sprint.",
    },
    fr: {
      title: "Linhas de Torres 100",
      description: `**Linhas de Torres 100** est une course certifiée par **ATRP – Association de Trail Running du Portugal** qui fait partie du **Circuit National de Trail Ultra Endurance (LT100 – K100)**, **Circuit Trail Ultra (LT100 – K50)**, **Circuit Trail (LT100 – K30)** et **Circuit Trail Sprint (LT100 – K20)**.

Organisé par **Associação Desportiva Trilhos do Costume**, cet événement a lieu les **30 et 31 janvier 2026**, parcourant les **Lignes de Torres Vedras**, un système militaire défensif classé monument national, construit entre 1809 et 1810 pour empêcher Napoléon de capturer Lisbonne.

## 🏔️ À propos des Lignes de Torres

Situé au nord de Lisbonne, cet ensemble de **152 fortifications, chemins militaires et modifications du terrain** forme le plus grand système défensif de campagne qui n'a jamais été franchi. L'événement vise à rendre hommage aux constructeurs et défenseurs de ce grand ouvrage historique.

## 🏃 Courses Disponibles

### LT100 – K100 (Individuel)
- **Distance:** 100km
- **Temps Limite:** 24 heures
- **Départ:** Vendredi, 30/01, à 22h00 (Vila Franca de Xira - Monument à Hercule)
- **Arrivée:** Expo Torres, Torres Vedras
- **Circuit:** Circuit National Ultra Endurance ATRP
- **Âge Minimum:** 18 ans

### LT100 – K100/2 (Relais de 2)
- **Distance:** 100km (divisé entre 2 athlètes)
- **Temps Limite:** 24 heures
- **Départ:** Vendredi, 30/01, à 22h00 (Vila Franca de Xira)
- **Arrivée:** Expo Torres, Torres Vedras
- **Note:** Inscriptions en "inscription collective" avec même nom d'équipe

### LT100 – K100/4 (Relais jusqu'à 4)
- **Distance:** 100km (divisé entre jusqu'à 4 athlètes)
- **Temps Limite:** 24 heures
- **Départ:** Vendredi, 30/01, à 22h00 (Vila Franca de Xira)
- **Arrivée:** Expo Torres, Torres Vedras
- **Note:** Inscriptions en "inscription collective" avec même nom d'équipe

### LT100 – K50
- **Distance:** 50km
- **Temps Limite:** 13 heures
- **Départ:** Samedi, 31/01, à 8h15 (Sobral de Monte Agraço - Centre de Soutien du Fort d'Alqueidão)
- **Arrivée:** Expo Torres, Torres Vedras
- **Circuits:** Circuit de Trail Ultra AAL et Circuit National de Trail Ultra ATRP
- **Âge Minimum:** 18 ans

### LT100 – K30
- **Distance:** 30km
- **Temps Limite:** 9 heures
- **Départ:** Samedi, 31/01, à 9h30 (Sobral de Monte Agraço - Club Sportif de Pêro Negro)
- **Arrivée:** Expo Torres, Torres Vedras
- **Circuits:** Championnat Régional de Trail Long, Circuit de Trail Long AAL et Circuit National de Trail ATRP
- **Âge Minimum:** 18 ans

### LT100 – K20
- **Distance:** 20km
- **Temps Limite:** 8 heures
- **Départ:** Samedi, 31/01, à 10h30 (Torres Vedras - Serra do Socorro)
- **Arrivée:** Expo Torres, Torres Vedras
- **Circuits:** Circuit de Trail Court AAL et Circuit National de Trail Sprint ATRP
- **Âge Minimum:** 17 ans (Juniors)

### LT100 – C20 (Randonnée)
- **Distance:** 20km
- **Temps Limite:** 10 heures
- **Départ:** Samedi, 31/01, à 10h30 (Torres Vedras - Serra do Socorro)
- **Arrivée:** Expo Torres, Torres Vedras
- **Âge:** Ouvert à tous

### LT100 – K10
- **Distance:** 10km
- **Temps Limite:** 4 heures
- **Départ:** Samedi, 31/01, à 10h30 (Torres Vedras - Expo Torres)
- **Arrivée:** Expo Torres, Torres Vedras
- **Âge Minimum:** 18 ans

### LT100 – C10 (Randonnée Écologique)
- **Distance:** 10km
- **Départ:** Samedi, 31/01, à 11h10 (Torres Vedras - Expo Torres)
- **Arrivée:** Expo Torres, Torres Vedras
- **Âge:** Ouvert à tous

### LT100 – TK (Trail Kids) - GRATUIT
Ensemble de 4 courses gratuites pour enfants et jeunes:
- **Benjamins A** (7-9 ans)
- **Benjamins B** (10-11 ans)
- **Enfants** (12-13 ans)
- **Initiés** (14-15 ans)

**Départs:** Samedi, 31/01, à partir de 15h00 (Torres Vedras)

## 🏆 Prix et Catégories

### Classifications
- **Classement général:** Masculin et Féminin
- **Classement par catégories d'âge**
- **Classement par équipes**

### Podiums
Les **3 premiers classés généraux** reçoivent des trophées.

### Catégories d'Âge
(Âge au 30 septembre 2026)
- M/F Junior: 18-19 ans
- M/F Sub23: 20-22 ans
- M/F Séniors: 23-34 ans
- M/F35: 35-39 ans
- M/F40: 40-44 ans
- M/F45: 45-49 ans
- M/F50: 50-54 ans
- M/F55: 55-59 ans
- M/F60: 60-64 ans
- M/F65: 65-69 ans
- M/F70: 70 ans ou plus

## 👥 Organisation et Soutien

**Organisation:**
- Associação Desportiva Trilhos do Costume

**Certification:**
- ATRP – Association de Trail Running du Portugal

**Soutien Institutionnel:**
- Mairie de Torres Vedras
- Mairie de Vila Franca de Xira
- Mairie de Sobral de Monte Agraço
- Mairie d'Arruda dos Vinhos
- Mairie de Loures
- Mairie de Mafra
- RHLT - Route Historique des Lignes de Torres

**Circuits:**
- Circuit National de Trail Ultra Endurance ATRP (K100)
- Circuit National de Trail Ultra ATRP (K50)
- Circuit de Trail Ultra AAL (K50)
- Circuit National de Trail ATRP (K30)
- Circuit de Trail Long AAL (K30)
- Championnat Régional de Trail Long (K30)
- Circuit National de Trail Sprint ATRP (K20)
- Circuit de Trail Court AAL (K20)

## 📞 Contacts

**Email Organisation:**
- trilhosdocostume@gmail.com

**Email Inscriptions:**
- infotrilhoperdido@gmail.com

**Plateforme d'Inscriptions:**
- [Trilho Perdido](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)

**Chronométrage:**
- Trilho Perdido
- Téléphone: +351 934 568 787 (Lundi à Vendredi, 10h-13h / 14h-17h30)

---

**⚠️ L'inscription implique l'acceptation totale du règlement officiel de la course.**

**Règlement complet:** [Télécharger](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)`,
      city: "Torres Vedras",
      metaTitle: "Linhas de Torres 100 2026 | Torres Vedras | 30-31 Janvier",
      metaDescription:
        "Linhas de Torres 100 les 30-31 janvier 2026 à Torres Vedras. Courses: K100 (individuel et relais), K50, K30, K20, C20, K10, C10 et Trail Kids. Circuits ATRP Ultra Endurance, Ultra, Trail et Sprint.",
    },
    de: {
      title: "Linhas de Torres 100",
      description: `**Linhas de Torres 100** ist ein von **ATRP – Portugiesischer Trail Running Verband** zertifiziertes Rennen, das Teil des **Nationalen Trail Ultra Endurance Circuits (LT100 – K100)**, **Trail Ultra Circuits (LT100 – K50)**, **Trail Circuits (LT100 – K30)** und **Trail Sprint Circuits (LT100 – K20)** ist.

Organisiert von **Associação Desportiva Trilhos do Costume**, findet diese Veranstaltung am **30. und 31. Januar 2026** statt und führt durch die **Linien von Torres Vedras**, ein als nationales Denkmal klassifiziertes militärisches Verteidigungssystem, das zwischen 1809 und 1810 erbaut wurde, um zu verhindern, dass Napoleon Lissabon erobert.

## 🏔️ Über die Linien von Torres

Nördlich von Lissabon gelegen, bildet diese Ansammlung von **152 Befestigungen, Militärstraßen und Geländemodifikationen** das größte defensive Feldsystem, das nie durchbrochen wurde. Die Veranstaltung zielt darauf ab, die Erbauer und Verteidiger dieses großen historischen Werks zu ehren.

## 🏃 Verfügbare Rennen

### LT100 – K100 (Einzeln)
- **Distanz:** 100km
- **Zeitlimit:** 24 Stunden
- **Start:** Freitag, 30.01., um 22:00 Uhr (Vila Franca de Xira - Herkules-Denkmal)
- **Ziel:** Expo Torres, Torres Vedras
- **Circuit:** ATRP Nationaler Ultra Endurance Circuit
- **Mindestalter:** 18 Jahre

### LT100 – K100/2 (Staffel zu 2)
- **Distanz:** 100km (geteilt zwischen 2 Athleten)
- **Zeitlimit:** 24 Stunden
- **Start:** Freitag, 30.01., um 22:00 Uhr (Vila Franca de Xira)
- **Ziel:** Expo Torres, Torres Vedras
- **Hinweis:** Anmeldungen als "Sammelanmeldung" mit gleichem Teamnamen

### LT100 – K100/4 (Staffel bis zu 4)
- **Distanz:** 100km (geteilt zwischen bis zu 4 Athleten)
- **Zeitlimit:** 24 Stunden
- **Start:** Freitag, 30.01., um 22:00 Uhr (Vila Franca de Xira)
- **Ziel:** Expo Torres, Torres Vedras
- **Hinweis:** Anmeldungen als "Sammelanmeldung" mit gleichem Teamnamen

### LT100 – K50
- **Distanz:** 50km
- **Zeitlimit:** 13 Stunden
- **Start:** Samstag, 31.01., um 8:15 Uhr (Sobral de Monte Agraço - Alqueidão Fort Unterstützungszentrum)
- **Ziel:** Expo Torres, Torres Vedras
- **Circuits:** AAL Trail Ultra Circuit und ATRP Nationaler Trail Ultra Circuit
- **Mindestalter:** 18 Jahre

### LT100 – K30
- **Distanz:** 30km
- **Zeitlimit:** 9 Stunden
- **Start:** Samstag, 31.01., um 9:30 Uhr (Sobral de Monte Agraço - Pêro Negro Sportclub)
- **Ziel:** Expo Torres, Torres Vedras
- **Circuits:** Regionale Lange Trail Meisterschaft, AAL Langer Trail Circuit und ATRP Nationaler Trail Circuit
- **Mindestalter:** 18 Jahre

### LT100 – K20
- **Distanz:** 20km
- **Zeitlimit:** 8 Stunden
- **Start:** Samstag, 31.01., um 10:30 Uhr (Torres Vedras - Serra do Socorro)
- **Ziel:** Expo Torres, Torres Vedras
- **Circuits:** AAL Kurzer Trail Circuit und ATRP Nationaler Trail Sprint Circuit
- **Mindestalter:** 17 Jahre (Junioren)

### LT100 – C20 (Wanderung)
- **Distanz:** 20km
- **Zeitlimit:** 10 Stunden
- **Start:** Samstag, 31.01., um 10:30 Uhr (Torres Vedras - Serra do Socorro)
- **Ziel:** Expo Torres, Torres Vedras
- **Alter:** Offen für alle

### LT100 – K10
- **Distanz:** 10km
- **Zeitlimit:** 4 Stunden
- **Start:** Samstag, 31.01., um 10:30 Uhr (Torres Vedras - Expo Torres)
- **Ziel:** Expo Torres, Torres Vedras
- **Mindestalter:** 18 Jahre

### LT100 – C10 (Ökologische Wanderung)
- **Distanz:** 10km
- **Start:** Samstag, 31.01., um 11:10 Uhr (Torres Vedras - Expo Torres)
- **Ziel:** Expo Torres, Torres Vedras
- **Alter:** Offen für alle

### LT100 – TK (Trail Kids) - KOSTENLOS
Satz von 4 kostenlosen Rennen für Kinder und Jugendliche:
- **Benjamins A** (7-9 Jahre)
- **Benjamins B** (10-11 Jahre)
- **Kinder** (12-13 Jahre)
- **Jugendliche** (14-15 Jahre)

**Starts:** Samstag, 31.01., ab 15:00 Uhr (Torres Vedras)

## 🏆 Preise und Kategorien

### Klassifizierungen
- **Gesamtwertung:** Männlich und Weiblich
- **Altersklassenwertung**
- **Mannschaftswertung**

### Podien
Die **Top 3 der Gesamtwertung** erhalten Trophäen.

### Altersklassen
(Alter am 30. September 2026)
- M/F Junior: 18-19 Jahre
- M/F Sub23: 20-22 Jahre
- M/F Senioren: 23-34 Jahre
- M/F35: 35-39 Jahre
- M/F40: 40-44 Jahre
- M/F45: 45-49 Jahre
- M/F50: 50-54 Jahre
- M/F55: 55-59 Jahre
- M/F60: 60-64 Jahre
- M/F65: 65-69 Jahre
- M/F70: 70 Jahre oder mehr

## 👥 Organisation und Unterstützung

**Organisation:**
- Associação Desportiva Trilhos do Costume

**Zertifizierung:**
- ATRP – Portugiesischer Trail Running Verband

**Institutionelle Unterstützung:**
- Stadtverwaltung Torres Vedras
- Stadtverwaltung Vila Franca de Xira
- Stadtverwaltung Sobral de Monte Agraço
- Stadtverwaltung Arruda dos Vinhos
- Stadtverwaltung Loures
- Stadtverwaltung Mafra
- RHLT - Historische Route der Linien von Torres

**Circuits:**
- ATRP Nationaler Trail Ultra Endurance Circuit (K100)
- ATRP Nationaler Trail Ultra Circuit (K50)
- AAL Trail Ultra Circuit (K50)
- ATRP Nationaler Trail Circuit (K30)
- AAL Langer Trail Circuit (K30)
- Regionale Lange Trail Meisterschaft (K30)
- ATRP Nationaler Trail Sprint Circuit (K20)
- AAL Kurzer Trail Circuit (K20)

## 📞 Kontakte

**E-Mail Organisation:**
- trilhosdocostume@gmail.com

**E-Mail Anmeldungen:**
- infotrilhoperdido@gmail.com

**Anmeldungsplattform:**
- [Trilho Perdido](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)

**Zeitnahme:**
- Trilho Perdido
- Telefon: +351 934 568 787 (Montag bis Freitag, 10:00-13:00 / 14:00-17:30)

---

**⚠️ Die Anmeldung impliziert die vollständige Annahme der offiziellen Rennregeln.**

**Vollständige Regelungen:** [Herunterladen](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)`,
      city: "Torres Vedras",
      metaTitle: "Linhas de Torres 100 2026 | Torres Vedras | 30.-31. Januar",
      metaDescription:
        "Linhas de Torres 100 am 30.-31. Januar 2026 in Torres Vedras. Rennen: K100 (einzeln und Staffel), K50, K30, K20, C20, K10, C10 und Trail Kids. ATRP Ultra Endurance, Ultra, Trail und Sprint Circuits.",
    },
    it: {
      title: "Linhas de Torres 100",
      description: `**Linhas de Torres 100** è una gara certificata dall'**ATRP – Associazione Trail Running del Portogallo** che fa parte del **Circuito Nazionale Trail Ultra Endurance (LT100 – K100)**, **Circuito Trail Ultra (LT100 – K50)**, **Circuito Trail (LT100 – K30)** e **Circuito Trail Sprint (LT100 – K20)**.

Organizzato dall'**Associação Desportiva Trilhos do Costume**, questo evento si svolge il **30 e 31 gennaio 2026**, percorrendo le **Linee di Torres Vedras**, un sistema militare difensivo classificato come monumento nazionale, costruito tra il 1809 e il 1810 per impedire a Napoleone di catturare Lisbona.

## 🏔️ Sulle Linee di Torres

Situato a nord di Lisbona, questo insieme di **152 fortificazioni, strade militari e modifiche del terreno** forma il più grande sistema difensivo da campo che non è mai stato attraversato. L'evento mira a onorare i costruttori e i difensori di questa grande opera storica.

## 🏃 Gare Disponibili

### LT100 – K100 (Individuale)
- **Distanza:** 100km
- **Tempo Limite:** 24 ore
- **Partenza:** Venerdì, 30/01, alle 22:00 (Vila Franca de Xira - Monumento a Ercole)
- **Arrivo:** Expo Torres, Torres Vedras
- **Circuito:** Circuito Nazionale Ultra Endurance ATRP
- **Età Minima:** 18 anni

### LT100 – K100/2 (Staffetta di 2)
- **Distanza:** 100km (diviso tra 2 atleti)
- **Tempo Limite:** 24 ore
- **Partenza:** Venerdì, 30/01, alle 22:00 (Vila Franca de Xira)
- **Arrivo:** Expo Torres, Torres Vedras
- **Nota:** Iscrizioni come "iscrizione collettiva" con stesso nome di squadra

### LT100 – K100/4 (Staffetta fino a 4)
- **Distanza:** 100km (diviso tra fino a 4 atleti)
- **Tempo Limite:** 24 ore
- **Partenza:** Venerdì, 30/01, alle 22:00 (Vila Franca de Xira)
- **Arrivo:** Expo Torres, Torres Vedras
- **Nota:** Iscrizioni come "iscrizione collettiva" con stesso nome di squadra

### LT100 – K50
- **Distanza:** 50km
- **Tempo Limite:** 13 ore
- **Partenza:** Sabato, 31/01, alle 8:15 (Sobral de Monte Agraço - Centro di Supporto del Forte di Alqueidão)
- **Arrivo:** Expo Torres, Torres Vedras
- **Circuiti:** Circuito Trail Ultra AAL e Circuito Nazionale Trail Ultra ATRP
- **Età Minima:** 18 anni

### LT100 – K30
- **Distanza:** 30km
- **Tempo Limite:** 9 ore
- **Partenza:** Sabato, 31/01, alle 9:30 (Sobral de Monte Agraço - Club Sportivo di Pêro Negro)
- **Arrivo:** Expo Torres, Torres Vedras
- **Circuiti:** Campionato Regionale Trail Lungo, Circuito Trail Lungo AAL e Circuito Nazionale Trail ATRP
- **Età Minima:** 18 anni

### LT100 – K20
- **Distanza:** 20km
- **Tempo Limite:** 8 ore
- **Partenza:** Sabato, 31/01, alle 10:30 (Torres Vedras - Serra do Socorro)
- **Arrivo:** Expo Torres, Torres Vedras
- **Circuiti:** Circuito Trail Corto AAL e Circuito Nazionale Trail Sprint ATRP
- **Età Minima:** 17 anni (Junior)

### LT100 – C20 (Escursionismo)
- **Distanza:** 20km
- **Tempo Limite:** 10 ore
- **Partenza:** Sabato, 31/01, alle 10:30 (Torres Vedras - Serra do Socorro)
- **Arrivo:** Expo Torres, Torres Vedras
- **Età:** Aperto a tutti

### LT100 – K10
- **Distanza:** 10km
- **Tempo Limite:** 4 ore
- **Partenza:** Sabato, 31/01, alle 10:30 (Torres Vedras - Expo Torres)
- **Arrivo:** Expo Torres, Torres Vedras
- **Età Minima:** 18 anni

### LT100 – C10 (Escursionismo Ecologico)
- **Distanza:** 10km
- **Partenza:** Sabato, 31/01, alle 11:10 (Torres Vedras - Expo Torres)
- **Arrivo:** Expo Torres, Torres Vedras
- **Età:** Aperto a tutti

### LT100 – TK (Trail Kids) - GRATUITA
Insieme di 4 gare gratuite per bambini e giovani:
- **Benjamins A** (7-9 anni)
- **Benjamins B** (10-11 anni)
- **Bambini** (12-13 anni)
- **Iniziati** (14-15 anni)

**Partenze:** Sabato, 31/01, dalle 15:00 (Torres Vedras)

## 🏆 Premi e Categorie

### Classifiche
- **Classifica generale:** Maschile e Femminile
- **Classifica per categorie di età**
- **Classifica a squadre**

### Podi
I **primi 3 classificati generali** ricevono trofei.

### Categorie di Età
(Età al 30 settembre 2026)
- M/F Junior: 18-19 anni
- M/F Sub23: 20-22 anni
- M/F Senior: 23-34 anni
- M/F35: 35-39 anni
- M/F40: 40-44 anni
- M/F45: 45-49 anni
- M/F50: 50-54 anni
- M/F55: 55-59 anni
- M/F60: 60-64 anni
- M/F65: 65-69 anni
- M/F70: 70 anni o più

## 👥 Organizzazione e Supporto

**Organizzazione:**
- Associação Desportiva Trilhos do Costume

**Certificazione:**
- ATRP – Associazione Trail Running del Portogallo

**Supporto Istituzionale:**
- Comune di Torres Vedras
- Comune di Vila Franca de Xira
- Comune di Sobral de Monte Agraço
- Comune di Arruda dos Vinhos
- Comune di Loures
- Comune di Mafra
- RHLT - Percorso Storico delle Linee di Torres

**Circuiti:**
- Circuito Nazionale Trail Ultra Endurance ATRP (K100)
- Circuito Nazionale Trail Ultra ATRP (K50)
- Circuito Trail Ultra AAL (K50)
- Circuito Nazionale Trail ATRP (K30)
- Circuito Trail Lungo AAL (K30)
- Campionato Regionale Trail Lungo (K30)
- Circuito Nazionale Trail Sprint ATRP (K20)
- Circuito Trail Corto AAL (K20)

## 📞 Contatti

**Email Organizzazione:**
- trilhosdocostume@gmail.com

**Email Iscrizioni:**
- infotrilhoperdido@gmail.com

**Piattaforma Iscrizioni:**
- [Trilho Perdido](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)

**Cronometraggio:**
- Trilho Perdido
- Telefono: +351 934 568 787 (Lunedì a Venerdì, 10:00-13:00 / 14:00-17:30)

---

**⚠️ L'iscrizione implica l'accettazione totale del regolamento ufficiale della gara.**

**Regolamento completo:** [Scarica](https://www.trilhoperdido.com/evento/Linhas-de-Torres-100-2026)`,
      city: "Torres Vedras",
      metaTitle: "Linhas de Torres 100 2026 | Torres Vedras | 30-31 Gennaio",
      metaDescription:
        "Linhas de Torres 100 il 30-31 gennaio 2026 a Torres Vedras. Gare: K100 (individuale e staffetta), K50, K30, K20, C20, K10, C10 e Trail Kids. Circuiti ATRP Ultra Endurance, Ultra, Trail e Sprint.",
    },
  };

  for (const lang of Object.keys(translations) as Language[]) {
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
    console.log(`✅ Translation upserted for language: ${lang}`);
  }

  // Delete existing variants for this event
  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  // Create Variants
  const variants = [
    {
      name: "LT100 – K100 (Solo)",
      distanceKm: 100,
      elevationGainM: null,
      cutoffTimeHours: 24.0,
      atrpGrade: null,
      startTime: "2026-01-30T22:00:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 65.0,
          currency: Currency.EUR,
          note: "21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 85.0,
          currency: Currency.EUR,
          note: "13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 100.0,
          currency: Currency.EUR,
          note: "1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – K100/2 (Estafetas de 2)",
      distanceKm: 100,
      elevationGainM: null,
      cutoffTimeHours: 24.0,
      atrpGrade: null,
      startTime: "2026-01-30T22:00:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 32.0,
          currency: Currency.EUR,
          note: "Por atleta - 21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 37.0,
          currency: Currency.EUR,
          note: "Por atleta - 1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 42.0,
          currency: Currency.EUR,
          note: "Por atleta - 13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 50.0,
          currency: Currency.EUR,
          note: "Por atleta - 1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – K100/4 (Estafetas de até 4)",
      distanceKm: 100,
      elevationGainM: null,
      cutoffTimeHours: 24.0,
      atrpGrade: null,
      startTime: "2026-01-30T22:00:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "Por atleta - 21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 18.0,
          currency: Currency.EUR,
          note: "Por atleta - 1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 21.0,
          currency: Currency.EUR,
          note: "Por atleta - 13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 25.0,
          currency: Currency.EUR,
          note: "Por atleta - 1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – K50",
      distanceKm: 50,
      elevationGainM: null,
      cutoffTimeHours: 13.0,
      atrpGrade: null,
      startTime: "2026-01-31T08:15:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 30.0,
          currency: Currency.EUR,
          note: "21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 35.0,
          currency: Currency.EUR,
          note: "1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 45.0,
          currency: Currency.EUR,
          note: "13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 50.0,
          currency: Currency.EUR,
          note: "1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – K30",
      distanceKm: 30,
      elevationGainM: null,
      cutoffTimeHours: 9.0,
      atrpGrade: null,
      startTime: "2026-01-31T09:30:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 22.0,
          currency: Currency.EUR,
          note: "21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 25.0,
          currency: Currency.EUR,
          note: "1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 28.0,
          currency: Currency.EUR,
          note: "13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 30.0,
          currency: Currency.EUR,
          note: "1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – K20",
      distanceKm: 20,
      elevationGainM: null,
      cutoffTimeHours: 8.0,
      atrpGrade: null,
      startTime: "2026-01-31T10:30:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 18.0,
          currency: Currency.EUR,
          note: "1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 20.0,
          currency: Currency.EUR,
          note: "13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 22.0,
          currency: Currency.EUR,
          note: "1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – C20 (Caminhada)",
      distanceKm: 20,
      elevationGainM: null,
      cutoffTimeHours: 10.0,
      atrpGrade: null,
      startTime: "2026-01-31T10:30:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 10.0,
          currency: Currency.EUR,
          note: "21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: "1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 14.0,
          currency: Currency.EUR,
          note: "13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – K10",
      distanceKm: 10,
      elevationGainM: null,
      cutoffTimeHours: 4.0,
      atrpGrade: null,
      startTime: "2026-01-31T11:00:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 10.0,
          currency: Currency.EUR,
          note: "21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: "1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 14.0,
          currency: Currency.EUR,
          note: "13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 15.0,
          currency: Currency.EUR,
          note: "1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – C10 (Caminhada)",
      distanceKm: 10,
      elevationGainM: null,
      cutoffTimeHours: null,
      atrpGrade: null,
      startTime: "2026-01-31T11:10:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Fase 1",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 7.0,
          currency: Currency.EUR,
          note: "21 Jul - 30 Set 2025",
        },
        {
          name: "Fase 2",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 8.0,
          currency: Currency.EUR,
          note: "1 Out - 12 Dez 2025",
        },
        {
          name: "Fase 3",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 10.0,
          currency: Currency.EUR,
          note: "13 Dez - 31 Dez 2025",
        },
        {
          name: "Fase 4",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: "1 Jan - 24 Jan 2026",
        },
      ],
    },
    {
      name: "LT100 – TK (Trail Kids)",
      distanceKm: null,
      elevationGainM: null,
      cutoffTimeHours: null,
      atrpGrade: null,
      startTime: "2026-01-31T15:00:00Z",
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Inscrição Gratuita",
          startDate: new Date("2025-07-21T00:00:00Z"),
          endDate: new Date("2026-01-24T23:59:59Z"),
          price: 0.0,
          currency: Currency.EUR,
          note: "Gratuita - 4 provas para crianças 7-15 anos",
        },
      ],
    },
  ];

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
          eventId: event.id,
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

  console.log("");
  console.log("🎉 Linhas de Torres 100 2026 seeded successfully!");
  console.log(`   - Event ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(
    `   - Dates: ${event.startDate.toLocaleDateString("pt-PT")} - ${event.endDate?.toLocaleDateString("pt-PT")}`
  );
  console.log(`   - City: ${event.city}`);
  console.log(`   - Variants: ${variants.length}`);
  console.log(`   - Translations: 6 languages (pt, en, es, fr, de, it)`);
  console.log(
    `   - SEO: Complete metaTitle and metaDescription for all languages`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
