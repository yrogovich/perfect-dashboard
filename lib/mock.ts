// Deterministic demo data: the same seed renders the same dashboard on every
// load, so screenshots and Lighthouse runs are comparable.

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Range = "7d" | "30d" | "90d";
export const ranges: Range[] = ["7d", "30d", "90d"];
const rangeDays: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };

export type DayPoint = { date: string; views: number; visitors: number };

// 180 days so every range has a previous period to compare against.
const END = Date.UTC(2026, 9, 26);
const DAY = 86_400_000;
const days: DayPoint[] = (() => {
  const rand = mulberry32(42);
  return Array.from({ length: 180 }, (_, i) => {
    const t = END - (179 - i) * DAY;
    const weekday = new Date(t).getUTCDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.72 : 1;
    const trend = 2600 + i * 9;
    const spike = i === 152 || i === 153 ? 1.9 : 1; // a post that took off
    const views = Math.round(trend * weekend * spike * (0.88 + rand() * 0.24));
    const visitors = Math.round(views * (0.58 + rand() * 0.06));
    return { date: new Date(t).toISOString().slice(0, 10), views, visitors };
  });
})();

const sum = (points: DayPoint[], key: "views" | "visitors") => points.reduce((s, p) => s + p[key], 0);
const pct = (now: number, before: number) => Math.round(((now - before) / before) * 1000) / 10;

export function traffic(range: Range) {
  const n = rangeDays[range];
  const current = days.slice(-n);
  const previous = days.slice(-2 * n, -n);
  const views = sum(current, "views");
  const visitors = sum(current, "visitors");
  return {
    series: current,
    views,
    visitors,
    viewsDelta: pct(views, sum(previous, "views")),
    visitorsDelta: pct(visitors, sum(previous, "visitors")),
    readTime: 252 + n, // seconds
    readTimeDelta: range === "7d" ? -2.1 : 4.6,
  };
}

// Numeric ISO 3166-1 ids, matching world-atlas.
export const countries = [
  { id: "840", name: "United States", visitors: 18420 },
  { id: "276", name: "Germany", visitors: 9310 },
  { id: "826", name: "United Kingdom", visitors: 8125 },
  { id: "356", name: "India", visitors: 6740 },
  { id: "124", name: "Canada", visitors: 4210 },
  { id: "250", name: "France", visitors: 3980 },
  { id: "528", name: "Netherlands", visitors: 3120 },
  { id: "616", name: "Poland", visitors: 2890 },
  { id: "076", name: "Brazil", visitors: 2610 },
  { id: "036", name: "Australia", visitors: 2270 },
  { id: "392", name: "Japan", visitors: 1980 },
  { id: "724", name: "Spain", visitors: 1740 },
  { id: "752", name: "Sweden", visitors: 1490 },
  { id: "804", name: "Ukraine", visitors: 1320 },
  { id: "380", name: "Italy", visitors: 1210 },
  { id: "484", name: "Mexico", visitors: 940 },
  { id: "702", name: "Singapore", visitors: 880 },
  { id: "410", name: "South Korea", visitors: 760 },
  { id: "710", name: "South Africa", visitors: 410 },
  { id: "032", name: "Argentina", visitors: 380 },
];

export const liveCities = [
  { name: "San Francisco", lon: -122.4, lat: 37.8 },
  { name: "New York", lon: -74, lat: 40.7 },
  { name: "Toronto", lon: -79.4, lat: 43.7 },
  { name: "London", lon: -0.1, lat: 51.5 },
  { name: "Berlin", lon: 13.4, lat: 52.5 },
  { name: "Warsaw", lon: 21, lat: 52.2 },
  { name: "Bengaluru", lon: 77.6, lat: 13 },
  { name: "São Paulo", lon: -46.6, lat: -23.5 },
  { name: "Sydney", lon: 151.2, lat: -33.9 },
  { name: "Tokyo", lon: 139.7, lat: 35.7 },
];

export const LIVE_BASE = 184;

// Live visitors wander around the base value; tick is the live counter.
export function liveVisitors(tick: number) {
  const r = mulberry32(1000 + tick)();
  return LIVE_BASE + Math.round(Math.sin(tick / 3) * 14 + (r - 0.5) * 18);
}

export type Check = { label: string; detail: string; state: "pass" | "warn" | "fail" };

export const aiReadiness: { score: number; delta: number; checks: Check[] } = {
  score: 72,
  delta: 6,
  checks: [
    { label: "llms.txt", detail: "Found, lists 42 pages", state: "pass" },
    { label: "Structured data", detail: "JSON-LD on 88% of posts", state: "pass" },
    { label: "AI crawler rules", detail: "GPTBot allowed, ClaudeBot not set", state: "warn" },
    { label: "Heading structure", detail: "6 posts skip a level", state: "warn" },
    { label: "Image alt text", detail: "31 images missing alt", state: "fail" },
    { label: "Content freshness", detail: "Median age 4 months", state: "pass" },
  ],
};

export type Scheduled = {
  id: string;
  title: string;
  author: string;
  when: string; // ISO
  status: "scheduled" | "in-review" | "draft";
};

export const scheduled: Scheduled[] = [
  { id: "motion-ux", title: "Motion as a UX language", author: "Ada Nwosu", when: "2026-10-27T09:00:00Z", status: "scheduled" },
  { id: "editorial-flow", title: "An editorial flow that ships", author: "Mara Ilic", when: "2026-10-28T14:30:00Z", status: "in-review" },
  { id: "rsc-caching", title: "Caching with Server Components", author: "Leo Park", when: "2026-10-30T08:00:00Z", status: "draft" },
  { id: "ai-search", title: "Writing for AI search", author: "Ada Nwosu", when: "2026-11-02T10:00:00Z", status: "scheduled" },
];

export const publishingGoal = { done: 11, target: 16 };

// Sparkline shape per post, derived from its id so it stays stable.
export function sparkline(id: string, points = 14) {
  let seed = 0;
  for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
  const rand = mulberry32(seed);
  let v = 50;
  return Array.from({ length: points }, () => (v = Math.max(5, v + (rand() - 0.45) * 22)));
}
