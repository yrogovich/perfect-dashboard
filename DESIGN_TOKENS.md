# Design Tokens — Proposal (step 2)

> Status: **Decided 2026-10-26: palette A · Kiln.** The product itself is named **Pretty CMS**; "Kiln" now only names this palette. Margin and Folio are kept below for reference only. All contrast numbers were computed, and every chart palette passed the dataviz validator in both themes (see "Validation").

## The three directions

| | **A · Kiln** | **B · Margin** | **C · Folio** |
|---|---|---|---|
| Idea | Warm and energetic. Closest to the benchmark | Editorial and calm. Feels like a writing tool | Trustworthy and analytical. Feels like a data product |
| Accent (light) | `#d24100` ember · white text 4.67:1 | `#6445df` violet · white text 6.07:1 | `#156cdd` cobalt · white text 4.98:1 |
| Accent (dark) | `#f77036` · dark ink text 6.34:1 | `#9085fb` · dark ink text 5.99:1 | `#539af2` · dark ink text 6.27:1 |
| Background glow (light) | peach `#ffd1c1` + pink `#ffd8e9` | lilac `#d6d0ff` + pink `#ffd8e9` | sky `#c1e2ff` + lilac `#d6d0ff` |
| Chart series 1 → 3 | orange · blue · aqua | violet · aqua · orange | blue · orange · aqua |
| Risk | Orange series can be confused with the red/orange "serious" status color, so status always needs an icon + label | Violet reads as "AI", which suits the AI-readiness score and could also be read as gimmicky | The most common SaaS color, so it's the least distinctive |

**My pick: A · Kiln.** It keeps the energy of the benchmark (a bold warm accent against a cool lavender base) while being our own. On a light surface, warm and cool contrast more than two cool colors do.

## Shared tokens (same for all three)

### Color: neutrals (cool lavender, hue 280–290)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `#f5f4ff` oklch(0.97 0.015 290) + glows | `#0e0e18` oklch(0.17 0.02 280) + faint accent glow | Page |
| `--surface` | `#ffffff` | `#1b1c26` oklch(0.23 0.02 280) | Cards |
| `--surface-raised` | `#ffffff` + stronger shadow | oklch(0.27 0.02 280) | Popovers, active card |
| `--foreground` | `#14151f` | oklch(0.95 0.01 280) | Primary text |
| `--muted` | `#61626f` (6.0:1 on white) | `#9c9dab` (6.3:1 on surface) | Secondary text, axes |
| `--border` | `rgb(20 21 31 / 0.08)` | `rgb(255 255 255 / 0.07)` | Hairlines. In dark mode, borders replace shadows |
| `--ring` | accent | accent | Focus ring, 2px + 2px offset |

### Color: status and deltas (fixed, never themed)

| Role | Hex | Rule |
|---|---|---|
| good | `#0ca30c` | Always with an icon and label. Delta text: `#006300` light / `#0ca30c` dark |
| warning | `#fab219` | Below 3:1 on light, so the icon + label are mandatory |
| serious | `#ec835a` | Near Kiln's accent, so the icon + label are mandatory |
| critical | `#d03b3b` | |

### Charts (categorical, fixed order per direction; color follows the entity, never its rank)

| Slot | A · Kiln light / dark | B · Margin light / dark | C · Folio light / dark |
|---|---|---|---|
| 1 | `#eb6834` / `#d95926` | `#6250d6` / `#9085e9` | `#2a78d6` / `#3987e5` |
| 2 | `#2a78d6` / `#3987e5` | `#1baf7a` / `#199e70` | `#eb6834` / `#d95926` |
| 3 | `#1baf7a` / `#199e70` | `#eb6834` / `#d95926` | `#1baf7a` / `#199e70` |
| 4 | `#6250d6` / `#9085e9` | `#2a78d6` / `#3987e5` | `#eda100` / `#c98500` |
| 5 | `#eda100` / `#c98500` | `#eda100` / `#c98500` | `#e87ba4` / `#d55181` |
| 6 | `#e87ba4` / `#d55181` | `#e87ba4` / `#d55181` | `#008300` / `#008300` |
| 7 | `#008300` / `#008300` | `#008300` / `#008300` | `#6250d6` / `#9085e9` |
| 8 | `#e34948` / `#e66767` | `#e34948` / `#e66767` | `#e34948` / `#e66767` |

- Charts that compare every series against every other (map, scatter, small multiples) use **at most 3 series**. Anything beyond that goes into "Other".
- Sequential (magnitude, e.g. the traffic map): one hue, light → dark, built from slot 1's hue.
- Chart marks: 2px lines, 4px rounded bar ends, a 2px surface-colored gap between fills, recessive gridlines, a crosshair + tooltip on hover, a legend for ≥ 2 series.

### Shape

| Token | Value | Use |
|---|---|---|
| `--radius-card` | 24px | Cards (benchmark ≈ 22–24px) |
| `--radius-inner` | 16px | Images, inner panels, inputs |
| `--radius-control` | 999px | Pills, nav, buttons, badges |
| Spacing | 4px grid; card padding 20px; grid gap 16px (24px ≥ 1280px wide) | |
| `--shadow-card` (light) | `0 1px 2px rgb(20 21 31/.04), 0 8px 24px rgb(80 70 140/.08)` | Dark mode uses `--border` + surface lift instead |
| Glass (header, sidebar) | surface at 72% + `backdrop-filter: blur(16px)` | Header and sidebar only. Blur is expensive, so never on cards |

### Type (Geist Sans, self-hosted)

| Token | Size / line height | Weight | Tracking |
|---|---|---|---|
| `display` (page title) | 40 / 44 | 600 | -0.02em |
| `kpi` (hero numbers) | 32 / 36 | 600 | -0.01em |
| `title` (card title) | 16 / 22 | 600 | 0 |
| `body` | 14 / 20 | 400 | 0 |
| `label` (axis, badge) | 12 / 16 | 500 | 0 |

Use `tabular-nums` only where digits must line up vertically: tables, axis ticks, live-ticking values.

### Motion

| Token | Value | Use |
|---|---|---|
| `--duration-exit` | 150ms | Old content leaves |
| `--duration-enter` | 210ms | New content fades in, after exit |
| `--duration-move` | 400ms | Morphs, slides |
| `spring.ui` | `{ type: "spring", bounce: 0.2, duration: 0.45 }` | Nav pill, sidebar, toggles |
| `spring.enter` | `{ type: "spring", bounce: 0, duration: 0.5 }` | Card stagger (60ms apart) |
| Hover lift | `y: -4` | Cards |
| Count-up | 1.2s, ease `[0.16, 1, 0.3, 1]` | KPIs (first visit), live ticks |
| Theme switch | 280ms whole-page crossfade, ease-out | Opacity only. The earlier circle reveal used `clip-path`, which repaints every frame and stuttered near the end |

## Validation

- **Charts:** `validate_palette.js` on all six palettes (3 directions × 2 themes), against our real surfaces (`#ffffff` light, `#1b1c26` dark). All pass. The worst adjacent colorblind-separation score was 8.4–15.3 (target ≥ 8). The first three slots also pass when every pair is compared.
  - Kiln and Margin initially **failed** in dark mode because red sat next to yellow (normal-vision difference 13.0, below the 15 floor). Moving yellow up fixed it.
- **Known contrast exception:** aqua, magenta and yellow are below 3:1 on white. Charts that use them must show visible direct labels or offer a table view.
- **Text contrast:** all text tokens are ≥ 4.5:1 on their surface. Kiln's light accent was darkened from 4.30:1 to 4.67:1 so small white text on it passes AA.
