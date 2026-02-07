# 🎨 Palette System — Athlifyr

## How it works

The entire site uses **4 CSS custom properties** defined in `app/globals.css`.
Changing these values in **one place** updates all buttons, icons, badges,
charts, calendar dots, etc. across the whole site.

| Variable        | Role                                 | Tailwind class     |
| --------------- | ------------------------------------ | ------------------ |
| `--p-brand`     | Primary buttons, CTA, brand elements | `text-p-brand`     |
| `--p-golden`    | Secondary actions, badges, stars     | `text-p-golden`    |
| `--p-highlight` | Subtle highlights, tags, chips       | `text-p-highlight` |
| `--p-info`      | Informational, social, links         | `text-p-info`      |

Additionally, the shadcn/ui variables are wired to the palette:

- `--primary` → `--p-brand` (all `bg-primary` buttons change automatically)
- `--accent` → `--p-golden`
- `--ring` → `--p-brand`
- Charts 1-4 → palette colors

---

## Current palette — "Sunset Orange"

```css
:root {
  --p-brand: 26 78% 53%; /* #E2852E — orange */
  --p-golden: 41 89% 65%; /* #F5C857 — gold */
  --p-highlight: 51 100% 78%; /* #FFEE91 — light yellow */
  --p-info: 194 66% 80%; /* #ABE0F0 — light blue */
}
```

---

## Alternative palettes to try

### Ocean Blue

```css
:root {
  --p-brand: 210 80% 50%; /* #1A73E8 */
  --p-golden: 190 70% 55%; /* #38B2AC */
  --p-highlight: 170 60% 78%; /* #A7F3D0 */
  --p-info: 230 60% 75%; /* #93B5F5 */
}
```

### Forest Green

```css
:root {
  --p-brand: 145 65% 40%; /* #22A55B */
  --p-golden: 42 90% 60%; /* #F0B429 */
  --p-highlight: 80 60% 78%; /* #D9F2A8 */
  --p-info: 200 55% 75%; /* #8ECAE6 */
}
```

### Royal Purple

```css
:root {
  --p-brand: 270 65% 55%; /* #8B5CF6 */
  --p-golden: 40 85% 65%; /* #F5C857 */
  --p-highlight: 290 50% 82%; /* #E0B0FF */
  --p-info: 200 70% 75%; /* #7DD3FC */
}
```

### Fire Red

```css
:root {
  --p-brand: 0 75% 55%; /* #E53E3E */
  --p-golden: 30 90% 60%; /* #F6AD55 */
  --p-highlight: 15 100% 80%; /* #FED7AA */
  --p-info: 210 60% 75%; /* #90CDF4 */
}
```

---

## How to switch palettes

1. Open `app/globals.css`
2. Find the `:root` block
3. Replace the 4 `--p-*` values
4. Optionally adjust `.dark` values (slightly lighter/darker variants)
5. Save — the entire site updates instantly (with hot reload)

---

## Tips for dark mode

In the `.dark` block, bump lightness by ~3-5% so colors stay vibrant on dark backgrounds:

```css
.dark {
  --p-brand: 26 78% 56%; /* slightly lighter */
  --p-golden: 41 89% 68%;
  --p-highlight: 51 100% 80%;
  --p-info: 194 66% 75%; /* slightly darker for contrast */
}
```

---

## Converting HEX to HSL

Use: https://hsl.to/ or any color picker.

Format: `H S% L%` (without `hsl()` wrapper — Tailwind handles that).
