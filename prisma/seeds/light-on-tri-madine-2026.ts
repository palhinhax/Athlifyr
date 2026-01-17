/**
 * Seed: Light On Tri Madine 2026
 * Complete with translations in all 6 languages
 * Multi-day event: September 19-20, 2026
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏊 Seeding Light On Tri Madine 2026...");

  const eventSlug = "light-on-tri-madine-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Light On Tri Madine 2026",
      description: `Triatlo Light On Madine - O encerramento da temporada LIGHT ON TRI 2026! Evento de 2 dias (19-20 Setembro) perto de Nancy e Metz, na região de Lorraine, França. Inclui distâncias Sprint, Olímpico, Half Ironman (L), categorias infantis e corrida 7km. A distância longa (L/Half Ironman) será destaque no Sábado!`,
      sportTypes: [SportType.TRIATHLON],
      startDate: new Date("2026-09-19T09:30:00.000Z"),
      endDate: new Date("2026-09-20T13:30:00.000Z"),
      city: "Nonsard-Lamarche",
      country: "France",
      latitude: 48.9072,
      longitude: 5.7794,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Lac+de+Madine+Nonsard-Lamarche+France",
      externalUrl: "https://www.lightontri.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-09-18T19:00:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Light On Tri Madine 2026",
      description: `Triatlo Light On Madine - O encerramento da temporada LIGHT ON TRI 2026! Evento de 2 dias (19-20 Setembro) perto de Nancy e Metz, na região de Lorraine, França. Inclui distâncias Sprint, Olímpico, Half Ironman (L), categorias infantis e corrida 7km. A distância longa (L/Half Ironman) será destaque no Sábado!`,
      sportTypes: [SportType.TRIATHLON],
      startDate: new Date("2026-09-19T09:30:00.000Z"),
      endDate: new Date("2026-09-20T13:30:00.000Z"),
      city: "Nonsard-Lamarche",
      country: "France",
      latitude: 48.9072,
      longitude: 5.7794,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Lac+de+Madine+Nonsard-Lamarche+France",
      externalUrl: "https://www.lightontri.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-09-18T19:00:00.000Z"),
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
      title: "Light On Tri Madine 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Madine 2026

Marca na agenda: **19 e 20 de Setembro**! Junta-te a nós para celebrar o encerramento do **LIGHT ON TRI 2026** com o **Light On Tri Madine***! Localizado perto de Nancy e Metz, este triatlo está idealmente situado na região de Lorraine, França.

**A distância longa (L/Half Ironman) será destaque no Sábado!** A última etapa antes da pausa de inverno, esta será uma ótima oportunidade para dar tudo num dos formatos disponíveis.

## 📅 Programa do Evento

### Sexta-feira, 18 de Setembro de 2026:
- **17h00 - 19h00:** Levantamento de dorsais para MINI-KIDS, KIDS, S*, M** e L***

### Sábado, 19 de Setembro de 2026:
- **07h30 - 09h00:** Levantamento de dorsais para L***
- **09h30:** Partida do Triatlo L*** (Half Ironman) - Mulheres e Homens
- **10h00 - 10h45:** Levantamento de dorsais para MINI-KIDS e KIDS
- **11h00:** Kids 1 - Nascidos em 2017, 2018, 2019 e 2020
- **11h30:** Kids 2 - Nascidos em 2013, 2014, 2015 e 2016
- **17h30:** Corrida 7 KM

### Domingo, 20 de Setembro de 2026:
- **07h00 - 08h30:** Levantamento de dorsais para S*
- **09h00:** Partida Sprint Triathlon* - Mulheres e Homens
- **11h30 - 13h00:** Levantamento de dorsais M**
- **13h30:** Partida do Triatlo M** (Olímpico) - Mulheres e Homens

---

## 🏊 Triatlo Sprint (S)* - Domingo

### Natação - 500m
- Partida da praia
- Uma volta de 500 metros
- Partida em onda única (mulheres e homens às 09h00)
- Fato de neoprene recomendado (temperatura média: 18°C)

### Ciclismo - 20 km
- Parque de bicicletas no local Madine 1
- Uma volta
- **D+ = 110m** (percurso plano)

### Corrida - 5 km
- Uma volta de 5 km
- Um posto de abastecimento a meio da prova
- Percurso plano

**Distância Total:** 500m natação + 20 km ciclismo + 5 km corrida

---

## 🏊 Triatlo Olímpico (M)** - Domingo

### Natação - 1,5 km
- Partida da praia
- Duas voltas de 750 metros com saída australiana de 40m
- Apenas uma partida às 13h30
- Fato de neoprene recomendado (temperatura média: 18°C)

### Ciclismo - 45 km
- Parque de bicicletas no local Madine 1
- Uma volta
- **D+ = 400m**

### Corrida - 10 km
- Duas voltas de 5 km: estradas e trilhos mistos
- Três postos de abastecimento: km 2,5 / 5 / 7,5
- Percurso plano

**Distância Total:** 1,5 km natação + 45 km ciclismo + 10 km corrida

---

## 🏊 Triatlo Longo (L)*** - HALF IRONMAN - Sábado

### Natação - 1,9 km
- Partida da praia
- Duas voltas de 950 metros com saída australiana de 40m
- Apenas uma partida às 09h30
- Fato de neoprene recomendado (temperatura média: 18°C)

### Ciclismo - 85 km
- Parque de bicicletas no local Madine 1
- Duas voltas (com passagem perto de Madine 2)
- Posto de abastecimento no km 14 e 52
- **D+ = 950m**

### Corrida - 21 km (Meia Maratona)
- Três voltas de 7 km: estradas e trilhos mistos
- Cinco postos de abastecimento: km 3,5 / 7 / 9,5 / 14 / 17,5
- Percurso plano

**Distância Total:** 1,9 km natação + 85 km ciclismo + 21 km corrida  
**Formato:** Half Ironman / 70.3

---

## 👶 MINI-KIDS - Sábado

**Jovens dos 6 aos 9 anos**  
Nascidos em 2017, 2018, 2019 ou 2020

**Horário:** Sábado, 19 de Setembro de 2026 - Partida às 11h00

### Distâncias:
- **Natação:** 50m (ida e volta)
- **Ciclismo:** 1200m (ida e volta)
- **Corrida:** 500m (ida e volta)

**Distância Total:** 50m natação + 1,2 km ciclismo + 500m corrida

---

## 👧 KIDS - Sábado

**Jovens dos 10 aos 13 anos**  
Nascidos em 2013, 2014, 2015 ou 2016

**Horário:** Sábado, 19 de Setembro de 2026 - Partida às 11h30

### Distâncias:
- **Natação:** 200m
- **Ciclismo:** 4000m (ida e volta)
- **Corrida:** 1500m (ida e volta)

**Distância Total:** 200m natação + 4 km ciclismo + 1,5 km corrida

---

## 🏃 Corrida 7 KM - Sábado

**Horário:** Sábado, 19 de Setembro de 2026 - Partida às 17h30

**Acessível a todos com 15 anos ou mais**  
Nascidos em 2011 e antes

**Distância:** 7 km

---

## 📋 Regulamento

- **Documento de Identidade:** Obrigatório para levantamento de dorsais
- **Número de Participantes:** Limitado para cada formato de prova
- **Inscrição Antecipada:** Recomendada

## 📍 Localização

**Local:** Lac de Madine (Madine 1)  
**Cidade:** Nonsard-Lamarche, Meuse (55)  
**Região:** Grand Est, França  
**Proximidade:** Perto de Nancy e Metz

## 👥 Organização

**Organizador:** Light On Tri  
**Contacto:** hello@lightontri.com  
**Telefone:** +33 6 37 08 97 57  
**Website:** [lightontri.com](https://www.lightontri.com)

## 🎯 Para Quem?

- **Triatletas Sprint:** Iniciantes e experientes
- **Triatletas Olímpicos:** Distância M
- **Triatletas Half Ironman:** Distância L (70.3)
- **Crianças:** Categorias MINI-KIDS e KIDS
- **Corredores:** Corrida independente de 7 km
- **Famílias:** Evento de 2 dias com várias atividades

---

**O encerramento perfeito da temporada LIGHT ON TRI 2026!** 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Nonsard-Lamarche",
      metaTitle:
        "Light On Tri Madine 2026 | Half Ironman, Sprint e Olímpico França",
      metaDescription:
        "Light On Tri Madine 2026: Half Ironman (1.9km-85km-21km), Olímpico, Sprint + Kids. 19-20 Setembro no Lac de Madine, França. Encerramento da temporada!",
    },
    {
      language: "en",
      title: "Light On Tri Madine 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Madine 2026

Save the date: **September 19th and 20th**! Join us to celebrate the closing of **LIGHT ON TRI 2026** with the **Light On Tri Madine***! Located near Nancy and Metz, this triathlon is ideally situated in the Lorraine region, France.

**The long-distance (L/Half Ironman) format will be featured on Saturday!** The final stage before the winter break, this will be a great opportunity to give it your all in one of the available formats.

## 📅 Event Schedule

### Friday, September 18, 2026:
- **5:00 PM - 7:00 PM:** Bib collection for MINI-KIDS, KIDS, S*, M** and L***

### Saturday, September 19, 2026:
- **7:30 AM - 9:00 AM:** Bib collection for L***
- **9:30 AM:** Start of L*** Triathlon (Half Ironman) - Women and Men
- **10:00 AM - 10:45 AM:** Bib collection for MINI-KIDS and KIDS
- **11:00 AM:** Kids 1 - Born in 2017, 2018, 2019 and 2020
- **11:30 AM:** Kids 2 - Born in 2013, 2014, 2015 and 2016
- **5:30 PM:** 7 KM Run

### Sunday, September 20, 2026:
- **7:00 AM - 8:30 AM:** Bib collection for S*
- **9:00 AM:** Start Sprint Triathlon* - Women and Men
- **11:30 AM - 1:00 PM:** Bib Collection M**
- **1:30 PM:** Start of M** Triathlon (Olympic) - Women and Men

## 🏊 Sprint Triathlon (S)* - Sunday

- **Swim:** 500m (water start, wetsuit recommended, 18°C avg)
- **Bike:** 20 km (D+ = 110m, flat route)
- **Run:** 5 km (flat course, 1 aid station)

**Start:** 9:00 AM

## 🏊 Olympic Triathlon (M)** - Sunday

- **Swim:** 1.5 km (2 x 750m loops with Australian exit)
- **Bike:** 45 km (D+ = 400m)
- **Run:** 10 km (2 x 5km loops, mixed roads/trails, 3 aid stations)

**Start:** 1:30 PM

## 🏊 Long Distance (L)*** - HALF IRONMAN - Saturday

- **Swim:** 1.9 km (2 x 950m loops with Australian exit)
- **Bike:** 85 km (2 loops, D+ = 950m, aid stations at km 14 & 52)
- **Run:** 21 km (3 x 7km loops, mixed roads/trails, 5 aid stations)

**Total Distance:** 1.9 km swim + 85 km bike + 21 km run  
**Format:** Half Ironman / 70.3

**Start:** 9:30 AM

## 👶 MINI-KIDS - Saturday

Ages 6-9 (born 2017-2020)  
**Start:** 11:00 AM

- Swim: 50m
- Bike: 1200m
- Run: 500m

## 👧 KIDS - Saturday

Ages 10-13 (born 2013-2016)  
**Start:** 11:30 AM

- Swim: 200m
- Bike: 4000m
- Run: 1500m

## 🏃 7 KM Run - Saturday

Ages 15+ (born 2011 and before)  
**Start:** 5:30 PM  
**Distance:** 7 km

## 📍 Location

**Venue:** Lac de Madine (Madine 1)  
**City:** Nonsard-Lamarche, Meuse (55)  
**Region:** Grand Est, France  
**Near:** Nancy and Metz

## 📧 Contact

**Email:** hello@lightontri.com  
**Phone:** +33 6 37 08 97 57  
**Website:** [lightontri.com](https://www.lightontri.com)

**The perfect closing of the LIGHT ON TRI 2026 season!** 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Nonsard-Lamarche",
      metaTitle:
        "Light On Tri Madine 2026 | Half Ironman, Sprint & Olympic France",
      metaDescription:
        "Light On Tri Madine 2026: Half Ironman (1.9km-85km-21km), Olympic, Sprint + Kids. Sept 19-20 at Lac de Madine, France. Season closing!",
    },
    {
      language: "es",
      title: "Light On Tri Madine 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Madine 2026

¡Reserva la fecha: **19 y 20 de septiembre**! Únete a nosotros para celebrar el cierre de **LIGHT ON TRI 2026** con el **Light On Tri Madine***! Situado cerca de Nancy y Metz, en la región de Lorena, Francia.

**¡La distancia larga (L/Half Ironman) será el sábado!**

## 📅 Programa

### Sábado 19 de Septiembre:
- **09:30:** Triatlón L (Half Ironman) - 1,9km natación, 85km ciclismo, 21km carrera
- **11:00:** MINI-KIDS (50m-1200m-500m)
- **11:30:** KIDS (200m-4000m-1500m)
- **17:30:** Carrera 7 KM

### Domingo 20 de Septiembre:
- **09:00:** Triatlón Sprint - 500m natación, 20km ciclismo, 5km carrera
- **13:30:** Triatlón Olímpico - 1,5km natación, 45km ciclismo, 10km carrera

## 🏊 Half Ironman (L) - Sábado

**Distancia:** 1,9 km natación + 85 km ciclismo + 21 km carrera  
**Salida:** 09:30  
**D+:** 950m en ciclismo

## 📍 Ubicación

**Lugar:** Lac de Madine, Nonsard-Lamarche  
**Región:** Grand Est, Francia

## 📧 Contacto

**Email:** hello@lightontri.com  
**Tel:** +33 6 37 08 97 57  
**Web:** [lightontri.com](https://www.lightontri.com)

¡El cierre perfecto de la temporada LIGHT ON TRI 2026! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Nonsard-Lamarche",
      metaTitle: "Light On Tri Madine 2026 | Half Ironman y Triatlón Francia",
      metaDescription:
        "Light On Tri Madine 2026: Half Ironman, Olímpico, Sprint + Kids. 19-20 septiembre en Lac de Madine, Francia.",
    },
    {
      language: "fr",
      title: "Light On Tri Madine 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Madine 2026

Réservez la date : **19 et 20 septembre** ! Rejoignez-nous pour célébrer la clôture de **LIGHT ON TRI 2026** avec le **Light On Tri Madine*** ! Situé près de Nancy et Metz, ce triathlon est idéalement situé en région Lorraine.

**Le format longue distance (L/Half Ironman) sera mis à l'honneur le samedi !** La dernière étape avant la trêve hivernale, ce sera une belle occasion de se donner à fond dans l'un des formats proposés.

## 📅 Programme de l'événement

### Vendredi 18 septembre 2026 :
- **17h00 - 19h00 :** Retrait des dossards pour MINI-KIDS, KIDS, S*, M** et L***

### Samedi 19 septembre 2026 :
- **07h30 - 09h00 :** Retrait des dossards pour L***
- **09h30 :** Départ du Triathlon L*** (Half Ironman) - Femmes et Hommes
- **10h00 - 10h45 :** Retrait des dossards pour MINI-KIDS et KIDS
- **11h00 :** Kids 1 - Nés en 2017, 2018, 2019 et 2020
- **11h30 :** Kids 2 - Nés en 2013, 2014, 2015 et 2016
- **17h30 :** Course 7 KM

### Dimanche 20 septembre 2026 :
- **07h00 - 08h30 :** Retrait des dossards pour S*
- **09h00 :** Départ Sprint Triathlon* - Femmes et Hommes
- **11h30 - 13h00 :** Retrait des dossards M**
- **13h30 :** Départ du Triathlon M** (Olympique) - Femmes et Hommes

## 🏊 Triathlon Sprint (S)* - Dimanche

### Natation - 500m
- Départ de la plage
- Une boucle de 500 mètres
- Départ en vague unique (femmes et hommes à 09h00)
- Combinaison néoprène recommandée (température moyenne : 18°C)

### Vélo - 20 km
- Parc à vélos sur le site Madine 1
- Une boucle
- **D+ = 110m** (parcours plat)

### Course à pied - 5 km
- Une boucle de 5 km
- Un ravitaillement à mi-parcours
- Parcours plat

**Départ :** 09h00

## 🏊 Triathlon Olympique (M)** - Dimanche

### Natation - 1,5 km
- Départ de la plage
- Deux boucles de 750 mètres avec sortie australienne de 40m
- Un seul départ à 13h30
- Combinaison néoprène recommandée (température moyenne : 18°C)

### Vélo - 45 km
- Parc à vélos sur le site Madine 1
- Une boucle
- **D+ = 400m**

### Course à pied - 10 km
- Deux boucles de 5 km : routes et sentiers mixtes
- Trois ravitaillements : km 2,5 / 5 / 7,5
- Parcours plat

**Départ :** 13h30

## 🏊 Triathlon Longue Distance (L)*** - HALF IRONMAN - Samedi

### Natation - 1,9 km
- Départ de la plage
- Deux boucles de 950 mètres avec sortie australienne de 40m
- Un seul départ à 09h30
- Combinaison néoprène recommandée (température moyenne : 18°C)

### Vélo - 85 km
- Parc à vélos sur le site Madine 1
- Deux boucles (avec passage près de Madine 2)
- Ravitaillement aux km 14 et 52
- **D+ = 950m**

### Course à pied - 21 km (Semi-marathon)
- Trois boucles de 7 km : routes et sentiers mixtes
- Cinq ravitaillements : km 3,5 / 7 / 9,5 / 14 / 17,5
- Parcours plat

**Distance totale :** 1,9 km natation + 85 km vélo + 21 km course  
**Format :** Half Ironman / 70.3

**Départ :** 09h30

## 👶 MINI-KIDS - Samedi

**Jeunes de 6 à 9 ans**  
Nés en 2017, 2018, 2019 ou 2020

**Horaire :** Samedi 19 septembre 2026 - Départ à 11h00

**Distances :** 50m natation + 1200m vélo + 500m course

## 👧 KIDS - Samedi

**Jeunes de 10 à 13 ans**  
Nés en 2013, 2014, 2015 ou 2016

**Horaire :** Samedi 19 septembre 2026 - Départ à 11h30

**Distances :** 200m natation + 4000m vélo + 1500m course

## 🏃 Course 7 KM - Samedi

**Horaire :** Samedi 19 septembre 2026 - Départ à 17h30

**Accessible à tous dès 15 ans**  
Nés en 2011 et avant

**Distance :** 7 km

## 📍 Localisation

**Lieu :** Lac de Madine (Madine 1)  
**Ville :** Nonsard-Lamarche, Meuse (55)  
**Région :** Grand Est, France  
**Proximité :** Près de Nancy et Metz

## 👥 Organisation

**Organisateur :** Light On Tri  
**Contact :** hello@lightontri.com  
**Téléphone :** 06 37 08 97 57  
**Site web :** [lightontri.com](https://www.lightontri.com)

**La clôture parfaite de la saison LIGHT ON TRI 2026 !** 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Nonsard-Lamarche",
      metaTitle: "Light On Tri Madine 2026 | Half Ironman, Sprint et Olympique",
      metaDescription:
        "Light On Tri Madine 2026 : Half Ironman (1.9km-85km-21km), Olympique, Sprint + Kids. 19-20 septembre au Lac de Madine, France. Clôture de saison !",
    },
    {
      language: "de",
      title: "Light On Tri Madine 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Madine 2026

Datum vormerken: **19. und 20. September**! Feiern Sie mit uns den Abschluss von **LIGHT ON TRI 2026** mit dem **Light On Tri Madine***! In der Nähe von Nancy und Metz, ideal in der Region Lothringen gelegen.

**Die Langdistanz (L/Half Ironman) findet am Samstag statt!**

## 📅 Programm

### Samstag, 19. September:
- **09:30 Uhr:** Triathlon L (Half Ironman) - 1,9km Schwimmen, 85km Radfahren, 21km Laufen
- **11:00 Uhr:** MINI-KIDS (50m-1200m-500m)
- **11:30 Uhr:** KIDS (200m-4000m-1500m)
- **17:30 Uhr:** 7 KM Lauf

### Sonntag, 20. September:
- **09:00 Uhr:** Sprint-Triathlon - 500m Schwimmen, 20km Radfahren, 5km Laufen
- **13:30 Uhr:** Olympischer Triathlon - 1,5km Schwimmen, 45km Radfahren, 10km Laufen

## 🏊 Half Ironman (L) - Samstag

**Distanz:** 1,9 km Schwimmen + 85 km Radfahren + 21 km Laufen  
**Start:** 09:30 Uhr  
**D+:** 950m beim Radfahren

## 📍 Standort

**Ort:** Lac de Madine, Nonsard-Lamarche  
**Region:** Grand Est, Frankreich

## 📧 Kontakt

**E-Mail:** hello@lightontri.com  
**Tel:** +33 6 37 08 97 57  
**Web:** [lightontri.com](https://www.lightontri.com)

Der perfekte Saisonabschluss von LIGHT ON TRI 2026! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Nonsard-Lamarche",
      metaTitle: "Light On Tri Madine 2026 | Half Ironman & Triathlon",
      metaDescription:
        "Light On Tri Madine 2026: Half Ironman, Olympisch, Sprint + Kids. 19-20 September am Lac de Madine, Frankreich.",
    },
    {
      language: "it",
      title: "Light On Tri Madine 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Madine 2026

Segnate la data: **19 e 20 settembre**! Unitevi a noi per celebrare la chiusura di **LIGHT ON TRI 2026** con il **Light On Tri Madine***! Situato vicino a Nancy e Metz, nella regione della Lorena, Francia.

**La distanza lunga (L/Half Ironman) sarà sabato!**

## 📅 Programma

### Sabato 19 Settembre:
- **09:30:** Triathlon L (Half Ironman) - 1,9km nuoto, 85km ciclismo, 21km corsa
- **11:00:** MINI-KIDS (50m-1200m-500m)
- **11:30:** KIDS (200m-4000m-1500m)
- **17:30:** Corsa 7 KM

### Domenica 20 Settembre:
- **09:00:** Triathlon Sprint - 500m nuoto, 20km ciclismo, 5km corsa
- **13:30:** Triathlon Olimpico - 1,5km nuoto, 45km ciclismo, 10km corsa

## 🏊 Half Ironman (L) - Sabato

**Distanza:** 1,9 km nuoto + 85 km ciclismo + 21 km corsa  
**Partenza:** 09:30  
**D+:** 950m nel ciclismo

## 📍 Posizione

**Luogo:** Lac de Madine, Nonsard-Lamarche  
**Regione:** Grand Est, Francia

## 📧 Contatto

**Email:** hello@lightontri.com  
**Tel:** +33 6 37 08 97 57  
**Web:** [lightontri.com](https://www.lightontri.com)

La chiusura perfetta della stagione LIGHT ON TRI 2026! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Nonsard-Lamarche",
      metaTitle: "Light On Tri Madine 2026 | Half Ironman e Triathlon",
      metaDescription:
        "Light On Tri Madine 2026: Half Ironman, Olimpico, Sprint + Kids. 19-20 settembre al Lac de Madine, Francia.",
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

  // Step 3: Create variants (Sprint, Olympic, Half Ironman, Kids, Run)
  const variants = [
    {
      name: "Triathlon Sprint (S) - Individual",
      distanceKm: null,
      price: 0.0,
      startTime: "09:00",
      day: "Domingo, 20 de Setembro",
      triathlonSegments: [
        {
          segmentType: "SWIM" as const,
          distanceKm: 0.5,
          terrainType: "OPEN_WATER" as const,
          order: 1,
        },
        {
          segmentType: "BIKE" as const,
          distanceKm: 20,
          terrainType: "ROAD" as const,
          order: 2,
        },
        {
          segmentType: "RUN" as const,
          distanceKm: 5,
          terrainType: "ROAD" as const,
          order: 3,
        },
      ],
    },
    {
      name: "Triathlon Olímpico (M) - Individual",
      distanceKm: null,
      price: 0.0,
      startTime: "13:30",
      day: "Domingo, 20 de Setembro",
      triathlonSegments: [
        {
          segmentType: "SWIM" as const,
          distanceKm: 1.5,
          terrainType: "OPEN_WATER" as const,
          order: 1,
        },
        {
          segmentType: "BIKE" as const,
          distanceKm: 45,
          terrainType: "ROAD" as const,
          order: 2,
        },
        {
          segmentType: "RUN" as const,
          distanceKm: 10,
          terrainType: "MIXED" as const,
          order: 3,
        },
      ],
    },
    {
      name: "Triathlon Longo (L) - Half Ironman",
      distanceKm: null,
      price: 0.0,
      startTime: "09:30",
      day: "Sábado, 19 de Setembro",
      triathlonSegments: [
        {
          segmentType: "SWIM" as const,
          distanceKm: 1.9,
          terrainType: "OPEN_WATER" as const,
          order: 1,
        },
        {
          segmentType: "BIKE" as const,
          distanceKm: 85,
          terrainType: "ROAD" as const,
          order: 2,
        },
        {
          segmentType: "RUN" as const,
          distanceKm: 21,
          terrainType: "MIXED" as const,
          order: 3,
        },
      ],
    },
    {
      name: "MINI-KIDS (6-9 anos)",
      distanceKm: null,
      price: 0.0,
      startTime: "11:00",
      day: "Sábado, 19 de Setembro",
      triathlonSegments: [
        {
          segmentType: "SWIM" as const,
          distanceKm: 0.05,
          terrainType: "OPEN_WATER" as const,
          order: 1,
        },
        {
          segmentType: "BIKE" as const,
          distanceKm: 1.2,
          terrainType: "ROAD" as const,
          order: 2,
        },
        {
          segmentType: "RUN" as const,
          distanceKm: 0.5,
          terrainType: "ROAD" as const,
          order: 3,
        },
      ],
    },
    {
      name: "KIDS (10-13 anos)",
      distanceKm: null,
      price: 0.0,
      startTime: "11:30",
      day: "Sábado, 19 de Setembro",
      triathlonSegments: [
        {
          segmentType: "SWIM" as const,
          distanceKm: 0.2,
          terrainType: "OPEN_WATER" as const,
          order: 1,
        },
        {
          segmentType: "BIKE" as const,
          distanceKm: 4,
          terrainType: "ROAD" as const,
          order: 2,
        },
        {
          segmentType: "RUN" as const,
          distanceKm: 1.5,
          terrainType: "ROAD" as const,
          order: 3,
        },
      ],
    },
    {
      name: "Corrida 7 KM",
      distanceKm: 7,
      price: 0.0,
      startTime: "17:30",
      day: "Sábado, 19 de Setembro",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    if (existing) {
      // Delete existing segments before update
      await prisma.triathlonSegment.deleteMany({
        where: { variantId: existing.id },
      });

      // Update variant
      const variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });

      // Create new segments if they exist
      if (variantData.triathlonSegments) {
        for (const segment of variantData.triathlonSegments) {
          await prisma.triathlonSegment.create({
            data: {
              variantId: variant.id,
              segmentType: segment.segmentType,
              distanceKm: segment.distanceKm,
              terrainType: segment.terrainType,
              order: segment.order,
            },
          });
        }
      }

      console.log(`✅ Variant updated: ${variant.name}`);
    } else {
      // Create new variant
      const variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });

      // Create segments if they exist
      if (variantData.triathlonSegments) {
        for (const segment of variantData.triathlonSegments) {
          await prisma.triathlonSegment.create({
            data: {
              variantId: variant.id,
              segmentType: segment.segmentType,
              distanceKm: segment.distanceKm,
              terrainType: segment.terrainType,
              order: segment.order,
            },
          });
        }
      }

      console.log(`✅ Variant created: ${variant.name}`);
    }
  }

  console.log("");
  console.log("🎉 Light On Tri Madine 2026 seeded successfully!");
  console.log("📍 Event location: Lac de Madine, Nonsard-Lamarche, France");
  console.log("📅 Dates: September 19-20, 2026");
  console.log("🏊 Includes: Half Ironman, Olympic, Sprint, Kids + 7km Run");
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
