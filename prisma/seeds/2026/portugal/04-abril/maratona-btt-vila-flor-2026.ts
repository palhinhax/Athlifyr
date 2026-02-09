/**
 * Seed: VI Maratona BTT Vila Flor 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 * Open Regional XCM ACB - Bragança
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding VI Maratona BTT Vila Flor 2026...");

  const eventSlug = "maratona-btt-vila-flor-2026";

  // Step 1: Upsert the event (NO delete operations)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "VI Maratona BTT Vila Flor",
      description:
        "VI Maratona BTT Vila Flor - Open Regional XCM ACB Bragança. Percursos de 15km (Mini), 35km (Meia) e 60km (Maratona) em Vila Flor. Inclui almoço, banhos e seguro.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-19T09:30:00.000Z"),
      endDate: null,
      city: "Vila Flor",
      country: "Portugal",
      latitude: 41.3096,
      longitude: -7.1536,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=41.3096,-7.1536",
      externalUrl: "https://apedalar.pt/eventos/4096/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-14T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "VI Maratona BTT Vila Flor",
      description:
        "VI Maratona BTT Vila Flor - Open Regional XCM ACB Bragança. Percursos de 15km (Mini), 35km (Meia) e 60km (Maratona) em Vila Flor. Inclui almoço, banhos e seguro.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-19T09:30:00.000Z"),
      endDate: null,
      city: "Vila Flor",
      country: "Portugal",
      latitude: 41.3096,
      longitude: -7.1536,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=41.3096,-7.1536",
      externalUrl: "https://apedalar.pt/eventos/4096/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-14T23:59:59.000Z"),
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
      title: "VI Maratona BTT Vila Flor",
      city: "Vila Flor",
      metaTitle:
        "VI Maratona BTT Vila Flor 2026 | Open XCM ACB | 19 Abril | Bragança",
      metaDescription:
        "VI Maratona BTT Vila Flor 2026 - 19 abril. Open Regional XCM ACB Bragança. 3 percursos: Mini 15km, Meia 35km, Maratona 60km. Inscrição: 10€. Almoço incluído (6€). E-Bikes permitidas.",
      description: `# 🚴 VI Maratona BTT Vila Flor 2026 - Open XCM ACB

A **VI Maratona BTT Vila Flor** é um evento inserido no **Open Regional de Maratonas e Meias-Maratonas de Trás-os-Montes da ACB – Bragança**. Organizado pelo **Clube de Ciclismo de Vila Flor**.

## 📅 Data e Horários

- **Data:** Domingo, 19 de abril de 2026
- **Primeira Partida:** 09:30
- **Local:** Frente à Câmara Municipal de Vila Flor

### Programa Completo

**Sábado (18 de Abril):**
- 16:00 - Abertura do secretariado
- 19:00 - Encerramento do secretariado

**Domingo (19 de Abril):**
- 07:15 - Abertura do secretariado
- 09:00 - Encerramento do secretariado
- 09:20 - Encerramento da zona de partida
- 09:20 - Briefing
- 09:30 - Partida Maratona Open XCM (60km)
- 09:35 - Partida Meia Maratona Open (35km)
- 09:40 - Partida Promoção (15km)
- 13:00 - Início do almoço
- 14:30 - Encerramento do percurso e meta

## 🚴 Percursos Disponíveis

### Maratona 60-65 km (Dificuldade Média)
Cross-Country Marathon (XCM) para ciclistas experientes. Aberta a BTT e E-Bikes. Prémios aos 3 primeiros de cada escalão.

### Meia Maratona 35 km (Dificuldade Média)
Percurso intermédio ideal para todos os níveis. Aberta a BTT e E-Bikes. Prémios aos 3 primeiros de cada escalão.

### Mini Maratona 15 km (Promoção)
Percurso de iniciação e promoção. Prémios apenas aos 3 primeiros da geral.

## 🏆 Escalões e Categorias

### Masculinos
- **Juniores:** 17-18 anos
- **Elites:** 19-29 anos
- **Masters 30:** 30-34 anos
- **Masters 35:** 35-39 anos
- **Masters 40:** 40-44 anos
- **Masters 45:** 45-49 anos
- **Masters 50:** 50-54 anos
- **Masters 55:** 55-59 anos
- **Masters 60:** +60 anos
- **E-MTB:** A partir dos 17 anos

### Femininos
- **Femininas:** +18 anos

## 🎁 A Inscrição Inclui

- ✅ Brinde oficial do evento
- ✅ Reforços sólidos e líquidos
- ✅ **Almoço incluído** (já no preço base)
- ✅ Seguro de acidentes pessoais
- ✅ Lavagem de bicicletas
- ✅ Banhos quentes
- ✅ Cronometragem eletrónica
- ✅ Classificação por escalões

## 💰 Preços

- **Inscrição (Maratona/Meia/Mini):** 10€
- **Almoço atleta:** 6€ (adicional)
- **Almoço acompanhante:** 12€

**Total com almoço:** 16€ (10€ + 6€)

## 👶 Idades Mínimas

- **Mini Maratona (15km):** A partir dos 8 anos
- **Meia Maratona (35km):** A partir dos 15 anos
- **Maratona (60km):** A partir dos 17 anos

**Menores de 18 anos:** Obrigatória autorização do encarregado de educação.

## ⚡ E-Bikes

Permitidas na Maratona e Meia Maratona com categorias próprias:
- **E-Bike Maratona** (com classificação)
- **E-Bike Meia Maratona** (com classificação)

## 🏁 Controlos e Regras

- **Parque fechado** na zona de partida
- **Controlo Zero (CP0)** obrigatório antes da partida
- Zonas de controlo ao longo do percurso
- **Capacete obrigatório** durante todo o percurso
- Respeitar o Código da Estrada (vias abertas ao trânsito)
- **Proibido circular em sentido contrário**

## 🍽️ Abastecimentos

- **Mini Maratona:** 1 abastecimento líquido
- **Meia e Maratona:** 2 abastecimentos alimentares
- Viaturas de apoio técnico ao longo dos percursos

## 📞 Contactos

- **Email:** cc.vilaflor@gmail.com
- **Telemóvel:** 919 969 368
- **Inscrições/Suporte:** geral@apedalar.pt

## 📍 Localização

**Concentração/Secretariado/Partida/Chegada:**
Frente à Câmara Municipal de Vila Flor
Avenida Marechal Carmona, nº 59
5360-303 Vila Flor

## 🎖️ Circuito

Evento integrado no **Open Regional XCM ACB – Bragança**, circuito oficial de Cross-Country Marathon de Trás-os-Montes.

## ⚠️ Informações Importantes

- **Prazo de Inscrições:** Até 14 de abril de 2026 às 23:59
- **Pagamento:** Multibanco, MB Way ou Cartão (estrangeiros)
- **Prazo de Pagamento:** 48h após inscrição
- **Desistências:** Não dão direito a reembolso
- **Formato:** Cross-Country Marathon (XCM)`,
    },
    {
      language: "en",
      title: "VI Vila Flor MTB Marathon",
      city: "Vila Flor",
      metaTitle:
        "VI Vila Flor MTB Marathon 2026 | XCM ACB Open | April 19 | Bragança",
      metaDescription:
        "VI Vila Flor MTB Marathon 2026 - April 19. ACB Bragança Regional XCM Open. 3 routes: Mini 15km, Half 35km, Marathon 60km. Entry: €10. Lunch included (€6). E-Bikes allowed.",
      description: `# 🚴 VI Vila Flor MTB Marathon 2026 - XCM ACB Open

The **VI Vila Flor MTB Marathon** is an event included in the **ACB Bragança Regional Marathon and Half-Marathon Open**. Organized by **Vila Flor Cycling Club**.

## 📅 Date and Schedule

- **Date:** Sunday, April 19, 2026
- **First Start:** 09:30
- **Location:** Vila Flor City Hall

## 📞 Contacts

- **Email:** cc.vilaflor@gmail.com
- **Phone:** +351 919 969 368`,
    },
    {
      language: "es",
      title: "VI Maratón BTT Vila Flor",
      city: "Vila Flor",
      metaTitle:
        "VI Maratón BTT Vila Flor 2026 | Open XCM ACB | 19 Abril | Bragança",
      metaDescription:
        "VI Maratón BTT Vila Flor 2026 - 19 abril. Open Regional XCM ACB Bragança. 3 recorridos: Mini 15km, Media 35km, Maratón 60km. Inscripción: 10€. Almuerzo incluido (6€). E-Bikes permitidas.",
      description: `# 🚴 VI Maratón BTT Vila Flor 2026 - Open XCM ACB

La **VI Maratón BTT Vila Flor** es un evento incluido en el **Open Regional de Maratones de Trás-os-Montes ACB – Bragança**.

## 📞 Contactos

- **Email:** cc.vilaflor@gmail.com
- **Teléfono:** +351 919 969 368`,
    },
    {
      language: "fr",
      title: "VI Marathon VTT Vila Flor",
      city: "Vila Flor",
      metaTitle:
        "VI Marathon VTT Vila Flor 2026 | Open XCM ACB | 19 Avril | Bragança",
      metaDescription:
        "VI Marathon VTT Vila Flor 2026 - 19 avril. Open Régional XCM ACB Bragança. 3 parcours: Mini 15km, Semi 35km, Marathon 60km. Inscription: 10€. Déjeuner inclus (6€). E-Bikes autorisés.",
      description: `# 🚴 VI Marathon VTT Vila Flor 2026 - Open XCM ACB

Le **VI Marathon VTT Vila Flor** est un événement inclus dans l'**Open Régional de Marathons ACB – Bragança**.

## 📞 Contacts

- **Email:** cc.vilaflor@gmail.com
- **Téléphone:** +351 919 969 368`,
    },
    {
      language: "de",
      title: "VI Vila Flor MTB Marathon",
      city: "Vila Flor",
      metaTitle:
        "VI Vila Flor MTB Marathon 2026 | XCM ACB Open | 19. April | Bragança",
      metaDescription:
        "VI Vila Flor MTB Marathon 2026 - 19. April. ACB Bragança Regional XCM Open. 3 Strecken: Mini 15km, Halb 35km, Marathon 60km. Anmeldung: 10€. Mittagessen inklusive (6€). E-Bikes erlaubt.",
      description: `# 🚴 VI Vila Flor MTB Marathon 2026 - XCM ACB Open

Der **VI Vila Flor MTB Marathon** ist eine Veranstaltung des **ACB Bragança Regional Marathon Opens**.

## 📞 Kontakte

- **Email:** cc.vilaflor@gmail.com
- **Telefon:** +351 919 969 368`,
    },
    {
      language: "it",
      title: "VI Maratona MTB Vila Flor",
      city: "Vila Flor",
      metaTitle:
        "VI Maratona MTB Vila Flor 2026 | Open XCM ACB | 19 Aprile | Bragança",
      metaDescription:
        "VI Maratona MTB Vila Flor 2026 - 19 aprile. Open Regionale XCM ACB Bragança. 3 percorsi: Mini 15km, Mezza 35km, Maratona 60km. Iscrizione: 10€. Pranzo incluso (6€). E-Bikes consentite.",
      description: `# 🚴 VI Maratona MTB Vila Flor 2026 - Open XCM ACB

La **VI Maratona MTB Vila Flor** è un evento incluso nell'**Open Regionale di Maratone ACB – Bragança**.

## 📞 Contatti

- **Email:** cc.vilaflor@gmail.com
- **Telefono:** +351 919 969 368`,
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

  // Step 3: Helper function
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM?: number;
    startTime: string;
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

  // Step 4: Create variants
  console.log("🚴 Creating variants...");

  await findOrCreateVariant({
    name: "Mini Maratona 15 km",
    distanceKm: 15,
    elevationGainM: 200,
    startTime: "09:40",
    price: 10.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Meia Maratona 35 km",
    distanceKm: 35,
    elevationGainM: 600,
    startTime: "09:35",
    price: 10.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Maratona 60 km",
    distanceKm: 60,
    elevationGainM: 1100,
    startTime: "09:30",
    price: 10.0,
    currency: Currency.EUR,
  });

  console.log("   ✅ All 3 variants created");

  // Step 5: Pricing
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

  console.log("💰 Creating pricing phase...");

  await findOrCreatePricingPhase("Preço Único", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-04-14T23:59:59.000Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: "Inscrição base (almoço +6€ opcional)",
  });

  console.log("   ✅ Pricing phase created");

  console.log(`
🎉 VI Maratona BTT Vila Flor 2026 seeded successfully!
   📍 Event: VI Maratona BTT Vila Flor
   🔗 Slug: ${event.slug}
   📅 Date: 2026-04-19
   📍 Location: Vila Flor, Bragança, Portugal
   🚴 Variants: Mini 15km, Meia 35km, Maratona 60km
   💰 Pricing: €10 base + €6 almoço
   🎖️ Circuit: Open Regional XCM ACB Bragança
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
