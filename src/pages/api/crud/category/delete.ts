import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
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