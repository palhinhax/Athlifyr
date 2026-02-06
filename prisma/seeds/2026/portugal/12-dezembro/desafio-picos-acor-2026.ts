/**
 * Seed Desafio Picos do Açor 2026
 * Complete with translations in all 6 languages
 * Trail running event in Serra do Açor, Arganil, Portugal
 * Organized by Evolução Vertical
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Desafio Picos do Açor 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "desafio-picos-acor-2026" },
    update: {
      title: "Desafio Picos do Açor 2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**Uma aventura épica pela Serra do Açor!**

O Desafio Picos do Açor é um evento de Trail Running organizado pela Evolução Vertical que percorre a Serra do Açor, passando por várias aldeias do Concelho de Arganil. Com a colaboração da Câmara Municipal de Arganil e das Juntas de Freguesia de Arganil e Folques.

### 🏃 As Provas

**Desafio Picos do Açor 32km** - O desafio principal
- Distância: 32 km
- Desnível positivo: 2000 D+
- Tempo limite: 8 horas
- Idade mínima: 20 anos

**Desafio Picos do Açor 18km** - Percurso intermédio
- Distância: 18 km
- Desnível positivo: 1000 D+
- Tempo limite: 6 horas
- Idade mínima: 18 anos

**Desafio Picos do Açor 13km** - Prova curta
- Distância: 13 km
- Desnível positivo: 550 D+
- Tempo limite: 6 horas
- Idade mínima: 16 anos

**Caminhada do Açor 13km** - Para todos
- Distância: 13 km
- Desnível positivo: 350 D+
- Tempo limite: 6 horas
- Aberta a todos

**Açor Trail Kids** - Para os mais jovens
- Dos 6 aos 15 anos
- Com autorização parental
- Regulamento próprio

### 🎒 Material Obrigatório

**32km e 18km:**
- 📱 Telemóvel operacional
- 🧥 Corta-vento
- 🔔 Apito
- 💧 Reservatório de água
- 🧊 Manta de sobrevivência
- 🥤 Copo

**13km:**
- 📱 Telemóvel operacional
- 🧥 Corta-vento
- 🔔 Apito
- 💧 Reservatório de água
- 🧊 Manta de sobrevivência (recomendado)
- 🥤 Copo (recomendado)

⚠️ A organização não disponibiliza copos nos abastecimentos.

### 📅 Programa

**Sexta, 12 Dezembro 2026:**
- 19h00-21h00 - Secretariado (Cerâmica Arganilense)

**Sábado, 13 Dezembro 2026:**
- 14h00-21h00 - Secretariado (Cerâmica Arganilense)
- 16h00 - Açor Trail Kids
- 19h00 - Briefing Desafio Picos do Açor

**Domingo, 14 Dezembro 2026:**
- 06h00-10h00 - Secretariado (Cerâmica Arganilense)
- 08h00 - Partida Desafio Picos do Açor 32km
- 08h30 - Partida Caminhada do Açor 13km
- 09h30 - Partida Desafio Picos do Açor 18km
- 10h00 - Partida Desafio Picos do Açor 13km
- 14h30 - Cerimónia de Entrega de Prémios
- 19h00 - Encerramento do Evento

### 🎁 Kit de Participante

- Dorsal personalizado
- T-shirt técnica
- Duche final
- Prémio finisher
- Abastecimentos de sólidos e líquidos
- Cronometragem eletrónica
- Registo fotográfico
- Brinde(s) alusivo(s) à prova
- Seguro desportivo
- Transporte para a meta em caso de desistência
- Assistência médica
- Equipa de busca e salvamento

### 🏆 Prémios

**32km - Prize Money:**
- 🥇 1º Classificado M/F: 300€
- 🥈 2º Classificado M/F: 200€
- 🥉 3º Classificado M/F: 100€

**18km - Prize Money:**
- 🥇 1º Classificado M/F: 150€
- 🥈 2º Classificado M/F: 100€
- 🥉 3º Classificado M/F: 75€

**13km - Prize Money:**
- 🥇 1º Classificado M/F: 75€
- 🥈 2º Classificado M/F: 50€
- 🥉 3º Classificado M/F: 30€

Troféus para os 3 primeiros de cada escalão em todas as provas.

### 📍 Local

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Alojamento

Solo duro disponível no Pavilhão Desportivo da Escola Básica 2.3 de Arganil (3€).

### 🚿 Banhos

Disponíveis na Piscina Municipal de Arganil e no Pavilhão Desportivo.

### 🌿 Responsabilidade Ambiental

O atleta é responsável pelo transporte dos seus resíduos. Não abandonar lixo na natureza!

📧 **Contacto:** desafiopicosacor@gmail.com
📱 **Facebook:** https://www.facebook.com/PicosdoAcor/
📷 **Instagram:** https://www.instagram.com/desafiopicosdoacor/`,
      startDate: new Date("2026-12-14T08:00:00Z"),
      endDate: new Date("2026-12-14T19:00:00Z"),
      registrationDeadline: new Date("2026-12-01T23:59:59Z"),
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      city: "Arganil",
      country: "Portugal",
      latitude: 40.219648,
      longitude: -8.063238,
      externalUrl: "https://stopandgo.net/events",
      imageUrl: "",
    },
    create: {
      title: "Desafio Picos do Açor 2026",
      slug: "desafio-picos-acor-2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**Uma aventura épica pela Serra do Açor!**

O Desafio Picos do Açor é um evento de Trail Running organizado pela Evolução Vertical que percorre a Serra do Açor, passando por várias aldeias do Concelho de Arganil. Com a colaboração da Câmara Municipal de Arganil e das Juntas de Freguesia de Arganil e Folques.

### 🏃 As Provas

**Desafio Picos do Açor 32km** - O desafio principal
- Distância: 32 km
- Desnível positivo: 2000 D+
- Tempo limite: 8 horas
- Idade mínima: 20 anos

**Desafio Picos do Açor 18km** - Percurso intermédio
- Distância: 18 km
- Desnível positivo: 1000 D+
- Tempo limite: 6 horas
- Idade mínima: 18 anos

**Desafio Picos do Açor 13km** - Prova curta
- Distância: 13 km
- Desnível positivo: 550 D+
- Tempo limite: 6 horas
- Idade mínima: 16 anos

**Caminhada do Açor 13km** - Para todos
- Distância: 13 km
- Desnível positivo: 350 D+
- Tempo limite: 6 horas
- Aberta a todos

**Açor Trail Kids** - Para os mais jovens
- Dos 6 aos 15 anos
- Com autorização parental
- Regulamento próprio

### 🎒 Material Obrigatório

**32km e 18km:**
- 📱 Telemóvel operacional
- 🧥 Corta-vento
- 🔔 Apito
- 💧 Reservatório de água
- 🧊 Manta de sobrevivência
- 🥤 Copo

**13km:**
- 📱 Telemóvel operacional
- 🧥 Corta-vento
- 🔔 Apito
- 💧 Reservatório de água
- 🧊 Manta de sobrevivência (recomendado)
- 🥤 Copo (recomendado)

⚠️ A organização não disponibiliza copos nos abastecimentos.

### 📅 Programa

**Sexta, 12 Dezembro 2026:**
- 19h00-21h00 - Secretariado (Cerâmica Arganilense)

**Sábado, 13 Dezembro 2026:**
- 14h00-21h00 - Secretariado (Cerâmica Arganilense)
- 16h00 - Açor Trail Kids
- 19h00 - Briefing Desafio Picos do Açor

**Domingo, 14 Dezembro 2026:**
- 06h00-10h00 - Secretariado (Cerâmica Arganilense)
- 08h00 - Partida Desafio Picos do Açor 32km
- 08h30 - Partida Caminhada do Açor 13km
- 09h30 - Partida Desafio Picos do Açor 18km
- 10h00 - Partida Desafio Picos do Açor 13km
- 14h30 - Cerimónia de Entrega de Prémios
- 19h00 - Encerramento do Evento

### 🎁 Kit de Participante

- Dorsal personalizado
- T-shirt técnica
- Duche final
- Prémio finisher
- Abastecimentos de sólidos e líquidos
- Cronometragem eletrónica
- Registo fotográfico
- Brinde(s) alusivo(s) à prova
- Seguro desportivo
- Transporte para a meta em caso de desistência
- Assistência médica
- Equipa de busca e salvamento

### 🏆 Prémios

**32km - Prize Money:**
- 🥇 1º Classificado M/F: 300€
- 🥈 2º Classificado M/F: 200€
- 🥉 3º Classificado M/F: 100€

**18km - Prize Money:**
- 🥇 1º Classificado M/F: 150€
- 🥈 2º Classificado M/F: 100€
- 🥉 3º Classificado M/F: 75€

**13km - Prize Money:**
- 🥇 1º Classificado M/F: 75€
- 🥈 2º Classificado M/F: 50€
- 🥉 3º Classificado M/F: 30€

Troféus para os 3 primeiros de cada escalão em todas as provas.

### 📍 Local

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Alojamento

Solo duro disponível no Pavilhão Desportivo da Escola Básica 2.3 de Arganil (3€).

### 🚿 Banhos

Disponíveis na Piscina Municipal de Arganil e no Pavilhão Desportivo.

### 🌿 Responsabilidade Ambiental

O atleta é responsável pelo transporte dos seus resíduos. Não abandonar lixo na natureza!

📧 **Contacto:** desafiopicosacor@gmail.com
📱 **Facebook:** https://www.facebook.com/PicosdoAcor/
📷 **Instagram:** https://www.instagram.com/desafiopicosdoacor/`,
      startDate: new Date("2026-12-14T08:00:00Z"),
      endDate: new Date("2026-12-14T19:00:00Z"),
      registrationDeadline: new Date("2026-12-01T23:59:59Z"),
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      city: "Arganil",
      country: "Portugal",
      latitude: 40.219648,
      longitude: -8.063238,
      externalUrl: "https://stopandgo.net/events",
      imageUrl: "",
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Step 2: Upsert translations for all 6 languages
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "Desafio Picos do Açor 2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**Uma aventura épica pela Serra do Açor!**

O Desafio Picos do Açor é um evento de Trail Running organizado pela Evolução Vertical que percorre a Serra do Açor, passando por várias aldeias do Concelho de Arganil. Com a colaboração da Câmara Municipal de Arganil e das Juntas de Freguesia de Arganil e Folques.

### 🏃 As Provas

**Desafio Picos do Açor 32km** - O desafio principal
- Distância: 32 km
- Desnível positivo: 2000 D+
- Tempo limite: 8 horas
- Idade mínima: 20 anos

**Desafio Picos do Açor 18km** - Percurso intermédio
- Distância: 18 km
- Desnível positivo: 1000 D+
- Tempo limite: 6 horas
- Idade mínima: 18 anos

**Desafio Picos do Açor 13km** - Prova curta
- Distância: 13 km
- Desnível positivo: 550 D+
- Tempo limite: 6 horas
- Idade mínima: 16 anos

**Caminhada do Açor 13km** - Para todos
- Distância: 13 km
- Desnível positivo: 350 D+
- Tempo limite: 6 horas
- Aberta a todos

**Açor Trail Kids** - Para os mais jovens
- Dos 6 aos 15 anos
- Com autorização parental
- Regulamento próprio

### 🎒 Material Obrigatório

**32km e 18km:**
- 📱 Telemóvel operacional
- 🧥 Corta-vento
- 🔔 Apito
- 💧 Reservatório de água
- 🧊 Manta de sobrevivência
- 🥤 Copo

**13km:**
- 📱 Telemóvel operacional
- 🧥 Corta-vento
- 🔔 Apito
- 💧 Reservatório de água
- 🧊 Manta de sobrevivência (recomendado)
- 🥤 Copo (recomendado)

⚠️ A organização não disponibiliza copos nos abastecimentos.

### 📅 Programa

**Sexta, 12 Dezembro 2026:**
- 19h00-21h00 - Secretariado (Cerâmica Arganilense)

**Sábado, 13 Dezembro 2026:**
- 14h00-21h00 - Secretariado (Cerâmica Arganilense)
- 16h00 - Açor Trail Kids
- 19h00 - Briefing Desafio Picos do Açor

**Domingo, 14 Dezembro 2026:**
- 06h00-10h00 - Secretariado (Cerâmica Arganilense)
- 08h00 - Partida Desafio Picos do Açor 32km
- 08h30 - Partida Caminhada do Açor 13km
- 09h30 - Partida Desafio Picos do Açor 18km
- 10h00 - Partida Desafio Picos do Açor 13km
- 14h30 - Cerimónia de Entrega de Prémios
- 19h00 - Encerramento do Evento

### 🎁 Kit de Participante

- Dorsal personalizado
- T-shirt técnica
- Duche final
- Prémio finisher
- Abastecimentos de sólidos e líquidos
- Cronometragem eletrónica
- Registo fotográfico
- Brinde(s) alusivo(s) à prova
- Seguro desportivo
- Transporte para a meta em caso de desistência
- Assistência médica
- Equipa de busca e salvamento

### 🏆 Prémios

**32km - Prize Money:**
- 🥇 1º Classificado M/F: 300€
- 🥈 2º Classificado M/F: 200€
- 🥉 3º Classificado M/F: 100€

**18km - Prize Money:**
- 🥇 1º Classificado M/F: 150€
- 🥈 2º Classificado M/F: 100€
- 🥉 3º Classificado M/F: 75€

**13km - Prize Money:**
- 🥇 1º Classificado M/F: 75€
- 🥈 2º Classificado M/F: 50€
- 🥉 3º Classificado M/F: 30€

Troféus para os 3 primeiros de cada escalão em todas as provas.

### 📍 Local

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Alojamento

Solo duro disponível no Pavilhão Desportivo da Escola Básica 2.3 de Arganil (3€).

### 🚿 Banhos

Disponíveis na Piscina Municipal de Arganil e no Pavilhão Desportivo.

### 🌿 Responsabilidade Ambiental

O atleta é responsável pelo transporte dos seus resíduos. Não abandonar lixo na natureza!`,
      city: "Arganil",
      metaTitle:
        "Desafio Picos do Açor 2026 | Serra do Açor, Arganil | 12-14 Dezembro",
      metaDescription:
        "Desafio Picos do Açor 2026 - 12 a 14 de dezembro na Serra do Açor, Arganil. Provas: Trail 32km (2000D+), 18km (1000D+), 13km (550D+), Caminhada 13km e Trail Kids. Organizado pela Evolução Vertical.",
    },
    en: {
      title: "Desafio Picos do Açor 2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**An epic adventure through Serra do Açor!**

Desafio Picos do Açor is a Trail Running event organized by Evolução Vertical that traverses Serra do Açor, passing through several villages in the Arganil Municipality. With collaboration from Arganil City Council and the Parish Councils of Arganil and Folques.

### 🏃 The Races

**Desafio Picos do Açor 32km** - The main challenge
- Distance: 32 km
- Elevation gain: 2000 D+
- Time limit: 8 hours
- Minimum age: 20 years

**Desafio Picos do Açor 18km** - Intermediate course
- Distance: 18 km
- Elevation gain: 1000 D+
- Time limit: 6 hours
- Minimum age: 18 years

**Desafio Picos do Açor 13km** - Short race
- Distance: 13 km
- Elevation gain: 550 D+
- Time limit: 6 hours
- Minimum age: 16 years

**Caminhada do Açor 13km** - For everyone
- Distance: 13 km
- Elevation gain: 350 D+
- Time limit: 6 hours
- Open to all

**Açor Trail Kids** - For the youngest
- Ages 6 to 15
- With parental authorization
- Separate regulations

### 🎒 Mandatory Equipment

**32km and 18km:**
- 📱 Operational mobile phone
- 🧥 Windbreaker
- 🔔 Whistle
- 💧 Water reservoir
- 🧊 Survival blanket
- 🥤 Cup

**13km:**
- 📱 Operational mobile phone
- 🧥 Windbreaker
- 🔔 Whistle
- 💧 Water reservoir
- 🧊 Survival blanket (recommended)
- 🥤 Cup (recommended)

⚠️ The organization does not provide cups at aid stations.

### 📅 Schedule

**Friday, December 12, 2026:**
- 7:00 PM-9:00 PM - Registration (Cerâmica Arganilense)

**Saturday, December 13, 2026:**
- 2:00 PM-9:00 PM - Registration (Cerâmica Arganilense)
- 4:00 PM - Açor Trail Kids
- 7:00 PM - Desafio Picos do Açor Briefing

**Sunday, December 14, 2026:**
- 6:00 AM-10:00 AM - Registration (Cerâmica Arganilense)
- 8:00 AM - Start Desafio Picos do Açor 32km
- 8:30 AM - Start Caminhada do Açor 13km
- 9:30 AM - Start Desafio Picos do Açor 18km
- 10:00 AM - Start Desafio Picos do Açor 13km
- 2:30 PM - Awards Ceremony
- 7:00 PM - Event Closing

### 🎁 Participant Kit

- Personalized bib
- Technical t-shirt
- Final shower
- Finisher prize
- Solid and liquid refreshments
- Electronic timing
- Photo coverage
- Event souvenirs
- Sports insurance
- Transport to finish in case of withdrawal
- Medical assistance
- Search and rescue team

### 🏆 Prizes

**32km - Prize Money:**
- 🥇 1st Place M/F: €300
- 🥈 2nd Place M/F: €200
- 🥉 3rd Place M/F: €100

**18km - Prize Money:**
- 🥇 1st Place M/F: €150
- 🥈 2nd Place M/F: €100
- 🥉 3rd Place M/F: €75

**13km - Prize Money:**
- 🥇 1st Place M/F: €75
- 🥈 2nd Place M/F: €50
- 🥉 3rd Place M/F: €30

Trophies for top 3 in each age group for all races.

### 📍 Location

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Accommodation

Floor sleeping available at the Sports Pavilion of Escola Básica 2.3 de Arganil (€3).

### 🚿 Showers

Available at Arganil Municipal Pool and Sports Pavilion.

### 🌿 Environmental Responsibility

Athletes are responsible for carrying their waste. Do not leave trash in nature!`,
      city: "Arganil",
      metaTitle:
        "Desafio Picos do Açor 2026 | Serra do Açor, Arganil | December 12-14",
      metaDescription:
        "Desafio Picos do Açor 2026 - December 12-14 in Serra do Açor, Arganil. Races: Trail 32km (2000D+), 18km (1000D+), 13km (550D+), Walk 13km and Trail Kids. Organized by Evolução Vertical.",
    },
    es: {
      title: "Desafio Picos do Açor 2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**¡Una aventura épica por la Serra do Açor!**

El Desafio Picos do Açor es un evento de Trail Running organizado por Evolução Vertical que recorre la Serra do Açor, pasando por varias aldeas del Municipio de Arganil. Con la colaboración del Ayuntamiento de Arganil y las Juntas de Freguesia de Arganil y Folques.

### 🏃 Las Carreras

**Desafio Picos do Açor 32km** - El desafío principal
- Distancia: 32 km
- Desnivel positivo: 2000 D+
- Tiempo límite: 8 horas
- Edad mínima: 20 años

**Desafio Picos do Açor 18km** - Recorrido intermedio
- Distancia: 18 km
- Desnivel positivo: 1000 D+
- Tiempo límite: 6 horas
- Edad mínima: 18 años

**Desafio Picos do Açor 13km** - Carrera corta
- Distancia: 13 km
- Desnivel positivo: 550 D+
- Tiempo límite: 6 horas
- Edad mínima: 16 años

**Caminhada do Açor 13km** - Para todos
- Distancia: 13 km
- Desnivel positivo: 350 D+
- Tiempo límite: 6 horas
- Abierta a todos

**Açor Trail Kids** - Para los más jóvenes
- De 6 a 15 años
- Con autorización parental
- Reglamento propio

### 🎒 Material Obligatorio

**32km y 18km:**
- 📱 Teléfono móvil operativo
- 🧥 Cortavientos
- 🔔 Silbato
- 💧 Depósito de agua
- 🧊 Manta de supervivencia
- 🥤 Vaso

**13km:**
- 📱 Teléfono móvil operativo
- 🧥 Cortavientos
- 🔔 Silbato
- 💧 Depósito de agua
- 🧊 Manta de supervivencia (recomendado)
- 🥤 Vaso (recomendado)

⚠️ La organización no proporciona vasos en los avituallamientos.

### 📅 Programa

**Viernes, 12 Diciembre 2026:**
- 19h00-21h00 - Secretaría (Cerâmica Arganilense)

**Sábado, 13 Diciembre 2026:**
- 14h00-21h00 - Secretaría (Cerâmica Arganilense)
- 16h00 - Açor Trail Kids
- 19h00 - Briefing Desafio Picos do Açor

**Domingo, 14 Diciembre 2026:**
- 06h00-10h00 - Secretaría (Cerâmica Arganilense)
- 08h00 - Salida Desafio Picos do Açor 32km
- 08h30 - Salida Caminhada do Açor 13km
- 09h30 - Salida Desafio Picos do Açor 18km
- 10h00 - Salida Desafio Picos do Açor 13km
- 14h30 - Ceremonia de Entrega de Premios
- 19h00 - Cierre del Evento

### 🎁 Kit del Participante

- Dorsal personalizado
- Camiseta técnica
- Ducha final
- Premio finisher
- Avituallamientos sólidos y líquidos
- Cronometraje electrónico
- Cobertura fotográfica
- Recuerdos del evento
- Seguro deportivo
- Transporte a meta en caso de abandono
- Asistencia médica
- Equipo de búsqueda y rescate

### 🏆 Premios

**32km - Prize Money:**
- 🥇 1º Clasificado M/F: 300€
- 🥈 2º Clasificado M/F: 200€
- 🥉 3º Clasificado M/F: 100€

**18km - Prize Money:**
- 🥇 1º Clasificado M/F: 150€
- 🥈 2º Clasificado M/F: 100€
- 🥉 3º Clasificado M/F: 75€

**13km - Prize Money:**
- 🥇 1º Clasificado M/F: 75€
- 🥈 2º Clasificado M/F: 50€
- 🥉 3º Clasificado M/F: 30€

Trofeos para los 3 primeros de cada categoría en todas las carreras.

### 📍 Ubicación

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Alojamiento

Suelo duro disponible en el Pabellón Deportivo de la Escola Básica 2.3 de Arganil (3€).

### 🚿 Duchas

Disponibles en la Piscina Municipal de Arganil y en el Pabellón Deportivo.

### 🌿 Responsabilidad Ambiental

El atleta es responsable de transportar sus residuos. ¡No abandones basura en la naturaleza!`,
      city: "Arganil",
      metaTitle:
        "Desafio Picos do Açor 2026 | Serra do Açor, Arganil | 12-14 Diciembre",
      metaDescription:
        "Desafio Picos do Açor 2026 - 12 a 14 de diciembre en Serra do Açor, Arganil. Carreras: Trail 32km (2000D+), 18km (1000D+), 13km (550D+), Caminata 13km y Trail Kids. Organizado por Evolução Vertical.",
    },
    fr: {
      title: "Desafio Picos do Açor 2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**Une aventure épique à travers la Serra do Açor !**

Le Desafio Picos do Açor est un événement de Trail Running organisé par Evolução Vertical qui traverse la Serra do Açor, passant par plusieurs villages de la municipalité d'Arganil. Avec la collaboration de la mairie d'Arganil et des conseils paroissiaux d'Arganil et Folques.

### 🏃 Les Courses

**Desafio Picos do Açor 32km** - Le défi principal
- Distance : 32 km
- Dénivelé positif : 2000 D+
- Limite de temps : 8 heures
- Âge minimum : 20 ans

**Desafio Picos do Açor 18km** - Parcours intermédiaire
- Distance : 18 km
- Dénivelé positif : 1000 D+
- Limite de temps : 6 heures
- Âge minimum : 18 ans

**Desafio Picos do Açor 13km** - Course courte
- Distance : 13 km
- Dénivelé positif : 550 D+
- Limite de temps : 6 heures
- Âge minimum : 16 ans

**Caminhada do Açor 13km** - Pour tous
- Distance : 13 km
- Dénivelé positif : 350 D+
- Limite de temps : 6 heures
- Ouverte à tous

**Açor Trail Kids** - Pour les plus jeunes
- De 6 à 15 ans
- Avec autorisation parentale
- Règlement séparé

### 🎒 Équipement Obligatoire

**32km et 18km :**
- 📱 Téléphone portable opérationnel
- 🧥 Coupe-vent
- 🔔 Sifflet
- 💧 Réservoir d'eau
- 🧊 Couverture de survie
- 🥤 Gobelet

**13km :**
- 📱 Téléphone portable opérationnel
- 🧥 Coupe-vent
- 🔔 Sifflet
- 💧 Réservoir d'eau
- 🧊 Couverture de survie (recommandé)
- 🥤 Gobelet (recommandé)

⚠️ L'organisation ne fournit pas de gobelets aux ravitaillements.

### 📅 Programme

**Vendredi 12 décembre 2026 :**
- 19h00-21h00 - Secrétariat (Cerâmica Arganilense)

**Samedi 13 décembre 2026 :**
- 14h00-21h00 - Secrétariat (Cerâmica Arganilense)
- 16h00 - Açor Trail Kids
- 19h00 - Briefing Desafio Picos do Açor

**Dimanche 14 décembre 2026 :**
- 06h00-10h00 - Secrétariat (Cerâmica Arganilense)
- 08h00 - Départ Desafio Picos do Açor 32km
- 08h30 - Départ Caminhada do Açor 13km
- 09h30 - Départ Desafio Picos do Açor 18km
- 10h00 - Départ Desafio Picos do Açor 13km
- 14h30 - Cérémonie de Remise des Prix
- 19h00 - Clôture de l'Événement

### 🎁 Kit du Participant

- Dossard personnalisé
- T-shirt technique
- Douche finale
- Prix finisher
- Ravitaillements solides et liquides
- Chronométrage électronique
- Couverture photo
- Souvenirs de l'événement
- Assurance sportive
- Transport vers l'arrivée en cas d'abandon
- Assistance médicale
- Équipe de recherche et sauvetage

### 🏆 Prix

**32km - Prize Money :**
- 🥇 1er Classé H/F : 300€
- 🥈 2ème Classé H/F : 200€
- 🥉 3ème Classé H/F : 100€

**18km - Prize Money :**
- 🥇 1er Classé H/F : 150€
- 🥈 2ème Classé H/F : 100€
- 🥉 3ème Classé H/F : 75€

**13km - Prize Money :**
- 🥇 1er Classé H/F : 75€
- 🥈 2ème Classé H/F : 50€
- 🥉 3ème Classé H/F : 30€

Trophées pour les 3 premiers de chaque catégorie d'âge pour toutes les courses.

### 📍 Lieu

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Hébergement

Couchage sur sol dur disponible au Pavillon Sportif de l'Escola Básica 2.3 de Arganil (3€).

### 🚿 Douches

Disponibles à la Piscine Municipale d'Arganil et au Pavillon Sportif.

### 🌿 Responsabilité Environnementale

L'athlète est responsable du transport de ses déchets. Ne laissez pas de détritus dans la nature !`,
      city: "Arganil",
      metaTitle:
        "Desafio Picos do Açor 2026 | Serra do Açor, Arganil | 12-14 Décembre",
      metaDescription:
        "Desafio Picos do Açor 2026 - 12 au 14 décembre à Serra do Açor, Arganil. Courses: Trail 32km (2000D+), 18km (1000D+), 13km (550D+), Randonnée 13km et Trail Kids. Organisé par Evolução Vertical.",
    },
    de: {
      title: "Desafio Picos do Açor 2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**Ein episches Abenteuer durch die Serra do Açor!**

Das Desafio Picos do Açor ist ein Trailrunning-Event, organisiert von Evolução Vertical, das durch die Serra do Açor führt und mehrere Dörfer der Gemeinde Arganil durchquert. Mit Unterstützung der Stadtverwaltung Arganil und der Gemeinderäte von Arganil und Folques.

### 🏃 Die Rennen

**Desafio Picos do Açor 32km** - Die Hauptherausforderung
- Entfernung: 32 km
- Höhenunterschied: 2000 D+
- Zeitlimit: 8 Stunden
- Mindestalter: 20 Jahre

**Desafio Picos do Açor 18km** - Mittlere Strecke
- Entfernung: 18 km
- Höhenunterschied: 1000 D+
- Zeitlimit: 6 Stunden
- Mindestalter: 18 Jahre

**Desafio Picos do Açor 13km** - Kurzes Rennen
- Entfernung: 13 km
- Höhenunterschied: 550 D+
- Zeitlimit: 6 Stunden
- Mindestalter: 16 Jahre

**Caminhada do Açor 13km** - Für alle
- Entfernung: 13 km
- Höhenunterschied: 350 D+
- Zeitlimit: 6 Stunden
- Offen für alle

**Açor Trail Kids** - Für die Jüngsten
- Von 6 bis 15 Jahren
- Mit elterlicher Genehmigung
- Eigenes Regelwerk

### 🎒 Pflichtausrüstung

**32km und 18km:**
- 📱 Funktionierendes Mobiltelefon
- 🧥 Windjacke
- 🔔 Pfeife
- 💧 Wasserbehälter
- 🧊 Rettungsdecke
- 🥤 Becher

**13km:**
- 📱 Funktionierendes Mobiltelefon
- 🧥 Windjacke
- 🔔 Pfeife
- 💧 Wasserbehälter
- 🧊 Rettungsdecke (empfohlen)
- 🥤 Becher (empfohlen)

⚠️ Die Organisation stellt keine Becher an den Verpflegungsstationen bereit.

### 📅 Programm

**Freitag, 12. Dezember 2026:**
- 19:00-21:00 - Anmeldung (Cerâmica Arganilense)

**Samstag, 13. Dezember 2026:**
- 14:00-21:00 - Anmeldung (Cerâmica Arganilense)
- 16:00 - Açor Trail Kids
- 19:00 - Briefing Desafio Picos do Açor

**Sonntag, 14. Dezember 2026:**
- 06:00-10:00 - Anmeldung (Cerâmica Arganilense)
- 08:00 - Start Desafio Picos do Açor 32km
- 08:30 - Start Caminhada do Açor 13km
- 09:30 - Start Desafio Picos do Açor 18km
- 10:00 - Start Desafio Picos do Açor 13km
- 14:30 - Siegerehrung
- 19:00 - Veranstaltungsende

### 🎁 Teilnehmerpaket

- Personalisierte Startnummer
- Technisches T-Shirt
- Abschließende Dusche
- Finisher-Preis
- Feste und flüssige Verpflegung
- Elektronische Zeitmessung
- Fotoberichterstattung
- Event-Souvenirs
- Sportversicherung
- Transport zum Ziel bei Aufgabe
- Medizinische Betreuung
- Such- und Rettungsteam

### 🏆 Preise

**32km - Preisgeld:**
- 🥇 1. Platz M/W: 300€
- 🥈 2. Platz M/W: 200€
- 🥉 3. Platz M/W: 100€

**18km - Preisgeld:**
- 🥇 1. Platz M/W: 150€
- 🥈 2. Platz M/W: 100€
- 🥉 3. Platz M/W: 75€

**13km - Preisgeld:**
- 🥇 1. Platz M/W: 75€
- 🥈 2. Platz M/W: 50€
- 🥉 3. Platz M/W: 30€

Pokale für die Top 3 in jeder Altersklasse bei allen Rennen.

### 📍 Ort

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Unterkunft

Übernachtung auf hartem Boden in der Sporthalle der Escola Básica 2.3 de Arganil verfügbar (3€).

### 🚿 Duschen

Verfügbar im Städtischen Schwimmbad Arganil und in der Sporthalle.

### 🌿 Umweltverantwortung

Athleten sind für den Transport ihrer Abfälle verantwortlich. Werfen Sie keinen Müll in die Natur!`,
      city: "Arganil",
      metaTitle:
        "Desafio Picos do Açor 2026 | Serra do Açor, Arganil | 12.-14. Dezember",
      metaDescription:
        "Desafio Picos do Açor 2026 - 12. bis 14. Dezember in Serra do Açor, Arganil. Rennen: Trail 32km (2000D+), 18km (1000D+), 13km (550D+), Wanderung 13km und Trail Kids. Organisiert von Evolução Vertical.",
    },
    it: {
      title: "Desafio Picos do Açor 2026",
      description: `## 🏔️ Desafio Picos do Açor 2026

**Un'avventura epica attraverso la Serra do Açor!**

Il Desafio Picos do Açor è un evento di Trail Running organizzato da Evolução Vertical che attraversa la Serra do Açor, passando per diversi villaggi del Comune di Arganil. Con la collaborazione del Comune di Arganil e dei Consigli Parrocchiali di Arganil e Folques.

### 🏃 Le Gare

**Desafio Picos do Açor 32km** - La sfida principale
- Distanza: 32 km
- Dislivello positivo: 2000 D+
- Tempo limite: 8 ore
- Età minima: 20 anni

**Desafio Picos do Açor 18km** - Percorso intermedio
- Distanza: 18 km
- Dislivello positivo: 1000 D+
- Tempo limite: 6 ore
- Età minima: 18 anni

**Desafio Picos do Açor 13km** - Gara corta
- Distanza: 13 km
- Dislivello positivo: 550 D+
- Tempo limite: 6 ore
- Età minima: 16 anni

**Caminhada do Açor 13km** - Per tutti
- Distanza: 13 km
- Dislivello positivo: 350 D+
- Tempo limite: 6 ore
- Aperta a tutti

**Açor Trail Kids** - Per i più giovani
- Da 6 a 15 anni
- Con autorizzazione dei genitori
- Regolamento separato

### 🎒 Attrezzatura Obbligatoria

**32km e 18km:**
- 📱 Telefono cellulare funzionante
- 🧥 Giacca antivento
- 🔔 Fischietto
- 💧 Serbatoio d'acqua
- 🧊 Coperta di sopravvivenza
- 🥤 Bicchiere

**13km:**
- 📱 Telefono cellulare funzionante
- 🧥 Giacca antivento
- 🔔 Fischietto
- 💧 Serbatoio d'acqua
- 🧊 Coperta di sopravvivenza (consigliato)
- 🥤 Bicchiere (consigliato)

⚠️ L'organizzazione non fornisce bicchieri ai ristori.

### 📅 Programma

**Venerdì 12 dicembre 2026:**
- 19:00-21:00 - Segreteria (Cerâmica Arganilense)

**Sabato 13 dicembre 2026:**
- 14:00-21:00 - Segreteria (Cerâmica Arganilense)
- 16:00 - Açor Trail Kids
- 19:00 - Briefing Desafio Picos do Açor

**Domenica 14 dicembre 2026:**
- 06:00-10:00 - Segreteria (Cerâmica Arganilense)
- 08:00 - Partenza Desafio Picos do Açor 32km
- 08:30 - Partenza Caminhada do Açor 13km
- 09:30 - Partenza Desafio Picos do Açor 18km
- 10:00 - Partenza Desafio Picos do Açor 13km
- 14:30 - Cerimonia di Premiazione
- 19:00 - Chiusura dell'Evento

### 🎁 Kit del Partecipante

- Pettorale personalizzato
- T-shirt tecnica
- Doccia finale
- Premio finisher
- Ristori solidi e liquidi
- Cronometraggio elettronico
- Copertura fotografica
- Souvenir dell'evento
- Assicurazione sportiva
- Trasporto al traguardo in caso di ritiro
- Assistenza medica
- Squadra di ricerca e soccorso

### 🏆 Premi

**32km - Prize Money:**
- 🥇 1° Classificato M/F: 300€
- 🥈 2° Classificato M/F: 200€
- 🥉 3° Classificato M/F: 100€

**18km - Prize Money:**
- 🥇 1° Classificato M/F: 150€
- 🥈 2° Classificato M/F: 100€
- 🥉 3° Classificato M/F: 75€

**13km - Prize Money:**
- 🥇 1° Classificato M/F: 75€
- 🥈 2° Classificato M/F: 50€
- 🥉 3° Classificato M/F: 30€

Trofei per i primi 3 di ogni categoria d'età per tutte le gare.

### 📍 Luogo

**Antiga Cerâmica Arganilense**
Rua Cidade do Rio de Janeiro, Sobreiral
3300-145 Arganil

### 🛏️ Alloggio

Pernottamento su pavimento duro disponibile al Padiglione Sportivo della Escola Básica 2.3 de Arganil (3€).

### 🚿 Docce

Disponibili presso la Piscina Comunale di Arganil e il Padiglione Sportivo.

### 🌿 Responsabilità Ambientale

Gli atleti sono responsabili del trasporto dei propri rifiuti. Non abbandonare spazzatura nella natura!`,
      city: "Arganil",
      metaTitle:
        "Desafio Picos do Açor 2026 | Serra do Açor, Arganil | 12-14 Dicembre",
      metaDescription:
        "Desafio Picos do Açor 2026 - 12-14 dicembre a Serra do Açor, Arganil. Gare: Trail 32km (2000D+), 18km (1000D+), 13km (550D+), Camminata 13km e Trail Kids. Organizzato da Evolução Vertical.",
    },
  };

  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Delete existing variants and pricing phases, then create new ones
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Create variants
  const desafio32km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Desafio Picos do Açor 32km",
      distanceKm: 32,
      elevationGainM: 2000,
      startTime: "08:00",
      cutoffTimeHours: 8.0,
    },
  });

  const desafio18km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Desafio Picos do Açor 18km",
      distanceKm: 18,
      elevationGainM: 1000,
      startTime: "09:30",
      cutoffTimeHours: 6.0,
    },
  });

  const desafio13km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Desafio Picos do Açor 13km",
      distanceKm: 13,
      elevationGainM: 550,
      startTime: "10:00",
      cutoffTimeHours: 6.0,
    },
  });

  const caminhada13km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada do Açor 13km",
      distanceKm: 13,
      elevationGainM: 350,
      startTime: "08:30",
      cutoffTimeHours: 6.0,
    },
  });

  const trailKids = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Açor Trail Kids",
      distanceKm: 2,
      elevationGainM: null,
      startTime: "16:00",
      cutoffTimeHours: null,
      startDate: new Date("2026-12-13T16:00:00Z"), // Saturday start
    },
  });

  const variants = [
    desafio32km,
    desafio18km,
    desafio13km,
    caminhada13km,
    trailKids,
  ];

  console.log("🏃 Variants created (5 variants)");

  // Step 4: Upsert variant translations
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "Desafio Picos do Açor 32km": {
      pt: {
        name: "Desafio Picos do Açor 32km",
        description:
          "Percurso de 32km com 2000m de desnível positivo. Tempo limite de 8 horas. Idade mínima: 20 anos.",
      },
      en: {
        name: "Desafio Picos do Açor 32km",
        description:
          "32km course with 2000m elevation gain. 8-hour time limit. Minimum age: 20 years.",
      },
      es: {
        name: "Desafio Picos do Açor 32km",
        description:
          "Recorrido de 32km con 2000m de desnivel positivo. Tiempo límite de 8 horas. Edad mínima: 20 años.",
      },
      fr: {
        name: "Desafio Picos do Açor 32km",
        description:
          "Parcours de 32km avec 2000m de dénivelé positif. Limite de 8 heures. Âge minimum : 20 ans.",
      },
      de: {
        name: "Desafio Picos do Açor 32km",
        description:
          "32km-Strecke mit 2000m Höhenunterschied. 8-Stunden-Limit. Mindestalter: 20 Jahre.",
      },
      it: {
        name: "Desafio Picos do Açor 32km",
        description:
          "Percorso di 32km con 2000m di dislivello positivo. Tempo limite di 8 ore. Età minima: 20 anni.",
      },
    },
    "Desafio Picos do Açor 18km": {
      pt: {
        name: "Desafio Picos do Açor 18km",
        description:
          "Percurso de 18km com 1000m de desnível positivo. Tempo limite de 6 horas. Idade mínima: 18 anos.",
      },
      en: {
        name: "Desafio Picos do Açor 18km",
        description:
          "18km course with 1000m elevation gain. 6-hour time limit. Minimum age: 18 years.",
      },
      es: {
        name: "Desafio Picos do Açor 18km",
        description:
          "Recorrido de 18km con 1000m de desnivel positivo. Tiempo límite de 6 horas. Edad mínima: 18 años.",
      },
      fr: {
        name: "Desafio Picos do Açor 18km",
        description:
          "Parcours de 18km avec 1000m de dénivelé positif. Limite de 6 heures. Âge minimum : 18 ans.",
      },
      de: {
        name: "Desafio Picos do Açor 18km",
        description:
          "18km-Strecke mit 1000m Höhenunterschied. 6-Stunden-Limit. Mindestalter: 18 Jahre.",
      },
      it: {
        name: "Desafio Picos do Açor 18km",
        description:
          "Percorso di 18km con 1000m di dislivello positivo. Tempo limite di 6 ore. Età minima: 18 anni.",
      },
    },
    "Desafio Picos do Açor 13km": {
      pt: {
        name: "Desafio Picos do Açor 13km",
        description:
          "Percurso de 13km com 550m de desnível positivo. Tempo limite de 6 horas. Idade mínima: 16 anos.",
      },
      en: {
        name: "Desafio Picos do Açor 13km",
        description:
          "13km course with 550m elevation gain. 6-hour time limit. Minimum age: 16 years.",
      },
      es: {
        name: "Desafio Picos do Açor 13km",
        description:
          "Recorrido de 13km con 550m de desnivel positivo. Tiempo límite de 6 horas. Edad mínima: 16 años.",
      },
      fr: {
        name: "Desafio Picos do Açor 13km",
        description:
          "Parcours de 13km avec 550m de dénivelé positif. Limite de 6 heures. Âge minimum : 16 ans.",
      },
      de: {
        name: "Desafio Picos do Açor 13km",
        description:
          "13km-Strecke mit 550m Höhenunterschied. 6-Stunden-Limit. Mindestalter: 16 Jahre.",
      },
      it: {
        name: "Desafio Picos do Açor 13km",
        description:
          "Percorso di 13km con 550m di dislivello positivo. Tempo limite di 6 ore. Età minima: 16 anni.",
      },
    },
    "Caminhada do Açor 13km": {
      pt: {
        name: "Caminhada do Açor 13km",
        description:
          "Caminhada de 13km com 350m de desnível positivo. Tempo limite de 6 horas. Aberta a todos.",
      },
      en: {
        name: "Açor Walk 13km",
        description:
          "13km walk with 350m elevation gain. 6-hour time limit. Open to all.",
      },
      es: {
        name: "Caminata do Açor 13km",
        description:
          "Caminata de 13km con 350m de desnivel positivo. Tiempo límite de 6 horas. Abierta a todos.",
      },
      fr: {
        name: "Randonnée do Açor 13km",
        description:
          "Randonnée de 13km avec 350m de dénivelé positif. Limite de 6 heures. Ouverte à tous.",
      },
      de: {
        name: "Açor Wanderung 13km",
        description:
          "13km-Wanderung mit 350m Höhenunterschied. 6-Stunden-Limit. Offen für alle.",
      },
      it: {
        name: "Camminata do Açor 13km",
        description:
          "Camminata di 13km con 350m di dislivello positivo. Tempo limite di 6 ore. Aperta a tutti.",
      },
    },
    "Açor Trail Kids": {
      pt: {
        name: "Açor Trail Kids",
        description:
          "Prova para jovens dos 6 aos 15 anos. Sábado às 16h00. Autorização parental obrigatória.",
      },
      en: {
        name: "Açor Trail Kids",
        description:
          "Race for youth aged 6 to 15. Saturday at 4:00 PM. Parental authorization required.",
      },
      es: {
        name: "Açor Trail Kids",
        description:
          "Carrera para jóvenes de 6 a 15 años. Sábado a las 16h00. Autorización parental obligatoria.",
      },
      fr: {
        name: "Açor Trail Kids",
        description:
          "Course pour les jeunes de 6 à 15 ans. Samedi à 16h00. Autorisation parentale obligatoire.",
      },
      de: {
        name: "Açor Trail Kids",
        description:
          "Rennen für Jugendliche von 6 bis 15 Jahren. Samstag um 16:00 Uhr. Elterliche Genehmigung erforderlich.",
      },
      it: {
        name: "Açor Trail Kids",
        description:
          "Gara per giovani da 6 a 15 anni. Sabato alle 16:00. Autorizzazione dei genitori obbligatoria.",
      },
    },
  };

  for (const variant of variants) {
    for (const lang of languages) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang,
          },
        },
        update: {
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
      });
    }
  }

  console.log("📝 Variant translations upserted for all 5 variants");

  // Step 5: Create pricing phases (linked to eventId)
  // Based on 2025 prices: 1 setembro - 1 dezembro
  // 32km: 35€, 18km: 22€, 13km: 16€, Caminhada: 14€

  // Desafio 32km - Single phase
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Desafio Picos do Açor 32km - Inscrição",
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-12-01T23:59:59Z"),
      price: 35.0,
      currency: Currency.EUR,
      discountPercent: null,
      note: "Inscrição para Desafio Picos do Açor 32km. Desconto de €1.50 para atletas filiados na ADAC.",
    },
  });

  // Desafio 18km - Single phase
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Desafio Picos do Açor 18km - Inscrição",
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-12-01T23:59:59Z"),
      price: 22.0,
      currency: Currency.EUR,
      discountPercent: null,
      note: "Inscrição para Desafio Picos do Açor 18km.",
    },
  });

  // Desafio 13km - Single phase
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Desafio Picos do Açor 13km - Inscrição",
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-12-01T23:59:59Z"),
      price: 16.0,
      currency: Currency.EUR,
      discountPercent: null,
      note: "Inscrição para Desafio Picos do Açor 13km.",
    },
  });

  // Caminhada 13km - Single phase
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Caminhada do Açor 13km - Inscrição",
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-12-01T23:59:59Z"),
      price: 14.0,
      currency: Currency.EUR,
      discountPercent: null,
      note: "Inscrição para Caminhada do Açor 13km.",
    },
  });

  // Açor Trail Kids - Free (not specified in regulations, assuming low cost or free)
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Açor Trail Kids - Inscrição",
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-12-01T23:59:59Z"),
      price: 5.0,
      currency: Currency.EUR,
      discountPercent: null,
      note: "Inscrição para Açor Trail Kids. Regulamento próprio disponível na plataforma de inscrições.",
    },
  });

  console.log("💰 Pricing phases created (5 phases for 5 variants)");
  console.log("\n🎉 Desafio Picos do Açor 2026 seed completed successfully!");
  console.log("📍 Location: Serra do Açor, Arganil, Portugal");
  console.log("📅 Date: December 12-14, 2026");
  console.log(
    "🏃 5 variants: Desafio 32km, Desafio 18km, Desafio 13km, Caminhada 13km, Trail Kids"
  );
  console.log("🏆 Prize Money: Up to €300 for 32km winners");
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
