/**
 * Seed: Corrida Saúde + Solidária 2026
 * Complete with translations in all 6 languages
 * Organized by AEFML (Associação de Estudantes da Faculdade de Medicina de Lisboa)
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Corrida Saúde + Solidária 2026...");

  const eventSlug = "corrida-saude-solidaria-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Corrida Saúde + Solidária 2026",
      description: `A Corrida Saúde + Solidária é uma atividade sem fins lucrativos desenvolvida pela Associação de Estudantes da Faculdade de Medicina de Lisboa (AEFML) que tem como meta traçada, desde a sua conceção inicial, a criação de laços entre a promoção da saúde e a vertente solidária, que caracteriza a AEFML. Com o objetivo de promover a prática de exercício físico em todas as faixas etárias, o evento inclui 3 provas distintas: a corrida de 10km, uma caminhada de 5 km e a kids race.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-26T10:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7497,
      longitude: -9.1541,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Estádio+Universitário+de+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-saude-solidaria-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-25T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Corrida Saúde + Solidária 2026",
      description: `A Corrida Saúde + Solidária é uma atividade sem fins lucrativos desenvolvida pela Associação de Estudantes da Faculdade de Medicina de Lisboa (AEFML) que tem como meta traçada, desde a sua conceção inicial, a criação de laços entre a promoção da saúde e a vertente solidária, que caracteriza a AEFML. Com o objetivo de promover a prática de exercício físico em todas as faixas etárias, o evento inclui 3 provas distintas: a corrida de 10km, uma caminhada de 5 km e a kids race.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-26T10:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7497,
      longitude: -9.1541,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Estádio+Universitário+de+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-saude-solidaria-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-25T23:59:59.000Z"),
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
      title: "Corrida Saúde + Solidária 2026",
      description: `# 🏃‍♂️ Bem-vindo à Corrida Saúde + Solidária 2026

A **Corrida Saúde + Solidária** é uma atividade sem fins lucrativos desenvolvida pela **Associação de Estudantes da Faculdade de Medicina de Lisboa (AEFML)** que tem como meta traçada, desde a sua conceção inicial, a criação de laços entre a **promoção da saúde** e a **vertente solidária**, que caracteriza a AEFML. É uma atividade exclusivamente organizada por alunos de Medicina da Universidade de Lisboa.

Com o objetivo de promover a prática de exercício físico em todas as faixas etárias, o evento inclui 3 provas distintas: a **corrida de 10km**, uma **caminhada de 5 km** e a **kids race**.

Visita o Instagram oficial da prova em **[@corridasaudesolidaria](https://instagram.com/corridasaudesolidaria)**

## 📅 Distância / Hora / Local

**Data:** 26 Abril 2026  
**Partida e chegada:** Estádio de Honra do Estádio Universitário de Lisboa

### Horários:
- **Corrida dos Pequeninos (400m):** Até aos 12 anos | 9h30
- **Corrida 10Km:** 10h00
- **Caminhada/Corrida dos 5km:** 10h05

## 📝 Inscrições

**FAZ JÁ A TUA INSCRIÇÃO!**

As **primeiras 100 inscrições têm um desconto de 1€**.

Inscreve-te em: [xistarca.pt](https://xistarca.pt/corrida-saude-solidaria-2026)

*Inscrição de última hora é realizada presencialmente, nos dias e horários de levantamento do kit participante.*

### Extras Disponíveis:
- 🏅 **Medalha:** 2,00€/unidade
- 💝 **Donativo | Associação dos Amigos do Hospital de Santa Maria:** 1€ / 5€ / 10€
- 💝 **Donativo | ANPAR (Associação Nacional de Pais e Amigos Rett):** 1€ / 5€ / 10€
- 💝 **Donativo | Associação MIDAS (Movimento Internacional em Defesa dos Animais):** 1€ / 5€ / 10€

## 🎁 Kit Participante

Todos os participantes recebem:
- 🏁 **Dorsal**
- 💾 **Chip\***
- 🎽 **T-shirt unisexo**
- 🎁 **Outras possíveis ofertas de patrocinadores**

### Extras:
- 🏅 **Medalha:** 2,00€/unidade
- 💝 **Donativos** para as 3 associações parceiras

**IMPORTANTE:**
- \* Chip no dorsal está disponível apenas para a Corrida
- O chip **NÃO pode ser dobrado**
- Os tamanhos serão distribuídos de acordo com os pedidos efetuados, até rutura de stock

## 📦 Levantamento do Kit Participante

**Documentos necessários:**
- Cartão de Cidadão, Passaporte, Carta de Condução ou outro com foto e nome
- Número de dorsal atribuído por email, após a inscrição

Se quiseres levantar o kit de outro participante, deverás apresentar os mesmos documentos.

### Nas instalações da Academia de Fitness do Estádio Universitário de Lisboa:
- **22 de abril:** 13h00 - 20h00
- **23 de abril:** 13h00 - 20h00
- **24 de abril:** 13h00 - 20h00

### No Estádio Universitário de Lisboa – Pavilhão 1:
- **25 de abril:** 09h00 - 13h00

💚 **Antes de imprimires pensa bem se tens mesmo que o fazer. Preserva o meio-ambiente. Traz um saco reutilizável contigo para levares o teu kit.**

## 🗺️ Mapa / Percursos

### Percurso Corrida 10km
Partida no Estádio de Honra do Estádio Universitário de Lisboa e realiza-se um percurso no seu interior. Saída do EUL, vira à direita, sobe pela Avenida Professor Gama Pinto, vira à esquerda, em direção à Alameda da Universidade de Lisboa, desce em direção ao Jardim do Campo Grande, vira à direita para a Rua de Campo Grande, entra pelo túnel e sai na Avenida da República, volta a entrar no túnel e sair novamente na Avenida da República, continua até à rotunda do Saldanha, inverte imediatamente antes da Avenida Fontes Pereira de Melo. Percorre toda a Avenida da República (passando pelos túneis) até ao jardim do Campo Grande. Continua pela Rua de Campo Grande até ao final do Jardim do Campo Grande (junto à paragem do autocarro e à estação de metro), contorna o fim do Jardim do Campo Grande, segue pela Rua do Campo Grande em direção à Alameda da Universidade. Sobe a Alameda da Universidade, vira à direita na Rua Professor Oliveira Marques, vira à esquerda em direção à Rua interior da Alameda da Universidade, sobe pela Avenida Professor Gama Pinto, entra no Estádio Universitário e realiza um percurso no seu interior, terminando no Estádio de Honra do EUL.

### Percurso Caminhada/Corrida dos 5km
Partida no Estádio de Honra do Estádio Universitário de Lisboa e realiza-se um percurso no seu interior. Saída do EUL, vira à direita, sobe pela Avenida Professor Gama Pinto, vira à esquerda, em direção à Alameda da Universidade de Lisboa, desce em direção ao Jardim do Campo Grande, vira à direita para a Rua do Campo Grande, contorna o final do Jardim do Campo Grande (junto à Rotunda de Entrecampos), continua pelo interior do Jardim do Campo Grande, até à entrada na Rua do Campo Grande (ao nível do cruzamento com a Avenida do Brasil), seguindo pela mesma até ao final oposto do Jardim do Campo Grande (junto à paragem de autocarro e estação de metro), contorna o Jardim do Campo Grande e retorna à Alameda da Universidade de Lisboa pela Rua do Campo Grande. Sobe a Alameda da Universidade, vira à direita na Rua Professor Oliveira Marques, vira à esquerda em direção à Rua interior da Alameda da Universidade, sobe pela Avenida Professor Gama Pinto, entra no Estádio Universitário e realiza um percurso no seu interior, terminando no Estádio de Honra do EUL.

## 🏆 Prémios para 10km

- 🥇 Prémios para os 3 primeiros classificados da geral M/F
- 🎓 Prémio para o primeiro classificado de escalão Universitário M/F
- 👥 Prémio para a equipa mais númerosa

*\* Caso o prémio não seja levantado no dia do evento, poderás fazê-lo no prazo máximo de 30 dias, nas instalações da Xistarca.*

## 📋 Outras Informações

### 🚗 Acessos à zona de partida e estacionamento
A partida da prova será no Estádio de Honra do EUL, devidamente assinalada com um pórtico insuflável.

Existem vários acessos por transporte público:
- **Metro Lisboa:** saída na Cidade Universitária (linha Amarela)
- **Comboios de Portugal:** estação de Entrecampos
- **Fertagus:** estação de Entrecampos
- **Autocarros** (Carris Lisboa, TST)

Aconselhamos a utilização dos transportes públicos. Pode consultar as parcerias de mobilidade estabelecidas no nosso site. Caso a opção seja transporte próprio, sugerimos que deixe a viatura nos estacionamentos adjacentes às zonas de partida.

### 👮 Forças de Segurança e Apoio médico
O planeamento e controlo do trânsito automóvel é da responsabilidade da Polícia de Segurança Pública, assim como a segurança de todos os participantes. O apoio médico será prestado a todos os atletas que apresentem alguma lesão ou que a organização indique como possível caso de lesão durante o horário do evento. O apoio médico tem o direito de retirar da prova atletas que não apresentem condições para realizar com aptidão o percurso completo.

### ⏱️ Limite de Tempo
A prova dos 10km e dos 5km tem um limite de tempo definido em **2h00**.

### 🎒 Bengaleiro
A organização disponibiliza bengaleiro na zona da partida.

### 💧 Abastecimentos
- A prova dos **5km** terá um abastecimento de água aos 4km de percurso
- A prova dos **10km** terá dois abastecimentos de água aos 5,5km e 8km de percurso
- Na chegada (estádio de Honra) será oferecido água e produtos alimentares a todos os atletas

A localização destes postos de abastecimento está sujeita a alterações de acordo com as indicações das autoridades competentes.

### 🛡️ Seguro
Os participantes devidamente inscritos serão abrangidos por um seguro de acidentes pessoais, conforme previsto no Decreto Lei nº 10/2009 (Seguro Desportivo).

**Nota:** Em caso de algum acidente dos participantes e que tenham recorrido ao SN Saúde, devem comunicar no prazo de 3 dias para geral@xistarca.pt, para receberem, preencherem e reenviarem o documento de participação do acidente para serem ressarcidos dos custos dessa assistência médica.

### 👥 Participantes
- A prova de **10km (corrida)** destina-se a todos os interessados, com idade superior a 18 anos
- A prova de **5km (caminhada)** é uma prova aberta a todos os interessados em participar no evento, sem limite de idade
- A prova **Corrida dos Pequeninos** destina-se a crianças até aos 12 anos de idade (inclusive)

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

### 📧 Inscrição por email até 5 dias antes do evento
Se tiveres dificuldades em fazer a tua inscrição online, faz uma transferência bancária para o IBAN **PT50 0033 0000 0008 9642 6480 5**. De seguida deverás enviar os teus dados de inscrição (prova, nome, data de nascimento, clube (opcional), distância, telefone, tamanho t-shirt) para o email **geral@xistarca.pt**, anexando o comprovativo da transferência bancária.

### Cancelamento da Inscrição
A organização não faz a devolução do valor da inscrição ou troca de evento.

### Aceitação
Ao te inscreveres, automaticamente aceitas o presente regulamento e assumes a responsabilidade de participação no evento, estando ciente do teu estado de saúde, sentindo-te fisicamente e psicologicamente apto para participar.

---

**Vem celebrar a saúde e a solidariedade! 🏃‍♂️💚**`,
      city: "Lisboa",
      metaTitle:
        "Corrida Saúde + Solidária 2026 | Estádio Universitário de Lisboa",
      metaDescription:
        "Corrida Saúde + Solidária 2026 organizada pela AEFML. Corrida 10km, Caminhada 5km e Corrida dos Pequeninos. Evento solidário. 26 Abril 2026 no Estádio Universitário de Lisboa.",
    },
    {
      language: "en",
      title: "Health + Solidarity Race 2026",
      description: `# 🏃‍♂️ Welcome to Health + Solidarity Race 2026

The **Health + Solidarity Race** is a non-profit activity developed by the **Lisbon Medical School Students' Association (AEFML)** that aims, since its initial conception, to create bonds between **health promotion** and the **solidarity aspect** that characterizes AEFML. It is an activity exclusively organized by Medicine students from the University of Lisbon.

With the goal of promoting physical exercise across all age groups, the event includes 3 distinct races: the **10km race**, a **5km walk** and the **kids race**.

Come celebrate health and solidarity! 🏃‍♂️💚`,
      city: "Lisbon",
      metaTitle: "Health + Solidarity Race 2026 | University Stadium of Lisbon",
      metaDescription:
        "Health + Solidarity Race 2026 organized by AEFML. 10km Race, 5km Walk and Kids Race. Solidarity event. April 26, 2026 at University Stadium of Lisbon.",
    },
    {
      language: "es",
      title: "Carrera Salud + Solidaria 2026",
      description: `# 🏃‍♂️ Bienvenido a la Carrera Salud + Solidaria 2026

La **Carrera Salud + Solidaria** es una actividad sin fines de lucro desarrollada por la **Asociación de Estudiantes de la Facultad de Medicina de Lisboa (AEFML)** que tiene como objetivo, desde su concepción inicial, crear vínculos entre la **promoción de la salud** y el **aspecto solidario** que caracteriza a la AEFML.

¡Ven a celebrar la salud y la solidaridad! 🏃‍♂️💚`,
      city: "Lisboa",
      metaTitle:
        "Carrera Salud + Solidaria 2026 | Estadio Universitario de Lisboa",
      metaDescription:
        "Carrera Salud + Solidaria 2026 organizada por AEFML. Carrera 10km, Caminata 5km y Carrera Infantil. Evento solidario. 26 abril 2026 en el Estadio Universitario de Lisboa.",
    },
    {
      language: "fr",
      title: "Course Santé + Solidaire 2026",
      description: `# 🏃‍♂️ Bienvenue à la Course Santé + Solidaire 2026

La **Course Santé + Solidaire** est une activité à but non lucratif développée par l'**Association des Étudiants de la Faculté de Médecine de Lisbonne (AEFML)** qui vise, depuis sa conception initiale, à créer des liens entre la **promotion de la santé** et l'**aspect solidaire** qui caractérise l'AEFML.

Venez célébrer la santé et la solidarité ! 🏃‍♂️💚`,
      city: "Lisbonne",
      metaTitle:
        "Course Santé + Solidaire 2026 | Stade Universitaire de Lisbonne",
      metaDescription:
        "Course Santé + Solidaire 2026 organisée par l'AEFML. Course 10km, Marche 5km et Course Enfants. Événement solidaire. 26 avril 2026 au Stade Universitaire de Lisbonne.",
    },
    {
      language: "de",
      title: "Gesundheits- und Solidaritätslauf 2026",
      description: `# 🏃‍♂️ Willkommen zum Gesundheits- und Solidaritätslauf 2026

Der **Gesundheits- und Solidaritätslauf** ist eine gemeinnützige Aktivität, die von der **Studentenvereinigung der Medizinischen Fakultät Lissabon (AEFML)** entwickelt wurde und seit ihrer Entstehung darauf abzielt, Verbindungen zwischen **Gesundheitsförderung** und dem **Solidaritätsaspekt**, der die AEFML charakterisiert, zu schaffen.

Komm und feiere Gesundheit und Solidarität! 🏃‍♂️💚`,
      city: "Lissabon",
      metaTitle:
        "Gesundheits- und Solidaritätslauf 2026 | Universitätsstadion Lissabon",
      metaDescription:
        "Gesundheits- und Solidaritätslauf 2026 organisiert von AEFML. 10km Lauf, 5km Wanderung und Kinderlauf. Solidaritätsveranstaltung. 26. April 2026 im Universitätsstadion Lissabon.",
    },
    {
      language: "it",
      title: "Corsa Salute + Solidarietà 2026",
      description: `# 🏃‍♂️ Benvenuto alla Corsa Salute + Solidarietà 2026

La **Corsa Salute + Solidarietà** è un'attività senza scopo di lucro sviluppata dall'**Associazione Studenti della Facoltà di Medicina di Lisbona (AEFML)** che ha come obiettivo, sin dalla sua concezione iniziale, creare legami tra la **promozione della salute** e l'**aspetto solidale** che caratterizza l'AEFML.

Vieni a celebrare la salute e la solidarietà! 🏃‍♂️💚`,
      city: "Lisbona",
      metaTitle:
        "Corsa Salute + Solidarietà 2026 | Stadio Universitario di Lisbona",
      metaDescription:
        "Corsa Salute + Solidarietà 2026 organizzata da AEFML. Corsa 10km, Camminata 5km e Corsa Bambini. Evento solidale. 26 aprile 2026 allo Stadio Universitario di Lisbona.",
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
      name: "Corrida dos Pequeninos 400m",
      distanceKm: 0.4,
      price: 5.0,
      startTime: "09:30",
    },
    {
      name: "Corrida 10km",
      distanceKm: 10,
      price: 12.0,
      startTime: "10:00",
    },
    {
      name: "Caminhada/Corrida 5km",
      distanceKm: 5,
      price: 8.0,
      startTime: "10:05",
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
  console.log("🎉 Corrida Saúde + Solidária 2026 seeded successfully!");
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
