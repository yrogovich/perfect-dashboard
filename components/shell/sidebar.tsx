"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { isolatedTransition } from "@/lib/isolated-transition";
import { useHtmlFlag } from "@/lib/use-html-flag";
import { directionTo, navIndex, navItems } from "./nav";

export function toggleSidebar() {
  const root = document.documentElement;
  const next = root.dataset.sidebar === "compact" ? "wide" : "compact";
  isolatedTransition("vt-sidebar", () => {
    root.dataset.sidebar = next;
    try {
      localStorage.setItem("sidebar", next);
    } catch {}
  });
}

export function closeDrawer() {
  delete document.documentElement.dataset.drawer;
}

export function Sidebar() {
  const pathname = usePathname();
  const current = navIndex(pathname);
  const compact = useHtmlFlag((root) => root.dataset.sidebar === "compact");

  return (
    <>
    <button aria-label="Close menu" tabIndex={-1} onClick={closeDrawer} className="drawer-backdrop fixed inset-0 z-30 hidden bg-black/30 lg:hidden" />
    <aside className="app-sidebar fixed top-3 bottom-3 left-3 z-40 flex flex-col overflow-hidden rounded-card bg-glass p-3 shadow-card backdrop-blur-xl">
      <div className="mb-6 flex h-12 items-center gap-3 px-1.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <span className="sidebar-label text-lg font-semibold tracking-tight whitespace-nowrap">Pretty CMS</span>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
        {navItems.map((item, i) => {
          const active = i === current;
          const Icon = item.icon;
          return (
            <Tooltip key={item.href} disabled={!compact}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    transitionTypes={directionTo(current, i)}
                    onClick={closeDrawer}
                    aria-current={active ? "page" : undefined}
                    aria-label={compact ? item.label : undefined}
                    className={`relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                      active ? "text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    } ${i === navItems.length - 1 ? "mt-auto" : ""}`}
                  />
                }
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-foreground"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                  />
                )}
                <Icon className="relative size-5 shrink-0" aria-hidden />
                <span className="sidebar-label relative">{item.label}</span>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        aria-label={compact ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
        className="mt-3 hidden h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:flex"
      >
        {compact ? <PanelLeftOpen className="size-5 shrink-0" aria-hidden /> : <PanelLeftClose className="size-5 shrink-0" aria-hidden />}
        <span className="sidebar-label">Collapse</span>
        <kbd className="sidebar-label ml-auto rounded-md bg-muted px-1.5 text-xs">⌘B</kbd>
      </button>
    </aside>
    </>
  );
}
