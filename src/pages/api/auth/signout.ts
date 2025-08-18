import { supabase } from "@/lib/supabase";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  supabase.auth.signOut()
  return redirect("/");
};