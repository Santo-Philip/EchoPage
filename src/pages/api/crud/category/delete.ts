import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
     const origin = new URL(request.url).origin;

  if (origin !== import.meta.env.SITE) {
    return new Response(JSON.stringify({ error: "Invalid request origin" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
        return new Response(JSON.stringify({ error: "Invalid ID" }), {
            status: 400,
        });
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
        return redirect("/a/category?delete=false");
    }

    return redirect("/a/category?delete=true");
}