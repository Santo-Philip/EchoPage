import type { DraftContent } from "@/lib/blogs/saveToDatabase";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const PATCH: APIRoute = async ({ request, params }) => {
  const blogId = params.id;

  if (!blogId) {
    return new Response(JSON.stringify({ error: "Blog ID missing" }), { status: 400 });
  }

  let data: DraftContent;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("draft")
      .update(data)
      .eq("id", blogId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Draft updated successfully" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
