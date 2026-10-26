"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { DayPoint } from "@/lib/mock";

const config = {
  views: { label: "Page views", color: "var(--chart-1)" },
  visitors: { label: "Visitors", color: "var(--chart-2)" },
} satisfies ChartConfig;

const shortDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function TrafficChart({ data }: { data: DayPoint[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }} accessibilityLayer>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={shortDate}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : String(v))}
        />
        <ChartTooltip cursor={{ strokeWidth: 1 }} content={<ChartTooltipContent indicator="line" labelFormatter={(l) => shortDate(String(l))} />} />
        <Area dataKey="views" type="monotone" stroke="var(--color-views)" strokeWidth={2} fill="var(--color-views)" fillOpacity={0.12} animationDuration={900} />
        <Area dataKey="visitors" type="monotone" stroke="var(--color-visitors)" strokeWidth={2} fill="var(--color-visitors)" fillOpacity={0.1} animationDuration={900} />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
