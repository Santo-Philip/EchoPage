import verifyAnonToken from "@/lib/blogs/verifyAnonKey";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies }) => {
 const url = new URL(request.url);       // <-- get full URL
  const id = url.searchParams.get("id");
  const SECRET = process.env.ANON_SECRET || import.meta.env.ANON_SECRET;

  const user = await supabase.auth.getUser();
  let userId = user?.data.user?.id;

  if (!userId) {
    const value = cookies.get("anon_id")?.value;
    const { valid, anonId } = verifyAnonToken(value || "", SECRET);
    userId = anonId;
  }

  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post", id)
    .eq("user", userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ likes: data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
    