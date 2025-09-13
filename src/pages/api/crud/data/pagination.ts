import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);
  const status = url.searchParams.get("status") || "public";
  const category = url.searchParams.get("category") || "";
  const type = url.searchParams.get("type") || "";
  const now = new Date().toISOString();
  const offset = (page - 1) * perPage;

  const email: string[] = import.meta.env.EMAIL.split(",");
  const user = await supabase.auth.getUser();

  if (status !== "public" && (!user.data.user || !email.includes(user.data.user.email || ''))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let query = supabase
    .from("draft")
    .select("*", { count: "exact" })
    .eq("status", status)
    .order("created_at", { ascending: false })
    .or(`schedule.lte.${now},schedule.is.null`)
    .range(offset, offset + perPage - 1);

  if (category) query = query.eq("category", category);
  if (type) query = query.eq("type", type);

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ data, page, perPage }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
