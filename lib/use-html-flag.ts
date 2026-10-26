"use client";

import { useSyncExternalStore } from "react";

// Reads state that lives on <html> (theme class, sidebar mode) and is set
// before paint by the inline script, so the server snapshot is the default.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-sidebar"] });
  return () => observer.disconnect();
}

export function useHtmlFlag(read: (root: HTMLElement) => boolean) {
  return useSyncExternalStore(
    subscribe,
    () => read(document.documentElement),
    () => false,
  );
}
