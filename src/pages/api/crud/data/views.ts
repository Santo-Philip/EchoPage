import verifyAnonToken from "@/lib/blogs/verifyAnonKey";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

const SECRET = process.env.ANON_SECRET || import.meta.env.ANON_SECRET;

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { data } = await supabase.auth.getUser();
  let userId = data.user?.id;
  const post = body.post;

  if (!post) return new Response("Missing post content", { status: 400 });

  if (!userId) {
    const anonToken = cookies.get("anon_id")?.value;
    const { valid, anonId } = verifyAnonToken(anonToken || "", SECRET);
    userId = `${anonId}`;
  }

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const alreadyExists = await supabase.from("views").select("*").eq("post", post).eq("id", userId).single();

  if (alreadyExists.data) {
    return new Response("View already exists", { status: 409 });
  }

  const { error } = await supabase.from("views").insert([{ post, id: userId }]);

  if (error) {
    return new Response("Failed to create view", { status: 500 });
  }

  return new Response(
    JSON.stringify({ message: "View recorded successfully" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
