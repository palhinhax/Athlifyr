/**
 * Seed: 31ª Corrida das Lezírias 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 31ª Corrida das Lezírias 2026...");

  const eventSlug = "corrida-lezirias-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "31ª Corrida das Lezírias",
      description: `A mítica e adorada Corrida das Lezírias celebra a 31ª edição em 2026! Vila Franca de Xira volta a ser, no dia 1 de Março 2026, o palco da tradicional Corrida das Lezírias que, anualmente, reúne na cidade milhares de atletas e amantes do desporto, oriundos de todo o país.`,
      sportTypes: [SportType.RUNNING, SportType.TRAIL],
      startDate: new Date("2026-03-01T10:00:00.000Z"),
      endDate: null,
      city: "Vila Franca de Xira",
      country: "Portugal",
      latitude: 38.9511,
      longitude: -8.9881,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Parque+Urbano+do+Cevadeiro+Vila+Franca+de+Xira",
      externalUrl: "https://xistarca.pt/corrida-lezirias-2026",
      imageUrl:
        "https://xistarca.pt/wp-content/uploads/2025/corrida-lezirias-2026.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-28T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "31ª Corrida das Lezírias",
      description: `A mítica e adorada Corrida das Lezírias celebra a 31ª edição em 2026! Vila Franca de Xira volta a ser, no dia 1 de Março 2026, o palco da tradicional Corrida das Lezírias que, anualmente, reúne na cidade milhares de atletas e amantes do desporto, oriundos de todo o país.`,
      sportTypes: [SportType.RUNNING, SportType.TRAIL],
      startDate: new Date("2026-03-01T10:00:00.000Z"),
      endDate: null,
      city: "Vila Franca de Xira",
      country: "Portugal",
      latitude: 38.9511,
      longitude: -8.9881,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Parque+Urbano+do+Cevadeiro+Vila+Franca+de+Xira",
      externalUrl: "https://xistarca.pt/corrida-lezirias-2026",
      imageUrl:
        "https://xistarca.pt/wp-content/uploads/2025/corrida-lezirias-2026.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-28T23:59:59.000Z"),
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
      title: "31ª Corrida das Lezírias",
      description: `# 🏃‍♂️ Bem-vindo à 31ª Corrida das Lezírias!

A mítica e adorada **Corrida das Lezírias** celebra a 31ª edição em 2026!

Vila Franca de Xira volta a ser, no dia **1 de Março 2026**, o palco da tradicional Corrida das Lezírias que, anualmente, reúne na cidade milhares de atletas e amantes do desporto, oriundos de todo o país.

Poderás participar na prova principal de **15,5 km** que conta com um percurso em asfalto, calçada e terra batida, na prova de **5 km** em piso betuminoso ou na **corridinha de 400 metros a 800 metros**, dedicada aos atletas mais novos.

## 📅 Distância / Hora / Local

**Data:** 01 Março 2026  
**Local:** Parque Urbano do Cevadeiro | Vila Franca de Xira

### Horários:
- **Corridinha 400m/800m:** 09h30
- **Corrida 15,5 km:** 10h00 | asfalto, calçada e terra batida
- **Mini Corrida 5km:** 10h10 | piso betuminoso

## 📝 Inscrições

Inscreve-te online em: [xistarca.pt](https://xistarca.pt/corrida-lezirias-2026)

**Extras Disponíveis:**
- 📋 **Entrega de dorsal no dia do evento:** 3,00€

*\* Inscrição de última hora é realizada presencialmente, nos dias e horários de levantamento do kit participante.*

## 🎁 Kit Participante

Todos os participantes recebem:
- 🎽 **T-shirt técnica**
- 🏁 **Dorsal**
- 🏅 **Medalha Finisher**
- 🎁 **Outras possíveis ofertas de patrocinadores**

**Extras:**
- 📋 **Entrega de dorsal no dia do evento:** 3,00€\*

*\* Este valor apenas é válido se for comprado online, em conjunto com a inscrição.*

**IMPORTANTE:**
- O chip no dorsal está disponível apenas para a Corrida
- O chip **NÃO pode ser dobrado**
- Os tamanhos serão distribuídos de acordo com os pedidos efetuados, até rutura de stock

## 📦 Levantamento do Kit Participante

**Documentos necessários:**
- Cartão de Cidadão, Passaporte, Carta de Condução ou outro com foto e nome
- Número de dorsal atribuído por email, após a inscrição

Se quiseres levantar o kit de outro participante, deverás apresentar os mesmos documentos.

### Locais e Horários:

**Nas instalações da Xistarca:**
- **5ª feira, 26 de fevereiro:** 14h30 - 18h30

**Em local a definir:**
- **6ª feira, 27 de fevereiro:** 10h00 - 20h00

**No Pavilhão Multiusos de Vila Franca de Xira:**
- **Sábado, 28 de fevereiro:** 10h00-13h00 e 14h00-17h00

**No dia do evento:**
- **Domingo, 01 março:** 08h00 - 09h15
- **Custo:** 3,00€ (se comprado online) / 3,50€ (sem compra prévia)

💚 **Antes de imprimires pensa bem se tens mesmo que o fazer. Preserva o meio-ambiente. Traz um saco reutilizável contigo para levares o teu kit.**

## 🗺️ Mapa / Percursos

### Percurso Corrida 15,5km
**Asfalto, calçada e terra batida**

Partida de Vila Franca de Xira na Estrada Nacional N.º 10 junto ao Parque Urbano de Vila Franca de Xira, Largo 5 de Outubro, Rua 1º Dezembro, Rua Serpa Pinto, Largo Marquês de Pombal, Rua do Curado, Rua Joaquim Pedro Monteiro, acesso à Ponte Marechal Carmona, E. N. 10 à direita para a Lezíria, efetuando um circuito de 9 Km e regressando pelo mesmo percurso, sendo a chegada no Parque Urbano de Vila Franca de Xira.

### Percurso Mini-Corrida 5km
Partida de Vila Franca de Xira na Estrada Nacional N.º 10 junto ao Parque Urbano de Vila Franca de Xira, Largo 5 de Outubro, Rua 1º Dezembro, passagem superior pedonal da Biblioteca Municipal Fábrica das Palavras, em frente pelo passeio pedonal ribeirinho até Alhandra (junto à Piscina do Alhandra Sporting Clube) e regresso, com a chegada no Parque Urbano de Vila Franca de Xira.

### Percurso Corridinha
Circuito no Parque Urbano de Vila Franca de Xira.

⚠️ **Em caso de condições meteorológicas adversas um novo percurso será planeado.**

## 🏆 Prémios

### Corrida 15,5km:
- 🥇 **Troféus** aos 3 primeiros da classificação geral (M/F)
- 🥇 **Troféus** aos 3 primeiros por escalão (M/F)
- 🏆 **Troféus** às 3 primeiras equipas (5 elementos)

### Mini-corrida 5km:
- 🥇 **Troféus** aos 3 primeiros classificados M/F da Geral

### Corridinha:
- 🥇 **Troféus** aos 3 primeiros classificados M/F de cada escalão

*\* Caso o prémio não seja levantado no dia do evento, poderás fazê-lo no prazo máximo de 30 dias, nas instalações da Xistarca.*

## 👥 Escalões

### Corrida 15,5km
**Masculinos e Femininos:**
- Juniores e Seniores (18 a 34 anos)
- Vet I (35 a 39 anos)
- Vet II (40 a 44 anos)
- Vet III (45 a 49 anos)
- Vet IV (50 a 55 anos)
- Vet V (55 a 59 anos)
- Vet VI (60 a 64 anos)
- Vet VII (65 a 69 anos)
- Vet VIII (+70 anos)

### Mini-corrida/caminhada 5km
- A prova é aberta a participantes com mais de 10 anos, à data da prova, desde que acompanhadas pelo/a encarregado/a de educação.

### Corridinha
- **Benjamins A:** 2017 a 2019 (distância de 400m)
- **Benjamins B:** 2015 e 2016 (distância de 800m)
- **Infantis:** 2013 e 2014 (distância de 800m)

## 📋 Outras Informações

### Pontos de Controlo
Haverão pontos de controlo ao longo do percurso da responsabilidade da organização.

### Balneários
A organização disponibilizará Balneários no final da prova.

### 🎒 Bengaleiro
A organização disponibiliza bengaleiro na zona da partida/chegada, entre as 8h30 e as 12h00. **Só serão aceites sacos fechados.** Vestuário individual sem estar em saco será rejeitado.

### 💧 Abastecimentos
- **15,5km:** Água Vimeiro aos 5km, 10km | Líquido e sólido na Meta
- **5km:** Líquido e sólido na Meta
- **Corridinha:** Líquido e sólido na Meta

### 🛡️ Seguro
Os participantes devidamente inscritos serão abrangidos por um seguro de acidentes pessoais, conforme previsto no Decreto Lei nº 10/2009 (Seguro Desportivo).

**Nota:** Em caso de algum acidente dos participantes e que tenham recorrido ao SN Saúde, devem comunicar no prazo de 3 dias para geral@xistarca.pt, para receberem, preencherem e reenviarem o documento de participação do acidente para serem ressarcidos dos custos dessa assistência médica.

### 👥 Participantes
- A prova de **15,5km (corrida)** destina-se a todos os interessados, com idade superior a 18 anos.
- A prova de **5km (caminhada)** é uma prova aberta a todos os interessados em participar no evento, sem limite de idade.
- A prova **Corridinha** destina-se a crianças entre os 6 e os 13 anos de idade (inclusive).

### 📊 Alterações
Não serão aceites alterações às inscrições no dia do evento.

### 🏅 Classificações
As classificações da corrida estarão disponíveis após a prova, divididas em:
- Classificação geral
- Classificação masculina
- Classificação feminina
- Classificação por escalão

### 📸 Direitos de Imagem
O participante, ao proceder à inscrição, autoriza a cedência, de forma gratuita e incondicional, à Xistarca, Promoções e Publicações Desportivas, Lda, os direitos de utilização da sua imagem captada nas filmagens que terão lugar durante o evento, autorizando a sua reprodução em peças comunicacionais de apoio.

### 🔒 Proteção de Dados Pessoais
Os dados pessoais serão processados automaticamente, nos termos aprovados pelo Regulamento Geral de Proteção de Dados, da União Europeia, pela organização do evento, entidade responsável pelos dados, destinando-se exclusivamente à prestação dos serviços necessários à participação no evento em que se inscreve.

O tratamento de dados para comunicação sobre o evento em que se inscreve é opcional e está sujeito a consentimento específico e expresso no formulário de inscrição do evento, sempre em conformidade com o Regulamento (UE) 2016/679.

É garantido aos participantes, nos termos da mesma lei, o acesso aos seus dados, podendo solicitar por escrito junto da organização a sua atualização, correção ou eliminação.

Os dados pessoais recolhidos em função do presente evento serão armazenados pelo prazo de dois anos e estarão acessíveis de forma gratuita para consulta, retificação ou eliminação através do email: geral@xistarca.pt

## ⚠️ Outros

**Serão automaticamente desclassificados da prova todos os concorrentes que:**
- ❌ Não efetuem o controlo de partida
- ❌ Não cumpram o percurso na totalidade
- ❌ Não levem o dorsal ao peito, bem visível, e durante toda a prova
- ❌ Corram com o dorsal e chip de outro concorrente
- ❌ Não respeitem as instruções da Organização

### Cancelamento da Inscrição
A organização não faz a devolução do valor da inscrição ou troca de evento.

### Aceitação
Ao te inscreveres, automaticamente aceitas o presente regulamento e assumes a responsabilidade de participação no evento, estando ciente do teu estado de saúde, sentindo-te fisicamente e psicologicamente apto para participar.

---

**Vem celebrar 31 anos da mítica Corrida das Lezírias! 🏃‍♂️🦅**`,
      city: "Vila Franca de Xira",
      metaTitle: "31ª Corrida das Lezírias 2026 | Vila Franca de Xira",
      metaDescription:
        "31ª edição da mítica Corrida das Lezírias. Corrida 15,5km, Mini-Corrida 5km e Corridinha 400m/800m. 1 Março 2026 em Vila Franca de Xira.",
    },
    {
      language: "en",
      title: "31st Lezírias Race",
      description: `# 🏃‍♂️ Welcome to the 31st Lezírias Race!

The mythical and beloved **Lezírias Race** celebrates its 31st edition in 2026!

Vila Franca de Xira will once again be, on **March 1, 2026**, the stage for the traditional Lezírias Race which annually gathers thousands of athletes and sports lovers from all over the country.

You can participate in the main **15.5 km race** featuring a course on asphalt, pavement and dirt track, in the **5 km race** on tarmac or in the **400 to 800 meter kids race**, dedicated to younger athletes.

## 📅 Distance / Time / Location

**Date:** March 01, 2026  
**Location:** Parque Urbano do Cevadeiro | Vila Franca de Xira

### Schedule:
- **Kids Race 400m/800m:** 09:30
- **15.5 km Race:** 10:00 | asphalt, pavement and dirt track
- **5km Mini Race:** 10:10 | tarmac

## 📝 Registration

Register online at: [xistarca.pt](https://xistarca.pt/corrida-lezirias-2026)

**Available Extras:**
- 📋 **Race day bib pickup:** €3.00

## 🎁 Participant Kit

All participants receive:
- 🎽 **Technical T-shirt**
- 🏁 **Race Bib**
- 🏅 **Finisher Medal**
- 🎁 **Other possible sponsor gifts**

**IMPORTANT:**
- The chip on the bib is available only for the Race
- The chip **CANNOT be folded**

## 🏆 Prizes

### 15.5km Race:
- 🥇 **Trophies** for the top 3 overall (M/F)
- 🥇 **Trophies** for the top 3 per age group (M/F)
- 🏆 **Trophies** for the top 3 teams (5 members)

### 5km Mini-race:
- 🥇 **Trophies** for the top 3 overall M/F

### Kids Race:
- 🥇 **Trophies** for the top 3 M/F in each age group

Come celebrate 31 years of the mythical Lezírias Race! 🏃‍♂️🦅`,
      city: "Vila Franca de Xira",
      metaTitle: "31st Lezírias Race 2026 | Vila Franca de Xira",
      metaDescription:
        "31st edition of the mythical Lezírias Race. 15.5km Race, 5km Mini-Race and 400m/800m Kids Race. March 1, 2026 in Vila Franca de Xira.",
    },
    {
      language: "es",
      title: "31ª Carrera de las Lezírias",
      description: `# 🏃‍♂️ ¡Bienvenido a la 31ª Carrera de las Lezírias!

La mítica y adorada **Carrera de las Lezírias** celebra su 31ª edición en 2026!

Vila Franca de Xira será nuevamente, el **1 de marzo de 2026**, el escenario de la tradicional Carrera de las Lezírias que anualmente reúne miles de atletas y amantes del deporte de todo el país.

Puedes participar en la carrera principal de **15,5 km** con un recorrido en asfalto, calzada y tierra batida, en la carrera de **5 km** en pavimento o en la **carrera infantil de 400 a 800 metros**, dedicada a los atletas más jóvenes.

## 📅 Distancia / Hora / Ubicación

**Fecha:** 01 Marzo 2026  
**Ubicación:** Parque Urbano do Cevadeiro | Vila Franca de Xira

### Horarios:
- **Carrera Infantil 400m/800m:** 09:30
- **Carrera 15,5 km:** 10:00 | asfalto, calzada y tierra batida
- **Mini Carrera 5km:** 10:10 | pavimento

## 🏆 Premios

### Carrera 15,5km:
- 🥇 **Trofeos** para los 3 primeros de la clasificación general (M/F)
- 🥇 **Trofeos** para los 3 primeros por categoría (M/F)
- 🏆 **Trofeos** para los 3 primeros equipos (5 miembros)

¡Ven a celebrar 31 años de la mítica Carrera de las Lezírias! 🏃‍♂️🦅`,
      city: "Vila Franca de Xira",
      metaTitle: "31ª Carrera de las Lezírias 2026 | Vila Franca de Xira",
      metaDescription:
        "31ª edición de la mítica Carrera de las Lezírias. Carrera 15,5km, Mini-Carrera 5km y Carrera Infantil. 1 marzo 2026 en Vila Franca de Xira.",
    },
    {
      language: "fr",
      title: "31ème Course des Lezírias",
      description: `# 🏃‍♂️ Bienvenue à la 31ème Course des Lezírias!

La mythique et adorée **Course des Lezírias** célèbre sa 31ème édition en 2026!

Vila Franca de Xira sera à nouveau, le **1er mars 2026**, le théâtre de la traditionnelle Course des Lezírias qui rassemble chaque année des milliers d'athlètes et d'amateurs de sport de tout le pays.

Vous pouvez participer à la course principale de **15,5 km** avec un parcours sur asphalte, chaussée et terre battue, à la course de **5 km** sur bitume ou à la **course enfants de 400 à 800 mètres**, dédiée aux jeunes athlètes.

## 📅 Distance / Heure / Lieu

**Date:** 01 Mars 2026  
**Lieu:** Parque Urbano do Cevadeiro | Vila Franca de Xira

### Horaires:
- **Course Enfants 400m/800m:** 09h30
- **Course 15,5 km:** 10h00 | asphalte, chaussée et terre battue
- **Mini Course 5km:** 10h10 | bitume

## 🏆 Prix

### Course 15,5km:
- 🥇 **Trophées** pour les 3 premiers du classement général (M/F)
- 🥇 **Trophées** pour les 3 premiers par catégorie (M/F)
- 🏆 **Trophées** pour les 3 premières équipes (5 membres)

Venez célébrer 31 ans de la mythique Course des Lezírias! 🏃‍♂️🦅`,
      city: "Vila Franca de Xira",
      metaTitle: "31ème Course des Lezírias 2026 | Vila Franca de Xira",
      metaDescription:
        "31ème édition de la mythique Course des Lezírias. Course 15,5km, Mini-Course 5km et Course Enfants. 1er mars 2026 à Vila Franca de Xira.",
    },
    {
      language: "de",
      title: "31. Lezírias-Lauf",
      description: `# 🏃‍♂️ Willkommen zum 31. Lezírias-Lauf!

Der mythische und geliebte **Lezírias-Lauf** feiert seine 31. Ausgabe im Jahr 2026!

Vila Franca de Xira wird am **1. März 2026** erneut Schauplatz des traditionellen Lezírias-Laufs sein, der jährlich Tausende von Athleten und Sportbegeisterten aus dem ganzen Land zusammenbringt.

Sie können am **15,5 km Hauptlauf** mit einer Strecke auf Asphalt, Pflaster und unbefestigtem Weg teilnehmen, am **5 km Lauf** auf Asphalt oder am **400 bis 800 Meter Kinderlauf**, der jungen Athleten gewidmet ist.

## 📅 Distanz / Zeit / Ort

**Datum:** 01. März 2026  
**Ort:** Parque Urbano do Cevadeiro | Vila Franca de Xira

### Zeitplan:
- **Kinderlauf 400m/800m:** 09:30
- **15,5 km Lauf:** 10:00 | Asphalt, Pflaster und unbefestigter Weg
- **5km Mini-Lauf:** 10:10 | Asphalt

## 🏆 Preise

### 15,5km Lauf:
- 🥇 **Trophäen** für die Top 3 der Gesamtwertung (M/W)
- 🥇 **Trophäen** für die Top 3 pro Alterskategorie (M/W)
- 🏆 **Trophäen** für die Top 3 Teams (5 Mitglieder)

Komm und feiere 31 Jahre des mythischen Lezírias-Laufs! 🏃‍♂️🦅`,
      city: "Vila Franca de Xira",
      metaTitle: "31. Lezírias-Lauf 2026 | Vila Franca de Xira",
      metaDescription:
        "31. Ausgabe des mythischen Lezírias-Laufs. 15,5km Lauf, 5km Mini-Lauf und Kinderlauf. 1. März 2026 in Vila Franca de Xira.",
    },
    {
      language: "it",
      title: "31ª Corsa delle Lezírias",
      description: `# 🏃‍♂️ Benvenuti alla 31ª Corsa delle Lezírias!

La mitica e amata **Corsa delle Lezírias** celebra la sua 31ª edizione nel 2026!

Vila Franca de Xira sarà nuovamente, il **1° marzo 2026**, il palcoscenico della tradizionale Corsa delle Lezírias che ogni anno riunisce migliaia di atleti e appassionati di sport da tutto il paese.

Puoi partecipare alla gara principale di **15,5 km** con un percorso su asfalto, pavimentazione e sterrato, alla gara di **5 km** su asfalto o alla **corsa bambini di 400-800 metri**, dedicata ai giovani atleti.

## 📅 Distanza / Ora / Luogo

**Data:** 01 Marzo 2026  
**Luogo:** Parque Urbano do Cevadeiro | Vila Franca de Xira

### Orari:
- **Corsa Bambini 400m/800m:** 09:30
- **Corsa 15,5 km:** 10:00 | asfalto, pavimentazione e sterrato
- **Mini Corsa 5km:** 10:10 | asfalto

## 🏆 Premi

### Corsa 15,5km:
- 🥇 **Trofei** per i primi 3 della classifica generale (M/F)
- 🥇 **Trofei** per i primi 3 per categoria (M/F)
- 🏆 **Trofei** per le prime 3 squadre (5 membri)

Vieni a celebrare 31 anni della mitica Corsa delle Lezírias! 🏃‍♂️🦅`,
      city: "Vila Franca de Xira",
      metaTitle: "31ª Corsa delle Lezírias 2026 | Vila Franca de Xira",
      metaDescription:
        "31ª edizione della mitica Corsa delle Lezírias. Corsa 15,5km, Mini-Corsa 5km e Corsa Bambini. 1° marzo 2026 a Vila Franca de Xira.",
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
      name: "Corridinha 400m",
      distanceKm: 0.4,
      price: 5.0,
      startTime: "09:30",
    },
    {
      name: "Corridinha 800m",
      distanceKm: 0.8,
      price: 5.0,
      startTime: "09:30",
    },
    {
      name: "Corrida 15,5 km",
      distanceKm: 15.5,
      price: 12.0,
      startTime: "10:00",
    },
    {
      name: "Mini Corrida 5km",
      distanceKm: 5,
      price: 8.0,
      startTime: "10:10",
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
  console.log("🎉 31ª Corrida das Lezírias 2026 seeded successfully!");
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
