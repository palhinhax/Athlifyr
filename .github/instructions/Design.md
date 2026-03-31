# Design System Strategy: The Sunlit Track

## 1. Overview & Creative North Star

**The Creative North Star: "Golden Hour Performance"**

This design system moves beyond the utility of a standard gym management tool to create an editorial, high-performance experience. We are not building a "database with buttons"; we are building an digital environment that feels like a crisp, early-morning run. The "Sunlit Track" philosophy leverages high-contrast typography, generous whitespace (negative space as a luxury), and a "Photography-First" layout.

By utilizing intentional asymmetry—such as offset imagery and staggered data visualizations—we break the rigid "SaaS template" look. The interface should feel like a premium fitness magazine: breathable, authoritative, and energetic.

---

## 2. Colors & Surface Logic

The palette is rooted in the warmth of the sun and the clarity of a clean track. We avoid heavy grays in favor of "warm neutrals" to maintain an energetic, premium feel.

### The "No-Line" Rule

**Strict Mandate:** 1px solid borders for sectioning are prohibited. Boundaries must be defined solely through background color shifts or tonal transitions. To separate a sidebar from a main feed, transition from `surface` (#f5f6f7) to `surface_container_lowest` (#ffffff).

### Surface Hierarchy & Nesting

Treat the UI as physical layers of fine paper.

- **Level 0 (Base):** `surface` (#f5f6f7) – The stadium floor.

- **Level 1 (Sections):** `surface_container_low` (#eff1f2) – Large structural blocks.

- **Level 2 (Active Cards):** `surface_container_lowest` (#ffffff) – Floating elements that demand focus.

- **Accent Sections:** Use `on_tertiary` (#fff0e0) for subtle, warm highlights in gym schedules or "Golden Hour" summaries.

### The Glass & Gradient Rule

For floating navigation or map overlays, use **Glassmorphism**:

- `background`: `surface_container_lowest` at 80% opacity.

- `backdrop-filter`: blur(20px).

- **Gradients:** Use a linear transition from `primary` (#9e3c00) to `primary_container` (#ff7936) at 135 degrees for high-impact CTAs to provide "soul" and kinetic energy.

---

## 3. Typography: Editorial Authority

We pair the geometric precision of **Plus Jakarta Sans** with the functional clarity of **Inter**.

- **Display & Headlines (Plus Jakarta Sans):** Used for "Big Moments"—personal records, event titles, and hero sections. The tight tracking and bold weights convey Nike-esque authority.

- **Body & UI (Inter):** Used for data density and micro-copy. Its neutral character ensures that complex gym metrics remain "calm" and readable.

**The Signature Scale:**

- **Display-LG (3.5rem):** Reserved for singular, motivating data points (e.g., "05:42").

- **Headline-MD (1.75rem):** For page titles, using `on_surface` (#2c2f30).

- **Label-MD (0.75rem):** All-caps with 0.05em tracking for category tags (e.g., "STRENGTH," "ENDURANCE").

---

## 4. Elevation & Depth

We eschew "Standard Material" shadows for **Tonal Layering**.

### The Layering Principle

Depth is achieved by "stacking." A `surface_container_highest` (#dadddf) element placed on a `surface` (#f5f6f7) background creates a recessed, tactile feel without a single drop shadow.

### Ambient Shadows

When a card must "float" (e.g., a featured race card):

- **Shadow:** `0 8px 32px rgba(158, 60, 0, 0.06)` (A 6% opacity shadow tinted with the `primary` hue). This mimics natural light reflecting off an orange track.

### The "Ghost Border" Fallback

If accessibility requires a container edge, use a **Ghost Border**:

- `outline_variant` (#abadae) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

All components follow the **xl (1.5rem/24px)** or **lg (1rem/16px)** roundedness scale to feel approachable yet sleek.

- **Buttons:**

- **Primary:** Gradient (Primary to Primary Container), 12px (md) corners, `on_primary` text.

- **Secondary:** `surface_container_high` (#e0e3e4) background with `on_surface` text. No border.

- **Cards:** 16px (lg) corners. Use `spacing.6` (2rem) internal padding to maintain "The Sunlit Track" breathability. **Never use dividers.** Use a `surface_container_low` (#eff1f2) header strip to separate content areas.

- **Chips:** Full-round (pills). Use `secondary_container` (#ffc5a6) for active filters to provide a soft, sun-drenched highlight.

- **Input Fields:** `surface_container_low` background. On focus, the background shifts to `surface_container_lowest` with a 1pt `primary` Ghost Border (20% opacity).

- **Data Visuals:** Use `tertiary_fixed` (#f7ad1e) for progress rings and charts to contrast against the primary orange without clashing.

- **The "Activity Thread":** Instead of a list with lines, use a vertical "track" (a 2px wide line in `outline_variant` at 20% opacity) to connect workout events.

---

## 6. Do's and Don'ts

### Do

- **Do** use asymmetrical margins. If a headline is left-aligned, let the supporting image bleed off the right edge of the screen.

- **Do** use "Photography-Forward" backgrounds. High-shutter-speed sports photography should be treated as a core UI element.

- **Do** leverage the `spacing.16` (5.5rem) and `spacing.20` (7rem) values for major section breaks to ensure the UI feels "Premium."

### Don't

- **Don't** use pure black (#000000) for text. Use `on_surface` (#2c2f30) to maintain a sophisticated tonal range.

- **Don't** use 1px dividers to separate list items. Use `spacing.3` (1rem) of whitespace or subtle alternating backgrounds (`surface` to `surface_container_low`).

- **Don't** use Dark Mode. The brand identity is built on light and energy. The only exception is map-based overlays where `inverse_surface` (#0c0f10) may be used for legibility.
