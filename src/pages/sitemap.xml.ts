import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const { data: posts } = await supabase.from('draft').select('*').eq('status', 'public').order('updated_at', { ascending: false }).limit(1000);
  const site = import.meta.env.SITE 

  const urls = posts?.map(
      (p) =>
        `<url><loc>${site}/b/${p.category}/${p.slug}</loc></url>`
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
};
