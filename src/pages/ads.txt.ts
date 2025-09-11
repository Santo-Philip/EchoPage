import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const pubId = import.meta.env.ADSENSE_ID;

  if (!pubId) {
    return new Response("Error: AdSense Pub ID not set", { status: 500 });
  }
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
