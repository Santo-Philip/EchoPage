import { extractBucketAndPath } from "@/lib/bucketPathExtractor";
import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();
    const result = extractBucketAndPath(url);
    if (!result) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
      });
    }
    const { bucket, path } = result;
    const decodedPath = decodeURIComponent(path);
    const { error } = await supabase.storage.from(bucket).remove([decodedPath]);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, bucket, path }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Something went wrong" }),
      { status: 500 }
    );
  }
};
