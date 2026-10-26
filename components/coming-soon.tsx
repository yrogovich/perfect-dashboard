import type { LucideIcon } from "lucide-react";
import { PageTransition } from "@/components/page-transition";

// Stand-in for pages built in step 4, so sidebar navigation can be tried end to end.
export function ComingSoon({ title, blurb, icon: Icon }: { title: string; blurb: string; icon: LucideIcon }) {
  return (
    <PageTransition>
      <h1 className="text-[40px] leading-[44px] font-semibold tracking-[-0.02em]">{title}</h1>
      <div className="mt-6 flex flex-col items-center rounded-card bg-card px-6 py-20 text-center shadow-card">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-6" aria-hidden />
        </span>
        <p className="mt-4 font-semibold">{title} is next</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{blurb}</p>
      </div>
    </PageTransition>
  );
}
