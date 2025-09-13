import { collectImageUrls } from "@/lib/editor/getImages";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
  const origin = new URL(request.url).origin;

    if (origin !== import.meta.env.SITE) {
      return new Response(JSON.stringify({ error: "Invalid request origin" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

  const email: string[] = import.meta.env.EMAIL.split(",");
  const user = await supabase.auth.getUser();
  if (!user.data.user || !email.includes(user.data.user.email || "")) {
    return redirect("/dashboard");
  }

  const body = await request.json();
  const { id } = body;
  const STORAGE_PREFIX = `${
    import.meta.env.SUPABASE_URL
  }/storage/v1/object/public/images/`;
  const allImagePaths: string[] = [];

  const { data, error } = await supabase
    .from("draft")
    .select("*")
    .eq("id", id.id)
    .single();

  if (error || !data) {
    console.error("Error fetching draft:", error);
    return new Response(JSON.stringify({ error: "Draft not found" }), {
      status: 404,
    });
  }

  const content = JSON.parse(data.content_json);
  const images = collectImageUrls(content);
  for (const img of images) {
    const path = img.startsWith(STORAGE_PREFIX)
      ? img.slice(STORAGE_PREFIX.length)
      : img;
    allImagePaths.push(decodeURIComponent(path));
  }

  if (data.thumb) {
    const thumbPath = data.thumb.startsWith(STORAGE_PREFIX)
      ? data.thumb.slice(STORAGE_PREFIX.length)
      : data.thumb;
    allImagePaths.push(decodeURIComponent(thumbPath));
  }

    if (allImagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("images")
      .remove(allImagePaths);

    if (storageError) {
      console.error("Error removing images from storage:", storageError);
    } else {
      console.log("Deleted images:", allImagePaths);
    }
  }

  const { error: viewsError } = await supabase
    .from("views")
    .delete()
    .eq("post", id.id);

  const { error: likeError } = await supabase
    .from("likes")
    .delete()
    .eq("post", id.id);
  if (viewsError) console.error("Error deleting views:", viewsError);
  if (likeError) console.error("Error deleting likes:", likeError);

  const { error: deleteError } = await supabase
    .from("draft")
    .delete()
    .eq("id", id.id);

  if (deleteError) {
    console.error("Error deleting draft:", deleteError);
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 400,
    });
  }

  return redirect(`${origin}/a/review`);
};
