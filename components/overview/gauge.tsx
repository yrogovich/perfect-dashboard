"use client";

import { motion, useReducedMotion } from "motion/react";

// Half-donut gauge. The arc draws in with pathLength (a transform-free SVG
// stroke animation) the first time it mounts.
export function Gauge({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  const reduced = useReducedMotion();
  const arc = "M 12 100 A 88 88 0 0 1 188 100";
  const ratio = Math.min(1, value / max);

  return (
    <svg viewBox="0 0 200 112" className="w-full max-w-[240px]" role="img" aria-label={`${label}: ${value} of ${max}`}>
      <path d={arc} fill="none" stroke="var(--muted)" strokeWidth={18} strokeLinecap="round" />
      <motion.path
        d={arc}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={18}
        strokeLinecap="round"
        initial={{ pathLength: reduced ? ratio : 0 }}
        animate={{ pathLength: ratio }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </svg>
  );
}
