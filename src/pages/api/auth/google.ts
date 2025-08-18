import { supabase } from "../../../lib/supabase";
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ cookies, redirect, request }) => {
   const url = new URL(request.url);
   const origin = `${url.protocol}//${url.host}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      queryParams: { prompt: 'select_account' },
    },
    
  })
console.log(data)
  if (error) throw error

  return redirect(data.url) 
}
