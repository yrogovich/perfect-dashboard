import { PageTransition } from "@/components/page-transition";
import { Stagger } from "@/components/stagger";
import { OverviewMetrics } from "@/components/overview/overview-metrics";
import { AiReadiness } from "@/components/overview/ai-readiness";
import { TrafficMap } from "@/components/overview/traffic-map";
import { PublishCard, ScheduledPosts } from "@/components/overview/scheduled-posts";
import { WebVitals } from "@/components/overview/web-vitals";
import { TopPosts } from "@/components/overview/top-posts";
import { getPageSpeed } from "@/lib/pagespeed";

const PSI_URL = process.env.PSI_URL ?? "https://payloadcms.com";

export default function OverviewPage() {
  const pageSpeed = getPageSpeed(PSI_URL);
  return (
    <PageTransition>
      <Stagger className="grid grid-cols-12 gap-4 2xl:gap-6">
        {/* Title row, 4 KPIs, traffic chart */}
        <OverviewMetrics />
        <AiReadiness />
        <TrafficMap />
        <div className="col-span-12 grid grid-cols-12 content-start gap-4 xl:col-span-4 2xl:gap-6">
          <PublishCard />
          <ScheduledPosts />
        </div>
        <WebVitals url={PSI_URL} result={pageSpeed} />
        <TopPosts />
      </Stagger>
    </PageTransition>
  );
}
