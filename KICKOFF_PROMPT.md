# Kickoff Prompt (v2)

> All open questions are settled (see "Decisions" in `VISION.md`). Paste everything below the line into a fresh session to start the build.

---

Read `VISION.md` in this repo first. It's the source of truth for motivation, the benchmark, decisions and the performance bar.

## Goal
Build a **demo** content-analytics dashboard for a CMS. It should be *inspired by* the benchmark video, not a clone. Match its feel: soft gradient background, white rounded "glass" cards, pill nav with a sliding active state, one bold accent color, staggered card entrances, count-up KPIs, charts that draw in, and page transitions where elements morph between pages. Pick our own product name and accent color, and propose 2–3 options before building. This is a visuals, performance and usability demo. Use mock data only.

## Stack
- Next.js App Router, static-first (render pages statically; no server features needed for the demo). Deploy to Vercel.
- React 19, TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (init via the shadcn CLI; we own the components)
- Motion (`motion/react`) for component, layout and gesture animation
- View Transition API for route-to-route and shared-element transitions
- Charts: shadcn Charts (Recharts) by default
- lucide-react icons
- Check the latest stable versions before installing. Tell me if a feature we rely on (e.g. React/Next view transitions) is still experimental, and what the fallback is.

## Who owns which animation
- **View Transition API**: route changes, shared elements that persist across pages (page title, post card → post detail, nav), and the theme toggle (circular reveal from the toggle button).
- **Motion**: anything inside a page: stagger on enter, hover lift (`whileHover={{ y: -4 }}`), sliding nav pill (`layoutId`), number tickers, presence animations.
- **Chart library**: chart draw-in and tweens when data changes.
- Never let two systems animate the same element at the same time.

## Pages (mock content-analytics data)
1. **Overview**: KPI row (page views, published posts, active authors, avg. read time) with count-up numbers and delta badges; traffic area chart; "monthly publishing goal" gauge; accent CTA card ("New post"); top-posts list.
2. **Content**: grid of post cards (cover, title, author, status, views). Clicking a card **morphs it into the post detail page** (shared-element view transition). The detail page shows a per-post views chart, referrers and read-through rate.
3. **Analytics**: one large interactive chart with a range switcher (7d / 30d / 90d) that animates between datasets, plus breakdowns of traffic sources and devices.
4. **Authors**: a sparser page (author cards with mini sparklines) to show a transition into a lighter layout.

Shared shell: top pill nav, left icon rail, search, avatar, notifications, and an animated light/dark toggle.

**Live feel:** a few KPIs and the Overview traffic chart tick with fake updates every few seconds and tween to the new values. Add a visible pause/play toggle, and stop updates while the tab is hidden.

Generate mock data deterministically (seeded), so screenshots and Lighthouse runs are stable.

## Non-negotiables
- Desktop-first. Mobile must be responsive and usable, but doesn't need full motion polish.
- Light and dark themes via shadcn tokens. Both must look intentional, not inverted.
- Animate only `transform`, `opacity` and `clip-path`. No layout-triggering animation.
- `prefers-reduced-motion` turns transitions into simple fades or instant changes and pauses live ticking.
- Fall back gracefully in browsers without View Transition support.
- Keyboard nav and visible focus. Charts have accessible labels.
- Lazy-load chart code per route.
- Performance bar from `VISION.md` (Lighthouse ≥ 95 desktop / ≥ 90 mobile, CLS ≈ 0, INP < 100 ms, smooth transitions in a perf trace), measured on the Vercel preview URL.
- Keep dashboard components framework-agnostic (no `next/*` imports inside them) so they can move into Payload CMS later.

## How to work
1. **Spike first (no styling):** two routes, one shared element (card → detail) and the theme-toggle transition, to prove View Transitions + Motion + the App Router work together. Report what works, what's experimental, and any problems. Wait for my OK.
2. Propose the name, accent color and design tokens (colors, radius, shadows, gradient) for both themes. Wait for my OK.
3. Build the app shell and the Overview page to full polish. Deploy a preview and stop to show me.
4. Build Content (with the card → detail morph), Analytics and Authors.
5. Performance and accessibility pass with real measurements. Report the numbers against the bar.
