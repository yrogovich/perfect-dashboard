import { cacheLife } from "next/cache";

// Google PageSpeed Insights v5: Lighthouse lab run + CrUX field data (real
// Chrome users, p75 over 28 days). Works without a key at low volume;
// PAGESPEED_API_KEY raises the quota.

export type MetricKey = "lcp" | "inp" | "cls" | "fcp" | "ttfb" | "tbt";
export type Rating = "good" | "needs-improvement" | "poor";
export type Metric = { key: MetricKey; label: string; value: number; display: string; rating: Rating; good: number; poor: number };
export type PageSpeed = {
  url: string;
  score: number; // Lighthouse performance 0–100 (lab, mobile)
  source: "url" | "origin" | "lab"; // where the metric values come from
  metrics: Metric[];
  fetchedAt: string;
};

// web.dev Core Web Vitals thresholds.
const thresholds: Record<MetricKey, { label: string; good: number; poor: number; unit: "ms" | "s" | "" }> = {
  lcp: { label: "Largest Contentful Paint", good: 2500, poor: 4000, unit: "s" },
  inp: { label: "Interaction to Next Paint", good: 200, poor: 500, unit: "ms" },
  cls: { label: "Cumulative Layout Shift", good: 0.1, poor: 0.25, unit: "" },
  fcp: { label: "First Contentful Paint", good: 1800, poor: 3000, unit: "s" },
  ttfb: { label: "Time to First Byte", good: 800, poor: 1800, unit: "s" },
  tbt: { label: "Total Blocking Time (lab)", good: 200, poor: 600, unit: "ms" },
};

function metric(key: MetricKey, value: number): Metric {
  const t = thresholds[key];
  const rating: Rating = value <= t.good ? "good" : value <= t.poor ? "needs-improvement" : "poor";
  const display =
    t.unit === "s" ? `${(value / 1000).toFixed(1)} s` : t.unit === "ms" ? `${Math.round(value)} ms` : value.toFixed(2);
  return { key, label: t.label, value, display, rating, good: t.good, poor: t.poor };
}

type CruxMetric = { percentile: number };
type Crux = { metrics?: Record<string, CruxMetric> };

function fromCrux(crux: Crux | undefined) {
  const m = crux?.metrics;
  if (!m?.LARGEST_CONTENTFUL_PAINT_MS || !m.CUMULATIVE_LAYOUT_SHIFT_SCORE) return null;
  const out = [
    metric("lcp", m.LARGEST_CONTENTFUL_PAINT_MS.percentile),
    // CrUX reports CLS multiplied by 100.
    metric("cls", m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100),
  ];
  if (m.INTERACTION_TO_NEXT_PAINT) out.splice(1, 0, metric("inp", m.INTERACTION_TO_NEXT_PAINT.percentile));
  if (m.FIRST_CONTENTFUL_PAINT_MS) out.push(metric("fcp", m.FIRST_CONTENTFUL_PAINT_MS.percentile));
  if (m.EXPERIMENTAL_TIME_TO_FIRST_BYTE) out.push(metric("ttfb", m.EXPERIMENTAL_TIME_TO_FIRST_BYTE.percentile));
  return out;
}

export type PageSpeedResult = { ok: true; data: PageSpeed } | { ok: false; reason: "quota" | "unavailable" };

// Never throws: a throw inside "use cache" fails the prerender and the build.
// Failures use the short `seconds` profile, which Next leaves out of the
// prerender, so the card resolves (and retries) at request time instead.
export async function getPageSpeed(url: string): Promise<PageSpeedResult> {
  "use cache";
  try {
    const data = await runPageSpeed(url);
    cacheLife("hours");
    return { ok: true, data };
  } catch (e) {
    cacheLife("seconds");
    return { ok: false, reason: e instanceof QuotaError ? "quota" : "unavailable" };
  }
}

class QuotaError extends Error {}

async function runPageSpeed(url: string): Promise<PageSpeed> {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("category", "performance");
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);

  const res = await fetch(api, { signal: AbortSignal.timeout(60_000) });
  // Without a key, every caller shares one daily quota, which is often used up.
  if (res.status === 429) throw new QuotaError("PageSpeed Insights quota exceeded");
  if (!res.ok) throw new Error(`PageSpeed Insights responded ${res.status}`);
  const data = await res.json();

  const audits = data.lighthouseResult.audits;
  const field = fromCrux(data.loadingExperience);
  const origin = field ? null : fromCrux(data.originLoadingExperience);
  const lab = [
    metric("lcp", audits["largest-contentful-paint"].numericValue),
    metric("tbt", audits["total-blocking-time"].numericValue),
    metric("cls", audits["cumulative-layout-shift"].numericValue),
    metric("fcp", audits["first-contentful-paint"].numericValue),
  ];

  return {
    url,
    score: Math.round(data.lighthouseResult.categories.performance.score * 100),
    source: field ? "url" : origin ? "origin" : "lab",
    metrics: field ?? origin ?? lab,
    fetchedAt: data.analysisUTCTimestamp,
  };
}
