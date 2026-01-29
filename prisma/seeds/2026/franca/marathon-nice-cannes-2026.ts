/**
 * Seed Marathon des Alpes-Maritimes Nice-Cannes 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Marathon des Alpes-Maritimes Nice-Cannes 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "marathon-nice-cannes-2026" },
    update: {
      title: "Marathon des Alpes-Maritimes Nice-Cannes",
      description: `# 🏃 Marathon des Alpes-Maritimes Nice-Cannes 2026

Bem-vindo à **French Riviera Marathon** — a maior maratona da França depois de Paris! 🇫🇷

## 📅 Data e Horário

**Domingo, 8 de novembro de 2026**
**Hora de Partida:** 08:00 (UTC+01:00)

## 🏃 Sobre o Evento

Da **Promenade des Anglais em Nice** ao **Boulevard de la Croisette em Cannes**, vem desfrutar de uma experiência cinco estrelas no domingo, 8 de novembro de 2026, enquanto descobres as paisagens sumptuosas dos Alpes-Maritimes e experimentas o estilo de vida da Riviera Francesa!

Com quase **210.000 participantes inscritos** desde a sua criação em 2008 e quase **90 nações representadas** na partida de todas as distâncias oferecidas, a Maratona dos Alpes-Maritimes Nice-Cannes atrai todos os anos milhares de competidores de todo o mundo com as suas belas paisagens.

### 🌟 Destaques de 2025

Em 2025, quase **22.000 corredores** estiveram na linha de partida, incluindo quase **30% de competidores internacionais**! 

- 📊 Quase **50%** escolheram a Maratona dos Alpes-Maritimes Nice-Cannes para correr a sua primeira maratona!
- 🎯 E o evento esgotou **6 meses antes** da data!

### ⚠️ Edição de 2026

Este ano, o evento está limitado a **22.000 corredores**, incluindo **15.000 dorsais para a distância de maratona**! 

**Reserva o teu lugar agora** para desfrutares de um fim de semana de turismo e desporto, com mar, palmeiras e verão indiano na Riviera!

## 📍 Locais de Partida e Chegada

### 🏁 Partida - Nice
**Promenade des Anglais, Nice**
500m do Hyatt Regency Palais de la Méditerranée
📍 Coordenadas: 43.6956° N, 7.2681° E
🗺️ [Ver no Google Maps](https://maps.google.com/?q=43.6956,7.2681)

### 🏆 Chegada - Cannes
**Boulevard de la Croisette, Cannes**
300m do Palais des Festivals
📍 Coordenadas: 43.5528° N, 7.0174° E
🗺️ [Ver no Google Maps](https://maps.google.com/?q=43.5528,7.0174)

## 🏃 Distâncias Disponíveis

### 1️⃣ Maratona - 42.195 km
- **Distância:** 42.195 km
- **Tempo Limite:** 6 horas
- **Restrição de Idade:** Nascidos antes de 30/12/2007
- **Preço:** A partir de €66 (primeiros 1000)

### 2️⃣ Maratona em Revezamento (2 x 21.1 km)
- **Distância:** 2 x 21.1 km (cada corredor)
- **Formato:** Equipas de 2 pessoas
- **Troca:** Ponto intermédio do percurso

### 3️⃣ Corrida de 20 km
- **Distância:** 20 km
- **Partida:** Nice
- **Chegada:** Villeneuve-Loubet

## 🏆 Recordes do Evento

### 👨 Masculino
**Millaw Abrha** - 2:07:25 (2018)

### 👩 Feminino
**Zenebu Fikadu** - 2:28:15 (2022)

## 🎯 Pacemakers

**9 pacemakers** estarão presentes para te ajudar a alcançar os teus objetivos:

- 3h00' / 3h15' / 3h30' / 3h45' / 4h00' / 4h15' / 4h30' / 4h45' / 5h00'

Para os reconhecer: terão uma bandeira com o tempo alvo!

## 📦 A Tua Inscrição Inclui

✅ **Bilhete de viagem incluído** entre Nice e Cannes o dia todo (sem limite!)
✅ **Dorsal personalizado** com o teu nome
✅ **Mochila Kiprun** (capacidade: 17 litros)
✅ **Medalha Vintage** de finisher
✅ **T-shirt Técnica Kiprun FINISHER**
✅ **Pódio Scratch** e primeiro de cada categoria
✅ **Pontos de abastecimento** ao longo do percurso
✅ **Cronometragem** oficial
✅ **Serviço de fotografia**
✅ **Transferência de bagagem** de Nice para Cannes
✅ **Bandas de música a cada 2 km**

## 🏔️ Percurso

O percurso oferece uma experiência espetacular à beira-mar:

- 🌊 Quase todo o trajeto junto ao Mediterrâneo
- 🏝️ Vistas para o mar, palmeiras e montanhas cobertas de neve
- 📈 **Altitude:** 100m de desnível positivo
- 🎶 Animação e bandas de música a cada 2 km
- 💧 Pontos de abastecimento regulares

### Localidades do Percurso

Nice → Saint-Laurent-du-Var → Cagnes-sur-Mer → Villeneuve-Loubet → Antibes → Juan-les-Pins → Vallauris → Golfe-Juan → Cannes

## 🏅 Certificações e Reconhecimentos

### 🌍 WORLD ATHLETICS
A French Riviera Marathon está no calendário da World Athletics, a federação desportiva internacional responsável por governar as federações nacionais de atletismo.

### 🏆 AIMS Label
Membro da organização AIMS há muitos anos, este rótulo dá notoriedade internacional ao evento no que diz respeito à sua qualidade e organização rigorosa.

### 🇫🇷 Label Internacional FFA (OR)
O rótulo Internacional FFA garante aos participantes uma organização de excelência, serviços de topo e qualificação para os Campeonatos Franceses de maratona.

### 🏃 ABBOTT WMM WANDA AGE GROUP WORLD CHAMPIONSHIPS
**Qualificação por categoria de idade**

A French Riviera Marathon faz parte do ranking mundial dos "World Marathon Majors" por grupo etário (9 no total).

Todos os participantes da French Riviera Marathon dos Alpes-Maritimes Nice-Cannes, com **40 anos ou mais**, podem fazer parte da série "World Marathon Majors" e ganhar pontos para a classificação global graças à sua participação na nossa maratona.

- ⏱️ O ranking global começa em 1 de janeiro e termina em 31 de dezembro
- 📊 Apenas os **dois melhores resultados** serão tidos em conta
- 🏆 Uma vitória na sua categoria permite ganhar **4.000 pontos**

[Mais informações aqui](https://www.abbottwmm.com/wanda-age-group-world-championships)

## 💶 Preços e Fases de Inscrição

### Fase 1 (Primeiros 1000)
**€66** - Early Bird

### Fase 2 (Próximos 4000)
**€76** - Preço Normal

### Fase 3 (Restantes)
**€86** - Fase Final

⚠️ **Inscrições limitadas!** O evento anterior esgotou 6 meses antes!

## 💚 Ação Solidária

### 🍽️ Banco Alimentar dos Alpes-Maritimes

Para cada inscrição, **€1 por corredor será doado ao Banco Alimentar dos Alpes-Maritimes**.

## 🚆 Transporte

O teu dorsal serve como **bilhete de viagem para apanhar o comboio entre Nice e Cannes durante todo o dia 8 de novembro**, sem limite!

## 👥 18 Anos - 18 Testemunhos

### Philippe (Participante da edição de 2025)
> "Desde que participei na maratona Nice-Cannes, estou nas nuvens! Adorei a minha primeira vez! Já estou nostálgico! Mal posso esperar pela próxima!"

### Dan (Participante da edição de 2024)
> "Foi um dia tão bonito e bati o meu recorde pessoal! Incrível!"

### Mary (Participante da edição de 2023)
> "Foi a minha 4ª participação nos 42km e sempre o mesmo prazer! Até para o ano!"

### Marie e Magali (Participantes da edição de 2022)
> "Corremos a corrida 2x21.1 km e foi fantástico! Que percurso lindo e terminar no tapete vermelho foi mágico! Palmeiras e Croisette, que cenário incrível! Para o ano, voltaremos para correr a distância completa!"

### Christophe (Participante da edição de 2021)
> "A Maratona Nice-Cannes é o encontro a não perder! Tenho sido fiel desde a primeira edição! É um verdadeiro prazer todos os anos! Até breve!"

### Martine (Participante da versão virtual em 2020)
> "Graças a vocês, costumo caminhar e correr e agora consigo correr 10 km e talvez mais tarde uma maratona! Muito obrigada!"

### Guy (Participante da edição de 2019)
> "O cenário é incrível! Que experiência linda!"

### Carole (Participante da edição de 2018)
> "Participei nos 20 km e adorei! Mas agora gostaria de correr até Cannes! Será o meu objetivo para o próximo ano!"

### Jérôme (Participante da edição de 2017)
> "Nice-Cannes era o meu sonho e fiz pelos meus 40 anos!"

### Nicolas (Participante da edição de 2016)
> "A minha primeira Nice-Cannes foi sob uma linda luz solar!"

### Greg (Participante da edição de 2015)
> "Extra como sempre! Um corredor fiel!"

### Marc (Participante da edição de 2014)
> "Novo melhor tempo pessoal! Muito obrigado por esta fantástica organização! A melhor!"

### Thomas (Participante da edição de 2013)
> "Sempre extra! Obrigado!"

### Rosanne (Participante da edição de 2012)
> "Só felicidade! Parabéns a todos e à organização!"

### Nils (Participante da edição de 2011)
> "Adorei! Maravilhoso! Até para o ano!"

### Steeve (Participante da edição de 2010)
> "Uma maratona excecional! A melhor para mim!"

### David (Participante da edição de 2009)
> "A minha primeira experiência na distância de maratona! A minha primeira medalha! Ambiente agradável com bandas de música e belo cenário!"

### Charlotte (Participante da edição de 2008)
> "Obrigada aos voluntários e às bandas de música! Um dia maravilhoso! Um GRANDE obrigada!"

## 📞 Contactos

**Organização:**
Azur Sport Organisation

**Morada:**
1545 RD 6007 - Marina 7
06270 Villeneuve-Loubet
França

**Website Oficial:**
[https://in.inscription-sport-up.com/marathon-nice-cannes2026](https://in.inscription-sport-up.com/marathon-nice-cannes2026)

**Redes Sociais:**
#NICECANNESMARATHON

## 🏃 Regras do Percurso

- ✅ **Limitado a 22.000 corredores** (15.000 para maratona)
- ⏱️ **Tempo limite:** 6h00 para maratona
- 📍 **Partida:** 08:00 - Promenade des Anglais em Nice
- 🏁 **Chegada:** Boulevard de la Croisette em Cannes
- 📈 **Altitude:** 100m de desnível positivo
- 🏃 **Percurso:** Maioritariamente plano, ideal para recordes

---

**Inscreve-te agora e faz parte da lenda! 🌟🏃‍♂️**

**#NICECANNESMARATHON**`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-11-08T08:00:00.000Z"),
      endDate: new Date("2026-11-08T14:00:00.000Z"),
      registrationDeadline: new Date("2026-11-07T23:59:59.000Z"),
      city: "Nice",
      country: "França",
      latitude: 43.6956,
      longitude: 7.2681,
      googleMapsUrl: "https://maps.google.com/?q=43.6956,7.2681",
      externalUrl:
        "https://in.inscription-sport-up.com/marathon-nice-cannes2026",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "Marathon des Alpes-Maritimes Nice-Cannes",
      slug: "marathon-nice-cannes-2026",
      description: `# 🏃 Marathon des Alpes-Maritimes Nice-Cannes 2026

Bem-vindo à **French Riviera Marathon** — a maior maratona da França depois de Paris! 🇫🇷

## 📅 Data e Horário

**Domingo, 8 de novembro de 2026**
**Hora de Partida:** 08:00 (UTC+01:00)

## 🏃 Sobre o Evento

Da **Promenade des Anglais em Nice** ao **Boulevard de la Croisette em Cannes**, vem desfrutar de uma experiência cinco estrelas no domingo, 8 de novembro de 2026, enquanto descobres as paisagens sumptuosas dos Alpes-Maritimes e experimentas o estilo de vida da Riviera Francesa!

Com quase **210.000 participantes inscritos** desde a sua criação em 2008 e quase **90 nações representadas** na partida de todas as distâncias oferecidas, a Maratona dos Alpes-Maritimes Nice-Cannes atrai todos os anos milhares de competidores de todo o mundo com as suas belas paisagens.

### 🌟 Destaques de 2025

Em 2025, quase **22.000 corredores** estiveram na linha de partida, incluindo quase **30% de competidores internacionais**! 

- 📊 Quase **50%** escolheram a Maratona dos Alpes-Maritimes Nice-Cannes para correr a sua primeira maratona!
- 🎯 E o evento esgotou **6 meses antes** da data!

### ⚠️ Edição de 2026

Este ano, o evento está limitado a **22.000 corredores**, incluindo **15.000 dorsais para a distância de maratona**! 

**Reserva o teu lugar agora** para desfrutares de um fim de semana de turismo e desporto, com mar, palmeiras e verão indiano na Riviera!

## 📍 Locais de Partida e Chegada

### 🏁 Partida - Nice
**Promenade des Anglais, Nice**
500m do Hyatt Regency Palais de la Méditerranée
📍 Coordenadas: 43.6956° N, 7.2681° E
🗺️ [Ver no Google Maps](https://maps.google.com/?q=43.6956,7.2681)

### 🏆 Chegada - Cannes
**Boulevard de la Croisette, Cannes**
300m do Palais des Festivals
📍 Coordenadas: 43.5528° N, 7.0174° E
🗺️ [Ver no Google Maps](https://maps.google.com/?q=43.5528,7.0174)

## 🏃 Distâncias Disponíveis

### 1️⃣ Maratona - 42.195 km
- **Distância:** 42.195 km
- **Tempo Limite:** 6 horas
- **Restrição de Idade:** Nascidos antes de 30/12/2007
- **Preço:** A partir de €66 (primeiros 1000)

### 2️⃣ Maratona em Revezamento (2 x 21.1 km)
- **Distância:** 2 x 21.1 km (cada corredor)
- **Formato:** Equipas de 2 pessoas
- **Troca:** Ponto intermédio do percurso

### 3️⃣ Corrida de 20 km
- **Distância:** 20 km
- **Partida:** Nice
- **Chegada:** Villeneuve-Loubet

## 🏆 Recordes do Evento

### 👨 Masculino
**Millaw Abrha** - 2:07:25 (2018)

### 👩 Feminino
**Zenebu Fikadu** - 2:28:15 (2022)

## 🎯 Pacemakers

**9 pacemakers** estarão presentes para te ajudar a alcançar os teus objetivos:

- 3h00' / 3h15' / 3h30' / 3h45' / 4h00' / 4h15' / 4h30' / 4h45' / 5h00'

Para os reconhecer: terão uma bandeira com o tempo alvo!

## 📦 A Tua Inscrição Inclui

✅ **Bilhete de viagem incluído** entre Nice e Cannes o dia todo (sem limite!)
✅ **Dorsal personalizado** com o teu nome
✅ **Mochila Kiprun** (capacidade: 17 litros)
✅ **Medalha Vintage** de finisher
✅ **T-shirt Técnica Kiprun FINISHER**
✅ **Pódio Scratch** e primeiro de cada categoria
✅ **Pontos de abastecimento** ao longo do percurso
✅ **Cronometragem** oficial
✅ **Serviço de fotografia**
✅ **Transferência de bagagem** de Nice para Cannes
✅ **Bandas de música a cada 2 km**

## 🏔️ Percurso

O percurso oferece uma experiência espetacular à beira-mar:

- 🌊 Quase todo o trajeto junto ao Mediterrâneo
- 🏝️ Vistas para o mar, palmeiras e montanhas cobertas de neve
- 📈 **Altitude:** 100m de desnível positivo
- 🎶 Animação e bandas de música a cada 2 km
- 💧 Pontos de abastecimento regulares

### Localidades do Percurso

Nice → Saint-Laurent-du-Var → Cagnes-sur-Mer → Villeneuve-Loubet → Antibes → Juan-les-Pins → Vallauris → Golfe-Juan → Cannes

## 🏅 Certificações e Reconhecimentos

### 🌍 WORLD ATHLETICS
A French Riviera Marathon está no calendário da World Athletics, a federação desportiva internacional responsável por governar as federações nacionais de atletismo.

### 🏆 AIMS Label
Membro da organização AIMS há muitos anos, este rótulo dá notoriedade internacional ao evento no que diz respeito à sua qualidade e organização rigorosa.

### 🇫🇷 Label Internacional FFA (OR)
O rótulo Internacional FFA garante aos participantes uma organização de excelência, serviços de topo e qualificação para os Campeonatos Franceses de maratona.

### 🏃 ABBOTT WMM WANDA AGE GROUP WORLD CHAMPIONSHIPS
**Qualificação por categoria de idade**

A French Riviera Marathon faz parte do ranking mundial dos "World Marathon Majors" por grupo etário (9 no total).

Todos os participantes da French Riviera Marathon dos Alpes-Maritimes Nice-Cannes, com **40 anos ou mais**, podem fazer parte da série "World Marathon Majors" e ganhar pontos para a classificação global graças à sua participação na nossa maratona.

- ⏱️ O ranking global começa em 1 de janeiro e termina em 31 de dezembro
- 📊 Apenas os **dois melhores resultados** serão tidos em conta
- 🏆 Uma vitória na sua categoria permite ganhar **4.000 pontos**

[Mais informações aqui](https://www.abbottwmm.com/wanda-age-group-world-championships)

## 💶 Preços e Fases de Inscrição

### Fase 1 (Primeiros 1000)
**€66** - Early Bird

### Fase 2 (Próximos 4000)
**€76** - Preço Normal

### Fase 3 (Restantes)
**€86** - Fase Final

⚠️ **Inscrições limitadas!** O evento anterior esgotou 6 meses antes!

## 💚 Ação Solidária

### 🍽️ Banco Alimentar dos Alpes-Maritimes

Para cada inscrição, **€1 por corredor será doado ao Banco Alimentar dos Alpes-Maritimes**.

## 🚆 Transporte

O teu dorsal serve como **bilhete de viagem para apanhar o comboio entre Nice e Cannes durante todo o dia 8 de novembro**, sem limite!

## 👥 18 Anos - 18 Testemunhos

### Philippe (Participante da edição de 2025)
> "Desde que participei na maratona Nice-Cannes, estou nas nuvens! Adorei a minha primeira vez! Já estou nostálgico! Mal posso esperar pela próxima!"

### Dan (Participante da edição de 2024)
> "Foi um dia tão bonito e bati o meu recorde pessoal! Incrível!"

### Mary (Participante da edição de 2023)
> "Foi a minha 4ª participação nos 42km e sempre o mesmo prazer! Até para o ano!"

### Marie e Magali (Participantes da edição de 2022)
> "Corremos a corrida 2x21.1 km e foi fantástico! Que percurso lindo e terminar no tapete vermelho foi mágico! Palmeiras e Croisette, que cenário incrível! Para o ano, voltaremos para correr a distância completa!"

### Christophe (Participante da edição de 2021)
> "A Maratona Nice-Cannes é o encontro a não perder! Tenho sido fiel desde a primeira edição! É um verdadeiro prazer todos os anos! Até breve!"

### Martine (Participante da versão virtual em 2020)
> "Graças a vocês, costumo caminhar e correr e agora consigo correr 10 km e talvez mais tarde uma maratona! Muito obrigada!"

### Guy (Participante da edição de 2019)
> "O cenário é incrível! Que experiência linda!"

### Carole (Participante da edição de 2018)
> "Participei nos 20 km e adorei! Mas agora gostaria de correr até Cannes! Será o meu objetivo para o próximo ano!"

### Jérôme (Participante da edição de 2017)
> "Nice-Cannes era o meu sonho e fiz pelos meus 40 anos!"

### Nicolas (Participante da edição de 2016)
> "A minha primeira Nice-Cannes foi sob uma linda luz solar!"

### Greg (Participante da edição de 2015)
> "Extra como sempre! Um corredor fiel!"

### Marc (Participante da edição de 2014)
> "Novo melhor tempo pessoal! Muito obrigado por esta fantástica organização! A melhor!"

### Thomas (Participante da edição de 2013)
> "Sempre extra! Obrigado!"

### Rosanne (Participante da edição de 2012)
> "Só felicidade! Parabéns a todos e à organização!"

### Nils (Participante da edição de 2011)
> "Adorei! Maravilhoso! Até para o ano!"

### Steeve (Participante da edição de 2010)
> "Uma maratona excecional! A melhor para mim!"

### David (Participante da edição de 2009)
> "A minha primeira experiência na distância de maratona! A minha primeira medalha! Ambiente agradável com bandas de música e belo cenário!"

### Charlotte (Participante da edição de 2008)
> "Obrigada aos voluntários e às bandas de música! Um dia maravilhoso! Um GRANDE obrigada!"

## 📞 Contactos

**Organização:**
Azur Sport Organisation

**Morada:**
1545 RD 6007 - Marina 7
06270 Villeneuve-Loubet
França

**Website Oficial:**
[https://in.inscription-sport-up.com/marathon-nice-cannes2026](https://in.inscription-sport-up.com/marathon-nice-cannes2026)

**Redes Sociais:**
#NICECANNESMARATHON

## 🏃 Regras do Percurso

- ✅ **Limitado a 22.000 corredores** (15.000 para maratona)
- ⏱️ **Tempo limite:** 6h00 para maratona
- 📍 **Partida:** 08:00 - Promenade des Anglais em Nice
- 🏁 **Chegada:** Boulevard de la Croisette em Cannes
- 📈 **Altitude:** 100m de desnível positivo
- 🏃 **Percurso:** Maioritariamente plano, ideal para recordes

---

**Inscreve-te agora e faz parte da lenda! 🌟🏃‍♂️**

**#NICECANNESMARATHON**`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-11-08T08:00:00.000Z"),
      endDate: new Date("2026-11-08T14:00:00.000Z"),
      registrationDeadline: new Date("2026-11-07T23:59:59.000Z"),
      city: "Nice",
      country: "França",
      latitude: 43.6956,
      longitude: 7.2681,
      googleMapsUrl: "https://maps.google.com/?q=43.6956,7.2681",
      externalUrl:
        "https://in.inscription-sport-up.com/marathon-nice-cannes2026",
      imageUrl: "",
      isFeatured: true,
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  console.log("📝 Upserting translations for 6 languages...");

  const translations = {
    pt: {
      title: "Marathon des Alpes-Maritimes Nice-Cannes",
      description: `A Marathon des Alpes-Maritimes Nice-Cannes é a segunda maior maratona de França, oferecendo um percurso espetacular de 42.195km junto ao Mediterrâneo de Nice a Cannes. Com 210.000 participantes desde 2008 e 90 nações representadas, o evento inclui maratona completa, revezamento 2x21.1km e corrida de 20km. Inscrição a partir de €66 com bilhete de comboio incluído, medalha, mochila Kiprun e t-shirt técnica. Tempo limite: 6h.`,
      city: "Nice",
      metaTitle:
        "Marathon des Alpes-Maritimes Nice-Cannes 2026 - French Riviera Marathon",
      metaDescription:
        "Maratona de 42.195km de Nice a Cannes, 8 nov 2026. Segunda maior maratona de França. Percurso à beira-mar. Inscrição desde €66. Tempo limite: 6h. 90 nações representadas.",
    },
    en: {
      title: "Marathon des Alpes-Maritimes Nice-Cannes",
      description: `The Marathon des Alpes-Maritimes Nice-Cannes is France's second largest marathon, offering a spectacular 42.195km course along the Mediterranean from Nice to Cannes. With 210,000 participants since 2008 and 90 nations represented, the event includes full marathon, 2x21.1km relay, and 20km race. Registration from €66 with included train ticket, medal, Kiprun backpack, and technical t-shirt. Time limit: 6h.`,
      city: "Nice",
      metaTitle:
        "Marathon des Alpes-Maritimes Nice-Cannes 2026 - French Riviera Marathon",
      metaDescription:
        "42.195km marathon from Nice to Cannes, Nov 8, 2026. France's 2nd largest marathon. Seaside course. Registration from €66. Time limit: 6h. 90 nations represented.",
    },
    es: {
      title: "Maratón de los Alpes Marítimos Niza-Cannes",
      description: `El Maratón de los Alpes Marítimos Niza-Cannes es el segundo maratón más grande de Francia, ofreciendo un recorrido espectacular de 42.195km a lo largo del Mediterráneo desde Niza hasta Cannes. Con 210.000 participantes desde 2008 y 90 naciones representadas, el evento incluye maratón completo, relevo 2x21.1km y carrera de 20km. Inscripción desde €66 con billete de tren incluido, medalla, mochila Kiprun y camiseta técnica. Límite de tiempo: 6h.`,
      city: "Niza",
      metaTitle:
        "Maratón de los Alpes Marítimos Niza-Cannes 2026 - French Riviera Marathon",
      metaDescription:
        "Maratón de 42.195km de Niza a Cannes, 8 nov 2026. Segundo maratón más grande de Francia. Recorrido costero. Inscripción desde €66. Límite: 6h. 90 naciones representadas.",
    },
    fr: {
      title: "Marathon des Alpes-Maritimes Nice-Cannes",
      description: `Le Marathon des Alpes-Maritimes Nice-Cannes est le deuxième plus grand marathon de France, offrant un parcours spectaculaire de 42.195km le long de la Méditerranée de Nice à Cannes. Avec 210.000 participants depuis 2008 et 90 nations représentées, l'événement comprend un marathon complet, un relais 2x21.1km et une course de 20km. Inscription à partir de 66€ avec billet de train inclus, médaille, sac à dos Kiprun et t-shirt technique. Limite de temps: 6h.`,
      city: "Nice",
      metaTitle:
        "Marathon des Alpes-Maritimes Nice-Cannes 2026 - French Riviera Marathon",
      metaDescription:
        "Marathon de 42.195km de Nice à Cannes, 8 nov 2026. Deuxième plus grand marathon de France. Parcours côtier. Inscription dès 66€. Limite: 6h. 90 nations représentées.",
    },
    de: {
      title: "Marathon der Alpes-Maritimes Nizza-Cannes",
      description: `Der Marathon der Alpes-Maritimes Nizza-Cannes ist Frankreichs zweitgrößter Marathon und bietet eine spektakuläre 42.195km Strecke entlang des Mittelmeers von Nizza nach Cannes. Mit 210.000 Teilnehmern seit 2008 und 90 vertretenen Nationen umfasst die Veranstaltung einen Vollmarathon, 2x21.1km Staffellauf und 20km Lauf. Anmeldung ab €66 mit inkludiertem Zugticket, Medaille, Kiprun Rucksack und technischem T-Shirt. Zeitlimit: 6h.`,
      city: "Nizza",
      metaTitle:
        "Marathon der Alpes-Maritimes Nizza-Cannes 2026 - French Riviera Marathon",
      metaDescription:
        "42.195km Marathon von Nizza nach Cannes, 8. Nov 2026. Zweitgrößter Marathon Frankreichs. Küstenstrecke. Anmeldung ab €66. Zeitlimit: 6h. 90 Nationen vertreten.",
    },
    it: {
      title: "Maratona delle Alpi Marittime Nizza-Cannes",
      description: `La Maratona delle Alpi Marittime Nizza-Cannes è la seconda maratona più grande della Francia, offrendo un percorso spettacolare di 42.195km lungo il Mediterraneo da Nizza a Cannes. Con 210.000 partecipanti dal 2008 e 90 nazioni rappresentate, l'evento include maratona completa, staffetta 2x21.1km e gara di 20km. Iscrizione da €66 con biglietto del treno incluso, medaglia, zaino Kiprun e maglia tecnica. Limite di tempo: 6h.`,
      city: "Nizza",
      metaTitle:
        "Maratona delle Alpi Marittime Nizza-Cannes 2026 - French Riviera Marathon",
      metaDescription:
        "Maratona di 42.195km da Nizza a Cannes, 8 nov 2026. Seconda maratona più grande della Francia. Percorso costiero. Iscrizione da €66. Limite: 6h. 90 nazioni rappresentate.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
    const trans = translations[lang as keyof typeof translations];
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: {
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
    });
    console.log(`   ✅ ${lang.toUpperCase()}`);
  }

  // Step 3: Upsert variants
  console.log("🏃 Upserting event variants...");

  const findOrCreateVariant = async (
    name: string,
    data: {
      description: string;
      distanceKm: number | null;
      elevationGainM: number | null;
      startDate: Date;
      startTime: string | null;
      cutoffTimeHours: number | null;
      maxParticipants: number | null;
    }
  ) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  // Variant 1: Marathon 42km
  const marathonVariant = await findOrCreateVariant("Maratona - 42 km", {
    description:
      "Maratona completa de 42.195km de Nice a Cannes. Percurso à beira-mar com vistas espetaculares do Mediterrâneo. Idade mínima: nascidos antes de 30/12/2007. Tempo limite: 6 horas.",
    distanceKm: 42,
    elevationGainM: 100,
    startDate: new Date("2026-11-08T08:00:00.000Z"),
    startTime: "08:00",
    cutoffTimeHours: 6.0,
    maxParticipants: 15000,
  });
  console.log("   ✅ Maratona - 42 km");

  // Variant 2: Relay Marathon 2x21.1km
  const relayVariant = await findOrCreateVariant(
    "Maratona em Revezamento - 2x21.1 km",
    {
      description:
        "Maratona em revezamento para equipas de 2 pessoas. Cada corredor percorre 21.1km. Troca no ponto intermédio do percurso.",
      distanceKm: 21,
      elevationGainM: 50,
      startDate: new Date("2026-11-08T08:00:00.000Z"),
      startTime: "08:00",
      cutoffTimeHours: 6.0,
      maxParticipants: null,
    }
  );
  console.log("   ✅ Maratona em Revezamento - 2x21.1 km");

  // Variant 3: 20km Race
  const race20kmVariant = await findOrCreateVariant("Corrida - 20 km", {
    description:
      "Corrida de 20km de Nice a Villeneuve-Loubet. Percurso à beira-mar pela Riviera Francesa.",
    distanceKm: 20,
    elevationGainM: 40,
    startDate: new Date("2026-11-08T08:00:00.000Z"),
    startTime: "08:00",
    cutoffTimeHours: 3.0,
    maxParticipants: null,
  });
  console.log("   ✅ Corrida - 20 km");

  // Step 4: Upsert variant translations (ALL 6 languages)
  console.log("🌍 Upserting variant translations...");

  const variantTranslations = {
    marathon: {
      pt: {
        name: "Maratona - 42 km",
        description:
          "Maratona completa de 42.195km de Nice a Cannes. Percurso à beira-mar com vistas espetaculares do Mediterrâneo. Idade mínima: nascidos antes de 30/12/2007. Tempo limite: 6 horas.",
      },
      en: {
        name: "Marathon - 42 km",
        description:
          "Full 42.195km marathon from Nice to Cannes. Seaside course with spectacular Mediterranean views. Minimum age: born before 30/12/2007. Time limit: 6 hours.",
      },
      es: {
        name: "Maratón - 42 km",
        description:
          "Maratón completo de 42.195km de Niza a Cannes. Recorrido costero con vistas espectaculares del Mediterráneo. Edad mínima: nacidos antes del 30/12/2007. Límite de tiempo: 6 horas.",
      },
      fr: {
        name: "Marathon - 42 km",
        description:
          "Marathon complet de 42.195km de Nice à Cannes. Parcours côtier avec vues spectaculaires sur la Méditerranée. Âge minimum: nés avant le 30/12/2007. Limite de temps: 6 heures.",
      },
      de: {
        name: "Marathon - 42 km",
        description:
          "Vollständiger Marathon von 42.195km von Nizza nach Cannes. Küstenstrecke mit spektakulärem Blick auf das Mittelmeer. Mindestalter: geboren vor dem 30/12/2007. Zeitlimit: 6 Stunden.",
      },
      it: {
        name: "Maratona - 42 km",
        description:
          "Maratona completa di 42.195km da Nizza a Cannes. Percorso costiero con viste spettacolari sul Mediterraneo. Età minima: nati prima del 30/12/2007. Limite di tempo: 6 ore.",
      },
    },
    relay: {
      pt: {
        name: "Maratona em Revezamento - 2x21.1 km",
        description:
          "Maratona em revezamento para equipas de 2 pessoas. Cada corredor percorre 21.1km. Troca no ponto intermédio do percurso.",
      },
      en: {
        name: "Relay Marathon - 2x21.1 km",
        description:
          "Relay marathon for teams of 2 people. Each runner covers 21.1km. Exchange at the midpoint of the course.",
      },
      es: {
        name: "Maratón en Relevos - 2x21.1 km",
        description:
          "Maratón en relevos para equipos de 2 personas. Cada corredor recorre 21.1km. Cambio en el punto medio del recorrido.",
      },
      fr: {
        name: "Marathon en Relais - 2x21.1 km",
        description:
          "Marathon en relais pour équipes de 2 personnes. Chaque coureur parcourt 21.1km. Relais au point médian du parcours.",
      },
      de: {
        name: "Staffel-Marathon - 2x21.1 km",
        description:
          "Staffel-Marathon für Teams von 2 Personen. Jeder Läufer läuft 21.1km. Wechsel am Mittelpunkt der Strecke.",
      },
      it: {
        name: "Maratona a Staffetta - 2x21.1 km",
        description:
          "Maratona a staffetta per squadre di 2 persone. Ogni corridore percorre 21.1km. Cambio al punto intermedio del percorso.",
      },
    },
    race20km: {
      pt: {
        name: "Corrida - 20 km",
        description:
          "Corrida de 20km de Nice a Villeneuve-Loubet. Percurso à beira-mar pela Riviera Francesa.",
      },
      en: {
        name: "Race - 20 km",
        description:
          "20km race from Nice to Villeneuve-Loubet. Seaside course along the French Riviera.",
      },
      es: {
        name: "Carrera - 20 km",
        description:
          "Carrera de 20km de Niza a Villeneuve-Loubet. Recorrido costero por la Riviera Francesa.",
      },
      fr: {
        name: "Course - 20 km",
        description:
          "Course de 20km de Nice à Villeneuve-Loubet. Parcours côtier le long de la Côte d'Azur.",
      },
      de: {
        name: "Lauf - 20 km",
        description:
          "20km Lauf von Nizza nach Villeneuve-Loubet. Küstenstrecke entlang der Côte d'Azur.",
      },
      it: {
        name: "Corsa - 20 km",
        description:
          "Corsa di 20km da Nizza a Villeneuve-Loubet. Percorso costiero lungo la Costa Azzurra.",
      },
    },
  };

  // Marathon translations
  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
    const trans =
      variantTranslations.marathon[
        lang as keyof typeof variantTranslations.marathon
      ];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: marathonVariant.id,
          language: lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: marathonVariant.id,
        language: lang,
        name: trans.name,
        description: trans.description,
      },
    });
  }
  console.log("   ✅ Maratona - 42 km (6 languages)");

  // Relay translations
  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
    const trans =
      variantTranslations.relay[lang as keyof typeof variantTranslations.relay];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: relayVariant.id,
          language: lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: relayVariant.id,
        language: lang,
        name: trans.name,
        description: trans.description,
      },
    });
  }
  console.log("   ✅ Maratona em Revezamento - 2x21.1 km (6 languages)");

  // 20km race translations
  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
    const trans =
      variantTranslations.race20km[
        lang as keyof typeof variantTranslations.race20km
      ];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: race20kmVariant.id,
          language: lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: race20kmVariant.id,
        language: lang,
        name: trans.name,
        description: trans.description,
      },
    });
  }
  console.log("   ✅ Corrida - 20 km (6 languages)");

  // Step 5: Upsert pricing phases
  console.log("💰 Upserting pricing phases...");

  const findOrCreatePricingPhase = async (
    name: string,
    variantId: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      discountPercent: number | null;
      note: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, variantId, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          variantId,
          name,
          ...data,
        },
      });
    }
  };

  // Marathon pricing phases
  await findOrCreatePricingPhase("Fase 1 - Early Bird", marathonVariant.id, {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-03-31T23:59:59.000Z"),
    price: 66.0,
    discountPercent: null,
    note: "Primeiros 1000 inscritos",
  });

  await findOrCreatePricingPhase("Fase 2 - Normal", marathonVariant.id, {
    startDate: new Date("2026-04-01T00:00:00.000Z"),
    endDate: new Date("2026-08-31T23:59:59.000Z"),
    price: 76.0,
    discountPercent: 15,
    note: "Próximos 4000 inscritos",
  });

  await findOrCreatePricingPhase("Fase 3 - Final", marathonVariant.id, {
    startDate: new Date("2026-09-01T00:00:00.000Z"),
    endDate: new Date("2026-11-07T23:59:59.000Z"),
    price: 86.0,
    discountPercent: 30,
    note: "Fase final até esgotar",
  });

  console.log("   ✅ Marathon - 3 pricing phases");

  // Relay pricing phases
  await findOrCreatePricingPhase("Fase 1 - Early Bird", relayVariant.id, {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-03-31T23:59:59.000Z"),
    price: 55.0,
    discountPercent: null,
    note: "Por equipa (2 pessoas)",
  });

  await findOrCreatePricingPhase("Fase 2 - Normal", relayVariant.id, {
    startDate: new Date("2026-04-01T00:00:00.000Z"),
    endDate: new Date("2026-08-31T23:59:59.000Z"),
    price: 65.0,
    discountPercent: 18,
    note: "Por equipa (2 pessoas)",
  });

  await findOrCreatePricingPhase("Fase 3 - Final", relayVariant.id, {
    startDate: new Date("2026-09-01T00:00:00.000Z"),
    endDate: new Date("2026-11-07T23:59:59.000Z"),
    price: 75.0,
    discountPercent: 36,
    note: "Por equipa (2 pessoas)",
  });

  console.log("   ✅ Relay Marathon - 3 pricing phases");

  // 20km pricing phases
  await findOrCreatePricingPhase("Fase 1 - Early Bird", race20kmVariant.id, {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-03-31T23:59:59.000Z"),
    price: 35.0,
    discountPercent: null,
    note: "Primeiros inscritos",
  });

  await findOrCreatePricingPhase("Fase 2 - Normal", race20kmVariant.id, {
    startDate: new Date("2026-04-01T00:00:00.000Z"),
    endDate: new Date("2026-08-31T23:59:59.000Z"),
    price: 40.0,
    discountPercent: 14,
    note: "Fase normal",
  });

  await findOrCreatePricingPhase("Fase 3 - Final", race20kmVariant.id, {
    startDate: new Date("2026-09-01T00:00:00.000Z"),
    endDate: new Date("2026-11-07T23:59:59.000Z"),
    price: 45.0,
    discountPercent: 29,
    note: "Fase final",
  });

  console.log("   ✅ 20km Race - 3 pricing phases");

  console.log("");
  console.log(
    "✅ Marathon des Alpes-Maritimes Nice-Cannes 2026 seeded successfully!"
  );
  console.log("📝 Event slug: marathon-nice-cannes-2026");
  console.log("🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("🏃 Variants: 3 (Marathon 42km, Relay 2x21.1km, Race 20km)");
  console.log("💰 Pricing phases: 9 total (3 per variant)");
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
