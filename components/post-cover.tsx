import { ViewTransition } from "react";
import type { Post } from "@/lib/posts";

// Same `name` on the grid card and the detail hero makes the browser morph between them.
export function PostCover({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <ViewTransition name={`post-cover-${post.id}`} share="morph" default="none">
      <div
        className={`rounded-inner ${className}`}
        style={{
          background: `linear-gradient(135deg, oklch(0.78 0.14 ${post.hue}), oklch(0.6 0.18 ${post.hue + 40}))`,
        }}
      />
    </ViewTransition>
  );
}

export function PostTitle({ post, className = "", as: Tag = "h2" }: { post: Post; className?: string; as?: "h1" | "h2" | "p" }) {
  return (
    <ViewTransition name={`post-title-${post.id}`} share="morph" default="none">
      <Tag className={`w-fit max-w-full ${className}`}>{post.title}</Tag>
    </ViewTransition>
  );
}
