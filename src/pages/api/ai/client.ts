import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const api = import.meta.env.AI_API;
  const key = import.meta.env.AI_API_KEY;
  if (!api || !key) {
    return new Response(JSON.stringify({ error: "Missing API configuration" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({'api': api, 'key': key}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
