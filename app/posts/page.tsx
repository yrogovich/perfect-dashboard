import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { Stagger, StaggerItem } from "@/components/stagger";
import { PostCover, PostTitle } from "@/components/post-cover";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <PageTransition>
      <h1 className="mb-6 text-[40px] leading-[44px] font-semibold tracking-[-0.02em]">Content</h1>
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <StaggerItem key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              transitionTypes={["nav-forward"]}
              className="block rounded-card bg-card p-3 shadow-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PostCover post={post} className="aspect-[16/9]" />
              <div className="px-2 pb-1 pt-3">
                <PostTitle post={post} className="font-semibold" />
                <p className="text-sm text-muted-foreground">
                  {post.author} · {post.status}
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </PageTransition>
  );
}
