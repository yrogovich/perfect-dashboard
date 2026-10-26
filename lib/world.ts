import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";

export const MAP_W = 800;
export const MAP_H = 400;

const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const land = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;

// Some territories share an id (or have none); give each shape a unique, stable key.
export const shapes = land.features
  .filter((f) => f.properties.name !== "Antarctica")
  .map((f, i) => ({ key: `c${f.id ?? "x"}-${i}`, id: String(f.id), name: f.properties.name, feature: f }));

export const projection = geoEqualEarth().fitSize([MAP_W, MAP_H], { type: "FeatureCollection", features: shapes.map((s) => s.feature) });
// Whole-pixel coordinates are invisible at this size and cut the markup by ~40%.
const path = geoPath(projection).digits(0);

// Standalone sprite: one <symbol> per country, referenced by <use> so the
// geometry is a cached file instead of page markup.
export function worldSprite() {
  const symbols = shapes
    .map((s) => `<symbol id="${s.key}" viewBox="0 0 ${MAP_W} ${MAP_H}"><path d="${path(s.feature)}"/></symbol>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
}
