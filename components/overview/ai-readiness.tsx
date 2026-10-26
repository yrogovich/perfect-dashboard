import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { aiReadiness, type Check } from "@/lib/mock";
import { Gauge } from "./gauge";
import { Delta, Panel } from "./panel";

// Status is carried by icon + label, never by color alone.
const stateIcon: Record<Check["state"], { icon: typeof CircleCheck; className: string; label: string }> = {
  pass: { icon: CircleCheck, className: "text-status-good", label: "Pass" },
  warn: { icon: CircleAlert, className: "text-status-warning", label: "Needs work" },
  fail: { icon: CircleX, className: "text-status-critical", label: "Failing" },
};

export function AiReadiness() {
  const { score, delta, checks } = aiReadiness;
  return (
    <Panel title="AI readiness" subtitle="How well AI search and assistants can read your site" className="col-span-12 md:col-span-6 xl:col-span-4">
      <div className="relative mx-auto -mb-2 w-full max-w-[240px]">
        <Gauge value={score} label="AI readiness score" />
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
          <span className="text-[32px] leading-9 font-semibold tracking-tight">
            <CountUp value={score} />
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            of 100 <Delta value={delta} suffix="" />
          </span>
        </div>
      </div>
      <ul className="mt-5 flex flex-col divide-y divide-border">
        {checks.map((check) => {
          const s = stateIcon[check.state];
          return (
            <li key={check.label} className="flex items-center gap-3 py-2 text-sm">
              <s.icon className={`size-4 shrink-0 ${s.className}`} aria-label={s.label} />
              <span className="shrink-0 font-medium whitespace-nowrap">{check.label}</span>
              <span className="ml-auto truncate text-xs text-muted-foreground">{check.detail}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
