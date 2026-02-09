/**
 * Seed: Corrida de São Valentim - APAV - Corrida Virtual Solidária 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Corrida de São Valentim - APAV 2026...");

  const eventSlug = "corrida-sao-valentim-apav-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Corrida de São Valentim - APAV",
      description:
        "Corrida Virtual Solidária em apoio à APAV (Associação Portuguesa de Apoio à Vítima). Evento gratuito não competitivo com 3 distâncias: 5km, 10km e 21km. Corre onde quiseres entre 14-21 fevereiro.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-14T00:00:00.000Z"),
      endDate: new Date("2026-02-21T23:59:59.000Z"),
      city: "Virtual",
      country: "Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Portugal",
      externalUrl: "https://acorrer.pt/eventos/4153/info",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-13T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Corrida de São Valentim - APAV",
      description:
        "Corrida Virtual Solidária em apoio à APAV (Associação Portuguesa de Apoio à Vítima). Evento gratuito não competitivo com 3 distâncias: 5km, 10km e 21km. Corre onde quiseres entre 14-21 fevereiro.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-14T00:00:00.000Z"),
      endDate: new Date("2026-02-21T23:59:59.000Z"),
      city: "Virtual",
      country: "Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Portugal",
      externalUrl: "https://acorrer.pt/eventos/4153/info",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-13T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "Corrida de São Valentim - APAV",
      city: "Virtual",
      metaTitle:
        "Corrida de São Valentim APAV 2026 | Corrida Virtual Solidária",
      metaDescription:
        "Corrida de São Valentim APAV 2026 - Corrida virtual solidária GRATUITA de 14-21 fevereiro. 5km, 10km ou 21km. Apoia a APAV no combate à violência doméstica. Corre onde quiseres.",
      description: `# 🏃 Corrida de São Valentim - APAV 2026
## Corrida Virtual Solidária

A **Corrida de São Valentim** é um evento **virtual e solidário** organizado pela plataforma **acorrer.pt** em apoio à **APAV - Associação Portuguesa de Apoio à Vítima**.

## ❤️ Causa Solidária

Com este evento pretendemos apoiar a **APAV** no combate à **violência doméstica** e à **violência no namoro**. Ajuda-nos a erradicar a violência da nossa sociedade.

**Na compra de T-Shirt, 1€ reverte para a APAV.**

## 📅 Como Funciona

**Período:** 14 a 21 de fevereiro de 2026 (7 dias)

1. **Inscreve-te gratuitamente** em acorrer.pt
2. **Corre onde quiseres** - rua, trilho, passadeira, pista
3. **Regista com app GPS** - Strava, Garmin, Nike Run Club, etc.
4. **Envia comprovativo** - foto/screenshot com distância, tempo e nome
5. **Recebe diploma virtual** de participação

## 🏃 Distâncias

Escolhe a tua distância:
- **5 km**
- **10 km**
- **21 km** (Meia Maratona)

O percurso é **livre** - escolhe onde correr!

## 💰 Preço

- **Inscrição:** GRATUITA
- **T-Shirt (opcional):** 1€ reverte para a APAV

## 🎁 O Que Recebes

- ✅ **Inscrição gratuita**
- ✅ **Dorsal virtual** (enviado por email)
- ✅ **Diploma virtual** de participação
- ✅ Possibilidade de partilhar no Facebook da acorrer

## ⚙️ Regras

- Evento **não competitivo** - sem classificações
- Corrida pode ser realizada **em qualquer local**
- Registo deve incluir: **distância, tempo e data**
- Submissão até **23h59 do dia 21 de fevereiro**
- Cada participante é responsável pela sua segurança

## 📱 Submissão do Resultado

Após completares a tua corrida:
1. Tira **foto ou screenshot** da app GPS
2. A imagem deve mostrar: distância, tempo/duração e nome/foto
3. Envia através do **link recebido por email**

## 👥 Para Quem?

- **Todas as idades**
- **Todas as localizações**
- Qualquer nível de experiência
- Sem limite de participantes

## 🌍 Onde?

**Em qualquer lugar!** Escolhe o local que preferires:
- Rua ou estrada
- Trilho ou parque
- Passadeira em casa ou ginásio
- Pista de atletismo

## 📞 Contactos

- **Telefone:** 308 810 089
- **Email:** geral@acorrer.pt

## 💙 APAV

A **APAV - Associação Portuguesa de Apoio à Vítima** é uma instituição que apoia vítimas de crime e de violência. Promove e defende os direitos das vítimas e trabalha para a prevenção da vitimação.

**Juntos podemos fazer a diferença no combate à violência doméstica e no namoro.**

## 🤝 Partilha

Partilha a melhor foto da tua corrida no **Facebook da acorrer**:
https://www.facebook.com/acorrerPT

Vê também as fotos dos outros participantes e celebra esta causa solidária!`,
    },
    {
      language: "en" as const,
      title: "Valentine's Day Run - APAV",
      city: "Virtual",
      metaTitle: "Valentine's Day Run APAV 2026 | Virtual Charity Run",
      metaDescription:
        "Valentine's Day Run APAV 2026 - FREE virtual charity run Feb 14-21. 5km, 10km or 21km. Support APAV fighting domestic violence. Run anywhere you want.",
      description: `# 🏃 Valentine's Day Run - APAV 2026
## Virtual Charity Run

The **Valentine's Day Run** is a **virtual charity event** organized by **acorrer.pt** platform to support **APAV - Portuguese Association for Victim Support**.

## ❤️ Charity Cause

This event aims to support **APAV** in fighting **domestic violence** and **dating violence**. Help us eradicate violence from our society.

**€1 from each t-shirt purchase goes to APAV.**

## 📅 How It Works

**Period:** February 14-21, 2026 (7 days)

1. **Register for free** at acorrer.pt
2. **Run anywhere** - street, trail, treadmill, track
3. **Record with GPS app** - Strava, Garmin, Nike Run Club, etc.
4. **Submit proof** - photo/screenshot with distance, time and name
5. **Receive virtual diploma** of participation

## 🏃 Distances

Choose your distance:
- **5 km**
- **10 km**
- **21 km** (Half Marathon)

The route is **free** - choose where to run!

## 💰 Price

- **Registration:** FREE
- **T-Shirt (optional):** €1 goes to APAV

## 🎁 What You Get

- ✅ **Free registration**
- ✅ **Virtual race bib** (sent by email)
- ✅ **Virtual diploma** of participation
- ✅ Possibility to share on acorrer Facebook

## 👥 Who Can Join?

- **All ages**
- **All locations**
- Any experience level
- No participant limit

## 🌍 Where?

**Anywhere!** Choose your preferred location:
- Street or road
- Trail or park
- Treadmill at home or gym
- Athletics track

## 📞 Contacts

- **Phone:** +351 308 810 089
- **Email:** geral@acorrer.pt

## 💙 APAV

**APAV - Portuguese Association for Victim Support** is an institution that supports crime and violence victims. It promotes and defends victims' rights and works towards victimization prevention.

**Together we can make a difference in fighting domestic and dating violence.**`,
    },
    {
      language: "es" as const,
      title: "Carrera de San Valentín - APAV",
      city: "Virtual",
      metaTitle:
        "Carrera de San Valentín APAV 2026 | Carrera Virtual Solidaria",
      metaDescription:
        "Carrera de San Valentín APAV 2026 - Carrera virtual solidaria GRATIS 14-21 febrero. 5km, 10km o 21km. Apoya a APAV contra la violencia doméstica. Corre donde quieras.",
      description: `# 🏃 Carrera de San Valentín - APAV 2026

## 📞 Contactos

- **Teléfono:** +351 308 810 089
- **Email:** geral@acorrer.pt`,
    },
    {
      language: "fr" as const,
      title: "Course de la Saint-Valentin - APAV",
      city: "Virtual",
      metaTitle:
        "Course de la Saint-Valentin APAV 2026 | Course Virtuelle Solidaire",
      metaDescription:
        "Course de la Saint-Valentin APAV 2026 - Course virtuelle solidaire GRATUITE 14-21 février. 5km, 10km ou 21km. Soutenez APAV contre la violence domestique. Courez où vous voulez.",
      description: `# 🏃 Course de la Saint-Valentin - APAV 2026

## 📞 Contacts

- **Téléphone:** +351 308 810 089
- **Email:** geral@acorrer.pt`,
    },
    {
      language: "de" as const,
      title: "Valentinstag-Lauf - APAV",
      city: "Virtual",
      metaTitle: "Valentinstag-Lauf APAV 2026 | Virtueller Wohltätigkeitslauf",
      metaDescription:
        "Valentinstag-Lauf APAV 2026 - KOSTENLOSER virtueller Wohltätigkeitslauf 14-21. Februar. 5km, 10km oder 21km. Unterstütze APAV gegen häusliche Gewalt. Laufe wo du willst.",
      description: `# 🏃 Valentinstag-Lauf - APAV 2026

## 📞 Kontakte

- **Telefon:** +351 308 810 089
- **Email:** geral@acorrer.pt`,
    },
    {
      language: "it" as const,
      title: "Corsa di San Valentino - APAV",
      city: "Virtual",
      metaTitle: "Corsa di San Valentino APAV 2026 | Corsa Virtuale Solidale",
      metaDescription:
        "Corsa di San Valentino APAV 2026 - Corsa virtuale solidale GRATUITA 14-21 febbraio. 5km, 10km o 21km. Sostieni APAV contro la violenza domestica. Corri dove vuoi.",
      description: `# 🏃 Corsa di San Valentino - APAV 2026

## 📞 Contatti

- **Telefono:** +351 308 810 089
- **Email:** geral@acorrer.pt`,
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
    name: "5 km",
    distanceKm: 5,
    startTime: "00:00",
    price: 0.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "10 km",
    distanceKm: 10,
    startTime: "00:00",
    price: 0.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "21 km",
    distanceKm: 21,
    startTime: "00:00",
    price: 0.0,
    currency: Currency.EUR,
  });

  console.log("✅ Corrida de São Valentim - APAV 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
