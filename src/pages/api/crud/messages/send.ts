
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const mail = formData.get("email");
  const msg = formData.get("message");

  if (!name || !mail || !msg) {
    return new Response(
      JSON.stringify({
        error: "Please fill out all fields ",
      }),
      { status: 400 }
    );
  }
  try {
    const { error } = await supabase
      .from("messages")
      .insert({ name, email : mail,msg});
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          })
    }
    return redirect("/contact?success=true");
  } catch (error) {}
  return redirect("/contact?error=true")
};
