/**
 * Seed: Trail dos Diabos 2026 - Vinhais
 *
 * Event: Trail running in Parque Natural de Montesinho
 * Location: Vinhais, Bragança
 * Date: February 21, 2026
 * Organizer: Câmara Municipal de Vinhais
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("👹 Seeding Trail dos Diabos 2026 - Vinhais...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: "trail-dos-diabos-vinhais-2026" },
        { slug: "trail-diabos-2026" },
        { slug: "trail-diabos-vinhais-2026" },
      ],
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Trail dos Diabos 2026 - Vinhais",
      slug: "trail-dos-diabos-vinhais-2026",
      description: "Trail dos Diabos no Parque Natural de Montesinho",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-21T09:30:00Z"),
      endDate: new Date("2026-02-21T18:00:00Z"),
      registrationDeadline: new Date("2026-02-19T23:59:59Z"),
      imageUrl: "", // To be uploaded via admin
      city: "Vinhais",
      country: "Portugal",
      latitude: 41.8333,
      longitude: -7.0,
      isFeatured: true,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Trail dos Diabos 2026 - Vinhais",
      description: `# 👹 Trail dos Diabos 2026 - Vinhais

**Corra pelos trilhos do Parque Natural de Montesinho!**

---

## 📅 Data e Localização

- **Data**: 21 de Fevereiro de 2026 (Sexta-feira) - Quarta-feira de Cinzas
- **Local**: Vinhais, Bragança
- **Região**: Parque Natural de Montesinho, Alto Trás-os-Montes
- **Partida/Chegada**: Vinhais (centro)

## 🏃 Provas Disponíveis

### Trail dos Diabos - 16 km
- **Distância**: 16 km
- **Hora de Partida**: 09h30
- **Idade Mínima**: 16 anos
- **Desnível**: Trilhos montanhosos no Parque Natural de Montesinho
- **Cronometragem**: Sim
- **Classificação**: Por escalões etários (12 categorias)

### Caminhada - Não Cronometrada
- **Hora de Partida**: 09h30
- **Idade**: A partir dos 2 anos
- **Desnível**: Percurso acessível
- **Cronometragem**: Não
- **Classificação**: Não competitivo
- **Inscrição**: **GRATUITA** 🎉

## 🎯 Destaques

✅ **Parque Natural de Montesinho** - Trilhos únicos! 🏔️  
✅ **Tradição dos Diabos** - Celebração da Quarta-feira de Cinzas 👹  
✅ **2 provas** (Trail 16K + Caminhada não cronometrada)  
✅ **Caminhada GRATUITA** para todas as idades 🎉  
✅ **T-shirt técnica** incluída em todas as inscrições  
✅ **Almoço convívio** disponível (opcional)  
✅ **12 escalões etários** no Trail 16K  
✅ **Kit de participação** para todos  
✅ **Natureza e tradição** em pleno Alto Trás-os-Montes  

## 📖 História - O Dia dos Diabos em Vinhais

Na génese da denominação do evento como **TRAIL DOS DIABOS** está a celebração do dia dos diabos em Vinhais. Durante a celebração, na **quarta-feira de cinzas**, um grupo de rapazes mascara-se de **Diabo** com um fato vermelho e a cara coberta com uma máscara vermelha e de cinto na mão; outros mascaram-se de **Morte** com um fato preto e a cara enfarruscada (pintada com cinza ou carvão) e carregam uma gadanha.

### A Tradição 👹💀

**Os Diabos**:
- Perseguem principalmente as raparigas
- Saem a correr pelas ruas com um cinto
- Quando as apanham, são levadas à pedra onde as obrigam a ajoelharem-se para serem chicoteadas

**A Morte**:
- Mais calma, anda pelas ruas silenciosamente
- Quando encontra alguma pessoa, obriga-a a ajoelhar-se e a beijar a gadanha que ela leva na mão
- É a única que pode entrar na igreja (interditada para os Diabos), onde se refugiam as raparigas, para as ir buscar e as entregar aos Diabos

A Organização acredita que eventos associados à **natureza**, às **áreas montanhosas** e aos **rituais e costumes** do Concelho são um ótimo cartão-de-visita e, portanto, geradores de dinamismo e riqueza.

## 💰 Preçário e Opções de Inscrição

### Trail dos Diabos 16 km

**Opção A - Inscrição + Kit + Almoço**: 15€
- Kit de participação completo
- T-shirt técnica
- Senha de almoço incluída

**Opção B - Inscrição + Kit**: 7€
- Kit de participação completo
- T-shirt técnica

### Caminhada (Não Cronometrada)

**Inscrição**: **GRATUITA** 🎉
- Kit de participação
- T-shirt técnica incluída

### Extras Opcionais

- **Almoço Atleta**: 8€
- **Almoço Acompanhante**: 15€

## 📋 Kit de Participação Incluído

**Trail 16 km**:
- T-shirt técnica
- Número de dorsal
- Chip de cronometragem
- Seguro desportivo
- Almoço (se opção A)

**Caminhada**:
- T-shirt técnica
- Número de dorsal
- Seguro desportivo

## 🎫 Inscrições

- **Abertura**: 13 de Janeiro de 2026, 00h00
- **Encerramento**: 19 de Fevereiro de 2026, 23h59
- **Limite**: Até ao preenchimento das vagas disponíveis

### Como se Inscrever

Inscrições através da plataforma **SincTime**:
1. Aceder à página do evento
2. Escolher a prova (Trail 16K ou Caminhada)
3. Selecionar opção de inscrição
4. Adicionar extras opcionais (almoço)
5. Efetuar pagamento

## 👥 Escalões Etários - Trail 16 km

Os escalões são definidos por faixa etária:

### Masculinos:
- **Sub-20 Masculino**: 16-19 anos
- **Senior Masculino**: 20-39 anos
- **Veteranos 40 Masculino**: 40-49 anos
- **Veteranos 50 Masculino**: 50-59 anos
- **Veteranos 60 Masculino**: 60-69 anos
- **Veteranos 70+ Masculino**: 70-90 anos

### Femininos:
- **Sub-20 Feminino**: 16-19 anos
- **Senior Feminino**: 20-39 anos
- **Veteranos 40 Feminino**: 40-49 anos
- **Veteranos 50 Feminino**: 50-59 anos
- **Veteranos 60 Feminino**: 60-69 anos
- **Veteranos 70+ Feminino**: 70-90 anos

### Caminhada:
- **Caminhada Não Cronometrada**: Ambos os géneros, 2-90 anos

## 🏆 Prémios

### Trail dos Diabos 16 km

**Classificação Geral**:
- Prémios para os primeiros classificados (Masculino e Feminino)

**Escalões Etários**:
- Prémios para os primeiros classificados de cada escalão (M/F)

**Todos os Participantes**:
- T-shirt técnica
- Kit de participação
- Acesso ao almoço convívio (se inscrito)

### Caminhada

**Todos os Participantes**:
- T-shirt técnica (oferta)
- Kit de participação
- Acesso ao almoço convívio (opcional - 15€)

## ⏰ Programa do Evento

### Sexta-feira, 21 de Fevereiro de 2026
- 08h00 às 09h00 - Abertura do Secretariado e Levantamento de Dorsais
- 09h30 - **Partida Trail dos Diabos 16 km**
- 09h30 - **Partida Caminhada**
- 12h00 (aprox.) - Chegada dos primeiros atletas
- 13h00 - Almoço Convívio
- 14h30 (aprox.) - Cerimónia de Entrega de Prémios
- 16h00 - Encerramento

## 🌲 Sobre o Parque Natural de Montesinho

O **Parque Natural de Montesinho** é uma das maiores áreas protegidas de Portugal, localizado no extremo nordeste do país, no distrito de Bragança. Com uma área de cerca de 75.000 hectares, o parque caracteriza-se por:

- **Paisagens montanhosas** de rara beleza
- **Biodiversidade única** da região transmontana
- **Aldeias preservadas** com arquitetura tradicional
- **Flora e fauna** de interesse internacional
- **Trilhos pedestres** por vales e serras

## 🏘️ Sobre Vinhais

**Vinhais** é uma vila portuguesa pertencente ao **Distrito de Bragança**, **Região Norte** e sub-região do **Alto Trás-os-Montes**. Conhecida por:

- Tradições únicas como o **Dia dos Diabos**
- Gastronomia transmontana rica
- Fumeiro e enchidos de qualidade (fumeiro de Vinhais IGP)
- Património histórico e cultural
- Porta de entrada para o Parque Natural de Montesinho

## 🎽 Informações Técnicas

### Trail 16 km:
- **Terreno**: Trilhos de montanha, caminhos florestais
- **Dificuldade**: Média/Alta
- **Desnível Acumulado**: Trilhos montanhosos
- **Superfície**: Terra batida, pedra, trilho natural
- **Sinalização**: Marcação completa do percurso
- **Avitalhamento**: Posto(s) de avitalhamento no percurso e meta

### Caminhada:
- **Terreno**: Caminhos acessíveis
- **Dificuldade**: Baixa
- **Superfície**: Mista (estrada, caminhos)
- **Sinalização**: Marcação completa do percurso
- **Avitalhamento**: Disponível na meta

## 📞 Contactos da Organização

**Câmara Municipal de Vinhais**  
**Email**: desporto@cm-vinhais.pt  
**Telemóvel**: 939 985 868  
**Morada**: Vinhais, Bragança

**Plataforma de Inscrições**: SincTime  
**Website**: https://sinctime.com

---

*Corra pelos trilhos mágicos de Montesinho e viva a tradição dos Diabos de Vinhais!* 👹🏔️`,
      city: "Vinhais",
      metaTitle: "Trail dos Diabos 2026 | Vinhais, Bragança | 21 Fevereiro",
      metaDescription:
        "Trail dos Diabos 2026 no dia 21 de fevereiro em Vinhais, Parque Natural de Montesinho. Provas: Trail 16K e Caminhada gratuita. Celebração da tradição dos Diabos na Quarta-feira de Cinzas. T-shirt incluída.",
    },
    en: {
      title: "Devils Trail 2026 - Vinhais",
      description: `# 👹 Devils Trail 2026 - Vinhais

**Run through the trails of Montesinho Natural Park!**

---

## 📅 Date and Location

- **Date**: February 21, 2026 (Friday) - Ash Wednesday
- **Location**: Vinhais, Bragança
- **Region**: Montesinho Natural Park, Alto Trás-os-Montes
- **Start/Finish**: Vinhais (center)

## 🏃 Available Races

### Devils Trail - 16 km
- **Distance**: 16 km
- **Start Time**: 09:30
- **Minimum Age**: 16 years
- **Elevation**: Mountain trails in Montesinho Natural Park
- **Timing**: Yes
- **Classification**: By age categories (12 categories)

### Walk - Untimed
- **Start Time**: 09:30
- **Age**: From 2 years old
- **Elevation**: Accessible route
- **Timing**: No
- **Classification**: Non-competitive
- **Registration**: **FREE** 🎉

## 🎯 Highlights

✅ **Montesinho Natural Park** - Unique trails! 🏔️  
✅ **Devils Tradition** - Ash Wednesday celebration 👹  
✅ **2 races** (Trail 16K + Untimed Walk)  
✅ **FREE Walk** for all ages 🎉  
✅ **Technical t-shirt** included in all registrations  
✅ **Group lunch** available (optional)  
✅ **12 age categories** in Trail 16K  
✅ **Participation kit** for everyone  
✅ **Nature and tradition** in Alto Trás-os-Montes  

## 📖 History - The Day of the Devils in Vinhais

The **DEVILS TRAIL** name comes from the celebration of the day of the devils in Vinhais. During the celebration, on **Ash Wednesday**, a group of boys dress up as **Devils** with a red suit and face covered with a red mask and a belt in hand; others dress up as **Death** with a black suit and sooty face (painted with ash or coal) and carry a scythe.

### The Tradition 👹💀

**The Devils**:
- Chase mainly the girls
- Run through the streets with a belt
- When they catch them, they are taken to the stone where they are forced to kneel to be whipped

**Death**:
- Calmer, walks the streets silently
- When finding someone, forces them to kneel and kiss the scythe in hand
- The only one who can enter the church (forbidden to Devils), where girls take refuge, to fetch them and deliver them to the Devils

The Organization believes that events associated with **nature**, **mountainous areas** and the **rituals and customs** of the County are an excellent calling card and, therefore, generators of dynamism and wealth.

## 💰 Pricing and Registration Options

### Devils Trail 16 km

**Option A - Registration + Kit + Lunch**: €15
- Complete participation kit
- Technical t-shirt
- Lunch ticket included

**Option B - Registration + Kit**: €7
- Complete participation kit
- Technical t-shirt

### Walk (Untimed)

**Registration**: **FREE** 🎉
- Participation kit
- Technical t-shirt included

### Optional Extras

- **Athlete Lunch**: €8
- **Companion Lunch**: €15

## 🎫 Registration

- **Opening**: January 13, 2026, 00:00
- **Closing**: February 19, 2026, 23:59
- **Limit**: Until available spots are filled

## 👥 Age Categories - Trail 16 km

Categories defined by age range:

### Male:
- **Sub-20 Male**: 16-19 years
- **Senior Male**: 20-39 years
- **Veterans 40 Male**: 40-49 years
- **Veterans 50 Male**: 50-59 years
- **Veterans 60 Male**: 60-69 years
- **Veterans 70+ Male**: 70-90 years

### Female:
- **Sub-20 Female**: 16-19 years
- **Senior Female**: 20-39 years
- **Veterans 40 Female**: 40-49 years
- **Veterans 50 Female**: 50-59 years
- **Veterans 60 Female**: 60-69 years
- **Veterans 70+ Female**: 70-90 years

### Walk:
- **Untimed Walk**: Both genders, 2-90 years

## 📞 Organization Contact

**Vinhais City Council**  
**Email**: desporto@cm-vinhais.pt  
**Mobile**: +351 939 985 868  
**Address**: Vinhais, Bragança

**Registration Platform**: SincTime  
**Website**: https://sinctime.com

---

*Run through the magical trails of Montesinho and experience the Devils tradition of Vinhais!* 👹🏔️`,
      city: "Vinhais",
      metaTitle: "Devils Trail 2026 | Vinhais, Bragança | February 21",
      metaDescription:
        "Devils Trail 2026 on February 21 in Vinhais, Montesinho Natural Park. Races: Trail 16K and free Walk. Celebration of the Devils tradition on Ash Wednesday. T-shirt included.",
    },
    es: {
      title: "Trail de los Diablos 2026 - Vinhais",
      description: `# 👹 Trail de los Diablos 2026 - Vinhais

**¡Corre por los senderos del Parque Natural de Montesinho!**

---

## 📅 Fecha y Ubicación

- **Fecha**: 21 de Febrero de 2026 (Viernes) - Miércoles de Ceniza
- **Ubicación**: Vinhais, Bragança
- **Región**: Parque Natural de Montesinho, Alto Trás-os-Montes
- **Salida/Llegada**: Vinhais (centro)

## 🏃 Carreras Disponibles

### Trail de los Diablos - 16 km
- **Distancia**: 16 km
- **Hora de Salida**: 09:30
- **Edad Mínima**: 16 años
- **Desnivel**: Senderos de montaña en el Parque Natural de Montesinho
- **Cronometraje**: Sí
- **Clasificación**: Por categorías de edad (12 categorías)

### Caminata - Sin Cronometraje
- **Hora de Salida**: 09:30
- **Edad**: A partir de 2 años
- **Desnivel**: Recorrido accesible
- **Cronometraje**: No
- **Clasificación**: No competitivo
- **Inscripción**: **GRATIS** 🎉

## 🎯 Destacados

✅ **Parque Natural de Montesinho** - ¡Senderos únicos! 🏔️  
✅ **Tradición de los Diablos** - Celebración del Miércoles de Ceniza 👹  
✅ **2 carreras** (Trail 16K + Caminata sin cronometraje)  
✅ **Caminata GRATUITA** para todas las edades 🎉  
✅ **Camiseta técnica** incluida en todas las inscripciones  
✅ **Almuerzo de convivencia** disponible (opcional)  
✅ **12 categorías de edad** en Trail 16K  
✅ **Kit de participación** para todos  
✅ **Naturaleza y tradición** en pleno Alto Trás-os-Montes  

## 💰 Precios y Opciones de Inscripción

### Trail de los Diablos 16 km

**Opción A - Inscripción + Kit + Almuerzo**: 15€
- Kit de participación completo
- Camiseta técnica
- Vale de almuerzo incluido

**Opción B - Inscripción + Kit**: 7€
- Kit de participación completo
- Camiseta técnica

### Caminata (Sin Cronometraje)

**Inscripción**: **GRATIS** 🎉
- Kit de participación
- Camiseta técnica incluida

### Extras Opcionales

- **Almuerzo Atleta**: 8€
- **Almuerzo Acompañante**: 15€

## 📞 Contacto de la Organización

**Ayuntamiento de Vinhais**  
**Email**: desporto@cm-vinhais.pt  
**Móvil**: +351 939 985 868  
**Dirección**: Vinhais, Bragança

---

*¡Corre por los senderos mágicos de Montesinho y vive la tradición de los Diablos de Vinhais!* 👹🏔️`,
      city: "Vinhais",
      metaTitle: "Trail de los Diablos 2026 | Vinhais, Bragança | 21 Febrero",
      metaDescription:
        "Trail de los Diablos 2026 el 21 de febrero en Vinhais, Parque Natural de Montesinho. Carreras: Trail 16K y Caminata gratuita. Celebración de la tradición de los Diablos en Miércoles de Ceniza. Camiseta incluida.",
    },
    fr: {
      title: "Trail des Diables 2026 - Vinhais",
      description: `# 👹 Trail des Diables 2026 - Vinhais

**Courez sur les sentiers du Parc Naturel de Montesinho !**

---

## 📅 Date et Lieu

- **Date** : 21 Février 2026 (Vendredi) - Mercredi des Cendres
- **Lieu** : Vinhais, Bragança
- **Région** : Parc Naturel de Montesinho, Alto Trás-os-Montes
- **Départ/Arrivée** : Vinhais (centre)

## 🏃 Courses Disponibles

### Trail des Diables - 16 km
- **Distance** : 16 km
- **Heure de Départ** : 09h30
- **Âge Minimum** : 16 ans
- **Dénivelé** : Sentiers de montagne dans le Parc Naturel de Montesinho
- **Chronométrage** : Oui
- **Classification** : Par catégories d'âge (12 catégories)

### Marche - Non Chronométrée
- **Heure de Départ** : 09h30
- **Âge** : À partir de 2 ans
- **Dénivelé** : Parcours accessible
- **Chronométrage** : Non
- **Classification** : Non compétitif
- **Inscription** : **GRATUITE** 🎉

## 🎯 Points Forts

✅ **Parc Naturel de Montesinho** - Sentiers uniques ! 🏔️  
✅ **Tradition des Diables** - Célébration du Mercredi des Cendres 👹  
✅ **2 courses** (Trail 16K + Marche non chronométrée)  
✅ **Marche GRATUITE** pour tous les âges 🎉  
✅ **T-shirt technique** inclus dans toutes les inscriptions  
✅ **Déjeuner convivial** disponible (optionnel)  
✅ **12 catégories d'âge** dans Trail 16K  
✅ **Kit de participation** pour tous  
✅ **Nature et tradition** en plein Alto Trás-os-Montes  

## 💰 Tarifs et Options d'Inscription

### Trail des Diables 16 km

**Option A - Inscription + Kit + Déjeuner** : 15€
- Kit de participation complet
- T-shirt technique
- Ticket déjeuner inclus

**Option B - Inscription + Kit** : 7€
- Kit de participation complet
- T-shirt technique

### Marche (Non Chronométrée)

**Inscription** : **GRATUITE** 🎉
- Kit de participation
- T-shirt technique inclus

### Extras Optionnels

- **Déjeuner Athlète** : 8€
- **Déjeuner Accompagnant** : 15€

## 📞 Contact de l'Organisation

**Mairie de Vinhais**  
**Email** : desporto@cm-vinhais.pt  
**Mobile** : +351 939 985 868  
**Adresse** : Vinhais, Bragança

---

*Courez sur les sentiers magiques de Montesinho et vivez la tradition des Diables de Vinhais !* 👹🏔️`,
      city: "Vinhais",
      metaTitle: "Trail des Diables 2026 | Vinhais, Bragança | 21 Février",
      metaDescription:
        "Trail des Diables 2026 le 21 février à Vinhais, Parc Naturel de Montesinho. Courses : Trail 16K et Marche gratuite. Célébration de la tradition des Diables le Mercredi des Cendres. T-shirt inclus.",
    },
    de: {
      title: "Teufelstrail 2026 - Vinhais",
      description: `# 👹 Teufelstrail 2026 - Vinhais

**Laufen Sie durch die Wege des Naturparks Montesinho!**

---

## 📅 Datum und Ort

- **Datum**: 21. Februar 2026 (Freitag) - Aschermittwoch
- **Ort**: Vinhais, Bragança
- **Region**: Naturpark Montesinho, Alto Trás-os-Montes
- **Start/Ziel**: Vinhais (Zentrum)

## 🏃 Verfügbare Läufe

### Teufelstrail - 16 km
- **Distanz**: 16 km
- **Startzeit**: 09:30
- **Mindestalter**: 16 Jahre
- **Höhenunterschied**: Bergwege im Naturpark Montesinho
- **Zeitnahme**: Ja
- **Klassifizierung**: Nach Alterskategorien (12 Kategorien)

### Wanderung - Ohne Zeitnahme
- **Startzeit**: 09:30
- **Alter**: Ab 2 Jahren
- **Höhenunterschied**: Zugängliche Strecke
- **Zeitnahme**: Nein
- **Klassifizierung**: Nicht wettbewerbsfähig
- **Anmeldung**: **KOSTENLOS** 🎉

## 🎯 Höhepunkte

✅ **Naturpark Montesinho** - Einzigartige Wege! 🏔️  
✅ **Teufels-Tradition** - Aschermittwoch-Feier 👹  
✅ **2 Läufe** (Trail 16K + Wanderung ohne Zeitnahme)  
✅ **KOSTENLOSE Wanderung** für alle Altersgruppen 🎉  
✅ **Technisches T-Shirt** in allen Anmeldungen enthalten  
✅ **Gemeinschaftliches Mittagessen** verfügbar (optional)  
✅ **12 Alterskategorien** im Trail 16K  
✅ **Teilnahme-Kit** für alle  
✅ **Natur und Tradition** im Alto Trás-os-Montes  

## 💰 Preise und Anmeldeoptionen

### Teufelstrail 16 km

**Option A - Anmeldung + Kit + Mittagessen**: 15€
- Komplettes Teilnahme-Kit
- Technisches T-Shirt
- Mittagessen-Gutschein enthalten

**Option B - Anmeldung + Kit**: 7€
- Komplettes Teilnahme-Kit
- Technisches T-Shirt

### Wanderung (Ohne Zeitnahme)

**Anmeldung**: **KOSTENLOS** 🎉
- Teilnahme-Kit
- Technisches T-Shirt enthalten

### Optionale Extras

- **Athleten-Mittagessen**: 8€
- **Begleiter-Mittagessen**: 15€

## 📞 Kontakt der Organisation

**Stadtverwaltung Vinhais**  
**E-Mail**: desporto@cm-vinhais.pt  
**Mobil**: +351 939 985 868  
**Adresse**: Vinhais, Bragança

---

*Laufen Sie durch die magischen Wege von Montesinho und erleben Sie die Teufels-Tradition von Vinhais!* 👹🏔️`,
      city: "Vinhais",
      metaTitle: "Teufelstrail 2026 | Vinhais, Bragança | 21. Februar",
      metaDescription:
        "Teufelstrail 2026 am 21. Februar in Vinhais, Naturpark Montesinho. Läufe: Trail 16K und kostenlose Wanderung. Feier der Teufels-Tradition am Aschermittwoch. T-Shirt inklusive.",
    },
    it: {
      title: "Trail dei Diavoli 2026 - Vinhais",
      description: `# 👹 Trail dei Diavoli 2026 - Vinhais

**Corri sui sentieri del Parco Naturale di Montesinho!**

---

## 📅 Data e Luogo

- **Data**: 21 Febbraio 2026 (Venerdì) - Mercoledì delle Ceneri
- **Luogo**: Vinhais, Bragança
- **Regione**: Parco Naturale di Montesinho, Alto Trás-os-Montes
- **Partenza/Arrivo**: Vinhais (centro)

## 🏃 Gare Disponibili

### Trail dei Diavoli - 16 km
- **Distanza**: 16 km
- **Ora di Partenza**: 09:30
- **Età Minima**: 16 anni
- **Dislivello**: Sentieri di montagna nel Parco Naturale di Montesinho
- **Cronometraggio**: Sì
- **Classificazione**: Per categorie di età (12 categorie)

### Camminata - Senza Cronometraggio
- **Ora di Partenza**: 09:30
- **Età**: A partire da 2 anni
- **Dislivello**: Percorso accessibile
- **Cronometraggio**: No
- **Classificazione**: Non competitivo
- **Iscrizione**: **GRATIS** 🎉

## 🎯 Punti Salienti

✅ **Parco Naturale di Montesinho** - Sentieri unici! 🏔️  
✅ **Tradizione dei Diavoli** - Celebrazione del Mercoledì delle Ceneri 👹  
✅ **2 gare** (Trail 16K + Camminata senza cronometraggio)  
✅ **Camminata GRATUITA** per tutte le età 🎉  
✅ **Maglietta tecnica** inclusa in tutte le iscrizioni  
✅ **Pranzo conviviale** disponibile (opzionale)  
✅ **12 categorie di età** nel Trail 16K  
✅ **Kit di partecipazione** per tutti  
✅ **Natura e tradizione** nell'Alto Trás-os-Montes  

## 💰 Prezzi e Opzioni di Iscrizione

### Trail dei Diavoli 16 km

**Opzione A - Iscrizione + Kit + Pranzo**: 15€
- Kit di partecipazione completo
- Maglietta tecnica
- Buono pranzo incluso

**Opzione B - Iscrizione + Kit**: 7€
- Kit di partecipazione completo
- Maglietta tecnica

### Camminata (Senza Cronometraggio)

**Iscrizione**: **GRATIS** 🎉
- Kit di partecipazione
- Maglietta tecnica inclusa

### Extra Opzionali

- **Pranzo Atleta**: 8€
- **Pranzo Accompagnatore**: 15€

## 📞 Contatto dell'Organizzazione

**Comune di Vinhais**  
**Email**: desporto@cm-vinhais.pt  
**Mobile**: +351 939 985 868  
**Indirizzo**: Vinhais, Bragança

---

*Corri sui sentieri magici di Montesinho e vivi la tradizione dei Diavoli di Vinhais!* 👹🏔️`,
      city: "Vinhais",
      metaTitle: "Trail dei Diavoli 2026 | Vinhais, Bragança | 21 Febbraio",
      metaDescription:
        "Trail dei Diavoli 2026 il 21 febbraio a Vinhais, Parco Naturale di Montesinho. Gare: Trail 16K e Camminata gratuita. Celebrazione della tradizione dei Diavoli il Mercoledì delle Ceneri. Maglietta inclusa.",
    },
  };

  // Create translations for all languages
  const languages: Language[] = ["pt", "en", "es", "fr", "de", "it"];

  for (const lang of languages) {
    const translation = translations[lang];
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
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
        language: lang,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  console.log("✅ Created translations for all languages");

  // Define race variants with pricing phases
  const variants = [
    {
      name: "Trail dos Diabos 16K",
      distanceKm: 16,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-02-21T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: null,
      price: 7,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trilhos de montanha no Parque Natural de Montesinho · Dificuldade: Média/Alta · Idade mínima: 16 anos · Categorias: Sub-20, Seniores, Veteranos 40-70+ (M/F) · Inclui: T-shirt técnica, Dorsal, Chip, Seguro · Opção com almoço: 15€",
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2026-01-13T00:00:00Z"),
          endDate: new Date("2026-02-19T23:59:59Z"),
          price: 7,
          currency: Currency.EUR,
          note: "Inscrição + Kit (sem almoço)",
        },
      ],
    },
    {
      name: "Caminhada (Não Cronometrada)",
      distanceKm: null,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-02-21T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: null,
      price: 0,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Caminhos acessíveis, mista (estrada, caminhos) · Não competitivo · Sem cronometragem · Idade mínima: 2 anos · Inscrição GRATUITA 🎉 · Inclui: T-shirt técnica, Dorsal, Seguro · Almoço opcional: 15€",
      pricingPhases: [
        {
          name: "Inscrição Gratuita",
          startDate: new Date("2026-01-13T00:00:00Z"),
          endDate: new Date("2026-02-20T23:59:59Z"),
          price: 0,
          currency: Currency.EUR,
          note: "Inscrição GRATUITA com T-shirt incluída",
        },
      ],
    },
  ];

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases for this variant
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ linked to eventId (event-level display)
          variantId: variant.id, // ✅ linked to variantId (variant-level pricing)
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phase(s)`);
  }

  console.log("✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: Trail dos Diabos 2026 - Vinhais
- Variants: 2 (Trail 16K + Caminhada gratuita)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 2 total (1 Trail + 1 Caminhada gratuita)
- Date: February 21, 2026 (Ash Wednesday)
- Location: Vinhais, Parque Natural de Montesinho, Bragança
- Special: FREE Walk registration + Tradition of the Devils! 👹
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
