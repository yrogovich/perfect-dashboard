"use client";

import { Moon, Sun } from "lucide-react";
import { isolatedTransition } from "@/lib/isolated-transition";
import { useHtmlFlag } from "@/lib/use-html-flag";

export function ThemeToggle() {
  const isDark = useHtmlFlag((root) => root.classList.contains("dark"));

  // A short whole-page crossfade (opacity only, so it stays on the compositor;
  // the old clip-path circle repainted the full screen every frame and stuttered).
  function toggle() {
    const root = document.documentElement;
    isolatedTransition("vt-theme", () => {
      const next = !root.classList.contains("dark");
      root.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center rounded-full bg-card text-foreground shadow-card outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
