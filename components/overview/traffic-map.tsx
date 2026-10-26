import { countries, liveCities } from "@/lib/mock";
import { MAP_H as H, MAP_W as W, projection, shapes } from "@/lib/world";
import { MapHover } from "./map-hover";
import { Panel } from "./panel";

// Geometry lives in /world.svg (cached); the page only carries one <use> per
// country, which still takes its fill from the theme's CSS variables.
const SPRITE = "/world.svg";

const byId = new Map(countries.map((c) => [c.id, c]));
const max = Math.max(...countries.map((c) => c.visitors));
// Five sequential steps on a square-root scale so mid-sized markets stay visible.
const step = (v: number) => Math.min(5, Math.max(1, Math.ceil(Math.sqrt(v / max) * 5)));
const fmt = (n: number) => n.toLocaleString("en-US");

export function TrafficMap() {
  const top = countries.slice(0, 5);

  return (
    <Panel
      title="Visitors by country"
      subtitle="Last 30 days · dots are visitors online now"
      className="col-span-12 xl:col-span-8"
    >
      <div className="grid flex-1 items-center gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
        <MapHover>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="World map of visitors by country. The list beside it has the same top countries.">
            <g strokeWidth={0.5} stroke="var(--card)">
              {shapes.map((s) => {
                const c = byId.get(s.id);
                return (
                  <use
                    key={s.key}
                    href={`${SPRITE}#${s.key}`}
                    width={W}
                    height={H}
                    data-name={s.name}
                    data-value={c ? fmt(c.visitors) : undefined}
                    style={{ fill: `var(--seq-${c ? step(c.visitors) : 0})` }}
                    className="transition-opacity hover:opacity-80"
                  />
                );
              })}
            </g>
            <g>
              {liveCities.map((city, i) => {
                const [x, y] = projection([city.lon, city.lat])!;
                return (
                  <g key={city.name} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} pointerEvents="none">
                    {/* Ink, not ember: ember dots vanish on the ember country ramp. */}
                    <circle r={4} className="ping" fill="var(--foreground)" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} />
                    <circle r={3.5} fill="var(--foreground)" stroke="var(--card)" strokeWidth={1.5} />
                  </g>
                );
              })}
            </g>
          </svg>
        </MapHover>

        <div>
          <h3 className="mb-3 text-xs font-medium text-muted-foreground">Top countries</h3>
          <ol className="flex flex-col gap-3">
            {top.map((c) => (
              <li key={c.id} className="text-sm">
                <div className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="tabular-nums text-muted-foreground">{fmt(c.visitors)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full origin-left rounded-full bg-chart-1"
                    style={{ transform: `scaleX(${c.visitors / top[0].visitors})` }}
                  />
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground" aria-hidden>
            Fewer
            <span className="flex flex-1 overflow-hidden rounded-full">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="h-2 flex-1" style={{ background: `var(--seq-${s})` }} />
              ))}
            </span>
            More
          </div>
        </div>
      </div>
    </Panel>
  );
}
