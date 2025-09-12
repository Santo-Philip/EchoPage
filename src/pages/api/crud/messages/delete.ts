import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({request, redirect}) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const emails: string[] = import.meta.env.EMAIL.split(",");
    const user = await supabase.auth.getUser();
    const email = user.data.user?.email;

    if (user.error || !email || !emails.includes(email)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }
    if(!id) {
        return new Response(JSON.stringify({ error: "ID missing" }), {
            status: 400,
          })
    }
    try {
        const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
              })
        }
        return redirect("/a/messages?success=Your message has been deleted");
    } catch (error) {}
    return redirect("/a/messages?error=Failed to delete your message");
}