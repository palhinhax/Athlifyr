/**
 * Seed: 4ª Rota da Trança e da Palha 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 4ª Rota da Trança e da Palha 2026...");

  const eventSlug = "rota-tranca-palha-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "4ª Rota da Trança e da Palha",
      description:
        "Passeio BTT tradicional em Travassós, Fafe. Celebra as tradições da palha de centeio com percursos de BTT e caminhadas. Organizado pelo GATBIKE Sports Club.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-19T09:30:00.000Z"),
      endDate: null,
      city: "Travassós, Fafe",
      country: "Portugal",
      latitude: 41.4667,
      longitude: -8.1667,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Travass%C3%B3s+Fafe+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4199/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-13T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "4ª Rota da Trança e da Palha",
      description:
        "Passeio BTT tradicional em Travassós, Fafe. Celebra as tradições da palha de centeio com percursos de BTT e caminhadas. Organizado pelo GATBIKE Sports Club.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-19T09:30:00.000Z"),
      endDate: null,
      city: "Travassós, Fafe",
      country: "Portugal",
      latitude: 41.4667,
      longitude: -8.1667,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Travass%C3%B3s+Fafe+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4199/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-13T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

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
      title: "4ª Rota da Trança e da Palha",
      city: "Travassós",
      metaTitle:
        "4ª Rota da Trança e da Palha 2026 | Travassós, Fafe | 19 Abril",
      metaDescription:
        "4ª Rota da Trança e da Palha 2026 - 19 abril em Travassós, Fafe. BTT 25km e 45km + Caminhadas. Celebra tradições da palha de centeio. Jersey oficial incluído até 31 março. Inscrições: 12-23€.",
      description: `# 🚴 4ª Rota da Trança e da Palha 2026

A **4ª Rota da Trança e da Palha** é um evento único que celebra as **tradições da palha de centeio** de Travassós, organizado pela **Associação Grupo de Amigos de Travassós (GATBIKE Sports Club)** em parceria com a **AC Minho** e **FPC**.

## 🌾 A Tradição da Palha

Travassós tem como referência os tradicionais **produtos em palha de centeio** desde o século XIX. O evento realiza-se em **abril, época do corte do centeio**, permitindo aos participantes contacto direto com esta tradição milenar.

## 📅 Data e Programa

**Data:** 19 de abril de 2026 (Domingo)

**Sábado (18 de Abril):**
- 16:00-19:00 - Abertura do secretariado (Edifício Casa do Povo)

**Domingo (19 de Abril):**
- 07:30 - Abertura do secretariado (Recinto Srª das Graças)
- 08:45 - Bênção dos capacetes
- 09:00 - Encerramento do secretariado
- 09:25 - Briefing
- 09:30 - Partida BTT
- Durante o percurso - Pequeno-almoço à antiga, reforços, quadros vivos do ciclo da palha, Bike 360º
- 11:15 - Chegada prevista primeiros atletas
- 14:00 - Encerramento da atividade
- 14:15 - Almoço convívio

## 🚴 Percursos BTT

### BTT 25 km - Dificuldade Média/Baixa
Percurso mais acessível pelos trilhos e caminhos rurais de Travassós. Ideal para iniciantes e famílias.

### BTT 45 km - Dificuldade Média/Alta
Percurso completo incluindo a **Barragem de Queimadela**. Para ciclistas experientes que querem explorar toda a freguesia.

**Particularidades:**
- Acesso aos 45km **fecha às 11:45** na zona de divisão
- Percursos marcados com **placas e fitas fluorescentes**
- Um ponto de abastecimento (25km) / Dois pontos (45km)

## 👨‍👩‍👧‍👦 Caminhadas

### Caminhada KIDS (8-11 anos) - 8€
Inclui: T-shirt, passeio, atividades desportivas, almoço, banho quente

### Caminhada (+12 anos) - 10€
Inclui: T-shirt, passeio, atividades desportivas, almoço, banho quente

## 💰 Inscrições BTT

**Inscrições limitadas a 150 participantes**

### Período 1: 1 Fevereiro a 31 Março

**Modalidade 1: BTTista com Jersey - 23€**
- Jersey oficial do passeio ✨
- Passeio BTT
- Almoço convívio
- Reforços
- Banho quente
- Lavagem bikes
- Seguro

**Modalidade 2: BTTista - 12€**
- Passeio BTT
- Almoço convívio
- Reforços
- Banho quente
- Lavagem bikes
- Seguro

### Período 2: 1 Abril a 16 Abril

**Modalidade 2: BTTista - 18€** (sem jersey disponível)

**⚠️ Importante:** Jersey oficial **apenas para inscrições pagas até 31 março às 23:59**. Não é possível trocar tamanhos - escolhe bem!

## 🎁 Prémios

- Prémio para a **maior equipa**
- Prémio para **atleta mais jovem**
- Prémio para **atleta mais velho**
- **20 tranças** (lembranças especiais)
- **Oferta de chapéu de palha** 🎩

## 👶 Menores de Idade

Participantes menores devem:
- Ter no mínimo **15 anos completos**
- Enviar **Termo de Responsabilidade** assinado pelos pais
- Incluir cópia do BI/CC do encarregado de educação
- Enviar para: aguiarbike.17@gmail.com

## 🏁 Regras Importantes

- **Capacete obrigatório** durante todo o percurso
- Respeitar o **Código da Estrada** (vias abertas ao trânsito)
- Afixar **placa de identificação** sempre visível
- Não circular em **sentido contrário**
- Preservar o **meio ambiente** - não deitar lixo

## 📞 Contactos

- **Email:** desporto@cm-aguiardabeira.pt | aguiarbike.17@gmail.com
- **Telemóveis:** 935 324 599 | 914 838 060

## 📍 Localização

**Concentração/Partida/Chegada:**
Recinto da Capela da Srª das Graças
Travassós, Fafe

**Estacionamento:**
Parque de Mercado Municipal em Santa Catarina da Fonte do Bispo

## 🌿 Compromisso Ambiental

Promovemos **boas práticas ambientais** e o respeito pelos recursos naturais. É nossa tradição, são as nossas raízes!`,
    },
    {
      language: "en",
      title: "4th Braid and Straw Route",
      city: "Travassós",
      metaTitle: "4th Braid and Straw Route 2026 | Travassós, Fafe | April 19",
      metaDescription:
        "4th Braid and Straw Route 2026 - April 19 in Travassós, Fafe. MTB 25km and 45km + Walks. Celebrates rye straw traditions. Official jersey included until March 31. Entry: €12-23.",
      description: `# 🚴 4th Braid and Straw Route 2026

The **4th Braid and Straw Route** celebrates the **rye straw traditions** of Travassós, organized by **GATBIKE Sports Club**.

## 📞 Contacts

- **Email:** aguiarbike.17@gmail.com
- **Phones:** +351 935 324 599 | +351 914 838 060`,
    },
    {
      language: "es",
      title: "4ª Ruta de la Trenza y la Paja",
      city: "Travassós",
      metaTitle:
        "4ª Ruta de la Trenza y la Paja 2026 | Travassós, Fafe | 19 Abril",
      metaDescription:
        "4ª Ruta de la Trenza y la Paja 2026 - 19 abril en Travassós, Fafe. BTT 25km y 45km + Caminatas. Celebra tradiciones de paja de centeno. Jersey oficial incluido hasta 31 marzo. Inscripciones: 12-23€.",
      description: `# 🚴 4ª Ruta de la Trenza y la Paja 2026

La **4ª Ruta de la Trenza y la Paja** celebra las **tradiciones de paja de centeno** de Travassós.

## 📞 Contactos

- **Email:** aguiarbike.17@gmail.com
- **Teléfonos:** +351 935 324 599 | +351 914 838 060`,
    },
    {
      language: "fr",
      title: "4ème Route de la Tresse et de la Paille",
      city: "Travassós",
      metaTitle:
        "4ème Route de la Tresse et de la Paille 2026 | Travassós, Fafe | 19 Avril",
      metaDescription:
        "4ème Route de la Tresse et de la Paille 2026 - 19 avril à Travassós, Fafe. VTT 25km et 45km + Randonnées. Célèbre les traditions de paille de seigle. Maillot officiel inclus jusqu'au 31 mars. Inscription: 12-23€.",
      description: `# 🚴 4ème Route de la Tresse et de la Paille 2026

La **4ème Route de la Tresse et de la Paille** célèbre les **traditions de paille de seigle** de Travassós.

## 📞 Contacts

- **Email:** aguiarbike.17@gmail.com
- **Téléphones:** +351 935 324 599 | +351 914 838 060`,
    },
    {
      language: "de",
      title: "4. Zopf- und Strohroute",
      city: "Travassós",
      metaTitle: "4. Zopf- und Strohroute 2026 | Travassós, Fafe | 19. April",
      metaDescription:
        "4. Zopf- und Strohroute 2026 - 19. April in Travassós, Fafe. MTB 25km und 45km + Wanderungen. Feiert Roggenstroh-Traditionen. Offizielles Trikot inklusive bis 31. März. Anmeldung: 12-23€.",
      description: `# 🚴 4. Zopf- und Strohroute 2026

Die **4. Zopf- und Strohroute** feiert die **Roggenstroh-Traditionen** von Travassós.

## 📞 Kontakte

- **Email:** aguiarbike.17@gmail.com
- **Telefone:** +351 935 324 599 | +351 914 838 060`,
    },
    {
      language: "it",
      title: "4ª Rotta della Treccia e della Paglia",
      city: "Travassós",
      metaTitle:
        "4ª Rotta della Treccia e della Paglia 2026 | Travassós, Fafe | 19 Aprile",
      metaDescription:
        "4ª Rotta della Treccia e della Paglia 2026 - 19 aprile a Travassós, Fafe. MTB 25km e 45km + Camminate. Celebra le tradizioni della paglia di segale. Maglia ufficiale inclusa fino al 31 marzo. Iscrizione: 12-23€.",
      description: `# 🚴 4ª Rotta della Treccia e della Paglia 2026

La **4ª Rotta della Treccia e della Paglia** celebra le **tradizioni della paglia di segale** di Travassós.

## 📞 Contatti

- **Email:** aguiarbike.17@gmail.com
- **Telefoni:** +351 935 324 599 | +351 914 838 060`,
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

  console.log("🚴 Creating variants...");

  await findOrCreateVariant({
    name: "BTT 25 km",
    distanceKm: 25,
    elevationGainM: 400,
    startTime: "09:30",
    maxParticipants: 75,
    price: 12.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "BTT 45 km",
    distanceKm: 45,
    elevationGainM: 800,
    startTime: "09:30",
    maxParticipants: 75,
    price: 12.0,
    currency: Currency.EUR,
  });

  console.log("   ✅ BTT variants created");

  console.log(`
🎉 4ª Rota da Trança e da Palha 2026 seeded successfully!
   📍 Event: 4ª Rota da Trança e da Palha
   🔗 Slug: ${event.slug}
   📅 Date: 2026-04-19
   📍 Location: Travassós, Fafe, Braga, Portugal
   🚴 Variants: BTT 25km, BTT 45km
   💰 Pricing: €12-23 (com/sem jersey)
   👥 Max: 150 participantes
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
