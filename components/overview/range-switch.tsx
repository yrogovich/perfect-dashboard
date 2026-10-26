"use client";

import { motion } from "motion/react";
import type { Range } from "@/lib/mock";

const labels: Record<Range, string> = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

export function RangeSwitch({ value, onChange, options }: { value: Range; onChange: (r: Range) => void; options: Range[] }) {
  return (
    <div role="radiogroup" aria-label="Date range" className="flex gap-1 rounded-full bg-glass p-1 shadow-card backdrop-blur-xl">
      {options.map((r) => {
        const active = r === value;
        return (
          <button
            key={r}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(r)}
            className="relative rounded-full px-4 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {active && (
              <motion.span
                layoutId="range-pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
              />
            )}
            <span className={`relative ${active ? "text-background" : "text-muted-foreground"}`}>{labels[r]}</span>
          </button>
        );
      })}
    </div>
  );
}
