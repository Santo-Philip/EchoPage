import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
      const email: string[] = import.meta.env.EMAIL.split(",");
      const user = await supabase.auth.getUser();
      if (!user.data.user || !email.includes(user.data.user.email || '')) {
          return redirect("/dashboard");
      }
      const data = await request.formData();
      const id = data.get("id");
      const status = data.get("status");

      if (!id || !status) {
          return new Response(JSON.stringify({ error: "Missing fields" }), {
              status: 400,
          });
      }

      const { error } = await supabase
          .from("draft")
          .update({ status })
          .eq("id", id);

      if (error) {
          return redirect(`/a/review?error=${error.message}`)
      }

      return redirect(`/a/review?success=This post has been published`)
}