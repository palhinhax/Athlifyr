/**
 * Seed: 2º Trail Lagoa da Pateira 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 2º Trail Lagoa da Pateira 2026...");

  const eventSlug = "trail-lagoa-pateira-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "2º Trail Lagoa da Pateira",
      description:
        "2ª Edição do Trail Lagoa da Pateira em Requeixo, Aveiro. Organizado pelos Agarrados ao BTT. Trail 20km, Mini Trail 12km e Caminhada 8km junto à Lagoa da Pateira. Lanche incluído com bifana.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Requeixo, Aveiro",
      country: "Portugal",
      latitude: 40.5948,
      longitude: -8.531,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=40.5948,-8.531",
      externalUrl: "https://acorrer.pt/eventos/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-01T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "2º Trail Lagoa da Pateira",
      description:
        "2ª Edição do Trail Lagoa da Pateira em Requeixo, Aveiro. Organizado pelos Agarrados ao BTT. Trail 20km, Mini Trail 12km e Caminhada 8km junto à Lagoa da Pateira. Lanche incluído com bifana.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Requeixo, Aveiro",
      country: "Portugal",
      latitude: 40.5948,
      longitude: -8.531,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=40.5948,-8.531",
      externalUrl: "https://acorrer.pt/eventos/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-01T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "2º Trail Lagoa da Pateira",
      city: "Requeixo",
      metaTitle: "2º Trail Lagoa da Pateira 2026 | Aveiro | 8 Março",
      metaDescription:
        "2º Trail Lagoa da Pateira 2026 - 8 março em Requeixo, Aveiro. 2ª Edição pelos Agarrados ao BTT. Trail 20km, Mini 12km e Caminhada 8km. Bifana incluída. Banhos quentes. Inscrições: 10-15€.",
      description: `# 🏃 2º Trail Lagoa da Pateira 2026
## 2ª Edição - Agarrados ao BTT

O **2º Trail Lagoa da Pateira** é uma prova organizada pelos **Agarrados ao BTT** em parceria com a **Junta de Freguesia de Requeixo, Nossa Senhora de Fátima e Nariz**.

Evento desportivo transpondo alguns locais da Freguesia, junto à icónica **Lagoa da Pateira**, constituído por duas provas competitivas (20km e 12km) e uma caminhada (8km).

## 📅 Data e Programa

**Data:** Domingo, 8 de março de 2026

**Sábado (7 Março):**
- 17:00-20:00 - Secretariado (Sede dos Agarrados ao BTT)

**Domingo (8 Março):**
- 07:00-08:30 - Secretariado
- 08:30 - **Briefing geral**
- 09:00 - **Controlo zero e Partida Trail 20km**
- 09:30 - **Partida Mini Trail 12km**
- 09:35 - **Partida Caminhada 8km**
- 12:30 - Cerimónia de entrega de prémios
- 15:00 - Encerramento do evento

## 🏃 Percursos

### Trail 20 km
**Tempo limite:** 4h30
**Barreiras horárias:**
- 1ª: 1h30 aos 7km
- 2ª: 2h aos 14km

**Idade mínima:** 18 anos
**Desnível positivo:** ~400m

### Mini Trail 12 km
**Tempo limite:** 3 horas
**Barreira horária:** 1h30 aos 7km
**Idade mínima:** 18 anos
**Desnível positivo:** ~250m

### Caminhada 8 km
**Sem tempo limite**
**Todas as idades** (menores de 10 anos não aconselhado, 10-17 com encarregados)
**Animais permitidos** (sob responsabilidade dos donos)

**Partida/Chegada:** Sede dos Agarrados ao BTT
**Coordenadas:** 40.594788, -8.531048

**Terreno:** Percursos circulares marcados com fitas cor laranja, spray e placas.

## 💰 Preços

**Trail 20 km:** 15€
**Vagas:** 500

**Mini Trail 12 km:** 15€
**Vagas:** 500

**Caminhada 8 km:** 10€
**Vagas:** 500

**Opcionais:**
- **Acompanhantes:** 5€

## 🎁 Inscrição Inclui

- ✅ Dorsal com chip (excepto caminhada)
- ✅ **T-shirt técnica**
- ✅ Seguro desportivo
- ✅ Cronometragem electrónica (Trail e Mini Trail)
- ✅ **Abastecimentos** sólidos e líquidos
- ✅ **Lanche no final:** 1 bifana + 1 bebida
- ✅ **Banhos quentes** (Campo das Poças)
- ✅ Outros brindes

## 🚰 Abastecimentos

**Trail 20km:**
- PA1 [L+S] aos 6.5km
- PA2 [L] aos 12km
- PA3 [L+S] aos 21km (chegada)

**Mini Trail 12km:**
- PA1 [L+S] aos 6.5km
- PA2 [L] aos 12km (chegada)

**Caminhada 8km:**
- PA1 [L+S] aos 4km

## 🏆 Prémios

**Trail 20km e Mini Trail 12km:**
- **Troféus** para os 3 primeiros absolutos M/F
- **Troféus** para os 3 primeiros de cada escalão M/F

**Caminhada:** Sem carácter competitivo

## 🏅 Escalões

**Trail 20km e 12km:**
- **Seniores M/F:** 18-39 anos (nasc. 1985-2006)
- **Veteranos M40/F40:** 40-49 anos (nasc. 1975-1984)
- **Veteranos M50/F50:** 50-59 anos (nasc. 1965-1974)
- **Veteranos M60/F60:** 60+ anos

**Importante:** Para efeitos de classificação por escalões será considerado o **ano de nascimento**.

## ⚙️ Material Obrigatório

Para **Trail e Mini Trail**:
- ✅ **Telemóvel operacional**
- ✅ **Apito**
- ✅ **Depósito de água (mínimo 1 litro)**
- ✅ **Manta térmica**

Possibilidade de verificação no final da prova.

## 👥 Participação

- **Trail e Mini Trail:** 18+ anos (menores com autorização dos encarregados)
- **Caminhada:** Todas as idades (menores de 10 não aconselhado)
- **Total vagas:** 1500 participantes

## 📍 Localização

**Partida/Chegada:**
Sede dos Agarrados ao BTT
Requeixo, Aveiro

**Balneários/Banhos:**
Campo das Poças
Associação Desportiva de Requeixo

**Estacionamento:**
- Junto à sede dos Agarrados ao BTT na estrada
- Campo das Poças da Associação Desportiva de Requeixo

**Coordenadas GPS:** 40.594788, -8.531048

## 📞 Contactos

- **Telemóveis:** 962 865 868 / 968 579 333 / 916 388 615

## 🌿 Responsabilidade Ambiental

O atleta é o **único responsável** por transportar todos os invólucros e resíduos derivados de géis, barras e outros materiais. Deve deixar os resíduos no abastecimento mais próximo ou transportá-los até à linha de chegada.

Não é permitido destruir ou alterar propositadamente qualquer elemento natural ao longo do percurso.

## 💧 Lagoa da Pateira

Desfruta dos percursos junto à **Lagoa da Pateira**, a maior lagoa natural da Península Ibérica, numa experiência única que combina desporto, natureza e paisagens deslumbrantes.`,
    },
    {
      language: "en" as const,
      title: "2º Pateira Lagoon Trail",
      city: "Requeixo",
      metaTitle: "2º Pateira Lagoon Trail 2026 | Aveiro | March 8",
      metaDescription:
        "2º Pateira Lagoon Trail 2026 - March 8 in Requeixo, Aveiro. 2nd Edition by Agarrados ao BTT. Trail 20km, Mini 12km and Walk 8km. Bifana included. Hot showers. Entry: €10-15.",
      description: `# 🏃 2º Pateira Lagoon Trail 2026
## 2nd Edition - Agarrados ao BTT

The **2º Pateira Lagoon Trail** is an event organized by **Agarrados ao BTT** in partnership with **Requeixo Parish Council**.

Sports event covering locations in the Parish, near the iconic **Pateira Lagoon**, consisting of two competitive races (20km and 12km) and one walk (8km).

## 🏃 Routes

**Trail 20 km:** Time limit 4h30 with time barriers (1h30 at 7km, 2h at 14km). Min age: 18 years. ~400m elevation

**Mini Trail 12 km:** Time limit 3 hours with time barrier (1h30 at 7km). Min age: 18 years. ~250m elevation

**Walk 8 km:** No time limit. All ages (under 10 not advised, 10-17 with guardians). **Dogs allowed** (owner's responsibility)

**Start/Finish:** Agarrados ao BTT Headquarters
**Coordinates:** 40.594788, -8.531048

## 💰 Prices

**Trail 20 km:** €15 - Slots: 500
**Mini Trail 12 km:** €15 - Slots: 500
**Walk 8 km:** €10 - Slots: 500

**Optional:**
- Companions: €5

## 🎁 Entry Includes

- Race bib with chip (except walk)
- **Technical t-shirt**
- Sports insurance
- Electronic timing (Trail and Mini Trail)
- **Solid and liquid refreshments**
- **Snack at finish:** 1 bifana + 1 drink
- **Hot showers** (Campo das Poças)
- Other gifts

## ⚙️ Mandatory Equipment

For **Trail and Mini Trail**:
- ✅ **Operational mobile phone**
- ✅ **Whistle**
- ✅ **Water container (minimum 1 liter)**
- ✅ **Thermal blanket**

## 👥 Participation

- **Trail and Mini Trail:** 18+ years (minors with guardian authorization)
- **Walk:** All ages (under 10 not advised)
- **Total slots:** 1500 participants

## 📍 Location

**Start/Finish:**
Agarrados ao BTT Headquarters
Requeixo, Aveiro, Portugal

**GPS Coordinates:** 40.594788, -8.531048

## 📞 Contacts

- **Phones:** +351 962 865 868 / +351 968 579 333 / +351 916 388 615

## 💧 Pateira Lagoon

Enjoy routes near **Pateira Lagoon**, the largest natural lagoon in the Iberian Peninsula, in a unique experience combining sport, nature and stunning landscapes.`,
    },
    {
      language: "es" as const,
      title: "2º Trail Laguna de Pateira",
      city: "Requeixo",
      metaTitle: "2º Trail Laguna de Pateira 2026 | Aveiro | 8 Marzo",
      metaDescription:
        "2º Trail Laguna de Pateira 2026 - 8 marzo en Requeixo, Aveiro. 2ª Edición por Agarrados ao BTT. Trail 20km, Mini 12km y Caminata 8km. Bifana incluida. Duchas calientes. Inscripciones: 10-15€.",
      description: `# 🏃 2º Trail Laguna de Pateira 2026

## 📞 Contactos

- **Teléfonos:** +351 962 865 868 / +351 968 579 333 / +351 916 388 615`,
    },
    {
      language: "fr" as const,
      title: "2º Trail Lagune de Pateira",
      city: "Requeixo",
      metaTitle: "2º Trail Lagune de Pateira 2026 | Aveiro | 8 Mars",
      metaDescription:
        "2º Trail Lagune de Pateira 2026 - 8 mars à Requeixo, Aveiro. 2ème Édition par Agarrados ao BTT. Trail 20km, Mini 12km et Marche 8km. Bifana incluse. Douches chaudes. Inscription: 10-15€.",
      description: `# 🏃 2º Trail Lagune de Pateira 2026

## 📞 Contacts

- **Téléphones:** +351 962 865 868 / +351 968 579 333 / +351 916 388 615`,
    },
    {
      language: "de" as const,
      title: "2º Pateira-Lagunen-Trail",
      city: "Requeixo",
      metaTitle: "2º Pateira-Lagunen-Trail 2026 | Aveiro | 8. März",
      metaDescription:
        "2º Pateira-Lagunen-Trail 2026 - 8. März in Requeixo, Aveiro. 2. Ausgabe von Agarrados ao BTT. Trail 20km, Mini 12km und Wanderung 8km. Bifana inklusive. Warme Duschen. Anmeldung: 10-15€.",
      description: `# 🏃 2º Pateira-Lagunen-Trail 2026

## 📞 Kontakte

- **Telefone:** +351 962 865 868 / +351 968 579 333 / +351 916 388 615`,
    },
    {
      language: "it" as const,
      title: "2º Trail Laguna di Pateira",
      city: "Requeixo",
      metaTitle: "2º Trail Laguna di Pateira 2026 | Aveiro | 8 Marzo",
      metaDescription:
        "2º Trail Laguna di Pateira 2026 - 8 marzo a Requeixo, Aveiro. 2ª Edizione di Agarrados ao BTT. Trail 20km, Mini 12km e Camminata 8km. Bifana inclusa. Docce calde. Iscrizione: 10-15€.",
      description: `# 🏃 2º Trail Laguna di Pateira 2026

## 📞 Contatti

- **Telefoni:** +351 962 865 868 / +351 968 579 333 / +351 916 388 615`,
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
    name: "Trail 20 km",
    distanceKm: 20,
    elevationGainM: 400,
    startTime: "09:00",
    maxParticipants: 500,
    price: 15.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Mini Trail 12 km",
    distanceKm: 12,
    elevationGainM: 250,
    startTime: "09:30",
    maxParticipants: 500,
    price: 15.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Caminhada 8 km",
    distanceKm: 8,
    elevationGainM: 150,
    startTime: "09:35",
    maxParticipants: 500,
    price: 10.0,
    currency: Currency.EUR,
  });

  console.log("✅ 2º Trail Lagoa da Pateira 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
