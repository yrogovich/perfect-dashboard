"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

const format = (n: number) => Math.round(n).toLocaleString("en-US");

// Writes to the DOM directly so ticking doesn't re-render React every frame.
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current!;
    if (reduced) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(from.current, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = format(v)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, reduced]);

  return (
    <span aria-label={format(value)} className="tabular-nums">
      <span ref={ref} aria-hidden>
        {format(0)}
      </span>
    </span>
  );
}
