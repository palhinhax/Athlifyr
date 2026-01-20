/**
 * Seed: XXIV 12km Salvaterra de Magos 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding XXIV 12km Salvaterra de Magos 2026...");

  const eventSlug = "salvaterra-magos-12km-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "XXIV 12km Salvaterra de Magos - Prova Professor António Lopes",
      description: `O "ACS – Amigos da Corrida de Salvaterra", organiza no dia 22 de Março de 2026, pelas 10h00, a corrida "XXIV 12 Km Salvaterra Prova Professor António Lopes", a "6ª Mini-Corrida 5km Fernando José Andrade" e a 18ª "Caminhada Mexa-se por nós".`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-03-22T10:00:00.000Z"),
      endDate: null,
      city: "Salvaterra de Magos",
      country: "Portugal",
      latitude: 39.0264,
      longitude: -8.7944,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Largo+dos+Combatentes+Salvaterra+de+Magos",
      externalUrl: "https://xistarca.pt/salvaterra-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-03-21T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "XXIV 12km Salvaterra de Magos - Prova Professor António Lopes",
      description: `O "ACS – Amigos da Corrida de Salvaterra", organiza no dia 22 de Março de 2026, pelas 10h00, a corrida "XXIV 12 Km Salvaterra Prova Professor António Lopes", a "6ª Mini-Corrida 5km Fernando José Andrade" e a 18ª "Caminhada Mexa-se por nós".`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-03-22T10:00:00.000Z"),
      endDate: null,
      city: "Salvaterra de Magos",
      country: "Portugal",
      latitude: 39.0264,
      longitude: -8.7944,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Largo+dos+Combatentes+Salvaterra+de+Magos",
      externalUrl: "https://xistarca.pt/salvaterra-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-03-21T23:59:59.000Z"),
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
      title: "XXIV 12km Salvaterra de Magos - Prova Professor António Lopes",
      description: `# 🏃‍♂️ Bem-vindo(a) à XXIV 12km Salvaterra de Magos

O **"ACS – Amigos da Corrida de Salvaterra"**, organiza no dia **22 de Março de 2026, pelas 10h00**, a corrida **"XXIV 12 Km Salvaterra Prova Professor António Lopes"**, a **"6ª Mini-Corrida 5km Fernando José Andrade"** e a **18ª "Caminhada Mexa-se por nós"**.

## 📅 Distância / Hora / Local

**Data:** 22 Março 2026  
**Local:** Largo dos Combatentes | Salvaterra de Magos

### Horários:
- **Corrida 12km:** 10h00
- **Mini-Corrida 5km:** 10h00
- **Caminhada "Mexa-se como nós" 5km:** 10h15

## 📝 Inscrições

FAZ JÁ A TUA INSCRIÇÃO!

Inscreve-te online em: [xistarca.pt](https://xistarca.pt/salvaterra-2026)

*Inscrição de última hora é realizada presencialmente, nos dias e horários de levantamento do kit participante.*

## 🎁 Kit Participante

### Corrida/Mini-Corrida:
- 🏁 **Dorsal**
- 💾 **Chip\***
- 🎽 **T-shirt\* técnica**
- 💧 **Água**
- 🍫 **Barrita energética**
- 🍎 **Fruta à chegada**
- 🏅 **Medalha finisher**
- 🎁 **Outras ofertas**

### Caminhada:
- 🏁 **Dorsal**
- 🎽 **T-Shirt\***
- 💧 **Água**
- 🍫 **Barrita energética**
- 🍎 **Fruta à chegada**
- 🎁 **Outras ofertas possíveis**

**IMPORTANTE:**
- \* Chip no dorsal está disponível apenas para a Corrida
- O chip **NÃO pode ser dobrado**
- \* Os tamanhos serão distribuídos de acordo com os pedidos efetuados, até rutura de stock

## 📦 Levantamento do Kit Participante

**Documentos necessários:**
- Cartão de Cidadão, Passaporte, Carta de Condução ou outro com foto e nome
- Número de dorsal atribuído por email, após a inscrição

Se quiseres levantar o kit de outro participante, deverás apresentar os mesmos documentos.

### Locais e Horários:

**Nas instalações do Pavilhão Gimnodesportivo Inatel:**
- **21 março, sábado:** 15h00 - 18h00
- **22 março, domingo:** 08h00 - 10h00

💚 **Antes de imprimires pensa bem se tens mesmo que o fazer. Preserva o meio-ambiente. Traz um saco reutilizável contigo para levares o teu kit.**

## 🗺️ Mapa / Percursos

### Percurso Corrida 12km
Partida no Largo dos Combatentes, seguindo à direita pela Avenida Dr. Roberto Ferreira da Fonseca em direcção à Vala, à direita pelo Largo do Rossio, ladeira da Capela Real, Largo dos Combatentes seguindo à direita pela Av Dr Roberto Ferreira da Fonseca em direcção à estrada do Escaroupim com retorno na Palhota em direcção à Vala e Av. Dr Roberto Ferreira da Fonseca virando à esquerda junto CCAM e CGD terminando no Largo dos Combatentes.

### Percurso Mini-Corrida 5km
Idem até ao Km 3,5 na estrada do Escaroupim onde se efetuará o retorno em direção à Av. Dr. Roberto Ferreira da Fonseca e seguindo o restante percurso dos 12 km.

### Percurso Caminhada "Mexa-se como nós!"
Partida do Largo dos Combatentes, seguindo à direita pela Av Dr. Roberto Ferreira da Fonseca em direcção à Vala Real passando pelo Cais e Marina, seguindo à esquerda pelo valado junto a vala real até ao Bico da Goiva onde passa o rio Tejo fazendo aí o retorno, seguindo o percurso inverso até ao Largo dos Combatentes.

## 🏆 Prémios

### Corrida 12km:
- 🥇 **Troféus** aos 10 primeiros Jun/Sen (M/F)
- 🥇 **Troféus** aos 3 primeiros Veteranos (M/F)
- 🏆 **Troféu** para o vencedor absoluto (M/F)
- 🏆 **Troféus** às 5 primeiras equipas (M/F) (4 primeiros)

#### Masculino | Prémio Record da prova
**Record:** 36,06 (Rúben Amaral – SPORTING CP)

#### Feminino | Prémio Record da prova
**Record:** 42,26 (Sandra Teixeira – SPORTING CP)

### Mini-Corrida 5km:
- 🥇 **Troféus** aos 3 primeiros Classificados (M/F)

### Outros prémios:
- 🏆 **Troféu** para o atleta mais idoso a completar os 12 km e a Mini 5km (M/F)

*\* Caso o prémio não seja levantado no dia do evento, poderás fazê-lo no prazo máximo de 30 dias, nas instalações da Xistarca.*

## 👥 Escalões para 10km

### Corrida 12km:
- **Juniores/Seniores:** 18-34 anos
- **Veteranos I:** 35-39 anos
- **Veteranos II:** 40-44 anos
- **Veteranos III:** 45-49 anos
- **Veteranos IV:** 50-54 anos
- **Veteranos V:** 55-59 anos
- **Veteranos VI:** 60-64 anos
- **Veteranos VII:** 65-69 anos
- **Veteranos VIII:** +70 anos

### Mini-Corrida 5km:
**Classificação Geral Masculina e Feminina**

Prova aberta para jovens a partir dos 15 anos

## 📋 Outras Informações

### 🚿 Banhos
Banhos quentes para todos no Pavilhão Municipal junto aos Bombeiros e Piscinas Municipais.

### 🎒 Bengaleiro
A organização disponibiliza bengaleiro na zona da partida.

### 💧 Abastecimentos
- **12km:** Água Vimeiro aos 4km, 9km e no final da prova
- **5km:** Água Vimeiro no final da prova

### 🛡️ Seguro
Os participantes devidamente inscritos serão abrangidos por um seguro de acidentes pessoais, conforme previsto no Decreto Lei nº 10/2009 (Seguro Desportivo).

**Nota:** Em caso de algum acidente dos participantes e que tenham recorrido ao SN Saúde, devem comunicar no prazo de 3 dias para geral@xistarca.pt, para receberem, preencherem e reenviarem o documento de participação do acidente para serem ressarcidos dos custos dessa assistência médica.

### 👥 Participantes
- A prova de **12km (corrida)** destina-se a todos os interessados, com idade superior a 18 anos
- A prova de **5km (mini-corrida)** destina-se a todos os interessados, com idade superior a 15 anos
- A prova de **5km (caminhada)** é uma prova aberta a todos os interessados em participar no evento, sem limite de idade

### 📊 Alterações
Não serão aceites alterações às inscrições no dia do evento.

### 🏅 Classificações
As classificações da corrida estarão disponíveis após a prova, divididas em:
- Classificação geral
- Classificação masculina
- Classificação feminina
- Classificação por escalão

### 📸 Direitos de Imagem
O participante, ao proceder à inscrição, autoriza a cedência, de forma gratuita e incondicional, às entidades organizadores do evento e seus parceiros, os direitos de utilização da sua imagem captada nas filmagens que terão lugar durante o evento, autorizando a sua reprodução em peças comunicacionais de apoio.

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

**Vem celebrar a 24ª edição em Salvaterra de Magos! 🏃‍♂️**`,
      city: "Salvaterra de Magos",
      metaTitle:
        "XXIV 12km Salvaterra de Magos 2026 | Prova Professor António Lopes",
      metaDescription:
        "XXIV 12km Salvaterra de Magos - Prova Professor António Lopes. Corrida 12km, Mini-Corrida e Caminhada 5km. 22 Março 2026 em Salvaterra de Magos.",
    },
    {
      language: "en",
      title: "XXIV 12km Salvaterra de Magos - Professor António Lopes Race",
      description: `# 🏃‍♂️ Welcome to XXIV 12km Salvaterra de Magos

The **"ACS – Friends of Salvaterra Race"** organizes on **March 22, 2026, at 10:00**, the race **"XXIV 12 Km Salvaterra Professor António Lopes Race"**, the **"6th 5km Mini-Race Fernando José Andrade"** and the **18th "Move with us Walk"**.

## 📅 Distance / Time / Location

**Date:** March 22, 2026  
**Location:** Largo dos Combatentes | Salvaterra de Magos

### Schedule:
- **12km Race:** 10:00
- **5km Mini-Race:** 10:00
- **5km "Move with us" Walk:** 10:15

## 🏆 Prizes

### 12km Race:
- 🥇 **Trophies** for top 10 Jun/Sen (M/F)
- 🥇 **Trophies** for top 3 Veterans (M/F)
- 🏆 **Trophy** for absolute winner (M/F)
- 🏆 **Trophies** for top 5 teams (M/F) (4 members)

Come celebrate the 24th edition in Salvaterra de Magos! 🏃‍♂️`,
      city: "Salvaterra de Magos",
      metaTitle:
        "XXIV 12km Salvaterra de Magos 2026 | Professor António Lopes Race",
      metaDescription:
        "XXIV 12km Salvaterra de Magos - Professor António Lopes Race. 12km Race, 5km Mini-Race and Walk. March 22, 2026 in Salvaterra de Magos.",
    },
    {
      language: "es",
      title: "XXIV 12km Salvaterra de Magos - Prueba Profesor António Lopes",
      description: `# 🏃‍♂️ Bienvenido a XXIV 12km Salvaterra de Magos

El **"ACS – Amigos de la Carrera de Salvaterra"** organiza el **22 de marzo de 2026, a las 10:00**, la carrera **"XXIV 12 Km Salvaterra Prueba Profesor António Lopes"**, la **"6ª Mini-Carrera 5km Fernando José Andrade"** y la **18ª "Caminata Muévete con nosotros"**.

¡Ven a celebrar la 24ª edición en Salvaterra de Magos! 🏃‍♂️`,
      city: "Salvaterra de Magos",
      metaTitle:
        "XXIV 12km Salvaterra de Magos 2026 | Prueba Profesor António Lopes",
      metaDescription:
        "XXIV 12km Salvaterra de Magos - Prueba Profesor António Lopes. Carrera 12km, Mini-Carrera y Caminata 5km. 22 marzo 2026 en Salvaterra de Magos.",
    },
    {
      language: "fr",
      title: "XXIV 12km Salvaterra de Magos - Épreuve Professeur António Lopes",
      description: `# 🏃‍♂️ Bienvenue à XXIV 12km Salvaterra de Magos

Le **"ACS – Amis de la Course de Salvaterra"** organise le **22 mars 2026, à 10h00**, la course **"XXIV 12 Km Salvaterra Épreuve Professeur António Lopes"**, la **"6ème Mini-Course 5km Fernando José Andrade"** et la **18ème "Marche Bougez avec nous"**.

Venez célébrer la 24ème édition à Salvaterra de Magos! 🏃‍♂️`,
      city: "Salvaterra de Magos",
      metaTitle:
        "XXIV 12km Salvaterra de Magos 2026 | Épreuve Professeur António Lopes",
      metaDescription:
        "XXIV 12km Salvaterra de Magos - Épreuve Professeur António Lopes. Course 12km, Mini-Course et Marche 5km. 22 mars 2026 à Salvaterra de Magos.",
    },
    {
      language: "de",
      title: "XXIV 12km Salvaterra de Magos - Professor António Lopes Lauf",
      description: `# 🏃‍♂️ Willkommen zu XXIV 12km Salvaterra de Magos

Der **"ACS – Freunde des Salvaterra-Laufs"** organisiert am **22. März 2026 um 10:00 Uhr** den Lauf **"XXIV 12 Km Salvaterra Professor António Lopes Lauf"**, den **"6. 5km Mini-Lauf Fernando José Andrade"** und die **18. "Bewegt euch mit uns Wanderung"**.

Komm und feiere die 24. Ausgabe in Salvaterra de Magos! 🏃‍♂️`,
      city: "Salvaterra de Magos",
      metaTitle:
        "XXIV 12km Salvaterra de Magos 2026 | Professor António Lopes Lauf",
      metaDescription:
        "XXIV 12km Salvaterra de Magos - Professor António Lopes Lauf. 12km Lauf, 5km Mini-Lauf und Wanderung. 22. März 2026 in Salvaterra de Magos.",
    },
    {
      language: "it",
      title: "XXIV 12km Salvaterra de Magos - Prova Professor António Lopes",
      description: `# 🏃‍♂️ Benvenuto a XXIV 12km Salvaterra de Magos

L'**"ACS – Amici della Corsa di Salvaterra"** organizza il **22 marzo 2026, alle 10:00**, la corsa **"XXIV 12 Km Salvaterra Prova Professor António Lopes"**, la **"6ª Mini-Corsa 5km Fernando José Andrade"** e la **18ª "Camminata Muoviti con noi"**.

Vieni a celebrare la 24ª edizione a Salvaterra de Magos! 🏃‍♂️`,
      city: "Salvaterra de Magos",
      metaTitle:
        "XXIV 12km Salvaterra de Magos 2026 | Prova Professor António Lopes",
      metaDescription:
        "XXIV 12km Salvaterra de Magos - Prova Professor António Lopes. Corsa 12km, Mini-Corsa e Camminata 5km. 22 marzo 2026 a Salvaterra de Magos.",
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
      name: "Corrida 12km",
      distanceKm: 12,
      price: 10.0,
      startTime: "10:00",
    },
    {
      name: "Mini-Corrida 5km",
      distanceKm: 5,
      price: 8.0,
      startTime: "10:00",
    },
    {
      name: "Caminhada Mexa-se por nós 5km",
      distanceKm: 5,
      price: 5.0,
      startTime: "10:15",
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
  console.log("🎉 XXIV 12km Salvaterra de Magos 2026 seeded successfully!");
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
