import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const api = import.meta.env.AI_API;
  const key = import.meta.env.AI_API_KEY;
  const site = import.meta.env.SITE;

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  if (request.url.startsWith(site)) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!api || !key ) {
    return new Response(JSON.stringify({ error: "Missing API configuration" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ api, key, site }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
