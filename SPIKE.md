# Spike: View Transitions + Motion + Next.js App Router

> Step 1 of `KICKOFF_PROMPT.md`. Date: 2026-10-26. Verdict: **the stack works together. Proceed to step 2 (design tokens).**

## Versions installed

| Package | Version | Notes |
|---|---|---|
| next | 16.4.3 | Latest stable. Scaffold enables `cacheComponents` and `partialPrefetching` by default |
| react / react-dom | 19.3.0 | `<ViewTransition>` and `addTransitionType` are **stable** exports (no canary needed) |
| motion | 14.6.0 | `motion/react` |
| tailwindcss | 4.x | CSS-first config, no `tailwind.config` |
| geist | 1.8.2 | Self-hosted font (replaces `next/font/google`, see below) |

## Is anything still experimental?

**No.** Next 16's guide states view transitions work in the App Router *with no configuration*. `<Link transitionTypes={[...]}>` has been a stable prop since 16.2. Browser support: Chromium 125+ and recent Safari and Firefox. Without support, pages simply swap with no animation; nothing breaks. Next notes some animations may look different in Safari, so we should check Safari in step 3.

## What was built (deliberately unstyled)

- `/` Overview: KPI cards with Motion stagger, count-up numbers and hover lift
- `/posts` Content: grid of post cards
- `/posts/[id]` Detail: hero cover and title, prerendered with `generateStaticParams`
- Shared header: Motion `layoutId` nav pill, theme toggle

## Results (production build, local, Chrome in the app's browser pane)

| Test | Result |
|---|---|
| Directional slide (`nav-forward` / `nav-back` via `Link transitionTypes`) | ✅ Correct type each time; header stays anchored |
| Shared-element morph, card → detail (cover **and** title) | ✅ Pairs form: `post-cover-*`, `post-title-*` |
| Morph back, detail → grid | ✅ Pairs form, plus `nav-back` slide |
| Motion `layoutId` nav pill *during* a view transition | ✅ Slides smoothly across ~15 frames with a slight spring overshoot |
| Theme toggle (circular reveal via `document.startViewTransition`) | ✅ Only `root` animates; named elements are suppressed during the toggle |
| Theme persists across reload, no flash | ✅ Inline pre-paint script |
| Click → transition start | 1–13 ms |
| Full transition duration | ~430–465 ms (matches the CSS: 150 ms exit + 400 ms move) |
| LCP / CLS on Overview (local, no throttling) | 60 ms / 0. Not representative; real numbers come from Vercel + Lighthouse in step 5 |
| `tsc`, `eslint`, `next build` | ✅ Clean. All routes prerendered |

## Findings that shape the next steps

1. **Who owns which animation works as planned.** React `<ViewTransition>` handles routes and shared elements. Motion handles in-page animation. A manual `startViewTransition` handles the theme toggle. They didn't conflict in any test.

2. **Visited pages are kept alive, so enter animations don't replay.** When you return to a page, Next 16 (with `cacheComponents`) restores the existing page instead of re-mounting it. The grid reused the same view-transition ID (`_t_1_`), and KPIs showed their final value immediately instead of counting up again. This behaves like React `<Activity>` preserving the page; I observed it but haven't confirmed the mechanism.
   - **Upside:** morphs back into the grid never fly into an invisible card. The Motion stagger leaves cards at opacity 0 only on a first visit, so the risky case doesn't happen.
   - **Decided (2026-10-26): enter animations play on the first visit only.** This is the current behavior, so no extra code is needed. They also play again after a full reload, or if Next drops the kept page from memory. Live ticking still animates value changes on every visit.

3. **Theme toggle needs its own guard.** During a manual `startViewTransition`, statically named elements (the header) would otherwise crossfade separately from the circle reveal. A temporary `.theme-transition` class sets `view-transition-name: none` on them. Without this, the reveal looks broken.

4. **Name only what morphs.** Each shared element needs `share="morph" default="none"`. Otherwise every named element crossfades on every unrelated transition, as the Next docs warn. Keep the count of named elements small, since each one is a separate snapshot layer.

5. **Count-up writes to the DOM, not React state.** `animate()` + `onUpdate` sets `textContent`, so there's no re-render per frame. The final value is exposed through `aria-label`. This is the pattern to use for live ticking.

6. **Motion also ships `animateView`** (`motion/react-animate-view`), its own View Transition helper. Not needed while React's `<ViewTransition>` covers routes, but it could replace the hand-written theme-toggle code later.

7. **Reusing components in Payload later.** In the spike, components import `next/link` directly. For the real build, pass the link component in as a small adapter (context or prop), so dashboard components contain no `next/*` imports.

## Not verified yet

- `prefers-reduced-motion` behavior. The CSS rules are in place, but the browser pane can't emulate this preference. Check it manually in DevTools during step 5.
- Safari and Firefox
- Performance under CPU throttling and on Vercel (step 5)
- Browser back/forward buttons. By design these carry no transition type, so there's no slide, but morphs should still apply. Not tested.

## Environment notes (this machine's sandbox, not the app)

- Point npm at a temp cache (`npm_config_cache=$TMPDIR/...`), because `~/.npm` isn't writable from the sandbox.
- `next build` / `next dev` need local port binding for Turbopack's CSS worker. Either run them outside the sandbox, or set `sandbox.network.allowLocalBinding: true`.
- `next/font/google` can't reach Google Fonts through the sandbox proxy. The self-hosted `geist` package avoids this, and it's better for production anyway (no fetch at build time).

## Files

- `app/layout.tsx`: shell, pre-paint theme script, anchored header
- `app/globals.css`: placeholder tokens and all view-transition CSS
- `components/page-transition.tsx`: per-page directional `<ViewTransition>`
- `components/post-cover.tsx`: shared-element pairs
- `components/top-nav.tsx`: Motion `layoutId` pill and `transitionTypes`
- `components/theme-toggle.tsx`: circular reveal
- `components/count-up.tsx`, `components/stagger.tsx`: Motion helpers
- `.claude/launch.json`: `prod` (port 3100) and `dev` (port 3101) preview configs
