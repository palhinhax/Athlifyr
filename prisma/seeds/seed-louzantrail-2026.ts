import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Louzantrail 2026...");

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "louzantrail-2026" },
  });

  if (existingEvent) {
    console.log("⚠️ Event already exists, deleting...");
    await prisma.pricingPhase.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Create the Louzantrail event
  const event = await prisma.event.create({
    data: {
      title: "Louzantrail 2026",
      slug: "louzantrail-2026",
      description: `**Trail Running na Serra da Lousã - 7 e 8 de Março 2026**

O Louzantrail regressa à Serra da Lousã com percursos deslumbrantes pelas famosas Aldeias do Xisto, organizado pela Secção de Trail Running do Montanha Clube.

🏔️ **Trail no Coração de Portugal**

Descobre estradas rurais, vales e zonas de montanha na Serra da Lousã, cruzando as aldeias que formam a rede das Aldeias do Xisto e ligando-te à cultura da região apresentada em cada recanto.

📅 **Programa Completo:**

**Sexta-feira, 6 Março:**
- **19h00-21h00:** Abertura do secretariado

**Sábado, 7 Março:**
- **07h10:** Controlo LZT Longo 32km
- **08h00:** Partida LZT Longo 32km
- **15h00:** Fecho de meta
- **15h30:** Cerimónia de pódios
- **16h00:** Trail Kids Benjamins A
- **16h10:** Trail Kids Benjamins B

**Domingo, 8 Março:**
- **08h10:** Controlo LZT Curto 20km
- **09h00:** Partida LZT Curto 20km
- **09h30:** Controlo LZT XS 13km
- **10h00:** Partida LZT XS 13km / Caminhada
- **14h00:** Fecho de meta
- **15h00:** Cerimónia de pódios

🏅 **Modalidades:**
- **LZT by Stages:** Desafio de 2 etapas (32km + 20km) para testar resistência e estratégia
- **LZT Longo 32km:** Prova técnica com 2100m D+ (Grau ATRP: 3)
- **LZT Curto 20km:** Percurso desafiante com 1100m D+ (Grau ATRP: 4)
- **LZT XS 13km:** Mini trail ou caminhada com 700m D+ (Grau ATRP: 3)
- **Trail Kids:** Escalões Benjamins A e B

📍 **Localizações:**
- **Secretariado:** Parque Municipal de Exposições da Lousã
- **Partidas:** Palácio da Lousã Boutique Hotel
- **Chegadas:** Parque Municipal de Exposições da Lousã
- **Cerimónias:** Parque Municipal de Exposições da Lousã

⏱️ **Limites de Tempo:**
- **LZT Longo 32km:** 7 horas (Barreira Letras: 3h30 / 11h30)
- **LZT Curto 20km:** 5 horas (Barreira Letras: 3h30 / 13h30)
- **LZT XS 13km:** 4 horas

🎒 **Material Obrigatório:**
- Dorsal visível ⚠️
- Apito ⚠️
- Telemóvel operacional ⚠️
- Manta térmica 140×200cm ⚠️

**Penalização:** 15 minutos por item em falta

📦 **Material Recomendado:**
- Copo ou caneca reutilizável
- Reservatório de água 1L
- Equipamento adequado às condições climatéricas

🍽️ **Abastecimentos:**
Prova em regime semi-autossuficiente com abastecimentos:
- **LZT Longo:** Letras, FA e Meta (sólidos + líquidos)
- **LZT Curto:** Casa do Guarda, Talasnal e Meta
- **LZT XS:** Casa do Guarda e Meta

🏆 **Prémios e Categorias:**
- Pódios para 3 primeiros classificados geral M/F
- Classificação por equipas (3 atletas por equipa)
- Escalões: Juvenil, Júnior, Sub23, Sénior, M/F 35, 40, 45, 50, 55, 60, 65, 70
- Prémio Finisher para todos os atletas

🎁 **Kit do Atleta Inclui:**
- Dorsal com chip de cronometragem
- Prémio Finisher
- Seguro de Acidentes Pessoais
- Mini refeição no final

💰 **Descontos Especiais:**
- **Atletas FPA/ADAC:** Desconto de 1,50€ no LZT Curto 20km
- **Atletas Elite:** Inscrições gratuitas (ITRA >825pts M / >700pts F)
- **Dorsal Solidário:** 100€ donativo garante vaga mesmo com inscrições esgotadas

⚠️ **Notas Importantes:**
- **Idade mínima:** 20 anos (LZT Longo/By Stages), 18 anos (LZT Curto), 16 anos (LZT XS)
- Percursos parcialmente abertos ao tráfego - respeitar regras de trânsito
- Proibido cortar caminho por atalhos
- Sistema de controlo eletrónico via chip
- Possibilidade de alteração de percursos por condições climatéricas
- Em caso de desistência, entregar chip no posto de controlo

🌱 **Eco-Responsabilidade:**
- Não abandonar lixo - utilizar contentores próprios
- Respeitar flora e fauna
- Seguir percurso balizado
- Organização privilegia materiais reutilizáveis/recicláveis

🚿 **Serviços Disponibilizados:**
- Transporte até à chegada em caso de abandono
- Posto Médico Avançado na zona de chegada
- Balneários com banhos

📞 **Contactos:**
- Email: louzantrail2000@gmail.com
- Facebook: @louzantrail
- Instagram: @louzantrail
- Website: www.stopandgo.com.pt

🏛️ **Organização:**
Montanha Clube - Secção de Trail Running`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-07T08:00:00Z"),
      endDate: new Date("2026-03-08T15:00:00Z"),
      registrationDeadline: new Date("2026-02-25T23:59:59Z"),
      city: "Lousã",
      country: "Portugal",
      externalUrl: "https://www.stopandgo.com.pt",
      imageUrl: "/events/louzantrail-2026.jpg",
      isFeatured: true,
      latitude: 40.1116,
      longitude: -8.2462,
      googleMapsUrl: "https://maps.app.goo.gl/lousa",

      // Event translations for SEO
      translations: {
        create: [
          {
            language: "en",
            title: "Louzantrail 2026",
            description: `**Trail Running in Serra da Lousã - March 7-8, 2026**

Louzantrail returns to Serra da Lousã with stunning routes through the famous Schist Villages, organized by Montanha Clube Trail Running Section.

🏔️ **Trail in the Heart of Portugal**

Discover rural roads, valleys and mountain areas in Serra da Lousã, crossing the villages that form the Schist Villages network and connecting with the region's culture presented in every corner.

**Complete Program:**
- Friday, March 6: Registration (19:00-21:00)
- Saturday, March 7: LZT Long 32km (08:00) + Trail Kids (16:00)
- Sunday, March 8: LZT Short 20km (09:00) + LZT XS 13km (10:00)

**Categories:** LZT by Stages (52km), LZT Long 32km, LZT Short 20km, LZT XS 13km, Trail Kids`,
            city: "Lousã",
            metaTitle:
              "Louzantrail 2026 - Trail Running Serra da Lousã | March 7-8",
            metaDescription:
              "Trail running event in Serra da Lousã, Portugal. 4 distances: 32km, 20km, 13km and Trail Kids. ATRP certified. Register now for Louzantrail 2026!",
          },
          {
            language: "es",
            title: "Louzantrail 2026",
            description: `**Trail Running en Serra da Lousã - 7-8 Marzo 2026**

Louzantrail regresa a Serra da Lousã con rutas impresionantes por las famosas Aldeas de Esquisto, organizado por la Sección de Trail Running del Montanha Clube.

🏔️ **Trail en el Corazón de Portugal**

Descubre caminos rurales, valles y zonas de montaña en Serra da Lousã, cruzando las aldeas que forman la red de Aldeas de Esquisto y conectando con la cultura de la región presentada en cada rincón.

**Programa Completo:**
- Viernes 6 Marzo: Inscripciones (19:00-21:00)
- Sábado 7 Marzo: LZT Largo 32km (08:00) + Trail Kids (16:00)
- Domingo 8 Marzo: LZT Corto 20km (09:00) + LZT XS 13km (10:00)

**Categorías:** LZT por Etapas (52km), LZT Largo 32km, LZT Corto 20km, LZT XS 13km, Trail Kids`,
            city: "Lousã",
            metaTitle:
              "Louzantrail 2026 - Trail Running Serra da Lousã | 7-8 Marzo",
            metaDescription:
              "Evento de trail running en Serra da Lousã, Portugal. 4 distancias: 32km, 20km, 13km y Trail Kids. Certificado ATRP. ¡Inscríbete en Louzantrail 2026!",
          },
          {
            language: "fr",
            title: "Louzantrail 2026",
            description: `**Trail Running à Serra da Lousã - 7-8 Mars 2026**

Louzantrail revient à Serra da Lousã avec des parcours époustouflants à travers les célèbres Villages de Schiste, organisé par la Section Trail Running du Montanha Clube.

🏔️ **Trail au Cœur du Portugal**

Découvrez les routes rurales, vallées et zones montagneuses de Serra da Lousã, en traversant les villages qui forment le réseau des Villages de Schiste et en vous connectant à la culture de la région présentée dans chaque recoin.

**Programme Complet:**
- Vendredi 6 Mars: Inscriptions (19h00-21h00)
- Samedi 7 Mars: LZT Long 32km (08h00) + Trail Kids (16h00)
- Dimanche 8 Mars: LZT Court 20km (09h00) + LZT XS 13km (10h00)

**Catégories:** LZT par Étapes (52km), LZT Long 32km, LZT Court 20km, LZT XS 13km, Trail Kids`,
            city: "Lousã",
            metaTitle:
              "Louzantrail 2026 - Trail Running Serra da Lousã | 7-8 Mars",
            metaDescription:
              "Événement de trail running à Serra da Lousã, Portugal. 4 distances: 32km, 20km, 13km et Trail Kids. Certifié ATRP. Inscrivez-vous à Louzantrail 2026!",
          },
          {
            language: "de",
            title: "Louzantrail 2026",
            description: `**Trail Running in Serra da Lousã - 7.-8. März 2026**

Louzantrail kehrt zur Serra da Lousã zurück mit atemberaubenden Strecken durch die berühmten Schieferdörfer, organisiert von der Trail Running Sektion des Montanha Clube.

🏔️ **Trail im Herzen Portugals**

Entdecken Sie ländliche Straßen, Täler und Berggebiete in der Serra da Lousã, durchqueren Sie die Dörfer, die das Netzwerk der Schieferdörfer bilden, und verbinden Sie sich mit der Kultur der Region, die in jeder Ecke präsentiert wird.

**Vollständiges Programm:**
- Freitag, 6. März: Anmeldung (19:00-21:00)
- Samstag, 7. März: LZT Lang 32km (08:00) + Trail Kids (16:00)
- Sonntag, 8. März: LZT Kurz 20km (09:00) + LZT XS 13km (10:00)

**Kategorien:** LZT nach Etappen (52km), LZT Lang 32km, LZT Kurz 20km, LZT XS 13km, Trail Kids`,
            city: "Lousã",
            metaTitle:
              "Louzantrail 2026 - Trail Running Serra da Lousã | 7.-8. März",
            metaDescription:
              "Trail Running Event in Serra da Lousã, Portugal. 4 Distanzen: 32km, 20km, 13km und Trail Kids. ATRP-zertifiziert. Jetzt für Louzantrail 2026 anmelden!",
          },
          {
            language: "it",
            title: "Louzantrail 2026",
            description: `**Trail Running a Serra da Lousã - 7-8 Marzo 2026**

Louzantrail torna a Serra da Lousã con percorsi mozzafiato attraverso i famosi Villaggi di Scisto, organizzato dalla Sezione Trail Running del Montanha Clube.

🏔️ **Trail nel Cuore del Portogallo**

Scopri strade rurali, valli e zone montane nella Serra da Lousã, attraversando i villaggi che formano la rete dei Villaggi di Scisto e connettendoti con la cultura della regione presentata in ogni angolo.

**Programma Completo:**
- Venerdì 6 Marzo: Iscrizioni (19:00-21:00)
- Sabato 7 Marzo: LZT Lungo 32km (08:00) + Trail Kids (16:00)
- Domenica 8 Marzo: LZT Corto 20km (09:00) + LZT XS 13km (10:00)

**Categorie:** LZT per Tappe (52km), LZT Lungo 32km, LZT Corto 20km, LZT XS 13km, Trail Kids`,
            city: "Lousã",
            metaTitle:
              "Louzantrail 2026 - Trail Running Serra da Lousã | 7-8 Marzo",
            metaDescription:
              "Evento di trail running a Serra da Lousã, Portogallo. 4 distanze: 32km, 20km, 13km e Trail Kids. Certificato ATRP. Iscriviti a Louzantrail 2026!",
          },
        ],
      },

      // Variants for all race distances
      variants: {
        create: [
          // =================================
          // LZT BY STAGES (2 ETAPAS)
          // =================================
          {
            name: "LZT by Stages - 2 Etapas",
            description:
              "Desafio de resistência e estratégia com 2 etapas consecutivas. Sábado: LZT Longo 32km (2100m D+). Domingo: LZT Curto 20km (1100m D+). Total: 52km com 3200m D+. Idade mínima: 20 anos.",
            distanceKm: 52,
            startDate: new Date("2026-03-07T08:00:00Z"),
            startTime: "08:00",
            elevationGainM: 3200,
            elevationLossM: 3200,
            cutoffTimeHours: 12.0, // 7h sábado + 5h domingo
            maxParticipants: 150,
            atrpGrade: 4,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - By Stages",
                  startDate: new Date("2025-11-16T20:00:00Z"),
                  endDate: new Date("2025-12-31T23:59:59Z"),
                  price: 45.0,
                  currency: Currency.EUR,
                  note: "Inclui 2 provas: LZT Longo 32km + LZT Curto 20km",
                },
                {
                  name: "2ª Fase - By Stages",
                  startDate: new Date("2026-01-01T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 50.0,
                  currency: Currency.EUR,
                },
                {
                  name: "3ª Fase - By Stages",
                  startDate: new Date("2026-02-01T00:00:00Z"),
                  endDate: new Date("2026-02-25T23:59:59Z"),
                  price: 55.0,
                  currency: Currency.EUR,
                  note: "Última fase - vagas limitadas",
                },
              ],
            },
          },

          // =================================
          // LZT LONGO 32KM (SÁBADO)
          // =================================
          {
            name: "LZT Longo 32km",
            description:
              "Trail técnico de 32km com 2100m de desnível positivo. Percurso pela Serra da Lousã cruzando aldeias do xisto, levadas, trilhos técnicos e estradões florestais. Grau ATRP: 3. Barreira horária Letras (10,6km): 3h30. Tempo limite: 7h. Idade mínima: 20 anos.",
            distanceKm: 32,
            startDate: new Date("2026-03-07T08:00:00Z"),
            startTime: "08:00",
            elevationGainM: 2100,
            elevationLossM: 2100,
            cutoffTimeHours: 7.0,
            maxParticipants: 400,
            atrpGrade: 3,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Longo 32km",
                  startDate: new Date("2025-11-16T20:00:00Z"),
                  endDate: new Date("2025-12-31T23:59:59Z"),
                  price: 30.0,
                  currency: Currency.EUR,
                  note: "Inclui dorsal, chip, seguro, abastecimentos, prémio finisher e mini refeição",
                },
                {
                  name: "2ª Fase - Longo 32km",
                  startDate: new Date("2026-01-01T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 35.0,
                  currency: Currency.EUR,
                },
                {
                  name: "3ª Fase - Longo 32km",
                  startDate: new Date("2026-02-01T00:00:00Z"),
                  endDate: new Date("2026-02-25T23:59:59Z"),
                  price: 40.0,
                  currency: Currency.EUR,
                },
              ],
            },
          },

          // =================================
          // LZT CURTO 20KM (DOMINGO)
          // =================================
          {
            name: "LZT Curto 20km",
            description:
              "Trail de 20km com 1100m de desnível positivo. Percurso desafiante pelas aldeias do xisto e trilhos técnicos da Serra da Lousã. Grau ATRP: 4. Barreira horária Letras (10,4km): 3h30. Tempo limite: 5h. Idade mínima: 18 anos.",
            distanceKm: 20,
            startDate: new Date("2026-03-08T09:00:00Z"),
            startTime: "09:00",
            elevationGainM: 1100,
            elevationLossM: 1100,
            cutoffTimeHours: 5.0,
            maxParticipants: 450,
            atrpGrade: 4,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Curto 20km",
                  startDate: new Date("2025-11-16T20:00:00Z"),
                  endDate: new Date("2025-12-31T23:59:59Z"),
                  price: 20.0,
                  currency: Currency.EUR,
                  note: "Atletas FPA/ADAC: desconto 1,50€ (18,50€)",
                },
                {
                  name: "2ª Fase - Curto 20km",
                  startDate: new Date("2026-01-01T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 25.0,
                  currency: Currency.EUR,
                  note: "Atletas FPA/ADAC: desconto 1,50€ (23,50€)",
                },
                {
                  name: "3ª Fase - Curto 20km",
                  startDate: new Date("2026-02-01T00:00:00Z"),
                  endDate: new Date("2026-02-25T23:59:59Z"),
                  price: 30.0,
                  currency: Currency.EUR,
                  note: "Atletas FPA/ADAC: desconto 1,50€ (28,50€)",
                },
              ],
            },
          },

          // =================================
          // LZT XS 13KM / CAMINHADA (DOMINGO)
          // =================================
          {
            name: "LZT XS 13km - Trail",
            description:
              "Mini trail de 13km com 700m de desnível positivo. Percurso acessível pela Serra da Lousã, ideal para iniciação ao trail running. Grau ATRP: 3. Tempo limite: 4h. Idade mínima: 16 anos. Pode ser feito em corrida ou caminhada.",
            distanceKm: 13,
            startDate: new Date("2026-03-08T10:00:00Z"),
            startTime: "10:00",
            elevationGainM: 700,
            elevationLossM: 700,
            cutoffTimeHours: 4.0,
            maxParticipants: 250,
            atrpGrade: 3,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - XS 13km",
                  startDate: new Date("2025-11-16T20:00:00Z"),
                  endDate: new Date("2025-12-31T23:59:59Z"),
                  price: 15.0,
                  currency: Currency.EUR,
                  note: "Modalidade: Trail ou Caminhada",
                },
                {
                  name: "2ª Fase - XS 13km",
                  startDate: new Date("2026-01-01T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 20.0,
                  currency: Currency.EUR,
                },
                {
                  name: "3ª Fase - XS 13km",
                  startDate: new Date("2026-02-01T00:00:00Z"),
                  endDate: new Date("2026-02-25T23:59:59Z"),
                  price: 25.0,
                  currency: Currency.EUR,
                },
              ],
            },
          },

          // =================================
          // TRAIL KIDS (SÁBADO)
          // =================================
          {
            name: "Trail Kids - Benjamins A",
            description:
              "Trail para crianças escalão Benjamins A. Circuito no Parque Municipal de Exposições da Lousã. Partida às 16h00. Inscrição gratuita. Distância ajustada ao escalão etário.",
            distanceKm: 1.0,
            startDate: new Date("2026-03-07T16:00:00Z"),
            startTime: "16:00",
            elevationGainM: 20,
            elevationLossM: 20,
            maxParticipants: 40,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Gratuita - Kids",
                  startDate: new Date("2025-11-16T20:00:00Z"),
                  endDate: new Date("2026-02-25T23:59:59Z"),
                  price: 0.0,
                  currency: Currency.EUR,
                  note: "Escalão Benjamins A - Inscrição gratuita",
                },
              ],
            },
          },
          {
            name: "Trail Kids - Benjamins B",
            description:
              "Trail para crianças escalão Benjamins B. Circuito no Parque Municipal de Exposições da Lousã. Partida às 16h10. Inscrição gratuita. Distância ajustada ao escalão etário.",
            distanceKm: 1.5,
            startDate: new Date("2026-03-07T16:10:00Z"),
            startTime: "16:10",
            elevationGainM: 30,
            elevationLossM: 30,
            maxParticipants: 40,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Gratuita - Kids",
                  startDate: new Date("2025-11-16T20:00:00Z"),
                  endDate: new Date("2026-02-25T23:59:59Z"),
                  price: 0.0,
                  currency: Currency.EUR,
                  note: "Escalão Benjamins B - Inscrição gratuita",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created event: ${event.title}`);
  console.log(
    `📅 Dates: ${event.startDate.toLocaleDateString()} - ${event.endDate?.toLocaleDateString()}`
  );
  console.log(`🏃 Sport type: ${event.sportTypes.join(", ")}`);

  // Count variants
  const variantsCount = await prisma.eventVariant.count({
    where: { eventId: event.id },
  });
  console.log(`📊 Created ${variantsCount} variants`);

  // Count pricing phases
  const pricingCount = await prisma.pricingPhase.count({
    where: {
      OR: [{ eventId: event.id }, { variant: { eventId: event.id } }],
    },
  });
  console.log(`💰 Created ${pricingCount} pricing phases`);

  console.log("\n🎉 Louzantrail 2026 seeded successfully!");
  console.log("\n📋 Event Structure:");
  console.log("   Sábado 7 Mar: LZT Longo 32km + Trail Kids");
  console.log("   Domingo 8 Mar: LZT Curto 20km + LZT XS 13km");
  console.log("   LZT by Stages: 32km + 20km (2 etapas)");
  console.log("   Vagas: 400 (Longo) + 450 (Curto) + 250 (XS) + 80 (Kids)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
