import aiClient from "@/lib/aiClient";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.formData();
  console.log("Received body:", body);
  if (!body.get("prompt")) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
  }
  const response = await aiClient({
    prompt: body.get("prompt") as string || 'Hello',
    system: 'Helping assistant',
  });
  return new Response(JSON.stringify({ response }), { status: 200 });
};
