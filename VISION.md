# Perfect Dashboard — Vision & Motivation

> Status: **pre-code**. This document defines *why* and *what*. No implementation yet.

## Why

Most admin dashboards feel like spreadsheets with a sidebar: pages hard-cut between routes, charts pop in fully drawn, numbers just appear. It works, but it doesn't feel *alive*.

The modern web platform now makes something much better possible without heavy hacks:

- **View Transition API**: native, GPU-composited transitions between DOM states and routes. Shared elements (a card, a title, an avatar) can morph from one page to the next instead of disappearing and reappearing.
- **Motion (motion.dev, formerly Framer Motion)**: declarative React animation with springs, layout animations, `AnimatePresence`, stagger and gesture states (`whileHover`, `whileTap`).
- **Tailwind CSS + shadcn/ui**: fast, consistent styling with accessible primitives that we own as source code, not as a black-box dependency.
- **A chart library** that animates on mount and on data change, not just on first paint.

The goal is to prove that a dashboard can be **beautiful, animated *and* fast**. Animation should make the UI easier to follow, not slow it down.

## What we're building first: a demo

We start with a **visual/interaction demo**, not a product:

- No real backend, auth or database. Mock data only, possibly with a fake "live" ticker.
- 3–4 pages, enough to show off route transitions.
- Done when it *looks and feels* like the benchmark and passes the performance bar below.

The demo is a testbed for answering:
1. Can View Transitions + Motion work together without fighting each other?
2. Which chart library animates well and stays smooth?
3. What's the performance cost, and is it acceptable on a mid-range laptop and phone?

## Benchmark (reference video)

Reference: `~/Downloads/@r07qxo - R⤓Download.MP4` (6 s, vertical, "Dashboard V15").

What it shows and what we want to match:

| Observed in video | What it means for us |
|---|---|
| Light, airy UI on a soft lavender/pink gradient background; white rounded cards (~20–24px radius), subtle shadows | Design language: soft glass/neumorphic-lite, lots of whitespace |
| Pill-shaped top nav with a dark "active" pill (Dashboard / Project / Clients / …) | Active indicator should **slide** between tabs (shared layout animation) |
| Narrow icon rail on the left | Secondary navigation, icon-only |
| Cards **stagger in** (fade + rise) when a page appears | Motion stagger on page enter |
| KPI numbers **count up** (e.g. 478 → 1,229 → 1,364) with small green/red delta badges | Animated number tickers |
| Line/area chart **draws in** left to right; dense bar/area hybrid | Chart enter animations |
| Gauge (orange half-donut) and a strong orange accent card ("Manage Quotes") | One bold accent color against a neutral palette |
| Whole layout **morphs** between screens (Dashboard → "Ember" CRM view → "Word library") | Page-to-page transitions via the View Transition API, ideally with shared elements |
| Code overlay shows `motion.div whileHover={{ y: -5 }}` on `glass-card` | Cards lift on hover |

## Decisions (2026-10-26)

| Question | Decision |
|---|---|
| Framework | Next.js App Router, static-first |
| Fidelity | **Inspired by** the benchmark: same feel, our own brand name, accent and layout details |
| Mock data | **Content/CMS analytics** (posts, views, authors, publishing), which lines up with future Payload use |
| Devices | **Desktop-first**; mobile responsive and usable, less refined |
| Live feel | **Light ticking**: a few KPIs and one chart update every few seconds, with a pause toggle |
| Dark mode | **Yes**, with a short crossfade when switching (the circle reveal was dropped on 2026-10-26: it stuttered and didn't look right) |
| Hosting | **Vercel**, so we get preview URLs and Lighthouse runs on a real URL |
| Enter animations | **First visit only**; revisits restore the kept page as it was (see `SPIKE.md`) |
| Brand | **Pretty CMS**, using the Kiln palette: ember accent `#d24100` on cool lavender (see `DESIGN_TOKENS.md`) |
| Scope additions | Sidebar (compact/wide), traffic map, Core Web Vitals, AI readiness, scheduled posts |

## Principles

1. **Motion with purpose.** Every animation explains a change: where something came from, where it went, what's new. No decoration-only loops.
2. **Performance is a feature.** Animate only `transform`, `opacity` and `clip-path`; no layout thrash. Target 60fps, ideally 120fps on ProMotion screens.
3. **Respect the user.** Full `prefers-reduced-motion` support. Keyboard navigable. Visible focus. Accessible charts (labels, tooltips, contrast).
4. **Instant feel.** Navigation should respond in under 100 ms. Transitions must never block interaction.
5. **Light and dark themes** from day one (shadcn tokens).

## Performance bar (demo acceptance)

- Lighthouse Performance ≥ 95 on desktop, ≥ 90 on mobile
- LCP < 1.5 s, CLS ≈ 0, INP < 100 ms
- No dropped frames during route transitions in Chrome DevTools performance trace (mid-range laptop)
- Initial JS bundle kept small: code-split per route, load chart libraries lazily

## Proposed stack (to be confirmed)

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router), static-first** | Decided, see below |
| UI | React 19 + TypeScript | |
| Styling | Tailwind CSS v4 + shadcn/ui | |
| Animation | Motion (`motion/react`) | Component-level and layout animations |
| Page transitions | View Transition API | Route and shared-element morphs; fall back gracefully in browsers without support |
| Charts | shadcn Charts (Recharts) as the default candidate | Benchmark against alternatives (e.g. visx, ECharts) if animation or perf falls short |
| Icons | lucide-react | |

### Next.js or not?

**Decision: Next.js (App Router), static-first.**

- **Payload CMS 3 installs directly into a Next.js app.** If we may reuse this for Payload later, starting on Next means the dashboard can move over with little rework instead of being ported.
- Next and React both support View Transitions, though at time of writing some of this is still flagged experimental. The first task of the demo is to verify how stable it is today.
- For a demo with mock data, Next costs us little: we can render pages statically, so there's no server overhead.

**Considered and rejected for now: Vite + React + TanStack Router.** It's simpler and faster to iterate on, but would mean migrating to Next later for Payload.

Either way, keep the dashboard components **framework-agnostic**: plain React + Tailwind + Motion, with no framework-specific APIs inside the components. That keeps the choice reversible.

## Additions (accepted 2026-10-26: sidebar + all four widgets with mock data; PageSpeed Insights is the one real integration)

### Sidebar: compact and wide
- **Wide** (~240px): icon + label + section groups (Content, Analytics, Settings), workspace switcher, a usage meter at the bottom.
- **Compact** (~72px): icon rail like the benchmark, with tooltips on hover.
- Toggle via button and `⌘B`, remembered per viewer. Below 1024px it becomes an off-canvas drawer.
- shadcn's `Sidebar` component already has an icon-only collapsed mode, so we start from it.
- **Animation:** animating width causes layout reflow, which breaks our transform-only rule. Instead the content column slides with a transform while the rail grows, and labels fade/slide in (Motion). The active item uses a shared `layoutId` highlight, like the nav pill.
- **Role split:** the sidebar becomes the page navigation. The top pill nav switches views within a page (e.g. Overview: Traffic / Content / SEO). This removes the duplication between the two.

### Widgets
| Widget | What it shows | Data in the demo | Real source later |
|---|---|---|---|
| **Traffic map** | Visitors by country (sequential shading) + pulsing "live" dots per city; hover shows a tooltip, click filters the dashboard | Mock, seeded, light ticking | Plausible / Umami / GA4 Data API / Cloudflare Web Analytics |
| **PageSpeed / Core Web Vitals** | LCP, INP, CLS as gauges against the good/needs-improvement/poor thresholds; Lighthouse category scores; 28-day trend line | **Could be real**: the PageSpeed Insights API is free and returns lab scores *and* CrUX field data from real users | Same API, or the CrUX API for history |
| **AI readiness score** | One 0–100 score + a checklist: `llms.txt`, JSON-LD structured data, AI-crawler rules in robots.txt (GPTBot, ClaudeBot, PerplexityBot…), heading structure, meta descriptions, alt text, content freshness. Per site and per post | Mock score + checklist | Our own checker that fetches the site and parses these signals (a small server route) |
| **Scheduled posts / editorial calendar** | Week strip or list of upcoming posts with status; drag to reschedule (Motion `Reorder`/layout); to-do items attached to posts | Mock | Payload's drafts and scheduled publishing |

### Other integrations worth considering
- **Google Search Console**: queries, clicks, CTR, average position per post. Pairs well with the AI readiness score.
- **Vercel deployments / build status**: shows which content went live.
- **Uptime / error rate**: a small status tile.
- **Newsletter stats** (e.g. Resend, Beehiiv): sends, opens, clicks per post.

**Recommendation for the demo:** build all four widgets plus the sidebar with **mock data**. Make PageSpeed Insights the **one real integration**: it needs no account (just an optional API key), and it shows that the dashboard handles real async data without breaking the animations. Everything else stays mock until the Payload phase.

## Out of scope (for the demo)

- Real data, APIs, auth, multi-tenancy
- Payload CMS integration (future phase)
- Complex editing, tables with CRUD, forms beyond a search box
- i18n

## Future (not now)

- Reuse as a Payload CMS admin/dashboard surface
- Real-time data (WebSocket/SSE) with animated updates
- Component library extracted from the demo
