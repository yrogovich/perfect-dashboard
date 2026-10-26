"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { CountUp } from "@/components/count-up";
import { useLive } from "@/components/live";
import { StaggerItem } from "@/components/stagger";
import { liveVisitors, ranges, traffic, type Range } from "@/lib/mock";
import { Delta, Panel } from "./panel";
import { RangeSwitch } from "./range-switch";

// Recharts is the heaviest dependency; keep it out of the initial bundle.
const TrafficChart = lazy(() => import("./traffic-chart").then((m) => ({ default: m.TrafficChart })));
const chartFallback = <div className="h-[260px] animate-pulse rounded-inner bg-muted" />;

function Kpi({ label, value, delta, suffix, live }: { label: string; value: number; delta?: number; suffix?: string; live?: boolean }) {
  return (
    <StaggerItem className="col-span-6 rounded-card bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover xl:col-span-3">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        {live && (
          <span className="relative flex size-2" aria-hidden>
            <span className="ping absolute inset-0 rounded-full bg-status-good" />
            <span className="relative size-2 rounded-full bg-status-good" />
          </span>
        )}
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[32px] leading-9 font-semibold tracking-tight">
          <CountUp value={value} />
          {suffix && <span className="ml-0.5 text-lg text-muted-foreground">{suffix}</span>}
        </span>
        {delta !== undefined && <Delta value={delta} />}
      </div>
    </StaggerItem>
  );
}

export function OverviewMetrics() {
  const [range, setRange] = useState<Range>("30d");
  const { tick } = useLive();
  const base = useMemo(() => traffic(range), [range]);

  // Live ticks add today's new views to the last point and the total.
  const liveViews = tick * 7;
  const series = useMemo(() => {
    if (!liveViews) return base.series;
    const last = base.series.at(-1)!;
    return [...base.series.slice(0, -1), { ...last, views: last.views + liveViews, visitors: last.visitors + Math.round(liveViews * 0.6) }];
  }, [base, liveViews]);

  return (
    <>
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] leading-[44px] font-semibold tracking-[-0.02em]">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">How your content is doing across every channel.</p>
        </div>
        <RangeSwitch value={range} onChange={setRange} options={ranges} />
      </div>

      <Kpi label="Page views" value={base.views + liveViews} delta={base.viewsDelta} />
      <Kpi label="Unique visitors" value={base.visitors + Math.round(liveViews * 0.6)} delta={base.visitorsDelta} />
      <Kpi label="Visitors right now" value={liveVisitors(tick)} live />
      <Kpi label="Avg. read time" value={base.readTime} suffix="s" delta={base.readTimeDelta} />

      <Panel title="Traffic" subtitle="Daily page views and unique visitors" className="col-span-12 xl:col-span-8">
        <Suspense fallback={chartFallback}>
          <TrafficChart data={series} />
        </Suspense>
      </Panel>
    </>
  );
}
