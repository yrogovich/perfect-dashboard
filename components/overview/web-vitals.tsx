import { Suspense, ViewTransition } from "react";
import { CircleAlert, CircleCheck, CircleX, ExternalLink } from "lucide-react";
import type { Metric, PageSpeed, PageSpeedResult, Rating } from "@/lib/pagespeed";
import { Panel } from "./panel";

const rating: Record<Rating, { icon: typeof CircleCheck; label: string; text: string; fill: string }> = {
  good: { icon: CircleCheck, label: "Good", text: "text-status-good", fill: "var(--status-good)" },
  "needs-improvement": { icon: CircleAlert, label: "Needs work", text: "text-status-warning", fill: "var(--status-warning)" },
  poor: { icon: CircleX, label: "Poor", text: "text-status-critical", fill: "var(--status-critical)" },
};

const sourceLabel: Record<PageSpeed["source"], string> = {
  url: "Real users of this page · p75, last 28 days (CrUX)",
  origin: "Real users of this site · p75, last 28 days (CrUX)",
  lab: "Lab run · Lighthouse, mobile (no field data yet)",
};

// Good / needs-improvement / poor bands with a marker at the measured value.
function ThresholdBar({ m }: { m: Metric }) {
  const max = m.poor * 1.5;
  const at = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  return (
    <div className="relative mt-1.5 h-1.5" aria-hidden>
      <div className="absolute inset-0 flex gap-0.5 overflow-hidden rounded-full">
        <span className="h-full bg-status-good/35" style={{ width: at(m.good) }} />
        <span className="h-full bg-status-warning/35" style={{ width: `calc(${at(m.poor)} - ${at(m.good)})` }} />
        <span className="h-full flex-1 bg-status-critical/35" />
      </div>
      <span
        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card"
        style={{ left: at(m.value), background: rating[m.rating].fill }}
      />
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const color = score >= 90 ? "var(--status-good)" : score >= 50 ? "var(--status-warning)" : "var(--status-critical)";
  return (
    <div className="relative grid size-28 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
      </svg>
      <div className="text-center">
        <div className="text-[32px] leading-9 font-semibold tracking-tight">{score}</div>
        <div className="text-[11px] text-muted-foreground">Performance</div>
      </div>
    </div>
  );
}

async function Vitals({ result }: { result: Promise<PageSpeedResult> }) {
  const res = await result;
  if (!res.ok) {
    return (
      <div className="flex gap-3 rounded-inner bg-muted p-4 text-sm">
        <CircleAlert className="mt-0.5 size-4 shrink-0 text-status-warning" aria-hidden />
        <div>
          <p className="font-medium">No live results right now</p>
          <p className="mt-1 text-muted-foreground">
            {res.reason === "quota"
              ? "The shared PageSpeed Insights quota is used up for today. Add a free PAGESPEED_API_KEY to load live results."
              : "PageSpeed Insights didn't respond. It'll retry on the next visit."}
          </p>
        </div>
      </div>
    );
  }
  const data = res.data;

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      <ScoreRing score={data.score} />
      <div className="min-w-0 flex-1">
        <p className="mb-3 text-xs text-muted-foreground">{sourceLabel[data.source]}</p>
        <ul className="flex flex-col gap-3.5">
          {data.metrics.map((m) => {
            const r = rating[m.rating];
            return (
              <li key={m.key}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="truncate">{m.label}</span>
                  <span className="ml-auto font-semibold tabular-nums">{m.display}</span>
                  <span className={`flex w-24 items-center justify-end gap-1 text-xs ${r.text}`}>
                    <r.icon className="size-3.5" aria-hidden />
                    {r.label}
                  </span>
                </div>
                <ThresholdBar m={m} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function VitalsSkeleton() {
  return (
    <div className="flex animate-pulse gap-5" aria-label="Loading PageSpeed results">
      <div className="size-28 rounded-full bg-muted" />
      <div className="flex flex-1 flex-col gap-4 pt-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-5 rounded-full bg-muted" />
        ))}
      </div>
    </div>
  );
}

// The host app supplies the data, so the widget has no framework or fetching dependency.
export function WebVitals({ url, result }: { url: string; result: Promise<PageSpeedResult> }) {
  const host = new URL(url).host;
  return (
    <Panel
      title="Core Web Vitals"
      subtitle={
        <a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
          {host} · live from PageSpeed Insights <ExternalLink className="size-3" aria-hidden />
        </a>
      }
      className="col-span-12 xl:col-span-7"
    >
      <Suspense
        fallback={
          <ViewTransition exit="slide-down" default="none">
            <VitalsSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" default="none">
          <Vitals result={result} />
        </ViewTransition>
      </Suspense>
    </Panel>
  );
}
