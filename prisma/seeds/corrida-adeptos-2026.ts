/**
 * Seed: 10ª Corrida dos Adeptos e Simpatizantes - Memorial Arons de Carvalho 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 10ª Corrida dos Adeptos e Simpatizantes 2026...");

  const eventSlug = "corrida-adeptos-simpatizantes-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title:
        "10ª Corrida dos Adeptos e Simpatizantes - Memorial Arons de Carvalho",
      description: `10ª edição da Corrida dos Adeptos e Simpatizantes do Sport Lisboa e Benfica - Memorial Arons de Carvalho. Percurso pela Av. Infante D. Henrique, zona oriental de Lisboa, com partida e chegada no Parque Ribeirinho do Oriente. Evento solidário com recolha de bens alimentares para a Associação O Companheiro.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-17T16:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.767,
      longitude: -9.094,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Parque+Ribeirinho+do+Oriente+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-adeptos-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-17T15:30:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title:
        "10ª Corrida dos Adeptos e Simpatizantes - Memorial Arons de Carvalho",
      description: `10ª edição da Corrida dos Adeptos e Simpatizantes do Sport Lisboa e Benfica - Memorial Arons de Carvalho. Percurso pela Av. Infante D. Henrique, zona oriental de Lisboa, com partida e chegada no Parque Ribeirinho do Oriente. Evento solidário com recolha de bens alimentares para a Associação O Companheiro.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-17T16:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.767,
      longitude: -9.094,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Parque+Ribeirinho+do+Oriente+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-adeptos-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-17T15:30:00.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations: Array<{
    language: "pt" | "en" | "es" | "fr" | "de" | "it";
    title: string;
    description: string;
    city: string;
    metaTitle: string;
    metaDescription: string;
  }> = [
    {
      language: "pt",
      title:
        "10ª Corrida dos Adeptos e Simpatizantes - Memorial Arons de Carvalho",
      description: `# 🏃‍♂️ 10ª Corrida dos Adeptos e Simpatizantes - Memorial Arons de Carvalho

Bem-vindos à **10ª edição da Corrida dos Adeptos e Simpatizantes do Sport Lisboa e Benfica**, em memória de **Manuel Arons de Carvalho**, figura impar do atletismo nacional.

⚠️ **NOTA IMPORTANTE:** A prova foi **antecipada para 17 de janeiro** (sábado) devido à realização das eleições presidenciais.

## 📅 Data e Local

**Data:** 17 de Janeiro de 2026 (Sábado)  
**Local:** Parque Ribeirinho do Oriente, Lisboa  
**Percurso:** Av. Infante D. Henrique, zona oriental de Lisboa

## 🏃 Provas Disponíveis

### Kids Race 500m
- **Horário:** 15:30
- **Idade:** Até 12 anos (inclusive)
- **Preço:** Consultar site

### Corrida 10km
- **Horário:** 16:00
- **Idade:** +18 anos
- **Percurso:** Parque Ribeirinho do Oriente → Av. Marechal Gomes da Costa → Retorno Decathlon → Av. Infante D. Henrique → Retorno Viaduto Mouzinho de Albuquerque → Meta no Parque

### Mini-Corrida 5km
- **Horário:** 16:00
- **Idade:** +18 anos
- **Percurso:** Parque Ribeirinho do Oriente → Percurso interno → Av. Infante D. Henrique → Retorno Restaurante Beatus → Meta no Parque

### Caminhada 5km
- **Horário:** 16:00
- **Idade:** Todas as idades
- **Percurso:** Mesmo da Mini-Corrida 5km

## 💝 Evento Solidário

**Recolha de Bens Alimentares:**
- Alimentos não perecíveis com validade alargada
- Vestuário em bom estado
- **Destino:** Associação O Companheiro

Um pequeno gesto que valerá muito para tanta gente!

## 📝 Inscrições

**Prazo:** Até 17 de Janeiro às 15:30  

**Extras Disponíveis:**
- 👕 T-shirt técnica: 5,00€
- 👕 T-shirt técnica do teu clube: 5,00€
- 📋 Entrega de dorsal no dia do evento: 3,00€ (se comprado online) / 3,50€ (no local)

Inscreve-te em: [xistarca.pt](https://xistarca.pt/corrida-adeptos-2026)

## 🎁 Kit de Participação

Todos os participantes recebem:
- 🎽 **Dorsal** (com chip para Corrida 10km)
- 🏅 **Medalha de Finisher**
- 🎁 **Ofertas de Patrocinadores**

**IMPORTANTE:** O chip NO dorsal NÃO pode ser dobrado!

## 📦 Levantamento do Kit

### Decathlon Oriente:
- **16 Janeiro (6ª feira):** 10h00 - 20h00
- **17 Janeiro (sábado):** 10h00 - 13h00

### No dia do evento:
- **17 Janeiro (sábado):** 14h30 - 15h30, no local da partida
- **Custo:** 3,00€ (se comprado online) / 3,50€ (sem compra prévia)

**Documentos necessários:**
- Cartão de Cidadão, Passaporte, Carta de Condução ou outro com foto
- Número de dorsal (recebido por email)

💚 **Traz um saco reutilizável** para levares o teu kit. Preserva o meio-ambiente!

## 🏆 Prémios

### Corrida 10km:
- 🥇 **Troféus** para os 3 primeiros classificados de cada escalão

### Mini-Corrida 5km:
- 🥇 **Troféus** para os 3 primeiros classificados masculinos e femininos

**Prazo de levantamento:** Até 30 dias após o evento nas instalações da Xistarca

## 👥 Escalões para 10km

- **Juniores/Seniores:** 18-34 anos
- **Veteranos I:** 35-39 anos
- **Veteranos II:** 40-44 anos
- **Veteranos III:** 45-49 anos
- **Veteranos IV:** 50-54 anos
- **Veteranos V:** 55-59 anos
- **Veteranos VI:** 60-64 anos
- **Veteranos VII:** 65-69 anos
- **Veteranos VIII:** +70 anos

## 💧 Abastecimentos

- **10km:** Água Vimeiro aos 5km e no final
- **5km:** Água Vimeiro no final
- **Kids Race:** Água Vimeiro no final

## 🎒 Bengaleiro

Disponível na zona de partida. **Só serão aceites sacos fechados.** Vestuário individual sem saco será rejeitado.

## 🛡️ Seguro

Todos os participantes inscritos estão cobertos por **seguro de acidentes pessoais** (Decreto Lei nº 10/2009).

**Em caso de acidente:** Comunicar em 3 dias para geral@xistarca.pt

## 📋 Regulamento Importante

### Serão desclassificados concorrentes que:
- ❌ Não efetuem controlo de partida
- ❌ Não cumpram o percurso na totalidade
- ❌ Não levem o dorsal ao peito, bem visível
- ❌ Corram com dorsal/chip de outro concorrente
- ❌ Não respeitem instruções da organização

### Outras Informações:
- **Alterações:** Não aceites no dia do evento
- **Cancelamento:** Sem devolução do valor da inscrição
- **Classificações:** Disponíveis após a prova (geral, masculina, feminina, por escalão)

## 👤 Memorial Manuel Arons de Carvalho

**Manuel Arons de Carvalho** (15/03/1947 - 2014) foi uma figura impar do atletismo nacional que dedicou praticamente toda a sua vida à modalidade. Embora formado em Educação Física, nunca exerceu funções de professor, tendo estado ligado desde sempre ao atletismo:

- **Praticante** nos seus primeiros anos
- **Dirigente** do Sport Lisboa e Benfica
- **Jornalista especializado** durante cinco décadas (até à sua morte)

Esta corrida homenageia o seu legado e contributo inestimável para o atletismo português.

## 👥 Organização

**Organizador:** Xistarca / Sport Lisboa e Benfica

**Patrocinadores:** Água Vimeiro, Decathlon Oriente

---

**Aceitação:** Ao inscreveres-te, aceitas automaticamente este regulamento e assumes a responsabilidade de participação, estando ciente do teu estado de saúde e sentindo-te fisicamente apto.

Vem celebrar o atletismo, a solidariedade e a memória de Arons de Carvalho! 🦅❤️`,
      city: "Lisboa",
      metaTitle:
        "10ª Corrida dos Adeptos e Simpatizantes 2026 | Memorial Arons de Carvalho",
      metaDescription:
        "10ª Corrida dos Adeptos do SL Benfica - Memorial Arons de Carvalho. Kids Race 500m, Corrida 10km, Mini-Corrida e Caminhada 5km. Evento solidário no Parque Ribeirinho do Oriente. 17 Janeiro 2026.",
    },
    {
      language: "en",
      title: "10th Fans and Supporters Race - Arons de Carvalho Memorial",
      description: `# 🏃‍♂️ 10th Fans and Supporters Race - Arons de Carvalho Memorial

Welcome to the **10th edition of the Sport Lisboa e Benfica Fans and Supporters Race**, in memory of **Manuel Arons de Carvalho**, a unique figure in Portuguese athletics.

⚠️ **IMPORTANT NOTE:** The race has been **moved forward to January 17** (Saturday) due to presidential elections.

## 📅 Date and Location

**Date:** January 17, 2026 (Saturday)  
**Location:** Parque Ribeirinho do Oriente, Lisbon  
**Course:** Av. Infante D. Henrique, eastern Lisbon

## 🏃 Available Races

### Kids Race 500m
- **Time:** 15:30
- **Age:** Up to 12 years (inclusive)
- **Price:** Check website

### 10km Race
- **Time:** 16:00
- **Age:** 18+ years
- **Course:** Parque Ribeirinho do Oriente → Av. Marechal Gomes da Costa → Decathlon turnaround → Av. Infante D. Henrique → Mouzinho de Albuquerque Viaduct turnaround → Finish at Park

### 5km Mini-Race
- **Time:** 16:00
- **Age:** 18+ years
- **Course:** Parque Ribeirinho do Oriente → Internal course → Av. Infante D. Henrique → Beatus Restaurant turnaround → Finish at Park

### 5km Walk
- **Time:** 16:00
- **Age:** All ages
- **Course:** Same as 5km Mini-Race

## 💝 Solidarity Event

**Food Collection:**
- Non-perishable food with extended expiry
- Clothing in good condition
- **Destination:** O Companheiro Association

A small gesture that means a lot to many people!

## 📝 Registration

**Deadline:** Until January 17 at 15:30  

**Available Extras:**
- 👕 Technical shirt: €5.00
- 👕 Your club's technical shirt: €5.00
- 📋 Race day bib pickup: €3.00 (if bought online) / €3.50 (on-site)

Register at: [xistarca.pt](https://xistarca.pt/corrida-adeptos-2026)

## 🎁 Participation Kit

All participants receive:
- 🎽 **Race Bib** (with chip for 10km Race)
- 🏅 **Finisher Medal**
- 🎁 **Sponsor Gifts**

**IMPORTANT:** The chip on the bib CANNOT be folded!

## 📦 Kit Pickup

### Decathlon Oriente:
- **January 16 (Friday):** 10:00 - 20:00
- **January 17 (Saturday):** 10:00 - 13:00

### On race day:
- **January 17 (Saturday):** 14:30 - 15:30, at start location
- **Cost:** €3.00 (if bought online) / €3.50 (without prior purchase)

**Required documents:**
- ID Card, Passport, Driver's License or other with photo
- Bib number (received by email)

💚 **Bring a reusable bag** for your kit. Protect the environment!

## 🏆 Prizes

### 10km Race:
- 🥇 **Trophies** for top 3 finishers in each age category

### 5km Mini-Race:
- 🥇 **Trophies** for top 3 male and female finishers

**Pickup deadline:** Up to 30 days after event at Xistarca facilities

## 👥 Age Categories for 10km

- **Juniors/Seniors:** 18-34 years
- **Veterans I:** 35-39 years
- **Veterans II:** 40-44 years
- **Veterans III:** 45-49 years
- **Veterans IV:** 50-54 years
- **Veterans V:** 55-59 years
- **Veterans VI:** 60-64 years
- **Veterans VII:** 65-69 years
- **Veterans VIII:** 70+ years

## 💧 Aid Stations

- **10km:** Vimeiro Water at 5km and finish
- **5km:** Vimeiro Water at finish
- **Kids Race:** Vimeiro Water at finish

## 🎒 Bag Drop

Available at start area. **Only closed bags accepted.** Individual clothing without bag will be rejected.

## 🛡️ Insurance

All registered participants are covered by **personal accident insurance** (Decree Law nº 10/2009).

**In case of accident:** Report within 3 days to geral@xistarca.pt

## 📋 Important Rules

### Participants will be disqualified if they:
- ❌ Don't complete start control
- ❌ Don't complete the entire course
- ❌ Don't wear bib on chest, clearly visible
- ❌ Run with another runner's bib/chip
- ❌ Don't respect organization instructions

### Other Information:
- **Changes:** Not accepted on race day
- **Cancellation:** No refund of registration fee
- **Results:** Available after race (overall, male, female, by category)

## 👤 Manuel Arons de Carvalho Memorial

**Manuel Arons de Carvalho** (March 15, 1947 - 2014) was a unique figure in Portuguese athletics who dedicated practically his entire life to the sport. Although trained in Physical Education, he never worked as a teacher, being linked to athletics throughout:

- **Athlete** in his early years
- **Director** at Sport Lisboa e Benfica
- **Specialized journalist** for five decades (until his death)

This race honors his legacy and invaluable contribution to Portuguese athletics.

## 👥 Organization

**Organizer:** Xistarca / Sport Lisboa e Benfica

**Sponsors:** Água Vimeiro, Decathlon Oriente

---

**Acceptance:** By registering, you automatically accept these rules and assume participation responsibility, being aware of your health status and feeling physically fit.

Come celebrate athletics, solidarity and Arons de Carvalho's memory! 🦅❤️`,
      city: "Lisbon",
      metaTitle:
        "10th Fans and Supporters Race 2026 | Arons de Carvalho Memorial",
      metaDescription:
        "10th SL Benfica Fans Race - Arons de Carvalho Memorial. Kids Race 500m, 10km Race, 5km Mini-Race and Walk. Solidarity event at Parque Ribeirinho do Oriente. January 17, 2026.",
    },
    {
      language: "es",
      title:
        "10ª Carrera de Aficionados y Simpatizantes - Memorial Arons de Carvalho",
      description: `# 🏃‍♂️ 10ª Carrera de Aficionados y Simpatizantes - Memorial Arons de Carvalho

Bienvenidos a la **10ª edición de la Carrera de Aficionados y Simpatizantes del Sport Lisboa e Benfica**, en memoria de **Manuel Arons de Carvalho**, figura única del atletismo portugués.

⚠️ **NOTA IMPORTANTE:** La carrera se ha **adelantado al 17 de enero** (sábado) debido a las elecciones presidenciales.

## 📅 Fecha y Ubicación

**Fecha:** 17 de enero de 2026 (sábado)  
**Ubicación:** Parque Ribeirinho do Oriente, Lisboa  
**Recorrido:** Av. Infante D. Henrique, zona oriental de Lisboa

## 🏃 Carreras Disponibles

### Kids Race 500m
- **Horario:** 15:30
- **Edad:** Hasta 12 años (inclusive)

### Carrera 10km
- **Horario:** 16:00
- **Edad:** +18 años

### Mini-Carrera 5km
- **Horario:** 16:00
- **Edad:** +18 años

### Caminata 5km
- **Horario:** 16:00
- **Edad:** Todas las edades

## 💝 Evento Solidario

**Recogida de Alimentos:**
- Alimentos no perecederos con validez ampliada
- Ropa en buen estado
- **Destino:** Asociación O Companheiro

¡Un pequeño gesto que vale mucho para tanta gente!

## 📝 Inscripciones

**Plazo:** Hasta el 17 de enero a las 15:30  

**Extras Disponibles:**
- 👕 Camiseta técnica: 5,00€
- 👕 Camiseta técnica de tu club: 5,00€
- 📋 Entrega de dorsal el día del evento: 3,00€

Inscríbete en: [xistarca.pt](https://xistarca.pt/corrida-adeptos-2026)

## 🎁 Kit de Participación

Todos los participantes reciben:
- 🎽 **Dorsal** (con chip para Carrera 10km)
- 🏅 **Medalla de Finisher**
- 🎁 **Regalos de Patrocinadores**

## 🏆 Premios

### Carrera 10km:
- 🥇 **Trofeos** para los 3 primeros clasificados de cada categoría

### Mini-Carrera 5km:
- 🥇 **Trofeos** para los 3 primeros clasificados masculinos y femeninos

## 👥 Organización

**Organizador:** Xistarca / Sport Lisboa e Benfica

¡Ven a celebrar el atletismo y la solidaridad! 🦅❤️`,
      city: "Lisboa",
      metaTitle: "10ª Carrera de Aficionados 2026 | Memorial Arons de Carvalho",
      metaDescription:
        "10ª Carrera de Aficionados del SL Benfica - Memorial Arons de Carvalho. Kids Race 500m, Carrera 10km, Mini-Carrera y Caminata 5km. Evento solidario. 17 enero 2026.",
    },
    {
      language: "fr",
      title: "10ème Course des Supporters - Mémorial Arons de Carvalho",
      description: `# 🏃‍♂️ 10ème Course des Supporters - Mémorial Arons de Carvalho

Bienvenue à la **10ème édition de la Course des Supporters du Sport Lisboa e Benfica**, en mémoire de **Manuel Arons de Carvalho**, figure unique de l'athlétisme portugais.

⚠️ **NOTE IMPORTANTE:** La course a été **avancée au 17 janvier** (samedi) en raison des élections présidentielles.

## 📅 Date et Lieu

**Date :** 17 janvier 2026 (samedi)  
**Lieu :** Parque Ribeirinho do Oriente, Lisbonne  
**Parcours :** Av. Infante D. Henrique, zone orientale de Lisbonne

## 🏃 Courses Disponibles

### Kids Race 500m
- **Horaire :** 15h30
- **Âge :** Jusqu'à 12 ans (inclus)

### Course 10km
- **Horaire :** 16h00
- **Âge :** +18 ans

### Mini-Course 5km
- **Horaire :** 16h00
- **Âge :** +18 ans

### Marche 5km
- **Horaire :** 16h00
- **Âge :** Tous les âges

## 💝 Événement Solidaire

**Collecte Alimentaire :**
- Aliments non périssables avec validité étendue
- Vêtements en bon état
- **Destination :** Association O Companheiro

Un petit geste qui compte beaucoup pour tant de gens !

## 📝 Inscriptions

**Date limite :** Jusqu'au 17 janvier à 15h30  

**Extras Disponibles :**
- 👕 T-shirt technique : 5,00€
- 👕 T-shirt technique de votre club : 5,00€
- 📋 Retrait du dossard le jour de l'événement : 3,00€

Inscrivez-vous sur : [xistarca.pt](https://xistarca.pt/corrida-adeptos-2026)

## 🎁 Kit de Participation

Tous les participants reçoivent :
- 🎽 **Dossard** (avec puce pour Course 10km)
- 🏅 **Médaille de Finisher**
- 🎁 **Cadeaux des Sponsors**

## 🏆 Prix

### Course 10km :
- 🥇 **Trophées** pour les 3 premiers de chaque catégorie

### Mini-Course 5km :
- 🥇 **Trophées** pour les 3 premiers masculins et féminins

## 👥 Organisation

**Organisateur :** Xistarca / Sport Lisboa e Benfica

Venez célébrer l'athlétisme et la solidarité ! 🦅❤️`,
      city: "Lisbonne",
      metaTitle:
        "10ème Course des Supporters 2026 | Mémorial Arons de Carvalho",
      metaDescription:
        "10ème Course des Supporters du SL Benfica - Mémorial Arons de Carvalho. Kids Race 500m, Course 10km, Mini-Course et Marche 5km. Événement solidaire. 17 janvier 2026.",
    },
    {
      language: "de",
      title: "10. Fans- und Unterstützerlauf - Arons de Carvalho Gedenkrennen",
      description: `# 🏃‍♂️ 10. Fans- und Unterstützerlauf - Arons de Carvalho Gedenkrennen

Willkommen zur **10. Ausgabe des Fans- und Unterstützerlaufs von Sport Lisboa e Benfica**, zum Gedenken an **Manuel Arons de Carvalho**, eine einzigartige Figur der portugiesischen Leichtathletik.

⚠️ **WICHTIGER HINWEIS:** Das Rennen wurde auf den **17. Januar** (Samstag) vorverlegt aufgrund der Präsidentschaftswahlen.

## 📅 Datum und Ort

**Datum:** 17. Januar 2026 (Samstag)  
**Ort:** Parque Ribeirinho do Oriente, Lissabon  
**Strecke:** Av. Infante D. Henrique, östliches Lissabon

## 🏃 Verfügbare Rennen

### Kids Race 500m
- **Zeit:** 15:30
- **Alter:** Bis 12 Jahre (einschließlich)

### 10km Lauf
- **Zeit:** 16:00
- **Alter:** 18+ Jahre

### 5km Mini-Lauf
- **Zeit:** 16:00
- **Alter:** 18+ Jahre

### 5km Wanderung
- **Zeit:** 16:00
- **Alter:** Alle Altersgruppen

## 💝 Solidaritätsveranstaltung

**Lebensmittelsammlung:**
- Haltbare Lebensmittel mit verlängertem Verfallsdatum
- Kleidung in gutem Zustand
- **Ziel:** Verein O Companheiro

Eine kleine Geste, die für viele Menschen viel bedeutet!

## 📝 Anmeldung

**Frist:** Bis 17. Januar um 15:30  

**Verfügbare Extras:**
- 👕 Technisches Shirt: 5,00€
- 👕 Technisches Shirt deines Vereins: 5,00€
- 📋 Startnummernabholung am Veranstaltungstag: 3,00€

Anmeldung unter: [xistarca.pt](https://xistarca.pt/corrida-adeptos-2026)

## 🎁 Teilnahme-Kit

Alle Teilnehmer erhalten:
- 🎽 **Startnummer** (mit Chip für 10km Lauf)
- 🏅 **Finisher-Medaille**
- 🎁 **Sponsorengeschenke**

## 🏆 Preise

### 10km Lauf:
- 🥇 **Trophäen** für die Top 3 jeder Alterskategorie

### 5km Mini-Lauf:
- 🥇 **Trophäen** für die Top 3 männlich und weiblich

## 👥 Organisation

**Veranstalter:** Xistarca / Sport Lisboa e Benfica

Komm und feiere Leichtathletik und Solidarität! 🦅❤️`,
      city: "Lissabon",
      metaTitle:
        "10. Fans- und Unterstützerlauf 2026 | Arons de Carvalho Gedenkrennen",
      metaDescription:
        "10. Fans-Lauf des SL Benfica - Arons de Carvalho Gedenkrennen. Kids Race 500m, 10km Lauf, 5km Mini-Lauf und Wanderung. Solidaritätsveranstaltung. 17. Januar 2026.",
    },
    {
      language: "it",
      title: "10ª Corsa dei Tifosi e Sostenitori - Memorial Arons de Carvalho",
      description: `# 🏃‍♂️ 10ª Corsa dei Tifosi e Sostenitori - Memorial Arons de Carvalho

Benvenuti alla **10ª edizione della Corsa dei Tifosi e Sostenitori dello Sport Lisboa e Benfica**, in memoria di **Manuel Arons de Carvalho**, figura unica dell'atletica portoghese.

⚠️ **NOTA IMPORTANTE:** La gara è stata **anticipata al 17 gennaio** (sabato) a causa delle elezioni presidenziali.

## 📅 Data e Luogo

**Data:** 17 gennaio 2026 (sabato)  
**Luogo:** Parque Ribeirinho do Oriente, Lisbona  
**Percorso:** Av. Infante D. Henrique, zona orientale di Lisbona

## 🏃 Gare Disponibili

### Kids Race 500m
- **Orario:** 15:30
- **Età:** Fino a 12 anni (incluso)

### Corsa 10km
- **Orario:** 16:00
- **Età:** +18 anni

### Mini-Corsa 5km
- **Orario:** 16:00
- **Età:** +18 anni

### Camminata 5km
- **Orario:** 16:00
- **Età:** Tutte le età

## 💝 Evento Solidale

**Raccolta Alimentare:**
- Alimenti non deperibili con validità estesa
- Abbigliamento in buone condizioni
- **Destinazione:** Associazione O Companheiro

Un piccolo gesto che vale molto per tante persone!

## 📝 Iscrizioni

**Scadenza:** Fino al 17 gennaio alle 15:30  

**Extra Disponibili:**
- 👕 Maglietta tecnica: 5,00€
- 👕 Maglietta tecnica del tuo club: 5,00€
- 📋 Ritiro pettorale il giorno dell'evento: 3,00€

Iscriviti su: [xistarca.pt](https://xistarca.pt/corrida-adeptos-2026)

## 🎁 Kit di Partecipazione

Tutti i partecipanti ricevono:
- 🎽 **Pettorale** (con chip per Corsa 10km)
- 🏅 **Medaglia di Finisher**
- 🎁 **Regali degli Sponsor**

## 🏆 Premi

### Corsa 10km:
- 🥇 **Trofei** per i primi 3 di ogni categoria

### Mini-Corsa 5km:
- 🥇 **Trofei** per i primi 3 maschili e femminili

## 👥 Organizzazione

**Organizzatore:** Xistarca / Sport Lisboa e Benfica

Vieni a celebrare l'atletica e la solidarietà! 🦅❤️`,
      city: "Lisbona",
      metaTitle: "10ª Corsa dei Tifosi 2026 | Memorial Arons de Carvalho",
      metaDescription:
        "10ª Corsa dei Tifosi del SL Benfica - Memorial Arons de Carvalho. Kids Race 500m, Corsa 10km, Mini-Corsa e Camminata 5km. Evento solidale. 17 gennaio 2026.",
    },
  ];

  for (const translation of translations) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: translation.language,
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
        language: translation.language,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  console.log(
    "✅ Event translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Find or create variants
  const variants = [
    {
      name: "Kids Race 500m",
      distanceKm: 0.5,
      price: 0.0,
      startTime: "15:30",
    },
    {
      name: "Corrida 10km",
      distanceKm: 10,
      price: 0.0,
      startTime: "16:00",
    },
    {
      name: "Mini-Corrida 5km",
      distanceKm: 5,
      price: 0.0,
      startTime: "16:00",
    },
    {
      name: "Caminhada 5km",
      distanceKm: 5,
      price: 0.0,
      startTime: "16:00",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existing) {
      variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    }

    console.log(
      `✅ Variant ${existing ? "updated" : "created"}: ${variant.name}`
    );
  }

  console.log("");
  console.log(
    "🎉 10ª Corrida dos Adeptos e Simpatizantes 2026 seeded successfully!"
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
