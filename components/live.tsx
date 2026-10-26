"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

const TICK_MS = 3000;

type Live = { tick: number; paused: boolean; toggle: () => void };
const LiveContext = createContext<Live>({ tick: 0, paused: true, toggle: () => {} });

// Fake real-time feed: a counter that advances every few seconds while the
// tab is visible, not paused, and the viewer hasn't asked for reduced motion.
export function LiveProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = useReducedMotion();
  const paused = userPaused || !!reduced;

  useEffect(() => {
    if (paused) return;
    let id: number | undefined;
    const start = () => {
      stop();
      if (document.visibilityState === "visible") id = window.setInterval(() => setTick((t) => t + 1), TICK_MS);
    };
    const stop = () => window.clearInterval(id);
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", start);
    };
  }, [paused]);

  return (
    <LiveContext.Provider value={{ tick, paused, toggle: () => setUserPaused((p) => !p) }}>
      {children}
    </LiveContext.Provider>
  );
}

export const useLive = () => useContext(LiveContext);
