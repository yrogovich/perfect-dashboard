import type { ReactNode } from "react";
import { StaggerItem } from "@/components/stagger";

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
  lift = false,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  lift?: boolean;
}) {
  return (
    <StaggerItem lift={lift} className={`flex flex-col rounded-card bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </StaggerItem>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
        up ? "bg-delta-up/10 text-delta-up" : "bg-delta-down/10 text-delta-down"
      }`}
    >
      <span aria-hidden>{up ? "↑" : "↓"}</span>
      <span className="sr-only">{up ? "up" : "down"}</span>
      {Math.abs(value)}
      {suffix}
    </span>
  );
}
