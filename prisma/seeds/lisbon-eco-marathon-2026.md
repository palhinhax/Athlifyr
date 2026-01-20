# Lisbon Eco Marathon 2026 - Event Seed Documentation

## Event Overview

**Event Name:** Lisbon Eco Marathon 2026  
**Date:** April 12, 2026 (Sunday)  
**Location:** Alameda Cardeal Cerejeira, Parque Eduardo VII, Lisboa  
**Type:** Eco-responsible Running Event

## Event Description

The Lisbon Eco Marathon is an eco-responsible sports event that promotes sustainability and environmental respect. With start and finish at **Alameda Cardeal Cerejeira, Parque Eduardo VII**, the courses run through the Monsanto Forest Park.

## Key Environmental Features

- ♻️ **No littering allowed** - immediate disqualification
- 🥤 **No disposable cups provided** - participants must bring reusable containers
- 🌍 **Environmental preservation** is mandatory in all race areas
- 👥 Limited to **3,000 participants** across all four distances

## Event Variants

### 1. Marathon 42km

- **Start Time:** 08:30
- **Cutoff Time:** 6 hours (finish closes at 14:30)
- **Minimum Age:** 18 years
- **Aid Stations:** Km 4, 10, 16, 22, 28, 36, and Finish
- **Recommended Equipment:** Thermal blanket, reusable cup, water reserve, whistle

### 2. Half Marathon 21km

- **Start Time:** 09:30
- **Cutoff Time:** 6 hours (finish closes at 14:30)
- **Minimum Age:** 18 years
- **Aid Stations:** Km 4, 10, 15, and Finish
- **Recommended Equipment:** Thermal blanket, reusable cup, water reserve

### 3. Mini Marathon 13km

- **Start Time:** 10:00
- **Cutoff Time:** 6 hours (finish closes at 14:30)
- **Minimum Age:** 14 years
- **Aid Stations:** Km 7 and Finish
- **Recommended Equipment:** Water reserve

### 4. Walk 8km (approx)

- **Start Time:** 10:15
- **Cutoff Time:** 6 hours (finish closes at 14:30)
- **No Minimum Age** (children accompanied by adult)
- **Aid Stations:** Km 3.5 and Finish
- **Recommended Equipment:** Water container

## Event Schedule

### Saturday, April 11, 2026:

- 10:00 - 19:00: Registration desk open (Alameda Cardeal Cerejeira)

### Sunday, April 12, 2026:

- 07:00: Registration desk opens
- 07:45: Marathon 42km box opens
- 08:30: **Marathon 42km Start**
- 08:45: Half Marathon 21km box opens
- 09:30: **Half Marathon 21km Start**
- 09:45: Mini Marathon 13km box opens
- 10:00: **Mini Marathon 13km Start**
- 10:05: Walk 8km box opens
- 10:15: **Walk 8km Start**
- 12:30: Awards Ceremony (estimated)
- 14:30: Finish Line Closes
- 14:35: Event Closes

## Registration Pricing

### Standard Registration Phases

| Distance | Phase 1 (Oct 1-31, 2025) | Phase 2 (Nov 1 - Dec 31, 2025) | Phase 3 (Jan 1 - Mar 22, 2026) | Phase 4 (Mar 23 - Apr 5, 2026) |
| -------- | ------------------------ | ------------------------------ | ------------------------------ | ------------------------------ |
| **42KM** | €40                      | €45                            | €48                            | €50                            |
| **21KM** | €18                      | €22                            | €25                            | €30                            |
| **13KM** | €12                      | €15                            | €17                            | €20                            |
| **8KM**  | €6                       | €7                             | €8                             | €12                            |

### Premium Registration

For an additional **€25.00** (until March 15, 2026), includes:

- 🍽️ Lunch
- 💆 Sports Massage

### Late Registration

On April 11, on-site registration available with €20 surcharge (subject to availability).

## Participation Kit

The kit includes:

- ✅ Event T-shirt (sizes S, M, L, XL, XXL)
- ✅ Race bib with non-detachable chip
- ✅ Baggage check wristband
- ✅ Finisher medal (for those who complete the race)
- ✅ Personal accident insurance

## Cutoff Times

- **Maximum Time:** 6 hours from Marathon 42km start (08:30)
- **Finish Closes:** 14:30
- **Last Aid Station** (5km before finish): closes at 13:30

After these times, all participants will be considered disqualified.

## Classifications and Awards

Awards for top 3 male and female finishers in each race:

- Trophies presented at awards ceremony
- Digital diplomas by age category
- Prize for largest team (Clubs and Companies)

## Translations

The seed file includes complete translations in all 6 supported languages:

- **Portuguese (pt)** - European Portuguese
- **English (en)**
- **Spanish (es)**
- **French (fr)**
- **German (de)**
- **Italian (it)**

## Organization

**Clube Desportivo e Recreativo Chronos**  
In collaboration with Stream Plan, LDA.

**Official Website:** https://www.lisbonecomarathon.com

## Running the Seed

### Local Development

```bash
npx tsx prisma/seeds/lisbon-eco-marathon-2026.ts
```

### Production (via GitHub Actions)

**Manual Execution Required:**

1. Go to GitHub → Actions
2. Select "Manual Prisma Seed (Shared DB)"
3. Click "Run workflow"
4. Enter filename: `lisbon-eco-marathon-2026.ts`
5. Click "Run workflow" to execute

**Optional: Set Default for One-Click Execution**

Users can optionally update `.github/workflows/manual-seed.yml` to pre-fill the filename:

1. Edit `.github/workflows/manual-seed.yml`
2. Update the `default` value in the `seed_file` input to `lisbon-eco-marathon-2026.ts`
3. After this, the filename will be pre-filled in the Actions UI

## Database Impact

This seed will create or update:

- ✅ 1 event (Lisbon Eco Marathon 2026)
- ✅ 6 event translations (pt, en, es, fr, de, it)
- ✅ 4 event variants (42km, 21km, 13km, 8km)
- ✅ 24 variant translations (4 variants × 6 languages)
- ✅ 16 pricing phases (4 phases × 4 variants)

**Slug:** `lisbon-eco-marathon-2026`

**The seed is idempotent** - safe to run multiple times without creating duplicates.

## Location Coordinates

- **Latitude:** 38.7259
- **Longitude:** -9.1498
- **Google Maps:** [Alameda Cardeal Cerejeira, Parque Eduardo VII, Lisboa](https://www.google.com/maps?q=Alameda+Cardeal+Cerejeira,+Parque+Eduardo+VII,+Lisboa)

## Source Document

This seed was created based on the official regulation document provided in the issue, which includes:

- Complete event rules and regulations
- Detailed schedule and logistics
- Registration pricing structure
- Environmental responsibility requirements
- Safety and medical support information
- Insurance coverage details
- Awards and classification criteria

## Notes

- Event follows strict environmental guidelines
- Mandatory equipment varies by distance
- No disposable plastics allowed at aid stations
- All participants must carry their own reusable containers
- Maximum capacity: 3,000 participants across all distances
- Registration deadline: April 5, 2026 at 20:00
- Featured event on the platform (`isFeatured: true`)
