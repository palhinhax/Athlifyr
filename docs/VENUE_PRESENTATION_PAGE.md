# Generic Venue Presentation Page

## Overview

A generic, multilingual presentation page designed to showcase Athlifyr to potential venue partners. This page is brand-neutral and can be used to convince any gym, CrossFit box, or training center to join the platform.

## Location

- **Route**: `/[locale]/presentation/venue`
- **Page**: `app/[locale]/presentation/venue/page.tsx`
- **Component**: `components/presentations/venue-presentation-client.tsx`

## Features

### ✅ Multilingual Support (6 Languages)

Complete translations for all supported languages:

- 🇬🇧 English (en)
- 🇵🇹 Portuguese (pt) - European Portuguese
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇹 Italian (it)

### 🎨 Generic Design

- **No venue-specific references**: Unlike the Unlimited Training Center page, this version contains no references to specific venues or locations
- **Abstract gradient background**: Professional gradient background instead of location-specific imagery
- **Customizable messaging**: All text uses translation keys for easy customization

### 📱 Responsive & Interactive

- **Tabata Timer Demo**: Interactive Tabata timer demonstration using WallClock component
- **Feature showcase**: Highlights key Athlifyr features with animated cards
- **Benefits section**: Clearly communicates value propositions
- **CTA sections**: Multiple call-to-action buttons for scheduling demos

### 🔧 Components Used

- `WallClock` - Professional timer display
- `motion` (Framer Motion) - Smooth animations
- Lucide Icons - Consistent iconography
- shadcn/ui components - Button, Badge, Card, etc.

## Translation Structure

All translations are stored in `/messages/[locale]/presentation.json`:

```json
{
  "presentation": {
    "meta": { "title": "...", "description": "..." },
    "hero": { "title": "...", "subtitle": "...", "description": "...", "cta": "..." },
    "features": { "title": "...", "schedule": {...}, "workouts": {...}, ... },
    "timer": { "title": "...", "description": "...", "work": "...", "rest": "..." },
    "benefits": { "title": "...", "free": {...}, "easy": {...}, ... },
    "cta": { "title": "...", "description": "...", "button": "..." }
  }
}
```

## Usage

### Accessing the Page

- **Portuguese**: `https://athlifyr.com/pt/presentation/venue`
- **English**: `https://athlifyr.com/en/presentation/venue`
- **Spanish**: `https://athlifyr.com/es/presentation/venue`
- **French**: `https://athlifyr.com/fr/presentation/venue`
- **German**: `https://athlifyr.com/de/presentation/venue`
- **Italian**: `https://athlifyr.com/it/presentation/venue`

### SEO Configuration

The page is configured with `noindex, nofollow` to prevent search engine indexing (presentation/demo purposes only).

## Differences from Unlimited Training Center Page

| Feature          | Unlimited TC Page           | Generic Venue Page              |
| ---------------- | --------------------------- | ------------------------------- |
| **Venue Name**   | "Unlimited Training Center" | Generic "Your Venue"            |
| **Location**     | "Mafra, Portugal"           | Generic "Your City"             |
| **Background**   | Palácio de Mafra photo      | Abstract gradient               |
| **References**   | Specific to one venue       | Generic to all venues           |
| **Purpose**      | Single venue presentation   | Reusable for all venues         |
| **Translations** | Hardcoded Portuguese        | Full i18n support (6 languages) |

## Future Enhancements

Potential improvements for this page:

1. **Dynamic URL parameters**: Allow customization via URL params (venue name, logo, colors)
2. **Admin customization panel**: Let admin customize text/images per presentation
3. **Analytics tracking**: Track which venues view the presentation
4. **Lead form**: Add contact form for venues to express interest
5. **Video demos**: Embed product demo videos
6. **Testimonials**: Add real venue owner testimonials
7. **Pricing info**: Include basic pricing information (since it's free)

## Development

### Running Locally

```bash
pnpm dev
```

Then visit: `http://localhost:3000/pt/presentation/venue`

### Updating Translations

Edit the appropriate locale file in `/messages/[locale]/presentation.json` and follow the project's translation guidelines.

### Styling

The page uses Tailwind CSS and follows the project's design system. All components are responsive and support both light/dark themes.

## Related Files

- **Page**: `app/[locale]/presentation/venue/page.tsx`
- **Component**: `components/presentations/venue-presentation-client.tsx`
- **Translations**: `messages/*/presentation.json` (all 6 language folders)
- **Original Reference**: `app/[locale]/presentation/unlimited-training-center/page.tsx`

## Notes

- This page follows all Athlifyr coding standards (no `any`, proper types, modular components)
- All code is formatted with Prettier and passes ESLint checks
- TypeScript strict mode is enabled with full type safety
- Follows Conventional Commits for version control
