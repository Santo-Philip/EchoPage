import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const { data: posts, error } = await supabase
    .from("draft")
    .select("slug, category, updated_at")
    .eq("status", "public")
    .order("updated_at", { ascending: false })
    .limit(1000);

  if (error) {
    return new Response("Error fetching posts", { status: 500 });
  }

  const site = import.meta.env.SITE || "https://your-domain.com";

  const urls = (posts || [])
    .map(
      (p) => `
        <url>
          <loc>${site}/b/${encodeURIComponent(p.category)}/${encodeURIComponent(p.slug)}</loc>
          <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
        </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
