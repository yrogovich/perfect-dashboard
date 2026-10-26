"use client";

import { useEffect } from "react";
import { Bell, Menu, Pause, Play, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLive } from "@/components/live";
import { closeDrawer, toggleSidebar } from "./sidebar";

function openDrawer() {
  document.documentElement.dataset.drawer = "open";
}

const iconButton =
  "grid size-9 place-items-center rounded-full bg-card text-foreground shadow-card outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring";

export function Header() {
  const { paused, toggle } = useLive();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="site-header relative z-30 mx-auto flex w-full max-w-[1400px] items-center gap-3 px-6 pt-3 pb-3">
      <button onClick={openDrawer} aria-label="Open menu" className={`${iconButton} lg:hidden`}>
        <Menu className="size-4" />
      </button>

      <label className="flex h-10 w-full max-w-sm items-center gap-2 rounded-full bg-glass px-4 text-sm text-muted-foreground shadow-card backdrop-blur-xl focus-within:ring-2 focus-within:ring-ring">
        <Search className="size-4 shrink-0" aria-hidden />
        <input
          type="search"
          placeholder="Search posts, authors, pages"
          className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden rounded-full bg-glass px-3 py-1.5 text-xs text-muted-foreground shadow-card backdrop-blur-xl md:inline">
          Demo data
        </span>
        <button
          onClick={toggle}
          aria-pressed={!paused}
          aria-label={paused ? "Resume live updates" : "Pause live updates"}
          className="flex h-9 items-center gap-2 rounded-full bg-card px-3 text-xs font-medium shadow-card outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="relative flex size-2">
            {!paused && <span className="ping absolute inset-0 rounded-full bg-status-good" />}
            <span className={`relative size-2 rounded-full ${paused ? "bg-muted-foreground" : "bg-status-good"}`} />
          </span>
          {paused ? "Paused" : "Live"}
          {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
        </button>
        <button aria-label="Notifications, 3 unread" className={`${iconButton} relative`}>
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-card" />
        </button>
        <ThemeToggle />
        <span
          aria-label="Signed in as Mara Ilic"
          className="grid size-9 place-items-center rounded-full bg-chart-4 text-xs font-semibold text-white shadow-card"
        >
          MI
        </span>
      </div>
    </header>
  );
}
