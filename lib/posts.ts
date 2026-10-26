export type Post = {
  id: string;
  title: string;
  author: string;
  status: "published" | "draft" | "scheduled";
  views: number;
  readTime: number;
  hue: number;
};

export const posts: Post[] = [
  { id: "design-tokens", title: "Design tokens that scale", author: "Mara Ilic", status: "published", views: 48210, readTime: 6, hue: 18 },
  { id: "headless-cms", title: "Why we went headless", author: "Leo Park", status: "published", views: 31877, readTime: 8, hue: 262 },
  { id: "motion-ux", title: "Motion as a UX language", author: "Ada Nwosu", status: "scheduled", views: 0, readTime: 5, hue: 330 },
  { id: "core-web-vitals", title: "Core Web Vitals in 2026", author: "Leo Park", status: "published", views: 27540, readTime: 11, hue: 200 },
  { id: "editorial-flow", title: "An editorial flow that ships", author: "Mara Ilic", status: "draft", views: 0, readTime: 4, hue: 150 },
  { id: "image-pipeline", title: "Our image pipeline", author: "Ada Nwosu", status: "published", views: 19032, readTime: 7, hue: 45 },
];

export function getPost(id: string) {
  return posts.find((p) => p.id === id);
}
