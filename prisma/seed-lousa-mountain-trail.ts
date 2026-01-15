import { PrismaClient, SportType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Lousa Mountain Trail...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "lousa-mountain-trail-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing Lousa Mountain Trail event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: "Lousa Mountain Trail",
      slug: "lousa-mountain-trail-2026",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-01-25T09:00:00.000Z"),
      registrationDeadline: new Date("2026-01-18T23:59:00.000Z"),
      city: "Lousa",
      country: "Portugal",
      latitude: 38.88996908836991,
      longitude: -9.207368764103732,
      googleMapsUrl: "https://maps.app.goo.gl/tpKVsPCvYvpHFYGb6",
      description: `# Lousa Mountain Trail 2026

O **Lousa Mountain Trail** é um evento organizado pela **Junta de Freguesia de Lousa**, em colaboração com a entidade **Trail4U**, que se realiza na localidade de Lousa, Concelho de Loures.

## 📍 Local da Partida

**Sede do Grupo Desportivo de Lousa**
Rua Heróis Ultramar, 2670-759 Lousa

## 🏃 Provas Disponíveis

### Trail Longo 23km
- **Distância:** 23km
- **Partida:** 09h00
- **Idade Mínima:** 18 anos

### Trail Curto 13km
- **Distância:** 13km
- **Partida:** 09h00
- **Idade Mínima:** 18 anos

### Caminhada 8km
- **Distância:** 8km
- **Partida:** 09h05
- **Nota:** Sem carácter competitivo

## 🎯 Material e Serviços Incluídos

Todos os participantes recebem:

✅ Buff / Gola oficial
✅ Dorsal com chip incluído (Trail Longo e Trail Curto)
✅ Dorsal sem chip (Caminhada)
✅ Seguro desportivo
✅ Apoio logístico e técnico
✅ Primeiros socorros
✅ Abastecimentos sólidos e líquidos nas zonas de assistência e no final da prova
✅ Outros brindes que a organização possa angariar

## 🏆 Prémios

### Trail Longo e Trail Curto
- Prémios aos **3 primeiros classificados** da geral masculina e feminina
- Prémios por escalão

### Equipa
- Prémio para a equipa com maior número de participantes no global das três provas

### Caminhada
- Sem carácter competitivo, não terá direito a prémios

## 📋 Escalões de Participação

- **Sub23 M/F:** 18 aos 22 anos
- **Seniores M/F:** 23 aos 39 anos
- **Veteranos M/F 40:** 40 aos 44 anos
- **Veteranos M/F 45:** 45 aos 49 anos
- **Veteranos M/F 50:** 50 aos 54 anos
- **Veteranos M/F 55:** 55 aos 59 anos
- **Veteranos M/F 60:** 60 aos 64 anos
- **Veteranos M/F 65:** 65 aos 69 anos
- **Veteranos M/F 70:** 70 anos ou mais

*Nota: A data de referência dos escalões é o dia do evento*

## 📅 Programa

**25 de Janeiro de 2026**
- 07h00 - Abertura do secretariado
- 09h00 - Partida Trail Longo 23km e Trail Curto 13km
- 09h05 - Partida Caminhada 8km
- 12h30 - Entrega prevista dos troféus

## 📦 Inscrição

**Limite de inscrições:** 850 participantes

**Modo de inscrição:**
Preencher formulário de inscrição e efetuar pagamento por MB Way ou Ref. Multibanco no Multibanco ou homebanking através da opção "Pagamento de Serviços". Estas opções de pagamento têm validade máxima de 3 dias.

## 📞 Contactos

**Organização:**
- Email: trail4uevents@gmail.com
- Email: infotrilhoperdido@gmail.com (inscrições)
- Telefone: 969 463 510 (rede móvel nacional)

## 👥 Organização

**Organizadores:**
- Junta de Freguesia de Lousa
- Trail4U

**Cronometragem:**
- Trilho Perdido

---

⚠️ **A inscrição implica total aceitação do regulamento da prova.**`,
      externalUrl: "https://www.trilhoperdido.com",
      variants: {
        create: [
          // Trail Longo 23km
          {
            name: "Trail Longo 23km",
            distanceKm: 23,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "09:00",
            startDate: new Date("2026-01-25T09:00:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-09-15T00:00:00.000Z"),
                  endDate: new Date("2025-11-14T23:59:59.000Z"),
                  price: 16.0,
                  discountPercent: null,
                  note: "15 Set - 14 Nov 2025",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-11-15T00:00:00.000Z"),
                  endDate: new Date("2025-12-15T23:59:59.000Z"),
                  price: 18.0,
                  discountPercent: null,
                  note: "15 Nov - 15 Dez 2025",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2025-12-16T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.000Z"),
                  price: 20.0,
                  discountPercent: null,
                  note: "16 Dez 2025 - 18 Jan 2026",
                },
              ],
            },
          },
          // Trail Curto 13km
          {
            name: "Trail Curto 13km",
            distanceKm: 13,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "09:00",
            startDate: new Date("2026-01-25T09:00:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-09-15T00:00:00.000Z"),
                  endDate: new Date("2025-11-14T23:59:59.000Z"),
                  price: 14.0,
                  discountPercent: null,
                  note: "15 Set - 14 Nov 2025",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-11-15T00:00:00.000Z"),
                  endDate: new Date("2025-12-15T23:59:59.000Z"),
                  price: 16.0,
                  discountPercent: null,
                  note: "15 Nov - 15 Dez 2025",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2025-12-16T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.000Z"),
                  price: 18.0,
                  discountPercent: null,
                  note: "16 Dez 2025 - 18 Jan 2026",
                },
              ],
            },
          },
          // Caminhada 8km
          {
            name: "Caminhada 8km",
            distanceKm: 8,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "09:05",
            startDate: new Date("2026-01-25T09:05:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-09-15T00:00:00.000Z"),
                  endDate: new Date("2025-11-14T23:59:59.000Z"),
                  price: 11.0,
                  discountPercent: null,
                  note: "15 Set - 14 Nov 2025 - Sem cronometragem",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-11-15T00:00:00.000Z"),
                  endDate: new Date("2025-12-15T23:59:59.000Z"),
                  price: 12.0,
                  discountPercent: null,
                  note: "15 Nov - 15 Dez 2025 - Sem cronometragem",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2025-12-16T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.000Z"),
                  price: 13.0,
                  discountPercent: null,
                  note: "16 Dez 2025 - 18 Jan 2026 - Sem cronometragem",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created event: Lousa Mountain Trail");
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(`   - Location: ${event.latitude}, ${event.longitude}`);
  console.log(
    `   - Variants: 3 (Trail Longo 23km, Trail Curto 13km, Caminhada 8km)`
  );

  // Add translations
  console.log("🌍 Adding translations...");

  const translations = {
    en: {
      title: "Lousa Mountain Trail",
      description: `# Lousa Mountain Trail 2026

The **Lousa Mountain Trail** is an event organized by the **Lousa Parish Council**, in collaboration with **Trail4U**, held in Lousa, Loures County.

## 📍 Start Location

**Lousa Sports Group Headquarters**
Rua Heróis Ultramar, 2670-759 Lousa

## 🏃 Available Races

### Long Trail 23km
- **Distance:** 23km
- **Start:** 09:00
- **Minimum Age:** 18 years

### Short Trail 13km
- **Distance:** 13km
- **Start:** 09:00
- **Minimum Age:** 18 years

### Walk 8km
- **Distance:** 8km
- **Start:** 09:05
- **Note:** Non-competitive

Registration includes official buff/neck warmer, race number, insurance, and refreshments.`,
      city: "Lousa",
      metaTitle: "Lousa Mountain Trail 2026 - Trail Running Event in Portugal",
      metaDescription:
        "Trail running event in Lousa with 23km and 13km races, plus 8km walk. January 25, 2026. Registration open!",
    },
    es: {
      title: "Lousa Mountain Trail",
      description: `# Lousa Mountain Trail 2026

El **Lousa Mountain Trail** es un evento organizado por la **Junta de Freguesia de Lousa**, en colaboración con **Trail4U**, que se celebra en Lousa, Concejo de Loures.

## 📍 Lugar de Salida

**Sede del Grupo Deportivo de Lousa**
Rua Heróis Ultramar, 2670-759 Lousa

## 🏃 Carreras Disponibles

### Trail Largo 23km
- **Distancia:** 23km
- **Salida:** 09h00
- **Edad Mínima:** 18 años

### Trail Corto 13km
- **Distancia:** 13km
- **Salida:** 09h00
- **Edad Mínima:** 18 años

### Caminata 8km
- **Distancia:** 8km
- **Salida:** 09h05
- **Nota:** Sin carácter competitivo

La inscripción incluye buff/braga oficial, dorsal, seguro y avituallamientos.`,
      city: "Lousa",
      metaTitle: "Lousa Mountain Trail 2026 - Carrera de Trail en Portugal",
      metaDescription:
        "Evento de trail running en Lousa con carreras de 23km y 13km, más caminata de 8km. 25 de enero de 2026. ¡Inscripciones abiertas!",
    },
    fr: {
      title: "Lousa Mountain Trail",
      description: `# Lousa Mountain Trail 2026

Le **Lousa Mountain Trail** est un événement organisé par la **Paroisse de Lousa**, en collaboration avec **Trail4U**, qui se déroule à Lousa, Concelho de Loures.

## 📍 Lieu de Départ

**Siège du Groupe Sportif de Lousa**
Rua Heróis Ultramar, 2670-759 Lousa

## 🏃 Courses Disponibles

### Trail Long 23km
- **Distance:** 23km
- **Départ:** 09h00
- **Âge Minimum:** 18 ans

### Trail Court 13km
- **Distance:** 13km
- **Départ:** 09h00
- **Âge Minimum:** 18 ans

### Randonnée 8km
- **Distance:** 8km
- **Départ:** 09h05
- **Note:** Sans caractère compétitif

L'inscription comprend buff/tour de cou officiel, dossard, assurance et ravitaillements.`,
      city: "Lousa",
      metaTitle: "Lousa Mountain Trail 2026 - Course de Trail au Portugal",
      metaDescription:
        "Événement de trail running à Lousa avec courses de 23km et 13km, plus randonnée de 8km. 25 janvier 2026. Inscriptions ouvertes!",
    },
    de: {
      title: "Lousa Mountain Trail",
      description: `# Lousa Mountain Trail 2026

Der **Lousa Mountain Trail** ist eine Veranstaltung der **Gemeinde Lousa** in Zusammenarbeit mit **Trail4U** in Lousa, Kreis Loures.

## 📍 Startort

**Sportgruppe Lousa Hauptquartier**
Rua Heróis Ultramar, 2670-759 Lousa

## 🏃 Verfügbare Rennen

### Langer Trail 23km
- **Distanz:** 23km
- **Start:** 09:00 Uhr
- **Mindestalter:** 18 Jahre

### Kurzer Trail 13km
- **Distanz:** 13km
- **Start:** 09:00 Uhr
- **Mindestalter:** 18 Jahre

### Wanderung 8km
- **Distanz:** 8km
- **Start:** 09:05 Uhr
- **Hinweis:** Nicht wettkampfmäßig

Die Anmeldung umfasst offizielles Buff/Halstuch, Startnummer, Versicherung und Verpflegung.`,
      city: "Lousa",
      metaTitle: "Lousa Mountain Trail 2026 - Trail-Running-Event in Portugal",
      metaDescription:
        "Trail-Running-Veranstaltung in Lousa mit 23km und 13km Rennen, plus 8km Wanderung. 25. Januar 2026. Anmeldung offen!",
    },
    it: {
      title: "Lousa Mountain Trail",
      description: `# Lousa Mountain Trail 2026

Il **Lousa Mountain Trail** è un evento organizzato dalla **Parrocchia di Lousa**, in collaborazione con **Trail4U**, che si svolge a Lousa, Concelho de Loures.

## 📍 Luogo di Partenza

**Sede del Gruppo Sportivo di Lousa**
Rua Heróis Ultramar, 2670-759 Lousa

## 🏃 Gare Disponibili

### Trail Lungo 23km
- **Distanza:** 23km
- **Partenza:** 09:00
- **Età Minima:** 18 anni

### Trail Corto 13km
- **Distanza:** 13km
- **Partenza:** 09:00
- **Età Minima:** 18 anni

### Camminata 8km
- **Distanza:** 8km
- **Partenza:** 09:05
- **Nota:** Senza carattere competitivo

L'iscrizione include buff/scaldacollo ufficiale, pettorale, assicurazione e ristori.`,
      city: "Lousa",
      metaTitle:
        "Lousa Mountain Trail 2026 - Evento Trail Running in Portogallo",
      metaDescription:
        "Evento di trail running a Lousa con gare di 23km e 13km, più camminata di 8km. 25 gennaio 2026. Iscrizioni aperte!",
    },
  };

  for (const [lang, trans] of Object.entries(translations)) {
    await prisma.eventTranslation.create({
      data: {
        eventId: event.id,
        language: lang as Language,
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
    });
    console.log(`   ✅ ${lang.toUpperCase()}`);
  }

  console.log("");
  console.log("🏃 Lousa Mountain Trail seeded successfully with translations!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
