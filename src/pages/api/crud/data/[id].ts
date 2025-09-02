import type { DraftContent } from "@/lib/blogs/saveToDatabase";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const PATCH: APIRoute = async ({ request, params }) => {
  const blogId = params.id;
  const email: string[] = import.meta.env.EMAIL.split(",");

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  // Allow only users from env to post, according to email
  // if (!email.includes(user.data.user.email)) {
  //   return new Response(JSON.stringify({ error: "Not Allowed" }), { status: 401 })
  // }
  const { data: existing, error: existingDataerror } = await supabase
    .from("draft")
    .select("*")
    .eq("id", blogId);

  if (existingDataerror) {
    console.log(existingDataerror);
    return new Response(JSON.stringify({ error: existingDataerror.message }), {
      status: 500,
    });
  }

  if (existing.length === 0) {
    console.log(existing);
    return new Response(JSON.stringify({ error: "Blog not found" }), {
      status: 404,
    });
  }
  if (existing[0].author !== user.data.user.id) {
    return new Response(JSON.stringify({ error: "Not Allowed" }), {
      status: 401,
    });
  }

  if (!blogId) {
    return new Response(JSON.stringify({ error: "Blog ID missing" }), {
      status: 400,
    });
  }

  let data: DraftContent;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
    });
  }
  if (
    data.status === "public" || data.status === "reject" &&
    !email.includes(user.data.user.email || "")
  ) {
    return new Response(JSON.stringify({ error: "Not Allowed to publish" }), {
      status: 401,
    });
  }

  try {
    const { error } = await supabase
      .from("draft")
      .update(data)
      .eq("id", blogId);
    if (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ message: "Draft updated successfully" }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
