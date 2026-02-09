/**
 * Seed: IV Maratona BTT Cidade de Tavira 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding IV Maratona BTT Cidade de Tavira 2026...");

  const eventSlug = "maratona-cidade-tavira-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "IV Maratona BTT Cidade de Tavira",
      description:
        "IV Maratona BTT Cidade de Tavira. Prova aberta competitiva amador com Maratona 50km e Meia-Maratona 35km. Organizado pelo Clube de Vela de Tavira. E-Bikes permitidas.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-03T09:00:00.000Z"),
      endDate: null,
      city: "Tavira",
      country: "Portugal",
      latitude: 37.1267,
      longitude: -7.6481,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Tavira+Faro+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4200/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-27T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "IV Maratona BTT Cidade de Tavira",
      description:
        "IV Maratona BTT Cidade de Tavira. Prova aberta competitiva amador com Maratona 50km e Meia-Maratona 35km. Organizado pelo Clube de Vela de Tavira. E-Bikes permitidas.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-03T09:00:00.000Z"),
      endDate: null,
      city: "Tavira",
      country: "Portugal",
      latitude: 37.1267,
      longitude: -7.6481,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Tavira+Faro+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4200/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-27T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "IV Maratona BTT Cidade de Tavira",
      city: "Tavira",
      metaTitle: "IV Maratona BTT Cidade de Tavira 2026 | Faro | 3 Maio",
      metaDescription:
        "IV Maratona BTT Cidade de Tavira 2026 - 3 maio. Maratona 50km e Meia 35km. Prova competitiva amador. E-Bikes permitidas. T-shirt e almoço incluídos. Limite 400 participantes. Inscrição: 15€.",
      description: `# 🚴 IV Maratona BTT Cidade de Tavira 2026

A **IV Maratona BTT Cidade de Tavira** é uma **prova aberta com carácter competitivo amador**, organizada pelo **Clube de Vela de Tavira** (Entidade de Utilidade Pública).

## 📅 Data e Programa

**Data:** Domingo, 3 de maio de 2026

**Sábado (2 de Maio):**
- 15:00-19:00 - Abertura do secretariado (Parque de Feiras e Exposições)

**Domingo (3 de Maio):**
- 07:30 - Abertura do secretariado
- 08:30 - Início do Controlo "km 0"
- 08:30 - Encerramento do secretariado
- 08:45 - Encerramento do Controlo "km 0" e Briefing
- 08:50 - Partida E-Bikes
- 09:00 - Partida Maratona e Meia-Maratona
- 11:00 - Chegada prevista 1º atleta Meia-Maratona
- 12:30 - Início dos almoços
- 12:30 - Chegada prevista 1º atleta Maratona
- 14:00 - Limite máximo para terminar
- 15:00 - Encerramento do controlo de chegadas
- 15:00 - Entrega de prémios
- 20:00 - Classificações no site A Pedalar

## 🚴 Percursos

### Maratona 50 km
Prova competitiva amadora com classificação por escalões. E-Bikes partem 10 minutos antes.

**Dorsal:** Branco

### Meia-Maratona 35 km
Percurso intermédio com classificação por escalões. E-Bikes partem 10 minutos antes.

**Dorsal:** Verde

## 🏆 Escalões

### Masculinos
- Sub 19 (≤19 anos)
- Elite (19-29)
- Masters 30 (30-39)
- Masters 40 (40-49)
- Masters 50 (50-59)
- Masters 60 (60-69)
- Masters 70 (70-79)
- Masters 80 (≥80)
- E-Bikes

### Femininos
- Sub 19 (≤19 anos)
- Elite (19-29)
- Masters 30 (30-39)
- Masters 40 (40-49)
- Masters 50 (50-59)
- Masters 60 (60-69)
- Masters 70 (70-79)
- Masters 80 (≥80)
- E-Bikes

## 🎁 Inscrição Inclui

- ✅ Dorsal de participação
- ✅ **T-Shirt oficial**
- ✅ Seguro de Acidentes Pessoais e RC
- ✅ Zonas de reabastecimento (2 na Maratona, 1 na Meia)
- ✅ Zona de lavagem de bicicletas
- ✅ **Banhos quentes** (Pavilhão Municipal)
- ✅ Viatura de apoio e emergência
- ✅ Brindes
- ✅ **Almoço** (se seleccionado)

## 💰 Preços

- **Inscrição Prova:** 15€
- **Almoço (opcional):** 15€
- **Acompanhante (almoço):** 15€

## 🏁 Prémios

**Prémios/brindes** para os **3 primeiros classificados** de cada categoria (Masculino e Feminino) em cada distância.

## 👥 Participação

- **Limite:** 400 participantes + 25 convites da organização
- **Idade mínima:** 15 anos (nascidos até 2011)
- **Menores:** Termo de Responsabilidade obrigatório

## ⚙️ Regras Importantes

- **Capacete obrigatório** homologado
- **E-Bikes** partem 10 minutos antes (08:50)
- **Partida em grupo** com andamento controlado até 2km
- **Limite de chegada:** 14:00
- Percursos marcados com **cal e placas**
- **Controlo km 0** obrigatório
- Não é permitido circular em **sentido inverso**

## 📍 Localização

**Partida/Chegada:**
Parque de Feiras e Exposições de Tavira
Rua General José de Chelmicki, S/N
Tavira

**Balneários:**
Pavilhão Municipal de Tavira

## 📞 Contactos

- **Secretaria:** 968 929 615
- **Bruno Pereira:** 962 437 730
- **Email:** cvela.tavira1975@gmail.com

## ♻️ Responsabilidade Ambiental

**É expressamente proibido** o descarte de lixo fora das zonas indicadas. Atletas identificados podem ser **desclassificados**.

## 📋 Seguro

Seguro de Acidentes Pessoais e Responsabilidade Civil pela **Fidelidade** para todos os participantes.`,
    },
    {
      language: "en" as const,
      title: "IV Tavira City MTB Marathon",
      city: "Tavira",
      metaTitle: "IV Tavira City MTB Marathon 2026 | Faro | May 3",
      metaDescription:
        "IV Tavira City MTB Marathon 2026 - May 3. Marathon 50km and Half 35km. Amateur competitive race. E-Bikes allowed. T-shirt and lunch included. Limit 400 participants. Entry: €15.",
      description: `# 🚴 IV Tavira City MTB Marathon 2026

The **IV Tavira City MTB Marathon** is an **open amateur competitive race** organized by **Clube de Vela de Tavira**.

## 📞 Contacts

- **Secretary:** +351 968 929 615
- **Bruno Pereira:** +351 962 437 730
- **Email:** cvela.tavira1975@gmail.com`,
    },
    {
      language: "es" as const,
      title: "IV Maratón BTT Ciudad de Tavira",
      city: "Tavira",
      metaTitle: "IV Maratón BTT Ciudad de Tavira 2026 | Faro | 3 Mayo",
      metaDescription:
        "IV Maratón BTT Ciudad de Tavira 2026 - 3 mayo. Maratón 50km y Media 35km. Prueba competitiva amateur. E-Bikes permitidas. Camiseta y almuerzo incluidos. Límite 400 participantes. Inscripción: 15€.",
      description: `# 🚴 IV Maratón BTT Ciudad de Tavira 2026

## 📞 Contactos

- **Secretaría:** +351 968 929 615
- **Bruno Pereira:** +351 962 437 730
- **Email:** cvela.tavira1975@gmail.com`,
    },
    {
      language: "fr" as const,
      title: "IV Marathon VTT Ville de Tavira",
      city: "Tavira",
      metaTitle: "IV Marathon VTT Ville de Tavira 2026 | Faro | 3 Mai",
      metaDescription:
        "IV Marathon VTT Ville de Tavira 2026 - 3 mai. Marathon 50km et Semi 35km. Course compétitive amateur. E-Bikes autorisés. T-shirt et déjeuner inclus. Limite 400 participants. Inscription: 15€.",
      description: `# 🚴 IV Marathon VTT Ville de Tavira 2026

## 📞 Contacts

- **Secrétariat:** +351 968 929 615
- **Bruno Pereira:** +351 962 437 730
- **Email:** cvela.tavira1975@gmail.com`,
    },
    {
      language: "de" as const,
      title: "IV Tavira Stadt MTB Marathon",
      city: "Tavira",
      metaTitle: "IV Tavira Stadt MTB Marathon 2026 | Faro | 3. Mai",
      metaDescription:
        "IV Tavira Stadt MTB Marathon 2026 - 3. Mai. Marathon 50km und Halb 35km. Amateur-Wettkampf. E-Bikes erlaubt. T-Shirt und Mittagessen inklusive. Limit 400 Teilnehmer. Anmeldung: 15€.",
      description: `# 🚴 IV Tavira Stadt MTB Marathon 2026

## 📞 Kontakte

- **Sekretariat:** +351 968 929 615
- **Bruno Pereira:** +351 962 437 730
- **Email:** cvela.tavira1975@gmail.com`,
    },
    {
      language: "it" as const,
      title: "IV Maratona MTB Città di Tavira",
      city: "Tavira",
      metaTitle: "IV Maratona MTB Città di Tavira 2026 | Faro | 3 Maggio",
      metaDescription:
        "IV Maratona MTB Città di Tavira 2026 - 3 maggio. Maratona 50km e Mezza 35km. Gara competitiva amatoriale. E-Bikes consentite. Maglietta e pranzo inclusi. Limite 400 partecipanti. Iscrizione: 15€.",
      description: `# 🚴 IV Maratona MTB Città di Tavira 2026

## 📞 Contatti

- **Segreteria:** +351 968 929 615
- **Bruno Pereira:** +351 962 437 730
- **Email:** cvela.tavira1975@gmail.com`,
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

  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm?: number;
    elevationGainM?: number;
    startTime?: string;
    maxParticipants?: number;
    price?: number;
    currency?: Currency;
  }) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name: variantData.name },
    });
    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data: variantData,
      });
    }
    return await prisma.eventVariant.create({
      data: { eventId: event.id, ...variantData },
    });
  };

  await findOrCreateVariant({
    name: "Meia-Maratona 35 km",
    distanceKm: 35,
    elevationGainM: 500,
    startTime: "09:00",
    maxParticipants: 200,
    price: 15.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Maratona 50 km",
    distanceKm: 50,
    elevationGainM: 800,
    startTime: "09:00",
    maxParticipants: 200,
    price: 15.0,
    currency: Currency.EUR,
  });

  console.log("✅ IV Maratona BTT Cidade de Tavira 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
