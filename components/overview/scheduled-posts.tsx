import { ArrowRight, PenLine } from "lucide-react";
import { AppLink } from "@/components/app-link";
import { publishingGoal, scheduled, type Scheduled } from "@/lib/mock";
import { Panel } from "./panel";

const status: Record<Scheduled["status"], { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-chart-2/12 text-chart-2" },
  "in-review": { label: "In review", className: "bg-chart-4/12 text-chart-4" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
};

// Fixed locale and time zone so server and client render the same text.
const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
const date = (iso: string) => new Date(iso).toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" });
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

export function PublishCard() {
  const { done, target } = publishingGoal;
  return (
    <Panel lift className="col-span-12 bg-primary! text-primary-foreground md:col-span-6 xl:col-span-12">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-85">Publishing goal · October</p>
          <p className="mt-1 text-[32px] leading-9 font-semibold tracking-tight">
            {done}
            <span className="text-lg opacity-75"> / {target} posts</span>
          </p>
        </div>
        <AppLink
          href="/posts"
          transitionTypes={["nav-forward"]}
          className="flex items-center gap-1.5 rounded-full bg-primary-foreground px-3.5 py-2 text-sm font-medium text-primary outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <PenLine className="size-4" aria-hidden />
          New post
        </AppLink>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary-foreground/25" role="progressbar" aria-valuenow={done} aria-valuemax={target} aria-label="Posts published this month">
        <div className="h-full origin-left rounded-full bg-primary-foreground" style={{ transform: `scaleX(${done / target})` }} />
      </div>
      <p className="mt-2 text-xs opacity-85">{target - done} to go · 3 drafts waiting for review</p>
    </Panel>
  );
}

export function ScheduledPosts() {
  return (
    <Panel
      title="Up next"
      subtitle="Scheduled and in-progress posts"
      action={
        <AppLink href="/calendar" transitionTypes={["nav-forward"]} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          Calendar <ArrowRight className="size-3.5" aria-hidden />
        </AppLink>
      }
      className="col-span-12 md:col-span-6 xl:col-span-12"
    >
      <ul className="flex flex-col gap-1">
        {scheduled.map((post) => (
          <li key={post.id} className="flex items-center gap-3 rounded-inner p-2 transition-colors hover:bg-accent">
            <div className="grid w-11 shrink-0 place-items-center rounded-xl bg-muted py-1.5 text-center leading-none">
              <span className="text-[10px] font-medium text-muted-foreground uppercase">{day(post.when)}</span>
              <span className="mt-0.5 text-base font-semibold">{date(post.when)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{post.title}</p>
              <p className="text-xs text-muted-foreground">
                {post.author} · {time(post.when)} UTC
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status[post.status].className}`}>
              {status[post.status].label}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
