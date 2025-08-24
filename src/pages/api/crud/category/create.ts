import { slugify } from "@/lib/blogs/slug";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const emails: string[] = import.meta.env.EMAIL.split(",");
  const formData = await request.formData();
  const category = formData.get("category");
  const desc = formData.get("desc");
  const icon = formData.get("icon");
  const user = await supabase.auth.getUser();
  const email = user.data.user?.email;

  if (!email || !emails.includes(email)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!category || !desc || !icon) {
    return new Response(
      JSON.stringify({
        error: "Please fill out all fields and select an icon.",
      }),
      { status: 400 }
    );
  }
  try {
    const slug = slugify(category.toString());
    const { error } = await supabase
      .from("categories")
      .insert({ title: category,    description : desc, icon, slug });
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          })
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {}
  return new Response(JSON.stringify({ error: "Something went wrong" }), {
    status: 500,
  });
};
