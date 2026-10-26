import { flushSync } from "react-dom";

// A document-level view transition that isn't a navigation (theme, sidebar).
// `.vt-isolated` strips every other view-transition-name so only what the
// given class names animates. Only the latest transition may clear the
// classes; a rapid second call otherwise lets the first one's cleanup strip
// them mid-animation. A skipped transition is already over, so its classes
// are swapped for the new one's; mixing kinds (theme during a sidebar
// toggle) can't leave one behind.
let active: ViewTransition | null = null;
let classes: string[] = [];

export function isolatedTransition(
  className: string,
  update: () => void,
  onReady?: () => void,
) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) return update();

  const root = document.documentElement;
  // Finish any running one instantly (its update still applies).
  active?.skipTransition();
  root.classList.remove(...classes);
  classes = ["vt-isolated", className];
  root.classList.add(...classes);
  const transition = document.startViewTransition(() => flushSync(update));
  active = transition;
  transition.ready.then(() => onReady?.()).catch(() => {}); // skipped by a newer call or a navigation
  transition.finished.finally(() => {
    if (active !== transition) return;
    active = null;
    root.classList.remove(...classes);
    classes = [];
  });
}
