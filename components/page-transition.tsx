import { ViewTransition, type ReactNode } from "react";

// Directional slide on typed navigations; no animation for untyped ones
// (browser back/forward, refresh). Must wrap each page, not the layout.
const directional = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      <main className="mx-auto w-full max-w-[1400px] px-6 pt-4 pb-16">{children}</main>
    </ViewTransition>
  );
}
