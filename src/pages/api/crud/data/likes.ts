import verifyAnonToken from "@/lib/blogs/verifyAnonKey";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

const SECRET = process.env.ANON_SECRET || import.meta.env.ANON_SECRET;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { data } = await supabase.auth.getUser();

    let userId = data.user?.id;
    const postId = body.post;
    const type = body.type;

    if (!postId)
      return new Response(JSON.stringify({ error: "Missing post ID" }), {
        status: 400,
      });
    if (type !== "like" && type !== "dislike")
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
      });

    if (!userId) {
      const anonToken = cookies.get("anon_id")?.value;
      const { valid, anonId } = verifyAnonToken(anonToken || "", SECRET);
      if (!valid || !anonId)
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      userId = `${anonId}`;
    }

    const { data: existingData, error: selectError } = await supabase
      .from("likes")
      .select("*")
      .eq("post", postId)
      .eq("user", userId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
      });
    }

    if (existingData) {
      if (existingData.type === type) {
        return new Response(JSON.stringify({ message: `Already ${type}` }), {
          status: 200,
        });
      } else {
        const { error: updateError } = await supabase
          .from("likes")
          .update({ type })
          .eq("post", postId)
          .eq("user", userId);

        if (updateError)
          return new Response(
            JSON.stringify({ error: "Failed to update reaction" }),
            { status: 500 }
          );

        return new Response(
          JSON.stringify({
            message: `${type} updated successfully`,
            post: postId,
            user: userId,
          }),
          { status: 200 }
        );
      }
    }

    const { error: insertError } = await supabase
      .from("likes")
      .insert([{ post: postId, user: userId, type }]);
    if (insertError)
      return new Response(
        JSON.stringify({ error: "Failed to record reaction" }),
        { status: 500 }
      );

    return new Response(
      JSON.stringify({
        message: `${type} recorded successfully`,
        post: postId,
        user: userId,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
