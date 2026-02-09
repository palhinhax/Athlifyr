/**
 * Seed: 39ª Meia Maratona de Cortegaça 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 39ª Meia Maratona de Cortegaça 2026...");

  const eventSlug = "meia-maratona-cortegaca-2026";

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "39ª Meia Maratona de Cortegaça",
      description:
        "39ª Meia Maratona de Cortegaça e Corrida Os Falta d'Ar 10km. Prova certificada pela FPA no calendário World Athletics. Prémios pecuniários até 750€. Limite 1500 atletas.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-05-10T09:00:00.000Z"),
      endDate: null,
      city: "Cortegaça, Ovar",
      country: "Portugal",
      latitude: 40.8667,
      longitude: -8.6333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Praia+de+Cortegaça+Ovar+Portugal",
      externalUrl: "https://lap2go.com/pt/event/meia-cortegaca-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-09T12:00:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "39ª Meia Maratona de Cortegaça",
      description:
        "39ª Meia Maratona de Cortegaça e Corrida Os Falta d'Ar 10km. Prova certificada pela FPA no calendário World Athletics. Prémios pecuniários até 750€. Limite 1500 atletas.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-05-10T09:00:00.000Z"),
      endDate: null,
      city: "Cortegaça, Ovar",
      country: "Portugal",
      latitude: 40.8667,
      longitude: -8.6333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Praia+de+Cortegaça+Ovar+Portugal",
      externalUrl: "https://lap2go.com/pt/event/meia-cortegaca-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-09T12:00:00.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Create translations for ALL 6 LANGUAGES
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
      title: "39ª Meia Maratona de Cortegaça",
      city: "Cortegaça",
      metaTitle:
        "39ª Meia Maratona de Cortegaça 2026 | Ovar | 10 Maio | World Athletics",
      metaDescription:
        "39ª Meia Maratona de Cortegaça 2026 - 10 maio na Praia de Cortegaça, Ovar. Meia 21km, Corrida 10km, Caminhada. Certificada FPA, calendário World Athletics. Prémios até 750€. Limite 1500 atletas. Inscrições: 12-30€.",
      description: `# 🏃 39ª Meia Maratona de Cortegaça 2026

A **39ª Meia Maratona de Cortegaça** é um evento histórico organizado pela associação **Os Falta d'Ar - Desporto e Cultura**, com **39 edições** consecutivas na emblemática **Praia de Cortegaça**.

## 🏆 Certificação e Reconhecimento

- ✅ **Percurso certificado pela Federação Portuguesa de Atletismo (FPA)**
- ✅ **Inscrito no calendário global da World Athletics**
- ✅ Homologado para recordes nacionais, europeus e mundiais
- ✅ Conforme regras World Athletics

## 📅 Data e Programa

**Data:** Domingo, 10 de maio de 2026

**Sábado (9 de Maio):**
- 09:30-12:30 - Entrega de dorsais
- 14:00-19:00 - Entrega de dorsais

**Domingo (10 de Maio):**
- 07:00-08:30 - Entrega de dorsais
- 09:00 - Partida Corrida 10km
- 09:15 - Partida Meia Maratona 21km
- 09:20 - Partida Caminhada

**Secretariado:**
Capela de Nossa Senhora da Nazaré
Praia de Cortegaça, Ovar

## 🏃 Provas Disponíveis

### Meia Maratona 21km (09:15)
Prova certificada FPA com cronometragem eletrónica. Percurso aferido segundo normas World Athletics.

**Limite de tempo:** 3 horas

**Escalões (M/F):**
- Séniores
- Veteranos M35, M40, M45, M50, M55, M60+
- Veteranas F35, F40, F45, F50, F55, F60+

### Corrida Os Falta d'Ar 10km (09:00)
Corrida competitiva com classificação por escalões.

**Limite de tempo:** 2 horas

**Escalões (M/F):**
- Geral
- Veteranos M40, M50
- Veteranas F40, F50

### Caminhada (09:20)
Percurso não competitivo em ambiente de convívio.

**Escalão:** Único

## 💰 Prémios Pecuniários

### Meia Maratona 21km

**Classificação Geral (M/F):**
- 1º lugar: **750€**
- 2º lugar: **450€**
- 3º lugar: **300€**

**Séniores (M/F):**
- 1º: 150€ | 2º: 75€ | 3º: 50€

**Veteranos M35/F35:**
- 1º: 105€ | 2º: 75€ | 3º: 60€

**Veteranos M40/F40:**
- 1º: 225€ | 2º: 180€ | 3º: 105€

**Veteranos M45/F45:**
- 1º: 75€ | 2º: 50€ | 3º: 30€

**Veteranos M50/F50:**
- 1º: 75€ | 2º: 50€ | 3º: 30€

**Veteranos M55/F55:**
- 1º: 75€ | 2º: 50€ | 3º: 30€

**Veteranos M60+/F60+:**
- 1º: 75€ | 2º: 50€ | 3º: 30€

### Corrida 10km

**Classificação Geral (M/F):**
- 1º: 100€ | 2º: 75€ | 3º: 50€

**Veteranos M40/F40:**
- 1º: 50€ | 2º: 30€ | 3º: 20€

**Veteranos M50/F50:**
- 1º: 50€ | 2º: 30€ | 3º: 20€

**⚠️ Notas Importantes:**
- Prémios não acumuláveis (entregue sempre o maior)
- Sujeitos a retenção de IRS à taxa em vigor
- Pagamento até 30 dias após evento
- Requer: BI/CC + NIF

## 💳 Inscrições e Preços

**Plataforma:** [lap2go.com/pt/event/meia-cortegaca-2026](https://lap2go.com/pt/event/meia-cortegaca-2026)

**Limites de Participantes:**
- Meia Maratona: **1500 atletas**
- Corrida 10km: **600 atletas**
- Caminhada: **400 atletas**

### Tabela de Preços

| Período | Meia 21km | Corrida 10km | Caminhada |
|---------|-----------|--------------|-----------|
| 28 Nov - 31 Dez 2025 | 12€ | 16€ | 7€ |
| 1 Jan - 28 Fev 2026 | 14€ | 18€ | 7€ |
| 1 Mar - 30 Abr 2026 | 16€ | 20€ | 7€ |
| 1 Mai - 7 Mai 2026 | 18€ | 22€ | 7€ |
| 8-9 Mai (até 12h) | 20€ | 30€ | 10€ |

**Pagamento:**
- Referência Multibanco gerada automaticamente
- **Prazo de pagamento:** 72 horas (3 dias)
- Após pagamento: e-mail de confirmação

**Inscrições de Última Hora:**
- 7-9 Maio (até 12h00 do dia 9)
- Dorsal SEM nome personalizado
- Pagamento obrigatório no levantamento (MB Way ou numerário)

## 🎁 A Inscrição Inclui

- ✅ Dorsal personalizado com nome (exceto inscrições última hora)
- ✅ Chip de cronometragem (colado nas costas do dorsal)
- ✅ Seguro de acidentes pessoais (atletas não federados)
- ✅ Classificação oficial com cronometragem eletrónica
- ✅ Abastecimentos ao longo do percurso (normas internacionais)
- ✅ Assistência médica (Bombeiros locais)
- ✅ Acompanhamento ambulatório

## 🏁 Cronometragem e Classificação

- **Sistema:** Cronometragem eletrónica
- **Chip:** Colado nas costas do dorsal (não manipular)
- **Dorsal:** Obrigatório no peito de forma visível
- **Controlos:** Espalhados ao longo do percurso
- **Classificações publicadas:** Até 20:00 do dia da prova

**⚠️ Limite de Tempo:**
- Meia Maratona: **3 horas**
- Corrida 10km: **2 horas**
- Atletas fora do limite não serão classificados

## 🚦 Regras Importantes

### Segurança

- ✅ Percurso com **trânsito impedido** pela GNR
- ✅ Em troços condicionados: circular pela **direita**
- ✅ Assistência médica permanente (Bombeiros)
- ⛔ **Proibido acompanhamento** por qualquer veículo
- ⛔ Desclassificação imediata por acompanhamento não autorizado

### Conduta

- ⛔ **Proibido** encurtar percurso (controlos detetam)
- ⛔ **Proibido** troca de dorsais entre atletas
- ⛔ **Proibido** abastecimento fora de zonas demarcadas
- ⛔ Comportamento incorreto → desclassificação imediata

### Reclamações

- **Prazo:** Até 15 minutos após final da prova
- **Formato:** Por escrito em papel timbrado do clube
- **Caução:** 100€ (devolvidos se procedente)
- **Júri:** Elementos do Conselho de Arbitragem AAA

## 👥 Condições de Participação

- **Idade mínima:** Conforme regulamento FPA para cada distância
- **Saúde:** Boa condição física para esforços prolongados
- **Controlo médico:** Aconselhado antes da prova
- **Menores:** Autorização dos pais/encarregados de educação

**⚠️ Importante:** A organização **não se responsabiliza** por problemas de saúde resultantes do esforço. Reserva-se o direito de obrigar atleta a abandonar por razões médicas.

## 📞 Contactos

- **Email:** osfaltadar@gmail.com
- **Organização:** Os Falta d'Ar - Desporto e Cultura
- **Inscrições:** [lap2go.com](https://lap2go.com/pt/event/meia-cortegaca-2026)

## 📍 Localização

**Partida/Chegada:**
Praia de Cortegaça
Ovar, Aveiro

**Secretariado:**
Capela de Nossa Senhora da Nazaré
Praia de Cortegaça

## 🏖️ Praia de Cortegaça

Desfrute de uma prova única junto ao mar, na emblemática Praia de Cortegaça, com **39 anos de história** de atletismo em Portugal!

## ⚖️ Regulamento

Organização reserva-se ao direito de cancelamento por:
- Catástrofes naturais
- Greves, manifestações
- Impossibilidade de usar vias de circulação
- Restrições governamentais
- Nova legislação

Nestes casos: parecer emitido nos 30 dias seguintes.

## 📸 Direitos de Imagem

Ao inscrever-se, o participante **autoriza gratuitamente** a utilização da sua imagem captada durante o evento para fins comunicacionais.`,
    },
    {
      language: "en",
      title: "39th Cortegaça Half Marathon",
      city: "Cortegaça",
      metaTitle:
        "39th Cortegaça Half Marathon 2026 | Ovar | May 10 | World Athletics",
      metaDescription:
        "39th Cortegaça Half Marathon 2026 - May 10 at Cortegaça Beach, Ovar. Half 21km, 10km Race, Walk. FPA certified, World Athletics calendar. Prizes up to €750. Limit 1500 athletes. Entry: €12-30.",
      description: `# 🏃 39th Cortegaça Half Marathon 2026

The **39th Cortegaça Half Marathon** is a historic event organized by **Os Falta d'Ar - Sports and Culture** association, with **39 consecutive editions** at the iconic **Cortegaça Beach**.

## 🏆 Certification and Recognition

- ✅ **Course certified by Portuguese Athletics Federation (FPA)**
- ✅ **Listed on World Athletics global calendar**
- ✅ Approved for national, European and world records
- ✅ Compliant with World Athletics rules

## 📅 Date and Schedule

**Date:** Sunday, May 10, 2026

**Saturday (May 9):**
- 09:30-12:30 - Bib collection
- 14:00-19:00 - Bib collection

**Sunday (May 10):**
- 07:00-08:30 - Bib collection
- 09:00 - Start 10km Race
- 09:15 - Start Half Marathon 21km
- 09:20 - Start Walk

## 📞 Contacts

- **Email:** osfaltadar@gmail.com
- **Organization:** Os Falta d'Ar - Sports and Culture
- **Registration:** [lap2go.com](https://lap2go.com/pt/event/meia-cortegaca-2026)`,
    },
    {
      language: "es",
      title: "39ª Media Maratón de Cortegaça",
      city: "Cortegaça",
      metaTitle:
        "39ª Media Maratón de Cortegaça 2026 | Ovar | 10 Mayo | World Athletics",
      metaDescription:
        "39ª Media Maratón de Cortegaça 2026 - 10 mayo en Playa de Cortegaça, Ovar. Media 21km, Carrera 10km, Caminata. Certificada FPA, calendario World Athletics. Premios hasta 750€. Límite 1500 atletas. Inscripciones: 12-30€.",
      description: `# 🏃 39ª Media Maratón de Cortegaça 2026

La **39ª Media Maratón de Cortegaça** es un evento histórico organizado por la asociación **Os Falta d'Ar - Deporte y Cultura**, con **39 ediciones consecutivas** en la emblemática **Playa de Cortegaça**.

## 📞 Contactos

- **Email:** osfaltadar@gmail.com
- **Organización:** Os Falta d'Ar - Deporte y Cultura
- **Inscripciones:** [lap2go.com](https://lap2go.com/pt/event/meia-cortegaca-2026)`,
    },
    {
      language: "fr",
      title: "39ème Semi-Marathon de Cortegaça",
      city: "Cortegaça",
      metaTitle:
        "39ème Semi-Marathon de Cortegaça 2026 | Ovar | 10 Mai | World Athletics",
      metaDescription:
        "39ème Semi-Marathon de Cortegaça 2026 - 10 mai à la Plage de Cortegaça, Ovar. Semi 21km, Course 10km, Marche. Certifié FPA, calendrier World Athletics. Prix jusqu'à 750€. Limite 1500 athlètes. Inscription: 12-30€.",
      description: `# 🏃 39ème Semi-Marathon de Cortegaça 2026

Le **39ème Semi-Marathon de Cortegaça** est un événement historique organisé par l'association **Os Falta d'Ar - Sport et Culture**, avec **39 éditions consécutives** sur la **Plage de Cortegaça**.

## 📞 Contacts

- **Email:** osfaltadar@gmail.com
- **Organisation:** Os Falta d'Ar - Sport et Culture
- **Inscriptions:** [lap2go.com](https://lap2go.com/pt/event/meia-cortegaca-2026)`,
    },
    {
      language: "de",
      title: "39. Halbmarathon von Cortegaça",
      city: "Cortegaça",
      metaTitle:
        "39. Halbmarathon von Cortegaça 2026 | Ovar | 10. Mai | World Athletics",
      metaDescription:
        "39. Halbmarathon von Cortegaça 2026 - 10. Mai am Strand von Cortegaça, Ovar. Halb 21km, Lauf 10km, Wanderung. FPA-zertifiziert, World Athletics Kalender. Preise bis 750€. Limit 1500 Athleten. Anmeldung: 12-30€.",
      description: `# 🏃 39. Halbmarathon von Cortegaça 2026

Der **39. Halbmarathon von Cortegaça** ist eine historische Veranstaltung, organisiert vom Verein **Os Falta d'Ar - Sport und Kultur**, mit **39 aufeinanderfolgenden Ausgaben** am ikonischen **Strand von Cortegaça**.

## 📞 Kontakte

- **Email:** osfaltadar@gmail.com
- **Organisation:** Os Falta d'Ar - Sport und Kultur
- **Anmeldung:** [lap2go.com](https://lap2go.com/pt/event/meia-cortegaca-2026)`,
    },
    {
      language: "it",
      title: "39ª Mezza Maratona di Cortegaça",
      city: "Cortegaça",
      metaTitle:
        "39ª Mezza Maratona di Cortegaça 2026 | Ovar | 10 Maggio | World Athletics",
      metaDescription:
        "39ª Mezza Maratona di Cortegaça 2026 - 10 maggio alla Spiaggia di Cortegaça, Ovar. Mezza 21km, Corsa 10km, Camminata. Certificata FPA, calendario World Athletics. Premi fino a 750€. Limite 1500 atleti. Iscrizione: 12-30€.",
      description: `# 🏃 39ª Mezza Maratona di Cortegaça 2026

La **39ª Mezza Maratona di Cortegaça** è un evento storico organizzato dall'associazione **Os Falta d'Ar - Sport e Cultura**, con **39 edizioni consecutive** nell'iconica **Spiaggia di Cortegaça**.

## 📞 Contatti

- **Email:** osfaltadar@gmail.com
- **Organizzazione:** Os Falta d'Ar - Sport e Cultura
- **Iscrizioni:** [lap2go.com](https://lap2go.com/pt/event/meia-cortegaca-2026)`,
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
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Helper function to find or create variant
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM?: number;
    startTime: string;
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
    } else {
      return await prisma.eventVariant.create({
        data: { eventId: event.id, ...variantData },
      });
    }
  };

  // Step 4: Create event variants
  console.log("🏃 Creating variants...");

  await findOrCreateVariant({
    name: "Meia Maratona 21 km",
    distanceKm: 21.0975,
    elevationGainM: 50,
    startTime: "09:15",
    maxParticipants: 1500,
    price: 12.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Corrida Os Falta d'Ar 10 km",
    distanceKm: 10.0,
    elevationGainM: 30,
    startTime: "09:00",
    maxParticipants: 600,
    price: 16.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 7.0,
    elevationGainM: 20,
    startTime: "09:20",
    maxParticipants: 400,
    price: 7.0,
    currency: Currency.EUR,
  });

  console.log("   ✅ All 3 variants created");

  // Step 5: Helper function for pricing phases
  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      note: string | null;
    }
  ) => {
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
        data: { eventId: event.id, name, ...data },
      });
    }
  };

  // Step 6: Create pricing phases (5 phases for each variant = 15 total)
  console.log("💰 Creating pricing phases...");

  // Meia Maratona - 5 fases
  await findOrCreatePricingPhase("Meia Maratona - 1ª Fase", {
    startDate: new Date("2025-11-28T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: "28 Nov - 31 Dez 2025",
  });

  await findOrCreatePricingPhase("Meia Maratona - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-02-28T23:59:59.000Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: "1 Jan - 28 Fev 2026",
  });

  await findOrCreatePricingPhase("Meia Maratona - 3ª Fase", {
    startDate: new Date("2026-03-01T00:00:00.000Z"),
    endDate: new Date("2026-04-30T23:59:59.000Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: "1 Mar - 30 Abr 2026",
  });

  await findOrCreatePricingPhase("Meia Maratona - 4ª Fase", {
    startDate: new Date("2026-05-01T00:00:00.000Z"),
    endDate: new Date("2026-05-07T23:59:59.000Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: "1 Mai - 7 Mai 2026",
  });

  await findOrCreatePricingPhase("Meia Maratona - Última Hora", {
    startDate: new Date("2026-05-08T00:00:00.000Z"),
    endDate: new Date("2026-05-09T12:00:00.000Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: "8-9 Mai até 12h (sem nome no dorsal)",
  });

  // Corrida 10km - 5 fases
  await findOrCreatePricingPhase("Corrida 10km - 1ª Fase", {
    startDate: new Date("2025-11-28T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: "28 Nov - 31 Dez 2025",
  });

  await findOrCreatePricingPhase("Corrida 10km - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-02-28T23:59:59.000Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: "1 Jan - 28 Fev 2026",
  });

  await findOrCreatePricingPhase("Corrida 10km - 3ª Fase", {
    startDate: new Date("2026-03-01T00:00:00.000Z"),
    endDate: new Date("2026-04-30T23:59:59.000Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: "1 Mar - 30 Abr 2026",
  });

  await findOrCreatePricingPhase("Corrida 10km - 4ª Fase", {
    startDate: new Date("2026-05-01T00:00:00.000Z"),
    endDate: new Date("2026-05-07T23:59:59.000Z"),
    price: 22.0,
    currency: Currency.EUR,
    note: "1 Mai - 7 Mai 2026",
  });

  await findOrCreatePricingPhase("Corrida 10km - Última Hora", {
    startDate: new Date("2026-05-08T00:00:00.000Z"),
    endDate: new Date("2026-05-09T12:00:00.000Z"),
    price: 30.0,
    currency: Currency.EUR,
    note: "8-9 Mai até 12h (sem nome no dorsal)",
  });

  // Caminhada - 5 fases
  await findOrCreatePricingPhase("Caminhada - 1ª Fase", {
    startDate: new Date("2025-11-28T00:00:00.000Z"),
    endDate: new Date("2026-04-30T23:59:59.000Z"),
    price: 7.0,
    currency: Currency.EUR,
    note: "28 Nov 2025 - 30 Abr 2026",
  });

  await findOrCreatePricingPhase("Caminhada - Última Hora", {
    startDate: new Date("2026-05-08T00:00:00.000Z"),
    endDate: new Date("2026-05-09T12:00:00.000Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: "8-9 Mai até 12h",
  });

  console.log("   ✅ 12 pricing phases created");

  // Step 7: Create FAQs
  console.log("❓ Creating FAQs...");

  const faqsData = [
    {
      question: {
        pt: "Quais são os limites de participantes?",
        en: "What are the participant limits?",
        es: "¿Cuáles son los límites de participantes?",
        fr: "Quelles sont les limites de participants?",
        de: "Was sind die Teilnehmerlimits?",
        it: "Quali sono i limiti di partecipanti?",
      },
      answer: {
        pt: "Meia Maratona: 1500 atletas | Corrida 10km: 600 atletas | Caminhada: 400 atletas. Total: 2500 participantes.",
        en: "Half Marathon: 1500 athletes | 10km Race: 600 athletes | Walk: 400 athletes. Total: 2500 participants.",
        es: "Media Maratón: 1500 atletas | Carrera 10km: 600 atletas | Caminata: 400 atletas. Total: 2500 participantes.",
        fr: "Semi-Marathon: 1500 athlètes | Course 10km: 600 athlètes | Marche: 400 athlètes. Total: 2500 participants.",
        de: "Halbmarathon: 1500 Athleten | 10km Lauf: 600 Athleten | Wanderung: 400 Athleten. Gesamt: 2500 Teilnehmer.",
        it: "Mezza Maratona: 1500 atleti | Corsa 10km: 600 atleti | Camminata: 400 atleti. Totale: 2500 partecipanti.",
      },
    },
    {
      question: {
        pt: "Qual é o prazo para pagar a inscrição?",
        en: "What is the payment deadline?",
        es: "¿Cuál es el plazo para pagar la inscripción?",
        fr: "Quel est le délai de paiement?",
        de: "Was ist die Zahlungsfrist?",
        it: "Qual è la scadenza per il pagamento?",
      },
      answer: {
        pt: "A referência multibanco deve ser paga em 72 horas (3 dias) após a inscrição. Após este período a inscrição é anulada. Receberá e-mail de confirmação quando o pagamento for efetuado.",
        en: "The bank reference must be paid within 72 hours (3 days) after registration. After this period the registration is canceled. You will receive a confirmation email when payment is made.",
        es: "La referencia bancaria debe pagarse en 72 horas (3 días) después de la inscripción. Después de este período la inscripción se cancela. Recibirá un correo de confirmación cuando se realice el pago.",
        fr: "La référence bancaire doit être payée dans les 72 heures (3 jours) après l'inscription. Après cette période l'inscription est annulée. Vous recevrez un email de confirmation lorsque le paiement sera effectué.",
        de: "Die Bankreferenz muss innerhalb von 72 Stunden (3 Tage) nach der Anmeldung bezahlt werden. Nach diesem Zeitraum wird die Anmeldung storniert. Sie erhalten eine Bestätigungs-E-Mail, wenn die Zahlung erfolgt ist.",
        it: "Il riferimento bancario deve essere pagato entro 72 ore (3 giorni) dopo l'iscrizione. Dopo questo periodo l'iscrizione viene annullata. Riceverai un'email di conferma quando il pagamento sarà effettuato.",
      },
    },
    {
      question: {
        pt: "Há prémios monetários?",
        en: "Are there prize money awards?",
        es: "¿Hay premios monetarios?",
        fr: "Y a-t-il des prix en argent?",
        de: "Gibt es Geldpreise?",
        it: "Ci sono premi in denaro?",
      },
      answer: {
        pt: "Sim! Prémios até 750€ na Meia Maratona (1º Geral). Também há prémios por escalões: Séniores, M35, M40, M45, M50, M55, M60+ (M/F). Na Corrida 10km: até 100€ (1º Geral). Prémios não acumuláveis. Sujeitos a retenção IRS. Pagamento até 30 dias após evento.",
        en: "Yes! Prizes up to €750 in Half Marathon (1st Overall). Also prizes by age category: Seniors, M35, M40, M45, M50, M55, M60+ (M/F). In 10km Race: up to €100 (1st Overall). Non-cumulative prizes. Subject to tax withholding. Payment within 30 days after event.",
        es: "¡Sí! Premios hasta 750€ en Media Maratón (1º General). También hay premios por categorías: Seniors, M35, M40, M45, M50, M55, M60+ (M/F). En Carrera 10km: hasta 100€ (1º General). Premios no acumulables. Sujetos a retención fiscal. Pago hasta 30 días después del evento.",
        fr: "Oui ! Prix jusqu'à 750€ au Semi-Marathon (1er Général). Également des prix par catégorie d'âge: Seniors, M35, M40, M45, M50, M55, M60+ (H/F). Dans Course 10km: jusqu'à 100€ (1er Général). Prix non cumulables. Soumis à retenue fiscale. Paiement sous 30 jours après l'événement.",
        de: "Ja! Preise bis zu 750€ beim Halbmarathon (1. Gesamt). Auch Preise nach Altersklasse: Senioren, M35, M40, M45, M50, M55, M60+ (M/W). Im 10km Lauf: bis zu 100€ (1. Gesamt). Nicht kumulative Preise. Steuerabzug. Zahlung innerhalb von 30 Tagen nach der Veranstaltung.",
        it: "Sì! Premi fino a 750€ nella Mezza Maratona (1° Assoluto). Anche premi per categoria d'età: Senior, M35, M40, M45, M50, M55, M60+ (M/F). Nella Corsa 10km: fino a 100€ (1° Assoluto). Premi non cumulabili. Soggetti a ritenuta fiscale. Pagamento entro 30 giorni dall'evento.",
      },
    },
    {
      question: {
        pt: "A prova é certificada pela FPA e World Athletics?",
        en: "Is the race certified by FPA and World Athletics?",
        es: "¿La prueba está certificada por FPA y World Athletics?",
        fr: "La course est-elle certifiée par FPA et World Athletics?",
        de: "Ist das Rennen von FPA und World Athletics zertifiziert?",
        it: "La gara è certificata da FPA e World Athletics?",
      },
      answer: {
        pt: "Sim! O percurso está certificado pela Federação Portuguesa de Atletismo (FPA) e inscrito no calendário global da World Athletics. É homologado para recordes nacionais, europeus e mundiais segundo as regras da World Athletics.",
        en: "Yes! The course is certified by the Portuguese Athletics Federation (FPA) and listed on the World Athletics global calendar. It is approved for national, European and world records according to World Athletics rules.",
        es: "¡Sí! El recorrido está certificado por la Federación Portuguesa de Atletismo (FPA) e inscrito en el calendario global de World Athletics. Está homologado para récords nacionales, europeos y mundiales según las reglas de World Athletics.",
        fr: "Oui ! Le parcours est certifié par la Fédération Portugaise d'Athlétisme (FPA) et inscrit au calendrier mondial de World Athletics. Il est homologué pour les records nationaux, européens et mondiaux selon les règles de World Athletics.",
        de: "Ja! Die Strecke ist vom Portugiesischen Leichtathletikverband (FPA) zertifiziert und im World Athletics Global Calendar eingetragen. Sie ist für nationale, europäische und Weltrekorde nach den Regeln der World Athletics zugelassen.",
        it: "Sì! Il percorso è certificato dalla Federazione Portoghese di Atletica (FPA) e iscritto nel calendario globale di World Athletics. È omologato per record nazionali, europei e mondiali secondo le regole di World Athletics.",
      },
    },
  ];

  for (const faqData of faqsData) {
    // Create FAQ with default PT translation
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: faqData.question.pt,
        answer: faqData.answer.pt,
        order: faqsData.indexOf(faqData) + 1,
      },
    });

    // Create translations for all 6 languages
    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
      await prisma.eventFAQTranslation.upsert({
        where: {
          faqId_language: {
            faqId: faq.id,
            language: Language[lang],
          },
        },
        update: {
          question: faqData.question[lang],
          answer: faqData.answer[lang],
        },
        create: {
          faqId: faq.id,
          language: Language[lang],
          question: faqData.question[lang],
          answer: faqData.answer[lang],
        },
      });
    }
  }

  console.log("   ✅ Created 4 FAQs with 6 language translations each");

  console.log(`
🎉 39ª Meia Maratona de Cortegaça 2026 seeded successfully!
   📍 Event: 39ª Meia Maratona de Cortegaça
   🔗 Slug: ${event.slug}
   📅 Date: 2026-05-10
   📍 Location: Cortegaça, Ovar, Aveiro, Portugal
   🏃 Variants: Meia 21km, Corrida 10km, Caminhada
   💰 Pricing: 5 phases (€12-30 Meia, €16-30 Corrida 10km, €7-10 Caminhada)
   🏆 Prizes: Up to €750 (1st Overall Half Marathon)
   👥 Max: 2500 participants (1500+600+400)
   🏅 Certification: FPA + World Athletics
   ❓ FAQs: 4 questions with 6 language translations
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
