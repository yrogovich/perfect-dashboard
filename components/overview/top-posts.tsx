import { AppLink } from "@/components/app-link";
import { PostTitle } from "@/components/post-cover";
import { posts } from "@/lib/posts";
import { sparkline } from "@/lib/mock";
import { Panel } from "./panel";

function Sparkline({ id }: { id: string }) {
  const values = sparkline(id);
  const max = Math.max(...values);
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 80},${24 - (v / max) * 22}`).join(" ");
  return (
    <svg viewBox="0 0 80 26" className="h-6 w-20 shrink-0" aria-hidden>
      <polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function TopPosts() {
  const top = posts
    .filter((p) => p.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <Panel title="Top posts" subtitle="By page views, last 30 days · trend over 14 days" className="col-span-12 xl:col-span-5">
      <ol className="flex flex-col gap-1">
        {top.map((post, i) => (
          <li key={post.id}>
            <AppLink
              href={`/posts/${post.id}`}
              transitionTypes={["nav-forward"]}
              className="flex items-center gap-3 rounded-inner p-2 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="w-5 text-sm font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <PostTitle post={post} as="p" className="truncate text-sm font-medium" />
                <p className="text-xs text-muted-foreground">{post.author}</p>
              </div>
              <Sparkline id={post.id} />
              <span className="w-16 text-right text-sm font-medium tabular-nums">{post.views.toLocaleString("en-US")}</span>
            </AppLink>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
