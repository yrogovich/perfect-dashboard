import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { PostCover, PostTitle } from "@/components/post-cover";
import { CountUp } from "@/components/count-up";
import { getPost, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) notFound();

  return (
    <PageTransition>
      <Link href="/posts" transitionTypes={["nav-back"]} className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Content
      </Link>
      <PostCover post={post} className="aspect-[21/9] w-full" />
      <PostTitle post={post} as="h1" className="mt-6 text-[40px] leading-[44px] font-semibold tracking-[-0.02em]" />
      <p className="mt-2 text-muted-foreground">
        {post.author} · {post.readTime} min read · <CountUp value={post.views} /> views
      </p>
    </PageTransition>
  );
}
