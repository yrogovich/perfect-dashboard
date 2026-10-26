"use client";

import { useRef, useState, type ReactNode, type PointerEvent } from "react";

type Tip = { x: number; y: number; name: string; value?: string };

// One delegated listener for ~170 country paths, instead of a component each.
export function MapHover({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  function onMove(e: PointerEvent) {
    const target = e.target as Element;
    const name = target.getAttribute("data-name");
    if (!name) return setTip(null);
    const box = ref.current!.getBoundingClientRect();
    setTip({ x: e.clientX - box.left, y: e.clientY - box.top, name, value: target.getAttribute("data-value") ?? undefined });
  }

  return (
    <div ref={ref} className="relative" onPointerMove={onMove} onPointerLeave={() => setTip(null)}>
      {children}
      {tip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-popover px-3 py-2 text-xs text-popover-foreground shadow-card"
          style={{ transform: `translate(${tip.x + 12}px, ${tip.y - 12}px)`, left: 0, top: 0 }}
        >
          <div className="font-medium">{tip.name}</div>
          <div className="text-muted-foreground">{tip.value ? `${tip.value} visitors` : "No visitors"}</div>
        </div>
      )}
    </div>
  );
}
