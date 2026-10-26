import { worldSprite } from "@/lib/world";

// Prerendered at build; browsers cache it like any static asset.
export function GET() {
  return new Response(worldSprite(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
