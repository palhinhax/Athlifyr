# VII Trilhos de Viana 2026 - Event Seed Documentation

## Event Overview

**Event Name:** VII Trilhos de Viana 2026  
**Date:** February 1, 2026  
**Location:** Viana do Castelo, Portugal  
**Venue:** Estádio Municipal Manuela Machado  
**Type:** Trail Running Event

## Event Description

The VII Trilhos de Viana is a trail running event organized by Associação Trilhos de Viana with support from Viana do Castelo City Council. The event features four different races through trails, paths, and mountain streams of Santa Luzia mountain, promoting sports practice and contact with nature.

## Event Variants

### 1. Trail Longo (Long Trail)

- **Distance:** 31.5 km
- **Elevation Gain:** 1,500m D+
- **Start Time:** 08:30
- **Maximum Participants:** 200
- **Minimum Age:** 18 years
- **Cutoff Time:** 6 hours
- **Aid Stations:** 11km (Outeiro), 20km (Fonte da Louçã - BARRIER at 4h), 26km (S. Mamede)
- **Mandatory Equipment:** Thermal blanket, mobile phone, whistle, water container (minimum 0.5L)

### 2. Trail Curto (Short Trail)

- **Distance:** 18 km
- **Elevation Gain:** 850m D+
- **Start Time:** 08:50
- **Maximum Participants:** 400
- **Minimum Age:** 18 years
- **Cutoff Time:** 4 hours
- **Aid Stations:** 7.5km (Fonte Louçã), 12.8km (S. Mamede)
- **Mandatory Equipment:** Thermal blanket, mobile phone, whistle, water container (minimum 0.5L)

### 3. Mini-Trail

- **Distance:** 12.5 km
- **Elevation Gain:** 640m D+
- **Start Time:** 09:10
- **Maximum Participants:** 500
- **Minimum Age:** 12 years
- **Cutoff Time:** 3 hours
- **Aid Stations:** 6.5km (S. Mamede)

### 4. Caminhada (Walk)

- **Distance:** 8.5 km
- **Elevation Gain:** 450m D+
- **Start Time:** 09:10
- **Maximum Participants:** 250
- **Minimum Age:** 12 years
- **Cutoff Time:** 2.5 hours
- **Aid Stations:** 4km (Alto Estrada da Cova)

## Registration

### Registration Period

- **Opens:** November 15, 2025
- **Closes:** January 29, 2026 at 23:59
- **Platform:** https://www.cyclonessports.com/

### Pricing

| Variant              | Price |
| -------------------- | ----- |
| Trail Longo (31.5km) | €17   |
| Trail Curto (18km)   | €15   |
| Mini-Trail (12.5km)  | €13   |
| Caminhada (8.5km)    | €10   |

**Additional Options:**

- Event T-shirt: +€3 (optional)

**Team Discounts:**

- Teams with 10+ members: 10% discount
- Teams with 20+ members: 20% discount
- (Teams must request a VOUCHER for registration)

### Registration Includes

- Race number (dorsal)
- Personal accident insurance
- Showers at finish line
- Finisher medal
- Safety and medical support
- Food and refreshments at finish line (beer, Bola Berlim, energy bars, etc.)
- Course markings
- Additional sponsor gifts

### Fund Allocation

From each registration:

- €1.00 → Associação Humanitária dos Bombeiros Voluntários de Viana do Castelo
- €0.50 → Agrupamento de Escuteiros da Meadela

## Event Schedule

### Friday, January 30, 2026

- **17:00 - 19:00:** Registration desk open at Estádio Municipal Manuela Machado

### Saturday, January 31, 2026

- **14:30 - 19:00:** Registration desk open at Estádio Municipal Manuela Machado

### Sunday, February 1, 2026

- **07:00 - 08:30:** Registration desk open at Estádio Municipal Manuela Machado
- **08:30:** Trail Longo (31.5km) start
- **08:50:** Trail Curto (18km) start
- **09:10:** Mini-Trail (12.5km) and Caminhada (8.5km) start
- **11:30:** Mini-Trail awards ceremony
- **12:30:** Trail Curto awards ceremony
- **13:30:** Trail Longo awards ceremony
- **15:00:** Event end

## Course Details

### Markings

- Orange tape and flags throughout the course

### Aid Stations

- Semi-autonomous races - participants must carry minimum calories and liquids between aid stations
- **No plastic bottles or cups provided** - participants must bring their own containers
- Water and food available at all aid stations

### Safety

- Support provided by:
  - Bombeiros Voluntários de Viana do Castelo
  - GOBS - Grupo Operacional Busca e Salvamento
  - Agrupamento nº348 Escuteiros da Meadela
- "Sweep" athletes close the races (no time barriers except Trail Longo at 20km)

### Traffic

- Open-road system (races on public roads)
- Participants must follow traffic rules

## Categories and Awards

### Age Categories (both M/F where applicable)

- Overall (General)
- Sub 23
- Seniors
- 35+
- 40+
- 45+
- 50+
- 55+
- 60+

**Note:** Prizes awarded only to top 3 male and top 3 female in marked categories

### Team Classifications

- Top 3 teams (best 3 athletes from each team, no gender/age distinction)
- Top 3 largest teams

## Translations

The seed file includes complete translations in all 6 supported languages:

- **Portuguese (pt)** - European Portuguese
- **English (en)**
- **Spanish (es)**
- **French (fr)**
- **German (de)**
- **Italian (it)**

## Running the Seed

### Local Development

```bash
npx tsx prisma/seed-vii-trilhos-viana.ts
```

### Production (via GitHub Actions)

1. Go to GitHub → Actions
2. Select "Manual Prisma Seed (Shared DB)"
3. Click "Run workflow"
4. Enter filename: `vii-trilhos-viana-2026.ts` (if moved to seeds directory)
5. Click "Run workflow" to execute

## Database Impact

This seed will:

- ✅ Create the event if it doesn't exist
- ✅ Delete and recreate the event if it already exists (based on slug)
- ✅ Create 4 event variants
- ✅ Create 6 pricing phases
- ✅ Create 6 translations for the event
- ✅ Create 6 translations for each variant (24 total variant translations)

**Slug:** `vii-trilhos-viana-2026`

## Contact Information

- **Organization:** Associação Trilhos de Viana
- **Website:** https://www.facebook.com/AssociacaoTrilhosdeViana
- **Email:**
  - a.trilhosdeviana@gmail.com
  - leandroathleta@gmail.com
- **Phone:** +351 919 418 429
- **Technical Director:** Leandro Freitas

## Insurance

**Trail Insurance:** Allianz Policy 208027253  
**Walk Insurance:** Allianz Policy 208024586

## Environmental Responsibility

Participants are responsible for:

- Carrying all wrappers and waste (including biodegradable)
- Disposing waste at aid stations or finish line
- **Penalty:** Disqualification for littering

## Source Document

This seed was created based on the official regulation document:

- **File:** `20260201_regulamento_v1.pdf`
- **Date:** November 11, 2025
- **Organizer:** Associação Trilhos de Viana

## Location Coordinates

- **Latitude:** 41.717
- **Longitude:** -8.818245
- **Venue:** Estádio Municipal Manuela Machado, Meadela, Viana do Castelo

## Notes

- Event follows ATRP (Portuguese Trail Running Association) regulations
- Mandatory equipment for Trail Longo and Trail Curto must be carried at all times
- Time penalty of 15 minutes per missing mandatory equipment item
- Race conducted in semi-autonomous mode
- Weather conditions in Santa Luzia mountain can change rapidly
